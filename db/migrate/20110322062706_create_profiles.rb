class CreateProfiles < ActiveRecord::Migration
  def self.up
    create_table :profiles do |t|
      t.integer :user_id
      t.string :nickname
      t.integer :current_score
      t.integer :highest_score
      t.integer :current_level
      t.integer :highest_level
      t.string :status
      t.text :capabilities

      t.timestamps
    end
  end

  def self.down
    drop_table :profiles
  end
end
