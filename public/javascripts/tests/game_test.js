var game_tests = {
	test_current_level : function() {
		module("Game Test");
		test("Test current level", function() {
		  ok( FiercePlanet.currentLevel != undefined, "Current level is loaded" );
		});
	}
};

$().extend(tests, game_tests);