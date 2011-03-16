

/* NB: agents.js and relevant level sources must be pre-loaded */

/* Constants */

// Helpful for debugging
var NO_DIE = false;

var LEVELS = 2;

var MOVE_INCREMENTS = 5;
var INITIAL_HEALTH = 100;
var MOVE_HEALTH_COST = -5;
var SURVIVAL_SCORE = 10;
var STARTING_GOODNESS = 100;
var PATCH_GOODNESS = 10;
var WAVE_GOODNESS_BONUS = 5;


var WAVE_INTERVAL_CYCLES = 25;

var DEFAULT_PATCH_RECOVERY = 2;

var EASY_DIFFICULTY = 1;
var MEDIUM_DIFFICULTY = 2;
var HARD_DIFFICULTY = 3;
var EXTREME_DIFFICULTY = 4;


/* Global variables */

var agentTimerId = 0;

var currentPatchTypeId = null;

var levelOfDifficulty = MEDIUM_DIFFICULTY;
var patchRecoveryCycle = 5;
var interval = 20;
var currentWaveIntervals = 0;
var numAgents = 1;

var agents;
var tiles = new Array();
var patches = new Array();
var cells = new Hash();
var counter = 0;
var counterLoops = 0;

var currentLevelNumber = 1;
var currentLevel;
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

    // Get cell
    for (var i = 0; i < w; i += cellWidth) {
        if (x > i && x < i + cellWidth) {
            cellX = i;
            break;
        }
    }
    for (var j = 0; j < h; j += cellWidth) {
        if (y > j && y < j + cellWidth) {
            cellY = j;
            break;
        }
    }

    // Check if this patch can be dropped on a tile
    var posX = Math.floor(cellX / cellWidth);
    var posY = Math.floor(cellY / cellWidth);
    return {posX:posX, posY:posY};
}

function dropItem(e) {
    var canvas = document.getElementById('c2');
    var ctx = canvas.getContext('2d');
    var __ret = getPatchPosition(e, canvas);
    var posX = __ret.posX;
    var posY = __ret.posY;
    if (cells.get([posX, posY]) == undefined)
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

        drawPatch(patch);
        drawGoodness();
    }
    currentPatchTypeId = null;
}




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
    var position = findPosition(x, y, withNoRepeat, withNoCollision, true, lastX, lastY);
    if ((position[0] != x || position[1] != y) && (position[0] != lastX || position[1] != lastY))
        agent.setPosition(position[0], position[1]);
}

function moveAgents(withNoRepeat, withNoCollision) {
    for (var i = 0; i < agents.length; i+= 1) {
        var agent = agents[i];
        moveAgent(agent, withNoRepeat, withNoCollision);
    }
}

function findPosition(x, y, withNoRepeat, withNoCollision, withNoCycle, lastX, lastY) {
    var positionFound = false;
    var existingDirections = new Array();
    var directions = 4;
    var newX = x;
    var newY = y;
    for (var i = 0; i < directions; i++) {
        counterLoops++;
        newX = x;
        newY = y;
        var dir = Math.floor(Math.random() * directions);
        var existing = false;
        for (var j = 0; j < existingDirections.length; j++) {
            if (existingDirections[j] == dir) {
                existing = true;
            }
        }
        if (existing == true) {
            i--;
            continue;
        }
        existingDirections.push(dir);

        var offScreen1 = 0;
        var offScreen2 = currentLevel.getWorldSize() - 1;
        var offset = 1;
        switch (dir) {
            case 0:
                (newX == offScreen1 && !withNoCycle) ? newX = offScreen2 : newX = newX - offset;
                break;
            case 1:
                (newX == offScreen2 && !withNoCycle) ? newX = offScreen1 : newX = newX + offset;
                break;
            case 2:
                (newY == offScreen1 && !withNoCycle) ? newY = offScreen2 : newY = newY - offset;
                break;
            case 3:
                (newY == offScreen2 && !withNoCycle) ? newY = offScreen1 : newY = newY + offset;
                break;
        }
        if (withNoRepeat == true && lastX == newX && lastY == newY) {
            continue;
        }
        if (cells.get([newX, newY]) == undefined) {
            return [newX, newY];
        }
    }
    // Allow for movement off-screen, if no other option is available
    if (x == offScreen2 || x == offScreen1 || y == offScreen2 || y == offScreen1) {
        if (x == offScreen2) {
            x = offScreen2 + 1;
        }
        else if (x == offScreen1) {
            x = offScreen1 - 1;
        }
        else if (y == offScreen2) {
            y = offScreen2 + 1;
        }
        else if (y == offScreen1) {
            y = offScreen1 - 1;
        }
    }

    return [x, y];
}

function checkCollision(x, y) {
    return cells.get([x, y]) == undefined;
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


function clearAgents() {
    var canvas = document.getElementById('c3');
    var ctx = canvas.getContext('2d');
    if (counter > 0) {
        for (var i = 0; i < agents.length; i += 1) {
            var agent = agents[i];
            var lastX = agent.lastPosition()[0];
            var lastY = agent.lastPosition()[1];
            var x = agent.getPosition()[0];
            var y = agent.getPosition()[1];
            var wx = agent.getWanderX();
            var wy = agent.getWanderY();
            var speed = agent.getSpeed();
            var increment = (speed - (counter - 1 - agent.getDelay()) % speed) / speed;
            var offsetX = (x - lastX) * (increment);
            var offsetY = (y - lastY) * (increment);
            var intX = (x - offsetX) * cellWidth + wx + 1;
            var intY = (y - offsetY) * cellWidth + wy + 1;

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

function drawAgents() {
    var canvas = document.getElementById('c3');
    var ctx = canvas.getContext('2d');
    for (var i = 0; i < agents.length; i += 1) {
        var agent = agents[i];
        var lastX = agent.lastPosition()[0];
        var lastY = agent.lastPosition()[1];
        var x = agent.getPosition()[0];
        var y = agent.getPosition()[1];
        var wx = agent.getWanderX();
        var wy = agent.getWanderY();
        var speed = agent.getSpeed();
        var increment = (speed - (counter - agent.getDelay()) % speed) / speed;
        var offsetX = (x - lastX) * (increment);
        var offsetY = (y - lastY) * (increment);
        var intX = (x - offsetX) * cellWidth + wx + cellWidth / 2;
        var intY = (y - offsetY) * cellWidth + wy + cellWidth / 2;


        var radius = (pieceWidth / 2);

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
//            ctx.fillStyle = "#0f0";
//            ctx.fillText(agent.getHealth(), intX, intY);
    }
}

function drawLevel() {
    var e = document.getElementById("level-display");
    e.innerHTML = currentLevelNumber.toString();
}
function drawScore() {
    var e = document.getElementById("score-display");
    e.innerHTML = score.toString();
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
    drawScore();
    drawWaves();
    drawSaved();
    drawDead();
    drawGoodness();
}

/* End Drawing Methods */


/* Game logic methods */
function processAgents() {

    // Delay, until we are ready for a new wave
    if (currentWaveIntervals < WAVE_INTERVAL_CYCLES) {
        currentWaveIntervals++;
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
            moveAgent(agent, true, false);
            agent.adjustSpeed();
            agent.adjustWander();
            if (!NO_DIE)
                agent.adjustHealth(MOVE_HEALTH_COST);
            if (agent.getHealth() <= 0) {
                nullifiedAgents.push(i);
                deadAgentCount++;
                drawDead();
            }
            else if (agent.getX() < 0 || agent.getX() >=  worldSize || agent.getY() < 0 || agent.getY() >= worldSize) {
                score += SURVIVAL_SCORE;
                savedAgentCount++;
                savedAgentThisWaveCount++;
                nullifiedAgents.push(i);
                drawScore();
                drawSaved();
            }
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
            currentWaveIntervals = 0;
        }
        else if (currentLevelNumber < LEVELS) {
            newLevel();
            currentWaveIntervals = 0;
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


function gameOver() {
    alert('Game over - press "Reset" to start again.');
    stopAgents();
    return;
}

function newWave() {
    var multiplier = (waves < 5 ? 4 : (waves < 10 ? 3 : (waves < 20 ? 2 : 1)));
    goodness += savedAgentThisWaveCount * multiplier; //WAVE_GOODNESS_BONUS;
    counter = 0;
    savedAgentThisWaveCount = 0;
    waves ++;
    /* Allow in game healing
    resetPatchYields();
    drawPatches();
    */
    agents = presetAgents(++numAgents, currentLevel.getInitialAgentX(), currentLevel.getInitialAgentY());
}

function newLevel() {
    currentLevelNumber++;
    patches = new Array();
    redoWorld();
    startAgents();
}


/* Set up code */

function initWorld() {
    tiles = new Array();
    // Keep active patches for now
//    activePatches = new Array();
    agents = new Array();
    cells = new Hash();

    score = 0;
    goodness = STARTING_GOODNESS;
    deadAgentCount = 0;
    savedAgentCount = 0;
    waves = 0;
    numAgents = 1;

    patchRecoveryCycle = Math.pow(DEFAULT_PATCH_RECOVERY, levelOfDifficulty - 1);


    currentLevel = eval("level" + currentLevelNumber.toString());

    worldSize = currentLevel.getWorldSize();
    cellWidth = 400 / worldSize;
    pieceWidth = cellWidth * 0.5;
    currentLevel.setupLevel();
}

function fillWithTiles() {
    for (var i = 0; i < worldSize; i++) {
        for (var j = 0; j < worldSize; j++) {
            tiles.push(new Tile("ddd", j, i));
        }
    }
}

function clearCanvas(canvasID) {
    var canvas = document.getElementById(canvasID);
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    ctx.clearRect(0, 0, w, h);
}


function redoWorld() {
    stopAgents();
    initWorld();
    clearCanvas('c2');
    clearCanvas('c3');

    drawGrid();
    drawTiles();
    resetPatchYields();
    drawPatches();
    drawScoreboard();

}

function resetWorld() {
    numAgents = checkInteger(document.getElementById("numAgentsInput").value);
    interval = checkInteger(1000 / document.getElementById("intervalInput").value);
    currentLevelNumber = checkInteger(document.getElementById("levelInput").value);
    var diffSelect = document.getElementById("difficultyInput");
    levelOfDifficulty = checkInteger(diffSelect[diffSelect.selectedIndex].value);
    redoWorld();
}

function fullResetWorld() {
    patches = new Array();
    resetWorld();
}


function checkInteger(value) {
    return Math.floor(value);
}

function startAgents() {
    clearInterval(agentTimerId);
    agentTimerId = setInterval("processAgents()", interval);
}

function stopAgents() {
    clearInterval(agentTimerId);
}

function resetSpeed() {
    interval = checkInteger(1000 / document.getElementById("intervalInput").value);
    startAgents();
}

/* Initial agent functions */

function randomAgents(number, limit) {
    var agents = new Array();
    for (var i = 0; i < number; i ++) {
        var agent = new Agent("basic", "888");
        var x = Math.floor(Math.random() * limit);
        var y = Math.floor(Math.random() * limit);
        agent.setPosition(x, y);
        agents.push(agent);
    }
    return agents;
}

function presetAgents(number, cellX, cellY) {
    var agents = new Array();
    for (var i = 0; i < number; i ++) {
        var agent = new Agent("basic", "000", cellX, cellY);
        var delay = parseInt(Math.random() * MOVE_INCREMENTS * 5);
        agent.setDelay(delay);
        agents.push(agent);
    }
    return agents;
}


