/**
 * Handles recording-related functions
 */


var Recording = {

    recordWorld: function() {
        if (currentLevel != undefined) {
            console.log("Recording at: " + globalRecordingCounter);
            try {
                var level = new Level(currentLevel._id);
                level.setCurrentAgents(currentLevel.getCurrentAgents());
                level.setResources(currentLevel.getResources());
                recordedLevels[globalRecordingCounter] = $.toJSON(level);
                globalRecordingCounter++;
            }
            catch (err) {
                console.log(err);
            }
        }
    },

    replayWorld: function() {
        _stopAgents();
        existingCurrentLevel = currentLevel;
        clearInterval(agentTimerId);
        globalRecordingCounter = 0;
        drawGame();
        inPlay = true;

        setTimeout("this.replayStart()", 3000);
    },

    replayStart : function() {
        agentTimerId = setInterval("this.replayStep()", interval);

    },

    replayStep : function () {
        var level = recordedLevels[globalRecordingCounter];
        console.log("Replaying at: " + globalRecordingCounter);
        console.log("Level: " + level);
        if (level == undefined) {
            this.replayStop();
        }
        else {
            try {
                clearAgents();
                currentLevel = $.evalJSON(level);
                globalRecordingCounter++;
                drawResources();
                drawScrollingLayer();
    //            drawScoreboard();
                drawAgents();

            }
            catch(err) {
                console.log(err);
            }
        }
    },

    replayStop : function () {
        agentTimerId = clearInterval(agentTimerId);
        globalRecordingCounter = 0;
        currentLevel = existingCurrentLevel;
        inPlay = false;
    }
};