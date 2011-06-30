/*!
 * Fierce Planet - Params
 * Declares game parameters
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};

/**
 * @constant the profile ID of the current user
 */
FiercePlanet.PROFILE_ID = null;

// Game variable constants
/**
 * @constant The cost of making a move
 */
FiercePlanet.MOVE_HEALTH_COST = -2;
/**
 * @constant The resource bonus for saving a single agent
 */
FiercePlanet.SAVE_SCORE = 10;
/**
 * @constant The default starting resource level
 */
FiercePlanet.STARTING_STORE = 100;
/**
 * @constant The default rate of resource recovery
 */
FiercePlanet.DEFAULT_RESOURCE_RECOVERY = 2;
/**
 * @constant The credit bonus accruing from surviving a level
 */
FiercePlanet.WAVE_GOODNESS_BONUS = 5;

// Timer constants
/**
 * @constant The time to wait before starting the first wave
 */
FiercePlanet.NEW_LEVEL_DELAY = 3000;
/**
 * @constant The time to wait between waves
 */
FiercePlanet.NEW_WAVE_DELAY = 200;


// Difficulty constants
/** @constant Easiest level of difficulty */
FiercePlanet.EASY_DIFFICULTY = 1;
/** @constant Medium level of difficulty */
FiercePlanet.MEDIUM_DIFFICULTY = 2;
/** @constant Hard level of difficulty */
FiercePlanet.HARD_DIFFICULTY = 3;
/** @constant Extreme level of difficulty */
FiercePlanet.EXTREME_DIFFICULTY = 4;

// Dimension constants
/** @constant The width of the world (should equal the width of all canvases */
FiercePlanet.WORLD_WIDTH = 480;
/** @constant The height of the world (should equal the height of all canvases */
FiercePlanet.WORLD_HEIGHT = 400;

/** @constant The default width of notices */
FiercePlanet.WAVE_NOTICE_WIDTH = 200;
/** @constant The default height of notices */
FiercePlanet.WAVE_NOTICE_HEIGHT = 150;



// Resource constants
/** @constant The list of available profile classes */
FiercePlanet.PROFILE_CLASSES = ["Novice", "Planner", "Expert", "Visionary", "Genius"];
/** @constant The costs of obtaining capabilities related to each profile class */
FiercePlanet.CAPABILITY_COSTS = [0, 100, 200, 300, 500];


// TODO: Refactor out
FiercePlanet.NOVICE_CAPABILITIES = ["farm", "water", "clinic"];
FiercePlanet.PLANNER_CAPABILITIES = FiercePlanet.NOVICE_CAPABILITIES.concat(["shop", "park", "school"]);
FiercePlanet.EXPERT_CAPABILITIES = FiercePlanet.PLANNER_CAPABILITIES.concat(["bank", "air", "legal"]);
FiercePlanet.VISIONARY_CAPABILITIES = FiercePlanet.EXPERT_CAPABILITIES.concat(["factory", "energy", "democracy"]);
FiercePlanet.GENIUS_CAPABILITIES = FiercePlanet.VISIONARY_CAPABILITIES.concat(["stockmarket", "biodiversity", "festival"]);


// VARIABLES

// Profile variables
FiercePlanet.currentProfile = new Profile();
FiercePlanet.capabilities = ["farm", "water", "clinic"];
FiercePlanet.profileClass = "Novice";
FiercePlanet.credits = 0;
FiercePlanet.totalSaved = 0;
FiercePlanet.previousLevelScore = 0;
FiercePlanet.currentScore = 0;
FiercePlanet.resourcesInStore = 0;
FiercePlanet.resourcesSpent = 0;
FiercePlanet.expiredAgentCount = 0;
FiercePlanet.savedAgentCount = 0;
FiercePlanet.savedAgentThisWaveCount = 0;
FiercePlanet.resourceStatsCount = {};



// Toggleable variables
FiercePlanet.inDesignMode = false;
FiercePlanet.inPlay = false;
FiercePlanet.isMouseDown = false;
FiercePlanet.isMouseMoving = false;

// Setting variables
FiercePlanet.scrollingImageVisible = true;
FiercePlanet.noticesVisible = true;
FiercePlanet.agentsCanCommunicate = true;
FiercePlanet.catastrophesVisible = true;

FiercePlanet.disableKeyboardShortcuts = false;
FiercePlanet.soundsPlayable = false;

FiercePlanet.recording = false;

FiercePlanet.invisiblePath = false;
FiercePlanet.agentTracing = false;

FiercePlanet.resourcesUpgradeable = false;
FiercePlanet.resourcesInTension = false;
FiercePlanet.resourceBonus = false;
FiercePlanet.applyGeneralHealth = false;
FiercePlanet.ignoreResourceBalance = false;

FiercePlanet.godMode = false;

// Dev options
FiercePlanet.predatorsVisible = false;
FiercePlanet.rivalsVisible = false;
FiercePlanet.tilesMutable = false;
FiercePlanet.tilesRemovable = false;
FiercePlanet.backgroundIconsVisible = false;



// Resource variables
FiercePlanet.resourceTypeNamespace = TBL;
FiercePlanet.resourceCategories = [];
FiercePlanet.resourceTypes = [];


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


FiercePlanet.waveCounter = 0;
FiercePlanet.levelCounter = 0;
FiercePlanet.gameCounter = 0;
FiercePlanet.globalRecordingCounter = 0;





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
FiercePlanet.$settingsDialog = null;
FiercePlanet.$genericDialog = null;



// Level editor dialogs
FiercePlanet.$designFeatures = null;
FiercePlanet.$editProperties = null;

