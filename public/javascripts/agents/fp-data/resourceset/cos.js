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

// Arrays of resource kinds
CoS.ECONOMIC_RESOURCE_TYPES = [FiercePlanet.FARM_RESOURCE_TYPE, FiercePlanet.SHOP_RESOURCE_TYPE, FiercePlanet.BANK_RESOURCE_TYPE, FiercePlanet.FACTORY_RESOURCE_TYPE, FiercePlanet.STOCKMARKET_RESOURCE_TYPE];
CoS.ECOLOGICAL_RESOURCE_TYPES = [FiercePlanet.FRESH_WATER_RESOURCE_TYPE, FiercePlanet.WILDLIFE_PARK_RESOURCE_TYPE, FiercePlanet.CLEAN_AIR_RESOURCE_TYPE, FiercePlanet.GREEN_ENERGY_RESOURCE_TYPE, FiercePlanet.BIODIVERSITY_RESOURCE_TYPE];
CoS.POLITICAL_RESOURCE_TYPES = [FiercePlanet.LEGAL_SYSTEM_RESOURCE_TYPE, FiercePlanet.DEMOCRACY_RESOURCE_TYPE];
CoS.CULTURAL_RESOURCE_TYPES = [FiercePlanet.CLINIC_RESOURCE_TYPE, FiercePlanet.SCHOOL_RESOURCE_TYPE, FiercePlanet];

/**
 * Do setup of this resource set
 */
CoS.doSetup = function() {

// Economic resources
    CoS.ECO_CATEGORY.addType(FiercePlanet.FARM_RESOURCE_TYPE);
    CoS.ECO_CATEGORY.addType(FiercePlanet.SHOP_RESOURCE_TYPE);
    CoS.ECO_CATEGORY.addType(FiercePlanet.BANK_RESOURCE_TYPE);
    CoS.ECO_CATEGORY.addType(FiercePlanet.FACTORY_RESOURCE_TYPE);
    CoS.ECO_CATEGORY.addType(FiercePlanet.STOCKMARKET_RESOURCE_TYPE);


// Environmental resources
    CoS.ENV_CATEGORY.addType(FiercePlanet.FRESH_WATER_RESOURCE_TYPE);
    CoS.ENV_CATEGORY.addType(FiercePlanet.WILDLIFE_PARK_RESOURCE_TYPE);
    CoS.ENV_CATEGORY.addType(FiercePlanet.CLEAN_AIR_RESOURCE_TYPE);
    CoS.ENV_CATEGORY.addType(FiercePlanet.GREEN_ENERGY_RESOURCE_TYPE);
    CoS.ENV_CATEGORY.addType(FiercePlanet.BIODIVERSITY_RESOURCE_TYPE);

// Political resources
    CoS.POL_CATEGORY.addType(FiercePlanet.LEGAL_SYSTEM_RESOURCE_TYPE);
    CoS.POL_CATEGORY.addType(FiercePlanet.DEMOCRACY_RESOURCE_TYPE);


// Cultural resources
    CoS.CUL_CATEGORY.addType(FiercePlanet.CLINIC_RESOURCE_TYPE);
    CoS.CUL_CATEGORY.addType(FiercePlanet.SCHOOL_RESOURCE_TYPE);
    CoS.CUL_CATEGORY.addType(FiercePlanet.FESTIVAL_RESOURCE_TYPE);


    World.registerResourceCategories([CoS.ECO_CATEGORY, CoS.ENV_CATEGORY, CoS.POL_CATEGORY, CoS.CUL_CATEGORY]);
    World.registerResourceTypes(CoS.ECONOMIC_RESOURCE_TYPES.concat(CoS.ECOLOGICAL_RESOURCE_TYPES.concat(CoS.POLITICAL_RESOURCE_TYPES.concat(CoS.CULTURAL_RESOURCE_TYPES))));
    FiercePlanet.currentProfile.capabilities = ["farm", "water", "clinic", "legal"];
};
