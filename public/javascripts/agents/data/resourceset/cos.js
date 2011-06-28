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
var CoS = CoS || {};

// Resource categories
CoS.ECO_CATEGORY = new ResourceCategory("Economy", "eco", "44ABE0");
CoS.ENV_CATEGORY = new ResourceCategory("Ecology", "enl", "CBDB2A");
CoS.POL_CATEGORY = new ResourceCategory("Political", "pol", "DE1F2A");
CoS.CUL_CATEGORY = new ResourceCategory("Cultural", "cul", "2ADBCB");

// Economic resources
CoS.FARM_RESOURCE_TYPE = new ResourceType(CoS.ECO_CATEGORY, "Farm", "farm", "/images/farm.gif", 10, 20, 100, 20);
CoS.SHOP_RESOURCE_TYPE = new ResourceType(CoS.ECO_CATEGORY, "Shop", "shop", "/images/shop.gif", 15, 25, 100, 30);
CoS.BANK_RESOURCE_TYPE = new ResourceType(CoS.ECO_CATEGORY, "Bank", "bank", "/images/bank.gif", 20, 30, 100, 50);
CoS.FACTORY_RESOURCE_TYPE = new ResourceType(CoS.ECO_CATEGORY, "Factory", "factory", "/images/factory.gif", 25, 40, 100, 70);
CoS.STOCKMARKET_RESOURCE_TYPE = new ResourceType(CoS.ECO_CATEGORY, "Stockmarket", "stockmarket", "/images/stockmarket.gif", 30, 50, 100, 90);


// Environmental resources
CoS.FRESH_WATER_RESOURCE_TYPE = new ResourceType(CoS.ENV_CATEGORY, "Fresh Water", "water", "/images/water.gif", 10, 20, 100, 10);
CoS.WILDLIFE_PARK_RESOURCE_TYPE = new ResourceType(CoS.ENV_CATEGORY, "Wildlife Park", "park", "/images/park.gif", 15, 25, 100, 15);
CoS.CLEAN_AIR_RESOURCE_TYPE = new ResourceType(CoS.ENV_CATEGORY, "Clear Air", "air", "/images/air.gif", 20, 30, 100, 25);
CoS.GREEN_ENERGY_RESOURCE_TYPE = new ResourceType(CoS.ENV_CATEGORY, "Green Energy", "energy", "/images/energy.gif", 25, 40, 100, 35);
CoS.BIODIVERSITY_RESOURCE_TYPE = new ResourceType(CoS.ENV_CATEGORY, "Biodiversity", "biodiversity", "/images/biodiversity.gif", 30, 50, 100, 45);


// Political resources
CoS.LEGAL_SYSTEM_RESOURCE_TYPE = new ResourceType(CoS.POL_CATEGORY, "Legal System", "legal", "/images/legal.gif", 20, 30, 100, 15);
CoS.DEMOCRACY_RESOURCE_TYPE = new ResourceType(CoS.POL_CATEGORY, "Democracy", "democracy", "/images/democracy.gif", 25, 40, 100, 20);


// Cultural resources
CoS.CLINIC_RESOURCE_TYPE = new ResourceType(CoS.CUL_CATEGORY, "Clinic", "clinic", "/images/clinic.gif", 10, 20, 100, 5);
CoS.SCHOOL_RESOURCE_TYPE = new ResourceType(CoS.CUL_CATEGORY, "School", "school", "/images/school.gif", 15, 25, 100, 8);
CoS.FESTIVAL_RESOURCE_TYPE = new ResourceType(CoS.CUL_CATEGORY, "Festival", "festival", "/images/festival.gif", 30, 50, 100, 25);

// Arrays of resource kinds
CoS.ECONOMIC_RESOURCE_TYPES = [CoS.FARM_RESOURCE_TYPE, CoS.SHOP_RESOURCE_TYPE, CoS.BANK_RESOURCE_TYPE, CoS.FACTORY_RESOURCE_TYPE, CoS.STOCKMARKET_RESOURCE_TYPE];
CoS.ECOLOGICAL_RESOURCE_TYPES = [CoS.FRESH_WATER_RESOURCE_TYPE, CoS.WILDLIFE_PARK_RESOURCE_TYPE, CoS.CLEAN_AIR_RESOURCE_TYPE, CoS.GREEN_ENERGY_RESOURCE_TYPE, CoS.BIODIVERSITY_RESOURCE_TYPE];
CoS.POLITICAL_RESOURCE_TYPES = [CoS.LEGAL_SYSTEM_RESOURCE_TYPE, CoS.DEMOCRACY_RESOURCE_TYPE];
CoS.CULTURAL_RESOURCE_TYPES = [CoS.CLINIC_RESOURCE_TYPE, CoS.SCHOOL_RESOURCE_TYPE, CoS.FESTIVAL_RESOURCE_TYPE];

/**
 * Do setup of this resource set
 */
CoS.doSetup = function() {
    FiercePlanet.registerResourceCategories([CoS.ECO_CATEGORY, CoS.ENV_CATEGORY, CoS.POL_CATEGORY, CoS.CUL_CATEGORY]);
    FiercePlanet.registerResourceTypes(CoS.ECONOMIC_RESOURCE_TYPES.concat(CoS.ECOLOGICAL_RESOURCE_TYPES.concat(CoS.POLITICAL_RESOURCE_TYPES.concat(CoS.CULTURAL_RESOURCE_TYPES))));
    FiercePlanet.capabilities = ["farm", "water", "clinic", "legal"];
};
