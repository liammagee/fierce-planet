require 'world'
require 'desire'
require 'agent'
require 'culture'
require 'terrain'
require 'species'

module SimWorld; end
def SimWorld::build_world
  width = 20
  height = 20
  world = World.new(width, height)
  team_size = 60
  
  # Add species here
  human_species = Species.new("Homo Sapiens")
  human_species.min_life_expectancy = 30
  human_species.max_life_expectancy = 90
  human_species.min_fertility_rate = 1
  human_species.max_fertility_rate = 5
  human_species.min_childbirth_age = 15
  human_species.max_childbirth_age = 45

  # Add terrain here
  safe = Terrain.new("", "F", "burlywood", 0, 5)
  safe.health_mean = 0
  safe.health_std_dev = 0
  safe.mating_mean = 5
  safe.mating_std_dev = 1
  safe.sustenance_mean = 10
  safe.sustenance_std_dev = 1
  safe.wellbeing_mean = 1
  safe.wellbeing_std_dev = 0
  safe.security_mean = 1
  safe.security_std_dev = 0
  safe.culture_mean = 0
  safe.culture_std_dev = 0
  safe.wealth_mean = 0
  safe.wealth_std_dev = 0
  safe.configure

  dangerous = Terrain.new("dangerous", "A", "khaki", 5, 5)
  dangerous.health_mean = 3
  dangerous.health_std_dev = 1
  dangerous.mating_mean = 1
  dangerous.mating_std_dev = 0
  dangerous.sustenance_mean = 2
  dangerous.sustenance_std_dev = 1
  dangerous.wellbeing_mean = 1
  dangerous.wellbeing_std_dev = 0
  dangerous.security_mean = -5
  dangerous.security_std_dev = 2
  dangerous.culture_mean = 0
  dangerous.culture_std_dev = 0
  dangerous.wealth_mean = 0
  dangerous.wealth_std_dev = 0
  dangerous.configure





  (0..world.grid.length - 1).each do |col|
    (0..(world.grid[col]).length - 1).each do |row|
      patch = world.grid[col][row]
      t = nil
      if (col + row) % 2 == 0
        t = safe.clone
      else
        t = safe.clone
#        t = dangerous.clone
      end
      t.configure
      patch.terrain = t
    end
  end


  # Desires
#  hunger = Desire.new
#  hunger.name = "Hunger"
#  hunger.intensity = 0.8
#  hunger.payoff = 1
#  hunger.desired_object = "Terrain"
#
#  mating = Desire.new
#  mating.name = "Mating"
#  mating.intensity = 0.8
#  mating.payoff = 1
#  mating.desired_object = "Agents of Same Culture"


  # Humans
  humans = Culture.new("Humans", team_size, "red")
  humans.species = human_species
  humans.kill_chance = 0.05
  humans.life_expectancy_mean = 80
  humans.life_expectancy_std_dev = 10
  humans.childbirth_age_mean = 30
  humans.childbirth_age_std_dev = 5
  humans.fertility_rate_mean = 8.0
  humans.fertility_rate_std_dev = 1.0
  humans.fertility_adjustment_increments = 7
  humans.fertility_adjustment_factor = 1
  humans.desires << CommonDesires::HUNGER
  humans.desires << CommonDesires::MATING


  # Zombies
  zombies = Culture.new("Zombies", team_size / 6, "blue")
  zombies.species = human_species
  zombies.kill_chance = 0.15
  zombies.life_expectancy_mean = 70
  zombies.life_expectancy_std_dev = 8
  zombies.childbirth_age_mean = 25
  zombies.childbirth_age_std_dev = 5
  zombies.fertility_rate_mean = 5.0
  zombies.fertility_rate_std_dev = 1.0
  zombies.desires << CommonDesires::HUNGER
  zombies.desires << CommonDesires::CONVERSION


  world.cultures << humans
  world.cultures << zombies


  world.finalise
  world
end
