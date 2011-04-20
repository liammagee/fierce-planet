class CreateCapabilities < ActiveRecord::Migration
  def self.up
    create_table :capabilities do |t|
      t.integer :capability_type
      t.string :name
      t.string :code
      t.text :description
      t.string :icon
      t.integer :resource_level_cost
      t.integer :agent_pay_out
      t.integer :required_credits
      t.integer :required_level

      t.timestamps
    end
  end

  def self.down
    drop_table :capabilities
  end
end
