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
  pop:   Array.prototype.pop,
  length: 0,
  queryParams: null
});

function isArray(test) {
  return Object.prototype.toString.call(test) === "[object Array]";
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

function matcher(path, callback) {
  var segments = path.replace(/^\//, '').split('/');
  segments = segments.map(function(segment) {
    return new SegmentTrieNode(segment);
  });

  var root = this;
  var leaf = segments.reduce(function(previous, current) {
    previous.append(current);
    return current;
  }, root);

  if (callback) {
    if (callback.length === 0) { throw new Error("You must have an argument in the function passed to `to`"); }
    callback(matcher.bind(leaf));
  }

  return leaf;
}

function SegmentTrieNode(value) {
  this.value = value;

  switch (this.value.charAt(0)) {
    case ':': this.type = 'param'; break;
    case '*': this.type = 'glob'; break;
    default: this.type = 'static'; break;
  }

  this.handler = undefined;
  this.childNodes = [];
}

SegmentTrieNode.prototype = {
  append: function(trieNode) {
    this.childNodes.push(trieNode);
    trieNode.parentNode = this;
    return this;
  },

  compact: function() {
    if (this.childNodes.length === 0) { return; }

    // Depth-first compaction.
    this.childNodes.forEach(function(trieNode) {
      trieNode.compact();
    });

    // Collapse sibling nodes.
    this.childNodes = this.childNodes.filter(function(trieNode, index, siblingNodes) {
      var segmentSeen = false;

      // Scan only segments before this one to see if we've already got a match.
      for (var i = 0; i < index && segmentSeen === false; i++) {
        segmentSeen = (
          siblingNodes[i].value === trieNode.value &&
          siblingNodes[i].handler === trieNode.handler
        );
      }

      if (segmentSeen) {
        var targetNode = siblingNodes[i-1];

        // Reset the parentNode for each trieNode to the targetNode.
        trieNode.childNodes.forEach(function(trieNode) {
          trieNode.parentNode = targetNode;
        });

        // Concat the childNodes of the active trieNode with the targetNode.
        targetNode.childNodes = targetNode.childNodes.concat(trieNode.childNodes);

        // Then re-compact the joined trie.
        targetNode.compact();
      }

      return !segmentSeen;
    });

    this.childNodes.sort(function(a, b) {
      var ascore, bscore;
      switch (a.type) {
        case "static": ascore = 0; break;
        case "param": ascore = 1; break;
        case "glob": ascore = 2; break;
      }
      switch (b.type) {
        case "static": bscore = 0; break;
        case "param": bscore = 1; break;
        case "glob": bscore = 2; break;
      }

      return ascore > bscore;
    });
  },

  to: function(handler, callback) {
    this.handler = handler;
    if (callback) {
      if (callback.length === 0) { throw new Error("You must have an argument in the function passed to `to`"); }
      callback(matcher.bind(this));
    }
    return this;
  },

  /**
    Our goal is to try and match based upon the node type. For non-globbing
    routes we can simply pop a segment off of the path and continue, eliminating
    entire branches as we go. Average number of comparisons is:
      `Number of Trie Nodes / Average Depth / 2`

    If we reach a globbing route we have to change strategy and traverse to all
    descendent leaf nodes until we find a match. As we traverse we build up a
    regular expression that would match beginning with that globbing route. We
    leverage the regular expression to handle the mechanics of greedy pattern
    matching with back-tracing. The average number of comparisons beyond a
    globbing route:
      `Number of Trie Nodes / 2`

    This could be optimized further to do O(1) matching for non-globbing
    segments but that is overkill for this use case.
  */
  walk: function(path, handlers, params, regexPieces) {
    var isLeafNode = (this.childNodes.length === 0);
    var nodeMatches = false;
    var nextNode = this;
    var consumed = false;
    var segmentIndex = 0;

    // Identify the node type so we know how to match it.
    switch (this.type) {
      case "static":
        if (regexPieces) {
          // If we're descended from a globbing route.
          regexPieces.push(this.value);
        } else {
          // Matches if the path to recognize is identical to the node value.
          segmentIndex = this.value.length;
          nodeMatches = path.indexOf(this.value) === 0;
          if (nodeMatches) {
            path = path.substring(segmentIndex);
            if (path.indexOf('/') === 0) {
              path = path.substr(1);
            }
          }
        }
      break;
      case "param":
        if (regexPieces) {
          // If we're descended from a globbing route.
          regexPieces.push('([^/]+)');
          params[this.value.substring(1)] = { regex: true, index: regexPieces.length};
        } else {
          // Valid for '/' to not appear, or appear anywhere but the 0th index.
          // 0 length or 0th index would result in an non-matching empty param.
          segmentIndex = path.indexOf('/');
          if (segmentIndex === -1) { segmentIndex = path.length; }

          nodeMatches = (path.length > 0 && segmentIndex > 0);
          if (nodeMatches) {
            params[this.value.substring(1)] = path.substr(0, segmentIndex);
            path = path.substring(segmentIndex + 1);
          }
        }
      break;
      case "glob":
        // We can no longer do prefix matching. Prepare to traverse leaves.

        // It's possible to have multiple globbing routes in a single path.
        // So maybe we already have a `regexPieces` array.
        if (!regexPieces) { regexPieces = []; }

        if (isLeafNode) {
          // If a glob is the leaf node we don't match a trailing slash.
          regexPieces.push('(.+)(?:/?)');
        } else {
          // Consume the segment. `regexPieces.join` adds the '/'.
          regexPieces.push('(.+)');
        }
        params[this.value.substring(1)] = { regex: true, index: regexPieces.length};
      break;
    }

    // Short-circuit for nodes that can't possibly match.
    if (!nodeMatches && !regexPieces) { return false; }

    if (this.handler) {
      handlers.push({
        handler: this.handler,
        params: params,
        isDynamic: (this.type !== "static")
      });
    }

    var nextParams = this.handler ? {} : params;

    // Depth-first traversal of childNodes. No-op for leaf nodes.
    for (var i = 0; i < this.childNodes.length; i++) {
      nextNode = this.childNodes[i].walk(path, handlers, nextParams, regexPieces);

      // Stop traversing once we have a match since we're sorted by specificity.
      if (!!nextNode) { break; }
    }

    // If we're at a leaf node find out if we've consumed the entire path.
    if (isLeafNode) {
      if (regexPieces) {
        var myregex = new RegExp('^'+regexPieces.join('/')+'$');
        var matches = myregex.exec(path);
        consumed = !!matches;
  
        if (consumed) {
          // Need to move matches to the correct params location.
          for (var j = 0; j < handlers.length; j++) {
            for (var x in handlers[i].params) {
              if (handlers[i].params[x].regex) {
                handlers[i].params[x] = matches[handlers[i].params[x].index];
              }
            }
          }
        } else {
          // We pushed a segment onto the regexPieces, but this wasn't a match.
          // Pop it back off for the next go-round.
          regexPieces.pop();
        }
      } else {
        consumed = (path.length === 0);
      }
    }

    // `consumed` is false unless set above.
    if (isLeafNode && !consumed) {
      if (this.handler) { handlers.pop(); }
      return false;
    } else {
      return nextNode;
    }
  }
};

function RouteRecognizer(serialized) {
  this.names = {};
  this.compacted = false;
  this.rootState = new SegmentTrieNode('');
}

RouteRecognizer.prototype = {
  add: function(routes, options) {
    this.compacted = false;
    options = options || {};
    var route;
    var leaf = this.rootState;
    while (routes.length) {
      route = routes.shift();
      leaf = matcher.bind(leaf)(route.path);
      leaf.to(route.handler);
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
        handlers.push(trieNode.handler);
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
      segments.unshift(trieNode);
    } while (trieNode = trieNode.parentNode);

    for (var i = 0; i < segments.length; i++) {
      trieNode = segments[i];

      switch (trieNode.type) {
        case "static":
          if (trieNode.value === '') { continue; }
          output += '/' + trieNode.value;
        break;
        case "param":
        case "glob":
          output += '/' + params[trieNode.value.substr(1)];
        break;
      }
    }

    if (params && params.queryParams) {
      output += this.generateQueryString(params.queryParams);
    }

    if (output.indexOf('/') !== 0) {
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
    callback(matcher.bind(this.rootState));
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

    var queryString, queryParams;
    var queryStart = path.indexOf('?');

    if (queryStart !== -1) {
      queryString = path.substr(queryStart + 1, path.length);
      path = path.substr(0, queryStart);
      queryParams = this.parseQueryString(queryString);
    }

    path = decodeURI(path);
    if (path.indexOf('/') === 0) {
      path = path.substr(1);
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
  }
};

RouteRecognizer.VERSION = 'VERSION_STRING_PLACEHOLDER';

export default RouteRecognizer;
