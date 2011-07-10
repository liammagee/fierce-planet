
describe("resource-related classes", function() {
  var resource;

  beforeEach(function() {
      resource = new Resource(World.resourceTypes[0], 0, 0);
  });

    describe("a resource type", function() {
        it("should have a category", function() {
          expect(World.resourceTypes[0].getCategory()).toEqual(World.resourceCategories[0]);
        });

    });

    describe("a resource", function() {
        it("should have a category", function() {
          expect(resource.getCategory()).toEqual(World.resourceCategories[0]);
        });
        it("should have a type", function() {
          expect(resource.getType()).toEqual(World.resourceTypes[0]);
        });

    });


});