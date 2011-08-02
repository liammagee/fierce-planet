// Top level anonymous function for defining some general resource categories and types
(function() {

    // Create categories
    var ecoResourceCategory = new ResourceCategory("Economic", "eco", "44ABE0");
    var envResourceCategory = new ResourceCategory("Environmental", "env", "CBDB2A");
    var socResourceCategory = new ResourceCategory("Social", "soc", "DE1F2A");

    // Create types
    var ecoResourceType = new ResourceType("Farm", "farm", "", 10, 20, 100, 20);
    var envResourceType = new ResourceType("Water", "water", "", 10, 20, 100, 10);
    var socResourceType = new ResourceType("Clinic", "clinic", "", 10, 20, 100, 5);

    // Assign categories to types
    ecoResourceType.category = (ecoResourceCategory);
    envResourceType.category = (envResourceCategory);
    socResourceType.category = (socResourceCategory);

    var resourceCategories = [ecoResourceCategory, envResourceCategory, socResourceCategory];
    var resourceTypes = [ecoResourceType, envResourceType, socResourceType];

    // Create agent types
    var citizenAgentType = new AgentType("citizen", "000", resourceCategories);
    var predatorAgentType = new AgentType("predator", "000", resourceCategories);
    var agentTypes = [citizenAgentType, predatorAgentType];

    World.registerResourceCategories(resourceCategories);
    World.registerResourceTypes(resourceTypes);
    World.registerAgentTypes(agentTypes);
})();


describe("world-related classes", function() {

    beforeEach(function() {
    });

    describe("world", function() {
        it("should have 3 resource categories", function() {
            expect(World.resourceCategories.length).toEqual(3);
        });

        it("should have 3 resource types", function() {
            expect(World.resourceTypes.length).toEqual(3);
        });

        it("should have 2 agent types", function() {
            expect(World.agentTypes.length).toEqual(2);
        });

        it("should resolve a type given its code", function() {
            expect(World.resolveResourceType("farm")).toEqual(World.resourceTypes[0]);
            expect(World.resolveResourceType("water")).toEqual(World.resourceTypes[1]);
            expect(World.resolveResourceType("clinic")).toEqual(World.resourceTypes[2]);
            expect(World.resolveResourceType("legal")).toBeUndefined();
        });

        describe("adding a different namespace", function() {
            beforeEach(function() {
                World.resourceTypeNamespace = {};
                World.resourceTypeNamespace.name = "Triple bottom line";
            });

            it("should have a namespace", function() {
                expect(World.resourceTypeNamespace).toBeDefined();
            });
        });


        describe("storing and retrieving setting properties", function() {

            beforeEach(function() {
            });

            it("should have default settings", function() {
                expect(World.settings.agentsCanCommunicate).toBeTruthy();
                expect(World.settings.agentsHaveRandomInitialHealth).toBeFalsy();
                expect(World.settings.agentsCanAdjustSpeed).toBeTruthy();
                expect(World.settings.agentsCanAdjustWander).toBeTruthy();
                expect(World.settings.agentCostPerMove).toEqual(World.settings.DEFAULT_AGENT_COST_PER_MOVE);

                expect(World.settings.resourcesUpgradeable).toBeFalsy();
                expect(World.settings.resourcesInTension).toBeFalsy();
                expect(World.settings.resourcesInTensionGlobally).toBeFalsy();
                expect(World.settings.resourceBonus).toBeFalsy();
                expect(World.settings.applyGeneralHealth).toBeFalsy();
                expect(World.settings.ignoreResourceBalance).toBeFalsy();
                expect(World.settings.rateOfResourceRecovery).toEqual(World.settings.DEFAULT_RESOURCE_RECOVERY_RATE);
            });

            it("should be possible to set property settings", function() {
                World.settings.agentsCanCommunicate = false;
                expect(World.settings.agentsCanCommunicate).toBeFalsy();
                World.settings.agentsHaveRandomInitialHealth = true;
                expect(World.settings.agentsHaveRandomInitialHealth).toBeTruthy();
                World.settings.resourcesUpgradeable = true;
                expect(World.settings.resourcesUpgradeable).toBeTruthy();
                World.settings.resourcesInTension = true;
                expect(World.settings.resourcesInTension).toBeTruthy();
                World.settings.resourcesInTensionGlobally = true;
                expect(World.settings.resourcesInTensionGlobally).toBeTruthy();
                World.settings.resourceBonus = true;
                expect(World.settings.resourceBonus).toBeTruthy();
                World.settings.applyGeneralHealth = true;
                expect(World.settings.applyGeneralHealth).toBeTruthy();
                World.settings.ignoreResourceBalance = true;
                expect(World.settings.ignoreResourceBalance).toBeTruthy();

                World.settings.agentCostPerMove = -4;
                expect(World.settings.agentCostPerMove).toNotEqual(World.settings.DEFAULT_AGENT_COST_PER_MOVE);
                World.settings.rateOfResourceRecovery = 3;
                expect(World.settings.rateOfResourceRecovery).toNotEqual(World.settings.DEFAULT_RESOURCE_RECOVERY_RATE);
            });

            it("should be possible to store arbitrary properties", function() {
                expect(World.settings.someArbitraryProperty).toBeUndefined();
                World.settings.someArbitraryProperty = true;
                expect(World.settings.someArbitraryProperty).toBeTruthy();
                World.settings.someArbitraryProperty = false;
                expect(World.settings.someArbitraryProperty).toBeFalsy();
            });

            describe("reset property values", function() {
                beforeEach(function() {
                    World.settings.agentsCanCommunicate = false;
                });

                it("should have a new value", function() {
                    expect(World.settings.agentsCanCommunicate).toBeFalsy();
                });

                it("should have a new value", function() {
                    initWorld.apply(World);
                    expect(World.settings.agentsCanCommunicate).toBeTruthy();
                });
            });


            describe("saving and loading setting properties", function() {
                var settingsAsJSON;
                var proxyLocalStorage;

                beforeEach(function() {
                    // If in a non-browser environment, construct a proxy
                    proxyLocalStorage = localStorage || {};
                    World.settings.agentsCanCommunicate = true;
                    settingsAsJSON = World.settings.toJSON();
                });

                it("should settings string to exist", function() {
                    expect(settingsAsJSON).toBeDefined();
                });

                it("should be possible to save settings as JSON", function() {
                    World.settings.agentsCanCommunicate = false;
                    expect(World.settings.agentsCanCommunicate).toBeFalsy();

                    // Restore settings
                    World.settings.parseJSON(settingsAsJSON);
                    expect(World.settings.agentsCanCommunicate).toBeTruthy();
                });

                it("should be possible to save and load settings from local storage, explicitly", function() {
                    localStorage.settings = World.settings.toJSON();
                    expect(localStorage.settings).toBeDefined();

                    World.settings.agentsCanCommunicate = false;
                    expect(World.settings.agentsCanCommunicate).toBeFalsy();

                    // Restore settings
                    World.settings.parseJSON(localStorage.settings);
                    expect(World.settings.agentsCanCommunicate).toBeTruthy();
                });

                it("should be possible to save and load settings from local storage, implicitly", function() {
                    World.settings.store();

                    World.settings.agentsCanCommunicate = false;
                    expect(World.settings.agentsCanCommunicate).toBeFalsy();

                    // Restore settings
                    World.settings.load();
                    expect(World.settings.agentsCanCommunicate).toBeTruthy();
                });

                it("should throw an error when invalid JSON is passed in", function() {
                    World.settings.agentsCanCommunicate = false;
                    
                    expect(World.settings.parseJSON(null)).toBeUndefined();
                    expect(World.settings.parseJSON("")).toBeUndefined();
                    expect(World.settings.parseJSON([])).toBeUndefined();
                    expect(World.settings.parseJSON({})).toBeUndefined();
                    expect(World.settings.parseJSON(undefined)).toBeUndefined();

                    // Settings properties should be undisturbed
                    expect(World.settings.agentsCanCommunicate).toBeFalsy();
                });
            });

        });
    });


});