class AddStatsToProfile < ActiveRecord::Migration
  def self.up
    add_column :profiles, :total_saved, :integer, :default => 0
    add_column :profiles, :total_expired, :integer, :default => 0
    add_column :profiles, :total_resources, :integer, :default => 0
    add_column :profiles, :total_economic_resources, :integer, :default => 0
    add_column :profiles, :total_environmental_resources, :integer, :default => 0
    add_column :profiles, :total_social_resources, :integer, :default => 0
    add_column :profiles, :credits, :integer, :default => 0
    add_column :profiles, :profile_class, :integer, :default => 0
    add_column :profiles, :progress_towards_next_class, :integer, :default => 0
  end

  def self.down
    remove_column :profiles, :total_saved
    remove_column :profiles, :total_expired
    remove_column :profiles, :total_resources
    remove_column :profiles, :total_economic_resources
    remove_column :profiles, :total_environmental_resources
    remove_column :profiles, :total_social_resources
    remove_column :profiles, :credits
    remove_column :profiles, :profile_class
    remove_column :profiles, :progress_towards_next_class
  end
end
