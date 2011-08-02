/*!
 * Fierce Planet - PlayerClass
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * Player Class class definition.
 * @constructor
 * @param name
 * @param savesRequired
 */
function PlayerClass(name, savesRequired) {
    this.name = name;
    this.savesRequired = savesRequired;
}
PlayerClass.prototype.getName = function() { return this.name; };
PlayerClass.prototype.setName = function(name) { this.name = name; };
PlayerClass.prototype.getSavesRequired = function() { return this.savesRequired; };
PlayerClass.prototype.setSavesRequired = function(savesRequired) { this.savesRequired = savesRequired; };



