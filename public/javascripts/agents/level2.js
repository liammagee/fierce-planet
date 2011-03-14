
/* NB: Level is defined in agents.js */
var level2 = new Level(2);
level2.setInitialAgentX(0);
level2.setInitialAgentY(13);
level2.setWorldSize(20);
level2.setInitialAgentNumber(1);
level2.setWaveNumber(20);
level2.setExpiryLimit(10);

level2.setupLevel = function() {
    fillWithTiles();
    agents = presetAgents(this.getInitialAgentNumber(), this.getInitialAgentX(), this.getInitialAgentY());

    tiles.splice(274, 6);
    tiles.splice(260, 6);
    tiles.splice(254, 1);
    tiles.splice(245, 1);
    tiles.splice(234, 1);
    tiles.splice(225, 1);
    tiles.splice(214, 1);
    tiles.splice(205, 1);
    tiles.splice(194, 1);
    tiles.splice(185, 1);
    tiles.splice(174, 1);
    tiles.splice(165, 1);
    tiles.splice(145, 10);

    for (var i = 0; i < tiles.length; i++) {
        var p = tiles[i];
        cells.set([p.getX(), p.getY()], p);
    }

};

