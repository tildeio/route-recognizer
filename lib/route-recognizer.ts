import { createMap } from "./route-recognizer/util";
import map, { Delegate, Route, Opaque, MatchDSL } from "./route-recognizer/dsl";
import { normalizePath, normalizeSegment, encodePathSegment } from "./route-recognizer/normalizer";

const enum CHARS {
  ANY = -1,
  STAR = 42,
  SLASH = 47,
  COLON = 58
}

const escapeRegex = /(\/|\.|\*|\+|\?|\||\(|\)|\[|\]|\{|\}|\\)/g;

const isArray = Array.isArray;
const hasOwnProperty = Object.prototype.hasOwnProperty;

function getParam(params: Params | null | undefined, key: string): string {
  if (typeof params !== "object" || params === null) {
    throw new Error("You must pass an object as the second argument to `generate`.");
  }

  if (!hasOwnProperty.call(params, key)) {
    throw new Error("You must provide param `" + key + "` to `generate`.");
  }

  let value = params[key];
  let str = typeof value === "string" ? value : "" + value;
  if (str.length === 0) {
    throw new Error("You must provide a param `" + key + "`.");
  }
  return str;
}

const enum SegmentType {
  Static  = 0,
  Dynamic = 1,
  Star    = 2,
  Epsilon = 4
}

const enum SegmentFlags {
  Static  = 2 << SegmentType.Static,
  Dynamic = 2 << SegmentType.Dynamic,
  Star    = 2 << SegmentType.Star,
  Epsilon = 2 << SegmentType.Epsilon,
  Named = Dynamic | Star,
  Decoded = Dynamic,
  Counted = Static | Dynamic | Star
}

const eachChar: ((segment: Segment, currentState: State) => State)[] = [];
eachChar[SegmentType.Static] = function (segment: Segment, currentState: State) {
  let state = currentState;
  let value = segment.value;
  for (let i = 0; i < value.length; i++) {
    let ch = value.charCodeAt(i);
    state = state.put(ch, false, false);
  }
  return state;
};
eachChar[SegmentType.Dynamic] = function (_: Segment, currentState: State) {
  return currentState.put(CHARS.SLASH, true, true);
};
eachChar[SegmentType.Star] = function (_: Segment, currentState: State) {
  return currentState.put(CHARS.ANY, false, true);
};
eachChar[SegmentType.Epsilon] = function (_: Segment, currentState: State) {
  return currentState;
};

const regex: ((segment: Segment) => string)[] = [];
regex[SegmentType.Static] = function (segment: Segment) {
  return segment.value.replace(escapeRegex, "\\$1");
};
regex[SegmentType.Dynamic] = function () {
  return "([^/]+)";
};
regex[SegmentType.Star] = function () {
  return "(.+)";
};
regex[SegmentType.Epsilon] = function () {
  return "";
};

const generate: ((segment: Segment, params?: Params | null) => string)[] = [];
generate[SegmentType.Static] = function (segment: Segment) {
  return segment.value;
};
generate[SegmentType.Dynamic] = function (segment: Segment, params?: Params) {
  let value = getParam(params, segment.value);
  if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS) {
    return encodePathSegment(value);
  } else {
    return value;
  }
};
generate[SegmentType.Star] = function (segment: Segment, params?: Params) {
  return getParam(params, segment.value);
};
generate[SegmentType.Epsilon] = function () {
  return "";
};

// A Segment represents a segment in the original route description.
// Each Segment type provides an `eachChar` and `regex` method.
//
// The `eachChar` method invokes the callback with one or more character
// specifications. A character specification consumes one or more input
// characters.
//
// The `regex` method returns a regex fragment for the segment. If the
// segment is a dynamic of star segment, the regex fragment also includes
// a capture.
//
// A character specification contains:
//
// * `validChars`: a String with a list of all valid characters, or
// * `invalidChars`: a String with a list of all invalid characters
// * `repeat`: true if the character specification can repeat
interface Segment {
  type: SegmentType;
  value: string;
}

export interface Params {
  [key: string]: Opaque;
  [key: number]: Opaque;
  queryParams?: QueryParams | null;
}

// The `names` will be populated with the paramter name for each dynamic/star
// segment. `shouldDecodes` will be populated with a boolean for each dyanamic/star
// segment, indicating whether it should be decoded during recognition.
function parse(segments: Segment[], route: string, names: string[], types: [number, number, number], shouldDecodes: boolean[]): void {
  // normalize route as not starting with a "/". Recognition will
  // also normalize.
  if (route.length > 0 && route.charCodeAt(0) === CHARS.SLASH) { route = route.substr(1); }

  let parts = route.split("/");

  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    let flags: SegmentFlags = 0;
    let type: SegmentType = 0;

    if (part === "") {
      type = SegmentType.Epsilon;
    } else if (part.charCodeAt(0) === CHARS.COLON) {
      type = SegmentType.Dynamic;
    } else if (part.charCodeAt(0) === CHARS.STAR) {
      type = SegmentType.Star;
    }  else {
      type = SegmentType.Static;
    }

    flags = 2 << type;

    if (flags & SegmentFlags.Named) {
      part = part.slice(1);
      names.push(part);
      shouldDecodes.push((flags & SegmentFlags.Decoded) !== 0);
    }

    if (flags & SegmentFlags.Counted) {
      types[type]++;
    }

    segments.push({ type, value: normalizeSegment(part) });
  }
}

function isEqualCharSpec(spec: CharSpec, char: number, negate: boolean) {
  return spec.char === char && spec.negate === negate;
}

interface Handler {
  handler: Opaque;
  names: string[];
  shouldDecodes: boolean[];
}

// A State has a character specification and (`charSpec`) and a list of possible
// subsequent states (`nextStates`).
//
// If a State is an accepting state, it will also have several additional
// properties:
//
// * `regex`: A regular expression that is used to extract parameters from paths
//   that reached this accepting state.
// * `handlers`: Information on how to convert the list of captures into calls
//   to registered handlers with the specified parameters
// * `types`: How many static, dynamic or star segments in this route. Used to
//   decide which route to use if multiple registered routes match a path.
//
// Currently, State is implemented naively by looping over `nextStates` and
// comparing a character specification against a character. A more efficient
// implementation would use a hash of keys pointing at one or more next states.
class State implements CharSpec {
  states: State[];
  id: number;
  negate: boolean;
  char: number;
  nextStates: number[] | number | null;
  pattern: string;
  _regex: RegExp | undefined;
  handlers: Handler[] | undefined;
  types: [number, number, number] | undefined;

  constructor(states: State[], id: number, char: number, negate: boolean, repeat: boolean) {
    this.states = states;
    this.id = id;
    this.char = char;
    this.negate = negate;
    this.nextStates = repeat ? id : null;
    this.pattern = "";
    this._regex = undefined;
    this.handlers = undefined;
    this.types = undefined;
  }

  regex(): RegExp {
    if (!this._regex) {
      this._regex = new RegExp(this.pattern);
    }
    return this._regex;
  }

  get(char: number, negate: boolean): State | void {
    let nextStates = this.nextStates;
    if (nextStates === null) return;
    if (isArray(nextStates)) {
      for (let i = 0; i < nextStates.length; i++) {
        let child = this.states[nextStates[i]];
        if (isEqualCharSpec(child, char, negate)) {
          return child;
        }
      }
    } else {
      let child = this.states[nextStates];
      if (isEqualCharSpec(child, char, negate)) {
        return child;
      }
    }
  }

  put(char: number, negate: boolean, repeat: boolean) {
    let state: State | void;

    // If the character specification already exists in a child of the current
    // state, just return that state.
    if (state = this.get(char, negate)) { return state; }

    // Make a new state for the character spec
    let states = this.states;
    state = new State(states, states.length, char, negate, repeat);
    states[states.length] = state;

    // Insert the new state as a child of the current state
    if (this.nextStates == null) {
      this.nextStates = state.id;
    } else if (isArray(this.nextStates)) {
      this.nextStates.push(state.id);
    } else {
      this.nextStates = [this.nextStates, state.id];
    }

    // Return the new state
    return state;
  }

  // Find a list of child states matching the next character
  match(ch: number): State[] {
    let nextStates = this.nextStates;
    if (!nextStates) return [];

    let returned: State[] = [];
    if (isArray(nextStates)) {
      for (let i = 0; i < nextStates.length; i++) {
        let child = this.states[nextStates[i]];

        if (isMatch(child, ch)) {
          returned.push(child);
        }
      }
    } else {
      let child = this.states[nextStates];
      if (isMatch(child, ch)) {
        returned.push(child);
      }
    }
    return returned;
  }
}

function isMatch(spec: CharSpec, char: number) {
  return spec.negate ? spec.char !== char && spec.char !== CHARS.ANY : spec.char === char || spec.char === CHARS.ANY;
}

// This is a somewhat naive strategy, but should work in a lot of cases
// A better strategy would properly resolve /posts/:id/new and /posts/edit/:id.
//
// This strategy generally prefers more static and less dynamic matching.
// Specifically, it
//
//  * prefers fewer stars to more, then
//  * prefers using stars for less of the match to more, then
//  * prefers fewer dynamic segments to more, then
//  * prefers more static segments to more
function sortSolutions(states: State[]) {
  return states.sort(function(a, b) {
    let [ astatics, adynamics, astars ] = a.types || [0, 0, 0];
    let [ bstatics, bdynamics, bstars ] = b.types || [0, 0, 0];
    if (astars !== bstars) { return astars - bstars; }

    if (astars) {
      if (astatics !== bstatics) { return bstatics - astatics; }
      if (adynamics !== bdynamics) { return bdynamics - adynamics; }
    }

    if (adynamics !== bdynamics) { return adynamics - bdynamics; }
    if (astatics !== bstatics) { return bstatics - astatics; }

    return 0;
  });
}

function recognizeChar(states: State[], ch: number) {
  let nextStates: State[] = [];

  for (let i = 0, l = states.length; i < l; i++) {
    let state = states[i];

    nextStates = nextStates.concat(state.match(ch));
  }

  return nextStates;
}


export interface QueryParams {
  [param: string]: any[] | any | null | undefined;
}

export interface Result {
  handler: Opaque;
  params: Params;
  isDynamic: boolean;
}

export interface Results extends ArrayLike<Result | undefined> {
  queryParams: QueryParams;
  slice(start?: number, end?: number): Result[];
  splice(start: number, deleteCount: number, ...items: Result[]): Result[];
  push(...results: Result[]): number;
}

class RecognizeResults implements Results {
  queryParams: QueryParams;
  length = 0;
  [index: number]: Result | undefined;
  splice: (start: number, deleteCount: number, ...items: Result[]) => Result[];
  slice: (start?: number, end?: number) => Result[];
  push: (...results: Result[]) => number;

  constructor(queryParams?: QueryParams) {
    this.queryParams = queryParams || {};
  }
};

RecognizeResults.prototype.splice = Array.prototype.splice;
RecognizeResults.prototype.slice =  Array.prototype.slice;
RecognizeResults.prototype.push = Array.prototype.push;

function findHandler(state: State, originalPath: string, queryParams: QueryParams): Results {
  let handlers = state.handlers;
  let regex: RegExp = state.regex();
  if (!regex || !handlers) throw new Error("state not initialized");
  let captures: RegExpMatchArray | null = originalPath.match(regex);
  let currentCapture = 1;
  let result = new RecognizeResults(queryParams);

  result.length = handlers.length;

  for (let i = 0; i < handlers.length; i++) {
    let handler = handlers[i];
    let names = handler.names;
    let shouldDecodes = handler.shouldDecodes;
    let params: Params = {};

    for (let j = 0; j < names.length; j++) {
      let name = names[j];
      let capture = captures && captures[currentCapture++];

      if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS && shouldDecodes[j]) {
        params[name] = capture && decodeURIComponent(capture);
      } else {
        params[name] = capture;
      }
    }

    result[i] = { handler: handler.handler, params: params, isDynamic: !!names.length };
  }

  return result;
}

function decodeQueryParamPart(part: string): string {
  // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
  part = part.replace(/\+/gm, "%20");
  let result;
  try {
    result = decodeURIComponent(part);
  } catch (error) {result = ""; }
  return result;
}

interface NamedRoute {
  segments: Segment[];
  handlers: Opaque[];
}

class RouteRecognizer {
  private states: State[];
  private rootState: State;
  private names: {
    [name: string]: NamedRoute | undefined;
  } = createMap<NamedRoute>();
  map: (context: (match: MatchDSL) => void, addCallback?: (router: this, routes: Route[]) => void) => void;
  delegate: Delegate | undefined;

  constructor() {
    let states: State[] = [];
    let state = new State(states, 0, CHARS.ANY, true, false);
    states[0] = state;
    this.states = states;
    this.rootState = state;
  }

  static VERSION = "VERSION_STRING_PLACEHOLDER";
  // Set to false to opt-out of encoding and decoding path segments.
  // See https://github.com/tildeio/route-recognizer/pull/55
  static ENCODE_AND_DECODE_PATH_SEGMENTS = true;
  static Normalizer = {
    normalizeSegment, normalizePath, encodePathSegment
  };

  add(routes: Route[], options?: { as: string }) {
    let currentState = this.rootState;
    let pattern = "^";
    let types: [number, number, number] = [0, 0, 0];
    let handlers: Handler[] = new Array(routes.length);
    let allSegments: Segment[] = [];

    let isEmpty = true;
    let j = 0;
    for (let i = 0; i < routes.length; i++) {
      let route = routes[i];
      let names: string[] = [];
      let shouldDecodes: boolean[] = [];

      parse(allSegments, route.path, names, types, shouldDecodes);

      for (; j < allSegments.length; j++) {
        let segment = allSegments[j];

        if (segment.type === SegmentType.Epsilon) { continue; }

        isEmpty = false;

        // Add a "/" for the new segment
        currentState = currentState.put(CHARS.SLASH, false, false);
        pattern += "/";

        // Add a representation of the segment to the NFA and regex
        currentState = eachChar[segment.type](segment, currentState);
        pattern += regex[segment.type](segment);
      }
      let handler = { handler: route.handler, names: names, shouldDecodes: shouldDecodes };
      handlers[i] = handler;
    }

    if (isEmpty) {
        currentState = currentState.put(CHARS.SLASH, false, false);
      pattern += "/";
    }

    currentState.handlers = handlers;
    currentState.pattern = pattern + "$";
    currentState.types = types;

    let name: string | undefined;
    if (typeof options === "object" && options !== null && options.as) {
      name = options.as;
    }

    if (name) {
      // if (this.names[name]) {
      //   throw new Error("You may not add a duplicate route named `" + name + "`.");
      // }

      this.names[name] = {
        segments: allSegments,
        handlers: handlers
      };
    }
  }

  handlersFor(name: string) {
    let route = this.names[name];

    if (!route) { throw new Error("There is no route named " + name); }

    let result = new Array(route.handlers.length);

    for (let i = 0; i < route.handlers.length; i++) {
      result[i] = route.handlers[i];
    }

    return result;
  }

  hasRoute(name: string) {
    return !!this.names[name];
  }

  generate(name: string, params?: Params | null) {
    let route = this.names[name];
    let output = "";
    if (!route) { throw new Error("There is no route named " + name); }

    let segments: Segment[] = route.segments;

    for (let i = 0; i < segments.length; i++) {
      let segment: Segment = segments[i];

      if (segment.type === SegmentType.Epsilon) {
        continue;
      }

      output += "/";
      output += generate[segment.type](segment, params);
    }

    if (output.charAt(0) !== "/") { output = "/" + output; }

    if (params && params.queryParams) {
      output += this.generateQueryString(params.queryParams);
    }

    return output;
  }

  generateQueryString(params: QueryParams) {
    let pairs: string[] = [];
    let keys: string[] = Object.keys(params);
    keys.sort();
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = params[key];
      if (value == null) {
        continue;
      }
      let pair = encodeURIComponent(key);
      if (isArray(value)) {
        for (let j = 0; j < value.length; j++) {
          let arrayPair = key + "[]" + "=" + encodeURIComponent(value[j]);
          pairs.push(arrayPair);
        }
      } else {
        pair += "=" + encodeURIComponent(value);
        pairs.push(pair);
      }
    }

    if (pairs.length === 0) { return ""; }

    return "?" + pairs.join("&");
  }

  parseQueryString(queryString: string): QueryParams {
    let pairs = queryString.split("&");
    let queryParams: QueryParams = {};
    for (let i = 0; i < pairs.length; i++) {
      let pair      = pairs[i].split("="),
          key       = decodeQueryParamPart(pair[0]),
          keyLength = key.length,
          isArray = false,
          value;
      if (pair.length === 1) {
        value = "true";
      } else {
        // Handle arrays
        if (keyLength > 2 && key.slice(keyLength - 2) === "[]") {
          isArray = true;
          key = key.slice(0, keyLength - 2);
          if (!queryParams[key]) {
            queryParams[key] = [];
          }
        }
        value = pair[1] ? decodeQueryParamPart(pair[1]) : "";
      }
      if (isArray) {
        (<string[]>queryParams[key]).push(value);
      } else {
        queryParams[key] = value;
      }
    }
    return queryParams;
  }

  recognize(path: string): Results | undefined {
    let results: Results | undefined;
    let states: State[] = [ this.rootState ];
    let queryParams = {};
    let isSlashDropped = false;
    let hashStart = path.indexOf("#");
    if (hashStart !== -1) {
      path = path.substr(0, hashStart);
    }

    let queryStart = path.indexOf("?");
    if (queryStart !== -1) {
      let queryString = path.substr(queryStart + 1, path.length);
      path = path.substr(0, queryStart);
      queryParams = this.parseQueryString(queryString);
    }

    if (path.charAt(0) !== "/") { path = "/" + path; }
    let originalPath = path;

    if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS) {
      path = normalizePath(path);
    } else {
      path = decodeURI(path);
      originalPath = decodeURI(originalPath);
    }

    let pathLen = path.length;
    if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
      path = path.substr(0, pathLen - 1);
      originalPath = originalPath.substr(0, originalPath.length - 1);
      isSlashDropped = true;
    }

    for (let i = 0; i < path.length; i++) {
      states = recognizeChar(states, path.charCodeAt(i));
      if (!states.length) { break; }
    }

    let solutions: State[] = [];
    for (let i = 0; i < states.length; i++) {
      if (states[i].handlers) { solutions.push(states[i]); }
    }

    states = sortSolutions(solutions);

    let state = solutions[0];

    if (state && state.handlers) {
      // if a trailing slash was dropped and a star segment is the last segment
      // specified, put the trailing slash back
      if (isSlashDropped && state.pattern && state.pattern.slice(-5) === "(.+)$") {
        originalPath = originalPath + "/";
      }
      results = findHandler(state, originalPath, queryParams);
    }

    return results;
  }
}

RouteRecognizer.prototype.map = map;

export default RouteRecognizer;

interface CharSpec {
  negate: boolean;
  char: number;
}
