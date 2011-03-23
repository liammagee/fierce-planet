class CreateLevels < ActiveRecord::Migration
  def self.up
    create_table :levels do |t|
      t.string :name
      t.integer :world_width
      t.integer :world_height
      t.integer :initial_agent_x
      t.integer :initial_agent_y
      t.integer :initial_agent_number
      t.integer :goal_x
      t.integer :goal_y
      t.integer :wave_number
      t.integer :expiry_limit
      t.boolean :allow_offscreen_cycling
      t.boolean :allow_patches_on_path
      t.text :notice
      t.text :tiles

      t.timestamps
    end
  end

  def self.down
    drop_table :levels
  end
end
