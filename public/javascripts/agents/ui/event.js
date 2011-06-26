/*!
 * Fierce Planet - Event
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


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
    this._source = source;
    this._event = event;
    this._time = time;
    this._levelContext = levelContext;
    this._data = data;
}


//Copyright (c) 2010 Nicholas C. Zakas. All rights reserved.
//MIT License

function EventTarget(){
    this._listeners = {};
}

EventTarget.prototype = {

    constructor: EventTarget,

    addListener: function(type, listener){
        if (typeof this._listeners[type] == "undefined"){
            this._listeners[type] = [];
        }

        this._listeners[type].push(listener);
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

        if (this._listeners[event.type] instanceof Array){
            var listeners = this._listeners[event.type];
            for (var i=0, len=listeners.length; i < len; i++){
                listeners[i].call(this, event);
            }
        }
    },

    removeListener: function(type, listener){
        if (this._listeners[type] instanceof Array){
            var listeners = this._listeners[type];
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
 *
 */
FiercePlanet.hookUpCustomEventListeners = function() {

    // Add logging event listeners
    FiercePlanet.eventTarget.addListener("game", function(e) {
        if (typeof console != "undefined")
           console.log("Game event " + e._event + " logged at:" + e._time);
    });

    // Add notice event listeners
//    FiercePlanet.eventTarget.addListener("game", function(e) {
//        if (e._event == "newWave" && e._time == 0) {
//            FiercePlanet.currentNotice = e._levelContext.getTip();
//        }
//    });

    // Add resource listener
    FiercePlanet.eventTarget.addListener("resource", function(e) {
        var resource = e._source;
        var level = e._levelContext;
        if (level.getId() == 1) {
            var resources = level.getResources();
            var ecoCount = 0;
            var envCount = 0;
            var socCount = 0;
            for (var i = 0; i < resources.length; i++) {
                var r = resources[i];
                switch (r.getType()) {
                    case 'eco':
                        ecoCount++;
                        break;
                    case 'env':
                        envCount++;
                        break;
                    case 'soc':
                        socCount++;
                        break;
                }
            }
            switch (resource.getType()) {
                case 'eco':
                    if (ecoCount == 1) {
                        FiercePlanet.currentNotice = new Notice("Well done! You've added your first economic resource!");
                        FiercePlanet.currentNotice._height = 80;
                        FiercePlanet.currentNotice._backgroundColor = 'rgba(136, 201, 255)';
                        FiercePlanet.currentNotice._foregroundColor = 'rgba(0, 0, 0)';
                    }
                    break;
                case 'env':
                    if (envCount == 1) {
                        FiercePlanet.currentNotice = new Notice("Well done! You've added your first environmental resource!");
                        FiercePlanet.currentNotice._height = 80;
                        FiercePlanet.currentNotice._backgroundColor = 'rgba(0, 255, 0)';
                        FiercePlanet.currentNotice._foregroundColor = 'rgba(0, 0, 0)';
                    }
                    break;
                case 'soc':
                    if (socCount == 1) {
                        FiercePlanet.currentNotice = new Notice("Well done! You've added your first social resource!");
                        FiercePlanet.currentNotice._height = 80;
                        FiercePlanet.currentNotice._foregroundColor = 'rgba(0, 0, 0)';
                        FiercePlanet.currentNotice._backgroundColor = 'rgba(255, 51, 0)';
                    }
                    break;
            }
        }
    });

};