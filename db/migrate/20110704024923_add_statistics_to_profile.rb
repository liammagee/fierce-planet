class AddStatisticsToProfile < ActiveRecord::Migration
  def self.up
    add_column :profiles,  :total_levels, :integer, :default => 0
    rename_column :profiles, :total_resources, :total_resources_spent
    add_column :profiles,  :total_resources_spent_by_category, :string, :default => ''
    add_column :profiles,  :ave_saved, :integer, :default => 0
    add_column :profiles,  :ave_expired, :integer, :default => 0
    add_column :profiles,  :ave_resources_spent, :integer, :default => 0
    add_column :profiles,  :ave_resources_spent_by_category, :string, :default => ''


    add_column :profiles,  :game_total_levels, :integer, :default => 0
    add_column :profiles,  :game_highest_level, :integer, :default => 0
    add_column :profiles,  :game_score, :integer, :default => 0

    add_column :profiles,  :game_total_saved, :integer, :default => 0
    add_column :profiles,  :game_total_expired, :integer, :default => 0
    add_column :profiles,  :game_total_resources_spent, :integer, :default => 0
    add_column :profiles,  :game_total_resources_spent_by_category, :string, :default => ''
    add_column :profiles,  :game_ave_saved, :integer, :default => 0
    add_column :profiles,  :game_ave_expired, :integer, :default => 0
    add_column :profiles,  :game_ave_resources_spent, :integer, :default => 0
    add_column :profiles,  :game_ave_resources_spent_by_category, :string, :default => ''


    add_column :profiles,  :current_level_is_preset, :boolean, :default => true
    add_column :profiles,  :current_level_waves, :integer, :default => 0
    add_column :profiles,  :current_level_saved_this_wave, :integer, :default => 0

    add_column :profiles,  :current_level_saved, :integer, :default => 0
    add_column :profiles,  :current_level_expired, :integer, :default => 0
    add_column :profiles,  :current_level_resources_in_store, :integer, :default => 0
    add_column :profiles,  :current_level_resources_spent, :integer, :default => 0
    add_column :profiles,  :current_level_resources_spent_by_category, :string, :default => ''
  end

  def self.down
    remove_column  :profiles,  :total_levels
    rename_column :profiles, :total_resources_saved, :total_resources
    remove_column  :profiles,  :total_resources_spent_by_category
    remove_column  :profiles,  :ave_saved
    remove_column  :profiles,  :ave_expired
    remove_column  :profiles,  :ave_resources_spent
    remove_column  :profiles,  :ave_resources_spent_by_category


    remove_column  :profiles,  :game_total_levels
    remove_column  :profiles,  :game_highest_level
    remove_column  :profiles,  :game_score

    remove_column  :profiles,  :game_total_saved
    remove_column  :profiles,  :game_total_expired
    remove_column  :profiles,  :game_total_resources_spent
    remove_column  :profiles,  :game_total_resources_spent_by_category
    remove_column  :profiles,  :game_ave_saved
    remove_column  :profiles,  :game_ave_expired
    remove_column  :profiles,  :game_ave_resources_spent
    remove_column  :profiles,  :game_ave_resources_spent_by_category


    remove_column  :profiles,  :current_level_is_preset
    remove_column  :profiles,  :current_level_waves
    remove_column  :profiles,  :current_level_saved_this_wave

    remove_column  :profiles,  :current_level_saved
    remove_column  :profiles,  :current_level_expired
    remove_column  :profiles,  :current_level_resources_in_store
    remove_column  :profiles,  :current_level_resources_spent
    remove_column  :profiles,  :current_level_resources_spent_by_category
  end
end
