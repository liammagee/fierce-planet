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
    var world = (function() {
        var resourceCategories = [];
        var resourceTypes = [];

        this.registerResourceCategories = function(rcs) {
            resourceCategories = rcs;
        };
        this.registerResourceTypes = function(rts) {
            resourceTypes = rts;
        };

    })();

    return world;
})();

