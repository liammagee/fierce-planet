require 'world'
require 'desire'
require 'agent'
require 'culture'
require 'terrain'
require 'species'

module SimWorld; end
def SimWorld::build_world
  width = 30
  height = 30
  world = World.new(width, height)
  team_size = 100
  
  # Add species here
  human_species = Species.new("Homo Sapiens")
  human_species.min_life_expectancy = 30
  human_species.max_life_expectancy = 90
  human_species.min_fertility_rate = 1
  human_species.max_fertility_rate = 5
  human_species.min_childbirth_age = 15
  human_species.max_childbirth_age = 45

  # Add terrain here
  street = Terrain.new("", "F", "burlywood", 0, 5)
  street.health_mean = 10
  street.health_std_dev = 0
  street.mating_mean = 5
  street.mating_std_dev = 1
  street.sustenance_mean = 10
  street.sustenance_std_dev = 1
  street.wellbeing_mean = 1
  street.wellbeing_std_dev = 0
  street.security_mean = 1
  street.security_std_dev = 0
  street.culture_mean = 0
  street.culture_std_dev = 0
  street.wealth_mean = 0
  street.wealth_std_dev = 0
  street.configure

  building = Terrain.new("dangerous", "A", "khaki", 5, 5)
  building.health_mean = 0
  building.health_std_dev = 0
  building.mating_mean = 0
  building.mating_std_dev = 0
  building.sustenance_mean = 0
  building.sustenance_std_dev = 0
  building.wellbeing_mean = 0
  building.wellbeing_std_dev = 0
  building.security_mean = 0
  building.security_std_dev = 0
  building.culture_mean = 0
  building.culture_std_dev = 0
  building.wealth_mean = 0
  building.wealth_std_dev = 0
  building.configure



  city1_centre_x = 2
  city1_centre_y = 2
  city2_centre_x = 7
  city2_centre_y = 2
  city3_centre_x = 12
  city3_centre_y = 2
  city4_centre_x = 17
  city4_centre_y = 2
  city5_centre_x = 2
  city5_centre_y = 2
  city5_centre_x = 7
  city5_centre_y = 2
  city5_centre_x = 12
  city5_centre_y = 2
  city4_centre_x = 17
  city4_centre_y = 2

  (0..world.grid.length - 1).each do |col|
    (0..(world.grid[col]).length - 1).each do |row|
      patch = world.grid[col][row]
      t = nil
      if ((2 - row % 5) ** 2 < 2 and (2 - col % 5) ** 2 < 2)
        t = building.clone
      else
        t = street.clone
      end
      patch.terrain = t
    end
  end



  # Humans
  humans = Culture.new("Humans", team_size, "red")
  humans.species = human_species
  humans.kill_chance = 0.05
  humans.life_expectancy_mean = 80
  humans.life_expectancy_std_dev = 10
  humans.childbirth_age_mean = 20
  humans.childbirth_age_std_dev = 5
  humans.fertility_rate_mean = 6.3
  humans.fertility_rate_std_dev = 1.0
#  humans.fertility_adjustment_increments = 7
#  humans.fertility_adjustment_factor = 1
#  humans.desires << CommonDesires::HUNGER
  humans.desires << CommonDesires::MATING
#  humans.desires << CommonDesires::FLEE
  humans.desires << CommonDesires::WANDERLUST


  # Zombies
  zombies = Culture.new("Zombies", team_size / 10, "blue")
  zombies.species = human_species
  zombies.kill_chance = 0.2
  zombies.life_expectancy_mean = 133
  zombies.life_expectancy_std_dev = 8
  zombies.childbirth_age_mean = 25
  zombies.childbirth_age_std_dev = 5
  zombies.fertility_rate_mean = 0.1
  zombies.fertility_rate_std_dev = 0.1
#  zombies.desires << CommonDesires::HUNGER
  zombies.desires << CommonDesires::CONVERSION
#  zombies.desires << CommonDesires::WANDERLUST


  world.cultures << humans
  world.cultures << zombies


  world.finalise
  world
end
