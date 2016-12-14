(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('route-recognizer', factory) :
    (global.RouteRecognizer = factory());
}(this, (function () { 'use strict';

var createObject = Object.create;
function createMap() {
    var map = createObject(null);
    map["__"] = undefined;
    delete map["__"];
    return map;
}

var Target = function Target(path, matcher, delegate) {
    this.path = path;
    this.matcher = matcher;
    this.delegate = delegate;
};
Target.prototype.to = function to (target, callback) {
    var delegate = this.delegate;
    if (delegate && delegate.willAddRoute) {
        target = delegate.willAddRoute(this.matcher.target, target);
    }
    this.matcher.add(this.path, target);
    if (callback) {
        if (callback.length === 0) {
            throw new Error("You must have an argument in the function passed to `to`");
        }
        this.matcher.addChild(this.path, target, callback, this.delegate);
    }
};
var Matcher = function Matcher(target) {
    this.routes = createMap();
    this.children = createMap();
    this.target = target;
};
Matcher.prototype.add = function add (path, target) {
    this.routes[path] = target;
};
Matcher.prototype.addChild = function addChild (path, target, callback, delegate) {
    var matcher = new Matcher(target);
    this.children[path] = matcher;
    var match = generateMatch(path, matcher, delegate);
    if (delegate && delegate.contextEntered) {
        delegate.contextEntered(target, match);
    }
    callback(match);
};
function generateMatch(startingPath, matcher, delegate) {
    function match(path, callback) {
        var fullPath = startingPath + path;
        if (callback) {
            callback(generateMatch(fullPath, matcher, delegate));
        }
        else {
            return new Target(fullPath, matcher, delegate);
        }
    }
    ;
    return match;
}
function addRoute(routeArray, path, handler) {
    var len = 0;
    for (var i = 0; i < routeArray.length; i++) {
        len += routeArray[i].path.length;
    }
    path = path.substr(len);
    var route = { path: path, handler: handler };
    routeArray.push(route);
}
function eachRoute(baseRoute, matcher, callback, binding) {
    var routes = matcher.routes;
    var paths = Object.keys(routes);
    for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        var routeArray = baseRoute.slice();
        addRoute(routeArray, path, routes[path]);
        var nested = matcher.children[path];
        if (nested) {
            eachRoute(routeArray, nested, callback, binding);
        }
        else {
            callback.call(binding, routeArray);
        }
    }
}
function map (callback, addRouteCallback) {
    var matcher = new Matcher();
    callback(generateMatch("", matcher, this.delegate));
    eachRoute([], matcher, function (routes) {
        if (addRouteCallback) {
            addRouteCallback(this, routes);
        }
        else {
            this.add(routes);
        }
    }, this);
}

// Normalizes percent-encoded values in `path` to upper-case and decodes percent-encoded
// values that are not reserved (i.e., unicode characters, emoji, etc). The reserved
// chars are "/" and "%".
// Safe to call multiple times on the same path.
// Normalizes percent-encoded values in `path` to upper-case and decodes percent-encoded
function normalizePath(path) {
    return path.split("/")
        .map(normalizeSegment)
        .join("/");
}
// We want to ensure the characters "%" and "/" remain in percent-encoded
// form when normalizing paths, so replace them with their encoded form after
// decoding the rest of the path
var SEGMENT_RESERVED_CHARS = /%|\//g;
function normalizeSegment(segment) {
    if (segment.length < 3 || segment.indexOf("%") === -1)
        { return segment; }
    return decodeURIComponent(segment).replace(SEGMENT_RESERVED_CHARS, encodeURIComponent);
}
// We do not want to encode these characters when generating dynamic path segments
// See https://tools.ietf.org/html/rfc3986#section-3.3
// sub-delims: "!", "$", "&", "'", "(", ")", "*", "+", ",", ";", "="
// others allowed by RFC 3986: ":", "@"
//
// First encode the entire path segment, then decode any of the encoded special chars.
//
// The chars "!", "'", "(", ")", "*" do not get changed by `encodeURIComponent`,
// so the possible encoded chars are:
// ['%24', '%26', '%2B', '%2C', '%3B', '%3D', '%3A', '%40'].
var PATH_SEGMENT_ENCODINGS = /%(?:2(?:4|6|B|C)|3(?:B|D|A)|40)/g;
function encodePathSegment(str) {
    return encodeURIComponent(str).replace(PATH_SEGMENT_ENCODINGS, decodeURIComponent);
}

var escapeRegex = /(\/|\.|\*|\+|\?|\||\(|\)|\[|\]|\{|\}|\\)/g;
var isArray = Array.isArray;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function getParam(params, key) {
    if (typeof params !== "object" || params === null) {
        throw new Error("You must pass an object as the second argument to `generate`.");
    }
    if (!hasOwnProperty.call(params, key)) {
        throw new Error("You must provide param `" + key + "` to `generate`.");
    }
    var value = params[key];
    var str = typeof value === "string" ? value : "" + value;
    if (str.length === 0) {
        throw new Error("You must provide a param `" + key + "`.");
    }
    return str;
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
var StaticSegment = function StaticSegment(str) {
    this.type = 0 /* Static */;
    this.value = normalizeSegment(str);
};
StaticSegment.prototype.eachChar = function eachChar (currentState) {
    var str = this.value, ch;
    for (var i = 0; i < str.length; i++) {
        ch = str.charAt(i);
        currentState = currentState.put({ invalidChars: undefined, repeat: false, validChars: ch });
    }
    return currentState;
};
StaticSegment.prototype.regex = function regex () {
    return this.value.replace(escapeRegex, "\\$1");
};
StaticSegment.prototype.generate = function generate (_) {
    return this.value;
};
var DynamicSegment = function DynamicSegment(name) {
    this.type = 1 /* Dynamic */;
    this.value = normalizeSegment(name);
};
DynamicSegment.prototype.eachChar = function eachChar (currentState) {
    return currentState.put({ invalidChars: "/", repeat: true, validChars: undefined });
};
DynamicSegment.prototype.regex = function regex () {
    return "([^/]+)";
};
DynamicSegment.prototype.generate = function generate (params) {
    var value = getParam(params, this.value);
    if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS) {
        return encodePathSegment(value);
    }
    else {
        return value;
    }
};
var StarSegment = function StarSegment(name) {
    this.type = 2 /* Star */;
    this.value = name;
};
StarSegment.prototype.eachChar = function eachChar (currentState) {
    return currentState.put({
        invalidChars: "",
        repeat: true,
        validChars: undefined
    });
};
StarSegment.prototype.regex = function regex () {
    return "(.+)";
};
StarSegment.prototype.generate = function generate (params) {
    return getParam(params, this.value);
};
var EpsilonSegment = function EpsilonSegment() {
    this.type = 3 /* Epsilon */;
    this.value = undefined;
};
EpsilonSegment.prototype.eachChar = function eachChar (currentState) {
    return currentState;
};
EpsilonSegment.prototype.regex = function regex () {
    return "";
};
EpsilonSegment.prototype.generate = function generate () {
    return "";
};
// The `names` will be populated with the paramter name for each dynamic/star
// segment. `shouldDecodes` will be populated with a boolean for each dyanamic/star
// segment, indicating whether it should be decoded during recognition.
function parse(segments, route, names, types, shouldDecodes) {
    // normalize route as not starting with a "/". Recognition will
    // also normalize.
    if (route.length > 0 && route.charCodeAt(0) === 47 /* SLASH */) {
        route = route.substr(1);
    }
    var parts = route.split("/");
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        if (part === "") {
            segments.push(new EpsilonSegment());
        }
        else if (part.charCodeAt(0) === 58 /* COLON */) {
            var name = part.slice(1);
            segments.push(new DynamicSegment(name));
            names.push(name);
            shouldDecodes.push(true);
            types.dynamics++;
        }
        else if (part.charCodeAt(0) === 42 /* STAR */) {
            var name$1 = part.slice(1);
            segments.push(new StarSegment(name$1));
            names.push(name$1);
            shouldDecodes.push(false);
            types.stars++;
        }
        else {
            segments.push(new StaticSegment(part));
            types.statics++;
        }
    }
}
function isEqualCharSpec(specA, specB) {
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
var State = function State(charSpec) {
    this.charSpec = charSpec;
    this.nextStates = [];
    this.pattern = "";
    this._regex = undefined;
    this.handlers = undefined;
    this.types = undefined;
};
State.prototype.regex = function regex () {
    if (!this._regex) {
        this._regex = new RegExp(this.pattern);
    }
    return this._regex;
};
State.prototype.get = function get (charSpec) {
    var nextStates = this.nextStates;
    for (var i = 0; i < nextStates.length; i++) {
        var child = nextStates[i];
        if (isEqualCharSpec(child.charSpec, charSpec)) {
            return child;
        }
    }
};
State.prototype.put = function put (charSpec) {
    var state;
    // If the character specification already exists in a child of the current
    // state, just return that state.
    if (state = this.get(charSpec)) {
        return state;
    }
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
};
// Find a list of child states matching the next character
State.prototype.match = function match (ch) {
    var nextStates = this.nextStates, child, charSpec, chars;
    var returned = [];
    for (var i = 0; i < nextStates.length; i++) {
        child = nextStates[i];
        charSpec = child.charSpec;
        if (typeof (chars = charSpec && charSpec.validChars) !== "undefined") {
            if (chars.indexOf(ch) !== -1) {
                returned.push(child);
            }
        }
        else if (typeof (chars = charSpec && charSpec.invalidChars) !== "undefined") {
            if (chars.indexOf(ch) === -1) {
                returned.push(child);
            }
        }
    }
    return returned;
};
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
function sortSolutions(states) {
    return states.sort(function (a, b) {
        if (!a.types) {
            return b.types ? -1 : 0;
        }
        else if (!b.types) {
            return 1;
        }
        if (a.types.stars !== b.types.stars) {
            return a.types.stars - b.types.stars;
        }
        if (a.types.stars) {
            if (a.types.statics !== b.types.statics) {
                return b.types.statics - a.types.statics;
            }
            if (a.types.dynamics !== b.types.dynamics) {
                return b.types.dynamics - a.types.dynamics;
            }
        }
        if (a.types.dynamics !== b.types.dynamics) {
            return a.types.dynamics - b.types.dynamics;
        }
        if (a.types.statics !== b.types.statics) {
            return b.types.statics - a.types.statics;
        }
        return 0;
    });
}
function recognizeChar(states, ch) {
    var nextStates = [];
    for (var i = 0, l = states.length; i < l; i++) {
        var state = states[i];
        nextStates = nextStates.concat(state.match(ch));
    }
    return nextStates;
}
var RecognizeResults = function RecognizeResults(queryParams) {
    this.length = 0;
    this.queryParams = queryParams || {};
};
;
RecognizeResults.prototype.splice = Array.prototype.splice;
RecognizeResults.prototype.slice = Array.prototype.slice;
RecognizeResults.prototype.push = Array.prototype.push;
function findHandler(state, originalPath, queryParams) {
    var handlers = state.handlers;
    var regex = state.regex();
    if (!regex || !handlers)
        { throw new Error("state not initialized"); }
    var captures = originalPath.match(regex);
    var currentCapture = 1;
    var result = new RecognizeResults(queryParams);
    result.length = handlers.length;
    for (var i = 0; i < handlers.length; i++) {
        var handler = handlers[i];
        var names = handler.names;
        var shouldDecodes = handler.shouldDecodes;
        var params = {};
        for (var j = 0; j < names.length; j++) {
            var name = names[j];
            var capture = captures && captures[currentCapture++];
            if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS && shouldDecodes[j]) {
                params[name] = capture && decodeURIComponent(capture);
            }
            else {
                params[name] = capture;
            }
        }
        result[i] = { handler: handler.handler, params: params, isDynamic: !!names.length };
    }
    return result;
}
function decodeQueryParamPart(part) {
    // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
    part = part.replace(/\+/gm, "%20");
    var result;
    try {
        result = decodeURIComponent(part);
    }
    catch (error) {
        result = "";
    }
    return result;
}
var RouteRecognizer = function RouteRecognizer() {
    this.rootState = new State();
    this.names = createMap();
    this.map = map;
};
RouteRecognizer.prototype.add = function add (routes, options) {
    var currentState = this.rootState;
    var pattern = "^";
    var types = { statics: 0, dynamics: 0, stars: 0 };
    var handlers = new Array(routes.length);
    var allSegments = [];
    var name;
    var isEmpty = true;
    var j = 0;
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        var names = [];
        var shouldDecodes = [];
        parse(allSegments, route.path, names, types, shouldDecodes);
        for (; j < allSegments.length; j++) {
            var segment = allSegments[j];
            if (segment.type === 3 /* Epsilon */) {
                continue;
            }
            isEmpty = false;
            // Add a "/" for the new segment
            currentState = currentState.put({ invalidChars: undefined, repeat: false, validChars: "/" });
            pattern += "/";
            // Add a representation of the segment to the NFA and regex
            currentState = segment.eachChar(currentState);
            pattern += segment.regex();
        }
        var handler = { handler: route.handler, names: names, shouldDecodes: shouldDecodes };
        handlers[i] = handler;
    }
    if (isEmpty) {
        currentState = currentState.put({ invalidChars: undefined, repeat: false, validChars: "/" });
        pattern += "/";
    }
    currentState.handlers = handlers;
    currentState.pattern = pattern + "$";
    currentState.types = types;
    if (typeof options === "object" && options !== null && hasOwnProperty.call(options, "as")) {
        name = options.as;
    }
    if (name && hasOwnProperty.call(this.names, name)) {
        throw new Error("You may not add a duplicate route named `" + name + "`.");
    }
    if (name = options && options.as) {
        this.names[name] = {
            segments: allSegments,
            handlers: handlers
        };
    }
};
RouteRecognizer.prototype.handlersFor = function handlersFor (name) {
    var route = this.names[name];
    if (!route) {
        throw new Error("There is no route named " + name);
    }
    var result = new Array(route.handlers.length);
    for (var i = 0; i < route.handlers.length; i++) {
        result[i] = route.handlers[i];
    }
    return result;
};
RouteRecognizer.prototype.hasRoute = function hasRoute (name) {
    return !!this.names[name];
};
RouteRecognizer.prototype.generate = function generate (name, params) {
    var route = this.names[name];
    var output = "";
    if (!route) {
        throw new Error("There is no route named " + name);
    }
    var segments = route.segments;
    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];
        if (segment instanceof EpsilonSegment) {
            continue;
        }
        output += "/";
        output += segment.generate(params);
    }
    if (output.charAt(0) !== "/") {
        output = "/" + output;
    }
    if (params && params.queryParams) {
        output += this.generateQueryString(params.queryParams);
    }
    return output;
};
RouteRecognizer.prototype.generateQueryString = function generateQueryString (params) {
    var pairs = [];
    var keys = Object.keys(params);
    keys.sort();
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = params[key];
        if (value == null) {
            continue;
        }
        var pair = encodeURIComponent(key);
        if (isArray(value)) {
            for (var j = 0; j < value.length; j++) {
                var arrayPair = key + "[]" + "=" + encodeURIComponent(value[j]);
                pairs.push(arrayPair);
            }
        }
        else {
            pair += "=" + encodeURIComponent(value);
            pairs.push(pair);
        }
    }
    if (pairs.length === 0) {
        return "";
    }
    return "?" + pairs.join("&");
};
RouteRecognizer.prototype.parseQueryString = function parseQueryString (queryString) {
    var pairs = queryString.split("&");
    var queryParams = {};
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("="), key = decodeQueryParamPart(pair[0]), keyLength = key.length, isArray = false, value = (void 0);
        if (pair.length === 1) {
            value = "true";
        }
        else {
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
            queryParams[key].push(value);
        }
        else {
            queryParams[key] = value;
        }
    }
    return queryParams;
};
RouteRecognizer.prototype.recognize = function recognize (path) {
    var results;
    var states = [this.rootState];
    var queryParams = {};
    var isSlashDropped = false;
    var hashStart = path.indexOf("#");
    if (hashStart !== -1) {
        path = path.substr(0, hashStart);
    }
    var queryStart = path.indexOf("?");
    if (queryStart !== -1) {
        var queryString = path.substr(queryStart + 1, path.length);
        path = path.substr(0, queryStart);
        queryParams = this.parseQueryString(queryString);
    }
    if (path.charAt(0) !== "/") {
        path = "/" + path;
    }
    var originalPath = path;
    if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS) {
        path = normalizePath(path);
    }
    else {
        path = decodeURI(path);
        originalPath = decodeURI(originalPath);
    }
    var pathLen = path.length;
    if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
        path = path.substr(0, pathLen - 1);
        originalPath = originalPath.substr(0, originalPath.length - 1);
        isSlashDropped = true;
    }
    for (var i = 0; i < path.length; i++) {
        states = recognizeChar(states, path.charAt(i));
        if (!states.length) {
            break;
        }
    }
    var solutions = [];
    for (var i$1 = 0; i$1 < states.length; i$1++) {
        if (states[i$1].handlers) {
            solutions.push(states[i$1]);
        }
    }
    states = sortSolutions(solutions);
    var state = solutions[0];
    if (state && state.handlers) {
        // if a trailing slash was dropped and a star segment is the last segment
        // specified, put the trailing slash back
        if (isSlashDropped && state.pattern && state.pattern.slice(-5) === "(.+)$") {
            originalPath = originalPath + "/";
        }
        results = findHandler(state, originalPath, queryParams);
    }
    return results;
};
RouteRecognizer.VERSION = "0.3.0";
// Set to false to opt-out of encoding and decoding path segments.
// See https://github.com/tildeio/route-recognizer/pull/55
RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = true;
RouteRecognizer.Normalizer = {
    normalizeSegment: normalizeSegment, normalizePath: normalizePath, encodePathSegment: encodePathSegment
};

return RouteRecognizer;

})));
//# sourceMappingURL=route-recognizer.js.map
