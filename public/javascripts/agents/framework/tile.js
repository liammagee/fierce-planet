/*!
 * Fierce Planet - Tile
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * Tile constants
 */
var DEFAULT_TILE_COLOR = "0FFF1F";


/**
 * Tile class definition
 * @constructor
 */
function Tile() {
    this._color = "0FFF1F";
}

/**
 * Tile class definition
 * @constructor
 */
function Tile(color) {
    this._color = color;
}

/**
 * Tile class definition
 * @constructor
 */
function Tile(color, x, y) {
    this._color = color;
    this._x = x;
    this._y = y;
}
Tile.prototype.getColor = function() { return this._color;};
Tile.prototype.getPosition = function() { return [this._x, this._y]; };
Tile.prototype.setPosition = function(x, y) { this._x =x; this._y = y; };
Tile.prototype.getX = function() { return this._x; };
Tile.prototype.setX = function(x) { this._x = x; };
Tile.prototype.getY = function() { return this._y; };
Tile.prototype.setY = function(y) { this._y = y; };

