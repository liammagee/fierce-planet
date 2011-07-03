

// Economic resources
FiercePlanet.FARM_RESOURCE_TYPE = new ResourceType("Farm", "farm", "/images/resources/farm.png", 10, 20, 100, 20);
FiercePlanet.SHOP_RESOURCE_TYPE = new ResourceType("Shop", "shop", "/images/resources/shop.png", 15, 25, 100, 30);
FiercePlanet.BANK_RESOURCE_TYPE = new ResourceType("Bank", "bank", "/images/resources/bank.png", 20, 30, 100, 50);
FiercePlanet.FACTORY_RESOURCE_TYPE = new ResourceType("Factory", "factory", "/images/resources/factory.png", 25, 40, 100, 70);
FiercePlanet.STOCKMARKET_RESOURCE_TYPE = new ResourceType("Stockmarket", "stockmarket", "/images/resources/stockmarket.png", 30, 50, 100, 90);


// Environmental resources
FiercePlanet.FRESH_WATER_RESOURCE_TYPE = new ResourceType("Fresh Water", "water", "/images/resources/water.png", 10, 20, 100, 10);
FiercePlanet.WILDLIFE_PARK_RESOURCE_TYPE = new ResourceType("Wildlife Park", "park", "/images/resources/park.png", 15, 25, 100, 15);
FiercePlanet.CLEAN_AIR_RESOURCE_TYPE = new ResourceType("Clear Air", "air", "/images/resources/air.png", 20, 30, 100, 25);
FiercePlanet.GREEN_ENERGY_RESOURCE_TYPE = new ResourceType("Green Energy", "energy", "/images/resources/energy.png", 25, 40, 100, 35);
FiercePlanet.BIODIVERSITY_RESOURCE_TYPE = new ResourceType("Biodiversity", "biodiversity", "/images/resources/biodiversity.png", 30, 50, 100, 45);


// Social resources
FiercePlanet.CLINIC_RESOURCE_TYPE = new ResourceType("Clinic", "clinic", "/images/resources/clinic.png", 10, 20, 100, 5);
FiercePlanet.SCHOOL_RESOURCE_TYPE = new ResourceType("School", "school", "/images/resources/school.png", 15, 25, 100, 8);
FiercePlanet.LEGAL_SYSTEM_RESOURCE_TYPE = new ResourceType("Legal System", "legal", "/images/resources/legal.png", 20, 30, 100, 15);
FiercePlanet.DEMOCRACY_RESOURCE_TYPE = new ResourceType("Democracy", "democracy", "/images/resources/democracy.png", 25, 40, 100, 20);
FiercePlanet.FESTIVAL_RESOURCE_TYPE = new ResourceType("Festival", "festival", "/images/resources/festival.png", 30, 50, 100, 25);


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
