/**
 * Created by .
 * User: Liam
 * Date: 23/03/11
 * Time: 4:52 PM
 * To change this template use File | Settings | File Templates.
 */

/* Level editor functions */

var currentX;
var currentY;

var $designFeatures;
var $editProperties;


$(document).ready(function() {

	$designFeatures = $('#level-features')
		.dialog({
			autoOpen: false,
            modal: true,
			title: 'Add design features',
            buttons: {
                "Cancel": function() {
                    $( this ).dialog( "close" );
                }
            }

		});

	$editProperties = $('<div></div>')
		.html('Edit level properties')
		.dialog({
			autoOpen: false,
            modal: true,
			title: 'Edit level properties',
            buttons: {
                "Cancel": function() {
                    $( this ).dialog( "close" );
                }
            }

		});


});


function spliceTiles(e, canvas) {
    var __ret = getResourcePosition(e, canvas);
    var posX = __ret.posX;
    var posY = __ret.posY;
    var tilePosition = -1;
    var tiles = currentLevel.getTiles();
    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        if (tile._x == posX && tile._y == posY) {
            tilePosition = i;
            break;
        }
    }
    if (tilePosition > -1) {
        tiles.splice(tilePosition, 1);
    }
}
function redrawBaseCanvas() {

    $('#map_canvas').empty();
    clearCanvas('c1');
    clearCanvas('c2');
    clearCanvas('c3');
    clearCanvas('c4');

    // Draw basic elements
    drawGrid();
    drawTiles();
    drawEntryPoints();
    drawGoal();
}
function showLevelEditor() {
    var proposedWorldSize = 10; //checkInteger(prompt("Enter a size for your level: ", "10"));
    currentLevelNumber = 11;
    currentLevel = new Level(11);
    currentLevel.setWorldSize(proposedWorldSize);
    currentLevel.setupLevel = function(){};
    fillWithTiles();
    setupLevelEditor();
}
function showDesignFeaturesDialog(e) {
    $("#makeTile")[0].addEventListener('click', function(e) {
        var tile = new Tile(TILE_COLOR, currentX, currentY);
        currentLevel.getTiles().push(tile);
        $designFeatures.dialog('close');
        redrawBaseCanvas();
    }, false);

    $("#addGoal")[0].addEventListener('click', function(e) {
        currentLevel.setGoalX(currentX);
        currentLevel.setGoalY(currentY);
        $designFeatures.dialog('close');
        redrawBaseCanvas();
    }, false);

    $("#addAgentStartingPoint")[0].addEventListener('click', function(e) {
        currentLevel.setInitialAgentX(currentX);
        currentLevel.setInitialAgentY(currentY);
        $designFeatures.dialog('close');
        redrawBaseCanvas();
    }, false);
    $designFeatures.dialog('open');
}
function makeTile() {
    var tile = new Tile(TILE_COLOR, currentX, currentY);
    currentLevel.getTiles().push(tile);
    $designFeatures.dialog('close');
    redrawBaseCanvas();
}

function addGoal() {
    currentLevel.setGoalX(currentX);
    currentLevel.setGoalY(currentY);
    redrawBaseCanvas();
    $designFeatures.dialog('close');
}

function addAgentStartingPoint() {
    currentLevel.setInitialAgentX(currentX);
    currentLevel.setInitialAgentY(currentY);
    redrawBaseCanvas();
    $designFeatures.dialog('close');
}

function setupLevelEditor() {
    $('#delete-upgrade').hide();
    $('#swatch').hide();
    $('#level-editor').show();
    var canvas = $('#c4')[0];
    canvas.removeEventListener('click');
    canvas.addEventListener('click', function(e) {
        return false;
    }, false);
    canvas.addEventListener("mousedown", handleEditorMouseDown, false);
    canvas.addEventListener("mousemove", handleEditorMouseMove, false);
    canvas.addEventListener("mouseup", handleEditorMouseUp, false);

    redrawWorld();

    inDesignMode = true;
}

function handleEditorMouseDown(e) {
    oldTiles = currentLevel.getTiles().slice();
    mouseDown = true;
    return false;
}

function handleEditorMouseMove(e) {
    if (mouseDown) {
        var canvas = $('#c4')[0];
        mouseMoving = true;
        spliceTiles(e, canvas);
        redrawBaseCanvas();
    }
    return false;
}

function handleEditorMouseUp(e) {
    var canvas = $('#c4')[0];
    var __ret = getResourcePosition(e, canvas);
    currentX = __ret.posX;
    currentY = __ret.posY;
    var foundTile = false;
    var tiles = currentLevel.getTiles();
    var currentTile;
    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        if (tile._x == currentX && tile._y == currentY) {
            currentTile = tile;
            break;
        }
    }
    if (currentTile == undefined && !mouseMoving) {
        showDesignFeaturesDialog(e);
    }
    else {
        spliceTiles(e, canvas);
        redrawBaseCanvas();
    }
    mouseDown = false;
    mouseMoving = false;


    return false;

}

function cancelLevelEditor() {
    inDesignMode = false;
    var canvas = $('#c4')[0];
    canvas.removeEventListener('mousedown', handleEditorMouseDown, false);
    canvas.removeEventListener('mousemove', handleEditorMouseMove, false);
    canvas.removeEventListener('mouseup', handleEditorMouseUp, false);
//    setupResourceInteraction();
//    currentLevelNumber = 1;
    $('#level-editor').hide();
    $('#swatch').show();
    redrawWorld();
}

function undoAction() {
    currentLevel.setTiles(oldTiles);
    redrawBaseCanvas();
}

function saveLevel() {
    // Save tiles to server
    var f = $('.edit_level')[0];
    $('#level_tiles')[0].value = $.toJSON(currentLevel.getTiles());
    $('#level_world_width')[0].value = worldSize;
    $('#level_world_height')[0].value = worldSize;

//    redrawWorld();
}



function showLevelProperties() {
    $editProperties.dialog('open');
}

function refreshTiles() {
    currentLevel.setTiles(fillWithTiles());
    currentLevel.setInitialAgentX(0);
    currentLevel.setInitialAgentY(0);
    currentLevel.setGoalX(0);
    currentLevel.setGoalY(0);
    redrawBaseCanvas();
}

/* End Level editor functions */
