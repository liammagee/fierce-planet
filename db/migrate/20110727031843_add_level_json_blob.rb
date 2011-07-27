class AddLevelJsonBlob < ActiveRecord::Migration
  def self.up
    add_column :levels,  :json_blob, :text
    add_column :levels,  :google_map_type_id, :string
  end

  def self.down
    remove_column :levels, :json_blob
    remove_column :levels, :google_map_type_id
  end
end
