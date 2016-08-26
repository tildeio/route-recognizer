var Rollup = require('broccoli-rollup');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var replace = require('rollup-plugin-replace');

module.exports = function () {
  return new MergeTrees([
    new Rollup('lib', {
      annotation: 'route-recognizer.js',
      rollup: {
        entry: 'route-recognizer.js',
        plugins: [replace({
          VERSION_STRING_PLACEHOLDER: require('./package.json').version
        })],
        targets: [{
          dest: 'es6/route-recognizer.js',
          format: 'es'
        }, {
          dest: 'named-amd/route-recognizer.js',
          format: 'amd',
          moduleId: 'route-recognizer'
        }, {
          sourceMap: true,
          dest: 'route-recognizer.js',
          format: 'umd',
          moduleId: 'route-recognizer',
          moduleName: 'RouteRecognizer'
        }]
      }
    }),
    new Rollup('tests', {
      annotation: 'tests/index.js',
      rollup: {
        entry: 'index.js',
        external: ['route-recognizer'],
        targets: [{
          dest: 'tests/index.js',
          format: 'iife',
          globals: {
            'route-recognizer': 'RouteRecognizer'
          }
        }]
      }
    }),
    new Funnel('tests', {
      annotation: 'tests/index.html',
      files: ['index.html'],
      destDir: 'tests'
    }),
    new Funnel('bower_components/qunit/qunit', {
      annotation: 'tests/qunit.{js,css}',
      files: ['qunit.css', 'qunit.js'],
      destDir: 'tests'
    })
  ], { 
    annotation: 'dist'
  });
}
