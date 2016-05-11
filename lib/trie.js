const util = require('util');

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
    callback(matcher.bind(leaf));
  }

  return leaf;
}

function SegmentTrieNode(path) {
  this.value = path;
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

        // Blindly concat the childNodes of the active trieNode with the targetNode.
        targetNode.childNodes = targetNode.childNodes.concat(trieNode.childNodes);

        // Then re-compact the joined trie.
        targetNode.compact();
      }

      return !segmentSeen;
    });

    // FIXME: Sort dynamic segments and globs.
  },

  to: function(handler, callback) {
    this.handler = handler;
    if (callback) {
      callback(matcher.bind(this));
    }
    return this;
  }
};

function RouteRecognizer(serialized) {
  this.names = {};
  this.rootState = new SegmentTrieNode();
}

RouteRecognizer.prototype = {
  add: function(routes, options) {
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
    this.rootState.compact();
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
    callback(matcher.bind(this.rootState));
    this.rootState.compact();
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
  },

  toJSON: function() {
  }
};

var a = new RouteRecognizer();

// These are different branches:
a.map(function(match) {
  match("/posts", function(match) {
    match("/new", function(match) {
      match("asdf").to('asdf');
    });
    match("/:id").to("showPost");
    match("/edit").to("editPost");
  });
  match("/posts/new").to("newPost");
  match("/posts/:id").to("showPost");
  match("/posts/edit").to("editPost");

  match("/posts").to("posts", function(match) {
    match("/new").to("newPost");
    match("/:id").to("showPost");
    match("/edit").to("editPost");
  });
  match("/posts").to("posts", function(match) {
    match("/4").to("4");
    match("/5").to("5");
    match("/6").to("6");
  });
  match("/posts/4").to("newPost");
  match("/posts/5").to("showPost");
  match("/posts/6").to("editPost");
});

a.add([{ path: "/foo/bar", handler: "fooBar"}, { path: "/baz/bat", handler: "bazBat"}], { as: "foo" });

console.log(util.inspect(a.rootState, false, null));
console.log(util.inspect(a.handlersFor('foo'), false, null));

module.exports = RouteRecognizer;