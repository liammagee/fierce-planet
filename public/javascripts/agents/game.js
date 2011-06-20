

/* NB: classes.js and relevant level sources must be pre-loaded */

/* Constants */
var FiercePlanet = FiercePlanet || {};
var $fp = $fp || FiercePlanet;


/* Initialisation code: start game and dialog boxes */

$(document).ready(function() {
    FiercePlanet.loadGame();
});



/**
 * Core logic loop: processes agents
 */
FiercePlanet.processAgents = function() {

    var recordableChangeMade = false;

    // Draw the scrolling layer
    FiercePlanet.drawScrollingLayer();

    // Draw any notices
    if (FiercePlanet.noticesVisible && FiercePlanet.currentNotice != undefined) {
        FiercePlanet.drawNotice(FiercePlanet.currentNotice);
    }

    // Delay, until we are ready for the first wave
    if (FiercePlanet.levelDelayCounter < FiercePlanet.NEW_LEVEL_DELAY / FiercePlanet.interval) {
        FiercePlanet.levelDelayCounter++;
        return;
    }

    // Delay, until we are ready for a new wave
    if (FiercePlanet.waveDelayCounter < FiercePlanet.NEW_WAVE_DELAY / FiercePlanet.interval) {
        FiercePlanet.waveDelayCounter++;
        return;
    }

    // Increment counters
    FiercePlanet.waveCounter++;
    FiercePlanet.levelCounter++;
    FiercePlanet.gameCounter++;


    FiercePlanet.clearAgents();

    var nullifiedAgents = [];
    var citizenCount = 0;
    var agents = FiercePlanet.currentLevel.getCurrentAgents();

    // Pre-movement processing - DO NOTHING FOR NOW
    for (var i = 0; i < agents.length; i++) {
        var agent = agents[i];
        var speed = agent.getSpeed();
        if (FiercePlanet.waveCounter >= agent.getDelay() && (FiercePlanet.waveCounter - agent.getDelay()) % speed == 0) {
            agent.evaluatePosition(FiercePlanet.currentLevel);
        }
    }

    // Move agents
    var options = {"withNoRepeat": true, "withNoCollision": false};
    for (var i = 0; i < agents.length; i++) {
        var agent = agents[i];

        // Don't process agents we want to block
        if (! FiercePlanet.rivalsVisible && agent.getType() == AgentTypes.RIVAL_AGENT_TYPE)
            continue;
        if (! FiercePlanet.predatorsVisible && agent.getType() == AgentTypes.PREDATOR_AGENT_TYPE)
            continue;

        var speed = agent.getSpeed();
        if (agent.getType() == AgentTypes.CITIZEN_AGENT_TYPE)
            citizenCount++;
        if (FiercePlanet.waveCounter >= agent.getDelay() && (FiercePlanet.waveCounter - agent.getDelay()) % speed == 0) {
            recordableChangeMade = true;
            // TODO: move this logic elsewhere
            if (agent.getType() == AgentTypes.CITIZEN_AGENT_TYPE) {
                if (FiercePlanet.currentLevel.isExitPoint(agent.getX(), agent.getY())) {
                    FiercePlanet.currentScore += FiercePlanet.SAVE_SCORE;
                    FiercePlanet.savedAgentCount++;
                    FiercePlanet.savedAgentThisWaveCount++;
                    nullifiedAgents.push(i);
                    var multiplier = (FiercePlanet.currentWave < 5 ? 4 : (FiercePlanet.currentWave < 10 ? 3 : (FiercePlanet.currentWave < 20 ? 2 : 1)));
                    FiercePlanet.resourcesInStore += multiplier; //FiercePlanet.WAVE_GOODNESS_BONUS;
                    FiercePlanet.drawScore();
                    FiercePlanet.drawResourcesInStore();
                    FiercePlanet.drawSaved();
                }
            }

            // Do for all agents
            agent.evaluateMove(FiercePlanet.currentLevel, options);

            if (agent.getType() == AgentTypes.CITIZEN_AGENT_TYPE) {
                agent.adjustSpeed();
                agent.adjustWander();
            }

            if (agent.getMoves() > FiercePlanet.maxWaveMoves)
                FiercePlanet.maxWaveMoves = agent.getMoves();

            // TODO: should be in-lined?
            if (agent.getType() == AgentTypes.CITIZEN_AGENT_TYPE || agent.getType() == AgentTypes.RIVAL_AGENT_TYPE) {
                if (!FiercePlanet.godMode)
                    agent.adjustHealth(FiercePlanet.MOVE_HEALTH_COST);
                if (agent.getHealth() <= 0) {
                    nullifiedAgents.push(i);
                    if (agent.getType() == AgentTypes.CITIZEN_AGENT_TYPE)
                        FiercePlanet.expiredAgentCount++;
                   FiercePlanet.drawExpired();
                }
                else {
                    // Hook for detecting 'active' resources
                    FiercePlanet.processNeighbouringResources(agent);

                    // Hook for detecting other agents
                    FiercePlanet.processNeighbouringAgents(agent);
                }
            }
        }
    }



    if (FiercePlanet.expiredAgentCount >= FiercePlanet.currentLevel.getExpiryLimit()) {
        return FiercePlanet.gameOver();
    }

    // Check whether we have too many
    for (var i = nullifiedAgents.length - 1; i >= 0; i-= 1) {
        FiercePlanet.currentLevel.getCurrentAgents().splice(nullifiedAgents[i], 1);
    }
    // No agents left? End of wave
    if (citizenCount == 0) {
        // Start a new wave
        if (FiercePlanet.currentWave < FiercePlanet.currentLevel.getWaveNumber()) {
            FiercePlanet.completeWave();
            FiercePlanet.newWave();
        }
        else if (FiercePlanet.currentLevelNumber < PresetLevels.MAX_DEFAULT_LEVELS) {
            FiercePlanet.completeLevel();
            FiercePlanet.levelDelayCounter = 0;
        }
        else {
            return FiercePlanet.completeGame();
        }
    }
    else {
        if (FiercePlanet.waveCounter % FiercePlanet.resourceRecoveryCycle == 0)
            FiercePlanet.recoverResources();
        FiercePlanet.drawAgents();
    }

    // Post-move processing
    if (FiercePlanet.recording)
        FiercePlanet.recordWorld();

};


/**
 * Processes neighbouring resources
 */
FiercePlanet.processNeighbouringResources = function(agent) {
    var x = agent.getX();
    var y = agent.getY();
    for (var j = 0; j < FiercePlanet.currentLevel.getResources().length; j++) {
        var resource = FiercePlanet.currentLevel.getResources()[j];
        var rx = resource.getX();
        var ry = resource.getY();
        if (Math.abs(rx - x) <= 1 && Math.abs(ry - y) <= 1) {
            var resourceEffect = FiercePlanet.calculateResourceEffect(resource);
            resource.provideYield(agent, resourceEffect, FiercePlanet.applyGeneralHealth);
            FiercePlanet.drawResource(resource);
        }
    }
};


/**
 * Processes neighbouring agents
 */
FiercePlanet.processNeighbouringAgents = function(agent) {
    var x = agent.getX();
    var y = agent.getY();
    agent.setIsHit(false);
    var agents = FiercePlanet.currentLevel.getCurrentAgents();
    for (var j = 0; j < agents.length; j++) {
        var a = agents[j];
        var ax = a.getX();
        var ay = a.getY();
        if (Math.abs(ax - x) <= 1 && Math.abs(ay - y) <= 1) {
            if (!FiercePlanet.godMode && FiercePlanet.predatorsVisible && agent.getType() == CITIZEN_AGENT_TYPE && a.getType() == PREDATOR_AGENT_TYPE) {
                agent.setIsHit(true);
            }
        }
    }
    if (agent.getIsHit())
        agent.adjustHealth(-10);
};










