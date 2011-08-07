/*!
 * Fierce Planet - Lifecycle
 * Lifecycle related methods
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};


/**
 * Called when a game is loaded
 */
FiercePlanet.loadGame = function() {
    // Load relevant settings, if available
    FiercePlanet.ProfileUI.loadProfileSettingsFromStorage();

    // Initialise World settings
    FiercePlanet.Utils.initialiseWorldSettings();

    // Retrieve properties
    World.settings.load();

    // Set up dialogs
    FiercePlanet.Dialogs.setupDialogs();

    // Handle resource drag and drop and click interactions
    FiercePlanet.ResourceUI.initialiseAndLoadResources();

    // Handle resource drag and drop and click interactions
    FiercePlanet.ResourceUI.setupResourceInteraction();

    // Add UI event listeners
    FiercePlanet.GeneralUI.hookUpUIEventListeners();

    // Process settings
    FiercePlanet.Utils.processSettings();

    // Add custom event listeners
    FiercePlanet.Event.hookUpCustomEventListeners();

    // Draw the game
    FiercePlanet.newLevel();
};


/**
 * Called when a new game is commenced
 */
FiercePlanet.newGame = function() {
    if (FiercePlanet.currentLevelPreset)
        FiercePlanet.currentLevelNumber = 1;
    FiercePlanet.currentProfile.resetScores();
    FiercePlanet.gameCounter = 0;
    FiercePlanet.newLevel();
};


/**
 * Called when a new level is begun
 */
FiercePlanet.newLevel = function() {
    FiercePlanet.inDesignMode = false;
    FiercePlanet.levelDelayCounter = 0;
    FiercePlanet.levelCounter = 0;
    FiercePlanet.maxLevelMoves = 0;
    FiercePlanet.currentProfile.updateScore();
//    if (FiercePlanet.currentLevel != undefined)
//        FiercePlanet.currentLevel.setResources([]);
    FiercePlanet.currentNotice = null;
    FiercePlanet.recordedLevels = [];
    FiercePlanet.Utils.bindVariables();

    FiercePlanet._initialiseGame();

//    FiercePlanet.GeneralUI.levelInfo();
    FiercePlanet.currentNotice = FiercePlanet.currentLevel.tip;
    $("#notifications").toggle(World.settings.statusBarVisible);
    FiercePlanet.GeneralUI.notify("Starting level " + FiercePlanet.currentLevel.id + "...");

};


/**
 * Called when a game is restarted
 */
FiercePlanet.restartLevel = function() {
    // Reset the score
    FiercePlanet.currentProfile.revertScore();

    // Start a new level
    FiercePlanet.newLevel();
};



/**
 * Called when a level is started
 */
FiercePlanet.startLevel = function() {
    FiercePlanet._startAudio();
    FiercePlanet.Drawing.animateLevel();
    // Start a new level
    FiercePlanet.newWave();
};

/**
 * Called when a new wave is ready
 */
FiercePlanet.newWave = function() {
    FiercePlanet.maxWaveMoves = 0;
    FiercePlanet.waveCounter = 0;
    FiercePlanet.waveDelayCounter = 0;
    FiercePlanet.currentProfile.current_level_saved_this_wave = 0;

    FiercePlanet.currentLevel.generateAgents(AgentTypes.CITIZEN_AGENT_TYPE, FiercePlanet.numAgents);

    FiercePlanet.GeneralUI.notify("New wave coming...");

    FiercePlanet.Drawing.drawEntryPoints();
    FiercePlanet.Drawing.drawExitPoints();
    FiercePlanet.eventTarget.fire(new Event("game", this, "newWave", $fp.levelCounter, FiercePlanet.currentLevel));

    FiercePlanet._startAgents();
};


/**
 * Called when a level is completed
 */
FiercePlanet.completeWave = function() {
    FiercePlanet.currentWave++;
    FiercePlanet.numAgents++;
    FiercePlanet._finaliseGame();
};


/**
 * Called when a level is completed
 */
FiercePlanet.completeLevel = function() {
    if (FiercePlanet.currentLevel.teardown)
        FiercePlanet.currentLevel.teardown();
    FiercePlanet.currentProfile.compileProfileStats(FiercePlanet.currentLevel);
    if (FiercePlanet.currentLevel.isPresetLevel)
        FiercePlanet.currentLevelNumber++;
    FiercePlanet._stopAudio();
    FiercePlanet._finaliseGame();
    FiercePlanet.Dialogs.showCompleteLevelDialog();
};


/**
 * Called when a game is completed
 */
FiercePlanet.completeGame = function() {
    if (FiercePlanet.currentLevel.teardown)
        FiercePlanet.currentLevel.teardown();
    FiercePlanet.currentProfile.compileProfileStats(FiercePlanet.currentLevel);
    FiercePlanet._stopAudio();
    FiercePlanet._finaliseGame();
    FiercePlanet.Dialogs.showCompleteGameDialog();
};


/**
 * Called when the game is over
 */
FiercePlanet.gameOver = function() {
    if (FiercePlanet.currentLevel.teardown)
        FiercePlanet.currentLevel.teardown();
    FiercePlanet.currentProfile.revertScore();
    FiercePlanet._stopAudio();
    FiercePlanet._finaliseGame();
    FiercePlanet.Dialogs.showGameOverDialog();
};


/**
 * Plays the current game
 */
FiercePlanet.playGame = function() {
    if (FiercePlanet.inPlay) {
        FiercePlanet.pauseGame();
    }
    else {
        FiercePlanet._startAudio();
        $('#playAgents').removeClass('pausing');
        $('#playAgents').addClass('playing');
        if (FiercePlanet.waveCounter == 0)
            FiercePlanet.newWave();
        else
            FiercePlanet._startAgents();
    }
};


/**
 * Pauses the current game
 */
FiercePlanet.pauseGame = function() {
    if (!FiercePlanet.inPlay)
        return;
    FiercePlanet._stopAudio();
    FiercePlanet._stopAgents();
};


/**
 * Slows down the rate of processing agents
 */
FiercePlanet.slowDown = function() {
    if (FiercePlanet.interval < 10)
        FiercePlanet.interval += 1;
    else if (FiercePlanet.interval < 100)
        FiercePlanet.interval += 10;
    FiercePlanet.GeneralUI.notify("Now playing at: " + Math.round(1000 / FiercePlanet.interval) + " frames per second.");
    if (FiercePlanet.inPlay)
        FiercePlanet._startAgents();
};


/**
 * Speeds up the rate of processing agents
 */
FiercePlanet.speedUp = function() {
    if (FiercePlanet.interval > 10)
        FiercePlanet.interval -= 10;
    else if (FiercePlanet.interval > 1)
        FiercePlanet.interval -= 1;
    FiercePlanet.GeneralUI.notify("Now playing at: " + Math.round(1000 / FiercePlanet.interval) + " frames per second.");
    if (FiercePlanet.inPlay)
        FiercePlanet._startAgents();
};


/**
 * Initialises level data
 */
FiercePlanet._initialiseGame = function () {
    if (typeof console != "undefined")
        console.log("Initialising world...");

    // Stop any existing timers
    FiercePlanet._stopAgents();

    if (FiercePlanet.currentLevelPreset && (FiercePlanet.currentLevelNumber < 0 || FiercePlanet.currentLevelNumber > 12))
        FiercePlanet.currentLevelNumber = 1;
    if (FiercePlanet.currentLevelPreset) {
        try {
            FiercePlanet.currentLevel = eval("FiercePlanet.PresetLevels.level" + FiercePlanet.currentLevelNumber.toString());
        }
        catch(err) {
            FiercePlanet.currentLevel = eval("FiercePlanet.PresetLevels.level1");
        }
    }
    else if (FiercePlanet.currentLevel == undefined) {
        FiercePlanet.currentLevel = eval("FiercePlanet.PresetLevels.level1");
    }

    if (FiercePlanet.waveOverride > 0) {
        FiercePlanet.currentLevel.waveNumber = (FiercePlanet.waveOverride);
        FiercePlanet.waveOverride = 0;
    }
    FiercePlanet.currentWave = 1;
    FiercePlanet.currentLevel.setCurrentAgents([]);
    FiercePlanet.currentLevel.resetResources();
    if (FiercePlanet.currentLevel.catastrophe != undefined)
        FiercePlanet.currentLevel.catastrophe.struck = false;

    // Start the audio
    FiercePlanet._stopAudio();

//    score = 0;
    FiercePlanet.currentProfile.resetCurrentStats();


    FiercePlanet.resourceRecoveryCycle = Math.pow(World.settings.rateOfResourceRecovery, FiercePlanet.levelOfDifficulty - 1);

    FiercePlanet.numAgents = FiercePlanet.currentLevel.initialAgentNumber;
    FiercePlanet.worldWidth = FiercePlanet.currentLevel.worldWidth;
    FiercePlanet.worldHeight = FiercePlanet.currentLevel.worldHeight;
    FiercePlanet.cellWidth = Math.round(FiercePlanet.WORLD_WIDTH / FiercePlanet.worldWidth);
    FiercePlanet.cellHeight = Math.round(FiercePlanet.WORLD_HEIGHT / FiercePlanet.worldHeight);
    FiercePlanet.pieceWidth = Math.round(FiercePlanet.cellWidth * 0.5);
    FiercePlanet.pieceHeight = Math.round(FiercePlanet.cellHeight * 0.5);
//    FiercePlanet.cellWidth = FiercePlanet.WORLD_WIDTH / FiercePlanet.worldWidth;
//    FiercePlanet.cellHeight = FiercePlanet.WORLD_HEIGHT / FiercePlanet.worldHeight;
//    FiercePlanet.pieceWidth = FiercePlanet.cellWidth * 0.5;
//    FiercePlanet.pieceHeight = FiercePlanet.cellHeight * 0.5;
    FiercePlanet.scrollingImage.src = "/images/yellow-rain.png";

    // Set up level
    if (FiercePlanet.currentLevel.setup)
        FiercePlanet.currentLevel.setup();

    // Draw the game
    FiercePlanet.Drawing.drawGame();
};


/**
 * Finalises game
 */
FiercePlanet._finaliseGame = function() {
    FiercePlanet._stopAgents();
    FiercePlanet.ProfileUI.storeProfileData();
    FiercePlanet.Drawing.drawScoreboard();
};


/**
 * Starts the processing of agents
 */
FiercePlanet._startAgents = function () {
    FiercePlanet.startTime = new Date();
    if (typeof console != "undefined")
        console.log("Starting agents at " + (FiercePlanet.startTime));

    clearInterval(FiercePlanet.agentTimerId);
    FiercePlanet.agentTimerId = setInterval("FiercePlanet.processAgents()", FiercePlanet.interval);
    FiercePlanet.inPlay = true;

    // Make sure button is on pause
    $('#playAgents').removeClass('pausing');
    $('#playAgents').addClass('playing');
};

/**
 * Stops the processing of agents
 */
FiercePlanet._stopAgents = function () {
    FiercePlanet.stopTime = new Date();
    if (typeof console != "undefined")
        console.log("Pausing agents after " + (FiercePlanet.stopTime - FiercePlanet.startTime));

    // Make sure button is on play
    $('#playAgents').removeClass('playing');
    $('#playAgents').addClass('pausing');

    clearInterval(FiercePlanet.agentTimerId);
    FiercePlanet.inPlay = false;
};

/**
 * Starts the audio
 */
FiercePlanet._startAudio = function () {
// Play sound, if any are set
    if (World.settings.soundsPlayable) {
        if (FiercePlanet.audio != undefined) {
            FiercePlanet.audio.play();
        }
        else if (FiercePlanet.currentLevel.soundSrc != undefined) {
            FiercePlanet.audio = new Audio(FiercePlanet.currentLevel.soundSrc);
            FiercePlanet.audio.loop = true;
            FiercePlanet.audio.addEventListener("ended", function() {
                FiercePlanet.audio.currentTime = 0;
                FiercePlanet.audio.play();
            }, false);
            FiercePlanet.audio.play();
        }
    }
};

/**
 * Stops the audio
 */
FiercePlanet._stopAudio = function() {
    if (World.settings.soundsPlayable) {
        if (FiercePlanet.audio != undefined)
            FiercePlanet.audio.pause();
    }
};
