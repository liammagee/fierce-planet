/*!
 * Fierce Planet - ResourceUI
 * Functions for handling resource-related UI events
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};


/**
 * Handle various resource-related interactions
 */
FiercePlanet.setupResourceInteraction = function () {
        var links = $('.swatch-instance'), el = null;
        for (var i = 0; i < links.length; i++) {
            el = links[i];
            if (el.id && $.inArray(el.id, FiercePlanet.currentProfile.capabilities) != -1) {
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
            FiercePlanet.currentProfile.current_level_resources_in_store += 5;
            FiercePlanet.currentProfile.current_level_resources_spent -= 5;
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
            var p = FiercePlanet.currentLevel.getResources()[foundResource];
            if (p.getUpgradeLevel() <= 4 && FiercePlanet.currentProfile.current_level_resources_in_store >= p.getUpgradeCost()) {
                FiercePlanet.currentProfile.current_level_resources_in_store -= p.getUpgradeCost();
                FiercePlanet.currentProfile.current_level_resources_spent += p.getUpgradeCost();
                p.setUpgradeLevel(p.getUpgradeLevel() + 1);
                FiercePlanet.drawResource(p);
                FiercePlanet.drawResourcesInStore();
            }
        }
    };

/**
 * 'Drops' a selected resource on the tile
 * @param e
 */
FiercePlanet.dropItem = function(e) {
        var __ret = FiercePlanet.getCurrentPosition(e);
        var posX = __ret.posX;
        var posY = __ret.posY;
        if (FiercePlanet.currentLevel.getCell(posX, posY) == undefined && ! FiercePlanet.currentLevel.getAllowResourcesOnPath())
            return;
        if (FiercePlanet.isPositionOccupiedByResource(posX, posY))
            return;

        var resourceCode = FiercePlanet.currentResourceId;
        if (e.dataTransfer)
            resourceCode = e.dataTransfer.getData('Text');

        var kind = FiercePlanet.resolveResourceKind(resourceCode);
        var resource = new Resource(kind, posX, posY);

        if (FiercePlanet.currentProfile.current_level_resources_in_store < resource.getCost()) {
            FiercePlanet.currentNotice = new Notice('Not enough goodness for now - save some more agents!');
            return;
        }
        else {
            var resourceCategory = resource.getCategory().getCode();
            FiercePlanet.currentProfile.spendResource(resource);
            FiercePlanet.currentLevel.getResources().push(resource);

            FiercePlanet.drawResource(resource);
            FiercePlanet.drawResourcesInStore();

            FiercePlanet.eventTarget.fire(new Event("resource", resource, "added", FiercePlanet.gameCounter, FiercePlanet.currentLevel));
        }
        if (FiercePlanet.currentSettings.useInlineResourceSwatch)
            FiercePlanet.currentResourceId = null;
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
        if (FiercePlanet.currentSettings.ignoreResourceBalance || FiercePlanet.currentSettings.applyGeneralHealth)
            return 1;

        var resourceCategory = resource.getCategory().getCode();
        var resourceCategoryCount = 0;
        var totalResources = FiercePlanet.currentLevel.getResources().length;
        if (totalResources == 1)
            return 1;
        resourceCategoryCount = FiercePlanet.currentProfile.current_level_resources_spent_by_category[resourceCategory];
        var resourceTypeProportion = (resourceCategoryCount / totalResources) * totalResources;
        var proportionOfIdeal = (resourceTypeProportion <= 1) ? resourceTypeProportion : ((totalResources - resourceTypeProportion) / (totalResources - 1));
        var effect = proportionOfIdeal * proportionOfIdeal;

        // Further adjustment based on surrounding resources
        if (FiercePlanet.currentSettings.resourcesInTension) {
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
        var resourceCategory = resource.getCategory();
        var baseEffect = 1;
        for (var j = 0; j < FiercePlanet.currentLevel.getResources().length; j++) {
            var neighbour = FiercePlanet.currentLevel.getResources()[j];
            var nx = neighbour.getX();
            var ny = neighbour.getY();
            var neighbourCategory = neighbour.getCategory();
            if ((x != nx || ny != y) && Math.abs(nx - x) <= 1 && Math.abs(ny - y) <= 1) {
                // TODO: make this part of the ResourceCategory calculation
                baseEffect *= resourceCategory.doEvaluateOtherCategoryImpact(neighbourCategory);
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


/**
 * Generic resource kind functions
 */
FiercePlanet.resolveResourceKind = function (code) {
    for (var i = 0; i < FiercePlanet.resourceTypes.length; i++) {
        var resourceKind = FiercePlanet.resourceTypes[i];
        if (resourceKind._code == code)
            return resourceKind;
    }
    return null;
};

/**
 * Registers resource categories
 */
FiercePlanet.registerResourceCategories = function (resourceCategories) {
    FiercePlanet.resourceCategories = resourceCategories;
};

/**
 * Registers resource categories
 */
FiercePlanet.registerResourceTypes = function (resourceTypes) {
    FiercePlanet.resourceTypes = resourceTypes;
};

/**
 * Draw swatches
 */
FiercePlanet.initialiseAndLoadResources = function () {
    if (FiercePlanet.resourceTypeNamespace.doSetup)
        FiercePlanet.resourceTypeNamespace.doSetup();

    for (var i = 0; i < FiercePlanet.resourceCategories.length; i++) {
        var category = FiercePlanet.resourceCategories[i];

        // Add to swatch
        var swatchCategoryHTML = '<div class="swatch-category" id="' + category.getCode() + '"></div>';
        $('#swatch').append(swatchCategoryHTML);
        var swatchCategoryElement = $('#' + category.getCode());
        var swatchCategoryTitleHTML = '<div class="title">' + category.getName() + '</div>';
        swatchCategoryElement.append(swatchCategoryTitleHTML);
        swatchCategoryElement.css('background', '#' + category.getColor());

        // Add to gallery
        var galleryCategoryHTML = '<div class="gallery-category" id="gallery-' + category.getCode() + '"></div>';
        $('#gallery-items').append(galleryCategoryHTML);
        var galleryCategoryElement = $('#gallery-' + category.getCode());
        var galleryCategoryTitleHTML = '<div class="title">' + category.getName() + '</div>';
        galleryCategoryElement.append(galleryCategoryTitleHTML);

        var categoryInstanceCounter = 0;
        for (var j = 0; j < category._types.length; j++) {
            var resourceType = category._types[j];

            var swatchInstanceHTML =
                    '<div class="swatch-instance" id="' + resourceType.getCode() + '" title="' + resourceType.getName() + '">' +
                    '<img src="' + resourceType.getImage() + '" alt="">' +
                            '<div>' + resourceType.getCost() + '</div>' +
                    '</div>';
            swatchCategoryElement.append(swatchInstanceHTML);
            var swatchInstanceElement = $('#' + resourceType.getCode());
            if (categoryInstanceCounter > 0) {
                swatchInstanceElement.addClass('inactive');
            }

            var galleryInstanceHTML =
                    '<div class="swatch-instance purchase inactive" id="' + resourceType.getCode() + '-purchase" title="' + resourceType.getName() + '">' +
                        '<img src="' + resourceType.getImage() + '" alt="">' +
                    '</div>';
            galleryCategoryElement.append(galleryInstanceHTML);

            // Increment the category instance
            categoryInstanceCounter++;
        }
    }
};
