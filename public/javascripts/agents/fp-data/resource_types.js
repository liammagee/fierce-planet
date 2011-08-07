/*!
 * Fierce Planet - Resource types
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

var FiercePlanet = FiercePlanet || {};


// Economic resources
FiercePlanet.FARM_RESOURCE_TYPE = new ResourceType("Farm", "farm", "/images/icons/truck.png", 10, 20, 100, 20);
FiercePlanet.SHOP_RESOURCE_TYPE = new ResourceType("Shop", "shop", "/images/icons/basket.png", 15, 25, 150, 30);
FiercePlanet.BANK_RESOURCE_TYPE = new ResourceType("Bank", "bank", "/images/icons/dollars.png", 20, 30, 200, 50);
FiercePlanet.FACTORY_RESOURCE_TYPE = new ResourceType("Factory", "factory", "/images/icons/factory-2.png", 25, 40, 250, 70);
FiercePlanet.STOCKMARKET_RESOURCE_TYPE = new ResourceType("Stockmarket", "stockmarket", "/images/icons/stockmarket.png", 30, 50, 300, 90);


// Environmental resources
FiercePlanet.FRESH_WATER_RESOURCE_TYPE = new ResourceType("Fresh Water", "water", "/images/icons/recycled-water.png", 10, 20, 100, 10);
FiercePlanet.WILDLIFE_PARK_RESOURCE_TYPE = new ResourceType("Wildlife Park", "park", "/images/icons/butterfly.png", 15, 25, 150, 15);
FiercePlanet.CLEAN_AIR_RESOURCE_TYPE = new ResourceType("Clear Air", "air", "/images/icons/renewable.png", 20, 30, 200, 25);
FiercePlanet.GREEN_ENERGY_RESOURCE_TYPE = new ResourceType("Green Energy", "energy", "/images/icons/eco-power.png", 25, 40, 250, 35);
FiercePlanet.BIODIVERSITY_RESOURCE_TYPE = new ResourceType("Biodiversity", "biodiversity", "/images/icons/biodiversity.png", 30, 300, 100, 45);


// Social resources
FiercePlanet.CLINIC_RESOURCE_TYPE = new ResourceType("Clinic", "clinic", "/images/icons/bandaid.png", 10, 20, 100, 5);
FiercePlanet.SCHOOL_RESOURCE_TYPE = new ResourceType("School", "school", "/images/icons/abc.png", 15, 25, 150, 8);
FiercePlanet.LEGAL_SYSTEM_RESOURCE_TYPE = new ResourceType("Legal System", "legal", "/images/icons/scales.png", 20, 30, 200, 15);
FiercePlanet.DEMOCRACY_RESOURCE_TYPE = new ResourceType("Democracy", "democracy", "/images/icons/microphone.png", 25, 40, 250, 20);
FiercePlanet.FESTIVAL_RESOURCE_TYPE = new ResourceType("Festival", "festival", "/images/icons/martini.png", 30, 50, 300, 25);


// Additional resources - uncategorised
FiercePlanet.AEROPLANE = new ResourceType("Travel", "travel", "/images/icons/aeroplane.png", 30, 50, 300, 25);
FiercePlanet.TRAVEL_RESOURCE_TYPE = new ResourceType("Travel", "travel", "/images/icons/travel.png", 30, 50, 300, 25);



/**
 * Resources assigned to profile class capabilities (@link Profile)
 *
 * TODO: Use actual resource types instead
 */
FiercePlanet.NOVICE_CAPABILITIES = ["farm", "water", "clinic"];
FiercePlanet.PLANNER_CAPABILITIES = FiercePlanet.NOVICE_CAPABILITIES.concat(["shop", "park", "school"]);
FiercePlanet.EXPERT_CAPABILITIES = FiercePlanet.PLANNER_CAPABILITIES.concat(["bank", "air", "legal"]);
FiercePlanet.VISIONARY_CAPABILITIES = FiercePlanet.EXPERT_CAPABILITIES.concat(["factory", "energy", "democracy"]);
FiercePlanet.GENIUS_CAPABILITIES = FiercePlanet.VISIONARY_CAPABILITIES.concat(["stockmarket", "biodiversity", "festival"]);
