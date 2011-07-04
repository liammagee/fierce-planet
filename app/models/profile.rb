require 'json'
class Profile < ActiveRecord::Base
#  serialize :capabilities, Array
#  serialize :total_resources_spent_by_category, Hash
#  serialize :ave_resources_spent_by_category, Hash
#  serialize :game_total_resources_spent_by_category, Hash
#  serialize :game_ave_resources_spent_by_category, Hash
#  serialize :current_level_resources_spent_by_category, Hash

  attr_accessor :previous_level_score, :expired_agent_count, :saved_agent_count, :saved_agent_this_wave_count, :waves_survived, :resource_count, :resources_in_store, :resources_spent, :resourceStatsCount
  
  belongs_to :user
  after_initialize :initialize_defaults, :deserialise_objects
  before_save :serialise_objects

  def initialize_defaults
    self.profile_class ||= 'Novice'
    self.current_score ||= 0
    self.capabilities ||= ['farm', 'water', 'clinic'] if new_record?
    self.total_resources_spent_by_category = {}
    self.ave_resources_spent_by_category = {}
    self.game_total_resources_spent_by_category = {}
    self.game_ave_resources_spent_by_category = {}
    self.current_level_resources_spent_by_category = {}
  end

  def deserialise_objects
    self.capabilities = JSON.parse(self.capabilities) if self.capabilities and !self.capabilities.empty?
    self.total_resources_spent_by_category = JSON.parse(self.total_resources_spent_by_category) if self.total_resources_spent_by_category and !self.total_resources_spent_by_category.empty?
    self.ave_resources_spent_by_category = JSON.parse(self.ave_resources_spent_by_category) if self.ave_resources_spent_by_category and !self.ave_resources_spent_by_category.empty?
    self.game_total_resources_spent_by_category = JSON.parse(self.game_total_resources_spent_by_category) if self.game_total_resources_spent_by_category and !self.game_total_resources_spent_by_category.empty?
    self.game_ave_resources_spent_by_category = JSON.parse(self.game_ave_resources_spent_by_category) if self.game_ave_resources_spent_by_category and !self.game_ave_resources_spent_by_category.empty?
    self.current_level_resources_spent_by_category = JSON.parse(self.current_level_resources_spent_by_category) if self.current_level_resources_spent_by_category and !self.current_level_resources_spent_by_category.empty?
  end

  def serialise_objects
    self.capabilities = self.capabilities.to_json #if self.capabilities and self.capabilities.is_a?(Array)
    self.total_resources_spent_by_category = self.total_resources_spent_by_category.to_json
    self.ave_resources_spent_by_category = self.ave_resources_spent_by_category.to_json
    self.game_total_resources_spent_by_category = self.game_total_resources_spent_by_category.to_json
    self.game_ave_resources_spent_by_category = self.game_ave_resources_spent_by_category.to_json
    self.current_level_resources_spent_by_category = self.current_level_resources_spent_by_category.to_json
  end
end
