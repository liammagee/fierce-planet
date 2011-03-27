

/* Class definitions */


/* Tile class definition */
function Level(id) {
    this._id = id;
    this._name = name;
    this._initialAgentNumber = 1;
    this._initialAgentX = 0;
    this._initialAgentY = 0;
    this._worldSize = 11;
    this._worldWidth = 11;
    this._worldHeight = 11;
    this._waveNumber = 10;
    this._expiryLimit = 20;
    this._goalX = 0;
    this._goalY = 0;
    this._initialResourceStore = 100;
    this._allowOffscreenCycling = false;
    this._allowResouresOnPath = false;
    this._notice = "";
    this._image;
    this._soundSrc;
    this._tiles;
}
Level.prototype.getId = function() { return this._id; }
Level.prototype.setId = function(id) { this._id = id; }
Level.prototype.getName = function() { return this._name; }
Level.prototype.setName = function(name) { this._name = name; }
Level.prototype.getInitialAgentNumber = function() { return this._initialAgentNumber; }
Level.prototype.setInitialAgentNumber = function(initialAgentNumber) { this._initialAgentNumber = initialAgentNumber; }
Level.prototype.getInitialAgentX = function() { return this._initialAgentX; }
Level.prototype.setInitialAgentX = function(initialAgentX) { this._initialAgentX = initialAgentX; }
Level.prototype.getInitialAgentY = function() { return this._initialAgentY; }
Level.prototype.setInitialAgentY = function(initialAgentY) { this._initialAgentY = initialAgentY; }
Level.prototype.getInitialResourceStore = function() { return this._initialResourceStore; }
Level.prototype.setInitialResourceStore = function(initialResourceStore) { this._initialResourceStore = initialResourceStore; }
Level.prototype.getWorldSize = function() { return this._worldSize; }
Level.prototype.setWorldSize = function(worldSize) { this._worldSize = worldSize; this.setWorldWidth(worldSize); this.setWorldHeight(worldSize);  }
Level.prototype.getWorldWidth = function() { return this._worldWidth; }
Level.prototype.setWorldWidth = function(worldWidth) { this._worldWidth = worldWidth; }
Level.prototype.getWorldHeight = function() { return this._worldHeight; }
Level.prototype.setWorldHeight = function(worldHeight) { this._worldHeight = worldHeight; }
Level.prototype.getWaveNumber = function() { return this._waveNumber; }
Level.prototype.setWaveNumber = function(waveNumber) { this._waveNumber = waveNumber; }
Level.prototype.getExpiryLimit = function() { return this._expiryLimit; }
Level.prototype.setExpiryLimit = function(expiryLimit) { this._expiryLimit = expiryLimit; }
Level.prototype.getGoalX = function() { return this._goalX; }
Level.prototype.setGoalX = function(goalX) { this._goalX = goalX; }
Level.prototype.getGoalY = function() { return this._goalY; }
Level.prototype.setGoalY = function(goalY) { this._goalY = goalY; }
Level.prototype.getAllowOffscreenCycling = function() { return this._allowOffscreenCycling; }
Level.prototype.setAllowOffscreenCycling = function(allowOffscreenCycling) { this._allowOffscreenCycling = allowOffscreenCycling; }
Level.prototype.getAllowResourcesOnPath = function() { return this._allowResouresOnPath; }
Level.prototype.setAllowResourcesOnPath = function(allowResourcesOnPath) { this._allowResouresOnPath = allowResourcesOnPath; }
Level.prototype.getNotice = function() { return this._notice; }
Level.prototype.setNotice = function(notice) { this._notice = notice; }
Level.prototype.getImage = function() { return this._image; }
Level.prototype.setImage = function(imageSrc) { this._image = new Image();  this._image.src = imageSrc; }
Level.prototype.getSoundSrc = function() { return this._soundSrc; }
Level.prototype.setSoundSrc = function(soundSrc) { this._soundSrc = soundSrc; }
Level.prototype.getTiles = function() { return this._tiles; }
Level.prototype.setTiles = function(tiles) { this._tiles = tiles; }



/* Agent class definition */
function Agent(agentType, color, x, y) {
    this._agentType = agentType;
    this._color = color;
    this._x = x;
    this._y = y;
    this._history = new Array();
    var tmpX = -1, tmpY = -1;
    if (x == 0 || x == worldSize - 1 || y == 0 || y == worldSize - 1) {
        var tmpX = x, tmpY = y;
        if (x == 0)
            tmpX = -1;
        else if (x == worldSize - 1)
            tmpX = worldSize;
        else if (y == 0)
            tmpY = -1;
        else if (y == worldSize - 1)
            tmpY = worldSize;
        this._history.push([tmpX, tmpY]);
    }
    else {
        this._history.push([x, y]);
    }
    this._delay = 0;
    this._wanderX = 0;
    this._wanderY = 0;
    this._speed = MOVE_INCREMENTS;
    this._health = INITIAL_HEALTH;
    this._economicHealth = INITIAL_HEALTH;
    this._environmentalHealth = INITIAL_HEALTH;
    this._socialHealth = INITIAL_HEALTH;
}
Agent.prototype.getPosition = function() { return [this._x, this._y]; }
Agent.prototype.setPosition = function(x, y) { this._history.push([this._x, this._y]); this._x =x; this._y = y; }
Agent.prototype.lastPosition = function() { return this._history[this._history.length - 1]; }
Agent.prototype.getX = function() { return this._x; }
Agent.prototype.setX = function(x) { this._x = x; }
Agent.prototype.getY = function() { return this._y; }
Agent.prototype.setY = function(y) { this._y = y; }
Agent.prototype.getHistory = function() { return this._history; }
Agent.prototype.setHistory = function(history) { this._history = history; } 
Agent.prototype.getType = function() { return this._agentType;}
Agent.prototype.getColor = function() { return this._color;}
Agent.prototype.getDelay = function() { return this._delay; }
Agent.prototype.setDelay = function(delay) { this._delay = delay; }
Agent.prototype.getHealth = function() { return this._health; }
Agent.prototype.setHealth = function(health) { this._health = health; }
Agent.prototype.getEconomicHealth = function() { return this._economicHealth; }
Agent.prototype.setEconomicHealth = function(economicHealth) { this._economicHealth = economicHealth; }
Agent.prototype.getEnvironmentalHealth = function() { return this._environmentalHealth; }
Agent.prototype.setEnvironmentalHealth = function(environmentalHealth) { this._environmentalHealth = environmentalHealth; }
Agent.prototype.getSocialHealth = function() { return this._socialHealth; }
Agent.prototype.setSocialHealth = function(socialHealth) { this._socialHealth = socialHealth; }
Agent.prototype.adjustHealth = function(adjustment) {
    this._economicHealth = this.makeHealthAdjustment(this._economicHealth, adjustment);
    this._environmentalHealth = this.makeHealthAdjustment(this._environmentalHealth, adjustment);
    this._socialHealth = this.makeHealthAdjustment(this._socialHealth, adjustment);
    this.recalibrateOverallHealth();
}
Agent.prototype.adjustEconomicHealth = function(adjustment) {
    this._economicHealth = this.makeHealthAdjustment(this._economicHealth, adjustment);
    this.recalibrateOverallHealth();
}
Agent.prototype.adjustEnvironmentalHealth = function(adjustment) {
    this._environmentalHealth = this.makeHealthAdjustment(this._environmentalHealth, adjustment);
    this.recalibrateOverallHealth();
}
Agent.prototype.adjustSocialHealth = function(adjustment) {
    this._socialHealth = this.makeHealthAdjustment(this._socialHealth, adjustment);
    this.recalibrateOverallHealth();
}
Agent.prototype.makeHealthAdjustment = function(existingHealthValue, adjustment) {
    var newHealth = existingHealthValue + adjustment;
    if (newHealth > 0 && newHealth < INITIAL_HEALTH)
        return newHealth;
    else if (newHealth > 0)
        return INITIAL_HEALTH;
    else
        return 0;
}
Agent.prototype.recalibrateOverallHealth = function() {
    var overallHealth = Math.floor((this._economicHealth + this._environmentalHealth + this._socialHealth) / 3);
    // Set health to zero if any of the specific types of health are zero
    overallHealth = (this._economicHealth == 0 || this._environmentalHealth == 0 || this._socialHealth == 0) ? 0 : overallHealth;
    this._health = overallHealth;
}
Agent.prototype.getWanderX = function() { return this._wanderX; }
Agent.prototype.getWanderY = function() { return this._wanderY; }
Agent.prototype.adjustWander = function() {
    var wx = this._wanderX;
    var wy = this._wanderY;
    var limit = cellWidth / 2 - pieceWidth / 2;
    var rx = Math.floor(Math.random() * 3 - 1);
    var ry = Math.floor(Math.random() * 3 - 1);
    wx = wx + rx;
    wy = wy + ry;

    if (limit - Math.abs(wx) >= 0)
        this._wanderX = wx;

    if (limit - Math.abs(wy) >= 0)
        this._wanderY = wy;
}
Agent.prototype.getSpeed = function() { return this._speed; }
Agent.prototype.setSpeed = function(speed) { this._speed = speed; }
/* Change the speed, but sparingly as the speed moves away from the standard speed: MOVE_INCREMENTS */
Agent.prototype.adjustSpeed = function() {
    var tmpSpeed = this._speed;
    var variance = this._speed - MOVE_INCREMENTS;

    // Makes movement away from MOVE_INCREMENTS very unlikely
//    var prob = Math.pow(Math.abs(variance), Math.abs(variance));
    // Makes movement away from MOVE_INCREMENTS unlikely
    var prob = Math.pow(Math.abs(variance) + 1, 2);
//    Makes movement away from MOVE_INCREMENTS moderately likely
//    var prob = Math.abs(variance);
    // Makes movement away from MOVE_INCREMENTS an even chance
//    var prob = 1;
//    prob = (prob == 0 ? 1 : prob);

    var r = Math.floor(Math.random() * 3 * prob - 1);
    // Set the speed to above, equal or below the current speed
    var change = (r < 0 ? -1 : (r > 0 ? 1 : 0));
    // Change direction if the speed is already negative
    change = (variance > 0 ? -change : change);

    // Add a multiplier to the change
//    var multiplier = Math.ceil(Math.random() * 3);
    var multiplier = 1;

    var s = this._speed;

    tmpSpeed = this._speed + change * multiplier;

    if (tmpSpeed > 0)
        this._speed = tmpSpeed;
}


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
ResourceKind.prototype.getName = function() { return this._name; }
ResourceKind.prototype.setName = function(name) { this._name = name; }
ResourceKind.prototype.getCode = function() { return this._code; }
ResourceKind.prototype.setCode = function(code) { this._code = code; }
ResourceKind.prototype.getDomain = function() { return this._domain; }
ResourceKind.prototype.setDomain = function(domain) { this._domain = domain; }
ResourceKind.prototype.getCost = function() { return this._cost; }
ResourceKind.prototype.setCost = function(cost) { this._cost = cost; }
ResourceKind.prototype.getUpgradeCost = function() { return this._upgradeCost; }
ResourceKind.prototype.setUpgradeCost = function(upgradeCost) { this._upgradeCost = upgradeCost; }
ResourceKind.prototype.getPerAgentYield = function() { return this._perAgentYield; }
ResourceKind.prototype.setPerAgentYield = function(perAgentYield) { this._perAgentYield = perAgentYield; }
ResourceKind.prototype.getTotalYield = function() { return this._totalYield; }
ResourceKind.prototype.setTotalYield = function(totalYield) { this._totalYield = totalYield; }
ResourceKind.prototype.getColor = function() { return this._color; }
ResourceKind.prototype.setColor = function(color) { this._color = color; }


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
Resource.prototype.getName = function() { return this._resourceName; }
Resource.prototype.getType = function() { return this._resourceType;}
Resource.prototype.getColor = function() { return this._color;}
Resource.prototype.getCost = function() { return this._cost; }
Resource.prototype.setCost = function(cost) { this._cost = cost; }
Resource.prototype.getUpgradeCost = function() { return this._upgradeCost; }
Resource.prototype.setUpgradeCost = function(upgradeCost) { this._upgradeCost = upgradeCost; }
Resource.prototype.getInitialTotalYield = function() { return this._initialTotalYield; }
Resource.prototype.setInitialTotalYield = function(initialTotalYield) { this._initialTotalYield = initialTotalYield; this._totalYield = initialTotalYield; }
Resource.prototype.getPerAgentYield = function() { return this._perAgentYield; }
Resource.prototype.setPerAgentYield = function(perAgentYield) { this._perAgentYield = perAgentYield; }
Resource.prototype.getKind = function() { return this._kind; }
Resource.prototype.setKind = function(resourceKind) { this._kind = resourceKind; }

Resource.prototype.getUpgradeLevel = function() { return this._upgradeLevel; }
Resource.prototype.setUpgradeLevel = function(upgradeLevel) { this._upgradeLevel = upgradeLevel; }
Resource.prototype.getTotalYield = function() { return this._totalYield; }
Resource.prototype.setTotalYield = function(totalYield) { this._totalYield = totalYield; }
Resource.prototype.getPosition = function() { return [this._x, this._y]; }
Resource.prototype.setPosition = function(x, y) { this._x =x; this._y = y; }
Resource.prototype.getX = function() { return this._x; }
Resource.prototype.setX = function(x) { this._x = x; }
Resource.prototype.getY = function() { return this._y; }
Resource.prototype.setY = function(y) { this._y = y; }
Resource.prototype.provideYield = function(agent, resourceEffect) {
    if (this._totalYield > this._perAgentYield && agent.getHealth() < 100) {
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




/* Tile class definition */
function Tile(color) {
    this._color = color;
}
function Tile(color, x, y) {
    this._color = color;
    this._x = x;
    this._y = y;
}
Tile.prototype.getColor = function() { return this._color;}
Tile.prototype.getPosition = function() { return [this._x, this._y]; }
Tile.prototype.setPosition = function(x, y) { this._x =x; this._y = y; }
Tile.prototype.getX = function() { return this._x; }
Tile.prototype.setX = function(x) { this._x = x; }
Tile.prototype.getY = function() { return this._y; }
Tile.prototype.setY = function(y) { this._y = y; }



/* Player Class class definition */
function PlayerClass(name, savesRequired) {
    this._name = name;
    this._savesRequired = savesRequired;
}
PlayerClass.prototype.getName = function() { return this._name; }
PlayerClass.prototype.setName = function(name) { this._name = name; }
PlayerClass.prototype.getSavesRequired = function() { return this._savesRequired; }
PlayerClass.prototype.setSavesRequired = function(savesRequired) { this._savesRequired = savesRequired; }
