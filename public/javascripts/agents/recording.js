/**
 * Handles recording-related functions
 */

/**
 * Declare the FiercePlanet namespace
 */
var FiercePlanet = FiercePlanet || {};


/**
 *
 */
FiercePlanet.recordWorld = function() {
        if (FiercePlanet.currentLevel != undefined) {
            console.log("Recording at: " + FiercePlanet.globalRecordingCounter);
            try {
                var level = new Level(FiercePlanet.currentLevel._id);
                var agents = [];
                for (var i = 0, len = FiercePlanet.currentLevel.getCurrentAgents().length; i < len; i++) {
                    var actualAgent = FiercePlanet.currentLevel.getCurrentAgents()[i];
                    var proxyAgent = new Agent(actualAgent.getType(), actualAgent.getX(), actualAgent.getY());
                    proxyAgent.setLastMemory(actualAgent.getLastMemory());
                    proxyAgent.setDelay(actualAgent.getDelay());
                    proxyAgent.setSpeed(actualAgent.getSpeed());
                    agents.push(proxyAgent);
                }
                level.setCurrentAgents(agents);
                level.setResources(FiercePlanet.currentLevel.getResources());
                // Serialised option, for remote persistence
                FiercePlanet.recordedLevels[FiercePlanet.globalRecordingCounter] = $.toJSON(level);
                // Local option
//                FiercePlanet.recordedLevels[FiercePlanet.globalRecordingCounter] = level;
                FiercePlanet.globalRecordingCounter++;
            }
            catch (err) {
                console.log(err);
            }
        }
    };

/**
 *
 */
FiercePlanet.replayWorld = function() {
        FiercePlanet._stopAgents();
        FiercePlanet.existingCurrentLevel = FiercePlanet.currentLevel;
        clearInterval(FiercePlanet.agentTimerId);
        FiercePlanet.globalRecordingCounter = 0;
        FiercePlanet.waveCounter = 0;
        FiercePlanet.drawGame();
        FiercePlanet.inPlay = true;

        setTimeout("FiercePlanet.replayStart()", 100);
    };

/**
 *
 */
FiercePlanet.replayStart = function() {
        FiercePlanet.agentTimerId = setInterval("FiercePlanet.replayStep()", FiercePlanet.interval * 2);
};

/**
 *
 */
FiercePlanet.replayStep = function () {
        var level = FiercePlanet.recordedLevels[FiercePlanet.globalRecordingCounter];
        console.log("Replaying at: " + FiercePlanet.globalRecordingCounter);
        if (level == undefined) {
            FiercePlanet.replayStop();
        }
        else {
            try {
                FiercePlanet.clearAgents();
                // Serialised option, for remote persistence
                FiercePlanet.currentLevel = $.evalJSON(level);
                // Local option
//                FiercePlanet.currentLevel = level;
                FiercePlanet.globalRecordingCounter++;
                FiercePlanet.waveCounter++;
                FiercePlanet.clearCanvas('resourceCanvas');
                FiercePlanet.clearCanvas('scrollingCanvas');
                FiercePlanet.clearCanvas('noticeCanvas');
                FiercePlanet.clearCanvas('agentCanvas');

                FiercePlanet.drawEntryPoints();
                FiercePlanet.drawExitPoints();
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

/**
 *
 */
FiercePlanet.replayStop = function () {
        FiercePlanet.agentTimerId = clearInterval(FiercePlanet.agentTimerId);
        FiercePlanet.globalRecordingCounter = 0;
        FiercePlanet.currentLevel = FiercePlanet.existingCurrentLevel;
        FiercePlanet.inPlay = false;
    };
