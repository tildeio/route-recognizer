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
