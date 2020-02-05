import { createMap } from "./util";

export interface Delegate<THandler> {
  contextEntered?(context: THandler, route: MatchDSL<THandler>): void;
  willAddRoute?(context: THandler | undefined, route: THandler): THandler;
}

export interface Route<THandler> {
  path: string;
  handler: THandler;
  queryParams?: string[];
}

export interface RouteRecognizer<THandler> {
  delegate: Delegate<THandler> | undefined;
  add(routes: Route<THandler>[]): void;
}

export type MatchCallback<THandler> = (match: MatchDSL<THandler>) => void;

export interface MatchDSL<THandler> {
  (path: string): ToDSL<THandler>;
  (path: string, callback: MatchCallback<THandler>): void;
}

export interface ToDSL<THandler> {
  to(name: THandler, callback?: MatchCallback<THandler>): void;
}

class Target<THandler> implements ToDSL<THandler> {
  path: string;
  matcher: Matcher<THandler>;
  delegate: Delegate<THandler> | undefined;

  constructor(
    path: string,
    matcher: Matcher<THandler>,
    delegate: Delegate<THandler> | undefined
  ) {
    this.path = path;
    this.matcher = matcher;
    this.delegate = delegate;
  }

  to(target: THandler, callback: MatchCallback<THandler>): void {
    const delegate = this.delegate;

    if (delegate && delegate.willAddRoute) {
      target = delegate.willAddRoute(this.matcher.target, target);
    }

    this.matcher.add(this.path, target);

    if (callback) {
      if (callback.length === 0) {
        throw new Error(
          "You must have an argument in the function passed to `to`"
        );
      }
      this.matcher.addChild(this.path, target, callback, this.delegate);
    }
  }
}

export class Matcher<THandler> {
  routes: {
    [path: string]: THandler | undefined;
  };
  children: {
    [path: string]: Matcher<THandler> | undefined;
  };
  target: THandler | undefined;

  constructor(target?: THandler) {
    this.routes = createMap<THandler>();
    this.children = createMap<Matcher<THandler>>();
    this.target = target;
  }

  add(path: string, target: THandler): void {
    this.routes[path] = target;
  }

  addChild(
    path: string,
    target: THandler,
    callback: MatchCallback<THandler>,
    delegate: Delegate<THandler> | undefined
  ): void {
    const matcher = new Matcher<THandler>(target);
    this.children[path] = matcher;

    const match = generateMatch(path, matcher, delegate);

    if (delegate && delegate.contextEntered) {
      delegate.contextEntered(target, match);
    }

    callback(match);
  }
}

function generateMatch<THandler>(
  startingPath: string,
  matcher: Matcher<THandler>,
  delegate: Delegate<THandler> | undefined
): MatchDSL<THandler> {
  function match(path: string): ToDSL<THandler>;
  function match(path: string, callback: MatchCallback<THandler>): void;
  function match(
    path: string,
    callback?: MatchCallback<THandler>
  ): ToDSL<THandler> | void {
    const fullPath = startingPath + path;
    if (callback) {
      callback(generateMatch(fullPath, matcher, delegate));
    } else {
      return new Target(fullPath, matcher, delegate);
    }
  }
  return match;
}

function addRoute<THandler>(
  routeArray: Route<THandler>[],
  path: string,
  handler: THandler
): void {
  let len = 0;
  for (let i = 0; i < routeArray.length; i++) {
    len += routeArray[i].path.length;
  }

  path = path.substr(len);
  const route = { path, handler };
  routeArray.push(route);
}

function eachRoute<TThis, THanlder>(
  baseRoute: Route<THanlder>[],
  matcher: Matcher<THanlder>,
  callback: (this: TThis, routes: Route<THanlder>[]) => void,
  binding: TThis
): void {
  const routes = matcher.routes;
  const paths = Object.keys(routes);
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const routeArray = baseRoute.slice();
    addRoute(routeArray, path, routes[path]);
    const nested = matcher.children[path];
    if (nested) {
      eachRoute(routeArray, nested, callback, binding);
    } else {
      callback.call(binding, routeArray);
    }
  }
}

export default function map<
  TRouteRecognizer extends RouteRecognizer<THandler>,
  THandler
>(
  this: TRouteRecognizer,
  callback: MatchCallback<THandler>,
  addRouteCallback?: (
    routeRecognizer: TRouteRecognizer,
    routes: Route<THandler>[]
  ) => void
): void {
  const matcher = new Matcher<THandler>();

  callback(generateMatch("", matcher, this.delegate));

  eachRoute(
    [],
    matcher,
    function(routes: Route<THandler>[]) {
      if (addRouteCallback) {
        addRouteCallback(this, routes);
      } else {
        this.add(routes);
      }
    },
    this
  );
}
