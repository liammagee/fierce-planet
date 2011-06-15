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
var nowEditingProperties = false;




function showDesignFeaturesDialog(e) {
    $("#makeTile").click(function(e) {
        var tile = new Tile(DEFAULT_TILE_COLOR, currentX, currentY);
        currentLevel.addTile(tile);
        $designFeatures.dialog('close');
        drawWorld();
    });

    $("#addExitPoint").click(function(e) {
        currentLevel.addExitPoint(currentX, currentY);
        $designFeatures.dialog('close');
        drawWorld();
    });

    $("#addEntryPoint").click(function(e) {
        currentLevel.removeEntryPoint(0, 0);
        currentLevel.addEntryPoint(currentX, currentY);
        $designFeatures.dialog('close');
        drawWorld();
    });


    $("#removeEntryPoint").click(function(e) {
        currentLevel.removeEntryPoint(currentX, currentY);
        $designFeatures.dialog('close');
        drawWorld();
    });

    $("#removeExitPoint").click(function(e) {
        currentLevel.removeExitPoint(currentX, currentY);
        $designFeatures.dialog('close');
        drawWorld();
    });


    $designFeatures.dialog('open');
}

function setupLevelEditor() {
    $('#delete-upgrade').hide();
    $('#swatch').hide();
    $('#level-editor').show();

    var canvas = $('#c4');
    canvas.unbind('click');
//    canvas.click(function() {return false;});
    canvas.mousedown(handleEditorMouseDown);
    canvas.mousemove(handleEditorMouseMove);
    canvas.mouseup(handleEditorMouseUp);

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
        mouseMoving = true;
        var __ret = getCurrentPosition(e);
        currentLevel.removeTile(__ret.posX, __ret.posY);
        drawWorld();
    }
    return false;
}

function handleEditorMouseUp(e) {
    var __ret = getCurrentPosition(e);
    currentX = __ret.posX;
    currentY = __ret.posY;

    var currentTile = currentLevel.getTile(currentX, currentY);
    if (currentTile == undefined && !mouseMoving) {
        showDesignFeaturesDialog(e);
    }
    else {
        currentLevel.removeTile(currentX, currentY);
        drawWorld();
    }

    mouseDown = false;
    mouseMoving = false;

    return false;
}

function cancelLevelEditor() {
    inDesignMode = false;
    var canvas = $('#c4');
    canvas.unbind('mousedown', handleEditorMouseDown);
    canvas.unbind('mousemove', handleEditorMouseMove);
    canvas.unbind('mouseup', handleEditorMouseUp);
    $('#level-editor').hide();
    $('#swatch').show();
    restartLevel();
}

function undoAction() {
    currentLevel.setTiles(oldTiles);
    drawWorld();
}


function showLevelProperties() {
    $editProperties.dialog('open');
}

function refreshTiles() {
    currentLevel.fillWithTiles();
    currentLevel.addEntryPoint(0, 0);
    drawWorld();
}

function clearEntryPoints() {
    currentLevel.resetEntryPoints();
    drawWorld();
}

function clearExitPoints() {
    currentLevel.resetExitPoints();
    drawWorld();
}

/* End Level editor functions */
