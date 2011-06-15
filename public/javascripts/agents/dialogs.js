/**
 * Declares dialogs used in the game
 */

// Main game dialogs
var $gameOver;
var $completeLevel;
var $completeGame;
var $levelSetup;
var $levelList;
var $upgradeDelete;
var $resourceGallery;


// Level editor dialogs
var $designFeatures;
var $editProperties;


function setupDialogs() {
    // Dialogs
    $statsDialog = $('<div></div>')
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
    $gameOver = $('<div></div>')
        .html('Game Over!')
        .dialog({
            autoOpen: false,
            modal: true,
            title: 'Game Over!',
            buttons: {
                "Restart Level": function() {
                    restartLevel();
                    $( this ).dialog( "close" );
                },
                "New Game": function() {
                    newGame();
                    $( this ).dialog( "close" );
                }
            }
        });
    $completeLevel = $('<div></div>')
        .html('Level Complete!')
        .dialog({
            autoOpen: false,
             modal: true,
            title: 'Level Complete!',
            buttons: {
                "OK": function() {
                    newLevel();
                    $( this ).dialog( "close" );
                }
            }
        });

    $completeGame = $('<div></div>')
        .html('Complete game!')
        .dialog({
            autoOpen: false,
            modal: true,
            title: 'Fierce Planet Complete!',
            buttons: {
                "OK": function() {
                    newGame();
                    $( this ).dialog( "close" );
                }
            }

        });

    $levelSetup = $('<div></div>')
        .html('Level Setup')
        .dialog({
            autoOpen: false,
            modal: true,
            title: 'Level Setup',
            buttons: {
                "OK": function() {
                    redrawWorld();
                    $( this ).dialog( "close" );
                }
            }

        });


    /* Upgrade / delete dialog */
    $upgradeDelete = $('#delete-upgrade-dialog')
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
    $('#del-button').click(function() {ResourceUI.deleteCurrentResource(); $upgradeDelete.dialog('close'); });
    $('#upg-button').click(function() {ResourceUI.upgradeCurrentResource(); $upgradeDelete.dialog('close'); });

    $resourceGallery = $('#resource-gallery')
        .dialog({
            width: 460,
            autoOpen: false,
            modal: true,
            title: 'Resource Gallery',
            buttons: {
                "OK": function() {
                    refreshSwatch();
                    saveCapabilities();
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
                "OK": function() {
                    saveSettings();
                    $( this ).dialog( "close" );
                }
            }
        });

    $('#tutorial').click(function(e) {
        currentLevelNumber = 0;
        currentLevelPreset = false;
        restartLevel();
    }, false    );

    $designFeatures = $('#level-features')
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

    $editProperties = $('<div></div>')
        .html('Edit level properties')
        .dialog({
            autoOpen: false,
            modal: true,
            title: 'Edit level properties',
            buttons: {
                "Save Level": function() {
                    $(".edit_level_properties").submit();
                    redrawWorld();
                    $( this ).dialog( "close" );
                },
                "Cancel": function() {
                    $( this ).dialog( "close" );
                }
            }

        });
    
}


function showGameOverDialog() {
    determineCreditsAndClass();
    // Try to save results to the server
    if (PROFILE_ID != undefined) {
        updateStats(function(data) {
               openGameOverDialog();
           });
    }
    else {
        openGameOverDialog();
    }
}

function openGameOverDialog() {
    $gameOver
            .html(
            "Unfortunately Fierce Planet has gotten the better of its citizens! Click 'Restart Level' or 'New Game' to try again." +
                    generateStats()
            )
            .dialog('open');
}

function showCompleteGameDialog() {
    determineCreditsAndClass();
    // Try to save results to the server
    if (PROFILE_ID != undefined) {
        var stats = compileStats();
        $.post("/profiles/" + PROFILE_ID + "/update_stats", stats,
           function(data) {
               openCompleteGameDialog();
           });
    }
    else {
        openCompleteGameDialog();
    }
}

function openCompleteGameDialog() {
    $completeGame
            .html(
            "Congratulations! In spite of challenges ahead, the citizens of Fierce Planet look forward to a bright and sustainable future!" +
                    generateStats())
            .dialog('open');
}

// Show the completed level dialog
function showCompleteLevelDialog() {
    // Try to save results to the server
    determineCreditsAndClass();
    if (PROFILE_ID != undefined) {
        var stats = compileStats();
        $.post("/profiles/" + PROFILE_ID + "/update_stats", stats,
           function(data) {
               openCompleteLevelDialog();
           });
    }
    else {
        openCompleteLevelDialog();
    }
}

function openCompleteLevelDialog() {
    $completeLevel
            .html(
                "<p>Congratulations! You have completed level " + currentLevelNumber + ". </p>" +
                 generateStats() +
                "<p>Click 'OK' to start the next level.</p>")
            .dialog('open');
}

function showUpgradeDeleteDialog(e) {
    var __ret = getCurrentPosition(e);
    var posX = __ret.posX;
    var posY = __ret.posY;
    var foundResource = false;
    for (var i = 0; i < currentLevel.getResources().length; i++) {
        var p = currentLevel.getResources()[i];
        if (p.getX() == posX && p.getY() == posY) {
            currentResource = p;
            $upgradeDelete.dialog('open');
            return;
        }
    }
    var currentTile = currentLevel.getTile(posX, posY);
    if (tilesMutable) {
        if (currentTile == undefined) {
            currentLevel.addTile(new Tile(DEFAULT_TILE_COLOR, posX, posY));
            drawWorld();
        }
        else if (!foundResource && currentResourceId != null) {
            dropItem(e);
        }
        else {
            var __ret = getCurrentPosition(e);
            currentLevel.removeTile(__ret.posX, __ret.posY);
            drawWorld();
        }
    }
    else if (!foundResource && currentResourceId != null) {
        dropItem(e);
    }
}

function showResourceGallery() {
    // Try to save results to the server
    $('#current-profile-class')[0].innerHTML = profileClass;
    $('#current-credits')[0].innerHTML = credits;
    $('#current-capabilities')[0].innerHTML = capabilities.join(",");

    var accessibleCapabilities = new Array();
    var purchasableItems = new Array();

    if (profileClass == "Novice") {
        accessibleCapabilities = NOVICE_CAPABILITIES;
    }
    else if (profileClass == "Planner") {
        accessibleCapabilities = PLANNER_CAPABILITIES;
    }
    else if (profileClass == "Expert") {
        accessibleCapabilities = EXPERT_CAPABILITIES;
    }
    else if (profileClass == "Visionary") {
        accessibleCapabilities = VISIONARY_CAPABILITIES;
    }
    else if (profileClass == "Genius") {
        accessibleCapabilities = GENIUS_CAPABILITIES;
    }


    // Evaluate available capabilities
    var links = $('.purchase');
    for (var i = 0; i < links.length; i++) {
        var purchasableItem = links[i];
        var id = purchasableItem.id;
        var itemName = id.split("-purchase")[0];
        var cost = 0;
        if ($.inArray(itemName, PLANNER_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [1];
        }
        else if ($.inArray(itemName, EXPERT_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [2];
        }
        else if ($.inArray(itemName, VISIONARY_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [3];
        }
        else if ($.inArray(itemName, GENIUS_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [4];
        }
        // Make item available for purchase if: (1) the player's level permits it; (2) it is not among existing capabilities and (3) there is enough money
        if ($.inArray(itemName, accessibleCapabilities) > -1 && $.inArray(itemName, capabilities) == -1 && cost < credits) {
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
        if ($.inArray(itemName, PLANNER_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [1];
        }
        else if ($.inArray(itemName, EXPERT_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [2];
        }
        else if ($.inArray(itemName, VISIONARY_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [3];
        }
        else if ($.inArray(itemName, GENIUS_CAPABILITIES)) {
            cost = CAPABILITY_COSTS [4];
        }

        purchasableItem.addEventListener('click', function(e) {
            var id = this.id;
            var swatchId = id.split("-purchase")[0];
            var itemName = $('#' + id + ' > a > img')[0].title;
            if ($.inArray(swatchId, capabilities) == -1) {
                var purchase = confirm('Purchase item "' + itemName + '"?');
                if (purchase) {
                    credits -= cost;
                    capabilities.push(swatchId);
                    $('#current-credits')[0].innerHTML = credits;
                    $('#current-capabilities')[0].innerHTML = capabilities.join(", ");
                    $('#' + id).css("border","1px solid black");
                }
            }
            e.stopPropagation();
            return false;
        }, true );
//        purchasableItem.css("border","9px solid red");
        $('#' + purchasableItem.id).css("border","3px solid black");
    }

    $resourceGallery.dialog('open');
}

function showSettings() {
    $settingsDialog.dialog('open');
}
