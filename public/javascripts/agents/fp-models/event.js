/*!
 * Fierce Planet - Event
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

var FiercePlanet = FiercePlanet || {};

/**
 * Possible events:
 *  - Lifecycle events
 *  - Agent events (create, change, destroy)
 *  - Resource events (create, change, destroy)
 *
 *  Event listeners:
 *  - Logging
 *  - Recording
 *  - Notifying
 *
 *  Event structure:
 *  - Source (game, level, agent, resource)
 *  - Event (new, complete, change)
 *  - Data
 *  - Time (gameCounter)
 *  - Context (currentLevel)
 *
 * @constructor
 * @param type
 * @param source
 * @param event
 * @param time
 * @param levelContext
 * @param data
 */
function Event(type, source, event, time, levelContext, data){
    this.type = type;
    this.source = source;
    this.event = event;
    this.time = time;
    this.levelContext = levelContext;
    this.data = data;
}


//Copyright (c) 2010 Nicholas C. Zakas. All rights reserved.
//MIT License
/**
 * @constructor
 */
function EventTarget(){
    this.listeners = {};
}

EventTarget.prototype = {

    constructor: EventTarget,

    addListener: function(type, listener){
        if (typeof this.listeners[type] == "undefined"){
            this.listeners[type] = [];
        }

        this.listeners[type].push(listener);
    },

    fire: function(event){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }

        if (!event.type){  //falsy
            throw new Error("Event object missing 'type' property.");
        }

        if (this.listeners[event.type] instanceof Array){
            var listeners = this.listeners[event.type];
            for (var i=0, len=listeners.length; i < len; i++){
                listeners[i].call(this, event);
            }
        }
    },

    removeListener: function(type, listener){
        if (this.listeners[type] instanceof Array){
            var listeners = this.listeners[type];
            for (var i=0, len=listeners.length; i < len; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
};




/**
 * @namespace Contains event functions
 */
FiercePlanet.Event = FiercePlanet.Event || {};

(function() {

    /**
     * Hooks up custom events
     */
    this.hookUpCustomEventListeners = function() {

        // Add logging event listeners
        FiercePlanet.eventTarget.addListener("game", function(e) {
            if (typeof console != "undefined")
               console.log("Game event " + e.event + " logged at:" + e.time);
        });

        // Add notice event listeners
    //    FiercePlanet.eventTarget.addListener("game", function(e) {
    //        if (e._event == "newWave" && e._time == 0) {
    //            FiercePlanet.currentNotice = e._levelContext.getTip();
    //        }
    //    });

        // Add resource listener
        FiercePlanet.eventTarget.addListener("resource", function(e) {
            var resource = e.source;
            var level = e.levelContext;
            if (level.id == 1) {
                var resourceCategory = resource.category;
                var resourceCategoryName = resourceCategory.name;
                var resourceCategoryColor = resourceCategory.color;
                var resourceCategoryCode = resourceCategory.code;
                var categoryCount = FiercePlanet.currentLevel.getResourceCategoryCount(resourceCategoryCode);
                if (categoryCount == 1) {
                    FiercePlanet.currentNotice = new Notice("Well done! You've added your first " + resourceCategoryName + " resource!");
                    FiercePlanet.currentNotice.height = 80;
                    FiercePlanet.currentNotice.foregroundColor = 'rgba(0, 0, 0)';
                    FiercePlanet.currentNotice.backgroundColor = resourceCategoryColor;
                }
            }
        });

    };

}).apply(FiercePlanet.Event);


