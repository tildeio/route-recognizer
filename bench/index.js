;(function() {
  var root = typeof global == 'object' && global || this;
  var load = typeof require == 'function' && require || root.load;

  if (!root.Benchmark) {
    root._ = load('../node_modules/benchmark/node_modules/lodash/lodash.min.js') || root._;
    root.Benchmark = load('../node_modules/benchmark/benchmark.js') || root.Benchmark;
    root.RouteRecognizer = load('../dist/route-recognizer.js') || root.RouteRecognizer;
    load('./routes.js');
  }

  var log;
  if (typeof document !== 'undefined') {
    var pre = document.createElement('pre');
    document.body.appendChild(pre);
    log = function (m) {
      pre.appendChild(document.createTextNode(m + '\n'));
    }
  } else if (typeof print !== 'undefined') {
    log = function (m) {
      print(m);
    };
  } else {
    log = function (m) {
      console.log(m);
    };
  }

  root.router = undefined;

  var addBench = new Benchmark({
    name: 'Add a distribution of ' + ROUTES.length + ' routes',
    setup: 'router = new RouteRecognizer()',
    fn: 'for (var i = 0; i < ROUTES.length; i++) {\n'+
        '  var route = ROUTES[i][0];\n'+
        '  var options = ROUTES[i][1];\n'+
        '  router.add(route, options);\n'+
        '}\n',
    onStart: function() {
      log('\n' + this.name + ':');
    },
    onCycle: function(event) {
      log(String(event.target));
    },
    onComplete: function(event) {
      log('Complete:');
      if (this.error) {
        log(this.error.stack);
      } else {
        log(String(event.target));
      }

      //console.assert(router.rootState.nextStates.length, 'routes were added');
    }
  });

  addBench.run({ 'async': true });
}.call(this));