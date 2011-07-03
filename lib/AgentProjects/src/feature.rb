class Feature
  # General properties
  attr_accessor :name, :symbol
  # Health properties
  attr_accessor :health_mean, :health_std_dev

  def initialize(name, symbol = '$', health_mean = 0, health_std_dev = 1)
    self.name = name
    self.symbol = symbol
    self.health_mean = health_mean
    self.health_std_dev = health_std_dev
  end

  def to_json(*a)
    {
      'json_class'   => self.class.name,
      'fp-data'         => [ name, symbol ]
    }.to_json(*a)
  end

  def health_consequence
    Utils::gaussian_rand(health_mean, health_std_dev).floor
  end
end