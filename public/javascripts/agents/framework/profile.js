/*!
 * Fierce Planet - Catastrophe
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/** @constant The list of available profile classes */
FiercePlanet.PROFILE_CLASSES = ["Novice", "Planner", "Expert", "Visionary", "Genius"];
/** @constant The costs of obtaining capabilities related to each profile class */
FiercePlanet.CAPABILITY_COSTS = [0, 100, 200, 300, 500];


// TODO: Refactor out
FiercePlanet.NOVICE_CAPABILITIES = ["farm", "water", "clinic"];
FiercePlanet.PLANNER_CAPABILITIES = FiercePlanet.NOVICE_CAPABILITIES.concat(["shop", "park", "school"]);
FiercePlanet.EXPERT_CAPABILITIES = FiercePlanet.PLANNER_CAPABILITIES.concat(["bank", "air", "legal"]);
FiercePlanet.VISIONARY_CAPABILITIES = FiercePlanet.EXPERT_CAPABILITIES.concat(["factory", "energy", "democracy"]);
FiercePlanet.GENIUS_CAPABILITIES = FiercePlanet.VISIONARY_CAPABILITIES.concat(["stockmarket", "biodiversity", "festival"]);

/**
 * @constructor
 */
function Profile() {
    this._id = "";
    this._capabilities = ["farm", "water", "clinic"];
    this._profileClass = "Novice";
    this._credits = 0;
    this._totalSaved = 0;
    this._previousLevelScore = 0;
    this._currentScore = 0;
    this._resourcesInStore = 0;
    this._resourcesSpent = 0;
    this._expiredAgentCount = 0;
    this._savedAgentCount = 0;
    this._savedAgentThisWaveCount = 0;
    this._resourceStatsCount = {};
}
