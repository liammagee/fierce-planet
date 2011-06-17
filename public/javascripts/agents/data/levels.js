
/* NB: Level is defined in level.js */


var PresetLevels = function(){};

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
//PresetLevels.level1.setWaveNumber(1);
PresetLevels.level0.setExpiryLimit(20);
//PresetLevels.level0.setImage("/images/Background_PresetLevels.level1.png");
PresetLevels.level0.setNotice("<h2>Tutorial</h2> " +
        "<p>The aim of Fierce Planet is to help citizens survive as they move towards their goal (the yellow disc in the bottom right corner).</p> " +
        "<p>You can do this by placing <em>resources</em> on the grey squares. Your resources are the blue, green and red rectangles below. You can click or drag resources onto any grey square on the game map.</p> " +
        "<p>Resources come in three kinds: economic, environmental and social. Your citizens need all of these, so you will need to supply a mix of resources along their path.</p> " +
        "<p>Notice that if you don't provide enough resources of a particular kind, your citizens will start to turn into that colour. That's a dangerous sign, which indicates you need to place some resources quickly.</p> " +
        "<p>During game play, you spend resources from your store, indicated in the top left corner of the scoreboard. Saving citizens will increase your store.</p> " +
        "<p>Start by placing some resources on the map. When you are ready, click the 'Start' button in the Control Panel on the left. A small number of citizens will make their way along the path.</p> "
        );

PresetLevels.level0.setup = function() {
    this.fillWithTiles();
    this.clearTiles(20, 5);
    this.clearTiles(15, 1);
    this.clearTiles(10, 5);
    this.clearTiles(9, 1);
    this.clearTiles(0, 5);
    
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
//PresetLevels.level1.setSoundSrc("http://forestmist.org/wp-content/uploads/2010/04/html5-audio-loop.mp3");
//PresetLevels.level1.setSoundSrc("/creepy1.wav");
//PresetLevels.level1.setImage("/images/Background_PresetLevels.level1.png");
PresetLevels.level1.setNotice("<h2>Level 1: Welcome to Fierce Planet!</h2> " +
        "<p>The citizens of Fierce Planet are under threat. They are migrating in ever increasing numbers, seeking a promised land of peace and prosperity.</p>" +
        "<p>Help them by placing 'Economic', 'Environmental' and 'Social' resources beside their path before they expire! Drag or click the blue, green and red swatches onto the grey patches of the maze.</p> " +
        "<p><em>Tip: Keep watch on your resource and expired levels - once the maximum number of citizens have expired, it's Game Over!</em></p> ");
//PresetLevels.level1.setMapOptions({ lat: 30.9376, long: 79.4292, zoom: 10});

PresetLevels.level1.setup = function() {
    this.fillWithTiles();
    this.clearTiles(99, 10);
    this.clearTiles(97, 1);
    this.clearTiles(78, 9);
    this.clearTiles(67, 1);
    this.clearTiles(56, 9);
    this.clearTiles(53, 1);
    this.clearTiles(34, 9);
    this.clearTiles(23, 1);
    this.clearTiles(12, 10);

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
PresetLevels.level2.setNotice("<h2>Level 2: Twists and Turns</h2>" +
        "<p>Congratulations! You successfully navigated Level 1!</p>" +
        "<p>The citizens of Fierce Planet now face a greater challenge... Can you supply them with resources to reach their goal?</p>" +
        "<p><em>Tip: you can pause at any time to add resources. Your resource store increases as you save more citizens.</em></p>"
        );

PresetLevels.level2.setup = function() {
    this.fillWithTiles();
    this.clearTiles(121, 10);
    this.clearTiles(118, 1);
    this.clearTiles(109, 1);
    this.clearTiles(102, 5);
    this.clearTiles(97, 4);
    this.clearTiles(90, 1);
    this.clearTiles(88, 1);
    this.clearTiles(78, 5);
    this.clearTiles(73, 4);
    this.clearTiles(70, 1);
    this.clearTiles(61, 1);
    this.clearTiles(54, 5);
    this.clearTiles(49, 4);
    this.clearTiles(42, 1);
    this.clearTiles(40, 1);
    this.clearTiles(32, 3);
    this.clearTiles(30, 1);
    this.clearTiles(25, 4);
    this.clearTiles(22, 2);
    this.clearTiles(18, 3);
    this.clearTiles(13, 1);
    this.clearTiles(0, 2);
    
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
PresetLevels.level3.setInitialResourceStore(130);
PresetLevels.level3.setNotice("<h2>Level 3: Around and About</h2>" +
        "<p>After some further twists, the citizens of Fierce Planet are about to embark on some long roads ahead....</p>" +
        "<p><em>Tip: Levels get progressively larger, requiring more planning about where you allocate resources. Aim to place resources at regular intervals.</em></p>"
        );

PresetLevels.level3.setup = function() {
    this.fillWithTiles();
    this.clearTiles(161, 1);
    this.clearTiles(150, 5);
    this.clearTiles(148, 1);
    this.clearTiles(144, 3);
    this.clearTiles(141, 1);
    this.clearTiles(137, 1);
    this.clearTiles(135, 1);
    this.clearTiles(133, 1);
    this.clearTiles(131, 1);
    this.clearTiles(126, 3);
    this.clearTiles(124, 1);
    this.clearTiles(122, 1);
    this.clearTiles(120, 1);
    this.clearTiles(118, 1);
    this.clearTiles(113, 1);
    this.clearTiles(111, 1);
    this.clearTiles(109, 1);
    this.clearTiles(107, 1);
    this.clearTiles(105, 1);
    this.clearTiles(100, 3);
    this.clearTiles(96, 3);
    this.clearTiles(94, 1);
    this.clearTiles(92, 1);
    this.clearTiles(89, 1);
    this.clearTiles(81, 1);
    this.clearTiles(79, 1);
    this.clearTiles(68, 9);
    this.clearTiles(66, 1);
    this.clearTiles(53, 1);
    this.clearTiles(42, 9);
    this.clearTiles(40, 1);
    this.clearTiles(37, 1);
    this.clearTiles(27, 1);
    this.clearTiles(14, 11);
    
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
PresetLevels.level4.setInitialResourceStore(150);
PresetLevels.level4.setNotice("<h2>Level 4: Spiral of uncertainty</h2>" +
        "<p>The only way out is via the long and winding road...</p>" +
        "<p><em>Tip: be sure to allocate plenty of resources to the outer reaches of the road. The citizens will start to sprint when there is less to go around.</em></p>"
        );

PresetLevels.level4.setup = function() {
    this.fillWithTiles();
    this.clearTiles(168, 13);
    this.clearTiles(166, 1);
    this.clearTiles(154, 1);
    this.clearTiles(152, 1);
    this.clearTiles(142, 9);
    this.clearTiles(140, 1);
    this.clearTiles(138, 1);
    this.clearTiles(136, 1);
    this.clearTiles(128, 1);
    this.clearTiles(126, 1);
    this.clearTiles(124, 1);
    this.clearTiles(122, 1);
    this.clearTiles(116, 5);
    this.clearTiles(114, 1);
    this.clearTiles(112, 1);
    this.clearTiles(110, 1);
    this.clearTiles(108, 1);
    this.clearTiles(106, 1);
    this.clearTiles(102, 1);
    this.clearTiles(100, 1);
    this.clearTiles(98, 1);
    this.clearTiles(96, 1);
    this.clearTiles(94, 1);
    this.clearTiles(92, 1);
    this.clearTiles(90, 1);
    this.clearTiles(88, 1);
    this.clearTiles(86, 1);
    this.clearTiles(84, 1);
    this.clearTiles(82, 1);
    this.clearTiles(80, 1);
    this.clearTiles(76, 3);
    this.clearTiles(74, 1);
    this.clearTiles(72, 1);
    this.clearTiles(70, 1);
    this.clearTiles(68, 1);
    this.clearTiles(66, 1);
    this.clearTiles(60, 1);
    this.clearTiles(58, 1);
    this.clearTiles(56, 1);
    this.clearTiles(54, 1);
    this.clearTiles(46, 7);
    this.clearTiles(44, 1);
    this.clearTiles(42, 1);
    this.clearTiles(40, 1);
    this.clearTiles(30, 1);
    this.clearTiles(28, 1);
    this.clearTiles(16, 11);
    this.clearTiles(14, 1);
    this.clearTiles(0, 1);
    
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
PresetLevels.level5.setInitialResourceStore(180);
PresetLevels.level5.setNotice("<h2>Level 5: A-mazing Grace</h2>" +
        "<p>The citizens are -mistakenly? - hopeful that the promised land lies not too far ahead. If only they can find their way through...</p>" +
        "<p><em>Citizens are (sort of) smart - at forks in the road, they'll take the path which appears more plentiful. Place resources to help them choose the right path.</em>.</p>"
        );

PresetLevels.level5.setup = function() {
    this.fillWithTiles();
    this.clearTiles(208, 1);
    this.clearTiles(204, 3);
    this.clearTiles(196, 7);
    this.clearTiles(193, 1);
    this.clearTiles(191, 1);
    this.clearTiles(189, 1);
    this.clearTiles(187, 1);
    this.clearTiles(183, 1);
    this.clearTiles(178, 1);
    this.clearTiles(176, 1);
    this.clearTiles(174, 1);
    this.clearTiles(172, 1);
    this.clearTiles(170, 1);
    this.clearTiles(166, 3);
    this.clearTiles(163, 1);
    this.clearTiles(161, 1);
    this.clearTiles(159, 1);
    this.clearTiles(157, 1);
    this.clearTiles(155, 1);
    this.clearTiles(151, 1);
    this.clearTiles(148, 1);
    this.clearTiles(146, 1);
    this.clearTiles(144, 1);
    this.clearTiles(142, 1);
    this.clearTiles(140, 1);
    this.clearTiles(138, 1);
    this.clearTiles(136, 1);
    this.clearTiles(131, 3);
    this.clearTiles(129, 1);
    this.clearTiles(127, 1);
    this.clearTiles(125, 1);
    this.clearTiles(123, 1);
    this.clearTiles(121, 1);
    this.clearTiles(118, 1);
    this.clearTiles(114, 1);
    this.clearTiles(112, 1);
    this.clearTiles(110, 1);
    this.clearTiles(108, 1);
    this.clearTiles(106, 1);
    this.clearTiles(103, 1);
    this.clearTiles(99, 3);
    this.clearTiles(95, 3);
    this.clearTiles(91, 3);
    this.clearTiles(88, 1);
    this.clearTiles(86, 1);
    this.clearTiles(80, 1);
    this.clearTiles(78, 1);
    this.clearTiles(76, 1);
    this.clearTiles(73, 1);
    this.clearTiles(71, 1);
    this.clearTiles(67, 3);
    this.clearTiles(65, 1);
    this.clearTiles(63, 1);
    this.clearTiles(61, 1);
    this.clearTiles(58, 1);
    this.clearTiles(56, 1);
    this.clearTiles(54, 1);
    this.clearTiles(52, 1);
    this.clearTiles(50, 1);
    this.clearTiles(48, 1);
    this.clearTiles(46, 1);
    this.clearTiles(43, 1);
    this.clearTiles(41, 1);
    this.clearTiles(39, 1);
    this.clearTiles(37, 1);
    this.clearTiles(35, 1);
    this.clearTiles(33, 1);
    this.clearTiles(28, 1);
    this.clearTiles(24, 3);
    this.clearTiles(20, 3);
    this.clearTiles(15, 4);
    this.clearTiles(13, 1);
    
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
PresetLevels.level6.setInitialResourceStore(250);
PresetLevels.level6.setNotice("<h2>Level 6: Dire Straits</h2>" +
        "<p>Not there yet... This level looks well resourced - but your citizens will need them. </p>"+
        "<p><em>Tip: Clicking on an existing resource allows you to delete or upgrade it. An upgraded resource will dispense more health to citizens passing by.</em></p>");

PresetLevels.level6.setup = function() {
    this.fillWithTiles();
    this.clearTiles(226, 1);
    this.clearTiles(212, 12);
    this.clearTiles(208, 3);
    this.clearTiles(196, 1);
    this.clearTiles(182, 10);
    this.clearTiles(176, 5);
    this.clearTiles(166, 1);
    this.clearTiles(152, 8);
    this.clearTiles(144, 7);
    this.clearTiles(136, 1);
    this.clearTiles(122, 6);
    this.clearTiles(112, 9);
    this.clearTiles(106, 1);
    this.clearTiles(92, 4);
    this.clearTiles(80, 11);
    this.clearTiles(76, 1);
    this.clearTiles(62, 2);
    this.clearTiles(48, 13);
    this.clearTiles(46, 1);
    this.clearTiles(16, 15);
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
PresetLevels.level7.setInitialResourceStore(150);
PresetLevels.level7.setNotice("<h2>Level 7: Like, Totally Random...</h2>" +
        "<p>Ahead lies a vast and empty expanse. The citizens are understandably nervous. Left unaided, they will try not to backtrack, but could still find themselves hopelessly lost without your aid.</p>" +
        "<p><em>You can add resources to the paths (the white squares) on this level, to direct citizens to their goal.</em></p>");

PresetLevels.level7.setup = function() {
    this.fillWithTiles();
    this.clearTiles(280, 1);
    this.clearTiles(262, 3);
    this.clearTiles(244, 5);
    this.clearTiles(226, 7);
    this.clearTiles(208, 9);
    this.clearTiles(190, 11);
    this.clearTiles(172, 13);
    this.clearTiles(154, 15);
    this.clearTiles(136, 17);
    this.clearTiles(120, 15);
    this.clearTiles(104, 13);
    this.clearTiles(88, 11);
    this.clearTiles(72, 9);
    this.clearTiles(56, 7);
    this.clearTiles(40, 5);
    this.clearTiles(24, 3);
    this.clearTiles(8, 1);
    
    // Add predators and rivals
    this.addLevelAgent(new Agent(AgentTypes.PREDATOR_AGENT_TYPE, 8, 4));
    this.addWaveAgent(new Agent(AgentTypes.RIVAL_AGENT_TYPE, 9, 4));
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
PresetLevels.level8.setInitialResourceStore(200);
PresetLevels.level8.setNotice("<h2>Level 8: A Fork (or Two) in the Road</h2>" +
        "<p>Life for the citizens of Fierce Planet is never easy. Having escaped the perils of random wandering, here they are faced with many decisions about which way to turn.</p>" + 
        "<p><em>Again, you'll need to direct citizen through numerous forks in the road, with strategic allocation of resources. Beware: leave no path under-resourced!</em></p>");

PresetLevels.level8.setup = function() {
    this.fillWithTiles();
    this.clearTiles(322, 2);
    this.clearTiles(289, 16);
    this.clearTiles(286, 1);
    this.clearTiles(271, 1);
    this.clearTiles(255, 14);
    this.clearTiles(253, 1);
    this.clearTiles(250, 1);
    this.clearTiles(248, 1);
    this.clearTiles(246, 1);
    this.clearTiles(237, 1);
    this.clearTiles(235, 1);
    this.clearTiles(232, 1);
    this.clearTiles(230, 1);
    this.clearTiles(221, 8);
    this.clearTiles(219, 1);
    this.clearTiles(217, 1);
    this.clearTiles(214, 1);
    this.clearTiles(212, 1);
    this.clearTiles(210, 1);
    this.clearTiles(203, 1);
    this.clearTiles(201, 1);
    this.clearTiles(199, 1);
    this.clearTiles(196, 1);
    this.clearTiles(194, 1);
    this.clearTiles(187, 6);
    this.clearTiles(185, 1);
    this.clearTiles(183, 1);
    this.clearTiles(181, 1);
    this.clearTiles(178, 1);
    this.clearTiles(176, 1);
    this.clearTiles(174, 1);
    this.clearTiles(172, 1);
    this.clearTiles(169, 1);
    this.clearTiles(167, 1);
    this.clearTiles(165, 1);
    this.clearTiles(163, 1);
    this.clearTiles(160, 1);
    this.clearTiles(158, 1);
    this.clearTiles(156, 1);
    this.clearTiles(154, 1);
    this.clearTiles(151, 1);
    this.clearTiles(149, 1);
    this.clearTiles(147, 1);
    this.clearTiles(145, 1);
    this.clearTiles(142, 1);
    this.clearTiles(140, 1);
    this.clearTiles(138, 1);
    this.clearTiles(131, 6);
    this.clearTiles(129, 1);
    this.clearTiles(127, 1);
    this.clearTiles(124, 1);
    this.clearTiles(122, 1);
    this.clearTiles(120, 1);
    this.clearTiles(113, 1);
    this.clearTiles(111, 1);
    this.clearTiles(109, 1);
    this.clearTiles(106, 1);
    this.clearTiles(104, 1);
    this.clearTiles(95, 8);
    this.clearTiles(93, 1);
    this.clearTiles(91, 1);
    this.clearTiles(88, 1);
    this.clearTiles(86, 1);
    this.clearTiles(77, 1);
    this.clearTiles(75, 1);
    this.clearTiles(73, 1);
    this.clearTiles(70, 1);
    this.clearTiles(55, 14);
    this.clearTiles(52, 1);
    this.clearTiles(37, 1);
    this.clearTiles(19, 16);
    this.clearTiles(0, 2);
    
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
PresetLevels.level9.setNotice("<h2>Level 9: Cascades</h2>" +
        "<p>With time running out, the citizens of Fierce Planet are in a rush to find safety. But they're in for a bumpy ride.</p>" +
        "<p><em>Tip: No tip! You've gotten this far...</em></p>");

PresetLevels.level9.setup = function() {
    this.fillWithTiles();
    this.clearTiles(351, 1);
    this.clearTiles(330, 5);
    this.clearTiles(315, 1);
    this.clearTiles(311, 1);
    this.clearTiles(296, 3);
    this.clearTiles(290, 3);
    this.clearTiles(279, 1);
    this.clearTiles(271, 1);
    this.clearTiles(260, 3);
    this.clearTiles(250, 3);
    this.clearTiles(243, 1);
    this.clearTiles(231, 1);
    this.clearTiles(224, 3);
    this.clearTiles(210, 3);
    this.clearTiles(207, 1);
    this.clearTiles(191, 1);
    this.clearTiles(182, 7);
    this.clearTiles(172, 7);
    this.clearTiles(163, 1);
    this.clearTiles(159, 1);
    this.clearTiles(144, 3);
    this.clearTiles(138, 3);
    this.clearTiles(127, 1);
    this.clearTiles(119, 1);
    this.clearTiles(108, 3);
    this.clearTiles(98, 3);
    this.clearTiles(91, 1);
    this.clearTiles(79, 1);
    this.clearTiles(72, 3);
    this.clearTiles(58, 3);
    this.clearTiles(55, 1);
    this.clearTiles(39, 1);
    this.clearTiles(20, 17);
    this.clearTiles(9, 1);
    
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
PresetLevels.level10.setInitialResourceStore(250);
PresetLevels.level10.setNotice("<h2>Level 10: Fields of Ma(i)ze</h2>" +
        "<p>Nearly there! Pastures of plenty, and a new future, lie in store for the citizens of Fierce Planet. " +
        "However the way ahead is full of false dawns. Can they navigate the treacherous maze?</p>" +
        "<p><em>Tip: Remember to resource dead end paths, or citizens will expire, dazed and confused.</em></p>");

PresetLevels.level10.setup = function() {
    this.fillWithTiles();
    this.clearTiles(398, 1);
    this.clearTiles(396, 1);
    this.clearTiles(378, 1);
    this.clearTiles(361, 16);
    this.clearTiles(358, 1);
    this.clearTiles(356, 1);
    this.clearTiles(345, 1);
    this.clearTiles(341, 1);
    this.clearTiles(338, 1);
    this.clearTiles(334, 3);
    this.clearTiles(325, 8);
    this.clearTiles(323, 1);
    this.clearTiles(321, 1);
    this.clearTiles(318, 1);
    this.clearTiles(312, 1);
    this.clearTiles(305, 1);
    this.clearTiles(303, 1);
    this.clearTiles(301, 1);
    this.clearTiles(298, 1);
    this.clearTiles(292, 5);
    this.clearTiles(287, 4);
    this.clearTiles(285, 1);
    this.clearTiles(281, 3);
    this.clearTiles(278, 1);
    this.clearTiles(267, 1);
    this.clearTiles(265, 1);
    this.clearTiles(247, 12);
    this.clearTiles(241, 5);
    this.clearTiles(238, 1);
    this.clearTiles(221, 1);
    this.clearTiles(218, 1);
    this.clearTiles(215, 1);
    this.clearTiles(211, 3);
    this.clearTiles(207, 3);
    this.clearTiles(205, 1);
    this.clearTiles(203, 1);
    this.clearTiles(201, 1);
    this.clearTiles(195, 4);
    this.clearTiles(193, 1);
    this.clearTiles(189, 3);
    this.clearTiles(183, 5);
    this.clearTiles(181, 1);
    this.clearTiles(178, 1);
    this.clearTiles(173, 1);
    this.clearTiles(164, 1);
    this.clearTiles(161, 1);
    this.clearTiles(158, 1);
    this.clearTiles(153, 4);
    this.clearTiles(146, 6);
    this.clearTiles(141, 4);
    this.clearTiles(138, 1);
    this.clearTiles(136, 1);
    this.clearTiles(131, 1);
    this.clearTiles(126, 1);
    this.clearTiles(118, 1);
    this.clearTiles(114, 3);
    this.clearTiles(108, 5);
    this.clearTiles(106, 1);
    this.clearTiles(101, 4);
    this.clearTiles(98, 1);
    this.clearTiles(94, 1);
    this.clearTiles(91, 1);
    this.clearTiles(88, 1);
    this.clearTiles(86, 1);
    this.clearTiles(84, 1);
    this.clearTiles(81, 1);
    this.clearTiles(78, 1);
    this.clearTiles(76, 1);
    this.clearTiles(71, 4);
    this.clearTiles(68, 2);
    this.clearTiles(63, 4);
    this.clearTiles(61, 1);
    this.clearTiles(58, 1);
    this.clearTiles(56, 1);
    this.clearTiles(41, 1);
    this.clearTiles(21, 18);
    
};


/* Google Map links */
PresetLevels.level1.setMapOptions({lat: 47.5153, long: 19.0782, zoom: 20}); // Rome: 47.5153, 19.0782
PresetLevels.level2.setMapOptions({lat: 37.390296, long: -5.954579, zoom: 18}); // Seville: 37.390296,-5.954579
PresetLevels.level3.setMapOptions({lat: 45.433607, long: 12.338124, zoom: 18}); // Venice: 45.433607,12.338124
PresetLevels.level4.setMapOptions({lat: -33.909092, long: 18.406061, zoom: 19}); // Cape Town: -33.909092,18.406061
PresetLevels.level5.setMapOptions({lat: -33.434969, long: -70.655254}); // Santiago: -33.434969,-70.655254
PresetLevels.level6.setMapOptions({lat: 47.487229, long: 19.07513}); // Budapest: 47.487229,19.07513
PresetLevels.level7.setMapOptions({lat: 30.006533, long: -90.158792}); // New Orleans: 30.006533,-90.158792
PresetLevels.level8.setMapOptions({lat: 21.283355, long: -157.837787}); // Honululu: 21.283355,-157.837787
PresetLevels.level9.setMapOptions({lat: 33.441393, long: -112.077407}); // Phoenix, Arizona: 33.441393,-112.077407
PresetLevels.level10.setMapOptions({lat: 30.265452, long: -97.744524, zoom: 18}); // Austin, Texas: 30.265452,-97.744524
