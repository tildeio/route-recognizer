(function() {
    "use strict";
    var $$route$recognizer$normalizer$$PERCENT_ENCODED_VALUES = /%[a-fA-F0-9]{2}/g;

    function $$route$recognizer$normalizer$$toUpper(str) { return str.toUpperCase(); }

    // Turn percent-encoded values to upper case ("%3a" -> "%3A")
    function $$route$recognizer$normalizer$$percentEncodedValuesToUpper(string) {
      return string.replace($$route$recognizer$normalizer$$PERCENT_ENCODED_VALUES, $$route$recognizer$normalizer$$toUpper);
    }

    // Normalizes percent-encoded values to upper-case and decodes percent-encoded
    // values that are not reserved (like unicode characters).
    // Safe to call multiple times on the same path.
    function $$route$recognizer$normalizer$$normalizePath(path) {
      return path.split('/')
                 .map($$route$recognizer$normalizer$$normalizeSegment)
                 .join('/');
    }

    function $$route$recognizer$normalizer$$percentEncode(char) {
      return '%' + $$route$recognizer$normalizer$$charToHex(char);
    }

    function $$route$recognizer$normalizer$$charToHex(char) {
      return char.charCodeAt(0).toString(16).toUpperCase();
    }

    // Decodes percent-encoded values in the string except those
    // characters in `reservedHex`, where `reservedHex` is an array of 2-character
    // percent-encodings
    function $$route$recognizer$normalizer$$decodeURIComponentExcept(string, reservedHex) {
      if (string.indexOf('%') === -1) {
        // If there is no percent char, there is no decoding that needs to
        // be done and we exit early
        return string;
      }
      string = $$route$recognizer$normalizer$$percentEncodedValuesToUpper(string);

      var result = '';
      var buffer = '';
      var idx = 0;
      while (idx < string.length) {
        var pIdx = string.indexOf('%', idx);

        if (pIdx === -1) { // no percent char
          buffer += string.slice(idx);
          break;
        } else { // found percent char
          buffer += string.slice(idx, pIdx);
          idx = pIdx + 3;

          var hex = string.slice(pIdx + 1, pIdx + 3);
          var encoded = '%' + hex;

          if (reservedHex.indexOf(hex) === -1) {
            // encoded is not in reserved set, add to buffer
            buffer += encoded;
          } else {
            result += decodeURIComponent(buffer);
            buffer = '';
            result += encoded;
          }
        }
      }
      result += decodeURIComponent(buffer);
      return result;
    }

    // Leave these characters in encoded state in segments
    var $$route$recognizer$normalizer$$reservedSegmentChars = ['%', '/'];
    var $$route$recognizer$normalizer$$reservedHex = $$route$recognizer$normalizer$$reservedSegmentChars.map($$route$recognizer$normalizer$$charToHex);

    function $$route$recognizer$normalizer$$normalizeSegment(segment) {
      return $$route$recognizer$normalizer$$decodeURIComponentExcept(segment, $$route$recognizer$normalizer$$reservedHex);
    }

    var $$route$recognizer$normalizer$$Normalizer = {
      normalizeSegment: $$route$recognizer$normalizer$$normalizeSegment,
      normalizePath: $$route$recognizer$normalizer$$normalizePath
    };

    var $$route$recognizer$normalizer$$default = $$route$recognizer$normalizer$$Normalizer;
    var $$route$recognizer$polyfills$$oCreate = Object.create || function(proto) {
      function F() {}
      F.prototype = proto;
      return new F();
    };

    function $$route$recognizer$polyfills$$bind(fn, scope) {
      return function() {
        return fn.apply(scope, arguments);
      };
    }

    function $$route$recognizer$polyfills$$isArray(test) {
      return Object.prototype.toString.call(test) === "[object Array]";
    }

    // This object is the accumulator for handlers when recognizing a route.
    // It's nothing more than an array with a bonus property.
    function $$route$recognizer$recognize$results$$RecognizeResults(queryParams) {
      this.queryParams = queryParams || {};
    }
    $$route$recognizer$recognize$results$$RecognizeResults.prototype = $$route$recognizer$polyfills$$oCreate({
      splice: Array.prototype.splice,
      slice:  Array.prototype.slice,
      push:   Array.prototype.push,
      pop:    Array.prototype.pop,
      length: 0,
      queryParams: null
    });

    var $$route$recognizer$recognize$results$$default = $$route$recognizer$recognize$results$$RecognizeResults;

    var $$route$recognizer$segment$trie$node$$normalizePath = $$route$recognizer$normalizer$$default.normalizePath;

    var $$route$recognizer$segment$trie$node$$router;

    /**
      Matcher is just a clever recursive function that 
     */
    function $$route$recognizer$segment$trie$node$$matcher(source) {
      return function(path, callback) {
        var leaf;
        if (source === 'map' && this === this.router.rootState) {
          $$route$recognizer$segment$trie$node$$router = this.router;
          leaf = new $$route$recognizer$segment$trie$node$$SegmentTrieNode({ addRouteCallback: true, nodes: [] }, '');
        } else {
          leaf = this;
        }

        var segments = path.replace(/^\//, '').split('/');

        // As we're adding segments we need to track the current leaf.
        for (var i = 0; i < segments.length; i++) {
          segments[i] = new $$route$recognizer$segment$trie$node$$SegmentTrieNode(this.router, segments[i]);

          leaf.append(segments[i]);
          leaf = segments[i];
        }

        if (callback) {
          // No handler, delegate back to the TrieNode's `to` method.
          leaf.to(undefined, callback, source);
        }

        return leaf;
      };
    }

    /**
    SegmentTrieNode is simply a radix trie where each radix
    corresponds to a path segment in the RouteRecognizer microsyntax.
    */
    function $$route$recognizer$segment$trie$node$$SegmentTrieNode(router, value) {
      var normalized;

      // Maintain a reference to the router so we can grab serialized
      // nodes off of it in case we're not fully initialized.
      this.router = router;

      // `value` is either a string or a serialized SegmentTrieNode.
      if (typeof value === 'string') {
        this.id = router.nodes.push(this) - 1;
        this.value = value;
        this.originalValue = undefined;

        switch (this.value.charCodeAt(0)) {
          case 58: this.type = 'param'; break; // : => 58
          case 42: this.type = 'glob'; break; // * => 42
          default:
            this.type = 'static';
            normalized = $$route$recognizer$segment$trie$node$$normalizePath(this.value);
            // We match against a normalized value.
            // Keep the original value for error messaging.
            if (normalized !== this.value) {
              this.originalValue = this.value;
              this.value = normalized;
            }
          break;
        }

        this.handler = undefined;
        this.childNodes = [];
        this.parentNode = undefined;    
      } else {
        this.id = value.id;
        this.value = value.value;
        this.originalValue = value.originalValue;
        this.type = value.type;
        this.handler = value.handler;
        this.childNodes = value.childNodes || [];
        this.parentNode = value.parentNode;
      }
    }

    $$route$recognizer$segment$trie$node$$SegmentTrieNode.prototype = {

      // Naively add a new child to the current trie node.
      append: function(trieNode) {
        this.childNodes.push(trieNode);
        trieNode.parentNode = this;
        return this;
      },

      // Reduce the amount of space which is needed to represent the
      // radix trie by collapsing common prefixes.
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

        // Sort nodes to get an approximation of specificity.
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

      // Can't just blindly return itself.
      // Minimizes individual object size.
      // Only called at build time.
      toJSON: function() {
        var childNodeCount = this.childNodes.length;

        var result = {
          id: this.id,
          type: this.type,
          value: this.value,
          handler: this.handler,
        };

        if (this.originalValue) {
          result.originalValue = this.originalValue;
        }

        if (this.handler) {
          result.handler = this.handler;
        }

        // Set up parentNode reference.
        if (this.parentNode) {
          result.parentNode = this.parentNode.id;
        }

        // Set up childNodes references.
        if (childNodeCount) {
          result.childNodes = new Array(childNodeCount);
          for (var i = 0; i < childNodeCount; i++) {
            result.childNodes[i] = this.childNodes[i].id;
          }
        }

        return result;
      },

      /**
        Binds a handler to this trie node.
        If it receives a callback it will continue matching.
        @public
       */
      to: function(handler, callback, source) {
        this.handler = handler;

        if (handler && this.router.addRouteCallback && source !== 'add') {
          var routes = [];
          var trieNode = this;
          var current = {
            path: '/' + trieNode.value,
            handler: trieNode.handler
          };

          while (trieNode = trieNode.parentNode) {
            if (trieNode.handler) {
              if (current) {
                routes.unshift(current);
                current = {
                  path: '/' + trieNode.value,
                  handler: trieNode.handler
                };
              } else {
                current.path = trieNode.value === '' ? current.path : '/' + trieNode.value + current.path;
              }
            } else {
              current.path = trieNode.value === '' ? current.path : '/' + trieNode.value + current.path;
            }
          }

          routes.unshift(current);
          this.router.addRouteCallback($$route$recognizer$segment$trie$node$$router, routes);
        }

        if (callback) {
          if (callback.length === 0) { throw new Error("You must have an argument in the function passed to `to`"); }
          callback($$route$recognizer$polyfills$$bind($$route$recognizer$segment$trie$node$$matcher(source), this));
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
        var isTerminalNode = this.handler;
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

                // "/".charCodeAt(0) === 47
                if (path.charCodeAt(0) === 47) {
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
                if (this.router.ENCODE_AND_DECODE_PATH_SEGMENTS) {
                  params[this.value.substring(1)] = decodeURIComponent(path.substr(0, segmentIndex));
                } else {
                  params[this.value.substring(1)] = path.substr(0, segmentIndex);
                }
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

        // If we're at a terminal node find out if we've consumed the entire path.
        if (isTerminalNode) {
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
      },

      wire: function() {
        this.parentNode = this.router.nodes[this.parentNode];
        for (var i = 0; i < this.childNodes.length; i++) {
          this.childNodes[i] = this.router.nodes[this.childNodes[i]];
        }
      }
    };

    var $$route$recognizer$segment$trie$node$$default = $$route$recognizer$segment$trie$node$$SegmentTrieNode;

    var $$route$recognizer$$normalizePath = $$route$recognizer$normalizer$$default.normalizePath;
    var $$route$recognizer$$normalizeSegment = $$route$recognizer$normalizer$$default.normalizeSegment;

    function $$route$recognizer$$decodeQueryParamPart(part) {
      // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
      part = part.replace(/\+/gm, '%20');
      var result;
      try {
        result = decodeURIComponent(part);
      } catch(error) {result = '';}
      return result;
    }

    function $$route$recognizer$$RouteRecognizer(serialized) {
      this.ENCODE_AND_DECODE_PATH_SEGMENTS = $$route$recognizer$$RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS;
      this.names = {};

      if (serialized) {
        this.compacted = true;
        this.nodes = new Array(serialized.nodes.length);

        for (var i = 0; i < serialized.nodes.length; i++) {
          if (!serialized.nodes[i]) { continue; }
          this.nodes[i] = new $$route$recognizer$segment$trie$node$$default(this, serialized.nodes[i]);
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
        this.rootState = new $$route$recognizer$segment$trie$node$$default(this, '');
      }
    }

    $$route$recognizer$$RouteRecognizer.prototype = {
      add: function(routes, options) {
        this.compacted = false;
        options = options || {};
        var leaf = this.rootState;

        // Go through each passed in route and call the matcher with it.
        for (var i = 0; i < routes.length; i++) {
          leaf = $$route$recognizer$segment$trie$node$$matcher('add').call(leaf, routes[i].path);
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

        return handlers.reverse();
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
          if ($$route$recognizer$polyfills$$isArray(value)) {
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
        callback($$route$recognizer$polyfills$$bind($$route$recognizer$segment$trie$node$$matcher('map'), this.rootState));
      },

      parseQueryString: function(queryString) {
        var pairs = queryString.split("&"), queryParams = {};
        for(var i=0; i < pairs.length; i++) {
          var pair      = pairs[i].split('='),
              key       = $$route$recognizer$$decodeQueryParamPart(pair[0]),
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
            value = pair[1] ? $$route$recognizer$$decodeQueryParamPart(pair[1]) : '';
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
          path = $$route$recognizer$$normalizePath(path);
        } else {
          path = decodeURI(path);
        }

        var handlers = new $$route$recognizer$recognize$results$$default(queryParams);
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

    $$route$recognizer$$RouteRecognizer.VERSION = '0.1.11';

    // Set to false to opt-out of encoding and decoding path segments.
    // See https://github.com/tildeio/route-recognizer/pull/55
    $$route$recognizer$$RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = true;

    $$route$recognizer$$RouteRecognizer.Normalizer = $$route$recognizer$normalizer$$default;

    var $$route$recognizer$$default = $$route$recognizer$$RouteRecognizer;

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define('route-recognizer', function() { return $$route$recognizer$$default; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = $$route$recognizer$$default;
    } else if (typeof this !== 'undefined') {
      this['RouteRecognizer'] = $$route$recognizer$$default;
    }
}).call(this);

//# sourceMappingURL=route-recognizer.js.map