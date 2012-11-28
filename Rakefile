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
require "js_module_transpiler"

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
      converter = JsModuleTranspiler::Compiler.new("#{recognizer}\n#{dsl}", "route-recognizer", into: "RouteRecognizer")
      file.puts converter.send("to_#{type}")
    end
  end

  debug_filename = filename.sub(/\.js$/, ".debug.js")

  file debug_filename => ["dist", "lib/route-recognizer.js", "lib/dsl.js"] do
    recognizer = replace_debug("lib/route-recognizer.js")
    dsl = replace_debug("lib/dsl.js")

    open debug_filename, "w" do |file|
      converter = JsModuleTranspiler::Compiler.new("#{recognizer}\n#{dsl}", "route-recognizer", into: "RouteRecognizer")
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

task :test, :debug do |task, args|
  if args["debug"]
    sh "open tests/index.debug.html"
  else
    sh "open tests/index.html"
  end
end

task :test => :release
