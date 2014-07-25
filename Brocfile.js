var pickFiles = require('broccoli-static-compiler');
var transpileES6 = require('broccoli-es6-module-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var concat = require('broccoli-concat');
var writeFile = require('broccoli-file-creator');
var jshint = require('broccoli-jshint');

var libTree = pickFiles('lib', {
  srcDir: '/',
  destDir: '/'
});

var jsHintLib = jshint(libTree);

var libTreeAMD = transpileES6(libTree, {
  moduleName: true
});

var libTreeCJS = transpileES6(libTree, {
  type: 'cjs'
});

libTreeCJS = pickFiles(libTreeCJS, {
  srcDir: '/',
  destDir: '/cjs'
});

libTreeAMD = concat(libTreeAMD, {
  wrapInEval: false,
  inputFiles: ['**/*.js'],
  outputFile: '/route-recognizer.amd.js'
});

var iifeStart = writeFile('iife-start', '(function(global) {');
var iifeStop  = writeFile('iife-stop', '\nglobal.RouteRecognizer = require("route-recognizer")["default"];\n})(window);');

var loader = pickFiles('bower_components/loader.js', {
  srcDir: '/',
  destDir: '/',
  files: ['loader.js']
});

var libTreeGlobal = concat(mergeTrees([loader, iifeStart, iifeStop, libTreeAMD]), {
  wrapInEval: false,
  inputFiles: ['iife-start', 'loader.js', 'route-recognizer.amd.js', 'iife-stop'],
  outputFile: '/route-recognizer.js'
});

var qunitFiles = pickFiles('bower_components/qunit/qunit', {
  srcDir: '/',
  destDir: '/qunit'
});

var testFiles = pickFiles('tests', {
  srcDir: '/',
  destDir: '/'
});

var jsHintTest = jshint(testFiles);

var tests = concat(mergeTrees([jsHintLib, jsHintTest, testFiles], {overwrite: true}), {
  wrapInEval: false,
  inputFiles: ['**/*.js'],
  outputFile: '/tests.js'
});

module.exports = mergeTrees([qunitFiles, testFiles, libTreeAMD, libTreeCJS, libTreeGlobal, tests]);
