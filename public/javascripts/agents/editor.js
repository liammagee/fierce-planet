/*!
 * Fierce Planet - Level Editor
 * Level editor functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};


/**
 *
 * @param e
 */
FiercePlanet.showDesignFeaturesDialog = function(e) {
    $("#make-tile").click(function(e) {
        var tile = new Tile(DEFAULT_TILE_COLOR, FiercePlanet.currentX, FiercePlanet.currentY);
        FiercePlanet.currentLevel.addTile(tile);
        FiercePlanet.designFeaturesDialog.dialog('close');
        FiercePlanet.drawGame();
    });

    $("#add-exit-point").click(function(e) {
        FiercePlanet.currentLevel.addExitPoint(FiercePlanet.currentX, FiercePlanet.currentY);
        FiercePlanet.designFeaturesDialog.dialog('close');
        FiercePlanet.drawGame();
    });

    $("#add-entry-point").click(function(e) {
        FiercePlanet.currentLevel.removeEntryPoint(0, 0);
        FiercePlanet.currentLevel.addEntryPoint(FiercePlanet.currentX, FiercePlanet.currentY);
        FiercePlanet.designFeaturesDialog.dialog('close');
        FiercePlanet.drawGame();
    });


    $("#remove-entry-point").click(function(e) {
        FiercePlanet.currentLevel.removeEntryPoint(FiercePlanet.currentX, FiercePlanet.currentY);
        FiercePlanet.designFeaturesDialog.dialog('close');
        FiercePlanet.drawGame();
    });

    $("#remove-exit-point").click(function(e) {
        FiercePlanet.currentLevel.removeExitPoint(FiercePlanet.currentX, FiercePlanet.currentY);
        FiercePlanet.designFeaturesDialog.dialog('close');
        FiercePlanet.drawGame();
    });

    $("#remove-resource").click(function(e) {
        FiercePlanet.currentLevel.removeResourceByPosition(FiercePlanet.currentX, FiercePlanet.currentY);
        FiercePlanet.designFeaturesDialog.dialog('close');
        FiercePlanet.drawGame();
    });


    FiercePlanet.designFeaturesDialog.dialog('open');
};

/**
 * 
 */
FiercePlanet.setupLevelEditor = function() {
    $('#delete-upgrade').hide();
//    $('#swatch').hide();
    $('#level-editor').show();

    var canvas = $('#agentCanvas');
    canvas.unbind('click');
    canvas.unbind('mousedown');
    canvas.unbind('mousemove');
    canvas.unbind('mouseup');
//    canvas.click(function() {return false;});
    canvas.mousedown(FiercePlanet.handleEditorMouseDown);
    canvas.mousemove(FiercePlanet.handleEditorMouseMove);
    canvas.mouseup(FiercePlanet.handleEditorMouseUp);

    FiercePlanet.inDesignMode = true;

    FiercePlanet._initialiseGame();
};

/**
 *
 * @param e
 */
FiercePlanet.handleEditorMouseDown = function(e) {
    FiercePlanet.oldTiles = FiercePlanet.currentLevel.getTiles().slice();
    FiercePlanet.isMouseDown = true;
    FiercePlanet.isMouseMoving = false;
    return false;
};

/**
 *
 * @param e
 */
FiercePlanet.handleEditorMouseMove = function(e) {
    if (e.preventDefault) e.preventDefault(); // allows us to drop
    if (FiercePlanet.isMouseDown) {
        FiercePlanet.isMouseMoving = true;
        var __ret = FiercePlanet.getCurrentPosition(e);
        FiercePlanet.currentLevel.removeTile(__ret.posX, __ret.posY);
        FiercePlanet.drawCanvases();
    }
    return false;
};

/**
 *
 * @param e
 */
FiercePlanet.handleEditorMouseUp = function(e) {
    if (e.preventDefault) e.preventDefault(); // allows us to drop
    var __ret = FiercePlanet.getCurrentPosition(e);
    FiercePlanet.currentX = __ret.posX;
    FiercePlanet.currentY = __ret.posY;

    var currentTile = FiercePlanet.currentLevel.getTile(FiercePlanet.currentX, FiercePlanet.currentY);
    if (currentTile == undefined && !FiercePlanet.isMouseMoving) {
        FiercePlanet.showDesignFeaturesDialog(e);
    }
    else {
        FiercePlanet.currentLevel.removeTile(FiercePlanet.currentX, FiercePlanet.currentY);
        FiercePlanet.drawCanvases();
    }

    FiercePlanet.isMouseDown = false;

    return false;
};

/**
 *
 */
FiercePlanet.cancelLevelEditor = function() {
    FiercePlanet.inDesignMode = false;
    FiercePlanet.closeMap();
    var canvas = $('#agentCanvas');
    canvas.unbind('mousedown', FiercePlanet.handleEditorMouseDown);
    canvas.unbind('mousemove', FiercePlanet.handleEditorMouseMove);
    canvas.unbind('mouseup', FiercePlanet.handleEditorMouseUp);
    FiercePlanet.bindGameMouseEvents();
    $('#level-editor').hide();
    $('#swatch').show();
};

/**
 *
 */
FiercePlanet.undoAction = function() {
    FiercePlanet.currentLevel.setTiles(FiercePlanet.oldTiles);
    FiercePlanet.drawGame();
};

/**
 *
 */
FiercePlanet.showLevelProperties = function() {
    FiercePlanet.editPropertiesDialog.dialog('open');
};

/**
 *
 */
FiercePlanet.refreshTiles = function() {
    FiercePlanet.currentLevel.fillWithTiles();
    FiercePlanet.currentLevel.addEntryPoint(0, 0);
    FiercePlanet.drawGame();
};

/**
 *
 */
FiercePlanet.fillAllTiles = function() {
    FiercePlanet.currentLevel.removeAllTiles();
    FiercePlanet.currentLevel.addEntryPoint(0, 0);
    FiercePlanet.drawGame();
};

/**
 * Clears all entry points from the level
 */
FiercePlanet.clearEntryPoints = function() {
    FiercePlanet.currentLevel.resetEntryPoints();
    FiercePlanet.drawGame();
};

/**
 * Clears all exit points from the level
 */
FiercePlanet.clearExitPoints = function() {
    FiercePlanet.currentLevel.resetExitPoints();
    FiercePlanet.drawGame();
};

/**
 * Allows the map to be editable
 */
FiercePlanet.editMap = function() {
    $('#map_canvas').css({zIndex: 1000});
    var mapOptions = GoogleMapUtils.defaultOptions();
    $.extend(mapOptions, FiercePlanet.currentLevel.getMapOptions());
    $.extend(mapOptions, {
            disableDefaultUI: false,
            mapTypeControl: true,
            overviewMapControl: true,
            panControl: true,
            rotateControl: true,
            scaleControl: true,
            streetViewControl: true,
            zoomControl: true
        });
    FiercePlanet.googleMap = GoogleMapUtils.createMap(mapOptions);
    FiercePlanet.drawCanvases();
};

/**
 * Allows the map to be editable
 */
FiercePlanet.saveMap = function() {
    var center = FiercePlanet.googleMap.getCenter();
    var tilt = FiercePlanet.googleMap.getTilt();
    var zoom = FiercePlanet.googleMap.getZoom();
    var mapTypeId = FiercePlanet.googleMap.getMapTypeId();
    var mapOptions = {
        center: center,
        tilt: tilt,
        zoom: zoom,
        mapTypeId: mapTypeId
    };
    FiercePlanet.currentLevel.setMapOptions(mapOptions);
};

/**
 * Allows the map to be editable
 */
FiercePlanet.closeMap = function() {
    var mapOptions = GoogleMapUtils.defaultOptions();
    $.extend(mapOptions, FiercePlanet.currentLevel.getMapOptions());
    $.extend(mapOptions, {
        disableDefaultUI: true,
        mapTypeControl: false,
        overviewMapControl: false,
        panControl: false,
        rotateControl: false,
        scaleControl: false,
        streetViewControl: false,
        zoomControl: false
        });
    FiercePlanet.googleMap = GoogleMapUtils.createMap(mapOptions);
    $('#map_canvas').css({zIndex: 1});
    FiercePlanet.drawCanvases();
};
