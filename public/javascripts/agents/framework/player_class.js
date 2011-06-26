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
    this._name = name;
    this._savesRequired = savesRequired;
}
PlayerClass.prototype.getName = function() { return this._name; };
PlayerClass.prototype.setName = function(name) { this._name = name; };
PlayerClass.prototype.getSavesRequired = function() { return this._savesRequired; };
PlayerClass.prototype.setSavesRequired = function(savesRequired) { this._savesRequired = savesRequired; };



