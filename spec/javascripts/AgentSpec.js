

describe("agent-related classes", function() {
  var agent;

  beforeEach(function() {
      agent = new Agent(World.agentTypes[0], 0, 0);
  });

    describe("an agent", function() {
        it("should have a type", function() {
          expect(agent.agentType).toEqual(World.agentTypes[0]);
        });

        it("should have a unique id", function() {
          expect(agent.id).toNotEqual((new Agent(World.agentTypes[0], 0, 0).id));
        });

        describe("health functions", function() {
            it("should have 3 health statistics, all set to 100 by default", function() {
                var healthStats = agent.healthCategoryStats;

                expect(healthStats.length).toEqual(3);
                expect(healthStats[World.resourceCategories[0].code]).toEqual(INITIAL_HEALTH);
                expect(healthStats[World.resourceCategories[1].code]).toEqual(INITIAL_HEALTH);
                expect(healthStats[World.resourceCategories[2].code]).toEqual(INITIAL_HEALTH);
            });

            describe("when general health is adjusted", function() {
                var adjustment = -10;

                beforeEach(function() {
                    agent.adjustGeneralHealth(adjustment);
                });

                it("should adjust general health (obviously)", function() {
                    expect(agent.health).toEqual(INITIAL_HEALTH + adjustment);
                });

                it("should also adjust specific health statistics", function() {
                    var healthStats = agent.healthCategoryStats;

                    expect(healthStats[World.resourceCategories[0].code]).toEqual(INITIAL_HEALTH + adjustment);
                    expect(healthStats[World.resourceCategories[1].code]).toEqual(INITIAL_HEALTH + adjustment);
                    expect(healthStats[World.resourceCategories[2].code]).toEqual(INITIAL_HEALTH + adjustment);
                });
            });

            describe("when health for a specific category is adjusted", function() {
                var resource;
                var adjustment = -10;

                beforeEach(function() {
                    agent.adjustHealthForResourceCategory(adjustment, World.resourceCategories[0]);
                });

                it("should adjust health for just that category", function() {
                    var healthStats = agent.healthCategoryStats;
                    expect(healthStats[World.resourceCategories[0].code]).toEqual(INITIAL_HEALTH + adjustment);
                    expect(healthStats[World.resourceCategories[1].code]).toEqual(INITIAL_HEALTH);
                    expect(healthStats[World.resourceCategories[2].code]).toEqual(INITIAL_HEALTH);
                });

                it("should also adjust general health by a third of that amount (when there are three resource categories)", function() {
                    expect(agent.health).toEqual(INITIAL_HEALTH + (adjustment / World.resourceCategories.length));
                });

                it("should also return the correct result when health for a given resource is queried", function() {
                    expect(agent.getHealthForResourceCategory(World.resourceCategories[0])).toEqual(INITIAL_HEALTH + adjustment);
                });
            });

        });


        describe("getting directions", function() {
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


        describe("adjusting speed directions", function() {
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



            it("should have a default speed", function() {
                expect(agent.speed).toEqual(5);
            });


            it("should have a speed range", function() {
                Log.level = Log.DEBUG;
                agent.adjustSpeed();

                expect(agent.speed).toBeLessThan(7);
                expect(agent.speed).toBeGreaterThan(3);
                Log.level = Log.WARN;
            });



            it("should change speed when the current speed deviates from the default", function() {
                agent.speed = (100);
                agent.adjustSpeed();

                expect(agent.speed).toBeLessThan(100);
            });

            function calculateSpeeds(iterations) {
                var aggregateSpeeds = 0;
                var aboveCurrent = 0;
                var belowCurrent = 0;
                var notCurrent = 0;
                var areCurrent = 0;

                var currentSpeed = agent.speed;
                for (var i =0 ; i < iterations; i++) {
                    agent.adjustSpeed();
                    aggregateSpeeds += agent.speed;
                    if (agent.speed > currentSpeed) {
                        notCurrent++;
                        aboveCurrent++;
                    }
                    else if (agent.speed < currentSpeed) {
                        notCurrent++;
                        belowCurrent++;
                    }
                    else {
                        areCurrent++;
                    }
                    // Reset agent's speed
                    agent.speed = (currentSpeed);
                }

                var averageSpeed = Math.round(aggregateSpeeds / iterations);
                var ret = {averageSpeed:averageSpeed,aboveCurrent:aboveCurrent, belowCurrent:belowCurrent, notCurrent:notCurrent, areCurrent:areCurrent}
                return ret;
            }

            it("should change speed some of the time", function() {
                var speeds = calculateSpeeds(1000);
                expect(speeds.averageSpeed).toEqual(5);

                // Allow for reasonable margins of error - some probability these will fail
                expect(speeds.aboveCurrent).toBeGreaterThan(300);
                expect(speeds.belowCurrent).toBeGreaterThan(300);
                expect(speeds.notCurrent).toBeGreaterThan(600);
                expect(speeds.areCurrent).toBeGreaterThan(300);
                expect(speeds.aboveCurrent).toBeLessThan(400);
                expect(speeds.belowCurrent).toBeLessThan(400);
                expect(speeds.notCurrent).toBeLessThan(800);
                expect(speeds.areCurrent).toBeLessThan(400);
            });

            it("should change speed by average quantities when the current speed deviates from the default", function() {
                agent.speed = (100);
                var speeds = calculateSpeeds(1000);
                expect(speeds.averageSpeed).toBeLessThan(100);
                expect(speeds.averageSpeed).toBeGreaterThan(5);

                // Allow for reasonable margins of error - some probability these will fail
                expect(speeds.aboveCurrent).toBeGreaterThan(-1);
                expect(speeds.belowCurrent).toBeGreaterThan(900);
                expect(speeds.notCurrent).toBeGreaterThan(900);
                expect(speeds.areCurrent).toBeGreaterThan(-1);
                expect(speeds.aboveCurrent).toBeLessThan(20);
                expect(speeds.belowCurrent).toBeLessThan(1001);
                expect(speeds.notCurrent).toBeLessThan(1001);
                expect(speeds.areCurrent).toBeLessThan(20);
            });

            describe("adjusting speed directions", function() {
                var resource;
                beforeEach(function() {
                    level = new Level(1);
                    // Add a cross path in the middle of the level
                    level.removeTiles(45, 1);
                    level.removeTiles(53, 4);
                    level.removeTiles(65, 1);
                    resource = new Resource(World.resourceTypes[0], 3, 4);
                    level.addResource(new Resource(World.resourceTypes[0], 3, 4));

                    // Place the agent at a co-ordinate on the path
                    agent = new Agent(World.agentTypes[0], 4, 5);
                    agent.adjustGeneralHealth(-50);
                });

                it("should have a default speed", function() {
                    expect(agent.speed).toEqual(5);
                });

                it("should have a new speed when it meets a resource", function() {
                    level.processNeighbouringResources(agent);
                    expect(agent.speed).toEqual(20);
                });

                it("should not have a new speed when it meets a resource and has full health", function() {
                    agent.adjustGeneralHealth(100);
                    level.processNeighbouringResources(agent);
                    expect(agent.speed).toEqual(5);
                });
            });
        });



        describe("memories", function() {
            var level;

            beforeEach(function() {
                level = new Level(1);
                level.fillWithTiles();
                // Add a cross path in the middle of the level
                level.removeTiles(45, 1);
                level.removeTiles(53, 4);
                level.removeTiles(65, 1);

                // Place the agent at a co-ordinate on the path
                agent = new Agent(World.agentTypes[0], 4, 5);
            });

            it("should have a memory", function() {
                expect(agent.memoriesOfPlacesVisited[[4, 5]]).toEqual(agent.lastMemory);
                expect(agent.lastMemory).toBeDefined();
                expect(agent.lastMemory.agentID).toEqual(agent.id);
                expect(agent.lastMemory.x).toEqual(4);
                expect(agent.lastMemory.y).toEqual(5);
                expect(agent.lastMemory.age).toEqual(0);
                expect(agent.lastMemory.mostRecentVisit).toEqual(0);
                expect(agent.lastMemory.visits).toEqual(1);
                expect(agent.lastMemory.distanceFromLastUntriedPath).toEqual(-1);
            });

            describe("explicit movement", function() {
                beforeEach(function() {
                    agent.moveTo(4, 6);
                });

                it("should still have the last memory", function() {
                    expect(agent.memoriesOfPlacesVisited[[4, 5]]).toEqual(agent.lastMemory);
                    expect(agent.lastMemory).toBeDefined();
                    expect(agent.lastMemory.agentID).toEqual(agent.id);
                    expect(agent.lastMemory.x).toEqual(4);
                    expect(agent.lastMemory.y).toEqual(5);
                    expect(agent.lastMemory.age).toEqual(0);
                    expect(agent.lastMemory.mostRecentVisit).toEqual(0);
                    expect(agent.lastMemory.visits).toEqual(1);
                    expect(agent.lastMemory.distanceFromLastUntriedPath).toEqual(-1);
                });

                describe("adding new memory", function() {
                    beforeEach(function() {
                        agent.memorise(level);
                    });

                    it("should have a new last memory", function() {
                        expect(agent.memoriesOfPlacesVisited[[4, 6]]).toEqual(agent.lastMemory);
                        expect(agent.lastMemory).toBeDefined();
                        expect(agent.lastMemory.agentID).toEqual(agent.id);
                        expect(agent.lastMemory.x).toEqual(4);
                        expect(agent.lastMemory.y).toEqual(6);
                        expect(agent.lastMemory.age).toEqual(1);
                        expect(agent.lastMemory.mostRecentVisit).toEqual(1);
                        expect(agent.lastMemory.visits).toEqual(1);
                        expect(agent.lastMemory.distanceFromLastUntriedPath).toEqual(-1);
                    });

                    describe("going back to previous position", function() {
                        beforeEach(function() {
                            agent.moveTo(4, 5);
                            agent.memorise(level);
                        });

                        it("should have a new last memory", function() {
                            expect(agent.memoriesOfPlacesVisited[[4, 5]]).toEqual(agent.lastMemory);
                            expect(agent.lastMemory.x).toEqual(4);
                            expect(agent.lastMemory.y).toEqual(5);
                            expect(agent.lastMemory.age).toEqual(0);
                            expect(agent.lastMemory.mostRecentVisit).toEqual(2);
                            expect(agent.lastMemory.visits).toEqual(2);
                            expect(agent.lastMemory.distanceFromLastUntriedPath).toEqual(1);
                        });

                        describe("returning to first position", function() {
                            beforeEach(function() {
                                agent.moveTo(4, 6);
                                agent.memorise(level);
                            });

                            it("should have a new last memory", function() {
                                expect(agent.memoriesOfPlacesVisited[[4, 6]]).toEqual(agent.lastMemory);
                                expect(agent.lastMemory.x).toEqual(4);
                                expect(agent.lastMemory.y).toEqual(6);
                                expect(agent.lastMemory.age).toEqual(1);
                                expect(agent.lastMemory.mostRecentVisit).toEqual(3);
                                expect(agent.lastMemory.visits).toEqual(2);
                                expect(agent.lastMemory.distanceFromLastUntriedPath).toEqual(1);
                            });
                        });
                    });

                });
            });
        });

        describe("finding positions", function() {
            var level;

            beforeEach(function() {
                level = new Level(1);
                level.fillWithTiles();
                // Add a cross path in the middle of the level
                level.removeTiles(45, 1);
                level.removeTiles(53, 4);
                level.removeTiles(65, 1);

                // Place the agent at a co-ordinate on the path
                agent = new Agent(World.agentTypes[0], 3, 5);
            });

            it("should find a position", function() {
                var position = agent.findPosition(level);
                expect(position).toEqual([4, 5]);
            });


            describe("finding further positions", function() {
                beforeEach(function() {
                    agent.memorise(level);
                    agent.evaluateMove(level);
                });

                it("should have a new position", function() {
                    expect(agent.getPosition()).toEqual([4, 5]);
                });

                it("should find another new position, and not backtrack", function() {
                    var position = agent.findPosition(level);
                    expect(position).toEqual([5, 5]);
                });

                describe("a fork in the path", function() {
                    beforeEach(function() {
                        agent.memorise(level);
                        agent.evaluateMove(level);
                    });

                    it("should have a new position", function() {
                        expect(agent.getPosition()).toEqual([5, 5]);
                    });

                    it("should find another new position", function() {
                        var position = agent.findPosition(level);
                        expect(position).toNotEqual([4, 5]);
                    });

                    describe("backtracking", function() {
                        var position;

                        beforeEach(function() {
                            agent.memorise(level);
                            agent.evaluateMove(level);
                            position = agent.getPosition();
                        });

                        it("should have a new position", function() {
                            expect([[5,4], [6,5], [5,6]]).toContain(position);
                        });

                        it("should backtrack correctly", function() {
                            var position = agent.findPosition(level);
                            expect(position).toEqual([5, 5]);
                        });
                    });

                    describe("being led by a resource", function() {
                        var resource;

                        beforeEach(function() {
                            resource = new Resource(World.resourceTypes[0], 4, 4);
                            level.addResource(resource);
                        });

                        it("should follow the resource", function() {
                            agent.evaluateMove(level);
                            position = agent.getPosition();
                            expect(position).toEqual([5, 4]);
                        });
                    });
                });
            });
        });

    });

});