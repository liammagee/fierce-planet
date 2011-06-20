/**
 * Declares game parameters
 */

/**
 * Declare the FiercePlanet namespace
 */
var FiercePlanet = FiercePlanet || {};

// Profile ID
FiercePlanet.PROFILE_ID = null;

// Game variable constants
FiercePlanet.MOVE_HEALTH_COST = -2;
FiercePlanet.SAVE_SCORE = 10;
FiercePlanet.STARTING_STORE = 100;
FiercePlanet.DEFAULT_RESOURCE_RECOVERY = 2;
FiercePlanet.WAVE_GOODNESS_BONUS = 5;

// Timer constants
FiercePlanet.NEW_LEVEL_DELAY = 3000;
FiercePlanet.NEW_WAVE_DELAY = 200;


// Difficulty constants
FiercePlanet.EASY_DIFFICULTY = 1;
FiercePlanet.MEDIUM_DIFFICULTY = 2;
FiercePlanet.HARD_DIFFICULTY = 3;
FiercePlanet.EXTREME_DIFFICULTY = 4;

// Dimension constants
FiercePlanet.WORLD_WIDTH = 480;
FiercePlanet.WORLD_HEIGHT = 400;
FiercePlanet.WAVE_NOTICE_WIDTH = 200;
FiercePlanet.WAVE_NOTICE_HEIGHT = 100;



// Resource constants
FiercePlanet.PROFILE_CLASSES = ["Novice", "Planner", "Expert", "Visionary", "Genius"];
FiercePlanet.CAPABILITY_COSTS = [0, 100, 200, 300, 500];
FiercePlanet.NOVICE_CAPABILITIES = ["farm", "water", "clinic"];
FiercePlanet.PLANNER_CAPABILITIES = FiercePlanet.NOVICE_CAPABILITIES.concat(["shop", "park", "school"]);
FiercePlanet.EXPERT_CAPABILITIES = FiercePlanet.PLANNER_CAPABILITIES.concat(["bank", "air", "legal"]);
FiercePlanet.VISIONARY_CAPABILITIES = FiercePlanet.EXPERT_CAPABILITIES.concat(["factory", "energy", "democracy"]);
FiercePlanet.GENIUS_CAPABILITIES = FiercePlanet.VISIONARY_CAPABILITIES.concat(["stockmarket", "biodiversity", "festival"]);


// VARIABLES

// Profile variables
FiercePlanet.capabilities = ["farm", "water", "clinic"];
FiercePlanet.credits = 0;
FiercePlanet.profileClass = "Novice";
//FiercePlanet.credits = 10000;
//FiercePlanet.profileClass = "Genius";
FiercePlanet.totalSaved = 0;



// Toggleable variables
FiercePlanet.inDesignMode = false;
FiercePlanet.inPlay = false;
FiercePlanet.isMouseDown = false;
FiercePlanet.isMouseMoving = false;

// Setting variables
FiercePlanet.godMode = false;
FiercePlanet.invisiblePath = false;
FiercePlanet.scrollingImageVisible = false;
FiercePlanet.agentsCanCommunicate = true;
FiercePlanet.noticesVisible = false;
FiercePlanet.agentTracing = false;
FiercePlanet.recording = false;
FiercePlanet.soundsPlayable = false;
FiercePlanet.resourcesInTension = false;
FiercePlanet.resourceBonus = false;
FiercePlanet.predatorsVisible = false;
FiercePlanet.rivalsVisible = false;
FiercePlanet.backgroundIconsVisible = false;
FiercePlanet.applyGeneralHealth = false;
FiercePlanet.ignoreResourceBalance = false;
FiercePlanet.tilesMutable = false;


// Timer variables
FiercePlanet.agentTimerId = 0;
FiercePlanet.eventTarget = new EventTarget();
FiercePlanet.recordedLevels = [];

// Current state
FiercePlanet.currentLevelNumber = 1;
FiercePlanet.currentWave = 1;
FiercePlanet.currentLevelPreset = true;
FiercePlanet.currentLevel = null;
FiercePlanet.existingCurrentLevel = null;
FiercePlanet.currentResourceId = null;
FiercePlanet.currentResource = null;
FiercePlanet.currentNotice = null;


// Game play variables
FiercePlanet.waveOverride = 0;
FiercePlanet.maxWaveMoves = 0;
FiercePlanet.maxLevelMoves = 0;

FiercePlanet.levelOfDifficulty = FiercePlanet.MEDIUM_DIFFICULTY;
FiercePlanet.resourceRecoveryCycle = 5;
FiercePlanet.interval = 20;

FiercePlanet.levelDelayCounter = 0;
FiercePlanet.waveDelayCounter = 0;

FiercePlanet.numAgents = 1;



FiercePlanet.economicResourceCount = 0;
FiercePlanet.environmentalResourceCount = 0;
FiercePlanet.socialResourceCount = 0;

FiercePlanet.waveCounter = 0;
FiercePlanet.levelCounter = 0;
FiercePlanet.gameCounter = 0;
FiercePlanet.globalRecordingCounter = 0;



FiercePlanet.previousLevelScore = 0;
FiercePlanet.currentScore = 0;
FiercePlanet.resourcesInStore = 0;
FiercePlanet.resourcesSpent = 0;
FiercePlanet.expiredAgentCount = 0;
FiercePlanet.savedAgentCount = 0;
FiercePlanet.savedAgentThisWaveCount = 0;


// Dimension variables
FiercePlanet.zoomLevel = 1;
FiercePlanet.externalZoomLevel = 1;

FiercePlanet.panLeftOffset = 0;
FiercePlanet.panTopOffset = 0;

FiercePlanet.worldWidth = 14;
FiercePlanet.worldHeight = 11;
FiercePlanet.cellWidth = FiercePlanet.WORLD_WIDTH / FiercePlanet.worldWidth;
FiercePlanet.cellHeight = FiercePlanet.WORLD_HEIGHT / FiercePlanet.worldHeight;
FiercePlanet.pieceWidth = FiercePlanet.cellWidth * 0.5;
FiercePlanet.pieceHeight = FiercePlanet.cellHeight * 0.5;



// General visual and audio variables
FiercePlanet.scrollingImage = new Image(); // City image
FiercePlanet.scrollingImageX = 0;
FiercePlanet.scrollingImageOffset = 1;

FiercePlanet.audio = null;
FiercePlanet.googleMap = null;


// Level editor variables
FiercePlanet.currentX = null;
FiercePlanet.currentY = null;


// Main game dialogs
FiercePlanet.$gameOver = null;
FiercePlanet.$completeLevel = null;
FiercePlanet.$completeGame = null;
FiercePlanet.$levelList = null;
FiercePlanet.$upgradeDelete = null;
FiercePlanet.$resourceGallery = null;
FiercePlanet.$newLevel = null;


// Level editor dialogs
FiercePlanet.$designFeatures = null;
FiercePlanet.$editProperties = null;

