/*!
 * Fierce Planet - Game
 * Core game initialisation and processing loop
 * NB: classes.js and relevant level sources must be pre-loaded
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * @namespace Holds functionality related to FiercePlanet
 */
var FiercePlanet = FiercePlanet || {};
var $fp = $fp || FiercePlanet;


/* Initialisation code: start game and dialog boxes */

$(document).ready(function() {
    FiercePlanet.loadGame();

    FiercePlanet.Utils.bindVariables();

});



/**
 * Core logic loop: processes agents.
 */
FiercePlanet.processAgents = function() {

    var recordableChangeMade = false;

    // Draw the scrolling layer
    FiercePlanet.Drawing.drawScrollingLayer();

    // Draw any notices
    if (World.settings.noticesVisible && FiercePlanet.currentNotice != undefined) {
        FiercePlanet.Drawing.drawNotice(FiercePlanet.currentNotice);
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


    if (FiercePlanet.nullifiedAgents)
        FiercePlanet.Drawing.clearAgentGroup(FiercePlanet.nullifiedAgents);
    FiercePlanet.nullifiedAgents = [];
    FiercePlanet.Drawing.clearAgents();
    var nullifiedAgents = [];
    var citizenCount = 0;
    var agents = FiercePlanet.currentLevel.currentAgents;

    // Pre-movement processing - DO NOTHING FOR NOW
    for (var i = 0; i < agents.length; i++) {
        var agent = agents[i];
        var speed = agent.speed;
        var countDown = (agent.countdownToMove) % speed;
        if (FiercePlanet.waveCounter >= agent.delay && countDown % speed == 0) {
            agent.memorise(FiercePlanet.currentLevel);
        }
    }

    // Move agents
    var options = {"withNoRepeat": true, "withNoCollision": false};
    for (var i = 0; i < agents.length; i++) {
        var agent = agents[i];

        // Don't process agents we want to block
        if (! World.settings.rivalsVisible && agent.agentType == AgentTypes.RIVAL_AGENT_TYPE)
            continue;
        if (! World.settings.predatorsVisible && agent.agentType == AgentTypes.PREDATOR_AGENT_TYPE)
            continue;

        var speed = agent.speed;
        if (agent.agentType == AgentTypes.CITIZEN_AGENT_TYPE)
            citizenCount++;
//        if (FiercePlanet.waveCounter >= agent.getDelay() && (FiercePlanet.waveCounter - agent.getDelay()) % speed == 0) {
        if (FiercePlanet.waveCounter >= agent.delay) {
            var countDownTest = (FiercePlanet.waveCounter - agent.delay) % speed;
            var countDown = (agent.countdownToMove) % speed;

            if (countDown == 0) {
                recordableChangeMade = true;
                // TODO: move this logic elsewhere
                if (agent.agentType == AgentTypes.CITIZEN_AGENT_TYPE) {
                    if (FiercePlanet.currentLevel.isExitPoint(agent.x, agent.y)) {
                        FiercePlanet.currentProfile.processSavedAgent(FiercePlanet.currentWave);
                        nullifiedAgents.push(i);

                        FiercePlanet.Drawing.drawScore();
                        FiercePlanet.Drawing.drawResourcesInStore();
                        FiercePlanet.Drawing.drawSaved();
                    }
                }

                // Do for all agents
                agent.evaluateMove(FiercePlanet.currentLevel, options);

                if (agent.agentType == AgentTypes.CITIZEN_AGENT_TYPE) {
                    agent.resetCountdownToMove();
                    if (!FiercePlanet.currentLevel.noSpeedChange && World.settings.agentsCanAdjustSpeed)
                        agent.adjustSpeed();
                    if (!FiercePlanet.currentLevel.noWander && World.settings.agentsCanAdjustWander)
                        agent.adjustWander(FiercePlanet.cellWidth, FiercePlanet.pieceWidth);
                }

                if (agent.age > FiercePlanet.maxWaveMoves)
                    FiercePlanet.maxWaveMoves = agent.age;

                // TODO: should be in-lined?
                if (agent.agentType == AgentTypes.CITIZEN_AGENT_TYPE || agent.agentType == AgentTypes.RIVAL_AGENT_TYPE) {
                    if (!World.settings.godMode || World.settings.showHealthReductionInGodMode)
                        agent.adjustGeneralHealth(World.settings.agentCostPerMove);
                    if (agent.health <= 0 && !World.settings.godMode) {
                        nullifiedAgents.push(i);
                        FiercePlanet.nullifiedAgents.push(agent);
                        FiercePlanet.Drawing.drawExpiredAgent(agent);
                        if (agent.agentType == AgentTypes.CITIZEN_AGENT_TYPE)
                            FiercePlanet.currentProfile.current_level_expired++;
                       FiercePlanet.Drawing.drawExpired();
                    }
                    else {
                        // Hook for detecting 'active' resources
//                        FiercePlanet.processNeighbouringResources(agent);
                        FiercePlanet.currentLevel.processNeighbouringResources(agent);

                        // Hook for detecting other agents
//                        FiercePlanet.processNeighbouringAgents(agent);
                        FiercePlanet.currentLevel.processNeighbouringAgents(agent);
                    }
                }
            }
            if (agent.agentType == AgentTypes.CITIZEN_AGENT_TYPE) {
                agent.incrementCountdownToMove();
            }
        }
    }



    if (FiercePlanet.currentProfile.current_level_expired >= FiercePlanet.currentLevel.expiryLimit) {
        return FiercePlanet.gameOver();
    }

    // Check whether we have too many
    for (var i = nullifiedAgents.length - 1; i >= 0; i-= 1) {
        FiercePlanet.currentLevel.currentAgents.splice(nullifiedAgents[i], 1);
    }

    // No agents left? End of wave
    if (citizenCount == 0) {
        // Start a new wave
        if (FiercePlanet.currentWave < FiercePlanet.currentLevel.waveNumber) {
            FiercePlanet.completeWave();
            FiercePlanet.newWave();
        }
        else if (FiercePlanet.currentLevelNumber < FiercePlanet.PresetLevels.MAX_DEFAULT_LEVELS) {
            FiercePlanet.completeLevel();
            FiercePlanet.levelDelayCounter = 0;
        }
        else {
            return FiercePlanet.completeGame();
        }
    }
    else {
        if (FiercePlanet.waveCounter % FiercePlanet.resourceRecoveryCycle == 0) {
            FiercePlanet.currentLevel.recoverResources().forEach(function(resource) {
                FiercePlanet.Drawing.drawResource(resource);
            });
//            FiercePlanet.recoverResources();
//            FiercePlanet.drawResources();
        }
        FiercePlanet.Drawing.drawAgents();
    }

    // Post-move processing
    if (World.settings.recording)
        FiercePlanet.recordWorld();

};

