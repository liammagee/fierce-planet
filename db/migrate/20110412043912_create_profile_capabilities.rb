class CreateProfileCapabilities < ActiveRecord::Migration
  def self.up
    create_table :profile_capabilities do |t|
      t.integer :profile_id
      t.integer :capability_id

      t.timestamps
    end
  end

  def self.down
    drop_table :profile_capabilities
  end
end
