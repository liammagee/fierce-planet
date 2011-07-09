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
    var world = {
        resourceTypeNamespace: {},
        resourceCategories: [],
        resourceTypes: [],

        registerResourceCategories: function registerResourceCategories(rcs) {
            this.resourceCategories = rcs;
        },

        registerResourceTypes: function registerResourceTypes(rts) {
            this.resourceTypes = rts;
        }

    };

    return world;
})();

