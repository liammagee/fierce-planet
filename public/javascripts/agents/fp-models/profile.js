/*!
 * Fierce Planet - Profile
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * @namespace Holds functionality related to FiercePlanet
 */
var FP_Profile = FP_Profile || {};

/** @constant The list of available profile classes */
FP_Profile.PROFILE_CLASSES = ["Novice", "Planner", "Expert", "Visionary", "Genius"];
/** @constant The scores at which the profile class is incremented */
FP_Profile.PROFILE_UPGRADE_SCORES = [500, 1000, 2500, 5000, 0];
/** @constant The costs of obtaining capabilities related to each profile class */
FP_Profile.CAPABILITY_COSTS = [0, 100, 200, 300, 500];



/**
 * Defines a user Profile.
 * (Note that properties use a Ruby rather than Java convention, for Rails + JSON compatibility)
 * @constructor
 */
function Profile() {
    // Profile-level properties, defining current class, capabilities and credits
    this.id = -1;
    this.profile_class = FP_Profile.PROFILE_CLASSES[0];
    this.capabilities = FiercePlanet.NOVICE_CAPABILITIES;
    this.progress_towards_next_class = 0;
    this.status = '';
    this.credits = 0;

    this.highest_level = 0;
    this.highest_score = 0;
    this.total_levels = 0;

    this.total_saved = 0;
    this.total_expired = 0;
    this.total_resources_spent = 0;
    this.total_resources_spent_by_category = {};
    this.ave_saved = 0;
    this.ave_expired = 0;
    this.ave_resources_spent = 0;
    this.ave_resources_spent_by_category = {};


    // Game statistics - must be reset every new game
    this.game_total_levels = 0;
    this.game_highest_level = 0;
    this.game_score = 0;

    this.game_total_saved = 0;
    this.game_total_expired = 0;
    this.game_total_resources_spent = 0;
    this.game_total_resources_spent_by_category = {};
    this.game_ave_saved = 0;
    this.game_ave_expired = 0;
    this.game_ave_resources_spent = 0;
    this.game_ave_resources_spent_by_category = {};


    // Level statistics
    this.current_level = 1;
    this.current_level_is_preset = true;
    this.current_score = 0;
    this.current_level_waves = 0;
    this.current_level_saved_this_wave = 0;

    this.current_level_saved = 0;
    this.current_level_expired = 0;
    this.current_level_resources_in_store = FiercePlanet.STARTING_STORE;
    this.current_level_resources_spent = 0;
    this.current_level_resources_spent_by_category = {};
}


/**
 * Initialises the Profile's non-persistent properties
 */
Profile.prototype._initialise = function() {
    this.current_level_saved = this.current_level_saved || 0;
    // TODO: These reference the FiercePlanet namespace
    this.current_level_resources_in_store = this.current_level_resources_in_store || FiercePlanet.STARTING_STORE;
};


/**
 * Resets the current statistics 
 */
Profile.prototype.resetCurrentStats = function(initialStore) {
    this.current_level_saved = 0;
    this.current_level_expired = 0;

    this.current_level_resources_in_store = FiercePlanet.currentLevel.initialResourceStore || FiercePlanet.STARTING_STORE;
    this.current_level_resources_spent = 0;
    this.current_level_resources_spent_by_category = {};
    for (var i = 0; i < World.resourceCategories.length; i++) {
        var category = World.resourceCategories[i];
        this.current_level_resources_spent_by_category[category.code] = 0;
    }
};


/**
 * Initialises the Profile's non-persistent properties
 */
Profile.prototype.initialiseResourceStore = function(initialStore) {
    this.current_level_resources_in_store = initialStore || FiercePlanet.STARTING_STORE;
};



/**
 * Compiles statistics for the current level
 */
Profile.prototype.compileProfileStats = function(currentLevel) {
    // Update level data
    this.current_level = currentLevel._id || this.current_level;
    this.current_level_is_preset = currentLevel.isPresetLevel || this.current_level_is_preset;

    // Update level data

    // Update game data
    if (this.game_highest_level < this.current_level)
        this.game_highest_level = this.current_level;
    if (this.game_score < this.current_score)
        this.game_score = this.current_score;
    this.game_total_levels ++;
    this.game_total_saved += this.current_level_saved;
    this.game_total_expired += this.current_level_expired;
    this.game_total_resources_spent += this.current_level_resources_spent;
    this.game_ave_saved = this.game_total_saved / this.game_total_levels;
    this.game_ave_expired = this.game_total_expired / this.game_total_levels;
    this.game_ave_resources_spent = this.game_total_resources_spent / this.game_total_levels;
    var ks = Object.keys(this.current_level_resources_spent_by_category);
    for (var i = 0; i < ks.length; i++) {
        var key = ks[i];
        var current_level_count = this.current_level_resources_spent_by_category[key];
        var game_count = this.game_total_resources_spent_by_category[key] || 0;
        game_count += current_level_count;
        this.game_total_resources_spent_by_category[key] = game_count;
        this.game_ave_resources_spent_by_category[key] = game_count / this.game_total_levels;
    }


    // Update profile data
    if (this.highest_score < this.current_score)
        this.highest_score = this.current_score;
    if (this.highest_level < this.current_level)
        this.highest_level = this.current_level;
    this.credits += this.current_level_resources_in_store;
    this.total_levels ++;
    this.total_saved += this.current_level_saved;
    this.total_expired += this.current_level_expired;
    this.total_resources_spent += this.current_level_resources_spent;
    this.ave_saved = this.total_saved / this.total_levels;
    this.ave_expired = this.total_expired / this.total_levels;
    this.ave_resources_spent = this.total_resources_spent / this.total_levels;
    for (var i = 0; i < ks.length; i++) {
        var key = ks[i];
        var current_level_count = this.current_level_resources_spent_by_category[key];
        var total_count = this.total_resources_spent_by_category[key] || 0;
        total_count += current_level_count;
        this.total_resources_spent_by_category[key] = total_count;
        this.ave_resources_spent_by_category[key] = total_count / this.total_levels;
    }

    this.evaluateProfileClass();

};




/**
 * Reverts the current profile score to the previous game score
 */
Profile.prototype.resetScores = function() {
    this.current_score = this.game_score = 0;
};



/**
 * Reverts the current profile score to the previous game score
 */
Profile.prototype.revertScore = function() {
    this.current_score = this.game_score;
};


/**
 * Updates the current profile score 
 */
Profile.prototype.updateScore = function() {
    this.game_score = this.current_score;
};




/**
 * Reverts the current profile score to the previous game score
 */
Profile.prototype.processSavedAgent = function(currentWave) {
    this.current_score += FiercePlanet.SAVE_SCORE;
    this.current_level_saved++;
    this.current_level_saved_this_wave++;
    var resource_bonus = (currentWave < 5 ? 4 : (currentWave < 10 ? 3 : (currentWave < 20 ? 2 : 1)));
    this.current_level_resources_in_store += resource_bonus;
};



/**
 * Updates statistics based on a spent resource
 */
Profile.prototype.spendResource = function(resource) {
    var resourceCategory = resource.category.code;
    this.current_level_resources_in_store -= resource.cost;
    this.current_level_resources_spent += resource.cost;
    this.current_level_resources_spent_by_category[resourceCategory] += 1;
};


/**
 * Adjust the profile class, based on the total number of agents saved
 */
Profile.prototype.evaluateProfileClass = function() {
    if (this.total_saved > FP_Profile.PROFILE_UPGRADE_SCORES[3]) {
        this.profile_class = FP_Profile.PROFILE_CLASSES[4];
        this.progress_towards_next_class = FP_Profile.PROFILE_UPGRADE_SCORES[0];
    }
    else if (this.total_saved > FP_Profile.PROFILE_UPGRADE_SCORES[2]) {
        this.profile_class = FP_Profile.PROFILE_CLASSES[3];
        this.progress_towards_next_class = FP_Profile.PROFILE_UPGRADE_SCORES[3] - this.total_saved;
    }
    else if (this.total_saved > FP_Profile.PROFILE_UPGRADE_SCORES[1]) {
        this.profile_class = FP_Profile.PROFILE_CLASSES[2];
        this.progress_towards_next_class = FP_Profile.PROFILE_UPGRADE_SCORES[2] - this.total_saved;
    }
    else if (this.total_saved > FP_Profile.PROFILE_UPGRADE_SCORES[0]) {
        this.profile_class = FP_Profile.PROFILE_CLASSES[1];
        this.progress_towards_next_class = FP_Profile.PROFILE_UPGRADE_SCORES[1] - this.total_saved;
    }
    else {
        this.progress_towards_next_class = FP_Profile.PROFILE_UPGRADE_SCORES[0] - this.total_saved;
    }
};

/**
 * Add functions to JSON-restored object
 */
Profile.makeProfile = function(proxyProfile) {
    proxyProfile.updateStats = Profile.prototype.updateStats;
    proxyProfile.evaluateProfileClass = Profile.prototype.evaluateProfileClass;

    proxyProfile.spendResource = Profile.prototype.spendResource;
    proxyProfile.processSavedAgent = Profile.prototype.processSavedAgent;
    proxyProfile.updateScore = Profile.prototype.updateScore;
    proxyProfile.revertScore = Profile.prototype.revertScore;
    proxyProfile.resetScores = Profile.prototype.resetScores;
    proxyProfile.updateStats = Profile.prototype.updateStats;
    proxyProfile.initialiseResourceStore = Profile.prototype.initialiseResourceStore;
    proxyProfile.resetCurrentStats = Profile.prototype.resetCurrentStats;
    proxyProfile.compileProfileStats = Profile.prototype.compileProfileStats;

    proxyProfile._initialise = Profile.prototype._initialise;
    proxyProfile._initialise();

};