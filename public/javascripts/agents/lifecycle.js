/**
 * Lifecycle related methods
 */

/**
 * Declare the FiercePlanet namespace
 */
var FiercePlanet = FiercePlanet || {};


/**
 * Called when a game is loaded
 */
FiercePlanet.loadGame = function() {
    // Load relevant settings, if available
    FiercePlanet.loadSettingsFromStorage();

    // Set up dialogs
    FiercePlanet.setupDialogs();

    // Handle resource drag and drop and click interactions
    FiercePlanet.setupResourceInteraction();

    // Add general event listeners
    FiercePlanet.hookUpUIEventListeners();

    // Draw the game
    FiercePlanet._initialiseGame();
};


/**
 * Called when a new game is commenced
 */
FiercePlanet.newGame = function() {
    if (FiercePlanet.currentLevelPreset)
        FiercePlanet.currentLevelNumber = 1;
    FiercePlanet.currentScore = 0;
    FiercePlanet.previousLevelScore = 0;
    FiercePlanet.newLevel();
};


/**
 * Called when a new level is begun
 */
FiercePlanet.newLevel = function() {
    FiercePlanet.inDesignMode = false;
    FiercePlanet.levelDelayCounter = 0;
    FiercePlanet.maxLevelMoves = 0;
    FiercePlanet.previousLevelScore = FiercePlanet.currentScore;
    if (FiercePlanet.currentLevel != undefined)
        FiercePlanet.currentLevel.setResources([]);
    FiercePlanet.recordedLevels = [];

    FiercePlanet._initialiseGame();

    FiercePlanet.levelInfo(FiercePlanet.currentLevel.getNotice());
    FiercePlanet.notify("Starting level " + FiercePlanet.currentLevel.getId() + "...");

//    newWave();
};


/**
 * Called when a game is restarted
 */
FiercePlanet.restartLevel = function() {
    // Reset the score
    FiercePlanet.currentScore = FiercePlanet.previousLevelScore;

    // Start a new level
    FiercePlanet.newLevel();
};


/**
 * Called when a new wave is ready
 */
FiercePlanet.newWave = function() {
    FiercePlanet.maxWaveMoves = 0;
    FiercePlanet.waveCounter = 0;
    FiercePlanet.waveDelayCounter = 0;
    FiercePlanet.savedAgentThisWaveCount = 0;

    FiercePlanet.currentLevel.presetAgents(AgentTypes.CITIZEN_AGENT_TYPE, FiercePlanet.numAgents, FiercePlanet.agentsCanCommunicate);

    FiercePlanet.notify("New wave coming...");
    FiercePlanet.waveNoticeX = Math.random() * (FiercePlanet.WORLD_WIDTH - FiercePlanet.WAVE_NOTICE_WIDTH);
    FiercePlanet.waveNoticeY = Math.random() * (FiercePlanet.WORLD_HEIGHT - FiercePlanet.WAVE_NOTICE_HEIGHT);
    FiercePlanet.drawEntryPoints();
    FiercePlanet.drawExitPoints();
    FiercePlanet._startAgents();
};


/**
 * Called when a level is completed
 */
FiercePlanet.completeWave = function() {
    FiercePlanet._finaliseGame();
    FiercePlanet.currentWave++;
    FiercePlanet.numAgents++;
};


/**
 * Called when a level is completed
 */
FiercePlanet.completeLevel = function() {
    FiercePlanet._finaliseGame();
    if (FiercePlanet.currentLevel.isPresetLevel())
        FiercePlanet.currentLevelNumber++;
    FiercePlanet.showCompleteLevelDialog();
};


/**
 * Called when the game is over
 */
FiercePlanet.gameOver = function() {
    FiercePlanet.currentScore = FiercePlanet.previousLevelScore;
    FiercePlanet._finaliseGame();
    FiercePlanet.showGameOverDialog();
};


/**
 * Called when a game is completed
 */
FiercePlanet.completeGame = function() {
    FiercePlanet._finaliseGame();
    FiercePlanet.showCompleteGameDialog();
};


/**
 * Plays the current game
 */
FiercePlanet.playGame = function() {
    if (FiercePlanet.inPlay)
        return;
    if (FiercePlanet.waveCounter == 0)
        FiercePlanet.newWave();
    else
        FiercePlanet._startAgents();
};


/**
 * Pauses the current game
 */
FiercePlanet.pauseGame = function() {
    if (!FiercePlanet.inPlay)
        return;
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
    if (FiercePlanet.inPlay)
        FiercePlanet._startAgents();
};


/**
 * Initialises level data
 */
FiercePlanet._initialiseGame = function () {
//    console.log("Initialising world...");

    // Stop any existing timers
    FiercePlanet._stopAgents();

    if (FiercePlanet.currentLevelNumber < 0 || FiercePlanet.currentLevelNumber > 10)
        FiercePlanet.currentLevelNumber = 1;
    if (FiercePlanet.currentLevel != undefined && FiercePlanet.currentLevelPreset) {
        try {
            FiercePlanet.currentLevel = eval("PresetLevels.level" + FiercePlanet.currentLevelNumber.toString());
        }
        catch(err) {
            // Silently fail - current level stays the same if undefined
        }
    }
    else if (FiercePlanet.currentLevel == undefined) {
        FiercePlanet.currentLevel = eval("PresetLevels.level1");
    }

    if (FiercePlanet.waveOverride > 0) {
        FiercePlanet.currentLevel.setWaveNumber(FiercePlanet.waveOverride);
        FiercePlanet.waveOverride = 0;
    }
    FiercePlanet.resourcesInStore = FiercePlanet.currentLevel.getInitialResourceStore();
    if (FiercePlanet.resourcesInStore == undefined || FiercePlanet.resourcesInStore == null) {
        FiercePlanet.resourcesInStore = FiercePlanet.STARTING_STORE;
    }

    FiercePlanet.currentLevel.setCurrentAgents([]);
    FiercePlanet.currentLevel.setResources([]);

//    score = 0;
    FiercePlanet.economicResourceCount = 0;
    FiercePlanet.environmentalResourceCount = 0;
    FiercePlanet.socialResourceCount = 0;
    FiercePlanet.expiredAgentCount = 0;
    FiercePlanet.savedAgentCount = 0;
    FiercePlanet.currentWave = 1;

    FiercePlanet.resourceRecoveryCycle = Math.pow(FiercePlanet.DEFAULT_RESOURCE_RECOVERY, FiercePlanet.levelOfDifficulty - 1);

    FiercePlanet.numAgents = FiercePlanet.currentLevel.getInitialAgentNumber();
    FiercePlanet.worldWidth = FiercePlanet.currentLevel.getWorldWidth();
    FiercePlanet.worldHeight = FiercePlanet.currentLevel.getWorldHeight();
    FiercePlanet.cellWidth = FiercePlanet.WORLD_WIDTH / FiercePlanet.worldWidth;
    FiercePlanet.cellHeight = FiercePlanet.WORLD_HEIGHT / FiercePlanet.worldHeight;
    FiercePlanet.pieceWidth = FiercePlanet.cellWidth * 0.5;
    FiercePlanet.pieceHeight = FiercePlanet.cellHeight * 0.5;
    FiercePlanet.scrollingImage.src = "/images/yellow-rain.png";

    // Set up level
    FiercePlanet.currentLevel.setup();

    // Draw the game
    FiercePlanet.drawGame();
};


/**
 * Finalises game
 */
FiercePlanet._finaliseGame = function() {
    FiercePlanet._stopAgents();
    FiercePlanet.storeData();
    FiercePlanet.drawScoreboard();
};


/**
 * Starts the processing of agents
 */
FiercePlanet._startAgents = function () {
//    console.log("Starting agents...");

    clearInterval(FiercePlanet.agentTimerId);
    FiercePlanet.agentTimerId = setInterval("FiercePlanet.processAgents()", FiercePlanet.interval);
    FiercePlanet.inPlay = true;


    // Play sound, if any are set
    if (FiercePlanet.audio != undefined)
        FiercePlanet.audio.pause();
    if (FiercePlanet.currentLevel.getSoundSrc() != undefined) {
//        var audio = $("background-sound")[0];
//        audio.src = FiercePlanet.currentLevel.getSoundSrc();

        FiercePlanet.audio = new Audio(FiercePlanet.currentLevel.getSoundSrc());
        FiercePlanet.audio.loop = true;
        FiercePlanet.audio.addEventListener("ended", function(){FiercePlanet.audio.currentTime = 0; FiercePlanet.audio.play();}, false);
        FiercePlanet.audio.play();
    }
};

/**
 * Stops the processing of agents
 */
FiercePlanet._stopAgents = function () {
//    console.log("Pausing agents...");

    clearInterval(FiercePlanet.agentTimerId);
    FiercePlanet.inPlay = false;

    if (FiercePlanet.audio != undefined)
        FiercePlanet.audio.pause();
};
