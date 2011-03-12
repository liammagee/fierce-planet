
/**
 * Created by .
 * User: Liam
 * Date: 11/03/11
 * Time: 1:07 PM
 * To change this template use File | Settings | File Templates.
 */
var agentTimerId = 0;

var interval = 100;
var numAgents = 1;
var worldSize = 11;
var cellWidth = 400 / worldSize;
var pieceWidth = cellWidth * 0.5;
var agents;
var patches = new Array();
var cells = new Hash();

/* Agent class definition */
function Agent(agentType, color) {
    this._agentType = agentType;
    this._color = color;
    this._x = 0;
    this._y = 0;
    this._history = new Array();
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

function moveAgents(withNoRepeat, withNoCollision) {
    for (var i = 0; i < agents.length; i+= 1) {
        var agent = agents[i];
        var x = agent.getX();
        var y = agent.getY();
        var lastX = -1, lastY = -1;
        var p = agent.lastPosition();
        if (p != undefined) {
            lastX = p[0];
            lastY = p[1];
        }
        var position = findPosition(x, y, withNoRepeat, withNoCollision, lastX, lastY);
        if ((position[0] != x || position[1] != y) && (position[0] != lastX || position[1] != lastY))
            agent.setPosition(position[0], position[1]);
    }
}

function findPosition(x, y, withNoRepeat, withNoCollision, lastX, lastY) {
    var positionFound = false;
    var existingDirections = new Array();
    var directions = 4;
    var newX = x;
    var newY = y;
    for (var i = 0; i < directions; i++) {
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
        if (withNoRepeat == true && lastX == x && lastY == y) {
            continue;
        }
        if (cells.get([newX, newY]) == undefined) {
            return [newX, newY];
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


/* End Move Strategies */


function checkPatches(newX, newY) {
    var isPatch = false;
    for (var j = 0; j < patches.length; j+= 1) {
        var patch = patches[j];
        if (patch.getX() == newX && patch.getY() == newY)
            return true;
    }
    return isPatch;
}

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
    var canvas = document.getElementById('c1');
    var ctx = canvas.getContext('2d');


    var old_agents = agents;

    for (var i = 0; i < old_agents.length; i+= 1) {
        var ar = old_agents[i];

        var x = ar.getX() * cellWidth;
        var y = ar.getY() * cellWidth;
        ctx.clearRect(x + 2, y + 2, cellWidth - 2, cellWidth - 2);
    }

    //agents = randomAgents(10, 10);
    moveAgents(true, false);
//    moveAgentsRandomly();

    //drawPatches();

    for (var i = 0; i < agents.length; i+= 1) {
        var agent = agents[i];
        var x = agent.getPosition()[0] * cellWidth + (cellWidth / 2);
        var y = agent.getPosition()[1] * cellWidth + (cellWidth / 2);
        var radius = (pieceWidth / 2);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI *2, false);
        ctx.closePath();
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
        ctx.fillStyle = "#" + agent.getColor();
        ctx.fill();
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
        var agent = new Agent("basic", "888");
        agent.setPosition(x, y);
        agents.push(agent);
    }
    return agents;
}
