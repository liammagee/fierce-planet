# TODO's
# - Optimise grid copying - DONE
# - Gender - DONE
# - Introduce agent path and interaction memories - DONE
# - Introduce 'patches' - kinds of ground, pathways - DONE
# - Integrate shoes - DONE
# - Time output - DONE
# - Fertility rate correction - DONE
# - Save output - DONE
# - Serialisation - DONE
# - Refactoring fertility handling - DONE
# - Fertility rate 'lags' (Malthusian) - DONE
# - Optimise run - DONE
# - Move strategies to team - DONE
# - Introduce agent resource requirements: health & food - DONE
# - Patch growth and death - DONE
# - Cyclical land yields
# - Full console control
# - Wealth
# - Relations
# - Nuptiality
# - Inheritance
# - Introduce objects, inventory, wealth
# - Javascript front-end
# - Seasonal effects (droughts, etc.)
# - Security
# - City simulation

# - Unit testing
# - Document formulae
# - Make strategies configurable
# - Inter-agent communication
# - Full agent modelling: traits, behaviour, communication, memories, attitudes, knowledge (probabilistic), reasoning
# - 'Cultural' modelling (heterogeneity)
# - Integrate R
# - Formalise output variables
# - Documentation

require 'worlds/simple_world'

world = SimWorld.build_world

world.print_world
world.print_agents

start = Time.now

world.do_iterations(1000) {|i|
  if i % 100 == 0
    puts "Current time: " + (Time.now - start).to_s
    puts "Iteration: " + i.to_s # if World.debug
  #        print_world
    world.print_agents
#    world.print_team_averages
  end
}
puts "Start time: " + start.to_s
puts "End time: " + (Time.now - start).to_s


#world.print_landscape
#world.print_agent_details
#world.print_world
#world.print_agents
#world.print_agent_details

#f = File.new("C:/Users/Liam/Documents/RubymineProjects/AgentProjects/agents.txt", "w+")
#world.agent_population_tally.each { |row|  f << row.collect{|i| i}.join(","); f << "\n" }
#f.close
