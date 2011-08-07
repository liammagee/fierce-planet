/*!
 * Fierce Planet - Level Editor
 * Level editor functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains drawing functions
 */
FiercePlanet.Editor = FiercePlanet.Editor || {};


(function() {

    /**
     *
     * @param e
     */
    this.showDesignFeaturesDialog = function(e) {
        $("#make-tile").click(function(e) {
            var tile = new Tile(DEFAULT_TILE_COLOR, FiercePlanet.currentX, FiercePlanet.currentY);
            FiercePlanet.currentLevel.addTile(tile);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });

        $("#add-exit-point").click(function(e) {
            FiercePlanet.currentLevel.addExitPoint(FiercePlanet.currentX, FiercePlanet.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });

        $("#add-entry-point").click(function(e) {
            FiercePlanet.currentLevel.removeEntryPoint(0, 0);
            FiercePlanet.currentLevel.addEntryPoint(FiercePlanet.currentX, FiercePlanet.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });


        $("#remove-entry-point").click(function(e) {
            FiercePlanet.currentLevel.removeEntryPoint(FiercePlanet.currentX, FiercePlanet.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });

        $("#remove-exit-point").click(function(e) {
            FiercePlanet.currentLevel.removeExitPoint(FiercePlanet.currentX, FiercePlanet.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.drawGame();
        });

        $("#remove-resource").click(function(e) {
            FiercePlanet.currentLevel.removeResourceByPosition(FiercePlanet.currentX, FiercePlanet.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });


        FiercePlanet.Dialogs.designFeaturesDialog.dialog('open');
    };

    /**
     * Set up the level editor
     */
    this.setupLevelEditor = function() {
        $('#delete-upgrade').hide();
//    $('#swatch').hide();
        $('#level-editor').show();

        var canvas = $('#agentCanvas');
        canvas.unbind('click');
        canvas.unbind('mousedown');
        canvas.unbind('mousemove');
        canvas.unbind('mouseup');
//    canvas.click(function() {return false;});
        canvas.mousedown(FiercePlanet.Editor.handleEditorMouseDown);
        canvas.mousemove(FiercePlanet.Editor.handleEditorMouseMove);
        canvas.mouseup(FiercePlanet.Editor.handleEditorMouseUp);

        FiercePlanet.inDesignMode = true;

        FiercePlanet._initialiseGame();
    };

    /**
     * Handle mouse down event in the editor
     * @param e
     */
    this.handleEditorMouseDown = function(e) {
        FiercePlanet.oldTiles = FiercePlanet.currentLevel.tiles.slice();
        FiercePlanet.isMouseDown = true;
        FiercePlanet.isMouseMoving = false;
        return false;
    };

    /**
     * Handle mouse move event in the editor
     * @param e
     */
    this.handleEditorMouseMove = function(e) {
        if (e.preventDefault) e.preventDefault(); // allows us to drop
        if (FiercePlanet.isMouseDown) {
            FiercePlanet.isMouseMoving = true;
            var __ret = FiercePlanet.GeneralUI.getCurrentPosition(e);
            FiercePlanet.currentLevel.removeTile(__ret.posX, __ret.posY);
            FiercePlanet.Drawing.drawCanvases();
        }
        return false;
    };

    /**
     * Handle mouse up event in the editor
     * @param e
     */
    this.handleEditorMouseUp = function(e) {
        if (e.preventDefault) e.preventDefault(); // allows us to drop
        var __ret = FiercePlanet.GeneralUI.getCurrentPosition(e);
        FiercePlanet.currentX = __ret.posX;
        FiercePlanet.currentY = __ret.posY;

        var currentTile = FiercePlanet.currentLevel.getTile(FiercePlanet.currentX, FiercePlanet.currentY);
        if (currentTile == undefined && !FiercePlanet.isMouseMoving) {
            FiercePlanet.Editor.showDesignFeaturesDialog(e);
        }
        else {
            FiercePlanet.currentLevel.removeTile(FiercePlanet.currentX, FiercePlanet.currentY);
            FiercePlanet.Drawing.drawCanvases();
        }

        FiercePlanet.isMouseDown = false;

        return false;
    };

    /**
     * Cancels the level editor
     */
    this.cancelLevelEditor = function() {
        FiercePlanet.inDesignMode = false;
        FiercePlanet.Editor.closeMap();
        var canvas = $('#agentCanvas');
        canvas.unbind('mousedown', FiercePlanet.Editor.handleEditorMouseDown);
        canvas.unbind('mousemove', FiercePlanet.Editor.handleEditorMouseMove);
        canvas.unbind('mouseup', FiercePlanet.Editor.handleEditorMouseUp);
        FiercePlanet.GeneralUI.bindGameMouseEvents();
        $('#level-editor').hide();
        $('#swatch').show();
    };

    /**
     * Undoes the last action
     */
    this.undoAction = function() {
        FiercePlanet.currentLevel.tiles = (FiercePlanet.oldTiles);
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Shows the level properties dialog
     */
    this.showLevelProperties = function() {
        FiercePlanet.Dialogs.editPropertiesDialog.dialog('open');
    };

    /**
     * Refreshes the level with tiles
     */
    this.refreshTiles = function() {
        FiercePlanet.currentLevel.fillWithTiles();
        FiercePlanet.currentLevel.addEntryPoint(0, 0);
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Clears the level of tiles
     */
    this.fillAllTiles = function() {
        FiercePlanet.currentLevel.removeAllTiles();
        FiercePlanet.currentLevel.addEntryPoint(0, 0);
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Clears all entry points from the level
     */
    this.clearEntryPoints = function() {
        FiercePlanet.currentLevel.resetEntryPoints();
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Clears all exit points from the level
     */
    this.clearExitPoints = function() {
        FiercePlanet.currentLevel.resetExitPoints();
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Allows the map to be editable
     */
    this.editMap = function() {
        $('#map_canvas').css({zIndex: 1000});
        var mapOptions = GoogleMapUtils.defaultOptions();
        $.extend(mapOptions, FiercePlanet.currentLevel.mapOptions);
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
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Allows the map to be editable
     */
    this.saveMap = function() {
        var center = FiercePlanet.googleMap.getCenter();
        var tilt = FiercePlanet.googleMap.getTilt();
        var zoom = FiercePlanet.googleMap.getZoom();
        var mapTypeId = FiercePlanet.googleMap.getMapTypeId();
        FiercePlanet.currentLevel.mapOptions = {
            center: center,
            tilt: tilt,
            zoom: zoom,
            mapTypeId: mapTypeId
        };
    };

    /**
     * Allows the map to be editable
     */
    this.closeMap = function() {
        var mapOptions = GoogleMapUtils.defaultOptions();
        $.extend(mapOptions, FiercePlanet.currentLevel.mapOptions);
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
        FiercePlanet.Drawing.drawCanvases();
    };

}).apply(FiercePlanet.Editor);
