

/* NB: classes.js and relevant level sources must be pre-loaded */

/* Constants */


var LEVELS = 10;

var MOVE_INCREMENTS = 5;
var INITIAL_HEALTH = 100;
var MOVE_HEALTH_COST = -5;
var SURVIVAL_SCORE = 10;
var STARTING_GOODNESS = 100;
var PATCH_GOODNESS = 10;
var WAVE_GOODNESS_BONUS = 5;


var NEW_LEVEL_DELAY = 3000;
var NEW_WAVE_DELAY = 1000;

var DEFAULT_PATCH_RECOVERY = 2;

var EASY_DIFFICULTY = 1;
var MEDIUM_DIFFICULTY = 2;
var HARD_DIFFICULTY = 3;
var EXTREME_DIFFICULTY = 4;












/* Global variables */

var godMode = false;
var inPlay = false;

var agentTimerId = 0;

var currentPatchTypeId = null;

var currentLevelNumber = 1;
var currentLevel;

var levelOfDifficulty = MEDIUM_DIFFICULTY;
var patchRecoveryCycle = 5;
var interval = 20;

var levelDelayCounter = 0;
var waveDelayCounter = 0;

var numAgents = 1;

var agents;
var tiles = new Array();
var patches = new Array();
var cells = {};
//var cells = new Hash();
var counter = 0;
var counterLoops = 0;

var previousLevelScore = 0;
var score = 0;
var goodness = 0;
var waves = 1;
var deadAgentCount = 0;
var savedAgentCount = 0;
var savedAgentThisWaveCount = 0;

var worldSize = 11;
var cellWidth = 400 / worldSize;
var pieceWidth = cellWidth * 0.5;
var currentPatch = null;


var scrollingImage = new Image(); // City image
var scrollingImageX = 0;
var scrollingImageOffset = 1;



// Initialise the world
initWorld();


/* UI functions */
function deleteCurrentPatch() {
    var foundPatch = -1;
    for (var i = 0; i < patches.length; i++) {
        var p = patches[i];
        if (p == currentPatch) {
            foundPatch = i;
            break;
        }
    }
    if (foundPatch > -1) {
//        patches = new Array();
        goodness += 5;
        patches.splice(foundPatch, 1);
        drawGoodness();
        clearCanvas('c2');
        drawPatches();
    }
    document.getElementById("delete-upgrade").style.display = "none";
    document.getElementById("swatch").style.display = "block";
}
function upgradeCurrentPatch() {
    var foundPatch = -1;
    for (var i = 0; i < patches.length; i++) {
        var p = patches[i];
        if (p == currentPatch) {
            foundPatch = i;
            break;
        }
    }
    if (foundPatch > -1) {
//        patches = new Array();
        var p = patches[i];
        if (p.getUpgradeLevel() <= 4 && goodness >= p.getUpgradeCost()) {
            goodness -= p.getUpgradeCost();
            p.setUpgradeLevel(p.getUpgradeLevel() + 1);
            drawPatch(p);
            drawGoodness();
        }
    }
    document.getElementById("delete-upgrade").style.display = "none";
    document.getElementById("swatch").style.display = "block";
}
function showPatch(e) {
    var canvas = document.getElementById('c2');
    var __ret = getPatchPosition(e, canvas);
    var posX = __ret.posX;
    var posY = __ret.posY;
    alert(e.x + " : " + e.y);
    alert(posX + " : " + posY);
}
function showDeleteUpgradeSwatch(e) {
    var __ret = getPatchPosition(e, canvas);
    var posX = __ret.posX;
    var posY = __ret.posY;
    var foundPatch = false;
    for (var i = 0; i < patches.length; i++) {
        var p = patches[i];
        if (p.getX() == posX && p.getY() == posY) {
            currentPatch = p;
            document.getElementById("swatch").style.display = "none";
            document.getElementById("delete-upgrade").style.display = "block";
            return;
        }
    }
    if (!foundPatch && currentPatchTypeId != null) {
        dropItem(e);
    }
}

function getPatchPosition(e, canvas) {
    var cellX = 0;
    var cellY = 0;

    var x;
    var y;
    if (e.layerX || e.layerX == 0) { // Firefox
        x = e.layerX;
        y = e.layerY;
    } else if (e.offsetX || e.offsetX == 0) { // Opera
        x = e.offsetX;
        y = e.offsetY;
    }
//    var x = e.pageX - canvas.offsetLeft;
//    var y = e.pageY - canvas.offsetTop;


    var w = canvas.width;
    var h = canvas.height;

    var posX = Math.floor(x / cellWidth);
    var posY = Math.floor(y / cellWidth);
    return {posX:posX, posY:posY};
}

function dropItem(e) {
    var canvas = document.getElementById('c2');
    var ctx = canvas.getContext('2d');
    var __ret = getPatchPosition(e, canvas);
    var posX = __ret.posX;
    var posY = __ret.posY;
//    if (cells.get([posX, posY]) == undefined && ! currentLevel.getAllowPatchesOnPath())
    if (cells[[posX, posY]] == undefined && ! currentLevel.getAllowPatchesOnPath())
        return;
    for (var i = 0; i < patches.length; i++) {
        var p = patches[i];
        if (p.getX() == posX && p.getY() == posY) {
            return;
        }
    }

    var patchType = currentPatchTypeId;
    if (e.dataTransfer)
        patchType = document.getElementById(e.dataTransfer.getData('Text')).id;
    var c = "0f0";
    var totalYield = 0, perAgentYield = 0, cost = 0, upgradeCost = 0;
    if (patchType == 'eco') {
        c = "99ccff";
        totalYield = 100;
        perAgentYield = 20;
        cost = PATCH_GOODNESS;
        upgradeCost = PATCH_GOODNESS * 2;
    }
    else if (patchType == 'env') {
        c = "00ff00";
        totalYield = 100;
        perAgentYield = 10;
        cost = PATCH_GOODNESS;
        upgradeCost = PATCH_GOODNESS * 2;
    }
    else if (patchType == 'soc') {
        c = "ff3300";
        totalYield = 100;
        perAgentYield = 5;
        cost = PATCH_GOODNESS;
        upgradeCost = PATCH_GOODNESS * 2;
    }

    var patch = new Patch(patchType, c, posX, posY);
    patch.setInitialTotalYield(totalYield);
    patch.setPerAgentYield(perAgentYield);
    patch.setCost(cost);
    patch.setUpgradeCost(upgradeCost);
    if (goodness < PATCH_GOODNESS) {
        alert('Not enough goodness for now - save some more agents!');
        return;
    }
    else {
        goodness -= patch.getCost();
        patches.push(patch);
//        cells.set([posX, posY], patch);
        cells[[posX, posY]] = patch;

        drawPatch(patch);
        drawGoodness();
    }
    // Should we do this?
//    currentPatchTypeId = null;
}




/* Draw Methods */


function drawGrid() {
    var canvas = document.getElementById('c1');
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.beginPath();
    for (var i = 0; i < w; i+= cellWidth) {
        ctx.moveTo(i + 0.5, 0);
        ctx.lineTo(i + 0.5, h);

    }
    for (var j = 0; j < h; j+= cellWidth) {
        ctx.moveTo(0, j + 0.5);
        ctx.lineTo(h, j + 0.5);

    }
    ctx.closePath();
    ctx.strokeStyle = "#ccc";
    ctx.stroke();

}

function drawTiles() {
    for (var i = 0; i < tiles.length; i+= 1) {
        drawTile(tiles[i]);
    }
}



function drawTile(p) {
    var canvas = document.getElementById('c1');
    var ctx = canvas.getContext('2d');

    var x = p.getX() * cellWidth;
    var y = p.getY() * cellWidth;
    ctx.clearRect(x + 1, y + 1, cellWidth - 1, cellWidth - 1);
    ctx.fillStyle = "#" + p.getColor();
    ctx.fillRect(x, y, cellWidth, cellWidth);
    ctx.strokeStyle = "#ccc";
    ctx.strokeRect(x, y, cellWidth, cellWidth);
}

function drawGoal() {
    var canvas = document.getElementById('c1');
    var ctx = canvas.getContext('2d');

    var x = currentLevel.getGoalX() * cellWidth + cellWidth / 2;
    var y = currentLevel.getGoalY() * cellWidth + cellWidth / 2;


    var radius = (pieceWidth / 2);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.strokeStyle = "#ccc";
    ctx.stroke();
    ctx.fillStyle = "#fbe53b";
    ctx.fill();
}

function drawPatches() {
    for (var i = 0; i < patches.length; i+= 1) {
        drawPatch(patches[i]);
    }
}

function drawPatch(p) {
    var canvas = document.getElementById('c2');
    var ctx = canvas.getContext('2d');

    var x = p.getX() * cellWidth;
    var y = p.getY() * cellWidth;
    var s = p.getTotalYield() / p.getInitialTotalYield() * 100;
    var c = p.getColor();
    var newColor = diluteColour(s, c);
    ctx.clearRect(x + 1, y + 1, cellWidth - 1, cellWidth - 1);
    ctx.fillStyle = "#" + newColor;

    // Fill whole square
//    ctx.fillRect(x, y, cellWidth, cellWidth);
    // Fill smaller square
    ctx.fillRect(x + 4, y + 4, cellWidth - 8, cellWidth - 8);
    switch (p.getUpgradeLevel()) {
        case 1:
            break;
        case 2:
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#666";
            ctx.strokeRect(x + 4, y + 4, cellWidth - 8, cellWidth - 8);
            break;
        case 3:
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#666";
            ctx.strokeRect(x + 6, y + 6, cellWidth - 12, cellWidth - 12);
            break;
        case 4:
            ctx.fillStyle = "#666";
            ctx.fillRect(x + 8, y + 8, cellWidth - 16, cellWidth - 16);
            break;
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#ccc";
    ctx.strokeRect(x, y, cellWidth, cellWidth);
//    ctx.strokeText(p.getUpgradeLevel(), x + 10, y + 10);
}


function clearCanvas(canvasID) {
    var canvas = document.getElementById(canvasID);
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    ctx.clearRect(0, 0, w, h);
}

function clearAgents() {
    var canvas = document.getElementById('c4');
    var ctx = canvas.getContext('2d');
    if (counter > 0) {
        for (var i = 0; i < agents.length; i += 1) {
            var agent = agents[i];
            var wx = agent.getWanderX();
            var wy = agent.getWanderY();
            var __ret = getDrawingPosition(agent, counter - 1);
            var intX = __ret.intX * cellWidth + wx + 1;
            var intY = __ret.intY * cellWidth + wy + 1;
            ctx.clearRect(intX, intY, cellWidth - 2, cellWidth - 2);
        }
    }
}

/* Dilutes (whitens) the colour of an element, given its strength (some value between 0 and 100) */
function diluteColour(strength, colour) {
    var charOffset = (colour.length == 3 ? 1 : 2);
    var multiplier = (charOffset == 1 ? 1 : 16)
    var dilutionBase = 10;
    var maxValue = Math.pow(16, charOffset);
    var r = parseInt(colour.slice(0, 1 * charOffset), 16);
    var g = parseInt(colour.slice(1 * charOffset, 2 * charOffset), 16);
    var b = parseInt(colour.slice(2 * charOffset, 3 * charOffset), 16);

    var ro = Math.floor((100 - strength) / 100 * (maxValue - r));
    var go = Math.floor((100 - strength) / 100 * (maxValue - g));
    var bo = Math.floor((100 - strength) / 100 * (maxValue - b));
    var rOffset = (r + ro < maxValue ? r + ro : maxValue - 1).toString(16);
    var gOffset = (g + go < maxValue ? g + go : maxValue - 1).toString(16);
    var bOffset = (b + bo < maxValue ? b + bo : maxValue - 1).toString(16);
    rOffset = (rOffset.length < charOffset ? rOffset + "0" : rOffset);
    gOffset = (gOffset.length < charOffset ? gOffset + "0" : gOffset);
    bOffset = (bOffset.length < charOffset ? bOffset + "0" : bOffset);
    var newColor = rOffset + gOffset + bOffset;
    return newColor;
}

function getDrawingPosition(agent, count) {
    var lastX = agent.lastPosition()[0];
    var lastY = agent.lastPosition()[1];
    var x = agent.getPosition()[0];
    var y = agent.getPosition()[1];
    var wx = agent.getWanderX();
    var wy = agent.getWanderY();
    var speed = agent.getSpeed();
    var increment = (speed - (count - agent.getDelay()) % speed) / speed;


    var offsetX = (x - lastX) * (increment);
    var offsetY = (y - lastY) * (increment);
    var intX = (x - offsetX);
    var intY = (y - offsetY);

    if (currentLevel.getAllowOffscreenCycling()) {
        var halfWay = (increment < 0.5);
        if (x == worldSize - 1 && lastX == 0) {
            if (halfWay) {
                offsetX = (x - worldSize) * (increment);
                intX = (x - offsetX);
            }
            else {
                offsetX = 1 - increment;
                intX = offset;
            }
        }
        else if (x == 0 && lastX == worldSize - 1) {
            if (halfWay) {
                offsetX = increment;
                intX = (0 - offsetX);
            }
            else {
                offsetX = (worldSize - lastX) * (increment);
                intX = (worldSize - offsetX);
            }
        }
        else if (y == worldSize - 1 && lastY == 0) {
            if (halfWay) {
                offsetY = (y - worldSize) * (increment);
                intY = (y - offsetY);
            }
            else {
                offsetY = 1 - increment;
                intY = offset;
            }
        }
        else if (y == worldSize - 1 && lastY == 0) {
            if (halfWay) {
                offsetY = increment;
                intY = offsetY;
            }
            else {
                offsetY = (lastY - worldSize) * (increment);
                intY = (lastY - offsetY);
            }
        }
    }
    return {intX:intX, intY:intY};
}
function drawAgents() {
    var canvas = document.getElementById('c4');
    var ctx = canvas.getContext('2d');
    for (var i = 0; i < agents.length; i += 1) {
        var agent = agents[i];
        var wx = agent.getWanderX();
        var wy = agent.getWanderY();
        var __ret = getDrawingPosition(agent, counter);
        var intX = __ret.intX * cellWidth + wx + cellWidth / 2;
        var intY = __ret.intY * cellWidth + wy + cellWidth / 2;



        var radius = (pieceWidth / 4);
        var bodyLength = (pieceWidth / 2);

        ctx.beginPath();
        ctx.arc(intX, intY, radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
        var health = agent.getHealth();
        var c = agent.getColor().toString();
        var newColor = diluteColour(health, c);
        ctx.fillStyle = "#" + newColor;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(intX, intY + radius);
        ctx.lineTo(intX, intY + radius + bodyLength / 2);
        if (counter % 2 == 0) {
            // Legs
            var xOffset = Math.sin(30 * Math.PI/180) * bodyLength / 2;
            var yOffset = Math.cos(30 * Math.PI/180) * bodyLength / 2;
            ctx.moveTo(intX, intY + radius + bodyLength / 2);
            ctx.lineTo(intX - xOffset, intY + radius + bodyLength / 2 + yOffset);
            ctx.moveTo(intX, intY + radius + bodyLength / 2);
            ctx.lineTo(intX + xOffset, intY + radius + bodyLength / 2 + yOffset);
            // Arms - 90 degrees
            ctx.moveTo(intX - bodyLength / 2, intY + radius + bodyLength / 6);
            ctx.lineTo(intX + bodyLength / 2, intY + radius + bodyLength / 6);
        }
        else {
            // Legs - straight
            ctx.moveTo(intX, intY + radius + bodyLength / 2);
            ctx.lineTo(intX, intY + radius + bodyLength);
            // Arms - 45 degrees
            var xOffset = Math.sin(45 * Math.PI/180) * bodyLength / 2;
            var yOffset = Math.cos(45 * Math.PI/180) * bodyLength / 2;
            ctx.moveTo(intX - xOffset, intY + radius + bodyLength / 6 + yOffset);
            ctx.lineTo(intX, intY + radius + bodyLength / 6);
            ctx.moveTo(intX + xOffset, intY + radius + bodyLength / 6 + yOffset);
            ctx.lineTo(intX, intY + radius + bodyLength / 6);

        }
        ctx.closePath();
        ctx.strokeStyle = "#" + newColor;
        ctx.lineWidth = 2;
        ctx.stroke();

//
//
//        var radius = (pieceWidth / 2);
//
//        ctx.beginPath();
//        ctx.arc(intX, intY, radius, 0, Math.PI * 2, false);
//        ctx.closePath();
//        ctx.strokeStyle = "#ccc";
//        ctx.stroke();
//        var health = agent.getHealth();
//        var c = agent.getColor().toString();
//        var newColor = diluteColour(health, c);
//        ctx.fillStyle = "#" + newColor;
//        ctx.fill();
    }
}

function drawScrollingLayer() {
    clearCanvas('c3');
    var canvas = document.getElementById('c3');
    var ctx = canvas.getContext('2d');
    
    if ((scrollingImageX + scrollingImageOffset) < (400 - scrollingImageOffset)){
        scrollingImageX += scrollingImageOffset;
    }
    else {
        scrollingImageX = 0;
    }
    ctx.drawImage(scrollingImage, scrollingImageX, 0, 400, 400, 0, 0, 400, 400);
}

function drawLevel() {
    var e = document.getElementById("level-display");
    e.innerHTML = currentLevelNumber.toString();
}
function drawHighestLevel() {
    var e = document.getElementById("highest-level-display");
    var hl = localStorage.highestLevel;
    if (hl == undefined)
        hl = 0;
    e.innerHTML = hl.toString();
}
function drawScore() {
    var e = document.getElementById("score-display");
    e.innerHTML = score.toString();
}
function drawHighestScore() {
    var e = document.getElementById("highest-score-display");
    var hs = localStorage.highestScore;
    if (hs == undefined)
        hs = 0;
    e.innerHTML = hs.toString();
}

function drawGoodness() {
    var e = document.getElementById("goodness-display");
    e.innerHTML = goodness.toString();
}
function drawDead() {
    var e = document.getElementById("dead-display");
    e.innerHTML = deadAgentCount.toString() + " out of " + currentLevel.getExpiryLimit();
}
function drawSaved() {
    var e = document.getElementById("saved-display");
    e.innerHTML = savedAgentCount.toString();
}

function drawWaves() {
    var e = document.getElementById("waves-display");
    e.innerHTML = waves.toString() + " out of " + currentLevel.getWaveNumber();
}



function drawScoreboard() {
    drawLevel();
    drawHighestLevel();
    drawScore();
    drawHighestScore();
    drawWaves();
    drawSaved();
    drawDead();
    drawGoodness();
}



/* End Drawing Methods */




/* Move Strategies */

function moveAgent(agent, withNoRepeat, withNoCollision) {
    var x = agent.getX();
    var y = agent.getY();
    var lastX = -1, lastY = -1;
    var p = agent.lastPosition();
    if (p != undefined || (p[0] > -1 && p[1] > -1)) {
        lastX = p[0];
        lastY = p[1];
    }
    var position = findPosition(agent, withNoRepeat, withNoCollision, currentLevel.getAllowOffscreenCycling(), currentLevel.getAllowOffscreenCycling());
//    if ((position[0] != x || position[1] != y) && (position[0] != lastX || position[1] != lastY))
        agent.setPosition(position[0], position[1]);
}

function moveAgents(withNoRepeat, withNoCollision) {
    for (var i = 0; i < agents.length; i+= 1) {
        var agent = agents[i];
        moveAgent(agent, withNoRepeat, withNoCollision);
    }
}

function findPosition(agent, withNoRepeat, withNoCollision, withOffscreenCycling) {
    var positionFound = false;
    var existingDirections = new Array();
    var x = agent.getPosition()[0];
    var y = agent.getPosition()[1];
    var newX = x;
    var newY = y;
    var lastX = agent.lastPosition()[0];
    var lastY = agent.lastPosition()[1];
    var candidateCells = new Array();
    var directions = randomDirectionOrder();
    for (var i = 0; i < directions.length; i++) {
        counterLoops++;
        newX = x;
        newY = y;
        var dir = directions[i];

        var offScreen1 = 0;
        var offScreen2 = currentLevel.getWorldSize() - 1;
        var offset = 1;
        var toContinue = false;
        switch (dir) {
            case 0:
                (newX == offScreen1 ? (withOffscreenCycling ? newX = offScreen2 : toContinue = true) : newX = newX - offset);
                break;
            case 1:
                (newX == offScreen2 ? (withOffscreenCycling ? newX = offScreen1 : toContinue = true) : newX = newX + offset);
                break;
            case 2:
                (newY == offScreen1 ? (withOffscreenCycling ? newY = offScreen2 : toContinue = true) : newY = newY - offset);
                break;
            case 3:
                (newY == offScreen2 ? (withOffscreenCycling ? newY = offScreen1 : toContinue = true) : newY = newY + offset);
                break;
        }
        if ((withNoRepeat && lastX == newX && lastY == newY) || toContinue) {
            continue;
        }
//        if (cells.get([newX, newY]) == undefined) {
//            candidateCells.push([newX, newY]);
//        }
        if (cells[[newX, newY]] == undefined) {
            candidateCells.push([newX, newY]);
        }
    }
    // Allow for back-tracking, if there is no way forward
    if (candidateCells.length == 0) {
        return [lastX, lastY];
    }

    // Find the first candidate which is either the goal, or not in the history.
    var candidatesNotInHistory = new Array();
    for (var i = 0; i < candidateCells.length; i++) {
        var candidate = candidateCells[i];
        if (isGoalCell(candidate[0], candidate[1]))
            return candidate;
        var inHistory = false;
        for (var j = agent.getHistory().length - 1 ; j >= 0; j--) {
            var historyCell = agent.getHistory()[j];
            if (historyCell[0] == candidate[0] && historyCell[1] == candidate[1])
                inHistory = true;
        }
        if (!inHistory)
            candidatesNotInHistory.push(candidate);
    }

    // Try to find a neighbouring patch, if it exists
    if (candidatesNotInHistory.length > 0) {
        var bestCandidate = candidatesNotInHistory[0];
        for (var i = 0; i < candidatesNotInHistory.length; i++) {
            var candidate = candidatesNotInHistory[i];
            var neighbour = hasNeighbouringPatches(candidate[0], candidate[1]);
            if (neighbour != null)
                bestCandidate = candidate;
        }
        return bestCandidate;
    }
    else {
        var bestCandidate = candidateCells[0];
        for (var i = 0; i < candidateCells.length; i++) {
            var candidate = candidateCells[i];
            var neighbour = hasNeighbouringPatches(candidate[0], candidate[1]);
            if (neighbour != null)
                bestCandidate = candidate;
        }
        return bestCandidate;
    }


    // Allow for movement off-screen, if no other option is available
    if (! withOffscreenCycling) {
        if (x == offScreen2 || x == offScreen1 || y == offScreen2 || y == offScreen1) {
            if (x == offScreen2) {
                newX = offScreen2 + 1;
            }
            else if (x == offScreen1) {
                newX = offScreen1 - 1;
            }
            else if (y == offScreen2) {
                newY = offScreen2 + 1;
            }
            else if (y == offScreen1) {
                newY = offScreen1 - 1;
            }
            return [newX, newY];
        }
    }


    // Use the first NON-candidate cell to use if no candidate is found
    return candidateCells[0];
}

function randomDirectionOrder() {
    var directions = new Array();
    var orderedDirections = [0, 1, 2, 3];
    var odl = orderedDirections.length;
    for (var i = 0; i < odl; i++) {
        var obj = directions[i];
        var remainingLength = orderedDirections.length;
        var pos = Math.floor(Math.random() * remainingLength);
        directions.push(orderedDirections[pos]);
        orderedDirections.splice(pos, 1);
    }
    return directions;
}

function checkCollision(x, y) {
//    return cells.get([x, y]) == undefined;
    return cells[[x, y]] == undefined;
}

function moveAgentsRandomly() {
    for (var i = 0; i < agents.length; i+= 1) {
        var dir = Math.floor(Math.random() * 4);
        var agent = agents[i];
        var newX = agent.getX();
        var newY = agent.getY();
        switch (dir) {
            case 0:
                (newX == 0) ? newX = worldSize - 1 : newX = newX - 1;
                break;
            case 1:
                (newX == worldSize - 1) ? newX = 0 : newX = newX + 1;
                break;
            case 2:
                (newY == 0) ? newY = worldSize - 1 : newY = newY - 1;
                break;
            case 3:
                (newY == worldSize - 1) ? newY = 0 : newY = newY + 1;
                break;
        }
        if (!checkPatches(newX, newY))
            agent.setPosition(newX, newY);
    }
}


function checkPatches(newX, newY) {
    var isPatch = false;
    for (var j = 0; j < tiles.length; j+= 1) {
        var patch = tiles[j];
        if (patch.getX() == newX && patch.getY() == newY)
            return true;
    }
    return isPatch;
}

/* End Move Strategies */


/* Game logic methods */
function processAgents() {

    // Draw the scrolling layer
    drawScrollingLayer();


    // Delay, until we are ready for the first wave
    if (levelDelayCounter < NEW_LEVEL_DELAY / interval) {
        levelDelayCounter++;
        return;
    }

    // Delay, until we are ready for a new wave
    if (waveDelayCounter < NEW_WAVE_DELAY / interval) {
        waveDelayCounter++;
        return;
    }

    // Increment counter
    counter++;


    clearAgents();
    var nullifiedAgents = new Array();
    for (var i = 0; i < agents.length; i+= 1) {
        var agent = agents[i];
        var speed = agent.getSpeed();
        if (counter >= agent.getDelay() && (counter - agent.getDelay()) % speed == 0) {
            if (agent.getX() == currentLevel.getGoalX() && agent.getY() == currentLevel.getGoalY()) {
                score += SURVIVAL_SCORE;
                savedAgentCount++;
                savedAgentThisWaveCount++;
                nullifiedAgents.push(i);
                var multiplier = (waves < 5 ? 4 : (waves < 10 ? 3 : (waves < 20 ? 2 : 1)));
                goodness += multiplier; //WAVE_GOODNESS_BONUS;
                drawScore();
                drawGoodness();
                drawSaved();
            }
            moveAgent(agent, true, false);
            agent.adjustSpeed();
            agent.adjustWander();
            if (!godMode)
                agent.adjustHealth(MOVE_HEALTH_COST);
            if (agent.getHealth() <= 0) {
                nullifiedAgents.push(i);
                deadAgentCount++;
                drawDead();
            }
//            else if (agent.getX() < 0 || agent.getX() >=  worldSize || agent.getY() < 0 || agent.getY() >= worldSize) {
//                nullifiedAgents.push(i);
//            }
            else
                // Hook for detecting 'active' patches
                processNeighbouringPatches(agent);
        }
    }

    if (deadAgentCount >= currentLevel.getExpiryLimit()) {
        return gameOver();
    }

    // Check whether we have too many
    for (var i = nullifiedAgents.length - 1; i >= 0; i-= 1) {
        agents.splice(nullifiedAgents[i], 1);
    }
    // No agents left? End of wave
    if (agents.length == 0) {
        // Start a new wave
        if (waves < currentLevel.getWaveNumber()) {
            newWave();
            drawScoreboard();
            waveDelayCounter = 0;
        }
        else if (currentLevelNumber < LEVELS) {
            newLevel();
            levelDelayCounter = 0;
        }
        else {
            return gameOver();
        }
    }
    else {
        if (counter % patchRecoveryCycle == 0)
            recoverPatches();
        drawAgents();
    }
}

function processNeighbouringPatches(agent) {
    var x = agent.getX();
    var y = agent.getY();
    for (var j = 0; j < patches.length; j++) {
        var p = patches[j];
        var px = p.getX();
        var py = p.getY();
        if (Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1) {
            p.provideYield(agent);
            drawPatch(p);
        }
    }
}

function hasNeighbouringPatches(x, y) {
    for (var j = 0; j < patches.length; j++) {
        var p = patches[j];
        var px = p.getX();
        var py = p.getY();
        if (Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1) {
            // Add hook here for evaluating relative health of neighbouring patches
//            var h = p.getHealth();
            return p;
        }
    }
    return null;
}

function isGoalCell(x, y) {
    var gx = currentLevel.getGoalX();
    var gy = currentLevel.getGoalY();
    return (gx == x && gy == y);
}
function getAbsoluteDistanceFromGoal(x, y){
    var gx = currentLevel.getGoalX();
    var gy = currentLevel.getGoalY();
    return (Math.abs(gx - x) + Math.abs(gy - y));
}

function recoverPatches() {
    for (var j = 0; j < patches.length; j++) {
        var p = patches[j];
        /* Test code for restoring patch health, as opposed to resetting at the end of each wave */
        if (p.getTotalYield() < p.getInitialTotalYield()) {
            /* Overly generous... */
//            p.setTotalYield(p.getTotalYield() + p.getPerAgentYield());
            p.setTotalYield(p.getTotalYield() + 1);
            drawPatch(p);
        }
    }
}

function resetPatchYields() {
    for (var i = 0; i < patches.length; i++) {
        var p = patches[i];
        p.setTotalYield(p.getInitialTotalYield());
    }
}


function newWave() {
    counter = 0;
    savedAgentThisWaveCount = 0;
    waves ++;
    presetAgents(++numAgents, currentLevel.getInitialAgentX(), currentLevel.getInitialAgentY());
}

function newLevel() {
    storeData();
    drawScoreboard();
    alert("Level " + currentLevelNumber + " successfully completed. Game over - you scored an impressive " + score + ". Click 'OK' to start the next level.");

    currentLevelNumber++;
    previousLevelScore = score;
    patches = new Array();
    redrawWorld();

    levelInfo(currentLevel.getNotice());
    log("Starting new level...");

    startAgents();
}

function gameOver() {
    storeData();
    drawScoreboard();
    alert("Game over - you scored an impressive " + score + ". Press 'Restart Level' to start this level again.");
    // Add hook for proper jump screen
    stopAgents();
}



/* Set up code */



function newGame() {
    currentLevelNumber = 1;
    score = 0;
    previousLevelScore = 0;
    storeCurrentLevelData();
    restartLevel();
}

function restartLevel() {
    interval = checkInteger(1000 / document.getElementById("intervalInput").value);
    currentLevelNumber = checkInteger(document.getElementById("levelInput").value);
    godMode = document.getElementById("godModeInput").checked;
    var diffSelect = document.getElementById("difficultyInput");
    levelOfDifficulty = checkInteger(diffSelect[diffSelect.selectedIndex].value);
    score = previousLevelScore;
    patches = new Array();
    redrawWorld();
}

function redrawWorld() {
    // Stop any existing timers
    stopAgents();

    // Clear canvases
    clearCanvas('c2');
    clearCanvas('c3');
    clearCanvas('c4');

    // Initialise the world
    initWorld();

    // Reset existing patches
    resetPatchYields();

    // Draw basic elements
    drawGrid();
    drawTiles();
    drawGoal();
    drawPatches();
    drawScrollingLayer();
    drawScoreboard();

    levelInfo(currentLevel.getNotice());
}

function reloadGame() {

    currentLevelNumber = (localStorage.currentLevelNumber != undefined ? parseInt(localStorage.currentLevelNumber) : currentLevelNumber);
    score = (localStorage.currentScore != undefined ? parseInt(localStorage.currentScore) : score);
    redrawWorld();
}

function initWorld() {
    log("Initialising world...");

    tiles = new Array();
    // Keep active patches for now
//    activePatches = new Array();
    agents = new Array();
    cells = {};
//    cells = new Hash();


//    score = 0;
    deadAgentCount = 0;
    savedAgentCount = 0;
    waves = 1;
    numAgents = 1;

    patchRecoveryCycle = Math.pow(DEFAULT_PATCH_RECOVERY, levelOfDifficulty - 1);

    currentLevel = eval("level" + currentLevelNumber.toString());
    goodness = currentLevel.getStartingGoodness();
    if (goodness == undefined || goodness == null) {
        goodness = STARTING_GOODNESS;
    }


    worldSize = currentLevel.getWorldSize();
    cellWidth = 400 / worldSize;
    pieceWidth = cellWidth * 0.5;
    scrollingImage.src = "/images/yellow-rain.png";

    // Set up level
    preSetupLevel(currentLevel);
    currentLevel.setupLevel();
    postSetupLevel(currentLevel);
}


function startAgents() {
    log("Starting agents...");

    clearInterval(agentTimerId);
    agentTimerId = setInterval("processAgents()", interval);
    inPlay = true;
}


function stopAgents() {
    log("Stopping agents...");

    clearInterval(agentTimerId);
    inPlay = false;
}

function resetSpeed() {
    interval = checkInteger(1000 / document.getElementById("intervalInput").value);
    if (inPlay)
        startAgents();
}


/* Utility functions */

/* Uses local storage to store highest scores and levels */
function storeData() {
    localStorage.currentScore = previousLevelScore;
    localStorage.currentLevelNumber = currentLevelNumber;
    if (localStorage.highestScore == undefined || score > localStorage.highestScore)
        localStorage.highestScore = score;
    if (localStorage.highestLevel == undefined || currentLevelNumber > localStorage.highestLevel)
        localStorage.highestLevel = currentLevelNumber;
}
function storeCurrentLevelData() {
    localStorage.currentScore = previousLevelScore;
    localStorage.currentLevelNumber = currentLevelNumber;
}


function checkInteger(value) {
    return Math.floor(value);
}

function log(message) {
    console.log(message);
}

function globalInfo(notice) {
    $("#global-info")[0].innerHTML = notice;
}

function levelInfo(notice) {
    $("#level-info")[0].innerHTML = notice;
}

/* End utility functions */


/* Level editor functions */
function showLevelEditor() {
    var proposedWorldSize = checkInteger(prompt("Enter a size for your level: ", "10"));
    alert("Proposed world size: " + proposedWorldSize + ". This feature is not yet implemented.");
}