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



/**
 * Defines a user Profile.
 * (Note that properties use a Ruby rather than Java convention, for Rails + JSON compatibility)
 * @constructor
 */
function Profile() {
    this.id = -1;

    // Core properties, defining current class, capabilities and credits
    // TODO: These reference the FiercePlanet namespace
    this.profile_class = FiercePlanet.PROFILE_CLASSES[0];
    this.capabilities = FiercePlanet.NOVICE_CAPABILITIES;
    this.progress_towards_next_class = 0;
    this.status = '';
    this.credits = 0;

    // Total statistics - TODO: should be reset every new game
    this.total_saved = 0;
    this.total_expired = 1;
    this.total_resources = 1;

    // Scores
    this.previous_level_score = 0;
    this.current_score = 0;
    this.highest_score = 0;

    // Resource counts
    this.resource_count = 0;
    // TODO: These reference the FiercePlanet namespace
    this.resources_in_store = FiercePlanet.STARTING_STORE;
    this.resources_spent = 0;
    // TODO: blend resource category statistics with Rails model, database
    this.resourceStatsCount = {};
//    total_economic_resources integer DEFAULT 0,
//    total_environmental_resources integer DEFAULT 0,
//    total_social_resources integer DEFAULT 0,

    // Agent counts
    this.expired_agent_count = 0;
    this.saved_agent_count = 0;
    this.saved_agent_this_wave_count = 0;

    // Level details
    this.waves_survived = 0;
    this.current_level = 1;
    this.highest_level = 1;

}


/**
 * Initialises the Profile's non-persistent properties
 */
Profile.prototype._initialise = function() {
    this.saved_agent_count = this.saved_agent_count || 0;
    // TODO: These reference the FiercePlanet namespace
    this.resources_in_store = this.resources_in_store || FiercePlanet.STARTING_STORE;
};


/**
 * Increment profile credits
 * @param currentLevel
 */
Profile.prototype.updateStats = function(currentLevel) {
    this.credits += this.resources_in_store;
    this.total_saved += this.saved_agent_count;
    this.current_level = currentLevel || this.current_level;
    if (this.highest_score < this.current_score)
        this.highest_score = this.current_score;
    if (this.highest_level < this.current_level)
        this.highest_level = this.current_level;
    this.evaluateProfileClass();
};


/**
 * Adjust the profile class, based on the total number of agents saved
 */
Profile.prototype.evaluateProfileClass = function() {
    if (this.total_saved > 5000) {
        this.profile_class = FiercePlanet.PROFILE_CLASSES[4];
        this.progress_towards_next_class = 0;
    }
    else if (this.total_saved > 2500) {
        this.profile_class = FiercePlanet.PROFILE_CLASSES[3];
        this.progress_towards_next_class = 5000 - this.total_saved;
    }
    else if (this.total_saved > 1000) {
        this.profile_class = FiercePlanet.PROFILE_CLASSES[2];
        this.progress_towards_next_class = 2500 - this.total_saved;
    }
    else if (this.total_saved > 500) {
        this.profile_class = FiercePlanet.PROFILE_CLASSES[1];
        this.progress_towards_next_class = 1000 - this.total_saved;
    }
    else {
        this.progress_towards_next_class = 500 - this.total_saved;
    }
};

/**
 * Add functions to JSON-restored object
 */
Profile.makeProfile = function(proxyProfile) {
    proxyProfile.updateStats = Profile.prototype.updateStats;
    proxyProfile.evaluateProfileClass = Profile.prototype.evaluateProfileClass;
    proxyProfile._initialise = Profile.prototype._initialise;
    proxyProfile._initialise();

};