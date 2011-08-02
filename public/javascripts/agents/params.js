/*!
 * Fierce Planet - Params
 * Declares game parameters
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};

// Game parameters

/**
 * @constant The time to wait before starting the first wave
 */
FiercePlanet.NEW_LEVEL_DELAY = 3000;
/**
 * @constant The time to wait between waves
 */
FiercePlanet.NEW_WAVE_DELAY = 200;

FiercePlanet.resourceRecoveryCycle = 5;
FiercePlanet.interval = 20;


/**
 * @constant The resource bonus for saving a single agent
 */
FiercePlanet.SAVE_SCORE = 10;
/**
 * @constant The default starting resource level
 */
FiercePlanet.STARTING_STORE = 100;
/**
 * @constant The credit bonus accruing from surviving a level
 */
FiercePlanet.WAVE_GOODNESS_BONUS = 5;




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

// VARIABLES

// Current state variables
World.resourceTypeNamespace = TBL;
FiercePlanet.currentProfile = new Profile();
FiercePlanet.currentLevelNumber = 1;
FiercePlanet.currentWave = 1;
FiercePlanet.currentLevelPreset = true;
FiercePlanet.currentLevel = null;
FiercePlanet.existingCurrentLevel = null;
FiercePlanet.currentResourceId = null;
FiercePlanet.currentResource = null;
FiercePlanet.currentNotice = null;


// Boolean state variables
FiercePlanet.inDesignMode = false;
FiercePlanet.inPlay = false;
FiercePlanet.isMouseDown = false;
FiercePlanet.isMouseMoving = false;



// Timer variables
FiercePlanet.agentTimerId = 0;
FiercePlanet.eventTarget = new EventTarget();
FiercePlanet.recordedLevels = [];


// Game play variables
FiercePlanet.waveOverride = 0;
FiercePlanet.maxWaveMoves = 0;
FiercePlanet.maxLevelMoves = 0;

FiercePlanet.levelOfDifficulty = FiercePlanet.MEDIUM_DIFFICULTY;

FiercePlanet.levelDelayCounter = 0;
FiercePlanet.waveDelayCounter = 0;

FiercePlanet.numAgents = 1;
FiercePlanet.waveCounter = 0;
FiercePlanet.levelCounter = 0;
FiercePlanet.gameCounter = 0;
FiercePlanet.globalRecordingCounter = 0;



// Dimension variables
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


// Viewport variables
FiercePlanet.zoomLevel = 1;
FiercePlanet.externalZoomLevel = 1;

FiercePlanet.panLeftOffset = 0;
FiercePlanet.panTopOffset = 0;

FiercePlanet.currentX = null;
FiercePlanet.currentY = null;



