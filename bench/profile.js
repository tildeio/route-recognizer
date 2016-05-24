//var RouteRecognizer = require('../dist/route-recognizer.js');
//require('./routes');
load('../dist/route-recognizer.js');
load('./routes.js');

var router = new RouteRecognizer();
//console.startProfile('add');
for (var i = 0; i < ROUTES.length; i++) {
  var route = ROUTES[i][0];
  var options = ROUTES[i][1];
  router.add(route, options);
}
//console.endProfile('add')