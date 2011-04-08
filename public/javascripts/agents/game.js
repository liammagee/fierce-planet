

/* NB: classes.js and relevant level sources must be pre-loaded */

/* Constants */


var LEVELS = 10;

var MOVE_INCREMENTS = 5;
var INITIAL_HEALTH = 100;
var MOVE_HEALTH_COST = -2;
var SURVIVAL_SCORE = 10;
var STARTING_STORE = 100;

var RESOURCE_STORE = 10;
var DEFAULT_RESOURCE_RECOVERY = 2;
var WAVE_GOODNESS_BONUS = 5;


var NEW_LEVEL_DELAY = 3000;
var NEW_WAVE_DELAY = 200;

var EASY_DIFFICULTY = 1;
var MEDIUM_DIFFICULTY = 2;
var HARD_DIFFICULTY = 3;
var EXTREME_DIFFICULTY = 4;

var WORLD_WIDTH = 400;






/* Global variables */


// Profile properties
var PROFILE_CLASSES = ["Novice", "Planner", "Expert", "Visionary", "Genius"];
var CAPABILITY_COSTS = [0, 100, 200, 300, 500];
var NOVICE_CAPABILITIES = ["farm", "water", "clinic"];
var PLANNER_CAPABILITIES = NOVICE_CAPABILITIES.concat(["shop", "park", "school"]);
var EXPERT_CAPABILITIES = PLANNER_CAPABILITIES.concat(["bank", "air", "legal-system"]);
var VISIONARY_CAPABILITIES = EXPERT_CAPABILITIES.concat(["factory", "renewable-energy", "democracy"]);
var GENIUS_CAPABILITIES = VISIONARY_CAPABILITIES.concat(["stockmarket", "biodiversity", "festival"]);

var capabilities = ["farm", "water", "clinic"];
var credits = 0;
var profileClass = "Novice";
//var credits = 10000;
//var profileClass = "Genius";
var totalSaved = 0;

var PROFILE_ID;

// Toggleable values
var inDesignMode = false;
var inPlay = false;
var mouseDown = false;
var mouseMoving = false;

// Toggleable parameter values
var godMode = false;
var soundsPlayable = false;
var resourcesInTension = false;
var resourceBonus = false;
var predatorsVisible = false;
var rivalsVisible = false;
var backgroundIconsVisible = false;
var applyGeneralHealth = false;
var ignoreResourceBalance = false;


var agentTimerId = 0;

var currentResourceId = null;
var resourceTypes = {};

var currentLevelNumber = 1;
var currentLevel;
var waveOverride = 0;
var maxWaveMoves = 0;
var maxLevelMoves = 0;

var levelOfDifficulty = MEDIUM_DIFFICULTY;
var resourceRecoveryCycle = 5;
var interval = 20;

var levelDelayCounter = 0;
var waveDelayCounter = 0;

var numAgents = 1;

var agents;
var oldTiles = new Array();
var resources = new Array();
var economicResourceCount = 0;
var environmentalResourceCount = 0;
var socialResourceCount = 0;
var cells = {};
var counter = 0;
var counterLoops = 0;

var previousLevelScore = 0;
var score = 0;
var resourcesInStore = 0;
var resourcesSpent = 0;
var waves = 1;
var expiredAgentCount = 0;
var savedAgentCount = 0;
var savedAgentThisWaveCount = 0;


var worldSize = 11;
var cellWidth = WORLD_WIDTH / worldSize;
var pieceWidth = cellWidth * 0.5;
var currentResource = null;


var scrollingImage = new Image(); // City image
var scrollingImageX = 0;
var scrollingImageOffset = 1;

var zoomLevel = 1;
var panLeftOffset = 0;
var panTopOffset = 0;


/* Dialogs */
var $gameOver;
var $completeLevel;
var $completeGame;
var $levelSetup;
var $levelList;
var $upgradeDelete;
var $resourceGallery;


/* Initialisation code: start game and dialog boxes */

// Always send the authenticity_token with ajax
$(document).ajaxSend(function(event, request, settings) {
    if ( settings.type == 'post' ) {
        settings.data = (settings.data ? settings.data + "&" : "")
            + "authenticity_token=" + encodeURIComponent( AUTH_TOKEN );
    }
});

$(document).ready(function() {

    // Reload the game when the level 1 image is loaded (TODO: how should other levels be handled?)
    if(level1.getImage().complete) reloadGame()
    else level1.getImage().onload= reloadGame;


    // Set up dialogs
    setupDialogs();

    // Set up resource types
    setupResourceTypes();


    // Handle resource drag and drop and click interactions
    setupResourceInteraction();



    // Add general event listeners
   hookUpUIEventListeners()
});




/* UI functions */
// Setup dialogs
function setupDialogs() {
    // Dialogs
    $statsDialog = $('<div></div>')
		.dialog({
			autoOpen: false,
            modal: true,
			title: 'Vital Statistics',
            buttons: {
                "OK": function() {
                    $( this ).dialog( "close" );
                }
            }
		});
	$gameOver = $('<div></div>')
		.html('Game Over!')
		.dialog({
			autoOpen: false,
            modal: true,
			title: 'Game Over!',
            buttons: {
                "Restart Level": function() {
                    restartLevel();
                    $( this ).dialog( "close" );
                },
                "New Game": function() {
                    newGame();
                    $( this ).dialog( "close" );
                }
            }
		});
	$completeLevel = $('<div></div>')
		.html('Level Complete!')
		.dialog({
			autoOpen: false,
             modal: true,
			title: 'Level Complete!',
			buttons: {
                "OK": function() {
                    newLevel();
                    $( this ).dialog( "close" );
                }
			}
		});

	$completeGame = $('<div></div>')
		.html('Complete game!')
		.dialog({
			autoOpen: false,
            modal: true,
			title: 'Fierce Planet Complete!',
            buttons: {
                "OK": function() {
                    newGame();
                    $( this ).dialog( "close" );
                }
            }

		});

	$levelSetup = $('<div></div>')
		.html('Level Setup')
		.dialog({
			autoOpen: false,
            modal: true,
			title: 'Level Setup',
            buttons: {
                "OK": function() {
                    redrawWorld();
                    $( this ).dialog( "close" );
                }
            }

		});


    /* Upgrade / delete dialog */
	$upgradeDelete = $('#delete-upgrade-dialog')
		.dialog({
			autoOpen: false,
            modal: true,
			title: 'Upgrade or Delete Resource',
            buttons: {
                "Cancel": function() {
                    $( this ).dialog( "close" );
                }
            }
		});
    $('#del-button')[0].addEventListener('click', function(e) {deleteCurrentResource(); $upgradeDelete.dialog('close'); }, false );
    $('#upg-button')[0].addEventListener('click', function(e) {upgradeCurrentResource(); $upgradeDelete.dialog('close'); }, false    );

    $resourceGallery = $('#resource-gallery')
        .dialog({
            width: 460,
            autoOpen: false,
            modal: true,
            title: 'Resource Gallery',
            buttons: {
                "OK": function() {
                    refreshSwatch();
                    saveCapabilities();
                    $( this ).dialog( "close" );
                }
            }
        });

    $('#tutorial')[0].addEventListener('click', function(e) { currentLevelNumber = 0; restartLevel(); }, false    );
}

// Handle various resource-related interactions
function setupResourceInteraction() {
    var canvas = $('#c2')[0];
    var msie = /*@cc_on!@*/0;

    var links = $('.eco, .env, .soc'), el = null;
    for (var i = 0; i < links.length; i++) {
      el = links[i];

      el.setAttribute('draggable', 'true');
      el.addEventListener('dragstart', function (e) {
        e.dataTransfer.effectAllowed = 'copy'; // only dropEffect='copy' will be dropable
        e.dataTransfer.setData('Text', this.id); // required otherwise doesn't work
          currentResourceId = this.id;
      }, false);
      el.addEventListener('click', function (e) {
          currentResourceId = this.id;
      }, false);
    }

    var world = $('#c4')[0];


    world.addEventListener('click', function (e) {
        if (e.preventDefault) e.preventDefault(); // allows us to drop
        if (! inDesignMode)
            showUpgradeDeleteDialog(e);
        return false;
      }, false);

    world.addEventListener('dragstart', function (e) {
        if (e.preventDefault) e.preventDefault(); // allows us to drop
        this.className = 'over';
        e.dataTransfer.dropEffect = 'copy';
        return false;
      }, false);
    world.addEventListener('dragover', function (e) {
        if (e.preventDefault) e.preventDefault(); // allows us to drop
        this.className = 'over';
        e.dataTransfer.dropEffect = 'copy';
        return false;
      }, false);
    world.addEventListener('dragenter', function (e) {
        this.className = 'over';
        return false;
      }, false);
    world.addEventListener('dragleave', function (e) {
        this.className = '';
      }, false);
    world.addEventListener('drop', function (e) {
        if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???
        this.className = '';
        dropItem(e);
      }, false);

}

// Add general event listeners
function hookUpUIEventListeners() {
    // Control panel functions
   $('#slowDown')[0].addEventListener('click', slowDown, false);
   $('#speedUp')[0].addEventListener('click', speedUp, false);
   $('#startAgents')[0].addEventListener('click', startAgents, false);
   $('#stopAgents')[0].addEventListener('click', stopAgents, false);
   $('#restartLevel')[0].addEventListener('click', restartLevel, false);
   $('#newGame')[0].addEventListener('click', newGame, false);
   $('#showResourceGallery')[0].addEventListener('click', showResourceGallery, false);

    // Admin functions
    $('#debug')[0].addEventListener('click', processAgents, false);

    // Pan/zoomFunctions
    $('#panUp')[0].addEventListener('click', function() { pan(0);}, false);
    $('#panDown')[0].addEventListener('click', function() { pan(1);}, false);
    $('#panLeft')[0].addEventListener('click', function() { pan(2);}, false);
    $('#panRight')[0].addEventListener('click', function() { pan(3);}, false);
    $('#panReset')[0].addEventListener('click', function() { pan(4);}, false);
    $('#zoomIn')[0].addEventListener('click', function() { zoom(1);}, false);
    $('#zoomOut')[0].addEventListener('click', function() { zoom(-1);}, false);
    $('#zoomReset')[0].addEventListener('click', function() { zoom(0);}, false);

    // Level editor functions
   $('#makeTile')[0].addEventListener('click', makeTile, false);
   $('#addGoal')[0].addEventListener('click', addGoal, false);
   $('#addAgentStartingPoint')[0].addEventListener('click', addAgentStartingPoint, false);
   $('#showLevelProperties')[0].addEventListener('click', showLevelProperties, false);
   $('#refreshTiles')[0].addEventListener('click', refreshTiles, false);
   $('#undoAction')[0].addEventListener('click', undoAction, false);
   $('#cancelLevelEditor')[0].addEventListener('click', cancelLevelEditor, false);

}

// Delete the current resource
function deleteCurrentResource() {
    var foundResource = getCurrentResourceIndex();
    if (foundResource > -1) {
        resourcesInStore += 5;
        resourcesSpent -= 5;
        cells[[currentResource.getX(), currentResource.getY()]] = null;
        resources.splice(foundResource, 1);
        drawResourcesInStore();
        clearCanvas('c2');
        drawResources();
    }
}

// Upgrade the current page (NOTE: SHOULD BE TIED TO PROFILE CAPABILITIES
function upgradeCurrentResource() {
    var foundResource = getCurrentResourceIndex();
    if (foundResource > -1) {
        var p = resources[i];
        if (p.getUpgradeLevel() <= 4 && resourcesInStore >= p.getUpgradeCost()) {
            resourcesInStore -= p.getUpgradeCost();
            resourcesSpent += p.getUpgradeCost();
            p.setUpgradeLevel(p.getUpgradeLevel() + 1);
            drawResource(p);
            drawResourcesInStore();
        }
    }
}

function dropItem(e) {
    var canvas = $('#c2')[0];;
    var ctx = canvas.getContext('2d');
    var __ret = getResourcePosition(e, canvas);
    var posX = __ret.posX;
    var posY = __ret.posY;
    if (cells[[posX, posY]] == undefined && ! currentLevel.getAllowResourcesOnPath())
        return;
    for (var i = 0; i < resources.length; i++) {
        var p = resources[i];
        if (p.getX() == posX && p.getY() == posY) {
            return;
        }
    }

    var resourceCode = currentResourceId;
    if (e.dataTransfer)
        resourceCode = e.dataTransfer.getData('Text');

    var kind = resolveResourceKind(resourceCode);
    var resource = new Resource(kind, posX, posY);

    /*

    var resourceType = resourceTypes[resourceCode];

    var totalYield = 0, perAgentYield = 0, cost = 0, upgradeCost = 0;
    var __ret = determineResourceCostAndYield(resourceCode, resourceType);
    perAgentYield = __ret.perAgentYield;
    cost = __ret.cost;
    totalYield = __ret.totalYield;
    upgradeCost = __ret.upgradeCost;

    var c = "0f0";
    if (resourceType == 'eco') {
        c = "99ccff";
    }
    else if (resourceType == 'env') {
        c = "00ff00";
    }
    else if (resourceType == 'soc') {
        c = "ff3300";
    }

    var resource = new Resource(resourceName, resourceType, c, posX, posY);
    resource.setInitialTotalYield(totalYield);
    resource.setPerAgentYield(perAgentYield);
    resource.setCost(cost);
    resource.setUpgradeCost(upgradeCost);
    */
    
    if (resourcesInStore < resource.getCost()) {
        notify('Not enough goodness for now - save some more agents!');
        return;
    }
    else {
        resourcesInStore -= resource.getCost();
        resourcesSpent += resource.getCost();
        resources.push(resource);
        if (resource.getType() == 'eco') {
            economicResourceCount += 1;
        }
        else if (resource.getType() == 'env') {
            environmentalResourceCount += 1;
        }
        else if (resource.getType() == 'soc') {
            socialResourceCount += 1;
        }
        cells[[posX, posY]] = resource;

        drawResource(resource);
        drawResourcesInStore();
    }
}

// Refactor into ResourceType
function determineResourceCostAndYield(resourceName, resourceType) {
    var totalYield = 0, perAgentYield = 0, cost = 0, upgradeCost = 0;
    if ($.inArray(resourceName, NOVICE_CAPABILITIES) > -1) {
        cost = 10;
        upgradeCost = 20;
        totalYield = 100;
        if (resourceType == "eco") {
            perAgentYield = 20;
        }
        else if (resourceType == "env") {
            perAgentYield = 10;
        }
        else if (resourceType == "soc") {
            perAgentYield = 5;
        }
    }
    else if ($.inArray(resourceName, PLANNER_CAPABILITIES) > -1) {
        cost = 15;
        upgradeCost = 25;
        totalYield = 150;
        if (resourceType == "eco") {
            perAgentYield = 30;
        }
        else if (resourceType == "env") {
            perAgentYield = 15;
        }
        else if (resourceType == "soc") {
            perAgentYield = 8;
        }
    }
    else if ($.inArray(resourceName, EXPERT_CAPABILITIES) > -1) {
        cost = 20;
        upgradeCost = 30;
        totalYield = 200;
        if (resourceType == "eco") {
            perAgentYield = 50;
        }
        else if (resourceType == "env") {
            perAgentYield = 25;
        }
        else if (resourceType == "soc") {
            perAgentYield = 15;
        }
    }
    else if ($.inArray(resourceName, VISIONARY_CAPABILITIES) > -1) {
        cost = 25;
        upgradeCost = 35;
        totalYield = 250;
        if (resourceType == "eco") {
            perAgentYield = 70;
        }
        else if (resourceType == "env") {
            perAgentYield = 35;
        }
        else if (resourceType == "soc") {
            perAgentYield = 20;
        }
    }
    else if ($.inArray(resourceName, GENIUS_CAPABILITIES) > -1) {
        cost = 30;
        upgradeCost = 40;
        totalYield = 300;
        if (resourceType == "eco") {
            perAgentYield = 90;
        }
        else if (resourceType == "env") {
            perAgentYield = 45;
        }
        else if (resourceType == "soc") {
            perAgentYield = 25;
        }
    }
    return {perAgentYield:perAgentYield, cost:cost, totalYield:totalYield, upgradeCost:upgradeCost};
}
/* End UI Methods */


/* Resource Methods */
function setupResourceTypes() {
    resourceTypes['farm'] = 'eco';
    resourceTypes['shop'] = 'eco';
    resourceTypes['bank'] = 'eco';
    resourceTypes['factory'] = 'eco';
    resourceTypes['stockmarket'] = 'eco';
    resourceTypes['water'] = 'env';
    resourceTypes['park'] = 'env';
    resourceTypes['air'] = 'env';
    resourceTypes['renewable-energy'] = 'env';
    resourceTypes['biodiversity'] = 'env';
    resourceTypes['clinic'] = 'soc';
    resourceTypes['school'] = 'soc';
    resourceTypes['legal-system'] = 'soc';
    resourceTypes['democracy'] = 'soc';
    resourceTypes['festival'] = 'soc';
}

// Find the current resource index
function getCurrentResourceIndex() {
    for (var i = 0; i < resources.length; i++) {
        var p = resources[i];
        if (p == currentResource) {
            return i;
        }
    }
    return -1;
}

// Show the current resource
function showResource(e) {
    var canvas = document.getElementById('c2');
    var __ret = getResourcePosition(e, canvas);
    var posX = __ret.posX;
    var posY = __ret.posY;
    alert(e.x + " : " + e.y);
    alert(posX + " : " + posY);
}

// Get the resource associated with an event
function getResourcePosition(e, canvas) {
    var cellX = 0;
    var cellY = 0;

    var x;
    var y;
    if (e.layerX || e.layerX == 0) { // Firefox
        x = e.layerX;
        y = e.layerY;
    } else if (e.offsetX || e.offsetX == 0) { // Opera
        x = e.offsetX;
        y = e.offsetY;
    }
//    var x = e.pageX - canvas.offsetLeft;
//    var y = e.pageY - canvas.offsetTop;


    var w = canvas.width;
    var h = canvas.height;

    var posX = Math.floor(x / cellWidth);
    var posY = Math.floor(y / cellWidth);
    return {posX:posX, posY:posY};
}

/* End Resource Methods */


/* Draw Methods */
function drawGrid() {
    var canvas = $('#c1')[0];
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.beginPath();
    for (var i = 0; i < w; i+= cellWidth) {
        ctx.moveTo(i + 0.5, 0);
        ctx.lineTo(i + 0.5, h);

    }
    for (var j = 0; j < h; j+= cellWidth) {
        ctx.moveTo(0, j + 0.5);
        ctx.lineTo(h, j + 0.5);

    }
    ctx.closePath();
    ctx.strokeStyle = "#ccc";
    ctx.stroke();

}

function drawTiles() {
    var tiles = currentLevel.getTiles();
    for (var i = 0; i < tiles.length; i+= 1) {
        drawTile(tiles[i]);
    }
}

function drawTile(p) {
    var canvas = $('#c1')[0];
    var ctx = canvas.getContext('2d');

    var x = p._x * cellWidth;
    var y = p._y * cellWidth;
    ctx.clearRect(x + 1, y + 1, cellWidth - 1, cellWidth - 1);
    ctx.fillStyle = "#" + p._color;
    ctx.fillRect(x, y, cellWidth, cellWidth);
    ctx.strokeStyle = "#" + p._color;
    ctx.strokeStyle = "#ccc";
    ctx.strokeRect(x, y, cellWidth, cellWidth);
}

function drawPath() {
    var canvas = $('#c1')[0];
    var ctx = canvas.getContext('2d');
    var pathCells = currentLevel.getPath();
    for (var i = 0; i < pathCells.length; i+= 1) {
        var pathCell = pathCells[i];
        var x = pathCell[0] * cellWidth;
        var y = pathCell[1] * cellWidth;
        ctx.clearRect(x + 1, y + 1, cellWidth - 1, cellWidth - 1);
//        ctx.fillStyle = "#fff";
        ctx.fillStyle = "#fafafa";
        ctx.fillRect(x, y, cellWidth, cellWidth);
        ctx.strokeStyle = "#ccc";
        ctx.strokeRect(x, y, cellWidth, cellWidth);
    }
}

function drawBackgroundImage() {
    if (currentLevel.getImage() != undefined) {
        var canvas = $('#c1')[0];
        var ctx = canvas.getContext('2d');
        ctx.drawImage(currentLevel.getImage(), 0, 0);
    }
}

function handleApiReady() {
    var map;
    var mapOptions = {
      center: new google.maps.LatLng(30.9376, 79.4292),
      disableDefaultUI: true,
      zoom: 10,
      mapTypeId: 'satellite'
    };
    if (currentLevel.getMapOptions()['lat'] != undefined && currentLevel.getMapOptions()['long'] != undefined)
        mapOptions['center'] = new google.maps.LatLng(currentLevel.getMapOptions()['lat'], currentLevel.getMapOptions()['long']);
    if (currentLevel.getMapOptions()['zoom'] != undefined)
        mapOptions['zoom'] = currentLevel.getMapOptions()['zoom'];

    map = new google.maps.Map($("#map_canvas")[0], mapOptions);
    map.setTilt(45);
}
function drawMap() {
    if (currentLevel.getMapURL() != undefined) {
        $("#map_canvas").prepend('<img src="' + currentLevel.getMapURL() + '"/>').css('image-orientation: 135deg');
    }
    else if (currentLevel.getMapOptions() != undefined) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://maps.google.com/maps/api/js?sensor=false&callback=handleApiReady";
        document.body.appendChild(script);
    }
}



function drawGoal() {
    var canvas = $('#c1')[0];
    var ctx = canvas.getContext('2d');

    var x = currentLevel.getGoalX() * cellWidth + cellWidth / 2;
    var y = currentLevel.getGoalY() * cellWidth + cellWidth / 2;


    var radius = (pieceWidth / 2);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.strokeStyle = "#ccc";
    ctx.stroke();
    ctx.fillStyle = "#fbe53b";
    ctx.fill();
}

function drawEntryPoint() {
    var canvas = $('#c1')[0];
    var ctx = canvas.getContext('2d');

    var x = currentLevel.getInitialAgentX() * cellWidth + cellWidth / 2;
    var y = currentLevel.getInitialAgentY() * cellWidth + cellWidth / 2;


    var radius = (pieceWidth / 2);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.strokeStyle = "#ddd";
    ctx.stroke();
    ctx.fillStyle = "#ddd";
    ctx.fill();
}

function drawResources() {
    for (var i = 0; i < resources.length; i+= 1) {
        drawResource(resources[i]);
    }
}

function drawResource(p) {
    var canvas = $('#c2')[0];
    var ctx = canvas.getContext('2d');

    var x = p.getX() * cellWidth;
    var y = p.getY() * cellWidth;
    var s = p.getTotalYield() / p.getInitialTotalYield() * 100;
    var c = p.getColor();
    var newColor = diluteColour(s, s, s, c);
    ctx.clearRect(x + 1, y + 1, cellWidth - 1, cellWidth - 1);
    ctx.fillStyle = "#" + newColor;
    ctx.strokeStyle = "#333";

    // Fill whole square
//    ctx.fillRect(x, y, cellWidth, cellWidth);
    // Fill smaller square
    ctx.fillRect(x + 4, y + 4, cellWidth - 8, cellWidth - 8);
    switch (p.getUpgradeLevel()) {
        case 1:
            break;
        case 2:
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#666";
            ctx.strokeRect(x + 4, y + 4, cellWidth - 8, cellWidth - 8);
            break;
        case 3:
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#666";
            ctx.strokeRect(x + 6, y + 6, cellWidth - 12, cellWidth - 12);
            break;
        case 4:
            ctx.fillStyle = "#666";
            ctx.fillRect(x + 8, y + 8, cellWidth - 16, cellWidth - 16);
            break;
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#333";
//    ctx.strokeRect(x, y, cellWidth, cellWidth);
    ctx.strokeRect(x + 4, y + 4, cellWidth - 8, cellWidth - 8);
//    ctx.strokeText(p.getUpgradeLevel(), x + 10, y + 10);

    // Draw resource-specific representation here
    /*
    if (p.getName() == "farm") {
        ctx.beginPath();
        for (var i = y + 4; i < y + 4 + cellWidth - 8; i+= 4) {
            ctx.moveTo(x + 4, i);
            ctx.lineTo(x + 4 + cellWidth - 8, i);
        }
        ctx.closePath();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    else if (p.getName() == "factory"){
        ctx.beginPath();
        for (var i = x + 4; i < x + 4 + cellWidth - 8; i+= 4) {
            ctx.moveTo(i, y + 4);
            ctx.lineTo(i, y + 4 + cellWidth - 8);
        }
        ctx.closePath();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    */
}

function clearCanvas(canvasID) {
    var canvas = $('#' + canvasID)[0];
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    ctx.clearRect(0, 0, w, h);
}

function clearAgents() {
    var canvas = $('#c4')[0];
    var ctx = canvas.getContext('2d');
    if (counter > 0) {
        for (var i = 0; i < agents.length; i += 1) {
            var agent = agents[i];
            var wx = agent.getWanderX();
            var wy = agent.getWanderY();
            var __ret = getDrawingPosition(agent, counter - 1);
            var intX = __ret.intX * cellWidth + wx + 1;
            var intY = __ret.intY * cellWidth + wy + 1;
            ctx.clearRect(intX, intY, cellWidth - 2, cellWidth - 2);
        }
    }
}


/* Dilutes (whitens) the colour of an element, given its strength (some value between 0 and 100) */
function diluteColour(rStrength, gStrength, bStrength, colour) {
    var charOffset = (colour.length == 3 ? 1 : 2);
    var multiplier = (charOffset == 1 ? 1 : 16)
    var dilutionBase = 10;
    var maxValue = Math.pow(16, charOffset);
    var r = parseInt(colour.slice(0, 1 * charOffset), 16);
    var g = parseInt(colour.slice(1 * charOffset, 2 * charOffset), 16);
    var b = parseInt(colour.slice(2 * charOffset, 3 * charOffset), 16);

    var ro = Math.floor((100 - rStrength) / 100 * (maxValue - r));
    var go = Math.floor((100 - gStrength) / 100 * (maxValue - g));
    var bo = Math.floor((100 - bStrength) / 100 * (maxValue - b));
    var rOffset = (r + ro < maxValue ? r + ro : maxValue - 1).toString(16);
    var gOffset = (g + go < maxValue ? g + go : maxValue - 1).toString(16);
    var bOffset = (b + bo < maxValue ? b + bo : maxValue - 1).toString(16);
    rOffset = (rOffset.length < charOffset ? rOffset + "0" : rOffset);
    gOffset = (gOffset.length < charOffset ? gOffset + "0" : gOffset);
    bOffset = (bOffset.length < charOffset ? bOffset + "0" : bOffset);
    var newColor = rOffset + gOffset + bOffset;
    return newColor;
}

function getDrawingPosition(agent, count) {
    var lastX = agent.lastPosition()[0];
    var lastY = agent.lastPosition()[1];
    var x = agent.getPosition()[0];
    var y = agent.getPosition()[1];
    var wx = agent.getWanderX();
    var wy = agent.getWanderY();
    var speed = agent.getSpeed();
    var increment = (speed - (count - agent.getDelay()) % speed) / speed;


    var offsetX = (x - lastX) * (increment);
    var offsetY = (y - lastY) * (increment);
    var intX = (x - offsetX);
    var intY = (y - offsetY);

    if (currentLevel.getAllowOffscreenCycling()) {
        var halfWay = (increment < 0.5);
        if (x == worldSize - 1 && lastX == 0) {
            if (halfWay) {
                offsetX = (x - worldSize) * (increment);
                intX = (x - offsetX);
            }
            else {
                offsetX = 1 - increment;
                intX = offsetX;
            }
        }
        else if (x == 0 && lastX == worldSize - 1) {
            if (halfWay) {
                offsetX = increment;
                intX = (0 - offsetX);
            }
            else {
                offsetX = (worldSize - lastX) * (increment);
                intX = (worldSize - offsetX);
            }
        }
        else if (y == worldSize - 1 && lastY == 0) {
            if (halfWay) {
                offsetY = (y - worldSize) * (increment);
                intY = (y - offsetY);
            }
            else {
                offsetY = 1 - increment;
                intY = offsetY;
            }
        }
        else if (y == 0 && lastY == worldSize - 1) {
            if (halfWay) {
                offsetY = increment;
                intY = (0 - offsetY);
            }
            else {
                offsetY = (worldSize - lastY) * (increment);
                intY = (worldSize - offsetY);
//                offsetY = (lastY - worldSize) * (increment);
//                intY = (lastY - offsetY);
            }
        }
    }
    return {intX:intX, intY:intY};
}

function drawAgents() {
    var canvas = $('#c4')[0];
    var ctx = canvas.getContext('2d');
    for (var i = 0; i < agents.length; i += 1) {
        var agent = agents[i];

        // Don't process agents we want to block
        if (! rivalsVisible && agent.getType() == RIVAL_AGENT_TYPE)
            continue;
        if (! predatorsVisible && agent.getType() == PREDATOR_AGENT_TYPE)
            continue;

        // Get co-ordinates
        var wx = agent.getWanderX();
        var wy = agent.getWanderY();
        var __ret = getDrawingPosition(agent, counter);
        var intX = __ret.intX * cellWidth + wx + cellWidth / 2;
        var intY = __ret.intY * cellWidth + wy + cellWidth / 2;



        var ecoH = agent.getEconomicHealth();
        var envH = agent.getEnvironmentalHealth();
        var socH = agent.getSocialHealth();
        var c = agent.getColor().toString();
        var newColor = diluteColour(socH, envH, ecoH, c);

        eval(agent.getType().getDrawFunction())(ctx, agent, intX, intY, pieceWidth, newColor, counter);

//        ctx.beginPath();
//        ctx.arc(intX, intY, radius, 0, Math.PI * 2, false);
//        ctx.closePath();
//        ctx.strokeStyle = "#ccc";
//        ctx.stroke();
//        ctx.fillStyle = "#" + newColor;
//        ctx.fill();
//
//        ctx.beginPath();
//        ctx.moveTo(intX, intY + radius);
//        ctx.lineTo(intX, intY + radius + bodyLength / 2);
//        if (counter % 2 == 0) {
//            // Legs
//            var xOffset = Math.sin(30 * Math.PI/180) * bodyLength / 2;
//            var yOffset = Math.cos(30 * Math.PI/180) * bodyLength / 2;
//            ctx.moveTo(intX, intY + radius + bodyLength / 2);
//            ctx.lineTo(intX - xOffset, intY + radius + bodyLength / 2 + yOffset);
//            ctx.moveTo(intX, intY + radius + bodyLength / 2);
//            ctx.lineTo(intX + xOffset, intY + radius + bodyLength / 2 + yOffset);
//            // Arms - 90 degrees
//            ctx.moveTo(intX - bodyLength / 2, intY + radius + bodyLength / 6);
//            ctx.lineTo(intX + bodyLength / 2, intY + radius + bodyLength / 6);
//        }
//        else {
//            // Legs - straight
//            ctx.moveTo(intX, intY + radius + bodyLength / 2);
//            ctx.lineTo(intX, intY + radius + bodyLength);
//            // Arms - 45 degrees
//            var xOffset = Math.sin(45 * Math.PI/180) * bodyLength / 2;
//            var yOffset = Math.cos(45 * Math.PI/180) * bodyLength / 2;
//            ctx.moveTo(intX - xOffset, intY + radius + bodyLength / 6 + yOffset);
//            ctx.lineTo(intX, intY + radius + bodyLength / 6);
//            ctx.moveTo(intX + xOffset, intY + radius + bodyLength / 6 + yOffset);
//            ctx.lineTo(intX, intY + radius + bodyLength / 6);
//
//        }
//        ctx.closePath();
//        ctx.strokeStyle = "#" + newColor;
//        ctx.lineWidth = 2;
//        ctx.stroke();

//        ctx.fillText(agent.getHealth(),  intX, intY);
//        ctx.fillText(agent.getEconomicHealth(),  intX, intY + 20);
    }
}

function drawScrollingLayer() {
    clearCanvas('c3');
    var canvas = $('#c3')[0];
    var ctx = canvas.getContext('2d');
    
    if ((scrollingImageX + scrollingImageOffset) < (400 - scrollingImageOffset)){
        scrollingImageX += scrollingImageOffset;
    }
    else {
        scrollingImageX = 0;
    }
    ctx.drawImage(scrollingImage, scrollingImageX, 0, 400, 400, 0, 0, 400, 400);
}

function drawLevel() {
    var e = $('#level-display')[0];
    e.innerHTML = currentLevelNumber.toString();
}

function drawHighestLevel() {
    var e = $('#highest-level-display')[0];
    var hl = localStorage.highestLevel;
    if (hl == undefined)
        hl = 0;
    e.innerHTML = hl.toString();
}

function drawScore() {
    var e = $('#score-display')[0];
    e.innerHTML = score.toString();
}

function drawHighestScore() {
    var e = $('#highest-score-display')[0];
    var hs = localStorage.highestScore;
    if (hs == undefined)
        hs = 0;
    e.innerHTML = hs.toString();
}

function drawResourcesInStore() {
    var e = $('#goodness-display')[0];
    e.innerHTML = resourcesInStore.toString();
}

function drawExpired() {
    var e = $('#expired-display')[0];
    e.innerHTML = expiredAgentCount.toString() + " out of " + currentLevel.getExpiryLimit();
}

function drawSaved() {
    var e = $('#saved-display')[0];
    e.innerHTML = savedAgentCount.toString();
}

function drawWaves() {
    var e = $('#waves-display')[0];
    e.innerHTML = waves.toString() + " out of " + currentLevel.getWaveNumber();
}

function drawScoreboard() {
    drawLevel();
    drawHighestLevel();
    drawScore();
    drawHighestScore();
    drawWaves();
    drawSaved();
    drawExpired();
    drawResourcesInStore();
}
/* End Drawing Methods */




/* Move Strategies */
function moveAgent(agent, withNoRepeat, withNoCollision) {
    var x = agent.getX();
    var y = agent.getY();
    var lastX = -1, lastY = -1;
    var p = agent.lastPosition();
    if (p != undefined || (p[0] > -1 && p[1] > -1)) {
        lastX = p[0];
        lastY = p[1];
    }
    var position = findPosition(agent, withNoRepeat, withNoCollision, currentLevel.getAllowOffscreenCycling(), currentLevel.getAllowOffscreenCycling());
//    if ((position[0] != x || position[1] != y) && (position[0] != lastX || position[1] != lastY))
        agent.setPosition(position[0], position[1]);
    agent.incrementMoves();
}

function moveAgents(withNoRepeat, withNoCollision) {
    for (var i = 0; i < agents.length; i+= 1) {
        var agent = agents[i];
        moveAgent(agent, withNoRepeat, withNoCollision);
    }
}

function findPosition(agent, withNoRepeat, withNoCollision, withOffscreenCycling) {
    var positionFound = false;
    var existingDirections = new Array();
    var x = agent.getPosition()[0];
    var y = agent.getPosition()[1];
    var newX = x;
    var newY = y;
    var lastX = agent.lastPosition()[0];
    var lastY = agent.lastPosition()[1];
    var candidateCells = new Array();
    var directions = randomDirectionOrder();
    for (var i = 0; i < directions.length; i++) {
        counterLoops++;
        newX = x;
        newY = y;
        var dir = directions[i];

        var offScreen1 = 0;
        var offScreen2 = currentLevel.getWorldSize() - 1;
        var offset = 1;
        var toContinue = false;
        switch (dir) {
            case 0:
                (newX == offScreen1 ? (withOffscreenCycling ? newX = offScreen2 : toContinue = true) : newX = newX - offset);
                break;
            case 1:
                (newX == offScreen2 ? (withOffscreenCycling ? newX = offScreen1 : toContinue = true) : newX = newX + offset);
                break;
            case 2:
                (newY == offScreen1 ? (withOffscreenCycling ? newY = offScreen2 : toContinue = true) : newY = newY - offset);
                break;
            case 3:
                (newY == offScreen2 ? (withOffscreenCycling ? newY = offScreen1 : toContinue = true) : newY = newY + offset);
                break;
        }
        if ((withNoRepeat && lastX == newX && lastY == newY) || toContinue) {
            continue;
        }
//        if (cells.get([newX, newY]) == undefined) {
//            candidateCells.push([newX, newY]);
//        }
        if (cells[[newX, newY]] == undefined) {
            candidateCells.push([newX, newY]);
        }
    }
    // Allow for back-tracking, if there is no way forward
    if (candidateCells.length == 0) {
        return [lastX, lastY];
    }

    // Find the first candidate which is either the goal, or not in the history.
    var candidatesNotInHistory = new Array();
    for (var i = 0; i < candidateCells.length; i++) {
        var candidate = candidateCells[i];
        if (isGoalCell(candidate[0], candidate[1]))
            return candidate;
        var inHistory = false;
        for (var j = agent.getHistory().length - 1 ; j >= 0; j--) {
            var historyCell = agent.getHistory()[j];
            if (historyCell[0] == candidate[0] && historyCell[1] == candidate[1])
                inHistory = true;
        }
        if (!inHistory)
            candidatesNotInHistory.push(candidate);
    }

    // Try to find a neighbouring resource, if it exists
    if (candidatesNotInHistory.length > 0) {
        var bestCandidate = candidatesNotInHistory[0];
        for (var i = 0; i < candidatesNotInHistory.length; i++) {
            var candidate = candidatesNotInHistory[i];
            var neighbour = hasNeighbouringResources(candidate[0], candidate[1]);
            if (neighbour != null)
                bestCandidate = candidate;
        }
        return bestCandidate;
    }
    else {
        var bestCandidate = candidateCells[0];
        for (var i = 0; i < candidateCells.length; i++) {
            var candidate = candidateCells[i];
            var neighbour = hasNeighbouringResources(candidate[0], candidate[1]);
            if (neighbour != null)
                bestCandidate = candidate;
        }
        return bestCandidate;
    }


    // Allow for movement off-screen, if no other option is available
    if (! withOffscreenCycling) {
        if (x == offScreen2 || x == offScreen1 || y == offScreen2 || y == offScreen1) {
            if (x == offScreen2) {
                newX = offScreen2 + 1;
            }
            else if (x == offScreen1) {
                newX = offScreen1 - 1;
            }
            else if (y == offScreen2) {
                newY = offScreen2 + 1;
            }
            else if (y == offScreen1) {
                newY = offScreen1 - 1;
            }
            return [newX, newY];
        }
    }


    // Use the first NON-candidate cell to use if no candidate is found
    return candidateCells[0];
}

function randomDirectionOrder() {
    var directions = new Array();
    var orderedDirections = [0, 1, 2, 3];
    var odl = orderedDirections.length;
    for (var i = 0; i < odl; i++) {
        var obj = directions[i];
        var remainingLength = orderedDirections.length;
        var pos = Math.floor(Math.random() * remainingLength);
        directions.push(orderedDirections[pos]);
        orderedDirections.splice(pos, 1);
    }
    return directions;
}

function checkCollision(x, y) {
//    return cells.get([x, y]) == undefined;
    return cells[[x, y]] == undefined;
}

function moveAgentsRandomly() {
    for (var i = 0; i < agents.length; i+= 1) {
        var dir = Math.floor(Math.random() * 4);
        var agent = agents[i];
        var newX = agent.getX();
        var newY = agent.getY();
        switch (dir) {
            case 0:
                (newX == 0) ? newX = worldSize - 1 : newX = newX - 1;
                break;
            case 1:
                (newX == worldSize - 1) ? newX = 0 : newX = newX + 1;
                break;
            case 2:
                (newY == 0) ? newY = worldSize - 1 : newY = newY - 1;
                break;
            case 3:
                (newY == worldSize - 1) ? newY = 0 : newY = newY + 1;
                break;
        }
        if (!checkResources(newX, newY))
            agent.setPosition(newX, newY);
    }
}

function checkResources(newX, newY) {
    var isResource = false;
    var tiles = currentLevel.getTiles();
    for (var j = 0; j < tiles.length; j+= 1) {
        var resource = tiles[j];
        if (resource.getX() == newX && resource.getY() == newY)
            return true;
    }
    return isResource;
}
/* End Move Strategies */


/* Game logic methods */
function processAgents() {

    // Draw the scrolling layer
    drawScrollingLayer();


    // Delay, until we are ready for the first wave
    if (levelDelayCounter < NEW_LEVEL_DELAY / interval) {
        levelDelayCounter++;
        return;
    }

    // Delay, until we are ready for a new wave
    if (waveDelayCounter < NEW_WAVE_DELAY / interval) {
        waveDelayCounter++;
        return;
    }

    // Increment counter
    counter++;


    clearAgents();

    var nullifiedAgents = new Array();
    var citizenCount = 0;
    for (var i = 0; i < agents.length; i+= 1) {
        var agent = agents[i];

        // Don't process agents we want to block
        if (! rivalsVisible && agent.getType() == RIVAL_AGENT_TYPE)
            continue;
        if (! predatorsVisible && agent.getType() == PREDATOR_AGENT_TYPE)
            continue;

        var speed = agent.getSpeed();
        if (agent.getType() == CITIZEN_AGENT_TYPE)
            citizenCount++;
        if (counter >= agent.getDelay() && (counter - agent.getDelay()) % speed == 0) {
            if (agent.getType() == CITIZEN_AGENT_TYPE) {
                if (agent.getX() == currentLevel.getGoalX() && agent.getY() == currentLevel.getGoalY()) {
                    score += SURVIVAL_SCORE;
                    savedAgentCount++;
                    savedAgentThisWaveCount++;
                    nullifiedAgents.push(i);
                    var multiplier = (waves < 5 ? 4 : (waves < 10 ? 3 : (waves < 20 ? 2 : 1)));
                    resourcesInStore += multiplier; //WAVE_GOODNESS_BONUS;
                    drawScore();
                    drawResourcesInStore();
                    drawSaved();
                }
            }

            // Do for all agents
            moveAgent(agent, true, false);
            agent.adjustSpeed();
            agent.adjustWander();
            if (agent.getMoves() > maxWaveMoves)
                maxWaveMoves = agent.getMoves();
            if (agent.getMoves() > maxLevelMoves)
                maxLevelMoves = agent.getMoves();


            if (agent.getType() == CITIZEN_AGENT_TYPE || agent.getType() == RIVAL_AGENT_TYPE) {
                if (!godMode)
                    agent.adjustHealth(MOVE_HEALTH_COST);
                if (agent.getHealth() <= 0) {
                    nullifiedAgents.push(i);
                    if (agent.getType() == CITIZEN_AGENT_TYPE)
                        expiredAgentCount++;
                    drawExpired();
                }
                else {
                    // Hook for detecting 'active' resources
                    processNeighbouringResources(agent);

                    // Hook for detecting other agents
                    processNeighbouringAgents(agent);
                }
            }
        }
    }

    if (expiredAgentCount >= currentLevel.getExpiryLimit()) {
        return gameOver();
    }

    // Check whether we have too many
    for (var i = nullifiedAgents.length - 1; i >= 0; i-= 1) {
        agents.splice(nullifiedAgents[i], 1);
    }
    // No agents left? End of wave
    if (citizenCount == 0) {
        // Start a new wave
        if (waves < currentLevel.getWaveNumber()) {
//            alert(maxWaveMoves);
            newWave();
            drawScoreboard();
            waveDelayCounter = 0;
        }
        else if (currentLevelNumber < LEVELS) {
            completeLevel();
            levelDelayCounter = 0;
        }
        else {
            return completeGame();
        }
    }
    else {
        if (counter % resourceRecoveryCycle == 0)
            recoverResources();
        drawAgents();
    }
}

/*
 * Processes neighbouring resources
 */
function processNeighbouringResources(agent) {
    var x = agent.getX();
    var y = agent.getY();
    for (var j = 0; j < resources.length; j++) {
        var resource = resources[j];
        var rx = resource.getX();
        var ry = resource.getY();
        if (Math.abs(rx - x) <= 1 && Math.abs(ry - y) <= 1) {
            var resourceEffect = calculateResourceEffect(resource);
            resource.provideYield(agent, resourceEffect, applyGeneralHealth);
            drawResource(resource);
        }
    }
}

/*
 * Processes neighbouring agents
 */
function processNeighbouringAgents(agent) {
    var x = agent.getX();
    var y = agent.getY();
    for (var j = 0; j < agents.length; j++) {
        var a = agents[j];
        var ax = a.getX();
        var ay = a.getY();
        if (Math.abs(ax - x) <= 1 && Math.abs(ay - y) <= 1) {
            // Do something
        }
    }
}

/*
Calculates the proportion of a particular resource type, relative to the overall number of resources, then returns a log derivative (so minor variations have minimal impact).
If the global variable ignoreResourceBalance is true, this calculation is ignored.
If the global variable resourcesInTension is true, this calculation is further adjusted by the proximity of other resources.
 */
function calculateResourceEffect(resource) {
    // Allow this calculation to be ignored
    if (ignoreResourceBalance)
        return 1;

    var resourceType = resource.getType();
    var resourceTypeCount = 0;
    var totalResources = resources.length;
    if (totalResources == 1)
        return 1;
    if (resourceType == "eco") {
        resourceTypeCount = economicResourceCount;
    }
    else if (resourceType == "env") {
        resourceTypeCount = environmentalResourceCount;
    }
    else if (resourceType == "soc") {
        resourceTypeCount = socialResourceCount;
    }
    var resourceTypeProportion = resourceTypeCount / totalResources;
    var idealProportion = 1 / 3;
    var percentageOfIdeal = (resourceTypeProportion <= idealProportion) ? (resourceTypeProportion / idealProportion) : ((1 - resourceTypeProportion) / (1 - idealProportion));
    var logEffect = 1 + Math.log(percentageOfIdeal) / Math.E;

    // Further adjustment based on surrounding resources
    if (resourcesInTension) {
        logEffect *= calculateSurroundingResourcesEffects(resource);
    }
    return logEffect;
}

/*
Calculates the effect of surrounding resources
 */
function calculateSurroundingResourcesEffects(resource) {
    var x = resource.getX();
    var y = resource.getY();
    var resourceType = resource.getType();
    var baseEffect = 1;
    for (var j = 0; j < resources.length; j++) {
        var neighbour = resources[j];
        var nx = neighbour.getX();
        var ny = neighbour.getY();
        var nType = neighbour.getType();
        if (Math.abs(nx - x) <= 1 && Math.abs(ny - y) <= 1) {
            if (resourceType == "eco") {
                if (nType == "eco") {
                    baseEffect *= 1.2;
                }
                else if (nType == "env") {
                    baseEffect *= 1.0;
                }
                else if (nType == "soc") {
                    baseEffect *= 1.0;
                }
            }
            else if (resourceType == "env") {
                if (nType == "eco") {
                    baseEffect *= 0.5;
                }
                else if (nType == "env") {
                    baseEffect *= 1.2;
                }
                else if (nType == "soc") {
                    baseEffect *= 1.0;
                }
            }
            else if (resourceType == "soc") {
                if (nType == "eco") {
                    baseEffect *= 0.5;
                }
                else if (nType == "env") {
                    baseEffect *= 1.0;
                }
                else if (nType == "soc") {
                    baseEffect *= 1.2;
                }
            }
        }
    }
    return baseEffect;
}

function hasNeighbouringResources(x, y) {
    for (var j = 0; j < resources.length; j++) {
        var p = resources[j];
        var px = p.getX();
        var py = p.getY();
        if (Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1) {
            // Add hook here for evaluating relative health of neighbouring resources
//            var h = p.getHealth();
            return p;
        }
    }
    return null;
}

function isGoalCell(x, y) {
    var gx = currentLevel.getGoalX();
    var gy = currentLevel.getGoalY();
    return (gx == x && gy == y);
}

function getAbsoluteDistanceFromGoal(x, y){
    var gx = currentLevel.getGoalX();
    var gy = currentLevel.getGoalY();
    return (Math.abs(gx - x) + Math.abs(gy - y));
}

function recoverResources() {
    for (var j = 0; j < resources.length; j++) {
        var p = resources[j];
        /* Test code for restoring resource health, as opposed to resetting at the end of each wave */
        if (p.getTotalYield() < p.getInitialTotalYield()) {
            /* Overly generous... */
//            p.setTotalYield(p.getTotalYield() + p.getPerAgentYield());
            p.setTotalYield(p.getTotalYield() + 1);
            drawResource(p);
        }
    }
}

function resetResourceYields() {
    for (var i = 0; i < resources.length; i++) {
        var p = resources[i];
        p.setTotalYield(p.getInitialTotalYield());
    }
}

function newWave() {
    maxWaveMoves = 0;
    counter = 0;
    savedAgentThisWaveCount = 0;
    waves ++;
    presetAgents(++numAgents, currentLevel.getInitialAgentX(), currentLevel.getInitialAgentY());

    // Add generated agents
    $.merge(agents, currentLevel.generateWaveAgents());

    notify("New wave coming...");
}

function completeLevel() {
    stopAgents();
    storeData();
    drawScoreboard();
    showCompleteLevelDialog();
}

function newLevel() {
    maxLevelMoves = 0;
    currentLevelNumber++;
    previousLevelScore = score;
    resources = new Array();
    redrawWorld();

    levelInfo(currentLevel.getNotice());
    log("Starting new level...");
    notify("Starting new level...");

    startAgents();
}

function gameOver() {
    stopAgents();
    storeData();
    drawScoreboard();
    showGameOverDialog();
}

function completeGame() {
    stopAgents();
    storeData();
    drawScoreboard();
    showCompleteGameDialog();
}



/* Set up code */
function newGame() {
    inDesignMode = false;
    currentLevelNumber = 1;
    score = 0;
    previousLevelScore = 0;
    storeCurrentLevelData();
    var radius = (pieceWidth / 4);
    var bodyLength = (pieceWidth / 2);
    restartLevel();
}

function restartLevel() {
    inDesignMode = false;
    if ($("#godModeInput")[0] != undefined)
        godMode = $("#godModeInput")[0].checked;
    if ($("#rivalsVisibleInput")[0] != undefined)
        rivalsVisible = $("#rivalsVisibleInput")[0].checked;
    if ($("#predatorsVisibleInput")[0] != undefined)
        predatorsVisible = $("#predatorsVisibleInput")[0].checked;

    if ($("#soundsPlayableInput")[0] != undefined)
        soundsPlayable = $("#soundsPlayableInput")[0].checked;
    if ($("#backgroundIconsVisibleInput")[0] != undefined)
        backgroundIconsVisible = $("#backgroundIconsVisibleInput")[0].checked;

    if ($("#resourcesInTensionInput")[0] != undefined)
        resourcesInTension = $("#resourcesInTensionInput")[0].checked;
    if ($("#resourceBonusInput")[0] != undefined)
        resourceBonus = $("#resourceBonusInput")[0].checked;
    if ($("#applyGeneralHealthInput")[0] != undefined)
        applyGeneralHealth = $("#applyGeneralHealthInput")[0].checked;
    if ($("#ignoreResourceBalanceInput")[0] != undefined)
        ignoreResourceBalance = $("#ignoreResourceBalanceInput")[0].checked;



//    currentLevelNumber = checkInteger($("#levelInput")[0].value);
//    waveOverride = checkInteger($("#levelInput")[0].value);
//    var diffSelect = $("#difficultyInput")[0];
//    levelOfDifficulty = checkInteger(diffSelect[diffSelect.selectedIndex].value);
    score = previousLevelScore;
    resources = new Array();
    redrawWorld();
}

function redrawWorld() {

    // Stop any existing timers
    stopAgents();


    // Initialise the world
    initWorld();

    // Reset existing resources
    resetResourceYields();

    drawWorld();
}

function drawWorld() {
    // Clear canvases
    $('#map_canvas').empty();
    clearCanvas('c2');
    clearCanvas('c3');
    clearCanvas('c4');

    // Draw basic elements
    if (currentLevel.getMapOptions() != undefined || (currentLevel.getMapURL() != undefined && $.trim(currentLevel.getMapURL()).length > 0)) {
        drawMap();
        drawGrid();
        drawPath();
    }
    else {
        drawGrid();
        drawTiles();
        drawBackgroundImage();
    }
    drawEntryPoint();
    drawGoal();
    drawResources();
    drawScrollingLayer();
    drawScoreboard();

    levelInfo(currentLevel.getNotice());

}

function reloadGame() {

    currentLevelNumber = (localStorage.currentLevelNumber != undefined ? parseInt(localStorage.currentLevelNumber) : currentLevelNumber);
    score = (localStorage.currentScore != undefined ? parseInt(localStorage.currentScore) : score);
//    totalSaved = (localStorage.totalSaved != undefined ? parseInt(localStorage.totalSaved) : totalSaved);
//    profileClass = (localStorage.profileClass != undefined ? localStorage.profileClass : profileClass);
//    credits = (localStorage.credits != undefined ? parseInt(localStorage.credits) : credits);
//    capabilities = (localStorage.capabilities != undefined ? localStorage.capabilities : capabilities);
    redrawWorld();
}

function initWorld() {
    log("Initialising world...");

    agents = new Array();
    resources = new Array();
    cells = {};
//    cells = new Hash();


//    score = 0;
    economicResourceCount = 0;
    environmentalResourceCount = 0;
    socialResourceCount = 0;
    expiredAgentCount = 0;
    savedAgentCount = 0;
    waves = 1;

    resourceRecoveryCycle = Math.pow(DEFAULT_RESOURCE_RECOVERY, levelOfDifficulty - 1);

    try {
        currentLevel = eval("level" + currentLevelNumber.toString());
    }
    catch(err) {
        // Silently fail - current level stays the same if undefined
    }
    if (waveOverride > 0) {
        currentLevel.setWaveNumber(waveOverride);
        waveOverride = 0;
    }
    resourcesInStore = currentLevel.getInitialResourceStore();
    if (resourcesInStore == undefined || resourcesInStore == null) {
        resourcesInStore = STARTING_STORE;
    }


    numAgents = currentLevel.getInitialAgentNumber();
    worldSize = currentLevel.getWorldSize();
    cellWidth = WORLD_WIDTH / worldSize;
    pieceWidth = cellWidth * 0.5;
    scrollingImage.src = "/images/yellow-rain.png";

    // Set up level
    preSetupLevel(currentLevel);
    currentLevel.setupLevel();
    postSetupLevel(currentLevel);
}

function startAgents() {
    log("Starting agents...");

    clearInterval(agentTimerId);
    agentTimerId = setInterval("processAgents()", interval);
    inPlay = true;
}

function stopAgents() {
    log("Pausing agents...");

    clearInterval(agentTimerId);
    inPlay = false;
}

function slowDown() {
    if (interval < 10)
        interval += 1;
    else if (interval < 100)
        interval += 10;
    if (inPlay)
        startAgents();
}

function speedUp() {
    if (interval > 10)
        interval -= 10;
    else if (interval > 0)
        interval -= 1;
    if (inPlay)
        startAgents();
}
/* End Set up code */



/* Dialog functions */
function updateStats(func) {
    var stats = compileStats();
    $.post("/profiles/" + PROFILE_ID + "/update_stats", stats, func);

}

function showGameOverDialog() {
    determineCreditsAndClass();
    // Try to save results to the server
    if (PROFILE_ID != undefined) {
        updateStats(function(data) {
               openGameOverDialog();
           });
    }
    else {
        openGameOverDialog();
    }
}

function openGameOverDialog() {
    $gameOver
            .html(
            "Unfortunately Fierce Planet has gotten the better of its citizens! Click 'Restart Level' or 'New Game' to try again." +
                    generateStats()
            )
            .dialog('open');
}

function showCompleteGameDialog() {
    determineCreditsAndClass();
    // Try to save results to the server
    if (PROFILE_ID != undefined) {
        var stats = compileStats();
        $.post("/profiles/" + PROFILE_ID + "/update_stats", stats,
           function(data) {
               openCompleteGameDialog();
           });
    }
    else {
        openCompleteGameDialog();
    }
}

function openCompleteGameDialog() {
    $completeGame
            .html(
            "Congratulations! In spite of challenges ahead, the citizens of Fierce Planet look forward to a bright and sustainable future!" +
                    generateStats())
            .dialog('open');
}

// Show the completed level dialog
function showCompleteLevelDialog() {
    // Try to save results to the server
    determineCreditsAndClass();
    if (PROFILE_ID != undefined) {
        var stats = compileStats();
        $.post("/profiles/" + PROFILE_ID + "/update_stats", stats,
           function(data) {
               openCompleteLevelDialog();
           });
    }
    else {
        openCompleteLevelDialog();
    }
}

function openCompleteLevelDialog() {
    $completeLevel
            .html(
                "<p>Congratulations! You have completed level " + currentLevelNumber + ". </p>" +
                 generateStats() +
                "<p>Click 'OK' to start the next level.</p>")
            .dialog('open');
}

function showUpgradeDeleteDialog(e) {
    var canvas = document.getElementById('c2');
    var __ret = getResourcePosition(e, canvas);
    var posX = __ret.posX;
    var posY = __ret.posY;
    var foundResource = false;
    for (var i = 0; i < resources.length; i++) {
        var p = resources[i];
        if (p.getX() == posX && p.getY() == posY) {
            currentResource = p;
            $upgradeDelete.dialog('open');
            return;
        }
    }
    if (!foundResource && currentResourceId != null) {
        dropItem(e);
    }
}

function showResourceGallery() {
    // Try to save results to the server
    $('#current-profile-class')[0].innerHTML = profileClass;
    $('#current-credits')[0].innerHTML = credits;
    $('#current-capabilities')[0].innerHTML = capabilities.join(",");

    var accessibleCapabilities = new Array();
    var purchasableItems = new Array();

    if (profileClass == "Novice") {
        accessibleCapabilities = NOVICE_CAPABILITIES;
    }
    else if (profileClass == "Planner") {
        accessibleCapabilities = PLANNER_CAPABILITIES;
    }
    else if (profileClass == "Expert") {
        accessibleCapabilities = EXPERT_CAPABILITIES;
    }
    else if (profileClass == "Visionary") {
        accessibleCapabilities = VISIONARY_CAPABILITIES;
    }
    else if (profileClass == "Genius") {
        accessibleCapabilities = GENIUS_CAPABILITIES;
    }

    // Evaluate available capabilities
    var links = $('.purchase');
    for (var i = 0; i < links.length; i++) {
        var purchasableItem = links[i];
        var id = purchasableItem.id;
        var itemName = id.split("-purchase")[0];
        var cost = 0;
        if ($.inArray(itemName, PLANNER_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [1];
        }
        else if ($.inArray(itemName, EXPERT_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [2];
        }
        else if ($.inArray(itemName, VISIONARY_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [3];
        }
        else if ($.inArray(itemName, GENIUS_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [4];
        }
        // Make item available for purchase if: (1) the player's level permits it; (2) it is not among existing capabilities and (3) there is enough money
        if ($.inArray(itemName, accessibleCapabilities) > -1 && $.inArray(itemName, capabilities) == -1 && cost < credits) {
            // Make item purchasable
            purchasableItems.push(purchasableItem);
        }
        else {
            $('#' + purchasableItem.id).css("border","1px solid black");
        }
        // Remove any existing event listeners
        purchasableItem.removeEventListener('click');
    }
    for (var i = 0; i < purchasableItems.length; i++) {
        var purchasableItem = purchasableItems[i];
        var id = purchasableItem.id;
        var itemName = id.split("-purchase")[0];
        var cost = 0;
        if ($.inArray(itemName, PLANNER_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [1];
        }
        else if ($.inArray(itemName, EXPERT_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [2];
        }
        else if ($.inArray(itemName, VISIONARY_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [3];
        }
        else if ($.inArray(itemName, GENIUS_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [4];
        }

        purchasableItem.addEventListener('click', function(e) {
            var id = this.id;
            var swatchId = id.split("-purchase")[0];
            var itemName = $('#' + id + ' > a')[0].innerHTML;
            var purchase = confirm('Purchase item "' + itemName + '"?');
            if (purchase && $.inArray(swatchId, capabilities) == -1) {
                credits -= cost;
                capabilities.push(swatchId);
                $('#current-credits')[0].innerHTML = credits;
                $('#current-capabilities')[0].innerHTML = capabilities.join(", ");
            }
        }, false);
//        purchasableItem.css("border","9px solid red");
        $('#' + purchasableItem.id).css("border","3px solid black");
    }

    $resourceGallery.dialog('open');
}

function refreshSwatch() {
    for (var i = 0; i < capabilities.length; i++) {
        var capability = $.trim(capabilities[i]);
        $('#' + capability)[0].style.display = 'block';
    }
}

function saveCapabilities() {
    if (PROFILE_ID != undefined) {
        updateStats(function(data) {});
    }

}
/* End Dialog functions */


/* Stats functions  */
function determineCreditsAndClass() {
    credits += resourcesInStore;
    totalSaved += savedAgentCount;
    if (totalSaved > 5000) {
        profileClass = "Genius";
    }
    else if (totalSaved > 2500) {
        profileClass = "Visionary";
    }
    else if (totalSaved > 1000) {
        profileClass = "Expert";
    }
    else if (totalSaved > 500) {
        profileClass = "Planner";
    }
}

function compileStats() {
    var resourceCount = resources.length;
    var progressTowardsNextClass = 0;
    var stats = {
        "profile[current_level]": currentLevelNumber,
        "profile[current_score]": score,
        "profile[profile_class]": profileClass,
        "profile[credits]": credits,
        "profile[capabilities]": capabilities.join(','),
        waves_survived: waves,
        saved_agent_count: savedAgentCount,
        expired_agent_count: expiredAgentCount,
        resources_spent: resourcesSpent,
        resources_in_store: resourcesInStore,
        resources: resourceCount,
        economic_resources: economicResourceCount,
        environmental_resources: environmentalResourceCount,
        social_resources: socialResourceCount,
        progress_towards_next_class: progressTowardsNextClass
    };
    return stats;
}

function generateStats() {
    var stats = "<table>" +
            "<tr>" +
            "<td>Score:</td>" +
            "<td>" + score + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Level:</td>" +
            "<td>" + currentLevelNumber + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Waves survived:</td>" +
            "<td>" + waves + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Citizens saved:</td>" +
            "<td>" + savedAgentCount + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Citizens expired:</td>" +
            "<td>" + expiredAgentCount + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Resources spent:</td>" +
            "<td>" + resourcesSpent + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Resources remaining:</td>" +
            "<td>" + resourcesInStore + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td></td>" +
            "<td></td>" +
            "</tr>" +
            "<tr>" +
            "<td>Total saved:</td>" +
            "<td>" + totalSaved + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Profile class:</td>" +
            "<td>" + profileClass + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Credits:</td>" +
            "<td>" + credits + "</td>" +
            "</tr>" +
            "</table>";
    return stats;
}
/* End Stats functions  */


/* Utility functions */

/* Uses local storage to store highest scores and levels */
function storeData() {
    localStorage.currentScore = previousLevelScore;
    if (currentLevelNumber > 0 && currentLevelNumber <= 10)
        localStorage.currentLevelNumber = currentLevelNumber;
    localStorage.totalSaved = totalSaved;
    localStorage.profileClass = profileClass;
    localStorage.credits = credits;
    localStorage.capabilities = capabilities;
    if (localStorage.highestScore == undefined || score > localStorage.highestScore)
        localStorage.highestScore = score;
    if (localStorage.highestLevel == undefined || currentLevelNumber > localStorage.highestLevel)
        localStorage.highestLevel = currentLevelNumber;
}

function storeCurrentLevelData() {
    localStorage.currentScore = previousLevelScore;
    if (currentLevelNumber > 0 && currentLevelNumber <= 10)
        localStorage.currentLevelNumber = currentLevelNumber;
    localStorage.totalSaved = totalSaved;
    localStorage.profileClass = profileClass;
    localStorage.credits = credits;
    localStorage.capabilities = capabilities;
}

function checkInteger(value) {
    return Math.floor(value);
}

function log(message) {
    console.log(message);
}

function notify(notice) {
    $("#notifications")[0].innerHTML = notice;
}

function levelInfo(notice) {
    $("#level-info")[0].innerHTML = notice;
}
/* End utility functions */


/* Experimental Pan and Zoom functions */

function pan(direction) {
    var canvases = $('canvas');
    var offset = 10;
    for (var i = 0; i < canvases.length; i++) {
        var canvas = canvases[i];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width,canvas.height);
        switch (direction) {
            case 0:
                ctx.translate(0, offset);
                break;
            case 1:
                ctx.translate(0, -offset);
                break;
            case 2:
                ctx.translate(offset, 0);
                break;
            case 3:
                ctx.translate(-offset, 0);
                break;
            case 4:
                ctx.translate(- panLeftOffset / zoomLevel, - panTopOffset / zoomLevel);
                break;
        }
    }
    switch (direction) {
        case 0:
            panTopOffset += offset * zoomLevel;
            break;
        case 1:
            panTopOffset += -offset * zoomLevel;
            break;
        case 2:
            panLeftOffset += offset * zoomLevel;
            break;
        case 3:
            panLeftOffset += -offset * zoomLevel;
            break;
        case 4:
            panLeftOffset = 0;
            panTopOffset = 0;
            break;
    }
    drawWorld();
}

function saveContexts() {
    var canvases = $('canvas');
    for (var i = 0; i < canvases.length; i++) {
        var canvas = canvases[i];
        var ctx = canvas.getContext('2d');
        ctx.save();
    }
}

function zoom(direction) {
    var canvases = $('canvas');
    var magnify = 1.5;
    for (var i = 0; i < canvases.length; i++) {
        var canvas = canvases[i];
        var ctx = canvas.getContext('2d');
        switch (direction) {
            case -1:
                if (zoomLevel > 1) {
                    ctx.scale(1 / magnify, 1 / magnify);
                }
                break;
            case 0:
                ctx.scale(1 / zoomLevel, 1 / zoomLevel);
                break;
            case 1:
                if (zoomLevel < 10) {
                    ctx.scale(magnify, magnify);
                }
                break;
        }
    }
    switch (direction) {
        case -1:
            if (zoomLevel > 1) {
//                panLeftOffset *= 1 / magnify;
//                panTopOffset *= 1 / magnify;
                zoomLevel *= 1 / magnify;
            }
            break;
        case 0:
//            panLeftOffset = panLeftOffset / zoomLevel;
//            panTopOffset = panTopOffset / zoomLevel;
            zoomLevel = 1;
            break;
        case 1:
            if (zoomLevel < 10) {
//                panLeftOffset *= magnify;
//                panTopOffset *= magnify;
                zoomLevel *= magnify;
            }
            break;
    }
    drawWorld();
}
/* End Experimental Pan and Zoom functions */


