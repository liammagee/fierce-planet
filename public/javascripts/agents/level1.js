
/* NB: Level is defined in agents.js */
var level1 = new Level(1);
level1.setInitialAgentX(0);
level1.setInitialAgentY(9);
level1.setWorldSize(11);
level1.setInitialAgentNumber(1);
level1.setWaveNumber(10);
level1.setExpiryLimit(40);

level1.setupLevel = function() {
    fillWithTiles();
    agents = presetAgents(this.getInitialAgentNumber(), this.getInitialAgentX(), this.getInitialAgentY());

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

};

