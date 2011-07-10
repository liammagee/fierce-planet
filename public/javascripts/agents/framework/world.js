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
