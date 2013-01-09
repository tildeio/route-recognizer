function Target(path, matcher, delegate) {
  this.path = path;
  this.matcher = matcher;
  this.delegate = delegate;
}

Target.prototype = {
  to: function(target, callback) {
    var delegate = this.delegate;

    if (!callback && delegate && delegate.willAddRoute) {
      target = delegate.willAddRoute(this.matcher.target, target);
    }

    this.matcher.add(this.path, target);

    if (callback) {
      this.matcher.addChild(this.path, target, callback, this.delegate);
    }
  }
};

function Matcher(target) {
  this.routes = {};
  this.children = {};
  this.target = target;
}

Matcher.prototype = {
  add: function(path, handler) {
    this.routes[path] = handler;
  },

  addChild: function(path, target, callback, delegate) {
    var matcher = new Matcher(target);
    this.children[path] = matcher;

    var match = generateMatch(path, matcher, delegate);

    if (delegate && delegate.contextEntered) {
      delegate.contextEntered(target, match);
    }

    callback(match);
  }
};

function generateMatch(startingPath, matcher, delegate) {
  return function(path, nestedCallback) {
    var fullPath = startingPath + path;

    if (nestedCallback) {
      nestedCallback(generateMatch(fullPath, matcher, delegate));
    } else {
      return new Target(startingPath + path, matcher, delegate);
    }
  };
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

RouteRecognizer.prototype.map = function(callback, addRouteCallback) {
  var matcher = new Matcher();

  callback(generateMatch("", matcher, this.delegate));

  eachRoute([], matcher, function(route) {
    if (addRouteCallback) { addRouteCallback(this, route); }
    else { this.add(route); }
  }, this);
};
