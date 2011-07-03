
class Team
  attr_accessor :name, :agents
  attr_accessor :base_size
  attr_accessor :childbirth_age_mean, :childbirth_age_std_dev
  attr_accessor :fertility_rate_mean, :fertility_rate_std_dev
  attr_accessor :fertility_adjustment_increments, :fertility_adjustment_factor
  attr_accessor :life_expectancy_mean, :life_expectancy_std_dev
  attr_accessor :kill_chance
  attr_accessor :species

  def initialize(name, base_size)
    self.name = name
    self.base_size = base_size
    self.agents = Array.new
    self.fertility_adjustment_increments = 0
    self.fertility_adjustment_factor = 1
  end

  def to_json(*a)
    {
      'json_class'   => self.class.name,
      'data'         => [ name, base_size, species ]
    }.to_json(*a)
  end


  def abbrev
    name[0..0]
  end
end