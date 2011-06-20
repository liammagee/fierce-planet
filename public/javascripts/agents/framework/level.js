
/* Level class definition */
function Level(id) {
    this._id = id;
    this._isPresetLevel = false;
    this._name = id;
    this._initialAgentNumber = 1;
    this._entryPoints = [];
    this._exitPoints = [];

    this._worldWidth = 11;
    this._worldHeight = 11;
    this._waveNumber = 10;
    this._expiryLimit = 20;
    this._initialResourceStore = 100;
    this._allowOffscreenCycling = false;
    this._allowResouresOnPath = false;
    this._notice = "";
    this._image = null;
    this._soundSrc = null;
    this._tiles = [];
    this._tileMap = [];
    this._mapOptions = null;
    this._mapURL = null;
    this._customLevel = false;
    this._levelAgents = [];
    this._waveAgents = [];
    this._currentAgents = [];
    this._currentAgentsMap = [];
    this._cells = [];
    this._resources = [];
}
Level.prototype.getId = function() { return this._id; };
Level.prototype.setId = function(id) { this._id = id; };
Level.prototype.isPresetLevel = function() { return this._isPresetLevel; };
Level.prototype.setPresetLevel = function(isPresetLevel) { this._isPresetLevel = isPresetLevel; };
Level.prototype.getName = function() { return this._name; };
Level.prototype.setName = function(name) { this._name = name; };
Level.prototype.getInitialAgentNumber = function() { return this._initialAgentNumber; };
Level.prototype.setInitialAgentNumber = function(initialAgentNumber) { this._initialAgentNumber = initialAgentNumber; };
Level.prototype.getEntryPoints = function() { return this._entryPoints; };
Level.prototype.setEntryPoints = function(entryPoints) { this._entryPoints = entryPoints; };
Level.prototype.addEntryPoint = function(x, y) {
    var found = false;
    for (var i = 0; i < this._entryPoints.length; i++) {
        var point = this._entryPoints[i];
        if (point[0] == x && point[1]== y) {
            found = true;
            break;
        }
    }
    if (!found)
        this._entryPoints.push([x, y]);
};
Level.prototype.resetEntryPoints = function() {
    this._entryPoints = [];
    this.addEntryPoint(0, 0);
};
Level.prototype.removeEntryPoint = function(x, y) {
    var position = -1;
    for (var i = 0; i < this._entryPoints.length; i++) {
        var point = this._entryPoints[i];
        if (point[0] == x && point[1] == y)
            position = i;
    }
    if (position > -1) {
        this._entryPoints.splice(position, 1);
    }
};
Level.prototype.getFirstEntryPoint = function() { this._entryPoints[0]; };
Level.prototype.getExitPoints = function() { return this._exitPoints; };
Level.prototype.setExitPoints = function(exitPoints) { this._exitPoints = exitPoints; };
Level.prototype.isExitPoint = function(x, y) {
    for (var i = 0; i < this._exitPoints.length; i++) {
        var point = this._exitPoints[i];
        if (point[0] == x && point[1]== y) {
            return true;
        }
    }
    return false;
};
Level.prototype.addExitPoint = function(x, y) {
    var found = false;
    for (var i = 0; i < this._exitPoints.length; i++) {
        var point = this._exitPoints[i];
        if (point[0] == x && point[1]== y) {
            found = true;
            break;
        }
    }
    if (!found)
        this._exitPoints.push([x, y]);
};
Level.prototype.resetExitPoints = function() {
    this._exitPoints = [];
};
Level.prototype.removeExitPoint = function(x, y) {
    var position = -1;
    for (var i = 0; i < this._exitPoints.length; i++) {
        var point = this._exitPoints[i];
        if (point[0] == x && point[1] == y)
            position = i;
    }
    if (position > -1) {
        this._exitPoints.splice(position, 1);
    }
};
Level.prototype.getInitialResourceStore = function() { return this._initialResourceStore; };
Level.prototype.setInitialResourceStore = function(initialResourceStore) { this._initialResourceStore = initialResourceStore; };
Level.prototype.getWorldWidth = function() { return this._worldWidth; };
Level.prototype.setWorldWidth = function(worldWidth) { this._worldWidth = worldWidth; };
Level.prototype.getWorldHeight = function() { return this._worldHeight; };
Level.prototype.setWorldHeight = function(worldHeight) { this._worldHeight = worldHeight; };
Level.prototype.getWaveNumber = function() { return this._waveNumber; };
Level.prototype.setWaveNumber = function(waveNumber) { this._waveNumber = waveNumber; };
Level.prototype.getExpiryLimit = function() { return this._expiryLimit; };
Level.prototype.setExpiryLimit = function(expiryLimit) { this._expiryLimit = expiryLimit; };
Level.prototype.getAllowOffscreenCycling = function() { return this._allowOffscreenCycling; };
Level.prototype.setAllowOffscreenCycling = function(allowOffscreenCycling) { this._allowOffscreenCycling = allowOffscreenCycling; };
Level.prototype.getAllowResourcesOnPath = function() { return this._allowResouresOnPath; };
Level.prototype.setAllowResourcesOnPath = function(allowResourcesOnPath) { this._allowResouresOnPath = allowResourcesOnPath; };
Level.prototype.getNotice = function() { return this._notice; };
Level.prototype.setNotice = function(notice) { this._notice = notice; };
Level.prototype.getImage = function() { return this._image; };
Level.prototype.setImage = function(imageSrc) { this._image = new Image();  this._image.src = imageSrc; };
Level.prototype.getSoundSrc = function() { return this._soundSrc; };
Level.prototype.setSoundSrc = function(soundSrc) { this._soundSrc = soundSrc; };
Level.prototype.getTile = function(x, y) {
    var tilePosition = y * this.getWorldWidth() + x;
    return this._tiles[tilePosition];
};
Level.prototype.getSurroundingTiles = function(x, y) {
    var surroundingTiles = [];

    if (x > 0)
        surroundingTiles.add(this.getTile(x - 1, y));
    if (x < this._worldWidth - 1)
        surroundingTiles.add(this.getTile(x + 1, y));
    if (y > 0)
        surroundingTiles.add(this.getTile(x, y - 1));
    if (y < this._worldHeight - 1)
        surroundingTiles.add(this.getTile(x, y + 1));

    return surroundingTiles;
};
Level.prototype.getTiles = function() { return this._tiles; };
Level.prototype.setTiles = function(tiles) {
    this._tiles = tiles;
    this.assignCells();
};
Level.prototype.addTile = function(tile) {
    this._tiles[tile._y * this._worldWidth + tile._x] = tile;
    this.removeEntryPoint(tile._x, tile._y);
    this.removeExitPoint(tile._x, tile._y);
    this.addCell(tile._x, tile._y, tile);
};
Level.prototype.removeTile = function(x, y) {
    var tilePosition = y * this.getWorldWidth() + x;
    this._tiles[tilePosition] = undefined;
    this.annulCell(x, y);
};
Level.prototype.removeAllTiles = function() {
    for (var i = 0; i < this.getWorldWidth(); i++) {
        for (var j = 0; j < this.getWorldHeight(); j++) {
            var tilePosition = j * this.getWorldWidth() + i;
            this._tiles[tilePosition] = undefined;
            this._cells[[i, j]] = undefined;
        }

    }
};
Level.prototype.getMapOptions = function() { return this._mapOptions; };
Level.prototype.setMapOptions = function(mapOptions) { this._mapOptions = mapOptions; };
Level.prototype.getMapURL = function() { return this._mapURL; };
Level.prototype.setMapURL = function(mapURL) { this._mapURL = mapURL; };
Level.prototype.isCustomLevel = function() { return this._customLevel; };
Level.prototype.setCustomLevel = function(customLevel) { this._customLevel = customLevel; };
Level.prototype.getLevelAgents = function() { return this._levelAgents; };
Level.prototype.setLevelAgents = function(levelAgents) { this._levelAgents = levelAgents; };
Level.prototype.addLevelAgent = function(agent) { this._levelAgents.push(agent); };
Level.prototype.getWaveAgents = function() { return this._waveAgents; };
Level.prototype.setWaveAgents = function(waveAgents) { this._waveAgents = waveAgents; };
Level.prototype.addWaveAgent = function(agent) { this._waveAgents.push(agent); };
Level.prototype.getCurrentAgents = function() { return this._currentAgents; };
Level.prototype.setCurrentAgents = function(currentAgents) {
    this._currentAgents = currentAgents;
    for (var agent in this._currentAgents) {
        this._currentAgentsMap[agent._id] = agent;
    }
};
Level.prototype.getAgentByID = function(agentID) { return this._currentAgentsMap[agentID]; };
Level.prototype.getResources = function() { return this._resources; };
Level.prototype.setResources = function(resources) { this._resources = resources; };
Level.prototype.getCells = function() { return this._cells; };
Level.prototype.getCell = function(x, y) { return this._cells[[x, y]]; };
Level.prototype.setCells = function(cells) { this._cells = cells; };
Level.prototype.addCell = function(x, y, value) { this._cells[[x, y]] = value; };
Level.prototype.annulCell = function(x, y) { this._cells[[x, y]] = undefined; };
Level.prototype.assignCells = function() {
    for (var i = 0; i < this._tiles.length; i++) {
        var tile = this._tiles[i];
        if (tile != undefined)
            this.addCell(tile._x, tile._y, tile);
    }
};
Level.prototype.generateWaveAgents = function(numAgents) {
    var newAgents = [];
    for (var j = 0; j < numAgents; j++) {
        for (var i = 0; i < this._waveAgents.length; i++) {
            var waveAgent = this._waveAgents[i];
            newAgents.push(new Agent(waveAgent.getType(), waveAgent.getX(), waveAgent.getY()));
        }
    }
    return newAgents;
};
Level.prototype.getPath = function() {
    var pathCells = [];
    for (var i = 0; i < this._worldHeight; i++) {
        for (var j = 0; j < this._worldWidth; j++) {
            var tilePosition = i * this._worldWidth + j;
            if (this._tiles[tilePosition] == undefined)
                pathCells.push([j, i]);
        }

    }
    return pathCells;
};
Level.prototype.fillWithTiles = function() {
    this._tiles = [];
    for (var i = 0; i < this._worldHeight; i++) {
        for (var j = 0; j < this._worldWidth; j++) {
            var tile = new Tile(DEFAULT_TILE_COLOR, j, i);
            this._tiles.push(tile);
            this.addCell(tile._x, tile._y, tile);
        }
    }
};
Level.prototype.clearTiles = function(start, number) {
    for (var i = start; i < start + number; i++) {
        if (i >= 0 && i < this._tiles.length) {
            var tile = this._tiles[i];
            this._tiles[i] = undefined;
            this.annulCell(tile._x, tile._y);
        }
    }
};
Level.prototype.presetAgents = function(agentType, number, canCommunicateWithOtherAgents) {
    var agents = [];
    for (var j = 0; j < this._entryPoints.length; j++) {
        var point = this._entryPoints[j];
        var x = point[0];
        var y = point[1];
        for (var i = 0; i < number; i ++) {
            var agent = new Agent(agentType, x, y);
            var colorSeed = j % 3;
            var colorScheme = (colorSeed == 0 ? "000" : (colorSeed == 1 ? "0f0" : "00f"));
            agent.setColor(colorScheme);
            var delay = parseInt(Math.random() * MOVE_INCREMENTS * 5);
            agent.setDelay(delay);
            agent.setCanCommunicateWithOtherAgents(canCommunicateWithOtherAgents);
            agents.push(agent);
        }
    }
    $.merge(agents, this.generateWaveAgents());
    $.merge(agents, this.getLevelAgents());

    this.setCurrentAgents(agents);
};
Level.prototype.setup = function() {};