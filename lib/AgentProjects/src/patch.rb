
class Patch
  attr_accessor :agent, :terrain, :feature, :x, :y
  attr_accessor :last_agent, :last_agent_iteration

  def initialize(x, y)
    self.x  = x
    self.y  = y
  end

  def free?(permit_conflicts)
    (permit_conflicts or agent.nil? or agent.status == "dead") and terrain.habitable
  end

  def to_json(*a)
    {
      'json_class'   => self.class.name,
      'fp-data'         => [ agent, terrain ]
    }.to_json(*a)
  end


  def process_iteration
    terrain.adjust_yield(agent)
  end

  def position
    Position.new(self.x, self.y)
  end

  def neighbouring_patches(world)
    tmp_x = x
    tmp_y = y
    (0..7).each do |i|
      case i
        when 0
          tmp_x = (x == 0 ? world.grid.length - 1 : x - 1)
        when 1
          tmp_y = (y == 0 ? world.grid[0].length - 1 : y - 1)
        when 2
          tmp_x = (x == world.grid.length - 1 ? 0 : x + 1)
        when 3
          tmp_y = (y == world.grid[0].length - 1 ? 0 : y + 1)
        when 4
          tmp_x = (x == 0 ? world.grid.length - 1 : x - 1)
          tmp_y = (y == 0 ? world.grid[0].length - 1 : y - 1)
        when 5
          tmp_x = (x == world.grid.length - 1 ? 0 : x + 1)
          tmp_y = (y == 0 ? world.grid[0].length - 1 : y - 1)
        when 6
          tmp_x = (x == 0 ? world.grid.length - 1 : x - 1)
          tmp_y = (y == world.grid[0].length - 1 ? 0 : y + 1)
        when 7
          tmp_x = (x == world.grid.length - 1 ? 0 : x + 1)
          tmp_y = (y == world.grid[0].length - 1 ? 0 : y + 1)
      end
      patch = world.grid[tmp_x][tmp_y]
      yield patch
    end

  end

end