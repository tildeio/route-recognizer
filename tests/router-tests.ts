/* globals RouteRecognizer,QUnit */

import RouteRecognizer, { Results, Result, QueryParams } from "route-recognizer";

let router: RouteRecognizer;

function resultsMatch(assert: Assert, results: Results | undefined, array: Result[], queryParams?: QueryParams) {
  assert.deepEqual(results && results.slice(), array);
  if (queryParams) {
    assert.deepEqual(results && results.queryParams, queryParams);
  }
}

function matchesRoute(assert: Assert, path: string, expected: Result[], queryParams?: QueryParams) {
  let actual = router.recognize(path);
  resultsMatch(assert, actual, expected, queryParams);
}

QUnit.module("The match DSL", hooks => {
  hooks.beforeEach(() => {
    router = new RouteRecognizer();
  });

  QUnit.test("supports multiple calls to match", (assert) => {
    router.map(function(match) {
      match("/posts/new").to("newPost");
      match("/posts/:id").to("showPost");
      match("/posts/edit").to("editPost");
    });

    matchesRoute(assert, "/posts/new", [{ handler: "newPost", params: {}, isDynamic: false, metadata: undefined }]);
    matchesRoute(assert, "/posts/1", [{ handler: "showPost", params: { id: "1" }, isDynamic: true, metadata: undefined }]);
    matchesRoute(assert, "/posts/edit", [{ handler: "editPost", params: {}, isDynamic: false, metadata: undefined }]);
  });

  QUnit.test("supports multiple calls to match with query params", (assert: Assert) => {
    router.map(function(match) {
      match("/posts/new").to("newPost");
      match("/posts/:id").to("showPost");
      match("/posts/edit").to("editPost");
    });

    matchesRoute(assert, "/posts/new?foo=1&bar=2", [{ handler: "newPost", params: {}, isDynamic: false, metadata: undefined }], {foo: "1", bar: "2"});
    matchesRoute(assert, "/posts/1?baz=3", [{ handler: "showPost", params: { id: "1" }, isDynamic: true, metadata: undefined }], {baz: "3"});
    matchesRoute(assert, "/posts/edit", [{ handler: "editPost", params: {}, isDynamic: false, metadata: undefined }], {});
  });

  QUnit.test("supports nested match", (assert: Assert) => {
    router.map(function(match) {
      match("/posts", function(match) {
        match("/new").to("newPost");
        match("/:id").to("showPost");
        match("/edit").to("editPost");
      });
    });

    matchesRoute(assert, "/posts/new", [{ handler: "newPost", params: {}, isDynamic: false, metadata: undefined }]);
    matchesRoute(assert, "/posts/1", [{ handler: "showPost", params: { id: "1" }, isDynamic: true, metadata: undefined }]);
    matchesRoute(assert, "/posts/edit", [{ handler: "editPost", params: {}, isDynamic: false, metadata: undefined }]);
  });

  QUnit.test("support nested dynamic routes and star route", (assert: Assert) => {
    router.map(function(match) {
      match("/:routeId").to("routeId", function(match) {
        match("/").to("routeId.index");
        match("/:subRouteId").to("subRouteId");
      });
      match("/*wildcard").to("wildcard");
    });

    // fails because it incorrectly matches the wildcard route
    matchesRoute(assert, "/abc", [
      {handler: "routeId", params: { routeId: "abc" }, isDynamic: true, metadata: undefined},
      {handler: "routeId.index", params: {}, isDynamic: false, metadata: undefined},
    ]);

    // passes
    matchesRoute(assert, "/abc/def", [
      {handler: "routeId", params: {routeId: "abc"}, isDynamic: true, metadata: undefined},
      {handler: "subRouteId", params: {"subRouteId": "def"}, isDynamic: true, metadata: undefined}
    ]);

    // fails because no route is recognized
    matchesRoute(assert, "/abc/def/ghi", [{handler: "wildcard", params: { wildcard: "abc/def/ghi"}, isDynamic: true, metadata: undefined}]);
  });

  QUnit.test("supports nested match with query params", (assert: Assert) => {
    router.map(function(match) {
      match("/posts", function(match) {
        match("/new").to("newPost");
        match("/:id").to("showPost");
        match("/edit").to("editPost");
      });
    });

    matchesRoute(assert, "/posts/new?foo=1&bar=2", [{ handler: "newPost", params: {}, isDynamic: false, metadata: undefined }], {foo: "1", bar: "2"});
    matchesRoute(assert, "/posts/1?baz=3", [{ handler: "showPost", params: { id: "1" }, isDynamic: true, metadata: undefined }], {baz: "3"});
    matchesRoute(assert, "/posts/edit", [{ handler: "editPost", params: {}, isDynamic: false, metadata: undefined }], {});
  });

  QUnit.test("not passing a function with `match` as a parameter raises", (assert: Assert) => {
    assert.throws(function() {
      router.map(function(match) {
        match("/posts").to("posts", function() {

        });
      });
    });
  });

  QUnit.test("supports nested handlers", (assert: Assert) => {
    router.map(function(match) {
      match("/posts").to("posts", function(match) {
        match("/new").to("newPost");
        match("/:id").to("showPost");
        match("/edit").to("editPost");
      });
    });

    matchesRoute(assert, "/posts/new", [{ handler: "posts", params: {}, isDynamic: false, metadata: undefined }, { handler: "newPost", params: {}, isDynamic: false, metadata: undefined }]);
    matchesRoute(assert, "/posts/1", [{ handler: "posts", params: {}, isDynamic: false, metadata: undefined }, { handler: "showPost", params: { id: "1" }, isDynamic: true, metadata: undefined }]);
    matchesRoute(assert, "/posts/edit", [{ handler: "posts", params: {}, isDynamic: false, metadata: undefined }, { handler: "editPost", params: {}, isDynamic: false, metadata: undefined }]);
  });

  QUnit.test("supports deeply nested handlers", (assert: Assert) => {
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

    matchesRoute(assert, "/posts/new", [{ handler: "posts", params: {}, isDynamic: false, metadata: undefined }, { handler: "newPost", params: {}, isDynamic: false, metadata: undefined }]);
    matchesRoute(assert, "/posts/1/index", [{ handler: "posts", params: {}, isDynamic: false, metadata: undefined }, { handler: "showPost", params: { id: "1" }, isDynamic: true, metadata: undefined }, { handler: "postIndex", params: {}, isDynamic: false, metadata: undefined }]);
    matchesRoute(assert, "/posts/1/comments", [{ handler: "posts", params: {}, isDynamic: false, metadata: undefined }, { handler: "showPost", params: { id: "1" }, isDynamic: true, metadata: undefined }, { handler: "postComments", params: {}, isDynamic: false, metadata: undefined }]);
    matchesRoute(assert, "/posts/ne/comments", [{ handler: "posts", params: {}, isDynamic: false, metadata: undefined }, { handler: "showPost", params: { id: "ne" }, isDynamic: true, metadata: undefined }, { handler: "postComments", params: {}, isDynamic: false, metadata: undefined }]);
    matchesRoute(assert, "/posts/edit", [{ handler: "posts", params: {}, isDynamic: false, metadata: undefined }, { handler: "editPost", params: {}, isDynamic: false, metadata: undefined }]);
  });

  QUnit.test("supports index-style routes", (assert: Assert) => {
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

    matchesRoute(assert, "/posts/new", [{ handler: "posts", params: {}, isDynamic: false, metadata: undefined }, { handler: "newPost", params: {}, isDynamic: false, metadata: undefined }]);
    matchesRoute(assert, "/posts/1", [{ handler: "posts", params: {}, isDynamic: false, metadata: undefined }, { handler: "showPost", params: { id: "1" }, isDynamic: true, metadata: undefined }, { handler: "postIndex", params: {}, isDynamic: false, metadata: undefined }]);
    matchesRoute(assert, "/posts/1/comments", [{ handler: "posts", params: {}, isDynamic: false, metadata: undefined }, { handler: "showPost", params: { id: "1" }, isDynamic: true, metadata: undefined }, { handler: "postComments", params: {}, isDynamic: false, metadata: undefined }]);
    matchesRoute(assert, "/posts/edit", [{ handler: "posts", params: {}, isDynamic: false, metadata: undefined }, { handler: "editPost", params: {}, isDynamic: false, metadata: undefined }]);
  });

  QUnit.test("supports single `/` routes", (assert: Assert) => {
    router.map(function(match) {
      match("/").to("posts");
    });

    matchesRoute(assert, "/", [{ handler: "posts", params: {}, isDynamic: false, metadata: undefined }]);
  });

  QUnit.test("supports star routes", (assert: Assert) => {
    router.map(function(match) {
      match("/").to("posts");
      match("/*everything").to("404");
    });

    // randomly generated strings
    ["w6PCXxJn20PCSievuP", "v2y0gaByxHjHYJw0pVT1TeqbEJLllVq-3", "DFCR4rm7XMbT6CPZq-d8AU7k", "d3vYEg1AoYaPlM9QbOAxEK6u/H_S-PYH1aYtt"].forEach(function(r) {
      matchesRoute(assert, "/" + r, [{ handler: "404", params: {everything: r}, isDynamic: true, metadata: undefined }]);
    });
  });

  QUnit.test("star route does not swallow trailing `/`", (assert: Assert) => {
    let r;

    router.map(function(match) {
      match("/").to("posts");
      match("/*everything").to("glob");
    });

    r = "folder1/folder2/folder3/";
    matchesRoute(assert, "/" + r, [{ handler: "glob", params: {everything: r}, isDynamic: true, metadata: undefined }]);
  });

  QUnit.test("support star route before other segment", (assert: Assert) => {
    router.map(function(match) {
      match("/*everything/:extra").to("glob");
    });

    ["folder1/folder2/folder3//the-extra-stuff/", "folder1/folder2/folder3//the-extra-stuff"].forEach(function(r) {
      matchesRoute(assert, "/" + r, [{ handler: "glob", params: {everything: "folder1/folder2/folder3/", extra: "the-extra-stuff"}, isDynamic: true, metadata: undefined }]);
    });
  });

  QUnit.test("support nested star route", (assert: Assert) => {
    router.map(function(match) {
      match("/*everything").to("glob", function(match){
        match("/:extra").to("extra");
      });
    });

    ["folder1/folder2/folder3//the-extra-stuff/", "folder1/folder2/folder3//the-extra-stuff"].forEach(function(r) {
      matchesRoute(assert, "/" + r, [{ handler: "glob", params: {everything: "folder1/folder2/folder3/"}, isDynamic: true, metadata: undefined }, { handler: "extra", params: {extra: "the-extra-stuff"}, isDynamic: true, metadata: undefined }]);
    });
  });

  QUnit.test("calls a delegate whenever a new context is entered", (assert: Assert) => {
    const passedArguments: string[] = [];

    router.delegate = {
      contextEntered: function(name, match) {
        assert.ok(match instanceof Function, "The match is a function");
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

    assert.deepEqual(passedArguments, ["application", "posts"], "The entered contexts were passed to contextEntered");

    matchesRoute(assert, "/posts", [{ handler: "application", params: {}, isDynamic: false, metadata: undefined }, { handler: "posts", params: {}, isDynamic: false, metadata: undefined }, { handler: "index", params: {}, isDynamic: false, metadata: undefined }]);
  });

  QUnit.test("delegate can change added routes", (assert: Assert) => {
    router.delegate = {
      willAddRoute: function(context, route) {
        if (!context) { return route; }
        context = context.split(".").slice(-1)[0];
        return context + "." + route;
      },

      // Test that both delegates work together
      contextEntered: function(_, match) {
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

    matchesRoute(assert, "/posts", [{ handler: "application", params: {}, isDynamic: false, metadata: undefined }, { handler: "application.posts", params: {}, isDynamic: false, metadata: undefined }, { handler: "posts.index", params: {}, isDynamic: false, metadata: undefined }]);
    matchesRoute(assert, "/posts/1", [{ handler: "application", params: {}, isDynamic: false, metadata: undefined }, { handler: "application.posts", params: {}, isDynamic: false, metadata: undefined }, { handler: "posts.post", params: { post_id: "1" }, isDynamic: true, metadata: undefined }]);
  });

  QUnit.test("supports add-route callback", (assert: Assert) => {

    const invocations: string[] = [];

    router.map(function(match) {
      match("/").to("application", function(match) {
        match("/loading").to("loading");
        match("/_unused_dummy_error_path_route_application/:error").to("error");
        match("/lobby").to("lobby", function(match) {
          match("/loading").to("lobby.loading");
          match("/_unused_dummy_error_path_route_lobby/:error").to("lobby.error");
          match(":lobby_id").to("lobby.index");
          match("/list").to("lobby.list");
        });
        match("/").to("index");
      });
    }, function (recognizer, routes) {
      invocations.push(routes.map(e => e.handler).join("."));
      recognizer.add(routes);
    });

    const expected = [
      "application.loading",
      "application.error",
      "application.lobby.lobby.loading",
      "application.lobby.lobby.error",
      "application.lobby.lobby.index",
      "application.lobby.lobby.list",
      "application.index"
    ];

    assert.deepEqual(expected, invocations, "invokes for the correct set of routes");
    matchesRoute(assert, "/lobby/loading", [
      { handler: "application", params: {}, isDynamic: false, metadata: undefined },
      { handler: "lobby", params: {}, isDynamic: false, metadata: undefined },
      { handler: "lobby.loading", params: {}, isDynamic: false, metadata: undefined }
    ]);
  });

  QUnit.test("supports passing metadata in route", (assert: Assert) => {
    let metadata = {};

    router.map(function(match) {
      match("/posts/new").to("newPost");
    }, function (recognizer, routes) {
      recognizer.add(routes.map(e => {
        e.metadata = metadata;
        return e;
      }));
    });

    matchesRoute(assert, "/posts/new", [{ handler: "newPost", params: {}, isDynamic: false, metadata: metadata }]);
  });
});



