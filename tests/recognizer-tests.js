module("Route Recognition");

test("A simple route recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler }]);

  deepEqual(router.recognize("/foo/bar"), [{ handler: handler, params: {} }]);
  equal(router.recognize("/foo/baz"), null);
});

test("A dynamic route recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/:bar", handler: handler }]);

  deepEqual(router.recognize("/foo/bar"), [{ handler: handler, params: { bar: "bar" } }]);
  deepEqual(router.recognize("/foo/1"), [{ handler: handler, params: { bar: "1" } }]);
  equal(router.recognize("/zoo/baz"), null);
});

test("Multiple routes recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/:bar", handler: handler1 }]);
  router.add([{ path: "/bar/:baz", handler: handler2 }]);

  deepEqual(router.recognize("/foo/bar"), [{ handler: handler1, params: { bar: "bar" } }]);
  deepEqual(router.recognize("/bar/1"), [{ handler: handler2, params: { baz: "1" } }]);
});

test("Overlapping routes recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/:baz", handler: handler2 }]);
  router.add([{ path: "/foo/bar/:bar", handler: handler1 }]);

  deepEqual(router.recognize("/foo/bar/1"), [{ handler: handler1, params: { bar: "1" } }]);
  deepEqual(router.recognize("/foo/1"), [{ handler: handler2, params: { baz: "1" } }]);
});

test("Nested routes recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };

  var router = new RouteRecognizer();
  router.add([{ path: "/foo/:bar", handler: handler1 }, { path: "/baz/:bat", handler: handler2 }]);

  deepEqual(router.recognize("/foo/1/baz/2"), [{ handler: handler1, params: { bar: "1" } }, { handler: handler2, params: { bat: "2" } }]);
});

test("If there are multiple matches, the route with the most dynamic segments wins", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var handler3 = { handler: 3 };

  var router = new RouteRecognizer();
  router.add([{ path: "/posts/new", handler: handler1 }]);
  router.add([{ path: "/posts/:id", handler: handler2 }]);
  router.add([{ path: "/posts/edit", handler: handler3 }]);

  deepEqual(router.recognize("/posts/new"), [{ handler: handler1, params: {} }]);
  deepEqual(router.recognize("/posts/1"), [{ handler: handler2, params: { id: "1" } }]);
  deepEqual(router.recognize("/posts/edit"), [{ handler: handler3, params: {} }]);
});

test("Empty paths", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var handler3 = { handler: 2 };
  var handler4 = { handler: 2 };

  var router = new RouteRecognizer();
  router.add([{ path: "/foo", handler: handler1 }, { path: "/", handler: handler2 }, { path: "/bar", handler: handler3 }]);
  router.add([{ path: "/foo", handler: handler1 }, { path: "/", handler: handler2 }, { path: "/baz", handler: handler4 }]);

  deepEqual(router.recognize("/foo/bar"), [{ handler: handler1, params: {} }, { handler: handler2, params: {} }, { handler: handler3, params: {} }]);
  deepEqual(router.recognize("/foo/baz"), [{ handler: handler1, params: {} }, { handler: handler2, params: {} }, { handler: handler4, params: {} }]);
});

var router, handlers;

module("Route Generation", {
  setup: function() {
    router = new RouteRecognizer();

    handlers = [ {}, {}, {}, {} ];

    router.add([{ path: "/posts/:id", handler: handlers[0] }], { as: "post" });
    router.add([{ path: "/posts", handler: handlers[1] }], { as: "posts" });
    router.add([{ path: "/posts", handler: handlers[1] }, { path: "/", handler: handlers[4] }], { as: "postIndex" });
    router.add([{ path: "/posts/new", handler: handlers[2] }], { as: "new_post" });
    router.add([{ path: "/posts/:id/edit", handler: handlers[3] }], { as: "edit_post" });
  }
});

test("Generation works", function() {
  equal( router.generate("post", { id: 1 }), "/posts/1" );
  equal( router.generate("posts"), "/posts" );
  equal( router.generate("new_post"), "/posts/new" );
  equal( router.generate("edit_post", { id: 1 }), "/posts/1/edit" );
  equal( router.generate("postIndex"), "/posts" );
});

test("Generating an invalid named route raises", function() {
  raises(function() {
    route.generate("nope");
  });
});

test("Getting the handlers for a named route", function() {
  deepEqual(router.handlersFor("post"), [ { handler: handlers[0], names: ['id'] } ]);
  deepEqual(router.handlersFor("posts"), [ { handler: handlers[1], names: [] } ]);
  deepEqual(router.handlersFor("new_post"), [ { handler: handlers[2], names: [] } ]);
  deepEqual(router.handlersFor("edit_post"), [ { handler: handlers[3], names: ['id'] } ]);
});
