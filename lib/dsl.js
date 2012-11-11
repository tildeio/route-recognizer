(function(exports) {

function Target(path, matcher) {
  this.path = path;
  this.matcher = matcher;
}

Target.prototype = {
  to: function(target, callback) {
    this.matcher.add(this.path, target);

    if (callback) {
      this.matcher.addChild(this.path, callback)
    }
  }
}

function Matcher() {
  this.routes = {};
  this.children = {};
}

Matcher.prototype = {
  add: function(path, handler) {
    this.routes[path] = handler;
  },

  addChild: function(path, callback) {
    var matcher = new Matcher();
    this.children[path] = matcher;
    callback(generateMatch(path, matcher));
  }
}

function generateMatch(startingPath, matcher) {
  return function(path, nestedCallback) {
    var fullPath = startingPath + path;

    if (nestedCallback) {
      nestedCallback(generateMatch(fullPath, matcher));
    } else {
      return new Target(startingPath + path, matcher);
    }
  }
}

function addRoute(routeArray, path, handler) {
  var len = 0;
  for (var i=0, l=routeArray.length; i<l; i++) {
    len += routeArray[i].path.length;
  }

  path = path.substr(len);
  routeArray.push({ path: path, handler: handler });
}

function eachRoute(baseRoute, matcher, callback, binding) {
  var routes = matcher.routes;

  for (var path in routes) {
    if (routes.hasOwnProperty(path)) {
      var routeArray = baseRoute.slice();
      addRoute(routeArray, path, routes[path]);

      if (matcher.children[path]) {
        eachRoute(routeArray, matcher.children[path], callback, binding);
      } else {
        callback.call(binding, routeArray);
      }
    }
  }
}

exports.RouteRecognizer.prototype.map = function(callback, addRouteCallback) {
  var matcher = new Matcher();

  function match(path, nestedCallback) {
    return new Target(path, matcher);
  }

  callback(generateMatch("", matcher));

  eachRoute([], matcher, function(route) {
    if (addRouteCallback) { addRouteCallback(this, route); }
    else { this.add(route); }
  }, this);
};

})(window);
