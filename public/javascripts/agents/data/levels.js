
/* NB: Level is defined in classes.js */

var MAX_DEFAULT_LEVELS = 11;


/* Level setup methods - this should be moved to the Level class when refactored. */

function fillWithTiles() {
    var tiles = new Array();
    for (var i = 0; i < currentLevel.getWorldHeight(); i++) {
        for (var j = 0; j < currentLevel.getWorldWidth(); j++) {
            tiles.push(new Tile(TILE_COLOR, j, i));
        }
    }
    return tiles;
};
function clearTiles(tiles, start, number) {
    for (var i = start; i < start + number; i++) {
        tiles[i] = undefined;
    }
};
function randomAgents(number, limit) {
    var agents = new Array();
    for (var i = 0; i < number; i ++) {
        var x = Math.floor(Math.random() * limit);
        var y = Math.floor(Math.random() * limit);
        var agent = new Agent(currentLevel, CITIZEN_AGENT_TYPE, x, y);
        agents.push(agent);
    }
    return agents;
};

function presetAgents(number, points) {
    var agents = new Array();
    for (var j = 0; j < points.length; j++) {
        var point = points[j];
        var x = point[0];
        var y = point[1];
        for (var i = 0; i < number; i ++) {
            var agent = new Agent(currentLevel, CITIZEN_AGENT_TYPE, x, y);
            var delay = parseInt(Math.random() * MOVE_INCREMENTS * 5);
            agent.setDelay(delay);
            agents.push(agent);
        }
    }
    currentLevel.setCurrentAgents(agents);
};

function preSetupLevel(level) {
    if (level.getTiles() == undefined) 
        level.setTiles(fillWithTiles());

    presetAgents(level.getInitialAgentNumber(), level.getEntryPoints());

    // Add generated agents
    $.merge(currentLevel.getCurrentAgents(), level.generateWaveAgents());
    $.merge(currentLevel.getCurrentAgents(), level.getLevelAgents());
};
function postSetupLevel(level) {
    level.assignCells();
};
/*
Level.prototype.preSetupLevel = new function() {
    fillWithTiles();
    presetAgents(this.getInitialAgentNumber(), level.getEntryPoints());
};
Level.prototype.postSetupLevel = new function() {
    assignCells();
};
*/


/* Level 0 Definition */

var level0 = new Level(1);
level0.addEntryPoint(0, 0);
level0.setGoalX(4);
level0.setGoalY(4);
level0.setWorldWidth(5);
level0.setWorldHeight(5);
level0.setInitialAgentNumber(1);
level0.setWaveNumber(3);
//level1.setWaveNumber(1);
level0.setExpiryLimit(20);
//level0.setImage("/images/Background_Level1.png");
level0.setNotice("<h2>Tutorial</h2> " +
        "<p>The aim of Fierce Planet is to help citizens survive as they move towards their goal (the yellow disc in the bottom right corner).</p> " +
        "<p>You can do this by placing <em>resources</em> on the grey squares. Your resources are the blue, green and red rectangles below. You can click or drag resources onto any grey square on the game map.</p> " +
        "<p>Resources come in three kinds: economic, environmental and social. Your citizens need all of these, so you will need to supply a mix of resources along their path.</p> " +
        "<p>Notice that if you don't provide enough resources of a particular kind, your citizens will start to turn into that colour. That's a dangerous sign, which indicates you need to place some resources quickly.</p> " +
        "<p>During game play, you spend resources from your store, indicated in the top left corner of the scoreboard. Saving citizens will increase your store.</p> " +
        "<p>Start by placing some resources on the map. When you are ready, click the 'Start' button in the Control Panel on the left. A small number of citizens will make their way along the path.</p> "
        );

level0.setupLevel = function() {
    var tiles = fillWithTiles();
    clearTiles(tiles, 20, 5);
    clearTiles(tiles, 15, 1);
    clearTiles(tiles, 10, 5);
    clearTiles(tiles, 9, 1);
    clearTiles(tiles, 0, 5);
    this.setTiles(tiles);
};


/* Level 1 Definition */

var level1 = new Level(1);
level1.addEntryPoint(0, 9);
level1.setGoalX(10);
level1.setGoalY(1);
level1.setWorldWidth(11);
level1.setWorldHeight(11);
level1.setInitialAgentNumber(1);
level1.setWaveNumber(20);
//level1.setWaveNumber(1);
level1.setExpiryLimit(20);
//level1.setSoundSrc("http://forestmist.org/wp-content/uploads/2010/04/html5-audio-loop.mp3");
//level1.setSoundSrc("/creepy1.wav");
//level1.setImage("/images/Background_Level1.png");
level1.setNotice("<h2>Level 1: Welcome to Fierce Planet!</h2> " +
        "<p>The citizens of Fierce Planet are under threat. They are migrating in ever increasing numbers, seeking a promised land of peace and prosperity.</p>" +
        "<p>Help them by placing 'Economic', 'Environmental' and 'Social' resources beside their path before they expire! Drag or click the blue, green and red swatches onto the grey patches of the maze.</p> " +
        "<p><em>Tip: Keep watch on your resource and expired levels - once the maximum number of citizens have expired, it's Game Over!</em></p> ");
//level1.setMapOptions({ lat: 30.9376, long: 79.4292, zoom: 10});

level1.setupLevel = function() {
    var tiles = fillWithTiles();
    clearTiles(tiles, 99, 10);
    clearTiles(tiles, 97, 1);
    clearTiles(tiles, 78, 9);
    clearTiles(tiles, 67, 1);
    clearTiles(tiles, 56, 9);
    clearTiles(tiles, 53, 1);
    clearTiles(tiles, 34, 9);
    clearTiles(tiles, 23, 1);
    clearTiles(tiles, 12, 10);
    this.setTiles(tiles);

    // Add predators and rivals
    this.setLevelAgents([new Agent(this, PREDATOR_AGENT_TYPE, 0, 9)]);
    this.setWaveAgents([new Agent(this, RIVAL_AGENT_TYPE, 10, 1)]);
};


/* Level 2 Definition */

var level2 = new Level(2);
level2.addEntryPoint(0, 0);
level2.setGoalX(11);
level2.setGoalY(1);
level2.setWorldWidth(12);
level2.setWorldHeight(12);
level2.setInitialAgentNumber(1);
level2.setWaveNumber(20);
level2.setExpiryLimit(20);
level2.setInitialResourceStore(120);
//level2.setImage("/images/Background_Level2.png");
level2.setNotice("<h2>Level 2: Twists and Turns</h2>" +
        "<p>Congratulations! You successfully navigated Level 1!</p>" +
        "<p>The citizens of Fierce Planet now face a greater challenge... Can you supply them with resources to reach their goal?</p>" +
        "<p><em>Tip: you can pause at any time to add resources. Your resource store increases as you save more citizens.</em></p>"
        );

level2.setupLevel = function() {
    var tiles = fillWithTiles();
    clearTiles(tiles, 121, 10);
    clearTiles(tiles, 118, 1);
    clearTiles(tiles, 109, 1);
    clearTiles(tiles, 102, 5);
    clearTiles(tiles, 97, 4);
    clearTiles(tiles, 90, 1);
    clearTiles(tiles, 88, 1);
    clearTiles(tiles, 78, 5);
    clearTiles(tiles, 73, 4);
    clearTiles(tiles, 70, 1);
    clearTiles(tiles, 61, 1);
    clearTiles(tiles, 54, 5);
    clearTiles(tiles, 49, 4);
    clearTiles(tiles, 42, 1);
    clearTiles(tiles, 40, 1);
    clearTiles(tiles, 32, 3);
    clearTiles(tiles, 30, 1);
    clearTiles(tiles, 25, 4);
    clearTiles(tiles, 22, 2);
    clearTiles(tiles, 18, 3);
    clearTiles(tiles, 13, 1);
    clearTiles(tiles, 0, 2);
    this.setTiles(tiles);
};


/* Level 3 Definition */

var level3 = new Level(3);
level3.addEntryPoint(5, 12);
level3.setGoalX(3);
level3.setGoalY(3);
level3.setWorldWidth(13);
level3.setWorldHeight(13);
level3.setInitialAgentNumber(1);
level3.setWaveNumber(20);
level3.setExpiryLimit(20);
level3.setInitialResourceStore(130);
//level3.setImage("/images/Background_Level3.png");
level3.setNotice("<h2>Level 3: Around and About</h2>" +
        "<p>After some further twists, the citizens of Fierce Planet are about to embark on some long roads ahead....</p>" +
        "<p><em>Tip: Levels get progressively larger, requiring more planning about where you allocate resources. Aim to place resources at regular intervals.</em></p>"
        );

level3.setupLevel = function() {
    var tiles = fillWithTiles();
    clearTiles(tiles, 161, 1);
    clearTiles(tiles, 150, 5);
    clearTiles(tiles, 148, 1);
    clearTiles(tiles, 144, 3);
    clearTiles(tiles, 141, 1);
    clearTiles(tiles, 137, 1);
    clearTiles(tiles, 135, 1);
    clearTiles(tiles, 133, 1);
    clearTiles(tiles, 131, 1);
    clearTiles(tiles, 126, 3);
    clearTiles(tiles, 124, 1);
    clearTiles(tiles, 122, 1);
    clearTiles(tiles, 120, 1);
    clearTiles(tiles, 118, 1);
    clearTiles(tiles, 113, 1);
    clearTiles(tiles, 111, 1);
    clearTiles(tiles, 109, 1);
    clearTiles(tiles, 107, 1);
    clearTiles(tiles, 105, 1);
    clearTiles(tiles, 100, 3);
    clearTiles(tiles, 96, 3);
    clearTiles(tiles, 94, 1);
    clearTiles(tiles, 92, 1);
    clearTiles(tiles, 89, 1);
    clearTiles(tiles, 81, 1);
    clearTiles(tiles, 79, 1);
    clearTiles(tiles, 68, 9);
    clearTiles(tiles, 66, 1);
    clearTiles(tiles, 53, 1);
    clearTiles(tiles, 42, 9);
    clearTiles(tiles, 40, 1);
    clearTiles(tiles, 37, 1);
    clearTiles(tiles, 27, 1);
    clearTiles(tiles, 14, 11);
    this.setTiles(tiles);
};


/* Level 4 Definition */

var level4 = new Level(1);
level4.addEntryPoint(6, 6);
level4.setGoalX(0);
level4.setGoalY(0);
level4.setWorldWidth(14);
level4.setWorldHeight(14);
level4.setInitialAgentNumber(1);
level4.setWaveNumber(20);
level4.setExpiryLimit(20);
level4.setInitialResourceStore(150);
//level4.setImage("/images/Background_Level4.png");
level4.setNotice("<h2>Level 4: Spiral of uncertainty</h2>" +
        "<p>The only way out is via the long and winding road...</p>" +
        "<p><em>Tip: be sure to allocate plenty of resources to the outer reaches of the road. The citizens will start to sprint when there is less to go around.</em></p>"
        );

level4.setupLevel = function() {
    var tiles = fillWithTiles();
    clearTiles(tiles, 168, 13);
    clearTiles(tiles, 166, 1);
    clearTiles(tiles, 154, 1);
    clearTiles(tiles, 152, 1);
    clearTiles(tiles, 142, 9);
    clearTiles(tiles, 140, 1);
    clearTiles(tiles, 138, 1);
    clearTiles(tiles, 136, 1);
    clearTiles(tiles, 128, 1);
    clearTiles(tiles, 126, 1);
    clearTiles(tiles, 124, 1);
    clearTiles(tiles, 122, 1);
    clearTiles(tiles, 116, 5);
    clearTiles(tiles, 114, 1);
    clearTiles(tiles, 112, 1);
    clearTiles(tiles, 110, 1);
    clearTiles(tiles, 108, 1);
    clearTiles(tiles, 106, 1);
    clearTiles(tiles, 102, 1);
    clearTiles(tiles, 100, 1);
    clearTiles(tiles, 98, 1);
    clearTiles(tiles, 96, 1);
    clearTiles(tiles, 94, 1);
    clearTiles(tiles, 92, 1);
    clearTiles(tiles, 90, 1);
    clearTiles(tiles, 88, 1);
    clearTiles(tiles, 86, 1);
    clearTiles(tiles, 84, 1);
    clearTiles(tiles, 82, 1);
    clearTiles(tiles, 80, 1);
    clearTiles(tiles, 76, 3);
    clearTiles(tiles, 74, 1);
    clearTiles(tiles, 72, 1);
    clearTiles(tiles, 70, 1);
    clearTiles(tiles, 68, 1);
    clearTiles(tiles, 66, 1);
    clearTiles(tiles, 60, 1);
    clearTiles(tiles, 58, 1);
    clearTiles(tiles, 56, 1);
    clearTiles(tiles, 54, 1);
    clearTiles(tiles, 46, 7);
    clearTiles(tiles, 44, 1);
    clearTiles(tiles, 42, 1);
    clearTiles(tiles, 40, 1);
    clearTiles(tiles, 30, 1);
    clearTiles(tiles, 28, 1);
    clearTiles(tiles, 16, 11);
    clearTiles(tiles, 14, 1);
    clearTiles(tiles, 0, 1);
    this.setTiles(tiles);
};


/* Level 5 Definition */

var level5 = new Level(1);
level5.addEntryPoint(13, 0);
level5.setGoalX(0);
level5.setGoalY(1);
level5.setWorldWidth(15);
level5.setWorldHeight(15);
level5.setInitialAgentNumber(1);
level5.setWaveNumber(20);
level5.setExpiryLimit(20);
level5.setInitialResourceStore(180);
//level5.setImage("/images/Background_Level5.png");
level5.setNotice("<h2>Level 5: A-mazing Grace</h2>" +
        "<p>The citizens are -mistakenly? - hopeful that the promised land lies not too far ahead. If only they can find their way through...</p>" +
        "<p><em>Citizens are (sort of) smart - at forks in the road, they'll take the path which appears more plentiful. Place resources to help them choose the right path.</em>.</p>"
        );

level5.setupLevel = function() {
    var tiles = fillWithTiles();
    clearTiles(tiles, 208, 1);
    clearTiles(tiles, 204, 3);
    clearTiles(tiles, 196, 7);
    clearTiles(tiles, 193, 1);
    clearTiles(tiles, 191, 1);
    clearTiles(tiles, 189, 1);
    clearTiles(tiles, 187, 1);
    clearTiles(tiles, 183, 1);
    clearTiles(tiles, 178, 1);
    clearTiles(tiles, 176, 1);
    clearTiles(tiles, 174, 1);
    clearTiles(tiles, 172, 1);
    clearTiles(tiles, 170, 1);
    clearTiles(tiles, 166, 3);
    clearTiles(tiles, 163, 1);
    clearTiles(tiles, 161, 1);
    clearTiles(tiles, 159, 1);
    clearTiles(tiles, 157, 1);
    clearTiles(tiles, 155, 1);
    clearTiles(tiles, 151, 1);
    clearTiles(tiles, 148, 1);
    clearTiles(tiles, 146, 1);
    clearTiles(tiles, 144, 1);
    clearTiles(tiles, 142, 1);
    clearTiles(tiles, 140, 1);
    clearTiles(tiles, 138, 1);
    clearTiles(tiles, 136, 1);
    clearTiles(tiles, 131, 3);
    clearTiles(tiles, 129, 1);
    clearTiles(tiles, 127, 1);
    clearTiles(tiles, 125, 1);
    clearTiles(tiles, 123, 1);
    clearTiles(tiles, 121, 1);
    clearTiles(tiles, 118, 1);
    clearTiles(tiles, 114, 1);
    clearTiles(tiles, 112, 1);
    clearTiles(tiles, 110, 1);
    clearTiles(tiles, 108, 1);
    clearTiles(tiles, 106, 1);
    clearTiles(tiles, 103, 1);
    clearTiles(tiles, 99, 3);
    clearTiles(tiles, 95, 3);
    clearTiles(tiles, 91, 3);
    clearTiles(tiles, 88, 1);
    clearTiles(tiles, 86, 1);
    clearTiles(tiles, 80, 1);
    clearTiles(tiles, 78, 1);
    clearTiles(tiles, 76, 1);
    clearTiles(tiles, 73, 1);
    clearTiles(tiles, 71, 1);
    clearTiles(tiles, 67, 3);
    clearTiles(tiles, 65, 1);
    clearTiles(tiles, 63, 1);
    clearTiles(tiles, 61, 1);
    clearTiles(tiles, 58, 1);
    clearTiles(tiles, 56, 1);
    clearTiles(tiles, 54, 1);
    clearTiles(tiles, 52, 1);
    clearTiles(tiles, 50, 1);
    clearTiles(tiles, 48, 1);
    clearTiles(tiles, 46, 1);
    clearTiles(tiles, 43, 1);
    clearTiles(tiles, 41, 1);
    clearTiles(tiles, 39, 1);
    clearTiles(tiles, 37, 1);
    clearTiles(tiles, 35, 1);
    clearTiles(tiles, 33, 1);
    clearTiles(tiles, 28, 1);
    clearTiles(tiles, 24, 3);
    clearTiles(tiles, 20, 3);
    clearTiles(tiles, 15, 4);
    clearTiles(tiles, 13, 1);
    this.setTiles(tiles);
};


/* Level 6 Definition */

var level6 = new Level(1);
level6.addEntryPoint(0, 1);
level6.setGoalX(2);
level6.setGoalY(14);
level6.setWorldWidth(16);
level6.setWorldHeight(16);
level6.setInitialAgentNumber(1);
level6.setWaveNumber(20);
level6.setExpiryLimit(20);
level6.setAllowOffscreenCycling(true);
level6.setInitialResourceStore(250);
//level6.setImage("/images/Background_Level6.png");
level6.setNotice("<h2>Level 6: Dire Straits</h2>" +
        "<p>Not there yet... This level looks well resourced - but your citizens will need them. </p>"+
        "<p><em>Tip: Clicking on an existing resource allows you to delete or upgrade it. An upgraded resource will dispense more health to citizens passing by.</em></p>");

level6.setupLevel = function() {
    var tiles = fillWithTiles();
    clearTiles(tiles, 226, 1);
    clearTiles(tiles, 212, 12);
    clearTiles(tiles, 208, 3);
    clearTiles(tiles, 196, 1);
    clearTiles(tiles, 182, 10);
    clearTiles(tiles, 176, 5);
    clearTiles(tiles, 166, 1);
    clearTiles(tiles, 152, 8);
    clearTiles(tiles, 144, 7);
    clearTiles(tiles, 136, 1);
    clearTiles(tiles, 122, 6);
    clearTiles(tiles, 112, 9);
    clearTiles(tiles, 106, 1);
    clearTiles(tiles, 92, 4);
    clearTiles(tiles, 80, 11);
    clearTiles(tiles, 76, 1);
    clearTiles(tiles, 62, 2);
    clearTiles(tiles, 48, 13);
    clearTiles(tiles, 46, 1);
    clearTiles(tiles, 16, 15);
    this.setTiles(tiles);
};


/* Level 7 Definition */

var level7 = new Level(7);
level7.setWorldWidth(17);
level7.setWorldHeight(17);
level7.addEntryPoint(0, 8);
level7.setGoalX(16);
level7.setGoalY(8);
level7.setInitialAgentNumber(1);
level7.setWaveNumber(10);
level7.setExpiryLimit(10);
level7.setAllowResourcesOnPath(true);
level7.setInitialResourceStore(150);
//level7.setImage("/images/Background_Level7.png");
level7.setNotice("<h2>Level 7: Like, Totally Random...</h2>" +
        "<p>Ahead lies a vast and empty expanse. The citizens are understandably nervous. Left unaided, they will try not to backtrack, but could still find themselves hopelessly lost without your aid.</p>" +
        "<p><em>You can add resources to the paths (the white squares) on this level, to direct citizens to their goal.</em></p>");

level7.setupLevel = function() {
    var tiles = fillWithTiles();
    clearTiles(tiles, 280, 1);
    clearTiles(tiles, 262, 3);
    clearTiles(tiles, 244, 5);
    clearTiles(tiles, 226, 7);
    clearTiles(tiles, 208, 9);
    clearTiles(tiles, 190, 11);
    clearTiles(tiles, 172, 13);
    clearTiles(tiles, 154, 15);
    clearTiles(tiles, 136, 17);
    clearTiles(tiles, 120, 15);
    clearTiles(tiles, 104, 13);
    clearTiles(tiles, 88, 11);
    clearTiles(tiles, 72, 9);
    clearTiles(tiles, 56, 7);
    clearTiles(tiles, 40, 5);
    clearTiles(tiles, 24, 3);
    clearTiles(tiles, 8, 1);
    this.setTiles(tiles);


    // Add predators and rivals
    this.addLevelAgent(new Agent(this, PREDATOR_AGENT_TYPE, 8, 4));
    this.addWaveAgent(new Agent(this, RIVAL_AGENT_TYPE, 9, 4));
};




/* Level 8 Definition */

var level8 = new Level(8);
level8.addEntryPoint(0, 0);
level8.setGoalX(17);
level8.setGoalY(17);
level8.setWorldWidth(18);
level8.setWorldHeight(18);
level8.setInitialAgentNumber(1);
level8.setWaveNumber(10);
level8.setExpiryLimit(10);
level8.setInitialResourceStore(200);
//level8.setImage("/images/Background_Level8.png");
level8.setNotice("<h2>Level 8: A Fork (or Two) in the Road</h2>" +
        "<p>Life for the citizens of Fierce Planet is never easy. Having escaped the perils of random wandering, here they are faced with many decisions about which way to turn.</p>" + 
        "<p><em>Again, you'll need to direct citizen through numerous forks in the road, with strategic allocation of resources. Beware: leave no path under-resourced!</em></p>");

level8.setupLevel = function() {
    var tiles = fillWithTiles();
    clearTiles(tiles, 322, 2);
    clearTiles(tiles, 289, 16);
    clearTiles(tiles, 286, 1);
    clearTiles(tiles, 271, 1);
    clearTiles(tiles, 255, 14);
    clearTiles(tiles, 253, 1);
    clearTiles(tiles, 250, 1);
    clearTiles(tiles, 248, 1);
    clearTiles(tiles, 246, 1);
    clearTiles(tiles, 237, 1);
    clearTiles(tiles, 235, 1);
    clearTiles(tiles, 232, 1);
    clearTiles(tiles, 230, 1);
    clearTiles(tiles, 221, 8);
    clearTiles(tiles, 219, 1);
    clearTiles(tiles, 217, 1);
    clearTiles(tiles, 214, 1);
    clearTiles(tiles, 212, 1);
    clearTiles(tiles, 210, 1);
    clearTiles(tiles, 203, 1);
    clearTiles(tiles, 201, 1);
    clearTiles(tiles, 199, 1);
    clearTiles(tiles, 196, 1);
    clearTiles(tiles, 194, 1);
    clearTiles(tiles, 187, 6);
    clearTiles(tiles, 185, 1);
    clearTiles(tiles, 183, 1);
    clearTiles(tiles, 181, 1);
    clearTiles(tiles, 178, 1);
    clearTiles(tiles, 176, 1);
    clearTiles(tiles, 174, 1);
    clearTiles(tiles, 172, 1);
    clearTiles(tiles, 169, 1);
    clearTiles(tiles, 167, 1);
    clearTiles(tiles, 165, 1);
    clearTiles(tiles, 163, 1);
    clearTiles(tiles, 160, 1);
    clearTiles(tiles, 158, 1);
    clearTiles(tiles, 156, 1);
    clearTiles(tiles, 154, 1);
    clearTiles(tiles, 151, 1);
    clearTiles(tiles, 149, 1);
    clearTiles(tiles, 147, 1);
    clearTiles(tiles, 145, 1);
    clearTiles(tiles, 142, 1);
    clearTiles(tiles, 140, 1);
    clearTiles(tiles, 138, 1);
    clearTiles(tiles, 131, 6);
    clearTiles(tiles, 129, 1);
    clearTiles(tiles, 127, 1);
    clearTiles(tiles, 124, 1);
    clearTiles(tiles, 122, 1);
    clearTiles(tiles, 120, 1);
    clearTiles(tiles, 113, 1);
    clearTiles(tiles, 111, 1);
    clearTiles(tiles, 109, 1);
    clearTiles(tiles, 106, 1);
    clearTiles(tiles, 104, 1);
    clearTiles(tiles, 95, 8);
    clearTiles(tiles, 93, 1);
    clearTiles(tiles, 91, 1);
    clearTiles(tiles, 88, 1);
    clearTiles(tiles, 86, 1);
    clearTiles(tiles, 77, 1);
    clearTiles(tiles, 75, 1);
    clearTiles(tiles, 73, 1);
    clearTiles(tiles, 70, 1);
    clearTiles(tiles, 55, 14);
    clearTiles(tiles, 52, 1);
    clearTiles(tiles, 37, 1);
    clearTiles(tiles, 19, 16);
    clearTiles(tiles, 0, 2);
    this.setTiles(tiles);
};


/* Level 9 Definition */

var level9 = new Level(9);
level9.addEntryPoint(9, 0);
level9.setGoalX(9);
level9.setGoalY(18);
level9.setWorldWidth(19);
level9.setWorldHeight(19);
level9.setInitialAgentNumber(1);
level9.setWaveNumber(10);
level9.setExpiryLimit(10);
//level9.setImage("/images/Background_Level9.png");
level9.setNotice("<h2>Level 9: Cascades</h2>" +
        "<p>With time running out, the citizens of Fierce Planet are in a rush to find safety. But they're in for a bumpy ride.</p>" +
        "<p><em>Tip: No tip! You've gotten this far...</em></p>");

level9.setupLevel = function() {
    var tiles = fillWithTiles();
    clearTiles(tiles, 351, 1);
    clearTiles(tiles, 330, 5);
    clearTiles(tiles, 315, 1);
    clearTiles(tiles, 311, 1);
    clearTiles(tiles, 296, 3);
    clearTiles(tiles, 290, 3);
    clearTiles(tiles, 279, 1);
    clearTiles(tiles, 271, 1);
    clearTiles(tiles, 260, 3);
    clearTiles(tiles, 250, 3);
    clearTiles(tiles, 243, 1);
    clearTiles(tiles, 231, 1);
    clearTiles(tiles, 224, 3);
    clearTiles(tiles, 210, 3);
    clearTiles(tiles, 207, 1);
    clearTiles(tiles, 191, 1);
    clearTiles(tiles, 182, 7);
    clearTiles(tiles, 172, 7);
    clearTiles(tiles, 163, 1);
    clearTiles(tiles, 159, 1);
    clearTiles(tiles, 144, 3);
    clearTiles(tiles, 138, 3);
    clearTiles(tiles, 127, 1);
    clearTiles(tiles, 119, 1);
    clearTiles(tiles, 108, 3);
    clearTiles(tiles, 98, 3);
    clearTiles(tiles, 91, 1);
    clearTiles(tiles, 79, 1);
    clearTiles(tiles, 72, 3);
    clearTiles(tiles, 58, 3);
    clearTiles(tiles, 55, 1);
    clearTiles(tiles, 39, 1);
    clearTiles(tiles, 20, 17);
    clearTiles(tiles, 9, 1);
    this.setTiles(tiles);
};



/* Level 10 Definition */

var level10 = new Level(10);
level10.addEntryPoint(18, 19);
level10.setGoalX(16);
level10.setGoalY(19);
level10.setWorldWidth(20);
level10.setWorldHeight(20);
level10.setInitialAgentNumber(1);
level10.setWaveNumber(5);
level10.setExpiryLimit(1);
level10.setInitialResourceStore(250);
//level10.setImage("/images/Background_Level10.png");
level10.setNotice("<h2>Level 10: Fields of Ma(i)ze</h2>" +
        "<p>Nearly there! Pastures of plenty, and a new future, lie in store for the citizens of Fierce Planet. " +
        "However the way ahead is full of false dawns. Can they navigate the treacherous maze?</p>" +
        "<p><em>Tip: Remember to resource dead end paths, or citizens will expire, dazed and confused.</em></p>");

level10.setupLevel = function() {
    var tiles = fillWithTiles();
    clearTiles(tiles, 398, 1);
    clearTiles(tiles, 396, 1);
    clearTiles(tiles, 378, 1);
    clearTiles(tiles, 361, 16);
    clearTiles(tiles, 358, 1);
    clearTiles(tiles, 356, 1);
    clearTiles(tiles, 345, 1);
    clearTiles(tiles, 341, 1);
    clearTiles(tiles, 338, 1);
    clearTiles(tiles, 334, 3);
    clearTiles(tiles, 325, 8);
    clearTiles(tiles, 323, 1);
    clearTiles(tiles, 321, 1);
    clearTiles(tiles, 318, 1);
    clearTiles(tiles, 312, 1);
    clearTiles(tiles, 305, 1);
    clearTiles(tiles, 303, 1);
    clearTiles(tiles, 301, 1);
    clearTiles(tiles, 298, 1);
    clearTiles(tiles, 292, 5);
    clearTiles(tiles, 287, 4);
    clearTiles(tiles, 285, 1);
    clearTiles(tiles, 281, 3);
    clearTiles(tiles, 278, 1);
    clearTiles(tiles, 267, 1);
    clearTiles(tiles, 265, 1);
    clearTiles(tiles, 247, 12);
    clearTiles(tiles, 241, 5);
    clearTiles(tiles, 238, 1);
    clearTiles(tiles, 221, 1);
    clearTiles(tiles, 218, 1);
    clearTiles(tiles, 215, 1);
    clearTiles(tiles, 211, 3);
    clearTiles(tiles, 207, 3);
    clearTiles(tiles, 205, 1);
    clearTiles(tiles, 203, 1);
    clearTiles(tiles, 201, 1);
    clearTiles(tiles, 195, 4);
    clearTiles(tiles, 193, 1);
    clearTiles(tiles, 189, 3);
    clearTiles(tiles, 183, 5);
    clearTiles(tiles, 181, 1);
    clearTiles(tiles, 178, 1);
    clearTiles(tiles, 173, 1);
    clearTiles(tiles, 164, 1);
    clearTiles(tiles, 161, 1);
    clearTiles(tiles, 158, 1);
    clearTiles(tiles, 153, 4);
    clearTiles(tiles, 146, 6);
    clearTiles(tiles, 141, 4);
    clearTiles(tiles, 138, 1);
    clearTiles(tiles, 136, 1);
    clearTiles(tiles, 131, 1);
    clearTiles(tiles, 126, 1);
    clearTiles(tiles, 118, 1);
    clearTiles(tiles, 114, 3);
    clearTiles(tiles, 108, 5);
    clearTiles(tiles, 106, 1);
    clearTiles(tiles, 101, 4);
    clearTiles(tiles, 98, 1);
    clearTiles(tiles, 94, 1);
    clearTiles(tiles, 91, 1);
    clearTiles(tiles, 88, 1);
    clearTiles(tiles, 86, 1);
    clearTiles(tiles, 84, 1);
    clearTiles(tiles, 81, 1);
    clearTiles(tiles, 78, 1);
    clearTiles(tiles, 76, 1);
    clearTiles(tiles, 71, 4);
    clearTiles(tiles, 68, 2);
    clearTiles(tiles, 63, 4);
    clearTiles(tiles, 61, 1);
    clearTiles(tiles, 58, 1);
    clearTiles(tiles, 56, 1);
    clearTiles(tiles, 41, 1);
    clearTiles(tiles, 21, 18);
    this.setTiles(tiles);
};



/* Level 10 Definition */

var level11 = new Level(10);
level11.addEntryPoint(18, 19);
level11.addEntryPoint(1, 1);
level11.setGoalX(16);
level11.setGoalY(19);
level11.setWorldWidth(20);
level11.setWorldHeight(20);
level11.setInitialAgentNumber(10);
level11.setWaveNumber(5);
level11.setExpiryLimit(100);
level11.setInitialResourceStore(250);
level11.setNotice("<h2>Level 11: A Very Testing Level</h2>" +
        "<p>Experimental features are added here. Play at your own risk!</p>");

level11.setupLevel = function() {
    var tiles = fillWithTiles();
    clearTiles(tiles, 398, 1);
    clearTiles(tiles, 396, 1);
    clearTiles(tiles, 378, 1);
    clearTiles(tiles, 361, 16);
    clearTiles(tiles, 358, 1);
    clearTiles(tiles, 356, 1);
    clearTiles(tiles, 345, 1);
    clearTiles(tiles, 341, 1);
    clearTiles(tiles, 338, 1);
    clearTiles(tiles, 334, 3);
    clearTiles(tiles, 325, 8);
    clearTiles(tiles, 323, 1);
    clearTiles(tiles, 321, 1);
    clearTiles(tiles, 318, 1);
    clearTiles(tiles, 312, 1);
    clearTiles(tiles, 305, 1);
    clearTiles(tiles, 303, 1);
    clearTiles(tiles, 301, 1);
    clearTiles(tiles, 298, 1);
    clearTiles(tiles, 292, 5);
    clearTiles(tiles, 287, 4);
    clearTiles(tiles, 285, 1);
    clearTiles(tiles, 281, 3);
    clearTiles(tiles, 278, 1);
    clearTiles(tiles, 267, 1);
    clearTiles(tiles, 265, 1);
    clearTiles(tiles, 247, 12);
    clearTiles(tiles, 241, 5);
    clearTiles(tiles, 238, 1);
    clearTiles(tiles, 221, 1);
    clearTiles(tiles, 218, 1);
    clearTiles(tiles, 211, 5);
//    clearTiles(tiles, 215, 1);
//    clearTiles(tiles, 211, 3);
    clearTiles(tiles, 207, 3);
    clearTiles(tiles, 205, 1);
    clearTiles(tiles, 203, 1);
    clearTiles(tiles, 201, 1);
    clearTiles(tiles, 195, 4);
    clearTiles(tiles, 193, 1);
    clearTiles(tiles, 189, 3);
    clearTiles(tiles, 183, 5);
    clearTiles(tiles, 181, 1);
    clearTiles(tiles, 178, 1);
    clearTiles(tiles, 173, 1);
    clearTiles(tiles, 164, 1);
    clearTiles(tiles, 161, 1);
    clearTiles(tiles, 158, 1);
    clearTiles(tiles, 153, 4);
    clearTiles(tiles, 146, 6);
    clearTiles(tiles, 141, 4);
    clearTiles(tiles, 138, 1);
    clearTiles(tiles, 136, 1);
    clearTiles(tiles, 131, 1);
    clearTiles(tiles, 126, 1);
    clearTiles(tiles, 118, 1);
    clearTiles(tiles, 114, 3);
    clearTiles(tiles, 108, 5);
    clearTiles(tiles, 106, 1);
    clearTiles(tiles, 101, 4);
    clearTiles(tiles, 98, 1);
    clearTiles(tiles, 94, 1);
    clearTiles(tiles, 91, 1);
    clearTiles(tiles, 88, 1);
    clearTiles(tiles, 86, 1);
    clearTiles(tiles, 84, 1);
    clearTiles(tiles, 81, 1);
    clearTiles(tiles, 78, 1);
    clearTiles(tiles, 76, 1);
    clearTiles(tiles, 71, 4);
    clearTiles(tiles, 68, 2);
    clearTiles(tiles, 63, 4);
    clearTiles(tiles, 61, 1);
    clearTiles(tiles, 58, 1);
    clearTiles(tiles, 56, 1);
    clearTiles(tiles, 41, 1);
    clearTiles(tiles, 21, 18);
    this.setTiles(tiles);

//    this.setWaveAgents([new Agent(this, RIVAL_AGENT_TYPE, 16, 19)]);
    this.setWaveAgents([new Agent(this, RIVAL_AGENT_TYPE, 9, 3)]);
    this.setLevelAgents([new Agent(this, PREDATOR_AGENT_TYPE, 3, 16)]);
};


/* Google Map links */
var GOOGLE_MAPS = [
    "http://maps.google.com/maps/api/staticmap?center=30.9376,79.4292&zoom=10&size=801x601&maptype=satellite&sensor=false",
    "http://maps.google.com/maps/api/staticmap?center=32.3939,78.2345&zoom=13&size=801x601&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=-63.1748,-56.6296&zoom=13&size=801x601&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=-25.34340,131.03644&zoom=14&size=801x601&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=25.088,12.201&zoom=10&size=801x601&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=-9.8691,-37.2139&zoom=10&size=801x601&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=-13.182,167.705&zoom=10&size=801x601&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=41.890260,12.492220&zoom=20&size=801x601&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=43.07646,-79.07158&zoom=18&size=801x601&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=-41.81182,146.98923&zoom=14&size=801x601&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=40.75259,-73.98030&zoom=15&size=801x601&maptype=satellite&sensor=false"
];

var tempImg = new Array();

for(var i = 0; i < GOOGLE_MAPS.length; i++) {
    tempImg[i] = new Image();
    tempImg[i].src = GOOGLE_MAPS[i];
}
level1.setMapOptions({});
level2.setMapOptions({lat: 37.390296, long: -5.954579});
level3.setMapOptions({lat: 45.433607, long: 12.338124});
level4.setMapOptions({lat: 37.390296, long: -5.954579});
level5.setMapOptions({lat: 37.390296, long: -5.954579});
level6.setMapOptions({lat: 37.390296, long: -5.954579});
level7.setMapOptions({lat: 37.390296, long: -5.954579});
level8.setMapOptions({lat: 37.390296, long: -5.954579});
level9.setMapOptions({lat: 37.390296, long: -5.954579});
level10.setMapOptions({lat: 37.390296, long: -5.954579});
//level1.setMapURL(GOOGLE_MAPS[0]);
//level2.setMapURL(GOOGLE_MAPS[1]);
//level3.setMapURL(GOOGLE_MAPS[2]);
//level4.setMapURL(GOOGLE_MAPS[3]);
//level5.setMapURL(GOOGLE_MAPS[4]);
//level6.setMapURL(GOOGLE_MAPS[5]);
//level7.setMapURL(GOOGLE_MAPS[6]);
//level8.setMapURL(GOOGLE_MAPS[7]);
//level9.setMapURL(GOOGLE_MAPS[8]);
//level10.setMapURL(GOOGLE_MAPS[9]);
//level11.setMapURL(GOOGLE_MAPS[10]);
