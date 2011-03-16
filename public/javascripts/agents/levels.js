
/* NB: Level is defined in agents.js */


/* Level 1 Definition */

var level1 = new Level(1);
level1.setInitialAgentX(0);
level1.setInitialAgentY(9);
level1.setGoalX(10);
level1.setGoalY(1);
level1.setWorldSize(11);
level1.setInitialAgentNumber(1);
level1.setWaveNumber(20);
level1.setExpiryLimit(20);

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


/* Level 2 Definition */

var level2 = new Level(2);
level2.setInitialAgentX(0);
level2.setInitialAgentY(0);
level2.setGoalX(11);
level2.setGoalY(1);
level2.setWorldSize(12);
level2.setInitialAgentNumber(1);
level2.setWaveNumber(20);
level2.setExpiryLimit(20);

level2.setupLevel = function() {
    fillWithTiles();
    agents = presetAgents(this.getInitialAgentNumber(), this.getInitialAgentX(), this.getInitialAgentY());

    tiles.splice(121, 10);
    tiles.splice(118, 1);
    tiles.splice(109, 1);
    tiles.splice(106, 1);
    tiles.splice(97, 8);
    tiles.splice(94, 1);
    tiles.splice(92, 1);
    tiles.splice(82, 1);
    tiles.splice(76, 5);
    tiles.splice(70, 1);
    tiles.splice(64, 1);
    tiles.splice(54, 5);
    tiles.splice(52, 1);
    tiles.splice(42, 1);
    tiles.splice(40, 1);
    tiles.splice(32, 3);
    tiles.splice(30, 1);
    tiles.splice(25, 4);
    tiles.splice(22, 2);
    tiles.splice(18, 3);
    tiles.splice(13, 1);
    tiles.splice(0, 2);

    for (var i = 0; i < tiles.length; i++) {
        var p = tiles[i];
        cells.set([p.getX(), p.getY()], p);
    }
};


/* Level 3 Definition */

var level3 = new Level(3);
level3.setInitialAgentX(5);
level3.setInitialAgentY(12);
level3.setGoalX(3);
level3.setGoalY(3);
level3.setWorldSize(13);
level3.setInitialAgentNumber(1);
level3.setWaveNumber(20);
level3.setExpiryLimit(20);

level3.setupLevel = function() {
    fillWithTiles();
    agents = presetAgents(this.getInitialAgentNumber(), this.getInitialAgentX(), this.getInitialAgentY());

    tiles.splice(161, 1);
    tiles.splice(150, 5);
    tiles.splice(148, 1);
    tiles.splice(144, 3);
    tiles.splice(141, 1);
    tiles.splice(137, 1);
    tiles.splice(135, 1);
    tiles.splice(133, 1);
    tiles.splice(131, 1);
    tiles.splice(126, 3);
    tiles.splice(124, 1);
    tiles.splice(122, 1);
    tiles.splice(120, 1);
    tiles.splice(118, 1);
    tiles.splice(113, 1);
    tiles.splice(111, 1);
    tiles.splice(109, 1);
    tiles.splice(107, 1);
    tiles.splice(105, 1);
    tiles.splice(100, 3);
    tiles.splice(96, 3);
    tiles.splice(94, 1);
    tiles.splice(92, 1);
    tiles.splice(89, 1);
    tiles.splice(81, 1);
    tiles.splice(79, 1);
    tiles.splice(68, 9);
    tiles.splice(66, 1);
    tiles.splice(53, 1);
    tiles.splice(42, 9);
    tiles.splice(40, 1);
    tiles.splice(37, 1);
    tiles.splice(27, 1);
    tiles.splice(14, 11);

    for (var i = 0; i < tiles.length; i++) {
        var p = tiles[i];
        cells.set([p.getX(), p.getY()], p);
    }

};


/* Level 4 Definition */

var level4 = new Level(1);
level4.setInitialAgentX(0);
level4.setInitialAgentY(0);
level4.setGoalX(6);
level4.setGoalY(6);
level4.setWorldSize(14);
level4.setInitialAgentNumber(1);
level4.setWaveNumber(20);
level4.setExpiryLimit(20);

level4.setupLevel = function() {
    fillWithTiles();
    agents = presetAgents(this.getInitialAgentNumber(), this.getInitialAgentX(), this.getInitialAgentY());

    tiles.splice(168, 13);
    tiles.splice(166, 1);
    tiles.splice(154, 1);
    tiles.splice(152, 1);
    tiles.splice(142, 9);
    tiles.splice(140, 1);
    tiles.splice(138, 1);
    tiles.splice(136, 1);
    tiles.splice(128, 1);
    tiles.splice(126, 1);
    tiles.splice(124, 1);
    tiles.splice(122, 1);
    tiles.splice(116, 5);
    tiles.splice(114, 1);
    tiles.splice(112, 1);
    tiles.splice(110, 1);
    tiles.splice(108, 1);
    tiles.splice(106, 1);
    tiles.splice(102, 1);
    tiles.splice(100, 1);
    tiles.splice(98, 1);
    tiles.splice(96, 1);
    tiles.splice(94, 1);
    tiles.splice(92, 1);
    tiles.splice(90, 1);
    tiles.splice(88, 1);
    tiles.splice(86, 1);
    tiles.splice(84, 1);
    tiles.splice(82, 1);
    tiles.splice(80, 1);
    tiles.splice(76, 3);
    tiles.splice(74, 1);
    tiles.splice(72, 1);
    tiles.splice(70, 1);
    tiles.splice(68, 1);
    tiles.splice(66, 1);
    tiles.splice(60, 1);
    tiles.splice(58, 1);
    tiles.splice(56, 1);
    tiles.splice(54, 1);
    tiles.splice(46, 7);
    tiles.splice(44, 1);
    tiles.splice(42, 1);
    tiles.splice(40, 1);
    tiles.splice(30, 1);
    tiles.splice(28, 1);
    tiles.splice(16, 11);
    tiles.splice(14, 1);
    tiles.splice(0, 1);

    for (var i = 0; i < tiles.length; i++) {
        var p = tiles[i];
        cells.set([p.getX(), p.getY()], p);
    }

};


/* Level 5 Definition */

var level5 = new Level(1);
level5.setInitialAgentX(0);
level5.setInitialAgentY(9);
level5.setGoalX(11);
level5.setGoalY(1);
level5.setWorldSize(11);
level5.setInitialAgentNumber(1);
level5.setWaveNumber(20);
level5.setExpiryLimit(20);

level5.setupLevel = function() {
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


/* Level 6 Definition */

var level6 = new Level(1);
level6.setInitialAgentX(0);
level6.setInitialAgentY(9);
level6.setGoalX(11);
level6.setGoalY(1);
level6.setWorldSize(11);
level6.setInitialAgentNumber(1);
level6.setWaveNumber(20);
level6.setExpiryLimit(20);

level6.setupLevel = function() {
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


/* Level 7 Definition */

var level7 = new Level(1);
level7.setInitialAgentX(0);
level7.setInitialAgentY(9);
level7.setGoalX(11);
level7.setGoalY(1);
level7.setWorldSize(11);
level7.setInitialAgentNumber(1);
level7.setWaveNumber(20);
level7.setExpiryLimit(20);

level7.setupLevel = function() {
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


/* Level 8 Definition */

var level8 = new Level(1);
level8.setInitialAgentX(0);
level8.setInitialAgentY(9);
level8.setGoalX(11);
level8.setGoalY(1);
level8.setWorldSize(11);
level8.setInitialAgentNumber(1);
level8.setWaveNumber(20);
level8.setExpiryLimit(20);

level8.setupLevel = function() {
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


/* Level 9 Definition */

var level9 = new Level(1);
level9.setInitialAgentX(0);
level9.setInitialAgentY(9);
level9.setGoalX(11);
level9.setGoalY(1);
level9.setWorldSize(11);
level9.setInitialAgentNumber(1);
level9.setWaveNumber(20);
level9.setExpiryLimit(20);

level9.setupLevel = function() {
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



/* Level 2 Definition */

var level10 = new Level(2);
level10.setInitialAgentX(0);
level10.setInitialAgentY(13);
level10.setGoalX(11);
level10.setGoalY(1);
level10.setWorldSize(20);
level10.setInitialAgentNumber(1);
level10.setWaveNumber(20);
level10.setExpiryLimit(10);

level10.setupLevel = function() {
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
