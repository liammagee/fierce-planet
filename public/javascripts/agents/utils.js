/*!
 * Fierce Planet - Utils
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


// Modify the namespace

/**
 * Always send the authenticity_token with ajax
 */
$(document).ajaxSend(function(event, request, settings) {
    if ( settings.type == 'post' ) {
        settings.data = (settings.data ? settings.data + "&" : "")
            + "authenticity_token=" + encodeURIComponent( AUTH_TOKEN );
    }
});


/**
 * Handle zoom, as best as possible
 */
$(function(){
    $().zoom(function(direction){
        if (typeof console != "undefined")
            console.log('zooming');
        switch(direction) {
            case 1:
                FiercePlanet.externalZoomLevel *= 1.2;
                break;
            case -1:
                FiercePlanet.externalZoomLevel /= 1.2;
                break;
            case 0:
                FiercePlanet.externalZoomLevel = 1;
                break;
            }
    });
});




var FiercePlanet = FiercePlanet || {};

/**
 * @namespace Contains utility functions
 */
FiercePlanet.Utils = FiercePlanet.Utils || {};

(function() {

    /**
     * Simple method for coercing a value to a floored integer
     * @param value
     */
    this.checkInteger = function(value) {
        return Math.floor(value);
    };

    /**
     * Binds shortcut variables for use in the console
     */
    this.bindVariables = function() {
        // Set up shortcut variable names for debugging convenience
        $fp.w = $fp.w || World;
        $fp.s = $fp.s || World.settings;
        $fp.p = FiercePlanet.currentProfile;
        $fp.l = FiercePlanet.currentLevel;
        $fp.r = FiercePlanet.currentResource;
        $fp.rid = FiercePlanet.currentResourceId;
        $fp.x = FiercePlanet.currentX;
        $fp.y = FiercePlanet.currentY;
    };

    /**
     * Initialises World settings
     */
    this.initialiseWorldSettings = function() {
        World.settings.noticesVisible = World.settings.noticesVisible || true;
        World.settings.statusBarVisible = World.settings.statusBarVisible || true;
        World.settings.scrollingImageVisible = World.settings.scrollingImageVisible || true;
        World.settings.catastrophesVisible = World.settings.catastrophesVisible || true;
        World.settings.disableKeyboardShortcuts = World.settings.disableKeyboardShortcuts || true;
        World.settings.soundsPlayable = World.settings.soundsPlayable || false;
        World.settings.useInlineResourceSwatch = World.settings.useInlineResourceSwatch || false;
        World.settings.allowInlinePanning = World.settings.allowInlinePanning || false;
        World.settings.agentTracing = World.settings.agentTracing || false;
        World.settings.hidePath = World.settings.hidePath || false;
        World.settings.hidePathBorder = World.settings.hidePathBorder || false;
        World.settings.showGraph = World.settings.showGraph || false;

        World.settings.rivalsVisible = World.settings.rivalsVisible || false;
        World.settings.predatorsVisible = World.settings.predatorsVisible || false;
        World.settings.tilesMutable = World.settings.tilesMutable || false;
        World.settings.tilesRemovable = World.settings.tilesRemovable || false;
        World.settings.backgroundIconsVisible = World.settings.backgroundIconsVisible || false;
        World.settings.recording = World.settings.recording || false;
        World.settings.godMode = World.settings.godMode || false;
    }

    /**
     * Sourced from: http://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript/1267338#1267338.
     *
     * @param number
     * @param width
     */
    this.zeroFill = function ( number, width ){
      width -= number.toString().length;
      if ( width > 0 ) {
        return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
      }
      return number;
    };



    /**
     * Gets all properties from local storage, and sets them on the settings dialog.
     */
    this.getAndRetrieveProperties = function() {

        // Get the settings from the World object
        for (var key in World.settings) {
            // Make sure we're only capturing numbers, strings, booleans (not objects, functions or undefineds)
            if (World.settings.hasOwnProperty(key) && $.inArray(typeof World.settings[key], ["number", "string", "boolean"]) > -1) {
                var option = $('#' + key);
                if (option && option.length > 0) {
                    // Using a checkbox?
                    if (option[0].type == "checkbox") {
                        option[0].checked = World.settings[key];
                    }
                    // Using a slider?
                    else if (option.attr("class") && option.attr("class").indexOf("slider-component") > -1) {
                        option.slider("value", World.settings[key]);
                        $('#' + key + "Display")[0].innerHTML = World.settings[key];
                    }
                }
            }
        }
    };


    /**
     * Sets all properties on settings dialog, and stores property values in local storage.
     */
    this.setAndStoreProperties = function() {

        // Set the settings on the World object

        // Add checkbox values
        var inputs = $('#settings-dialog input[type="checkbox"]');
        for (var key in inputs) {
            var inputID = inputs[key].id;
            World.settings[inputID] = inputs[key].checked;
        }

        // Add slider values
        inputs = $('#settings-dialog .slider-component');
        for (key in inputs) {
            inputID = inputs[key].id;
            World.settings[inputID] = $("#" + inputID).slider("value");
        }



        // Store all settings
        World.settings.store();

        FiercePlanet.Utils.processSettings();

        FiercePlanet.restartLevel();
    };


    /**
     * Processes settings
     */
    this.processSettings = function() {
        // Handle setting specific settings
        if (World.settings.showGraph) {
            FiercePlanet.Drawing.drawGraph();
        }
        else {
            FiercePlanet.Drawing.clearGraph();
        }

        if (World.settings.disableKeyboardShortcuts)
            $(document).unbind('keydown');
        else {
            $(document).keydown(FiercePlanet.GeneralUI.handleKeyboardShortcuts);
        }

        // Update based on allowInlinePanning property
        FiercePlanet.GeneralUI.unbindGameMouseEvents();
        FiercePlanet.GeneralUI.bindGameMouseEvents();

        if (World.settings.resourcesUpgradeable)
            $('#upgrade-option').css('display', 'block');
        else
            $('#upgrade-option').css('display', 'none');

        if (World.settings.makeSquare) {
//        $('#world').height($('#world').width());
            $('#world').height(480);
            $('#map_canvas').height(480);
            $('canvas').height(480);
            $('canvas').width(480);
            $('#notifications').css('top', '597px');
            $('#level-editor').css('top', '580px');
//        FiercePlanet.WORLD_HEIGHT = 480;
        }
        else {
            $('#world').height(400);
            $('#map_canvas').height(400);
            $('canvas').height(400);
            $('canvas').width(480);
            $('#notifications').css('top', '517px');
            $('#level-editor').css('top', '500px');
            FiercePlanet.WORLD_HEIGHT = 400;
        }
    };

}).apply(FiercePlanet.Utils);



