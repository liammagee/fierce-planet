/**
 * Lifecycle related methods
 */


/**
 * Called when a game is loaded
 */
function loadGame() {
    // Load relevant settings, if available
    loadSettingsFromStorage();

    // Set up dialogs
    setupDialogs();

    // Handle resource drag and drop and click interactions
    ResourceUI.setupResourceInteraction();

    // Add general event listeners
    hookUpUIEventListeners();

    // Draw the game
    _initialiseGame();
}


/**
 * Called when a new game is commenced
 */
function newGame() {
    if (currentLevelPreset)
        currentLevelNumber = 1;
    score = 0;
    previousLevelScore = 0;
    newLevel();
}


/**
 * Called when a new level is begun
 */
function newLevel() {
    inDesignMode = false;
    levelDelayCounter = 0;
    maxLevelMoves = 0;
    previousLevelScore = score;
    if (currentLevel != undefined)
        currentLevel.setResources(new Array());
    recordedLevels = new Array();

    levelInfo(currentLevel.getNotice());
    notify("Starting level " + currentLevel.getId() + "...");

    _initialiseGame();

    newWave();
}


/** Called when a game is restarted */
function restartLevel() {
    // Reset the score
    score = previousLevelScore;

    // Start a new level
    newLevel();
}


/**
 * Called when a new wave is ready
 */
function newWave() {
    maxWaveMoves = 0;
    globalCounter = 0;
    waveDelayCounter = 0;
    savedAgentThisWaveCount = 0;

    currentLevel.presetAgents(AgentTypes.CITIZEN_AGENT_TYPE, numAgents, agentsCanCommunicate);

    notify("New wave coming...");
    _startAgents();
}


/**
 * Called when a level is completed
 */
function completeWave() {
    _finaliseGame();
    waves++;
    numAgents++;
}


/**
 * Called when a level is completed
 */
function completeLevel() {
    _finaliseGame();
    if (currentLevel.isPresetLevel())
        currentLevelNumber++;
    showCompleteLevelDialog();
}


/**
 * Called when the game is over
 */
function gameOver() {
    score = previousLevelScore;
    _finaliseGame();
    showGameOverDialog();
}


/**
 * Called when a game is completed
 */
function completeGame() {
    _finaliseGame();
    showCompleteGameDialog();
}


/**
 * Plays the current game
 */
function playGame() {
    if (inPlay)
        return;
    if (globalCounter == 0)
        newWave();
    else
        _startAgents();
}


/**
 * Pauses the current game
 */
function pauseGame() {
    if (!inPlay)
        return;
    _stopAgents();
}


/**
 * Slows down the rate of processing agents
 */
function slowDown() {
    if (interval < 10)
        interval += 1;
    else if (interval < 100)
        interval += 10;
    if (inPlay)
        _startAgents();
}


/**
 * Speeds up the rate of processing agents
 */
function speedUp() {
    if (interval > 10)
        interval -= 10;
    else if (interval > 1)
        interval -= 1;
    if (inPlay)
        _startAgents();
}


/**
 * Initialises level data
 */
function _initialiseGame() {
    console.log("Initialising world...");

    // Stop any existing timers
    _stopAgents();

    if (currentLevelNumber < 1 || currentLevelNumber > 10)
        currentLevelNumber = 1;
    if (currentLevelPreset) {
        try {
            currentLevel = eval("level" + currentLevelNumber.toString());
        }
        catch(err) {
            // Silently fail - current level stays the same if undefined
        }
    }
    else if (currentLevel == undefined) {
        currentLevel = eval("level1");
    }

    if (waveOverride > 0) {
        currentLevel.setWaveNumber(waveOverride);
        waveOverride = 0;
    }
    resourcesInStore = currentLevel.getInitialResourceStore();
    if (resourcesInStore == undefined || resourcesInStore == null) {
        resourcesInStore = STARTING_STORE;
    }

    currentLevel.setCurrentAgents(new Array());
    currentLevel.setResources(new Array());

//    score = 0;
    economicResourceCount = 0;
    environmentalResourceCount = 0;
    socialResourceCount = 0;
    expiredAgentCount = 0;
    savedAgentCount = 0;
    waves = 1;

    resourceRecoveryCycle = Math.pow(DEFAULT_RESOURCE_RECOVERY, levelOfDifficulty - 1);

    numAgents = currentLevel.getInitialAgentNumber();
    worldWidth = currentLevel.getWorldWidth();
    worldHeight = currentLevel.getWorldHeight();
    cellWidth = WORLD_WIDTH / worldWidth;
    cellHeight = WORLD_HEIGHT / worldHeight;
    pieceWidth = cellWidth * 0.5;
    pieceHeight = cellHeight * 0.5;
    scrollingImage.src = "/images/yellow-rain.png";

    // Set up level
    currentLevel.setup();

    // Draw the game
    drawGame();
}


/**
 * Finalises game
 */
function _finaliseGame() {
    _stopAgents();
    storeData();
    drawScoreboard();
}


/**
 * Starts the processing of agents
 */
function _startAgents() {
    console.log("Starting agents...");

    clearInterval(agentTimerId);
    agentTimerId = setInterval("processAgents()", interval);
    inPlay = true;


    // Play sound, if any are set
    if (audio != undefined)
        audio.pause();
    if (currentLevel.getSoundSrc() != undefined) {
//        var audio = $("background-sound")[0];
//        audio.src = currentLevel.getSoundSrc();

        audio = new Audio(currentLevel.getSoundSrc());
        audio.loop = true;
        audio.addEventListener("ended", function(){audio.currentTime = 0; audio.play();}, false);
        audio.play();
    }
}

/**
 * Stops the processing of agents
 */
function _stopAgents() {
    console.log("Pausing agents...");

    clearInterval(agentTimerId);
    inPlay = false;

    if (audio != undefined)
        audio.pause();
}
