class Profile < ActiveRecord::Base
  attr_accessor :previous_level_score, :expired_agent_count, :saved_agent_count, :saved_agent_this_wave_count, :waves_survived, :resource_count, :resources_in_store, :resources_spent, :resourceStatsCount
  
  belongs_to :user

#  has_many :capabilities
  def after_initialize
    self.capabilities = self.capabilities.split(',') if self.capabilities
  end

  def before_save
    self.capabilities = self.capabilities.join(',') if self.capabilities
  end
end
