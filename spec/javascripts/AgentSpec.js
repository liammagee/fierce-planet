

describe("agent-related classes", function() {
  var agent;

  beforeEach(function() {
      agent = new Agent(World.agentTypes[0], 0, 0);
  });

    describe("an agent", function() {
        it("should have a type", function() {
          expect(agent.getType()).toEqual(World.agentTypes[0]);
        });

        it("should have a unique id", function() {
          expect(agent.getID()).toNotEqual((new Agent(World.agentTypes[0], 0, 0).getID()));
        });

        describe("health functions", function() {
            it("should have 3 health statistics, all set to 100 by default", function() {
                var healthStats = agent.getHealthStatistics();

                expect(healthStats.length).toEqual(3);
                expect(healthStats[World.resourceCategories[0].getCode()]).toEqual(INITIAL_HEALTH);
                expect(healthStats[World.resourceCategories[1].getCode()]).toEqual(INITIAL_HEALTH);
                expect(healthStats[World.resourceCategories[2].getCode()]).toEqual(INITIAL_HEALTH);
            });

            describe("when general health is adjusted", function() {
                var adjustment = -10;

                beforeEach(function() {
                    agent.adjustGeneralHealth(adjustment);
                });

                it("should adjust general health (obviously)", function() {
                    expect(agent.getHealth()).toEqual(INITIAL_HEALTH + adjustment);
                });

                it("should also adjust specific health statistics", function() {
                    var healthStats = agent.getHealthStatistics();

                    expect(healthStats[World.resourceCategories[0].getCode()]).toEqual(INITIAL_HEALTH + adjustment);
                    expect(healthStats[World.resourceCategories[1].getCode()]).toEqual(INITIAL_HEALTH + adjustment);
                    expect(healthStats[World.resourceCategories[2].getCode()]).toEqual(INITIAL_HEALTH + adjustment);
                });
            });

            describe("when health for a specific category is adjusted", function() {
                var resource;
                var adjustment = -10;

                beforeEach(function() {
                    resource = new Resource(World.resourceTypes[0], 0, 0);
                    agent.adjustHealthForResource(adjustment, resource);
                });

                it("should adjust health for just that category", function() {
                    var healthStats = agent.getHealthStatistics();
                    expect(healthStats[World.resourceCategories[0].getCode()]).toEqual(INITIAL_HEALTH + adjustment);
                    expect(healthStats[World.resourceCategories[1].getCode()]).toEqual(INITIAL_HEALTH);
                    expect(healthStats[World.resourceCategories[2].getCode()]).toEqual(INITIAL_HEALTH);
                });

                it("should also adjust general health by a third of that amount (when there are three resource categories)", function() {
                    expect(agent.getHealth()).toEqual(INITIAL_HEALTH + (adjustment / World.resourceCategories.length));
                });

                it("should also return the correct result when health for a given resource is queried", function() {
                    expect(agent.getHealthForResource(resource)).toEqual(INITIAL_HEALTH + adjustment);
                });
            });

        });

    });


//  describe("when song has been paused", function() {
//    beforeEach(function() {
//      player.play(song);
//      player.pause();
//    });
//
//    it("should indicate that the song is currently paused", function() {
//      expect(player.isPlaying).toBeFalsy();
//
//      // demonstrates use of 'not' with a custom matcher
//      expect(player).not.toBePlaying(song);
//    });
//
//    it("should be possible to resume", function() {
//      player.resume();
//      expect(player.isPlaying).toBeTruthy();
//      expect(player.currentlyPlayingSong).toEqual(song);
//    });
//  });
//
//  // demonstrates use of spies to intercept and test method calls
//  it("tells the current song if the user has made it a favorite", function() {
//    spyOn(song, 'persistFavoriteStatus');
//
//    player.play(song);
//    player.makeFavorite();
//
//    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
//  });
//
//  //demonstrates use of expected exceptions
//  describe("#resume", function() {
//    it("should throw an exception if song is already playing", function() {
//      player.play(song);
//
//      expect(function() {
//        player.resume();
//      }).toThrow("song is already playing");
//    });
//  });
});