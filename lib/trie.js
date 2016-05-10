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
        // Blindly concat the trie nodes, and re-compact the joined trieNode.
        siblingNodes[i-1].childNodes = siblingNodes[i-1].childNodes.concat(trieNode.childNodes);
        siblingNodes[i-1].compact();
      }

      return !segmentSeen;
    });

    // TODO: Sort dynamic segments and globs.
  },
  to: function(handler, callback) {
    this.handler = handler;
    if (callback) {
      callback(matcher.bind(this));
    }
    return this;
  }
};

function RouteRecognizer(serialized) {}
RouteRecognizer.prototype = {
  add: function(routes, options) {
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
  },

  generate: function(name, params) {
  },

  generateQueryString: function(params, handlers) {
  },

  map: function(callback, addRouteCallback) {
    this.rootState = new SegmentTrieNode();
    callback(matcher.bind(this.rootState));
    this.rootState.compact();
  },

  parseQueryString: function(queryString) {
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

console.log(util.inspect(a.rootState, false, null));