/*!
 * Fierce Planet - ResourceUI
 * Functions for handling resource-related UI events
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains resource UI functions
 */
FiercePlanet.ResourceUI = FiercePlanet.ResourceUI || {};

(function() {

    /**
     * Handle various resource-related interactions
     */
    this.setupResourceInteraction = function () {
        var agentCanvas = $('#agentCanvas');
            var links = $('.swatch-draggable'), el = null;
            for (var i = 0; i < links.length; i++) {
                el = links[i];
                if (el.id && $.inArray(el.id, FiercePlanet.currentProfile.capabilities) != -1) {
                    $('#' + el.id).draggable({
//                    appendTo: agentCanvas,
//                    containment: agentCanvas,
//                    grid: [FiercePlanet.cellWidth, FiercePlanet.cellHeight],
                        cursor: "pointer",
                        helper: "clone",
                        start: function(event, ui) {
                            FiercePlanet.currentResourceId = this.id;
                        }
                    });
                    $('#' + el.id).click(function() {
                        FiercePlanet.currentResourceId = this.id;
                    });
                }
            }
            agentCanvas.droppable({
                drop: function( event, ui ) {
                    var position = $(this).offset();
                    var x = event.pageX - position.left;
                    var y = event.pageY - position.top;
                    var currentPosition = FiercePlanet.GeneralUI.getCurrentPositionByCoordinates(x,y);
                    FiercePlanet.ResourceUI.dropItem(currentPosition.posX, currentPosition.posY);
                }
            });

        };


    /**
     * Process click on the resource canvas
     *
     * @param e
     */
    this.processResourceCanvasClick = function(e) {
        // Don't do anything if moving
        FiercePlanet.isMouseDown = false;
        if (FiercePlanet.isMouseMoving)
            return;
        var __ret = FiercePlanet.GeneralUI.getCurrentPosition(e);
        var posX = __ret.posX;
        var posY = __ret.posY;
        var foundResource = false;
        for (var i = 0; i < FiercePlanet.currentLevel.resources.length; i++) {
            var resource = FiercePlanet.currentLevel.resources[i];
            if (resource.x == posX && resource.y == posY) {
                FiercePlanet.currentResource = resource;
                if (confirm("Are you sure you want to delete this resource?")) {
                    FiercePlanet.ResourceUI.deleteCurrentResource();
                }
                // Do this only if we want more than a simple delete option
//            FiercePlanet.$upgradeDelete.dialog('open');
                return;
            }
        }
        var currentTile = FiercePlanet.currentLevel.getTile(posX, posY);
        if (World.settings.tilesMutable) {
            if (currentTile == undefined) {
                FiercePlanet.currentLevel.addTile(new Tile(DEFAULT_TILE_COLOR, posX, posY));
                FiercePlanet.Drawing.drawCanvases();
            }
            else if (!foundResource && FiercePlanet.currentResourceId != null) {
                FiercePlanet.ResourceUI.dropItem(posX, posY);
            }
            else {
                FiercePlanet.currentLevel.removeTile(posX, posY);
                FiercePlanet.Drawing.drawCanvases();
            }
        }
        else if (!foundResource) {
            if (FiercePlanet.currentResourceId != null) {
                FiercePlanet.ResourceUI.dropItem(posX, posY);
            }
            else if (World.settings.useInlineResourceSwatch) {
                FiercePlanet.ResourceUI.showInlineResourcePanel(e);

            }
        }

    };

    /**
     * Shows an inline resource panel
     */
    this.showInlineResourcePanel = function(e) {
        var __ret = FiercePlanet.GeneralUI.getCurrentPosition(e);
        var posX = __ret.posX;
        var posY = __ret.posY;
        if (FiercePlanet.currentLevel.getCell(posX, posY) == undefined && ! FiercePlanet.currentLevel.allowResourcesOnPath)
            return;
        if (FiercePlanet.currentLevel.isPositionOccupiedByResource(posX, posY))
            return;

        var dialogX = FiercePlanet.Dialogs.calculateWorldLeft();
        var dialogY = FiercePlanet.Dialogs.calculateWorldTop();
        var coords = FiercePlanet.GeneralUI.getWorldCoordinates(e);
        var x = coords.x;
        var y = coords.y;
        var width = 200, height = 240;
        posX = dialogX + x - (width / 2);
        posY = dialogY + y - (height / 2);
        posX = (posX < dialogX ? dialogX : (posX + width > dialogX + FiercePlanet.WORLD_WIDTH ? (dialogX + FiercePlanet.WORLD_WIDTH - width) : posX));
        posY = (posY < dialogY ? dialogY : (posY + height > dialogY + FiercePlanet.WORLD_HEIGHT ? (dialogY + FiercePlanet.WORLD_HEIGHT - height) : posY));

        var swatchCopy = $('#swatch').clone();
        swatchCopy.attr('id', 'inline-swatch');
        swatchCopy.css('left', 0);
        swatchCopy.css('top', 0);
        //FiercePlanet.drawInlineSwatch()
        FiercePlanet.inlineResourcePanel = $('<div></div>')
            .html(swatchCopy)
            .dialog({
               title: 'Add a Resource',
                position: [posX, posY],
                width: width,
                height: height,
                autoOpen: false,
                modal: true
            });
        $('#inline-swatch div[class="title"]').remove();
        var links = $('#inline-swatch .swatch-instance'), el = null;
        for (var i = 0; i < links.length; i++) {
            el = links[i];
            if (el.id && $.inArray(el.id, FiercePlanet.currentProfile.capabilities) != -1) {
                el.addEventListener('click', function (event) {
                    var __ret = FiercePlanet.GeneralUI.getCurrentPosition(e);
                    var posX = __ret.posX;
                    var posY = __ret.posY;
                    if (FiercePlanet.currentLevel.getCell(posX, posY) == undefined && ! FiercePlanet.currentLevel.allowResourcesOnPath)
                        return;
                    if (FiercePlanet.currentLevel.isPositionOccupiedByResource(posX, posY))
                        return;

                    FiercePlanet.currentResourceId = this.id;
                    FiercePlanet.ResourceUI.dropItem(posX, posY);
                    FiercePlanet.currentResourceId = null;
                    FiercePlanet.inlineResourcePanel.dialog('close');
                }, false);

            }
        }
        FiercePlanet.inlineResourcePanel.dialog('open');
    };


    /**
     * Delete the current resource
     */
    this.deleteCurrentResource = function () {
        var foundResource = FiercePlanet.currentLevel.getCurrentResourceIndex(FiercePlanet.currentResource);
        if (foundResource > -1) {
            FiercePlanet.currentProfile.current_level_resources_in_store += 5;
            FiercePlanet.currentProfile.current_level_resources_spent -= 5;
//            FiercePlanet.currentLevel.resources.splice(foundResource, 1);
            FiercePlanet.currentLevel.removeResource(FiercePlanet.currentResource);
            FiercePlanet.Drawing.drawResourcesInStore();
            FiercePlanet.Drawing.clearResource(FiercePlanet.currentResource);
        }
    };


    /**
     * Upgrade the current page (NOTE: SHOULD BE TIED TO PROFILE CAPABILITIES
     */
    this.upgradeCurrentResource = function () {
            var foundResource = FiercePlanet.currentLevel.getCurrentResourceIndex(FiercePlanet.currentResource);
            if (foundResource > -1) {
                var resource = FiercePlanet.currentLevel.resources[foundResource];
                if (resource.upgradeLevel <= 4 && FiercePlanet.currentProfile.current_level_resources_in_store >= resource.upgradeCost) {
                    FiercePlanet.currentProfile.current_level_resources_in_store -= resource.upgradeCost;
                    FiercePlanet.currentProfile.current_level_resources_spent += resource.upgradeCost;
                    resource.upgradeLevel = resource.upgradeLevel + 1;
                    FiercePlanet.Drawing.drawResource(resource);
                    FiercePlanet.Drawing.drawResourcesInStore();
                }
            }
        };

    /**
     * 'Drops' a selected resource on the tile
     * @param posX - the x coordinate to drop the resource on
     * @param posY - the y coordinate to drop the resource on
     */
    this.dropItem = function(posX, posY) {
        if (FiercePlanet.currentLevel.getCell(posX, posY) == undefined && ! FiercePlanet.currentLevel.allowResourcesOnPath)
            return;
        if (FiercePlanet.currentLevel.isPositionOccupiedByResource(posX, posY))
            return;

        var resourceCode = FiercePlanet.currentResourceId;
//    if (e.dataTransfer)
//        resourceCode = e.dataTransfer.getData('Text');

        var resourceType = World.resolveResourceType(resourceCode);
        var resource = new Resource(resourceType, posX, posY);

        if (FiercePlanet.currentProfile.current_level_resources_in_store < resource.cost) {
            FiercePlanet.currentNotice = new Notice('Not enough resources for now - save some more agents!');
            return;
        }
        else {
            FiercePlanet.currentProfile.spendResource(resource);
            FiercePlanet.currentLevel.addResource(resource);

            FiercePlanet.Drawing.drawResource(resource);
            FiercePlanet.Drawing.drawResourcesInStore();

            FiercePlanet.eventTarget.fire(new Event("resource", resource, "added", FiercePlanet.gameCounter, FiercePlanet.currentLevel));
        }
        if (World.settings.useInlineResourceSwatch)
            FiercePlanet.currentResourceId = null;

        // Make sure Firefox does not follow links
        return false;
    };


    /**
     * Draw swatches
     */
    this.initialiseAndLoadResources = function () {
        if (World.resourceTypeNamespace.doSetup)
            World.resourceTypeNamespace.doSetup();

        for (var i = 0; i < World.resourceCategories.length; i++) {
            var category = World.resourceCategories[i];

            // Add to swatch
            var swatchCategoryHTML = '<div class="swatch-category" id="' + category.code + '"></div>';
            $('#swatch').append(swatchCategoryHTML);
            var swatchCategoryElement = $('#' + category.code);
            var swatchCategoryTitleHTML = '<div class="title">' + category.name + '</div>';
            swatchCategoryElement.append(swatchCategoryTitleHTML);
            swatchCategoryElement.css('background', '#' + category.color);

            // Add to gallery
            var galleryCategoryHTML = '<div class="gallery-category" id="gallery-' + category.code + '"></div>';
            $('#gallery-items').append(galleryCategoryHTML);
            var galleryCategoryElement = $('#gallery-' + category.code);
            var galleryCategoryTitleHTML = '<div class="title">' + category.name + '</div>';
            galleryCategoryElement.append(galleryCategoryTitleHTML);
            galleryCategoryElement.css('background', '#' + category.color);

            var categoryInstanceCounter = 0;
            for (var j = 0; j < category.types.length; j++) {
                var resourceType = category.types[j];

                var swatchInstanceHTML =
                    '<div class="swatch-instance" title="' + resourceType.name + '">' +
                        '<div class="swatch-draggable" id="' + resourceType.code + '"><img src="' + resourceType.image + '" alt=""></div>' +
                        '<div>' + resourceType.cost + '</div>' +
                    '</div>'
                        ;
                swatchCategoryElement.append(swatchInstanceHTML);
                var swatchInstanceElement = $('#' + resourceType.code);
//            swatchInstanceElement.css({'background': '#' + CATEGORY.color});
                if (categoryInstanceCounter > 0) {
                    swatchInstanceElement.addClass('inactive');
                }

                var galleryInstanceHTML =
                        '<div class="swatch-instance inactive purchase" id="' + resourceType.code + '-purchase" title="' + resourceType.name + '">' +
                            '<img src="' + resourceType.image + '" alt="">' +
                        '</div>';
//            var galleryInstanceHTML =
//                    '<div class="swatch-instance purchase inactive" id="' + resourceType.code + '-purchase" title="' + resourceType.name + '">' +
//                        '<img src="' + resourceType.image + '" alt="">' +
//                    '</div>';
                galleryCategoryElement.append(galleryInstanceHTML);

                // Increment the category instance
                categoryInstanceCounter++;
            }
        }
    };



}).apply(FiercePlanet.ResourceUI);

