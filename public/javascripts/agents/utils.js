/*!
 * Fierce Planet - Utils
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */




var FiercePlanet = FiercePlanet || {};


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


/**
 * Simple method for coercing a value to a floored integer
 * @param value
 */
FiercePlanet.checkInteger = function(value) {
    return Math.floor(value);
};


/**
 * Sourced from: http://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript/1267338#1267338.
 *
 * @param number
 * @param width
 */
FiercePlanet.zeroFill = function ( number, width ){
  width -= number.toString().length;
  if ( width > 0 ) {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number;
};



/**
 * Gets all properties from local storage, and sets them on the settings dialog.
 */
FiercePlanet.getAndRetrieveProperties = function() {
    // Retrieve properties
    World.settings.load();

    // Get the settings from the World object
    for (var key in World.settings) {
        // Make sure we're only capturing numbers, strings, booleans (not objects, functions or undefineds)
        if (World.settings.hasOwnProperty(key) && $.inArray(typeof World.settings[key], ["number", "string", "boolean"]) > -1) {
            $('#' + key)[0].checked = World.settings[key];
        }
    }
};


/**
 * Sets all properties on settings dialog, and stores property values in local storage.
 */
FiercePlanet.setAndStoreProperties = function() {

    // Set the settings on the World object
    var inputs = $('#settings-dialog input[type="checkbox"]');
    for (var key in inputs) {
        var inputID = inputs[key].id;
        World.settings[inputID] = inputs[key].checked;
    }

    // Store all settings
    World.settings.store();


    if (World.settings.disableKeyboardShortcuts)
        $(document).unbind('keydown');
    else {
        $(document).keydown(FiercePlanet.handleKeyboardShortcuts);
    }

    // Update based on allowInlinePanning property
    FiercePlanet.unbindGameMouseEvents();
    FiercePlanet.bindGameMouseEvents();

    if (World.settings.resourcesUpgradeable)
        $('#upgrade-option').css('display', 'block');
    else
        $('#upgrade-option').css('display', 'none');


    FiercePlanet.restartLevel();
};
