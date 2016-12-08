import map, { Delegate, Route, MatchDSL } from "./route-recognizer/dsl";
import { normalizePath, normalizeSegment, encodePathSegment } from "./route-recognizer/normalizer";

const specials = [
  "/", ".", "*", "+", "?", "|",
  "(", ")", "[", "]", "{", "}", "\\"
];

const escapeRegex = new RegExp("(\\" + specials.join("|\\") + ")", "g");

const isArray = Array.isArray || function isArray(arg: any): arg is any[] {
  return Object.prototype.toString.call(arg) === "[object Array]";
};

function getParam(params: Params | null | undefined, key: string): string {
  if (typeof params !== "object" || params === null) {
    throw new Error("You must pass an object as the second argument to `generate`.");
  }

  if (!params.hasOwnProperty(key)) {
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
  Static,
  Dynamic,
  Star,
  Epsilon
}

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
class StaticSegment {
  type: SegmentType.Static;
  string: string;

  constructor(str: string) {
    this.string = normalizeSegment(str);
  }

  eachChar(currentState: State) {
    let str = this.string, ch;

    for (let i = 0; i < str.length; i++) {
      ch = str.charAt(i);
      currentState = currentState.put({ invalidChars: undefined, repeat: false, validChars: ch });
    }

    return currentState;
  }

  regex() {
    return this.string.replace(escapeRegex, "\\$1");
  }

  generate(_?: Params | null) {
    return this.string;
  }
}

class DynamicSegment {
  type: SegmentType.Dynamic;
  name: string;
  constructor(name: string) {
    this.name = normalizeSegment(name);
  }

  eachChar(currentState: State) {
    return currentState.put({ invalidChars: "/", repeat: true, validChars: undefined });
  }

  regex() {
    return "([^/]+)";
  }

  generate(params?: Params | null) {
    let value = getParam(params, this.name);
    if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS) {
      return encodePathSegment(value);
    } else {
      return value;
    }
  }
}

class StarSegment {
  type: SegmentType.Star;
  constructor(public name: string) {}

  eachChar(currentState: State) {
    return currentState.put({
      invalidChars: "",
      repeat: true,
      validChars: undefined
    });
  }

  regex() {
    return "(.+)";
  }

  generate(params?: Params | null): string {
    return getParam(params, this.name);
  }
}

class EpsilonSegment {
  type: SegmentType.Epsilon;
  eachChar(currentState: State) {
    return currentState;
  }
  regex(): string {
    return "";
  }
  generate(): string {
    return "";
  }
}

export interface Params {
  [key: string]: any | undefined;
  [key: number]: any | undefined;
  queryParams?: QueryParams | null;
}

type Segment = StaticSegment | DynamicSegment | StarSegment | EpsilonSegment;

// The `names` will be populated with the paramter name for each dynamic/star
// segment. `shouldDecodes` will be populated with a boolean for each dyanamic/star
// segment, indicating whether it should be decoded during recognition.
function parse(route: string, names: string[], types: Types, shouldDecodes: boolean[]): Segment[] {
  // normalize route as not starting with a "/". Recognition will
  // also normalize.
  if (route.charAt(0) === "/") { route = route.substr(1); }

  let segments = route.split("/");
  let results = new Array(segments.length);

  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i], match;

    if (match = segment.match(/^:([^\/]+)$/)) {
      results[i] = new DynamicSegment(match[1]);
      names.push(match[1]);
      shouldDecodes.push(true);
      types.dynamics++;
    } else if (match = segment.match(/^\*([^\/]+)$/)) {
      results[i] = new StarSegment(match[1]);
      names.push(match[1]);
      shouldDecodes.push(false);
      types.stars++;
    } else if (segment === "") {
      results[i] = new EpsilonSegment();
    } else {
      results[i] = new StaticSegment(segment);
      types.statics++;
    }
  }

  return results;
}

function isEqualCharSpec(specA: CharSpec | undefined, specB: CharSpec) {
  return specA && specA.validChars === specB.validChars &&
         specA.invalidChars === specB.invalidChars;
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

class State {
  nextStates: State[];
  charSpec: CharSpec | undefined;
  regex: RegExp | undefined;
  handlers: any[] | undefined;
  types: Types | undefined;

  constructor (charSpec?: CharSpec) {
    this.charSpec = charSpec;
    this.nextStates = [];
    this.regex = undefined;
    this.handlers = undefined;
    this.types = undefined;
  }

  get(charSpec: CharSpec): State | void {
    let nextStates = this.nextStates;

    for (let i = 0; i < nextStates.length; i++) {
      let child = nextStates[i];

      if (isEqualCharSpec(child.charSpec, charSpec)) {
        return child;
      }
    }
  }

  put(charSpec: CharSpec) {
    let state;

    // If the character specification already exists in a child of the current
    // state, just return that state.
    if (state = this.get(charSpec)) { return state; }

    // Make a new state for the character spec
    state = new State(charSpec);

    // Insert the new state as a child of the current state
    this.nextStates.push(state);

    // If this character specification repeats, insert the new state as a child
    // of itself. Note that this will not trigger an infinite loop because each
    // transition during recognition consumes a character.
    if (charSpec.repeat) {
      state.nextStates.push(state);
    }

    // Return the new state
    return state;
  }

  // Find a list of child states matching the next character
  match(ch: string) {
    let nextStates = this.nextStates,
        child, charSpec, chars;

    let returned: State[] = [];

    for (let i = 0; i < nextStates.length; i++) {
      child = nextStates[i];

      charSpec = child.charSpec;

      if (typeof (chars = charSpec && charSpec.validChars) !== "undefined") {
        if (chars.indexOf(ch) !== -1) { returned.push(child); }
      } else if (typeof (chars = charSpec && charSpec.invalidChars) !== "undefined") {
        if (chars.indexOf(ch) === -1) { returned.push(child); }
      }
    }

    return returned;
  }
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
    if (!a.types) {
      return b.types ? -1 : 0;
    } else if (!b.types) {
      return 1;
    }
    if (a.types.stars !== b.types.stars) { return a.types.stars - b.types.stars; }

    if (a.types.stars) {
      if (a.types.statics !== b.types.statics) { return b.types.statics - a.types.statics; }
      if (a.types.dynamics !== b.types.dynamics) { return b.types.dynamics - a.types.dynamics; }
    }

    if (a.types.dynamics !== b.types.dynamics) { return a.types.dynamics - b.types.dynamics; }
    if (a.types.statics !== b.types.statics) { return b.types.statics - a.types.statics; }

    return 0;
  });
}

function recognizeChar(states: State[], ch: string) {
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
  handler: any;
  params: Params;
  isDynamic: boolean;
}

export interface Results {
  queryParams: QueryParams;
  [index: number]: Result | undefined;
  length: number;
  slice(start?: number, end?: number): Result[];
  splice(start: number, deleteCount: number, ...items: Result[]): Result[];
  push(...results: Result[]): number;
}

class RecognizeResults {
  queryParams: QueryParams;
  splice = Array.prototype.splice;
  slice =  Array.prototype.slice;
  push = Array.prototype.push;
  length = 0;
  [index: number]: any | undefined;

  constructor(queryParams?: QueryParams | undefined) {
    this.queryParams = queryParams || {};
  }
};

function findHandler(state: State, originalPath: string, queryParams: QueryParams): Results {
  let handlers = state.handlers;
  let regex = state.regex;
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
    let name, shouldDecode, capture;

    for (let j = 0; j < names.length; j++) {
      name = names[j];
      shouldDecode = shouldDecodes[j];
      if (!captures) throw Error("expected params");
      capture = captures[currentCapture++];

      if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS) {
        if (shouldDecode) {
          params[name] = decodeURIComponent(capture);
        } else {
          params[name] = capture;
        }
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
  handlers: any[];
}

class RouteRecognizer {
  private rootState: State;
  private names: {
    [name: string]: NamedRoute | undefined;
  };
  map: (context: (match: MatchDSL) => void, addCallback?: (router: this, routes: Route[]) => void) => void = map;

  delegate: Delegate | undefined;

  static VERSION = "VERSION_STRING_PLACEHOLDER";
  // Set to false to opt-out of encoding and decoding path segments.
  // See https://github.com/tildeio/route-recognizer/pull/55
  static ENCODE_AND_DECODE_PATH_SEGMENTS = true;
  static Normalizer = {
    normalizeSegment, normalizePath, encodePathSegment
  };

  constructor() {
    this.rootState = new State();
    this.names = {};
  }

  add(routes: Route[], options?: { as: string }) {
    let currentState = this.rootState;
    let regex = "^";
    let types = { statics: 0, dynamics: 0, stars: 0 };
    let handlers: any[] = new Array(routes.length);
    let allSegments: Segment[] = [];
    let name: string | undefined;

    let isEmpty = true;

    for (let i = 0; i < routes.length; i++) {
      let route = routes[i];
      let names: string[] = [];
      let shouldDecodes: boolean[] = [];

      let segments = parse(route.path, names, types, shouldDecodes);

      allSegments = allSegments.concat(segments);

      for (let j = 0; j < segments.length; j++) {
        let segment = segments[j];

        if (segment instanceof EpsilonSegment) { continue; }

        isEmpty = false;

        // Add a "/" for the new segment
        currentState = currentState.put({ invalidChars: undefined, repeat: false, validChars: "/" });
        regex += "/";

        // Add a representation of the segment to the NFA and regex
        currentState = segment.eachChar(currentState);
        regex += segment.regex();
      }
      let handler = { handler: route.handler, names: names, shouldDecodes: shouldDecodes };
      handlers[i] = handler;
    }

    if (isEmpty) {
      currentState = currentState.put({ invalidChars: undefined, repeat: false, validChars: "/" });
      regex += "/";
    }

    currentState.handlers = handlers;
    currentState.regex = new RegExp(regex + "$");
    currentState.types = types;

    if (typeof options === "object" && options !== null && options.hasOwnProperty("as")) {
      name = options.as;
    }

    if (name && this.names.hasOwnProperty(name)) {
      throw new Error("You may not add a duplicate route named `" + name + "`.");
    }

    if (name = options && options.as) {
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

      if (segment instanceof EpsilonSegment) {
        continue;
      }

      output += "/";
      output += segment.generate(params);
    }

    if (output.charAt(0) !== "/") { output = "/" + output; }

    if (params && params.queryParams) {
      output += this.generateQueryString(params.queryParams);
    }

    return output;
  }

  generateQueryString(params: QueryParams) {
    let pairs: string[] = [];
    let keys: string[] = [];
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
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
      states = recognizeChar(states, path.charAt(i));
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
      if (isSlashDropped && state.regex && state.regex.source.slice(-5) === "(.+)$") {
        originalPath = originalPath + "/";
      }
      results = findHandler(state, originalPath, queryParams);
    }

    return results;
  }
}

export default RouteRecognizer;

interface Types {
  statics: number;
  dynamics: number;
  stars: number;
}

interface CharSpec {
  validChars: string | undefined;
  invalidChars: string | undefined;
  repeat: boolean;
}