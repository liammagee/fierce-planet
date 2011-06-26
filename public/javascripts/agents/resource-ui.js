/*
 * Functions for handling resource-related UI events
 */


var FiercePlanet = FiercePlanet || {};


/**
 * Handle various resource-related interactions
 */
FiercePlanet.setupResourceInteraction = function () {
        var links = $('.eco, .env, .soc'), el = null;
        for (var i = 0; i < links.length; i++) {
            el = links[i];
            if (el.id && $.inArray(el.id, FiercePlanet.capabilities) != -1) {
                FiercePlanet.makeResourceActive(el);
            }
        }

        var resourceCanvas = $('#agentCanvas')[0];


        resourceCanvas.addEventListener('click', function (e) {
            if (e.preventDefault) e.preventDefault(); // allows us to drop
            if (! FiercePlanet.inDesignMode)
                FiercePlanet.showUpgradeDeleteDialog(e);
            return false;
          }, false);
//        resourceCanvas.setAttribute('draggable', 'true');

        resourceCanvas.addEventListener('dragstart', function (e) {
            if (e.preventDefault) e.preventDefault(); // allows us to drop
            this.className = 'over';
            e.dataTransfer.dropEffect = 'copy';

            /*
            TODO: Find a way to drag and drop resources
            var __ret = FiercePlanet.getCurrentPosition(e);
            var posX = __ret.posX;
            var posY = __ret.posY;
            if (FiercePlanet.currentLevel.getCell(posX, posY) instanceof Resource) {
                var resource = FiercePlanet.currentLevel.getCell(posX, posY);
                e.dataTransfer.effectAllowed = 'copy'; // only dropEffect='copy' will be dropable
                e.dataTransfer.setData('Text', resource.getName()); // required otherwise doesn't work
                FiercePlanet.currentResourceId = resource.getName();
            }
            */
            return false;
          }, false);
        resourceCanvas.addEventListener('dragover', function (e) {
            if (e.preventDefault) e.preventDefault(); // allows us to drop
            this.className = 'over';
            e.dataTransfer.dropEffect = 'copy';
            return false;
          }, false);
        resourceCanvas.addEventListener('dragenter', function (e) {
            this.className = 'over';
            return false;
          }, false);
        resourceCanvas.addEventListener('dragleave', function (e) {
            this.className = '';
          }, false);
        resourceCanvas.addEventListener('drop', function (e) {
            if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???
            this.className = '';
            FiercePlanet.dropItem(e);
          }, false);
    };

/**
 *
 * @param el
 */
FiercePlanet.makeResourceActive = function (el) {
    el.setAttribute('draggable', 'true');
    el.addEventListener('dragstart', function (e) {
        e.dataTransfer.effectAllowed = 'copy'; // only dropEffect='copy' will be dropable
        e.dataTransfer.setData('Text', this.id); // required otherwise doesn't work
        FiercePlanet.currentResourceId = this.id;
    }, false);
    el.addEventListener('click', function (e) {
        FiercePlanet.currentResourceId = this.id;
    }, false);
}


/**
 * Delete the current resource
 */
FiercePlanet.deleteCurrentResource = function () {
        var foundResource = FiercePlanet.getCurrentResourceIndex();
        if (foundResource > -1) {
            FiercePlanet.resourcesInStore += 5;
            FiercePlanet.resourcesSpent -= 5;
            FiercePlanet.currentLevel.getResources().splice(foundResource, 1);
//            FiercePlanet.currentLevel.annulCell(FiercePlanet.currentResource.getPosition()[0], FiercePlanet.currentResource.getPosition()[1]) ;
            FiercePlanet.drawResourcesInStore();
            FiercePlanet.clearCanvas('resourceCanvas');
            FiercePlanet.drawResources();
        }
    };

/**
 * Upgrade the current page (NOTE: SHOULD BE TIED TO PROFILE CAPABILITIES
 */
FiercePlanet.upgradeCurrentResource = function () {
        var foundResource = FiercePlanet.getCurrentResourceIndex();
        if (foundResource > -1) {
            var p = FiercePlanet.currentLevel.getResources()[i];
            if (p.getUpgradeLevel() <= 4 && FiercePlanet.resourcesInStore >= p.getUpgradeCost()) {
                FiercePlanet.resourcesInStore -= p.getUpgradeCost();
                FiercePlanet.resourcesSpent += p.getUpgradeCost();
                p.setUpgradeLevel(p.getUpgradeLevel() + 1);
                FiercePlanet.drawResource(p);
                FiercePlanet.drawResourcesInStore();
            }
        }
    };

/**
 *
 * @param e
 */
FiercePlanet.dropItem = function(e) {
        var __ret = FiercePlanet.getCurrentPosition(e);
        var posX = __ret.posX;
        var posY = __ret.posY;
        if (FiercePlanet.currentLevel.getCell(posX, posY) == undefined && ! FiercePlanet.currentLevel.getAllowResourcesOnPath())
            return;
//        if (FiercePlanet.currentLevel.getCell(posX, posY) instanceof Resource)
//            return;
        if (FiercePlanet.isPositionOccupiedByResource(posX, posY))
            return;

        var resourceCode = FiercePlanet.currentResourceId;
        if (e.dataTransfer)
            resourceCode = e.dataTransfer.getData('Text');

        var kind = FiercePlanet.resolveResourceKind(resourceCode);
        var resource = new Resource(kind, posX, posY);

        if (FiercePlanet.resourcesInStore < resource.getCost()) {
            FiercePlanet.notify('Not enough goodness for now - save some more agents!');
            return;
        }
        else {
            FiercePlanet.resourcesInStore -= resource.getCost();
            FiercePlanet.resourcesSpent += resource.getCost();
            if (resource.getType() == 'eco') {
                FiercePlanet.economicResourceCount += 1;
            }
            else if (resource.getType() == 'env') {
                FiercePlanet.environmentalResourceCount += 1;
            }
            else if (resource.getType() == 'soc') {
                FiercePlanet.socialResourceCount += 1;
            }
            FiercePlanet.currentLevel.getResources().push(resource);
//            FiercePlanet.currentLevel.addCell(posX, posY, resource);

            FiercePlanet.drawResource(resource);
            FiercePlanet.drawResourcesInStore();

            FiercePlanet.eventTarget.fire(new Event("resource", resource, "added", FiercePlanet.gameCounter, FiercePlanet.currentLevel));
        }
    };

/**
 * Find the current resource index
 */
FiercePlanet.getCurrentResourceIndex = function () {
        for (var i = 0; i < FiercePlanet.currentLevel.getResources().length; i++) {
            var p = FiercePlanet.currentLevel.getResources()[i];
            if (p == FiercePlanet.currentResource) {
                return i;
            }
        }
        return -1;
    };


/**
 * Find the current resource index
 */
FiercePlanet.isPositionOccupiedByResource = function (x, y) {
        for (var i = 0; i < FiercePlanet.currentLevel.getResources().length; i++) {
            var r = FiercePlanet.currentLevel.getResources()[i];
            if (r.getPosition()[0] == x && r.getPosition()[1] == y) {
                return true;
            }
        }
        return false;
    };


/**
 * Calculates the proportion of a particular resource type, relative to the overall number of resources, then returns a log derivative (so minor variations have minimal impact).
 * If the global variable FiercePlanet.ignoreResourceBalance is true, this calculation is ignored.
 * If the global variable FiercePlanet.resourcesInTension is true, this calculation is further adjusted by the proximity of other resources.
 */
FiercePlanet.calculateResourceEffect = function (resource) {
        // Allow this calculation to be ignored
        if (FiercePlanet.ignoreResourceBalance || FiercePlanet.applyGeneralHealth)
            return 1;

        var resourceType = resource.getType();
        var resourceTypeCount = 0;
        var totalResources = FiercePlanet.currentLevel.getResources().length;
        if (totalResources == 1)
            return 1;
        if (resourceType == "eco") {
            resourceTypeCount = FiercePlanet.economicResourceCount;
        }
        else if (resourceType == "env") {
            resourceTypeCount = FiercePlanet.environmentalResourceCount;
        }
        else if (resourceType == "soc") {
            resourceTypeCount = FiercePlanet.socialResourceCount;
        }
        var resourceTypeProportion = (resourceTypeCount / totalResources) * totalResources;
        var proportionOfIdeal = (resourceTypeProportion <= 1) ? resourceTypeProportion : ((totalResources - resourceTypeProportion) / (totalResources - 1));
        var effect = proportionOfIdeal * proportionOfIdeal;

        // Further adjustment based on surrounding resources
        if (FiercePlanet.resourcesInTension) {
            effect *= FiercePlanet.calculateSurroundingResourcesEffects(resource);
        }
        return effect;
    };

/**
 * Calculates the effect of surrounding resources
 */
FiercePlanet.calculateSurroundingResourcesEffects = function (resource) {
        var x = resource.getX();
        var y = resource.getY();
        var resourceType = resource.getType();
        var baseEffect = 1;
        for (var j = 0; j < FiercePlanet.currentLevel.getResources().length; j++) {
            var neighbour = FiercePlanet.currentLevel.getResources()[j];
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
    };

/**
 * Recover resources to a maximum of their initial state
 */
FiercePlanet.recoverResources = function () {
        for (var j = 0; j < FiercePlanet.currentLevel.getResources().length; j++) {
            var p = FiercePlanet.currentLevel.getResources()[j];
            /* Test code for restoring resource health, as opposed to resetting at the end of each wave */
            if (p.getTotalYield() < p.getInitialTotalYield()) {
                /* Overly generous... */
    //            p.setTotalYield(p.getTotalYield() + p.getPerAgentYield());
                p.setTotalYield(p.getTotalYield() + 1);
                FiercePlanet.drawResource(p);
            }
        }
    };

/**
 *
 */
FiercePlanet.resetResourceYields = function () {
        for (var i = 0; i < FiercePlanet.currentLevel.getResources().length; i++) {
            var p = FiercePlanet.currentLevel.getResources()[i];
            p.setTotalYield(p.getInitialTotalYield());
        }
    };
