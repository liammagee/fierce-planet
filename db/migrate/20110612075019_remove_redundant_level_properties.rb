class RemoveRedundantLevelProperties < ActiveRecord::Migration
  def self.up
    remove_column :levels, :initial_agent_x
    remove_column :levels, :initial_agent_y
    remove_column :levels, :goal_x
    remove_column :levels, :goal_y
  end

  def self.down
    add_column :levels, :initial_agent_x, :integer
    add_column :levels, :initial_agent_y, :integer
    add_column :levels, :goal_x, :integer
    add_column :levels, :goal_y, :integer
  end
end
