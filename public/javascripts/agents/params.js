/**
 * Declares game parameters
 */

var LEVELS = 10;

// Game variable constants
var MOVE_HEALTH_COST = -2;
var SURVIVAL_SCORE = 10;
var STARTING_STORE = 100;
var RESOURCE_STORE = 10;
var DEFAULT_RESOURCE_RECOVERY = 2;
var WAVE_GOODNESS_BONUS = 5;

// Timer constants
var NEW_LEVEL_DELAY = 3000;
var NEW_WAVE_DELAY = 200;


// Difficulty constants
var EASY_DIFFICULTY = 1;
var MEDIUM_DIFFICULTY = 2;
var HARD_DIFFICULTY = 3;
var EXTREME_DIFFICULTY = 4;

// Dimension constants
var WORLD_WIDTH = 800;
var WORLD_HEIGHT = 600;


// Resource constants
var PROFILE_CLASSES = ["Novice", "Planner", "Expert", "Visionary", "Genius"];
var CAPABILITY_COSTS = [0, 100, 200, 300, 500];
var NOVICE_CAPABILITIES = ["farm", "water", "clinic"];
var PLANNER_CAPABILITIES = NOVICE_CAPABILITIES.concat(["shop", "park", "school"]);
var EXPERT_CAPABILITIES = PLANNER_CAPABILITIES.concat(["bank", "air", "legal"]);
var VISIONARY_CAPABILITIES = EXPERT_CAPABILITIES.concat(["factory", "energy", "democracy"]);
var GENIUS_CAPABILITIES = VISIONARY_CAPABILITIES.concat(["stockmarket", "biodiversity", "festival"]);


// VARIABLES

// Profile variables
var capabilities = ["farm", "water", "clinic"];
var credits = 0;
var profileClass = "Novice";
//var credits = 10000;
//var profileClass = "Genius";
var totalSaved = 0;

var PROFILE_ID;

// Togglable variables
var inDesignMode = false;
var inPlay = false;
var mouseDown = false;
var mouseMoving = false;

// Setting variables
var godMode = false;
var invisiblePath = false;
var agentsCanCommunicate = true;
var agentTracing = false;
var recording = false;
var soundsPlayable = false;
var resourcesInTension = false;
var resourceBonus = false;
var predatorsVisible = false;
var rivalsVisible = false;
var backgroundIconsVisible = false;
var applyGeneralHealth = false;
var ignoreResourceBalance = false;
var tilesMutable = false;


// Timer variables
var agentTimerId = 0;

var recordedLevels = new Array();

// Current state
var currentResourceId = null;
var currentLevelNumber = 1;
var currentLevelPreset = true;
var currentLevel;
var existingCurrentLevel;
var currentResource = null;


// Game play variables
var waveOverride = 0;
var maxWaveMoves = 0;
var maxLevelMoves = 0;

var levelOfDifficulty = MEDIUM_DIFFICULTY;
var resourceRecoveryCycle = 5;
var interval = 20;

var levelDelayCounter = 0;
var waveDelayCounter = 0;

var numAgents = 1;



var economicResourceCount = 0;
var environmentalResourceCount = 0;
var socialResourceCount = 0;

var globalCounter = 0;
var globalRecordingCounter = 0;



var previousLevelScore = 0;
var score = 0;
var resourcesInStore = 0;
var resourcesSpent = 0;
var waves = 1;
var expiredAgentCount = 0;
var savedAgentCount = 0;
var savedAgentThisWaveCount = 0;


// Dimension variables
var zoomLevel = 1;
var panLeftOffset = 0;
var panTopOffset = 0;

var worldWidth = 14;
var worldHeight = 11;
var cellWidth = WORLD_WIDTH / worldWidth;
var cellHeight = WORLD_HEIGHT / worldHeight;
var pieceWidth = cellWidth * 0.5;
var pieceHeight = cellHeight * 0.5;



// General visual and audio variables
var scrollingImage = new Image(); // City image
var scrollingImageX = 0;
var scrollingImageOffset = 1;

var audio;
var googleMap;
