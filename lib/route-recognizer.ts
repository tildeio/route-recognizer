import map, { Delegate, MatchCallback, Route } from "./route-recognizer/dsl";
import {
  encodePathSegment,
  normalizePath,
  normalizeSegment
} from "./route-recognizer/normalizer";
import { createMap } from "./route-recognizer/util";
export { Delegate, MatchCallback } from "./route-recognizer/dsl";

const enum CHARS {
  ANY = -1,
  STAR = 42,
  SLASH = 47,
  COLON = 58
}

const escapeRegex = /(\/|\.|\*|\+|\?|\||\(|\)|\[|\]|\{|\}|\\)/g;

const isArray = Array.isArray;
// eslint-disable-next-line @typescript-eslint/unbound-method
const hasOwnProperty = Object.prototype.hasOwnProperty;

function getParam(params: Params | null | undefined, key: string): string {
  if (typeof params !== "object" || params === null) {
    throw new Error(
      "You must pass an object as the second argument to `generate`."
    );
  }

  if (!hasOwnProperty.call(params, key)) {
    throw new Error("You must provide param `" + key + "` to `generate`.");
  }

  const value = params[key];
  const str = typeof value === "string" ? value : "" + value;
  if (str.length === 0) {
    throw new Error("You must provide a param `" + key + "`.");
  }
  return str;
}

const enum SegmentType {
  Static = 0,
  Dynamic = 1,
  Star = 2,
  Epsilon = 4
}

const enum SegmentFlags {
  Static = SegmentType.Static,
  Dynamic = SegmentType.Dynamic,
  Star = SegmentType.Star,
  Epsilon = SegmentType.Epsilon,
  Named = Dynamic | Star,
  Decoded = Dynamic,
  Counted = Static | Dynamic | Star
}

type Counted = SegmentType.Static | SegmentType.Dynamic | SegmentType.Star;

const eachChar: (<THandler>(
  segment: Segment,
  currentState: State<THandler>
) => State<THandler>)[] = [];
eachChar[SegmentType.Static] = function<THandler>(
  segment: Segment,
  currentState: State<THandler>
) {
  let state = currentState;
  const value = segment.value;
  for (let i = 0; i < value.length; i++) {
    const ch = value.charCodeAt(i);
    state = state.put(ch, false, false);
  }
  return state;
};
eachChar[SegmentType.Dynamic] = function<THandler>(
  _: Segment,
  currentState: State<THandler>
) {
  return currentState.put(CHARS.SLASH, true, true);
};
eachChar[SegmentType.Star] = function<THandler>(
  _: Segment,
  currentState: State<THandler>
) {
  return currentState.put(CHARS.ANY, false, true);
};
eachChar[SegmentType.Epsilon] = function<THandler>(
  _: Segment,
  currentState: State<THandler>
) {
  return currentState;
};

const regex: ((segment: Segment) => string)[] = [];
regex[SegmentType.Static] = function(segment: Segment) {
  return segment.value.replace(escapeRegex, "\\$1");
};
regex[SegmentType.Dynamic] = function() {
  return "([^/]+)";
};
regex[SegmentType.Star] = function() {
  return "(.+)";
};
regex[SegmentType.Epsilon] = function() {
  return "";
};

const generate: ((
  segment: Segment,
  params?: Params | null,
  shouldEncode?: boolean
) => string)[] = [];
generate[SegmentType.Static] = function(segment: Segment) {
  return segment.value;
};
generate[SegmentType.Dynamic] = function(
  segment: Segment,
  params?: Params | null,
  shouldEncode?: boolean
) {
  const value = getParam(params, segment.value);
  if (shouldEncode) {
    return encodePathSegment(value);
  } else {
    return value;
  }
};
generate[SegmentType.Star] = function(
  segment: Segment,
  params?: Params | null
) {
  return getParam(params, segment.value);
};
generate[SegmentType.Epsilon] = function() {
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
  [key: string]: unknown;
  [key: number]: unknown;
  queryParams?: {
    [key: string]: unknown;
    [key: number]: unknown;
  } | null;
}

interface ParsedHandler {
  names: string[];
  shouldDecodes: boolean[];
}

const EmptyObject = Object.freeze({});
type EmptyObject = typeof EmptyObject;

const EmptyArray = Object.freeze([]) as ReadonlyArray<unknown>;
type EmptyArray = typeof EmptyArray;

// The `names` will be populated with the paramter name for each dynamic/star
// segment. `shouldDecodes` will be populated with a boolean for each dyanamic/star
// segment, indicating whether it should be decoded during recognition.
function parse(
  segments: Segment[],
  route: string,
  types: [number, number, number]
): ParsedHandler {
  // normalize route as not starting with a "/". Recognition will
  // also normalize.
  if (route.length > 0 && route.charCodeAt(0) === CHARS.SLASH) {
    route = route.substr(1);
  }

  const parts = route.split("/");
  let names: undefined | string[] = undefined;
  let shouldDecodes: undefined | boolean[] = undefined;

  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    let type: SegmentType = 0;

    if (part === "") {
      type = SegmentType.Epsilon;
    } else if (part.charCodeAt(0) === CHARS.COLON) {
      type = SegmentType.Dynamic;
    } else if (part.charCodeAt(0) === CHARS.STAR) {
      type = SegmentType.Star;
    } else {
      type = SegmentType.Static;
    }

    if (type & SegmentFlags.Named) {
      part = part.slice(1);
      names = names || [];
      names.push(part);

      shouldDecodes = shouldDecodes || [];
      shouldDecodes.push((type & SegmentFlags.Decoded) !== 0);
    }

    if (type & SegmentFlags.Counted) {
      types[type as Counted]++;
    }

    segments.push({
      type,
      value: normalizeSegment(part)
    });
  }

  return {
    names: names || EmptyArray,
    shouldDecodes: shouldDecodes || EmptyArray
  } as ParsedHandler;
}

function isEqualCharSpec(
  spec: CharSpec,
  char: number,
  negate: boolean
): boolean {
  return spec.char === char && spec.negate === negate;
}

interface Handler<THandler> {
  handler: THandler;
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
class State<THandler> implements CharSpec {
  states: State<THandler>[];
  id: number;
  negate: boolean;
  char: number;
  nextStates: number[] | number | null;
  pattern: string;
  _regex: RegExp | undefined;
  handlers: Handler<THandler>[] | undefined;
  types: [number, number, number] | undefined;

  constructor(
    states: State<THandler>[],
    id: number,
    char: number,
    negate: boolean,
    repeat: boolean
  ) {
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

  get(char: number, negate: boolean): State<THandler> | void {
    const nextStates = this.nextStates;
    if (nextStates === null) return;
    if (isArray(nextStates)) {
      for (let i = 0; i < nextStates.length; i++) {
        const child = this.states[nextStates[i]];
        if (isEqualCharSpec(child, char, negate)) {
          return child;
        }
      }
    } else {
      const child = this.states[nextStates];
      if (isEqualCharSpec(child, char, negate)) {
        return child;
      }
    }
  }

  put(char: number, negate: boolean, repeat: boolean): State<THandler> {
    let state: State<THandler> | void;

    // If the character specification already exists in a child of the current
    // state, just return that state.
    if ((state = this.get(char, negate))) {
      return state;
    }

    // Make a new state for the character spec
    const states = this.states;
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
  match(ch: number): State<THandler>[] {
    const nextStates = this.nextStates;
    if (!nextStates) return [];

    const returned: State<THandler>[] = [];
    if (isArray(nextStates)) {
      for (let i = 0; i < nextStates.length; i++) {
        const child = this.states[nextStates[i]];

        if (isMatch(child, ch)) {
          returned.push(child);
        }
      }
    } else {
      const child = this.states[nextStates];
      if (isMatch(child, ch)) {
        returned.push(child);
      }
    }
    return returned;
  }
}

function isMatch(spec: CharSpec, char: number): boolean {
  return spec.negate
    ? spec.char !== char && spec.char !== CHARS.ANY
    : spec.char === char || spec.char === CHARS.ANY;
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
function sortSolutions<THandler>(states: State<THandler>[]): State<THandler>[] {
  return states.sort(function(a, b) {
    const [astatics, adynamics, astars] = a.types || [0, 0, 0];
    const [bstatics, bdynamics, bstars] = b.types || [0, 0, 0];
    if (astars !== bstars) {
      return astars - bstars;
    }

    if (astars) {
      if (astatics !== bstatics) {
        return bstatics - astatics;
      }
      if (adynamics !== bdynamics) {
        return bdynamics - adynamics;
      }
    }

    if (adynamics !== bdynamics) {
      return adynamics - bdynamics;
    }
    if (astatics !== bstatics) {
      return bstatics - astatics;
    }

    return 0;
  });
}

function recognizeChar<THandler>(
  states: State<THandler>[],
  ch: number
): State<THandler>[] {
  let nextStates: State<THandler>[] = [];

  for (let i = 0, l = states.length; i < l; i++) {
    const state = states[i];

    nextStates = nextStates.concat(state.match(ch));
  }

  return nextStates;
}

export interface QueryParams {
  [param: string]: string[] | string | null | undefined;
}

export interface Result<THandler> {
  handler: THandler;
  params: Params;
  isDynamic: boolean;
}

export interface Results<THandler> extends ArrayLike<Result<THandler>> {
  queryParams: QueryParams;
  slice(start?: number, end?: number): Result<THandler>[];
  splice(
    start: number,
    deleteCount: number,
    ...items: Result<THandler>[]
  ): Result<THandler>[];
  push(...results: Result<THandler>[]): number;
}

class RecognizeResults<THandler> implements Results<THandler> {
  queryParams: QueryParams;
  length = 0;
  [index: number]: Result<THandler>;
  splice!: (
    start: number,
    deleteCount: number,
    ...items: Result<THandler>[]
  ) => Result<THandler>[];
  slice!: (start?: number, end?: number) => Result<THandler>[];
  push!: (...results: Result<THandler>[]) => number;

  constructor(queryParams?: QueryParams) {
    this.queryParams = queryParams || {};
  }
}

// eslint-disable-next-line @typescript-eslint/unbound-method
RecognizeResults.prototype.splice = Array.prototype.splice;
// eslint-disable-next-line @typescript-eslint/unbound-method
RecognizeResults.prototype.slice = Array.prototype.slice;
// eslint-disable-next-line @typescript-eslint/unbound-method
RecognizeResults.prototype.push = Array.prototype.push;

function findHandler<THandler>(
  state: State<THandler>,
  originalPath: string,
  queryParams: QueryParams,
  shouldDecode: boolean
): Results<THandler> {
  const handlers = state.handlers;
  const regex: RegExp = state.regex();
  if (!regex || !handlers) throw new Error("state not initialized");
  const captures: RegExpMatchArray | null = regex.exec(originalPath);
  let currentCapture = 1;
  const result = new RecognizeResults<THandler>(queryParams);

  result.length = handlers.length;

  for (let i = 0; i < handlers.length; i++) {
    const handler = handlers[i];
    const names = handler.names;
    const shouldDecodes = handler.shouldDecodes;
    let params: Params = EmptyObject;

    let isDynamic = false;

    if (names !== (EmptyArray as string[]) && shouldDecodes !== EmptyArray) {
      for (let j = 0; j < names.length; j++) {
        isDynamic = true;
        const name = names[j];
        const capture = captures && captures[currentCapture++];

        if (params === EmptyObject) {
          params = {};
        }

        if (shouldDecode && shouldDecodes[j]) {
          params[name] = capture && decodeURIComponent(capture);
        } else {
          params[name] = capture;
        }
      }
    }

    result[i] = {
      handler: handler.handler,
      params,
      isDynamic
    };
  }

  return result;
}

function decodeQueryParamPart(part: string): string {
  // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
  part = part.replace(/\+/gm, "%20");
  let result;
  try {
    result = decodeURIComponent(part);
  } catch (error) {
    result = "";
  }
  return result;
}

interface NamedRoute<THandler> {
  segments: Segment[];
  handlers: Handler<THandler>[];
}

class RouteRecognizer<THandler = string> {
  private rootState: State<THandler>;
  private names: {
    [name: string]: NamedRoute<THandler> | undefined;
  } = createMap<NamedRoute<THandler>>();
  map!: (
    context: MatchCallback<THandler>,
    addCallback?: (router: this, routes: Route<THandler>[]) => void
  ) => void;
  delegate: Delegate<THandler> | undefined;

  constructor() {
    const states: State<THandler>[] = [];
    const state = new State(states, 0, CHARS.ANY, true, false);
    states[0] = state;
    this.rootState = state;
  }

  static VERSION = "VERSION_STRING_PLACEHOLDER";
  // Set to false to opt-out of encoding and decoding path segments.
  // See https://github.com/tildeio/route-recognizer/pull/55
  static ENCODE_AND_DECODE_PATH_SEGMENTS = true;
  static Normalizer = {
    normalizeSegment,
    normalizePath,
    encodePathSegment
  };

  add(routes: Route<THandler>[], options?: { as: string }): void {
    let currentState = this.rootState;
    let pattern = "^";
    const types: [number, number, number] = [0, 0, 0];
    const handlers: Handler<THandler>[] = new Array(routes.length);
    const allSegments: Segment[] = [];

    let isEmpty = true;
    let j = 0;
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const { names, shouldDecodes } = parse(allSegments, route.path, types);

      // preserve j so it points to the start of newly added segments
      for (; j < allSegments.length; j++) {
        const segment = allSegments[j];

        if (segment.type === SegmentType.Epsilon) {
          continue;
        }

        isEmpty = false;

        // Add a "/" for the new segment
        currentState = currentState.put(CHARS.SLASH, false, false);
        pattern += "/";

        // Add a representation of the segment to the NFA and regex
        currentState = eachChar[segment.type](segment, currentState);
        pattern += regex[segment.type](segment);
      }
      handlers[i] = {
        handler: route.handler,
        names,
        shouldDecodes
      };
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
        handlers
      };
    }
  }

  handlersFor(name: string): Handler<THandler>[] {
    const route = this.names[name];

    if (!route) {
      throw new Error("There is no route named " + name);
    }

    const result: Handler<THandler>[] = new Array(route.handlers.length);

    for (let i = 0; i < route.handlers.length; i++) {
      const handler = route.handlers[i];
      result[i] = handler;
    }

    return result;
  }

  hasRoute(name: string): boolean {
    return !!this.names[name];
  }

  generate(name: string, params?: Params | null): string {
    const shouldEncode = RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS;
    const route = this.names[name];
    let output = "";
    if (!route) {
      throw new Error("There is no route named " + name);
    }

    const segments: Segment[] = route.segments;

    for (let i = 0; i < segments.length; i++) {
      const segment: Segment = segments[i];

      if (segment.type === SegmentType.Epsilon) {
        continue;
      }

      output += "/";
      output += generate[segment.type](segment, params, shouldEncode);
    }

    if (!output.startsWith("/")) {
      output = "/" + output;
    }

    if (params && params.queryParams) {
      output += this.generateQueryString(params.queryParams);
    }

    return output;
  }

  generateQueryString(params: Params): string {
    const pairs: string[] = [];
    const keys: string[] = Object.keys(params);
    keys.sort();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = params[key];
      if (value == null) {
        continue;
      }
      let pair = encodeURIComponent(key);
      if (isArray(value)) {
        for (let j = 0; j < value.length; j++) {
          const arrayPair = key + "[]" + "=" + encodeURIComponent(value[j]);
          pairs.push(arrayPair);
        }
      } else {
        pair += "=" + encodeURIComponent(value as string);
        pairs.push(pair);
      }
    }

    if (pairs.length === 0) {
      return "";
    }

    return "?" + pairs.join("&");
  }

  parseQueryString(queryString: string): QueryParams {
    const pairs = queryString.split("&");
    const queryParams: QueryParams = {};
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split(/=(.*)/, 2);
      let key = decodeQueryParamPart(pair[0]);
      const keyLength = key.length;
      let isArray = false;
      let value: string;
      if (pair.length === 1) {
        value = "true";
      } else {
        // Handle arrays
        if (keyLength > 2 && key.endsWith("[]")) {
          isArray = true;
          key = key.slice(0, keyLength - 2);
          if (!queryParams[key]) {
            queryParams[key] = [];
          }
        }
        value = pair[1] ? decodeQueryParamPart(pair[1]) : "";
      }
      if (isArray) {
        (queryParams[key] as string[]).push(value);
      } else {
        queryParams[key] = value;
      }
    }
    return queryParams;
  }

  recognize(path: string): Results<THandler> | undefined {
    const shouldNormalize = RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS;
    let results: Results<THandler> | undefined;
    let states: State<THandler>[] = [this.rootState];
    let queryParams = {};
    let isSlashDropped = false;
    const hashStart = path.indexOf("#");
    if (hashStart !== -1) {
      path = path.substr(0, hashStart);
    }

    const queryStart = path.indexOf("?");
    if (queryStart !== -1) {
      const queryString = path.substr(queryStart + 1, path.length);
      path = path.substr(0, queryStart);
      queryParams = this.parseQueryString(queryString);
    }

    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    let originalPath = path;

    if (shouldNormalize) {
      path = normalizePath(path);
    } else {
      path = decodeURI(path);
      originalPath = decodeURI(originalPath);
    }

    const pathLen = path.length;
    if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
      path = path.substr(0, pathLen - 1);
      originalPath = originalPath.substr(0, originalPath.length - 1);
      isSlashDropped = true;
    }

    for (let i = 0; i < path.length; i++) {
      states = recognizeChar(states, path.charCodeAt(i));
      if (!states.length) {
        break;
      }
    }

    const solutions: State<THandler>[] = [];
    for (let i = 0; i < states.length; i++) {
      if (states[i].handlers) {
        solutions.push(states[i]);
      }
    }

    states = sortSolutions(solutions);

    const state = solutions[0];

    if (state && state.handlers) {
      // if a trailing slash was dropped and a star segment is the last segment
      // specified, put the trailing slash back
      if (isSlashDropped && state.char === CHARS.ANY) {
        originalPath = originalPath + "/";
      }
      results = findHandler(state, originalPath, queryParams, shouldNormalize);
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
