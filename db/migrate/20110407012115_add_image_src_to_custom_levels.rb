class AddImageSrcToCustomLevels < ActiveRecord::Migration
  def self.up
    add_column :levels, :image_src, :string
  end

  def self.down
    remove_column :levels, :image_src
  end
end
