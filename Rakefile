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

file "dist/route-recognizer.debug.js" => ["dist", "lib/dsl.js", "lib/route-recognizer.js"] do
  recognizer = replace_debug("lib/route-recognizer.js")
  dsl = replace_debug("lib/dsl.js")

  File.open("dist/route-recognizer.debug.js", "w") do |file|
    file.puts recognizer
    file.puts dsl
  end
end

file "dist/route-recognizer.js" => ["dist", "lib/dsl.js", "lib/route-recognizer.js"] do
  File.open("dist/route-recognizer.js", "w") do |file|
    file.puts File.read("lib/route-recognizer.js")
    file.puts File.read("lib/dsl.js");
  end
end

task :debug => "dist/route-recognizer.debug.js"
task :build => "dist/route-recognizer.js"

task :release => [:debug, :build]

task :test, :debug do |task, args|
  if args["debug"]
    sh "open tests/index.debug.html"
  else
    sh "open tests/index.html"
  end
end

task :test => :release
