require 'fileutils'
require 'rubygems'
require 'open-uri'

namespace :fp do

    desc 'Runs JSDoc over the code base'
    task :jsdoc do
      FileUtils.rm_rf('public/docs/js')
      exec 'java -jar tools/jsdoc-toolkit/jsrun.jar tools/jsdoc-toolkit/app/run.js -a  -d=public/docs/js -t=tools/jsdoc-toolkit/templates/jsdoc public/javascripts/agents/*.js public/javascripts/agents/fp-data/*.js public/javascripts/agents/fp-data/resourceset/*.js public/javascripts/agents/framework/*.js public/javascripts/agents/fp-ui/*.js public/javascripts/agents/fp-models/*.js'
    end

    desc 'Runs Google Closure to generate a minified fierce-planet JS file'
    task :closure do
      exec 'java -jar tools/closure-compiler/compiler.jar --js=public/javascripts/agents/framework/agent.js --js=public/javascripts/agents/framework/catastrophe.js --js=public/javascripts/agents/framework/level.js --js=public/javascripts/agents/framework/resource.js --js=public/javascripts/agents/framework/world.js --js=public/javascripts/agents/framework/tile.js --js=public/javascripts/agents/fp-models/profile.js --js=public/javascripts/agents/fp-models/profile_class.js --js=public/javascripts/agents/fp-models/event.js --js=public/javascripts/agents/fp-models/notice.js --js=public/javascripts/agents/fp-data/resource_types.js --js=public/javascripts/agents/fp-data/resourceset/tbl.js --js=public/javascripts/agents/fp-data/resourceset/cos.js --js=public/javascripts/agents/fp-ui/dialogs.js --js=public/javascripts/agents/fp-ui/drawing.js --js=public/javascripts/agents/fp-ui/general-ui.js --js=public/javascripts/agents/fp-ui/profile-ui.js  --js=public/javascripts/agents/fp-ui/resource-ui.js --js=public/javascripts/agents/editor.js --js=public/javascripts/agents/game.js --js=public/javascripts/agents/lifecycle.js --js=public/javascripts/agents/params.js --js=public/javascripts/agents/recording.js --js=public/javascripts/agents/utils.js --js=public/javascripts/agents/utils/log.js --js=public/javascripts/agents/utils/google-map.js --js=public/javascripts/agents/fp-data/agent_types.js --js=public/javascripts/agents/fp-data/player_classes.js --js=public/javascripts/agents/dev.js --js=public/javascripts/agents/fp-data/levels.js --js_output_file=public/javascripts/agents/fierce-planet.min.js'
    end

    desc 'Runs Google Closure to generate a minified fierce-planet JS file'
    task :closure_agg do
      exec 'java -jar tools/closure-compiler/compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js=public/javascripts/agents/framework/agent.js --js=public/javascripts/agents/framework/catastrophe.js --js=public/javascripts/agents/framework/level.js --js=public/javascripts/agents/framework/resource.js --js=public/javascripts/agents/framework/world.js --js=public/javascripts/agents/framework/tile.js --js=public/javascripts/agents/fp-models/profile.js --js=public/javascripts/agents/fp-models/profile_class.js --js=public/javascripts/agents/fp-models/event.js --js=public/javascripts/agents/fp-models/notice.js --js=public/javascripts/agents/fp-data/resource_types.js --js=public/javascripts/agents/fp-data/resourceset/tbl.js --js=public/javascripts/agents/fp-data/resourceset/cos.js --js=public/javascripts/agents/fp-ui/dialogs.js --js=public/javascripts/agents/fp-ui/drawing.js --js=public/javascripts/agents/fp-ui/general-ui.js --js=public/javascripts/agents/fp-ui/profile-ui.js  --js=public/javascripts/agents/fp-ui/resource-ui.js --js=public/javascripts/agents/editor.js --js=public/javascripts/agents/game.js --js=public/javascripts/agents/lifecycle.js --js=public/javascripts/agents/params.js --js=public/javascripts/agents/recording.js --js=public/javascripts/agents/utils.js --js=public/javascripts/agents/utils/log.js --js=public/javascripts/agents/utils/google-map.js --js=public/javascripts/agents/fp-data/agent_types.js --js=public/javascripts/agents/fp-data/player_classes.js --js=public/javascripts/agents/dev.js --js=public/javascripts/agents/fp-data/levels.js --js_output_file=public/javascripts/agents/fierce-planet.min.js'
    end

    desc 'Generates a static page of the core Fierce Planet game'
    task :static do
      file = open('http://localhost:3001/')
      contents = file.read
      file = File.new('public/scrap/fp.html', 'w+')
      file.write contents
      file.close
    end

    desc 'Launches Fierce Planet in the default browser - requires Launchy gem'
    task :launch do
      require 'launchy'
      Launchy.open("http://localhost:3001/")
    end

    desc 'Launches Fierce Planet in the default browser - requires Launchy gem'
    task :launch_static do
      require 'launchy'
      Launchy.open("http://localhost:3001/scrap/fp.html")
    end
end