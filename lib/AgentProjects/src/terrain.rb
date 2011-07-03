class Terrain
  # General properties
  attr_accessor :name, :habitable, :color, :symbol
  # Various properties
  attr_accessor :health_mean, :health_std_dev
  attr_accessor :sustenance_mean, :sustenance_std_dev
  attr_accessor :security_mean, :security_std_dev
  attr_accessor :mating_mean, :mating_std_dev
  attr_accessor :wellbeing_mean, :wellbeing_std_dev
  attr_accessor :culture_mean, :culture_std_dev
  attr_accessor :wealth_mean, :wealth_std_dev

  attr_accessor :actual_sustenance_mean, :actual_sustenance_std_dev
  attr_accessor :current_yield, :starting_yield

  def initialize(name, symbol = true, color = "white", health_mean = 0, health_std_dev = 1)
    self.name = name
    self.symbol = symbol
    self.color = color
    self.health_mean = health_mean
    self.health_std_dev = health_std_dev
    self.current_yield = 0
  end

  def to_json(*a)
    {
      'json_class'   => self.class.name,
      'data'         => [ name, color, habitable ]
    }.to_json(*a)
  end

  def configure
    self.actual_sustenance_mean ||= self.sustenance_mean
    self.actual_sustenance_std_dev ||= self.sustenance_std_dev
    self.current_yield = Utils::gaussian_rand(self.actual_sustenance_mean, self.actual_sustenance_std_dev).floor
    self.starting_yield = current_yield
  end

  def habitable
    health_mean > 0
  end

  def health_consequence
    Utils::gaussian_rand(health_mean, health_std_dev).floor
  end

  def sustenance_consequence
    Utils::gaussian_rand(sustenance_mean, sustenance_std_dev).floor
  end


  def adjust_yield(agent)
    old_yield = self.current_yield
    if agent and self.current_yield > 0
      agent.adjust_health(1)
      self.current_yield = 0
    elsif self.current_yield < self.starting_yield
      self.current_yield += 1
    end
    return (old_yield == self.current_yield)
  end

  def set_current_yield
#    self.current_yield = Utils::gaussian_rand(self.actual_sustenance_mean, self.actual_sustenance_std_dev).floor
#    self.current_yield -= 1
  end

  def security_consequence
    Utils::gaussian_rand(security_mean, security_std_dev).floor
  end

  def mating_consequence
    Utils::gaussian_rand(mating_mean, mating_std_dev).floor
  end

  def wellbeing_consequence
    Utils::gaussian_rand(wellbeing_mean, wellbeing_std_dev).floor
  end

  def culture_consequence
    Utils::gaussian_rand(culture_mean, culture_std_dev).floor
  end

  def wealth_consequence
    Utils::gaussian_rand(wealth_mean, wealth_std_dev).floor
  end


end