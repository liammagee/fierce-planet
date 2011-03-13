
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
var patches = new Array();
var cells = new Hash();
var counter = 0;
var counterLoops = 0;
var MOVE_INCREMENTS = 5;

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
    this._speed = MOVE_INCREMENTS;
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
Agent.prototype.getSpeed = function() { return this._speed; }
Agent.prototype.setSpeed = function(speed) { this._speed = speed; }
/* Change the speed, but sparingly as the speed moves away from the standard speed: MOVE_INCREMENTS */
Agent.prototype.adjustSpeed = function() {
    var tmpSpeed = 0;
    var variance = this._speed - MOVE_INCREMENTS;

    // Makes movement away from MOVE_INCREMENTS very unlikely
//    var prob = Math.pow(Math.abs(variance), Math.abs(variance));
    // Makes movement away from MOVE_INCREMENTS unlikely
//    var prob = Math.pow(Math.abs(variance), 2);
    // Makes movement away from MOVE_INCREMENTS moderately likely
//    var prob = Math.abs(variance);
    // Makes movement away from MOVE_INCREMENTS an even chance
    var prob = 1;

    var r = Math.floor(Math.random() * 2 * prob - 1);
    // Set the speed to above, equal or below the current speed
    var change = (r < 0 ? -1 : (r > 0 ? 1 : 0));
    // Change direction if the speed is already negative
    change = (variance < 0 ? -change : change);

    // Add a multiplier to the change
    var multiplier = Math.ceil(Math.random() * 3);
//    var multiplier = 1;

    this._speed = this._speed + change * multiplier;
}


/* Patch class definition */
function Patch(patchType, color) {
    this._patchType = patchType;
    this._color = color;
}
function Patch(patchType, color, x, y) {
    this._patchType = patchType;
    this._color = color;
    this.setPosition(x, y);
}
Patch.prototype.getType = function() { return this._patchType;}
Patch.prototype.getColor = function() { return this._color;}
Patch.prototype.getPosition = function() { return [this._x, this._y]; }
Patch.prototype.setPosition = function(x, y) { this._x =x; this._y = y; }
Patch.prototype.getX = function() { return this._x; }
Patch.prototype.setX = function(x) { this._x = x; }
Patch.prototype.getY = function() { return this._y; }
Patch.prototype.setY = function(y) { this._y = y; }



initWorld();

function initWorld() {
    cellWidth = 400 / worldSize;
    pieceWidth = cellWidth * 0.5;
    patches = new Array();
    cells = new Hash();
    setupWorld1();
    //agents = randomAgents(numAgents, worldSize);
}

function fillWithPatches() {
    var fixedPatches = new Array();
    for (var i = 0; i < worldSize; i++) {
        for (var j = 0; j < worldSize; j++) {
            patches.push(new Patch("landscape", "ddd", j, i));
        }
    }
    return fixedPatches;
}


/* Need somewhere to load a specific world */
function setupWorld1() {
    fillWithPatches();
    patches.splice(99, 10);
    patches.splice(97, 1);
    patches.splice(78, 9);
    patches.splice(67, 1);
    patches.splice(56, 9);
    patches.splice(53, 1);
    patches.splice(34, 9);
    patches.splice(23, 1);
    patches.splice(12, 10);
    for (var i = 0; i < patches.length; i++) {
        var p = patches[i];
        cells.set([p.getX(), p.getY()], p);
    }

    agents = presetAgents(numAgents, 0, 9);
}


function dropItem(e) {
    var canvas = document.getElementById('c1');
    var ctx = canvas.getContext('2d');
    var cellX = 0;
    var cellY = 0;


    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;


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

    var patchType = document.getElementById(e.dataTransfer.getData('Text')).id;
    var c = "0f0";
    if (patchType == 'eco') {
        c = "f00";
    }
    else if (patchType == 'env') {
        c = "0f0";
    }
    else if (patchType == 'soc') {
        c = "00f";
    }

    var patch = new Patch(patchType, c);
    patch.setPosition(cellX / cellWidth, cellY / cellWidth);
    patches.push(patch);
    cells.set([patch.getX(), patch.getY()], patch);

    drawPatch(patch);
}



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
        if (withNoRepeat == true && lastX == newX && lastY == newY) {
            continue;
        }
        if (cells.get([newX, newY]) == undefined) {
            return [newX, newY];
        }
    }
    // Allow for movement off-screen, if no other option is available
    if (x == worldSize - 1 || x == 0 || y == worldSize - 1 || y == 0) {
        if (x == worldSize - 1) {
            x = worldSize;
        }
        else if (x == 0) {
            x = -1;
        }
        else if (y == worldSize - 1) {
            y = worldSize;
        }
        else if (y == 0) {
            y = worldSize;
        }
    }

    return [x, y];
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
    for (var j = 0; j < patches.length; j+= 1) {
        var patch = patches[j];
        if (patch.getX() == newX && patch.getY() == newY)
            return true;
    }
    return isPatch;
}

/* End Move Strategies */


function drawPatches() {
    for (var i = 0; i < patches.length; i+= 1) {
        drawPatch(patches[i]);
    }
}

function drawPatch(p) {
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

function drawAgents() {
    counter++;
    var canvas = document.getElementById('c2');
    var ctx = canvas.getContext('2d');

    if (counter > 0) {
        for (var i = 0; i < agents.length; i+= 1) {
            var agent = agents[i];
            var lastX = agent.lastPosition()[0] * cellWidth + (cellWidth / 2);
            var lastY = agent.lastPosition()[1] * cellWidth + (cellWidth / 2);
            var x = agent.getPosition()[0] * cellWidth + (cellWidth / 2);
            var y = agent.getPosition()[1] * cellWidth + (cellWidth / 2);
            var speed = agent.getSpeed();
            var increment = (speed - (counter - 1 - agent.getDelay()) % speed) / speed;
            if (increment == 0)
                increment = 1;
            var offsetX = parseInt((x - lastX) * (increment));
            var offsetY = parseInt((y - lastY) * (increment));
            var intX = x - offsetX - (cellWidth / 2) + 1;
            var intY = y - offsetY - (cellWidth / 2) + 1;
            var radius = (pieceWidth / 2);

            ctx.clearRect(intX, intY, cellWidth - 2, cellWidth - 2);
        }
    }

    for (var i = 0; i < agents.length; i+= 1) {
        var agent = agents[i];
        var speed = agent.getSpeed();
        if (counter >= agent.getDelay() && (counter - agent.getDelay()) % speed == 0) {
            moveAgent(agent, true, false);
            agent.adjustSpeed();
        }
    }

//    if (counter % 5 == 0)
//        moveAgents(true, false);


    ctx.clearRect(100, 80, 200, 20);
    ctx.fillText(counter, 100, 100, 200);
    ctx.fillText(counterLoops, 200, 100, 200);
//    moveAgentsRandomly();

    //drawPatches();


    // Hook for detecting 'active' patches
    processNeighbouringPatches();

    for (var i = 0; i < agents.length; i+= 1) {
        var agent = agents[i];
        var lastX = agent.lastPosition()[0] * cellWidth + (cellWidth / 2);
        var lastY = agent.lastPosition()[1] * cellWidth + (cellWidth / 2);
        var x = agent.getPosition()[0] * cellWidth + (cellWidth / 2);
        var y = agent.getPosition()[1] * cellWidth + (cellWidth / 2);
        var speed = agent.getSpeed();
        var increment = (speed - (counter - agent.getDelay()) % speed) / speed;
        var offsetX = parseInt((x - lastX) * (increment));
        var offsetY = parseInt((y - lastY) * (increment));
        var intX = x - offsetX;
        var intY = y - offsetY;
        var radius = (pieceWidth / 2);

        ctx.beginPath();
        ctx.arc(intX, intY, radius, 0, Math.PI *2, false);
        ctx.closePath();
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
        ctx.fillStyle = "#" + agent.getColor();
        ctx.fill();
    }
}

// NOTE: very inefficient
function processNeighbouringPatches() {
    for (var i = 0; i < agents.length; i+= 1) {
        var agent = agents[i];
        var x = agent.getX();
        var y = agent.getY();
        for (var j = 0; j < patches.length; j++) {
            var p = patches[j];
            var px = p.getX();
            var py = p.getY();
            if (Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1 && p.getType() == 'env') {
                agent.setSpeed(10);
            }
        }
    }
}

function resetWorld() {
    stopAgents();
    numAgents = checkInteger(document.getElementById("numAgentsInput").value);
    worldSize = checkInteger(document.getElementById("worldSizeInput").value);
    interval = checkInteger(document.getElementById("intervalInput").value);


    initWorld();
    drawGrid();
    drawPatches();

    var canvas = document.getElementById('c2');
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    //startAgents();
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

function presetAgents(number, x, y) {
    var agents = new Array();
    for (var i = 0; i < number; i ++) {
        var agent = new Agent("basic", "888", x, y);
        var delay = parseInt(Math.random() * MOVE_INCREMENTS * 5);
        agent.setDelay(delay);
//        agent.setDelay(2);
        agents.push(agent);
    }
    return agents;
}
