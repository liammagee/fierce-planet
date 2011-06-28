/*!
 * Fierce Planet - ResourceKinds
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * Declare the FiercePlanet namespace
 */
var FiercePlanet = FiercePlanet || {};
var TBL = TBL || {};

// Resource categories
TBL.ECO_CATEGORY = new ResourceCategory("Economic", "eco", "44ABE0");
TBL.ENV_CATEGORY = new ResourceCategory("Environmental", "env", "CBDB2A");
TBL.SOC_CATEGORY = new ResourceCategory("Social", "soc", "DE1F2A");
TBL.ECO_CATEGORY.setEvaluateOtherCategoryImpact(function(otherCategory) {
    var neighbourCategoryCode = otherCategory.getCode();
    var baseEffect = 1.0;
    if (neighbourCategoryCode == "eco") {
        baseEffect *= 1.2;
    }
    else if (neighbourCategoryCode == "env") {
        baseEffect *= 1.0;
    }
    else if (neighbourCategoryCode == "soc") {
        baseEffect *= 0.8;
    }
    return baseEffect;
});
TBL.ENV_CATEGORY.setEvaluateOtherCategoryImpact(function(otherCategory) {
    var neighbourCategoryCode = otherCategory.getCode();
    var baseEffect = 1.0;
    if (neighbourCategoryCode == "eco") {
        baseEffect *= 0.25;
    }
    else if (neighbourCategoryCode == "env") {
        baseEffect *= 1.2;
    }
    else if (neighbourCategoryCode == "soc") {
        baseEffect *= 1.0;
    }
    return baseEffect;
});
TBL.SOC_CATEGORY.setEvaluateOtherCategoryImpact(function(otherCategory) {
    var neighbourCategoryCode = otherCategory.getCode();
    var baseEffect = 1.0;
    if (neighbourCategoryCode == "eco") {
        baseEffect *= 0.5;
    }
    else if (neighbourCategoryCode == "env") {
        baseEffect *= 1.1;
    }
    else if (neighbourCategoryCode == "soc") {
        baseEffect *= 1.2;
    }
    return baseEffect;
});

// Economic resources
TBL.FARM_RESOURCE_TYPE = new ResourceType(TBL.ECO_CATEGORY, "Farm", "farm", "/images/farm.gif", 10, 20, 100, 20);
TBL.SHOP_RESOURCE_TYPE = new ResourceType(TBL.ECO_CATEGORY, "Shop", "shop", "/images/shop.gif", 15, 25, 100, 30);
TBL.BANK_RESOURCE_TYPE = new ResourceType(TBL.ECO_CATEGORY, "Bank", "bank", "/images/bank.gif", 20, 30, 100, 50);
TBL.FACTORY_RESOURCE_TYPE = new ResourceType(TBL.ECO_CATEGORY, "Factory", "factory", "/images/factory.gif", 25, 40, 100, 70);
TBL.STOCKMARKET_RESOURCE_TYPE = new ResourceType(TBL.ECO_CATEGORY, "Stockmarket", "stockmarket", "/images/stockmarket.gif", 30, 50, 100, 90);


// Environmental resources
TBL.FRESH_WATER_RESOURCE_TYPE = new ResourceType(TBL.ENV_CATEGORY, "Fresh Water", "water", "/images/water.gif", 10, 20, 100, 10);
TBL.WILDLIFE_PARK_RESOURCE_TYPE = new ResourceType(TBL.ENV_CATEGORY, "Wildlife Park", "park", "/images/park.gif", 15, 25, 100, 15);
TBL.CLEAN_AIR_RESOURCE_TYPE = new ResourceType(TBL.ENV_CATEGORY, "Clear Air", "air", "/images/air.gif", 20, 30, 100, 25);
TBL.GREEN_ENERGY_RESOURCE_TYPE = new ResourceType(TBL.ENV_CATEGORY, "Green Energy", "energy", "/images/energy.gif", 25, 40, 100, 35);
TBL.BIODIVERSITY_RESOURCE_TYPE = new ResourceType(TBL.ENV_CATEGORY, "Biodiversity", "biodiversity", "/images/biodiversity.gif", 30, 50, 100, 45);


// Social resources
TBL.CLINIC_RESOURCE_TYPE = new ResourceType(TBL.SOC_CATEGORY, "Clinic", "clinic", "/images/clinic.gif", 10, 20, 100, 5);
TBL.SCHOOL_RESOURCE_TYPE = new ResourceType(TBL.SOC_CATEGORY, "School", "school", "/images/school.gif", 15, 25, 100, 8);
TBL.LEGAL_SYSTEM_RESOURCE_TYPE = new ResourceType(TBL.SOC_CATEGORY, "Legal System", "legal", "/images/legal.gif", 20, 30, 100, 15);
TBL.DEMOCRACY_RESOURCE_TYPE = new ResourceType(TBL.SOC_CATEGORY, "Democracy", "democracy", "/images/democracy.gif", 25, 40, 100, 20);
TBL.FESTIVAL_RESOURCE_TYPE = new ResourceType(TBL.SOC_CATEGORY, "Festival", "festival", "/images/festival.gif", 30, 50, 100, 25);

// Arrays of resource kinds
TBL.ECONOMIC_RESOURCE_TYPES = [TBL.FARM_RESOURCE_TYPE, TBL.SHOP_RESOURCE_TYPE, TBL.BANK_RESOURCE_TYPE, TBL.FACTORY_RESOURCE_TYPE, TBL.STOCKMARKET_RESOURCE_TYPE];
TBL.ENVIRONMENTAL_RESOURCE_TYPES = [TBL.FRESH_WATER_RESOURCE_TYPE, TBL.WILDLIFE_PARK_RESOURCE_TYPE, TBL.CLEAN_AIR_RESOURCE_TYPE, TBL.GREEN_ENERGY_RESOURCE_TYPE, TBL.BIODIVERSITY_RESOURCE_TYPE];
TBL.SOCIAL_RESOURCE_TYPES = [TBL.CLINIC_RESOURCE_TYPE, TBL.SCHOOL_RESOURCE_TYPE, TBL.LEGAL_SYSTEM_RESOURCE_TYPE, TBL.DEMOCRACY_RESOURCE_TYPE, TBL.FESTIVAL_RESOURCE_TYPE];

/**
 * Do setup of this resource set
 */
TBL.doSetup = function() {
    FiercePlanet.registerResourceCategories([TBL.ECO_CATEGORY, TBL.ENV_CATEGORY, TBL.SOC_CATEGORY]);
    FiercePlanet.registerResourceTypes(TBL.ECONOMIC_RESOURCE_TYPES.concat(TBL.ENVIRONMENTAL_RESOURCE_TYPES.concat(TBL.SOCIAL_RESOURCE_TYPES)));
};
