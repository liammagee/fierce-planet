/*!
 * Fierce Planet - Resource
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/**
 * ResourceCategory class definition
 *
 * @constructor
 * @param name
 */
function ResourceCategory(name, code, color) {
    this._name = name;
    this._code = code;
    this._color = color;
    this._types = [];
    this._evaluateOtherCategoryImpact = function(otherCategory) { return 1.0; };
}
ResourceCategory.prototype.getColor = function() { return this._color; };
ResourceCategory.prototype.setColor = function(color) { this._color = color; };
ResourceCategory.prototype.getName = function() { return this._name; };
ResourceCategory.prototype.setName = function(name) { this._name = name; };
ResourceCategory.prototype.getCode = function() { return this._code; };
ResourceCategory.prototype.setCode = function(code) { this._code = code; };
ResourceCategory.prototype.getTypes = function() { return this._types; };
ResourceCategory.prototype.setTypes = function(types) { this._types = types; };
ResourceCategory.prototype.addType = function(type) {
    this._types.push(type);
    type.setCategory(this);
};
ResourceCategory.prototype.setEvaluateOtherCategoryImpact = function(f) {this._evaluateOtherCategoryImpact = f;};
ResourceCategory.prototype.doEvaluateOtherCategoryImpact = function(otherCategory) {return this._evaluateOtherCategoryImpact(otherCategory); };



/**
 * ResourceType class definition
 * 
 * @constructor
 * @param category
 * @param name
 * @param code
 * @param image
 * @param cost
 * @param upgradeCost
 * @param totalYield
 * @param perAgentYield
 */
function ResourceType(category, name, code, image, cost, upgradeCost, totalYield, perAgentYield) {
    this._category = category;
    this._name = name;
    this._code = code;
    this._image = image;
    this._cost = cost;
    this._upgradeCost = upgradeCost;
    this._totalYield = totalYield;
    this._perAgentYield = perAgentYield;
    this._category.addType(this);
}

/**
 * ResourceType class definition
 *
 * @constructor
 * @param name
 * @param code
 * @param image
 * @param cost
 * @param upgradeCost
 * @param totalYield
 * @param perAgentYield
 */
function ResourceType(name, code, image, cost, upgradeCost, totalYield, perAgentYield) {
    this._name = name;
    this._code = code;
    this._image = image;
    this._cost = cost;
    this._upgradeCost = upgradeCost;
    this._totalYield = totalYield;
    this._perAgentYield = perAgentYield;
}
ResourceType.prototype.getName = function() { return this._name; };
ResourceType.prototype.setName = function(name) { this._name = name; };
ResourceType.prototype.getCode = function() { return this._code; };
ResourceType.prototype.setCode = function(code) { this._code = code; };
ResourceType.prototype.getImage = function() { return this._image; };
ResourceType.prototype.setImage = function(image) { this._image = image; };
ResourceType.prototype.getCategory = function() { return this._category; };
ResourceType.prototype.setCategory = function(category) { this._category = category;};
ResourceType.prototype.getCost = function() { return this._cost; };
ResourceType.prototype.setCost = function(cost) { this._cost = cost; };
ResourceType.prototype.getUpgradeCost = function() { return this._upgradeCost; };
ResourceType.prototype.setUpgradeCost = function(upgradeCost) { this._upgradeCost = upgradeCost; };
ResourceType.prototype.getPerAgentYield = function() { return this._perAgentYield; };
ResourceType.prototype.setPerAgentYield = function(perAgentYield) { this._perAgentYield = perAgentYield; };
ResourceType.prototype.getTotalYield = function() { return this._totalYield; };
ResourceType.prototype.setTotalYield = function(totalYield) { this._totalYield = totalYield; };


/**
 * Resource class definition
 *
 * @constructor
 * @param kind
 * @param x
 * @param y
 */
function Resource(kind, x, y) {
    // Kind properties
    this._resourceCategory = kind.getCategory();
    this._color = kind.getCategory().getColor();
    this._kind = kind;
    this._resourceName = kind.getCode();
    this._initialTotalYield = kind.getTotalYield();
    this._perAgentYield = kind.getPerAgentYield();
    this._cost = kind.getCost();
    this._upgradeCost = kind.getUpgradeCost();


    this._totalYield = kind.getTotalYield();
    this._upgradeLevel = 1;
    this.setPosition(x, y);
}
// Kind properties
Resource.prototype.getName = function() { return this._resourceName; };
Resource.prototype.getCategory = function() { return this._resourceCategory;};
Resource.prototype.getColor = function() { return this._color;};
Resource.prototype.getCost = function() { return this._cost; };
Resource.prototype.setCost = function(cost) { this._cost = cost; };
Resource.prototype.getUpgradeCost = function() { return this._upgradeCost; };
Resource.prototype.setUpgradeCost = function(upgradeCost) { this._upgradeCost = upgradeCost; };
Resource.prototype.getInitialTotalYield = function() { return this._initialTotalYield; };
Resource.prototype.setInitialTotalYield = function(initialTotalYield) { this._initialTotalYield = initialTotalYield; this._totalYield = initialTotalYield; };
Resource.prototype.getPerAgentYield = function() { return this._perAgentYield; };
Resource.prototype.setPerAgentYield = function(perAgentYield) { this._perAgentYield = perAgentYield; };

Resource.prototype.getUpgradeLevel = function() { return this._upgradeLevel; };
Resource.prototype.setUpgradeLevel = function(upgradeLevel) { this._upgradeLevel = upgradeLevel; };
Resource.prototype.getTotalYield = function() { return this._totalYield; };
Resource.prototype.setTotalYield = function(totalYield) { this._totalYield = totalYield; };
Resource.prototype.getPosition = function() { return [this._x, this._y]; };
Resource.prototype.setPosition = function(x, y) { this._x =x; this._y = y; };
Resource.prototype.getX = function() { return this._x; };
Resource.prototype.setX = function(x) { this._x = x; };
Resource.prototype.getY = function() { return this._y; };
Resource.prototype.setY = function(y) { this._y = y; };
Resource.prototype.provideYield = function(agent, resourceEffect, applyGeneralHealth, adjustSpeedToYield) {
    if (this._totalYield > this._perAgentYield) {
        var adjustment = 0;
        if (applyGeneralHealth) {
            // Don't be greedy - only yield a benefit if the agent needs it
            if (agent.getHealth() < 100) {
                adjustment = this._perAgentYield * this._upgradeLevel * resourceEffect;
                agent.adjustHealth(adjustment);
                if (adjustSpeedToYield)
                    agent.setSpeed(this._perAgentYield);
                // This lowers the impact of resources on agents' speed - but need delay for 'followers' to get resources of their own.
//                    agent.setSpeed(Math.floor(Math.pow(this._perAgentYield, 0.5)));
                this._totalYield -= this._perAgentYield;
            }
        }
        else {
            if (agent.getHealthForResource(this) < 100) {
                adjustment = this._perAgentYield * this._upgradeLevel * 3 * resourceEffect;
                agent.adjustHealthForResource(adjustment, this);
                if (adjustSpeedToYield)
                    agent.setSpeed(this._perAgentYield);
                // This lowers the impact of resources on agents' speed - but need delay for 'followers' to get resources of their own.
//                    agent.setSpeed(Math.floor(Math.pow(this._perAgentYield, 0.5)));
                this._totalYield -= this._perAgentYield;
            }
        }
    }
};

