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


// Economic resources
FiercePlanet.FARM_RESOURCE_KIND = new ResourceKind("Farm", "farm", "eco", 10, 20, 100, 20);
FiercePlanet.SHOP_RESOURCE_KIND = new ResourceKind("Shop", "shop", "eco", 15, 25, 100, 30);
FiercePlanet.BANK_RESOURCE_KIND = new ResourceKind("Bank", "bank", "eco", 20, 30, 100, 50);
FiercePlanet.FACTORY_RESOURCE_KIND = new ResourceKind("Factory", "factory", "eco", 25, 40, 100, 70);
FiercePlanet.STOCKMARKET_RESOURCE_KIND = new ResourceKind("Stockmarket", "stockmarket", "eco", 30, 50, 100, 90);


// Environmental resources
FiercePlanet.FRESH_WATER_RESOURCE_KIND = new ResourceKind("Fresh Water", "water", "env", 10, 20, 100, 10);
FiercePlanet.WILDLIFE_PARK_RESOURCE_KIND = new ResourceKind("Wildlife Park", "park", "env", 15, 25, 100, 15);
FiercePlanet.CLEAN_AIR_RESOURCE_KIND = new ResourceKind("Clear Air", "air", "env", 20, 30, 100, 25);
FiercePlanet.GREEN_ENERGY_RESOURCE_KIND = new ResourceKind("Green Energy", "energy", "env", 25, 40, 100, 35);
FiercePlanet.BIODIVERSITY_RESOURCE_KIND = new ResourceKind("Biodiversity", "biodiversity", "env", 30, 50, 100, 45);


// Social resources
FiercePlanet.CLINIC_RESOURCE_KIND = new ResourceKind("Clinic", "clinic", "soc", 10, 20, 100, 5);
FiercePlanet.SCHOOL_RESOURCE_KIND = new ResourceKind("School", "school", "soc", 15, 25, 100, 8);
FiercePlanet.LEGAL_SYSTEM_RESOURCE_KIND = new ResourceKind("Legal System", "legal", "soc", 20, 30, 100, 15);
FiercePlanet.DEMOCRACY_RESOURCE_KIND = new ResourceKind("Democracy", "democracy", "soc", 25, 40, 100, 20);
FiercePlanet.FESTIVAL_RESOURCE_KIND = new ResourceKind("Festival", "festival", "soc", 30, 50, 100, 25);

// Arrays of resource kinds
FiercePlanet.ECONOMIC_RESOURCE_KINDS = [FiercePlanet.FARM_RESOURCE_KIND, FiercePlanet.SHOP_RESOURCE_KIND, FiercePlanet.BANK_RESOURCE_KIND, FiercePlanet.FACTORY_RESOURCE_KIND, FiercePlanet.STOCKMARKET_RESOURCE_KIND];
FiercePlanet.ENVIRONMENTAL_RESOURCE_KINDS = [FiercePlanet.FRESH_WATER_RESOURCE_KIND, FiercePlanet.WILDLIFE_PARK_RESOURCE_KIND, FiercePlanet.CLEAN_AIR_RESOURCE_KIND, FiercePlanet.GREEN_ENERGY_RESOURCE_KIND, FiercePlanet.BIODIVERSITY_RESOURCE_KIND];
FiercePlanet.SOCIAL_RESOURCE_KINDS = [FiercePlanet.CLINIC_RESOURCE_KIND, FiercePlanet.SCHOOL_RESOURCE_KIND, FiercePlanet.LEGAL_SYSTEM_RESOURCE_KIND, FiercePlanet.DEMOCRACY_RESOURCE_KIND, FiercePlanet.FESTIVAL_RESOURCE_KIND];

FiercePlanet.RESOURCE_KINDS = FiercePlanet.ECONOMIC_RESOURCE_KINDS.concat(FiercePlanet.ENVIRONMENTAL_RESOURCE_KINDS.concat(FiercePlanet.SOCIAL_RESOURCE_KINDS));

/* Generic resource kind functions */
FiercePlanet.resolveResourceKind = function (code) {
    for (var i = 0; i < FiercePlanet.RESOURCE_KINDS.length; i++) {
        var resourceKind = FiercePlanet.RESOURCE_KINDS[i];
        if (resourceKind._code == code)
            return resourceKind;
    }
    return null;
}