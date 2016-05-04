var RouteRecognizer = require('../../dist/route-recognizer');

var router = new RouteRecognizer();

router.map(function(match) {
  var i = 1000;
  while (i--) {
    match('/posts/' + i).to('showPost' + i);
  }
});

var serialized = JSON.parse(router.toJSON());

module.exports = {
  name: 'Serialized',
  fn: function() {
    var router = new RouteRecognizer(serialized);
    
    // Look up time is constant
    router.recognize('/posts/1');
  }
};