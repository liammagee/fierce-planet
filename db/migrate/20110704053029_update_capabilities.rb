class UpdateCapabilities < ActiveRecord::Migration
  def self.up
    execute "UPDATE profiles set capabilities = '[\"farm\",\"water\",\"clinic\"]';"
  end

  def self.down
  end
end
