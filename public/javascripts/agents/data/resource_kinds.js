/**
 * Created by .
 * User: Liam
 * Date: 26/03/11
 * Time: 10:44 PM
 * To change this template use File | Settings | File Templates.
 */


// Economic resources
FARM_RESOURCE_KIND = new ResourceKind("Farm", "farm", "eco", 10, 20, 100, 20);
SHOP_RESOURCE_KIND = new ResourceKind("Shop", "shop", "eco", 15, 25, 100, 30);
BANK_RESOURCE_KIND = new ResourceKind("Bank", "bank", "eco", 20, 30, 100, 50);
FACTORY_RESOURCE_KIND = new ResourceKind("Factory", "factory", "eco", 25, 40, 100, 70);
STOCKMARKET_RESOURCE_KIND = new ResourceKind("Stockmarket", "stockmarket", "eco", 30, 50, 100, 90);


// Environmental resources
FRESH_WATER_RESOURCE_KIND = new ResourceKind("Fresh Water", "water", "env", 10, 20, 100, 10);
WILDLIFE_PARK_RESOURCE_KIND = new ResourceKind("Wildlife Park", "park", "env", 15, 25, 100, 15);
CLEAN_AIR_RESOURCE_KIND = new ResourceKind("Clear Air", "air", "env", 20, 30, 100, 25);
GREEN_ENERGY_RESOURCE_KIND = new ResourceKind("Green Energy", "energy", "env", 25, 40, 100, 35);
BIODIVERSITY_RESOURCE_KIND = new ResourceKind("Biodiversity", "biodiversity", "env", 30, 50, 100, 45);


// Social resources
CLINIC_RESOURCE_KIND = new ResourceKind("Clinic", "clinic", "soc", 10, 20, 100, 5);
SCHOOL_RESOURCE_KIND = new ResourceKind("School", "school", "soc", 15, 25, 100, 8);
LEGAL_SYSTEM_RESOURCE_KIND = new ResourceKind("Legal System", "legal", "soc", 20, 30, 100, 15);
DEMOCRACY_RESOURCE_KIND = new ResourceKind("Democracy", "democracy", "soc", 25, 40, 100, 20);
FESTIVAL_RESOURCE_KIND = new ResourceKind("Festival", "festival", "soc", 30, 50, 100, 25);

// Arrays of resource kinds
ECONOMIC_RESOURCE_KINDS = [FARM_RESOURCE_KIND, SHOP_RESOURCE_KIND, BANK_RESOURCE_KIND, FACTORY_RESOURCE_KIND, STOCKMARKET_RESOURCE_KIND];
ENVIRONMENTAL_RESOURCE_KINDS = [FRESH_WATER_RESOURCE_KIND, WILDLIFE_PARK_RESOURCE_KIND, CLEAN_AIR_RESOURCE_KIND, GREEN_ENERGY_RESOURCE_KIND, BIODIVERSITY_RESOURCE_KIND];
SOCIAL_RESOURCE_KINDS = [CLINIC_RESOURCE_KIND, SCHOOL_RESOURCE_KIND, LEGAL_SYSTEM_RESOURCE_KIND, DEMOCRACY_RESOURCE_KIND, FESTIVAL_RESOURCE_KIND];

RESOURCE_KINDS = ECONOMIC_RESOURCE_KINDS.concat(ENVIRONMENTAL_RESOURCE_KINDS.concat(SOCIAL_RESOURCE_KINDS));
