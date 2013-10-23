directory "dist"

def replace_debug(file)
  content = File.read(file)

  content.gsub!(%r{^ *// DEBUG GROUP (.*) *$}, 'console.group(\1);')
  content.gsub!(%r{^ *// END DEBUG GROUP *$}, 'console.groupEnd();')
  content.gsub!(%r{^( *)// DEBUG (.*) *$}, '\1debug(\2);')
  content.gsub!(%r{^ */\*\* IF DEBUG\n}, "")
  content.gsub!(%r{ *END IF \*\*/\n}, "")

  content
end

require "bundler/setup"
require File.expand_path("../tasks/support/js_module_transpiler", __FILE__)
require "qunit-cli-runner"
require "jshintrb/jshinttask"

directory "dist"

def file_task(type)
  filename = ["dist/route-recognizer"]
  filename << type unless type == "globals"
  filename << "js"

  filename = filename.join(".")

  file filename => ["dist", "lib/route-recognizer.js", "lib/dsl.js"] do
    recognizer = File.read("lib/route-recognizer.js")
    dsl = File.read("lib/dsl.js")

    open filename, "w" do |file|
      converter = JsModuleTranspiler::Compiler.new("#{recognizer}\n#{dsl}", "route-recognizer", imports: {"__nothing" => "__nothing"})
      file.puts converter.send("to_#{type}")
    end
  end

  debug_filename = filename.sub(/\.js$/, ".debug.js")

  file debug_filename => ["dist", "lib/route-recognizer.js", "lib/dsl.js"] do
    recognizer = replace_debug("lib/route-recognizer.js")
    dsl = replace_debug("lib/dsl.js")

    open debug_filename, "w" do |file|
      converter = JsModuleTranspiler::Compiler.new("#{recognizer}\n#{dsl}", "route-recognizer", imports: {"__nothing" => "__nothing"})
      file.puts converter.send("to_#{type}")
    end
  end

  min_filename = filename.sub(/\.js$/, ".min.js")

  file min_filename => filename do
    output = `cat #{filename} | uglifyjs`

    open min_filename, "w" do |file|
      file.puts output
    end
  end
end

file_task "globals"
file_task "amd"
file_task "cjs"

task :debug => ["dist/route-recognizer.debug.js", "dist/route-recognizer.amd.debug.js", "dist/route-recognizer.cjs.debug.js"]
task :build => ["dist/route-recognizer.js", "dist/route-recognizer.amd.js", "dist/route-recognizer.cjs.js"]

task :release => [:debug, :build]

task :browser_test, :debug do |task, args|
  if args["debug"]
    sh "open tests/index.debug.html"
  else
    sh "open tests/index.html"
  end
end
task :browser_test => :release

Jshintrb::JshintTask.new :jshint do |t|
  t.js_files = ['dist/route-recognizer.js', 'tests/recognizer-tests.js', 'tests/router-tests.js']
  t.options = {
    "predef" => [
      "QUnit",
      "define",
      "console",
      "RSVP",
      "Router",
      "RouteRecognizer",
      "require",
      "requireModule",
      "equal",
      "notEqual",
      "notStrictEqual",
      "test",
      "asyncTest",
      "testBoth",
      "testWithDefault",
      "raises",
      "throws",
      "deepEqual",
      "start",
      "stop",
      "ok",
      "strictEqual",
      "module",
      "expect",
      "minispade",
      "expectAssertion",
      "window",
      "location",
      "document",
      "XMLSerializer",
      "setTimeout",
      "clearTimeout",
      "setInterval",
      "clearInterval"
    ],
    "node" => false,
    "browser" => false,
    "boss" => true,
    "curly" => false,
    "debug" => false,
    "devel" => false,
    "eqeqeq" => true,
    "evil" => true,
    "forin" => false,
    "immed" => false,
    "laxbreak" => false,
    "newcap" => true,
    "noarg" => true,
    "noempty" => false,
    "nonew" => false,
    "nomen" => false,
    "onevar" => false,
    "plusplus" => false,
    "regexp" => false,
    "undef" => true,
    "sub" => true,
    "strict" => false,
    "white" => false,
    "eqnull" => true,
  }
end

QunitCliRunner::Task.new('qunit')
task :test => [:release, :qunit, :jshint]

task :default => :test
