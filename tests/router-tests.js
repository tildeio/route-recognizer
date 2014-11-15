/* globals RouteRecognizer,QUnit */

import RouteRecognizer from 'route-recognizer';

var router;

function resultsMatch(results, array, queryParams) {
  deepEqual(results.slice(), array);
  if (queryParams) {
    deepEqual(queryParams, results.queryParams);
  }
}

module("The match DSL", {
  setup: function() {
    router = new RouteRecognizer();
  }
});

var matchesRoute = function(path, expected) {
  var actual = router.recognize(path);
  resultsMatch(actual, expected);
};

test("supports multiple calls to match", function() {
  router.map(function(match) {
    match("/posts/new").to("newPost");
    match("/posts/:id").to("showPost");
    match("/posts/edit").to("editPost");
  });

  matchesRoute("/posts/new", [{ handler: "newPost", params: {}, isDynamic: false }]);
  matchesRoute("/posts/1", [{ handler: "showPost", params: { id: "1" }, isDynamic: true }]);
  matchesRoute("/posts/edit", [{ handler: "editPost", params: {}, isDynamic: false }]);
});

test("supports multiple calls to match with query params", function() {
  router.map(function(match) {
    match("/posts/new").to("newPost");
    match("/posts/:id").to("showPost");
    match("/posts/edit").to("editPost");
  });

  matchesRoute("/posts/new?foo=1&bar=2", [{ handler: "newPost", params: {}, isDynamic: false }], {foo: '1', bar: '2'});
  matchesRoute("/posts/1?baz=3", [{ handler: "showPost", params: { id: "1" }, isDynamic: true }], {baz: '3'});
  matchesRoute("/posts/edit", [{ handler: "editPost", params: {}, isDynamic: false }], {});
});

test("supports nested match", function() {
  router.map(function(match) {
    match("/posts", function(match) {
      match("/new").to("newPost");
      match("/:id").to("showPost");
      match("/edit").to("editPost");
    });
  });

  matchesRoute("/posts/new", [{ handler: "newPost", params: {}, isDynamic: false }]);
  matchesRoute("/posts/1", [{ handler: "showPost", params: { id: "1" }, isDynamic: true }]);
  matchesRoute("/posts/edit", [{ handler: "editPost", params: {}, isDynamic: false }]);
});

test("supports nested match with query params", function() {
  router.map(function(match) {
    match("/posts", function(match) {
      match("/new").to("newPost");
      match("/:id").to("showPost");
      match("/edit").to("editPost");
    });
  });

  matchesRoute("/posts/new?foo=1&bar=2", [{ handler: "newPost", params: {}, isDynamic: false }], {foo: '1', bar: '2'});
  matchesRoute("/posts/1?baz=3", [{ handler: "showPost", params: { id: "1" }, isDynamic: true }], {baz: '3'});
  matchesRoute("/posts/edit", [{ handler: "editPost", params: {}, isDynamic: false }], {});
});

test("not passing a function with `match` as a parameter raises", function() {
  QUnit.throws(function() {
    router.map(function(match) {
      match("/posts").to("posts", function() {

      });
    });
  });
});

test("supports nested handlers", function() {
  router.map(function(match) {
    match("/posts").to("posts", function(match) {
      match("/new").to("newPost");
      match("/:id").to("showPost");
      match("/edit").to("editPost");
    });
  });

  matchesRoute("/posts/new", [{ handler: "posts", params: {}, isDynamic: false }, { handler: "newPost", params: {}, isDynamic: false }]);
  matchesRoute("/posts/1", [{ handler: "posts", params: {}, isDynamic: false }, { handler: "showPost", params: { id: "1" }, isDynamic: true }]);
  matchesRoute("/posts/edit", [{ handler: "posts", params: {}, isDynamic: false }, { handler: "editPost", params: {}, isDynamic: false }]);
});

test("supports deeply nested handlers", function() {
  router.map(function(match) {
    match("/posts").to("posts", function(match) {
      match("/new").to("newPost");
      match("/:id").to("showPost", function(match) {
        match("/index").to("postIndex");
        match("/comments").to("postComments");
      });
      match("/edit").to("editPost");
    });
  });

  matchesRoute("/posts/new", [{ handler: "posts", params: {}, isDynamic: false }, { handler: "newPost", params: {}, isDynamic: false }]);
  matchesRoute("/posts/1/index", [{ handler: "posts", params: {}, isDynamic: false }, { handler: "showPost", params: { id: "1" }, isDynamic: true }, { handler: "postIndex", params: {}, isDynamic: false }]);
  matchesRoute("/posts/1/comments", [{ handler: "posts", params: {}, isDynamic: false }, { handler: "showPost", params: { id: "1" }, isDynamic: true }, { handler: "postComments", params: {}, isDynamic: false }]);
  matchesRoute("/posts/ne/comments", [{ handler: "posts", params: {}, isDynamic: false }, { handler: "showPost", params: { id: "ne" }, isDynamic: true }, { handler: "postComments", params: {}, isDynamic: false }]);
  matchesRoute("/posts/edit", [{ handler: "posts", params: {}, isDynamic: false }, { handler: "editPost", params: {}, isDynamic: false }]);
});

test("supports index-style routes", function() {
  router.map(function(match) {
    match("/posts").to("posts", function(match) {
      match("/new").to("newPost");
      match("/:id").to("showPost", function(match) {
        match("/").to("postIndex");
        match("/comments").to("postComments");
      });
      match("/edit").to("editPost");
    });
  });

  matchesRoute("/posts/new", [{ handler: "posts", params: {}, isDynamic: false }, { handler: "newPost", params: {}, isDynamic: false }]);
  matchesRoute("/posts/1", [{ handler: "posts", params: {}, isDynamic: false }, { handler: "showPost", params: { id: "1" }, isDynamic: true }, { handler: "postIndex", params: {}, isDynamic: false }]);
  matchesRoute("/posts/1/comments", [{ handler: "posts", params: {}, isDynamic: false }, { handler: "showPost", params: { id: "1" }, isDynamic: true }, { handler: "postComments", params: {}, isDynamic: false }]);
  matchesRoute("/posts/edit", [{ handler: "posts", params: {}, isDynamic: false }, { handler: "editPost", params: {}, isDynamic: false }]);
});

test("supports single `/` routes", function() {
  router.map(function(match) {
    match("/").to("posts");
  });

  matchesRoute("/", [{ handler: "posts", params: {}, isDynamic: false }]);
});

test("supports star routes", function() {
  router.map(function(match) {
    match("/").to("posts");
    match("/*everything").to("404");
  });

  //randomly generated strings
  ['w6PCXxJn20PCSievuP', 'v2y0gaByxHjHYJw0pVT1TeqbEJLllVq-3', 'DFCR4rm7XMbT6CPZq-d8AU7k', 'd3vYEg1AoYaPlM9QbOAxEK6u/H_S-PYH1aYtt'].forEach(function(r) {
    matchesRoute("/" + r, [{ handler: "404", params: {everything: r}, isDynamic: true}]);
  });
});

test("star route does not swallow trailing `/`", function() {
  var r;
  
  router.map(function(match) {
    match("/").to("posts");
    match("/*everything").to("glob");
  });

  r = "folder1/folder2/folder3/";
  matchesRoute("/" + r, [{ handler: "glob", params: {everything: r}, isDynamic: true}]);
});

test("support star route before other segment", function() {
  router.map(function(match) {
    match("/*everything/:extra").to("glob");
  });

  ["folder1/folder2/folder3//the-extra-stuff/", "folder1/folder2/folder3//the-extra-stuff"].forEach(function(r) {
    matchesRoute("/" + r, [{ handler: "glob", params: {everything: "folder1/folder2/folder3/", extra: "the-extra-stuff"}, isDynamic: true}]);  
  });
});

test("support nested star route", function() {
  router.map(function(match) {
    match("/*everything").to("glob", function(match){
      match("/:extra").to("extra");
    });
  });

  ["folder1/folder2/folder3//the-extra-stuff/", "folder1/folder2/folder3//the-extra-stuff"].forEach(function(r) {
    matchesRoute("/" + r, [{ handler: "glob", params: {everything: "folder1/folder2/folder3/"}, isDynamic: true}, { handler: "extra", params: {extra: "the-extra-stuff"}, isDynamic: true}]);
  });
});

test("calls a delegate whenever a new context is entered", function() {
  var passedArguments = [];

  router.delegate = {
    contextEntered: function(name, match) {
      ok(match instanceof Function, "The match is a function");
      match("/").to("index");
      passedArguments.push(name);
    }
  };

  router.map(function(match) {
    match("/").to("application", function(match) {
      match("/posts").to("posts", function(match) {
        match("/:post_id").to("post");
      });
    });
  });

  deepEqual(passedArguments, ["application", "posts"], "The entered contexts were passed to contextEntered");

  matchesRoute("/posts", [{ handler: "application", params: {}, isDynamic: false }, { handler: "posts", params: {}, isDynamic: false }, { handler: "index", params: {}, isDynamic: false }]);
});

test("delegate can change added routes", function() {
  router.delegate = {
    willAddRoute: function(context, route) {
      if (!context) { return route; }
      context = context.split('.').slice(-1)[0];
      return context + "." + route;
    },

    // Test that both delegates work together
    contextEntered: function(name, match) {
      match("/").to("index");
    }
  };

  router.map(function(match) {
    match("/").to("application", function(match) {
      match("/posts").to("posts", function(match) {
        match("/:post_id").to("post");
      });
    });
  });

  matchesRoute("/posts", [{ handler: "application", params: {}, isDynamic: false }, { handler: "application.posts", params: {}, isDynamic: false }, { handler: "posts.index", params: {}, isDynamic: false }]);
  matchesRoute("/posts/1", [{ handler: "application", params: {}, isDynamic: false }, { handler: "application.posts", params: {}, isDynamic: false }, { handler: "posts.post", params: { post_id: "1" }, isDynamic: true }]);
});

test("supports add-route callback", function() {

  var called = false;

  router.map(function(match) {
    match("/posts/new").to("newPost");
  }, function (router, route) {
    router.add(route);
  });

  router.map(function(match) {
    match("/posts/edit").to("showPost");
  }, function () {
    called = true;
  });

  matchesRoute("/posts/new", [{ handler: "newPost", params: {}, isDynamic: false }]);
  ok(called, "The add-route callback was called.");
});

