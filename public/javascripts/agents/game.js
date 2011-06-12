

/* NB: classes.js and relevant level sources must be pre-loaded */

/* Constants */


var LEVELS = 10;

var MOVE_HEALTH_COST = -2;
var SURVIVAL_SCORE = 10;
var STARTING_STORE = 100;

var RESOURCE_STORE = 10;
var DEFAULT_RESOURCE_RECOVERY = 2;
var WAVE_GOODNESS_BONUS = 5;


var NEW_LEVEL_DELAY = 400;
var NEW_WAVE_DELAY = 200;

var EASY_DIFFICULTY = 1;
var MEDIUM_DIFFICULTY = 2;
var HARD_DIFFICULTY = 3;
var EXTREME_DIFFICULTY = 4;

var WORLD_WIDTH = 800;
var WORLD_HEIGHT = 600;






/* Global variables */


// Profile properties
var PROFILE_CLASSES = ["Novice", "Planner", "Expert", "Visionary", "Genius"];
var CAPABILITY_COSTS = [0, 100, 200, 300, 500];
var NOVICE_CAPABILITIES = ["farm", "water", "clinic"];
var PLANNER_CAPABILITIES = NOVICE_CAPABILITIES.concat(["shop", "park", "school"]);
var EXPERT_CAPABILITIES = PLANNER_CAPABILITIES.concat(["bank", "air", "legal"]);
var VISIONARY_CAPABILITIES = EXPERT_CAPABILITIES.concat(["factory", "energy", "democracy"]);
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

var agentTimerId = 0;

var recordedLevels = new Array();

var currentResourceId = null;
var resourceTypes = {};

var currentLevelNumber = 1;
var currentLevelPreset = true;
var currentLevel;
var existingCurrentLevel;
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


var zoomLevel = 1;
var externalZoomLevel = 1;
var panLeftOffset = 0;
var panTopOffset = 0;

var worldWidth = 14;
var worldHeight = 11;
var cellWidth = WORLD_WIDTH / worldWidth;
var cellHeight = WORLD_HEIGHT / worldHeight;
var pieceWidth = cellWidth * 0.5;
var pieceHeight = cellHeight * 0.5;
var currentResource = null;


var scrollingImage = new Image(); // City image
var scrollingImageX = 0;
var scrollingImageOffset = 1;



/* Dialogs */
var $gameOver;
var $completeLevel;
var $completeGame;
var $levelSetup;
var $levelList;
var $upgradeDelete;
var $resourceGallery;

var audio;
var googleMap;


/* Initialisation code: start game and dialog boxes */

// Always send the authenticity_token with ajax
$(document).ajaxSend(function(event, request, settings) {
    if ( settings.type == 'post' ) {
        settings.data = (settings.data ? settings.data + "&" : "")
            + "authenticity_token=" + encodeURIComponent( AUTH_TOKEN );
    }
});

$(function(){
    $().zoom(function(direction){
        switch(direction) {
            case 1:
                externalZoomLevel *= 1.2;
                break;
            case -1:
                externalZoomLevel /= 1.2;
                break;
            case 0:
                externalZoomLevel = 1;
                break;
            }
    });
});

$(document).ready(function() {
    document.body.style.zoom = "1";

    // Reload the game when the level 1 image is loaded (TODO: how should other levels be handled?)
    reloadGame();


    // Set up dialogs
    setupDialogs();

    // Set up resource types
    setupResourceTypes();


    // Handle resource drag and drop and click interactions
    setupResourceInteraction();


    // Add general event listeners
    hookUpUIEventListeners();

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
    $('#del-button').click(function() {deleteCurrentResource(); $upgradeDelete.dialog('close'); });
    $('#upg-button').click(function() {upgradeCurrentResource(); $upgradeDelete.dialog('close'); });

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

    $settingsDialog = $('#settings-dialog')
        .dialog({
            width: 460,
            autoOpen: false,
            modal: true,
            title: 'Settings',
            buttons: {
                "OK": function() {
                    saveSettings();
                    $( this ).dialog( "close" );
                }
            }
        });

    $('#tutorial').click(function(e) {
        currentLevelNumber = 0;
        currentLevelPreset = false; 
        restartLevel();
    }, false    );
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
    $('#c4').mousewheel(function(event, delta) {
        zoom(delta);
        event.preventDefault();
        return false; // prevent default
    });
}

// Add general event listeners
function hookUpUIEventListeners() {
    // Control panel functions
    $('#startAgents').click(startAgents);
    $('#stopAgents').click(stopAgents);
   $('#slowDown').click(slowDown);
   $('#speedUp').click(speedUp);
    $('#newGame').click(newGame);
   $('#restartLevel').click(restartLevel);
   $('#showResourceGallery').click(showResourceGallery);

    // Pan/zoomFunctions
    $('#panUp').click(function() { pan(0);});
    $('#panDown').click(function() { pan(1);});
    $('#panLeft').click(function() { pan(2);});
    $('#panRight').click(function() { pan(3);});
    $('#panReset').click(function() { pan(4);});
    $('#zoomIn').click(function() { zoom(1);});
    $('#zoomOut').click(function() { zoom(-1);});
    $('#zoomReset').click(function() { zoom(0);});
    $('#settings').click(showSettings);

    addButtonEffects($('#startAgents')[0]);
    addButtonEffects($('#stopAgents')[0]);
    addButtonEffects($('#slowDown')[0]);
    addButtonEffects($('#speedUp')[0]);
    addButtonEffects($('#newGame')[0]);
    addButtonEffects($('#restartLevel')[0]);
    addButtonEffects($('#showResourceGallery')[0]);
    addButtonEffects($('#showLevelGallery')[0]);
    addButtonEffects($('#panUp')[0]);
    addButtonEffects($('#panDown')[0]);
    addButtonEffects($('#panLeft')[0]);
    addButtonEffects($('#panRight')[0]);
    addButtonEffects($('#panReset')[0]);
    addButtonEffects($('#zoomIn')[0]);
    addButtonEffects($('#zoomOut')[0]);
    addButtonEffects($('#zoomReset')[0]);


    // Admin functions
    $('#debug').click(processAgents);
    $('#replay').click(replayWorld);

    // Level editor functions
    try {
        $('#makeTile').click(makeTile);
        $('#addGoal').click(addGoal);
        $('#addAgentStartingPoint').click(addAgentStartingPoint);
        $('#showLevelProperties').click(showLevelProperties);
        $('#refreshTiles').click(refreshTiles);
        $('#undoAction').click(undoAction);
        $('#cancelLevelEditor').click(cancelLevelEditor);
    }
    catch (err){}


    // Set admin functions to previously stored defaults
    getAndRetrieveProperty('godMode');
    getAndRetrieveProperty('invisiblePath');
    getAndRetrieveProperty('agentsCanCommunicate');
    getAndRetrieveProperty('agentTracing');
    getAndRetrieveProperty('recording');
    getAndRetrieveProperty('rivalsVisible');
    getAndRetrieveProperty('predatorsVisible');
    getAndRetrieveProperty('tilesMutable');
    getAndRetrieveProperty('soundsPlayable');
    getAndRetrieveProperty('backgroundIconsVisible');
    getAndRetrieveProperty('resourcesInTension');
    getAndRetrieveProperty('resourceBonus');
    getAndRetrieveProperty('applyGeneralHealth');
    getAndRetrieveProperty('ignoreResourceBalance');

}

function getAndRetrieveProperty(property) {
    if ($('#' + property + 'Input')[0] != undefined) {
        if (localStorage[property] == "true") {
            this[property] = true;
            $('#' + property + 'Input')[0].checked = true;
        }
    }
}

/* Add button effects */
function addButtonEffects(e) {
    var imgSrc = e.src;
    var tmp = imgSrc.split('.');
    tmp.splice(tmp.length - 1, 0, "down");
    var imgSrcDown = tmp.join(".");
    e.addEventListener('mouseover', function() { e.src = imgSrcDown;}, false);
    e.addEventListener('mouseout', function() { e.src = imgSrc;}, false);
    e.addEventListener('mousedown', function() { e.src = imgSrcDown;}, false);
    e.addEventListener('mouseup', function() { e.src = imgSrc;}, false);
}

// Delete the current resource
function deleteCurrentResource() {
    var foundResource = getCurrentResourceIndex();
    if (foundResource > -1) {
        resourcesInStore += 5;
        resourcesSpent -= 5;
        currentLevel.getResources().splice(foundResource, 1);
        drawResourcesInStore();
        clearCanvas('c2');
        drawResources();
    }
}

// Upgrade the current page (NOTE: SHOULD BE TIED TO PROFILE CAPABILITIES
function upgradeCurrentResource() {
    var foundResource = getCurrentResourceIndex();
    if (foundResource > -1) {
        var p = currentLevel.getResources()[i];
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
    var __ret = getCurrentPosition(e, canvas);
    var posX = __ret.posX;
    var posY = __ret.posY;
    if (currentLevel.getCell(posX, posY) == undefined && ! currentLevel.getAllowResourcesOnPath())
        return;
    for (var i = 0; i < currentLevel.getResources().length; i++) {
        var p = currentLevel.getResources()[i];
        if (p.getX() == posX && p.getY() == posY) {
            return;
        }
    }

    var resourceCode = currentResourceId;
    if (e.dataTransfer)
        resourceCode = e.dataTransfer.getData('Text');

    var kind = resolveResourceKind(resourceCode);
    var resource = new Resource(kind, posX, posY);

    if (resourcesInStore < resource.getCost()) {
        notify('Not enough goodness for now - save some more agents!');
        return;
    }
    else {
        resourcesInStore -= resource.getCost();
        resourcesSpent += resource.getCost();
        currentLevel.getResources().push(resource);
        if (resource.getType() == 'eco') {
            economicResourceCount += 1;
        }
        else if (resource.getType() == 'env') {
            environmentalResourceCount += 1;
        }
        else if (resource.getType() == 'soc') {
            socialResourceCount += 1;
        }
        currentLevel.addCell(posX, posY, resource);

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
    resourceTypes['energy'] = 'env';
    resourceTypes['biodiversity'] = 'env';
    resourceTypes['clinic'] = 'soc';
    resourceTypes['school'] = 'soc';
    resourceTypes['legal-system'] = 'soc';
    resourceTypes['democracy'] = 'soc';
    resourceTypes['festival'] = 'soc';
}

// Find the current resource index
function getCurrentResourceIndex() {
    for (var i = 0; i < currentLevel.getResources().length; i++) {
        var p = resources[i];
        if (p == currentResource) {
            return i;
        }
    }
    return -1;
}

// Get the resource associated with an event
function getCurrentPosition(e, canvas) {
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

    x -= panLeftOffset;
    y -= panTopOffset;
    x /= zoomLevel;
    y /= zoomLevel;
    x /= externalZoomLevel;
    y /= externalZoomLevel;
    // Compensate for border
    x -= (6 / zoomLevel);
    y -= (6 / zoomLevel);
    var posX = Math.floor(x / cellWidth);
    var posY = Math.floor(y / cellHeight);
    return {posX:posX, posY:posY};
}

/* End Resource Methods */


/* Draw Methods */

function drawTiles() {
    var tiles = currentLevel.getTiles();
    for (var i = 0; i < tiles.length; i+= 1) {
        if (tiles[i] != undefined)
            drawTile(tiles[i]);
    }
}

function drawTile(tile) {
    var canvas = $('#c1')[0];
    var ctx = canvas.getContext('2d');

    var x = tile._x * cellWidth;
    var y = tile._y * cellHeight;
    ctx.clearRect(x + 1, y + 1, cellWidth - 1, cellHeight - 1);
    if (tile._y == 0 || currentLevel.getTile(tile._x, tile._y - 1) == undefined) {
        var my_gradient = ctx.createLinearGradient(x, y, x, y + cellHeight / 4);
        my_gradient.addColorStop(0, "#060");
        my_gradient.addColorStop(1, "#" + tile._color);
        ctx.fillStyle = my_gradient;
    }
    else {
        ctx.fillStyle = "#" + tile._color;
    }
    ctx.fillRect(x, y, cellWidth, cellHeight);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(x, y, cellWidth, cellHeight);
}

function drawPath() {
    var canvas = $('#c1')[0];
    var ctx = canvas.getContext('2d');
    var pathTiles = currentLevel.getPath();
    for (var i = 0; i < pathTiles.length; i+= 1) {
        var pathTile = pathTiles[i];
        var xPos = pathTile[0];
        var yPos = pathTile[1];
        var x = xPos * cellWidth;
        var y = yPos * cellHeight;
        ctx.clearRect(x + 1, y + 1, cellWidth - 1, cellHeight - 1);

        if (!invisiblePath) {
            if (yPos == 0 || currentLevel.getTile(xPos, yPos - 1) != undefined) {
                var my_gradient = ctx.createLinearGradient(x, y, x, y + cellHeight / 4);
                my_gradient.addColorStop(0, "#ccc");
                my_gradient.addColorStop(1, "#eee");
                ctx.fillStyle = my_gradient;
            }
            else {
                ctx.fillStyle = "#eee";
            }
            ctx.border = "1px #eee solid";
            ctx.fillRect(x, y, cellWidth, cellHeight);
        }
        ctx.strokeStyle = "#ccc";
        ctx.strokeRect(x, y, cellWidth, cellHeight);

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
    var mapOptions = {
      center: new google.maps.LatLng(47.5153, 19.0782),
        mapTypeId: google.maps.MapTypeId.SATELLITE,
      disableDefaultUI: true,
      zoom: 18,
        tilt: 45
    };
    if (currentLevel.getMapOptions()['lat'] != undefined && currentLevel.getMapOptions()['long'] != undefined)
        mapOptions['center'] = new google.maps.LatLng(currentLevel.getMapOptions()['lat'], currentLevel.getMapOptions()['long']);
    if (currentLevel.getMapOptions()['zoom'] != undefined)
        mapOptions['zoom'] = parseInt(currentLevel.getMapOptions()['zoom']);
    if (currentLevel.getMapOptions()['tilt'] != undefined)
        mapOptions['tilt'] = parseInt(currentLevel.getMapOptions()['tilt']);

    // Handle built-in zoom
    if (zoomLevel > 1)
        mapOptions['zoom'] = mapOptions['zoom'] + Math.log(zoomLevel) / Math.log(1.5);

    googleMap = new google.maps.Map($("#map_canvas")[0], mapOptions);
    if (currentLevel.getMapOptions()['tilt'] != undefined && currentLevel.getMapOptions()['tilt'] != 'no' )
        googleMap.setTilt(45);
}

function drawMap() {
    if (currentLevel.getMapOptions() != undefined && currentLevel.getMapOptions()['lat'] != undefined && currentLevel.getMapOptions()['long'] != undefined) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://maps.google.com/maps/api/js?sensor=false&callback=handleApiReady";
        document.body.appendChild(script);
    }
    else if (currentLevel.getMapURL() != undefined) {
        $("#map_canvas").prepend('<img src="' + currentLevel.getMapURL() + '"/>').css('image-orientation: 135deg');
    }
}



function drawGoal() {   
    var canvas = $('#c1')[0];
    var ctx = canvas.getContext('2d');

    for (var i = 0; i < currentLevel.getExitPoints().length; i++) {
        var point = currentLevel.getExitPoints()[i];
        var x = point[0] * cellWidth + cellWidth / 2;
        var y = point[1] * cellHeight + cellHeight / 2;
        var width = (pieceWidth / 2);
        var height = (pieceHeight / 2);

        ctx.beginPath();
        ctx.arc(x, y, width, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
        ctx.fillStyle = "#fbe53b";
        ctx.fill();
    }
}

function drawEntryPoints() {
    var canvas = $('#c1')[0];
    var ctx = canvas.getContext('2d');

    for (var i = 0; i < currentLevel.getEntryPoints().length; i++) {
        var point = currentLevel.getEntryPoints()[i];
        var x = point[0] * cellWidth + cellWidth / 2;
        var y = point[1] * cellHeight + cellHeight / 2;
        var width = (pieceWidth / 2);
        var height = (pieceHeight / 2);

        /*
        ctx.fillStyle = "#ddd";
        ctx.fillRect(x - width, y - width, width * 2, width * 2);
        */

        // Draw circle
        ctx.beginPath();
        ctx.arc(x, y, width, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.strokeStyle = "#ddd";
        ctx.stroke();
        ctx.fillStyle = "#ddd";
        ctx.fill();
    }

}

function drawResources() {
    for (var i = 0; i < currentLevel._resources.length; i+= 1) {
        drawResource(currentLevel._resources[i]);
    }
}

function drawResource(p) {
    var canvas = $('#c2')[0];
    var ctx = canvas.getContext('2d');

    var x = p._x * cellWidth;
    var y = p._y * cellHeight;
    var s = p._totalYield / p._initialTotalYield * 100;
    var c = p._color;
    var newColor = diluteColour(s, s, s, c);
    ctx.clearRect(x + 1, y + 1, cellWidth - 1, cellHeight - 1);
    ctx.fillStyle = "#" + newColor;
    ctx.strokeStyle = "#333";


    // Fill whole square
//    ctx.fillRect(x, y, cellWidth, cellHeight);
    // Fill smaller square
    ctx.fillRect(x + 4, y + 4, cellWidth - 8, cellHeight - 8);
    switch (p._upgradeLevel) {
        case 1:
            break;
        case 2:
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#666";
            ctx.strokeRect(x + 4, y + 4, cellWidth - 8, cellHeight - 8);
            break;
        case 3:
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#666";
            ctx.strokeRect(x + 6, y + 6, cellWidth - 12, cellHeight - 12);
            break;
        case 4:
            ctx.fillStyle = "#666";
            ctx.fillRect(x + 8, y + 8, cellWidth - 16, cellHeight - 16);
            break;
    }

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#" + newColor;
//    ctx.strokeRect(x, y, cellWidth, cellHeight);
    ctx.strokeRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);
//    ctx.strokeText(p.getUpgradeLevel(), x + 10, y + 10);

    // Draw resource-specific representation here
    var resImage = new Image();
    resImage.src = "/images/" + p._resourceName + ".gif";
    ctx.drawImage(resImage, x + 4, y + 4, cellWidth - 8, cellHeight - 8);
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
    var agents = currentLevel._currentAgents;
    if (globalCounter > 0) {
        for (var i = 0; i < agents.length; i += 1) {
            var agent = agents[i];
            var wx = agent._wanderX;
            var wy = agent._wanderY;
            var __ret = getDrawingPosition(agent, globalCounter - 1);
            var intX = __ret.intX * cellWidth + wx + 1;
            var intY = __ret.intY * cellHeight + wy + 1;
            ctx.clearRect(intX, intY, cellWidth + wx + 1, cellHeight + wy + 1);
            if (agentTracing) {
                var __ret = getDrawingPosition(agent, globalCounter - 1);
                var intX = __ret.intX * cellWidth;
                var intY = __ret.intY * cellHeight;
                ctx.beginPath();
                ctx.arc(intX + cellWidth / 2, intY + cellHeight * 1.2, 2, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.strokeStyle = "#000";
                ctx.stroke();
                ctx.fillStyle = "#000";
                ctx.fill();
            }

        }
    }
}


/* Dilutes (whitens) the colour of an element, given its strength (some value between 0 and 100) */
function diluteColour(rStrength, gStrength, bStrength, colour) {
    var charOffset = (colour.length == 3 ? 1 : 2);
    var multiplier = (charOffset == 1 ? 1 : 16);
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

function getAgentDirection(agent) {
    var lastX = agent._lastMemory._x;
    var lastY = agent._lastMemory._y;
    var x = agent._x;
    var y = agent._y;
    if (lastX < x) {
        return 0;
    }
    else {
        return 1;
    }
}

function getDrawingPosition(agent, count) {
    var lastX = agent._lastMemory._x;
    var lastY = agent._lastMemory._y;
    var x = agent._x;
    var y = agent._y;
    var wx = agent._wanderX;
    var wy = agent._wanderY;
    var speed = agent._speed;
    var increment = (speed - (count - agent._delay) % speed) / speed;


    var offsetX = (x - lastX) * (increment);
    var offsetY = (y - lastY) * (increment);
    var intX = (x - offsetX);
    var intY = (y - offsetY);


    if (currentLevel._allowOffscreenCycling) {
        var halfWay = (increment < 0.5);
        if (x == worldWidth - 1 && lastX == 0) {
            if (halfWay) {
                offsetX = (x - worldWidth) * (increment);
                intX = (x - offsetX);
            }
            else {
                offsetX = 1 - increment;
                intX = offsetX;
            }
        }
        else if (x == 0 && lastX == worldWidth - 1) {
            if (halfWay) {
                offsetX = increment;
                intX = (0 - offsetX);
            }
            else {
                offsetX = (worldWidth - lastX) * (increment);
                intX = (worldWidth - offsetX);
            }
        }
        else if (y == worldWidth - 1 && lastY == 0) {
            if (halfWay) {
                offsetY = (y - worldWidth) * (increment);
                intY = (y - offsetY);
            }
            else {
                offsetY = 1 - increment;
                intY = offsetY;
            }
        }
        else if (y == 0 && lastY == worldWidth - 1) {
            if (halfWay) {
                offsetY = increment;
                intY = (0 - offsetY);
            }
            else {
                offsetY = (worldWidth - lastY) * (increment);
                intY = (worldWidth - offsetY);
            }
        }
    }
    return {intX:intX, intY:intY};
}

function drawAgents() {
    var canvas = $('#c4')[0];
    var ctx = canvas.getContext('2d');
    var agents = currentLevel._currentAgents;
    for (var i = 0; i < agents.length; i += 1) {
        var agent = agents[i];

        // Don't process agents we want to block
        if (! rivalsVisible && agent._type == RIVAL_AGENT_TYPE)
            continue;
        if (! predatorsVisible && agent._type == PREDATOR_AGENT_TYPE)
            continue;

        // Get co-ordinates
        var wx = agent._wanderX;
        var wy = agent._wanderY;
        var __ret = getDrawingPosition(agent, globalCounter);
        var intX = __ret.intX * cellWidth + wx + cellWidth / 2;
        var intY = __ret.intY * cellHeight + wy + cellHeight / 4;
        var direction = getAgentDirection(agent);


        var ecoH = agent._economicHealth;
        var envH = agent._environmentalHealth;
        var socH = agent._socialHealth;
        var c = agent._color.toString();
        var newColor = diluteColour(socH, envH, ecoH, c);
        if (agent._isHit)
            newColor = "f00";

        try {
            eval(agent.getType().getDrawFunction())(ctx, agent, intX, intY, pieceWidth, pieceHeight, newColor, globalCounter, direction);
        } catch(e) {
            eval(CITIZEN_AGENT_TYPE.getDrawFunction())(ctx, agent, intX, intY, pieceWidth, pieceHeight, newColor, globalCounter, direction);
        }


    }
}

function drawScrollingLayer() {
    clearCanvas('c3');
    var canvas = $('#c3')[0];
    var ctx = canvas.getContext('2d');
    
    if ((scrollingImageX + scrollingImageOffset) < (500 - scrollingImageOffset)){
        scrollingImageX += scrollingImageOffset;
    }
    else {
        scrollingImageX = 1;
    }
    // Need exception handling for Safari
    try {
//        ctx.drawImage(scrollingImage, scrollingImageX, 1, 800, 600, 0, 0, 800, 600);
    }
    catch(err) {
    }
}

function drawLevel() {
    var e = $('#level-display')[0];
    e.innerHTML = currentLevelNumber.toString();
}

function drawProfileClass() {
    var e = $('#profile-class-display')[0];
    e.innerHTML = profileClass;
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
    drawProfileClass();
    drawScore();
    drawHighestScore();
    drawWaves();
    drawSaved();
    drawExpired();
    drawResourcesInStore();
}
/* End Drawing Methods */




/* Move Strategies */

function moveAgents(withNoRepeat, withNoCollision) {
    var agents = currentLevel.getCurrentAgents();
    for (var i = 0; i < agents.length; i+= 1) {
        var agent = agents[i];
        var options = {"withNoRepeat": withNoRepeat, "withNoCollision": withNoCollision};
        agent.evaluateMove(currentLevel, options);
//        moveAgent(agent, withNoRepeat, withNoCollision);
    }
}

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
    agent.setPosition(position[0], position[1]);
    agent.incrementMoves();
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

/*
 * Processes neighbouring resources
 */
function processNeighbouringResources(agent) {
    var x = agent.getX();
    var y = agent.getY();
    for (var j = 0; j < currentLevel.getResources().length; j++) {
        var resource = currentLevel.getResources()[j];
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
    agent.setIsHit(false);
    var agents = currentLevel.getCurrentAgents();
    for (var j = 0; j < agents.length; j++) {
        var a = agents[j];
        var ax = a.getX();
        var ay = a.getY();
        if (Math.abs(ax - x) <= 1 && Math.abs(ay - y) <= 1) {
            if (!godMode && predatorsVisible && agent.getType() == CITIZEN_AGENT_TYPE && a.getType() == PREDATOR_AGENT_TYPE) {
                agent.setIsHit(true);
            }
        }
    }
    if (agent.getIsHit())
        agent.adjustHealth(-10);
}

function hasNeighbouringResources(x, y) {
    for (var j = 0; j < currentLevel.getResources().length; j++) {
        var p = currentLevel.getResources()[j];
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



function checkCollision(x, y) {
    return currentLevel.getCell(x, y) == undefined;
}

function moveAgentsRandomly() {
    var agents = currentLevel.getCurrentAgents();
    for (var i = 0; i < agents.length; i+= 1) {
        var dir = Math.floor(Math.random() * 4);
        var agent = agents[i];
        var newX = agent.getX();
        var newY = agent.getY();
        switch (dir) {
            case 0:
                (newX == 0) ? newX = worldWidth - 1 : newX = newX - 1;
                break;
            case 1:
                (newX == worldWidth - 1) ? newX = 0 : newX = newX + 1;
                break;
            case 2:
                (newY == 0) ? newY = worldWidth - 1 : newY = newY - 1;
                break;
            case 3:
                (newY == worldWidth - 1) ? newY = 0 : newY = newY + 1;
                break;
        }
        if (!checkTiles(newX, newY))
            agent.setPosition(newX, newY);
    }
}

function checkTiles(newX, newY) {
    var isTile = false;
    var tiles = currentLevel.getTiles();
    for (var j = 0; j < tiles.length; j+= 1) {
        var tile = tiles[j];
        if (tile.getX() == newX && tile.getY() == newY)
            return true;
    }
    return isTile;
}
/* End Move Strategies */


/* Game logic methods */
function processAgents() {

    var recordableChangeMade = false;

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
    globalCounter++;


    clearAgents();

    var nullifiedAgents = new Array();
    var citizenCount = 0;
    var agents = currentLevel.getCurrentAgents();

    // Pre-movement processing - DO NOTHING FOR NOW
    for (var i = 0; i < agents.length; i++) {
        var agent = agents[i];
        var speed = agent.getSpeed();
        if (globalCounter >= agent.getDelay() && (globalCounter - agent.getDelay()) % speed == 0) {
            agent.evaluatePosition();
        }
    }

    // Move agents
    var options = {"withNoRepeat": true, "withNoCollision": false};
    for (var i = 0; i < agents.length; i++) {
        var agent = agents[i];

        // Don't process agents we want to block
        if (! rivalsVisible && agent.getType() == RIVAL_AGENT_TYPE)
            continue;
        if (! predatorsVisible && agent.getType() == PREDATOR_AGENT_TYPE)
            continue;

        var speed = agent.getSpeed();
        if (agent.getType() == CITIZEN_AGENT_TYPE)
            citizenCount++;
        if (globalCounter >= agent.getDelay() && (globalCounter - agent.getDelay()) % speed == 0) {
            recordableChangeMade = true;
            // TODO: move this logic elsewhere
            if (agent.getType() == CITIZEN_AGENT_TYPE) {
                if (currentLevel.isExitPoint(agent.getX(), agent.getY())) {
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
            agent.evaluateMove(options);

            if (agent.getType() == CITIZEN_AGENT_TYPE) {
                agent.adjustSpeed();
                agent.adjustWander();
            }

            if (agent.getMoves() > maxWaveMoves)
                maxWaveMoves = agent.getMoves();
            if (agent.getMoves() > maxLevelMoves)
                maxLevelMoves = agent.getMoves();

            // TODO: should be in-lined?
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
        currentLevel.getCurrentAgents().splice(nullifiedAgents[i], 1);
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
        if (globalCounter % resourceRecoveryCycle == 0)
            recoverResources();
        drawAgents();
    }

    // Post-move processing
    if (recording)
        recordWorld();

}

function recordWorld() {
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
}

function replayWorld() {
    stopAgents();
    existingCurrentLevel = currentLevel;
    clearInterval(agentTimerId);
    globalRecordingCounter = 0;
    drawWorld();
    inPlay = true;

    setTimeout("replayStart()", 3000);
}

function replayStart() {
    agentTimerId = setInterval("replayStep()", interval);

}
function replayStep() {
    var level = recordedLevels[globalRecordingCounter];
    console.log("Replaying at: " + globalRecordingCounter);
    console.log("Level: " + level);
    if (level == undefined) {
        replayStop();
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
}

function replayStop() {
    agentTimerId = clearInterval(agentTimerId);
    globalRecordingCounter = 0;
    currentLevel = existingCurrentLevel;
    inPlay = false;
}


/*
Calculates the proportion of a particular resource type, relative to the overall number of resources, then returns a log derivative (so minor variations have minimal impact).
If the global variable ignoreResourceBalance is true, this calculation is ignored.
If the global variable resourcesInTension is true, this calculation is further adjusted by the proximity of other resources.
 */
function calculateResourceEffect(resource) {
    // Allow this calculation to be ignored
    if (ignoreResourceBalance || applyGeneralHealth)
        return 1;

    var resourceType = resource.getType();
    var resourceTypeCount = 0;
    var totalResources = currentLevel.getResources().length;
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
    var resourceTypeProportion = (resourceTypeCount / totalResources) * totalResources;
    var proportionOfIdeal = (resourceTypeProportion <= 1) ? resourceTypeProportion : ((totalResources - resourceTypeProportion) / (totalResources - 1));
    var effect = proportionOfIdeal * proportionOfIdeal;

    // Further adjustment based on surrounding resources
    if (resourcesInTension) {
        effect *= calculateSurroundingResourcesEffects(resource);
    }
    return effect;
}

/*
Calculates the effect of surrounding resources
 */
function calculateSurroundingResourcesEffects(resource) {
    var x = resource.getX();
    var y = resource.getY();
    var resourceType = resource.getType();
    var baseEffect = 1;
    for (var j = 0; j < currentLevel.getResources().length; j++) {
        var neighbour = currentLevel.getResources()[j];
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


function recoverResources() {
    for (var j = 0; j < currentLevel.getResources().length; j++) {
        var p = currentLevel.getResources()[j];
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
    for (var i = 0; i < currentLevel.getResources().length; i++) {
        var p = currentLevel.getResources()[i];
        p.setTotalYield(p.getInitialTotalYield());
    }
}

function newWave() {
    maxWaveMoves = 0;
    globalCounter = 0;
    savedAgentThisWaveCount = 0;
    waves ++;

    presetAgents(++numAgents, currentLevel.getEntryPoints());
    var agents = currentLevel.getCurrentAgents();
    for (var i = 0; i < agents.length; i++) {
        var agent = agents[i];
        agent.setCanCommunicateWithOtherAgents(agentsCanCommunicate);
    }

    // Add generated agents
    $.merge(currentLevel.getCurrentAgents(), currentLevel.generateWaveAgents(numAgents));
    $.merge(currentLevel.getCurrentAgents(), currentLevel.getLevelAgents());

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
    currentLevel.setResources(new Array());
    recordedLevels = new Array();
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

function restartLevel() {
    inDesignMode = false;

    setAndStoreProperty('godMode');
    setAndStoreProperty('invisiblePath');
    setAndStoreProperty('agentsCanCommunicate');
    setAndStoreProperty('agentTracing');
    setAndStoreProperty('recording');
    setAndStoreProperty('rivalsVisible');
    setAndStoreProperty('predatorsVisible');
    setAndStoreProperty('tilesMutable');
    setAndStoreProperty('soundsPlayable');
    setAndStoreProperty('backgroundIconsVisible');
    setAndStoreProperty('resourcesInTension');
    setAndStoreProperty('resourceBonus');
    setAndStoreProperty('applyGeneralHealth');
    setAndStoreProperty('ignoreResourceBalance');



//    currentLevelNumber = checkInteger($("#levelInput")[0].value);
//    waveOverride = checkInteger($("#levelInput")[0].value);
//    var diffSelect = $("#difficultyInput")[0];
//    levelOfDifficulty = checkInteger(diffSelect[diffSelect.selectedIndex].value);
    score = previousLevelScore;
    currentLevel.setResources(new Array());
    recordedLevels = new Array();
    redrawWorld();
}

function setAndStoreProperty(property) {
    if ($("#" + property + "Input")[0] != undefined) {
        var propertyInputValue = $("#" + property + "Input")[0].checked;
        this[property] = propertyInputValue;
        localStorage[property] = propertyInputValue;
        console.log($("#" + property + "Input"));
    }
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
    clearCanvas('c1');
    clearCanvas('c2');
    clearCanvas('c3');
    clearCanvas('c4');

    // Draw basic elements
    if ((currentLevel.getMapOptions() != undefined  && currentLevel.getMapOptions()['lat'] != undefined && currentLevel.getMapOptions()['long'] != undefined)
            || (currentLevel.getMapURL() != undefined && $.trim(currentLevel.getMapURL()).length > 0)) {
        drawMap();
        drawPath();
    }
    else {
        drawTiles();
        drawBackgroundImage();
        drawPath();
    }
    drawEntryPoints();
    drawGoal();
    drawResources();
    drawScrollingLayer();
    drawScoreboard();

    levelInfo(currentLevel.getNotice());

}

function reloadGame() {
    currentLevelNumber = (localStorage.currentLevelNumber != undefined ? parseInt(localStorage.currentLevelNumber) : currentLevelNumber);
    currentLevelPreset = (localStorage.currentLevelPreset != undefined ? (localStorage.currentLevelPreset === 'true') : currentLevelPreset);
    score = (localStorage.currentScore != undefined ? parseInt(localStorage.currentScore) : score);
//    totalSaved = (localStorage.totalSaved != undefined ? parseInt(localStorage.totalSaved) : totalSaved);
//    profileClass = (localStorage.profileClass != undefined ? localStorage.profileClass : profileClass);
//    credits = (localStorage.credits != undefined ? parseInt(localStorage.credits) : credits);
//    capabilities = (localStorage.capabilities != undefined ? localStorage.capabilities : capabilities);
    redrawWorld();
}

function initWorld() {
    log("Initialising world...");

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
//        try {
//            $.get("/levels/" + currentLevelNumber, { format: "js" });
//        }
//        catch(err) {
//            currentLevel = eval("level1");
//        }
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
    preSetupLevel(currentLevel);
    currentLevel.setupLevel();
    postSetupLevel(currentLevel);

    // Determine whether agents can communicate
    var agents = currentLevel.getCurrentAgents();
    for (var i = 0; i < agents.length; i++) {
        var agent = agents[i];
        agent.setCanCommunicateWithOtherAgents(agentsCanCommunicate);
    }
}

function startAgents() {
    log("Starting agents...");

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

function stopAgents() {
    log("Pausing agents...");

    clearInterval(agentTimerId);
    inPlay = false;

    if (audio != undefined)
        audio.pause();
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
    var __ret = getCurrentPosition(e, canvas);
    var posX = __ret.posX;
    var posY = __ret.posY;
    var foundResource = false;
    for (var i = 0; i < currentLevel.getResources().length; i++) {
        var p = currentLevel.getResources()[i];
        if (p.getX() == posX && p.getY() == posY) {
            currentResource = p;
            $upgradeDelete.dialog('open');
            return;
        }
    }
    var currentTile = currentLevel.getTile(posX, posY);
    /*
    var foundTile = false;
    var tiles = currentLevel.getTiles();
    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        if (tile._x == posX && tile._y == posY) {
            currentTile = tile;
        }
    }
    */

    if (tilesMutable) {
        if (currentTile == undefined) {
            currentLevel.addTile(new Tile(TILE_COLOR, posX, posY));
            drawWorld();
        }
        else if (!foundResource && currentResourceId != null) {
            dropItem(e);
        }
        else {
            currentLevel.annulCell(posX, posY);
            spliceTiles(e, canvas);
            drawWorld();
        }
    }
    else if (!foundResource && currentResourceId != null) {
        dropItem(e);
    }
}

function spliceTiles(e, canvas) {
    var __ret = getCurrentPosition(e, canvas);
    var posX = __ret.posX;
    var posY = __ret.posY;
    var tilePosition = -1;
    currentLevel.removeTile(posX, posY);

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
//        purchasableItem.removeEventListener('click', handler, false);
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
            var itemName = $('#' + id + ' > a > img')[0].title;
            if ($.inArray(swatchId, capabilities) == -1) {
                var purchase = confirm('Purchase item "' + itemName + '"?');
                if (purchase) {
                    credits -= cost;
                    capabilities.push(swatchId);
                    $('#current-credits')[0].innerHTML = credits;
                    $('#current-capabilities')[0].innerHTML = capabilities.join(", ");
                    $('#' + id).css("border","1px solid black");
                }
            }
            e.stopPropagation();
            return false;
        }, true );
//        purchasableItem.css("border","9px solid red");
        $('#' + purchasableItem.id).css("border","3px solid black");
    }

    $resourceGallery.dialog('open');
}

function showSettings() {
    $settingsDialog.dialog('open');
}

function refreshSwatch() {
    for (var i = 0; i < capabilities.length; i++) {
        var capability = $.trim(capabilities[i]);
        try {
            $('#' + capability)[0].style.display = 'block';
        }
        catch (err) {
            console.log(err);
            console.log(capability);
        }
    }
}

function saveCapabilities() {
    if (PROFILE_ID != undefined) {
        updateStats(function(data) {});
    }
}

function saveSettings() {
    restartLevel();
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
    var resourceCount = currentLevel.getResources().length;
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
//    if (currentLevelNumber > 0 && currentLevelNumber <= MAX_DEFAULT_LEVELS)
    localStorage.currentLevelNumber = currentLevelNumber;
    localStorage.currentLevelPreset = currentLevel.isPresetLevel();
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
    if (currentLevelNumber > 0 && currentLevelNumber <= MAX_DEFAULT_LEVELS)
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


/* Pan and Zoom functions */

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
//                    ctx.translate(200, 150);
                }
                break;
            case 0:
                ctx.scale(1 / zoomLevel, 1 / zoomLevel);
//                ctx.translate(0, 0);
                break;
            case 1:
                if (zoomLevel < 10) {
                    ctx.scale(magnify, magnify);
//                    ctx.translate(-200 * magnify, -150 * magnify);
                }
                break;
        }
    }
    switch (direction) {
        case -1:
            if (zoomLevel > 1) {
//                panLeftOffset += 200;
//                panTopOffset += 150;
                zoomLevel *= 1 / magnify;
            }
            break;
        case 0:
//            panLeftOffset = 0;
//            panTopOffset = 0;
            zoomLevel = 1;
            break;
        case 1:
            if (zoomLevel < 10) {
//                panLeftOffset -= 200;
//                panTopOffset -= 150;
                zoomLevel *= magnify;
            }
            break;
    }
    drawWorld();
}
/* End Pan and Zoom functions */


