
/* Agent type class definition */
function AgentType(name, color) {
    this._name = name;
    this._color = color;
    this._speed = MOVE_INCREMENTS;
    this._health = INITIAL_HEALTH;
    this._economicHealth = INITIAL_HEALTH;
    this._environmentalHealth = INITIAL_HEALTH;
    this._socialHealth = INITIAL_HEALTH;
    this._drawFunction = null;
}
AgentType.prototype.getName = function() { return this._name;};
AgentType.prototype.getColor = function() { return this._color;};
AgentType.prototype.getHealth = function() { return this._health; };
AgentType.prototype.getEconomicHealth = function() { return this._economicHealth; };
AgentType.prototype.getEnvironmentalHealth = function() { return this._environmentalHealth; };
AgentType.prototype.getSocialHealth = function() { return this._socialHealth; };
AgentType.prototype.getDrawFunction = function() { return this._drawFunction; };
AgentType.prototype.setDrawFunction = function(drawFunction) { this._drawFunction = drawFunction; };


/* Memory class definition */
function Memory(agent, age, x, y) {
    this._agent = agent;
    this._age = age;
    this._x = x;
    this._y = y;
    this._visits = 1;
    this._distanceFromLastUntriedPath = -1;
}
Memory.prototype.getAgent = function() { return this._agent; };
Memory.prototype.getAge = function() { return this._age; };
Memory.prototype.setAge = function(age) { this._age = age; };
Memory.prototype.getX = function() { return this._x; };
Memory.prototype.setX = function(x) { this._x = x; };
Memory.prototype.getY = function() { return this._y; };
Memory.prototype.setY = function(y) { this._y = y; };
Memory.prototype.getVisits = function() { return this._visits; };
Memory.prototype.setVisits = function(visits) { this._visits = visits; };
Memory.prototype.addVisit = function(agent, age) { this._agent = agent; this._age = age; this._visits++; };
Memory.prototype.getDistanceFromLastUntriedPath = function() { return this._distanceFromLastUntriedPath;  };
Memory.prototype.setDistanceFromLastUntriedPath = function(distanceFromLastUntriedPath) { this._distanceFromLastUntriedPath = distanceFromLastUntriedPath;  };

function MemoryOfAgent(agent, age, x, y, otherAgent) {
    this._agent = agent;
    this._age = age;
    this._x = x;
    this._y = y;
    this._visits = 1;
    this._otherAgent = otherAgent;
    this._distanceFromLastUntriedPath = -1;
}
MemoryOfAgent.prototype.getAgent = function() { return this._agent; };
MemoryOfAgent.prototype.getOtherAgent = function() { return this._otherAgent; };
MemoryOfAgent.prototype.getAge = function() { return this._age; };
MemoryOfAgent.prototype.setAge = function(age) { this._age = age; };
MemoryOfAgent.prototype.getX = function() { return this._x; };
MemoryOfAgent.prototype.setX = function(x) { this._x = x; };
MemoryOfAgent.prototype.getY = function() { return this._y; };
MemoryOfAgent.prototype.setY = function(y) { this._y = y; };
MemoryOfAgent.prototype.getVisits = function() { return this._visits; };
MemoryOfAgent.prototype.setVisits = function(visits) { this._visits = visits; };
MemoryOfAgent.prototype.addVisit = function(agent, age) { this._agent = agent; this._age = age; this._visits++; };
MemoryOfAgent.prototype.getDistanceFromLastUntriedPath = function() { return this._distanceFromLastUntriedPath;  };
MemoryOfAgent.prototype.setDistanceFromLastUntriedPath = function(distanceFromLastUntriedPath) { this._distanceFromLastUntriedPath = distanceFromLastUntriedPath;  };


/*
Agent class definition

Agents belong to a particular type.

They have a current location in a given level, and a history of prior locations.

They move at a given speed, and can 'wander' relative to the center of the tiles they occupy.

They have three kinds of 'health': economic, environmental and social. (These, possibly, should be translated into capabilities or something similar).
Without enough of any kind of health, they are unable to function, and die.

They have an internal representation of the 'world', established by:
 - preceding generations
 - experience
 - communication with other agents

*/
function Agent(level, agentType, x, y) {
    // General properties
    this._agentType = agentType;
    this._color = agentType.getColor();
    this._id = this.generateID();

    // Current age of the agent
    this._age = 0;

    // Position-related
    this._level = level;
    this._x = x;
    this._y = y;
    this._chronologicalMemory = new Array();
    this._memoriesOfPlacesVisited = new Array();
    this._memoriesOfPathsUntried = new Array();
    this._memoriesOfPlacesVisitedByOtherAgents = new Array();
    this._memoriesOfPathsUntriedByOtherAgents = new Array();
    this._memoriesOfResources = new Array();
    this._memoriesOfAgents = new Array();
    this._lastMemory = null;
    this._lastUntriedPathMemory = null;

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
        this.memorise(tmpX, tmpY);
    }
    else {
        this.memorise(x, y);
    }

    // Speed-related
    this._delay = 0;
    this._wanderX = 0;
    this._wanderY = 0;
    this._speed = MOVE_INCREMENTS;

    // Health related
    this._health = INITIAL_HEALTH;
    this._economicHealth = INITIAL_HEALTH;
    this._environmentalHealth = INITIAL_HEALTH;
    this._socialHealth = INITIAL_HEALTH;

    // Whether the agent is 'hit' by a conflicting agent
    this._isHit = false;

}
Agent.prototype.generateID = function() {
    return Math.floor(Math.random() * Math.pow(10, 10));
};
Agent.prototype.getID = function() { return this._id; };
Agent.prototype.getLevel = function() { return this._level; };
Agent.prototype.setLevel = function(level) { this._level = level; };
Agent.prototype.getPosition = function() { return [this._x, this._y]; };
Agent.prototype.setPosition = function(x, y) { this._x = x; this._y = y; };
Agent.prototype.lastPosition = function() { return this._lastMemory; };
Agent.prototype.getX = function() { return this._x; };
Agent.prototype.setX = function(x) { this._x = x; };
Agent.prototype.getY = function() { return this._y; };
Agent.prototype.setY = function(y) { this._y = y; };
Agent.prototype.getMemories = function() { return this._memoriesOfPlacesVisited; };
Agent.prototype.setMemories = function(memories) { this._memoriesOfPlacesVisited = memories; };
Agent.prototype.getType = function() { return this._agentType;};
Agent.prototype.getColor = function() { return this._color;};
Agent.prototype.getDelay = function() { return this._delay; };
Agent.prototype.setDelay = function(delay) { this._delay = delay; };
Agent.prototype.getHealth = function() { return this._health; };
Agent.prototype.setHealth = function(health) { this._health = health; };
Agent.prototype.getEconomicHealth = function() { return this._economicHealth; };
Agent.prototype.setEconomicHealth = function(economicHealth) { this._economicHealth = economicHealth; };
Agent.prototype.getEnvironmentalHealth = function() { return this._environmentalHealth; };
Agent.prototype.setEnvironmentalHealth = function(environmentalHealth) { this._environmentalHealth = environmentalHealth; };
Agent.prototype.getSocialHealth = function() { return this._socialHealth; };
Agent.prototype.setSocialHealth = function(socialHealth) { this._socialHealth = socialHealth; };
Agent.prototype.getIsHit = function() { return this._isHit; };
Agent.prototype.setIsHit = function(isHit) { this._isHit = isHit; };
Agent.prototype.adjustHealth = function(adjustment) {
    this._economicHealth = this.makeHealthAdjustment(this._economicHealth, adjustment);
    this._environmentalHealth = this.makeHealthAdjustment(this._environmentalHealth, adjustment);
    this._socialHealth = this.makeHealthAdjustment(this._socialHealth, adjustment);
    this.recalibrateOverallHealth();
};
Agent.prototype.adjustEconomicHealth = function(adjustment) {
    this._economicHealth = this.makeHealthAdjustment(this._economicHealth, adjustment);
    this.recalibrateOverallHealth();
};
Agent.prototype.adjustEnvironmentalHealth = function(adjustment) {
    this._environmentalHealth = this.makeHealthAdjustment(this._environmentalHealth, adjustment);
    this.recalibrateOverallHealth();
};
Agent.prototype.adjustSocialHealth = function(adjustment) {
    this._socialHealth = this.makeHealthAdjustment(this._socialHealth, adjustment);
    this.recalibrateOverallHealth();
};
Agent.prototype.makeHealthAdjustment = function(existingHealthValue, adjustment) {
    var newHealth = existingHealthValue + adjustment;
    if (newHealth > 0 && newHealth < INITIAL_HEALTH)
        return newHealth;
    else if (newHealth > 0)
        return INITIAL_HEALTH;
    else
        return 0;
};
Agent.prototype.recalibrateOverallHealth = function() {
    var overallHealth = Math.floor((this._economicHealth + this._environmentalHealth + this._socialHealth) / 3);
    // Set health to zero if any of the specific types of health are zero
    overallHealth = (this._economicHealth == 0 || this._environmentalHealth == 0 || this._socialHealth == 0) ? 0 : overallHealth;
    this._health = overallHealth;
};
Agent.prototype.getWanderX = function() { return this._wanderX; };
Agent.prototype.getWanderY = function() { return this._wanderY; };
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
};
Agent.prototype.getSpeed = function() { return this._speed; };
Agent.prototype.setSpeed = function(speed) { this._speed = speed; };
Agent.prototype.getMoves = function() { return this._age; };
Agent.prototype.setMoves = function(moves) { this._age = moves; };
Agent.prototype.incrementMoves = function() { this._age++; };
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
};

/**
 * Main method for evaluating and making moves
 * @param currentLevel
 * @param options
 */
Agent.prototype.evaluateMove = function(currentLevel, options) {
    var withNoRepeat = options["withNoRepeat"];
    var withNoCollision = options["withNoCollision"];

    var x = this.getX();
    var y = this.getY();
    var lastX = -1, lastY = -1;
    var p = this.lastPosition();
    if (p != undefined || (p[0] > -1 && p[1] > -1)) {
        lastX = p[0];
        lastY = p[1];
    }
    var position = this.findPosition(withNoRepeat, withNoCollision, currentLevel.getAllowOffscreenCycling());

    // Record current position in memory, before moving on
    this.memorise(x, y);

    // Set the position and add the move to the agent's memory
    this.setPosition(position[0], position[1]);
    this.incrementMoves();
};

Agent.prototype.memorise = function(x, y) {

    var memory = null;
    if (this._memoriesOfPlacesVisited[[x, y]] != undefined) {
        memory = this._memoriesOfPlacesVisited[[x, y]];
        memory.addVisit(this, this._age);
    }
    else {
        memory = new Memory(this, this._age, x, y);
        this._memoriesOfPlacesVisited[[x, y]] = memory;
    }
    if (this._memoriesOfPathsUntried[[x, y]] != undefined) {
        this._memoriesOfPathsUntried[[x, y]] = undefined;
//        console.log("Undefining untried path: " + [x, y]);
    }
    if (this._lastUntriedPathMemory != undefined)
        memory.setDistanceFromLastUntriedPath(this._age - this._lastUntriedPathMemory.getAge());
    this._lastMemory = memory;
    // Add to ordered memory
    this._chronologicalMemory[this._age] = memory;


    var resources = this._level.getResources();
    // Add neighbouring resources to memory
    for (var j = 0; j < resources.length; j++) {
        var resource = resources[j];
        var resourceX = resource.getX();
        var resourceY = resource.getY();
        // Is the resource next to our current position?
        var diffX = Math.abs(resourceX - x);
        var diffY = Math.abs(resourceY - y);
        var diff = diffX * diffY;
        if (diff <= 1) {
            // Add resource to memory
            this._memoriesOfResources[[x, y]] = resource;
        }
    }

    // Add any unvisited path cells to memory
    if (x - 1 >= 0 && this._level.getTile(x - 1, y) == undefined && this._memoriesOfPlacesVisited[[x - 1, y]] == undefined) {
        // Add path cell to memory
        this._lastUntriedPathMemory = new Memory(this, this._age, x - 1, y);
        this._memoriesOfPathsUntried[[x - 1, y]] = this._lastUntriedPathMemory;
//        console.log("Defining untried path: " + [x - 1, y]);
    }
    if (x + 1 < this._level.getWorldWidth() && this._level.getTile(x + 1, y) == undefined && this._memoriesOfPlacesVisited[[x + 1, y]] == undefined) {
        // Add path cell to memory
        this._lastUntriedPathMemory = new Memory(this, this._age, x + 1, y);
        this._memoriesOfPathsUntried[[x + 1, y]] = this._lastUntriedPathMemory;
//        console.log("Defining untried path: " + [x + 1, y]);
    }
    if (y - 1 >= 0 && this._level.getTile(x, y - 1) == undefined && this._memoriesOfPlacesVisited[[x, y - 1]] == undefined) {
        // Add path cell to memory
        this._lastUntriedPathMemory = new Memory(this, this._age, x, y - 1);
        this._memoriesOfPathsUntried[[x, y - 1]] = this._lastUntriedPathMemory;
//        console.log("Defining untried path: " + [x, y - 1]);
    }
    if (y + 1 < this._level.getWorldHeight() && this._level.getTile(x, y + 1) == undefined && this._memoriesOfPlacesVisited[[x, y + 1]] == undefined) {
        // Add path cell to memory
        this._lastUntriedPathMemory = new Memory(this, this._age, x, y + 1);
        this._memoriesOfPathsUntried[[x, y + 1]] = this._lastUntriedPathMemory;
//        console.log("Defining untried path: " + [x, y + 1]);
    }


    // Add agents on this tile to memory
    var agents = this._level.getCurrentAgents();
    for (var i = 0; i < agents.length; i++) {
        var agent = agents[i];
        if (agent._id == this._id)
            continue;
        var agentX = agent.getX();
        var agentY = agent.getY();
        if (agentX == x && agentY == y) {
            // Add agent to memory
            this._memoriesOfAgents[[x, y]] = new MemoryOfAgent(this, this._age, x, y, agent) ;
            this._memoriesOfPlacesVisitedByOtherAgents[agent] = agent._memoriesOfPlacesVisited;
            this._memoriesOfPathsUntriedByOtherAgents[agent] = agent._memoriesOfPathsUntried;
        }
    }

};

Agent.prototype.findPosition = function(withNoRepeat, withNoCollision, withOffscreenCycling) {
    var positionFound = false;
    var existingDirections = new Array();
    var x = this.getPosition()[0];
    var y = this.getPosition()[1];
    var newX = x;
    var newY = y;
    var lastX = this.lastPosition().getX();
    var lastY = this.lastPosition().getY();
    var candidateCells = new Array();
    var directions = this.randomDirectionOrder();
    for (var i = 0; i < directions.length; i++) {
        newX = x;
        newY = y;
        var dir = directions[i];

        var offScreen1 = 0;
        var offScreenWidth = this._level.getWorldWidth() - 1;
        var offScreenHeight = this._level.getWorldHeight() - 1;
        var offset = 1;
        var toContinue = false;
        switch (dir) {
            case 0:
                (newX == offScreen1 ? (withOffscreenCycling ? newX = offScreenWidth : toContinue = true) : newX = newX - offset);
                break;
            case 1:
                (newX == offScreenWidth ? (withOffscreenCycling ? newX = offScreen1 : toContinue = true) : newX = newX + offset);
                break;
            case 2:
                (newY == offScreen1 ? (withOffscreenCycling ? newY = offScreenHeight : toContinue = true) : newY = newY - offset);
                break;
            case 3:
                (newY == offScreenHeight ? (withOffscreenCycling ? newY = offScreen1 : toContinue = true) : newY = newY + offset);
                break;
        }
        if ((withNoRepeat && lastX == newX && lastY == newY) || toContinue) {
            continue;
        }
        if (currentLevel.getCell(newX, newY) == undefined) {
            candidateCells.push([newX, newY]);
        }
    }
    // Allow for back-tracking, if there is no way forward
    if (candidateCells.length == 0) {
        return [lastX, lastY];
    }


    // Here try to see if any agents encountered have zero unvisited cells in their memory, that the current agent also does not have in *its* memory.
    // If not, backtrack
    /*
    for (var k in this._memoriesOfPathsUntriedByOtherAgents) {

    }
    var agents = currentLevel.getCurrentAgents();
    var hasExhaustedAllPaths = false;
    for (var l = 0; l < agents.length; l++) {
        var agent = agents[l];
        if (agent._id == this._id)
            continue;
        if (agent._x == this._x && agent._y == this._y &&
                (agent.lastPosition().getX() != this.lastPosition().getX() || agent.lastPosition().getY() != this.lastPosition().getY())) {
            console.log("Meeting an agent, and comparing notes");
            for (var k in agent._memoriesOfPathsUntried) {
                var otherAgentMemory = agent._memoriesOfPathsUntried[k];
                if (otherAgentMemory == undefined)
                    continue;

                var ownAgentVisitedMemory = this._memoriesOfPlacesVisited[k];
                var ownAgentUnvisitedMemory = this._memoriesOfPathsUntried[k];

                if (ownAgentVisitedMemory == undefined && ownAgentUnvisitedMemory == undefined) {
                    this._memoriesOfPathsUntried[k] = new Memory(agent, otherAgentMemory.getAge(), otherAgentMemory.getX(), otherAgentMemory.getY());
//                    console.log("Adding unvisited memory: " + k);
                }
            }
            for (var k in agent._memoriesOfPlacesVisited) {
                var otherAgentMemory = agent._memoriesOfPlacesVisited[k];
                if (otherAgentMemory == undefined)
                    continue;

                var ownAgentVisitedMemory = this._memoriesOfPlacesVisited[k];
                var ownAgentUnvisitedMemory = this._memoriesOfPathsUntried[k];

                if (ownAgentVisitedMemory == undefined) {
                    this._memoriesOfPlacesVisited[k] = new Memory(agent, otherAgentMemory.getAge(), otherAgentMemory.getX(), otherAgentMemory.getY());
//                    console.log("Adding visited memory: " + k);
                }
                if (ownAgentUnvisitedMemory != undefined) {
                    this._memoriesOfPathsUntried[k] = undefined;
                }
            }
        }
    }
    */


    // Find the first candidate which is either the goal, or not in the history.
    var candidatesNotInHistory = new Array();
    for (var i = 0; i < candidateCells.length; i++) {
        var candidate = candidateCells[i];
        if (currentLevel.isExitPoint(candidate[0], candidate[1]))
            return candidate;


        if (this._memoriesOfPlacesVisited[candidate] == undefined) {
            var placeVisitedByOtherAgents = false;
            for (var agent in this._memoriesOfPlacesVisitedByOtherAgents) {
                var agentMemoryOfPlacesVisited = this._memoriesOfPlacesVisitedByOtherAgents[agent];
                if (agentMemoryOfPlacesVisited[candidate] != undefined) {
//                    placeVisitedByOtherAgents = true;
                }
            }
            if (!placeVisitedByOtherAgents) {
                //console.log("Neither this agent nor its friends have been here: " + candidate);
                candidatesNotInHistory.push(candidate);

            }
        }

    }

    // Try to find a neighbouring resource, if it exists
    if (candidatesNotInHistory.length > 0) {
        var bestCandidate = candidatesNotInHistory[0];
        for (var i = 0; i < candidatesNotInHistory.length; i++) {
            var candidate = candidatesNotInHistory[i];
            var neighbour = this.hasNeighbouringResources(candidate[0], candidate[1]);
            if (neighbour != null) {
                bestCandidate = candidate;
                break;
            }
        }
        return bestCandidate;
    }


    // But first add back the last visited cell as a candidate - it might be the best option
    candidateCells.push([lastX, lastY]);
    if (candidateCells.length > 1) {
        // Try to head in a direction where an unvisited tile can be found

        var shortestAgeDifference = -1;
        var bestCandidate = candidateCells[0];
        for (var i = 0; i < candidateCells.length; i++) {
            var candidate = candidateCells[i];
            var mostRecentMemoryOfCandidate = this._memoriesOfPlacesVisited[candidate];
            if (mostRecentMemoryOfCandidate == undefined)
                continue;
            var age = mostRecentMemoryOfCandidate.getAge();

            var shortestAgeDifferenceToCandidate = -1;
            var counter = 0;
            var counterUndefined = 0;
            for (var j in this._memoriesOfPathsUntried) {
                var unvisited = this._memoriesOfPathsUntried[j];
                if (unvisited != undefined) {
                    var inOtherAgentsMemory = false;
                    for (var agent in this._memoriesOfPlacesVisitedByOtherAgents) {
                        var agentMemoryOfPlacesVisited = this._memoriesOfPlacesVisitedByOtherAgents[agent];
                        var ageMet = -1;
                        for (var k in this._memoriesOfAgents) {
                            var otherAgentMemory = this._memoriesOfAgents[k];
                            if (otherAgentMemory.getOtherAgent()._id == agent._id)
                                ageMet = otherAgentMemory.getAge();
                        }
                        if (ageMet == -1)
                            continue;
                        if (agentMemoryOfPlacesVisited[candidate] != undefined && ageMet > agentMemoryOfPlacesVisited[candidate].getAge()) {
                            inOtherAgentsMemory = true;
                            break;
                        }
                    }
                    if (! inOtherAgentsMemory) {
                        var unvisistedAge = unvisited.getAge();
                        var diff = Math.abs(age - unvisistedAge);
                        if (shortestAgeDifferenceToCandidate == -1 || diff < shortestAgeDifferenceToCandidate) {
                            shortestAgeDifferenceToCandidate = diff;
                        }
                    }
                }
                counter++;
            }
            for (var agent in this._memoriesOfPlacesVisitedByOtherAgents) {
                var memoryOfThisAgentAge = -1;
                for (var k in this._memoriesOfAgents) {
                    var otherAgentMemory = this._memoriesOfAgents[k];
                    if (otherAgentMemory.getOtherAgent()._id == agent._id)
                        memoryOfThisAgentAge = otherAgentMemory.getAge();
                }
                if (memoryOfThisAgentAge == -1)
                    continue;
                var agentMemoryOfPlacesVisited = this._memoriesOfPlacesVisitedByOtherAgents[agent];
                var agentMemoryOfPathsUntried = this._memoriesOfPathsUntriedByOtherAgents[agent];
                if (agentMemoryOfPathsUntried != undefined) {
                    if (agentMemoryOfPlacesVisited != undefined && agentMemoryOfPlacesVisited[candidate] != undefined) {
                        var mostRecentMemoryOfCandidateByAgent = agentMemoryOfPlacesVisited[candidate];
                        var ageOfOtherAgentMemory = mostRecentMemoryOfCandidateByAgent.getAge();
                        if (ageOfOtherAgentMemory > memoryOfThisAgentAge)
                            continue;

                        for (var j in agentMemoryOfPathsUntried) {
                            var agentUnvisitedMemory = agentMemoryOfPathsUntried[j];
                            if (agentUnvisitedMemory != undefined && agentUnvisitedMemory.getAge() < memoryOfThisAgentAge) {
                                if (this._memoriesOfPlacesVisited[j] == undefined) {
                                    var unvisitedAge = agentUnvisitedMemory.getAge();
                                    var diff = Math.abs(ageOfOtherAgentMemory - unvisitedAge);
                                    if (shortestAgeDifferenceToCandidate == -1 || diff < shortestAgeDifferenceToCandidate) {
                                        shortestAgeDifferenceToCandidate = diff;
                                    }
                                }

                            }
                        }
                        */
                    }
                }
            }
            */

            // Simplified variant

            if (shortestAgeDifferenceToCandidate > -1 && (shortestAgeDifference == -1 || shortestAgeDifferenceToCandidate < shortestAgeDifference)) {
                shortestAgeDifference = shortestAgeDifferenceToCandidate;
                bestCandidate = candidate;
            }
        }

        // Now try the oldest candidate
        if (shortestAgeDifference == -1) {
            var ageInMemory = -1;
            for (var i = 1; i < candidateCells.length; i++) {
                var candidate = candidateCells[i];

                var mostRecentMemoryOfCandidate = this._memoriesOfPlacesVisited[candidate];

                if (mostRecentMemoryOfCandidate != undefined && (ageInMemory == -1 || mostRecentMemoryOfCandidate.getAge() < ageInMemory)) {
                    ageInMemory = mostRecentMemoryOfCandidate;
                    bestCandidate = candidate;
                }
            }
        }
        // TODO: Revisit this logic
        /*
        var neighbour = this.hasNeighbouringResources(candidate[0], candidate[1]);
        if (neighbour != null) {
            bestCandidate = candidate;
            break;
        }
        */
        return bestCandidate;
    }


    // Allow for movement off-screen, if no other option is available
    if (withOffscreenCycling) {
        if (x == offScreenWidth || x == offScreen1 || y == offScreenHeight || y == offScreen1) {
            if (x == offScreenWidth) {
                newX = offScreenWidth + 1;
            }
            else if (x == offScreen1) {
                newX = offScreen1 - 1;
            }
            else if (y == offScreenHeight) {
                newY = offScreenHeight + 1;
            }
            else if (y == offScreen1) {
                newY = offScreen1 - 1;
            }
            return [newX, newY];
        }
    }


    // Use the first NON-candidate cell to use if no candidate is found
    return candidateCells[0];
};

Agent.prototype.getClosestUnvisitedTile = function(currentX, currentY) {
    for (var unvisited in this._memoriesOfPathsUntried) {
        var memory = this._chronologicalMemory[unvisited.getAge()];
        if (memory != undefined) {
        }
    }
    var foundMemory = null;
    var foundMemoryPosition = -1;
    for (var i = 0; i < this._memoriesOfPlacesVisited.length; i++) {
        var memory = this._memoriesOfPlacesVisited[i];
        if (memory.getX() == targetX && memory.getY() == targetY) {
            foundMemory = memory;
            foundMemoryPosition = i;
        }
    }
    var limit =  (foundMemoryPosition > this._memoriesOfPlacesVisited.length / 2 ? foundMemoryPosition : this._memoriesOfPlacesVisited.length - foundMemoryPosition);

    for (var i = 1; i < limit; i++) {
        var memoryBelow, memoryAbove;
        if (foundMemoryPosition - i >= 0)
            memoryBelow = this._memoriesOfPlacesVisited[foundMemoryPosition - i];
        if (foundMemoryPosition - i >= 0)
            memoryAbove = this._memoriesOfPlacesVisited[foundMemoryPosition + i];
        if (memory.getX() == targetX && memory.getY() == targetY) {
            foundMemory = memory;
            foundMemoryPosition = i;
        }
    }

};


Agent.prototype.randomDirectionOrder = function() {
    var directions = new Array();
    var orderedDirections = [0, 1, 2, 3];
    var odl = orderedDirections.length;
    for (var i = 0; i < odl; i++) {
        var obj = directions[i];
        var remainingLength = orderedDirections.length;
        var pos = Math.floor(Math.random() * remainingLength);
        directions.push(orderedDirections[pos]);
        orderedDirections.splice(pos, 1);
    }
    return directions;
};

Agent.prototype.hasNeighbouringResources = function(x, y) {
    for (var j = 0; j < currentLevel.getResources().length; j++) {
        var p = currentLevel.getResources()[j];
        var px = p.getX();
        var py = p.getY();
        if (Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1) {
            // Add hook here for evaluating relative health of neighbouring resources
//            var h = p.getHealth();
            return p;
        }
    }
    return null;
};



