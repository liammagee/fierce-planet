describe("resource-related classes", function() {
  var ecoResourceCategory;
  var envResourceCategory;
  var socResourceCategory;
  var ecoResourceType;
  var envResourceType;
  var socResourceType;
  var resourceCategories;
  var resourceTypes;
  var resource;

  beforeEach(function() {
      // Create categories
      ecoResourceCategory = new ResourceCategory("Economic", "eco", "44ABE0");
      envResourceCategory = new ResourceCategory("Environmental", "env", "CBDB2A");
      socResourceCategory = new ResourceCategory("Social", "soc", "DE1F2A");

      // Create types
      ecoResourceType = new ResourceType("Farm", "farm", "", 10, 20, 100, 20);
      envResourceType = new ResourceType("Water", "water", "", 10, 20, 100, 10);
      socResourceType = new ResourceType("Clinic", "clinic", "", 10, 20, 100, 5);

      // Assign categories to types
      ecoResourceType.setCategory(ecoResourceCategory);
      envResourceType.setCategory(envResourceCategory);
      socResourceType.setCategory(socResourceCategory);
      
      resourceCategories = [ecoResourceCategory, envResourceCategory, socResourceCategory];
      resourceTypes = [ecoResourceType, envResourceType, socResourceType];

      resource = new Resource(ecoResourceType, 0, 0);
  });

    describe("a resource type", function() {
        it("should have a category", function() {
          expect(ecoResourceType.getCategory()).toEqual(ecoResourceCategory);
        });

    });

    describe("a resource", function() {
        it("should have a category", function() {
          expect(ecoResourceType.getCategory()).toEqual(ecoResourceCategory);
        });

    });


});