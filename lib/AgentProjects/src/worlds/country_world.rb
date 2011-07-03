require 'world'
require 'agent'
require 'culture'
require 'terrain'
require 'species'

module SimWorld; end
def SimWorld::build_world
  width = 20
  height = 20
  world = World.new(width, height)
  team_size = 20

  # Add species here
  human_species = Species.new("Homo Sapiens")
  human_species.min_life_expectancy = 30
  human_species.max_life_expectancy = 90
  human_species.min_fertility_rate = 1
  human_species.max_fertility_rate = 5
  human_species.min_childbirth_age = 15
  human_species.max_childbirth_age = 45

  # Add terrain here
  forest = Terrain.new("", "F", "burlywood", 0, 5)
  forest.health_mean = 0
  forest.health_std_dev = 0
  forest.mating_mean = 0
  forest.mating_std_dev = 0
  forest.sustenance_mean = 1
  forest.sustenance_std_dev = 0
  forest.wellbeing_mean = 1
  forest.wellbeing_std_dev = 0
  forest.security_mean = 1
  forest.security_std_dev = 0
  forest.culture_mean = 0
  forest.culture_std_dev = 0
  forest.wealth_mean = 0
  forest.wealth_std_dev = 0

  farm = Terrain.new("farm", "A", "khaki", 5, 5)
  farm.health_mean = 3
  farm.health_std_dev = 1
  farm.mating_mean = 1
  farm.mating_std_dev = 0
  farm.sustenance_mean = 2
  farm.sustenance_std_dev = 1
  farm.wellbeing_mean = 1
  farm.wellbeing_std_dev = 0
  farm.security_mean = -5
  farm.security_std_dev = 2
  farm.culture_mean = 0
  farm.culture_std_dev = 0
  farm.wealth_mean = 0
  farm.wealth_std_dev = 0
  farm.configure


  desert = Terrain.new("desert", "D", "lemonchiffon", 0, 0)
  desert.health_mean = 1
  desert.health_std_dev = 0
  desert.mating_mean = 0
  desert.mating_std_dev = 0
  desert.sustenance_mean = 1
  desert.sustenance_std_dev = 0
  desert.wellbeing_mean = 0
  desert.wellbeing_std_dev = 0
  desert.security_mean = 0
  desert.security_std_dev = 0
  desert.culture_mean = 0
  desert.culture_std_dev = 0
  desert.wealth_mean = 1
  desert.wealth_std_dev = 0
  desert.configure

  city = Terrain.new("city", "C", "mintcream", 10, 5)
  city.health_mean = 10
  city.health_std_dev = 2
  city.mating_mean = 10
  city.mating_std_dev = 2
  city.sustenance_mean = 10
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




  (0..world.grid.length - 1).each do |col|
    (0..(world.grid[col]).length - 1).each do |row|
      patch = world.grid[col][row]
      t = nil
      # City 1
      city1_centre_x = 4
      city1_centre_y = 4
      # City 2
      city2_centre_x = 16
      city2_centre_y = 16
      # Sea 1
      sea1_centre_x = 11
      sea1_centre_y = 11
      if ((city1_centre_x - col) ** 2 + (city1_centre_x - row) ** 2) <= 10
        t = city.clone
      elsif ((sea1_centre_x - col) ** 2 + (sea1_centre_y - row) ** 2) <= 5
        t = sea.clone
      elsif ((city2_centre_x - col) ** 2 + (city2_centre_y - row) ** 2) <= 10
        t = city.clone
      else
        t = farm.clone
      end
#      if col + row < (width + height ) / 1.5
#      if row + cell < (width + height ) / 1.5
#        case (rand() * 4).floor
#          when 0 then
#            t = desert
#          when 1 then
#            t = forest
#          when 2 then
#            t = farm
#          when 3 then
#            t = city
#        end
#      else
#        t = sea
##          t = desert
#      end
#      t.configure
      patch.terrain = t
    end
  end
#  (0..world.grid.length - 1).each do |row|
#    (0..(world.grid[row]).length - 1).each do |cell|
#      patch = world.grid[row][cell]
#      patch.terrain = city
#    end
#  end



  # Desires
  hunger = Desire.new
  hunger.name = "Hunger"
  hunger.intensity = 0.8
  hunger.payoff = 1
  hunger.desired_object = "Terrain"
  

  # Residents
  red_team = Culture.new("Hawks", team_size, "red")
  red_team.species = human_species
  red_team.kill_chance = 0.25
  red_team.life_expectancy_mean = 80
  red_team.life_expectancy_std_dev = 10
  red_team.childbirth_age_mean = 30
  red_team.childbirth_age_std_dev = 5
  red_team.fertility_rate_mean = 4.0
  red_team.fertility_rate_std_dev = 1.0
#  red_team.fertility_adjustment_increments = 7
#  red_team.fertility_adjustment_factor = 1
  red_team.desires << hunger


  # Workers
  blue_team = Culture.new("Doves", team_size, "blue")
  blue_team.species = human_species
  blue_team.kill_chance = 0.05
  blue_team.life_expectancy_mean = 70
  blue_team.life_expectancy_std_dev = 8
  blue_team.childbirth_age_mean = 25
  blue_team.childbirth_age_std_dev = 5
  blue_team.fertility_rate_mean = 5.0
  blue_team.fertility_rate_std_dev = 1.0
  blue_team.desires << hunger


  world.cultures << red_team
  world.cultures << blue_team


  world.finalise
  world
end
