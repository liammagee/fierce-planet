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
    // To by-pass circular references, clone the type added to the collection
    this._types.push(type.clone());
    type.setCategory(this);
};
ResourceCategory.prototype.setEvaluateOtherCategoryImpact = function(f) {this._evaluateOtherCategoryImpact = f;};
ResourceCategory.prototype.doEvaluateOtherCategoryImpact = function(otherCategory) {return this._evaluateOtherCategoryImpact(otherCategory); };




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
ResourceType.prototype.clone = function() {
    var clonedType = new ResourceType(this._name, this._code, this._image, this._cost, this._upgradeCost, this._perAgentYield, this._perAgentYield);
    return clonedType;
};


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
    this._resourceCategory = kind._category;
    this._color = kind._category._color;
    this._kind = kind;
    this._resourceName = kind._code;
    this._initialTotalYield = kind._totalYield;
    this._perAgentYield = kind._perAgentYield;
    this._cost = kind._cost;
    this._upgradeCost = kind._upgradeCost;


    this._totalYield = kind._totalYield;
    this._upgradeLevel = 1;
    this.moveTo(x, y);
}
// Kind properties
Resource.prototype.getName = function() { return this._resourceName; };
Resource.prototype.getCategory = function() { return this._resourceCategory;};
Resource.prototype.getType = function() { return this._kind;};
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
Resource.prototype.incrementTotalYield = function(totalYield) { this._totalYield++; };
Resource.prototype.getPosition = function() { return [this._x, this._y]; };
Resource.prototype.moveTo = function(x, y) { this._x =x; this._y = y; };
Resource.prototype.getX = function() { return this._x; };
Resource.prototype.setX = function(x) { this._x = x; };
Resource.prototype.getY = function() { return this._y; };
Resource.prototype.setY = function(y) { this._y = y; };
Resource.prototype.provideYield = function(agent, resourceEffect, adjustSpeedToYield, applyGeneralHealth) {
    if (this._totalYield > this._perAgentYield) {
        var adjustment = 0;
        if (applyGeneralHealth || World.settings.applyGeneralHealth) {
            // Don't be greedy - only yield a benefit if the agent needs it
            if (agent.getHealth() < 100) {
                adjustment = this._perAgentYield * this._upgradeLevel * resourceEffect;
                agent.adjustGeneralHealth(adjustment);
                if (adjustSpeedToYield)
                    agent.setSpeed(this._perAgentYield);
                // This lowers the impact of resources on agents' speed - but need delay for 'followers' to get resources of their own.
//                    agent.setSpeed(Math.floor(Math.pow(this._perAgentYield, 0.5)));
                this._totalYield -= this._perAgentYield;
            }
        }
        else {
            if (agent.getHealthForResource(this) < 100) {
                var rawAdjustment = this._perAgentYield * this._upgradeLevel * World.resourceCategories.length;
                adjustment = rawAdjustment * resourceEffect;
                agent.adjustHealthForResource(adjustment, this);
                if (adjustSpeedToYield)
                    agent.setSpeed(this._perAgentYield);
                // This lowers the impact of resources on agents' speed - but need delay for 'followers' to get resources of their own.
//                    agent.setSpeed(Math.floor(Math.pow(this._perAgentYield, 0.5)));

                // Old way - yields are constant
                this._totalYield -= this._perAgentYield;
//                New way - yields decreases reflect upgrade and actual yield to the agent - but too hard
//                this._totalYield -= rawAdjustment;
            }
        }
    }
};

