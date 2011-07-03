/*!
 * Fierce Planet - Profile
 * Profile related functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};



/**
 * Loads available settings from local storage
 */
FiercePlanet.loadSettingsFromStorage = function () {
    FiercePlanet.currentLevelNumber = (localStorage.currentLevelNumber != undefined ? parseInt(localStorage.currentLevelNumber) : FiercePlanet.currentLevelNumber);
    FiercePlanet.currentLevelPreset = (localStorage.currentLevelPreset != undefined ? (localStorage.currentLevelPreset === 'true') : FiercePlanet.currentLevelPreset);
    FiercePlanet.current_score = (localStorage.current_score != undefined ? parseInt(localStorage.current_score) : FiercePlanet.current_score);
    if (localStorage.currentProfile) {
        var cp = localStorage.currentProfile;
//        FiercePlanet.currentProfile = $.evalJSON(cp);
    }


//    FiercePlanet.totalSaved = (localStorage.totalSaved != undefined ? parseInt(localStorage.totalSaved) : FiercePlanet.totalSaved);
//    FiercePlanet.profileClass = (localStorage.profileClass != undefined ? localStorage.profileClass : FiercePlanet.profileClass);
//    FiercePlanet.credits = (localStorage.credits != undefined ? parseInt(localStorage.credits) : FiercePlanet.credits);
//    FiercePlanet.capabilities = (localStorage.capabilities != undefined ? localStorage.capabilities : FiercePlanet.capabilities);
};

/**
 * Stores relevant profile data in local storage
 */
FiercePlanet.storeData = function() {
    localStorage.current_score = FiercePlanet.previous_level_score;
//    if (FiercePlanet.currentLevelNumber > 0 && FiercePlanet.currentLevelNumber <= PresetLevels.MAX_DEFAULT_LEVELS)
    localStorage.currentLevelNumber = FiercePlanet.currentLevelNumber;
    localStorage.currentLevelPreset = FiercePlanet.currentLevel.isPresetLevel();
    localStorage.currentProfile = $.toJSON(FiercePlanet.currentProfile);

/*
    localStorage.totalSaved = FiercePlanet.totalSaved;
    localStorage.profileClass = FiercePlanet.profileClass;
    localStorage.credits = FiercePlanet.credits;
    localStorage.capabilities = FiercePlanet.capabilities;
    if (localStorage.highestScore == undefined || FiercePlanet.currentScore > localStorage.highestScore)
        localStorage.highestScore = FiercePlanet.currentScore;
    if (localStorage.highestLevel == undefined || FiercePlanet.currentLevelNumber > localStorage.highestLevel)
        localStorage.highestLevel = FiercePlanet.currentLevelNumber;
        */
};


/**
 * Compiles statistics for this level
 */
FiercePlanet.serializeProfile = function() {
    var resourceCount = FiercePlanet.currentLevel.getResources().length;
    var profileProxy = {};
    profileProxy = FiercePlanet.currentProfile;
    var stats = {
        profile_object: $.toJSON(profileProxy)
    };
    return stats;
};

/**
 * Generates statistics for the current level
 */
FiercePlanet.generateStats = function() {
    var stats = "<table>" +
            "<tr>" +
            "<td>Level:</td>" +
            "<td>" + FiercePlanet.currentLevel.getId() + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Waves survived:</td>" +
            "<td>" + FiercePlanet.currentWave + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Score:</td>" +
            "<td>" + FiercePlanet.currentProfile.current_score + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Citizens saved:</td>" +
            "<td>" + FiercePlanet.currentProfile.saved_agent_count + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Citizens expired:</td>" +
            "<td>" + FiercePlanet.currentProfile.expired_agent_count + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Resources spent:</td>" +
            "<td>" + FiercePlanet.currentProfile.resources_spent + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Resources remaining:</td>" +
            "<td>" + FiercePlanet.currentProfile.resources_in_store + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td></td>" +
            "<td></td>" +
            "</tr>" +
            "<tr>" +
            "<td>Total saved:</td>" +
            "<td>" + FiercePlanet.currentProfile.total_saved + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Profile class:</td>" +
            "<td>" + FiercePlanet.currentProfile.profile_class + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Credits:</td>" +
            "<td><span style='font-weight:bold'>" + FiercePlanet.currentProfile.credits + " [<a href='#' id='gotoResourceGallery'>SPEND</a>]</span></td>" +
            "</tr>" +
            "</table>";
    return stats;
};

/**
 * Updates the statistics for this profile
 * @param func
 */
FiercePlanet.updateStats = function(func) {
    if (FiercePlanet.currentProfile.id > -1) {
        $.post("/profiles/" + FiercePlanet.currentProfile.id + "/update_stats", FiercePlanet.serializeProfile(), func);
    }
};

/**
 * Saves current capabilities for this profile
 */
FiercePlanet.saveCapabilities = function() {
    FiercePlanet.updateStats();
};
