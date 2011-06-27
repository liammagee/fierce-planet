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


// Economic resources
FiercePlanet.FARM_RESOURCE_TYPE = new ResourceKind(TBL.ECO_CATEGORY, "Farm", "farm", 10, 20, 100, 20);
FiercePlanet.SHOP_RESOURCE_TYPE = new ResourceKind(TBL.ECO_CATEGORY, "Shop", "shop", 15, 25, 100, 30);
FiercePlanet.BANK_RESOURCE_TYPE = new ResourceKind(TBL.ECO_CATEGORY, "Bank", "bank", 20, 30, 100, 50);
FiercePlanet.FACTORY_RESOURCE_TYPE = new ResourceKind(TBL.ECO_CATEGORY, "Factory", "factory", 25, 40, 100, 70);
FiercePlanet.STOCKMARKET_RESOURCE_TYPE = new ResourceKind(TBL.ECO_CATEGORY, "Stockmarket", "stockmarket", 30, 50, 100, 90);


// Environmental resources
FiercePlanet.FRESH_WATER_RESOURCE_TYPE = new ResourceKind(TBL.ENV_CATEGORY, "Fresh Water", "water", 10, 20, 100, 10);
FiercePlanet.WILDLIFE_PARK_RESOURCE_TYPE = new ResourceKind(TBL.ENV_CATEGORY, "Wildlife Park", "park", 15, 25, 100, 15);
FiercePlanet.CLEAN_AIR_RESOURCE_TYPE = new ResourceKind(TBL.ENV_CATEGORY, "Clear Air", "air", 20, 30, 100, 25);
FiercePlanet.GREEN_ENERGY_RESOURCE_TYPE = new ResourceKind(TBL.ENV_CATEGORY, "Green Energy", "energy", 25, 40, 100, 35);
FiercePlanet.BIODIVERSITY_RESOURCE_TYPE = new ResourceKind(TBL.ENV_CATEGORY, "Biodiversity", "biodiversity", 30, 50, 100, 45);


// Social resources
FiercePlanet.CLINIC_RESOURCE_TYPE = new ResourceKind(TBL.SOC_CATEGORY, "Clinic", "clinic", 10, 20, 100, 5);
FiercePlanet.SCHOOL_RESOURCE_TYPE = new ResourceKind(TBL.SOC_CATEGORY, "School", "school", 15, 25, 100, 8);
FiercePlanet.LEGAL_SYSTEM_RESOURCE_TYPE = new ResourceKind(TBL.SOC_CATEGORY, "Legal System", "legal", 20, 30, 100, 15);
FiercePlanet.DEMOCRACY_RESOURCE_TYPE = new ResourceKind(TBL.SOC_CATEGORY, "Democracy", "democracy", 25, 40, 100, 20);
FiercePlanet.FESTIVAL_RESOURCE_TYPE = new ResourceKind(TBL.SOC_CATEGORY, "Festival", "festival", 30, 50, 100, 25);

// Arrays of resource kinds
FiercePlanet.ECONOMIC_RESOURCE_TYPES = [FiercePlanet.FARM_RESOURCE_TYPE, FiercePlanet.SHOP_RESOURCE_TYPE, FiercePlanet.BANK_RESOURCE_TYPE, FiercePlanet.FACTORY_RESOURCE_TYPE, FiercePlanet.STOCKMARKET_RESOURCE_TYPE];
FiercePlanet.ENVIRONMENTAL_RESOURCE_TYPES = [FiercePlanet.FRESH_WATER_RESOURCE_TYPE, FiercePlanet.WILDLIFE_PARK_RESOURCE_TYPE, FiercePlanet.CLEAN_AIR_RESOURCE_TYPE, FiercePlanet.GREEN_ENERGY_RESOURCE_TYPE, FiercePlanet.BIODIVERSITY_RESOURCE_TYPE];
FiercePlanet.SOCIAL_RESOURCE_TYPES = [FiercePlanet.CLINIC_RESOURCE_TYPE, FiercePlanet.SCHOOL_RESOURCE_TYPE, FiercePlanet.LEGAL_SYSTEM_RESOURCE_TYPE, FiercePlanet.DEMOCRACY_RESOURCE_TYPE, FiercePlanet.FESTIVAL_RESOURCE_TYPE];

$(document).ready(function() {
    FiercePlanet.registerResourceCategories([TBL.ECO_CATEGORY, TBL.ENV_CATEGORY, TBL.SOC_CATEGORY]);
    FiercePlanet.registerResourceTypes(FiercePlanet.ECONOMIC_RESOURCE_TYPES.concat(FiercePlanet.ENVIRONMENTAL_RESOURCE_TYPES.concat(FiercePlanet.SOCIAL_RESOURCE_TYPES)));
});

//FiercePlanet.RESOURCE_TYPES = FiercePlanet.ECONOMIC_RESOURCE_TYPES.concat(FiercePlanet.ENVIRONMENTAL_RESOURCE_TYPES.concat(FiercePlanet.SOCIAL_RESOURCE_TYPES));
