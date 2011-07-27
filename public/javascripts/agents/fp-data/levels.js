/*!
 * Fierce Planet - Levels
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/* NB: Level is defined in level.js */


/**
 * @namespace The namespace for preset levels
 */
var PresetLevels = function(){};

/**
 * @constant The number of preset levels
 */
PresetLevels.MAX_DEFAULT_LEVELS = 10;

/* Level 0 Definition */

PresetLevels.level0 = new Level(0);
PresetLevels.level0.setPresetLevel(true);
PresetLevels.level0.addEntryPoint(0, 0);
PresetLevels.level0.addExitPoint(4, 4);
PresetLevels.level0.setWorldWidth(5);
PresetLevels.level0.setWorldHeight(5);
PresetLevels.level0.setInitialAgentNumber(1);
PresetLevels.level0.setWaveNumber(3);
PresetLevels.level0.setExpiryLimit(20);
PresetLevels.level0.setName("Tutorial");
PresetLevels.level0.setIntroduction("" +
        "<p>The citizens of Fierce Planet are in danger of extinction. Their cities have been destroyed &mdash; there is a shortage of food and water, law and order has broken down, and disease is rampant.</p>" +
        "<p>The aim of the game is to help citizens survive as they build a sustainable city. Their start point is marked by a green circle, and the goal by a white circle. Both circles reflect your progress as more waves of citizens come through.</p> " +
        "<p>You can save your citizens by placing <em>resources</em> on tiles around their path. You can click on tiles to select a resource, or drag resources from the panel on the right onto the game map.</p> " +
        "<p>Resources come in three kinds: economic, environmental and social. Your citizens need all of these to build a sustainable city. " +
        "If you don't provide enough resources of a particular kind, your citizens will start turning that colour. This indicates you need to put down some resources of that colour to help your citizens.</p> " +
        "<p>You start with a limited amount of resources. Saving citizens will allow you to place more resources, which will allow you to help others.</p> " +
        "<p>Begin by placing some resources on the map. When you are ready, click the 'Play' button in the Control Panel on the left. After a few seconds, citizens will start marching towards their goal.</p> "
        );
PresetLevels.level0.setConclusion("Well done - you have completed the tutorial. Now time to help your citizens on Level 1.");

PresetLevels.level0.setup = function() {
    this.fillWithTiles();
    this.removeTiles(20, 5);
    this.removeTiles(15, 1);
    this.removeTiles(10, 5);
    this.removeTiles(9, 1);
    this.removeTiles(0, 5);
};


/* Level 1 Definition */

PresetLevels.level1 = new Level(1);
PresetLevels.level1.setPresetLevel(true);
PresetLevels.level1.addEntryPoint(0, 9);
PresetLevels.level1.addExitPoint(10, 1);
PresetLevels.level1.setWorldWidth(11);
PresetLevels.level1.setWorldHeight(11);
PresetLevels.level1.setInitialAgentNumber(1);
PresetLevels.level1.setWaveNumber(10);
PresetLevels.level1.setExpiryLimit(20);
PresetLevels.level1.setName("Level 1: Welcome to Fierce Planet!");
PresetLevels.level1.setIntroduction(
        "<p>The citizens of Fierce Planet are in danger of extinction. Their cities have been destroyed &mdash; there is a shortage of food and water, law and order has broken down, and disease is rampant.</p>" +
                "<p>Help your citizens rebuild their world before they are wiped out!</p>"
);
PresetLevels.level1.setConclusion(
        "<p>Congratulations, you have helped the citizens of Fierce Planet start rebuilding their world... there is still a long way to go!</p>"
);
//"<p>The citizens of Fierce Planet are under threat. They are migrating in ever increasing numbers, seeking a promised land of peace and prosperity.</p>" +
//"<p>Help them by placing resources beside their path - before they expire!</p> "
PresetLevels.level1.setTip(new Notice("Drag or click the resources on the right (->), then add them to the map.", FiercePlanet.WORLD_WIDTH - FiercePlanet.WAVE_NOTICE_WIDTH, FiercePlanet.WORLD_HEIGHT / 2));
PresetLevels.level1.setSoundSrc("http://db.tt/iFLVJKi");


PresetLevels.level1.setup = function() {
    this.fillWithTiles();
    this.removeTiles(99, 10);
    this.removeTiles(97, 1);
    this.removeTiles(78, 9);
    this.removeTiles(67, 1);
    this.removeTiles(56, 9);
    this.removeTiles(53, 1);
    this.removeTiles(34, 9);
    this.removeTiles(23, 1);
    this.removeTiles(12, 10);

    // Add predators and rivals
    this.setLevelAgents([new Agent(AgentTypes.PREDATOR_AGENT_TYPE, 0, 9)]);
    this.setWaveAgents([new Agent(AgentTypes.RIVAL_AGENT_TYPE, 10, 1)]);
};


/* Level 2 Definition */

PresetLevels.level2 = new Level(2);
PresetLevels.level2.setPresetLevel(true);
PresetLevels.level2.addEntryPoint(0, 0);
PresetLevels.level2.addExitPoint(11, 1);
PresetLevels.level2.setWorldWidth(12);
PresetLevels.level2.setWorldHeight(12);
PresetLevels.level2.setInitialAgentNumber(1);
PresetLevels.level2.setWaveNumber(10);
PresetLevels.level2.setExpiryLimit(10);
PresetLevels.level2.setInitialResourceStore(120);
PresetLevels.level2.setName("Level 2: Twists and Turns");
PresetLevels.level2.setIntroduction(
        "<p>The citizens of Fierce Planet are slowly building their city. With your help they can make it a place of peace and prosperity.</p>"
//        "<p>The citizens of Fierce Planet have survived their first great challenge. But life is about to get much tougher...</p>"
);
PresetLevels.level2.setConclusion(
        "<p>Well done, you have completed level 2. The hard work must continue...</p>"
);
PresetLevels.level2.setTip(new Notice("You can pause at any time to add resources. You can place more resources as you save citizens.", 0, 0));
PresetLevels.level2.setSoundSrc("http://db.tt/Tyd9F6M");

PresetLevels.level2.setup = function() {
    this.fillWithTiles();
    this.removeTiles(121, 10);
    this.removeTiles(118, 1);
    this.removeTiles(109, 1);
    this.removeTiles(102, 5);
    this.removeTiles(97, 4);
    this.removeTiles(90, 1);
    this.removeTiles(88, 1);
    this.removeTiles(78, 5);
    this.removeTiles(73, 4);
    this.removeTiles(70, 1);
    this.removeTiles(61, 1);
    this.removeTiles(54, 5);
    this.removeTiles(49, 4);
    this.removeTiles(42, 1);
    this.removeTiles(40, 1);
    this.removeTiles(32, 3);
    this.removeTiles(30, 1);
    this.removeTiles(25, 4);
    this.removeTiles(22, 2);
    this.removeTiles(18, 3);
    this.removeTiles(13, 1);
    this.removeTiles(0, 2);
    
};


/* Level 3 Definition */

PresetLevels.level3 = new Level(3);
PresetLevels.level3.setPresetLevel(true);
PresetLevels.level3.addEntryPoint(5, 12);
PresetLevels.level3.addExitPoint(3, 3);
PresetLevels.level3.setWorldWidth(13);
PresetLevels.level3.setWorldHeight(13);
PresetLevels.level3.setInitialAgentNumber(1);
PresetLevels.level3.setWaveNumber(10);
PresetLevels.level3.setExpiryLimit(10);
PresetLevels.level3.setInitialResourceStore(100);
PresetLevels.level3.setName("Level 3: Waves of Uncertainty");
PresetLevels.level3.setIntroduction(
        "<p>The rebuilding of Fierce Planet is proceeding well... but how can you plan for a random act of nature??!!! </p>"
//        "<p>So far, everything seems to be proceeding as planned. But on Fierce Planet, learn to expect the unexpected... </p>"
);
PresetLevels.level3.setConclusion(
        "<p>Phew - that was a rush! Perhaps the citizens will need to head inland for a while.</p>"
);
PresetLevels.level3.setTip(new Notice("The levels get progressively larger, requiring more planning as to where you allocate resources. Aim to place resources at regular intervals along the path."));
PresetLevels.level3.setSoundSrc("http://db.tt/7KPJ8Xi");
PresetLevels.level3.setCatastrophe(new Catastrophe(TBL.ENV_CATEGORY, 1000 + (Math.random() * 1000), 250, 0.8, new Notice("A tsumani will soon hit the city - some of its resources will be depleted.", undefined, undefined, 500, 250, undefined, undefined, TBL.ENV_CATEGORY.getColor(), "000000")));


PresetLevels.level3.setup = function() {
    this.fillWithTiles();
    this.removeTiles(161, 1);
    this.removeTiles(150, 5);
    this.removeTiles(148, 1);
    this.removeTiles(144, 3);
    this.removeTiles(141, 1);
    this.removeTiles(137, 1);
    this.removeTiles(135, 1);
    this.removeTiles(133, 1);
    this.removeTiles(131, 1);
    this.removeTiles(126, 3);
    this.removeTiles(124, 1);
    this.removeTiles(122, 1);
    this.removeTiles(120, 1);
    this.removeTiles(118, 1);
    this.removeTiles(113, 1);
    this.removeTiles(111, 1);
    this.removeTiles(109, 1);
    this.removeTiles(107, 1);
    this.removeTiles(105, 1);
    this.removeTiles(100, 3);
    this.removeTiles(96, 3);
    this.removeTiles(94, 1);
    this.removeTiles(92, 1);
    this.removeTiles(89, 1);
    this.removeTiles(81, 1);
    this.removeTiles(79, 1);
    this.removeTiles(68, 9);
    this.removeTiles(66, 1);
    this.removeTiles(53, 1);
    this.removeTiles(42, 9);
    this.removeTiles(40, 1);
    this.removeTiles(37, 1);
    this.removeTiles(27, 1);
    this.removeTiles(14, 11);
    
};


/* Level 4 Definition */

PresetLevels.level4 = new Level(4);
PresetLevels.level4.setPresetLevel(true);
PresetLevels.level4.addEntryPoint(6, 6);
PresetLevels.level4.addExitPoint(0, 0);
PresetLevels.level4.setWorldWidth(14);
PresetLevels.level4.setWorldHeight(14);
PresetLevels.level4.setInitialAgentNumber(1);
PresetLevels.level4.setWaveNumber(10);
PresetLevels.level4.setExpiryLimit(10);
PresetLevels.level4.setInitialResourceStore(180);
PresetLevels.level4.setName("Level 4: Spiral of Doom");
PresetLevels.level4.setIntroduction(
        "<p>The only way out is via the long and winding road...</p>"
        );
PresetLevels.level4.setTip(new Notice("Be sure to allocate resources to the outer reaches of the path. Citizens will run faster when there is less to go around..."));
PresetLevels.level4.setSoundSrc("http://db.tt/9m8kuIs");
PresetLevels.level4.setConclusion("Your citizens are feeling dizzy! But thankfully they have survived!");

PresetLevels.level4.setup = function() {
    this.fillWithTiles();
    this.removeTiles(168, 13);
    this.removeTiles(166, 1);
    this.removeTiles(154, 1);
    this.removeTiles(152, 1);
    this.removeTiles(142, 9);
    this.removeTiles(140, 1);
    this.removeTiles(138, 1);
    this.removeTiles(136, 1);
    this.removeTiles(128, 1);
    this.removeTiles(126, 1);
    this.removeTiles(124, 1);
    this.removeTiles(122, 1);
    this.removeTiles(116, 5);
    this.removeTiles(114, 1);
    this.removeTiles(112, 1);
    this.removeTiles(110, 1);
    this.removeTiles(108, 1);
    this.removeTiles(106, 1);
    this.removeTiles(102, 1);
    this.removeTiles(100, 1);
    this.removeTiles(98, 1);
    this.removeTiles(96, 1);
    this.removeTiles(94, 1);
    this.removeTiles(92, 1);
    this.removeTiles(90, 1);
    this.removeTiles(88, 1);
    this.removeTiles(86, 1);
    this.removeTiles(84, 1);
    this.removeTiles(82, 1);
    this.removeTiles(80, 1);
    this.removeTiles(76, 3);
    this.removeTiles(74, 1);
    this.removeTiles(72, 1);
    this.removeTiles(70, 1);
    this.removeTiles(68, 1);
    this.removeTiles(66, 1);
    this.removeTiles(60, 1);
    this.removeTiles(58, 1);
    this.removeTiles(56, 1);
    this.removeTiles(54, 1);
    this.removeTiles(46, 7);
    this.removeTiles(44, 1);
    this.removeTiles(42, 1);
    this.removeTiles(40, 1);
    this.removeTiles(30, 1);
    this.removeTiles(28, 1);
    this.removeTiles(16, 11);
    this.removeTiles(14, 1);
    this.removeTiles(0, 1);
    
};


/* Level 5 Definition */

PresetLevels.level5 = new Level(5);
PresetLevels.level5.setPresetLevel(true);
PresetLevels.level5.addEntryPoint(13, 0);
PresetLevels.level5.addExitPoint(0, 1);
PresetLevels.level5.setWorldWidth(15);
PresetLevels.level5.setWorldHeight(15);
PresetLevels.level5.setInitialAgentNumber(1);
PresetLevels.level5.setWaveNumber(10);
PresetLevels.level5.setExpiryLimit(10);
PresetLevels.level5.setInitialResourceStore(200);
PresetLevels.level5.setName("Level 5: A-mazing Grace");
PresetLevels.level5.setIntroduction(
        "<p>The citizens are hopeful that the promised land lies not too far ahead. Or does it?</p>"
        );
PresetLevels.level5.setTip(new Notice("Citizens are (sort of) smart - at forks in the road, they'll take the path which appears more plentiful. Place resources to help them choose the right path."));
PresetLevels.level5.setSoundSrc("http://db.tt/DIi4CW0");
PresetLevels.level5.setConclusion("That really was a-mazing! Time to straighten things out...");


PresetLevels.level5.setup = function() {
    this.fillWithTiles();
    this.removeTiles(208, 1);
    this.removeTiles(204, 3);
    this.removeTiles(196, 7);
    this.removeTiles(193, 1);
    this.removeTiles(191, 1);
    this.removeTiles(189, 1);
    this.removeTiles(187, 1);
    this.removeTiles(183, 1);
    this.removeTiles(178, 1);
    this.removeTiles(176, 1);
    this.removeTiles(174, 1);
    this.removeTiles(172, 1);
    this.removeTiles(170, 1);
    this.removeTiles(166, 3);
    this.removeTiles(163, 1);
    this.removeTiles(161, 1);
    this.removeTiles(159, 1);
    this.removeTiles(157, 1);
    this.removeTiles(155, 1);
    this.removeTiles(151, 1);
    this.removeTiles(148, 1);
    this.removeTiles(146, 1);
    this.removeTiles(144, 1);
    this.removeTiles(142, 1);
    this.removeTiles(140, 1);
    this.removeTiles(138, 1);
    this.removeTiles(136, 1);
    this.removeTiles(131, 3);
    this.removeTiles(129, 1);
    this.removeTiles(127, 1);
    this.removeTiles(125, 1);
    this.removeTiles(123, 1);
    this.removeTiles(121, 1);
    this.removeTiles(118, 1);
    this.removeTiles(114, 1);
    this.removeTiles(112, 1);
    this.removeTiles(110, 1);
    this.removeTiles(108, 1);
    this.removeTiles(106, 1);
    this.removeTiles(103, 1);
    this.removeTiles(99, 3);
    this.removeTiles(95, 3);
    this.removeTiles(91, 3);
    this.removeTiles(88, 1);
    this.removeTiles(86, 1);
    this.removeTiles(80, 1);
    this.removeTiles(78, 1);
    this.removeTiles(76, 1);
    this.removeTiles(73, 1);
    this.removeTiles(71, 1);
    this.removeTiles(67, 3);
    this.removeTiles(65, 1);
    this.removeTiles(63, 1);
    this.removeTiles(61, 1);
    this.removeTiles(58, 1);
    this.removeTiles(56, 1);
    this.removeTiles(54, 1);
    this.removeTiles(52, 1);
    this.removeTiles(50, 1);
    this.removeTiles(48, 1);
    this.removeTiles(46, 1);
    this.removeTiles(43, 1);
    this.removeTiles(41, 1);
    this.removeTiles(39, 1);
    this.removeTiles(37, 1);
    this.removeTiles(35, 1);
    this.removeTiles(33, 1);
    this.removeTiles(28, 1);
    this.removeTiles(24, 3);
    this.removeTiles(20, 3);
    this.removeTiles(15, 4);
    this.removeTiles(13, 1);
    
};


/* Level 6 Definition */

PresetLevels.level6 = new Level(6);
PresetLevels.level6.setPresetLevel(true);
PresetLevels.level6.addEntryPoint(0, 1);
PresetLevels.level6.addExitPoint(2, 14);
PresetLevels.level6.setWorldWidth(16);
PresetLevels.level6.setWorldHeight(16);
PresetLevels.level6.setInitialAgentNumber(1);
PresetLevels.level6.setWaveNumber(10);
PresetLevels.level6.setExpiryLimit(10);
PresetLevels.level6.setAllowOffscreenCycling(true);
PresetLevels.level6.setInitialResourceStore(350);
PresetLevels.level6.setName("Level 6: Dire Straits");
PresetLevels.level6.setIntroduction(
        "<p>This level looks well resourced &mdash; but there are troubling signs ahead for the economy. your citizens are going to need all the help they can get... </p>");
//PresetLevels.level6.setTip(new Notice("Clicking on an existing resource allows you to delete or upgrade it. An upgraded resource will dispense more health to citizens passing by."));
PresetLevels.level6.setTip(new Notice("Clicking on an existing resource allows you to delete it, and give you back some of what you spent"));
PresetLevels.level6.setConclusion("Back in surplus! Your citizens were able to pull through. Can they continue to work together through the challenges that lie ahead?");
PresetLevels.level6.setSoundSrc("http://db.tt/gre8MPS");
//PresetLevels.level6.setCatastrophe(new Catastrophe(TBL.ECO_CATEGORY, 100 + (Math.random() * 100), 300, 0, new Notice("The city is suffering a financial crisis - all services will be temporarily discontinued...", undefined, undefined, 500, 250, undefined, undefined, TBL.ECO_CATEGORY.getColor())));
PresetLevels.level6.setCatastrophe(new Catastrophe(TBL.ECO_CATEGORY, 500 + (Math.random() * 500), 250, 0.75, new Notice("The city is suffering a financial crisis - many services will be temporarily discontinued...", undefined, undefined, 500, 250, undefined, undefined, TBL.ECO_CATEGORY.getColor())));

PresetLevels.level6.setup = function() {
    this.fillWithTiles();
    this.removeTiles(226, 1);
    this.removeTiles(212, 12);
    this.removeTiles(208, 3);
    this.removeTiles(196, 1);
    this.removeTiles(182, 10);
    this.removeTiles(176, 5);
    this.removeTiles(166, 1);
    this.removeTiles(152, 8);
    this.removeTiles(144, 7);
    this.removeTiles(136, 1);
    this.removeTiles(122, 6);
    this.removeTiles(112, 9);
    this.removeTiles(106, 1);
    this.removeTiles(92, 4);
    this.removeTiles(80, 11);
    this.removeTiles(76, 1);
    this.removeTiles(62, 2);
    this.removeTiles(48, 13);
    this.removeTiles(46, 1);
    this.removeTiles(16, 15);
};


/* Level 7 Definition */

PresetLevels.level7 = new Level(7);
PresetLevels.level7.setPresetLevel(true);
PresetLevels.level7.setWorldWidth(17);
PresetLevels.level7.setWorldHeight(17);
PresetLevels.level7.addEntryPoint(0, 8);
PresetLevels.level7.addExitPoint(16, 8);
PresetLevels.level7.setInitialAgentNumber(1);
PresetLevels.level7.setWaveNumber(10);
PresetLevels.level7.setExpiryLimit(10);
PresetLevels.level7.setAllowResourcesOnPath(true);
PresetLevels.level7.setInitialResourceStore(200);
PresetLevels.level7.setName("Level 7: Like, Totally Random...");
PresetLevels.level7.setIntroduction(
        "<p>Ahead lies a vast and empty expanse. Your citizens are understandably nervous. Left unaided, they will try not to backtrack, but could find themselves hopelessly lost.</p>");
PresetLevels.level7.setTip(new Notice("You can add resources to the paths (the white squares) on this level, to direct citizens to their goal."));
PresetLevels.level7.setConclusion("Spaced out! Time to move back to the (apparent) comforts of the city.");
PresetLevels.level7.setSoundSrc("http://db.tt/7SRv0qP");

PresetLevels.level7.setup = function() {
    this.fillWithTiles();
    this.removeTiles(280, 1);
    this.removeTiles(262, 3);
    this.removeTiles(244, 5);
    this.removeTiles(226, 7);
    this.removeTiles(208, 9);
    this.removeTiles(190, 11);
    this.removeTiles(172, 13);
    this.removeTiles(154, 15);
    this.removeTiles(136, 17);
    this.removeTiles(120, 15);
    this.removeTiles(104, 13);
    this.removeTiles(88, 11);
    this.removeTiles(72, 9);
    this.removeTiles(56, 7);
    this.removeTiles(40, 5);
    this.removeTiles(24, 3);
    this.removeTiles(8, 1);
    
    // Add predators and rivals
//    this.addLevelAgent(new Agent(AgentTypes.PREDATOR_AGENT_TYPE, 8, 4));
//    this.addWaveAgent(new Agent(AgentTypes.RIVAL_AGENT_TYPE, 9, 4));
};




/* Level 8 Definition */

PresetLevels.level8 = new Level(8);
PresetLevels.level8.setPresetLevel(true);
PresetLevels.level8.addEntryPoint(0, 0);
PresetLevels.level8.addExitPoint(17, 17);
PresetLevels.level8.setWorldWidth(18);
PresetLevels.level8.setWorldHeight(18);
PresetLevels.level8.setInitialAgentNumber(1);
PresetLevels.level8.setWaveNumber(10);
PresetLevels.level8.setExpiryLimit(10);
PresetLevels.level8.setInitialResourceStore(300);
PresetLevels.level8.setName("Level 8: A Fork (or Two) in the Road");
PresetLevels.level8.setIntroduction(
        "<p>Life for the citizens of Fierce Planet is never simple. They are now faced with difficult dilemmas about which way to turn.</p>");
PresetLevels.level8.setTip(new Notice("You'll need to direct citizen through numerous forks in the road, by strategic placement of resources along the path."));
PresetLevels.level8.setConclusion("Un-fork-ettable! After all that running around, time for a refreshing break...");
PresetLevels.level8.setSoundSrc("http://db.tt/0ynKmXS");


PresetLevels.level8.setup = function() {
    this.fillWithTiles();
    this.removeTiles(322, 2);
    this.removeTiles(289, 16);
    this.removeTiles(286, 1);
    this.removeTiles(271, 1);
    this.removeTiles(255, 14);
    this.removeTiles(253, 1);
    this.removeTiles(250, 1);
    this.removeTiles(248, 1);
    this.removeTiles(246, 1);
    this.removeTiles(237, 1);
    this.removeTiles(235, 1);
    this.removeTiles(232, 1);
    this.removeTiles(230, 1);
    this.removeTiles(221, 8);
    this.removeTiles(219, 1);
    this.removeTiles(217, 1);
    this.removeTiles(214, 1);
    this.removeTiles(212, 1);
    this.removeTiles(210, 1);
    this.removeTiles(203, 1);
    this.removeTiles(201, 1);
    this.removeTiles(199, 1);
    this.removeTiles(196, 1);
    this.removeTiles(194, 1);
    this.removeTiles(187, 6);
    this.removeTiles(185, 1);
    this.removeTiles(183, 1);
    this.removeTiles(181, 1);
    this.removeTiles(178, 1);
    this.removeTiles(176, 1);
    this.removeTiles(174, 1);
    this.removeTiles(172, 1);
    this.removeTiles(169, 1);
    this.removeTiles(167, 1);
    this.removeTiles(165, 1);
    this.removeTiles(163, 1);
    this.removeTiles(160, 1);
    this.removeTiles(158, 1);
    this.removeTiles(156, 1);
    this.removeTiles(154, 1);
    this.removeTiles(151, 1);
    this.removeTiles(149, 1);
    this.removeTiles(147, 1);
    this.removeTiles(145, 1);
    this.removeTiles(142, 1);
    this.removeTiles(140, 1);
    this.removeTiles(138, 1);
    this.removeTiles(131, 6);
    this.removeTiles(129, 1);
    this.removeTiles(127, 1);
    this.removeTiles(124, 1);
    this.removeTiles(122, 1);
    this.removeTiles(120, 1);
    this.removeTiles(113, 1);
    this.removeTiles(111, 1);
    this.removeTiles(109, 1);
    this.removeTiles(106, 1);
    this.removeTiles(104, 1);
    this.removeTiles(95, 8);
    this.removeTiles(93, 1);
    this.removeTiles(91, 1);
    this.removeTiles(88, 1);
    this.removeTiles(86, 1);
    this.removeTiles(77, 1);
    this.removeTiles(75, 1);
    this.removeTiles(73, 1);
    this.removeTiles(70, 1);
    this.removeTiles(55, 14);
    this.removeTiles(52, 1);
    this.removeTiles(37, 1);
    this.removeTiles(19, 16);
    this.removeTiles(0, 2);
    
};


/* Level 9 Definition */

PresetLevels.level9 = new Level(9);
PresetLevels.level9.setPresetLevel(true);
PresetLevels.level9.addEntryPoint(9, 0);
PresetLevels.level9.addExitPoint(9, 18);
PresetLevels.level9.setWorldWidth(19);
PresetLevels.level9.setWorldHeight(19);
PresetLevels.level9.setInitialAgentNumber(1);
PresetLevels.level9.setWaveNumber(10);
PresetLevels.level9.setExpiryLimit(10);
PresetLevels.level9.setInitialResourceStore(280);
PresetLevels.level9.setName("Level 9: Cascades");
PresetLevels.level9.setIntroduction(
        "<p>Time is running out. But the citizens of Fierce Planet still need some rest and relaxation. Doesn't a trip to the beach sound like a good idea?</p>");
PresetLevels.level9.setTip(new Notice("No tip! You've gotten this far..."));
PresetLevels.level9.setConclusion("This seaside journey nearly brought about their downfall! Now time for the final stretch...");
PresetLevels.level9.setSoundSrc("http://db.tt/LMyYRtH");

PresetLevels.level9.setup = function() {
    this.fillWithTiles();
    this.removeTiles(351, 1);
    this.removeTiles(330, 5);
//    this.clearTiles(315, 1);
    this.removeTiles(311, 1);
    this.removeTiles(296, 3);
    this.removeTiles(294, 1);
    this.removeTiles(290, 3);
    this.removeTiles(279, 1);
    this.removeTiles(275, 1);
    this.removeTiles(271, 1);
    this.removeTiles(260, 3);
    this.removeTiles(254, 5);
    this.removeTiles(250, 3);
    this.removeTiles(243, 1);
    this.removeTiles(239, 1);
    this.removeTiles(235, 1);
    this.removeTiles(231, 1);
    this.removeTiles(224, 3);
    this.removeTiles(214, 9);
    this.removeTiles(210, 3);
    this.removeTiles(207, 1);
    this.removeTiles(203, 1);
    this.removeTiles(195, 1);
    this.removeTiles(191, 1);
    this.removeTiles(182, 7);
    this.removeTiles(178, 1);
    this.removeTiles(172, 5);
    this.removeTiles(163, 1);
    this.removeTiles(159, 1);
    this.removeTiles(144, 3);
    this.removeTiles(138, 3);
    this.removeTiles(127, 1);
    this.removeTiles(125, 1);
    this.removeTiles(121, 1);
    this.removeTiles(119, 1);
    this.removeTiles(108, 3);
    this.removeTiles(106, 1);
    this.removeTiles(102, 1);
    this.removeTiles(98, 3);
    this.removeTiles(91, 1);
    this.removeTiles(87, 1);
    this.removeTiles(83, 1);
    this.removeTiles(79, 1);
    this.removeTiles(72, 3);
    this.removeTiles(62, 9);
    this.removeTiles(58, 3);
    this.removeTiles(55, 1);
    this.removeTiles(39, 1);
    this.removeTiles(20, 17);
    this.removeTiles(9, 1);
    
};



/* Level 10 Definition */

PresetLevels.level10 = new Level(10);
PresetLevels.level10.setPresetLevel(true);
PresetLevels.level10.addEntryPoint(18, 19);
PresetLevels.level10.addExitPoint(16, 19);
PresetLevels.level10.setWorldWidth(20);
PresetLevels.level10.setWorldHeight(20);
PresetLevels.level10.setInitialAgentNumber(1);
PresetLevels.level10.setWaveNumber(5);
PresetLevels.level10.setExpiryLimit(1);
PresetLevels.level10.setInitialResourceStore(500);
PresetLevels.level10.setName("Level 10: Fields of Ma(i)ze");
PresetLevels.level10.setIntroduction(
        "<p>Pastures of plenty and a new sustainable future lie in store for the citizens of Fierce Planet. </p>" +
        "<p>With few remaining resources, they are starting to fight among themselves. Can they withstand a revolution from within?</p>");
PresetLevels.level10.setTip(new Notice("Remember to resource dead end paths, or your citizens will fade away, dazed and confused..."));
PresetLevels.level10.setSoundSrc("http://db.tt/DIi4CW0");
PresetLevels.level10.setCatastrophe(new Catastrophe(TBL.SOC_CATEGORY, 500 + (Math.random() * 100), 250, 0.6, new Notice("Oh no! A revolution is coming...", undefined, undefined, 500, 250, undefined, undefined, TBL.SOC_CATEGORY.getColor())));

PresetLevels.level10.setup = function() {
    this.fillWithTiles();
    this.removeTiles(398, 1);
    this.removeTiles(396, 1);
    this.removeTiles(378, 1);
    this.removeTiles(361, 16);
    this.removeTiles(358, 1);
    this.removeTiles(356, 1);
    this.removeTiles(345, 1);
    this.removeTiles(341, 1);
    this.removeTiles(338, 1);
    this.removeTiles(334, 3);
    this.removeTiles(325, 8);
    this.removeTiles(323, 1);
    this.removeTiles(321, 1);
    this.removeTiles(318, 1);
    this.removeTiles(312, 1);
    this.removeTiles(305, 1);
    this.removeTiles(303, 1);
    this.removeTiles(301, 1);
    this.removeTiles(298, 1);
    this.removeTiles(292, 5);
    this.removeTiles(287, 4);
    this.removeTiles(285, 1);
    this.removeTiles(281, 3);
    this.removeTiles(278, 1);
    this.removeTiles(267, 1);
    this.removeTiles(265, 1);
    this.removeTiles(247, 12);
    this.removeTiles(241, 5);
    this.removeTiles(238, 1);
    this.removeTiles(221, 1);
    this.removeTiles(218, 1);
    this.removeTiles(215, 1);
    this.removeTiles(211, 3);
    this.removeTiles(207, 3);
    this.removeTiles(205, 1);
    this.removeTiles(203, 1);
    this.removeTiles(201, 1);
    this.removeTiles(195, 4);
    this.removeTiles(193, 1);
    this.removeTiles(189, 3);
    this.removeTiles(183, 5);
    this.removeTiles(181, 1);
    this.removeTiles(178, 1);
    this.removeTiles(173, 1);
    this.removeTiles(164, 1);
    this.removeTiles(161, 1);
    this.removeTiles(158, 1);
    this.removeTiles(153, 4);
    this.removeTiles(146, 6);
    this.removeTiles(141, 4);
    this.removeTiles(138, 1);
    this.removeTiles(136, 1);
    this.removeTiles(131, 1);
    this.removeTiles(126, 1);
    this.removeTiles(118, 1);
    this.removeTiles(114, 3);
    this.removeTiles(108, 5);
    this.removeTiles(106, 1);
    this.removeTiles(101, 4);
    this.removeTiles(98, 1);
    this.removeTiles(94, 1);
    this.removeTiles(91, 1);
    this.removeTiles(88, 1);
    this.removeTiles(86, 1);
    this.removeTiles(84, 1);
    this.removeTiles(81, 1);
    this.removeTiles(78, 1);
    this.removeTiles(76, 1);
    this.removeTiles(71, 4);
    this.removeTiles(68, 2);
    this.removeTiles(63, 4);
    this.removeTiles(61, 1);
    this.removeTiles(58, 1);
    this.removeTiles(56, 1);
    this.removeTiles(41, 1);
    this.removeTiles(21, 18);
    
};



/* Level 11 Definition */

PresetLevels.level11 = new Level(11);
PresetLevels.level11.setPresetLevel(true);
PresetLevels.level11.addEntryPoint(11, 12);
PresetLevels.level11.addEntryPoint(18, 12);
PresetLevels.level11.addExitPoint(12, 17);
PresetLevels.level11.addExitPoint(17, 7);
PresetLevels.level11.setWorldWidth(30);
PresetLevels.level11.setWorldHeight(25);
PresetLevels.level11.setInitialAgentNumber(4);
PresetLevels.level11.setWaveNumber(3);
PresetLevels.level11.setExpiryLimit(10);
PresetLevels.level11.setInitialResourceStore(3000);
PresetLevels.level11.setAllowOffscreenCycling(true);
PresetLevels.level11.setName("Level 11: It's a Mad World");
PresetLevels.level11.setIntroduction(
        "<p>The citizens are safe! There's no mad rush &mdash; time to sit back and watch the world go by....");
PresetLevels.level11.setTip(new Notice("'There is a place. Like no place on Earth. A land full of wonder, mystery, and danger! Some say to survive it: You need to be as mad as a hatter. ' (The Mad Hatter)"));

PresetLevels.level11.setup = function() {
    this.setTiles($.evalJSON('[{"_color":"0FFF1F","_x":0,"_y":0},null,{"_color":"0FFF1F","_x":2,"_y":0},{"_color":"0FFF1F","_x":3,"_y":0},{"_color":"0FFF1F","_x":4,"_y":0},{"_color":"0FFF1F","_x":5,"_y":0},{"_color":"0FFF1F","_x":6,"_y":0},{"_color":"0FFF1F","_x":7,"_y":0},{"_color":"0FFF1F","_x":8,"_y":0},{"_color":"0FFF1F","_x":9,"_y":0},{"_color":"0FFF1F","_x":10,"_y":0},{"_color":"0FFF1F","_x":11,"_y":0},{"_color":"0FFF1F","_x":12,"_y":0},{"_color":"0FFF1F","_x":13,"_y":0},{"_color":"0FFF1F","_x":14,"_y":0},{"_color":"0FFF1F","_x":15,"_y":0},{"_color":"0FFF1F","_x":16,"_y":0},{"_color":"0FFF1F","_x":17,"_y":0},{"_color":"0FFF1F","_x":18,"_y":0},{"_color":"0FFF1F","_x":19,"_y":0},{"_color":"0FFF1F","_x":20,"_y":0},{"_color":"0FFF1F","_x":21,"_y":0},{"_color":"0FFF1F","_x":22,"_y":0},{"_color":"0FFF1F","_x":23,"_y":0},{"_color":"0FFF1F","_x":24,"_y":0},{"_color":"0FFF1F","_x":25,"_y":0},{"_color":"0FFF1F","_x":26,"_y":0},{"_color":"0FFF1F","_x":27,"_y":0},null,{"_color":"0FFF1F","_x":29,"_y":0},null,null,null,{"_color":"0FFF1F","_x":3,"_y":1},{"_color":"0FFF1F","_x":4,"_y":1},{"_color":"0FFF1F","_x":5,"_y":1},null,null,null,{"_color":"0FFF1F","_x":9,"_y":1},{"_color":"0FFF1F","_x":10,"_y":1},{"_color":"0FFF1F","_x":11,"_y":1},null,null,null,{"_color":"0FFF1F","_x":15,"_y":1},{"_color":"0FFF1F","_x":16,"_y":1},{"_color":"0FFF1F","_x":17,"_y":1},{"_color":"0FFF1F","_x":18,"_y":1},{"_color":"0FFF1F","_x":19,"_y":1},null,null,null,{"_color":"0FFF1F","_x":23,"_y":1},{"_color":"0FFF1F","_x":24,"_y":1},{"_color":"0FFF1F","_x":25,"_y":1},{"_color":"0FFF1F","_x":26,"_y":1},{"_color":"0FFF1F","_x":27,"_y":1},null,null,{"_color":"0FFF1F","_x":0,"_y":2},{"_color":"0FFF1F","_x":1,"_y":2},null,null,{"_color":"0FFF1F","_x":4,"_y":2},null,null,{"_color":"0FFF1F","_x":7,"_y":2},null,null,{"_color":"0FFF1F","_x":10,"_y":2},null,null,{"_color":"0FFF1F","_x":13,"_y":2},null,null,{"_color":"0FFF1F","_x":16,"_y":2},{"_color":"0FFF1F","_x":17,"_y":2},{"_color":"0FFF1F","_x":18,"_y":2},null,null,{"_color":"0FFF1F","_x":21,"_y":2},null,null,{"_color":"0FFF1F","_x":24,"_y":2},{"_color":"0FFF1F","_x":25,"_y":2},{"_color":"0FFF1F","_x":26,"_y":2},null,null,{"_color":"0FFF1F","_x":29,"_y":2},{"_color":"0FFF1F","_x":0,"_y":3},{"_color":"0FFF1F","_x":1,"_y":3},{"_color":"0FFF1F","_x":2,"_y":3},null,null,null,{"_color":"0FFF1F","_x":6,"_y":3},{"_color":"0FFF1F","_x":7,"_y":3},{"_color":"0FFF1F","_x":8,"_y":3},null,null,null,{"_color":"0FFF1F","_x":12,"_y":3},{"_color":"0FFF1F","_x":13,"_y":3},{"_color":"0FFF1F","_x":14,"_y":3},null,{"_color":"0FFF1F","_x":16,"_y":3},{"_color":"0FFF1F","_x":17,"_y":3},null,null,{"_color":"0FFF1F","_x":20,"_y":3},{"_color":"0FFF1F","_x":21,"_y":3},{"_color":"0FFF1F","_x":22,"_y":3},null,null,{"_color":"0FFF1F","_x":25,"_y":3},null,null,{"_color":"0FFF1F","_x":28,"_y":3},{"_color":"0FFF1F","_x":29,"_y":3},{"_color":"0FFF1F","_x":0,"_y":4},{"_color":"0FFF1F","_x":1,"_y":4},{"_color":"0FFF1F","_x":2,"_y":4},{"_color":"0FFF1F","_x":3,"_y":4},null,{"_color":"0FFF1F","_x":5,"_y":4},{"_color":"0FFF1F","_x":6,"_y":4},{"_color":"0FFF1F","_x":7,"_y":4},{"_color":"0FFF1F","_x":8,"_y":4},{"_color":"0FFF1F","_x":9,"_y":4},null,{"_color":"0FFF1F","_x":11,"_y":4},{"_color":"0FFF1F","_x":12,"_y":4},{"_color":"0FFF1F","_x":13,"_y":4},null,null,null,{"_color":"0FFF1F","_x":17,"_y":4},{"_color":"0FFF1F","_x":18,"_y":4},{"_color":"0FFF1F","_x":19,"_y":4},{"_color":"0FFF1F","_x":20,"_y":4},{"_color":"0FFF1F","_x":21,"_y":4},{"_color":"0FFF1F","_x":22,"_y":4},{"_color":"0FFF1F","_x":23,"_y":4},null,null,null,{"_color":"0FFF1F","_x":27,"_y":4},{"_color":"0FFF1F","_x":28,"_y":4},{"_color":"0FFF1F","_x":29,"_y":4},{"_color":"0FFF1F","_x":0,"_y":5},{"_color":"0FFF1F","_x":1,"_y":5},{"_color":"0FFF1F","_x":2,"_y":5},null,null,null,{"_color":"0FFF1F","_x":6,"_y":5},{"_color":"0FFF1F","_x":7,"_y":5},{"_color":"0FFF1F","_x":8,"_y":5},null,null,null,{"_color":"0FFF1F","_x":12,"_y":5},{"_color":"0FFF1F","_x":13,"_y":5},{"_color":"0FFF1F","_x":14,"_y":5},{"_color":"0FFF1F","_x":15,"_y":5},{"_color":"0FFF1F","_x":16,"_y":5},{"_color":"0FFF1F","_x":17,"_y":5},{"_color":"0FFF1F","_x":18,"_y":5},null,null,null,{"_color":"0FFF1F","_x":22,"_y":5},{"_color":"0FFF1F","_x":23,"_y":5},null,{"_color":"0FFF1F","_x":25,"_y":5},null,null,{"_color":"0FFF1F","_x":28,"_y":5},{"_color":"0FFF1F","_x":29,"_y":5},{"_color":"0FFF1F","_x":0,"_y":6},{"_color":"0FFF1F","_x":1,"_y":6},null,null,{"_color":"0FFF1F","_x":4,"_y":6},{"_color":"0FFF1F","_x":5,"_y":6},{"_color":"0FFF1F","_x":6,"_y":6},null,{"_color":"0FFF1F","_x":8,"_y":6},{"_color":"0FFF1F","_x":9,"_y":6},{"_color":"0FFF1F","_x":10,"_y":6},{"_color":"0FFF1F","_x":11,"_y":6},{"_color":"0FFF1F","_x":12,"_y":6},{"_color":"0FFF1F","_x":13,"_y":6},null,null,{"_color":"0FFF1F","_x":16,"_y":6},{"_color":"0FFF1F","_x":17,"_y":6},null,null,{"_color":"0FFF1F","_x":20,"_y":6},null,null,{"_color":"0FFF1F","_x":23,"_y":6},{"_color":"0FFF1F","_x":24,"_y":6},{"_color":"0FFF1F","_x":25,"_y":6},{"_color":"0FFF1F","_x":26,"_y":6},null,null,{"_color":"0FFF1F","_x":29,"_y":6},{"_color":"0FFF1F","_x":0,"_y":7},null,null,{"_color":"0FFF1F","_x":3,"_y":7},{"_color":"0FFF1F","_x":4,"_y":7},{"_color":"0FFF1F","_x":5,"_y":7},{"_color":"0FFF1F","_x":6,"_y":7},null,null,null,{"_color":"0FFF1F","_x":10,"_y":7},null,null,null,null,{"_color":"0FFF1F","_x":15,"_y":7},{"_color":"0FFF1F","_x":16,"_y":7},null,null,{"_color":"0FFF1F","_x":19,"_y":7},{"_color":"0FFF1F","_x":20,"_y":7},{"_color":"0FFF1F","_x":21,"_y":7},null,null,null,{"_color":"0FFF1F","_x":25,"_y":7},{"_color":"0FFF1F","_x":26,"_y":7},{"_color":"0FFF1F","_x":27,"_y":7},null,{"_color":"0FFF1F","_x":29,"_y":7},{"_color":"0FFF1F","_x":0,"_y":8},null,{"_color":"0FFF1F","_x":2,"_y":8},{"_color":"0FFF1F","_x":3,"_y":8},null,null,{"_color":"0FFF1F","_x":6,"_y":8},{"_color":"0FFF1F","_x":7,"_y":8},null,{"_color":"0FFF1F","_x":9,"_y":8},{"_color":"0FFF1F","_x":10,"_y":8},{"_color":"0FFF1F","_x":11,"_y":8},null,{"_color":"0FFF1F","_x":13,"_y":8},null,null,{"_color":"0FFF1F","_x":16,"_y":8},{"_color":"0FFF1F","_x":17,"_y":8},{"_color":"0FFF1F","_x":18,"_y":8},{"_color":"0FFF1F","_x":19,"_y":8},{"_color":"0FFF1F","_x":20,"_y":8},{"_color":"0FFF1F","_x":21,"_y":8},{"_color":"0FFF1F","_x":22,"_y":8},null,{"_color":"0FFF1F","_x":24,"_y":8},{"_color":"0FFF1F","_x":25,"_y":8},{"_color":"0FFF1F","_x":26,"_y":8},null,null,{"_color":"0FFF1F","_x":29,"_y":8},{"_color":"0FFF1F","_x":0,"_y":9},null,null,{"_color":"0FFF1F","_x":3,"_y":9},{"_color":"0FFF1F","_x":4,"_y":9},null,null,null,null,{"_color":"0FFF1F","_x":9,"_y":9},{"_color":"0FFF1F","_x":10,"_y":9},null,null,{"_color":"0FFF1F","_x":13,"_y":9},{"_color":"0FFF1F","_x":14,"_y":9},null,{"_color":"0FFF1F","_x":16,"_y":9},{"_color":"0FFF1F","_x":17,"_y":9},null,null,null,{"_color":"0FFF1F","_x":21,"_y":9},{"_color":"0FFF1F","_x":22,"_y":9},null,null,{"_color":"0FFF1F","_x":25,"_y":9},null,null,{"_color":"0FFF1F","_x":28,"_y":9},{"_color":"0FFF1F","_x":29,"_y":9},{"_color":"0FFF1F","_x":0,"_y":10},{"_color":"0FFF1F","_x":1,"_y":10},null,null,{"_color":"0FFF1F","_x":4,"_y":10},{"_color":"0FFF1F","_x":5,"_y":10},null,{"_color":"0FFF1F","_x":7,"_y":10},null,null,null,null,{"_color":"0FFF1F","_x":12,"_y":10},{"_color":"0FFF1F","_x":13,"_y":10},null,null,{"_color":"0FFF1F","_x":16,"_y":10},null,null,{"_color":"0FFF1F","_x":19,"_y":10},null,null,{"_color":"0FFF1F","_x":22,"_y":10},{"_color":"0FFF1F","_x":23,"_y":10},null,null,null,{"_color":"0FFF1F","_x":27,"_y":10},{"_color":"0FFF1F","_x":28,"_y":10},{"_color":"0FFF1F","_x":29,"_y":10},{"_color":"0FFF1F","_x":0,"_y":11},{"_color":"0FFF1F","_x":1,"_y":11},{"_color":"0FFF1F","_x":2,"_y":11},null,null,null,null,{"_color":"0FFF1F","_x":7,"_y":11},{"_color":"0FFF1F","_x":8,"_y":11},{"_color":"0FFF1F","_x":9,"_y":11},{"_color":"0FFF1F","_x":10,"_y":11},{"_color":"0FFF1F","_x":11,"_y":11},{"_color":"0FFF1F","_x":12,"_y":11},{"_color":"0FFF1F","_x":13,"_y":11},null,{"_color":"0FFF1F","_x":15,"_y":11},{"_color":"0FFF1F","_x":16,"_y":11},null,{"_color":"0FFF1F","_x":18,"_y":11},{"_color":"0FFF1F","_x":19,"_y":11},{"_color":"0FFF1F","_x":20,"_y":11},null,null,{"_color":"0FFF1F","_x":23,"_y":11},{"_color":"0FFF1F","_x":24,"_y":11},{"_color":"0FFF1F","_x":25,"_y":11},null,null,null,{"_color":"0FFF1F","_x":29,"_y":11},{"_color":"0FFF1F","_x":0,"_y":12},null,{"_color":"0FFF1F","_x":2,"_y":12},{"_color":"0FFF1F","_x":3,"_y":12},{"_color":"0FFF1F","_x":4,"_y":12},{"_color":"0FFF1F","_x":5,"_y":12},null,null,{"_color":"0FFF1F","_x":8,"_y":12},{"_color":"0FFF1F","_x":9,"_y":12},{"_color":"0FFF1F","_x":10,"_y":12},null,null,{"_color":"0FFF1F","_x":13,"_y":12},null,null,{"_color":"0FFF1F","_x":16,"_y":12},null,null,{"_color":"0FFF1F","_x":19,"_y":12},{"_color":"0FFF1F","_x":20,"_y":12},{"_color":"0FFF1F","_x":21,"_y":12},null,null,{"_color":"0FFF1F","_x":24,"_y":12},{"_color":"0FFF1F","_x":25,"_y":12},{"_color":"0FFF1F","_x":26,"_y":12},{"_color":"0FFF1F","_x":27,"_y":12},{"_color":"0FFF1F","_x":28,"_y":12},{"_color":"0FFF1F","_x":29,"_y":12},{"_color":"0FFF1F","_x":0,"_y":13},null,null,null,{"_color":"0FFF1F","_x":4,"_y":13},{"_color":"0FFF1F","_x":5,"_y":13},{"_color":"0FFF1F","_x":6,"_y":13},null,null,{"_color":"0FFF1F","_x":9,"_y":13},{"_color":"0FFF1F","_x":10,"_y":13},{"_color":"0FFF1F","_x":11,"_y":13},null,{"_color":"0FFF1F","_x":13,"_y":13},{"_color":"0FFF1F","_x":14,"_y":13},null,{"_color":"0FFF1F","_x":16,"_y":13},{"_color":"0FFF1F","_x":17,"_y":13},{"_color":"0FFF1F","_x":18,"_y":13},{"_color":"0FFF1F","_x":19,"_y":13},{"_color":"0FFF1F","_x":20,"_y":13},{"_color":"0FFF1F","_x":21,"_y":13},{"_color":"0FFF1F","_x":22,"_y":13},null,null,null,null,{"_color":"0FFF1F","_x":27,"_y":13},{"_color":"0FFF1F","_x":28,"_y":13},{"_color":"0FFF1F","_x":29,"_y":13},{"_color":"0FFF1F","_x":0,"_y":14},{"_color":"0FFF1F","_x":1,"_y":14},{"_color":"0FFF1F","_x":2,"_y":14},null,null,null,{"_color":"0FFF1F","_x":6,"_y":14},{"_color":"0FFF1F","_x":7,"_y":14},null,null,{"_color":"0FFF1F","_x":10,"_y":14},null,null,{"_color":"0FFF1F","_x":13,"_y":14},null,null,{"_color":"0FFF1F","_x":16,"_y":14},{"_color":"0FFF1F","_x":17,"_y":14},null,null,null,null,{"_color":"0FFF1F","_x":22,"_y":14},null,{"_color":"0FFF1F","_x":24,"_y":14},{"_color":"0FFF1F","_x":25,"_y":14},null,null,{"_color":"0FFF1F","_x":28,"_y":14},{"_color":"0FFF1F","_x":29,"_y":14},{"_color":"0FFF1F","_x":0,"_y":15},{"_color":"0FFF1F","_x":1,"_y":15},null,null,{"_color":"0FFF1F","_x":4,"_y":15},null,null,{"_color":"0FFF1F","_x":7,"_y":15},{"_color":"0FFF1F","_x":8,"_y":15},null,null,null,{"_color":"0FFF1F","_x":12,"_y":15},{"_color":"0FFF1F","_x":13,"_y":15},null,{"_color":"0FFF1F","_x":15,"_y":15},{"_color":"0FFF1F","_x":16,"_y":15},null,null,{"_color":"0FFF1F","_x":19,"_y":15},{"_color":"0FFF1F","_x":20,"_y":15},null,null,null,null,{"_color":"0FFF1F","_x":25,"_y":15},{"_color":"0FFF1F","_x":26,"_y":15},null,null,{"_color":"0FFF1F","_x":29,"_y":15},{"_color":"0FFF1F","_x":0,"_y":16},null,null,{"_color":"0FFF1F","_x":3,"_y":16},{"_color":"0FFF1F","_x":4,"_y":16},{"_color":"0FFF1F","_x":5,"_y":16},null,{"_color":"0FFF1F","_x":7,"_y":16},{"_color":"0FFF1F","_x":8,"_y":16},{"_color":"0FFF1F","_x":9,"_y":16},{"_color":"0FFF1F","_x":10,"_y":16},{"_color":"0FFF1F","_x":11,"_y":16},{"_color":"0FFF1F","_x":12,"_y":16},{"_color":"0FFF1F","_x":13,"_y":16},null,null,{"_color":"0FFF1F","_x":16,"_y":16},null,{"_color":"0FFF1F","_x":18,"_y":16},{"_color":"0FFF1F","_x":19,"_y":16},{"_color":"0FFF1F","_x":20,"_y":16},null,{"_color":"0FFF1F","_x":22,"_y":16},{"_color":"0FFF1F","_x":23,"_y":16},null,null,{"_color":"0FFF1F","_x":26,"_y":16},{"_color":"0FFF1F","_x":27,"_y":16},null,{"_color":"0FFF1F","_x":29,"_y":16},{"_color":"0FFF1F","_x":0,"_y":17},null,{"_color":"0FFF1F","_x":2,"_y":17},{"_color":"0FFF1F","_x":3,"_y":17},{"_color":"0FFF1F","_x":4,"_y":17},null,null,null,{"_color":"0FFF1F","_x":8,"_y":17},{"_color":"0FFF1F","_x":9,"_y":17},{"_color":"0FFF1F","_x":10,"_y":17},null,null,{"_color":"0FFF1F","_x":13,"_y":17},{"_color":"0FFF1F","_x":14,"_y":17},null,null,null,null,{"_color":"0FFF1F","_x":19,"_y":17},null,null,null,{"_color":"0FFF1F","_x":23,"_y":17},{"_color":"0FFF1F","_x":24,"_y":17},{"_color":"0FFF1F","_x":25,"_y":17},{"_color":"0FFF1F","_x":26,"_y":17},null,null,{"_color":"0FFF1F","_x":29,"_y":17},{"_color":"0FFF1F","_x":0,"_y":18},null,null,{"_color":"0FFF1F","_x":3,"_y":18},{"_color":"0FFF1F","_x":4,"_y":18},{"_color":"0FFF1F","_x":5,"_y":18},{"_color":"0FFF1F","_x":6,"_y":18},null,null,{"_color":"0FFF1F","_x":9,"_y":18},null,null,{"_color":"0FFF1F","_x":12,"_y":18},{"_color":"0FFF1F","_x":13,"_y":18},null,null,{"_color":"0FFF1F","_x":16,"_y":18},{"_color":"0FFF1F","_x":17,"_y":18},{"_color":"0FFF1F","_x":18,"_y":18},{"_color":"0FFF1F","_x":19,"_y":18},{"_color":"0FFF1F","_x":20,"_y":18},{"_color":"0FFF1F","_x":21,"_y":18},null,{"_color":"0FFF1F","_x":23,"_y":18},{"_color":"0FFF1F","_x":24,"_y":18},{"_color":"0FFF1F","_x":25,"_y":18},null,null,{"_color":"0FFF1F","_x":28,"_y":18},{"_color":"0FFF1F","_x":29,"_y":18},{"_color":"0FFF1F","_x":0,"_y":19},{"_color":"0FFF1F","_x":1,"_y":19},null,null,{"_color":"0FFF1F","_x":4,"_y":19},null,{"_color":"0FFF1F","_x":6,"_y":19},{"_color":"0FFF1F","_x":7,"_y":19},null,null,null,{"_color":"0FFF1F","_x":11,"_y":19},{"_color":"0FFF1F","_x":12,"_y":19},{"_color":"0FFF1F","_x":13,"_y":19},{"_color":"0FFF1F","_x":14,"_y":19},{"_color":"0FFF1F","_x":15,"_y":19},{"_color":"0FFF1F","_x":16,"_y":19},{"_color":"0FFF1F","_x":17,"_y":19},null,null,null,{"_color":"0FFF1F","_x":21,"_y":19},{"_color":"0FFF1F","_x":22,"_y":19},{"_color":"0FFF1F","_x":23,"_y":19},null,null,null,{"_color":"0FFF1F","_x":27,"_y":19},{"_color":"0FFF1F","_x":28,"_y":19},{"_color":"0FFF1F","_x":29,"_y":19},{"_color":"0FFF1F","_x":0,"_y":20},{"_color":"0FFF1F","_x":1,"_y":20},{"_color":"0FFF1F","_x":2,"_y":20},null,null,null,{"_color":"0FFF1F","_x":6,"_y":20},{"_color":"0FFF1F","_x":7,"_y":20},{"_color":"0FFF1F","_x":8,"_y":20},{"_color":"0FFF1F","_x":9,"_y":20},{"_color":"0FFF1F","_x":10,"_y":20},{"_color":"0FFF1F","_x":11,"_y":20},{"_color":"0FFF1F","_x":12,"_y":20},null,null,null,{"_color":"0FFF1F","_x":16,"_y":20},{"_color":"0FFF1F","_x":17,"_y":20},{"_color":"0FFF1F","_x":18,"_y":20},null,{"_color":"0FFF1F","_x":20,"_y":20},{"_color":"0FFF1F","_x":21,"_y":20},{"_color":"0FFF1F","_x":22,"_y":20},{"_color":"0FFF1F","_x":23,"_y":20},{"_color":"0FFF1F","_x":24,"_y":20},null,{"_color":"0FFF1F","_x":26,"_y":20},{"_color":"0FFF1F","_x":27,"_y":20},{"_color":"0FFF1F","_x":28,"_y":20},{"_color":"0FFF1F","_x":29,"_y":20},{"_color":"0FFF1F","_x":0,"_y":21},{"_color":"0FFF1F","_x":1,"_y":21},null,null,{"_color":"0FFF1F","_x":4,"_y":21},null,null,{"_color":"0FFF1F","_x":7,"_y":21},{"_color":"0FFF1F","_x":8,"_y":21},{"_color":"0FFF1F","_x":9,"_y":21},null,null,{"_color":"0FFF1F","_x":12,"_y":21},{"_color":"0FFF1F","_x":13,"_y":21},null,{"_color":"0FFF1F","_x":15,"_y":21},{"_color":"0FFF1F","_x":16,"_y":21},{"_color":"0FFF1F","_x":17,"_y":21},null,null,null,{"_color":"0FFF1F","_x":21,"_y":21},{"_color":"0FFF1F","_x":22,"_y":21},{"_color":"0FFF1F","_x":23,"_y":21},null,null,null,{"_color":"0FFF1F","_x":27,"_y":21},{"_color":"0FFF1F","_x":28,"_y":21},{"_color":"0FFF1F","_x":29,"_y":21},{"_color":"0FFF1F","_x":0,"_y":22},null,null,{"_color":"0FFF1F","_x":3,"_y":22},{"_color":"0FFF1F","_x":4,"_y":22},{"_color":"0FFF1F","_x":5,"_y":22},null,null,{"_color":"0FFF1F","_x":8,"_y":22},null,null,{"_color":"0FFF1F","_x":11,"_y":22},{"_color":"0FFF1F","_x":12,"_y":22},{"_color":"0FFF1F","_x":13,"_y":22},null,null,{"_color":"0FFF1F","_x":16,"_y":22},null,null,{"_color":"0FFF1F","_x":19,"_y":22},null,null,{"_color":"0FFF1F","_x":22,"_y":22},null,null,{"_color":"0FFF1F","_x":25,"_y":22},null,null,{"_color":"0FFF1F","_x":28,"_y":22},{"_color":"0FFF1F","_x":29,"_y":22},null,null,{"_color":"0FFF1F","_x":2,"_y":23},{"_color":"0FFF1F","_x":3,"_y":23},{"_color":"0FFF1F","_x":4,"_y":23},{"_color":"0FFF1F","_x":5,"_y":23},{"_color":"0FFF1F","_x":6,"_y":23},null,null,null,{"_color":"0FFF1F","_x":10,"_y":23},{"_color":"0FFF1F","_x":11,"_y":23},{"_color":"0FFF1F","_x":12,"_y":23},{"_color":"0FFF1F","_x":13,"_y":23},{"_color":"0FFF1F","_x":14,"_y":23},null,null,null,{"_color":"0FFF1F","_x":18,"_y":23},{"_color":"0FFF1F","_x":19,"_y":23},{"_color":"0FFF1F","_x":20,"_y":23},null,null,null,{"_color":"0FFF1F","_x":24,"_y":23},{"_color":"0FFF1F","_x":25,"_y":23},{"_color":"0FFF1F","_x":26,"_y":23},null,null,null,{"_color":"0FFF1F","_x":0,"_y":24},null,{"_color":"0FFF1F","_x":2,"_y":24},{"_color":"0FFF1F","_x":3,"_y":24},{"_color":"0FFF1F","_x":4,"_y":24},{"_color":"0FFF1F","_x":5,"_y":24},{"_color":"0FFF1F","_x":6,"_y":24},{"_color":"0FFF1F","_x":7,"_y":24},{"_color":"0FFF1F","_x":8,"_y":24},{"_color":"0FFF1F","_x":9,"_y":24},{"_color":"0FFF1F","_x":10,"_y":24},{"_color":"0FFF1F","_x":11,"_y":24},{"_color":"0FFF1F","_x":12,"_y":24},{"_color":"0FFF1F","_x":13,"_y":24},{"_color":"0FFF1F","_x":14,"_y":24},{"_color":"0FFF1F","_x":15,"_y":24},{"_color":"0FFF1F","_x":16,"_y":24},{"_color":"0FFF1F","_x":17,"_y":24},{"_color":"0FFF1F","_x":18,"_y":24},{"_color":"0FFF1F","_x":19,"_y":24},{"_color":"0FFF1F","_x":20,"_y":24},{"_color":"0FFF1F","_x":21,"_y":24},{"_color":"0FFF1F","_x":22,"_y":24},{"_color":"0FFF1F","_x":23,"_y":24},{"_color":"0FFF1F","_x":24,"_y":24},{"_color":"0FFF1F","_x":25,"_y":24},{"_color":"0FFF1F","_x":26,"_y":24},{"_color":"0FFF1F","_x":27,"_y":24},null,{"_color":"0FFF1F","_x":29,"_y":24}]'));
    this._preState = {};
    this._preState.agentsCanCommunicate = World.settings.agentsCanCommunicate;
    this._preState.ignoreResourceBalance = World.settings.ignoreResourceBalance;
    this._preState.agentsCanCommunicate = World.settings.useInlineResourceSwatch;
    this._preState.interval = FiercePlanet.interval;
    this._preState.capabilities = FiercePlanet.currentProfile.capabilities;
    World.settings.agentsCanCommunicate = true;
    World.settings.ignoreResourceBalance = true;
    World.settings.useInlineResourceSwatch = false;
    FiercePlanet.interval = 10;
    FiercePlanet.currentProfile.capabilities = FiercePlanet.GENIUS_CAPABILITIES;
    FiercePlanet.refreshSwatch();
    this.setNoSpeedChange(true);
//    this.setNoWander(true);
//    var resources = [];
//    for (var i = 0; i < this._worldWidth; i++) {
//        for (var j = 0; j < this._worldHeight; j++) {
//            if (this.getTile(i, j) != null) {
//                var val = Math.floor(Math.random() * 3);
//                var rk = null;
//                switch(val) {
//                    case 0:
//                        rk = FiercePlanet.STOCKMARKET_RESOURCE_TYPE;
//                        break;
//                    case 1:
//                        rk = FiercePlanet.BIODIVERSITY_RESOURCE_TYPE;
//                        break;
//                    case 2:
//                        rk = FiercePlanet.FESTIVAL_RESOURCE_TYPE;
//                        break;
//                }
//                rk.setImage(null);
//                rk.setTotalYield(1000);
//                var resource = new Resource(rk, i, j);
//                resources.push(resource);
//            }
//        }
//    }
//    this.setResources(resources);
};
PresetLevels.level11.teardown = function() {
    if (!this._preState)
        return;
    World.settings.agentsCanCommunicate = this._preState.agentsCanCommunicate;
    World.settings.ignoreResourceBalance = this._preState.ignoreResourceBalance;
    World.settings.useInlineResourceSwatch = this._preState.agentsCanCommunicate;
    FiercePlanet.interval = this._preState.interval;
    FiercePlanet.currentProfile.capabilities = this._preState.capabilities;
    FiercePlanet.refreshSwatch();
};


// Checked and authorised
PresetLevels.level1.setImage("/images/levels/level-1-art.jpg");
PresetLevels.level1.setImageAttribution('<a tabindex="-1" target="_blank" href="http://nuclearsyndrom.deviantart.com/"><em>Nuclear Winter</em></a>. Kindly reproduced courtesy of NuclearSyndrom.');
PresetLevels.level2.setImage("/images/levels/level-2-art.jpg");
PresetLevels.level2.setImageAttribution('<a tabindex="-1" target="_blank" href="http://www.slv.vic.gov.au/pictoria/b/2/8/doc/b28555.shtml"><em>Canvas Town, between Princess Bridge and South Melbourne in 1850\'s</em></a>. De Gruchy & Leigh, 1850-1860.');
PresetLevels.level3.setImage("/images/levels/level-3-art.jpg");
PresetLevels.level3.setImageAttribution('<a tabindex="-1" target="_blank" href="http://www.mynameisyakub.com"><em>The Apocalypse</em></a>. Kindly reproduced courtesy of Yakub.');
PresetLevels.level4.setImage("/images/levels/level-4-art.jpg");
PresetLevels.level4.setImageAttribution('<a tabindex="-1" target="_blank" href="http://en.wikipedia.org/wiki/File:Brueghel-tower-of-babel.jpg"><em>The Tower of Babel</em></a>. Pieter Bruegel the Elder, 1563.');
PresetLevels.level5.setImage("/images/levels/level-5-art.jpg");
PresetLevels.level5.setImageAttribution('<a tabindex="-1" target="_blank" href="http://http://en.wikipedia.org/wiki/File:Dore_London.jpg"><em>Over London–by Rail from London: A Pilgrimage</em></a>. Gustave Doré, 1870.');
PresetLevels.level6.setImage("/images/levels/level-6-art.jpg");
PresetLevels.level6.setImageAttribution('<a tabindex="-1" target="_blank" href="http://entertainment.howstuffworks.com/arts/artwork/claude-monet-paintings-1900-19082.htm"><em>Waterloo Bridge</em></a>. Claude Monet, 1900.');
PresetLevels.level7.setImage("/images/levels/level-7-art.jpg");
PresetLevels.level7.setImageAttribution('<a tabindex="-1" target="_blank" href="http://en.wikipedia.org/wiki/File:Ballarat_1853-54_von_guerard.jpg"><em>Ballarat 1853-54</em></a>. Eugene von Guerard, 1884.');
PresetLevels.level8.setImage("/images/levels/level-8-art.jpg");
PresetLevels.level8.setImageAttribution('<a tabindex="-1" target="_blank" href="http://en.wikipedia.org/wiki/File:Gustave_Caillebotte_-_Jour_de_pluie_%C3%A0_Paris.jpg"><em>A Rainy Day in Paris</em></a>. Gustave Caillebotte, 1877.');
PresetLevels.level9.setImage("/images/levels/level-9-art.jpg");
PresetLevels.level9.setImageAttribution('<a tabindex="-1" target="_blank" href="http://en.wikipedia.org/wiki/File:Renoir16.jpg"><em>Children on the Beach of Guernesey</em></a>. Pierre-Auguste Renoir, 1883.');
PresetLevels.level10.setImage("/images/levels/level-10-art.jpg");
PresetLevels.level10.setImageAttribution('<a tabindex="-1" target="_blank" href="http://nuclearsyndrom.deviantart.com/"><em>Nuclear Summer</em></a>. Kindly reproduced courtesy of NuclearSyndrom.');
PresetLevels.level11.setImage("/images/levels/level-11-art.jpg");
PresetLevels.level11.setImageAttribution('<a tabindex="-1" target="_blank" href="http://nuclearsyndrom.deviantart.com/"><em>Mad Tea Party</em></a>. Sir John Tenniel, 1865.');





/* Google Map links */
PresetLevels.level1.setMapOptions({mapTypeId: 'mars_infrared', center: new google.maps.LatLng(-80.73270997231712, 85.09268911182834), zoom: 3, tilt: 0}); // Budapest: 47.5153, 19.0782
PresetLevels.level2.setMapOptions({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(37.390296, -5.954579), zoom: 18, tilt: 45}); // Seville: 37.390296,-5.954579
PresetLevels.level3.setMapOptions({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(45.433607, 12.338124), zoom: 18, tilt: 45}); // Venice: 45.433607,12.338124
PresetLevels.level4.setMapOptions({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(41.890384354793554, 12.49228627979709), zoom: 19, tilt: 45}); // Rome, Colosseum: 41.890384354793554, 12.49228627979709
PresetLevels.level5.setMapOptions({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(-33.434969, -70.655254), zoom: 18, tilt: 45}); // Santiago: -33.434969,-70.655254
PresetLevels.level6.setMapOptions({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(47.487229, 19.07513), zoom: 18, tilt: 45}); // Budapest: 47.487229,19.07513
PresetLevels.level7.setMapOptions({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(30.006533, -90.158792), zoom: 18, tilt: 45}); // New Orleans: 30.006533,-90.158792
PresetLevels.level8.setMapOptions({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(33.441393, -112.077407), zoom: 18, tilt: 45}); // Phoenix, Arizona: 33.441393,-112.077407
PresetLevels.level9.setMapOptions({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(21.283355, -157.837787), zoom: 18, tilt: 45}); // Honululu: 21.283355,-157.837787
PresetLevels.level10.setMapOptions({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(30.265452, -97.744524), zoom: 18, tilt: 45}); // Austin, Texas: 30.265452,-97.744524
PresetLevels.level11.setMapOptions({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(51, 73), zoom: 2}); // The World
