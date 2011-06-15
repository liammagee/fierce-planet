/**
 * Profile related functions
 */


/* Uses local storage to store highest scores and levels */

/**
 * Loads available settings from local storage
 */
function loadSettingsFromStorage() {
    currentLevelNumber = (localStorage.currentLevelNumber != undefined ? parseInt(localStorage.currentLevelNumber) : currentLevelNumber);
    currentLevelPreset = (localStorage.currentLevelPreset != undefined ? (localStorage.currentLevelPreset === 'true') : currentLevelPreset);
    score = (localStorage.currentScore != undefined ? parseInt(localStorage.currentScore) : score);
//    totalSaved = (localStorage.totalSaved != undefined ? parseInt(localStorage.totalSaved) : totalSaved);
//    profileClass = (localStorage.profileClass != undefined ? localStorage.profileClass : profileClass);
//    credits = (localStorage.credits != undefined ? parseInt(localStorage.credits) : credits);
//    capabilities = (localStorage.capabilities != undefined ? localStorage.capabilities : capabilities);
}

function storeData() {
    localStorage.currentScore = previousLevelScore;
//    if (currentLevelNumber > 0 && currentLevelNumber <= MAX_DEFAULT_LEVELS)
    localStorage.currentLevelNumber = currentLevelNumber;
    localStorage.currentLevelPreset = currentLevel.isPresetLevel();
    localStorage.totalSaved = totalSaved;
    localStorage.profileClass = profileClass;
    localStorage.credits = credits;
    localStorage.capabilities = capabilities;
    if (localStorage.highestScore == undefined || score > localStorage.highestScore)
        localStorage.highestScore = score;
    if (localStorage.highestLevel == undefined || currentLevelNumber > localStorage.highestLevel)
        localStorage.highestLevel = currentLevelNumber;
}



/* Stats functions  */
function determineCreditsAndClass() {
    credits += resourcesInStore;
    totalSaved += savedAgentCount;
    if (totalSaved > 5000) {
        profileClass = "Genius";
    }
    else if (totalSaved > 2500) {
        profileClass = "Visionary";
    }
    else if (totalSaved > 1000) {
        profileClass = "Expert";
    }
    else if (totalSaved > 500) {
        profileClass = "Planner";
    }
}

function compileStats() {
    var resourceCount = currentLevel.getResources().length;
    var progressTowardsNextClass = 0;
    var stats = {
        "profile[current_level]": currentLevelNumber,
        "profile[current_score]": score,
        "profile[profile_class]": profileClass,
        "profile[credits]": credits,
        "profile[capabilities]": capabilities.join(','),
        waves_survived: waves,
        saved_agent_count: savedAgentCount,
        expired_agent_count: expiredAgentCount,
        resources_spent: resourcesSpent,
        resources_in_store: resourcesInStore,
        resources: resourceCount,
        economic_resources: economicResourceCount,
        environmental_resources: environmentalResourceCount,
        social_resources: socialResourceCount,
        progress_towards_next_class: progressTowardsNextClass
    };
    return stats;
}

function generateStats() {
    var stats = "<table>" +
            "<tr>" +
            "<td>Score:</td>" +
            "<td>" + score + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Level:</td>" +
            "<td>" + currentLevelNumber + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Waves survived:</td>" +
            "<td>" + waves + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Citizens saved:</td>" +
            "<td>" + savedAgentCount + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Citizens expired:</td>" +
            "<td>" + expiredAgentCount + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Resources spent:</td>" +
            "<td>" + resourcesSpent + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Resources remaining:</td>" +
            "<td>" + resourcesInStore + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td></td>" +
            "<td></td>" +
            "</tr>" +
            "<tr>" +
            "<td>Total saved:</td>" +
            "<td>" + totalSaved + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Profile class:</td>" +
            "<td>" + profileClass + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Credits:</td>" +
            "<td>" + credits + "</td>" +
            "</tr>" +
            "</table>";
    return stats;
}

function updateStats(func) {
    var stats = compileStats();
    $.post("/profiles/" + PROFILE_ID + "/update_stats", stats, func);
}
