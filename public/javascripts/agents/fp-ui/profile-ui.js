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

};

/**
 * Stores relevant profile data in local storage
 */
FiercePlanet.storeData = function() {
    localStorage.currentLevelNumber = FiercePlanet.currentLevelNumber;
    localStorage.currentLevelPreset = FiercePlanet.currentLevel.isPresetLevel();
    localStorage.currentProfile = $.toJSON(FiercePlanet.currentProfile);
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
            "<td>" + FiercePlanet.currentProfile.current_level_saved + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Citizens expired:</td>" +
            "<td>" + FiercePlanet.currentProfile.current_level_expired + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Resources spent:</td>" +
            "<td>" + FiercePlanet.currentProfile.current_level_resources_spent + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Resources remaining:</td>" +
            "<td>" + FiercePlanet.currentProfile.current_level_resources_in_store + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td></td>" +
            "<td></td>" +
            "</tr>" +
            "<tr>" +
            "<td>Total saved:</td>" +
            "<td>" + FiercePlanet.currentProfile.game_total_saved + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Total expired:</td>" +
            "<td>" + FiercePlanet.currentProfile.game_total_expired + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Total resources spent:</td>" +
            "<td>" + FiercePlanet.currentProfile.game_total_resources_spent + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Profile class:</td>" +
            "<td>" + FiercePlanet.currentProfile.profile_class + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Credits:</td>" +
            "<td><span style='font-weight:bold'>" + FiercePlanet.currentProfile.credits + " (<a href='#' id='gotoResourceGallery'>More</a>)</span></td>" +
            "</tr>" +
            "</table>";
    return stats;
};

/**
 * Saves current capabilities for this profile
 * @param func
 */
FiercePlanet.saveProfile = function(func) {
    if (FiercePlanet.currentProfile.id > -1) {
        $.post("/profiles/" + FiercePlanet.currentProfile.id + "/update_stats", FiercePlanet.serializeProfile(), func);
    }
};

/**
 * Saves current capabilities for this profile
 */
FiercePlanet.saveCapabilities = function() {
    FiercePlanet.saveProfile();
};
