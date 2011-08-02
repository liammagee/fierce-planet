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
    this.name = name;
    this.code = code;
    this.color = color;
    this.types = [];
    this.evaluateOtherCategoryImpact = function(otherCategory) { return 1.0; };
}
ResourceCategory.prototype.addType = function(type) {
    // To by-pass circular references, clone the type added to the collection
    this.types.push(type.clone());
    type.category = this;
};
ResourceCategory.prototype.setEvaluateOtherCategoryImpact = function(f) {this.evaluateOtherCategoryImpact = f;};
ResourceCategory.prototype.doEvaluateOtherCategoryImpact = function(otherCategory) {return this.evaluateOtherCategoryImpact(otherCategory); };




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
    this.name = name;
    this.code = code;
    this.image = image;
    this.cost = cost;
    this.upgradeCost = upgradeCost;
    this.totalYield = totalYield;
    this.perAgentYield = perAgentYield;
}
/**
 * Returns clone of this resource type
 */
ResourceType.prototype.clone = function() {
    return new ResourceType(
            this.name,
            this.code,
            this.image,
            this.cost,
            this.upgradeCost,
            this.totalYield,
            this.perAgentYield);
};


/**
 * Resource class definition
 *
 * @constructor
 * @param type
 * @param x
 * @param y
 */
function Resource(type, x, y) {
    // Kind properties
    this.category = type.category;
    this.color = type.category.color;
    this.kind = type;
    this.resourceName = type.code;
    this.initialTotalYield = type.totalYield;
    this.perAgentYield = type.perAgentYield;
    this.cost = type.cost;
    this.upgradeCost = type.upgradeCost;

    this.totalYield = type.totalYield;
    this.upgradeLevel = 1;
    this.moveTo(x, y);
}
Resource.prototype.setInitialTotalYield = function(initialTotalYield) { 
    this.initialTotalYield = initialTotalYield; 
    this.totalYield = initialTotalYield; 
};
Resource.prototype.incrementTotalYield = function(totalYield) { this.totalYield++; };
Resource.prototype.getPosition = function() { return [this.x, this.y]; };
Resource.prototype.moveTo = function(x, y) { this.x =x; this.y = y; };
Resource.prototype.provideYield = function(agent, resourceEffect, adjustSpeedToYield) {
    if (this.totalYield > this.perAgentYield) {
        var adjustment = 0;
        if (World.settings.applyGeneralHealth) {
            // Don't be greedy - only yield a benefit if the agent needs it
            if (agent.health < 100) {
                adjustment = this.perAgentYield * this.upgradeLevel * resourceEffect;
                agent.adjustGeneralHealth(adjustment);
                if (adjustSpeedToYield && World.settings.agentsCanAdjustSpeed)
                    agent.speed = (this.perAgentYield);
                // This lowers the impact of resources on agents' speed - but need delay for 'followers' to get resources of their own.
//                    agent.setSpeed(Math.floor(Math.pow(this.perAgentYield, 0.5)));
                this.totalYield -= this.perAgentYield;
            }
        }
        else {
            if (agent.getHealthForResource(this) < 100) {
                var rawAdjustment = this.perAgentYield * this.upgradeLevel * World.resourceCategories.length;
                adjustment = rawAdjustment * resourceEffect;
                agent.adjustHealthForResource(adjustment, this);
                if (adjustSpeedToYield && World.settings.agentsCanAdjustSpeed)
                    agent.speed = (this.perAgentYield);
                // This lowers the impact of resources on agents' speed - but need delay for 'followers' to get resources of their own.
//                    agent.setSpeed(Math.floor(Math.pow(this.perAgentYield, 0.5)));

                if (World.settings.resourcesDiminishAtFixedRate) {
                    // Yields decreases reflect upgrade and actual yield to the agent - VERY HARD
                    this.totalYield -= rawAdjustment;
                }
                else {
                    // Yields are pegged to actual benefits supplied to agents
                    this.totalYield -= this.perAgentYield;
                }
            }
        }
    }
};

