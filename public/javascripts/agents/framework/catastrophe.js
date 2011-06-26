
/**
 *  Catastrophe class definition
 *  @constructor
 */
function Catastrophe(kind, start, duration, effect, notice) {
    this._kind = kind || "env";
    this._start = start || 0;
    this._duration = duration || 150;
    this._effect = effect || 0.5;
    this._introduction = notice || new Notice("A catastrophe is taking place!", undefined, undefined, this._start, this._duration);
    this._applied = false;
}
Catastrophe.prototype.apply = function() {
    if (!this._applied) {
        // Apply catastrophe effects
        FiercePlanet.currentLevel._resources = [];
//        FiercePlanet.currentLevel.setResources({});
//        var resources = FiercePlanet.currentLevel.getResources();
//        for (var i = 0, len = resources.length; i < len; i++) {
//            var resource = resources[i];
//            resource.setTotalYield(resource.getTotalYield() * this._effect);
//        }
        FiercePlanet.currentNotice = this._introduction;
        this._applied = true;
    }
};

