
/**
 * Created by .
 * User: Liam
 * Date: 11/03/11
 * Time: 1:07 PM
 * To change this template use File | Settings | File Templates.
 */
var agentTimerId = 0;

var interval = 20;
var numAgents = 5;
var worldSize = 11;
var cellWidth = 400 / worldSize;
var pieceWidth = cellWidth * 0.5;
var agents;
var tiles = new Array();
var patches = new Array();
var cells = new Hash();
var counter = 0;
var counterLoops = 0;
var MOVE_INCREMENTS = 5;
var INITIAL_HEALTH = 100;
var MOVE_HEALTH_COST = -5;
var SURVIVAL_SCORE = 10;
var STARTING_GOODNESS = 100;
var PATCH_GOODNESS = 10;
var WAVE_GOODNESS_BONUS = 5;

var maxWaves = 30;

var score = 0;
var goodness = 0;
var waves = 1;
var deadAgentCount = 0;
var savedAgentCount = 0;
var savedAgentThisWaveCount = 0;

var initialAgentX = 0;
var initialAgentY = 0;


/* Class definitions */

/* Agent class definition */
function Agent(agentType, color, x, y) {
    this._agentType = agentType;
    this._color = color;
    this._x = x;
    this._y = y;
    this._history = new Array();
    var tmpX = -1, tmpY = -1;
    if (x == 0 || x == worldSize - 1 || y == 0 || x == worldSize - 1) {
        var tmpX = x, tmpY = y;
        if (x == 0)
            tmpX = -1;
        else if (x == worldSize - 1)
            tmpX = worldSize;
        else if (y == 0)
            tmpY = -1;
        else if (x == worldSize - 1)
            tmpY = worldSize;
        this._history.push([tmpX, tmpY])
    }
    this._delay = 0;
    this._wanderX = 0;
    this._wanderY = 0;
    this._speed = MOVE_INCREMENTS;
    this._health = INITIAL_HEALTH;
}
Agent.prototype.getPosition = function() { return [this._x, this._y]; }
Agent.prototype.setPosition = function(x, y) { this._history.push([this._x, this._y]); this._x =x; this._y = y; }
Agent.prototype.lastPosition = function() { return this._history[this._history.length - 1]; }
Agent.prototype.getX = function() { return this._x; }
Agent.prototype.setX = function(x) { this._x = x; }
Agent.prototype.getY = function() { return this._y; }
Agent.prototype.setY = function(y) { this._y = y; }
Agent.prototype.getType = function() { return this._agentType;}
Agent.prototype.getColor = function() { return this._color;}
Agent.prototype.getDelay = function() { return this._delay; }
Agent.prototype.setDelay = function(delay) { this._delay = delay; }
Agent.prototype.getHealth = function() { return this._health; }
Agent.prototype.setHealth = function(health) { this._health = health; }
Agent.prototype.adjustHealth = function(adjustment) {
    var newHealth = this._health + adjustment;
    if (newHealth > 0)
        this._health = newHealth;
    else
        this._health = 0;
}
Agent.prototype.getWanderX = function() { return this._wanderX; }
Agent.prototype.getWanderY = function() { return this._wanderY; }
Agent.prototype.adjustWander = function() {
    var wx = this._wanderX;
    var wy = this._wanderY;
    var limit = cellWidth / 2 - pieceWidth / 2;
    var rx = Math.floor(Math.random() * 3 - 1);
    var ry = Math.floor(Math.random() * 3 - 1);
    wx = wx + rx;
    wy = wy + ry;

    if (limit - Math.abs(wx) > 0)
        this._wanderX = wx;

    if (limit - Math.abs(wy) > 0)
        this._wanderY = wy;
}
Agent.prototype.getSpeed = function() { return this._speed; }
Agent.prototype.setSpeed = function(speed) { this._speed = speed; }
/* Change the speed, but sparingly as the speed moves away from the standard speed: MOVE_INCREMENTS */
Agent.prototype.adjustSpeed = function() {
    var tmpSpeed = this._speed;
    var variance = this._speed - MOVE_INCREMENTS;

    // Makes movement away from MOVE_INCREMENTS very unlikely
//    var prob = Math.pow(Math.abs(variance), Math.abs(variance));
    // Makes movement away from MOVE_INCREMENTS unlikely
//    var prob = Math.pow(Math.abs(variance), 2);
    // Makes movement away from MOVE_INCREMENTS moderately likely
    var prob = Math.abs(variance);
    // Makes movement away from MOVE_INCREMENTS an even chance
//    var prob = 1;

    var r = Math.floor(Math.random() * 3 * prob - 1);
    // Set the speed to above, equal or below the current speed
    var change = (r < 0 ? -1 : (r > 0 ? 1 : 0));
    // Change direction if the speed is already negative
    change = (variance > 0 ? -change : change);

    // Add a multiplier to the change
//    var multiplier = Math.ceil(Math.random() * 3);
    var multiplier = 1;

    var s = this._speed;

    tmpSpeed = this._speed + change * multiplier;

    if (tmpSpeed > 0)
        this._speed = tmpSpeed;
}


/* Patch class definition */
function Patch(patchType, color) {
    this._patchType = patchType;
    this._color = color;
    this._initialTotalYield = 0;
    this._totalYield = 0;
    this._perAgentYield = 0;
}
function Patch(patchType, color, x, y) {
    this._patchType = patchType;
    this._color = color;
    this.setPosition(x, y);
    this._initialTotalYield = 0;
    this._totalYield = 0;
    this._perAgentYield = 0;
}
Patch.prototype.getType = function() { return this._patchType;}
Patch.prototype.getColor = function() { return this._color;}
Patch.prototype.getPosition = function() { return [this._x, this._y]; }
Patch.prototype.setPosition = function(x, y) { this._x =x; this._y = y; }
Patch.prototype.getX = function() { return this._x; }
Patch.prototype.setX = function(x) { this._x = x; }
Patch.prototype.getY = function() { return this._y; }
Patch.prototype.setY = function(y) { this._y = y; }
Patch.prototype.getInitialTotalYield = function() { return this._initialTotalYield; }
Patch.prototype.setInitialTotalYield = function(initialTotalYield) { this._initialTotalYield = initialTotalYield; this._totalYield = initialTotalYield; }
Patch.prototype.getTotalYield = function() { return this._totalYield; }
Patch.prototype.setTotalYield = function(totalYield) { this._totalYield = totalYield; }
Patch.prototype.getPerAgentYield = function() { return this._perAgentYield; }
Patch.prototype.setPerAgentYield = function(perAgentYield) { this._perAgentYield = perAgentYield; }
Patch.prototype.provideYield = function(agent) {
    if (this._totalYield > this._perAgentYield) {
        agent.adjustHealth(this._perAgentYield);
        agent.setSpeed(this._perAgentYield);
        this._totalYield -= this._perAgentYield;
    }
}


/* Tile class definition */
function Tile(color) {
    this._color = color;
}
function Tile(color, x, y) {
    this._color = color;
    this.setPosition(x, y);
}
Tile.prototype.getColor = function() { return this._color;}
Tile.prototype.getPosition = function() { return [this._x, this._y]; }
Tile.prototype.setPosition = function(x, y) { this._x =x; this._y = y; }
Tile.prototype.getX = function() { return this._x; }
Tile.prototype.setX = function(x) { this._x = x; }
Tile.prototype.getY = function() { return this._y; }
Tile.prototype.setY = function(y) { this._y = y; }



// Initialise the world
initWorld();


/* UI functions */

function dropItem(e) {
    if (goodness < PATCH_GOODNESS) {
        alert('Not enough goodness for now - save some more agents!');
        return;
    }
    var canvas = document.getElementById('c2');
    var ctx = canvas.getContext('2d');
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
    for (var i = 0; i < w; i+= cellWidth) {
        if (x > i && x < i + cellWidth) {
            cellX = i;
            break;
        }
    }
    for (var j = 0; j < h; j+= cellWidth) {
        if (y > j && y < j + cellWidth) {
            cellY = j;
            break;
        }
    }

    // Check if this patch can be dropped on a tile
    var posX = Math.floor(cellX / cellWidth);
    var posY = Math.floor(cellY / cellWidth);
    if (cells.get([posX, posY]) == undefined)
        return;

    var patchType = document.getElementById(e.dataTransfer.getData('Text')).id;
    var c = "0f0";
    var totalYield = 0, perAgentYield = 0;
    if (patchType == 'eco') {
        c = "f00";
        totalYield = 100;
        perAgentYield = 20;
        goodness -= PATCH_GOODNESS;
    }
    else if (patchType == 'env') {
        c = "0f0";
        totalYield = 100;
        perAgentYield = 10;
        goodness -= PATCH_GOODNESS;
    }
    else if (patchType == 'soc') {
        c = "00f";
        totalYield = 100;
        perAgentYield = 5;
        goodness -= PATCH_GOODNESS;
    }

    var patch = new Patch(patchType, c, posX, posY);
    patch.setInitialTotalYield(totalYield);
    patch.setPerAgentYield(perAgentYield);
    patches.push(patch);

    drawPatch(patch);
    drawGoodness();
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
    var position = findPosition(x, y, withNoRepeat, withNoCollision, lastX, lastY);
    if ((position[0] != x || position[1] != y) && (position[0] != lastX || position[1] != lastY))
        agent.setPosition(position[0], position[1]);
}

function moveAgents(withNoRepeat, withNoCollision) {
    for (var i = 0; i < agents.length; i+= 1) {
        var agent = agents[i];
        moveAgent(agent, withNoRepeat, withNoCollision);
    }
}

function findPosition(x, y, withNoRepeat, withNoCollision, lastX, lastY) {
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
        var offScreen2 = worldSize - 1;
        var offset = 1;
        switch (dir) {
            case 0:
                (newX == offScreen1) ? newX = offScreen2 : newX = newX - offset;
                break;
            case 1:
                (newX == offScreen2) ? newX = offScreen1 : newX = newX + offset;
                break;
            case 2:
                (newY == offScreen1) ? newY = offScreen2 : newY = newY - offset;
                break;
            case 3:
                (newY == offScreen2) ? newY = offScreen1 : newY = newY + offset;
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
    ctx.clearRect(x + 1, y + 1, cellWidth - 1, cellWidth - 1);
    ctx.fillStyle = "#" + p.getColor();
    ctx.fillRect(x, y, cellWidth, cellWidth);
    ctx.strokeStyle = "#ccc";
    ctx.strokeRect(x, y, cellWidth, cellWidth);
}



function drawAgents() {
    counter++;
    var canvas = document.getElementById('c3');
    var ctx = canvas.getContext('2d');

    if (counter > 0) {
        for (var i = 0; i < agents.length; i+= 1) {
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

    var nullifiedAgents = new Array();
    for (var i = 0; i < agents.length; i+= 1) {
        var agent = agents[i];
        var speed = agent.getSpeed();
        if (counter >= agent.getDelay() && (counter - agent.getDelay()) % speed == 0) {
            moveAgent(agent, true, false);
            agent.adjustSpeed();
            agent.adjustWander();
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

    if (deadAgentCount >= maxWaves) {
        return gameOver();
    }

    // Check whether we have too many
    for (var i = nullifiedAgents.length - 1; i >= 0; i-= 1) {
        agents.splice(nullifiedAgents[i], 1);
    }
    // No agents left? End of wave
    if (agents.length == 0) {
        // Start a new wave
        if (waves <= maxWaves) {
            newWave();
            drawScoreboard();
        }
        else {
            return gameOver();
        }
    }
    else {
        for (var i = 0; i < agents.length; i+= 1) {
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
            ctx.arc(intX, intY, radius, 0, Math.PI *2, false);
            ctx.closePath();
            ctx.strokeStyle = "#ccc";
            ctx.stroke();
            var health = agent.getHealth();
            var hOffset = Math.floor(health / 10);
            hOffset = (hOffset > 10 ? 10 : hOffset);
            var c = agent.getColor().toString();
            var r = parseInt(c.slice(0, 1), 16);
            var g = parseInt(c.slice(1, 2), 16);
            var b = parseInt(c.slice(2, 3), 16);
            var newColor = (r - hOffset).toString(16) + (g - hOffset).toString(16) + (b - hOffset).toString(16);
            ctx.fillStyle = "#" + newColor;
            ctx.fill();
            ctx.fillStyle = "#0f0";
            ctx.fillText(agent.getHealth(), intX, intY);
        }
    }
}

function drawScore() {
    var e = document.getElementById("score-display");
    e.innerText = score.toString();
}

function drawGoodness() {
    var e = document.getElementById("goodness-display");
    e.innerText = goodness.toString();
}
function drawDead() {
    var e = document.getElementById("dead-display");
    e.innerText = deadAgentCount.toString();
}
function drawSaved() {
    var e = document.getElementById("saved-display");
    e.innerText = savedAgentCount.toString();
}

function drawWaves() {
    var e = document.getElementById("waves-display");
    e.innerText = waves.toString() + " out of " + maxWaves;
}

function drawScoreboard() {
    drawWaves();
    drawSaved();
    drawDead();
    drawScore();
    drawGoodness();
}
/* End Drawing Methods */


// NOTE: very inefficient
function processNeighbouringPatches(agent) {
    var x = agent.getX();
    var y = agent.getY();
    for (var j = 0; j < patches.length; j++) {
        var p = patches[j];
        var px = p.getX();
        var py = p.getY();
        if (Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1) {
            p.provideYield(agent);
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
    resetPatchYields();
    agents = presetAgents(++numAgents, initialAgentX, initialAgentY);
}


/* Set up code */

function initWorld() {
    cellWidth = 400 / worldSize;
    pieceWidth = cellWidth * 0.5;
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

    setupWorld1();
    //agents = randomAgents(numAgents, worldSize);
}

function fillWithTiles() {
    for (var i = 0; i < worldSize; i++) {
        for (var j = 0; j < worldSize; j++) {
            tiles.push(new Tile("ddd", j, i));
        }
    }
}


/* Need somewhere to load a specific world */
function setupWorld1() {
    fillWithTiles();
    tiles.splice(99, 10);
    tiles.splice(97, 1);
    tiles.splice(78, 9);
    tiles.splice(67, 1);
    tiles.splice(56, 9);
    tiles.splice(53, 1);
    tiles.splice(34, 9);
    tiles.splice(23, 1);
    tiles.splice(12, 10);
    for (var i = 0; i < tiles.length; i++) {
        var p = tiles[i];
        cells.set([p.getX(), p.getY()], p);
    }

    initialAgentX = 0;
    initialAgentY = 9;
    agents = presetAgents(numAgents, initialAgentX, initialAgentY);
}


function resetWorld() {
    stopAgents();
    numAgents = checkInteger(document.getElementById("numAgentsInput").value);
    worldSize = checkInteger(document.getElementById("worldSizeInput").value);
    interval = checkInteger(document.getElementById("intervalInput").value);


    initWorld();
    drawGrid();
    drawTiles();
    resetPatchYields();
    drawPatches();
    drawScoreboard();

    var canvas = document.getElementById('c3');
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    //startAgents();
}
function fullResetWorld() {
    resetWorld();
    
    patches = new Array();
    var canvas = document.getElementById('c2');
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    ctx.clearRect(0, 0, w, h);
}


function checkInteger(value) {
    return value;
}

function startAgents() {
    agentTimerId = setInterval("drawAgents()", interval);
}

function stopAgents() {
    clearInterval(agentTimerId);
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
        var agent = new Agent("basic", "ccc", cellX, cellY);
        var delay = parseInt(Math.random() * MOVE_INCREMENTS * 5);
        agent.setDelay(delay);
        agents.push(agent);
    }
    return agents;
}
