

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


        describe("finding directions", function() {
            beforeEach(function() {
            });

            it("should generate a random order of possible directions", function() {
                var directions = agent.randomDirectionOrder();
                expect(directions.length).toEqual(4);
                expect($.inArray(0, directions)).toBeGreaterThan(-1);
                expect($.inArray(1, directions)).toBeGreaterThan(-1);
                expect($.inArray(2, directions)).toBeGreaterThan(-1);
                expect($.inArray(3, directions)).toBeGreaterThan(-1);
            });
        });

        describe("memories", function() {
            var level;
            beforeEach(function() {
                level = new Level(1);
                // Add a cross path in the middle of the level
                level.removeTiles(45, 1);
                level.removeTiles(53, 4);
                level.removeTiles(65, 1);

                // Place the agent at a co-ordinate on the path
                agent = new Agent(World.agentTypes[0], 4, 5);
            });

            it("should have a memory", function() {
                expect(agent.getMemories()[[4, 5]]).toEqual(agent.getLastMemory());
                expect(agent.getLastMemory()).toBeDefined();
                expect(agent.getLastMemory().getAgentID()).toEqual(agent.getID());
                expect(agent.getLastMemory().getX()).toEqual(4);
                expect(agent.getLastMemory().getY()).toEqual(5);
                expect(agent.getLastMemory().getAge()).toEqual(0);
                expect(agent.getLastMemory().getMostRecentVisit()).toEqual(0);
                expect(agent.getLastMemory().getVisits()).toEqual(1);
                expect(agent.getLastMemory().getDistanceFromLastUntriedPath()).toEqual(-1);
            });

            describe("explicit movement", function() {
                beforeEach(function() {
                    agent.moveTo(4, 6);
                });

                it("should still have the last memory", function() {
                    expect(agent.getMemories()[[4, 5]]).toEqual(agent.getLastMemory());
                    expect(agent.getLastMemory()).toBeDefined();
                    expect(agent.getLastMemory().getAgentID()).toEqual(agent.getID());
                    expect(agent.getLastMemory().getX()).toEqual(4);
                    expect(agent.getLastMemory().getY()).toEqual(5);
                    expect(agent.getLastMemory().getAge()).toEqual(0);
                    expect(agent.getLastMemory().getMostRecentVisit()).toEqual(0);
                    expect(agent.getLastMemory().getVisits()).toEqual(1);
                    expect(agent.getLastMemory().getDistanceFromLastUntriedPath()).toEqual(-1);
                });

                describe("adding new memory", function() {
                    beforeEach(function() {
                        agent.memorise(level);
                    });

                    it("should have a new last memory", function() {
                        expect(agent.getMemories()[[4, 6]]).toEqual(agent.getLastMemory());
                        expect(agent.getLastMemory()).toBeDefined();
                        expect(agent.getLastMemory().getAgentID()).toEqual(agent.getID());
                        expect(agent.getLastMemory().getX()).toEqual(4);
                        expect(agent.getLastMemory().getY()).toEqual(6);
                        expect(agent.getLastMemory().getAge()).toEqual(1);
                        expect(agent.getLastMemory().getMostRecentVisit()).toEqual(1);
                        expect(agent.getLastMemory().getVisits()).toEqual(1);
                        expect(agent.getLastMemory().getDistanceFromLastUntriedPath()).toEqual(-1);
                    });

                    describe("going back to previous position", function() {
                        beforeEach(function() {
                            agent.moveTo(4, 5);
                            agent.memorise(level);
                        });

                        it("should have a new last memory", function() {
                            expect(agent.getMemories()[[4, 5]]).toEqual(agent.getLastMemory());
                            expect(agent.getLastMemory().getX()).toEqual(4);
                            expect(agent.getLastMemory().getY()).toEqual(5);
                            expect(agent.getLastMemory().getAge()).toEqual(0);
                            expect(agent.getLastMemory().getMostRecentVisit()).toEqual(2);
                            expect(agent.getLastMemory().getVisits()).toEqual(2);
                            expect(agent.getLastMemory().getDistanceFromLastUntriedPath()).toEqual(1);
                        });

                        describe("returning to first position", function() {
                            beforeEach(function() {
                                agent.moveTo(4, 6);
                                agent.memorise(level);
                            });

                            it("should have a new last memory", function() {
                                expect(agent.getMemories()[[4, 6]]).toEqual(agent.getLastMemory());
                                expect(agent.getLastMemory().getX()).toEqual(4);
                                expect(agent.getLastMemory().getY()).toEqual(6);
                                expect(agent.getLastMemory().getAge()).toEqual(1);
                                expect(agent.getLastMemory().getMostRecentVisit()).toEqual(3);
                                expect(agent.getLastMemory().getVisits()).toEqual(2);
                                expect(agent.getLastMemory().getDistanceFromLastUntriedPath()).toEqual(1);
                            });
                        });
                    });

                });
            });
        });

    });

});