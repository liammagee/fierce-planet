/*!
 * Fierce Planet - World
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



/**
 * World Singleton class definition
 */
var World = (function() {
    var world = {};
    var resourceCategories = [];
    var resourceTypes = [];

    world.registerResourceCategories = function(rcs) {
        resourceCategories = rcs;
    };
    world.registerResourceTypes = function(rts) {
        resourceTypes = rts;
    };

    return world;
})();

