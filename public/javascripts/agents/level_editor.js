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

function spliceTiles(e, canvas) {
    var __ret = getPatchPosition(e, canvas);
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
    clearCanvas('c1');

    // Draw basic elements
    drawGrid();
    drawTiles();
    drawEntryPoint();
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
        var tile = new Tile("ddd", currentX, currentY);
        currentLevel.getTiles().push(tile);
        $designFeatures.dialog('close');
        redrawWorld();
    }, false);

    $("#addGoal")[0].addEventListener('click', function(e) {
        currentLevel.setGoalX(currentX);
        currentLevel.setGoalY(currentY);
        $designFeatures.dialog('close');
        $designFeatures.dialog('close');
        redrawWorld();
    }, false);

    $("#addAgentStartingPoint")[0].addEventListener('click', function(e) {
        currentLevel.setInitialAgentX(currentX);
        currentLevel.setInitialAgentY(currentY);
        $designFeatures.dialog('close');
    }, false);
    $designFeatures
            .html($('#level-features')[0].innerHTML)
            .dialog('open');
}
function makeTile() {
    var tile = new Tile("ccc", currentX, currentY);
    currentLevel.getTiles().push(tile);
    $designFeatures.dialog('close');
    redrawWorld();
}

function addGoal() {
    currentLevel.setGoalX(currentX);
    currentLevel.setGoalY(currentY);
    $designFeatures.dialog('close');
    $designFeatures.dialog('close');
    redrawWorld();
}

function addAgentStartingPoint() {
    currentLevel.setInitialAgentX(currentX);
    currentLevel.setInitialAgentY(currentY);
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
    canvas.addEventListener("mousedown", function(e) {
        oldTiles = currentLevel.getTiles().slice();
        mouseDown = true;
        return false;
    }, false);
    canvas.addEventListener("mousemove", function(e) {
        if (mouseDown) {
            mouseMoving = true;
            spliceTiles(e, canvas);
            redrawBaseCanvas();
        }
        return false;
    }, false);
    canvas.addEventListener("mouseup", function(e) {
        var __ret = getPatchPosition(e, canvas);
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


        redrawBaseCanvas();
        return false;
    }, false);



    redrawWorld();
    inDesignMode = true;
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
}

function cancelLevelEditor() {
    inDesignMode = false;
    currentLevelNumber = 1;
    $('#level-editor').hide();
    $('#swatch').show();
    redrawWorld();
}


/* End Level editor functions */
