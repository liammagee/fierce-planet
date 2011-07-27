class AddGoogleMapOptions < ActiveRecord::Migration
  def self.up
    add_column :levels,  :google_map_options, :text
  end

  def self.down
    remove_column :levels,  :google_map_options
  end
end
