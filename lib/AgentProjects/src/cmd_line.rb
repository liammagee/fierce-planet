require 'world'
require 'agent'
require 'culture'
require 'terrain'
require 'species'

require 'rubygems'
require 'irb'
require 'json'

def consolize &block
  world = nil

  yield

#  IRB.setup(nil)
#  irb = IRB::Irb.new
#  IRB.conf[:MAIN_CONTEXT] = irb.context
#  irb.context.evaluate("require 'irb/completion'", 0)
#
#  trap("SIGINT") do
#    irb.signal_handle
#  end
#  catch(:IRB_EXIT) do
#    irb.eval_input
#  end
end

class Cxt
  @@world = nil

  def self.world
    return @@world
  end

  def self.world=(world)
    @@world = world
  end

  def self.intro
    puts "Welcome to the Ruby agent simulation demo."
    puts "You will now be asked to enter the dimensions of the agent world."
    puts "What is the width of the world (for example: 30)?"
    width = gets().strip.to_i
    width = 30 if width == 0
    puts "What is the height of the world (for example: 30)?"
    height = gets().strip.to_i
    height = 30 if height == 0
    self.world = World.new(width.to_i, height.to_i)
    puts "Thanks - your world has now been created with dimensions: #{world.grid.length}x#{world.grid[0].length}."
    puts "Would you like to give your world a name?"
    self.world.name = gets().strip
    puts "You can now access properties of the #{self.world.name} world by using the variable name '$world'."
  end

  def self.help
    puts "Help for the Agent Simulator"
  end

  def self.run_iterations
    puts "Enter number of iterations: "
    iterations = gets().strip().to_i
    self.world.do_iterations(iterations) {|i|
      world.print_agents
    }
  end
end

consolize do
  # require whatever you need
  while ((str = gets().strip) != '\q')
    case str
      when '\i':
        Cxt.intro
        $world = Cxt.world
      when '\h':
        Cxt.help
      when '\r':
        Cxt.run_iterations
      else
        begin
          puts eval(str)
        rescue => e
          puts e
        end
    end
  end
end

#
#input = ""
#while ((input = gets().strip) != "\q")
#
#end
