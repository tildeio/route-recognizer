import Normalizer from './route-recognizer/normalizer';
import RecognizeResults from './route-recognizer/recognize-results';
import SegmentTrieNode from './route-recognizer/segment-trie-node';
import { matcher } from './route-recognizer/segment-trie-node';
import { bind, isArray } from './route-recognizer/polyfills';

var normalizePath = Normalizer.normalizePath;
var normalizeSegment = Normalizer.normalizeSegment;

function decodeQueryParamPart(part) {
  // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
  part = part.replace(/\+/gm, '%20');
  var result;
  try {
    result = decodeURIComponent(part);
  } catch(error) {result = '';}
  return result;
}

function RouteRecognizer(serialized) {
  this.ENCODE_AND_DECODE_PATH_SEGMENTS = RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS;
  this.names = {};

  if (serialized) {
    this.compacted = true;
    this.nodes = new Array(serialized.nodes.length);

    for (var i = 0; i < serialized.nodes.length; i++) {
      if (!serialized.nodes[i]) { continue; }
      this.nodes[i] = new SegmentTrieNode(this, serialized.nodes[i]);
    }

    for (i = 0; i < serialized.nodes.length; i++) {
      if (!serialized.nodes[i]) { continue; }
      this.nodes[i].wire();
    }

    for (var x in serialized.names) {
      if (!serialized.names.hasOwnProperty(x)) { return; }
      this.names[x] = this.nodes[serialized.names[x]];
    }

    this.rootState = this.nodes[serialized.rootState];
  } else {
    this.compacted = false;
    this.nodes = [];
    this.rootState = new SegmentTrieNode(this, '');
  }
}

RouteRecognizer.prototype = {
  add: function(routes, options) {
    this.compacted = false;
    options = options || {};
    var leaf = this.rootState;

    // Go through each passed in route and call the matcher with it.
    for (var i = 0; i < routes.length; i++) {
      leaf = matcher('add').call(leaf, routes[i].path);
      leaf.to(routes[i].handler, undefined, 'add');
    }
    leaf.name = options.as;
    this.names[options.as] = leaf;
  },

  handlersFor: function(name) {
    var trieNode = this.names[name];

    if (!trieNode) { throw new Error("There is no route named " + name); }

    var handlers = [];

    do {
      if (trieNode.handler) {
        handlers.push({
          handler: trieNode.handler,
          names: []
        });
      }
    } while (trieNode = trieNode.parentNode);

    return handlers;
  },

  hasRoute: function(name) {
    return !!this.names[name];
  },

  generate: function(name, params) {
    if (!this.compacted) { this.rootState.compact(); this.compacted = true; }

    var output = "";
    var trieNode = this.names[name];

    if (!trieNode) { throw new Error("There is no route named " + name); }

    var segments = [];
    do {
      // `push` is much faster than `unshift`
      segments.push(trieNode);
    } while (trieNode = trieNode.parentNode);

    // But it does mean we have to iterate over these backward.
    for (var i = segments.length - 1; i >= 0; i--) {
      trieNode = segments[i];

      if (trieNode.type === 'static') {
        if (trieNode.value === '') { continue; }
        output += '/' + trieNode.value;        
      } else if (trieNode.type === 'param') {
        if (this.ENCODE_AND_DECODE_PATH_SEGMENTS) {
          output += '/' + encodeURIComponent(params[trieNode.value.substr(1)]);
        } else {
          output += '/' + params[trieNode.value.substr(1)];
        }
      } else if (trieNode.type === 'glob') {
        output += '/' + params[trieNode.value.substr(1)];
      } else {
        output += '/' + params[trieNode.value.substr(1)];        
      }
    }

    if (params && params.queryParams) {
      output += this.generateQueryString(params.queryParams);
    }

    // "/".charCodeAt(0) === 47
    if (output.charCodeAt(0) !== 47) {
      output = '/' + output;
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

  map: function(callback, addRouteCallback) {
    this.compacted = false;
    this.addRouteCallback = addRouteCallback;
    callback(bind(matcher(), this.rootState));
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
    if (!this.compacted) { this.rootState.compact(); this.compacted = true; }

    var hashStart = path.indexOf('#');
    if (hashStart !== -1) {
      path = path.substr(0, hashStart);
    }

    var queryString, queryParams;
    var queryStart = path.indexOf('?');
    if (queryStart !== -1) {
      queryString = path.substr(queryStart + 1, path.length);
      path = path.substr(0, queryStart);
      queryParams = this.parseQueryString(queryString);
    }

    // "/".charCodeAt(0) === 47
    if (path.charCodeAt(0) === 47) {
      path = path.substr(1);
    }

    if (this.ENCODE_AND_DECODE_PATH_SEGMENTS) {
      path = normalizePath(path);
    } else {
      path = decodeURI(path);
    }

    var handlers = new RecognizeResults(queryParams);
    var trieNode = this.rootState.walk(path, handlers, {});

    if (trieNode) {
      return handlers;
    } else {
      return null;
    }
  },

  toJSON: function() {
    if (!this.compacted) { this.rootState.compact(); this.compacted = true; }

    // Rebuild the names property as a series of ID references.
    var names = {};
    for (var x in this.names) {
      if (!this.names.hasOwnProperty(x)) { return; }
      names[x] = this.names[x].id;
    }

    // Could have unnecessary references after compacting.
    var parentsChildren = [];
    for (var i = 0; i < this.nodes.length; i++) {
      // Skip the root state.
      if (!this.nodes[i] || !this.nodes[i].parentNode) { continue; }

      // Reduce childNodes to a collection of IDs.
      parentsChildren = this.nodes[i].parentNode.childNodes.map(function(trieNode) { return trieNode.id; });

      // If we don't find it the current ID on the parent, drop it.
      if (!~parentsChildren.indexOf(this.nodes[i].id)) {
        this.nodes[i] = undefined;
      }
    }

    // Return an object which can be rehydrated.
    return {
      names: names,
      rootState: this.rootState.id,
      nodes: this.nodes
    };
  }
};

RouteRecognizer.VERSION = 'VERSION_STRING_PLACEHOLDER';

// Set to false to opt-out of encoding and decoding path segments.
// See https://github.com/tildeio/route-recognizer/pull/55
RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = true;

RouteRecognizer.Normalizer = Normalizer;

export default RouteRecognizer;
