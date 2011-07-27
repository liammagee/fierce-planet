class AddUserToLevel < ActiveRecord::Migration
  def self.up
    add_column :levels,  :user_id, :integer
  end

  def self.down
    remove_column :levels, :user_id
  end
end
