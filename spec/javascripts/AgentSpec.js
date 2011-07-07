describe("Agent", function() {
  var agentType;
  var agent;
  var resourceCategories = [
    new ResourceCategory("Economic", "eco", "44ABE0"),
    new ResourceCategory("Environmental", "env", "CBDB2A"),
    new ResourceCategory("Social", "soc", "DE1F2A")
  ];

  beforeEach(function() {
      agentType = new AgentType("citizen", "000", resourceCategories);
      agent = new Agent(agentType, 0, 0);
  });

  it("should have a type", function() {
    expect(agent.getType()).toEqual(agentType);
  });

  it("should have 3 health statistics, all set to 100 by default", function() {
      var healthStats = agent.getHealthStatistics();

      expect(healthStats.length).toEqual(3);
      expect(healthStats[resourceCategories[0].getCode()]).toEqual(100);
      expect(healthStats[resourceCategories[1].getCode()]).toEqual(100);
      expect(healthStats[resourceCategories[2].getCode()]).toEqual(100);
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