class Profile < ActiveRecord::Base
  attr_accessor :previous_level_score, :expired_agent_count, :saved_agent_count, :saved_agent_this_wave_count, :waves_survived, :resource_count, :resources_in_store, :resources_spent, :resourceStatsCount
  
  belongs_to :user
  after_initialize :init
  before_save :serialise_capabilities

  def init
    self.profile_class ||= 'Novice'
    self.capabilities = self.capabilities ? self.capabilities.split(',') : ['farm', 'water', 'clinic']
  end

  def serialise_capabilities
    self.capabilities = self.capabilities.join(',') if self.capabilities
  end
end
