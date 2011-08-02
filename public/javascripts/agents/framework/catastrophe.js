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
    this.kind = kind;
    this.start = start || 0;
    this.duration = duration || 150;
    this.effect = effect || 0.5;
    this.notice = notice || new Notice("A catastrophe is taking place!", undefined, undefined, this.start, this.duration);
    this.struck = false;
}

/**
 * 
 */
Catastrophe.prototype.strike = function() {
    if (! this.struck) {
        // Apply catastrophe effects
        var resources = FiercePlanet.currentLevel.resources;
        var lod = FiercePlanet.levelOfDifficulty;
        var newResources = [];
        for (var i = 0, len = resources.length; i < len; i++) {
            var resource = resources[i];
            // Adjust number of resources attacked based on level of difficulty
            var threshold = Math.pow(this.effect, Math.pow(1, lod - 1));
            if (Math.random() < threshold ) {
                newResources.push(resource);
            }
            else {
                FiercePlanet.Drawing.clearResource(resource);
            }
        }
//        FiercePlanet.levelOfDifficulty
        FiercePlanet.currentLevel.setResources(newResources);
//        FiercePlanet.clearCanvas('resourceCanvas');
//        FiercePlanet.drawResources();
//        FiercePlanet.currentNotice = new Notice("RESOURCES WIPED OUT!");
        this.struck = true;
    }
};

