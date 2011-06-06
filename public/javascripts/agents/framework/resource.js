

/* ResourceKind class definition */
function ResourceKind(name, code, domain, cost, upgradeCost, totalYield, perAgentYield) {
    this._name = name;
    this._code = code;
    this._domain = domain;
    this._cost = cost;
    this._upgradeCost = upgradeCost;
    this._totalYield = totalYield;
    this._perAgentYield = perAgentYield;
    this._color = "000";
    if (domain == "eco") {
        this._color = "99ccff";
    }
    else if (domain == "env") {
        this._color = "00ff00";
    }
    else if (domain == "soc") {
        this._color = "ff3300";
    }
}
ResourceKind.prototype.getName = function() { return this._name; };
ResourceKind.prototype.setName = function(name) { this._name = name; };
ResourceKind.prototype.getCode = function() { return this._code; };
ResourceKind.prototype.setCode = function(code) { this._code = code; };
ResourceKind.prototype.getDomain = function() { return this._domain; };
ResourceKind.prototype.setDomain = function(domain) { this._domain = domain; };
ResourceKind.prototype.getCost = function() { return this._cost; };
ResourceKind.prototype.setCost = function(cost) { this._cost = cost; };
ResourceKind.prototype.getUpgradeCost = function() { return this._upgradeCost; };
ResourceKind.prototype.setUpgradeCost = function(upgradeCost) { this._upgradeCost = upgradeCost; };
ResourceKind.prototype.getPerAgentYield = function() { return this._perAgentYield; };
ResourceKind.prototype.setPerAgentYield = function(perAgentYield) { this._perAgentYield = perAgentYield; };
ResourceKind.prototype.getTotalYield = function() { return this._totalYield; };
ResourceKind.prototype.setTotalYield = function(totalYield) { this._totalYield = totalYield; };
ResourceKind.prototype.getColor = function() { return this._color; };
ResourceKind.prototype.setColor = function(color) { this._color = color; };


/* Resource class definition */
// Three types currently: soc, env, eco
function Resource(resourceName, resourceType, color) {
    // Kind properties
    this._resourceName = resourceName;
    this._resourceType = resourceType;
    this._color = color;
    this._initialTotalYield = 0;
    this._perAgentYield = 0;
    this._cost = 0;
    this._upgradeCost = 0;
    this._upgradeLevel = 1;
    this._kind = resolveResourceKind(resourceName);

    this._upgradeLevel = 1;
    this._totalYield = 0;
}
function Resource(resourceName, resourceType, color, x, y) {
    // Kind properties
    this._resourceName = resourceName;
    this._resourceType = resourceType;
    this._color = color;
    this._initialTotalYield = 0;
    this._perAgentYield = 0;
    this._cost = 0;
    this._upgradeCost = 0;
    this._kind = resolveResourceKind(resourceName);

    this._upgradeLevel = 1;
    this._totalYield = 0;
    this.setPosition(x, y);
}
function Resource(kind, x, y) {
    // Kind properties
    this._kind = kind;
    this._resourceName = kind.getCode();
    this._resourceType = kind.getDomain();
    this._color = kind.getColor();
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
Resource.prototype.getType = function() { return this._resourceType;};
Resource.prototype.getColor = function() { return this._color;};
Resource.prototype.getCost = function() { return this._cost; };
Resource.prototype.setCost = function(cost) { this._cost = cost; };
Resource.prototype.getUpgradeCost = function() { return this._upgradeCost; };
Resource.prototype.setUpgradeCost = function(upgradeCost) { this._upgradeCost = upgradeCost; };
Resource.prototype.getInitialTotalYield = function() { return this._initialTotalYield; };
Resource.prototype.setInitialTotalYield = function(initialTotalYield) { this._initialTotalYield = initialTotalYield; this._totalYield = initialTotalYield; };
Resource.prototype.getPerAgentYield = function() { return this._perAgentYield; };
Resource.prototype.setPerAgentYield = function(perAgentYield) { this._perAgentYield = perAgentYield; };
Resource.prototype.getKind = function() { return this._kind; };
Resource.prototype.setKind = function(resourceKind) { this._kind = resourceKind; };

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
Resource.prototype.provideYield = function(agent, resourceEffect, applyGeneralHealth) {
    if (this._totalYield > this._perAgentYield && agent.getHealth() < 100) {
        if (applyGeneralHealth) {
            var adjustment = this._perAgentYield * this._upgradeLevel * resourceEffect;
            agent.adjustHealth(adjustment);
            agent.setSpeed(this._perAgentYield);
            this._totalYield -= this._perAgentYield;
        }
        else {
            var adjustment = this._perAgentYield * this._upgradeLevel * 3 * resourceEffect;
            if (this._resourceType == "eco")
                agent.adjustEconomicHealth(adjustment);
            else if (this._resourceType == "env")
                agent.adjustEnvironmentalHealth(adjustment);
            else if (this._resourceType == "soc")
                agent.adjustSocialHealth(adjustment);
            agent.setSpeed(this._perAgentYield);
            this._totalYield -= this._perAgentYield;
        }
    }
};

