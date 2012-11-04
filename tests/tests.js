module("Route Recognition");

test("A simple route recognizes", function() {
  var endpoint = {};
  var router = new Router();
  router.add([{ path: "/foo/bar", endpoint: endpoint }]);

  deepEqual(router.recognize("/foo/bar"), [{ endpoint: endpoint, params: {} }]);
  equal(router.recognize("/foo/baz"), null);
});

test("A dynamic route recognizes", function() {
  var endpoint = {};
  var router = new Router();
  router.add([{ path: "/foo/:bar", endpoint: endpoint }]);

  deepEqual(router.recognize("/foo/bar"), [{ endpoint: endpoint, params: { bar: "bar" } }]);
  deepEqual(router.recognize("/foo/1"), [{ endpoint: endpoint, params: { bar: "1" } }]);
  equal(router.recognize("/zoo/baz"), null);
});

test("Multiple routes recognize", function() {
  var endpoint1 = { endpoint: 1 };
  var endpoint2 = { endpoint: 2 };
  var router = new Router();

  router.add([{ path: "/foo/:bar", endpoint: endpoint1 }]);
  router.add([{ path: "/bar/:baz", endpoint: endpoint2 }]);

  deepEqual(router.recognize("/foo/bar"), [{ endpoint: endpoint1, params: { bar: "bar" } }]);
  deepEqual(router.recognize("/bar/1"), [{ endpoint: endpoint2, params: { baz: "1" } }]);
});

test("Overlapping routes recognize", function() {
  var endpoint1 = { endpoint: 1 };
  var endpoint2 = { endpoint: 2 };
  var router = new Router();

  router.add([{ path: "/foo/:baz", endpoint: endpoint2 }]);
  router.add([{ path: "/foo/bar/:bar", endpoint: endpoint1 }]);

  deepEqual(router.recognize("/foo/bar/1"), [{ endpoint: endpoint1, params: { bar: "1" } }]);
  deepEqual(router.recognize("/foo/1"), [{ endpoint: endpoint2, params: { baz: "1" } }]);
});

test("Nested routes recognize", function() {
  var endpoint1 = { endpoint: 1 };
  var endpoint2 = { endpoint: 2 };

  var router = new Router();
  router.add([{ path: "/foo/:bar", endpoint: endpoint1 }, { path: "/baz/:bat", endpoint: endpoint2 }]);

  deepEqual(router.recognize("/foo/1/baz/2"), [{ endpoint: endpoint1, params: { bar: "1" } }, { endpoint: endpoint2, params: { bat: "2" } }]);
});

test("If there are multiple matches, the route with the most dynamic segments wins", function() {
  var endpoint1 = { endpoint: 1 };
  var endpoint2 = { endpoint: 2 };
  var endpoint3 = { endpoint: 3 };

  var router = new Router();
  router.add([{ path: "/posts/new", endpoint: endpoint1 }]);
  router.add([{ path: "/posts/:id", endpoint: endpoint2 }]);
  router.add([{ path: "/posts/edit", endpoint: endpoint3 }]);

  deepEqual(router.recognize("/posts/new"), [{ endpoint: endpoint1, params: {} }]);
  deepEqual(router.recognize("/posts/1"), [{ endpoint: endpoint2, params: { id: "1" } }]);
  deepEqual(router.recognize("/posts/edit"), [{ endpoint: endpoint3, params: {} }]);
});

var router;

module("Route Generation", {
  setup: function() {
    router = new Router();

    router.add([{ path: "/posts/:id", endpoint: {} }], { as: "post" });
    router.add([{ path: "/posts", endpoint: {} }], { as: "posts" });
    router.add([{ path: "/posts/new", endpoint: {} }], { as: "new_post" });
    router.add([{ path: "/posts/:id/edit", endpoint: {} }], { as: "edit_post" });
  }
});

test("Generation works", function() {
  equal( router.generate("post", { id: 1 }), "/posts/1" );
  equal( router.generate("posts"), "/posts" );
  equal( router.generate("new_post"), "/posts/new" );
  equal( router.generate("edit_post", { id: 1 }), "/posts/1/edit" );
});

test("Generating an invalid named route raises", function() {
  raises(function() {
    route.generate("nope");
  });
});
