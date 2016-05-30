import Normalizer from './normalizer';
import { bind, isArray } from './polyfills';

var normalizePath = Normalizer.normalizePath;

var router;

/**
  Matcher is just a clever recursive function that 
 */
function matcher(source) {
  return function(path, callback) {
    var leaf;
    if (source === 'map' && this === this.router.rootState) {
      router = this.router;
      leaf = new SegmentTrieNode({ addRouteCallback: true, nodes: [] }, '');
    } else {
      leaf = this;
    }

    var segments = path.replace(/^\//, '').split('/');

    // As we're adding segments we need to track the current leaf.
    for (var i = 0; i < segments.length; i++) {
      segments[i] = new SegmentTrieNode(this.router, segments[i]);

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
function SegmentTrieNode(router, value) {
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
        normalized = normalizePath(this.value);
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

SegmentTrieNode.prototype = {

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
      this.router.addRouteCallback(router, routes);
    }

    if (callback) {
      if (callback.length === 0) { throw new Error("You must have an argument in the function passed to `to`"); }
      callback(bind(matcher(source), this));
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

export { matcher };
export default SegmentTrieNode;