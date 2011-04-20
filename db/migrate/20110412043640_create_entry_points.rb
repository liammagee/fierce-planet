class CreateEntryPoints < ActiveRecord::Migration
  def self.up
    create_table :entry_points do |t|
      t.integer :level_id
      t.integer :agent_type
      t.integer :x
      t.integer :y
      t.boolean :renew_each_wave
      t.integer :initial_number

      t.timestamps
    end
  end

  def self.down
    drop_table :entry_points
  end
end
