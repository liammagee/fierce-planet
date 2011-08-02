/*!
 * Fierce Planet - Agent
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/**
 * Agent constants
 */
var INITIAL_HEALTH = 100;
var DEFAULT_SPEED = 5;

var VERY_UNLIKELY = 0;
var UNLIKELY = 1;
var MODERATELY_LIKELY = 2;
var EVEN_CHANCE = 3;
var PROBABILITY_STRATEGY_TO_DEVIATE = UNLIKELY;


/**
 * Defines the type of an agent.
 * The type includes the name, color, initial health, default speed and the drawing function of an agent. 
 *
 * @constructor
 * @param name
 * @param color
 */
function AgentType(name, color, healthCategories, speed, health, drawFunction) {
    this.name = name;
    this.color = color;
    this.healthCategories = healthCategories || [];
    this.speed = speed || DEFAULT_SPEED;
    this.health = health || INITIAL_HEALTH;
    this.isHitable = false;
    this.canHit = false;
    this.drawFunction = drawFunction || function(){};
}



/**
 * Models the memory of an agent of a location it has visited.
 *
 * @constructor
 * @param agentID
 * @param age
 * @param x
 * @param y
 */
function Memory(agentID, age, x, y) {
    this.agentID = agentID;
    this.age = age;
    this.mostRecentVisit = age;
    this.visits = 1;
    this.x = x;
    this.y = y;
    this.distanceFromLastUntriedPath = -1;
}
Memory.prototype.addVisit = function(agentID, age) {
    this.agentID = agentID;
    this.mostRecentVisit = age;
    this.visits++;
};
//Memory.prototype.getAgentID = function() { return this.agentID; };
//Memory.prototype.getAge = function() { return this.age; };
//Memory.prototype.setAge = function(age) { this.age = age; };
//Memory.prototype.getX = function() { return this.x; };
//Memory.prototype.setX = function(x) { this.x = x; };
//Memory.prototype.getY = function() { return this.y; };
//Memory.prototype.setY = function(y) { this.y = y; };
//Memory.prototype.getVisits = function() { return this.visits; };
//Memory.prototype.setVisits = function(visits) { this.visits = visits; };
//Memory.prototype.getMostRecentVisit = function() { return this.mostRecentVisit; };
//Memory.prototype.setMostRecentVisit = function(mostRecentVisit) { this.mostRecentVisit = mostRecentVisit; };
//Memory.prototype.getDistanceFromLastUntriedPath = function() { return this.distanceFromLastUntriedPath;  };
//Memory.prototype.setDistanceFromLastUntriedPath = function(distanceFromLastUntriedPath) { this.distanceFromLastUntriedPath = distanceFromLastUntriedPath;  };


MemoryOfAgent.prototype = new Memory();
MemoryOfAgent.prototype.constructor = MemoryOfAgent;
/**
 * Models the memory one agent has of another.
 *
 * @constructor
 * @param agentID
 * @param age
 * @param x
 * @param y
 * @param otherAgentID
 */
function MemoryOfAgent(agentID, age, x, y, otherAgentID) {
    this.agentID = agentID;
    this.age = age;
    this.x = x;
    this.y = y;
    this.visits = 1;
    this.otherAgentID = otherAgentID;
    this.distanceFromLastUntriedPath = -1;
}




/**
<div>Defines the agent - the core class of the agent modelling system.</div>
<div>Agents have the following properties:
<ul>
    <li>They to a particular type.</li>
     <li>They have a current location in a given level, and a history of prior locations.</li>
     <li>They move at a given speed, and can 'wander' relative to the center of the tiles they occupy.</li>
     <li>They can have multiple kinds of 'health' or 'capabilities': for example, economic, environmental and social.</li>
     <li>Without enough of any kind of health, they are unable to function, and die.</li>
     <li>They have an internal representation of the 'world', established by:</li>
     <ul>
             <li>preceding generations</li>
             <li>experience</li>
             <li>communication with other agents</li>
     </ul>
</ul>
</div>

 * @constructor
 * @param agentType
 * @param x
 * @param y
 */
function Agent(agentType, x, y) {
    // Private field and methods

    /**
     * Generates a random ID.
     */
    var generateID = function() {
        return Math.floor(Math.random() * Math.pow(10, 10));
    };
    


    // Privileged fields and methods
    this.id = generateID();
    this.agentType = agentType;
    this.color = agentType.color;

    // Current age of the agent
    this.age = 0;

    // Position-related
    this.x = x;
    this.y = y;
    this.chronologicalMemory = [];
    this.memoriesOfPlacesVisited = [];
    this.memoriesOfPathsUntried = [];
    this.canCommunicateWithOtherAgents = true;
    this.memoriesOfPlacesVisitedByOtherAgents = [];
    this.memoriesOfPathsUntriedByOtherAgents = [];
    this.memoriesOfResources = [];
    this.memoriesOfAgents = [];
    this.lastMemory = null;
    this.lastUntriedPathMemory = null;

    this.memorise(undefined);

    // Speed-related
    this.delay = 0;
    this.wanderX = 0;
    this.wanderY = 0;
    this.speed = DEFAULT_SPEED;
    this.countdownToMove = 0;

    // Health related
    this.health = INITIAL_HEALTH;
    this.healthCategoryStats = {};
    this.registerHealthStats();

    // Whether the agent is 'hit' by a conflicting agent
    this.isHit = false;

    // IMPORTED ABM FEATURES - EXPERIMENTAL
    /* Gender: UNSPECIFIED: 0, MALE: -1; FEMALE:1 */
    this.gender = 0;
    this.culture = null;
    this.dateOfBirth = null;
    this.dateOfDeath = null;
    this.children = [];
    this.parents = [];
    this.currentPartner = [];
    // Need alternative theories of mind
    this.desires = [];
    this.cultures = [];
    this.capabilities = [];


    // TODO: Should be made private

    /**
     * Generates a normalised health adjustment amount (not below zero, not above the INITIAL_HEALTH amount).
     *
     * @param existingHealthValue
     * @param adjustment
     */
    this.makeHealthAdjustment = function(existingHealthValue, adjustment) {
        var newHealth = existingHealthValue + adjustment;
        if (newHealth > 0 && newHealth < INITIAL_HEALTH)
            return newHealth;
        else if (newHealth > 0)
            return INITIAL_HEALTH;
        else
            return 0;
    };

    /**
     * Recalibrates overall health based on specific statistics.
     */
    this.recalibrateOverallHealth = function() {
        var overallHealth = 0;
        var len = this.agentType.healthCategories.length;
        var hasZeroHealth = false;
        for (var i = 0; i < len; i++) {
            var category = this.agentType.healthCategories[i];
            var categoryHealth = this.healthCategoryStats[category.code];
            if (categoryHealth == 0)
                hasZeroHealth = true;
            overallHealth += categoryHealth;
        }
        // Set health to zero if any of the specific types of health are zero
        overallHealth = hasZeroHealth ? 0 : overallHealth / len;

        this.health = overallHealth;
    };
}

/**
 * Gets the current position (x and y co-ordinates) of the agent
 */
Agent.prototype.getPosition = function() { return [this.x, this.y]; };
/**
 * 
 * @param x
 * @param y
 */
Agent.prototype.moveTo = function(x, y) {
    this.x = x; this.y = y;
    this.incrementMoves();
};
/**
 * Initialises health statistics for an agent, based all resource categories.
 */
Agent.prototype.registerHealthStats = function() {
    for (var i = 0; i < this.agentType.healthCategories.length; i++) {
        var category = this.agentType.healthCategories[i];
        this.healthCategoryStats[category.code] = INITIAL_HEALTH;
    }
    // Add length accessor here, to easily determine number of categories
    this.healthCategoryStats.length = this.agentType.healthCategories.length;
};
/**
 * Adjusts all categories of health by the adjustment amount.
 *
 * @param adjustment
 */
Agent.prototype.adjustGeneralHealth = function(adjustment) {
    var len = this.agentType.healthCategories.length;
    for (var i = 0; i < len; i++) {
        var category = this.agentType.healthCategories[i];
        var categoryHealth = this.healthCategoryStats[category.code];
        this.healthCategoryStats[category.code] = this.makeHealthAdjustment(categoryHealth, adjustment);
    }
    this.recalibrateOverallHealth();
};
/**
 * Adjusts health based on a given resource.
 * 
 * @param adjustment
 * @param resource
 */
Agent.prototype.adjustHealthForResource = function(adjustment, resource) {
    this.adjustHealthForResourceCategory(adjustment, resource.category);
};
/**
 * Adjusts health based on a given resource category.
 *
 * @param adjustment
 * @param resource
 */
Agent.prototype.adjustHealthForResourceCategory = function(adjustment, resourceCategory) {
    var categoryCode = resourceCategory.code;
    var categoryHealth = this.healthCategoryStats[categoryCode];
    this.healthCategoryStats[categoryCode] = this.makeHealthAdjustment(categoryHealth, adjustment);
    this.recalibrateOverallHealth();
};
/**
 * Retrieves health for a given resource category.
 *
 * @param resource
 */
Agent.prototype.getHealthForResource = function(resource) {
    return this.getHealthForResourceCategory(resource.category)
};
/**
 * Retrieves health for a given resource category.
 *
 * @param resource
 */
Agent.prototype.getHealthForResourceCategory = function(category) {
    var categoryCode = category.code;
    var categoryHealth = this.healthCategoryStats[categoryCode];
    return categoryHealth;
};


/**
 * Adjusts the degree of wander of the agent
 * @param cellWidth
 * @param pieceWidth
 */
Agent.prototype.adjustWander = function(cellWidth, pieceWidth) {
    var wx = this.wanderX;
    var wy = this.wanderY;
    var limit = cellWidth / 2 - pieceWidth / 2;
    var rx = Math.floor(Math.random() * 3 - 1);
    var ry = Math.floor(Math.random() * 3 - 1);
    wx = wx + rx;
    wy = wy + ry;

    if (limit - Math.abs(wx) >= 0)
        this.wanderX = wx;

    if (limit - Math.abs(wy) >= 0)
        this.wanderY = wy;
};

/**
 * Increments the countdown to move variable
 */
Agent.prototype.incrementCountdownToMove = function() { this.countdownToMove ++; };
/**
 * Resets the countdown to move variable
 */
Agent.prototype.resetCountdownToMove = function() { this.countdownToMove = 0; };

/**
 * Tests whether the agent is ready to move
 */
Agent.prototype.readyToMove = function() { return this.countdownToMove == 0; };

/**
 * Increments the moves/age of the agent
 */
Agent.prototype.incrementMoves = function() { this.age++; };


/**
 <div>
 This function adjusts the speed of an agent, based on the following algorithm:
 </div>

 <ul>
   <li>Firstly, the variance, the absolute difference between the agent's current and default speed, is calculated.</li>
   <li>Then, a probability that the agent's speed will change is derived by taking the square of the variance plus one.</li>
   <li>A random value is then generated between -1 and the probability value  - 1. This value ensures
     that it is likely the speed adjustment comes closer to the default speed, but with always some probability it will
     deviate further away.
   </li>

   <li>
     Separately, the square root of the variance, the adjustment value, is taken as the amount to actually adjust the speed by.
   </li>
   <li>
     The impact of these values means that when the current speed is very different from the default, both the probability that it will regress to
     the default, and the extent of the regression, are relatively high.
   </li>
   <li>
     The actual adjustment is then normalised based on the direction (up or down) of the variance.
   </li>
   <li>The actual adjustment is then added to the current speed.</li>
 </ul>

<div>
The net effect is that for zero or low variances from the default speed, the current speed has a good probability
of moving away as well as returning to the default speed. As an example, if the current speed differs from the default speed
 by 2, then the odds of returning towards the default as opposed to moving away are 8 (2 + 1 to the power of 2) to 1.
 The extent of the move is the rounded root of the difference, i.e. 1.
 </div>

<div>
One important consequence is that proximity to resources artificially deviates an agent's speed from its default speed
 (making it slower, because it takes time to utilise the resource).
 This automatic adjustment, which should be called at each 'tick'
 in the processing loop, has the effect of regressing this deviance back towards the default.
 In the meantime however, other agents have the opportunity to 'leap frog' the current agent, and progress
 more quickly towards the next resource.
</div>
 */
Agent.prototype.adjustSpeed = function() {
    var tmpSpeed = this.speed;
    var variance = this.speed - DEFAULT_SPEED;

    // Calculate probability of adjustment
    var prob = 0;
    switch (PROBABILITY_STRATEGY_TO_DEVIATE) {
        case VERY_UNLIKELY:
            // Makes movement away from MOVE_INCREMENTS very unlikely: EXP(N, N)
            prob = Math.pow(Math.abs(variance), Math.abs(variance)) + 2;
            break;
        case UNLIKELY:
            // Makes movement away from MOVE_INCREMENTS unlikely
            prob = Math.pow(Math.abs(variance) + 1, 2) + 2;
            break;
        case MODERATELY_LIKELY:
            //    Makes movement away from MOVE_INCREMENTS moderately likely
            prob = Math.abs(variance) + 2;
            break;
        case EVEN_CHANCE:
            // Makes movement away from MOVE_INCREMENTS an even chance
            prob = 1 + 1 + 1;
            break;
    }


    var randomSpeedChange = Math.floor(Math.random() * prob) - 1;

    // Adjust by the square root of the current variance
    var adjustmentValue = Math.pow(Math.abs(variance), 0.5) + 0.5 | 0;

	// Force a change in the increment
	adjustmentValue = (adjustmentValue == 0 ? 1 : adjustmentValue);

    // Set the speed to ab¡ove, equal or below the current speed
    var change = (randomSpeedChange < 0 ? -adjustmentValue : (randomSpeedChange > 0 ? adjustmentValue : 0));
    // Change direction if the speed is already negative
    change = (variance > 0 ? -change : change);


    // Add a multiplier to the change
//    var multiplier = Math.ceil(Math.random() * 3);
    var multiplier = 1;

    tmpSpeed = this.speed + change * multiplier;

//    if (Log.isAt(Log.DEBUG)) {
//        console.log("r: " +randomSpeedChange);
//        console.log("prob: " +prob);
//        console.log("variance: " +variance);
//        console.log("adjustmentValue: " +adjustmentValue);
//        console.log("change: " +change);
//    }

    if (tmpSpeed > 0)
        this.speed = tmpSpeed;
};

/**
 * Evaluates the position
 */
Agent.prototype.memorisePosition = function(level) {
    // Record current position in memory, before moving on
    this.memorise(level, this.x, this.y);
};

/**
 * Memorises the current position of the agent, and if the level parameter is present,
 * surrounding cells, agents and other resources
 *
 * @param level
 */
Agent.prototype.memorise = function(level) {
    var x = this.x, y = this.y;
    var memory = null;
    if (this.memoriesOfPlacesVisited[[x, y]] != undefined) {
        memory = this.memoriesOfPlacesVisited[[x, y]];
        memory.addVisit(this.id, this.age);
    }
    else {
        memory = new Memory(this.id, this.age, x, y);
        this.memoriesOfPlacesVisited[[x, y]] = memory;
    }

    if (this.memoriesOfPathsUntried[[x, y]] != undefined) {
        delete this.memoriesOfPathsUntried[[x, y]];
    }
    if (this.lastUntriedPathMemory != undefined)
        memory.distanceFromLastUntriedPath = (this.age - this.lastUntriedPathMemory.age);
    this.lastMemory = memory;
    // Add to ordered memory
    this.chronologicalMemory[this.age] = memory;


    if (level != undefined) {
        var resources = level.resources;
        // Add neighbouring resources to memory
        for (var j = 0; j < resources.length; j++) {
            var resource = resources[j];
            var resourceX = resource.x;
            var resourceY = resource.y;
            // Is the resource next to our current position?
            var diffX = Math.abs(resourceX - x);
            var diffY = Math.abs(resourceY - y);
            var diff = diffX * diffY;
            if (diff <= 1) {
                // Add resource to memory
                this.memoriesOfResources[[x, y]] = resource;
            }
        }

        // Add any unvisited path cells to memory
        if (x - 1 >= 0 && level.getTile(x - 1, y) == undefined && this.memoriesOfPlacesVisited[[x - 1, y]] == undefined) {
            // Add path cell to memory
            this.lastUntriedPathMemory = new Memory(this.id, this.age, x - 1, y);
            this.memoriesOfPathsUntried[[x - 1, y]] = this.lastUntriedPathMemory;
        }
        if (x + 1 < level.worldWidth && level.getTile(x + 1, y) == undefined && this.memoriesOfPlacesVisited[[x + 1, y]] == undefined) {
            // Add path cell to memory
            this.lastUntriedPathMemory = new Memory(this.id, this.age, x + 1, y);
            this.memoriesOfPathsUntried[[x + 1, y]] = this.lastUntriedPathMemory;
        }
        if (y - 1 >= 0 && level.getTile(x, y - 1) == undefined && this.memoriesOfPlacesVisited[[x, y - 1]] == undefined) {
            // Add path cell to memory
            this.lastUntriedPathMemory = new Memory(this.id, this.age, x, y - 1);
            this.memoriesOfPathsUntried[[x, y - 1]] = this.lastUntriedPathMemory;
        }
        if (y + 1 < level.worldHeight && level.getTile(x, y + 1) == undefined && this.memoriesOfPlacesVisited[[x, y + 1]] == undefined) {
            // Add path cell to memory
            this.lastUntriedPathMemory = new Memory(this.id, this.age, x, y + 1);
            this.memoriesOfPathsUntried[[x, y + 1]] = this.lastUntriedPathMemory;
        }


        // Add agents on this tile to memory
        if (this.canCommunicateWithOtherAgents) {
            var agents = level.currentAgents;
            for (var i = 0; i < agents.length; i++) {
                var agent = agents[i];
                if (agent.id == this.id)
                    continue;
                var agentX = agent.x;
                var agentY = agent.y;
//                if (agentX == x && agentY == y && (agent.lastPosition().x != this.lastPosition().x || agent.lastPosition().y != this.lastPosition().y)) {
                // TODO: This is very slow - consider ways to optimise
                if ((agent.lastMemory.x != this.lastMemory.x || agent.lastMemory.y != this.lastMemory.y) && (Math.abs(agentX - x) <= 1 && Math.abs(agentY - y) <= 1)) {
                    // Add agent to memory
                    this.memoriesOfAgents[agent.id] = new MemoryOfAgent(this.id, this.age, x, y, agent.id);
                    var mpv = [];
                    for (var j in agent.memoriesOfPlacesVisited) {
                        var m = agent.memoriesOfPlacesVisited[j];
                        if (m != undefined)
                            mpv[[m.x, m.y]] = new Memory(m.agentID, m.age, m.x, m.y);
                    }
                    this.memoriesOfPlacesVisitedByOtherAgents[agent.id] = mpv;
                    var mpu = [];
                    for (var j in agent.memoriesOfPathsUntried) {
                        var m = agent.memoriesOfPathsUntried[j];
                        if (m != undefined)
                            mpu[[m.x, m.y]] = new Memory(m.agentID, m.age, m.x, m.y);
                    }
                    this.memoriesOfPathsUntriedByOtherAgents[agent.id] = mpu;

                    // Add memories to other agent
                    // TODO: No longer necessary?
//                    agent._memoriesOfAgents[this.id] = new MemoryOfAgent(agent.id, agent.age, x, y, this.id) ;
//                    mpv = [];
//                    for (var j in this.memoriesOfPlacesVisited) {
//                        var m = this.memoriesOfPlacesVisited[j];
//                        if (m != undefined)
//                            mpv[[m.x, m.y]] = new Memory(m.agentID, m.age, m.x, m.y);
//                    }
//                    agent._memoriesOfPlacesVisitedByOtherAgents[this.id] = mpv;
//                    mpu = [];
//                    for (var j in this.memoriesOfPathsUntried) {
//                        var m = this.memoriesOfPathsUntried[j];
//                        if (m != undefined)
//                            mpu[[m.x, m.y]] = new Memory(m.agentID, m.age, m.x, m.y);
//                    }
//                    agent._memoriesOfPathsUntriedByOtherAgents[this.id] = mpu;

                }
            }
        }
    }
};


/**
 * Main method for evaluating and making moves
 *
 * @param options
 */
Agent.prototype.evaluateMove = function(level, options) {
    // TODO: Make these parameters of the level

    var withNoRepeat = options ? options["withNoRepeat"] : false;
    var withNoCollision = options ? options["withNoCollision"] : false;

    var position = this.findPosition(level, withNoRepeat, withNoCollision, level.allowOffscreenCycling);

    // Set the position and add the move to the agent's memory
    this.moveTo(position[0], position[1]);
};


/**
<div>
Uses a series of heuristics to find an available adjacent cell to move to:
</div>

 <div>
    <ol>
 <li>Find all adjacent candidate (non-tile) cells, excluding the last visited cell. The order of the candidate
cells (which maximally include the cells immediately above, right, below and left to the current cell) is randomised,
to ensure no prejudice in the selected direction, all else being equal.</li>
 <li>If the previously visited cell is the only viable alternative, i.e. there are no candidates, move to that cell.
 <li>If one of the candidate (non-tile) cells is an exit point, move to that cell.</li>
 <li>Create a refined candidate list based on whether any cells have not yet been visited by this agent.
If the 'level.agentsCanCommunicate' property is true, then the memories of other agents met by this agent (AS AT THE TIME THEY MET)
are also shared. (Hereafter, when this property is true, additional conditions are included in square brackets).</li>
 <li>The refined candidate list, including just those cells not in this [or other met] agent's memory is then searched.
If any of these candidates in turn have a neighbouring resource, then the first of those candidates is selected.
Otherwise the first of the whole refined candidate list is returned.</li>
 <li>If no match has been found so far, then the *unrefined* candidate list is re-processed.
The last visited cell is added back to the list.</li>
 <li>The memories of these candidates of this agent [and of other met agents] are compiled into a new list.</li>
 <li>For each candidate, the memory list is then iterated through.
For each memory, the most recent visit to the memorised cell is then compared with the *age* of all memories of *unvisited* cells
of this agent [and of other met agents].
The candidate with the shortest distance between this agent's [or a met agent's] memory of it and its memory of an unvisited cell
is then selected. [If other agents' memory paths are shorter than this agent's, their candidate is preferred].</li>
 <li>If no candidate cells have a shortest distance to an unvisited cell for this agent [or any other met agent],
the first candidate cell is selected.</li>
</ol>
</div>
 *
 * @param level
 * @param withNoRepeat
 * @param withNoCollision
 * @param withOffscreenCycling
 */
Agent.prototype.findPosition = function(level, withNoRepeat, withNoCollision, withOffscreenCycling) {
    var x = this.x;
    var y = this.y;
    var newX = x;
    var newY = y;
    var lastX = this.lastMemory.x;
    var lastY = this.lastMemory.y;
    var candidateCells = [];
    var directions = this.randomDirectionOrder();
    for (var i = 0; i < directions.length; i++) {
        newX = x;
        newY = y;
        var dir = directions[i];

        var offScreen1 = 0;
        var offScreenWidth = level.worldWidth - 1;
        var offScreenHeight = level.worldHeight - 1;
        var offset = 1;
        var toContinue = false;
        switch (dir) {
            case 0:
                (x == offScreen1 ? (withOffscreenCycling ? newX = offScreenWidth : toContinue = true) : newX = newX - offset);
                break;
            case 1:
                (x == offScreenWidth ? (withOffscreenCycling ? newX = offScreen1 : toContinue = true) : newX = newX + offset);
                break;
            case 2:
                (y == offScreen1 ? (withOffscreenCycling ? newY = offScreenHeight : toContinue = true) : newY = newY - offset);
                break;
            case 3:
                (y == offScreenHeight ? (withOffscreenCycling ? newY = offScreen1 : toContinue = true) : newY = newY + offset);
                break;
        }
        if ((withNoRepeat && lastX == newX && lastY == newY) || toContinue) {
            continue;
        }
        if (level.getCell(newX, newY) == undefined) {
            candidateCells.push([newX, newY]);
        }
    }
    // Allow for back-tracking, if there is no way forward
    if (candidateCells.length == 0) {
        return [lastX, lastY];
    }


    // Here try to see if any agents encountered have zero unvisited cells in their memory, that the current agent also does not have in *its* memory.
    // If not, backtrack


    // Find the first candidate which is either the goal, or not in the history.
    var candidatesNotInHistory = [];
    for (var i = 0; i < candidateCells.length; i++) {
        var candidate = candidateCells[i];
        if (level.isExitPoint(candidate[0], candidate[1]))
            return candidate;


        if (this.memoriesOfPlacesVisited[candidate] == undefined) {
            var placeVisitedByOtherAgents = false;
            if (this.canCommunicateWithOtherAgents) {
                for (var agentID in this.memoriesOfPlacesVisitedByOtherAgents) {
                    var agentMemoryOfPlacesVisited = this.memoriesOfPlacesVisitedByOtherAgents[agentID];
                    if (agentMemoryOfPlacesVisited[candidate] != undefined) {
                        placeVisitedByOtherAgents = true;
                    }
                }
            }
            if (!placeVisitedByOtherAgents) {
                candidatesNotInHistory.push(candidate);
            }
        }

    }

    // Try to find a neighbouring resource, if it exists
    if (candidatesNotInHistory.length > 0) {
        var bestCandidate = candidatesNotInHistory[0];
        for (var i = 0; i < candidatesNotInHistory.length; i++) {
            var candidate = candidatesNotInHistory[i];
            var neighbour = this.hasNeighbouringResources(level, candidate[0], candidate[1]);
            if (neighbour != null) {
                bestCandidate = candidate;
                break;
            }
        }
        return bestCandidate;
    }


    // But first add back the last visited cell as a candidate - it might be the best option
    if (x != lastX || y != lastY)
        candidateCells.push([lastX, lastY]);
    if (candidateCells.length > 1) {
        // Try to head in a direction where an unvisited tile can be found

        var shortestAgeDifference = -1;
        var bestCandidate = null;

        var shortestAgeDifferenceForThisAgent = -1;
        var bestCandidateForThisAgent = null;

        // Merge all visited places in memory - expensive, but saves later loops
        var allPlacesVisited = [];
        for (var key in this.memoriesOfPlacesVisited) {
            var memory = this.memoriesOfPlacesVisited[key];
            allPlacesVisited[key] = memory;
        }
        if (this.canCommunicateWithOtherAgents) {
            for (var key in this.memoriesOfPlacesVisitedByOtherAgents) {
                var x = this.memoriesOfPlacesVisitedByOtherAgents[key];
                for (var y in x) {
                    var z = x[y];
                    allPlacesVisited[y] = z;
                }
            }
        }


        // If we get here, we need to search all candidate cells.
        for (var i = 0; i < candidateCells.length; i++) {
            var candidate = candidateCells[i];
            var mostRecentMemoryOfCandidate = this.memoriesOfPlacesVisited[candidate];
            var shortestAgeDifferenceToCandidate = -1;
            var shortestAgeDifferenceToCandidateForThisAgent = -1;
            var counter = 0;
            if (mostRecentMemoryOfCandidate != undefined) {
                var age = mostRecentMemoryOfCandidate.age;
                var mostRecentVisit = mostRecentMemoryOfCandidate.mostRecentVisit;

                for (var j in this.memoriesOfPathsUntried) {
                    var unvisited = this.memoriesOfPathsUntried[j];
                    if (unvisited != undefined) {
                        var inOtherAgentsMemory = false;
                        if (this.canCommunicateWithOtherAgents) {
                            for (var agentID in this.memoriesOfPlacesVisitedByOtherAgents) {
                                var agentMemoryOfPlacesVisited = this.memoriesOfPlacesVisitedByOtherAgents[agentID];
                                if (agentMemoryOfPlacesVisited[j] != undefined) {
                                    inOtherAgentsMemory = true;
                                    break;
                                }
                            }
                        }
                        var unvisitedAge = unvisited.age;
                        var diff = Math.abs(mostRecentVisit - unvisitedAge);
//                        var diff = Math.abs(age - unvisitedAge);
                        if (shortestAgeDifferenceToCandidateForThisAgent == -1 || diff < shortestAgeDifferenceToCandidateForThisAgent) {
                            shortestAgeDifferenceToCandidateForThisAgent = diff;
                        }
                        if (! inOtherAgentsMemory) {
                            if (shortestAgeDifferenceToCandidate == -1 || diff < shortestAgeDifferenceToCandidate) {
                                shortestAgeDifferenceToCandidate = diff;
                            }
                        }
                    }
                    counter++;
                }
            }
            if (this.canCommunicateWithOtherAgents) {
                for (var agentID in this.memoriesOfPlacesVisitedByOtherAgents) {
                    var agentMemoryOfPlacesVisited = this.memoriesOfPlacesVisitedByOtherAgents[agentID];
                    var agentMemoryOfPathsUntried = this.memoriesOfPathsUntriedByOtherAgents[agentID];
                    if (agentMemoryOfPathsUntried != undefined && agentMemoryOfPlacesVisited != undefined && agentMemoryOfPlacesVisited[candidate] != undefined) {

                        var mostRecentMemoryOfCandidateByAgent = agentMemoryOfPlacesVisited[candidate];

                        var ageOfOtherAgentMemory = mostRecentMemoryOfCandidateByAgent.age;

                        for (var j in agentMemoryOfPathsUntried) {
                            var agentUnvisitedMemory = agentMemoryOfPathsUntried[j];
                            if (allPlacesVisited[j] == undefined) {
                                var unvisitedAge = agentUnvisitedMemory.age;
                                var diff = Math.abs(ageOfOtherAgentMemory - unvisitedAge);

                                if (shortestAgeDifferenceToCandidate == -1 || diff < shortestAgeDifferenceToCandidate) {
                                    if (mostRecentMemoryOfCandidate != undefined) {
                                        // Assume if this candidate has been more recently visited, and has been visited several times, it is not a good candidate
                                        var mostRecentVisit = mostRecentMemoryOfCandidate.mostRecentVisit;
                                        var numberOfVisits = mostRecentMemoryOfCandidate.visits;
                                        if (mostRecentVisit > ageOfOtherAgentMemory && numberOfVisits > 3)
                                            continue;
                                    }
                                    shortestAgeDifferenceToCandidate = diff;
                                }
                            }
                        }
                    }
                }
            }


            //
            if (shortestAgeDifferenceToCandidateForThisAgent > -1 && (shortestAgeDifferenceForThisAgent == -1 || shortestAgeDifferenceToCandidateForThisAgent < shortestAgeDifferenceForThisAgent)) {
                shortestAgeDifferenceForThisAgent = shortestAgeDifferenceToCandidateForThisAgent;
                bestCandidateForThisAgent = candidate;
            }
            if (shortestAgeDifferenceToCandidate > -1 && (shortestAgeDifference == -1 || shortestAgeDifferenceToCandidate < shortestAgeDifference)) {
                shortestAgeDifference = shortestAgeDifferenceToCandidate;
                bestCandidate = candidate;
            }
        }

        // Try any unvisited cells at this point
        if (bestCandidate == undefined) {
            // Try any unvisited cells at this point
            for (var i = 0; i < candidateCells.length; i++) {
                var candidate = candidateCells[i];
                if (this.memoriesOfPathsUntried[candidate] != undefined) {
                    bestCandidate = candidate;
                    break;
                }
            }
        }


        // Now try the best candidate for this agent
        if (bestCandidate == undefined) {
            if (bestCandidateForThisAgent != undefined) {
                bestCandidate = bestCandidateForThisAgent;
            }
//            else {
//                bestCandidate = candidateCells[0];
//
//            }
        }

        // Now try the best candidate based
        if (bestCandidate == undefined) {
            // Try any unvisited cells at this point
            for (var k = 0; k < candidateCells.length; k++) {
                var resourceCandidate = candidateCells[k];
                var neighbourResource = this.hasNeighbouringResources(level, resourceCandidate[0], resourceCandidate[1]);
                if (neighbourResource != null) {
                    bestCandidate = resourceCandidate;
                    break;
                }
            }
        }

        if (bestCandidate == undefined) {
            bestCandidate = candidateCells[0];
        }


        // Now try the oldest candidate
        // TODO: Revisit this logic
        /*
        if (shortestAgeDifference == -1) {
            var ageInMemory = -1;
            for (var i = 1; i < candidateCells.length; i++) {
                var candidate = candidateCells[i];

                var mostRecentMemoryOfCandidate = this.memoriesOfPlacesVisited[candidate];

                if (mostRecentMemoryOfCandidate != undefined && (ageInMemory == -1 || mostRecentMemoryOfCandidate.age < ageInMemory)) {
                    ageInMemory = mostRecentMemoryOfCandidate;
                    bestCandidate = candidate;
                }
            }
        }
        */

        // Return the best candidate we can find
        return bestCandidate;
    }

    // Use the first candidate cell if we get through to here
    return candidateCells[0];
};

/**
 * Returns the closest unvisited cell to the current position,
 *
 * @param currentX
 * @param currentY
 */
Agent.prototype.getClosestUnvisitedCell = function(currentX, currentY) {
    var foundMemory = null;
    var foundMemoryPosition = -1;
    for (var i = 0; i < this.memoriesOfPlacesVisited.length; i++) {
        var memory = this.memoriesOfPlacesVisited[i];
        if (memory.x == currentX && memory.y == currentY) {
            foundMemory = memory;
            foundMemoryPosition = i;
        }
    }
    var limit =  (foundMemoryPosition > this.memoriesOfPlacesVisited.length / 2 ? foundMemoryPosition : this.memoriesOfPlacesVisited.length - foundMemoryPosition);

    for (var i = 1; i < limit; i++) {
        var memoryBelow, memoryAbove;
        if (foundMemoryPosition - i >= 0)
            memoryBelow = this.memoriesOfPlacesVisited[foundMemoryPosition - i];
        if (foundMemoryPosition - i >= 0)
            memoryAbove = this.memoriesOfPlacesVisited[foundMemoryPosition + i];
        if (memory.x == currentX && memory.y == currentY) {
            foundMemory = memory;
            foundMemoryPosition = i;
        }
    }

};


/**
 * Generates a random order for the available directions (UP, RIGHT, DOWN, LEFT)
 */
Agent.prototype.randomDirectionOrder = function() {
    var directions = [];
    var orderedDirections = [0, 1, 2, 3];
    var odl = orderedDirections.length;
    for (var i = 0; i < odl; i++) {
        var remainingLength = orderedDirections.length;
        var pos = Math.floor(Math.random() * remainingLength);
        directions.push(orderedDirections[pos]);
        orderedDirections.splice(pos, 1);
    }
    return directions;
};

/**
 * Returns whether there is a neighbouring cell on a given level, at the given position.
 *
 * @param level
 * @param x
 * @param y
 */
Agent.prototype.hasNeighbouringResources = function(level, x, y) {
    var resources = level.resources;
    for (var j = 0, len = resources.length; j < len; j++) {
        var resource = resources[j];
        var px = resource.x;
        var py = resource.y;
        if (Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1) {
            // TODO: Add hook here for evaluating relative health of neighbouring resources
//            var h = p.getHealth();
            return resource;
        }
    }
    return null;
};



