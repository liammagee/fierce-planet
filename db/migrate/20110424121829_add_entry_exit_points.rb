class AddEntryExitPoints < ActiveRecord::Migration
  def self.up
    add_column :levels, :entry_points, :string
    add_column :levels, :exit_points, :string
  end

  def self.down
    remove_column :levels, :entry_points
    remove_column :levels, :exit_points
  end
end
