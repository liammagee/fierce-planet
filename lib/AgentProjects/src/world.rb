require 'utils'
require 'patch'
require 'json'


class World
  FREE_WORLD = 0
  CONGREGATE = 1
  ELIMINATE = 2
  EXCHANGE = 3

  @@print = false
  attr_accessor :fi
  attr_accessor :name
  attr_accessor :grid, :cultures
  attr_accessor :flattened_grid
  attr_accessor :agents, :live_agents, :dead_agents
  attr_accessor :current_iteration
  attr_accessor :agent_population_tally
  attr_accessor :team_adjustments
  attr_accessor :dirty_patches

  def initialize(width, height)
    setup(width, height)
  end

  def setup(width, height)
    self.grid = Array.new(height) {|index| Array.new(width) {|cell| Patch.new(index, cell) } }
    self.cultures = []
    self.team_adjustments = {}
    self.flattened_grid = {}

    reset
  end

  def reset
    # Add cultures
    self.current_iteration = 0
    self.agents = []
    self.live_agents = []
    self.dead_agents = []
    self.agent_population_tally = []
    cultures.each do |culture|
      culture.agents = []
    end
    grid.each do |row|
      row.each do |cell|
        cell.agent = nil
      end
    end
  end

  def finalise(randomise_age = true)
    # Add cultures
    cultures.each do |culture|
      culture.agents = []
      (1..culture.base_size).each do |x|
        r = Agent.new("#{culture.name[0..1]}#{x}", self, culture, 0, 0)
        r.gender = (rand() < 0.5 ? Agent::MALE : Agent::FEMALE)
        r.age = randomise_age ? (rand() * culture.species.max_life_expectancy).floor : 0
        r.desires = culture.desires
        assign_agent_randomly(r)
      end
    end

    # Set values for terrain yields
#    iterate_patch
  end

  def World.debug; @@print end
  def World.debug=(val); @@print = val; end

  def save(filename)
    open(filename, "w") { |f| Marshal.dump(self, f) }
  end

  def World.load(filename)
    open(filename) { |f| Marshal.load(f) }
  end

  def to_json(*a)
    {
      'json_class'   => self.class.name,
      'data'         => [ grid ]
    }.to_json(*a)
  end

  def self.json_create(o)
    new(*o['data'])
  end

  def [](x)
    self.grid[x]
  end

  def width
    self.grid.length
  end

  def height
    self.grid[0].length
  end

  def assign_agent_randomly(agent)
    patch = random_unoccupied_position
    agent.move(patch.x, patch.y, agent.position.x, agent.position.y) if patch 
    return patch
  end

  def random_unoccupied_position
    x = -1
    y = -1
    patch = nil
    max_tries = 10000
    counter = 0
	tried_cells = {}
    begin
      counter += 1
      x = (rand() * self.grid.length).floor
      y = (rand() * self.grid[0].length).floor
	  key = [x, y]
	  next if tried_cells[key]
	  
      patch = self.grid[x][y]
#	  free = true
#	  self.live_agents.each do |a|
#		if a.position.x == x and a.position.y == y
#			free = false
#			warn("AGENT ON EMPTY PATCH!") if a.position.x == x and a.position.y == y
#			break
#		end
#	  end
      return patch if patch.agent == nil and patch.terrain.habitable
	  tried_cells[key] = patch
    end until tried_cells.size >= self.grid.length * self.grid[0].length or counter >= max_tries
    return nil
  end


  def handle_meeting(agent, stranger, moved_agents, new_x, new_y, x, y)
    agent.register_meeting(stranger)
    if agent.desires.include?(CommonDesires::CONVERSION) and stranger.identifying_culture.name != agent.identifying_culture.name
      result = agent.fight(stranger)
      case result
        when 1 then
          # Move the agent and destroy the rival
          agent.register_win(stranger)
          agent.adjust_health(1)
#          agent.health += 1
          stranger.destroy
          if agent.desires.include?(CommonDesires::CONVERSION)
            tmp = Agent.new("#{agent.identifying_culture.abbrev}#{current_iteration}", self, agent.identifying_culture, new_x, new_y)
            tmp.age = stranger.age
            tmp.desires = agent.desires
            tmp.gender = (rand() > 0.5 ? Agent::FEMALE : Agent::MALE)
            self.grid[new_x][new_y].agent = tmp
          else
            agent.move(new_x, new_y, x, y)
          end
          moved_agents << agent
        when -1 then
          # Destroy the agent
          stranger.register_win(agent)
          stranger.adjust_health(1)
          if agent.desires.include?(CommonDesires::CONVERSION)
            tmp = Agent.new("#{agent.identifying_culture.abbrev}#{current_iteration}", self, agent.identifying_culture, new_x, new_y)
            tmp.age = agent.age
            tmp.desires = stranger.desires
            tmp.gender = (rand() > 0.5 ? Agent::FEMALE : Agent::MALE)
            self.grid[new_x][new_y].agent = tmp
          else
            agent.destroy
          end
        when 0 then
          # Draw - Stay where we are
         
      end
    elsif stranger.identifying_culture == agent.identifying_culture and stranger.gender != agent.gender and !stranger.partner and !agent.partner
      agent.couple(stranger)
      moved_agents << agent
    end
  end

  def has_friend?(agent, x, y)
    friend = nil
    if y > 0 and self.grid[x][y - 1].agent and self.grid[x][y - 1].agent.identifying_culture == agent.identifying_culture
      friend = self.grid[x][y - 1].agent
    elsif y < self.grid[0].length - 1 and self.grid[x][y + 1].agent and self.grid[x][y + 1].agent.identifying_culture == agent.identifying_culture
      friend = self.grid[x][y + 1].agent
    elsif x > 0 and self.grid[x - 1][y].agent and self.grid[x - 1][y].agent.identifying_culture == agent.identifying_culture
      friend = self.grid[x - 1][y].agent
    elsif x < self.grid.length - 1 and self.grid[x + 1][y].agent and self.grid[x + 1][y].agent.identifying_culture == agent.identifying_culture
      friend = self.grid[x + 1][y].agent
    end
    friend
  end

  def handle_free_movement(agent, moved_agents, new_x, new_y, x, y)
#    agent.move(new_x, new_y, x, y)
#    moved_agents << agent
    move = evaluate_movement(agent, new_x, new_y, x, y)
    if move
      agent.move(new_x, new_y, x, y)
      moved_agents << agent
    end
  end

  def evaluate_movement(agent, new_x, new_y, x, y)
    move_threshold = 0

    # Get the terrain
    new_terrain = grid[new_x][new_y].terrain
    old_terrain = grid[x][y].terrain

    move_threshold += (new_terrain.security_mean)
#    move_threshold += (new_terrain.actual_sustenance_mean - old_terrain.actual_sustenance_mean)
#    move_threshold += (new_terrain.mating_consequence - old_terrain.mating_consequence) unless agent.partner


    return (move_threshold > 0)
  end

  def move_world
    moved_agents = Array.new
    live_agents.each do |agent|
      if !moved_agents.include?(agent)
        x = agent.position.x
        y = agent.position.y
        new_x, new_y = choose_direction(agent)
#        new_x, new_y = generate_direction(x, y, true, true)

        stranger = grid[new_x][new_y].agent

        # Check for collisions pre-move collisions
        if stranger
          # Handle meeting
          handle_meeting(agent, stranger, moved_agents, new_x, new_y, x, y)
        else
          # Congregation strategy
          handle_free_movement(agent, moved_agents, new_x, new_y, x, y)
        end
      end
    end
  end

  def generate_direction(x, y, include_diagonals = true, permit_conflicts = false, &block)
    free_space_found = false
    initial_direction = (rand() * 8).floor
    initial_direction = initial_direction / 2 unless include_diagonals
    direction = initial_direction
    new_x = x
    new_y = y

    begin
      tmp_x = x
      tmp_y = y
      case direction
        when 0
          tmp_x = (x == 0 ? self.grid.length - 1 : x - 1)
        when 1
          tmp_y = (y == 0 ? self.grid[0].length - 1 : y - 1)
        when 2
          tmp_x = (x == self.grid.length - 1 ? 0 : x + 1)
        when 3
          tmp_y = (y == self.grid[0].length - 1 ? 0 : y + 1)
        when 4
          tmp_x = (x == 0 ? self.grid.length - 1 : x - 1)
          tmp_y = (y == 0 ? self.grid[0].length - 1 : y - 1)
        when 5
          tmp_x = (x == self.grid.length - 1 ? 0 : x + 1)
          tmp_y = (y == 0 ? self.grid[0].length - 1 : y - 1)
        when 6
          tmp_x = (x == 0 ? self.grid.length - 1 : x - 1)
          tmp_y = (y == self.grid[0].length - 1 ? 0 : y + 1)
        when 7
          tmp_x = (x == self.grid.length - 1 ? 0 : x + 1)
          tmp_y = (y == self.grid[0].length - 1 ? 0 : y + 1)
      end
      # Evaluate whether we should include move to this patch
      key = [tmp_x, tmp_y]
      patch = self.grid[tmp_x][tmp_y]


      free_space_found = patch.free?(permit_conflicts)
      direction = ((!include_diagonals and direction == 3) or direction == 7) ? 0 : direction + 1
      next unless patch.terrain.habitable

      yield tmp_x, tmp_y if block

      if free_space_found
        new_x = tmp_x
        new_y = tmp_y
      end
    end until direction == initial_direction # free_space_found or 
    unless free_space_found
      new_x = x
      new_y = y
    end
    return new_x, new_y
  end

  def choose_direction(agent)
    x = agent.position.x
    y = agent.position.y
    current_terrain = grid[x][y].terrain
    new_x = x
    new_y = y


    agent.sorted_desires.each do |desire|
      if desire.template == CommonDesires::HUNGER
        # Look at cells around - which are best providers of food?
        max_yield = current_terrain.current_yield
        generate_direction(x, y, true, false) do |test_x, test_y|
          test_terrain = grid[test_x][test_y].terrain
          if test_terrain.current_yield > max_yield # or test_terrain.current_yield > 0
            max_yield = test_terrain.current_yield
            new_x = test_x
            new_y = test_y
          end
        end
      elsif desire.template == CommonDesires::MATING and !agent.partner
        # Look at cells around - are any mating candidates?
        generate_direction(x, y, true, true) do |test_x, test_y|
          test_agent = grid[test_x][test_y].agent
          if test_agent and test_agent.identifying_culture == agent.identifying_culture and test_agent.gender != agent.gender and !test_agent.partner and !agent.partner
            new_x = test_x
            new_y = test_y
          elsif !test_agent
            generate_direction(test_x, test_y, true, true) do |test_x2, test_y2|
              test_agent2 = grid[test_x2][test_y2].agent
              if test_agent2 and test_agent2.identifying_culture == agent.identifying_culture and test_agent2.gender != agent.gender and !test_agent2.partner and !agent.partner
                new_x = test_x
                new_y = test_y
              end
            end
          end

          # Try to recall where another agent was met
          agent.memories.reverse.each do |memory|
            if memory.is_a?(SocialMemory)
              other_agent = memory.agent
              if agent.identifying_culture == other_agent.identifying_culture and agent.gender != other_agent.gender
                position = memory.position
                test_x = position.x
                test_y = position.y
                new_x  = (test_x < x) ? x - 1 : ((test_x > x) ? x  + 1 : x)
                new_y  = (test_y < y) ? y - 1 : ((test_y > y) ? y  + 1 : y)
                warn(new_x)
              end
            elsif memory.sentiment < 0
              break
            end
          end if new_x == x and new_y == y

        end
        # If there is no match, check for many recent agents
        if new_x == x and new_y == y
          generate_direction(x, y, true, true) do |test_x, test_y|
            test_agent = grid[test_x][test_y].last_agent
            if test_agent and test_agent.identifying_culture == agent.identifying_culture and test_agent.gender != agent.gender and !test_agent.partner and !agent.partner
              new_x = test_x
              new_y = test_y
            elsif !test_agent
              generate_direction(test_x, test_y, true, true) do |test_x2, test_y2|
                test_agent2 = grid[test_x2][test_y2].last_agent
                if test_agent2 and test_agent2.identifying_culture == agent.identifying_culture and test_agent2.gender != agent.gender and !test_agent2.partner and !agent.partner
                  new_x = test_x
                  new_y = test_y
                end
              end
            end
          end
        end
      elsif desire.template == CommonDesires::CONVERSION
        # Look at cells around - are any mating candidates?
        generate_direction(x, y, true, true) do |test_x, test_y|
          test_agent = grid[test_x][test_y].agent
          if test_agent and test_agent.identifying_culture.name != agent.identifying_culture.name
            new_x = test_x
            new_y = test_y
          else
            generate_direction(test_x, test_y, true, false) do |test_x2, test_y2|
              test_agent2 = grid[test_x2][test_y2].agent
              if test_agent2 and test_agent2.identifying_culture.name != agent.identifying_culture.name
                new_x = test_x
                new_y = test_y
              end
            end
          end
        end
      elsif desire == CommonDesires::FRIENDSHIP
        generate_direction(x, y, true, true) do |test_x, test_y|
          test_agent = grid[test_x][test_y].agent
          if test_agent and test_agent.identifying_culture.name == agent.identifying_culture.name
            new_x = test_x
            new_y = test_y
          else
            generate_direction(test_x, test_y, true, false) do |test_x2, test_y2|
              test_agent2 = grid[test_x2][test_y2].agent
              if test_agent2 and test_agent2.identifying_culture.name == agent.identifying_culture.name
                new_x = test_x
                new_y = test_y
              end
            end
          end
        end
        # If there is no match, check for many recent agents
        if new_x == x and new_y == y
          generate_direction(x, y, true, true) do |test_x, test_y|
            test_agent = grid[test_x][test_y].agent
            if test_agent and test_agent.identifying_culture.name == agent.identifying_culture.name
              new_x = test_x
              new_y = test_y
            else
              generate_direction(test_x, test_y, true, false) do |test_x2, test_y2|
                test_agent2 = grid[test_x2][test_y2].agent
                if test_agent2 and test_agent2.identifying_culture.name == agent.identifying_culture.name
                  new_x = test_x
                  new_y = test_y
                end
              end
            end
          end
        end
      elsif desire.template == CommonDesires::WANDERLUST
        generate_direction(x, y, true, false) do |test_x, test_y|
          new_x = test_x
          new_y = test_y
        end
      elsif desire.template == CommonDesires::FLEE
        generate_direction(x, y, true, true) do |test_x, test_y|
          test_agent = grid[test_x][test_y].agent
          if test_agent and test_agent.identifying_culture.name != agent.identifying_culture.name
            new_x = x - (test_x - x)
            new_x = grid.length - 1 if new_x < 0
            new_x = 0 if new_x >= grid.length
            new_y = y - (test_y - y)
            new_y = grid[0].length - 1 if new_y < 0
            new_y = 0 if new_y >= grid.length
          else
            generate_direction(test_x, test_y, true, false) do |test_x2, test_y2|
              test_agent2 = grid[test_x2][test_y2].agent
              if test_agent2 and test_agent2.identifying_culture.name == agent.identifying_culture.name
                new_x = x - (test_x - x)
                new_x = grid.length - 1 if new_x < 0
                new_x = 0 if new_x >= grid.length
                new_y = y - (test_y - y)
                new_y = grid[0].length - 1 if new_y < 0
                new_y = 0 if new_y >= grid.length
              end
            end
          end
        end
      end

      # Last resort - back-track through history, and find an old patch with better food properties
      agent.memories.reverse.each do |memory|
        if memory.sentiment >= 0
          last_patch = agent.history.last
          new_x = last_patch.x
          new_y = last_patch.y
        elsif event.sentiment < 0
          break
        end
      end if new_x == x and new_y == y

#      warn(agent.id.to_s + ":" + new_x.to_s + ":" + x.to_s + ":" + new_y.to_s + ":" + y.to_s + ":" + desire.name) if current_iteration > 80
      return new_x, new_y if new_x != x or new_y != y
    end
    return new_x, new_y 
  end

  def regenerate
    s = Time.now
    regenerated = 0
    live_agents.each do |agent|
      if agent.age > 0 # and agent.status != "dead"
        x = agent.position.x
        y = agent.position.y

        # Handle regeneration
        age = agent.age
        regen = (age == agent.birth_years[agent.children.size] and agent.gender == Agent::FEMALE and agent.partner)  

        if regen
			patch = random_unoccupied_position
            if patch
#            test_x, test_y = generate_direction(x, y, true, false)
#            if test_x != x and test_y != y
				regenerated = regenerated + 1
				tmp = Agent.new("#{agent.identifying_culture.abbrev}#{current_iteration}", self, agent.identifying_culture, patch.x, patch.y)
				tmp.age = 0
#				tmp.health = 50 #agent.health
				tmp.parents << agent
				agent.children << tmp
				tmp.desires = agent.desires
				tmp.gender = (rand() > 0.5 ? Agent::FEMALE : Agent::MALE)
			end
        end

        # Handle death
        dead = agent.ready_to_die? # unless agent.status == "dead"
        agent.destroy if dead
      end
    end
#    puts (Time.now - s).to_s + ":" + regenerated.to_s
  end


  def print_world
    puts "Current state of the world"
    row_output = " "
    (0..self.grid[0].length - 1).each do |x|
      row_output << "_ "
    end
    puts row_output
    (0..self.grid.length - 1).each do |x|
      row = self.grid[x]
      row_output = "|"
      (0..row.length - 1).each do |y|
        agent = self.grid[x][y].agent
        if agent
          row_output << agent.identifying_culture.abbrev
        else
          row_output << (x == self.grid.length - 1 ? "_" : " ")
        end
        row_output << (y == row.length - 1 ? "|" : ":")
      end
      puts row_output
    end
  end


  def print_landscape
    puts "Current landscape of the world"
    row_output = " "
    (0..self.grid[0].length - 1).each do |x|
      row_output << "_ "
    end
    puts row_output
    (0..self.grid.length - 1).each do |x|
      row = self.grid[x]
      row_output = "|"
      (0..row.length - 1).each do |y|
        patch = self.grid[x][y]
        if patch
          row_output << patch.terrain.symbol
        else
          row_output << (x == self.grid.length - 1 ? "_" : " ")
        end
        row_output << (y == row.length - 1 ? "|" : ":")
      end
      puts row_output
    end
  end

  def print_agents
    puts "Current state of agents in the world"
    cultures.each do |identifying_culture|
      puts identifying_culture.name + ": " + identifying_culture.agents.size.to_s
    end
  end

  def print_agent_details
    puts "Agent details"
    live_agents.each do |agent|
      puts "Agent ID: " + agent.id.to_s
      puts "Age: " + agent.age.to_s
      puts "Health: " + agent.health.to_s
      puts "Status: " + agent.status.to_s
      agent.history.each do |event|
        puts event.description
      end
    end
  end
#
#  def print_agent_details
#    agent_population_tally.each do |tally|
#      puts tally.collect{|i| i}.join(",")
#    end
#  end

  def print_team_averages
    cultures.each do |culture|
      mean_age = 0
      mean_children = 0
      mean_health = 0
      mean_wealth = 0
      mean_literacy = 0
      culture.agents.each do |agent|
        unless agent.dead?
          mean_age += agent.age
          mean_children += agent.children.size
          mean_health += agent.health
          mean_wealth += agent.wealth
          mean_literacy += agent.literacy
        end
      end      
      denom = culture.agents.size.to_f
      denom = 1.0 if denom == 0 
      mean_age = mean_age/ denom
      mean_children = mean_children/ denom
      mean_health = mean_health/ denom
      mean_wealth = mean_wealth/ denom
      mean_literacy = mean_literacy/ denom

      puts "Results for " + culture.name.to_s
      puts " - Culture size: " + culture.agents.size.to_s
      puts " - Culture life expectancy: " + culture.life_expectancy_mean.to_s
      puts " - Culture mean age: " + mean_age.to_s
      puts " - Culture mean health: " + mean_health.to_s
      puts " - Culture mean children: " + mean_children.to_s
      puts " - Culture fertility rate: " + culture.fertility_rate_mean.to_s
      puts " - Culture child birth age: " + culture.childbirth_age_mean.to_s
      puts " - Culture mean wealth: " + mean_wealth.to_s
      puts " - Culture mean literacy: " + mean_literacy.to_s
    end
  end


  def iterate_agents
    live_agents.each { |agent| agent.process_iteration(@current_iteration)  }
  end


  def iterate_patch
    @dirty_patches = []
    (0..self.grid.length - 1).each do |i|
      (0..self.grid[0].length - 1).each do |j|
        dirty = self.grid[i][j].process_iteration
        @dirty_patches << self.grid[i][j] if dirty 
      end
    end
  end


  def tally_population
    tally = []
    if current_iteration == 1
      headings = []
      cultures.each do |culture|
        headings << culture.abbrev
      end
      agent_population_tally << headings
    end
    tally = []
    cultures.each do |culture|
      tally << culture.agents.size
    end
    agent_population_tally << tally
  end

  def do_iterations(iterations)
    (1..iterations).each do |i|
      iterate
      yield i
    end
  end

  def recalibrate_rates
    cultures.each do |culture|
      tmp = Math::sqrt(culture.agents.size / culture.base_size.to_f) if culture.base_size > 0
      tmp ||= 0
#      fac = 1 - Math::log(tmp, culture.base_size)
      if tmp > 0
        minf = culture.species.min_fertility_rate
        maxf = culture.species.max_fertility_rate
        minb = culture.species.min_childbirth_age
        maxb = culture.species.max_childbirth_age
        mf = culture.fertility_rate_mean
        mb = culture.childbirth_age_mean
        propf = (mf - minf) / (maxf - minf).to_f
        lf = Math::log(mf)
        propb = (mb - minb) / (maxb - minb).to_f
        mff = 1 - (propf * 2 - 1)
        mbf = 1 - (propb * 2 - 1)
        fert_inc = (Math::log(1 / tmp.to_f) * 1) #(propf.to_f)) #* lf
        @fi = "#{tmp}\n#{Math::log(1 / tmp.to_f)}\n#{propf}\n#{(Math::log(1 / tmp.to_f) * (1 - propf.to_i)).to_f}"
        first_child_age_inc = Math::log(1 / tmp) * propb

        target_fertility_rate = culture.fertility_rate_mean
        target_fertility_rate += fert_inc
        target_fertility_rate = minf if target_fertility_rate < minf
        target_fertility_rate = maxf if target_fertility_rate > maxf
        target_fertility_rate = target_fertility_rate * culture.fertility_adjustment_factor

        target_first_child_mean_age = culture.childbirth_age_mean - first_child_age_inc
        target_first_child_mean_age = minb if target_first_child_mean_age < minb
        target_first_child_mean_age = maxb if target_first_child_mean_age > maxb


        if culture.fertility_adjustment_increments > 0
          previous_increment = current_iteration - culture.fertility_adjustment_increments
          if previous_increment > 0 and team_adjustments[previous_increment]
            culture.fertility_rate_mean = team_adjustments[previous_increment][0]
            culture.childbirth_age_mean = team_adjustments[previous_increment][1]
          end
          team_adjustments[current_iteration] = [target_fertility_rate, target_first_child_mean_age]
        else
          culture.fertility_rate_mean = target_fertility_rate
          culture.childbirth_age_mean = target_first_child_mean_age
        end
      end
    end
  end

  def reseed
    
  end


  def iterate
#    s = Time.now
    old_grid = {}
    live_agents.each do |agent|
      key = [agent.position.x, agent.position.y]
      old_grid[key] = agent
    end
    self.current_iteration = self.current_iteration + 1
    recalibrate_rates

    iterate_patch
    iterate_agents

    move_world
    regenerate
    tally_population
    old_grid
#    puts Time.now - s
  end
end
