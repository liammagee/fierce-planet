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

    // Set admin functions to previously stored defaults
    FiercePlanet.getAndRetrieveProperties();

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
    $('#openLevelGallery').click(FiercePlanet.showLevelGallery);

    // Admin functions
    $('#debug').click(FiercePlanet.processAgents);
    $('#replay').click(FiercePlanet.replayWorld);
    $('#script-editor').click(FiercePlanet.openConsole);
    $('#story-board').click(FiercePlanet.showStoryboard);


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

    // Trap relevant key strokes
    if (!World.settings.disableKeyboardShortcuts) {
        $(document).keydown(FiercePlanet.handleKeyboardShortcuts);
        $('input, textarea, select, form').focus(function() {
            $(document).unbind("keydown");
        }).blur(function() {
            $(document).keydown(FiercePlanet.handleKeyboardShortcuts);
        });
        // Disable any AJAX-loaded forms
        $(document).ajaxComplete(function() {
            $('input, textarea, select').focus(function() {
                $(document).unbind("keydown");
            }).blur(function() {
                $(document).keydown(FiercePlanet.handleKeyboardShortcuts);
            });
        });
    }

    FiercePlanet.bindGameMouseEvents();
};

/**
 *  Does all the necessary binding for in-game mouse events
 */
FiercePlanet.bindGameMouseEvents = function() {
    var agentCanvas = $('#agentCanvas');

    console.log('binding mouse events');
    agentCanvas.click(FiercePlanet.handleNoticeEvents);
    agentCanvas.click(FiercePlanet.processResourceCanvasClick);
    if (World.settings.allowInlinePanning) {
        agentCanvas.mousedown(FiercePlanet.registerMouseDown);
        agentCanvas.mousemove(FiercePlanet.registerMouseMove);
        agentCanvas.mouseup(FiercePlanet.registerMouseUp);
    }
    agentCanvas.mousewheel(function(event, delta) {
        FiercePlanet.zoom(delta);
        event.preventDefault();
        return false; // prevent default
    });
};

/**
 *  Does all the necessary binding for in-game mouse events
 */
FiercePlanet.unbindGameMouseEvents = function() {
    var agentCanvas = $('#agentCanvas');

    agentCanvas.unbind('click');
//    agentCanvas.unbind('click', FiercePlanet.handleNoticeEvents);
//    agentCanvas.unbind('click', FiercePlanet.processResourceCanvasClick);
    agentCanvas.unbind('mousedown', FiercePlanet.registerMouseDown);
    agentCanvas.unbind('mousemove', FiercePlanet.registerMouseMove);
    agentCanvas.unbind('mouseup', FiercePlanet.registerMouseUp);
    agentCanvas.mousewheel(function(event, delta) {
        FiercePlanet.zoom(delta);
        event.preventDefault();
        return false; // prevent default
    });
};

/**
 *  Register mouse down event
 */
FiercePlanet.registerMouseDown = function(e) {
    FiercePlanet.isMouseDown = true;
    FiercePlanet.isMouseMoving = false;
    if (e.offsetX || e.offsetX == 0) { // Opera
        FiercePlanet.currentX = e.offsetX;
        FiercePlanet.currentY = e.offsetY;
    }
    else if (e.layerX || e.layerX == 0) { // Firefox
        FiercePlanet.currentX = e.layerX;
        FiercePlanet.currentY = e.layerY;
    }
};

/**
 *  Register mouse move event
 */
FiercePlanet.registerMouseMove = function(e) {
    if (FiercePlanet.isMouseDown) {
        FiercePlanet.isMouseMoving = true;
        FiercePlanet.doMove(e);
    }
};

/**
 *  Process mouse moves
 */
FiercePlanet.doMove = function(e) {
    if (FiercePlanet.isMouseDown) {
        var ex, ey;
        if (e.offsetX || e.offsetX == 0) { // Opera
            ex = e.offsetX;
            ey = e.offsetY;
        }
        else if (e.layerX || e.layerX == 0) { // Firefox
            ex = e.layerX;
            ey = e.layerY;
        }
        var offsetX = ex - FiercePlanet.currentX;
        var offsetY = ey - FiercePlanet.currentY;

        FiercePlanet.panByDrag(offsetX, offsetY);
        FiercePlanet.currentX = ex;
        FiercePlanet.currentY = ey;
    }
};

/**
 *  Register mouse up event
 */
FiercePlanet.registerMouseUp = function(e) {
    if (e.preventDefault)
        e.preventDefault();
    if (FiercePlanet.isMouseDown && FiercePlanet.isMouseMoving) {
        FiercePlanet.doMove(e);
        FiercePlanet.isMouseDown = false;
    }
    return false;
};

/**
 *  Add key handling events
 */
FiercePlanet.handleKeyboardShortcuts = function(e) {
    if (World.settings.disableKeyboardShortcuts)
        return;

    // Return if command keys are selected
    if (e.ctrlKey || e.altKey || e.metaKey)
        return;

    switch (e.which) {
        // +, -, 0: Zoom functions
        case 107:
            FiercePlanet.zoom(1);
            break;
        case 109:
            FiercePlanet.zoom(-1);
            break;
        case 96:
            FiercePlanet.zoom(0);
            break;
        // Arrow buttons, 'h': Pan functions
        case 37:
            FiercePlanet.pan(2);
            break;
        case 38:
            FiercePlanet.pan(0);
            break;
        case 39:
            FiercePlanet.pan(3);
            break;
        case 40:
            FiercePlanet.pan(1);
            break;
        case 72:
            FiercePlanet.pan(4);
            break;
        // 'p': Play/pause game
        case 80:
            FiercePlanet.playGame();
            break;
        // 'n': New game
        case 78:
            FiercePlanet.newGame();
            break;
        // 'r': Restart game
        case 82:
            FiercePlanet.restartLevel();
            break;
        // 'w': Rewind
        case 87:
            FiercePlanet.slowDown();
            break;
        // 'f': Fast forward
        case 70:
            FiercePlanet.speedUp();
            break;
        // 't': Tutorial
        case 84:
            $('#tutorial').click();
            break;
        // 'g': Gallery
        case 71:
            $('#level-gallery').click();
            break;
        // 's': Settings
        case 83:
            FiercePlanet.showSettings();
            break;
        // 'e': Editor
        case 69:
            $('#editor').click();
            break;
        // '$': Resource Gallery
        case 52:
            if (e.shiftKey)
                FiercePlanet.showResourceGallery();
            break;
    }
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
        if (e.offsetX || e.offsetX == 0) { // Opera
            ex = e.offsetX;
            ey = e.offsetY;
        }
        else if (e.layerX || e.layerX == 0) { // Firefox
            ex = e.layerX;
            ey = e.layerY;
        }
        if (ex >= x && ex <= x + w && ey >= y && ey <= y + h) {
            FiercePlanet.currentNotice = undefined;
            FiercePlanet.clearCanvas('noticeCanvas');
        }
    }
};

/**
 *
 * @param e
 */
FiercePlanet.getWorldCoordinates = function(e) {
    var x;
    var y;
    if (e.offsetX || e.offsetX == 0) { // Firefox, IE9, Chrome, Safari
        x = e.offsetX;
        y = e.offsetY;
    }
    else if (e.layerX || e.layerX == 0) { // Opera
        x = e.layerX;
        y = e.layerY;
    }
    return {x:x, y:y};
};


/**
 * Gets the current position of a mouse click
 * @param e
 */
FiercePlanet.getCurrentPosition = function(e) {
    var __ret = FiercePlanet.getWorldCoordinates(e);
    var x = __ret.x;
    var y = __ret.y;
    x -= FiercePlanet.panLeftOffset;
    y -= FiercePlanet.panTopOffset;
    x /= FiercePlanet.zoomLevel;
    y /= FiercePlanet.zoomLevel;
//    x /= FiercePlanet.externalZoomLevel;
//    y /= FiercePlanet.externalZoomLevel;

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
    var level = FiercePlanet.currentLevel;
    if (level.getName() != undefined) {
        levelHTML += "<h3>" + level.getName() + "</h3>";
    }
    if (level.getImage() != undefined) {
        levelHTML += '<img src="' + level.getImage() + '" alt="City Image" width="460" height="140">';
        if (level.getImageAttribution())
            levelHTML += '<div style="font-size: 0.8em; text-align: right">' + level.getImageAttribution() + '</div>';
    }
    if (level.getIntroduction() != undefined) {
        levelHTML += level.getIntroduction();
    }
    FiercePlanet.$newLevel.html(levelHTML).dialog('open');
};


/**
 * Refresh the swatch area with the current profile capabilities
 */
FiercePlanet.refreshSwatch = function() {
    // Make all capabilities inactive
    for (var i = 0; i < FiercePlanet.GENIUS_CAPABILITIES.length; i++) {
        var capability = $.trim(FiercePlanet.GENIUS_CAPABILITIES[i]);
        try {
            var el = $('#' + capability);
            el.addClass("inactive");
        }
        catch (err) {
        }
    }
    // Make the current profile's capabilities active
    for (var i = 0; i < FiercePlanet.currentProfile.capabilities.length; i++) {
        var capability = $.trim(FiercePlanet.currentProfile.capabilities[i]);
        try {
            var el = $('#' + capability);
            el.removeClass("inactive");
            FiercePlanet.makeResourceActive(el[0]);
        }
        catch (err) {
        }
    }
};

/**
 * Changes the preset level
 */
FiercePlanet.changePresetLevel =  function() {
    var level = $('#levelInput').val();
    FiercePlanet.currentLevelNumber = FiercePlanet.checkInteger(level);
    FiercePlanet.currentLevelPreset = true;
    // Remember this level, along with other data
    FiercePlanet.storeData();
};

/**
 * Changes the difficulty
 */
FiercePlanet.changeDifficulty = function () {
    var difficulty = $('#difficultyInput').val();
  FiercePlanet.levelOfDifficulty = FiercePlanet.checkInteger(difficulty);
};