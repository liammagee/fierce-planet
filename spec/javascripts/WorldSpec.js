


// Top level anonymous function for defining some general resource categories and types
(function(){

      // Create categories
      var ecoResourceCategory = new ResourceCategory("Economic", "eco", "44ABE0");
      var envResourceCategory = new ResourceCategory("Environmental", "env", "CBDB2A");
      var socResourceCategory = new ResourceCategory("Social", "soc", "DE1F2A");

      // Create types
      var ecoResourceType = new ResourceType("Farm", "farm", "", 10, 20, 100, 20);
      var envResourceType = new ResourceType("Water", "water", "", 10, 20, 100, 10);
      var socResourceType = new ResourceType("Clinic", "clinic", "", 10, 20, 100, 5);

      // Assign categories to types
      ecoResourceType.setCategory(ecoResourceCategory);
      envResourceType.setCategory(envResourceCategory);
      socResourceType.setCategory(socResourceCategory);

      var resourceCategories = [ecoResourceCategory, envResourceCategory, socResourceCategory];
      var resourceTypes = [ecoResourceType, envResourceType, socResourceType];

      // Create agent types
      var citizentAgentType = new AgentType("citizen", "000", resourceCategories);
      var agentTypes = [citizentAgentType];

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

        it("should have 1 agent type", function() {
          expect(World.agentTypes.length).toEqual(1);
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
    });


});