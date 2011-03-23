class AddAdminUsers < ActiveRecord::Migration
  def self.up
    u = User.where("email = ?", 'liam.magee@gmail.com').first
    u.update_attribute :admin, true unless u.nil?
  end

  def self.down
    u = User.where("email = ?", 'liam.magee@gmail.com').first
    u.update_attribute :admin, false unless u.nil?
  end
end
