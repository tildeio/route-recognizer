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

var slashExpectations = [{
  // exact with leading slash
  route: "/foo/bar",
  path: "/foo/bar",
}, {
  // exact with no leading or trailing slash
  route: "foo/bar",
  path: "foo/bar",
}, {
  // exact with trailing slash
  route: "foo/bar/",
  path: "foo/bar/",
}, {
  // exact with leading and trailing slash
  route: "/foo/bar/",
  path: "/foo/bar/",
}, {
  // route only has leading slash
  route: "/foo/bar",
  path: "foo/bar",
}, {
  // route has leading slash, path trailing slash
  route: "/foo/bar",
  path: "foo/bar/",
}, {
  // route only has trailing slash
  route: "foo/bar/",
  path: "foo/bar",
}, {
  // route has trailing slash, path leading slash
  route: "foo/bar/",
  path: "/foo/bar",
}];

slashExpectations.forEach(function(expectation) {
  test("A static route '" + expectation.route + "' recognizes path '" + expectation.path + "'", function() {
    var handler = {};
    var router = new RouteRecognizer();
    router.add([{ path: expectation.route, handler: handler }]);
    resultsMatch(router.recognize(expectation.path), [{ handler: handler, params: {}, isDynamic: false }]);
  });
});

var nonAsciiExpectations = [{
  // uri-encoded path
  route: "/foö/bär",
  path:  "/fo%C3%B6/b%C3%A4r"
}, {
  // uri-encoded path to lower-case
  route: "/foö/bär",
  path:  "/fo%c3%b6/b%c3%a4r"
}, {
  route: "/uniçø∂∑/ʇɥƃᴉɹlɐ",
  path: encodeURI("/uniçø∂∑/ʇɥƃᴉɹlɐ")
}, {
  // exact match
  route: "/foö/bär",
  path: "/foö/bär"
}, {
  // emoji
  route: "/foo/😜",
  path: "/foo/%F0%9F%98%9C"
}, {
  // emoji exact match
  route: "/foo/😜",
  path: "/foo/😜"
}];

nonAsciiExpectations.forEach(function(expectation) {
  test("A non-ascii static route '" + expectation.route + "' recognizes path '" + expectation.path + "'", function() {
    var handler = {};
    var router = new RouteRecognizer();
    router.add([{ path: expectation.route, handler: handler }]);
    resultsMatch(router.recognize(expectation.path), [{ handler: handler, params: {}, isDynamic: false }]);
  });
});

var reservedCharExpectations = [{
  // "foo/:bar" with encoded ":"
  route: "/foo/%3Abar",
  path: "/foo/%3Abar"
}, {
  // "foo /bar" exact match
  route: "/foo /bar",
  path: "/foo /bar"
}, {
  // "foo /bar" encoded match
  route: "/foo /bar",
  path: "/foo%20/bar"
}, {
  // encoded "/" in route segment "ba/r"
  route: "/foo/ba%2Fr",
  path: "/foo/ba%2Fr"
}, {
  // encoded "/" in "ba/r",n route segment mixed-case, lowercase path
  route: "/foo/ba%2Fr",
  path: "/foo/ba%2fr"
}, {
  // encoded "/" in "ba/r", mixed-case, lowercase route
  route: "/foo/ba%2fr",
  path: "/foo/ba%2Fr"
}, {
  // encoded "%" in route segment "ba%r"
  route: "/foo/ba%25r",
  path: "/foo/ba%25r"
}, {
  // encoded "*" in route segment "ba*r"
  route: "/foo/ba%2Ar",
  path: "/foo/ba%2Ar"
}, {
  // encoded "?" in route segment "ba?r"
  route: "/foo/ba%3Fr",
  path: "/foo/ba%3Fr"
}, {
  // encoded "#" in route segment "ba#r"
  route: "/foo/ba%23r",
  path: "/foo/ba%23r"
}];

reservedCharExpectations.forEach(function(expectation) {
  test("A static route with reserved chars '" + expectation.route + "' recognizes path '" + expectation.path + "'", function() {
    var handler = {};
    var router = new RouteRecognizer();
    router.add([{ path: expectation.route, handler: handler }]);
    resultsMatch(router.recognize(expectation.path), [{ handler: handler, params: {}, isDynamic: false }]);
  });
});

test("A simple route with query params recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler}]);

  resultsMatch(router.recognize("/foo/bar?sort=date&other=something"), [{ handler: handler, params: {}, isDynamic: false }], { sort: 'date', other: 'something' });
  resultsMatch(router.recognize("/foo/bar?other=something"), [{ handler: handler, params: {}, isDynamic: false }], { other: 'something' });
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

test("A route with query params with pluses for spaces instead of %20 recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler: handler}]);

  deepEqual(router.recognize("/foo/bar?++one+two=three+four+five++").queryParams, { '  one two': 'three four five  ' });
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

var reservedCharDynamicExpectations = [{
  // encoded "/"
  route: "/foo/:bar",
  path: "/foo/ba%2Fr",
  match: "ba/r"
}, {
  // encoded "/", path lowercase
  route: "/foo/:bar",
  path: "/foo/ba%2fr",
  match: "ba/r"
}, {
  // encoded "#"
  route: "/foo/:bar",
  path: "/foo/ba%23r",
  match: "ba#r"
}, {
  // encoded ":"
  route: "/foo/:bar",
  path: "/foo/%3Abar",
  match: ":bar"
}, {
  // non-encoded ":"
  route: "/foo/:bar",
  path: "/foo/:bar",
  match: ":bar"
}, {
  // encoded "?"
  route: "/foo/:bar",
  path: "/foo/ba%3Fr",
  match: "ba?r"
}, {
  // encoded " "
  route: "/foo/:bar",
  path: "/foo/ba%20r",
  match: "ba r"
}, {
  // non-encoded " "
  route: "/foo/:bar",
  path: "/foo/ba r",
  match: "ba r"
}, {
  // encoded "+"
  route: "/foo/:bar",
  path: "/foo/ba%2Br",
  match: "ba+r"
}, {
  // non-encoded "+"
  route: "/foo/:bar",
  path: "/foo/ba+r",
  match: "ba+r"
}, {
  // encoded %
  route: "/foo/:bar",
  path: "/foo/ba%25r",
  match: "ba%r"
}, {
  // many encoded %
  route: "/foo/:bar",
  path: "/foo/ba%25%25r%3A%25",
  match: "ba%%r:%"
}];

reservedCharDynamicExpectations.forEach(function(expectation) {
  test("A simple dynamic route '" + expectation.route + "' recognizes path '" + expectation.path + "' with match: '" + expectation.match + "'", function() {
    var handler = {};
    var router = new RouteRecognizer();
    router.add([{ path: expectation.route, handler: handler }]);
    resultsMatch(router.recognize(expectation.path), [{ handler: handler, params: { bar: expectation.match }, isDynamic: true }]);
  });
});

var multiSegmentDynamicExpectations = [{
  route: "/foo/:bar/baz",
  path: "/foo/b ar/baz",
  matches: { bar: "b ar" }
}, {
  route: "/foo/:bar/baz",
  path: "/foo/b%20ar/baz",
  matches: { bar: "b ar" }
}, {
  route: "/foo/:bar/baz",
  path: "/foo/b%25ar/baz",
  matches: { bar: "b%ar" }
}, {
  route: "/foo/:bar/baz",
  path: "/foo/%3abar/baz",
  matches: {bar: ":bar"}
}, {
  route: "/foo/:bar/baz",
  path: "/foo/" + encodeURIComponent("http://example.com/some_url.html?abc=foo") + "/baz",
  matches: { bar: "http://example.com/some_url.html?abc=foo" }
}, {
  route: "/:foo/bar/:baz",
  path: "/föo/bar/bäz",
  matches: {foo: "föo", baz: "bäz" }
}, {
  route: "/:foo/bar/:baz",
  path: "/f%c3%b6o/bar/b%c3%a4z",
  matches: {foo: "föo", baz: "bäz" }
}, {
  // route match names have unicode in them
  route: "/:föo/bar/:bäz",
  path: "/föo/bar/bäz",
  matches: {föo: "föo", bäz: "bäz" }
}];

multiSegmentDynamicExpectations.forEach(function(expectation) {
  var message = "A multi-segment dynamic route '" + expectation.route + "' recognizes path '" + expectation.path +
    "' with matches: '" + JSON.stringify(expectation.matches) + "'";
  test(message, function() {
    var handler = {};
    var router = new RouteRecognizer();
    router.add([{ path: expectation.route, handler: handler }]);

    resultsMatch(router.recognize(expectation.path), [{ handler: handler, params: expectation.matches, isDynamic: true }]);
  });
});

var starExpectations = [{
  // encoded % is left encoded
  route: "/foo/*bar",
  path: "/foo/ba%25r",
  match: "ba%25r"
}, {
  // encoded / is left encoded
  route: "/foo/*bar",
  path: "/foo/ba%2Fr",
  match: "ba%2Fr"
}, {
  // multiple segments
  route: "/foo/*bar",
  path: "/foo/bar/baz/blah",
  match: "bar/baz/blah"
}, {
  // trailing slash
  route: "/foo/*bar",
  path: "/foo/bar/baz/blah/",
  match: "bar/baz/blah/"
}, {
  // unencoded url
  route: "/foo/*bar",
  path: "/foo/http://example.com/abc_def.html",
  match: "http://example.com/abc_def.html"
}, {
  // encoded url
  route: "/foo/*bar",
  path: "/foo/" + encodeURIComponent("http://example.com/abc_%def.html"),
  match: encodeURIComponent("http://example.com/abc_%def.html")
}];

starExpectations.forEach(function(expectation) {
  test("A glob route '" + expectation.route + "' recognizes path '" + expectation.path + "' with match: '" + expectation.match + "'", function() {
    var handler = {};
    var router = new RouteRecognizer();
    router.add([{ path: expectation.route, handler: handler }]);
    resultsMatch(router.recognize(expectation.path), [{ handler: handler, params: { bar: expectation.match }, isDynamic: true }]);
  });
});

test("A simple dynamic route recognizes a path with uri-encoded segment", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/:bar", handler: handler }]);

  var bar = "abc/def";
  var encodedBar = encodeURIComponent(bar);
  resultsMatch(router.recognize("/foo/" + encodedBar), [{ handler: handler, params: { bar: bar }, isDynamic: true }]);
});

test("Setting RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS to false causes simple dynamic route with encoded path segment to not be decoded", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/:bar", handler: handler }]);

  var bar = "abc/def";
  var encodedBar = encodeURIComponent(bar);
  RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = false;
  resultsMatch(router.recognize("/foo/" + encodedBar), [{ handler: handler, params: { bar: encodedBar }, isDynamic: true }]);
  RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = true;
});

test("A complex dynamic route with an encoded segment recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/:bar/baz", handler: handler }]);

  var bar = "abc/def";
  var encodedBar = encodeURIComponent(bar);
  resultsMatch(router.recognize("/foo/" + encodedBar + "/baz"), [{ handler: handler, params: { bar: bar }, isDynamic: true }]);
});

test("Setting RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS to false causes complex dynamic route with an encoded segment to not be decoded", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/foo/:bar/baz", handler: handler }]);

  var bar = "abc/def";
  var encodedBar = encodeURIComponent(bar);
  RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = false;
  resultsMatch(router.recognize("/foo/" + encodedBar + "/baz"), [{ handler: handler, params: { bar: encodedBar }, isDynamic: true }]);
  RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = true;
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

test("ignore the URI malformed error", function() {
  var handler1 = { handler: 1 };
  var router = new RouteRecognizer();

  router.add([{ path: "/foo", handler: handler1 }]);

  deepEqual(router.recognize("/foo?a=1%").queryParams, {a: ""});
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

test("Prefers more specific routes over less specific routes", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/:dynamic/baz", handler: handler1 }]);
  router.add([{ path: "/foo/bar/:dynamic", handler: handler2 }]);

  resultsMatch(router.recognize("/foo/bar/baz"), [{ handler: handler2, params: { dynamic: "baz" }, isDynamic: true }]);
  resultsMatch(router.recognize("/foo/3/baz"), [{ handler: handler1, params: { dynamic: "3" }, isDynamic: true }]);
});

test("Prefers more specific routes with stars over less specific dynamic routes", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/*star", handler: handler1 }]);
  router.add([{ path: "/:dynamicOne/:dynamicTwo", handler: handler2 }]);

  resultsMatch(router.recognize("/foo/bar"), [{ handler: handler1, params: { star: "bar" }, isDynamic: true }]);
});

test("Handle star routes last when there are trailing `/` routes.", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var handler3 = { handler: 3 };
  var handlerWildcard = { handler: 4 };
  var router = new RouteRecognizer();

  router.add([{ path: "/foo/:dynamic", handler: handler1 }]);
  router.add([{ path: "/foo/:dynamic", handler: handler1 }, { path: "/baz/:dynamic", handler: handler2 }, { path: "/", handler: handler3 }]);
  router.add([{ path: "/foo/:dynamic", handler: handler1 }, { path: "/*wildcard", handler: handlerWildcard }]);

  resultsMatch(router.recognize("/foo/r3/baz/w10"), [
    { handler: handler1, params: { dynamic: "r3" }, isDynamic: true },
    { handler: handler2, params: { dynamic: "w10" }, isDynamic: true },
    { handler: handler3, params: { }, isDynamic: false }
  ]);
});

test("Handle `/` before globs when the route is empty.", function() {
  var handler1 = { handler: 1 };
  var handler2 = { handler: 2 };
  var router = new RouteRecognizer();

  router.add([{ path: "/", handler: handler1 }]);
  router.add([{ path: "/*notFound", handler: handler2 }]);

  resultsMatch(router.recognize("/"), [
    { handler: handler1, params: { }, isDynamic: false }
  ]);

  resultsMatch(router.recognize("/hello"), [
    { handler: handler2, params: { notFound: "hello" }, isDynamic: true }
  ]);
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

test("If there are multiple matches, the route with the least dynamic segments wins", function() {
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
  var handler3 = { handler: 3 };
  var handler4 = { handler: 4 };

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

test("Generation encodes dynamic segments", function() {
  var postId = "abc/def";
  var encodedPostId = encodeURIComponent(postId);
  ok(postId !== encodedPostId, "precondition - encoded segment does not equal orginal segment");
  equal( router.generate("post", { id: postId }), "/posts/" + encodedPostId );
  equal( router.generate("edit_post", { id: postId }), "/posts/" + encodedPostId + "/edit" );
});

test("Setting RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS to false causes generation to not encode dynamic segments", function() {
  var postId = "abc/def";
  var encodedPostId = encodeURIComponent(postId);
  ok(postId !== encodedPostId, "precondition - encoded segment does not equal orginal segment");
  RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = false;
  equal( router.generate("post", { id: postId }), "/posts/" + postId );
  equal( router.generate("edit_post", { id: postId }), "/posts/" + postId + "/edit" );
  RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = true;
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
