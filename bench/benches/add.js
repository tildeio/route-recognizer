var RouteRecognizer = require('../../dist/route-recognizer');

module.exports = {
  name: 'Add',
  fn: function() {
    var router = new RouteRecognizer();
    var i = 1000;

    while (i--) {
      router.add([{ path: "/foo/" + i, handler: { handler: i } }]);
    }
  }
};