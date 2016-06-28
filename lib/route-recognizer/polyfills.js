var oCreate = Object.create || function(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
};

function bind(fn, scope) {
  return function() {
    return fn.apply(scope, arguments);
  };
}

function isArray(test) {
  return Object.prototype.toString.call(test) === "[object Array]";
}

export { bind, isArray, oCreate };
