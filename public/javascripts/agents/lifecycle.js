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
    redrawWorld();
}


/**
 * Called when a new game is commenced
 */
function newGame() {
    inDesignMode = false;
    if (currentLevelPreset)
        currentLevelNumber = 1;
    score = 0;
    previousLevelScore = 0;
    storeCurrentLevelData();
    var radius = (pieceWidth / 4);
    var bodyLength = (pieceWidth / 2);
    recordedLevels = new Array();


    restartLevel();
}


/**
 * Called when a new level is begun
 */
function newLevel() {
    maxLevelMoves = 0;
    currentLevelNumber++;
    previousLevelScore = score;
    currentLevel.setResources(new Array());
    recordedLevels = new Array();
    redrawWorld();

    levelInfo(currentLevel.getNotice());
    console.log("Starting level " + currentLevelNumber + " ...");
    notify("Starting level " + currentLevelNumber + "...");

    startAgents();
}


/**
 * Called when a new wave is ready
 */
function newWave() {
    maxWaveMoves = 0;
    globalCounter = 0;
    savedAgentThisWaveCount = 0;
    waves ++;

    currentLevel.presetAgents(AgentTypes.CITIZEN_AGENT_TYPE, ++numAgents);
    var agents = currentLevel.getCurrentAgents();
    for (var i = 0; i < agents.length; i++) {
        var agent = agents[i];
        agent.setCanCommunicateWithOtherAgents(agentsCanCommunicate);
    }

    notify("New wave coming...");
}


/**
 * Called when a level is completed
 */
function completeLevel() {
    stopAgents();
    storeData();
    drawScoreboard();
    showCompleteLevelDialog();
}


/**
 * Called when the game is over
 */
function gameOver() {
    stopAgents();
    storeData();
    drawScoreboard();
    showGameOverDialog();
}


/**
 * Called when a game is completed
 */
function completeGame() {
    stopAgents();
    storeData();
    drawScoreboard();
    showCompleteGameDialog();
}



function restartLevel() {
    inDesignMode = false;
    score = previousLevelScore;
    currentLevel.setResources(new Array());
    recordedLevels = new Array();
    redrawWorld();
}

function redrawWorld() {

    // Stop any existing timers
    stopAgents();


    // Initialise the world
    initWorld();

    // Reset existing resources
    ResourceUI.resetResourceYields();


    drawWorld();
}

function initWorld() {
    console.log("Initialising world...");

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
    currentLevel.preSetup();
    currentLevel.setup();

    // Determine whether agents can communicate
    var agents = currentLevel.getCurrentAgents();
    for (var i = 0; i < agents.length; i++) {
        var agent = agents[i];
        agent.setCanCommunicateWithOtherAgents(agentsCanCommunicate);
    }
}
