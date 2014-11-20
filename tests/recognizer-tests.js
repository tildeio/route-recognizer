/* globals QUnit */

import RouteRecognizer from 'route-recognizer';

module("Route Recognition");

function resultsMatch(results, array, queryParams) {
  deepEqual(results.slice(), array);
  if (queryParams) {
    deepEqual(queryParams, results.queryParams);
  }
}

test("A simple route recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler }]);

  resultsMatch(router.recognize("/foo/bar"), [{ handler: handler, params: {}, isDynamic: false }]);
  equal(router.recognize("/foo/baz"), null);
});

test("A unicode route recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/uniçø∂∑/ʇɥƃᴉɹlɐ", handler: handler }]);

  var encoded = encodeURI("/uniçø∂∑/ʇɥƃᴉɹlɐ");
  resultsMatch(router.recognize(encoded), [{ handler: handler, params: {}, isDynamic: false }]);
  equal(router.recognize("/uniçø∂∑"), null);
});

test("A simple route with query params recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler}]);

  resultsMatch(router.recognize("/foo/bar?sort=date&other=something"), [{ handler: handler, params: {}, isDynamic: false }], { sort: 'date', other: 'something' });
  resultsMatch(router.recognize("/foo/bar?other=something"), [{ handler: handler, params: {}, isDynamic: false }]);
});

test("False query params = 'false'", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler }]);

  deepEqual(router.recognize("/foo/bar?show=false").queryParams, {show: 'false'});
  deepEqual(router.recognize("/foo/bar?show=false&other=something").queryParams, {show: 'false', other: 'something' });
});

test("True query params = 'true'", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler }]);

  deepEqual(router.recognize("/foo/bar?show=true").queryParams, {show: 'true'});
  deepEqual(router.recognize("/foo/bar?show=true&other=something").queryParams, {show: 'true', other: 'something' });
});

test("Query params without '='", function() {
    var handler = {};
    var router = new RouteRecognizer();
    router.add([{ path: "/foo/bar", handler: handler }]);

    deepEqual(router.recognize("/foo/bar?show").queryParams, {show: 'true'});
    deepEqual(router.recognize("/foo/bar?show&hide").queryParams, {show: 'true', hide: 'true'});
});

test("Query params with = and without value are empty string", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler }]);

  deepEqual(router.recognize("/foo/bar?search=").queryParams, {search: ''});
  deepEqual(router.recognize("/foo/bar?search=&other=something").queryParams, {search: '', other: 'something' });
});

test("A simple route with multiple query params recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler, queryParams: ['sort', 'direction', 'category'] }]);

  deepEqual(router.recognize("/foo/bar?sort=date&other=something").queryParams, {sort: 'date', other: 'something' });
  deepEqual(router.recognize("/foo/bar?sort=date&other=something&direction=asc").queryParams, {sort: 'date', direction: 'asc', other: 'something' });
  deepEqual(router.recognize("/foo/bar?sort=date&other=something&direction=asc&category=awesome").queryParams, {sort: 'date', direction: 'asc', category: 'awesome', other: 'something'});
  deepEqual(router.recognize("/foo/bar?other=something").queryParams, { other: 'something' });
});

test("A simple route with query params with encoding recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler}]);

  deepEqual(router.recognize("/foo/bar?other=something%20100%25").queryParams, { other: 'something 100%' });
});


test("A `/` route recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/", handler: handler }]);

  resultsMatch(router.recognize("/"), [{ handler: handler, params: {}, isDynamic: false }]);
});

test("A `/` route with query params recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/", handler: handler }]);

  resultsMatch(router.recognize("/?lemon=jello"), [{ handler: handler, params: {}, isDynamic: false }], { lemon: 'jello' });
});

test("A dynamic route recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/:bar", handler: handler }]);

  resultsMatch(router.recognize("/foo/bar"), [{ handler: handler, params: { bar: "bar" }, isDynamic: true }]);
  resultsMatch(router.recognize("/foo/1"), [{ handler: handler, params: { bar: "1" }, isDynamic: true }]);
  equal(router.recognize("/zoo/baz"), null);
});

test("Multiple routes recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/:bar", handler: handler1 }]);
  router.add([{ path: "/bar/:baz", handler: handler2 }]);

  resultsMatch(router.recognize("/foo/bar"), [{ handler: handler1, params: { bar: "bar" }, isDynamic: true }]);
  resultsMatch(router.recognize("/bar/1"), [{ handler: handler2, params: { baz: "1" }, isDynamic: true }]);
});

test("Multiple routes with overlapping query params recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/foo", handler: handler1 }]);
  router.add([{ path: "/bar", handler: handler2 }]);

  deepEqual(router.recognize("/foo").queryParams, {});
  deepEqual(router.recognize("/foo?a=1").queryParams, {a: "1"});
  deepEqual(router.recognize("/foo?a=1&b=2").queryParams, {a: "1", b: "2"});
  deepEqual(router.recognize("/foo?a=1&b=2&c=3").queryParams, {a: "1", b: "2", c: "3"});
  deepEqual(router.recognize("/foo?b=2&c=3").queryParams, {b: "2", c: "3"});
  deepEqual(router.recognize("/foo?c=3").queryParams, { c: "3" });
  deepEqual(router.recognize("/foo?a=1&c=3").queryParams, {a: "1", c: "3" });

  deepEqual(router.recognize("/bar").queryParams, {});
  deepEqual(router.recognize("/bar?a=1").queryParams, { a: "1" });
  deepEqual(router.recognize("/bar?a=1&b=2").queryParams, { a: "1", b: "2"});
  deepEqual(router.recognize("/bar?a=1&b=2&c=3").queryParams, { a: "1", b: "2", c: "3"});
  deepEqual(router.recognize("/bar?b=2&c=3").queryParams, {b: "2", c: "3"});
  deepEqual(router.recognize("/bar?c=3").queryParams, {c: "3"});
  deepEqual(router.recognize("/bar?a=1&c=3").queryParams, {a: "1", c: "3"});
});

test("Deserialize query param array", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler }]);

  var p = router.recognize("/foo/bar?foo[]=1&foo[]=2").queryParams;
  ok(Array.isArray(p.foo), "foo is an Array");
  deepEqual(p, {foo: ["1","2"]});
});

test("Array query params do not conflict with controller namespaced query params", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler }]);

  var p = router.recognize("/foo/bar?foo[bar][]=1&foo[bar][]=2&baz=barf").queryParams;
  ok(Array.isArray(p['foo[bar]']), "foo[bar] is an Array");
  deepEqual(p, {'foo[bar]': ["1","2"], 'baz': 'barf'});
});


test("Multiple `/` routes recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/", handler: handler1 }, { path: "/", handler: handler2 }]);
  resultsMatch(router.recognize("/"), [{ handler: handler1, params: {}, isDynamic: false }, { handler: handler2, params: {}, isDynamic: false }]);
});

test("Overlapping routes recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/:baz", handler: handler2 }]);
  router.add([{ path: "/foo/bar/:bar", handler: handler1 }]);

  resultsMatch(router.recognize("/foo/bar/1"), [{ handler: handler1, params: { bar: "1" }, isDynamic: true }]);
  resultsMatch(router.recognize("/foo/1"), [{ handler: handler2, params: { baz: "1" }, isDynamic: true }]);
});

test("Overlapping star routes recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/*bar", handler: handler2 }]);
  router.add([{ path: "/*foo", handler: handler1 }]);

  resultsMatch(router.recognize("/foo/1"), [{ handler: handler2, params: { bar: "1" }, isDynamic: true }]);
  resultsMatch(router.recognize("/1"), [{ handler: handler1, params: { foo: "1" }, isDynamic: true }]);
});

test("Prefers single dynamic segments over stars", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/*star", handler: handler1 }]);
  router.add([{ path: "/foo/*star/:dynamic", handler: handler2 }]);

  resultsMatch(router.recognize("/foo/1"), [{ handler: handler1, params: { star: "1" }, isDynamic: true }]);
  resultsMatch(router.recognize("/foo/suffix"), [{ handler: handler1, params: { star: "suffix" }, isDynamic: true }]);
  resultsMatch(router.recognize("/foo/bar/suffix"), [{ handler: handler2, params: { star: "bar", dynamic: "suffix" }, isDynamic: true }]);
});

test("Routes with trailing `/` recognize", function() {
  var handler = {};
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/bar", handler: handler }]);
  resultsMatch(router.recognize("/foo/bar/"), [{ handler: handler, params: {}, isDynamic: false }]);
});

test("Nested routes recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };

  var router = new RouteRecognizer();
  router.add([{ path: "/foo/:bar", handler: handler1 }, { path: "/baz/:bat", handler: handler2 }], { as: 'foo' });

  resultsMatch(router.recognize("/foo/1/baz/2"), [{ handler: handler1, params: { bar: "1" }, isDynamic: true }, { handler: handler2, params: { bat: "2" }, isDynamic: true }]);

  equal(router.hasRoute('foo'), true);
  equal(router.hasRoute('bar'), false);
});

test("Nested routes with query params recognize", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };

  var router = new RouteRecognizer();
  router.add([{ path: "/foo/:bar", handler: handler1, queryParams: ['a', 'b'] }, { path: "/baz/:bat", handler: handler2, queryParams: ['b', 'c'] }], { as: 'foo' });

  resultsMatch(router.recognize("/foo/4/baz/5?a=1"),
    [{ handler: handler1, params: { bar: "4" }, isDynamic: true }, { handler: handler2, params: { bat: "5" }, isDynamic: true }], { a: '1' });
  resultsMatch(router.recognize("/foo/4/baz/5?a=1&b=2"),
    [{ handler: handler1, params: { bar: "4" }, isDynamic: true }, { handler: handler2, params: { bat: "5" }, isDynamic: true }], { a: '1', b: '2' });
  resultsMatch(router.recognize("/foo/4/baz/5?a=1&b=2&c=3"),
    [{ handler: handler1, params: { bar: "4" }, isDynamic: true }, { handler: handler2, params: { bat: "5" }, isDynamic: true }], { a: '1', b: '2', c: '3' });
  resultsMatch(router.recognize("/foo/4/baz/5?b=2&c=3"),
    [{ handler: handler1, params: { bar: "4" }, isDynamic: true }, { handler: handler2, params: { bat: "5" }, isDynamic: true }], { b: '2', c: '3' });
  resultsMatch(router.recognize("/foo/4/baz/5?c=3"),
    [{ handler: handler1, params: { bar: "4" }, isDynamic: true }, { handler: handler2, params: { bat: "5" }, isDynamic: true }], { c: '3' });
  resultsMatch(router.recognize("/foo/4/baz/5?a=1&c=3"),
    [{ handler: handler1, params: { bar: "4" }, isDynamic: true }, { handler: handler2, params: { bat: "5" }, isDynamic: true }], { a: '1', c: '3' });

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

  resultsMatch(router.recognize("/posts/new"), [{ handler: handler1, params: {}, isDynamic: false }]);
  resultsMatch(router.recognize("/posts/1"), [{ handler: handler2, params: { id: "1" }, isDynamic: true }]);
  resultsMatch(router.recognize("/posts/edit"), [{ handler: handler3, params: {}, isDynamic: false }]);
});

test("Empty paths", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var handler3 = { handler: 2 };
  var handler4 = { handler: 2 };

  var router = new RouteRecognizer();
  router.add([{ path: "/foo", handler: handler1 }, { path: "/", handler: handler2 }, { path: "/bar", handler: handler3 }]);
  router.add([{ path: "/foo", handler: handler1 }, { path: "/", handler: handler2 }, { path: "/baz", handler: handler4 }]);

  resultsMatch(router.recognize("/foo/bar"), [{ handler: handler1, params: {}, isDynamic: false }, { handler: handler2, params: {}, isDynamic: false }, { handler: handler3, params: {}, isDynamic: false }]);
  resultsMatch(router.recognize("/foo/baz"), [{ handler: handler1, params: {}, isDynamic: false }, { handler: handler2, params: {}, isDynamic: false }, { handler: handler4, params: {}, isDynamic: false }]);
});

test("Repeated empty segments don't confuse the recognizer", function() {
  var handler1 = { handler: 1 },
      handler2 = { handler: 2 },
      handler3 = { handler: 3 },
      handler4 = { handler: 4 };

  var router = new RouteRecognizer();
  router.add([{ path: "/", handler: handler1 }, { path: "/", handler: handler2 }, { path: "/", handler: handler3 }]);
  router.add([{ path: "/", handler: handler1 }, { path: "/", handler: handler2 }, { path: "/foo", handler: handler4 }]);

  resultsMatch(router.recognize("/"), [{ handler: handler1, params: {}, isDynamic: false }, { handler: handler2, params: {}, isDynamic: false }, { handler: handler3, params: {}, isDynamic: false }]);
  resultsMatch(router.recognize(""), [{ handler: handler1, params: {}, isDynamic: false }, { handler: handler2, params: {}, isDynamic: false }, { handler: handler3, params: {}, isDynamic: false }]);
  resultsMatch(router.recognize("/foo"), [{ handler: handler1, params: {}, isDynamic: false }, { handler: handler2, params: {}, isDynamic: false }, { handler: handler4, params: {}, isDynamic: false }]);
  resultsMatch(router.recognize("foo"), [{ handler: handler1, params: {}, isDynamic: false }, { handler: handler2, params: {}, isDynamic: false }, { handler: handler4, params: {}, isDynamic: false }]);
});

// BUG - https://github.com/emberjs/ember.js/issues/2559
test("Dynamic routes without leading `/` and single length param are recognized", function() {
  var handler = {};
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/:id", handler: handler }]);
  resultsMatch(router.recognize("foo/1"), [{ handler: handler, params: { id: '1' }, isDynamic: true }]);
});

var router, handlers;

module("Route Generation", {
  setup: function() {
    router = new RouteRecognizer();

    handlers = [ {}, {}, {}, {}, {}, {} ];

    router.add([{ path: "/", handler: {} }], { as: "index" });
    router.add([{ path: "/posts/:id", handler: handlers[0] }], { as: "post" });
    router.add([{ path: "/posts", handler: handlers[1] }], { as: "posts" });
    router.add([{ path: "/posts", handler: handlers[1] }, { path: "/", handler: handlers[4] }], { as: "postIndex" });
    router.add([{ path: "/posts/new", handler: handlers[2] }], { as: "new_post" });
    router.add([{ path: "/posts/:id/edit", handler: handlers[3] }], { as: "edit_post" });
    router.add([{ path: "/foo/:bar", handler: handlers[4] }, { path: "/baz/:bat", handler: handlers[5] }], { as: 'foo' });
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

test("Parsing and generation results into the same input string", function() {
  var query = "filter%20data=date";
  equal(router.generateQueryString(router.parseQueryString(query)), '?' + query);
});

test("Generation works with query params", function() {
  equal( router.generate("index", {queryParams: {filter: 'date'}}), "/?filter=date" );
  equal( router.generate("index", {queryParams: {filter: true}}), "/?filter=true" );
  equal( router.generate("posts", {queryParams: {sort: 'title'}}), "/posts?sort=title");
  equal( router.generate("edit_post", { id: 1, queryParams: {format: 'markdown'} }), "/posts/1/edit?format=markdown" );
  equal( router.generate("edit_post", { id: 1, queryParams: {editor: 'ace'} }), "/posts/1/edit?editor=ace" );
  equal( router.generate("edit_post", { id: 1, queryParams: {format: 'markdown', editor: 'ace'} }),"/posts/1/edit?editor=ace&format=markdown" );
  equal( router.generate("edit_post", { id: 1, queryParams: {format: 'markdown', editor: 'ace'} }),"/posts/1/edit?editor=ace&format=markdown" );
  equal( router.generate("edit_post", { id: 1, queryParams: {format: true, editor: 'ace'} }),"/posts/1/edit?editor=ace&format=true" );
  equal( router.generate("edit_post", { id: 1, queryParams: {format: 'markdown', editor: true} }),"/posts/1/edit?editor=true&format=markdown" );
  equal( router.generate("foo", { bar: 9, bat: 10, queryParams: {a: 1} }),"/foo/9/baz/10?a=1" );
  equal( router.generate("foo", { bar: 9, bat: 10, queryParams: {b: 2} }),"/foo/9/baz/10?b=2" );
  equal( router.generate("foo", { bar: 9, bat: 10, queryParams: {a: 1, b: 2} }),"/foo/9/baz/10?a=1&b=2" );
  equal( router.generate("index", {queryParams: {filter: 'date', sort: false}}), "/?filter=date&sort=false" );
  equal( router.generate("index", {queryParams: {filter: 'date', sort: null}}), "/?filter=date" );
  equal( router.generate("index", {queryParams: {filter: 'date', sort: undefined}}), "/?filter=date" );
  equal( router.generate("index", {queryParams: {filter: 'date', sort: 0}}), "/?filter=date&sort=0" );
});

test("Generation works with array query params", function() {
  equal( router.generate("index", {queryParams: {foo: [1,2,3]}}), "/?foo[]=1&foo[]=2&foo[]=3" );
});

test("Generation works with controller namespaced array query params", function() {
  equal( router.generate("posts", {queryParams: {'foo[bar]': [1,2,3]}}), "/posts?foo[bar][]=1&foo[bar][]=2&foo[bar][]=3" );
});

test("Empty query params don't have an extra question mark", function() {
  equal( router.generate("index", {queryParams: {}}), "/" );
  equal( router.generate("index", {queryParams: null}), "/" );
  equal( router.generate("posts", {queryParams: {}}), "/posts");
  equal( router.generate("posts", {queryParams: null}), "/posts");
  equal( router.generate("posts", {queryParams: { foo: null } }), "/posts");
  equal( router.generate("posts", {queryParams: { foo: undefined } }), "/posts");
});

test("Generating an invalid named route raises", function() {
  QUnit.throws(function() {
    router.generate("nope");
  }, /There is no route named nope/);
});

test("Getting the handlers for a named route", function() {
  deepEqual(router.handlersFor("post"), [ { handler: handlers[0], names: ['id'] } ]);
  deepEqual(router.handlersFor("posts"), [ { handler: handlers[1], names: [] } ]);
  deepEqual(router.handlersFor("new_post"), [ { handler: handlers[2], names: [] } ]);
  deepEqual(router.handlersFor("edit_post"), [ { handler: handlers[3], names: ['id'] } ]);
});

test("Getting a handler for an invalid named route raises", function() {
    QUnit.throws(function() {
        router.handlersFor("nope");
    }, /There is no route named nope/);
});
