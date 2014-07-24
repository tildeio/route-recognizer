var filterES6Modules = require('broccoli-es6-module-filter');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var concat = require('broccoli-concat');
var wrapFiles = require('broccoli-wrap');
var uglify = require('broccoli-uglify-js');
var moveFile = require('broccoli-file-mover');

var amd = filterES6Modules("lib", {
  moduleType: "amd",
  packageName: "route-recognizer",
  main: "route-recognizer",
  anonymous: false
});
amd = pickFiles(amd, {
  srcDir: "/",
  destDir: "/amd"
});

var concatAMD = concat(amd, {
  inputFiles: ["**/*.js"],
  outputFile: "/route-recognizer.amd.js"
});

var commonJS = pickFiles("lib", {
  srcDir: "/",
  destDir: "/commonjs"
});
commonJS = filterES6Modules(commonJS, {
  moduleType: "cjs",
  packageName: "route-recognizer",
  main: "route-recognizer",
  anonymous: false
});

var standalone = pickFiles("vendor", {
  files: ["loader.js"],
  srcDir: "/",
  destDir: "/"
});
standalone = mergeTrees([standalone, amd]);
standalone = concat(standalone, {
  inputFiles: ["loader.js", "**/*.js"],
  outputFile: "/route-recognizer.js"
});
standalone = wrapFiles(standalone, {
  wrapper: ["(function(globals) {\n", "\nglobals.RouteRecognizer = require('route-recognizer')['default'];}(window));"]
});

var uglified = pickFiles(standalone, {
  srcDir: "/",
  destDir: "/"
});
uglified = moveFile(uglified, {
  srcFile: "/route-recognizer.js",
  destFile: "/route-recognizer.min.js"
});
uglified = uglify(uglified, {
  mangle: true
});

var tests = pickFiles("tests", {
  srcDir: "/",
  destDir: "/tests"
});

module.exports = mergeTrees([amd, concatAMD, commonJS, standalone, uglified, tests]);
