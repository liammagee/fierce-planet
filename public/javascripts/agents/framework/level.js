
/* Level class definition */
function Level(id) {
    this._id = id;
    this._name = name;
    this._initialAgentNumber = 1;
    this._initialAgentX = 0;
    this._initialAgentY = 0;
    this._entryPoints = new Array();
    this._exitPoints = new Array();
//    this._initialPoints.push([this._initialAgentX, this._initialAgentY]);

    this._worldSize = 11;
    this._worldWidth = 11;
    this._worldHeight = 11;
    this._waveNumber = 10;
    this._expiryLimit = 20;
    this._goalX = 0;
    this._goalY = 0;
    this._initialResourceStore = 100;
    this._allowOffscreenCycling = false;
    this._allowResouresOnPath = false;
    this._notice = "";
    this._image;
    this._soundSrc;
    this._tiles = new Array();
    this._tileMap = new Array();
    this._mapOptions;
    this._mapURL;
    this._customLevel = false;
    this._levelAgents = new Array();
    this._waveAgents = new Array();
    this._currentAgents = new Array();
    this._cells = new Array();
    this._resources = new Array();
}
Level.prototype.getId = function() { return this._id; }
Level.prototype.setId = function(id) { this._id = id; }
Level.prototype.getName = function() { return this._name; }
Level.prototype.setName = function(name) { this._name = name; }
Level.prototype.getInitialAgentNumber = function() { return this._initialAgentNumber; }
Level.prototype.setInitialAgentNumber = function(initialAgentNumber) { this._initialAgentNumber = initialAgentNumber; }
Level.prototype.getInitialAgentX = function() { return this._initialAgentX; }
Level.prototype.setInitialAgentX = function(initialAgentX) { this._initialAgentX = initialAgentX; }
Level.prototype.getInitialAgentY = function() { return this._initialAgentY; }
Level.prototype.setInitialAgentY = function(initialAgentY) { this._initialAgentY = initialAgentY; }
Level.prototype.getEntryPoints = function() { return this._entryPoints; }
Level.prototype.setEntryPoints = function(entryPoints) { this._entryPoints = entryPoints; }
Level.prototype.addEntryPoint = function(x, y) {
    if (this._entryPoints.length == 0) {
        this.setInitialAgentX(x);
        this.setInitialAgentY(y);
    }
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
}
Level.prototype.resetEntryPoints = function() {
    this._entryPoints = new Array();
    this.addEntryPoint(0, 0);
}
Level.prototype.removeInitialPoint = function(x, y) {
    var position = -1;
    for (var i = 0; i < this._entryPoints.length; i++) {
        var point = this._entryPoints[i];
        if (point[0] == x && point[1] == y)
            position == i;
    }
    if (position > -1) {
        this._entryPoints.splice(position, 1);
    }
}
Level.prototype.getFirstInitialPoint = function() { this._entryPoints[0]; }
Level.prototype.getInitialResourceStore = function() { return this._initialResourceStore; }
Level.prototype.setInitialResourceStore = function(initialResourceStore) { this._initialResourceStore = initialResourceStore; }
Level.prototype.getWorldWidth = function() { return this._worldWidth; }
Level.prototype.setWorldWidth = function(worldWidth) { this._worldWidth = worldWidth; }
Level.prototype.getWorldHeight = function() { return this._worldHeight; }
Level.prototype.setWorldHeight = function(worldHeight) { this._worldHeight = worldHeight; }
Level.prototype.getWaveNumber = function() { return this._waveNumber; }
Level.prototype.setWaveNumber = function(waveNumber) { this._waveNumber = waveNumber; }
Level.prototype.getExpiryLimit = function() { return this._expiryLimit; }
Level.prototype.setExpiryLimit = function(expiryLimit) { this._expiryLimit = expiryLimit; }
Level.prototype.getGoalX = function() { return this._goalX; }
Level.prototype.setGoalX = function(goalX) { this._goalX = goalX; }
Level.prototype.getGoalY = function() { return this._goalY; }
Level.prototype.setGoalY = function(goalY) { this._goalY = goalY; }
Level.prototype.getExitPoints = function() { return this._exitPoints; }
Level.prototype.setExitPoints = function(exitPoints) { this._exitPoints = exitPoints; }
Level.prototype.getAllowOffscreenCycling = function() { return this._allowOffscreenCycling; }
Level.prototype.setAllowOffscreenCycling = function(allowOffscreenCycling) { this._allowOffscreenCycling = allowOffscreenCycling; }
Level.prototype.getAllowResourcesOnPath = function() { return this._allowResouresOnPath; }
Level.prototype.setAllowResourcesOnPath = function(allowResourcesOnPath) { this._allowResouresOnPath = allowResourcesOnPath; }
Level.prototype.getNotice = function() { return this._notice; }
Level.prototype.setNotice = function(notice) { this._notice = notice; }
Level.prototype.getImage = function() { return this._image; }
Level.prototype.setImage = function(imageSrc) { this._image = new Image();  this._image.src = imageSrc; }
Level.prototype.getSoundSrc = function() { return this._soundSrc; }
Level.prototype.setSoundSrc = function(soundSrc) { this._soundSrc = soundSrc; }
Level.prototype.getTile = function(x, y) {
    var tilePosition = y * this.getWorldWidth() + x;
    return this._tiles[tilePosition];
}
Level.prototype.getSurroundingTiles = function(x, y) {
    var surroundingTiles = new Array();

    if (x > 0)
        surroundingTiles.add(this.getTile(x - 1, y));
    if (x < this._worldWidth - 1)
        surroundingTiles.add(this.getTile(x + 1, y));
    if (y > 0)
        surroundingTiles.add(this.getTile(x, y - 1));
    if (y < this._worldHeight - 1)
        surroundingTiles.add(this.getTile(x, y + 1));

    return surroundingTiles;
}
Level.prototype.getTiles = function() { return this._tiles; }
Level.prototype.setTiles = function(tiles) { this._tiles = tiles; }
Level.prototype.addTile = function(tile) {
    this._tiles[tile._y * this._worldWidth + tile._x] = tile;
    this.addCell(tile._x, tile._y, tile);
}
Level.prototype.removeTile = function(x, y) {
    var tilePosition = y * this.getWorldWidth() + x;
    this._tiles[tilePosition] = undefined;
    this.annulCell(x, y);
}
Level.prototype.getMapOptions = function() { return this._mapOptions; }
Level.prototype.setMapOptions = function(mapOptions) { this._mapOptions = mapOptions; }
Level.prototype.getMapURL = function() { return this._mapURL; }
Level.prototype.setMapURL = function(mapURL) { this._mapURL = mapURL; }
Level.prototype.isCustomLevel = function() { return this._customLevel; }
Level.prototype.setCustomLevel = function(customLevel) { this._customLevel = customLevel; }
Level.prototype.getLevelAgents = function() { return this._levelAgents; }
Level.prototype.setLevelAgents = function(levelAgents) { this._levelAgents = levelAgents; }
Level.prototype.addLevelAgent = function(agent) { this._levelAgents.push(agent); }
Level.prototype.getWaveAgents = function() { return this._waveAgents; }
Level.prototype.setWaveAgents = function(waveAgents) { this._waveAgents = waveAgents; }
Level.prototype.addWaveAgent = function(agent) { this._waveAgents.push(agent); }
Level.prototype.getCurrentAgents = function() { return this._currentAgents; }
Level.prototype.setCurrentAgents = function(currentAgents) { this._currentAgents = currentAgents; }
Level.prototype.getResources = function() { return this._resources; }
Level.prototype.setResources = function(resources) { this._resources = resources; }
Level.prototype.getCells = function() { return this._cells; }
Level.prototype.getCell = function(x, y) { return this._cells[[x, y]]; }
Level.prototype.setCells = function(cells) { this._cells = cells; }
Level.prototype.addCell = function(x, y, value) { this._cells[[x, y]] = value; }
Level.prototype.annulCell = function(x, y) { this._cells[[x, y]] = undefined; }
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
            newAgents.push(new Agent(this, waveAgent.getType(), waveAgent.getX(), waveAgent.getY()));
        }
    }
    return newAgents;
}
Level.prototype.getPath = function() {
    var pathCells = new Array();
    for (var i = 0; i < this._worldHeight; i++) {
        for (var j = 0; j < this._worldWidth; j++) {
            var tilePosition = i * this._worldWidth + j;
            if (this._tiles[tilePosition] == undefined)
                pathCells.push([j, i]);
            /*
            var found  = false;
            for (var k = 0; k < this._tiles.length; k++) {
                var tile = this._tiles[k];
                if (tile._x == i && tile._y == j) {
                    found = true;
                    break;
                }
            }
            if (!found)
                pathCells.push([i, j]);
                */
        }

    }
    return pathCells;
}
