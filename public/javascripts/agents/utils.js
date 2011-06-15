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

function getAndRetrieveProperty(property) {
    if ($('#' + property + 'Input')[0] != undefined) {
        if (localStorage[property] == "true") {
            this[property] = true;
            $('#' + property + 'Input')[0].checked = true;
        }
    }
}
function setAndStoreProperty(property) {
    if ($("#" + property + "Input")[0] != undefined) {
        var propertyInputValue = $("#" + property + "Input")[0].checked;
        this[property] = propertyInputValue;
        localStorage[property] = propertyInputValue;
    }
}

