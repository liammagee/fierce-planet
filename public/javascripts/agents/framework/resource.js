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
}
ResourceCategory.prototype.getColor = function() { return this._color; };
ResourceCategory.prototype.setColor = function(color) { this._color = color; };
ResourceCategory.prototype.getName = function() { return this._name; };
ResourceCategory.prototype.setName = function(name) { this._name = name; };
ResourceCategory.prototype.getCode = function() { return this._code; };
ResourceCategory.prototype.setCode = function(code) { this._code = code; };

/**
 * ResourceKind class definition
 * 
 * @constructor
 * @param name
 * @param code
 * @param domain
 * @param cost
 * @param upgradeCost
 * @param totalYield
 * @param perAgentYield
 */
function ResourceKind(category, name, code, cost, upgradeCost, totalYield, perAgentYield) {
    this._category = category;
    this._name = name;
    this._code = code;
    this._cost = cost;
    this._upgradeCost = upgradeCost;
    this._totalYield = totalYield;
    this._perAgentYield = perAgentYield;
}
ResourceKind.prototype.getName = function() { return this._name; };
ResourceKind.prototype.setName = function(name) { this._name = name; };
ResourceKind.prototype.getCode = function() { return this._code; };
ResourceKind.prototype.setCode = function(code) { this._code = code; };
ResourceKind.prototype.getCategory = function() { return this._category; };
ResourceKind.prototype.setCategory = function(category) { this._category = category;};
ResourceKind.prototype.getCost = function() { return this._cost; };
ResourceKind.prototype.setCost = function(cost) { this._cost = cost; };
ResourceKind.prototype.getUpgradeCost = function() { return this._upgradeCost; };
ResourceKind.prototype.setUpgradeCost = function(upgradeCost) { this._upgradeCost = upgradeCost; };
ResourceKind.prototype.getPerAgentYield = function() { return this._perAgentYield; };
ResourceKind.prototype.setPerAgentYield = function(perAgentYield) { this._perAgentYield = perAgentYield; };
ResourceKind.prototype.getTotalYield = function() { return this._totalYield; };
ResourceKind.prototype.setTotalYield = function(totalYield) { this._totalYield = totalYield; };


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
Resource.prototype.provideYield = function(agent, resourceEffect) {
    if (this._totalYield > this._perAgentYield && agent.getHealth() < 100) {
        if (FiercePlanet.applyGeneralHealth) {
            var adjustment = this._perAgentYield * this._upgradeLevel * resourceEffect;
            agent.adjustHealth(adjustment);
            agent.setSpeed(this._perAgentYield);
            this._totalYield -= this._perAgentYield;
        }
        else {
            var adjustment = this._perAgentYield * this._upgradeLevel * 3 * resourceEffect;
            agent.adjustHealthForResource(adjustment, this);
//            if (this._resourceCategory.getCode() == "eco")
//                agent.adjustEconomicHealth(adjustment);
//            else if (this._resourceCategory.getCode() == "env")
//                agent.adjustEnvironmentalHealth(adjustment);
//            else if (this._resourceCategory.getCode() == "soc")
//                agent.adjustSocialHealth(adjustment);
            agent.setSpeed(this._perAgentYield);
            this._totalYield -= this._perAgentYield;
        }
    }
};

