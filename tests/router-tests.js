var router;

module("The match DSL", {
  setup: function() {
    router = new Router();
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

  matchesRoute("/posts/new", [{ handler: "newPost", params: {} }]);
  matchesRoute("/posts/1", [{ handler: "showPost", params: { id: "1" } }]);
  matchesRoute("/posts/edit", [{ handler: "editPost", params: {} }]);
});

test("supports nested match", function() {
  router.map(function(match) {
    match("/posts", function(match) {
      match("/new").to("newPost");
      match("/:id").to("showPost");
      match("/edit").to("editPost");
    });
  });

  matchesRoute("/posts/new", [{ handler: "newPost", params: {} }]);
  matchesRoute("/posts/1", [{ handler: "showPost", params: { id: "1" } }]);
  matchesRoute("/posts/edit", [{ handler: "editPost", params: {} }]);
});

test("supports nested handlers", function() {
  router.map(function(match) {
    match("/posts").to("posts", function(match) {
      match("/new").to("newPost");
      match("/:id").to("showPost");
      match("/edit").to("editPost");
    });
  });

  matchesRoute("/posts/new", [{ handler: "posts", params: {} }, { handler: "newPost", params: {} }]);
  matchesRoute("/posts/1", [{ handler: "posts", params: {} }, { handler: "showPost", params: { id: "1" } }]);
  matchesRoute("/posts/edit", [{ handler: "posts", params: {} }, { handler: "editPost", params: {} }]);
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

  matchesRoute("/posts/new", [{ handler: "posts", params: {} }, { handler: "newPost", params: {} }]);
  matchesRoute("/posts/1/index", [{ handler: "posts", params: {} }, { handler: "showPost", params: { id: "1" } }, { handler: "postIndex", params: {} }]);
  matchesRoute("/posts/1/comments", [{ handler: "posts", params: {} }, { handler: "showPost", params: { id: "1" } }, { handler: "postComments", params: {} }]);
  matchesRoute("/posts/ne/comments", [{ handler: "posts", params: {} }, { handler: "showPost", params: { id: "ne" } }, { handler: "postComments", params: {} }]);
  matchesRoute("/posts/edit", [{ handler: "posts", params: {} }, { handler: "editPost", params: {} }]);
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

  matchesRoute("/posts/new", [{ handler: "posts", params: {} }, { handler: "newPost", params: {} }]);
  matchesRoute("/posts/1", [{ handler: "posts", params: {} }, { handler: "showPost", params: { id: "1" } }, { handler: "postIndex", params: {} }]);
  matchesRoute("/posts/1/comments", [{ handler: "posts", params: {} }, { handler: "showPost", params: { id: "1" } }, { handler: "postComments", params: {} }]);
  matchesRoute("/posts/edit", [{ handler: "posts", params: {} }, { handler: "editPost", params: {} }]);
});
