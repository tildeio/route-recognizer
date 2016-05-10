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

var slashStaticExpectations = [{
  // leading only, trailing only, both, neither
  routes: ["/foo/bar", "foo/bar/", "/foo/bar/", "foo/bar"],
  matches: ["/foo/bar", "foo/bar/", "/foo/bar/", "foo/bar"]
}];

var nonAsciiStaticExpectations = [{
  // UTF8
  routes: ["/foö/bär", "/fo%C3%B6/b%C3%A4r"],
  matches:  ["/foö/bär", "/fo%C3%B6/b%C3%A4r", "fo%c3%b6/b%c3%a4r"]
}, {
  // emoji
  routes: ["/foo/😜", "/foo/%F0%9F%98%9C"],
  matches: ["/foo/😜", "/foo/%F0%9F%98%9C"]
}];

// ascii chars that are not reserved but sometimes encoded
var unencodedCharStaticExpectations = [{
  // unencoded space
  routes: ["/foo /bar"],
  matches: ["/foo /bar", "/foo%20/bar"]
}, {
  // unencoded [
  routes: ["/foo[/bar"],
  matches: ["/foo[/bar", "/foo%5B/bar", "/foo%5b/bar"]
}];

// Tests for routes that include percent-encoded
// reserved and unreserved characters.
var encodedCharStaticExpectations = [{
  // reserved char ":" in significant place, both cases
  routes: ["/foo/%3Abar", "/foo/%3abar"],
  matches: ["/foo/%3Abar", "/foo/%3abar", "/foo/:bar"]
}, {
  // reserved char ":" in non-significant place
  routes: ["/foo/b%3Aar", "/foo/b%3aar"],
  matches: ["/foo/b:ar", "/foo/b%3aar", "/foo/b%3Aar"],
}, {
  // reserved char "*" in significant place
  routes: ["/foo/%2Abar", "/foo/%2abar"],
  matches: ["/foo/*bar", "/foo/%2Abar", "/foo/%2abar"]
}, {
  // reserved char "*" in non-significant place
  routes: ["/foo/b%2Aar", "/foo/b%2aar"],
  matches: ["/foo/b*ar", "/foo/b%2Aar", "/foo/b%2aar"]
}, {
  // space: " "
  routes: ["/foo%20/bar"],
  matches: ["/foo /bar", "/foo%20/bar"]
}, {
  // reserved char "/"
  routes: ["/foo/ba%2Fr", "/foo/ba%2fr"],
  matches: ["/foo/ba%2Fr", "/foo/ba%2fr"],
  nonmatches: ["/foo/ba/r"]
}, {
  // reserved char "%"
  routes: ["/foo/ba%25r"],
  matches: ["/foo/ba%25r"],
  // nonmatches: ["/foo/ba%r"] // malformed URI
}, {
  // reserved char "?"
  routes: ["/foo/ba%3Fr"],
  matches: ["/foo/ba%3Fr", "/foo/ba%3fr"],
  nonmatches: ["/foo/ba?r"]
}, {
  // reserved char "#" in route segment
  routes: ["/foo/ba%23r"],
  matches: ["/foo/ba%23r"],
  nonmatches: ["/foo/ba#r"] // "#" not valid to include in path when unencoded
}];

var staticExpectations = [].concat(slashStaticExpectations,
                                   nonAsciiStaticExpectations,
                                   unencodedCharStaticExpectations,
                                   encodedCharStaticExpectations);

staticExpectations.forEach(function(expectation) {
  var routes, path, matches, nonmatches;
  routes = expectation.routes || [expectation.route];
  matches = expectation.matches;
  nonmatches = expectation.nonmatches || [];

  routes.forEach(function(route) {
    matches.forEach(function(match) {
      test("Static route '" + route + "' recognizes path '" + match + "'", function() {
        var handler = {};
        var router = new RouteRecognizer();
        router.add([{ path: route, handler: handler }]);
        resultsMatch(router.recognize(match), [{ handler: handler, params: {}, isDynamic: false }]);
      });
    });

    if (nonmatches.length) {
      nonmatches.forEach(function(nonmatch) {
        test("Static route '" + route + "' does not recognize path '" + nonmatch + "'", function() {
          var handler = {};
          var router = new RouteRecognizer();
          router.add([{ path: route, handler: handler }]);
          equal(router.recognize(nonmatch), null);
        });
      });
    }
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

var nonAsciiDynamicExpectations = [{
  paths: ["/foo/café", "/foo/caf%C3%A9", "/foo/caf%c3%a9"],
  match: "café",
  unencodedMatches: ["café", "café", "café"]
}, {
  paths: ["/foo/😜", "/foo/%F0%9F%98%9C"],
  match: "😜",
  unencodedMatches: ["😜", "😜"]
}];

var encodedCharDynamicExpectations = [{
  // encoded "/", upper and lower
  paths: ["/foo/ba%2Fr", "/foo/ba%2fr"],
  match: "ba/r",
  unencodedMatches: ["ba%2Fr", "ba%2fr"]
}, {
  // encoded "#"
  paths: ["/foo/ba%23r"],
  match: "ba#r",
  unencodedMatches: ["ba%23r"]
}, {
  // ":"
  paths: ["/foo/%3Abar", "/foo/%3abar", "/foo/:bar"],
  match: ":bar",
  unencodedMatches: ["%3Abar", "%3abar", ":bar"]
}, {
  // encoded "?"
  paths: ["/foo/ba%3Fr", "/foo/ba%3fr"],
  match: "ba?r",
  unencodedMatches: ["ba%3Fr", "ba%3fr"]
}, {
  // space
  paths: ["/foo/ba%20r", "/foo/ba r"],
  match: "ba r",
  // decodeURI changes "%20" -> " "
  unencodedMatches: ["ba r", "ba r"]
}, {
  // "+"
  paths: ["/foo/ba%2Br", "/foo/ba%2br", "/foo/ba+r"],
  match: "ba+r",
  unencodedMatches: ["ba%2Br", "ba%2br", "ba+r"]
}, {
  // encoded %
  paths: ["/foo/ba%25r"],
  match: "ba%r",
  unencodedMatches: ["ba%r"]
}, {
  // many encoded %
  paths: ["/foo/ba%25%25r%3A%25"],
  match: "ba%%r:%",
  unencodedMatches: ["ba%%r%3A%"]
}, {
  // doubly-encoded %
  paths: ["/foo/ba%2525r"],
  match: "ba%25r",
  unencodedMatches: ["ba%25r"]
}, {
  // doubly-encoded parameter
  paths: ["/foo/" + encodeURIComponent("http://example.com/post/" + encodeURIComponent("http://other-url.com"))],
  match: "http://example.com/post/" + encodeURIComponent("http://other-url.com"),
  unencodedMatches: [encodeURIComponent("http://example.com/post/http://other-url.com")]
}];

var dynamicExpectations = [].concat(nonAsciiDynamicExpectations,
                                    encodedCharDynamicExpectations);

dynamicExpectations.forEach(function(expectation) {
  var route = "/foo/:bar";
  var paths = expectation.paths;
  var match = expectation.match;
  var unencodedMatches = expectation.unencodedMatches;

  paths.forEach(function(path, index) {
    var unencodedMatch = unencodedMatches[index];

    test("Single-segment dynamic route '" + route + "' recognizes path '" + path + "'", function() {
      var handler = {};
      var router = new RouteRecognizer();
      router.add([{ path: route, handler: handler }]);
      resultsMatch(router.recognize(path), [{ handler: handler, params: { bar: match }, isDynamic: true }]);
    });

    test("When RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS is false, single-segment dynamic route '" + route + "' recognizes path '" + path + "'", function() {
      RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = false;

      var handler = {};
      var router = new RouteRecognizer();
      router.add([{ path: route, handler: handler }]);
      resultsMatch(router.recognize(path), [{ handler: handler, params: { bar: unencodedMatch }, isDynamic: true }]);

      RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = true;
    });
  });
});

var multiSegmentDynamicExpectations = [{
  paths: ["/foo%20/bar/baz%20", "/foo /bar/baz "],
  match: { foo: "foo ", baz: "baz " },
  // " " is not a reserved uri character, so "%20" gets normalized to " "
  // see http://www.ecma-international.org/ecma-262/6.0/#sec-uri-syntax-and-semantics
  unencodedMatches: [{foo: "foo ", baz: "baz "},
                     {foo: "foo ", baz: "baz "}]
}, {
  paths: ["/fo%25o/bar/ba%25z"],
  match: { foo: "fo%o", baz: "ba%z" },
  unencodedMatches: [{foo: "fo%o", baz: "ba%z"}]
}, {
  paths: ["/%3Afoo/bar/:baz%3a"],
  match: {foo: ":foo", baz: ":baz:"},
  // ":" is a reserved uri character, so "%3A" does not get normalized to ":"
  unencodedMatches: [{foo: "%3Afoo", baz: ":baz%3a"}]
}, {
  paths: [encodeURIComponent("http://example.com/some_url.html?abc=foo") +
          "/bar/" +
          encodeURIComponent("http://example2.com/other.html#hash=bar")],
  match: {
    foo: "http://example.com/some_url.html?abc=foo",
    baz: "http://example2.com/other.html#hash=bar"
  },
  unencodedMatches: [{
    foo: decodeURI(encodeURIComponent("http://example.com/some_url.html?abc=foo")),
    baz: decodeURI(encodeURIComponent("http://example2.com/other.html#hash=bar"))
  }]
}, {
  paths: ["/föo/bar/bäz", "/f%c3%b6o/bar/b%c3%a4z", "/f%C3%B6o/bar/b%C3%A4z"],
  match: {foo: "föo", baz: "bäz" },
  unencodedMatches: [
    {foo: "föo", baz: "bäz"},
    {foo: "föo", baz: "bäz"},
    {foo: "föo", baz: "bäz"}
  ]
}];

multiSegmentDynamicExpectations.forEach(function(expectation) {
  var route = "/:foo/bar/:baz";
  var paths = expectation.paths;
  var match = expectation.match;
  var unencodedMatches = expectation.unencodedMatches;

  paths.forEach(function(path, index) {
    var unencodedMatch = unencodedMatches[index];

    test("Multi-segment dynamic route '" + route + "' recognizes path '" + path + "'", function() {
      var handler = {};
      var router = new RouteRecognizer();
      router.add([{ path: route, handler: handler }]);

      resultsMatch(router.recognize(path), [{ handler: handler, params: match, isDynamic: true }]);
    });

    test("When RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS is false, multi-segment dynamic route '" + route + "' recognizes path '" + path + "'", function() {
      RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = false;

      var handler = {};
      var router = new RouteRecognizer();
      router.add([{ path: route, handler: handler }]);

      resultsMatch(router.recognize(path), [{ handler: handler, params: unencodedMatch, isDynamic: true }]);

      RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = true;
    });
  });
});

test("A dynamic route with unicode match parameters recognizes", function() {
  var handler = {};
  var router = new RouteRecognizer();
  router.add([{ path: "/:föo/bar/:bäz", handler: handler }]);
  var path = "/foo/bar/baz";

  var expectedParams = { föo: "foo", bäz: "baz" };
  resultsMatch(router.recognize(path), [{ handler: handler, params: expectedParams, isDynamic: true }]);
});

var starSimpleExpectations = [
  // encoded % is left encoded
  "ba%25r",

  // encoded / is left encoded
  "ba%2Fr",

  // multiple segments
  "bar/baz/blah",

  // trailing slash
  "bar/baz/blah/",

  // unencoded url
  "http://example.com/abc_def.html",

  // encoded url
  encodeURIComponent("http://example.com/abc_%def.html")
];

starSimpleExpectations.forEach(function(value) {
  var route = "/foo/*bar";
  var path = "/foo/" + value;

  test("Star segment glob route '" + route + "' recognizes path '" + path + '"', function() {
    var handler = {};
    var router = new RouteRecognizer();
    router.add([{ path: route, handler: handler }]);
    resultsMatch(router.recognize(path), [{ handler: handler, params: { bar: value }, isDynamic: true }]);
  });
});

var starComplexExpectations = [{
  path: "/b%25ar/baz",
  params: ["b%25ar", "baz"]
}, {
  path: "a/b/c/baz",
  params: ["a/b/c", "baz"]
}, {
  path: "a%2Fb%2fc/baz",
  params: ["a%2Fb%2fc", "baz"]
}, {
  path: encodeURIComponent("http://example.com") + "/baz",
  params: [encodeURIComponent("http://example.com"), "baz"]
}];

starComplexExpectations.forEach(function(expectation) {
  var route = "/*prefix/:suffix";
  var path = expectation.path;
  var params = { prefix: expectation.params[0], suffix: expectation.params[1] };

  test("Complex star segment glob route '" + route + "' recognizes path '" + path + '"', function() {
    var router = new RouteRecognizer();
    var handler = {};
    router.add([{ path: route, handler: handler }]);

    resultsMatch(router.recognize(path), [{ handler: handler, params: params, isDynamic: true }]);
  });
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

test("query params ignore the URI malformed error", function() {
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

    handlers = [ {}, {}, {}, {}, {}, {}, {} ];

    router.add([{ path: "/", handler: {} }], { as: "index" });
    router.add([{ path: "/posts/:id", handler: handlers[0] }], { as: "post" });
    router.add([{ path: "/posts", handler: handlers[1] }], { as: "posts" });
    router.add([{ path: "/posts", handler: handlers[1] }, { path: "/", handler: handlers[4] }], { as: "postIndex" });
    router.add([{ path: "/posts/new", handler: handlers[2] }], { as: "new_post" });
    router.add([{ path: "/posts/:id/edit", handler: handlers[3] }], { as: "edit_post" });
    router.add([{ path: "/foo/:bar", handler: handlers[4] }, { path: "/baz/:bat", handler: handlers[5] }], { as: 'foo' });
    router.add([{ path: "/*catchall", handler: handlers[5] }], { as: 'catchall' });
  }
});

test("Generation works", function() {
  equal( router.generate("index"), "/" );
  equal( router.generate("post", { id: 1 }), "/posts/1" );
  equal( router.generate("posts"), "/posts" );
  equal( router.generate("new_post"), "/posts/new" );
  equal( router.generate("edit_post", { id: 1 }), "/posts/1/edit" );
  equal( router.generate("postIndex"), "/posts" );
  equal( router.generate("catchall", { catchall: "foo"}), "/foo" );
});

var encodedCharGenerationExpectations = [{
  route: "post",
  params: { id: "abc/def" },
  expected: "/posts/abc%2Fdef",
  expectedUnencoded: "/posts/abc/def"
}, {
  route: "post",
  params: { id: "abc%def" },
  expected: "/posts/abc%25def",
  expectedUnencoded: "/posts/abc%def"
}, {
  route: "post",
  params: { id: "abc def" },
  expected: "/posts/abc%20def",
  expectedUnencoded: "/posts/abc def"
}, {
  route: "post",
  params: { id: "café" },
  expected: "/posts/caf%C3%A9",
  expectedUnencoded: "/posts/café"
}, {
  route: "edit_post",
  params: { id: "abc/def" },
  expected: "/posts/abc%2Fdef/edit",
  expectedUnencoded: "/posts/abc/def/edit"
}, {
  route: "edit_post",
  params: { id: "abc%def" },
  expected: "/posts/abc%25def/edit",
  expectedUnencoded: "/posts/abc%def/edit"
}, {
  route: "edit_post",
  params: { id: "café" },
  expected: "/posts/caf%C3%A9/edit",
  expectedUnencoded: "/posts/café/edit"
}];

encodedCharGenerationExpectations.forEach(function(expectation) {
  var route = expectation.route;
  var params = expectation.params;
  var expected = expectation.expected;
  var expectedUnencoded = expectation.expectedUnencoded;

  test("Encodes dynamic segment value for route '" + route + "' with params " + JSON.stringify(params), function() {
    equal(router.generate(route, params), expected);
  });

  test("When RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS is false, does not encode dynamic segment for route '" + route + "' with params " + JSON.stringify(params), function() {
    RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = false;
    equal(router.generate(route, params), expectedUnencoded);
    RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = true;
  });
});

var globGenerationValues = [
  "abc/def",
  "abc%2Fdef",
  "abc def",
  "abc%20def",
  "abc%25def",
  "café",
  "caf%C3%A9",
  "/leading-slash",
  "leading-slash/",
  "http://example.com/abc.html?foo=bar",
  encodeURIComponent("http://example.com/abc.html?foo=bar")
];

globGenerationValues.forEach(function(value) {
  test("Generating a star segment glob route with param '" + value + "' passes value through without modification", function() {
    equal(router.generate("catchall", { catchall: value }), "/" + value);
  });
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
