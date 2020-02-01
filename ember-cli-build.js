/* globals __dirname */
const path = require('path');
const Rollup = require('broccoli-rollup');
const funnel = require('broccoli-funnel');
const merge = require('broccoli-merge-trees');
const replace = require('broccoli-string-replace');
const typescript = require('broccoli-typescript-compiler').default;
const sourcemaps = require("rollup-plugin-sourcemaps");
const BroccoliPlugin = require('broccoli-plugin');
const fs = require('fs');
const TreeSync = require("tree-sync");
const glob = require("glob");

class JsImportFix extends BroccoliPlugin {
  constructor(input) {
    super([input], {
      persistentOutputFlag: true,
      needsCacheFlag: false,
    });
  }

  build() {
    const inputPath = this.inputPaths[0];
    const outputPath = this.outputPath;
    if (this.treeSync === undefined) {
      this.treeSync = new TreeSync(inputPath, outputPath);
    }
    this.treeSync.sync();
    glob.sync("**/*.js", { cwd: outputPath }).forEach(js => {
      const file = path.join(outputPath, js);
      let src = fs.readFileSync(file, "utf8");
      src = src.replace(/(^import[^'"]+['"]\.[^'"]+)(['"])/gm, "$1.js$2");
      fs.writeFileSync(file, src);
    });
  }
}

const debugTree = require('broccoli-debug').buildDebugCallback('route-recognizer');

module.exports = function () {
  const libTs = replace(funnel("lib", {
    include: [ "**/*.ts" ],
    destDir: "lib"
  }), {
    files: ["lib/route-recognizer.ts"],
    pattern: {
      match: /VERSION_STRING_PLACEHOLDER/g,
      replacement: require("./package").version
    }
  });

  const testsTs = funnel("tests", {
    include: [ "**/*.ts" ],
    destDir: "tests"
  });

  const ts = debugTree(merge([libTs, testsTs]), "ts");

  const js = debugTree(new JsImportFix(typescript(ts, {
    annotation: 'compile route-recognizer.ts',
    buildPath: "",
    workingPath: __dirname,
  })), 'compiled');

  // rollup needs the source for sourcesContent
  // and we need sourcesContent since broccoli
  // does not serve source
  const jsAndTs = merge([js, ts]);

  const rollup = debugTree(new Rollup(jsAndTs, {
    annotation: 'route-recognizer.js',
    rollup: {
      input: 'dist/lib/route-recognizer.js',
      plugins: [ sourcemaps() ],
      output: [{
        file: 'dist/route-recognizer.es.js',
        format: 'es',
        sourcemap: true,
      }, {
        file: 'dist/route-recognizer.js',
        format: 'umd',
        sourcemap: true,
        'amd.id': 'route-recognizer',
        name: 'RouteRecognizer'
      }]
    }
  }), 'rollup');

  const dist = funnel(merge([js, rollup]), {
    getDestinationPath(relative) {
      if (relative.startsWith('dist/')) {
        return relative.slice(5);
      }
      return relative;
    }
  });

  return merge([
    dist,
    debugTree(funnel('tests', {
      annotation: 'tests/index.html',
      files: ['index.html'],
      destDir: 'tests'
    }), "testsIndex"),
    debugTree(funnel(path.dirname(require.resolve('qunitjs')), {
      annotation: 'tests/qunit.{js,css}',
      files: ['qunit.css', 'qunit.js'],
      destDir: 'tests'
    }), 'qunit')
  ], {
    annotation: 'dist'
  });
};
