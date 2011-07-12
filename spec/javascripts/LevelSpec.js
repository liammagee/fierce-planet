describe("level-related classes", function() {

    var level;

  beforeEach(function() {
      level = new Level(1);
  });


    describe("handling tiles, cells, entry and exit points", function() {
        beforeEach(function() {
        });

        it("should do something with tiles", function() {
        });

        it("should do something with cells", function() {
        });

        it("should do something with entry points", function() {
        });

        it("should do something with exit points", function() {
        });
    });


    describe("handling resources", function() {
        var resource;
        beforeEach(function() {
            resource = new Resource(World.resourceTypes[0], 0, 0);
            level.setResources([resource]);
        });

        it("should have 1 resource", function() {
          expect(level.getResources().length).toEqual(1);
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
            var resource = level.getResources()[0];
            expect(resource.getInitialTotalYield()).toEqual(100);
            resource.setTotalYield(50);
            expect(resource.getTotalYield()).toEqual(50);
            level.resetResourceYields();
            expect(resource.getTotalYield()).toEqual(100);
        });

        it("should be able to increment resource yields", function() {
            var resource = level.getResources()[0];
            expect(resource.getInitialTotalYield()).toEqual(100);
            resource.setTotalYield(99);
            expect(resource.getTotalYield()).toEqual(99);
            level.recoverResources();
            expect(resource.getTotalYield()).toEqual(100);

            // Make sure recovery stops at 100
            level.recoverResources();
            expect(resource.getTotalYield()).toEqual(100);
        });


        describe("handling multiple resources", function() {
            beforeEach(function() {
                var neigbour = new Resource(World.resourceTypes[1], 1, 0);
                level.addResource(neigbour);
            });

            it("should have 2 resource", function() {
              expect(level.getResources().length).toEqual(2);
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
                var resource = level.getResources()[0];
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
              expect(level.getResources().length).toEqual(4);
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
                var resource = level.getResources()[0];
                // Because the balance is out of proportion
                expect(Math.round(level.calculateResourceEffect(resource) * 1000) / 1000).toEqual(0.444);
                // Without resource mix
                expect(level.calculateResourceEffect(resource, true)).toEqual(1);
                // With resource mix
                expect(Math.round(level.calculateResourceEffect(resource, false) * 1000) / 1000).toEqual(0.444);
                // With resource tension
                expect(Math.round(level.calculateResourceEffect(resource, false, true) * 1000) / 1000).toEqual(0.889);
                // Test other resource tensions
                expect(Math.round(level.calculateResourceEffect(level.getResources()[1], false, true) * 1000) / 1000).toEqual(0.25);
                expect(Math.round(level.calculateResourceEffect(level.getResources()[2], false, true) * 1000) / 1000).toEqual(1);
            });

            it("should have 3 resources when a resource is removed", function() {
                level.removeResource(level.getResources()[0]);
              expect(level.getResources().length).toEqual(3);
            });


            it("should have the correct resource category counts when a resource is removed", function() {
                level.removeResource(level.getResources()[0]);
              expect(level.getResourceCategoryCount("eco")).toEqual(1);
              expect(level.getResourceCategoryCount("env")).toEqual(1);
              expect(level.getResourceCategoryCount("soc")).toEqual(1);
            });

        });
    });


    describe("handling agents", function() {
        beforeEach(function() {
        });

        it("should do something with agents", function() {
        });
    });



});