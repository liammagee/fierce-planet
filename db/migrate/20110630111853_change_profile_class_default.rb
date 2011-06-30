class ChangeProfileClassDefault < ActiveRecord::Migration
  def self.up
    change_table :profiles do |t|
      t.change_default(:profile_class, 'Novice')
    end
  end

  def self.down
    change_table :profiles do |t|
      t.change_default(:profile_class, '0')
    end
  end
end
