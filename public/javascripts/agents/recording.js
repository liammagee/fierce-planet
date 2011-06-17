/**
 * Handles recording-related functions
 */

/**
 * Declare the FiercePlanet namespace
 */
var FiercePlanet = FiercePlanet || {};


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
