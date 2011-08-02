/*!
 * Fierce Planet - Recording
 * Handles recording-related functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};

/**
 * @namespace Contains drawing functions
 */
FiercePlanet.Recording = FiercePlanet.Recording || {};

(function() {
    /**
     * Record the current state of the game
     */
    this.recordWorld = function() {
            if (FiercePlanet.currentLevel != undefined) {
                if (typeof console != "undefined")
                    console.log("Recording at: " + FiercePlanet.globalRecordingCounter);
                try {
                    var level = new Level(FiercePlanet.currentLevel.id);
                    var agents = [];
                    for (var i = 0, len = FiercePlanet.currentLevel.currentAgents.length; i < len; i++) {
                        var actualAgent = FiercePlanet.currentLevel.currentAgents[i];
                        var proxyAgent = new Agent(actualAgent.agentType, actualAgent.x, actualAgent.y);
                        proxyAgent.lastMemory = actualAgent.lastMemory;
                        proxyAgent.delay = actualAgent.delay;
                        proxyAgent.speed = actualAgent.speed;
                        agents.push(proxyAgent);
                    }
                    level.setCurrentAgents(agents);
                    level.setResources(FiercePlanet.currentLevel.resources);
                    // Serialised option, for remote persistence
                    FiercePlanet.recordedLevels[FiercePlanet.globalRecordingCounter] = $.toJSON(level);
                    // Local option
//                FiercePlanet.recordedLevels[FiercePlanet.globalRecordingCounter] = level;
                    FiercePlanet.globalRecordingCounter++;
                }
                catch (err) {
//                console.log(err);
                }
            }
        };

    /**
     * Replay the game
     */
    this.replayWorld = function() {
            FiercePlanet._stopAgents();
            FiercePlanet.existingCurrentLevel = FiercePlanet.currentLevel;
            clearInterval(FiercePlanet.agentTimerId);
            FiercePlanet.globalRecordingCounter = 0;
            FiercePlanet.waveCounter = 0;
            FiercePlanet.Drawing.drawGame();
            FiercePlanet.inPlay = true;

            setTimeout("FiercePlanet.Recording.replayStart()", 100);
        };


    /**
     * Begin the replay of the game, by adding a new interval
     */
    this.replayStart = function() {
            FiercePlanet.agentTimerId = setInterval("FiercePlanet.Recording.replayStep()", FiercePlanet.interval * 2);
    };

    /**
     * Replay a single step in a recorded game
     */
    this.replayStep = function () {
            var level = FiercePlanet.recordedLevels[FiercePlanet.globalRecordingCounter];
            if (typeof console != "undefined")
                console.log("Replaying at: " + FiercePlanet.globalRecordingCounter);
            if (level == undefined) {
                this.replayStop();
            }
            else {
                try {
                    FiercePlanet.Drawing.clearAgents();
                    // Serialised option, for remote persistence
                    FiercePlanet.currentLevel = $.evalJSON(level);
                    // Local option
//                FiercePlanet.currentLevel = level;
                    FiercePlanet.globalRecordingCounter++;
                    FiercePlanet.waveCounter++;
                    FiercePlanet.Drawing.clearCanvas('resourceCanvas');
                    FiercePlanet.Drawing.clearCanvas('scrollingCanvas');
                    FiercePlanet.Drawing.clearCanvas('noticeCanvas');
                    FiercePlanet.Drawing.clearCanvas('agentCanvas');

                    FiercePlanet.Drawing.drawEntryPoints();
                    FiercePlanet.Drawing.drawExitPoints();
                    FiercePlanet.Drawing.drawResources();
                    FiercePlanet.Drawing.drawScrollingLayer();
        //            FiercePlanet.drawScoreboard();
                    FiercePlanet.Drawing.drawAgents();
                }
                catch(err) {
//                console.log(err);
                }
            }
        };


    /**
     * Stop the replay of a recorded game
     */
    this.replayStop = function () {
            FiercePlanet.agentTimerId = clearInterval(FiercePlanet.agentTimerId);
            FiercePlanet.globalRecordingCounter = 0;
            FiercePlanet.currentLevel = FiercePlanet.existingCurrentLevel;
            FiercePlanet.inPlay = false;
        };

}).apply(FiercePlanet.Recording);

