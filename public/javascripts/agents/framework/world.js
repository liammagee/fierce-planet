/*!
 * Fierce Planet - World
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



/**
 * World Singleton class definition
 */
var World = {};

/**
 * @constructor
 */
initWorld = (function() {

    this.settings = {


            /** CONSTANTS */

            /**
             * @constant The cost of making a move
             */
            DEFAULT_AGENT_COST_PER_MOVE: -3,

            /**
             * @constant The default rate of resource recovery
             */
            DEFAULT_RESOURCE_RECOVERY_RATE: 2,

            /** VARIABLES */

            /** Can agents share memories of places visited? */
            agentsCanCommunicate: true,

            /** Do agents have a random amount of initial health? */
            agentsHaveRandomInitialHealth: false,

            /** Can agents adjust their speed? */
            agentsCanAdjustSpeed: true,

            /** Can agents adjust their wander? */
            agentsCanAdjustWander: true,

            /** Cost to agent for every move */
            agentCostPerMove: 0,

            /** Ignores the weighting of resources when calculating benefits */
            ignoreResourceBalance: false,

            /** Do all resources impact upon agents equivalently? */
            applyGeneralHealth: false,

            /** Are resources in tension - does proximity of resources impact on their benefit?
             *  TODO: Refactor name
              */
            resourcesInTension: false,

            /** Are resources in tension - does proximity of resources impact on their benefit */
            resourcesInTensionGlobally: false,

            /** Irrespective of agent yields, resources diminish at fixed rates */
            resourcesDiminishAtFixedRate: false,

            /** Can resources be upgraded? (TODO: Semantics needs to be clear about what this means) */
            resourcesUpgradeable: false,

            /** Does a resource bonus apply, for using an even mix of resources? TODO: not yet implemented */
            resourceBonus: false,

            /** Cost to agent for every move */
            rateOfResourceRecovery: 0,



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
        };

        this.resourceTypeNamespace = {};

        this.resourceCategories = [];

        this.resourceTypes = [];

        this.agentTypes = [];

        this.registerResourceCategories = function(rcs) {
            this.resourceCategories = rcs;
            if (this.agentTypes)
                this.updateRegisteredAgentTypes();
        };

        this.registerResourceTypes = function (rts) {
            this.resourceTypes = rts;
        };

        this.registerAgentTypes = function (agt) {
            this.agentTypes = agt;
        };

        this.updateRegisteredAgentTypes = function() {
            for (var i in this.agentTypes) {
                this.agentTypes[i].healthCategories = this.resourceCategories;
            }
        };

        this.resolveResourceType  = function(code) {
            for (var i in this.resourceTypes) {
                var resourceType = this.resourceTypes[i];
                if (resourceType.code == code)
                    return resourceType;
            }
            return undefined;
        };


        // State variables
        this.currentLevel = null;

        this.currentWave = null;

        this.currentResource = null;



    // Initialise necessary values here
    this.settings.agentCostPerMove = this.settings.DEFAULT_AGENT_COST_PER_MOVE;
    this.settings.rateOfResourceRecovery = this.settings.DEFAULT_RESOURCE_RECOVERY_RATE;

});

initWorld.apply(World);
