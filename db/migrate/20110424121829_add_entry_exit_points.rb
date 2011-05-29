class AddSoundSrcToCustomLevels < ActiveRecord::Migration
  def self.up
    add_column :levels, :sound_src, :string
  end

  def self.down
    remove_column :levels, :sound_src
  end
end
