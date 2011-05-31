
/* Agent type class definition */
function AgentType(name, color) {
    this._name = name;
    this._color = color;
    this._speed = MOVE_INCREMENTS;
    this._health = INITIAL_HEALTH;
    this._economicHealth = INITIAL_HEALTH;
    this._environmentalHealth = INITIAL_HEALTH;
    this._socialHealth = INITIAL_HEALTH;
    this._drawFunction;
}
AgentType.prototype.getName = function() { return this._name;}
AgentType.prototype.getColor = function() { return this._color;}
AgentType.prototype.getHealth = function() { return this._health; }
AgentType.prototype.getEconomicHealth = function() { return this._economicHealth; }
AgentType.prototype.getEnvironmentalHealth = function() { return this._environmentalHealth; }
AgentType.prototype.getSocialHealth = function() { return this._socialHealth; }
AgentType.prototype.getDrawFunction = function() { return this._drawFunction; }
AgentType.prototype.setDrawFunction = function(drawFunction) { this._drawFunction = drawFunction; }



/* Agent class definition */
function Agent(agentType, x, y) {
    this._agentType = agentType;
    this._color = agentType.getColor();
    this._x = x;
    this._y = y;
    this._history = new Array();
    var tmpX = -1, tmpY = -1;
    if (x == 0 || x == worldWidth - 1 || y == 0 || y == worldHeight - 1) {
        var tmpX = x, tmpY = y;
        if (x == 0)
            tmpX = -1;
        else if (x == worldWidth - 1)
            tmpX = worldWidth;
        else if (y == 0)
            tmpY = -1;
        else if (y == worldHeight - 1)
            tmpY = worldHeight;
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
    this._moves = 0;
    this._isHit = false;
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
Agent.prototype.getIsHit = function() { return this._isHit; }
Agent.prototype.setIsHit = function(isHit) { this._isHit = isHit; }
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
Agent.prototype.getMoves = function() { return this._moves; }
Agent.prototype.setMoves = function(moves) { this._moves = moves; }
Agent.prototype.incrementMoves = function() { this._moves++; }
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
