
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

        it("should have a per agent yield of 20", function() {
          expect(resource.getPerAgentYield()).toEqual(20);
        });

        it("should have a total yield of 100", function() {
          expect(resource.getTotalYield()).toEqual(100);
        });

        describe("providing a yield", function() {
            var agent;

            beforeEach(function() {
                agent = new Agent(World.agentTypes[0], 0, 0);
            });

            it("should not yield anything to an agent in full health", function() {
                resource.provideYield(agent, 10, false);
                expect(resource.getTotalYield()).toEqual(100);
                expect(agent.getHealth()).toEqual(100);
                expect(agent.getHealthForResource(resource)).toEqual(100);
            });

            it("should yield health for this resource category", function() {
                agent.adjustGeneralHealth(-90);
                resource.provideYield(agent, 1, false);
                expect(resource.getTotalYield()).toEqual(80);
                expect(agent.getHealth() + 0.5 | 0).toEqual(30);
                expect(agent.getHealthForResource(resource)).toEqual(70);
            });

            it("should yield less health for this resource category with a smaller resource effect", function() {
                agent.adjustGeneralHealth(-90);
                resource.provideYield(agent, 0.5, false);
                expect(resource.getTotalYield()).toEqual(80);
                expect(agent.getHealth() + 0.5 | 0).toEqual(20);
                expect(agent.getHealthForResource(resource)).toEqual(40);
            });
        }); 
    });


});