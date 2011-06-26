/*!
 * Fierce Planet - GeneralUI
 * General UI functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};


/**
 * Adds a series of event listeners to UI elements
 */
FiercePlanet.hookUpUIEventListeners = function() {
    // Control panel functions
    $('#playAgents').click(FiercePlanet.playGame);
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
    $('#credits').click(FiercePlanet.showCredits);



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
        if (typeof console != "undefined")
            console.log(err);
    }

    // Set admin functions to previously stored defaults
    FiercePlanet.getAndRetrieveProperties();

    $('#agentCanvas').mousewheel(function(event, delta) {
        FiercePlanet.zoom(delta);
        event.preventDefault();
        return false; // prevent default
    });

    $('#agentCanvas').click(FiercePlanet.handleNoticeEvents);

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
 * Respond to clicks on the notice canvas
 * @param e
 */
FiercePlanet.handleNoticeEvents = function(e) {
    if (FiercePlanet.currentNotice != null) {
        var notice = FiercePlanet.currentNotice;
        var s = notice._start;
        var d = notice._duration;
        if (s > FiercePlanet.levelCounter || (s + d) < FiercePlanet.levelCounter)
            return;
        var x = notice._x;
        var y = notice._y;
        var w = notice._width;
        var h = notice._height;
        var ex;
        var ey;
        if (e.layerX || e.layerX == 0) { // Firefox
            ex = e.layerX;
            ey = e.layerY;
        } else if (e.offsetX || e.offsetX == 0) { // Opera
            ex = e.offsetX;
            ey = e.offsetY;
        }
        if (ex >= x && ex <= x + w && ey >= y && ey <= y + h) {
            FiercePlanet.currentNotice = undefined;
            FiercePlanet.clearCanvas('noticeCanvas');
        }
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
    x -= (1 / FiercePlanet.zoomLevel);
    y -= (1 / FiercePlanet.zoomLevel);
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
FiercePlanet.levelInfo = function() {
    var levelHTML = "";
    if (FiercePlanet.currentLevel.getName() != undefined) {
        levelHTML += "<h3>" + FiercePlanet.currentLevel.getName() + "</h3>";
    }
    if (FiercePlanet.currentLevel.getImage() != undefined) {
        levelHTML += '<img src="' + FiercePlanet.currentLevel.getImage() + '" alt="City Image" width="460" height="140">';
    }
    if (FiercePlanet.currentLevel.getIntroduction() != undefined) {
        levelHTML += FiercePlanet.currentLevel.getIntroduction();
    }
    FiercePlanet.$newLevel.html(levelHTML).dialog('open');
};


/**
 * Refresh the swatch area with latest capabilities
 */
FiercePlanet.refreshSwatch = function() {
    for (var i = 0; i < FiercePlanet.capabilities.length; i++) {
        var capability = $.trim(FiercePlanet.capabilities[i]);
        try {
//            $('#' + capability)[0].style.display = 'block';
            var el = $('#' + capability);
            el.removeClass("inactive");
            FiercePlanet.makeResourceActive(el[0]);
        }
        catch (err) {
        }
    }
};
