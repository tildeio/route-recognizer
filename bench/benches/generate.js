var RouteRecognizer = require('../../dist/route-recognizer');

var router = new RouteRecognizer();
var i = 1000;

while (i--) {
  router.add([{ path: "/posts/:id", handler: {} }], { as: "post"+i });
}

module.exports = {
  name: 'Generate',
  fn: function() {
    router.generate("post1", { id: 1 });
  }
};