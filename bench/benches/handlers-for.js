/* eslint-env node */
var RouteRecognizer = require("../../dist/route-recognizer");

var router = new RouteRecognizer();
var i = 1000;

while (i--) {
  router.add([{ path: "/foo/" + i, handler: { handler: i } }], {
    as: "foo" + i
  });
}

module.exports = {
  name: "Handlers For",
  fn: function() {
    router.handlersFor("foo1");
  }
};
