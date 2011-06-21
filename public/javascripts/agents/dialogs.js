/**
 * Declares dialogs used in the game
 */


/**
 * Declare the FiercePlanet namespace
 */
var FiercePlanet = FiercePlanet || {};


/**
 *
 */
FiercePlanet.setupDialogs = function() {
    // Dialogs
    FiercePlanet.$statsDialog = $('<div></div>')
        .dialog({
            autoOpen: false,
            modal: true,
            title: 'Vital Statistics',
            buttons: {
                "OK": function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    FiercePlanet.$gameOver = $('<div></div>')
        .html('Game Over!')
        .dialog({
            autoOpen: false,
            modal: true,
            title: 'Game Over!',
            buttons: {
                "Restart Level": function() {
                    FiercePlanet.restartLevel();
                    $( this ).dialog( "close" );
                },
                "New Game": function() {
                    FiercePlanet.newGame();
                    $( this ).dialog( "close" );
                }
            }
        });
    FiercePlanet.$newLevel = $('<div></div>')
        .html('New Level')
        .dialog({
            width: 460,
            autoOpen: false,
            modal: true,
            title: 'New Level',
            buttons: {
                "Play": function() {
                    FiercePlanet.newWave();
                    $( this ).dialog( "close" );
                },
                "Cancel": function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    FiercePlanet.$completeLevel = $('<div></div>')
        .html('Level Complete!')
        .dialog({
            autoOpen: false,
             modal: true,
            title: 'Level Complete!',
            buttons: {
                "Next Level": function() {
                    FiercePlanet.newLevel();
                    $( this ).dialog( "close" );
                },
                "Cancel": function() {
                    FiercePlanet.newLevel();
                    $( this ).dialog( "close" );
                }
            }
        });

    FiercePlanet.$completeGame = $('<div></div>')
        .html('Complete game!')
        .dialog({
            autoOpen: false,
            modal: true,
            title: 'Fierce Planet Complete!',
            buttons: {
                "New Game": function() {
                    FiercePlanet.newGame();
                    $( this ).dialog( "close" );
                },
                "Cancel": function() {
                    $( this ).dialog( "close" );
                }
            }

        });

    /* Upgrade / delete dialog */
    FiercePlanet.$upgradeDelete = $('#delete-upgrade-dialog')
        .dialog({
            autoOpen: false,
            modal: true,
            title: 'Upgrade or Delete Resource',
            buttons: {
                "Cancel": function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    $('#del-button').click(function() {FiercePlanet.deleteCurrentResource(); FiercePlanet.$upgradeDelete.dialog('close'); });
    $('#upg-button').click(function() {FiercePlanet.upgradeCurrentResource(); FiercePlanet.$upgradeDelete.dialog('close'); });

    FiercePlanet.$resourceGallery = $('#resource-gallery')
        .dialog({
            width: 460,
            autoOpen: false,
            modal: true,
            title: 'Resource Gallery',
            buttons: {
                "Save Capabilities": function() {
                    FiercePlanet.refreshSwatch();
                    FiercePlanet.saveCapabilities();
                    $( this ).dialog( "close" );
                },
                "Cancel": function() {
                    $( this ).dialog( "close" );
                }
            }
        });

    $settingsDialog = $('#settings-dialog')
        .dialog({
            width: 460,
            autoOpen: false,
            modal: true,
            title: 'Settings',
            buttons: {
                "Save Settings": function() {
                    FiercePlanet.setAndStoreProperties();
                    $( this ).dialog( "close" );
                },
                "Cancel": function() {
                    $( this ).dialog( "close" );
                }
            }
        });

    $('#tutorial').click(function(e) {
        FiercePlanet.currentLevelNumber = 0;
        FiercePlanet.currentLevelPreset = false;
        FiercePlanet.restartLevel();
    });

    FiercePlanet.$designFeatures = $('#level-features')
        .dialog({
            autoOpen: false,
            modal: true,
            title: 'Add design features',
            buttons: {
                "Cancel": function() {
                    $( this ).dialog( "close" );
                }
            }

        });

    FiercePlanet.$editProperties = $('<div></div>')
        .html('Edit level properties')
        .dialog({
            autoOpen: false,
            modal: true,
            title: 'Edit level properties',
            buttons: {
                "Save Level": function() {
                    $(".edit_level_properties").submit();
                    FiercePlanet.drawGame();
                    $( this ).dialog( "close" );
                },
                "Cancel": function() {
                    $( this ).dialog( "close" );
                }
            }

        });
    
};

/**
 *
 */
FiercePlanet.showGameOverDialog = function () {
    FiercePlanet.determineCreditsAndClass();
    // Try to save results to the server
    if (FiercePlanet.PROFILE_ID != undefined) {
        FiercePlanet.updateStats(function(data) {
               FiercePlanet.openGameOverDialog();
           });
    }
    else {
        FiercePlanet.openGameOverDialog();
    }
};

/**
 *
 */
FiercePlanet.openGameOverDialog = function() {
    FiercePlanet.$gameOver
            .html(
            "Unfortunately Fierce Planet has gotten the better of its citizens! Click 'Restart Level' or 'New Game' to try again." +
                    FiercePlanet.generateStats()
            )
            .dialog('open');
};

/**
 *
 */
FiercePlanet.showCompleteGameDialog = function() {
    FiercePlanet.determineCreditsAndClass();
    // Try to save results to the server
    if (FiercePlanet.PROFILE_ID != undefined) {
        var stats = FiercePlanet.compileStats();
        $.post("/profiles/" + FiercePlanet.PROFILE_ID + "/update_stats", stats,
           function(data) {
               FiercePlanet.openCompleteGameDialog();
           });
    }
    else {
        FiercePlanet.openCompleteGameDialog();
    }
};

/**
 *
 */
FiercePlanet.openCompleteGameDialog = function() {
    FiercePlanet.$completeGame
            .html(
            "Congratulations! In spite of challenges ahead, the citizens of Fierce Planet look forward to a bright and sustainable future!" +
                    FiercePlanet.generateStats())
            .dialog('open');
};

/**
 * Show the completed level dialog
 */
FiercePlanet.showCompleteLevelDialog = function() {
    // Try to save results to the server
    FiercePlanet.determineCreditsAndClass();
    if (FiercePlanet.PROFILE_ID != undefined) {
        var stats = FiercePlanet.compileStats();
        $.post("/profiles/" + FiercePlanet.PROFILE_ID + "/update_stats", stats,
           function(data) {
               FiercePlanet.openCompleteLevelDialog();
           });
    }
    else {
        FiercePlanet.openCompleteLevelDialog();
    }
};

/**
 *
 */
FiercePlanet.openCompleteLevelDialog = function() {
    FiercePlanet.$completeLevel
            .html("<p>Congratulations! You have completed level " + FiercePlanet.currentLevel.getId() + ". </p>" +
                 FiercePlanet.generateStats() +
                "<p>Click 'OK' to start the next level.</p>")
            .dialog('open');
};

/**
 *
 * @param e
 */
FiercePlanet.showUpgradeDeleteDialog = function(e) {
    var __ret = FiercePlanet.getCurrentPosition(e);
    var posX = __ret.posX;
    var posY = __ret.posY;
    var foundResource = false;
    for (var i = 0; i < FiercePlanet.currentLevel.getResources().length; i++) {
        var p = FiercePlanet.currentLevel.getResources()[i];
        if (p.getX() == posX && p.getY() == posY) {
            FiercePlanet.currentResource = p;
            FiercePlanet.$upgradeDelete.dialog('open');
            return;
        }
    }
    var currentTile = FiercePlanet.currentLevel.getTile(posX, posY);
    if (FiercePlanet.tilesMutable) {
        if (currentTile == undefined) {
            FiercePlanet.currentLevel.addTile(new Tile(DEFAULT_TILE_COLOR, posX, posY));
            FiercePlanet.drawGame();
        }
        else if (!foundResource && FiercePlanet.currentResourceId != null) {
            FiercePlanet.dropItem(e);
        }
        else {
            var __ret = FiercePlanet.getCurrentPosition(e);
            FiercePlanet.currentLevel.removeTile(__ret.posX, __ret.posY);
            FiercePlanet.drawGame();
        }
    }
    else if (!foundResource && FiercePlanet.currentResourceId != null) {
        FiercePlanet.dropItem(e);
    }
};

/**
 *
 */
FiercePlanet.showResourceGallery = function() {
    // Try to save results to the server
    $('#current-profile-class')[0].innerHTML = FiercePlanet.profileClass;
    $('#current-credits')[0].innerHTML = FiercePlanet.credits;
    $('#current-capabilities')[0].innerHTML = FiercePlanet.capabilities.join(",");

    var accessibleCapabilities = [];
    var purchasableItems = [];

    if (FiercePlanet.profileClass == "Novice") {
        accessibleCapabilities = FiercePlanet.NOVICE_CAPABILITIES;
    }
    else if (FiercePlanet.profileClass == "Planner") {
        accessibleCapabilities = FiercePlanet.PLANNER_CAPABILITIES;
    }
    else if (FiercePlanet.profileClass == "Expert") {
        accessibleCapabilities = FiercePlanet.EXPERT_CAPABILITIES;
    }
    else if (FiercePlanet.profileClass == "Visionary") {
        accessibleCapabilities = FiercePlanet.VISIONARY_CAPABILITIES;
    }
    else if (FiercePlanet.profileClass == "Genius") {
        accessibleCapabilities = FiercePlanet.GENIUS_CAPABILITIES;
    }


    // Evaluate available capabilities
    var links = $('.purchase');
    for (var i = 0; i < links.length; i++) {
        var purchasableItem = links[i];
        var id = purchasableItem.id;
        var itemName = id.split("-purchase")[0];
        var cost = 0;
        if ($.inArray(itemName, FiercePlanet.PLANNER_CAPABILITIES)) {
            cost = FiercePlanet.CAPABILITY_COSTS [1];
        }
        else if ($.inArray(itemName, FiercePlanet.EXPERT_CAPABILITIES)) {
            cost = FiercePlanet.CAPABILITY_COSTS [2];
        }
        else if ($.inArray(itemName, FiercePlanet.VISIONARY_CAPABILITIES)) {
            cost = FiercePlanet.CAPABILITY_COSTS [3];
        }
        else if ($.inArray(itemName, FiercePlanet.GENIUS_CAPABILITIES)) {
            cost = FiercePlanet.CAPABILITY_COSTS [4];
        }
        // Make item available for purchase if: (1) the player's level permits it; (2) it is not among existing capabilities and (3) there is enough money
        if ($.inArray(itemName, accessibleCapabilities) > -1 && $.inArray(itemName, FiercePlanet.capabilities) == -1 && cost < FiercePlanet.credits) {
            // Make item purchasable
            purchasableItems.push(purchasableItem);
        }
        else {
            $('#' + purchasableItem.id).css("border","1px solid black");
        }
        // Remove any existing event listeners
//        purchasableItem.removeEventListener('click', handler, false);
    }
    for (var i = 0; i < purchasableItems.length; i++) {
        var purchasableItem = purchasableItems[i];
        var id = purchasableItem.id;
        var itemName = id.split("-purchase")[0];
        var cost = 0;
        if ($.inArray(itemName, FiercePlanet.PLANNER_CAPABILITIES)) {
            cost = FiercePlanet.CAPABILITY_COSTS [1];
        }
        else if ($.inArray(itemName, FiercePlanet.EXPERT_CAPABILITIES)) {
            cost = FiercePlanet.CAPABILITY_COSTS [2];
        }
        else if ($.inArray(itemName, FiercePlanet.VISIONARY_CAPABILITIES)) {
            cost = FiercePlanet.CAPABILITY_COSTS [3];
        }
        else if ($.inArray(itemName, FiercePlanet.GENIUS_CAPABILITIES)) {
            cost = FiercePlanet.CAPABILITY_COSTS [4];
        }

        purchasableItem.addEventListener('click', function(e) {
            var id = this.id;
            var swatchId = id.split("-purchase")[0];
            var itemName = $('#' + id + ' > a > img')[0].title;
            if ($.inArray(swatchId, FiercePlanet.capabilities) == -1) {
                var purchase = confirm('Purchase item "' + itemName + '"?');
                if (purchase) {
                    FiercePlanet.credits -= cost;
                    FiercePlanet.capabilities.push(swatchId);
                    $('#current-credits')[0].innerHTML = FiercePlanet.credits;
                    $('#current-capabilities')[0].innerHTML = FiercePlanet.capabilities.join(", ");
                    $('#' + id).css("border","1px solid black");
                }
            }
            e.stopPropagation();
            return false;
        }, true );
//        purchasableItem.css("border","9px solid red");
        $('#' + purchasableItem.id).css("border","3px solid black");
    }

    FiercePlanet.$resourceGallery.dialog('open');
};

/**
 * 
 */
FiercePlanet.showSettings = function() {
    $settingsDialog.dialog('open');
};
