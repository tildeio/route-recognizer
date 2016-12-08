export interface Delegate {
  contextEntered?(context: string, route: MatchDSL): void;
  willAddRoute?(context: string | undefined, route: string): string;
}

export interface Route {
  path: string;
  handler: any;
  queryParams?: string[];
}

export interface RouteRecognizer {
  delegate: Delegate | undefined;
  add(routes: Route[]): void;
}

export interface MatchDSL {
  (path: string): ToDSL;
  (path: string, callback: (match: MatchDSL) => void): void;
}

export interface ToDSL {
  to(name: string, callback?: (match: MatchDSL) => void): void;
}

class Target implements ToDSL {
  path: string;
  matcher: Matcher;
  delegate: Delegate | undefined;

  constructor(path: string, matcher: Matcher, delegate: Delegate | undefined) {
    this.path = path;
    this.matcher = matcher;
    this.delegate = delegate;
  }

  to(target: string, callback: (match: MatchDSL) => void) {
    let delegate = this.delegate;

    if (delegate && delegate.willAddRoute) {
      target = delegate.willAddRoute(this.matcher.target, target);
    }

    this.matcher.add(this.path, target);

    if (callback) {
      if (callback.length === 0) { throw new Error("You must have an argument in the function passed to `to`"); }
      this.matcher.addChild(this.path, target, callback, this.delegate);
    }
  }
}

export class Matcher {
  routes: {
    [path: string]: string | undefined;
  };
  children: {
    [path: string]: Matcher | undefined;
  };
  target: string | undefined;

  constructor(target?: string) {
    this.routes = {};
    this.children = {};
    this.target = target;
  }

  add(path: string, target: string) {
    this.routes[path] = target;
  }

  addChild(path: string, target: string, callback: (match: MatchDSL) => void, delegate: Delegate | undefined) {
    let matcher = new Matcher(target);
    this.children[path] = matcher;

    let match = generateMatch(path, matcher, delegate);

    if (delegate && delegate.contextEntered) {
      delegate.contextEntered(target, match);
    }

    callback(match);
  }
}

function generateMatch(startingPath: string, matcher: Matcher, delegate: Delegate | undefined): MatchDSL {
  function match(path: string): ToDSL;
  function match(path: string, nestedCallback: (match: MatchDSL) => void): void;
  function match(path: string, nestedCallback?: (match: MatchDSL) => void): ToDSL | void {
    let fullPath = startingPath + path;
    if (nestedCallback) {
      nestedCallback(generateMatch(fullPath, matcher, delegate));
    } else {
      return new Target(fullPath, matcher, delegate);
    }
  };
  return match;
}

function addRoute(routeArray: Route[], path: string, handler: any) {
  let len = 0;
  for (let i = 0; i < routeArray.length; i++) {
    len += routeArray[i].path.length;
  }

  path = path.substr(len);
  let route = { path: path, handler: handler };
  routeArray.push(route);
}

function eachRoute<T>(baseRoute: Route[], matcher: Matcher, callback: (this: T, routes: Route[]) => void, binding: T) {
  let routes = matcher.routes;

  for (let path in routes) {
    if (routes.hasOwnProperty(path)) {
      let routeArray = baseRoute.slice();
      addRoute(routeArray, path, routes[path]);

      let nested = matcher.children[path];
      if (nested) {
        eachRoute(routeArray, nested, callback, binding);
      } else {
        callback.call(binding, routeArray);
      }
    }
  }
}

export default function <T extends RouteRecognizer>(this: T, callback: (match: MatchDSL) => void, addRouteCallback?: (routeRecognizer: T, routes: Route[]) => void) {
  let matcher = new Matcher();

  callback(generateMatch("", matcher, this.delegate));

  eachRoute([], matcher, function(routes: Route[]) {
    if (addRouteCallback) { addRouteCallback(this, routes); }
    else { this.add(routes); }
  }, this);
}
