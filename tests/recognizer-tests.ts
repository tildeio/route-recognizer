/* globals QUnit */
import RouteRecognizer, {
  QueryParams,
  Result,
  Results
} from "../lib/route-recognizer";

QUnit.module("Route Recognition");

function queryParams<THandler>(
  results: Results<THandler> | undefined
): QueryParams | undefined {
  return results && results.queryParams;
}

function resultsMatch<THandler>(
  assert: Assert,
  actual: Results<THandler> | undefined,
  expected: Result<THandler>[],
  queryParams?: QueryParams
): void {
  assert.deepEqual(actual && actual.slice(), expected);
  if (queryParams) {
    assert.deepEqual(actual && actual.queryParams, queryParams);
  }
}

QUnit.test("A simple route recognizes", (assert: Assert) => {
  const handler = "";
  const router = new RouteRecognizer();
  router.add([{ path: "/foo/bar", handler }]);

  resultsMatch(assert, router.recognize("/foo/bar"), [
    { handler, params: {}, isDynamic: false }
  ]);
  assert.equal(router.recognize("/foo/baz"), null);
});

const slashStaticExpectations = [
  {
    // leading only, trailing only, both, neither
    routes: ["/foo/bar", "foo/bar/", "/foo/bar/", "foo/bar"],
    matches: ["/foo/bar", "foo/bar/", "/foo/bar/", "foo/bar"]
  }
];

const nonAsciiStaticExpectations = [
  {
    // UTF8
    routes: ["/foö/bär", "/fo%C3%B6/b%C3%A4r"],
    matches: ["/foö/bär", "/fo%C3%B6/b%C3%A4r", "fo%c3%b6/b%c3%a4r"]
  },
  {
    // emoji
    routes: ["/foo/😜", "/foo/%F0%9F%98%9C"],
    matches: ["/foo/😜", "/foo/%F0%9F%98%9C"]
  }
];

// ascii chars that are not reserved but sometimes encoded
const unencodedCharStaticExpectations = [
  {
    // unencoded space
    routes: ["/foo /bar"],
    matches: ["/foo /bar", "/foo%20/bar"]
  },
  {
    // unencoded [
    routes: ["/foo[/bar"],
    matches: ["/foo[/bar", "/foo%5B/bar", "/foo%5b/bar"]
  }
];

// Tests for routes that include percent-encoded
// reserved and unreserved characters.
const encodedCharStaticExpectations = [
  {
    // reserved char ":" in significant place, both cases
    routes: ["/foo/%3Abar", "/foo/%3abar"],
    matches: ["/foo/%3Abar", "/foo/%3abar", "/foo/:bar"]
  },
  {
    // reserved char ":" in non-significant place
    routes: ["/foo/b%3Aar", "/foo/b%3aar"],
    matches: ["/foo/b:ar", "/foo/b%3aar", "/foo/b%3Aar"]
  },
  {
    // reserved char "*" in significant place
    routes: ["/foo/%2Abar", "/foo/%2abar"],
    matches: ["/foo/*bar", "/foo/%2Abar", "/foo/%2abar"]
  },
  {
    // reserved char "*" in non-significant place
    routes: ["/foo/b%2Aar", "/foo/b%2aar"],
    matches: ["/foo/b*ar", "/foo/b%2Aar", "/foo/b%2aar"]
  },
  {
    // space: " "
    routes: ["/foo%20/bar"],
    matches: ["/foo /bar", "/foo%20/bar"]
  },
  {
    // reserved char "/"
    routes: ["/foo/ba%2Fr", "/foo/ba%2fr"],
    matches: ["/foo/ba%2Fr", "/foo/ba%2fr"],
    nonmatches: ["/foo/ba/r"]
  },
  {
    // reserved char "%"
    routes: ["/foo/ba%25r"],
    matches: ["/foo/ba%25r"]
    // nonmatches: ["/foo/ba%r"] // malformed URI
  },
  {
    // reserved char "?"
    routes: ["/foo/ba%3Fr"],
    matches: ["/foo/ba%3Fr", "/foo/ba%3fr"],
    nonmatches: ["/foo/ba?r"]
  },
  {
    // reserved char "#" in route segment
    routes: ["/foo/ba%23r"],
    matches: ["/foo/ba%23r"],
    nonmatches: ["/foo/ba#r"] // "#" not valid to include in path when unencoded
  }
];

const staticExpectations: {
  routes: string[];
  matches: string[];
  nonmatches?: string[];
}[] = [
  ...slashStaticExpectations,
  ...nonAsciiStaticExpectations,
  ...unencodedCharStaticExpectations,
  ...encodedCharStaticExpectations
];

staticExpectations.forEach(function(expectation) {
  const { routes, matches } = expectation;
  const nonmatches = expectation.nonmatches || [];

  routes.forEach(function(route) {
    matches.forEach(function(match) {
      QUnit.test(
        "Static route '" + route + "' recognizes path '" + match + "'",
        (assert: Assert) => {
          const handler = {};
          const router = new RouteRecognizer<{}>();
          router.add([{ path: route, handler: handler }]);
          resultsMatch(assert, router.recognize(match), [
            { handler: handler, params: {}, isDynamic: false }
          ]);
        }
      );
    });

    if (nonmatches.length) {
      nonmatches.forEach(function(nonmatch) {
        QUnit.test(
          "Static route '" +
            route +
            "' does not recognize path '" +
            nonmatch +
            "'",
          (assert: Assert) => {
            const handler = {};
            const router = new RouteRecognizer<{}>();
            router.add([{ path: route, handler: handler }]);
            assert.equal(router.recognize(nonmatch), null);
          }
        );
      });
    }
  });
});

QUnit.test(
  "Escaping works for path length with trailing slashes.",
  (assert: Assert) => {
    const handler = {};
    const router = new RouteRecognizer<{}>();
    router.add([{ path: "/foo/:query", handler }]);

    resultsMatch(assert, router.recognize("/foo/%e8%81%8c%e4%bd%8d"), [
      { handler: handler, params: { query: "职位" }, isDynamic: true }
    ]);
    resultsMatch(assert, router.recognize("/foo/%e8%81%8c%e4%bd%8d/"), [
      { handler: handler, params: { query: "职位" }, isDynamic: true }
    ]);
  }
);

QUnit.test("A simple route with query params recognizes", (assert: Assert) => {
  const handler = {};
  const router = new RouteRecognizer<{}>();
  router.add([{ path: "/foo/bar", handler }]);

  resultsMatch(
    assert,
    router.recognize("/foo/bar?sort=date&other=something"),
    [{ handler: handler, params: {}, isDynamic: false }],
    { sort: "date", other: "something" }
  );
  resultsMatch(
    assert,
    router.recognize("/foo/bar?other=something"),
    [{ handler: handler, params: {}, isDynamic: false }],
    { other: "something" }
  );
});

QUnit.test("False query params = 'false'", (assert: Assert) => {
  const handler = {};
  const router = new RouteRecognizer<{}>();
  router.add([{ path: "/foo/bar", handler }]);

  assert.deepEqual(queryParams(router.recognize("/foo/bar?show=false")), {
    show: "false"
  });
  assert.deepEqual(
    queryParams(router.recognize("/foo/bar?show=false&other=something")),
    { show: "false", other: "something" }
  );
});

QUnit.test("True query params = 'true'", (assert: Assert) => {
  const handler = {};
  const router = new RouteRecognizer<{}>();
  router.add([{ path: "/foo/bar", handler }]);

  assert.deepEqual(queryParams(router.recognize("/foo/bar?show=true")), {
    show: "true"
  });
  assert.deepEqual(
    queryParams(router.recognize("/foo/bar?show=true&other=something")),
    { show: "true", other: "something" }
  );
});

QUnit.test("Query params without '='", (assert: Assert) => {
  const handler = {};
  const router = new RouteRecognizer<{}>();
  router.add([{ path: "/foo/bar", handler }]);

  assert.deepEqual(queryParams(router.recognize("/foo/bar?show")), {
    show: "true"
  });
  assert.deepEqual(queryParams(router.recognize("/foo/bar?show&hide")), {
    show: "true",
    hide: "true"
  });
});

QUnit.test("Query params with '=' in value", (assert: Assert) => {
  const handler = {};
  const router = new RouteRecognizer<{}>();
  router.add([{ path: "/foo/bar", handler }]);

  assert.deepEqual(queryParams(router.recognize("/foo/bar?filter=a=b")), {
    filter: "a=b"
  });
  assert.deepEqual(
    queryParams(
      router.recognize(
        `/foo/bar?filter=genres=in=(comedy);actor=="Ryan Reynolds"`
      )
    ),
    { filter: `genres=in=(comedy);actor=="Ryan Reynolds"` }
  );
});

QUnit.test(
  "Query params with = and without value are empty string",
  (assert: Assert) => {
    const handler = {};
    const router = new RouteRecognizer<{}>();
    router.add([{ path: "/foo/bar", handler }]);

    assert.deepEqual(queryParams(router.recognize("/foo/bar?search=")), {
      search: ""
    });
    assert.deepEqual(
      queryParams(router.recognize("/foo/bar?search=&other=something")),
      { search: "", other: "something" }
    );
  }
);

QUnit.test(
  "A simple route with multiple query params recognizes",
  (assert: Assert) => {
    const handler = {};
    const router = new RouteRecognizer<{}>();
    router.add([
      {
        path: "/foo/bar",
        handler,
        queryParams: ["sort", "direction", "category"]
      }
    ]);

    assert.deepEqual(
      queryParams(router.recognize("/foo/bar?sort=date&other=something")),
      { sort: "date", other: "something" }
    );
    assert.deepEqual(
      queryParams(
        router.recognize("/foo/bar?sort=date&other=something&direction=asc")
      ),
      { sort: "date", direction: "asc", other: "something" }
    );
    assert.deepEqual(
      queryParams(
        router.recognize(
          "/foo/bar?sort=date&other=something&direction=asc&category=awesome"
        )
      ),
      {
        sort: "date",
        direction: "asc",
        category: "awesome",
        other: "something"
      }
    );
    assert.deepEqual(
      queryParams(router.recognize("/foo/bar?other=something")),
      { other: "something" }
    );
  }
);

QUnit.test(
  "A simple route with query params with encoding recognizes",
  (assert: Assert) => {
    const handler = {};
    const router = new RouteRecognizer<{}>();
    router.add([{ path: "/foo/bar", handler }]);

    assert.deepEqual(
      queryParams(router.recognize("/foo/bar?other=something%20100%25")),
      { other: "something 100%" }
    );
  }
);

QUnit.test(
  "A route with query params with pluses for spaces instead of %20 recognizes",
  (assert: Assert) => {
    const handler = {};
    const router = new RouteRecognizer<{}>();
    router.add([{ path: "/foo/bar", handler }]);

    assert.deepEqual(
      queryParams(router.recognize("/foo/bar?++one+two=three+four+five++")),
      { "  one two": "three four five  " }
    );
  }
);

QUnit.test("A `/` route recognizes", (assert: Assert) => {
  const handler = {};
  const router = new RouteRecognizer<{}>();
  router.add([{ path: "/", handler }]);

  resultsMatch(assert, router.recognize("/"), [
    { handler: handler, params: {}, isDynamic: false }
  ]);
});

QUnit.test("A `/` route with query params recognizes", (assert: Assert) => {
  const handler = {};
  const router = new RouteRecognizer<{}>();
  router.add([{ path: "/", handler }]);

  resultsMatch(
    assert,
    router.recognize("/?lemon=jello"),
    [{ handler: handler, params: {}, isDynamic: false }],
    { lemon: "jello" }
  );
});

QUnit.test("A dynamic route recognizes", (assert: Assert) => {
  const handler = {};
  const router = new RouteRecognizer<{}>();
  router.add([{ path: "/foo/:bar", handler }]);

  resultsMatch(assert, router.recognize("/foo/bar"), [
    { handler: handler, params: { bar: "bar" }, isDynamic: true }
  ]);
  resultsMatch(assert, router.recognize("/foo/1"), [
    { handler: handler, params: { bar: "1" }, isDynamic: true }
  ]);
  assert.equal(router.recognize("/zoo/baz"), null);
});

const nonAsciiDynamicExpectations = [
  {
    paths: ["/foo/café", "/foo/caf%C3%A9", "/foo/caf%c3%a9"],
    match: "café",
    unencodedMatches: ["café", "café", "café"]
  },
  {
    paths: ["/foo/😜", "/foo/%F0%9F%98%9C"],
    match: "😜",
    unencodedMatches: ["😜", "😜"]
  }
];

const encodedCharDynamicExpectations = [
  {
    // encoded "/", upper and lower
    paths: ["/foo/ba%2Fr", "/foo/ba%2fr"],
    match: "ba/r",
    unencodedMatches: ["ba%2Fr", "ba%2fr"]
  },
  {
    // encoded "#"
    paths: ["/foo/ba%23r"],
    match: "ba#r",
    unencodedMatches: ["ba%23r"]
  },
  {
    // ":"
    paths: ["/foo/%3Abar", "/foo/%3abar", "/foo/:bar"],
    match: ":bar",
    unencodedMatches: ["%3Abar", "%3abar", ":bar"]
  },
  {
    // encoded "?"
    paths: ["/foo/ba%3Fr", "/foo/ba%3fr"],
    match: "ba?r",
    unencodedMatches: ["ba%3Fr", "ba%3fr"]
  },
  {
    // space
    paths: ["/foo/ba%20r", "/foo/ba r"],
    match: "ba r",
    // decodeURI changes "%20" -> " "
    unencodedMatches: ["ba r", "ba r"]
  },
  {
    // "+"
    paths: ["/foo/ba%2Br", "/foo/ba%2br", "/foo/ba+r"],
    match: "ba+r",
    unencodedMatches: ["ba%2Br", "ba%2br", "ba+r"]
  },
  {
    // encoded %
    paths: ["/foo/ba%25r"],
    match: "ba%r",
    unencodedMatches: ["ba%r"]
  },
  {
    // many encoded %
    paths: ["/foo/ba%25%25r%3A%25"],
    match: "ba%%r:%",
    unencodedMatches: ["ba%%r%3A%"]
  },
  {
    // doubly-encoded %
    paths: ["/foo/ba%2525r"],
    match: "ba%25r",
    unencodedMatches: ["ba%25r"]
  },
  {
    // doubly-encoded parameter
    paths: [
      "/foo/" +
        encodeURIComponent(
          "http://example.com/post/" +
            encodeURIComponent("http://other-url.com")
        )
    ],
    match:
      "http://example.com/post/" + encodeURIComponent("http://other-url.com"),
    unencodedMatches: [
      encodeURIComponent("http://example.com/post/http://other-url.com")
    ]
  }
];

const dynamicExpectations: {
  paths: string[];
  match: string;
  unencodedMatches: string[];
}[] = [...nonAsciiDynamicExpectations, ...encodedCharDynamicExpectations];

dynamicExpectations.forEach(expectation => {
  const route = "/foo/:bar";
  const { paths, match, unencodedMatches } = expectation;

  paths.forEach(function(path, index) {
    const unencodedMatch = unencodedMatches[index];

    QUnit.test(
      "Single-segment dynamic route '" +
        route +
        "' recognizes path '" +
        path +
        "'",
      (assert: Assert) => {
        const handler = {};
        const router = new RouteRecognizer<{}>();
        router.add([{ path: route, handler }]);
        resultsMatch(assert, router.recognize(path), [
          { handler: handler, params: { bar: match }, isDynamic: true }
        ]);
      }
    );

    QUnit.test(
      "When RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS is false, single-segment dynamic route '" +
        route +
        "' recognizes path '" +
        path +
        "'",
      (assert: Assert) => {
        RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = false;

        const handler = {};
        const router = new RouteRecognizer<{}>();
        router.add([{ path: route, handler }]);
        resultsMatch(assert, router.recognize(path), [
          { handler: handler, params: { bar: unencodedMatch }, isDynamic: true }
        ]);

        RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = true;
      }
    );
  });
});

const multiSegmentDynamicExpectations = [
  {
    paths: ["/foo%20/bar/baz%20", "/foo /bar/baz "],
    match: { foo: "foo ", baz: "baz " },
    // " " is not a reserved uri character, so "%20" gets normalized to " "
    // see http://www.ecma-international.org/ecma-262/6.0/#sec-uri-syntax-and-semantics
    unencodedMatches: [
      { foo: "foo ", baz: "baz " },
      { foo: "foo ", baz: "baz " }
    ]
  },
  {
    paths: ["/fo%25o/bar/ba%25z"],
    match: { foo: "fo%o", baz: "ba%z" },
    unencodedMatches: [{ foo: "fo%o", baz: "ba%z" }]
  },
  {
    paths: ["/%3Afoo/bar/:baz%3a"],
    match: { foo: ":foo", baz: ":baz:" },
    // ":" is a reserved uri character, so "%3A" does not get normalized to ":"
    unencodedMatches: [{ foo: "%3Afoo", baz: ":baz%3a" }]
  },
  {
    paths: [
      encodeURIComponent("http://example.com/some_url.html?abc=foo") +
        "/bar/" +
        encodeURIComponent("http://example2.com/other.html#hash=bar")
    ],
    match: {
      foo: "http://example.com/some_url.html?abc=foo",
      baz: "http://example2.com/other.html#hash=bar"
    },
    unencodedMatches: [
      {
        foo: decodeURI(
          encodeURIComponent("http://example.com/some_url.html?abc=foo")
        ),
        baz: decodeURI(
          encodeURIComponent("http://example2.com/other.html#hash=bar")
        )
      }
    ]
  },
  {
    paths: ["/föo/bar/bäz", "/f%c3%b6o/bar/b%c3%a4z", "/f%C3%B6o/bar/b%C3%A4z"],
    match: { foo: "föo", baz: "bäz" },
    unencodedMatches: [
      { foo: "föo", baz: "bäz" },
      { foo: "föo", baz: "bäz" },
      { foo: "föo", baz: "bäz" }
    ]
  }
];

multiSegmentDynamicExpectations.forEach(expectation => {
  const route = "/:foo/bar/:baz";
  const { paths, match, unencodedMatches } = expectation;

  paths.forEach((path, index) => {
    const unencodedMatch = unencodedMatches[index];

    QUnit.test(
      "Multi-segment dynamic route '" +
        route +
        "' recognizes path '" +
        path +
        "'",
      (assert: Assert) => {
        const handler = {};
        const router = new RouteRecognizer<{}>();
        router.add([{ path: route, handler }]);

        resultsMatch(assert, router.recognize(path), [
          { handler: handler, params: match, isDynamic: true }
        ]);
      }
    );

    QUnit.test(
      "When RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS is false, multi-segment dynamic route '" +
        route +
        "' recognizes path '" +
        path +
        "'",
      (assert: Assert) => {
        RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = false;

        const handler = {};
        const router = new RouteRecognizer<{}>();
        router.add([{ path: route, handler }]);

        resultsMatch(assert, router.recognize(path), [
          { handler: handler, params: unencodedMatch, isDynamic: true }
        ]);

        RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = true;
      }
    );
  });
});

QUnit.test(
  "A dynamic route with unicode match parameters recognizes",
  (assert: Assert) => {
    const handler = {};
    const router = new RouteRecognizer<{}>();
    router.add([{ path: "/:föo/bar/:bäz", handler }]);
    const path = "/foo/bar/baz";

    const expectedParams = { föo: "foo", bäz: "baz" };
    resultsMatch(assert, router.recognize(path), [
      { handler: handler, params: expectedParams, isDynamic: true }
    ]);
  }
);

const starSimpleExpectations = [
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
  const route = "/foo/*bar";
  const path = "/foo/" + value;

  QUnit.test(
    "Star segment glob route '" + route + "' recognizes path '" + path + "'",
    (assert: Assert) => {
      const handler = {};
      const router = new RouteRecognizer<{}>();
      router.add([{ path: route, handler }]);
      resultsMatch(assert, router.recognize(path), [
        { handler: handler, params: { bar: value }, isDynamic: true }
      ]);
    }
  );
});

const starComplexExpectations = [
  {
    path: "/b%25ar/baz",
    params: ["b%25ar", "baz"]
  },
  {
    path: "a/b/c/baz",
    params: ["a/b/c", "baz"]
  },
  {
    path: "a%2Fb%2fc/baz",
    params: ["a%2Fb%2fc", "baz"]
  },
  {
    path: encodeURIComponent("http://example.com") + "/baz",
    params: [encodeURIComponent("http://example.com"), "baz"]
  }
];

starComplexExpectations.forEach(function(expectation) {
  const route = "/*prefix/:suffix";
  const path = expectation.path;
  const params = {
    prefix: expectation.params[0],
    suffix: expectation.params[1]
  };

  QUnit.test(
    "Complex star segment glob route '" +
      route +
      "' recognizes path '" +
      path +
      "'",
    (assert: Assert) => {
      const router = new RouteRecognizer<{}>();
      const handler = {};
      router.add([{ path: route, handler }]);

      resultsMatch(assert, router.recognize(path), [
        { handler: handler, params: params, isDynamic: true }
      ]);
    }
  );
});

QUnit.test("Multiple routes recognize", (assert: Assert) => {
  const handler1 = { handler: 1 };
  const handler2 = { handler: 2 };
  const router = new RouteRecognizer<{ handler: number }>();

  router.add([{ path: "/foo/:bar", handler: handler1 }]);
  router.add([{ path: "/bar/:baz", handler: handler2 }]);

  resultsMatch(assert, router.recognize("/foo/bar"), [
    { handler: handler1, params: { bar: "bar" }, isDynamic: true }
  ]);
  resultsMatch(assert, router.recognize("/bar/1"), [
    { handler: handler2, params: { baz: "1" }, isDynamic: true }
  ]);
});

QUnit.test("query params ignore the URI malformed error", (assert: Assert) => {
  const handler1 = { handler: 1 };
  const router = new RouteRecognizer<{ handler: number }>();

  router.add([{ path: "/foo", handler: handler1 }]);

  assert.deepEqual(queryParams(router.recognize("/foo?a=1%")), { a: "" });
});

QUnit.test(
  "Multiple routes with overlapping query params recognize",
  (assert: Assert) => {
    const handler1 = { handler: 1 };
    const handler2 = { handler: 2 };
    const router = new RouteRecognizer<{ handler: number }>();

    router.add([{ path: "/foo", handler: handler1 }]);
    router.add([{ path: "/bar", handler: handler2 }]);

    assert.deepEqual(queryParams(router.recognize("/foo")), {});
    assert.deepEqual(queryParams(router.recognize("/foo?a=1")), { a: "1" });
    assert.deepEqual(queryParams(router.recognize("/foo?a=1&b=2")), {
      a: "1",
      b: "2"
    });
    assert.deepEqual(queryParams(router.recognize("/foo?a=1&b=2&c=3")), {
      a: "1",
      b: "2",
      c: "3"
    });
    assert.deepEqual(queryParams(router.recognize("/foo?b=2&c=3")), {
      b: "2",
      c: "3"
    });
    assert.deepEqual(queryParams(router.recognize("/foo?c=3")), { c: "3" });
    assert.deepEqual(queryParams(router.recognize("/foo?a=1&c=3")), {
      a: "1",
      c: "3"
    });

    assert.deepEqual(queryParams(router.recognize("/bar")), {});
    assert.deepEqual(queryParams(router.recognize("/bar?a=1")), { a: "1" });
    assert.deepEqual(queryParams(router.recognize("/bar?a=1&b=2")), {
      a: "1",
      b: "2"
    });
    assert.deepEqual(queryParams(router.recognize("/bar?a=1&b=2&c=3")), {
      a: "1",
      b: "2",
      c: "3"
    });
    assert.deepEqual(queryParams(router.recognize("/bar?b=2&c=3")), {
      b: "2",
      c: "3"
    });
    assert.deepEqual(queryParams(router.recognize("/bar?c=3")), { c: "3" });
    assert.deepEqual(queryParams(router.recognize("/bar?a=1&c=3")), {
      a: "1",
      c: "3"
    });
  }
);

QUnit.test("Deserialize query param array", (assert: Assert) => {
  const handler = {};
  const router = new RouteRecognizer<{}>();
  router.add([{ path: "/foo/bar", handler }]);

  const results = router.recognize("/foo/bar?foo[]=1&foo[]=2");
  const p = results && results.queryParams;
  assert.ok(p && Array.isArray(p["foo"]), "foo is an Array");
  assert.deepEqual(p, { foo: ["1", "2"] });
});

QUnit.test(
  "Array query params do not conflict with controller namespaced query params",
  (assert: Assert) => {
    const handler = {};
    const router = new RouteRecognizer<{}>();
    router.add([{ path: "/foo/bar", handler }]);

    const p = queryParams(
      router.recognize("/foo/bar?foo[bar][]=1&foo[bar][]=2&baz=barf")
    );
    assert.ok(p && Array.isArray(p["foo[bar]"]), "foo[bar] is an Array");
    assert.deepEqual(p, { "foo[bar]": ["1", "2"], baz: "barf" });
  }
);

QUnit.test("Multiple `/` routes recognize", (assert: Assert) => {
  const handler1 = { handler: 1 };
  const handler2 = { handler: 2 };
  const router = new RouteRecognizer<{}>();

  router.add([
    { path: "/", handler: handler1 },
    { path: "/", handler: handler2 }
  ]);
  resultsMatch(assert, router.recognize("/"), [
    { handler: handler1, params: {}, isDynamic: false },
    { handler: handler2, params: {}, isDynamic: false }
  ]);
});

QUnit.test("Overlapping routes recognize", (assert: Assert) => {
  const handler1 = { handler: 1 };
  const handler2 = { handler: 2 };
  const router = new RouteRecognizer<{}>();

  router.add([{ path: "/foo/:baz", handler: handler2 }]);
  router.add([{ path: "/foo/bar/:bar", handler: handler1 }]);

  resultsMatch(assert, router.recognize("/foo/bar/1"), [
    { handler: handler1, params: { bar: "1" }, isDynamic: true }
  ]);
  resultsMatch(assert, router.recognize("/foo/1"), [
    { handler: handler2, params: { baz: "1" }, isDynamic: true }
  ]);
});

QUnit.test("Overlapping star routes recognize", (assert: Assert) => {
  const handler1 = { handler: 1 };
  const handler2 = { handler: 2 };
  const router = new RouteRecognizer<{}>();

  router.add([{ path: "/foo/*bar", handler: handler2 }]);
  router.add([{ path: "/*foo", handler: handler1 }]);

  resultsMatch(assert, router.recognize("/foo/1"), [
    { handler: handler2, params: { bar: "1" }, isDynamic: true }
  ]);
  resultsMatch(assert, router.recognize("/1"), [
    { handler: handler1, params: { foo: "1" }, isDynamic: true }
  ]);
});

QUnit.test("Prefers single dynamic segments over stars", (assert: Assert) => {
  const handler1 = { handler: 1 };
  const handler2 = { handler: 2 };
  const router = new RouteRecognizer<{}>();

  router.add([{ path: "/foo/*star", handler: handler1 }]);
  router.add([{ path: "/foo/*star/:dynamic", handler: handler2 }]);

  resultsMatch(assert, router.recognize("/foo/1"), [
    { handler: handler1, params: { star: "1" }, isDynamic: true }
  ]);
  resultsMatch(assert, router.recognize("/foo/suffix"), [
    { handler: handler1, params: { star: "suffix" }, isDynamic: true }
  ]);
  resultsMatch(assert, router.recognize("/foo/bar/suffix"), [
    {
      handler: handler2,
      params: { star: "bar", dynamic: "suffix" },
      isDynamic: true
    }
  ]);
});

QUnit.test(
  "Handle star routes last when there are trailing `/` routes.",
  (assert: Assert) => {
    const handler1 = { handler: 1 };
    const handler2 = { handler: 2 };
    const handler3 = { handler: 3 };
    const handlerWildcard = { handler: 4 };
    const router = new RouteRecognizer<{ handler: number }>();

    router.add([{ path: "/foo/:dynamic", handler: handler1 }]);
    router.add([
      { path: "/foo/:dynamic", handler: handler1 },
      { path: "/baz/:dynamic", handler: handler2 },
      { path: "/", handler: handler3 }
    ]);
    router.add([
      { path: "/foo/:dynamic", handler: handler1 },
      { path: "/*wildcard", handler: handlerWildcard }
    ]);

    resultsMatch(assert, router.recognize("/foo/r3/baz/w10"), [
      { handler: handler1, params: { dynamic: "r3" }, isDynamic: true },
      { handler: handler2, params: { dynamic: "w10" }, isDynamic: true },
      { handler: handler3, params: {}, isDynamic: false }
    ]);
  }
);

QUnit.test(
  "Handle `/` before globs when the route is empty.",
  (assert: Assert) => {
    const handler1 = { handler: 1 };
    const handler2 = { handler: 2 };
    const router = new RouteRecognizer<{ handler: number }>();

    router.add([{ path: "/", handler: handler1 }]);
    router.add([{ path: "/*notFound", handler: handler2 }]);

    resultsMatch(assert, router.recognize("/"), [
      { handler: handler1, params: {}, isDynamic: false }
    ]);

    resultsMatch(assert, router.recognize("/hello"), [
      { handler: handler2, params: { notFound: "hello" }, isDynamic: true }
    ]);
  }
);

QUnit.test("Routes with trailing `/` recognize", (assert: Assert) => {
  const handler = {};
  const router = new RouteRecognizer<{}>();

  router.add([{ path: "/foo/bar", handler }]);
  resultsMatch(assert, router.recognize("/foo/bar/"), [
    { handler: handler, params: {}, isDynamic: false }
  ]);
});

QUnit.test("Nested routes recognize", (assert: Assert) => {
  const handler1 = { handler: 1 };
  const handler2 = { handler: 2 };

  const router = new RouteRecognizer<{ handler: number }>();
  router.add(
    [
      { path: "/foo/:bar", handler: handler1 },
      { path: "/baz/:bat", handler: handler2 }
    ],
    { as: "foo" }
  );

  resultsMatch(assert, router.recognize("/foo/1/baz/2"), [
    { handler: handler1, params: { bar: "1" }, isDynamic: true },
    { handler: handler2, params: { bat: "2" }, isDynamic: true }
  ]);

  assert.equal(router.hasRoute("foo"), true);
  assert.equal(router.hasRoute("bar"), false);
});

QUnit.test("Nested epsilon routes recognize.", (assert: Assert) => {
  const router = new RouteRecognizer<string>();
  router.add([
    { path: "/", handler: "application" },
    { path: "/", handler: "test1" },
    { path: "/test2", handler: "test1.test2" }
  ]);
  router.add([
    { path: "/", handler: "application" },
    { path: "/", handler: "test1" },
    { path: "/", handler: "test1.index" }
  ]);
  router.add([
    { path: "/", handler: "application" },
    { path: "/", handler: "test1" },
    { path: "/", handler: "test1.index" }
  ]);
  router.add(
    [
      { path: "/", handler: "application" },
      { path: "/:param", handler: "misc" }
    ],
    { as: "misc" }
  );

  resultsMatch(assert, router.recognize("/test2"), [
    { handler: "application", isDynamic: false, params: {} },
    { handler: "test1", isDynamic: false, params: {} },
    { handler: "test1.test2", isDynamic: false, params: {} }
  ]);
});

QUnit.test("Nested routes with query params recognize", (assert: Assert) => {
  const handler1 = { handler: 1 };
  const handler2 = { handler: 2 };

  const router = new RouteRecognizer<{ handler: number }>();
  router.add(
    [
      { path: "/foo/:bar", handler: handler1, queryParams: ["a", "b"] },
      { path: "/baz/:bat", handler: handler2, queryParams: ["b", "c"] }
    ],
    { as: "foo" }
  );

  resultsMatch(
    assert,
    router.recognize("/foo/4/baz/5?a=1"),
    [
      { handler: handler1, params: { bar: "4" }, isDynamic: true },
      { handler: handler2, params: { bat: "5" }, isDynamic: true }
    ],
    { a: "1" }
  );
  resultsMatch(
    assert,
    router.recognize("/foo/4/baz/5?a=1&b=2"),
    [
      { handler: handler1, params: { bar: "4" }, isDynamic: true },
      { handler: handler2, params: { bat: "5" }, isDynamic: true }
    ],
    { a: "1", b: "2" }
  );
  resultsMatch(
    assert,
    router.recognize("/foo/4/baz/5?a=1&b=2&c=3"),
    [
      { handler: handler1, params: { bar: "4" }, isDynamic: true },
      { handler: handler2, params: { bat: "5" }, isDynamic: true }
    ],
    { a: "1", b: "2", c: "3" }
  );
  resultsMatch(
    assert,
    router.recognize("/foo/4/baz/5?b=2&c=3"),
    [
      { handler: handler1, params: { bar: "4" }, isDynamic: true },
      { handler: handler2, params: { bat: "5" }, isDynamic: true }
    ],
    { b: "2", c: "3" }
  );
  resultsMatch(
    assert,
    router.recognize("/foo/4/baz/5?c=3"),
    [
      { handler: handler1, params: { bar: "4" }, isDynamic: true },
      { handler: handler2, params: { bat: "5" }, isDynamic: true }
    ],
    { c: "3" }
  );
  resultsMatch(
    assert,
    router.recognize("/foo/4/baz/5?a=1&c=3"),
    [
      { handler: handler1, params: { bar: "4" }, isDynamic: true },
      { handler: handler2, params: { bat: "5" }, isDynamic: true }
    ],
    { a: "1", c: "3" }
  );

  assert.equal(router.hasRoute("foo"), true);
  assert.equal(router.hasRoute("bar"), false);
});

QUnit.test(
  "If there are multiple matches, the route with the least dynamic segments wins",
  (assert: Assert) => {
    const handler1 = { handler: 1 };
    const handler2 = { handler: 2 };
    const handler3 = { handler: 3 };

    const router = new RouteRecognizer<{ handler: number }>();
    router.add([{ path: "/posts/new", handler: handler1 }]);
    router.add([{ path: "/posts/:id", handler: handler2 }]);
    router.add([{ path: "/posts/edit", handler: handler3 }]);

    resultsMatch(assert, router.recognize("/posts/new"), [
      { handler: handler1, params: {}, isDynamic: false }
    ]);
    resultsMatch(assert, router.recognize("/posts/1"), [
      { handler: handler2, params: { id: "1" }, isDynamic: true }
    ]);
    resultsMatch(assert, router.recognize("/posts/edit"), [
      { handler: handler3, params: {}, isDynamic: false }
    ]);
  }
);

QUnit.test("Empty paths", (assert: Assert) => {
  const handler1 = { handler: 1 };
  const handler2 = { handler: 2 };
  const handler3 = { handler: 3 };
  const handler4 = { handler: 4 };

  const router = new RouteRecognizer<{ handler: number }>();
  router.add([
    { path: "/foo", handler: handler1 },
    { path: "/", handler: handler2 },
    { path: "/bar", handler: handler3 }
  ]);
  router.add([
    { path: "/foo", handler: handler1 },
    { path: "/", handler: handler2 },
    { path: "/baz", handler: handler4 }
  ]);

  resultsMatch(assert, router.recognize("/foo/bar"), [
    { handler: handler1, params: {}, isDynamic: false },
    { handler: handler2, params: {}, isDynamic: false },
    { handler: handler3, params: {}, isDynamic: false }
  ]);
  resultsMatch(assert, router.recognize("/foo/baz"), [
    { handler: handler1, params: {}, isDynamic: false },
    { handler: handler2, params: {}, isDynamic: false },
    { handler: handler4, params: {}, isDynamic: false }
  ]);
});

QUnit.test(
  "Repeated empty segments don't confuse the recognizer",
  (assert: Assert) => {
    const handler1 = { handler: 1 },
      handler2 = { handler: 2 },
      handler3 = { handler: 3 },
      handler4 = { handler: 4 };

    const router = new RouteRecognizer<{ handler: number }>();
    router.add([
      { path: "/", handler: handler1 },
      { path: "/", handler: handler2 },
      { path: "/", handler: handler3 }
    ]);
    router.add([
      { path: "/", handler: handler1 },
      { path: "/", handler: handler2 },
      { path: "/foo", handler: handler4 }
    ]);

    resultsMatch(assert, router.recognize("/"), [
      { handler: handler1, params: {}, isDynamic: false },
      { handler: handler2, params: {}, isDynamic: false },
      { handler: handler3, params: {}, isDynamic: false }
    ]);
    resultsMatch(assert, router.recognize(""), [
      { handler: handler1, params: {}, isDynamic: false },
      { handler: handler2, params: {}, isDynamic: false },
      { handler: handler3, params: {}, isDynamic: false }
    ]);
    resultsMatch(assert, router.recognize("/foo"), [
      { handler: handler1, params: {}, isDynamic: false },
      { handler: handler2, params: {}, isDynamic: false },
      { handler: handler4, params: {}, isDynamic: false }
    ]);
    resultsMatch(assert, router.recognize("foo"), [
      { handler: handler1, params: {}, isDynamic: false },
      { handler: handler2, params: {}, isDynamic: false },
      { handler: handler4, params: {}, isDynamic: false }
    ]);
  }
);

// BUG - https://github.com/emberjs/ember.js/issues/2559
QUnit.test(
  "Dynamic routes without leading `/` and single length param are recognized",
  (assert: Assert) => {
    const handler = {};
    const router = new RouteRecognizer<{}>();

    router.add([{ path: "/foo/:id", handler }]);
    resultsMatch(assert, router.recognize("foo/1"), [
      { handler, params: { id: "1" }, isDynamic: true }
    ]);
  }
);

QUnit.module("Route Generation", hooks => {
  let router: RouteRecognizer<unknown>;
  let handlers: unknown[];

  hooks.beforeEach(() => {
    router = new RouteRecognizer();

    handlers = [{}, {}, {}, {}, {}, {}, {}];

    router.add([{ path: "/", handler: {} }], { as: "index" });
    router.add([{ path: "/posts/:id", handler: handlers[0] }], { as: "post" });
    router.add([{ path: "/posts", handler: handlers[1] }], { as: "posts" });
    router.add(
      [
        { path: "/posts", handler: handlers[1] },
        { path: "/", handler: handlers[4] }
      ],
      { as: "postIndex" }
    );
    router.add([{ path: "/posts/new", handler: handlers[2] }], {
      as: "new_post"
    });
    router.add([{ path: "/posts/:id/edit", handler: handlers[3] }], {
      as: "edit_post"
    });
    router.add(
      [
        { path: "/foo/:bar", handler: handlers[4] },
        { path: "/baz/:bat", handler: handlers[5] }
      ],
      { as: "foo" }
    );
    router.add([{ path: "/*catchall", handler: handlers[5] }], {
      as: "catchall"
    });
  });

  QUnit.test("Generation works", (assert: Assert) => {
    assert.equal(router.generate("index"), "/");
    assert.equal(router.generate("post", { id: 1 }), "/posts/1");
    assert.equal(router.generate("posts"), "/posts");
    assert.equal(router.generate("new_post"), "/posts/new");
    assert.equal(router.generate("edit_post", { id: 1 }), "/posts/1/edit");
    assert.equal(router.generate("postIndex"), "/posts");
    assert.equal(router.generate("catchall", { catchall: "foo" }), "/foo");
  });

  const encodedCharGenerationExpectations = [
    {
      route: "post",
      params: { id: "abc/def" },
      expected: "/posts/abc%2Fdef",
      expectedUnencoded: "/posts/abc/def"
    },
    {
      route: "post",
      params: { id: "abc%def" },
      expected: "/posts/abc%25def",
      expectedUnencoded: "/posts/abc%def"
    },
    {
      route: "post",
      params: { id: "abc def" },
      expected: "/posts/abc%20def",
      expectedUnencoded: "/posts/abc def"
    },
    {
      route: "post",
      params: { id: "café" },
      expected: "/posts/caf%C3%A9",
      expectedUnencoded: "/posts/café"
    },
    {
      route: "edit_post",
      params: { id: "abc/def" },
      expected: "/posts/abc%2Fdef/edit",
      expectedUnencoded: "/posts/abc/def/edit"
    },
    {
      route: "edit_post",
      params: { id: "abc%def" },
      expected: "/posts/abc%25def/edit",
      expectedUnencoded: "/posts/abc%def/edit"
    },
    {
      route: "edit_post",
      params: { id: "café" },
      expected: "/posts/caf%C3%A9/edit",
      expectedUnencoded: "/posts/café/edit"
    }
  ];

  encodedCharGenerationExpectations.forEach(function(expectation) {
    const route = expectation.route;
    const params = expectation.params;
    const expected = expectation.expected;
    const expectedUnencoded = expectation.expectedUnencoded;

    QUnit.test(
      "Encodes dynamic segment value for route '" +
        route +
        "' with params " +
        JSON.stringify(params),
      (assert: Assert) => {
        assert.equal(router.generate(route, params), expected);
      }
    );

    QUnit.test(
      "When RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS is false, does not encode dynamic segment for route '" +
        route +
        "' with params " +
        JSON.stringify(params),
      (assert: Assert) => {
        RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = false;
        assert.equal(router.generate(route, params), expectedUnencoded);
        RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = true;
      }
    );
  });

  QUnit.test(
    "Generating a dynamic segment with unreserved chars does not encode them",
    (assert: Assert) => {
      // See: https://tools.ietf.org/html/rfc3986#section-2.3
      const unreservedChars = ["a", "0", "-", ".", "_", "~"];
      unreservedChars.forEach(function(char) {
        const route = "post";
        const params = { id: char };
        const expected = "/posts/" + char;

        assert.equal(
          router.generate(route, params),
          expected,
          "Unreserved char '" + char + "' is not encoded"
        );
      });
    }
  );

  QUnit.test(
    "Generating a dynamic segment with sub-delims or ':' or '@' does not encode them",
    (assert: Assert) => {
      // See https://tools.ietf.org/html/rfc3986#section-2.2
      const subDelims = ["!", "$", "&", "'", "(", ")", "*", "+", ",", ";", "="];
      const others = [":", "@"];

      const chars = subDelims.concat(others);

      chars.forEach(function(char) {
        const route = "post";
        const params = { id: char };
        const expected = "/posts/" + char;

        assert.equal(
          router.generate(route, params),
          expected,
          "Char '" + char + "' is not encoded when generating dynamic segment"
        );
      });
    }
  );

  QUnit.test(
    "Generating a dynamic segment with general delimiters (except ':' and '@') encodes them",
    (assert: Assert) => {
      // See https://tools.ietf.org/html/rfc3986#section-2.2
      const genDelims = [":", "/", "?", "#", "[", "]", "@"];
      const exclude = [":", "@"];
      const chars = genDelims.filter(function(ch) {
        return !exclude.includes(ch);
      });

      chars.forEach(function(char) {
        const route = "post";
        const params = { id: char };
        const encoded = encodeURIComponent(char);
        assert.ok(
          char !== encoded,
          "precond - encoded '" + char + "' is different ('" + encoded + "')"
        );
        const expected = "/posts/" + encoded;

        assert.equal(
          router.generate(route, params),
          expected,
          "Char '" +
            char +
            "' is encoded to '" +
            encoded +
            "' when generating dynamic segment"
        );
      });
    }
  );

  QUnit.test(
    "Generating a dynamic segment with miscellaneous other values encodes correctly",
    (assert: Assert) => {
      const expectations = [
        {
          // "/"
          id: "abc/def",
          expected: "abc%2Fdef"
        },
        {
          // percent
          id: "abc%def",
          expected: "abc%25def"
        },
        {
          // all sub-delims
          id: "!$&'()*+,;=",
          expected: "!$&'()*+,;="
        },
        {
          // mix of unreserved and sub-delims
          id: "@abc!def$",
          expected: "@abc!def$"
        },
        {
          // mix of chars that should and should not be encoded
          id: "abc?def!ghi#jkl",
          expected: "abc%3Fdef!ghi%23jkl"
        },
        {
          // non-string value should get coerced to string
          id: 1,
          expected: "1"
        }
      ];

      const route = "post";
      expectations.forEach(function(expectation) {
        const params = { id: expectation.id };
        const expected = "/posts/" + expectation.expected;

        assert.equal(
          router.generate(route, params),
          expected,
          "id '" + params.id + "' is generated correctly"
        );
      });
    }
  );

  const globGenerationValues = [
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

  globGenerationValues.forEach(value => {
    QUnit.test(
      "Generating a star segment glob route with param '" +
        value +
        "' passes value through without modification",
      (assert: Assert) => {
        assert.equal(
          router.generate("catchall", { catchall: value }),
          "/" + value
        );
      }
    );
  });

  QUnit.test(
    "Throws when generating dynamic routes with an empty string",
    (assert: Assert) => {
      const router = new RouteRecognizer();
      router.add(
        [
          { path: "/posts", handler: "posts" },
          { path: "/*secret/create", handler: "create" }
        ],
        { as: "create" }
      );
      router.add(
        [
          { path: "/posts", handler: "posts" },
          { path: "/:secret/edit", handler: "edit" }
        ],
        { as: "edit" }
      );

      assert.throws(() => {
        router.generate("create", { secret: "" });
      }, /You must provide a param `secret`./);
      assert.throws(() => {
        router.generate("edit", { secret: "" });
      }, /You must provide a param `secret`./);
    }
  );

  QUnit.test(
    "Fails reasonably when bad params passed to dynamic segment",
    (assert: Assert) => {
      const router = new RouteRecognizer();
      router.add(
        [
          { path: "/posts", handler: "posts" },
          { path: "/*secret/create", handler: "create" }
        ],
        { as: "create" }
      );
      router.add(
        [
          { path: "/posts", handler: "posts" },
          { path: "/:secret/edit", handler: "edit" }
        ],
        { as: "edit" }
      );

      assert.throws(
        function() {
          router.generate("edit");
        },
        /You must pass an object as the second argument to `generate`./,
        "No argument passed."
      );

      assert.throws(
        function() {
          router.generate("edit", false as never);
        },
        /You must pass an object as the second argument to `generate`./,
        "Boolean passed."
      );

      assert.throws(
        function() {
          router.generate("edit", null);
        },
        /You must pass an object as the second argument to `generate`./,
        "`null` passed."
      );

      assert.throws(
        function() {
          router.generate("edit", "123" as never);
        },
        /You must pass an object as the second argument to `generate`./,
        "String passed."
      );

      assert.throws(
        function() {
          router.generate("edit", new String("foo") as never);
        },
        /You must provide param `secret` to `generate`./,
        "`new String()` passed."
      );

      assert.throws(
        function() {
          router.generate("edit", [] as never);
        },
        /You must provide param `secret` to `generate`./,
        "Array passed."
      );

      assert.throws(
        function() {
          router.generate("edit", {});
        },
        /You must provide param `secret` to `generate`./,
        "Object without own property passed."
      );

      assert.throws(
        function() {
          router.generate("create");
        },
        /You must pass an object as the second argument to `generate`./,
        "No argument passed."
      );

      assert.throws(
        function() {
          router.generate("create", false as never);
        },
        /You must pass an object as the second argument to `generate`./,
        "Boolean passed."
      );

      assert.throws(
        function() {
          router.generate("create", null);
        },
        /You must pass an object as the second argument to `generate`./,
        "`null` passed."
      );

      assert.throws(
        function() {
          router.generate("create", "123" as never);
        },
        /You must pass an object as the second argument to `generate`./,
        "String passed."
      );

      assert.throws(
        function() {
          router.generate("create", new String("foo") as never);
        },
        /You must provide param `secret` to `generate`./,
        "`new String()` passed."
      );

      assert.throws(
        function() {
          router.generate("create", [] as never);
        },
        /You must provide param `secret` to `generate`./,
        "Array passed."
      );

      assert.throws(
        function() {
          router.generate("create", {});
        },
        /You must provide param `secret` to `generate`./,
        "Object without own property passed."
      );
    }
  );

  // QUnit.test("Prevents duplicate additions of the same named route.", (assert: Assert) => {
  //   let router = new RouteRecognizer();
  //   router.add([{ path: "/posts/:id/foo", handler: "post" }], { as: "post" });

  //   assert.throws(function() {
  //     router.add([{ path: "/posts/:id", handler: "post" }], { as: "post" });
  //   }, /You may not add a duplicate route named `post`./, "Attempting to clobber an existing route.");
  // });

  QUnit.test(
    "Parsing and generation results into the same input string",
    (assert: Assert) => {
      const query = "filter%20data=date";
      assert.equal(
        router.generateQueryString(router.parseQueryString(query)),
        "?" + query
      );
    }
  );

  QUnit.test("Generation works with query params", (assert: Assert) => {
    assert.equal(
      router.generate("index", { queryParams: { filter: "date" } }),
      "/?filter=date"
    );
    assert.equal(
      router.generate("index", { queryParams: { filter: true } }),
      "/?filter=true"
    );
    assert.equal(
      router.generate("posts", { queryParams: { sort: "title" } }),
      "/posts?sort=title"
    );
    assert.equal(
      router.generate("edit_post", {
        id: 1,
        queryParams: { format: "markdown" }
      }),
      "/posts/1/edit?format=markdown"
    );
    assert.equal(
      router.generate("edit_post", { id: 1, queryParams: { editor: "ace" } }),
      "/posts/1/edit?editor=ace"
    );
    assert.equal(
      router.generate("edit_post", {
        id: 1,
        queryParams: { format: "markdown", editor: "ace" }
      }),
      "/posts/1/edit?editor=ace&format=markdown"
    );
    assert.equal(
      router.generate("edit_post", {
        id: 1,
        queryParams: { format: "markdown", editor: "ace" }
      }),
      "/posts/1/edit?editor=ace&format=markdown"
    );
    assert.equal(
      router.generate("edit_post", {
        id: 1,
        queryParams: { format: true, editor: "ace" }
      }),
      "/posts/1/edit?editor=ace&format=true"
    );
    assert.equal(
      router.generate("edit_post", {
        id: 1,
        queryParams: { format: "markdown", editor: true }
      }),
      "/posts/1/edit?editor=true&format=markdown"
    );
    assert.equal(
      router.generate("foo", { bar: 9, bat: 10, queryParams: { a: 1 } }),
      "/foo/9/baz/10?a=1"
    );
    assert.equal(
      router.generate("foo", { bar: 9, bat: 10, queryParams: { b: 2 } }),
      "/foo/9/baz/10?b=2"
    );
    assert.equal(
      router.generate("foo", { bar: 9, bat: 10, queryParams: { a: 1, b: 2 } }),
      "/foo/9/baz/10?a=1&b=2"
    );
    assert.equal(
      router.generate("index", {
        queryParams: { filter: "date", sort: false }
      }),
      "/?filter=date&sort=false"
    );
    assert.equal(
      router.generate("index", { queryParams: { filter: "date", sort: null } }),
      "/?filter=date"
    );
    assert.equal(
      router.generate("index", {
        queryParams: { filter: "date", sort: undefined }
      }),
      "/?filter=date"
    );
    assert.equal(
      router.generate("index", { queryParams: { filter: "date", sort: 0 } }),
      "/?filter=date&sort=0"
    );
  });

  QUnit.test("Generation works with array query params", (assert: Assert) => {
    assert.equal(
      router.generate("index", { queryParams: { foo: [1, 2, 3] } }),
      "/?foo[]=1&foo[]=2&foo[]=3"
    );
  });

  QUnit.test(
    "Generation works with controller namespaced array query params",
    (assert: Assert) => {
      assert.equal(
        router.generate("posts", { queryParams: { "foo[bar]": [1, 2, 3] } }),
        "/posts?foo[bar][]=1&foo[bar][]=2&foo[bar][]=3"
      );
    }
  );

  QUnit.test(
    "Empty query params don't have an extra question mark",
    (assert: Assert) => {
      assert.equal(router.generate("index", { queryParams: {} }), "/");
      assert.equal(router.generate("index", { queryParams: null }), "/");
      assert.equal(router.generate("posts", { queryParams: {} }), "/posts");
      assert.equal(router.generate("posts", { queryParams: null }), "/posts");
      assert.equal(
        router.generate("posts", { queryParams: { foo: null } }),
        "/posts"
      );
      assert.equal(
        router.generate("posts", { queryParams: { foo: undefined } }),
        "/posts"
      );
    }
  );

  QUnit.test("Generating an invalid named route raises", (assert: Assert) => {
    assert.throws(function() {
      router.generate("nope");
    }, /There is no route named nope/);
  });

  QUnit.test("Getting the handlers for a named route", (assert: Assert) => {
    assert.deepEqual(router.handlersFor("post"), [
      { handler: handlers[0], names: ["id"], shouldDecodes: [true] }
    ]);
    assert.deepEqual(router.handlersFor("posts"), [
      { handler: handlers[1], names: [], shouldDecodes: [] }
    ]);
    assert.deepEqual(router.handlersFor("new_post"), [
      { handler: handlers[2], names: [], shouldDecodes: [] }
    ]);
    assert.deepEqual(router.handlersFor("edit_post"), [
      { handler: handlers[3], names: ["id"], shouldDecodes: [true] }
    ]);
    assert.deepEqual(router.handlersFor("catchall"), [
      { handler: handlers[5], names: ["catchall"], shouldDecodes: [false] }
    ]);
  });

  QUnit.test(
    "Getting a handler for an invalid named route raises",
    (assert: Assert) => {
      assert.throws(function() {
        router.handlersFor("nope");
      }, /There is no route named nope/);
    }
  );

  QUnit.test(
    "Matches the route with the longer static prefix",
    (assert: Assert) => {
      const handler1 = { handler: 1 };
      const handler2 = { handler: 2 };
      const router = new RouteRecognizer<{ handler: number }>();

      router.add([
        { path: "/static", handler: handler2 },
        { path: "/", handler: handler2 }
      ]);
      router.add([
        { path: "/:dynamic", handler: handler1 },
        { path: "/", handler: handler1 }
      ]);

      resultsMatch(assert, router.recognize("/static"), [
        { handler: handler2, params: {}, isDynamic: false },
        { handler: handler2, params: {}, isDynamic: false }
      ]);
    }
  );

  // Re: https://github.com/emberjs/ember.js/issues/13960
  QUnit.test(
    "Matches the route with the longer static prefix with nesting",
    (assert: Assert) => {
      const handler1 = { handler: 1 };
      const handler2 = { handler: 2 };
      const handler3 = { handler: 3 };
      const router = new RouteRecognizer<{ handler: number }>();

      router.add([
        { path: "/", handler: handler1 } /* application route */,
        { path: "/", handler: handler1 } /* posts route */,
        { path: ":post_id", handler: handler1 }
      ]);
      router.add([
        { path: "/", handler: handler3 } /* application route */,
        { path: "/team", handler: handler3 },
        { path: ":user_slug", handler: handler3 }
      ]);
      router.add([
        { path: "/", handler: handler2 } /* application route */,
        { path: "/team", handler: handler2 },
        { path: "/", handler: handler2 } /* index route */
      ]);

      resultsMatch(assert, router.recognize("/5"), [
        { handler: handler1, params: {}, isDynamic: false },
        { handler: handler1, params: {}, isDynamic: false },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { handler: handler1, params: { post_id: "5" }, isDynamic: true }
      ]);

      resultsMatch(assert, router.recognize("/team"), [
        { handler: handler2, params: {}, isDynamic: false },
        { handler: handler2, params: {}, isDynamic: false },
        { handler: handler2, params: {}, isDynamic: false }
      ]);

      resultsMatch(assert, router.recognize("/team/eww_slugs"), [
        { handler: handler3, params: {}, isDynamic: false },
        { handler: handler3, params: {}, isDynamic: false },
        {
          handler: handler3,
          // eslint-disable-next-line @typescript-eslint/camelcase
          params: { user_slug: "eww_slugs" },
          isDynamic: true
        }
      ]);
    }
  );
});
