namespace :fp do

  namespace :utils do
    desc 'Runs JSDoc over the code base'
    task :jsdoc do
      exec 'java -jar tools/jsdoc-toolkit/jsrun.jar tools/jsdoc-toolkit/app/run.js -a  -d=public/docs/js -t=tools/jsdoc-toolkit/templates/jsdoc public/javascripts/agents/*.js public/javascripts/agents/data/*.js public/javascripts/agents/data/resourceset/*.js public/javascripts/agents/framework/*.js public/javascripts/agents/ui/*.js'
    end

    desc 'Runs Google Closure to generate a minified fierce-planet JS file'
    task :closure do
      exec 'java -jar tools/closure-compiler/compiler.jar  --js=public/javascripts/agents/framework/agent.js --js=public/javascripts/agents/framework/catastrophe.js --js=public/javascripts/agents/framework/level.js  --js=public/javascripts/agents/ui/event.js --js=public/javascripts/agents/ui/notice.js --js=public/javascripts/agents/framework/player_class.js --js=public/javascripts/agents/framework/resource.js --js=public/javascripts/agents/framework/tile.js --js=public/javascripts/agents/dialogs.js --js=public/javascripts/agents/drawing.js --js=public/javascripts/agents/editor.js --js=public/javascripts/agents/game.js --js=public/javascripts/agents/general-ui.js --js=public/javascripts/agents/lifecycle.js --js=public/javascripts/agents/params.js --js=public/javascripts/agents/profile.js --js=public/javascripts/agents/recording.js --js=public/javascripts/agents/resource-ui.js --js=public/javascripts/agents/utils.js --js=public/javascripts/agents/data/agent_types.js --js=public/javascripts/agents/data/player_classes.js --js=public/javascripts/agents/data/resourceset/tbl.js --js=public/javascripts/agents/data/resourceset/cos.js --js=public/javascripts/agents/data/levels.js --js_output_file=public/javascripts/agents/fierce-planet.min.js'
    end
  end
end