function Target(path, matcher, delegate) {
  this.path = path;
  this.matcher = matcher;
  this.delegate = delegate;
}

Target.prototype = {
  to: function(target, callback) {
    var delegate = this.delegate;

    if (delegate && delegate.willAddRoute) {
      target = delegate.willAddRoute(this.matcher.target, target);
    }

    this.matcher.add(this.path, target);

    if (callback) {
      if (callback.length === 0) { throw new Error("You must have an argument in the function passed to `to`"); }
      this.matcher.addChild(this.path, target, callback, this.delegate);
    }
    return this;
  },

  withQueryParams: function() {
    if (arguments.length === 0) { throw new Error("you must provide arguments to the withQueryParams method"); }
    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] !== "string") {
        throw new Error('you should call withQueryParams with a list of strings, e.g. withQueryParams("foo", "bar")');
      }
    }
    var queryParams = [].slice.call(arguments);
    this.matcher.addQueryParams(this.path, queryParams);
  }
};

function Matcher(target) {
  this.routes = {};
  this.children = {};
  this.queryParams = {};
  this.target = target;
}

Matcher.prototype = {
  add: function(path, handler) {
    this.routes[path] = handler;
  },

  addQueryParams: function(path, params) {
    this.queryParams[path] = params;
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

function addRoute(routeArray, path, handler, queryParams) {
  var len = 0;
  for (var i=0, l=routeArray.length; i<l; i++) {
    len += routeArray[i].path.length;
  }

  path = path.substr(len);
  var route = { path: path, handler: handler };
  if(queryParams) { route.queryParams = queryParams; }
  routeArray.push(route);
}

function eachRoute(baseRoute, matcher, callback, binding) {
  var routes = matcher.routes;
  var queryParams = matcher.queryParams;

  for (var path in routes) {
    if (routes.hasOwnProperty(path)) {
      var routeArray = baseRoute.slice();
      addRoute(routeArray, path, routes[path], queryParams[path]);

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
