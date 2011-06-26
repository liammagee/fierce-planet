/*
 * Profile related functions
 */


var FiercePlanet = FiercePlanet || {};



/**
 * Loads available settings from local storage
 */
FiercePlanet.loadSettingsFromStorage = function () {
    FiercePlanet.currentLevelNumber = (localStorage.currentLevelNumber != undefined ? parseInt(localStorage.currentLevelNumber) : FiercePlanet.currentLevelNumber);
    FiercePlanet.currentLevelPreset = (localStorage.currentLevelPreset != undefined ? (localStorage.currentLevelPreset === 'true') : FiercePlanet.currentLevelPreset);
    FiercePlanet.currentScore = (localStorage.currentScore != undefined ? parseInt(localStorage.currentScore) : FiercePlanet.currentScore);
//    FiercePlanet.totalSaved = (localStorage.totalSaved != undefined ? parseInt(localStorage.totalSaved) : FiercePlanet.totalSaved);
//    FiercePlanet.profileClass = (localStorage.profileClass != undefined ? localStorage.profileClass : FiercePlanet.profileClass);
//    FiercePlanet.credits = (localStorage.credits != undefined ? parseInt(localStorage.credits) : FiercePlanet.credits);
//    FiercePlanet.capabilities = (localStorage.capabilities != undefined ? localStorage.capabilities : FiercePlanet.capabilities);
};

/**
 * Stores relevant profile data in local storage
 */
FiercePlanet.storeData = function() {
    localStorage.currentScore = FiercePlanet.previousLevelScore;
//    if (FiercePlanet.currentLevelNumber > 0 && FiercePlanet.currentLevelNumber <= PresetLevels.MAX_DEFAULT_LEVELS)
    localStorage.currentLevelNumber = FiercePlanet.currentLevelNumber;
    localStorage.currentLevelPreset = FiercePlanet.currentLevel.isPresetLevel();
    localStorage.totalSaved = FiercePlanet.totalSaved;
    localStorage.profileClass = FiercePlanet.profileClass;
    localStorage.credits = FiercePlanet.credits;
    localStorage.capabilities = FiercePlanet.capabilities;
    if (localStorage.highestScore == undefined || FiercePlanet.currentScore > localStorage.highestScore)
        localStorage.highestScore = FiercePlanet.currentScore;
    if (localStorage.highestLevel == undefined || FiercePlanet.currentLevelNumber > localStorage.highestLevel)
        localStorage.highestLevel = FiercePlanet.currentLevelNumber;
};


/**
 * Determines credits and class
 */
FiercePlanet.determineCreditsAndClass = function() {
    FiercePlanet.credits += FiercePlanet.resourcesInStore;
    FiercePlanet.totalSaved += FiercePlanet.savedAgentCount;
    if (FiercePlanet.totalSaved > 5000) {
        FiercePlanet.profileClass = "Genius";
    }
    else if (FiercePlanet.totalSaved > 2500) {
        FiercePlanet.profileClass = "Visionary";
    }
    else if (FiercePlanet.totalSaved > 1000) {
        FiercePlanet.profileClass = "Expert";
    }
    else if (FiercePlanet.totalSaved > 500) {
        FiercePlanet.profileClass = "Planner";
    }
};

/**
 * Compiles statistics for this level
 */
FiercePlanet.compileStats = function() {
    var resourceCount = FiercePlanet.currentLevel.getResources().length;
    var progressTowardsNextClass = 0;
    var stats = {
        "profile[current_level]": FiercePlanet.currentLevelNumber,
        "profile[current_score]": FiercePlanet.currentScore,
        "profile[profile_class]": FiercePlanet.profileClass,
        "profile[credits]": FiercePlanet.credits,
        "profile[capabilities]": FiercePlanet.capabilities.join(','),
        waves_survived: FiercePlanet.currentWave,
        saved_agent_count: FiercePlanet.savedAgentCount,
        expired_agent_count: FiercePlanet.expiredAgentCount,
        resources_spent: FiercePlanet.resourcesSpent,
        resources_in_store: FiercePlanet.resourcesInStore,
        resources: resourceCount,
        economic_resources: FiercePlanet.economicResourceCount,
        environmental_resources: FiercePlanet.environmentalResourceCount,
        social_resources: FiercePlanet.socialResourceCount,
        progress_towards_next_class: progressTowardsNextClass
    };
    return stats;
};

/**
 * Generates statistics for the current level
 */
FiercePlanet.generateStats = function() {
    var stats = "<table>" +
            "<tr>" +
            "<td>Score:</td>" +
            "<td>" + FiercePlanet.currentScore + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Level:</td>" +
            "<td>" + FiercePlanet.currentLevel.getId() + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Waves survived:</td>" +
            "<td>" + FiercePlanet.currentWave + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Citizens saved:</td>" +
            "<td>" + FiercePlanet.savedAgentCount + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Citizens expired:</td>" +
            "<td>" + FiercePlanet.expiredAgentCount + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Resources spent:</td>" +
            "<td>" + FiercePlanet.resourcesSpent + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Resources remaining:</td>" +
            "<td>" + FiercePlanet.resourcesInStore + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td></td>" +
            "<td></td>" +
            "</tr>" +
            "<tr>" +
            "<td>Total saved:</td>" +
            "<td>" + FiercePlanet.totalSaved + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Profile class:</td>" +
            "<td>" + FiercePlanet.profileClass + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Credits:</td>" +
            "<td><span style='font-weight:bold'>" + FiercePlanet.credits + "</span></td>" +
            "</tr>" +
            "</table>";
    return stats;
};

/**
 * Updates the statistics for this profile
 * @param func
 */
FiercePlanet.updateStats = function(func) {
    var stats = FiercePlanet.compileStats();
    $.post("/profiles/" + FiercePlanet.PROFILE_ID + "/update_stats", stats, func);
};

/**
 * Saves current capabilities for this profile
 */
FiercePlanet.saveCapabilities = function() {
    if (FiercePlanet.PROFILE_ID != undefined) {
        FiercePlanet.updateStats(function(data) {});
    }
};
