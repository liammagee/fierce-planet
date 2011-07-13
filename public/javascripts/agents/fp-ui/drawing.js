/*!
 * Fierce Planet - Drawing
 * Functions for drawing aspects of the game
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};

/**
 *
 */
FiercePlanet.drawGame = function() {
    // Clear canvases
    $('#map_canvas').empty();
    FiercePlanet.clearCanvas('baseCanvas');
    FiercePlanet.clearCanvas('resourceCanvas');
    FiercePlanet.clearCanvas('scrollingCanvas');
    FiercePlanet.clearCanvas('noticeCanvas');
    FiercePlanet.clearCanvas('agentCanvas');

    // Draw basic elements
    if ((FiercePlanet.currentLevel.getMapOptions() != undefined  && FiercePlanet.currentLevel.getMapOptions()['latitude'] != undefined && FiercePlanet.currentLevel.getMapOptions()['longitude'] != undefined)
            || (FiercePlanet.currentLevel.getMapURL() != undefined && $.trim(FiercePlanet.currentLevel.getMapURL()).length > 0)) {
        FiercePlanet.drawMap();
        FiercePlanet.drawPath();
    }
    else {
        FiercePlanet.drawTiles();
        FiercePlanet.drawBackgroundImage();
        FiercePlanet.drawPath();
    }
    FiercePlanet.drawEntryPoints();
    FiercePlanet.drawExitPoints();
    FiercePlanet.drawResources();
    FiercePlanet.drawScrollingLayer();
    FiercePlanet.drawScoreboard();

};

/**
 * Draw just the canvas layers
 */
FiercePlanet.drawCanvases = function() {
    // Clear canvases
    FiercePlanet.clearCanvas('baseCanvas');
    FiercePlanet.clearCanvas('resourceCanvas');
//    FiercePlanet.clearCanvas('scrollingCanvas');
//    FiercePlanet.clearCanvas('noticeCanvas');
    FiercePlanet.clearCanvas('agentCanvas');

    // Draw basic elements
    if ((FiercePlanet.currentLevel.getMapOptions() != undefined  && FiercePlanet.currentLevel.getMapOptions()['latitude'] != undefined && FiercePlanet.currentLevel.getMapOptions()['longitude'] != undefined)
            || (FiercePlanet.currentLevel.getMapURL() != undefined && $.trim(FiercePlanet.currentLevel.getMapURL()).length > 0)) {
        FiercePlanet.drawPath();
    }
    else {
        FiercePlanet.drawTiles();
        FiercePlanet.drawBackgroundImage();
        FiercePlanet.drawPath();
    }
    FiercePlanet.drawEntryPoints();
    FiercePlanet.drawExitPoints();
    FiercePlanet.drawResources();
//    FiercePlanet.drawScrollingLayer();
};

/**
 * Draws all the tiles on the map
 */
FiercePlanet.drawTiles = function() {
    var tiles = FiercePlanet.currentLevel.getTiles();
    for (var i = 0; i < tiles.length; i+= 1) {
        if (tiles[i] != undefined)
            FiercePlanet.drawTile(tiles[i]);
    }
};

/**
 *
 * @param tile
 */
FiercePlanet.drawTile = function(tile) {
    var canvas = $('#baseCanvas')[0];
    var ctx = canvas.getContext('2d');

    var x = tile._x * FiercePlanet.cellWidth;
    var y = tile._y * FiercePlanet.cellHeight;
    ctx.clearRect(x + 1, y + 1, FiercePlanet.cellWidth - 1, FiercePlanet.cellHeight - 1);
    if (tile._y == 0 || FiercePlanet.currentLevel.getTile(tile._x, tile._y - 1) == undefined) {
        var my_gradient = ctx.createLinearGradient(x, y, x, y + FiercePlanet.cellHeight / 4);
        my_gradient.addColorStop(0, "#060");
        my_gradient.addColorStop(1, "#" + tile._color);
        ctx.fillStyle = my_gradient;
    }
    else {
        ctx.fillStyle = "#" + tile._color;
    }
    ctx.fillRect(x, y, FiercePlanet.cellWidth, FiercePlanet.cellHeight);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(x, y, FiercePlanet.cellWidth, FiercePlanet.cellHeight);
};

/**
 *
 */
FiercePlanet.drawPath = function() {
    var canvas = $('#baseCanvas')[0];
    var ctx = canvas.getContext('2d');
    var pathTiles = FiercePlanet.currentLevel.getPath();
    for (var i = 0; i < pathTiles.length; i+= 1) {
        var pathTile = pathTiles[i];
        var xPos = pathTile[0];
        var yPos = pathTile[1];
        var x = xPos * FiercePlanet.cellWidth;
        var y = yPos * FiercePlanet.cellHeight;
        ctx.clearRect(x + 1, y + 1, FiercePlanet.cellWidth - 1, FiercePlanet.cellHeight - 1);

        if (!World.settings.invisiblePath) {
            if (yPos == 0 || FiercePlanet.currentLevel.getTile(xPos, yPos - 1) != undefined) {
                var my_gradient = ctx.createLinearGradient(x, y, x, y + FiercePlanet.cellHeight / 4);
                my_gradient.addColorStop(0, "#ccc");
                my_gradient.addColorStop(1, "#eee");
                ctx.fillStyle = my_gradient;
            }
            else {
                ctx.fillStyle = "#eee";
            }
            ctx.border = "1px #eee solid";
            ctx.fillRect(x, y, FiercePlanet.cellWidth, FiercePlanet.cellHeight);
        }
        ctx.strokeStyle = "#ccc";
        ctx.strokeRect(x, y, FiercePlanet.cellWidth, FiercePlanet.cellHeight);

    }
};

/**
 *
 */
FiercePlanet.drawBackgroundImage = function() {
    if (FiercePlanet.currentLevel.getBackgroundImage() != undefined) {
        var canvas = $('#baseCanvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.drawImage(FiercePlanet.currentLevel.getImage(), 0, 0);
    }
};

/**
 *
 */
FiercePlanet.handleApiReady = function() {
    var mapOptions = {
      center: new google.maps.LatLng(47.5153, 19.0782),
        mapTypeId: google.maps.MapTypeId.SATELLITE,
      disableDefaultUI: true,
      zoom: 18,
        tilt: 45
    };
    if (FiercePlanet.currentLevel != undefined) {
        if (FiercePlanet.currentLevel.getMapOptions()['latitude'] != undefined && FiercePlanet.currentLevel.getMapOptions()['longitude'] != undefined)
            mapOptions['center'] = new google.maps.LatLng(FiercePlanet.currentLevel.getMapOptions()['latitude'], FiercePlanet.currentLevel.getMapOptions()['longitude']);
        if (FiercePlanet.currentLevel.getMapOptions()['zoom'] != undefined)
            mapOptions['zoom'] = parseInt(FiercePlanet.currentLevel.getMapOptions()['zoom']);
        if (FiercePlanet.currentLevel.getMapOptions()['tilt'] != undefined)
            mapOptions['tilt'] = parseInt(FiercePlanet.currentLevel.getMapOptions()['tilt']);

        // Handle built-in zoom
        if (FiercePlanet.zoomLevel > 1)
            mapOptions['zoom'] = mapOptions['zoom'] + Math.log(FiercePlanet.zoomLevel) / Math.log(1.5);

        FiercePlanet.googleMap = new google.maps.Map($("#map_canvas")[0], mapOptions);
        if (FiercePlanet.currentLevel.getMapOptions()['tilt'] != undefined && FiercePlanet.currentLevel.getMapOptions()['tilt'] != 'no' )
            FiercePlanet.googleMap.setTilt(45);
    }
    else {
        FiercePlanet.googleMap = new google.maps.Map($("#map_canvas")[0], mapOptions);
    }
};

/**
 *
 */
FiercePlanet.drawMap = function() {
    if (FiercePlanet.currentLevel.getMapOptions() != undefined && FiercePlanet.currentLevel.getMapOptions()['latitude'] != undefined && FiercePlanet.currentLevel.getMapOptions()['longitude'] != undefined) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://maps.google.com/maps/api/js?sensor=false&callback=FiercePlanet.handleApiReady";
        document.body.appendChild(script);
    }
    else if (FiercePlanet.currentLevel.getMapURL() != undefined) {
        $("#map_canvas").prepend('<img src="' + FiercePlanet.currentLevel.getMapURL() + '"/>').css('image-orientation: 135deg');
    }
};

/**
 * Draws exit points on the map
 */
FiercePlanet.drawExitPoints = function() {
    var canvas = $('#baseCanvas')[0];
    var ctx = canvas.getContext('2d');

    for (var i = 0; i < FiercePlanet.currentLevel._exitPoints.length; i++) {
        var point = FiercePlanet.currentLevel._exitPoints[i];
        var x = point[0] * FiercePlanet.cellWidth + FiercePlanet.cellWidth / 2;
        var y = point[1] * FiercePlanet.cellHeight + FiercePlanet.cellHeight / 2;
        var width = (FiercePlanet.pieceWidth / 2);
        var height = (FiercePlanet.pieceHeight / 2);

        // Draw circle
        ctx.beginPath();
        ctx.arc(x, y, width, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.fill();

        // Draw progress
        var progressRatio = (FiercePlanet.currentWave - 1) / FiercePlanet.currentLevel._waveNumber;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, width, - Math.PI / 2, - Math.PI / 2 + Math.PI * 2 * progressRatio, false);
        ctx.closePath();
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.fillStyle = "#93C83E";
        ctx.fill();
    }
};


/**
 * Draws entry points on the map
 */
FiercePlanet.drawEntryPoints = function() {
    var canvas = $('#baseCanvas')[0];
    var ctx = canvas.getContext('2d');

    for (var i = 0; i < FiercePlanet.currentLevel._entryPoints.length; i++) {
        var point = FiercePlanet.currentLevel._entryPoints[i];
        var x = point[0] * FiercePlanet.cellWidth + FiercePlanet.cellWidth / 2;
        var y = point[1] * FiercePlanet.cellHeight + FiercePlanet.cellHeight / 2;
        var width = (FiercePlanet.pieceWidth / 2);
        var height = (FiercePlanet.pieceHeight / 2);

        // Draw circle
        ctx.beginPath();
        ctx.arc(x, y, width, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.fillStyle = "#93C83E";
        ctx.fill();

        // Draw progress
        var progressRatio = (FiercePlanet.currentWave - 1) / FiercePlanet.currentLevel._waveNumber;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, width, - Math.PI / 2, - Math.PI / 2 + Math.PI * 2 * progressRatio, false);
        ctx.closePath();
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.fill();
    }

};


/**
 * Draws the current notice
 *
 * @param notice
 */
FiercePlanet.drawNotice = function(notice) {
    if (FiercePlanet.currentNotice != null) {
        FiercePlanet.clearCanvas('noticeCanvas');
        var canvas = $('#noticeCanvas')[0];
        var ctx = canvas.getContext('2d');


        // Get parameters of the notice
        var text = FiercePlanet.currentNotice._text;
        var start = FiercePlanet.currentNotice._start;
        var duration = FiercePlanet.currentNotice._duration;
        var strengthOfNotice = (duration - (FiercePlanet.levelCounter - start)) / duration;
        var startingTransparency = 0.1;
        var alphaLevel = Math.pow(strengthOfNotice - startingTransparency, 0.5);


        // Notice dimensions
        var x = FiercePlanet.currentNotice._x;
        var y = FiercePlanet.currentNotice._y;
        var width = FiercePlanet.currentNotice._width;
        var height = FiercePlanet.currentNotice._height;

        // Styles
        var foregroundColor = FiercePlanet.insertAlpha(FiercePlanet.currentNotice._foregroundColor, alphaLevel);
        var backgroundColor = FiercePlanet.insertAlpha(FiercePlanet.currentNotice._backgroundColor, alphaLevel);
        var lineWidth = FiercePlanet.currentNotice._lineWidth;
        var font = FiercePlanet.currentNotice._font;


        // Draw the notice
        ctx.font = font;
        ctx.lineWidth = lineWidth;

        var roundedEdge = 10;
        ctx.clearRect(x - 1, y - 1, width + 2, height + 2);

        // Don't draw any more, if the notice is expired
        if (start > FiercePlanet.levelCounter || start + duration < FiercePlanet.levelCounter)
            return;

        ctx.beginPath();
        ctx.moveTo(x + roundedEdge, y);
        ctx.lineTo(x + width - roundedEdge, y);
        ctx.arcTo(x + width, y, x + width, y + roundedEdge, roundedEdge);
        ctx.lineTo(x + width, y + height - roundedEdge);
        ctx.arcTo(x + width, y + height, x + width - roundedEdge, y + height, roundedEdge);
        ctx.lineTo(x + roundedEdge, y + height);
        ctx.arcTo(x, y + height, x, y + height - roundedEdge, roundedEdge);
        ctx.lineTo(x, y + roundedEdge);
        ctx.arcTo(x, y, x + roundedEdge, y, roundedEdge);
        ctx.closePath();

        ctx.strokeStyle = foregroundColor;
        ctx.stroke();
        ctx.fillStyle = backgroundColor;
        ctx.fill();

        // Draw the text lines
        var lines = FiercePlanet.getTextLines(ctx, text, width - 20);
        ctx.fillStyle = foregroundColor;
        for (var i  = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x + 10, y + (20 * (i + 1)));
        }
    }
};

/**
 *
 * @param context
 * @param text
 * @param targetWidth
 */
FiercePlanet.getTextLines = function(context, text, targetWidth) {
    var w = context.measureText(text).width;
    if (w < targetWidth)
        return [text];
    var numberOfLines = Math.ceil(w / targetWidth);
    var l = text.length / numberOfLines;
    var lines = [];
    var simpleTokens = text.split(' ');
    var line = '';

    for (var j = 0; j < simpleTokens.length; j++) {
        var token = simpleTokens[j];
        if (context.measureText(line + token + ' ').width < targetWidth) {
            line += token + ' ';
        }
        else if (line.length == 0 && context.measureText(token).width >= l) {
            var wt = context.measureText(token).width;
            var numberOfTokenLines = Math.ceil(wt / targetWidth);
            var tokenMarker = token.length / numberOfTokenLines;
            line += token.substring(0, tokenMarker - 1) + '-';
            var newToken = token.substring(tokenMarker, token.length);
            simpleTokens.splice(j, 0, newToken);
            lines.push(line);
            line = '';
        }
        else {
            lines.push(line);
            line = token + ' ';
        }
    }
    lines.push(line);
    return lines;
};

/**
 *
 * @param color
 * @param alphaLevel
 */
FiercePlanet.insertAlpha = function(color, alphaLevel) {
    var newColor = color;
    // Is the color a six digit hexadecimal?
    if (color.length == 6) {
        var r = color.substring(0, 2);
        var g = color.substring(2, 4);
        var b = color.substring(4, 6);
        newColor = 'rgba(' + parseInt(r, 16) + ', ' + parseInt(g, 16) + ', ' + parseInt(b, 16) + ', ' + alphaLevel + ')';
    }
    // Otherwise assume it is rgba() format
    else {
        newColor = color.split(')').join(', ' + alphaLevel + ')');
    }
    return newColor;
};


/**
 * Draw all of the resources
 */
FiercePlanet.drawResources = function() {
    for (var i = 0; i < FiercePlanet.currentLevel._resources.length; i+= 1) {
        FiercePlanet.drawResource(FiercePlanet.currentLevel._resources[i]);
    }
};

/**
 * Draw an individual resource
 * @param resource
 */
FiercePlanet.drawResource = function(resource) {
    var canvas = $('#resourceCanvas')[0];
    var ctx = canvas.getContext('2d');

    // Variables
    var x = resource._x * FiercePlanet.cellWidth;
    var y = resource._y * FiercePlanet.cellHeight;
    var s = (resource._totalYield / resource._initialTotalYield) * 100;
    var c = resource._color;
    
    // Clear and fill the resource tile with a white background
    ctx.clearRect(x, y, FiercePlanet.cellWidth, FiercePlanet.cellHeight);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, FiercePlanet.cellWidth, FiercePlanet.cellHeight);

    // Determine drawing colours and offsets
    var newColor = FiercePlanet.diluteColour(s, s, s, c);
    var yOffset = ((FiercePlanet.cellHeight) * (1 - (s / 100)));

    // Create a gradient to fill the cell from the bottom up
    var resourceGradient = ctx.createLinearGradient(x, y + yOffset, x, y + FiercePlanet.cellHeight);
    resourceGradient.addColorStop(0, "#fff");
    resourceGradient.addColorStop(1, c);

    ctx.fillStyle = resourceGradient;
    ctx.strokeStyle = "#333";

    // Straight drawing
//    ctx.fillStyle = "#" + newColor;
//    ctx.strokeStyle = "#333";


    // Fill whole square
//    ctx.fillRect(x, y, FiercePlanet.cellWidth, FiercePlanet.cellHeight);
    // Fill smaller square
//    ctx.fillRect(100, 100, 200, 200);
    ctx.fillRect(x, y + yOffset, FiercePlanet.cellWidth, (FiercePlanet.cellHeight - yOffset));


    // Add upgrade border?
    switch (resource._upgradeLevel) {
        case 1:
            break;
        case 2:
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#666";
            ctx.strokeRect(x + 4, y + 4, FiercePlanet.cellWidth - 8, FiercePlanet.cellHeight - 8);
            break;
        case 3:
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#666";
            ctx.strokeRect(x + 6, y + 6, FiercePlanet.cellWidth - 12, FiercePlanet.cellHeight - 12);
            break;
        case 4:
            ctx.fillStyle = "#666";
            ctx.fillRect(x + 8, y + 8, FiercePlanet.cellWidth - 16, FiercePlanet.cellHeight - 16);
            break;
    }

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#" + newColor;
//    ctx.strokeRect(x, y, FiercePlanet.cellWidth, FiercePlanet.cellHeight);
//    ctx.strokeText(p.getUpgradeLevel(), x + 10, y + 10);

    // Actual rect to draw
//    ctx.strokeRect(x + 2, y + 2, FiercePlanet.cellWidth - 4, FiercePlanet.cellHeight - 4);

    // Draw resource-specific representation here
    if (resource._kind._image) {
        var resImage = new Image();
        resImage.src = resource._kind._image;
        ctx.drawImage(resImage, x + 4, y + 4, FiercePlanet.cellWidth - 8, FiercePlanet.cellHeight - 8);
    }
};


/**
 * Clears an individual resource
 * @param resource
 */
FiercePlanet.clearResource = function(resource) {
    var canvas = $('#resourceCanvas')[0];
    var ctx = canvas.getContext('2d');

    var x = resource._x * FiercePlanet.cellWidth;
    var y = resource._y * FiercePlanet.cellHeight;
    ctx.clearRect(x, y, FiercePlanet.cellWidth, FiercePlanet.cellHeight);
};

/**
 *
 * @param canvasID
 */
FiercePlanet.clearCanvas = function(canvasID) {
    var canvas = $('#' + canvasID)[0];
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    ctx.clearRect(0, 0, w, h);
};

/**
 * Clear all active agents
 */
FiercePlanet.clearAgents = function() {
    FiercePlanet.clearAgentGroup(FiercePlanet.currentLevel._currentAgents);
};

/**
 * Clear the agent group
 */
FiercePlanet.clearAgentGroup = function(agents) {
    var canvas = $('#agentCanvas')[0];
    var ctx = canvas.getContext('2d');
    if (FiercePlanet.waveCounter > 0) {
        for (var i = 0; i < agents.length; i += 1) {
            var agent = agents[i];
            var wx = agent._wanderX;
            var wy = agent._wanderY;
            var __ret = FiercePlanet.getDrawingPosition(agent, FiercePlanet.waveCounter - 1);
            var intX = __ret.intX * FiercePlanet.cellWidth + wx + 1;
            var intY = __ret.intY * FiercePlanet.cellHeight + wy + 1;
            ctx.clearRect(intX, intY, FiercePlanet.cellWidth + wx + 1, FiercePlanet.cellHeight + wy + 1);
            if (World.settings.agentTracing) {
                ctx.beginPath();
                ctx.arc(intX + FiercePlanet.cellWidth / 2, intY + FiercePlanet.cellHeight * 1.2, 2, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.strokeStyle = "#000";
                ctx.stroke();
                ctx.fillStyle = "#000";
                ctx.fill();
            }

        }
    }
};


/* Dilutes (whitens) the colour of an element, given its strength (some value between 0 and 100) */
FiercePlanet.diluteColour = function(rStrength, gStrength, bStrength, colour) {
    var charOffset = (colour.length == 3 ? 1 : 2);
    var multiplier = (charOffset == 1 ? 1 : 16);
    var dilutionBase = 10;
    var maxValue = Math.pow(16, charOffset);
    var r = parseInt(colour.slice(0, 1 * charOffset), 16);
    var g = parseInt(colour.slice(1 * charOffset, 2 * charOffset), 16);
    var b = parseInt(colour.slice(2 * charOffset, 3 * charOffset), 16);

    var ro = Math.floor((100 - rStrength) / 100 * (maxValue - r));
    var go = Math.floor((100 - gStrength) / 100 * (maxValue - g));
    var bo = Math.floor((100 - bStrength) / 100 * (maxValue - b));
    var rOffset = (r + ro < maxValue ? r + ro : maxValue - 1).toString(16);
    var gOffset = (g + go < maxValue ? g + go : maxValue - 1).toString(16);
    var bOffset = (b + bo < maxValue ? b + bo : maxValue - 1).toString(16);
    rOffset = (rOffset.length < charOffset ? rOffset + "0" : rOffset);
    gOffset = (gOffset.length < charOffset ? gOffset + "0" : gOffset);
    bOffset = (bOffset.length < charOffset ? bOffset + "0" : bOffset);
    var newColor = rOffset + gOffset + bOffset;
    return newColor;
};

/**
 *
 */
FiercePlanet.getAgentDirection = function(agent) {
    var lastX = agent._lastMemory._x;
    var lastY = agent._lastMemory._y;
    var x = agent._x;
    var y = agent._y;
    if (lastX < x) {
        return 0;
    }
    else {
        return 1;
    }
};

/**
 *
 */
FiercePlanet.getDrawingPosition = function(agent, counter) {
    var lastX = agent._lastMemory._x;
    var lastY = agent._lastMemory._y;
    var x = agent._x;
    var y = agent._y;
    var wx = agent._wanderX;
    var wy = agent._wanderY;
    var speed = agent._speed;
    var delay = agent._delay;
    var countdown = agent._countdownToMove;
    var incrementTest = (speed - (counter - agent._delay) % speed) / speed;
    var increment = (speed - countdown) / speed;

    var offsetX = (x - lastX) * (increment);
    var offsetY = (y - lastY) * (increment);
    var intX = (x - offsetX);
    var intY = (y - offsetY);

    if (FiercePlanet.currentLevel._allowOffscreenCycling) {
        var halfWay = (increment < 0.5);
        if (x == FiercePlanet.worldWidth - 1 && lastX == 0) {
            if (halfWay) {
                offsetX = (x - FiercePlanet.worldWidth) * (increment);
                intX = (x - offsetX);
            }
            else {
                offsetX = 1 - increment;
                intX = offsetX;
            }
        }
        else if (x == 0 && lastX == FiercePlanet.worldWidth - 1) {
            if (halfWay) {
                offsetX = increment;
                intX = (0 - offsetX);
            }
            else {
                offsetX = (FiercePlanet.worldWidth - lastX) * (increment);
                intX = (FiercePlanet.worldWidth - offsetX);
            }
        }
        else if (y == FiercePlanet.worldHeight - 1 && lastY == 0) {
            if (halfWay) {
                offsetY = (y - FiercePlanet.worldHeight) * (increment);
                intY = (y - offsetY);
            }
            else {
                offsetY = 1 - increment;
                intY = offsetY;
            }
        }
        else if (y == 0 && lastY == FiercePlanet.worldHeight - 1) {
            if (halfWay) {
                offsetY = increment;
                intY = (0 - offsetY);
            }
            else {
                offsetY = (FiercePlanet.worldHeight - lastY) * (increment);
                intY = (FiercePlanet.worldHeight - offsetY);
            }
        }
    }
    return {intX:intX, intY:intY};
};

/**
 * Draw agents on the agent canvas
 */
FiercePlanet.drawAgents = function() {
    var canvas = $('#agentCanvas')[0];
    var ctx = canvas.getContext('2d');
    var agents = FiercePlanet.currentLevel._currentAgents;
    for (var i = 0; i < agents.length; i += 1) {
        var agent = agents[i];

        // Don't process agents we want to block
        if (! World.settings.rivalsVisible && agent._agentType._name == AgentTypes.RIVAL_AGENT_TYPE._name)
            continue;
        if (! World.settings.predatorsVisible && agent._agentType._name == AgentTypes.PREDATOR_AGENT_TYPE._name)
            continue;

        // Get co-ordinates
        var wx = agent._wanderX;
        var wy = agent._wanderY;
        var __ret = FiercePlanet.getDrawingPosition(agent, FiercePlanet.waveCounter);
        var intX = __ret.intX * FiercePlanet.cellWidth + wx + FiercePlanet.cellWidth / 2;
        var intY = __ret.intY * FiercePlanet.cellHeight + wy + FiercePlanet.cellHeight / 4;
        var direction = FiercePlanet.getAgentDirection(agent);


        var blueH = agent._healthCategoryStats[World.resourceCategories[0].getCode()];
        var greenH = agent._healthCategoryStats[World.resourceCategories[1].getCode()];
        var redH = agent._healthCategoryStats[World.resourceCategories[2].getCode()];
        var c = agent._color.toString();
        var newColor = FiercePlanet.diluteColour(redH, greenH, blueH, c);
        if (agent._isHit)
            newColor = "f00";

        try {
            eval(agent.getType().getDrawFunction())(ctx, agent, intX, intY, FiercePlanet.pieceWidth, FiercePlanet.pieceHeight, newColor, FiercePlanet.waveCounter, direction);
        } catch(e) {
            eval(AgentTypes.CITIZEN_AGENT_TYPE.getDrawFunction())(ctx, agent, intX, intY, FiercePlanet.pieceWidth, FiercePlanet.pieceHeight, newColor, FiercePlanet.waveCounter, direction);
        }

    }
};

/**
 * Draw agents on the agent canvas
 */
FiercePlanet.drawExpiredAgent = function(agent) {
    var canvas = $('#agentCanvas')[0];
    var ctx = canvas.getContext('2d');

    // Don't process agents we want to block

    // Get co-ordinates
    var wx = agent._wanderX;
    var wy = agent._wanderY;
    var __ret = FiercePlanet.getDrawingPosition(agent, FiercePlanet.waveCounter);
    var intX = __ret.intX * FiercePlanet.cellWidth + wx + FiercePlanet.cellWidth / 2;
    var intY = __ret.intY * FiercePlanet.cellHeight + wy + FiercePlanet.cellHeight / 4;
    var direction = FiercePlanet.getAgentDirection(agent);

    var newColor = "f00";

    if (agent.getType().drawExpired)
        agent.getType().drawExpired(ctx, agent, intX, intY, FiercePlanet.pieceWidth, FiercePlanet.pieceHeight, newColor, FiercePlanet.waveCounter, direction);
};

/**
 * Draw the scrolling layer
 */
FiercePlanet.drawScrollingLayer = function() {
    if (World.settings.scrollingImageVisible) {
        FiercePlanet.clearCanvas('scrollingCanvas');
        var canvas = $('#scrollingCanvas')[0];
        var ctx = canvas.getContext('2d');

        // Add logic for catastrophe here

        if (World.settings.catastrophesVisible && FiercePlanet.currentLevel.getCatastrophe() != undefined) {
            var catastrophe = FiercePlanet.currentLevel.getCatastrophe();
            if (catastrophe._notice._start <= FiercePlanet.levelCounter && (catastrophe._start + catastrophe._duration) >= FiercePlanet.levelCounter) {
                FiercePlanet.currentNotice = catastrophe._notice;
            }
            if (catastrophe._start <= FiercePlanet.levelCounter && (catastrophe._start + catastrophe._duration) >= FiercePlanet.levelCounter) {
                // Apply catastrophe effects
                if (FiercePlanet.levelCounter >= (catastrophe._start + catastrophe._duration / 2)) {
                    catastrophe.strike();
                }

                // Get effect dimensions
                var increments = catastrophe._duration / FiercePlanet.WORLD_WIDTH;
                var leadIncrement = (FiercePlanet.levelCounter - catastrophe._start) / increments * 2;
                var trailIncrement = ((catastrophe._start + catastrophe._duration) - FiercePlanet.levelCounter) / increments * 2;
//                console.log(increments);
//                console.log(currentIncrement);
                var x = FiercePlanet.WORLD_WIDTH - leadIncrement;
                var y = 0;
                var w = trailIncrement;
                var h = FiercePlanet.WORLD_HEIGHT;
                ctx.fillStyle = FiercePlanet.insertAlpha(catastrophe._kind._color, 0.5);
                ctx.fillRect(x, y, w, h);
                return;
            }
        }

        if ((FiercePlanet.scrollingImageX + FiercePlanet.scrollingImageOffset) < (480 - FiercePlanet.scrollingImageOffset)){
            FiercePlanet.scrollingImageX += FiercePlanet.scrollingImageOffset;
        }
        else {
            FiercePlanet.scrollingImageX = 1;
        }
        // Need exception handling for Safari
        try {
            ctx.drawImage(FiercePlanet.scrollingImage, FiercePlanet.scrollingImageX, 1, 480, 400, 0, 0, 480, 400);
        }
        catch(err) {
        }
    }
};

/**
 * Draw the current level
 */
FiercePlanet.drawLevel = function() {
    var e = $('#level-display')[0];
    e.innerHTML = FiercePlanet.currentLevel.getId();
};

/**
 * Draw the current profile class
 */
FiercePlanet.drawProfileClass = function() {
    var e = $('#profile-class-display')[0];
    if (e != undefined)
        e.innerHTML = FiercePlanet.currentProfile.profile_class;
};

/**
 * Update the current score
 */
FiercePlanet.drawScore = function() {
    var e = $('#score-display')[0];
    e.innerHTML = FiercePlanet.zeroFill(FiercePlanet.currentProfile.current_score, 5);
};

/**
 * Update the highest score
 */
FiercePlanet.drawHighestScore = function() {
    var e = $('#highest-score-display')[0];
    var hs = FiercePlanet.currentProfile.highest_score;
    if (hs == undefined)
        hs = 0;
    e.innerHTML = hs.toString();
};

/**
 * Update resources in store
 */
FiercePlanet.drawResourcesInStore = function() {
    var e = $('#goodness-display')[0];
    e.innerHTML = FiercePlanet.currentProfile.current_level_resources_in_store.toString();
};

/**
 * Update the number of expired agents
 */
FiercePlanet.drawExpired = function() {
//    var e = $('#expired-display')[0];
//    e.innerHTML = FiercePlanet.expiredAgentCount.toString() + " out of " + FiercePlanet.currentLevel.getExpiryLimit();
    var e = $('#expired-citizens')[0];
    var expiredHTML = '';
    for (var i = 0, len = FiercePlanet.currentLevel.getExpiryLimit(); i < len; i++) {
        if (i < FiercePlanet.currentProfile.current_level_expired)
            expiredHTML += '<div id="expired-citizen"></div>';
        else
            expiredHTML += '<div id="healthy-citizen"></div>';
    }
    e.innerHTML = expiredHTML;
};

/**
 * Update the number of saved agents
 */
FiercePlanet.drawSaved = function() {
    var e = $('#saved-display')[0];
    var saved = FiercePlanet.currentProfile.current_level_saved.toString();
    var totalSaveable = FiercePlanet.currentLevel.getTotalSaveableAgents();
    e.innerHTML = saved + " out of " + totalSaveable;
};

/**
 * Update the current wave number
 */
FiercePlanet.drawWaves = function() {
    var e = $('#waves-display')[0];
    e.innerHTML = FiercePlanet.currentWave.toString() + " out of " + FiercePlanet.currentLevel.getWaveNumber();
};


/**
 * Update the scoreboard
 */
FiercePlanet.drawScoreboard = function() {
    FiercePlanet.drawLevel();
//    FiercePlanet.drawProfileClass();
    FiercePlanet.drawScore();
    FiercePlanet.drawHighestScore();
    FiercePlanet.drawWaves();
    FiercePlanet.drawSaved();
    FiercePlanet.drawExpired();
    FiercePlanet.drawResourcesInStore();
};


/**
 * Pan around the current level
 *
 * @param offsetX
 * @param offsetY
 */
FiercePlanet.panByDrag = function(offsetX, offsetY) {
//    var canvases = $('canvas');
    var canvases = $('.scrollable-canvas');
    for (var i = 0; i < canvases.length; i++) {
        var canvas = canvases[i];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width,canvas.height);
        ctx.translate(offsetX, offsetY);
    }
    FiercePlanet.panTopOffset += offsetY * FiercePlanet.zoomLevel;
    FiercePlanet.panLeftOffset += offsetX * FiercePlanet.zoomLevel;
    if (FiercePlanet.googleMap) {
        FiercePlanet.googleMap.panBy(- offsetX * FiercePlanet.zoomLevel, - offsetY * FiercePlanet.zoomLevel);
    }
    FiercePlanet.drawCanvases();
};


/**
 * Pan around the current level
 *
 * @param direction
 */
FiercePlanet.pan = function(direction) {
    var offset = 10;
    switch (direction) {
        case 0:
            FiercePlanet.panByDrag(0, offset);
            break;
        case 1:
            FiercePlanet.panByDrag(0, -offset);
            break;
        case 2:
            FiercePlanet.panByDrag(offset, 0);
            break;
        case 3:
            FiercePlanet.panByDrag(-offset, 0);
            break;
        case 4:
            FiercePlanet.panByDrag(- FiercePlanet.panLeftOffset / FiercePlanet.zoomLevel, - FiercePlanet.panTopOffset / FiercePlanet.zoomLevel);
            break;
    }
};

/**
 * Zoom in or out of the current level
 *
 * @param direction
 */
FiercePlanet.zoom = function(direction) {
//    var canvases = $('canvas');
    var canvases = $('.scrollable-canvas');
    var magnify = 1.5;
    var existingZoom = FiercePlanet.zoomLevel;
    var zoomChanged = false;
    for (var i = 0; i < canvases.length; i++) {
        var canvas = canvases[i];
        var ctx = canvas.getContext('2d');
        switch (direction) {
            case -1:
                if (FiercePlanet.zoomLevel > 1) {
                    ctx.scale(1 / magnify, 1 / magnify);
                }
                break;
            case 0:
                ctx.scale(1 / FiercePlanet.zoomLevel, 1 / FiercePlanet.zoomLevel);
                break;
            case 1:
                if (FiercePlanet.zoomLevel < 10) {
                    ctx.scale(magnify, magnify);
                }
                break;
        }
    }
    switch (direction) {
        case -1:
            if (FiercePlanet.zoomLevel > 1) {
                FiercePlanet.zoomLevel *= 1 / magnify;
            }
            break;
        case 0:
            FiercePlanet.zoomLevel = 1;
            break;
        case 1:
            if (FiercePlanet.zoomLevel < 10) {
                FiercePlanet.zoomLevel *= magnify;
            }
            break;
    }
    if (FiercePlanet.googleMap) {
        var gZoom = FiercePlanet.googleMap.getZoom();
        var newZoom = FiercePlanet.zoomLevel;
        var normalisedExistingZoom = Math.log(existingZoom) / Math.log(magnify);
        var normalisedNewZoom = Math.log(newZoom) / Math.log(magnify);
        var gZoomChange = normalisedNewZoom - normalisedExistingZoom;
        var newGZoom = ((gZoom + gZoomChange) < 1 ? 1 : ((gZoom + gZoomChange) > 20 ? 20 : gZoom + gZoomChange));
        FiercePlanet.googleMap.setZoom(newGZoom);

    }
    FiercePlanet.drawCanvases();
};

