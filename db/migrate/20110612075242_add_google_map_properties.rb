class AddGoogleMapProperties < ActiveRecord::Migration
  def self.up
    add_column :levels, :google_map_tilt, :string
    add_column :levels, :google_map_zoom, :string
    add_column :levels, :google_map_long, :string
    add_column :levels, :google_map_lat, :string
  end

  def self.down
    remove_column :levels, :google_map_tilt
    remove_column :levels, :google_map_zoom
    remove_column :levels, :google_map_long
    remove_column :levels, :google_map_lat
  end
end
