
# Models highly simplistic parameters of a species:
# - Life expectancy
# - Fertility
# - Child-birth age
class Species
  attr_accessor :name
  attr_accessor :min_marriage_age, :max_marriage_age
  attr_accessor :max_partners
  attr_accessor :min_childbirth_age, :max_childbirth_age
  attr_accessor :min_fertility_rate, :max_fertility_rate
  attr_accessor :min_life_expectancy, :max_life_expectancy

  def initialize(name)
    self.name = name
  end

  def to_json(*a)
    {
      'json_class'   => self.class.name,
      'fp-data'         => [ name, min_life_expectancy, max_life_expectancy, min_fertility_rate, max_fertility_rate, min_childbirth_age, max_childbirth_age ]
    }.to_json(*a)
  end
  
end