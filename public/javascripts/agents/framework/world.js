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

        /** World settings */
        settings: {

            /** Can agents share memories of places visited? */
            agentsCanCommunicate: true,

            /** Can resources be upgraded? (TODO: Semantics needs to be clear about what this means) */
            resourcesUpgradeable: false,

            /** Are resources in tension - does proximity of resources impact on their benefit */
            resourcesInTension: false,

            /** Does a resource bonus apply, for using an even mix of resources? TODO: not yet implemented */
            resourceBonus: false,

            /** Do all resources impact upon agents equivalently? */
            applyGeneralHealth: false,

            /** Ignores the weighting of resources when calculating benefits */
            ignoreResourceBalance: false,

            /** Serialise just the settings to JSON */
            toJSON: function toJSON() {
                var ownProperties = {};
                for (var key in this) {
                    // Make sure we're only capturing numbers, strings, booleans (not objects, functions or undefineds)
                    if (this.hasOwnProperty(key) && $.inArray(typeof this[key], ["number", "string", "boolean"]) > -1) {
                        ownProperties[key] = this[key];
                    }
                }
                return $.toJSON(ownProperties);
            },

            /** Deserialise just the settings from JSON */
            parseJSON: function parseJSON(settingsAsJSON) {
                var props = $.parseJSON(settingsAsJSON);
                for (var key in props) {
                    this[key] = props[key];
                }
            },

            /** Loads settings from local storage, if available */
            load: function load() {
                if (localStorage && localStorage.worldSettings)
                    this.parseJSON(localStorage.worldSettings);
            },

            /** Deserialise just the settings from JSON */
            store: function store(settingsAsJSON) {
                if (localStorage)
                    localStorage.worldSettings = this.toJSON();
            }


        },

        resourceTypeNamespace: {},

        resourceCategories: [],

        resourceTypes: [],

        agentTypes: [],

        registerResourceCategories: function registerResourceCategories(rcs) {
            this.resourceCategories = rcs;
            if (this.agentTypes)
                this.updateRegisteredAgentTypes();
        },

        registerResourceTypes: function registerResourceTypes(rts) {
            this.resourceTypes = rts;
        },

        registerAgentTypes: function registerAgentTypes(agt) {
            this.agentTypes = agt;
        },

        updateRegisteredAgentTypes: function updateRegisteredAgentTypes() {
            for (var i in this.agentTypes) {
                this.agentTypes[i].setHealthCategories(this.resourceCategories);
            }
        },

        resolveResourceType: function resolveResourceType(code) {
            for (var i in this.resourceTypes) {
                var resourceType = this.resourceTypes[i];
                if (resourceType._code == code)
                    return resourceType;
            }
            return undefined;
        }


    };

    return world;
})();
