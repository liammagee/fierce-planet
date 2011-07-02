class UpdateProfileClasses < ActiveRecord::Migration
  def self.up
    say_with_time "Updating profiles..." do
      Profile.where("profile_class = '0'").each do |p|
        p.update_attribute :profile_class, 'Novice'
      end
    end
  end

  def self.down
    Profile.where("profile_class = 'Novice'").each do |p|
      p.update_attribute :profile_class, '0'
    end
  end
end
