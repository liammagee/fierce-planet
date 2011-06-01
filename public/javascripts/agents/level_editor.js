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



function redrawBaseCanvas() {
    drawWorld();
    /*
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
    */
}
function showLevelEditor() {
    var proposedWorldSize = 10;
    currentLevelNumber = MAX_DEFAULT_LEVELS + 1;
    currentLevel = new Level(currentLevelNumber);
    currentLevel.setWorldWidth(proposedWorldSize);
    currentLevel.setWorldHeight(proposedWorldSize);
    currentLevel.setupLevel = function(){};
    fillWithTiles();
    setupLevelEditor();
}
function showDesignFeaturesDialog(e) {
    $("#makeTile")[0].addEventListener('click', function(e) {
        var tile = new Tile(TILE_COLOR, currentX, currentY);
        currentLevel.addTile(tile);
        $designFeatures.dialog('close');
        redrawBaseCanvas();
    }, false);

    $("#clearEntryPoint").click(function(e) {
        currentLevel.resetEntryPoints();
        redrawBaseCanvas();
    });

    $("#addGoal")[0].addEventListener('click', function(e) {
        currentLevel.setGoalX(currentX);
        currentLevel.setGoalY(currentY);
        $designFeatures.dialog('close');
        redrawBaseCanvas();
    }, false);

    $("#addAgentStartingPoint")[0].addEventListener('click', function(e) {
        console.log(currentX);
        currentLevel.removeInitialPoint(0, 0);
        currentLevel.addEntryPoint(currentX, currentY);
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
    var __ret = getCurrentPosition(e, canvas);
    currentX = __ret.posX;
    currentY = __ret.posY;

    var foundTile = false;
    var currentTile;
    currentTile = currentLevel.getTile(currentX, currentY);
    /*
    var tiles = currentLevel.getTiles();
    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];

        if (tile != undefined && tile._x == currentX && tile._y == currentY) {
            currentTile = tile;
            break;
        }
    }
    */
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
    restartLevel();
}

function undoAction() {
    currentLevel.setTiles(oldTiles);
    redrawBaseCanvas();
}

function saveLevel() {
    // Save tiles to server
    var f = $('.edit_level')[0];
    $('#level_entry_points')[0].value = $.toJSON(currentLevel.getEntryPoints());
    $('#level_exit_points')[0].value = $.toJSON(currentLevel.getExitPoints());
    $('#level_tiles')[0].value = $.toJSON(currentLevel.getTiles());
    $('#level_world_width')[0].value = worldWidth;
    $('#level_world_height')[0].value = worldHeight;

//    redrawWorld();
}



function showLevelProperties() {
    $editProperties.dialog('open');
}

function refreshTiles() {
    currentLevel.setTiles(fillWithTiles());
    currentLevel.addEntryPoint(0, 0);
    currentLevel.setGoalX(0);
    currentLevel.setGoalY(0);
    redrawBaseCanvas();
}

/* End Level editor functions */
