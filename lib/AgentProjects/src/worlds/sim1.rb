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
  desert = Terrain.new("desert", "D", "lemonchiffon", 0, 0)
  forest = Terrain.new("forest", "F", "burlywood", 0, 5)
  farm = Terrain.new("farm", "A", "khaki", 5, 5)
  city = Terrain.new("city", "C", "mintcream", -2, 5)
  sea = Terrain.new("sea", "X", "blue", -100, 0)


  (0..world.grid.length - 1).each do |row|
    (0..(world.grid[row]).length - 1).each do |cell|
      patch = world.grid[row][cell]
      t = nil
      if row + cell < (width + height ) / 1.5
        case (rand() * 4).floor
          when 0 then
            t = desert
          when 1 then
            t = forest
          when 2 then
            t = farm
          when 3 then
            t = city
        end
      else
        t = sea
#          t = desert
      end
      patch.terrain = t
    end
  end


  # Australia
  red_team = Culture.new("red", team_size)
  red_team.species = human_species
  red_team.kill_chance = 0.05
  red_team.life_expectancy_mean = 80
  red_team.life_expectancy_std_dev = 10
  red_team.childbirth_age_mean = 30
  red_team.childbirth_age_std_dev = 5
  red_team.fertility_rate_mean = 1.8
#    red_team.fertility_rate_mean = 2.3
  red_team.fertility_rate_std_dev = 1.0
  red_team.fertility_adjustment_increments = 7
  red_team.fertility_adjustment_factor = 1


  # Yemen
  blue_team = Culture.new("blue", team_size)
  blue_team.species = human_species
  blue_team.kill_chance = 0.1
  blue_team.life_expectancy_mean = 55
  blue_team.life_expectancy_std_dev = 8
  blue_team.childbirth_age_mean = 25
  blue_team.childbirth_age_std_dev = 5
  blue_team.fertility_rate_mean = 2.0
#    blue_team.fertility_rate_mean = 5.0
  blue_team.fertility_rate_std_dev = 1.5


  # Swaziland
  green_team = Culture.new("green", team_size)
  green_team.species = human_species
  green_team.kill_chance = 0.01
  green_team.life_expectancy_mean = 40
  green_team.life_expectancy_std_dev = 5
  green_team.childbirth_age_mean = 22
  green_team.childbirth_age_std_dev = 3
#    green_team.fertility_rate_mean = 3.45
  green_team.fertility_rate_mean = 2.2
  green_team.fertility_rate_std_dev = 1.0

  world.cultures << red_team
  world.cultures << blue_team
  world.cultures << green_team


  world.finalise
  world
end
