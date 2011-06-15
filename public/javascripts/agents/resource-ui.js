/**
 * Functions for handling resource-related UI events
 */

var ResourceUI = {

    // Handle various resource-related interactions
    setupResourceInteraction: function () {
        var links = $('.eco, .env, .soc'), el = null;
        for (var i = 0; i < links.length; i++) {
          el = links[i];

          el.setAttribute('draggable', 'true');
          el.addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'copy'; // only dropEffect='copy' will be dropable
            e.dataTransfer.setData('Text', this.id); // required otherwise doesn't work
              currentResourceId = this.id;
          }, false);
          el.addEventListener('click', function (e) {
              currentResourceId = this.id;
          }, false);
        }

        var world = $('#c4')[0];


        world.addEventListener('click', function (e) {
            if (e.preventDefault) e.preventDefault(); // allows us to drop
            if (! inDesignMode)
                showUpgradeDeleteDialog(e);
            return false;
          }, false);

        world.addEventListener('dragstart', function (e) {
            if (e.preventDefault) e.preventDefault(); // allows us to drop
            this.className = 'over';
            e.dataTransfer.dropEffect = 'copy';
            return false;
          }, false);
        world.addEventListener('dragover', function (e) {
            if (e.preventDefault) e.preventDefault(); // allows us to drop
            this.className = 'over';
            e.dataTransfer.dropEffect = 'copy';
            return false;
          }, false);
        world.addEventListener('dragenter', function (e) {
            this.className = 'over';
            return false;
          }, false);
        world.addEventListener('dragleave', function (e) {
            this.className = '';
          }, false);
        world.addEventListener('drop', function (e) {
            if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???
            this.className = '';
            ResourceUI.dropItem(e);
          }, false);
    },



    // Delete the current resource
    deleteCurrentResource: function () {
        var foundResource = ResourceUI.getCurrentResourceIndex();
        if (foundResource > -1) {
            resourcesInStore += 5;
            resourcesSpent -= 5;
            currentLevel.getResources().splice(foundResource, 1);
            drawResourcesInStore();
            clearCanvas('c2');
            drawResources();
        }
    },

    // Upgrade the current page (NOTE: SHOULD BE TIED TO PROFILE CAPABILITIES
    upgradeCurrentResource: function () {
        var foundResource = ResourceUI.getCurrentResourceIndex();
        if (foundResource > -1) {
            var p = currentLevel.getResources()[i];
            if (p.getUpgradeLevel() <= 4 && resourcesInStore >= p.getUpgradeCost()) {
                resourcesInStore -= p.getUpgradeCost();
                resourcesSpent += p.getUpgradeCost();
                p.setUpgradeLevel(p.getUpgradeLevel() + 1);
                drawResource(p);
                drawResourcesInStore();
            }
        }
    },

    dropItem: function(e) {
        var __ret = getCurrentPosition(e);
        var posX = __ret.posX;
        var posY = __ret.posY;
        if (currentLevel.getCell(posX, posY) == undefined && ! currentLevel.getAllowResourcesOnPath())
            return;
        for (var i = 0; i < currentLevel.getResources().length; i++) {
            var p = currentLevel.getResources()[i];
            if (p.getX() == posX && p.getY() == posY) {
                return;
            }
        }

        var resourceCode = currentResourceId;
        if (e.dataTransfer)
            resourceCode = e.dataTransfer.getData('Text');

        var kind = resolveResourceKind(resourceCode);
        var resource = new Resource(kind, posX, posY);

        if (resourcesInStore < resource.getCost()) {
            notify('Not enough goodness for now - save some more agents!');
            return;
        }
        else {
            resourcesInStore -= resource.getCost();
            resourcesSpent += resource.getCost();
            currentLevel.getResources().push(resource);
            if (resource.getType() == 'eco') {
                economicResourceCount += 1;
            }
            else if (resource.getType() == 'env') {
                environmentalResourceCount += 1;
            }
            else if (resource.getType() == 'soc') {
                socialResourceCount += 1;
            }
            currentLevel.addCell(posX, posY, resource);

            drawResource(resource);
            drawResourcesInStore();
        }
    },

    // Find the current resource index
    getCurrentResourceIndex: function () {
        for (var i = 0; i < currentLevel.getResources().length; i++) {
            var p = resources[i];
            if (p == currentResource) {
                return i;
            }
        }
        return -1;
    },


    /*
    Calculates the proportion of a particular resource type, relative to the overall number of resources, then returns a log derivative (so minor variations have minimal impact).
    If the global variable ignoreResourceBalance is true, this calculation is ignored.
    If the global variable resourcesInTension is true, this calculation is further adjusted by the proximity of other resources.
     */
    calculateResourceEffect: function (resource) {
        // Allow this calculation to be ignored
        if (ignoreResourceBalance || applyGeneralHealth)
            return 1;

        var resourceType = resource.getType();
        var resourceTypeCount = 0;
        var totalResources = currentLevel.getResources().length;
        if (totalResources == 1)
            return 1;
        if (resourceType == "eco") {
            resourceTypeCount = economicResourceCount;
        }
        else if (resourceType == "env") {
            resourceTypeCount = environmentalResourceCount;
        }
        else if (resourceType == "soc") {
            resourceTypeCount = socialResourceCount;
        }
        var resourceTypeProportion = (resourceTypeCount / totalResources) * totalResources;
        var proportionOfIdeal = (resourceTypeProportion <= 1) ? resourceTypeProportion : ((totalResources - resourceTypeProportion) / (totalResources - 1));
        var effect = proportionOfIdeal * proportionOfIdeal;

        // Further adjustment based on surrounding resources
        if (resourcesInTension) {
            effect *= ResourceUI.calculateSurroundingResourcesEffects(resource);
        }
        return effect;
    },

    /*
    Calculates the effect of surrounding resources
     */
    calculateSurroundingResourcesEffects: function (resource) {
        var x = resource.getX();
        var y = resource.getY();
        var resourceType = resource.getType();
        var baseEffect = 1;
        for (var j = 0; j < currentLevel.getResources().length; j++) {
            var neighbour = currentLevel.getResources()[j];
            var nx = neighbour.getX();
            var ny = neighbour.getY();
            var nType = neighbour.getType();
            if (Math.abs(nx - x) <= 1 && Math.abs(ny - y) <= 1) {
                if (resourceType == "eco") {
                    if (nType == "eco") {
                        baseEffect *= 1.2;
                    }
                    else if (nType == "env") {
                        baseEffect *= 1.0;
                    }
                    else if (nType == "soc") {
                        baseEffect *= 1.0;
                    }
                }
                else if (resourceType == "env") {
                    if (nType == "eco") {
                        baseEffect *= 0.5;
                    }
                    else if (nType == "env") {
                        baseEffect *= 1.2;
                    }
                    else if (nType == "soc") {
                        baseEffect *= 1.0;
                    }
                }
                else if (resourceType == "soc") {
                    if (nType == "eco") {
                        baseEffect *= 0.5;
                    }
                    else if (nType == "env") {
                        baseEffect *= 1.0;
                    }
                    else if (nType == "soc") {
                        baseEffect *= 1.2;
                    }
                }
            }
        }
        return baseEffect;
    },


    recoverResources: function () {
        for (var j = 0; j < currentLevel.getResources().length; j++) {
            var p = currentLevel.getResources()[j];
            /* Test code for restoring resource health, as opposed to resetting at the end of each wave */
            if (p.getTotalYield() < p.getInitialTotalYield()) {
                /* Overly generous... */
    //            p.setTotalYield(p.getTotalYield() + p.getPerAgentYield());
                p.setTotalYield(p.getTotalYield() + 1);
                drawResource(p);
            }
        }
    },

    resetResourceYields: function () {
        for (var i = 0; i < currentLevel.getResources().length; i++) {
            var p = currentLevel.getResources()[i];
            p.setTotalYield(p.getInitialTotalYield());
        }
    }
};