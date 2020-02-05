/* eslint-env node */
var glob = require("glob");
var path = require("path");
var bench = require("do-you-even-bench");

var suites = [];
glob.sync("./bench/benches/*.js").forEach(function(file) {
  var exported = require(path.resolve(file));
  if (Array.isArray(exported)) {
    suites = suites.concat(exported);
  } else {
    suites.push(exported);
  }
});

bench(suites);
