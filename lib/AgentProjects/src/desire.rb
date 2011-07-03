class Desire
  attr_accessor :template, :intensity

  def initialize(template, intensity)
    self.template = template
    self.intensity = intensity
  end

  def <=>(other)
    other.intensity <=> self.intensity
  end
end

class DesireTemplate
  attr_accessor :name, :desired_object


  def initialize(name, desired_object)
    self.name = name
    self.desired_object = desired_object
  end
end

module CommonDesires
  
  HUNGER = DesireTemplate.new("Hunger", "Terrain")
  MATING = DesireTemplate.new("Mating", "Agents of Same Culture")
  FIGHT = DesireTemplate.new("Fight", "Agents of Different Culture")
  CONVERSION = DesireTemplate.new("Conversion", "Agents of Different Culture")
  WANDERLUST = DesireTemplate.new("Wanderlust", "Just wandering...")
  FRIENDSHIP = DesireTemplate.new("Friendship",  "Looking for friends")
  FLEE = DesireTemplate.new("Flee", "Fleeing")
  TYPES_OF_DESIRE = [HUNGER, MATING, FIGHT, CONVERSION, WANDERLUST, FRIENDSHIP, FLEE]

  def generate_desire(type, intensity)
    Desire.new(type, intensity)
  end
end