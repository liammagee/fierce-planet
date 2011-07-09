describe("world-related classes", function() {

  beforeEach(function() {
      console.log(World);
      World.registerResourceCategories(resourceCategories);
      World.registerResourceTypes(resourceTypes);
  });

    describe("world", function() {
        it("to have 3 categories", function() {
          expect(World.resourceCategories.length).toEqual(resourceCategories.length);
          expect(World.resourceCategories).toEqual(resourceCategories);
        });

        it("to have 3 types", function() {
          expect(World.resourceTypes.length).toEqual(resourceTypes.length);
          expect(World.resourceTypes).toEqual(resourceTypes);
        });

    });


});