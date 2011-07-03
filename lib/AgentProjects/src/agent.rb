require 'desire'

class AgentEvent
  BIRTH_EVENT = 0
  DEATH_EVENT = 1
  MARRIAGE_EVENT = 2
  CHILD_EVENT = 3
  MOVE_EVENT = 4
  KILL_EVENT = 5
  MEET_EVENT = 6
  COUPLE_EVENT = 7

  attr_accessor :agent, :iteration, :event_type, :patch, :details, :sentiment

  def initialize(agent, iteration, event_type, patch, details, sentiment)
    self.agent = agent
    self.iteration = iteration
    self.event_type = event_type
    self.patch = patch
    self.details = details
    self.sentiment = sentiment
  end

  def description
    case event_type
      when BIRTH_EVENT  then
        "#{iteration}: #{agent.id} was born at {#{location.x}, #{location.y}}."
      when DEATH_EVENT then
        "#{iteration}: #{agent.id} died at {#{location.x}, #{location.y}}."
      when MOVE_EVENT then
        "#{iteration}: #{agent.id} moved from {#{location.x}, #{location.y}} to {#{details.x}, #{details.y}}."
      when MEET_EVENT then
        "#{iteration}: #{agent.id} met #{details.id} at {#{location.x}, #{location.y}}."
      when KILL_EVENT then
        "#{iteration}: #{agent.id} killed #{details.id} at {#{location.x}, #{location.y}}."
      when COUPLE_EVENT then
        "#{iteration}: #{agent.id} married #{details.id} at {#{location.x}, #{location.y}}."
    end
  end
end

class Position
  attr_accessor :x, :y
  def initialize(x, y)
    self.x = x
    self.y = y
  end
end


class Belief
  attr_accessor :name, :intensity, :confidence
end

class Memory
  attr_accessor :position, :iteration, :vividness, :sentiment
end

class EnvironmentalMemory < Memory
  attr_accessor :terrain

  def initialize(terrain, position, iteration, vividness)
    self.terrain = terrain.dup
    self.position = position
    self.iteration = iteration
    self.vividness = vividness
    self.sentiment = 0
  end
end

class SocialMemory < Memory
  attr_accessor :agent

  def initialize(agent, position, iteration, vividness)
    self.agent = agent.dup
    self.position = position
    self.iteration = iteration
    self.vividness = vividness
    self.sentiment = 0
  end
end

class EventMemory < Memory
  attr_accessor :event

  def initialize(event, position, iteration, vividness)
    self.event = event
    self.position = position
    self.iteration = iteration
    self.vividness = vividness
    self.sentiment = 0
  end
end


class Agent
  MALE = 0
  FEMALE = 1
  UNSPECIFIED = 2

  # Associations
  attr_accessor :identifying_culture, :cultures, :world
  # Identity
  attr_accessor :id, :name, :status
  # Traits
  attr_accessor :age, :lives_until, :gender

  # Health - ranges from 0 to 100, starts at 15
  attr_accessor :health, :wellbeing

  # Other attributes
  attr_accessor :wealth, :literacy
  # Reproduction
  attr_accessor :parents, :max_children, :children, :birth_first_year, :birth_years
  # Nuptial details
  attr_accessor :partner
  # Location
  attr_accessor :location_x, :location_y, :position


  # Theory of mind
  #
  attr_accessor :history, :memories, :beliefs, :desires, :goals


  def initialize(id, world, culture, x, y)
    self.id = id
    self.world = world
    self.cultures = []
    self.identifying_culture = culture
    self.cultures << culture
    self.age = 0
    self.health = determine_health
    self.wealth = 0
    self.literacy = 0
    self.status = "alive"
    self.position = Position.new(x, y)
    self.parents = []
    self.children = []

    self.history = []
    self.memories = []
    self.desires = []
    self.beliefs = []

    determine_children
    determine_lives_until
    world.agents << self
    world.live_agents << self
	world.grid[x][y].agent = self
    culture.agents << self
    event = AgentEvent.new(self, world.current_iteration, AgentEvent::BIRTH_EVENT, world.grid[self.position.x][self.position.y], nil, 0)
    register_event(event)
  end


  def determine_health
    Utils::gaussian_rand(self.identifying_culture.initial_health_mean, self.identifying_culture.initial_health_std_dev).floor if self.identifying_culture
  end


  def to_json(*a)
    {
      'json_class'   => self.class.name,
      'data'         => [ culture, age, health, wealth, literacy, status, position, parents, children, memories, beliefs, desires ]
    }.to_json(*a)
  end

  def destroy
    puts "Destroying agent for " + culture.name if World.debug
    self.status = "dead"
    self.partner.partner = nil if self.partner
    self.identifying_culture.agents.delete(self)
    self.world.grid[position.x][position.y].agent = nil
    self.world.live_agents.delete(self)
    self.world.dead_agents << self
    distribute_wealth
    event = AgentEvent.new(self, world.current_iteration, AgentEvent::DEATH_EVENT, position, nil, -1)
    register_event(event)
  end

  def distribute_wealth
    if children.length > 0
      wealth_distribution = wealth / children.length                                                
      children.each do |child|
        child.wealth += wealth_distribution
      end
    end
  end

  def adjust_health(increment)
    self.health += increment if self.health + increment >= 0 and self.health + increment <= 100  
  end

  def move(new_x, new_y, old_x, old_y)
    old_patch = world.grid[old_x][old_y]
    new_patch = world.grid[new_x][new_y] 
    new_patch.agent = self
    old_patch.agent = nil
    old_patch.last_agent = self
    old_patch.last_agent_iteration = world.current_iteration
    location = self.position
    self.position = Position.new(new_x, new_y)

    event = AgentEvent.new(self, world.current_iteration, AgentEvent::MOVE_EVENT, new_patch, location, 0)
    register_event(event)
  end

  def register_event(event)
#    memories << EventMemory.new(event, nil, 0, 50)
  end

  def register_couple(spouse)
    self.partner = spouse
    spouse.partner = self
    self.memories << EventMemory.new(AgentEvent.new(self, world.current_iteration, AgentEvent::COUPLE_EVENT, world.grid[self.position.x][self.position.y], spouse, 1), self.position, world.current_iteration, 100)
    spouse.memories << EventMemory.new(AgentEvent.new(spouse, world.current_iteration, AgentEvent::COUPLE_EVENT, world.grid[spouse.position.x][spouse.position.y], self, 1), spouse.position, world.current_iteration, 100)
  end

  def register_meeting(stranger)
    self.memories << EventMemory.new(AgentEvent.new(self, world.current_iteration, AgentEvent::MEET_EVENT, world.grid[self.position.x][self.position.y], stranger, 0), self.position, world.current_iteration, 70)
    stranger.memories << EventMemory.new(AgentEvent.new(stranger, world.current_iteration, AgentEvent::MEET_EVENT, world.grid[stranger.position.x][stranger.position.y], self, 0), self.position, world.current_iteration, 70)
  end

  def register_win(stranger)
    self.memories << EventMemory.new(AgentEvent.new(self, world.current_iteration, AgentEvent::KILL_EVENT, world.grid[self.position.x][self.position.y], stranger, 1), self.position, world.current_iteration, 80)
  end

  def fight(rival)
    result = 0 # -1 = loss; 0 = draw; 1 = win
    # Battle...
    battle_chance = rand()
    if battle_chance < self.score
      result = 1
    elsif battle_chance < rival.score
      result = -1
    else
      result = 0
    end
    result
  end

  def sorted_desires
    d = {}  
    sorted = []
    self.desires.each do |desire|
      d[desire.intensity * rand()] = desire
    end
    sorted_keys = d.keys.sort
    sorted_keys.each do |key|
      sorted << d[key]  
    end
    sorted
  end

  def couple(spouse)
    couple_chance = rand()
    # Need to add parameters to model this
    if couple_chance > 0.5
      register_couple(spouse)
    end
    couple_chance
  end

  def determine_children
    # Get the key culture variables
    cm = self.identifying_culture.fertility_rate_mean
    cs = self.identifying_culture.fertility_rate_std_dev
    am = self.identifying_culture.childbirth_age_mean
    as = self.identifying_culture.childbirth_age_std_dev

    # How many children?
    max_children = Utils::gaussian_rand(cm, cs).round
    # Make sure max_children is zero or higher, and less than two standard deviations (otherwise not enough years might exist for having sufficient children)
    max_children = 0 if max_children < 0
    # TODO: Not sure what hsi is to check for
#    max_children = (cs * 2).floor if max_children > cs * 2
    self.max_children = max_children
    self.birth_years = Array.new(max_children)
    return if max_children == 0

    # Assuming 1 child, at what age will it be born?
    am = self.identifying_culture.childbirth_age_mean
    as = self.identifying_culture.childbirth_age_std_dev
    # Adjust for "#{many ch}" of children
    am = am - (max_children - 1)
    as = as - (max_children / 2).floor
    base_year = Utils::gaussian_rand(am, as).floor
    self.birth_years[0] = base_year

    # Assign years for any additional children

    # Would like them born within three standard deviations past the mean, for simplification
    previous_year = base_year
    next_year = 0
    # Assume mean delay for subsequent children = 2 years, stdev = 1 year
    # May need adjustment for upper reaches of child-bearing age
    sm = 2
    ss = 1

    (1..max_children - 1).each do |child_index|
      interval = 0
      begin
        interval = Utils::gaussian_rand(sm, ss).floor
      # Repeat until children is positive and less than two standard deviations (otherwise not enough years might exist for having sufficient children)
      end until interval > 0
      next_year = previous_year + interval
      self.birth_years[child_index] = next_year
      previous_year = next_year
    end
  end


  def determine_lives_until
    # http://azzalini.stat.unipd.it/SN/Intro/intro.html

    # Generate the alpha shape for the distribution
    fac = (identifying_culture.life_expectancy_mean / identifying_culture.species.max_life_expectancy.to_f)
    alpha = 1 - (fac * 2 - 1)

    # Calculate the location and scale
    location, scale = Utils::location_and_scale_from_mean_std_dev_and_scale(identifying_culture.life_expectancy_mean, identifying_culture.life_expectancy_std_dev, alpha)

    # Generate a random number from the skewed distribution
    self.lives_until = Utils::skew_rand(alpha, location, scale)
  end


  def score
    identifying_culture.kill_chance
  end

  def dead?
    status == "dead" 
  end

  def ready_to_die?
    age > self.lives_until or health < 0
  end

  def process_iteration(iteration)
    patch = world.grid[position.x][position.y]
    self.age += 1
    self.health -= 1
    self.wealth += patch.terrain.wealth_consequence
#    self.literacy += patch.terrain.culture_consequence
    history << patch
    memorise(patch, iteration)
    revise_memorise
  end

  def memorise(patch, iteration)
    self.memories << EnvironmentalMemory.new(patch.terrain, patch.position, iteration, 30)
    patch.neighbouring_patches(world) do |neighbour|
      if neighbour.agent and neighbour.agent != self
        self.memories << SocialMemory.new(neighbour.agent, neighbour.position, iteration, 50)
      end
    end
  end

  def revise_memorise
    self.memories.each do |memory|
      memory.vividness *= 0.9
    end
  end
end



