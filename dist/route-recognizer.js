(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('route-recognizer', factory) :
	(global.RouteRecognizer = factory());
}(this, (function () { 'use strict';

function Target(path, matcher, delegate) {
  this.path = path;
  this.matcher = matcher;
  this.delegate = delegate;
}

Target.prototype = {
  to: function(target, callback) {
    var delegate = this.delegate;

    if (delegate && delegate.willAddRoute) {
      target = delegate.willAddRoute(this.matcher.target, target);
    }

    this.matcher.add(this.path, target);

    if (callback) {
      if (callback.length === 0) { throw new Error("You must have an argument in the function passed to `to`"); }
      this.matcher.addChild(this.path, target, callback, this.delegate);
    }
    return this;
  }
};

function Matcher(target) {
  this.routes = {};
  this.children = {};
  this.target = target;
}

Matcher.prototype = {
  add: function(path, handler) {
    this.routes[path] = handler;
  },

  addChild: function(path, target, callback, delegate) {
    var matcher = new Matcher(target);
    this.children[path] = matcher;

    var match = generateMatch(path, matcher, delegate);

    if (delegate && delegate.contextEntered) {
      delegate.contextEntered(target, match);
    }

    callback(match);
  }
};

function generateMatch(startingPath, matcher, delegate) {
  return function(path, nestedCallback) {
    var fullPath = startingPath + path;

    if (nestedCallback) {
      nestedCallback(generateMatch(fullPath, matcher, delegate));
    } else {
      return new Target(startingPath + path, matcher, delegate);
    }
  };
}

function addRoute(routeArray, path, handler) {
  var len = 0;
  for (var i=0; i<routeArray.length; i++) {
    len += routeArray[i].path.length;
  }

  path = path.substr(len);
  var route = { path: path, handler: handler };
  routeArray.push(route);
}

function eachRoute(baseRoute, matcher, callback, binding) {
  var routes = matcher.routes;

  for (var path in routes) {
    if (routes.hasOwnProperty(path)) {
      var routeArray = baseRoute.slice();
      addRoute(routeArray, path, routes[path]);

      if (matcher.children[path]) {
        eachRoute(routeArray, matcher.children[path], callback, binding);
      } else {
        callback.call(binding, routeArray);
      }
    }
  }
}

var map = function(callback, addRouteCallback) {
  var matcher = new Matcher();

  callback(generateMatch("", matcher, this.delegate));

  eachRoute([], matcher, function(route) {
    if (addRouteCallback) { addRouteCallback(this, route); }
    else { this.add(route); }
  }, this);
};

// Normalizes percent-encoded values in `path` to upper-case and decodes percent-encoded
// values that are not reserved (i.e., unicode characters, emoji, etc). The reserved
// chars are "/" and "%".
// Safe to call multiple times on the same path.
function normalizePath(path) {
  return path.split('/')
             .map(normalizeSegment)
             .join('/');
}

// We want to ensure the characters "%" and "/" remain in percent-encoded
// form when normalizing paths, so replace them with their encoded form after
// decoding the rest of the path
var SEGMENT_RESERVED_CHARS = /%|\//g;
function normalizeSegment(segment) {
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
var PATH_SEGMENT_ENCODINGS = /%(?:24|26|2B|2C|3B|3D|3A|40)/g;

function encodePathSegment(str) {
  return encodeURIComponent(str).replace(PATH_SEGMENT_ENCODINGS, decodeURIComponent);
}

var specials = [
  '/', '.', '*', '+', '?', '|',
  '(', ')', '[', ']', '{', '}', '\\'
];

var escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g');

function isArray(test) {
  return Object.prototype.toString.call(test) === "[object Array]";
}

function getParam(params, key) {
  if (typeof params !== "object" || params === null) {
    throw new Error("You must pass an object as the second argument to `generate`.");
  }
  if (!params.hasOwnProperty(key)) {
    throw new Error("You must provide param `" + key + "` to `generate`.");
  }
  if (("" + params[key]).length === 0) {
    throw new Error("You must provide a param `" + key + "`.");
  }

  return params[key];
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

function StaticSegment(string) { this.string = normalizeSegment(string); }
StaticSegment.prototype = {
  eachChar: function(currentState) {
    var string = this.string, ch;

    for (var i=0; i<string.length; i++) {
      ch = string.charAt(i);
      currentState = currentState.put({ invalidChars: undefined, repeat: false, validChars: ch });
    }

    return currentState;
  },

  regex: function() {
    return this.string.replace(escapeRegex, '\\$1');
  },

  generate: function() {
    return this.string;
  }
};

function DynamicSegment(name) { this.name = normalizeSegment(name); }
DynamicSegment.prototype = {
  eachChar: function(currentState) {
    return currentState.put({ invalidChars: "/", repeat: true, validChars: undefined });
  },

  regex: function() {
    return "([^/]+)";
  },

  generate: function(params) {
    var value = getParam(params, this.name);

    if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS) {
      return encodePathSegment(value);
    } else {
      return value;
    }
  }
};

function StarSegment(name) { this.name = name; }
StarSegment.prototype = {
  eachChar: function(currentState) {
    return currentState.put({ invalidChars: "", repeat: true, validChars: undefined });
  },

  regex: function() {
    return "(.+)";
  },

  generate: function(params) {
    return getParam(params, this.name);
  }
};

function EpsilonSegment() {}
EpsilonSegment.prototype = {
  eachChar: function(currentState) {
    return currentState;
  },
  regex: function() { return ""; },
  generate: function() { return ""; }
};

// The `names` will be populated with the paramter name for each dynamic/star
// segment. `shouldDecodes` will be populated with a boolean for each dyanamic/star
// segment, indicating whether it should be decoded during recognition.
function parse(route, names, types, shouldDecodes) {
  // normalize route as not starting with a "/". Recognition will
  // also normalize.
  if (route.charAt(0) === "/") { route = route.substr(1); }

  var segments = route.split("/");
  var results = new Array(segments.length);

  for (var i=0; i<segments.length; i++) {
    var segment = segments[i], match;

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
    } else if(segment === "") {
      results[i] = new EpsilonSegment();
    } else {
      results[i] = new StaticSegment(segment);
      types.statics++;
    }
  }

  return results;
}

function isEqualCharSpec(specA, specB) {
  return specA.validChars === specB.validChars &&
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

function State(charSpec) {
  this.charSpec = charSpec;
  this.nextStates = [];
  this.regex = undefined;
  this.handlers = undefined;
  this.specificity = undefined;
}

State.prototype = {
  get: function(charSpec) {
    var nextStates = this.nextStates;

    for (var i=0; i<nextStates.length; i++) {
      var child = nextStates[i];

      if (isEqualCharSpec(child.charSpec, charSpec)) {
        return child;
      }
    }
  },

  put: function(charSpec) {
    var state;

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
  },

  // Find a list of child states matching the next character
  match: function(ch) {
    var nextStates = this.nextStates,
        child, charSpec, chars;

    var returned = [];

    for (var i=0; i<nextStates.length; i++) {
      child = nextStates[i];

      charSpec = child.charSpec;

      if (typeof (chars = charSpec.validChars) !== 'undefined') {
        if (chars.indexOf(ch) !== -1) { returned.push(child); }
      } else if (typeof (chars = charSpec.invalidChars) !== 'undefined') {
        if (chars.indexOf(ch) === -1) { returned.push(child); }
      }
    }

    return returned;
  }
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
  return states.sort(function(a, b) {
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

function recognizeChar(states, ch) {
  var nextStates = [];

  for (var i=0, l=states.length; i<l; i++) {
    var state = states[i];

    nextStates = nextStates.concat(state.match(ch));
  }

  return nextStates;
}

var oCreate = Object.create || function(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
};

function RecognizeResults(queryParams) {
  this.queryParams = queryParams || {};
}
RecognizeResults.prototype = oCreate({
  splice: Array.prototype.splice,
  slice:  Array.prototype.slice,
  push:   Array.prototype.push,
  length: 0,
  queryParams: null
});

function findHandler(state, originalPath, queryParams) {
  var handlers = state.handlers, regex = state.regex;
  var captures = originalPath.match(regex), currentCapture = 1;
  var result = new RecognizeResults(queryParams);

  result.length = handlers.length;

  for (var i=0; i<handlers.length; i++) {
    var handler = handlers[i], names = handler.names,
      shouldDecodes = handler.shouldDecodes, params = {};
    var name, shouldDecode, capture;

    for (var j=0; j<names.length; j++) {
      name = names[j];
      shouldDecode = shouldDecodes[j];
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

function decodeQueryParamPart(part) {
  // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
  part = part.replace(/\+/gm, '%20');
  var result;
  try {
    result = decodeURIComponent(part);
  } catch(error) {result = '';}
  return result;
}

// The main interface

var RouteRecognizer = function() {
  this.rootState = new State();
  this.names = {};
};


RouteRecognizer.prototype = {
  add: function(routes, options) {
    var currentState = this.rootState, regex = "^",
        types = { statics: 0, dynamics: 0, stars: 0 },
        handlers = new Array(routes.length), allSegments = [], name;

    var isEmpty = true;

    for (var i=0; i<routes.length; i++) {
      var route = routes[i], names = [], shouldDecodes = [];

      var segments = parse(route.path, names, types, shouldDecodes);

      allSegments = allSegments.concat(segments);

      for (var j=0; j<segments.length; j++) {
        var segment = segments[j];

        if (segment instanceof EpsilonSegment) { continue; }

        isEmpty = false;

        // Add a "/" for the new segment
        currentState = currentState.put({ invalidChars: undefined, repeat: false, validChars: "/" });
        regex += "/";

        // Add a representation of the segment to the NFA and regex
        currentState = segment.eachChar(currentState);
        regex += segment.regex();
      }
      var handler = { handler: route.handler, names: names, shouldDecodes: shouldDecodes };
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

    if (name = options && options.as) {
      this.names[name] = {
        segments: allSegments,
        handlers: handlers
      };
    }
  },

  handlersFor: function(name) {
    var route = this.names[name];

    if (!route) { throw new Error("There is no route named " + name); }

    var result = new Array(route.handlers.length);

    for (var i=0; i<route.handlers.length; i++) {
      result[i] = route.handlers[i];
    }

    return result;
  },

  hasRoute: function(name) {
    return !!this.names[name];
  },

  generate: function(name, params) {
    var route = this.names[name], output = "";
    if (!route) { throw new Error("There is no route named " + name); }

    var segments = route.segments;

    for (var i=0; i<segments.length; i++) {
      var segment = segments[i];

      if (segment instanceof EpsilonSegment) { continue; }

      output += "/";
      output += segment.generate(params);
    }

    if (output.charAt(0) !== '/') { output = '/' + output; }

    if (params && params.queryParams) {
      output += this.generateQueryString(params.queryParams, route.handlers);
    }

    return output;
  },

  generateQueryString: function(params) {
    var pairs = [];
    var keys = [];
    for(var key in params) {
      if (params.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    keys.sort();
    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      var value = params[key];
      if (value == null) {
        continue;
      }
      var pair = encodeURIComponent(key);
      if (isArray(value)) {
        for (var j = 0; j < value.length; j++) {
          var arrayPair = key + '[]' + '=' + encodeURIComponent(value[j]);
          pairs.push(arrayPair);
        }
      } else {
        pair += "=" + encodeURIComponent(value);
        pairs.push(pair);
      }
    }

    if (pairs.length === 0) { return ''; }

    return "?" + pairs.join("&");
  },

  parseQueryString: function(queryString) {
    var pairs = queryString.split("&"), queryParams = {};
    for(var i=0; i < pairs.length; i++) {
      var pair      = pairs[i].split('='),
          key       = decodeQueryParamPart(pair[0]),
          keyLength = key.length,
          isArray = false,
          value;
      if (pair.length === 1) {
        value = 'true';
      } else {
        //Handle arrays
        if (keyLength > 2 && key.slice(keyLength -2) === '[]') {
          isArray = true;
          key = key.slice(0, keyLength - 2);
          if(!queryParams[key]) {
            queryParams[key] = [];
          }
        }
        value = pair[1] ? decodeQueryParamPart(pair[1]) : '';
      }
      if (isArray) {
        queryParams[key].push(value);
      } else {
        queryParams[key] = value;
      }
    }
    return queryParams;
  },

  recognize: function(path) {
    var states = [ this.rootState ],
        pathLen, i, queryStart, queryParams = {},
        hashStart,
        isSlashDropped = false;

    hashStart = path.indexOf('#');
    if (hashStart !== -1) {
      path = path.substr(0, hashStart);
    }

    queryStart = path.indexOf('?');
    if (queryStart !== -1) {
      var queryString = path.substr(queryStart + 1, path.length);
      path = path.substr(0, queryStart);
      queryParams = this.parseQueryString(queryString);
    }

    if (path.charAt(0) !== "/") { path = "/" + path; }
    var originalPath = path;

    if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS) {
      path = normalizePath(path);
    } else {
      path = decodeURI(path);
      originalPath = decodeURI(originalPath);
    }

    pathLen = path.length;
    if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
      path = path.substr(0, pathLen - 1);
      originalPath = originalPath.substr(0, originalPath.length - 1);
      isSlashDropped = true;
    }

    for (i=0; i<path.length; i++) {
      states = recognizeChar(states, path.charAt(i));
      if (!states.length) { break; }
    }

    var solutions = [];
    for (i=0; i<states.length; i++) {
      if (states[i].handlers) { solutions.push(states[i]); }
    }

    states = sortSolutions(solutions);

    var state = solutions[0];

    if (state && state.handlers) {
      // if a trailing slash was dropped and a star segment is the last segment
      // specified, put the trailing slash back
      if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
         originalPath = originalPath + "/";
       }
      return findHandler(state, originalPath, queryParams);
    }
  }
};

RouteRecognizer.prototype.map = map;

RouteRecognizer.VERSION = '0.2.10';

// Set to false to opt-out of encoding and decoding path segments.
// See https://github.com/tildeio/route-recognizer/pull/55
RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = true;

RouteRecognizer.Normalizer = {
  normalizeSegment: normalizeSegment,
  normalizePath: normalizePath,
  encodePathSegment: encodePathSegment
};

return RouteRecognizer;

})));
