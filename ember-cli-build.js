var Buffer = require('buffer').Buffer;
var path = require('path');
var Rollup = require('broccoli-rollup');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var replace = require('broccoli-string-replace');
var typescript = require('broccoli-typescript-compiler').typescript;
var buble = require('rollup-plugin-buble');
var fs = require('fs');

var SOURCE_MAPPING_DATA_URL = '//# sourceMap';
SOURCE_MAPPING_DATA_URL += 'pingURL=data:application/json;base64,';

module.exports = function () {
  var src = new MergeTrees([
    new Funnel(path.dirname(require.resolve('@types/qunit/package')), {
      include: [ "**/*.d.ts" ],
      destDir: "qunit",
      annotation: "qunit typescript typings"
    }),
    replace(new Funnel("lib", {
      include: [ "**/*.ts" ]
    }), {
      files: ["route-recognizer.ts"],
      pattern: {
        match: /VERSION_STRING_PLACEHOLDER/g,
        replacement: require("./package").version
      }
    }),
    new Funnel("tests", {
      include: [ "**/*.ts" ],
      destDir: "tests"
    })
  ]);

  var compiled = typescript(src, {
    annotation: 'compile route-recognizer.ts',
    tsconfig: {
      compilerOptions: {
        module: "es2015",
        moduleResolution: "node",
        target: "es2015",
        declaration: true,
        strictNullChecks: true,
        inlineSourceMap: true,
        inlineSources: true,
        baseUrl: ".",
        paths: {
          "route-recognizer": ["route-recognizer.ts"]
        }
      },
      files: [
        "route-recognizer.ts",
        "qunit/index.d.ts",
        "tests/index.ts"
      ]
    }
  });
  return new MergeTrees([
    new Rollup(compiled, {
      annotation: 'route-recognizer.js',
      rollup: {
        entry: 'route-recognizer.js',
        plugins: [ loadWithInlineMap(), buble() ],
        sourceMap: true,
        targets: [{
          dest: 'route-recognizer.es.js',
          format: 'es',
        }, {
          dest: 'route-recognizer.js',
          format: 'umd',
          moduleId: 'route-recognizer',
          moduleName: 'RouteRecognizer'
        }]
      }
    }),
    new Rollup(compiled, {
      annotation: 'tests/index.js',
      rollup: {
        entry: 'tests/index.js',
        plugins: [ loadWithInlineMap(), buble() ],
        sourceMap: true,
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
    new Funnel(path.dirname(require.resolve('qunitjs')), {
      annotation: 'tests/qunit.{js,css}',
      files: ['qunit.css', 'qunit.js'],
      destDir: 'tests'
    })
  ], {
    annotation: 'dist'
  });
};

function loadWithInlineMap() {
  return {
    load: function (id) {
      var code = fs.readFileSync(id, 'utf8');
      var result = {
        code: code,
        map: null
      };
      var index = code.lastIndexOf(SOURCE_MAPPING_DATA_URL);
      if (index === -1) {
        return result;
      }
      result.code = code;
      result.map = parseSourceMap(code.slice(index + SOURCE_MAPPING_DATA_URL.length));
      return result;
    }
  };
}

function parseSourceMap(base64) {
  return JSON.parse(new Buffer(base64, 'base64').toString('utf8'));
}
