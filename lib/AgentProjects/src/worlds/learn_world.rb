require 'world'
require 'desire'
require 'agent'
require 'culture'
require 'terrain'
require 'species'

module SimWorld; end
def SimWorld::build_world(width = nil, height = nil)
  width ||= 20
  height ||= 20
  world = World.new(width, height)
  team_size = 4
  
  # Add species here
  human_species = Species.new("Homo Sapiens")
  human_species.min_life_expectancy = 30
  human_species.max_life_expectancy = 90
  human_species.min_fertility_rate = 2.3
  human_species.max_fertility_rate = 5.5
  human_species.min_childbirth_age = 15
  human_species.max_childbirth_age = 45

  # Add terrain here
  # Add terrain here
  forest = Terrain.new("forest", "F", "green", 0, 5)
  forest.health_mean = 6
  forest.health_std_dev = 1
  forest.mating_mean = 0
  forest.mating_std_dev = 0
  forest.sustenance_mean = 4
  forest.sustenance_std_dev = 0
  forest.wellbeing_mean = 1
  forest.wellbeing_std_dev = 0
  forest.security_mean = 1
  forest.security_std_dev = 0
  forest.culture_mean = 0
  forest.culture_std_dev = 0
  forest.wealth_mean = 0
  forest.wealth_std_dev = 0
  forest.configure

  farm = Terrain.new("farm", "A", "chocolate", 5, 5)
  farm.health_mean = 5
  farm.health_std_dev = 1
  farm.mating_mean = 1
  farm.mating_std_dev = 0
  farm.sustenance_mean = 10
  farm.sustenance_std_dev = 1
  farm.wellbeing_mean = 1
  farm.wellbeing_std_dev = 0
  farm.security_mean = 10
  farm.security_std_dev = 2
  farm.culture_mean = 0
  farm.culture_std_dev = 0
  farm.wealth_mean = 0
  farm.wealth_std_dev = 0
  farm.configure


  desert = Terrain.new("desert", "D", "gold", 0, 0)
  desert.health_mean = 2
  desert.health_std_dev = 1
  desert.mating_mean = 0
  desert.mating_std_dev = 0
  desert.sustenance_mean = 2
  desert.sustenance_std_dev = 0
  desert.wellbeing_mean = 0
  desert.wellbeing_std_dev = 0
  desert.security_mean = 10
  desert.security_std_dev = 0
  desert.culture_mean = 0
  desert.culture_std_dev = 0
  desert.wealth_mean = 1
  desert.wealth_std_dev = 0
  desert.configure

  city = Terrain.new("city", "C", "dimgray", 10, 5)
  city.health_mean = 10
  city.health_std_dev = 2
  city.mating_mean = 10
  city.mating_std_dev = 2
  city.sustenance_mean = 8
  city.sustenance_std_dev = 2
  city.wellbeing_mean = 1
  city.wellbeing_std_dev = 0
  city.security_mean = 10
  city.security_std_dev = 2
  city.culture_mean = 0
  city.culture_std_dev = 0
  city.wealth_mean = 1
  city.wealth_std_dev = 0
  city.configure

  sea = Terrain.new("sea", "X", "blue", -100, 0)
  sea.health_mean = -100
  sea.health_std_dev = 0
  sea.mating_mean = 0
  sea.mating_std_dev = 0
  sea.sustenance_mean = 0
  sea.sustenance_std_dev = 0
  sea.wellbeing_mean = 0
  sea.wellbeing_std_dev = 0
  sea.security_mean = 0
  sea.security_std_dev = 0
  sea.culture_mean = 0
  sea.culture_std_dev = 0
  sea.wealth_mean = 0
  sea.wealth_std_dev = 0
  sea.configure




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
      i = (rand() * 5).floor
      case i
        when 0
          t = city.clone
        when 1
          t = sea.clone
        when 2
          t = city.clone
        when 3
          t = sea.clone
        when 4
          t = city.clone
        else
          t = sea.clone
      end
      t.configure
      patch.terrain = t #desert.clone
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
  humans.fertility_rate_mean = 6
  humans.fertility_rate_std_dev = 1.0
  humans.initial_health_mean = 20
  humans.initial_health_std_dev = 4.0
#  humans.fertility_adjustment_increments = 7
#  humans.fertility_adjustment_factor = 0.95
  humans.desires << Desire.new(CommonDesires::HUNGER, 0.8)
  humans.desires << Desire.new(CommonDesires::MATING, 0.7)
#  humans.desires << CommonDesires::FLEE
  humans.desires << Desire.new(CommonDesires::WANDERLUST, 0.5)



  world.cultures << humans


  world.finalise(false)
  world
end
