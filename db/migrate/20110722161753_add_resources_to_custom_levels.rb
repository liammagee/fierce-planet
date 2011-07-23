class AddResourcesToCustomLevels < ActiveRecord::Migration
  def self.up
    add_column :levels,  :resources, :text
  end

  def self.down
    remove_column :levels,  :resources
  end
end
