class AddDefaultCapabilities < ActiveRecord::Migration
  def self.up
    make_capability(1, "Farm", "farm",  "", "/images/farm.gif", 10, 20, 0, 1)
    make_capability(1, "Shop", "shop",  "", "/images/shop.gif", 15, 30, 100, 2)
    make_capability(1, "Bank", "bank",  "", "/images/bank.gif", 20, 50, 200, 3)
    make_capability(1, "Factory", "factory",  "", "/images/factory.gif", 25, 70, 300, 4)
    make_capability(1, "Stockmarket", "stockmarket",  "", "/images/stockmarket.gif", 30, 90, 500, 5)

    make_capability(2, "Fresh Water", "water",  "", "/images/farm.gif", 10, 10, 0, 1)
    make_capability(2, "Wildlife Park", "park",  "", "/images/farm.gif", 15, 15, 100, 2)
    make_capability(2, "Clean Air", "",  "air", "/images/farm.gif", 20, 25, 200, 3)
    make_capability(2, "Green Energy", "energy",  "", "/images/farm.gif", 25, 35, 300, 4)
    make_capability(2, "Biodiversity", "biodiversity",  "", "/images/farm.gif", 30, 45, 500, 5)

    make_capability(3, "Clinic", "clinic",  "", "/images/farm.gif", 10, 5, 0, 1)
    make_capability(3, "School", "school",  "", "/images/farm.gif", 15, 8, 100, 2)
    make_capability(3, "Legal System", "legal",  "", "/images/farm.gif", 20, 15, 200, 3)
    make_capability(3, "Democracy", "democracy",  "", "/images/farm.gif", 25, 20, 300, 4)
    make_capability(3, "Festival", "festival",  "", "/images/farm.gif", 30, 25, 500, 5)
    

  end

  def self.make_capability(capability_type, name, code, description, icon, resource_level_cost, agent_pay_out, required_credits, required_level)
    c = Capability.new
    c.capability_type = capability_type
    c.name = name
    c.code = code
    c.description = description
    c.icon = icon
    c.resource_level_cost = resource_level_cost
    c.agent_pay_out = agent_pay_out
    c.required_credits = required_credits
    c.required_level = required_level
    c.save
  end


  def self.down
    #Capability.find(:all).destroy
  end
end
