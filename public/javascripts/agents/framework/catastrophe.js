/*!
 * Fierce Planet - Catastrophe
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/**
 * Catastrophe class definition
 *  
 * @constructor
 * @param kind
 * @param start
 * @param duration
 * @param effect
 * @param notice
 */
function Catastrophe(kind, start, duration, effect, notice) {
    this._kind = kind;
    this._start = start || 0;
    this._duration = duration || 150;
    this._effect = effect || 0.5;
    this._notice = notice || new Notice("A catastrophe is taking place!", undefined, undefined, this._start, this._duration);
    this._struck = false;
}

/**
 * 
 */
Catastrophe.prototype.strike = function() {
    if (! this._struck) {
        // Apply catastrophe effects
        var resources = FiercePlanet.currentLevel.getResources();
        var lod = FiercePlanet.levelOfDifficulty;
        var newResources = [];
        for (var i = 0, len = resources.length; i < len; i++) {
            var resource = resources[i];
            // Adjust number of resources attacked based on level of difficulty
            if (Math.random() < Math.pow(this._effect, Math.pow(1, lod - 1)) ) {
                newResources.push(resource);
            }
            else {
                FiercePlanet.clearResource(resource);
            }
        }
//        FiercePlanet.levelOfDifficulty
        FiercePlanet.currentLevel.setResources(newResources);
//        FiercePlanet.clearCanvas('resourceCanvas');
//        FiercePlanet.drawResources();
        FiercePlanet.currentNotice = new Notice("RESOURCES WIPED OUT!");
        this._struck = true;
    }
};

