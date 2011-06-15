/**
 * Utility methods
 */


// Always send the authenticity_token with ajax
$(document).ajaxSend(function(event, request, settings) {
    if ( settings.type == 'post' ) {
        settings.data = (settings.data ? settings.data + "&" : "")
            + "authenticity_token=" + encodeURIComponent( AUTH_TOKEN );
    }
});

var externalZoomLevel = 1;

// Handle zoom, as best as possible
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

function checkInteger(value) {
    return Math.floor(value);
}

/**
 * Gets a property from local storage, and sets this on the settings dialog
 * @param property
 */
function getAndRetrieveProperty(property) {
    if ($('#' + property + 'Input')[0] != undefined) {
        if (localStorage[property] == "true") {
            this[property] = true;
            $('#' + property + 'Input')[0].checked = true;
        }
    }
}

/**
 * Sets a property local storage based on values in the settings dialog
 * @param property
 */
function setAndStoreProperty(property) {
    if ($("#" + property + "Input")[0] != undefined) {
        var propertyInputValue = $("#" + property + "Input")[0].checked;
        this[property] = propertyInputValue;
        localStorage[property] = propertyInputValue;
    }
}

/**
 * Gets all properties from local storage, and sets them on the settings dialog
 */
function getAndRetrieveProperties() {
    getAndRetrieveProperty('godMode');
    getAndRetrieveProperty('invisiblePath');
    getAndRetrieveProperty('agentsCanCommunicate');
    getAndRetrieveProperty('agentTracing');
    getAndRetrieveProperty('scrollingImageVisible');
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



/**
 * Sets all properties on settings dialog, and stores property values in local storage
 */
function setAndStoreProperties() {
    setAndStoreProperty('godMode');
    setAndStoreProperty('invisiblePath');
    setAndStoreProperty('agentsCanCommunicate');
    setAndStoreProperty('agentTracing');
    setAndStoreProperty('scrollingImageVisible');
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

    restartLevel();
}
