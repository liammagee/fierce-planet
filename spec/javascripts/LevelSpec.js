describe("level-related classes", function() {

    var level;

  beforeEach(function() {
      level = new Level(1);
  });

    it("should have a series of default values", function() {
        expect(level.worldWidth).toEqual(10);
        expect(level.worldHeight).toEqual(10);
        expect(level.waveNumber).toEqual(10);
        expect(level.expiryLimit).toEqual(20);
        expect(level.initialResourceStore).toEqual(100);
        expect(level.allowOffscreenCycling).toBeFalsy();
        expect(level.allowResourcesOnPath).toBeFalsy();
        expect(level.noWander).toBeFalsy();
        expect(level.noSpeedChange).toBeFalsy();
        
        expect(level.tiles).toEqual([]);
        expect(level.levelAgents).toEqual([]);
        expect(level.waveAgents).toEqual([]);
        expect(level.currentAgents).toEqual([]);
        expect(level.cells).toEqual([]);
        expect(level.resources).toEqual([]);
        expect(level.resourceCategoryCounts).toEqual({'eco': 0, 'env': 0, 'soc': 0 });

        expect(level.tip).toBeNull();
        expect(level.introduction).toEqual("Welcome to level 1.");
        expect(level.conclusion).toEqual("Congratulations! You have completed level 1.");
        expect(level.catastrophe).toBeNull();

        expect(level.mapOptions).toBeNull();
        expect(level.mapURL).toBeNull();
        expect(level.image).toBeNull();
        expect(level.imageAttribution).toBeNull();
        expect(level.soundSrc).toBeNull();
    });

    describe("handling tiles, cells, entry and exit points", function() {
        beforeEach(function() {});

        describe("working with tiles", function() {
            beforeEach(function() {
                level.fillWithTiles();
            });

            it("should have 100 tiles", function() {
                expect(level.tiles.length).toEqual(100);
            });

            it("should have a cell at various co-ordinates between [0, 0] and [9, 9]", function() {
                for (var i = 0; i < level.worldWidth; i++) {
                    for (var j = 0; j < level.worldHeight; j++) {
                        expect(level.getCell(i, j)).toBeDefined();
                    }
                }
                expect(level.getCell(-1, -1)).toBeUndefined();
                expect(level.getCell(level.worldWidth, level.worldHeight)).toBeUndefined();
            });

            it("should have surrounding tiles", function() {
                var surroundingTiles = level.getSurroundingTiles(5, 5);
                expect(surroundingTiles.length).toEqual(4);
                surroundingTiles = level.getSurroundingTiles(0, 0);
                expect(surroundingTiles.length).toEqual(2);
                surroundingTiles = level.getSurroundingTiles(9, 9);
                expect(surroundingTiles.length).toEqual(2);
            });

            it("should be possible to set the entire tile collection", function() {
                var tiles = level.tiles;
                // At co-ordinate [0, 9]
                tiles.splice(0, 1);
                level.setTiles(tiles);
                expect(level.tiles.length).toEqual(99);
                expect(level.getCell(0, 0)).toBeUndefined();

                tiles.splice(9, 1);
                level.setTiles(tiles);
                expect(level.tiles.length).toEqual(98);
                expect(level.getCell(0, 1)).toBeUndefined();
            });

            describe("removing one tile", function() {
                beforeEach(function() {
                    level.removeTile(5, 5);
                });

                it("should have same number of tiles, but tile at this co-ordinate should be undefined", function() {
                    expect(level.tiles.length).toEqual(100);
                    expect(level.getTile(5, 5)).toBeUndefined();
                });

                it("should not have a result at the corresponding co-ordinate", function() {
                    expect(level.getCell(5, 5)).toBeUndefined();
                });

                it("should have a path corresponding to the removed tiles", function() {
                    var path = level.getPath();
                    expect(path.length).toEqual(1);
                    expect(path[0]).toEqual([5, 5]);
                });

                describe("adding a tile based on co-ordinates", function() {
                    beforeEach(function() {
                        level.addDefaultTile(5, 5);
                    });

                    it("should have 1 move tile", function() {
                        expect(level.tiles.length).toEqual(100);
                        expect(level.getTile(5, 5)).toBeDefined();
                    });

                    it("should have a result at the corresponding co-ordinate", function() {
                        expect(level.getCell(5, 5)).toBeDefined();
                    });
                });

                describe("adding a tile object", function() {
                    beforeEach(function() {
                        level.addTile(new Tile("0FFF1F", 5, 5));
                    });

                    it("should have 1 move tile", function() {
                        expect(level.tiles.length).toEqual(100);
                        expect(level.getTile(5, 5)).toBeDefined();
                    });

                    it("should have a result at the corresponding co-ordinate", function() {
                        expect(level.getCell(5, 5)).toBeDefined();
                    });
                });
            });

            describe("removing all tiles", function() {
                beforeEach(function() {
                    level.removeAllTiles();
                });

                it("should have same number of tiles, but tile at this co-ordinate should be undefined", function() {
                    expect(level.tiles.length).toEqual(100);
                    expect(level.getTile(0, 0)).toBeUndefined();
                    expect(level.getTile(5, 5)).toBeUndefined();
                    expect(level.getTile(9, 9)).toBeUndefined();
                });

                it("should not have a result at the corresponding co-ordinate", function() {
                    expect(level.getCell(0, 0)).toBeUndefined();
                    expect(level.getCell(5, 5)).toBeUndefined();
                    expect(level.getCell(9, 9)).toBeUndefined();
                });

                it("should have a path corresponding to the removed tiles", function() {
                    var path = level.getPath();
                    expect(path.length).toEqual(100);
                    expect(path[0]).toEqual([0, 0]);
                    expect(path[99]).toEqual([9, 9]);
                });
            });
            
            describe("removing selected tiles", function() {
                beforeEach(function() {
                    level.removeTiles(20, 30);
                });

                it("should have same number of tiles, but tiles at relevant co-ordinates should be undefined", function() {
                    expect(level.tiles.length).toEqual(100);
                    expect(level.getTile(0, 0)).toBeDefined();
                    expect(level.getTile(0, 2)).toBeUndefined();
                    expect(level.getTile(9, 4)).toBeUndefined();
                    expect(level.getTile(0, 5)).toBeDefined();
                });

                it("should not have a result at the corresponding co-ordinate", function() {
                    expect(level.getCell(0, 0)).toBeDefined();
                    expect(level.getCell(0, 2)).toBeUndefined();
                    expect(level.getCell(9, 4)).toBeUndefined();
                    expect(level.getCell(0, 5)).toBeDefined();
                });

                it("should have a path corresponding to the removed tiles", function() {
                    var path = level.getPath();
                    expect(path.length).toEqual(30);
                    expect(path[0]).toEqual([0, 2]);
                    expect(path[29]).toEqual([9, 4]);
                });

                describe("adding a tile based on co-ordinates", function() {
                    beforeEach(function() {
                        level.addDefaultTile(0, 2);
                    });

                    it("should have 1 move tile", function() {
                        expect(level.tiles.length).toEqual(100);
                        expect(level.getTile(0, 2)).toBeDefined();
                    });

                    it("should have a result at the corresponding co-ordinate", function() {
                        expect(level.getCell(0, 2)).toBeDefined();
                    });
                });
            });
        });


        describe("adding entry points", function() {

            beforeEach(function() {
                level.addEntryPoint(0, 0);
            });

            it("should be an entry or exit point", function() {
                expect(level.isEntryOrExitPoint(0, 0)).toBeTruthy();
                expect(level.isEntryOrExitPoint(1, 1)).toBeFalsy();
            });

            it("should have an entry point", function() {
                expect(level.entryPoints.length).toEqual(1);
                expect(level.entryPoints[0]).toEqual([0, 0]);
                expect(level.getFirstEntryPoint()).toEqual([0, 0]);
            });

            describe("removing entry points", function() {
                beforeEach(function() {
                    level.removeEntryPoint(0, 0);
                });

                it("should have no entry points", function() {
                    expect(level.entryPoints.length).toEqual(0);
                    expect(level.entryPoints[0]).toBeUndefined();
                    expect(level.getFirstEntryPoint()).toBeUndefined();
                });
            });

            describe("duplicating entry points", function() {
                beforeEach(function() {
                    level.addEntryPoint(0, 0);
                });

                it("should have just one entry point", function() {
                    expect(level.entryPoints.length).toEqual(1);
                    expect(level.entryPoints[0]).toEqual([0, 0]);
                    expect(level.getFirstEntryPoint()).toEqual([0, 0]);
                });
            });

            describe("resetting entry points", function() {
                beforeEach(function() {
                    level.resetEntryPoints();
                });

                it("should have just one entry point", function() {
                    expect(level.entryPoints.length).toEqual(1);
                    expect(level.entryPoints[0]).toEqual([0, 0]);
                    expect(level.getFirstEntryPoint()).toEqual([0, 0]);
                });
            });

            describe("adding multiple entry points", function() {
                beforeEach(function() {
                    level.addEntryPoint(9, 9);
                });

                it("should have two entry points", function() {
                    expect(level.entryPoints.length).toEqual(2);
                    expect(level.entryPoints[0]).toEqual([0, 0]);
                    expect(level.entryPoints[1]).toEqual([9, 9]);
                    expect(level.getFirstEntryPoint()).toEqual([0, 0]);
                });
            });

            describe("adding an entry point to an exit point", function() {
                beforeEach(function() {
                    level.addExitPoint(9, 9);
                    level.addEntryPoint(9, 9);
                });

                it("should have just one entry point", function() {
                    expect(level.entryPoints.length).toEqual(1);
                    expect(level.entryPoints[0]).toEqual([0, 0]);
                    expect(level.getFirstEntryPoint()).toEqual([0, 0]);
                });
            });

        });

        describe("adding exit points", function() {

            beforeEach(function() {
                level.addExitPoint(9, 9);
            });

            it("should be an entry or exit point", function() {
                expect(level.isEntryOrExitPoint(9, 9)).toBeTruthy();
            });

            it("should have an exit point", function() {
                expect(level.exitPoints.length).toEqual(1);
                expect(level.exitPoints[0]).toEqual([9, 9]);
            });

            describe("removing exit points", function() {
                beforeEach(function() {
                    level.removeExitPoint(9, 9);
                });

                it("should have no exit points", function() {
                    expect(level.exitPoints.length).toEqual(0);
                    expect(level.exitPoints[0]).toBeUndefined();
                });
            });

            describe("duplicating exit points", function() {
                beforeEach(function() {
                    level.addEntryPoint(9, 9);
                });

                it("should have just one exit point", function() {
                    expect(level.exitPoints.length).toEqual(1);
                    expect(level.exitPoints[0]).toEqual([9, 9]);
                });
            });

            describe("resetting exit points", function() {
                beforeEach(function() {
                    level.resetExitPoints();
                });

                it("should have no exit points", function() {
                    expect(level.exitPoints.length).toEqual(0);
                    expect(level.exitPoints[0]).toBeUndefined();
                });
            });

            describe("adding multiple exit points", function() {
                beforeEach(function() {
                    level.addExitPoint(5, 5);
                });

                it("should have two exit points", function() {
                    expect(level.exitPoints.length).toEqual(2);
                    expect(level.exitPoints[0]).toEqual([9, 9]);
                    expect(level.exitPoints[1]).toEqual([5, 5]);
                });
            });

            describe("adding an exit point to an entry point", function() {
                beforeEach(function() {
                    level.addEntryPoint(9, 9);
                    level.addExitPoint(9, 9);
                });

                it("should have just one exit point", function() {
                    expect(level.exitPoints.length).toEqual(1);
                    expect(level.exitPoints[0]).toEqual([9, 9]);
                });
            });

        });

    });


    describe("handling resources", function() {
        var resource;
        beforeEach(function() {
            resource = new Resource(World.resourceTypes[0], 0, 0);
            level.setResources([resource]);
        });

        it("should have 1 resource", function() {
          expect(level.resources.length).toEqual(1);
        });

        it("should have the correct resource category counts", function() {
          expect(level.getResourceCategoryProportion("eco")).toEqual(1);
          expect(level.getResourceCategoryProportion("env")).toEqual(0);
          expect(level.getResourceCategoryProportion("soc")).toEqual(0);
        });

        it("should have the correct resource category proportions", function() {
          expect(level.getResourceCategoryProportion("eco")).toEqual(1);
          expect(level.getResourceCategoryProportion("env")).toEqual(0);
          expect(level.getResourceCategoryProportion("soc")).toEqual(0);
        });

        it("should determine the index of a particular resource", function() {
          expect(level.getCurrentResourceIndex(resource)).toEqual(0);
            var nonexistingResource = new Resource(World.resourceTypes[1], 1, 1)
          expect(level.getCurrentResourceIndex(nonexistingResource)).toEqual(-1);
        });

        it("should determine whether a given position is occupied by a resource", function() {
          expect(level.isPositionOccupiedByResource(0, 0)).toBeTruthy();
          expect(level.isPositionOccupiedByResource(1, 1)).toBeFalsy();
        });


        it("should be able to reset resource yields", function() {
            var resource = level.resources[0];
            expect(resource.initialTotalYield).toEqual(100);
            resource.totalYield = (50);
            expect(resource.totalYield).toEqual(50);
            level.resetResourceYields();
            expect(resource.totalYield).toEqual(100);
        });

        it("should be able to increment resource yields", function() {
            var resource = level.resources[0];
            expect(resource.initialTotalYield).toEqual(100);
            resource.totalYield = (99);
            expect(resource.totalYield).toEqual(99);
            level.recoverResources();
            expect(resource.totalYield).toEqual(100);

            // Make sure recovery stops at 100
            level.recoverResources();
            expect(resource.totalYield).toEqual(100);
        });


        describe("handling multiple resources", function() {
            beforeEach(function() {
                var neigbour = new Resource(World.resourceTypes[1], 1, 0);
                level.addResource(neigbour);
            });

            it("should have 2 resource", function() {
              expect(level.resources.length).toEqual(2);
            });

            it("should have the correct resource category counts", function() {
              expect(level.getResourceCategoryCount("eco")).toEqual(1);
              expect(level.getResourceCategoryCount("env")).toEqual(1);
              expect(level.getResourceCategoryCount("soc")).toEqual(0);
            });

            it("should have the correct resource category proportions", function() {
              expect(level.getResourceCategoryProportion("eco")).toEqual(0.5);
              expect(level.getResourceCategoryProportion("env")).toEqual(0.5);
              expect(level.getResourceCategoryProportion("soc")).toEqual(0);
            });

            it("should have calculate the correct effect", function() {
                var resource = level.resources[0];
                expect(level.calculateResourceEffect(resource)).toEqual(1);
                // Without resource mix
                expect(level.calculateResourceEffect(resource, true)).toEqual(1);
                // With resource mix
                expect(level.calculateResourceEffect(resource, false)).toEqual(1);
                // With resource tension
                expect(level.calculateResourceEffect(resource, false, true)).toEqual(1);
            });



        });

        describe("handling a more complex resource mix", function() {
            beforeEach(function() {
                World.settings.resourcesInTension = false;
                World.settings.ignoreResourceBalance = false;
                World.settings.applyGeneralHealth = false;

                // Make the first type increase effects on other types
                World.resourceCategories[0].setEvaluateOtherCategoryImpact(function(otherCategory) { return 2;});
                // Make the second type decrease effects on other types
                World.resourceCategories[1].setEvaluateOtherCategoryImpact(function(otherCategory) { return 0.5;});
                var neigbour1 = new Resource(World.resourceTypes[1], 1, 0);
                var neigbour2 = new Resource(World.resourceTypes[2], 2, 0);
                var neigbour3 = new Resource(World.resourceTypes[0], 3, 0);
                level.addResource(neigbour1);
                level.addResource(neigbour2);
                level.addResource(neigbour3);
            });

            it("should have 4 resources", function() {
              expect(level.resources.length).toEqual(4);
            });

            it("should have the correct resource category counts", function() {
              expect(level.getResourceCategoryCount("eco")).toEqual(2);
              expect(level.getResourceCategoryCount("env")).toEqual(1);
              expect(level.getResourceCategoryCount("soc")).toEqual(1);
            });

            it("should have the correct resource category proportions", function() {
              expect(level.getResourceCategoryProportion("eco")).toEqual(0.5);
              expect(level.getResourceCategoryProportion("env")).toEqual(0.25);
              expect(level.getResourceCategoryProportion("soc")).toEqual(0.25);
            });

            it("should have calculate the correct effect of neighbours on a resource", function() {
                var resource = level.resources[0];
                // Because the balance is out of proportion
                expect(Math.round(level.calculateResourceEffect(resource) * 1000) / 1000).toEqual(0.444);

                // With ignoring resource mix
                World.settings.ignoreResourceBalance = true;
                expect(level.calculateResourceEffect(resource, true)).toEqual(1);
                expect(level.calculateResourceEffect(resource)).toEqual(1);

                // Without ignoring resource mix
                World.settings.ignoreResourceBalance = false;
                expect(Math.round(level.calculateResourceEffect(resource, false) * 1000) / 1000).toEqual(0.444);

                // With applying general health
                World.settings.applyGeneralHealth = true;
                expect(level.calculateResourceEffect(resource, true)).toEqual(1);
                expect(level.calculateResourceEffect(resource)).toEqual(1);

                // Without ignoring resource mix
                World.settings.applyGeneralHealth = false;
                expect(Math.round(level.calculateResourceEffect(resource, false) * 1000) / 1000).toEqual(0.444);

                // With resource tension
                World.settings.resourcesInTension = true;
                expect(Math.round(level.calculateResourceEffect(resource, false, true) * 1000) / 1000).toEqual(0.889);
                expect(Math.round(level.calculateResourceEffect(resource, false) * 1000) / 1000).toEqual(0.889);

                // Test other resource tensions
                expect(Math.round(level.calculateResourceEffect(level.resources[1], false, true) * 1000) / 1000).toEqual(0.25);
                expect(Math.round(level.calculateResourceEffect(level.resources[2], false, true) * 1000) / 1000).toEqual(1);
                expect(Math.round(level.calculateResourceEffect(level.resources[1], false) * 1000) / 1000).toEqual(0.25);
                expect(Math.round(level.calculateResourceEffect(level.resources[2], false) * 1000) / 1000).toEqual(1);
            });


            it("should have 3 resources when a resource is removed", function() {
                level.removeResource(level.resources[0]);
              expect(level.resources.length).toEqual(3);
            });


            it("should have the correct resource category counts when a resource is removed", function() {
                level.removeResource(level.resources[0]);
              expect(level.getResourceCategoryCount("eco")).toEqual(1);
              expect(level.getResourceCategoryCount("env")).toEqual(1);
              expect(level.getResourceCategoryCount("soc")).toEqual(1);
            });

            afterEach(function() {
                World.settings.resourcesInTension = false;
                World.settings.ignoreResourceBalance = false;
                World.settings.applyGeneralHealth = false;

            });

        });

        describe("handling impacts of all resources", function() {
            beforeEach(function() {
                World.settings.resourcesInTensionGlobally = true;
                var neigbour1 = new Resource(World.resourceTypes[1], 1, 1);
                var neigbour2 = new Resource(World.resourceTypes[2], 5, 5);
                var neigbour3 = new Resource(World.resourceTypes[0], 9, 9);
                level.addResource(neigbour1);
                level.addResource(neigbour2);
                level.addResource(neigbour3);
            });

            it("should have calculate the correct effect of remote resources on a resource, when resourcesInTensionGlobally is set", function() {
                var resource = level.resources[0];
                // With resource tension
                expect(Math.round(level.calculateResourceEffect(resource, false, true) * 1000) / 1000).toEqual(3.556);
                // Test other resource tensions
                expect(Math.round(level.calculateResourceEffect(level.resources[1], false, true) * 1000) / 1000).toEqual(0.125);
                expect(Math.round(level.calculateResourceEffect(level.resources[2], false, true) * 1000) / 1000).toEqual(1);
            });

            afterEach(function() {
                World.settings.resourcesInTensionGlobally = false;
            });
        });

    });


    describe("handling agents", function() {
        beforeEach(function() {
            level.addEntryPoint(0, 0);
            level.generateAgents(World.agentTypes[0], 10);
        });

        it("should generate a set of standard agents at the entry point", function() {
            expect(level.currentAgents.length).toEqual(10);
        });

        it("should retrieve an agent by an ID", function() {
            var agent = level.currentAgents[0];
            expect(level.getAgentByID(agent.id)).toEqual(agent);
        });

        it("should calculate the correct number of total saveable agents", function() {
            expect(level.getTotalSaveableAgents()).toEqual(55);
        });


        describe("handling level agents", function() {
            beforeEach(function() {
                level.addLevelAgent(new Agent(World.agentTypes[0], 0, 0));
                level.generateAgents(World.agentTypes[0], 10);
            });

            it("should add a level agent to the current agents", function() {
                expect(level.levelAgents.length).toEqual(1);
                expect(level.currentAgents.length).toEqual(11);
            });
        });

        describe("handling wave agents", function() {
            beforeEach(function() {
                level.addWaveAgent(new Agent(World.agentTypes[0], 0, 0));
                level.generateAgents(World.agentTypes[0], 10);
            });

            it("should add a set of wave agent to the current agents", function() {
                expect(level.waveAgents.length).toEqual(1);
                expect(level.currentAgents.length).toEqual(20);
            });
        });

        describe("random initial health dilution", function() {
            beforeEach(function() {
                World.settings.agentsHaveRandomInitialHealth = true;
                level.generateAgents(World.agentTypes[0], 10);
            });

            it("should have less than 100 health", function() {
                expect(level.currentAgents[0].health).toBeLessThan(100);
            });

            afterEach(function() {
                World.settings.agentsHaveRandomInitialHealth = false;
            });
        });

        describe("adding multiple entry points", function() {
            beforeEach(function() {
                level.addEntryPoint(9, 9);
            });

            it("should generate 2 x the number of agents", function() {
                level.generateAgents(World.agentTypes[0], 10);
                expect(level.currentAgents.length).toEqual(20);
            });

            describe("handling level agents", function() {
                beforeEach(function() {
                    level.addLevelAgent(new Agent(World.agentTypes[0], 0, 0));
                });

                it("should add only one level agent to the current agents", function() {
                    level.generateAgents(World.agentTypes[0], 10);
                    expect(level.levelAgents.length).toEqual(1);
                    expect(level.currentAgents.length).toEqual(21);
                });
            });

            describe("handling wave agents", function() {
                beforeEach(function() {
                    level.addWaveAgent(new Agent(World.agentTypes[0], 0, 0));
                });

                it("should add only one set of wave agent to the current agents", function() {
                    level.generateAgents(World.agentTypes[0], 10);
                    expect(level.waveAgents.length).toEqual(1);
                    expect(level.currentAgents.length).toEqual(30);
                });
            });
        });


        describe("processing neighbouring resources", function() {
            var agent, resource;

            beforeEach(function() {
                level.generateAgents(World.agentTypes[0], 10);
                level.addResource(new Resource(World.resourceTypes[0], 1, 1));
                agent = level.currentAgents[0];
                resource = level.resources[0];
                agent.adjustGeneralHealth(-90);
            });

            it("should get a benefit from a neighbouring resource", function() {
                level.processNeighbouringResources(agent);

                expect(agent.getHealthForResource(resource)).toEqual(70);
                expect(resource.totalYield).toEqual(80);
            });
        });

        describe("processing neighbouring agents", function() {
            var hittingAgent, hitAgent;

            beforeEach(function() {
                World.settings.predatorsVisible = true;
                World.agentTypes[0].isHitable = (true);
                World.agentTypes[1].canHit = (true);
                hittingAgent = new Agent(World.agentTypes[1], 0, 0);
                level.addLevelAgent(hittingAgent);
                level.generateAgents(World.agentTypes[0], 10);
                hitAgent = level.currentAgents[0];
            });

            it("should be hit by a neighbouring agent", function() {
                level.processNeighbouringAgents(hitAgent);
                expect(hitAgent.isHit).toBeTruthy();
            });
        });

    });

    describe("serialization", function() {
        beforeEach(function() {

        });

        it("should be serializable to JSON", function() {
            var json = $.toJSON(level);
            expect(json).toBeDefined();
        });


        it("should be serializable to JSON with tiles", function() {
            level.fillWithTiles();
            var json = $.toJSON(level);
            expect(json).toBeDefined();
        });


        it("should be serializable to JSON with resources", function() {
            var resource = new Resource(World.resourceTypes[0], 0, 0);
            level.setResources([resource]);
            var json = $.toJSON(level);
            expect(json).toBeDefined();
        });



    });


});