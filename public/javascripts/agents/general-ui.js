/**
 * General UI functions
 */

/**
 * Declare the FiercePlanet namespace
 */
var FiercePlanet = FiercePlanet || {};


/**
 * Adds a series of event listeners to UI elements
 */
FiercePlanet.hookUpUIEventListeners = function() {
    // Control panel functions
    $('#playAgents').click(FiercePlanet.playGame);
    $('#pauseAgents').click(FiercePlanet.pauseGame);
   $('#slowDown').click(FiercePlanet.slowDown);
   $('#speedUp').click(FiercePlanet.speedUp);
    $('#newGame').click(FiercePlanet.newGame);
   $('#restartLevel').click(FiercePlanet.restartLevel);
   $('#showResourceGallery').click(FiercePlanet.showResourceGallery);

    // Pan/zoomFunctions
    $('#panUp').click(function() { FiercePlanet.pan(0);});
    $('#panDown').click(function() { FiercePlanet.pan(1);});
    $('#panLeft').click(function() { FiercePlanet.pan(2);});
    $('#panRight').click(function() { FiercePlanet.pan(3);});
    $('#panReset').click(function() { FiercePlanet.pan(4);});
    $('#zoomIn').click(function() { FiercePlanet.zoom(1);});
    $('#zoomOut').click(function() { FiercePlanet.zoom(-1);});
    $('#zoomReset').click(function() { FiercePlanet.zoom(0);});
    $('#settings').click(FiercePlanet.showSettings);

//    FiercePlanet.addButtonEffects($('#playAgents')[0]);
//    FiercePlanet.addButtonEffects($('#pauseAgents')[0]);
//    FiercePlanet.addButtonEffects($('#slowDown')[0]);
//    FiercePlanet.addButtonEffects($('#speedUp')[0]);
//    FiercePlanet.addButtonEffects($('#newGame')[0]);
//    FiercePlanet.addButtonEffects($('#restartLevel')[0]);
//    FiercePlanet.addButtonEffects($('#showResourceGallery')[0]);
//    FiercePlanet.addButtonEffects($('#showLevelGallery')[0]);
//    FiercePlanet.addButtonEffects($('#panUp')[0]);
//    FiercePlanet.addButtonEffects($('#panDown')[0]);
//    FiercePlanet.addButtonEffects($('#panLeft')[0]);
//    FiercePlanet.addButtonEffects($('#panRight')[0]);
//    FiercePlanet.addButtonEffects($('#panReset')[0]);
//    FiercePlanet.addButtonEffects($('#zoomIn')[0]);
//    FiercePlanet.addButtonEffects($('#zoomOut')[0]);
//    FiercePlanet.addButtonEffects($('#zoomReset')[0]);


    // Admin functions
    $('#debug').click(FiercePlanet.processAgents);
    $('#replay').click(FiercePlanet.replayWorld);


    // Level editor functions
    try {
        $('#showLevelProperties').click(FiercePlanet.showLevelProperties);
        $('#refreshTiles').click(FiercePlanet.refreshTiles);
        $('#fillAll').click(FiercePlanet.fillAllTiles);
        $('#undoAction').click(FiercePlanet.undoAction);
        $('#cancelLevelEditor').click(FiercePlanet.cancelLevelEditor);
        $('#clearEntryPoints').click(FiercePlanet.clearEntryPoints);
        $('#clearExitPoints').click(FiercePlanet.clearExitPoints);
    }
    catch (err){
//        console.log(err);
    }

    // Set admin functions to previously stored defaults
    FiercePlanet.getAndRetrieveProperties();

    $('#agentCanvas').mousewheel(function(event, delta) {
        FiercePlanet.zoom(delta);
        event.preventDefault();
        return false; // prevent default
    });

};


/**
 *  Add button effects
 */
FiercePlanet.addButtonEffects = function(e) {
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
};


/**
 * Gets the current position of a mouse click
 * @param e
 */
FiercePlanet.getCurrentPosition = function(e) {
    var x;
    var y;
    if (e.layerX || e.layerX == 0) { // Firefox
        x = e.layerX;
        y = e.layerY;
    } else if (e.offsetX || e.offsetX == 0) { // Opera
        x = e.offsetX;
        y = e.offsetY;
    }

    x -= FiercePlanet.panLeftOffset;
    y -= FiercePlanet.panTopOffset;
    x /= FiercePlanet.zoomLevel;
    y /= FiercePlanet.zoomLevel;
    x /= FiercePlanet.externalZoomLevel;
    y /= FiercePlanet.externalZoomLevel;

    // Compensate for border
    x -= (6 / FiercePlanet.zoomLevel);
    y -= (6 / FiercePlanet.zoomLevel);
    var posX = Math.floor(x / FiercePlanet.cellWidth);
    var posY = Math.floor(y / FiercePlanet.cellHeight);
    return {posX:posX, posY:posY};
};


/**
 * Adds a notice to the notification area.
 * @param notice
 */
FiercePlanet.notify = function(notice) {
    $("#notifications")[0].innerHTML = notice;
};


/**
 * Adds a notice to the level information area.
 * @param notice
 */
FiercePlanet.levelInfo = function(notice) {
//    $("#level-info")[0].innerHTML = notice;
    FiercePlanet.$newLevel
            .html("<p>" + notice +"</p>")
            .dialog('open');
};


/**
 * Refresh the swatch area with latest capabilities
 */
FiercePlanet.refreshSwatch = function() {
    for (var i = 0; i < FiercePlanet.capabilities.length; i++) {
        var capability = $.trim(FiercePlanet.capabilities[i]);
        try {
            $('#' + capability)[0].style.display = 'block';
        }
        catch (err) {
        }
    }
};