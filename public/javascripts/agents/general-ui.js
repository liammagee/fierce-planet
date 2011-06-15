/**
 * General UI functions
 */

/**
 * Adds a series of event listeners to UI elements
 */
function hookUpUIEventListeners() {
    // Control panel functions
    $('#startAgents').click(startAgents);
    $('#stopAgents').click(stopAgents);
   $('#slowDown').click(slowDown);
   $('#speedUp').click(speedUp);
    $('#newGame').click(newGame);
   $('#restartLevel').click(restartLevel);
   $('#showResourceGallery').click(showResourceGallery);

    // Pan/zoomFunctions
    $('#panUp').click(function() { pan(0);});
    $('#panDown').click(function() { pan(1);});
    $('#panLeft').click(function() { pan(2);});
    $('#panRight').click(function() { pan(3);});
    $('#panReset').click(function() { pan(4);});
    $('#zoomIn').click(function() { zoom(1);});
    $('#zoomOut').click(function() { zoom(-1);});
    $('#zoomReset').click(function() { zoom(0);});
    $('#settings').click(showSettings);

    addButtonEffects($('#startAgents')[0]);
    addButtonEffects($('#stopAgents')[0]);
    addButtonEffects($('#slowDown')[0]);
    addButtonEffects($('#speedUp')[0]);
    addButtonEffects($('#newGame')[0]);
    addButtonEffects($('#restartLevel')[0]);
    addButtonEffects($('#showResourceGallery')[0]);
    addButtonEffects($('#showLevelGallery')[0]);
    addButtonEffects($('#panUp')[0]);
    addButtonEffects($('#panDown')[0]);
    addButtonEffects($('#panLeft')[0]);
    addButtonEffects($('#panRight')[0]);
    addButtonEffects($('#panReset')[0]);
    addButtonEffects($('#zoomIn')[0]);
    addButtonEffects($('#zoomOut')[0]);
    addButtonEffects($('#zoomReset')[0]);


    // Admin functions
    $('#debug').click(processAgents);
    $('#replay').click(Recording.replayWorld);


    // Level editor functions
    try {
        $('#showLevelProperties').click(showLevelProperties);
        $('#refreshTiles').click(refreshTiles);
        $('#undoAction').click(undoAction);
        $('#cancelLevelEditor').click(cancelLevelEditor);
        $('#clearEntryPoints').click(clearEntryPoints);
        $('#clearExitPoints').click(clearExitPoints);
    }
    catch (err){
        console.log(err);
    }

    // Set admin functions to previously stored defaults
    getAndRetrieveProperty('godMode');
    getAndRetrieveProperty('invisiblePath');
    getAndRetrieveProperty('agentsCanCommunicate');
    getAndRetrieveProperty('agentTracing');
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

    $('#c4').mousewheel(function(event, delta) {
        zoom(delta);
        event.preventDefault();
        return false; // prevent default
    });

}


/**
 *  Add button effects
 */
function addButtonEffects(e) {
    var imgSrc = e.src;
    if (imgSrc != undefined) {
        var tmp = imgSrc.split('.');
        tmp.splice(tmp.length - 1, 0, "down");
        var imgSrcDown = tmp.join(".");
        e.addEventListener('mouseover', function() { e.src = imgSrcDown;}, false);
        e.addEventListener('mouseout', function() { e.src = imgSrc;}, false);
        e.addEventListener('mousedown', function() { e.src = imgSrcDown;}, false);
        e.addEventListener('mouseup', function() { e.src = imgSrc;}, false);
    }
}


/**
 * Gets the current position of a mouse click
 * @param e
 */
function getCurrentPosition(e) {
    var x;
    var y;
    if (e.layerX || e.layerX == 0) { // Firefox
        x = e.layerX;
        y = e.layerY;
    } else if (e.offsetX || e.offsetX == 0) { // Opera
        x = e.offsetX;
        y = e.offsetY;
    }

    x -= panLeftOffset;
    y -= panTopOffset;
    x /= zoomLevel;
    y /= zoomLevel;
    x /= externalZoomLevel;
    y /= externalZoomLevel;

    // Compensate for border
    x -= (6 / zoomLevel);
    y -= (6 / zoomLevel);
    var posX = Math.floor(x / cellWidth);
    var posY = Math.floor(y / cellHeight);
    return {posX:posX, posY:posY};
}


/**
 * Adds a notice to the notification area.
 * @param notice
 */
function notify(notice) {
    $("#notifications")[0].innerHTML = notice;
}


/**
 * Adds a notice to the level information area.
 * @param notice
 */
function levelInfo(notice) {
    $("#level-info")[0].innerHTML = notice;
}

