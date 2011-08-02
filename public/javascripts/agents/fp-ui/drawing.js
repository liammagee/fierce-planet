/*!
 * Fierce Planet - Drawing
 * Functions for drawing aspects of the game
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains drawing functions
 */
FiercePlanet.Drawing = FiercePlanet.Drawing || {};

(function() {
    var plot;
    var plotUpdateInterval;
    var plotIntervalId;

    /**
     * Draws the game
     */
    this.drawGame = function() {
        // Clear canvases
        $('#map_canvas').empty();
        this.clearCanvas('baseCanvas');
        this.clearCanvas('resourceCanvas');
        this.clearCanvas('scrollingCanvas');
        this.clearCanvas('noticeCanvas');
        this.clearCanvas('agentCanvas');

        // Draw basic elements
//    if ((FiercePlanet.currentLevel.mapOptions() != undefined && FiercePlanet.currentLevel.mapOptions()['latitude'] != undefined && FiercePlanet.currentLevel.mapOptions()['longitude'] != undefined)
//            || (FiercePlanet.currentLevel.getMapURL() != undefined && $.trim(FiercePlanet.currentLevel.getMapURL()).length > 0)) {
//        FiercePlanet.drawMap();
//        FiercePlanet.drawPath();
//    }
//    else {
//        FiercePlanet.drawTiles();
//        FiercePlanet.drawBackgroundImage();
//        FiercePlanet.drawPath();
//    }
        this.drawMap();
        this.drawPath();

        this.drawEntryPoints();
        this.drawExitPoints();
        this.drawResources();
        this.drawScrollingLayer();
        this.drawScoreboard();

    };


    /**
     * Draw just the canvas layers
     */
    this.drawCanvases = function() {
        // Clear canvases
        this.clearCanvas('baseCanvas');
        this.clearCanvas('resourceCanvas');
    //    this.clearCanvas('scrollingCanvas');
    //    this.clearCanvas('noticeCanvas');
        this.clearCanvas('agentCanvas');
    
        // Draw basic elements
    //    if ((FiercePlanet.currentLevel.mapOptions() != undefined && FiercePlanet.currentLevel.mapOptions()['latitude'] != undefined && FiercePlanet.currentLevel.mapOptions()['longitude'] != undefined)
    //            || (FiercePlanet.currentLevel.getMapURL() != undefined && $.trim(FiercePlanet.currentLevel.getMapURL()).length > 0)) {
    //        this.drawPath();
    //    }
    //    else {
    //        this.drawTiles();
    //        this.drawBackgroundImage();
    //        this.drawPath();
    //    }
        this.drawPath();
    
        this.drawEntryPoints();
        this.drawExitPoints();
        this.drawResources();
    //    this.drawScrollingLayer();
    };
    
    /**
     * Draws all the tiles on the map
     */
    this.drawTiles = function() {
        var tiles = FiercePlanet.currentLevel.tiles;
        for (var i = 0; i < tiles.length; i += 1) {
            if (tiles[i] != undefined)
                this.drawTile(tiles[i]);
        }
    };
    
    /**
     * Draws a tile
     * @param tile
     */
    this.drawTile = function(tile) {
        var canvas = $('#baseCanvas')[0];
        var ctx = canvas.getContext('2d');
    
        var x = tile.x * FiercePlanet.cellWidth;
        var y = tile.y * FiercePlanet.cellHeight;
        ctx.clearRect(x + 1, y + 1, FiercePlanet.cellWidth - 1, FiercePlanet.cellHeight - 1);
        if (tile.y == 0 || FiercePlanet.currentLevel.getTile(tile.x, tile.y - 1) == undefined) {
            var my_gradient = ctx.createLinearGradient(x, y, x, y + FiercePlanet.cellHeight / 4);
            my_gradient.addColorStop(0, "#060");
            my_gradient.addColorStop(1, "#" + tile.color);
            ctx.fillStyle = my_gradient;
        }
        else {
            ctx.fillStyle = "#" + tile.color;
        }
        ctx.fillRect(x, y, FiercePlanet.cellWidth, FiercePlanet.cellHeight);
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(x, y, FiercePlanet.cellWidth, FiercePlanet.cellHeight);
    };
    
    /**
     * Draws the current level path
     */
    this.drawPath = function() {
        var canvas = $('#baseCanvas')[0];
        var ctx = canvas.getContext('2d');
        var pathTiles = FiercePlanet.currentLevel.getPath();
    
        for (var i = 0; i < pathTiles.length; i += 1) {
            var pathTile = pathTiles[i];
            var xPos = pathTile[0];
            var yPos = pathTile[1];
            var x = xPos * FiercePlanet.cellWidth;
            var y = yPos * FiercePlanet.cellHeight;
    
            ctx.save();
            if (World.settings.skewTiles) {
                var angle = -45 * Math.PI / 180;
                var sx = 0.2;
                var sy = 0.2;
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.transform(1, sy, sx, 1, 0, 0);
                x = 0;
                y = 0;
            }
    
            ctx.clearRect(x + 1, y + 1, FiercePlanet.cellWidth - 1, FiercePlanet.cellHeight - 1);
    
            if (!World.settings.hidePath) {
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
    
            if (!World.settings.hidePathBorder) {
                ctx.strokeStyle = "#ccc";
                ctx.strokeRect(x, y, FiercePlanet.cellWidth, FiercePlanet.cellHeight);
            }
            ctx.restore();
        }
    };
    
    /**
     * Draws the background image, if one exists
     */
    this.drawBackgroundImage = function() {
        if (FiercePlanet.currentLevel.backgroundImage != undefined) {
            var canvas = $('#baseCanvas')[0];
            var ctx = canvas.getContext('2d');
            ctx.drawImage(FiercePlanet.currentLevel.image, 0, 0);
        }
    };
    
    /**
     * Callback method for Google Maps
     */
    this.drawMap = function() {
    //    if (FiercePlanet.googleMap == undefined)
        if (FiercePlanet.currentLevel != undefined) {
            var mapOptions = GoogleMapUtils.defaultOptions();
            $.extend(mapOptions, FiercePlanet.currentLevel.mapOptions);
    
            // Handle built-in zoom
            if (FiercePlanet.zoomLevel > 1)
                mapOptions['zoom'] = mapOptions['zoom'] + Math.log(FiercePlanet.zoomLevel) / Math.log(1.5);
    
            FiercePlanet.googleMap = GoogleMapUtils.createMap(mapOptions);
    
            FiercePlanet.mapOptions = mapOptions;
    //        if (FiercePlanet.currentLevel.mapOptions()['tilt'] != undefined && FiercePlanet.currentLevel.mapOptions()['tilt'] != 'no')
    //            FiercePlanet.googleMap.setTilt(45);
        }
        else {
            FiercePlanet.googleMap = new google.maps.Map($("#map_canvas")[0], mapOptions);
        }
    };
    
    
    /**
     * Draws exit points on the map
     */
    this.drawExitPoints = function() {
        var canvas = $('#baseCanvas')[0];
        var ctx = canvas.getContext('2d');
    
        for (var i = 0; i < FiercePlanet.currentLevel.exitPoints.length; i++) {
            var point = FiercePlanet.currentLevel.exitPoints[i];
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
            var progressRatio = (FiercePlanet.currentWave - 1) / FiercePlanet.currentLevel.waveNumber;
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
    this.drawEntryPoints = function() {
        var canvas = $('#baseCanvas')[0];
        var ctx = canvas.getContext('2d');
    
        for (var i = 0; i < FiercePlanet.currentLevel.entryPoints.length; i++) {
            var point = FiercePlanet.currentLevel.entryPoints[i];
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
            var progressRatio = (FiercePlanet.currentWave - 1) / FiercePlanet.currentLevel.waveNumber;
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
    this.drawNotice = function(notice) {
        if (FiercePlanet.currentNotice != null) {
            this.clearCanvas('noticeCanvas');
            var canvas = $('#noticeCanvas')[0];
            var ctx = canvas.getContext('2d');
    
    
            // Get parameters of the notice
            var text = FiercePlanet.currentNotice.text;
            var start = FiercePlanet.currentNotice.start;
            var duration = FiercePlanet.currentNotice.duration;
            var strengthOfNotice = (duration - (FiercePlanet.levelCounter - start)) / duration;
            var startingTransparency = 0.1;
            var alphaLevel = Math.pow(strengthOfNotice - startingTransparency, 0.5);
    
    
            // Notice dimensions
            var x = FiercePlanet.currentNotice.x;
            var y = FiercePlanet.currentNotice.y;
            var width = FiercePlanet.currentNotice.width;
            var height = FiercePlanet.currentNotice.height;
    
            // Styles
            var foregroundColor = this.insertAlpha(FiercePlanet.currentNotice.foregroundColor, alphaLevel);
            var backgroundColor = this.insertAlpha(FiercePlanet.currentNotice.backgroundColor, alphaLevel);
            var lineWidth = FiercePlanet.currentNotice.lineWidth;
            var font = FiercePlanet.currentNotice.font;
    
    
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
            var lines = this.getTextLines(ctx, text, width - 20);
            ctx.fillStyle = foregroundColor;
            for (var i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], x + 10, y + (20 * (i + 1)));
            }
        }
    };
    
    /**
     * Calculates the text lines for notices displayed on the map
     * @param context
     * @param text
     * @param targetWidth
     */
    this.getTextLines = function(context, text, targetWidth) {
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
     * Inserts an alpha value into a color string.
     * @param color
     * @param alphaLevel
     */
    this.insertAlpha = function(color, alphaLevel) {
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
    this.drawResources = function() {
        for (var i = 0; i < FiercePlanet.currentLevel.resources.length; i += 1) {
            this.drawResource(FiercePlanet.currentLevel.resources[i]);
        }
    };
    
    /**
     * Draw an individual resource
     * @param resource
     */
    this.drawResource = function(resource) {
        var canvas = $('#resourceCanvas')[0];
        var ctx = canvas.getContext('2d');
    
        // Variables
        var x = resource.x * FiercePlanet.cellWidth;
        var y = resource.y * FiercePlanet.cellHeight;
        var s = (resource.totalYield / resource.initialTotalYield) * 100;
        var c = resource.color;
    
        ctx.save();
        if (World.settings.skewTiles) {
            var angle = -45 * Math.PI / 180;
            var sx = 0.2;
            var sy = 0.2;
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.transform(1, sy, sx, 1, 0, 0);
            x = 0;
            y = 0;
        }
    
        // Clear and fill the resource tile with a white background
        ctx.clearRect(x, y, FiercePlanet.cellWidth, FiercePlanet.cellHeight);
        ctx.fillStyle = "#fff";
        ctx.fillRect(x, y, FiercePlanet.cellWidth, FiercePlanet.cellHeight);
    
        // Determine drawing colours and offsets
        var newColor = this.diluteColour(s, s, s, c);
        var yOffset = (((FiercePlanet.cellHeight) * (1.0 - (s / 100))) / 1.2) | 0;
    
        // Create a gradient to fill the cell from the bottom up
        var resourceGradient = ctx.createLinearGradient(x, y + yOffset, x, y + FiercePlanet.cellHeight);
        resourceGradient.addColorStop(0, "#fff");
        resourceGradient.addColorStop(0.5, "#" + c);
        resourceGradient.addColorStop(1, "#" + c);
    
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
        switch (resource.upgradeLevel) {
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
        if (resource.kind.image) {
            var resImage = new Image();
            resImage.src = resource.kind.image;
            ctx.drawImage(resImage, x + 4, y + 4, FiercePlanet.cellWidth - 8, FiercePlanet.cellHeight - 8);
        }
        ctx.restore();
    };
    
    
    /**
     * Clears an individual resource
     * @param resource
     */
    this.clearResource = function(resource) {
        var canvas = $('#resourceCanvas')[0];
        var ctx = canvas.getContext('2d');
    
        var x = resource.x * FiercePlanet.cellWidth;
        var y = resource.y * FiercePlanet.cellHeight;
        ctx.clearRect(x, y, FiercePlanet.cellWidth, FiercePlanet.cellHeight);
    };
    
    /**
     * Clears a canvas
     * @param canvasID
     */
    this.clearCanvas = function(canvasID) {
        var canvas = $('#' + canvasID)[0];
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
    
        ctx.clearRect(0, 0, w, h);
    };
    
    /**
     * Clear all active agents
     */
    this.clearAgents = function() {
        this.clearAgentGroup(FiercePlanet.currentLevel.currentAgents);
    };
    
    /**
     * Clear the agent group
     */
    this.clearAgentGroup = function(agents) {
        var canvas = $('#agentCanvas')[0];
        var ctx = canvas.getContext('2d');
        if (FiercePlanet.waveCounter > 0) {
            for (var i = 0; i < agents.length; i += 1) {
                var agent = agents[i];
                var wx = agent.wanderX;
                var wy = agent.wanderY;
                var __ret = this.getDrawingPosition(agent, FiercePlanet.waveCounter - 1);
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
    
    
    /**
     * Dilutes (whitens) the colour of an element, given its strength (some value between 0 and 100)
     * @param rStrength
     * @param gStrength
     * @param bStrength
     * @param colour
     */
    this.diluteColour = function(rStrength, gStrength, bStrength, colour) {
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
     * Returns the direction for a given agent - '0' for horizontal, '1' for vertical
     * @param agent
     */
    this.getAgentDirection = function(agent) {
        var lastX = agent.lastMemory.x;
        var lastY = agent.lastMemory.y;
        var x = agent.x;
        var y = agent.y;
        if (lastX < x) {
            return 0;
        }
        else {
            return 1;
        }
    };
    
    
    /**
     * Retrieves the drawing position for an agent
     *
     * @param agent
     * @param counter
     */
    this.getDrawingPosition = function(agent, counter) {
        var lastX = agent.lastMemory.x;
        var lastY = agent.lastMemory.y;
        var x = agent.x;
        var y = agent.y;
        var wx = agent.wanderX;
        var wy = agent.wanderY;
        var speed = agent.speed;
        var delay = agent.delay;
        var countdown = agent.countdownToMove;
        var incrementTest = (speed - (counter - agent.delay) % speed) / speed;
        var increment = (speed - countdown) / speed;
    
        var offsetX = (x - lastX) * (increment);
        var offsetY = (y - lastY) * (increment);
        var intX = (x - offsetX);
        var intY = (y - offsetY);
    
        if (FiercePlanet.currentLevel.allowOffscreenCycling) {
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
    this.drawAgents = function() {
        var canvas = $('#agentCanvas')[0];
        var ctx = canvas.getContext('2d');
        var agents = FiercePlanet.currentLevel.currentAgents;
        for (var i = 0; i < agents.length; i += 1) {
            var agent = agents[i];
    
            // Don't process agents we want to block
            if (! World.settings.rivalsVisible && agent.agentType.name == AgentTypes.RIVAL_AGENT_TYPE.name)
                continue;
            if (! World.settings.predatorsVisible && agent.agentType.name == AgentTypes.PREDATOR_AGENT_TYPE.name)
                continue;
    
            // Get co-ordinates
            var wx = agent.wanderX;
            var wy = agent.wanderY;
            var __ret = this.getDrawingPosition(agent, FiercePlanet.waveCounter);
            var intX = __ret.intX * FiercePlanet.cellWidth + wx + FiercePlanet.cellWidth / 2;
            var intY = __ret.intY * FiercePlanet.cellHeight + wy + FiercePlanet.cellHeight / 4;
            var direction = this.getAgentDirection(agent);
    
    
            var blueH = agent.healthCategoryStats[World.resourceCategories[0].code];
            var greenH = agent.healthCategoryStats[World.resourceCategories[1].code];
            var redH = agent.healthCategoryStats[World.resourceCategories[2].code];
            var c = agent.color.toString();
            var newColor = this.diluteColour(redH, greenH, blueH, c);
            if (agent.isHit)
                newColor = "f00";
    
            try {
                eval(agent.agentType.drawFunction)(ctx, agent, intX, intY, FiercePlanet.pieceWidth, FiercePlanet.pieceHeight, newColor, FiercePlanet.waveCounter, direction);
            } catch(e) {
                eval(AgentTypes.CITIZEN_AGENT_TYPE.drawFunction)(ctx, agent, intX, intY, FiercePlanet.pieceWidth, FiercePlanet.pieceHeight, newColor, FiercePlanet.waveCounter, direction);
            }
    
        }
    };
    
    /**
     * Draw agents on the agent canvas
     */
    this.drawExpiredAgent = function(agent) {
        var ctx = $('#scrollingCanvas')[0].getContext('2d');
    
        // Don't process agents we want to block
    
        // Get co-ordinates
        var wx = agent.wanderX;
        var wy = agent.wanderY;
        var __ret = this.getDrawingPosition(agent, FiercePlanet.waveCounter);
        var intX = __ret.intX * FiercePlanet.cellWidth + wx + FiercePlanet.cellWidth / 2;
        var intY = __ret.intY * FiercePlanet.cellHeight + wy + FiercePlanet.cellHeight / 4;
        var direction = this.getAgentDirection(agent);
    
        var newColor = "f00";
    
        if (agent.agentType.drawExpired)
            agent.agentType.drawExpired(ctx, agent, intX, intY, FiercePlanet.pieceWidth, FiercePlanet.pieceHeight, newColor, FiercePlanet.waveCounter, direction);
    };
    
    /**
     * Draw the scrolling layer
     */
    this.drawScrollingLayer = function() {
        if (World.settings.scrollingImageVisible) {
            this.clearCanvas('scrollingCanvas');
            var canvas = $('#scrollingCanvas')[0];
            var ctx = canvas.getContext('2d');
    
            // Add logic for catastrophe here
    
            if (World.settings.catastrophesVisible && FiercePlanet.currentLevel.catastrophe != undefined) {
                var catastrophe = FiercePlanet.currentLevel.catastrophe;
                if (catastrophe.notice.start <= FiercePlanet.levelCounter && (catastrophe.start + catastrophe.duration) >= FiercePlanet.levelCounter) {
                    FiercePlanet.currentNotice = catastrophe.notice;
                }
                if (catastrophe.start <= FiercePlanet.levelCounter && (catastrophe.start + catastrophe.duration) >= FiercePlanet.levelCounter) {
                    // Apply catastrophe effects
                    if (FiercePlanet.levelCounter >= (catastrophe.start + catastrophe.duration / 2)) {
                        catastrophe.strike();
                    }
    
                    // Get effect dimensions
                    var increments = catastrophe.duration / FiercePlanet.WORLD_WIDTH;
                    var leadIncrement = (FiercePlanet.levelCounter - catastrophe.start) / increments * 2;
                    var trailIncrement = ((catastrophe.start + catastrophe.duration) - FiercePlanet.levelCounter) / increments * 2;
    //                console.log(increments);
    //                console.log(currentIncrement);
                    var x = FiercePlanet.WORLD_WIDTH - leadIncrement;
                    var y = 0;
                    var w = trailIncrement;
                    var h = FiercePlanet.WORLD_HEIGHT;
                    ctx.fillStyle = this.insertAlpha(catastrophe.kind.color, 0.5);
                    ctx.fillRect(x, y, w, h);
                    return;
                }
            }
    
            if ((FiercePlanet.scrollingImageX + FiercePlanet.scrollingImageOffset) < (480 - FiercePlanet.scrollingImageOffset)) {
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
    this.drawLevel = function() {
        var e = $('#level-display')[0];
        e.innerHTML = FiercePlanet.currentLevel.id;
    };
    
    /**
     * Draw the current profile class
     */
    this.drawProfileClass = function() {
        var e = $('#profile-class-display')[0];
        if (e != undefined)
            e.innerHTML = FiercePlanet.currentProfile.profile_class;
    };
    
    /**
     * Update the current score
     */
    this.drawScore = function() {
        var e = $('#score-display')[0];
        e.innerHTML = FiercePlanet.zeroFill(FiercePlanet.currentProfile.current_score, 5);
    };
    
    /**
     * Update the highest score
     */
    this.drawHighestScore = function() {
        var e = $('#highest-score-display')[0];
        var hs = FiercePlanet.currentProfile.highest_score;
        if (hs == undefined)
            hs = 0;
        e.innerHTML = hs.toString();
    };
    
    /**
     * Update resources in store
     */
    this.drawResourcesInStore = function() {
        var e = $('#goodness-display')[0];
        e.innerHTML = FiercePlanet.currentProfile.current_level_resources_in_store.toString();
    };
    
    /**
     * Update the number of expired agents
     */
    this.drawExpired = function() {
    //    var e = $('#expired-display')[0];
    //    e.innerHTML = FiercePlanet.expiredAgentCount.toString() + " out of " + FiercePlanet.currentLevel.expiryLimit;
        var e = $('#expired-citizens')[0];
        var expiredHTML = '';
        for (var i = 0, len = FiercePlanet.currentLevel.expiryLimit; i < len; i++) {
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
    this.drawSaved = function() {
        var e = $('#saved-display')[0];
        var saved = FiercePlanet.currentProfile.current_level_saved.toString();
        var totalSaveable = FiercePlanet.currentLevel.getTotalSaveableAgents();
        e.innerHTML = saved + " out of " + totalSaveable;
    };
    
    /**
     * Update the current wave number
     */
    this.drawWaves = function() {
        var e = $('#waves-display')[0];
        e.innerHTML = FiercePlanet.currentWave.toString() + " out of " + FiercePlanet.currentLevel.waveNumber;
    };
    
    
    /**
     * Update the scoreboard
     */
    this.drawScoreboard = function() {
        this.drawLevel();
    //    FiercePlanet.drawProfileClass();
        this.drawScore();
        this.drawHighestScore();
        this.drawWaves();
        this.drawSaved();
        this.drawExpired();
        this.drawResourcesInStore();
    };
    
    
    /**
     * Pan around the current level
     *
     * @param offsetX
     * @param offsetY
     */
    this.panByDrag = function(offsetX, offsetY) {
    //    var canvases = $('canvas');
        var canvases = $('.scrollable-canvas');
        for (var i = 0; i < canvases.length; i++) {
            var canvas = canvases[i];
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(offsetX, offsetY);
        }
        FiercePlanet.panTopOffset += offsetY * FiercePlanet.zoomLevel;
        FiercePlanet.panLeftOffset += offsetX * FiercePlanet.zoomLevel;
        if (FiercePlanet.googleMap) {
            FiercePlanet.googleMap.panBy(- offsetX * FiercePlanet.zoomLevel, - offsetY * FiercePlanet.zoomLevel);
        }
        this.drawCanvases();
    };
    
    
    /**
     * Pan around the current level
     *
     * @param direction
     */
    this.pan = function(direction) {
        var offset = 10;
        switch (direction) {
            case 0:
                this.panByDrag(0, offset);
                break;
            case 1:
                this.panByDrag(0, -offset);
                break;
            case 2:
                this.panByDrag(offset, 0);
                break;
            case 3:
                this.panByDrag(-offset, 0);
                break;
            case 4:
                this.panByDrag(- FiercePlanet.panLeftOffset / FiercePlanet.zoomLevel, - FiercePlanet.panTopOffset / FiercePlanet.zoomLevel);
                break;
        }
    };
    
    /**
     * Zoom in or out of the current level
     *
     * @param direction
     */
    this.zoom = function(direction) {
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
        this.drawCanvases();
    };
    
    /**
     * Animates new level
     */
    this.animateLevel = function () {
        var canvases = $('#map_canvas, #baseCanvas, #scrollingCanvas, #noticeCanvas');
        var world = $('#world');
        var rwl = world.position().left;
        var rwt = world.position().top;
        var ww = world.width();
        var wh = world.height();
        var rw = rwl + Math.floor(Math.random() * ww);
        var rh = rwt + Math.floor(Math.random() * wh);
        world.css({'width': 0, 'height' : 0, 'left': rw, 'top': rh});
        world.animate({'width': ww, 'height': wh, 'left': rwl, 'top': rwt}, 1000);
        canvases.css({'width': 0, 'height' : 0});
        canvases.animate({'width': ww, 'height': wh}, 1000);
    };
    
    /**
     * Resets the flot graph
     */
    this.drawGraph = function () {
        $("#world-graph").show();
        var options = {
            series: { shadowSize: 0 }, // drawing is faster without shadows
            yaxis: { min: 0, max: 55 }
        };
        plot = $.plot($("#world-graph"),
                [ { data: [[0, 0]], lines: { show: true } }, {data: [[0, 0]], lines: { show: true }} ],
                options);
        plotUpdateInterval = 100;
        this.updateGraph();
    };
    
    /**
     * Closes the flot graph
     */
    this.clearGraph = function () {
        $("#world-graph").hide();
        plot = null;
        plotUpdateInterval = 100;
        clearTimeout(plotIntervalId);
    };
    
    /**
     * Updates the flot graph
     */
    this.updateGraph = function() {
        console.log('updating graph');
        if (FiercePlanet.inPlay && World.settings.showGraph) {
            var savedData = plot.getData()[0].data;
            var expiredData = plot.getData()[1].data;
            if (FiercePlanet.levelCounter > 0) {
                savedData.push([FiercePlanet.levelCounter, FiercePlanet.currentProfile.current_level_saved]);
                expiredData.push([FiercePlanet.levelCounter, FiercePlanet.currentProfile.current_level_expired]);
            }
    
            plot.setData([
                { data: savedData, lines: { show: true } },
                {data: expiredData, lines: { show: true }}
            ]);

            plot.setupGrid();
            plot.draw();
        }
    
        plotIntervalId = setTimeout(FiercePlanet.Drawing.updateGraph, plotUpdateInterval);
    };
    
    
    /**
     * Tries to draw all of the canvases as a consolidated thumbnail
     * TODO: needs to be posted back to the server
     */
    this.drawThumbnail = function() {
        var imageCanvas = $('#imageCanvas')[0];
        var baseCanvas = $('#baseCanvas')[0];
        var resourceCanvas = $('#resourceCanvas')[0];
        var scrollingCanvas = $('#scrollingCanvas')[0];
        var noticeCanvas = $('#noticeCanvas')[0];
        var agentCanvas = $('#agentCanvas')[0];
        imageCanvas.getContext('2d').drawImage(baseCanvas, 0, 0);
        imageCanvas.getContext('2d').drawImage(resourceCanvas, 0, 0);
        imageCanvas.getContext('2d').drawImage(scrollingCanvas, 0, 0);
        imageCanvas.getContext('2d').drawImage(noticeCanvas, 0, 0);
        imageCanvas.getContext('2d').drawImage(agentCanvas, 0, 0);
        var imageData = imageCanvas.toDataURL();
        $.post('/levels/' + FiercePlanet.currentLevel.id + '/save_thumbnail',
        {thumbnail: imageData},
                function(data) {
                    alert('data posted')
                }
                );
    };
    
}).apply(FiercePlanet.Drawing);
