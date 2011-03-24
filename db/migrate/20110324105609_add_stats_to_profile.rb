class AddStatsToProfile < ActiveRecord::Migration
  def self.up
    add_column :profiles, :total_saved, :integer, :default => 0
    add_column :profiles, :total_expired, :integer, :default => 0
    add_column :profiles, :total_patches, :integer, :default => 0
    add_column :profiles, :total_economic_patches, :integer, :default => 0
    add_column :profiles, :total_environmental_patches, :integer, :default => 0
    add_column :profiles, :total_social_patches, :integer, :default => 0
    add_column :profiles, :credits, :integer, :default => 0
    add_column :profiles, :profile_class, :integer, :default => 0
    add_column :profiles, :progress_towards_next_class, :integer, :default => 0
  end

  def self.down
    remove_column :profiles, :total_saved
    remove_column :profiles, :total_expired
    remove_column :profiles, :total_patches
    remove_column :profiles, :total_economic_patches
    remove_column :profiles, :total_environmental_patches
    remove_column :profiles, :total_social_patches
    remove_column :profiles, :credits
    remove_column :profiles, :profile_class
    remove_column :profiles, :progress_towards_next_class
  end
end
