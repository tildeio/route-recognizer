module("Route Recognition");

test("A simple route recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler }]);

  deepEqual(router.recognize("/foo/bar"), [{ handler: handler, params: {}, isDynamic: false }]);
  equal(router.recognize("/foo/baz"), null);
});

test("A simple route with query params recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler, queryParams: ['sort'] }]);

  deepEqual(router.recognize("/foo/bar?sort=date&other=something"), [{ handler: handler, params: {}, isDynamic: false , queryParams: {sort: 'date'}}]);
  deepEqual(router.recognize("/foo/bar?other=something"), [{ handler: handler, params: {}, isDynamic: false , queryParams: {}}]);
});

test("Query params without value are boolean", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler, queryParams: ['show'] }]);

  deepEqual(router.recognize("/foo/bar?show")[0].queryParams, {show: true});
  deepEqual(router.recognize("/foo/bar?show&other=something")[0].queryParams, {show: true});
});

test("A simple route with multiple query params recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler, queryParams: ['sort', 'direction', 'category'] }]);

  deepEqual(router.recognize("/foo/bar?sort=date&other=something")[0].queryParams, {sort: 'date'});
  deepEqual(router.recognize("/foo/bar?sort=date&other=something&direction=asc")[0].queryParams, {sort: 'date', direction: 'asc'});
  deepEqual(router.recognize("/foo/bar?sort=date&other=something&direction=asc&category=awesome")[0].queryParams, {sort: 'date', direction: 'asc', category: 'awesome'});
  deepEqual(router.recognize("/foo/bar?other=something")[0].queryParams, {});
});


test("A `/` route recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/", handler: handler }]);

  deepEqual(router.recognize("/"), [{ handler: handler, params: {}, isDynamic: false }]);
});

test("A `/` route with query params recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/", handler: handler }]);

  deepEqual(router.recognize("/?lemon=jello"), [{ handler: handler, params: {}, isDynamic: false }]);
});

test("A dynamic route recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/:bar", handler: handler }]);

  deepEqual(router.recognize("/foo/bar"), [{ handler: handler, params: { bar: "bar" }, isDynamic: true }]);
  deepEqual(router.recognize("/foo/1"), [{ handler: handler, params: { bar: "1" }, isDynamic: true }]);
  equal(router.recognize("/zoo/baz"), null);
});

test("Multiple routes recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/:bar", handler: handler1 }]);
  router.add([{ path: "/bar/:baz", handler: handler2 }]);

  deepEqual(router.recognize("/foo/bar"), [{ handler: handler1, params: { bar: "bar" }, isDynamic: true }]);
  deepEqual(router.recognize("/bar/1"), [{ handler: handler2, params: { baz: "1" }, isDynamic: true }]);
});

test("Multiple routes with overlapping query params recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/foo", handler: handler1, queryParams: ['a', 'b'] }]);
  router.add([{ path: "/bar", handler: handler2, queryParams: ['b', 'c'] }]);

  deepEqual(router.recognize("/foo")[0].queryParams, {});
  deepEqual(router.recognize("/foo?a=1")[0].queryParams, {a: "1"});
  deepEqual(router.recognize("/foo?a=1&b=2")[0].queryParams, {a: "1", b: "2"});
  deepEqual(router.recognize("/foo?a=1&b=2&c=3")[0].queryParams, {a: "1", b: "2"});
  deepEqual(router.recognize("/foo?b=2&c=3")[0].queryParams, {b: "2"});
  deepEqual(router.recognize("/foo?c=3")[0].queryParams, {});
  deepEqual(router.recognize("/foo?a=1&c=3")[0].queryParams, {a: "1"});

  deepEqual(router.recognize("/bar")[0].queryParams, {});
  deepEqual(router.recognize("/bar?a=1")[0].queryParams, {});
  deepEqual(router.recognize("/bar?a=1&b=2")[0].queryParams, {b: "2"});
  deepEqual(router.recognize("/bar?a=1&b=2&c=3")[0].queryParams, {b: "2", c: "3"});
  deepEqual(router.recognize("/bar?b=2&c=3")[0].queryParams, {b: "2", c: "3"});
  deepEqual(router.recognize("/bar?c=3")[0].queryParams, {c: "3"});
  deepEqual(router.recognize("/bar?a=1&c=3")[0].queryParams, {c: "3"});
});


test("Multiple `/` routes recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/", handler: handler1 }, { path: "/", handler: handler2 }]);
  deepEqual(router.recognize("/"), [{ handler: handler1, params: {}, isDynamic: false }, { handler: handler2, params: {}, isDynamic: false }]);
});

test("Overlapping routes recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/:baz", handler: handler2 }]);
  router.add([{ path: "/foo/bar/:bar", handler: handler1 }]);

  deepEqual(router.recognize("/foo/bar/1"), [{ handler: handler1, params: { bar: "1" }, isDynamic: true }]);
  deepEqual(router.recognize("/foo/1"), [{ handler: handler2, params: { baz: "1" }, isDynamic: true }]);
});

test("Overlapping star routes recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/*bar", handler: handler2 }]);
  router.add([{ path: "/*foo", handler: handler1 }]);

  deepEqual(router.recognize("/foo/1"), [{ handler: handler2, params: { bar: "1" }, isDynamic: true }]);
  deepEqual(router.recognize("/1"), [{ handler: handler1, params: { foo: "1" }, isDynamic: true }]);
});

test("Routes with trailing `/` recognize", function() {
  var handler = {};
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/bar", handler: handler }]);
  deepEqual(router.recognize("/foo/bar/"), [{ handler: handler, params: {}, isDynamic: false }]);
});

test("Nested routes recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };

  var router = new RouteRecognizer();
  router.add([{ path: "/foo/:bar", handler: handler1 }, { path: "/baz/:bat", handler: handler2 }], { as: 'foo' });

  deepEqual(router.recognize("/foo/1/baz/2"), [{ handler: handler1, params: { bar: "1" }, isDynamic: true }, { handler: handler2, params: { bat: "2" }, isDynamic: true }]);

  equal(router.hasRoute('foo'), true);
  equal(router.hasRoute('bar'), false);
});

test("Nested routes with query params recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };

  var router = new RouteRecognizer();
  router.add([{ path: "/foo/:bar", handler: handler1, queryParams: ['a', 'b'] }, { path: "/baz/:bat", handler: handler2, queryParams: ['b', 'c'] }], { as: 'foo' });

  deepEqual(router.recognize("/foo/4/baz/5?a=1"),
    [{ handler: handler1, params: { bar: "4" }, isDynamic: true, queryParams: {a: "1"} }, { handler: handler2, params: { bat: "5" }, isDynamic: true, queryParams: {} }]);
  deepEqual(router.recognize("/foo/4/baz/5?a=1&b=2"),
    [{ handler: handler1, params: { bar: "4" }, isDynamic: true, queryParams: {a: "1", b: "2"} }, { handler: handler2, params: { bat: "5" }, isDynamic: true, queryParams: {b: "2"} }]);
  deepEqual(router.recognize("/foo/4/baz/5?a=1&b=2&c=3"),
    [{ handler: handler1, params: { bar: "4" }, isDynamic: true, queryParams: {a: "1", b: "2"} }, { handler: handler2, params: { bat: "5" }, isDynamic: true, queryParams: {b: "2", c: "3"} }]);
  deepEqual(router.recognize("/foo/4/baz/5?b=2&c=3"),
    [{ handler: handler1, params: { bar: "4" }, isDynamic: true, queryParams: {b: "2"} }, { handler: handler2, params: { bat: "5" }, isDynamic: true, queryParams: {b: "2", c: "3"} }]);
  deepEqual(router.recognize("/foo/4/baz/5?c=3"),
    [{ handler: handler1, params: { bar: "4" }, isDynamic: true, queryParams: {} }, { handler: handler2, params: { bat: "5" }, isDynamic: true, queryParams: {c: "3"} }]);
  deepEqual(router.recognize("/foo/4/baz/5?a=1&c=3"),
    [{ handler: handler1, params: { bar: "4" }, isDynamic: true, queryParams: {a: "1"} }, { handler: handler2, params: { bat: "5" }, isDynamic: true, queryParams: {c: "3"} }]);

  equal(router.hasRoute('foo'), true);
  equal(router.hasRoute('bar'), false);
});

test("If there are multiple matches, the route with the most dynamic segments wins", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var handler3 = { handler: 3 };

  var router = new RouteRecognizer();
  router.add([{ path: "/posts/new", handler: handler1 }]);
  router.add([{ path: "/posts/:id", handler: handler2 }]);
  router.add([{ path: "/posts/edit", handler: handler3 }]);

  deepEqual(router.recognize("/posts/new"), [{ handler: handler1, params: {}, isDynamic: false }]);
  deepEqual(router.recognize("/posts/1"), [{ handler: handler2, params: { id: "1" }, isDynamic: true }]);
  deepEqual(router.recognize("/posts/edit"), [{ handler: handler3, params: {}, isDynamic: false }]);
});

test("Empty paths", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var handler3 = { handler: 2 };
  var handler4 = { handler: 2 };

  var router = new RouteRecognizer();
  router.add([{ path: "/foo", handler: handler1 }, { path: "/", handler: handler2 }, { path: "/bar", handler: handler3 }]);
  router.add([{ path: "/foo", handler: handler1 }, { path: "/", handler: handler2 }, { path: "/baz", handler: handler4 }]);

  deepEqual(router.recognize("/foo/bar"), [{ handler: handler1, params: {}, isDynamic: false }, { handler: handler2, params: {}, isDynamic: false }, { handler: handler3, params: {}, isDynamic: false }]);
  deepEqual(router.recognize("/foo/baz"), [{ handler: handler1, params: {}, isDynamic: false }, { handler: handler2, params: {}, isDynamic: false }, { handler: handler4, params: {}, isDynamic: false }]);
});

test("Repeated empty segments don't confuse the recognizer", function() {
  var handler1 = { handler: 1 },
      handler2 = { handler: 2 },
      handler3 = { handler: 3 },
      handler4 = { handler: 4 };

  var router = new RouteRecognizer();
  router.add([{ path: "/", handler: handler1 }, { path: "/", handler: handler2 }, { path: "/", handler: handler3 }]);
  router.add([{ path: "/", handler: handler1 }, { path: "/", handler: handler2 }, { path: "/foo", handler: handler4 }]);

  deepEqual(router.recognize("/"), [{ handler: handler1, params: {}, isDynamic: false }, { handler: handler2, params: {}, isDynamic: false }, { handler: handler3, params: {}, isDynamic: false }]);
  deepEqual(router.recognize(""), [{ handler: handler1, params: {}, isDynamic: false }, { handler: handler2, params: {}, isDynamic: false }, { handler: handler3, params: {}, isDynamic: false }]);
  deepEqual(router.recognize("/foo"), [{ handler: handler1, params: {}, isDynamic: false }, { handler: handler2, params: {}, isDynamic: false }, { handler: handler4, params: {}, isDynamic: false }]);
  deepEqual(router.recognize("foo"), [{ handler: handler1, params: {}, isDynamic: false }, { handler: handler2, params: {}, isDynamic: false }, { handler: handler4, params: {}, isDynamic: false }]);
});

// BUG - https://github.com/emberjs/ember.js/issues/2559
test("Dynamic routes without leading `/` and single length param are recognized", function() {
  var handler = {};
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/:id", handler: handler }]);
  deepEqual(router.recognize("foo/1"), [{ handler: handler, params: { id: '1' }, isDynamic: true }]);
});

var router, handlers;

module("Route Generation", {
  setup: function() {
    router = new RouteRecognizer();

    handlers = [ {}, {}, {}, {}, {}, {} ];

    router.add([{ path: "/", handler: {}, queryParams: ['filter'] }], { as: "index" });
    router.add([{ path: "/posts/:id", handler: handlers[0] }], { as: "post" });
    router.add([{ path: "/posts", handler: handlers[1], queryParams: ['sort'] }], { as: "posts" });
    router.add([{ path: "/posts", handler: handlers[1] }, { path: "/", handler: handlers[4] }], { as: "postIndex" });
    router.add([{ path: "/posts/new", handler: handlers[2] }], { as: "new_post" });
    router.add([{ path: "/posts/:id/edit", handler: handlers[3], queryParams: ['format', 'editor'] }], { as: "edit_post" });
    router.add([{ path: "/foo/:bar", handler: handlers[4], queryParams: ['a'] }, { path: "/baz/:bat", handler: handlers[5], queryParams: ['b'] }], { as: 'foo' });
  }
});

test("Generation works", function() {
  equal( router.generate("index"), "/" );
  equal( router.generate("post", { id: 1 }), "/posts/1" );
  equal( router.generate("posts"), "/posts" );
  equal( router.generate("new_post"), "/posts/new" );
  equal( router.generate("edit_post", { id: 1 }), "/posts/1/edit" );
  equal( router.generate("postIndex"), "/posts" );
});

test("Generation works with query params", function() {
  equal( router.generate("index", {queryParams: {filter: 'date'}}), "/?filter=date" );
  equal( router.generate("index", {queryParams: {filter: true}}), "/?filter" );
  equal( router.generate("posts", {queryParams: {sort: 'title'}}), "/posts?sort=title");
  equal( router.generate("edit_post", { id: 1, queryParams: {format: 'markdown'} }), "/posts/1/edit?format=markdown" );
  equal( router.generate("edit_post", { id: 1, queryParams: {editor: 'ace'} }), "/posts/1/edit?editor=ace" );
  equal( router.generate("edit_post", { id: 1, queryParams: {format: 'markdown', editor: 'ace'} }),"/posts/1/edit?format=markdown&editor=ace" );
  equal( router.generate("edit_post", { id: 1, queryParams: {format: 'markdown', editor: 'ace'} }),"/posts/1/edit?format=markdown&editor=ace" );
  equal( router.generate("edit_post", { id: 1, queryParams: {format: true, editor: 'ace'} }),"/posts/1/edit?format&editor=ace" );
  equal( router.generate("edit_post", { id: 1, queryParams: {format: 'markdown', editor: true} }),"/posts/1/edit?format=markdown&editor" );
  equal( router.generate("foo", { bar: 9, bat: 10, queryParams: {a: 1} }),"/foo/9/baz/10?a=1" );
  equal( router.generate("foo", { bar: 9, bat: 10, queryParams: {b: 2} }),"/foo/9/baz/10?b=2" );
  equal( router.generate("foo", { bar: 9, bat: 10, queryParams: {a: 1, b: 2} }),"/foo/9/baz/10?a=1&b=2" );
});

test("Empty query params don't have an extra question mark", function() {
  equal( router.generate("index", {queryParams: {}}), "/" );
  equal( router.generate("index", {queryParams: null}), "/" );
  equal( router.generate("posts", {queryParams: {}}), "/posts");
  equal( router.generate("posts", {queryParams: null}), "/posts");
});

test("Generating an invalid named route raises", function() {
  raises(function() {
    router.generate("nope");
  }, /There is no route named nope/);
});

test("Generating a route with invalid query params raises", function() {
  raises(function() {
    router.generate("index", {queryParams: {someFilter: 'date'}});
  });
  raises(function() {
    router.generate("index", {queryParams: {filter: 'date', someOther: 'thing'}});
  });

  raises(function() {
    equal( router.generate("posts", {queryParams: {sort: 'title', filter: 'date'}}), "/posts?sort=title&filter=date");
  });
});

test("Getting the handlers for a named route", function() {
  deepEqual(router.handlersFor("post"), [ { handler: handlers[0], names: ['id'] } ]);
  deepEqual(router.handlersFor("posts"), [ { handler: handlers[1], names: [], queryParams: ['sort'] } ]);
  deepEqual(router.handlersFor("new_post"), [ { handler: handlers[2], names: [] } ]);
  deepEqual(router.handlersFor("edit_post"), [ { handler: handlers[3], names: ['id'], queryParams: ['format', 'editor'] } ]);
});
