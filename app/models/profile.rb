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
  after_initialize :initialize_defaults
  after_find :deserialise_objects
  before_save :serialise_objects

  def initialize_defaults
    self.profile_class ||= 'Novice'
    self.current_score ||= 0
    
    self.capabilities ||= ['farm', 'water', 'clinic']
    self.total_resources_spent_by_category ||= {}
    self.ave_resources_spent_by_category ||= {}
    self.game_total_resources_spent_by_category ||= {}
    self.game_ave_resources_spent_by_category ||= {}
    self.current_level_resources_spent_by_category ||= {}
  end

  def deserialise_objects
    deserialise_as_array('capabilities')
    deserialise_as_hash('total_resources_spent_by_category')
    deserialise_as_hash('ave_resources_spent_by_category')
    deserialise_as_hash('game_total_resources_spent_by_category')
    deserialise_as_hash('game_ave_resources_spent_by_category')
    deserialise_as_hash('current_level_resources_spent_by_category')
  end

  def deserialise_as_array(property)
    lp = self.send(property.to_sym)
    val = []
    if lp and lp.is_a?(String) and !lp.empty?
      begin
        val = JSON.parse(lp)
      rescue
      end
    end
    self.send((property+'=').to_sym, val)
  end

  def deserialise_as_hash(property)
    lp = self.send(property.to_sym)
    val = {}
    if lp and lp.is_a?(String) and !lp.empty?
      begin
        val = JSON.parse(lp)
      rescue
      end
    end
    self.send((property+'=').to_sym, val)
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
