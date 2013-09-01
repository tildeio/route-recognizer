var router;

module("The match DSL", {
  setup: function() {
    router = new RouteRecognizer();
  }
});

var matchesRoute = function(path, expected) {
  var actual = router.recognize(path);
  deepEqual(actual, expected);
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
    match("/posts/new").to("newPost").withQueryParams('foo', 'bar');
    match("/posts/:id").to("showPost").withQueryParams('baz', 'qux');
    match("/posts/edit").to("editPost").withQueryParams('a', 'b');
  });

  matchesRoute("/posts/new?foo=1&bar=2", [{ handler: "newPost", params: {}, isDynamic: false, queryParams: {foo: '1', bar: '2'} }]);
  matchesRoute("/posts/1?baz=3", [{ handler: "showPost", params: { id: "1" }, isDynamic: true, queryParams: {baz: '3'} }]);
  matchesRoute("/posts/edit", [{ handler: "editPost", params: {}, isDynamic: false, queryParams: {} }]);
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
      match("/new").to("newPost").withQueryParams('foo', 'bar');
      match("/:id").to("showPost").withQueryParams('baz', 'qux');
      match("/edit").to("editPost").withQueryParams('a', 'b');
    });
  });

  matchesRoute("/posts/new?foo=1&bar=2", [{ handler: "newPost", params: {}, isDynamic: false, queryParams: {foo: '1', bar: '2'} }]);
  matchesRoute("/posts/1?baz=3", [{ handler: "showPost", params: { id: "1" }, isDynamic: true, queryParams: {baz: '3'} }]);
  matchesRoute("/posts/edit", [{ handler: "editPost", params: {}, isDynamic: false, queryParams: {} }]);
});

test("checks query params are provided in the right format", function() {
  raises(function() {
    router.map(function(match) {
      match("/posts/new").to("newPost").withQueryParams();
    });
   }, /you must provide arguments to the withQueryParams method/);

  var badFormatRegex = /you should call withQueryParams with a list of strings, e\.g\. withQueryParams\("foo", "bar"\)/;

  raises(function() {
    router.map(function(match) {
      match("/posts/new").to("newPost").withQueryParams(['foo', 'bar']);
    });
   }, badFormatRegex);


  raises(function() {
    router.map(function(match) {
      match("/posts/new").to("newPost").withQueryParams({foo: 'bar'});
    });
   }, badFormatRegex);


  // raises(function() {
  //   router.map(function(match) {
  //     match("/posts").to("posts", function() {

  //     });
  //   });
  // });
});

test("not passing a function with `match` as a parameter raises", function() {
  raises(function() {
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
