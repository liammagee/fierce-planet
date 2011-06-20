var event_tests = {
	test_event_construction : function() {
		module("Event Test");
		test("Test event", function() {
            var e = new Event("agent", null, "created", FiercePlanet.gameCounter, FiercePlanet.currentLevel);
            var et = new EventTarget();
            et.addListener("agent", function(e) {
                FiercePlanet.currentNotice = new Notice("agent " + e._event);
                console.log("got here " + e._event);
            });
            et.addListener("agent", function(e) {
                FiercePlanet.currentNotice = new Notice("agent " + e._event);
                console.log("got here " + e._event);
            });
            et.fire(e);
		    ok( FiercePlanet.currentNotice != undefined, "Current notice is created" );
		    ok( FiercePlanet.currentNotice._text == "agent created", "Current notice has correct message" );
		});
	}
};

$().extend(tests, event_tests);