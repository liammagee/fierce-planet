/**
 * Handles recording-related functions
 */

/**
 * Declare the FiercePlanet namespace
 */
var FiercePlanet = FiercePlanet || {};

FiercePlanet.recordNewGame = function() {
        if (FiercePlanet.currentGameRecord == undefined) {
            try {
                FiercePlanet.currentGameRecord = new GameRecord();
            }
            catch (err) {
                console.log(err);
            }
        }
    };

FiercePlanet.recordNewLevel = function() {
        if (FiercePlanet.currentLevel != undefined) {
            console.log("Recording at: " + FiercePlanet.globalRecordingCounter);
            try {
                var level = new Level(FiercePlanet.currentLevel._id);
                level.setTiles(FiercePlanet.currentLevel.getTiles());
                FiercePlanet.currentGameRecord._levelLog[FiercePlanet.gameCounter] = level;
                FiercePlanet.currentGameRecord._currentLevel = level;
            }
            catch (err) {
                console.log(err);
            }
        }
    };

FiercePlanet.recordNewWave = function() {
        if (FiercePlanet.currentLevel != undefined) {
            console.log("Recording at: " + FiercePlanet.globalRecordingCounter);
            try {
//                var level = new Level(FiercePlanet.currentLevel._id);
//                level.setTiles(FiercePlanet.currentLevel.getTiles());
//                FiercePlanet.currentGameRecord._level = level;
            }
            catch (err) {
                console.log(err);
            }
        }
    };

FiercePlanet.recordNewAgents = function() {
        if (FiercePlanet.currentLevel != undefined) {
            console.log("Recording at: " + FiercePlanet.globalRecordingCounter);
            try {
                var proxyAgents = [];
                var agents = FiercePlanet.currentLevel.getCurrentAgents();
                for (var i = 0; i < agents.length; i++) {
                    var agent = agents[i];
                    var proxyAgent = new Agent(agent._agentType, agent._x, agent._y);
                    proxyAgent._id = agent._id;
                    proxyAgents.push(proxyAgent);
                }
                FiercePlanet.currentGameRecord._agentLog[FiercePlanet.gameCounter] = proxyAgents;
            }
            catch (err) {
                console.log(err);
            }
        }
    };


FiercePlanet.recordWorld = function() {
        if (FiercePlanet.currentLevel != undefined) {
            console.log("Recording at: " + FiercePlanet.globalRecordingCounter);
            try {
                var level = new Level(FiercePlanet.currentLevel._id);
                level.setCurrentAgents(FiercePlanet.currentLevel.getCurrentAgents());
                level.setResources(FiercePlanet.currentLevel.getResources());
                FiercePlanet.recordedLevels[FiercePlanet.globalRecordingCounter] = $.toJSON(level);
                FiercePlanet.globalRecordingCounter++;
            }
            catch (err) {
                console.log(err);
            }
        }
    };

FiercePlanet.replayWorld = function() {
        FiercePlanet._stopAgents();
        FiercePlanet.existingCurrentLevel = FiercePlanet.currentLevel;
        clearInterval(FiercePlanet.agentTimerId);
        FiercePlanet.globalRecordingCounter = 0;
        FiercePlanet.drawGame();
        FiercePlanet.inPlay = true;

        setTimeout("this.replayStart()", 3000);
    };

FiercePlanet.replayStart = function() {
        FiercePlanet.agentTimerId = setInterval("this.replayStep()", FiercePlanet.interval);

    };

FiercePlanet.replayStep = function () {
        var level = FiercePlanet.recordedLevels[FiercePlanet.globalRecordingCounter];
        console.log("Replaying at: " + FiercePlanet.globalRecordingCounter);
        console.log("Level: " + level);
        if (level == undefined) {
            FiercePlanet.replayStop();
        }
        else {
            try {
                FiercePlanet.clearAgents();
                FiercePlanet.currentLevel = $.evalJSON(level);
                FiercePlanet.globalRecordingCounter++;
                FiercePlanet.drawResources();
                FiercePlanet.drawScrollingLayer();
    //            FiercePlanet.drawScoreboard();
                FiercePlanet.drawAgents();

            }
            catch(err) {
                console.log(err);
            }
        }
    };

FiercePlanet.replayStop = function () {
        FiercePlanet.agentTimerId = clearInterval(FiercePlanet.agentTimerId);
        FiercePlanet.globalRecordingCounter = 0;
        FiercePlanet.currentLevel = FiercePlanet.existingCurrentLevel;
        FiercePlanet.inPlay = false;
    };
