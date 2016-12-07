function Target(path, matcher, delegate) {
  this.path = path;
  this.matcher = matcher;
  this.delegate = delegate;
}

Target.prototype = {
  to: function(target, callback) {
    let delegate = this.delegate;

    if (delegate && delegate.willAddRoute) {
      target = delegate.willAddRoute(this.matcher.target, target);
    }

    this.matcher.add(this.path, target);

    if (callback) {
      if (callback.length === 0) { throw new Error("You must have an argument in the function passed to `to`"); }
      this.matcher.addChild(this.path, target, callback, this.delegate);
    }
    return this;
  }
};

class Matcher {
  routes: any;
  children: any;
  target: any;

  constructor(target?: any) {
    this.routes = {};
    this.children = {};
    this.target = target;
  }

  add(path, handler) {
    this.routes[path] = handler;
  }

  addChild(path, target, callback, delegate) {
    let matcher = new Matcher(target);
    this.children[path] = matcher;

    let match = generateMatch(path, matcher, delegate);

    if (delegate && delegate.contextEntered) {
      delegate.contextEntered(target, match);
    }

    callback(match);
  }
}

function generateMatch(startingPath, matcher, delegate) {
  return function(path, nestedCallback) {
    let fullPath = startingPath + path;

    if (nestedCallback) {
      nestedCallback(generateMatch(fullPath, matcher, delegate));
    } else {
      return new Target(startingPath + path, matcher, delegate);
    }
  };
}

function addRoute(routeArray, path, handler) {
  let len = 0;
  for (let i = 0; i < routeArray.length; i++) {
    len += routeArray[i].path.length;
  }

  path = path.substr(len);
  let route = { path: path, handler: handler };
  routeArray.push(route);
}

function eachRoute(baseRoute, matcher, callback, binding) {
  let routes = matcher.routes;

  for (let path in routes) {
    if (routes.hasOwnProperty(path)) {
      let routeArray = baseRoute.slice();
      addRoute(routeArray, path, routes[path]);

      if (matcher.children[path]) {
        eachRoute(routeArray, matcher.children[path], callback, binding);
      } else {
        callback.call(binding, routeArray);
      }
    }
  }
}

export default function(callback, addRouteCallback?) {
  let matcher = new Matcher();

  callback(generateMatch("", matcher, this.delegate));

  eachRoute([], matcher, function(route) {
    if (addRouteCallback) { addRouteCallback(this, route); }
    else { this.add(route); }
  }, this);
}
