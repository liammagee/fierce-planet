

/* Player Class class definition */
function PlayerClass(name, savesRequired) {
    this._name = name;
    this._savesRequired = savesRequired;
}
PlayerClass.prototype.getName = function() { return this._name; }
PlayerClass.prototype.setName = function(name) { this._name = name; }
PlayerClass.prototype.getSavesRequired = function() { return this._savesRequired; }
PlayerClass.prototype.setSavesRequired = function(savesRequired) { this._savesRequired = savesRequired; }



