/**
 * Functions for drawing aspects of the game
 */

function drawWorld() {
    // Clear canvases
    $('#map_canvas').empty();
    clearCanvas('c1');
    clearCanvas('c2');
    clearCanvas('c3');
    clearCanvas('c4');

    // Draw basic elements
    if ((currentLevel.getMapOptions() != undefined  && currentLevel.getMapOptions()['lat'] != undefined && currentLevel.getMapOptions()['long'] != undefined)
            || (currentLevel.getMapURL() != undefined && $.trim(currentLevel.getMapURL()).length > 0)) {
        drawMap();
        drawPath();
    }
    else {
        drawTiles();
        drawBackgroundImage();
        drawPath();
    }
    drawEntryPoints();
    drawGoal();
    drawResources();
    drawScrollingLayer();
    drawScoreboard();

    levelInfo(currentLevel.getNotice());

}

function drawTiles() {
    var tiles = currentLevel.getTiles();
    for (var i = 0; i < tiles.length; i+= 1) {
        if (tiles[i] != undefined)
            drawTile(tiles[i]);
    }
}

function drawTile(tile) {
    var canvas = $('#c1')[0];
    var ctx = canvas.getContext('2d');

    var x = tile._x * cellWidth;
    var y = tile._y * cellHeight;
    ctx.clearRect(x + 1, y + 1, cellWidth - 1, cellHeight - 1);
    if (tile._y == 0 || currentLevel.getTile(tile._x, tile._y - 1) == undefined) {
        var my_gradient = ctx.createLinearGradient(x, y, x, y + cellHeight / 4);
        my_gradient.addColorStop(0, "#060");
        my_gradient.addColorStop(1, "#" + tile._color);
        ctx.fillStyle = my_gradient;
    }
    else {
        ctx.fillStyle = "#" + tile._color;
    }
    ctx.fillRect(x, y, cellWidth, cellHeight);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(x, y, cellWidth, cellHeight);
}

function drawPath() {
    var canvas = $('#c1')[0];
    var ctx = canvas.getContext('2d');
    var pathTiles = currentLevel.getPath();
    for (var i = 0; i < pathTiles.length; i+= 1) {
        var pathTile = pathTiles[i];
        var xPos = pathTile[0];
        var yPos = pathTile[1];
        var x = xPos * cellWidth;
        var y = yPos * cellHeight;
        ctx.clearRect(x + 1, y + 1, cellWidth - 1, cellHeight - 1);

        if (!invisiblePath) {
            if (yPos == 0 || currentLevel.getTile(xPos, yPos - 1) != undefined) {
                var my_gradient = ctx.createLinearGradient(x, y, x, y + cellHeight / 4);
                my_gradient.addColorStop(0, "#ccc");
                my_gradient.addColorStop(1, "#eee");
                ctx.fillStyle = my_gradient;
            }
            else {
                ctx.fillStyle = "#eee";
            }
            ctx.border = "1px #eee solid";
            ctx.fillRect(x, y, cellWidth, cellHeight);
        }
        ctx.strokeStyle = "#ccc";
        ctx.strokeRect(x, y, cellWidth, cellHeight);

    }
}

function drawBackgroundImage() {
    if (currentLevel.getImage() != undefined) {
        var canvas = $('#c1')[0];
        var ctx = canvas.getContext('2d');
        ctx.drawImage(currentLevel.getImage(), 0, 0);
    }
}

function handleApiReady() {
    var mapOptions = {
      center: new google.maps.LatLng(47.5153, 19.0782),
        mapTypeId: google.maps.MapTypeId.SATELLITE,
      disableDefaultUI: true,
      zoom: 18,
        tilt: 45
    };
    if (currentLevel != undefined) {
        if (currentLevel.getMapOptions()['lat'] != undefined && currentLevel.getMapOptions()['long'] != undefined)
            mapOptions['center'] = new google.maps.LatLng(currentLevel.getMapOptions()['lat'], currentLevel.getMapOptions()['long']);
        if (currentLevel.getMapOptions()['zoom'] != undefined)
            mapOptions['zoom'] = parseInt(currentLevel.getMapOptions()['zoom']);
        if (currentLevel.getMapOptions()['tilt'] != undefined)
            mapOptions['tilt'] = parseInt(currentLevel.getMapOptions()['tilt']);

        // Handle built-in zoom
        if (zoomLevel > 1)
            mapOptions['zoom'] = mapOptions['zoom'] + Math.log(zoomLevel) / Math.log(1.5);

        googleMap = new google.maps.Map($("#map_canvas")[0], mapOptions);
        if (currentLevel.getMapOptions()['tilt'] != undefined && currentLevel.getMapOptions()['tilt'] != 'no' )
            googleMap.setTilt(45);
    }
    else {
        googleMap = new google.maps.Map($("#map_canvas")[0], mapOptions);
    }
}

function drawMap() {
    if (currentLevel.getMapOptions() != undefined && currentLevel.getMapOptions()['lat'] != undefined && currentLevel.getMapOptions()['long'] != undefined) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://maps.google.com/maps/api/js?sensor=false&callback=handleApiReady";
        document.body.appendChild(script);
    }
    else if (currentLevel.getMapURL() != undefined) {
        $("#map_canvas").prepend('<img src="' + currentLevel.getMapURL() + '"/>').css('image-orientation: 135deg');
    }
}

function drawGoal() {
    var canvas = $('#c1')[0];
    var ctx = canvas.getContext('2d');

    for (var i = 0; i < currentLevel.getExitPoints().length; i++) {
        var point = currentLevel.getExitPoints()[i];
        var x = point[0] * cellWidth + cellWidth / 2;
        var y = point[1] * cellHeight + cellHeight / 2;
        var width = (pieceWidth / 2);
        var height = (pieceHeight / 2);

        ctx.beginPath();
        ctx.arc(x, y, width, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
        ctx.fillStyle = "#fbe53b";
        ctx.fill();
    }
}

function drawEntryPoints() {
    var canvas = $('#c1')[0];
    var ctx = canvas.getContext('2d');

    for (var i = 0; i < currentLevel.getEntryPoints().length; i++) {
        var point = currentLevel.getEntryPoints()[i];
        var x = point[0] * cellWidth + cellWidth / 2;
        var y = point[1] * cellHeight + cellHeight / 2;
        var width = (pieceWidth / 2);
        var height = (pieceHeight / 2);

        /*
        ctx.fillStyle = "#ddd";
        ctx.fillRect(x - width, y - width, width * 2, width * 2);
        */

        // Draw circle
        ctx.beginPath();
        ctx.arc(x, y, width, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.strokeStyle = "#ddd";
        ctx.stroke();
        ctx.fillStyle = "#ddd";
        ctx.fill();
    }

}

function drawResources() {
    for (var i = 0; i < currentLevel._resources.length; i+= 1) {
        drawResource(currentLevel._resources[i]);
    }
}

function drawResource(p) {
    var canvas = $('#c2')[0];
    var ctx = canvas.getContext('2d');

    var x = p._x * cellWidth;
    var y = p._y * cellHeight;
    var s = p._totalYield / p._initialTotalYield * 100;
    var c = p._color;
    var newColor = diluteColour(s, s, s, c);
    ctx.clearRect(x + 1, y + 1, cellWidth - 1, cellHeight - 1);
    ctx.fillStyle = "#" + newColor;
    ctx.strokeStyle = "#333";


    // Fill whole square
//    ctx.fillRect(x, y, cellWidth, cellHeight);
    // Fill smaller square
    ctx.fillRect(x + 4, y + 4, cellWidth - 8, cellHeight - 8);
    switch (p._upgradeLevel) {
        case 1:
            break;
        case 2:
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#666";
            ctx.strokeRect(x + 4, y + 4, cellWidth - 8, cellHeight - 8);
            break;
        case 3:
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#666";
            ctx.strokeRect(x + 6, y + 6, cellWidth - 12, cellHeight - 12);
            break;
        case 4:
            ctx.fillStyle = "#666";
            ctx.fillRect(x + 8, y + 8, cellWidth - 16, cellHeight - 16);
            break;
    }

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#" + newColor;
//    ctx.strokeRect(x, y, cellWidth, cellHeight);
    ctx.strokeRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);
//    ctx.strokeText(p.getUpgradeLevel(), x + 10, y + 10);

    // Draw resource-specific representation here
    var resImage = new Image();
    resImage.src = "/images/" + p._resourceName + ".gif";
    ctx.drawImage(resImage, x + 4, y + 4, cellWidth - 8, cellHeight - 8);
}

function clearCanvas(canvasID) {
    var canvas = $('#' + canvasID)[0];
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    ctx.clearRect(0, 0, w, h);
}

function clearAgents() {
    var canvas = $('#c4')[0];
    var ctx = canvas.getContext('2d');
    var agents = currentLevel._currentAgents;
    if (globalCounter > 0) {
        for (var i = 0; i < agents.length; i += 1) {
            var agent = agents[i];
            var wx = agent._wanderX;
            var wy = agent._wanderY;
            var __ret = getDrawingPosition(agent, globalCounter - 1);
            var intX = __ret.intX * cellWidth + wx + 1;
            var intY = __ret.intY * cellHeight + wy + 1;
            ctx.clearRect(intX, intY, cellWidth + wx + 1, cellHeight + wy + 1);
            if (agentTracing) {
                var __ret = getDrawingPosition(agent, globalCounter - 1);
                var intX = __ret.intX * cellWidth;
                var intY = __ret.intY * cellHeight;
                ctx.beginPath();
                ctx.arc(intX + cellWidth / 2, intY + cellHeight * 1.2, 2, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.strokeStyle = "#000";
                ctx.stroke();
                ctx.fillStyle = "#000";
                ctx.fill();
            }

        }
    }
}


/* Dilutes (whitens) the colour of an element, given its strength (some value between 0 and 100) */
function diluteColour(rStrength, gStrength, bStrength, colour) {
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
}

function getAgentDirection(agent) {
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
}

function getDrawingPosition(agent, count) {
    var lastX = agent._lastMemory._x;
    var lastY = agent._lastMemory._y;
    var x = agent._x;
    var y = agent._y;
    var wx = agent._wanderX;
    var wy = agent._wanderY;
    var speed = agent._speed;
    var increment = (speed - (count - agent._delay) % speed) / speed;


    var offsetX = (x - lastX) * (increment);
    var offsetY = (y - lastY) * (increment);
    var intX = (x - offsetX);
    var intY = (y - offsetY);


    if (currentLevel._allowOffscreenCycling) {
        var halfWay = (increment < 0.5);
        if (x == worldWidth - 1 && lastX == 0) {
            if (halfWay) {
                offsetX = (x - worldWidth) * (increment);
                intX = (x - offsetX);
            }
            else {
                offsetX = 1 - increment;
                intX = offsetX;
            }
        }
        else if (x == 0 && lastX == worldWidth - 1) {
            if (halfWay) {
                offsetX = increment;
                intX = (0 - offsetX);
            }
            else {
                offsetX = (worldWidth - lastX) * (increment);
                intX = (worldWidth - offsetX);
            }
        }
        else if (y == worldWidth - 1 && lastY == 0) {
            if (halfWay) {
                offsetY = (y - worldWidth) * (increment);
                intY = (y - offsetY);
            }
            else {
                offsetY = 1 - increment;
                intY = offsetY;
            }
        }
        else if (y == 0 && lastY == worldWidth - 1) {
            if (halfWay) {
                offsetY = increment;
                intY = (0 - offsetY);
            }
            else {
                offsetY = (worldWidth - lastY) * (increment);
                intY = (worldWidth - offsetY);
            }
        }
    }
    return {intX:intX, intY:intY};
}

function drawAgents() {
    var canvas = $('#c4')[0];
    var ctx = canvas.getContext('2d');
    var agents = currentLevel._currentAgents;
    for (var i = 0; i < agents.length; i += 1) {
        var agent = agents[i];

        // Don't process agents we want to block
        if (! rivalsVisible && agent._agentType == AgentTypes.RIVAL_AGENT_TYPE)
            continue;
        if (! predatorsVisible && agent._agentType == AgentTypes.PREDATOR_AGENT_TYPE)
            continue;

        // Get co-ordinates
        var wx = agent._wanderX;
        var wy = agent._wanderY;
        var __ret = getDrawingPosition(agent, globalCounter);
        var intX = __ret.intX * cellWidth + wx + cellWidth / 2;
        var intY = __ret.intY * cellHeight + wy + cellHeight / 4;
        var direction = getAgentDirection(agent);


        var ecoH = agent._economicHealth;
        var envH = agent._environmentalHealth;
        var socH = agent._socialHealth;
        var c = agent._color.toString();
        var newColor = diluteColour(socH, envH, ecoH, c);
        if (agent._isHit)
            newColor = "f00";

        try {
            eval(agent.getType().getDrawFunction())(ctx, agent, intX, intY, pieceWidth, pieceHeight, newColor, globalCounter, direction);
        } catch(e) {
            eval(CITIZEN_AGENT_TYPE.getDrawFunction())(ctx, agent, intX, intY, pieceWidth, pieceHeight, newColor, globalCounter, direction);
        }


    }
}

function drawScrollingLayer() {
    clearCanvas('c3');
    var canvas = $('#c3')[0];
    var ctx = canvas.getContext('2d');

    if ((scrollingImageX + scrollingImageOffset) < (500 - scrollingImageOffset)){
        scrollingImageX += scrollingImageOffset;
    }
    else {
        scrollingImageX = 1;
    }
    // Need exception handling for Safari
    try {
//        ctx.drawImage(scrollingImage, scrollingImageX, 1, 800, 600, 0, 0, 800, 600);
    }
    catch(err) {
    }
}

function drawLevel() {
    var e = $('#level-display')[0];
    e.innerHTML = currentLevelNumber.toString();
}

function drawProfileClass() {
    var e = $('#profile-class-display')[0];
    e.innerHTML = profileClass;
}

function drawScore() {
    var e = $('#score-display')[0];
    e.innerHTML = score.toString();
}

function drawHighestScore() {
    var e = $('#highest-score-display')[0];
    var hs = localStorage.highestScore;
    if (hs == undefined)
        hs = 0;
    e.innerHTML = hs.toString();
}

function drawResourcesInStore() {
    var e = $('#goodness-display')[0];
    e.innerHTML = resourcesInStore.toString();
}

function drawExpired() {
    var e = $('#expired-display')[0];
    e.innerHTML = expiredAgentCount.toString() + " out of " + currentLevel.getExpiryLimit();
}

function drawSaved() {
    var e = $('#saved-display')[0];
    e.innerHTML = savedAgentCount.toString();
}

function drawWaves() {
    var e = $('#waves-display')[0];
    e.innerHTML = waves.toString() + " out of " + currentLevel.getWaveNumber();
}

function drawScoreboard() {
    drawLevel();
    drawProfileClass();
    drawScore();
    drawHighestScore();
    drawWaves();
    drawSaved();
    drawExpired();
    drawResourcesInStore();
}


/* Pan and Zoom functions */

function pan(direction) {
    var canvases = $('canvas');
    var offset = 10;
    for (var i = 0; i < canvases.length; i++) {
        var canvas = canvases[i];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width,canvas.height);
        switch (direction) {
            case 0:
                ctx.translate(0, offset);
                break;
            case 1:
                ctx.translate(0, -offset);
                break;
            case 2:
                ctx.translate(offset, 0);
                break;
            case 3:
                ctx.translate(-offset, 0);
                break;
            case 4:
                ctx.translate(- panLeftOffset / zoomLevel, - panTopOffset / zoomLevel);
                break;
        }
    }
    switch (direction) {
        case 0:
            panTopOffset += offset * zoomLevel;
            break;
        case 1:
            panTopOffset += -offset * zoomLevel;
            break;
        case 2:
            panLeftOffset += offset * zoomLevel;
            break;
        case 3:
            panLeftOffset += -offset * zoomLevel;
            break;
        case 4:
            panLeftOffset = 0;
            panTopOffset = 0;
            break;
    }
    drawWorld();
}


function zoom(direction) {
    var canvases = $('canvas');
    var magnify = 1.5;
    for (var i = 0; i < canvases.length; i++) {
        var canvas = canvases[i];
        var ctx = canvas.getContext('2d');
        switch (direction) {
            case -1:
                if (zoomLevel > 1) {
                    ctx.scale(1 / magnify, 1 / magnify);
//                    ctx.translate(200, 150);
                }
                break;
            case 0:
                ctx.scale(1 / zoomLevel, 1 / zoomLevel);
//                ctx.translate(0, 0);
                break;
            case 1:
                if (zoomLevel < 10) {
                    ctx.scale(magnify, magnify);
//                    ctx.translate(-200 * magnify, -150 * magnify);
                }
                break;
        }
    }
    switch (direction) {
        case -1:
            if (zoomLevel > 1) {
//                panLeftOffset += 200;
//                panTopOffset += 150;
                zoomLevel *= 1 / magnify;
            }
            break;
        case 0:
//            panLeftOffset = 0;
//            panTopOffset = 0;
            zoomLevel = 1;
            break;
        case 1:
            if (zoomLevel < 10) {
//                panLeftOffset -= 200;
//                panTopOffset -= 150;
                zoomLevel *= magnify;
            }
            break;
    }
    drawWorld();
}
/* End Pan and Zoom functions */
