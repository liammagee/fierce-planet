/*!
 * Fierce Planet - Dialogs
 * Declares dialogs used in the game
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};


/**
 * Calculates the left position of the 'world' element
 */
FiercePlanet.calculateWorldLeft = function () {
    var contentPane = $("#content-pane");
    var world = $("#world");
    var contentPaneX = contentPane.position().left;
    var worldX = world.position().left;
    var dialogX = contentPaneX + worldX;
    return dialogX;
};


/**
 * Calculates the top position of the 'world' element
 */
FiercePlanet.calculateWorldTop = function () {
    var contentPane = $("#content-pane");
    var world = $("#world");
    var contentPaneY = contentPane.position().top;
    var worldY = world.position().top;
    var dialogY = contentPaneY + worldY;
    return dialogY;
};

/**
 *
 */
FiercePlanet.setupDialogs = function() {
    var dialogX = FiercePlanet.calculateWorldLeft();
    var dialogY = FiercePlanet.calculateWorldTop();
    // Dialogs

    FiercePlanet.$newLevel = $('<div></div>')
        .html('New Level')
        .dialog({
            position: [dialogX, dialogY],
            width: FiercePlanet.WORLD_WIDTH + 7,
            height: FiercePlanet.WORLD_HEIGHT + 7,
            autoOpen: false,
            modal: true,
            title: 'New Level',
            buttons: {
                "Play": function() {
                    // Animation effect
                    // For spinning, try: http://www.zachstronaut.com/posts/2009/08/07/jquery-animate-css-rotate-scale.html
                    $( this ).dialog( "close" );
                    var canvases = $('#map_canvas, #baseCanvas');
                    var world = $('#world');
                    var rwl = world.position().left;
                    var rwt = world.position().top;
                    var ww = world.width();
                    var wh = world.height();
                    var rw = rwl + Math.floor(Math.random() * ww);
                    var rh = rwt + Math.floor(Math.random() * wh);
                    world.css({'width': 0, 'height' : 0, 'left': rw, 'top': rh});
                    world.animate({'width': ww, 'height': wh, 'left': rwl, 'top': rwt}, 1000);
                    canvases.css({'width': 0, 'height' : 0});
                    canvases.animate({'width': ww, 'height': wh}, 1000);
                    FiercePlanet.newWave();
                },
                "Cancel": function() {
                    $( this ).dialog( "close" );
                }
            }
        });

    FiercePlanet.$completeLevel = $('<div></div>')
        .html('Level Complete!')
        .dialog({
                                                      position: [dialogX, dialogY],
                                                      width: FiercePlanet.WORLD_WIDTH + 7,
                                                      height: FiercePlanet.WORLD_HEIGHT + 7,
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
                                                     position: [dialogX, dialogY],
                                                     width: FiercePlanet.WORLD_WIDTH + 7,
                                                     height: FiercePlanet.WORLD_HEIGHT + 7,
            autoOpen: false,
            modal: true,
            title: 'Fierce Planet Complete!',
            buttons: {
                "Bonus Level": function() {
                    FiercePlanet.newLevel();
                    $( this ).dialog( "close" );
                },
                "New Game": function() {
                    FiercePlanet.newGame();
                    $( this ).dialog( "close" );
                },
                "Cancel": function() {
                    $( this ).dialog( "close" );
                }
            }

        });
    FiercePlanet.$gameOver = $('<div></div>')
        .html('Game Over!')
        .dialog({
                                                 position: [dialogX, dialogY],
                                                 width: FiercePlanet.WORLD_WIDTH + 7,
                                                 height: FiercePlanet.WORLD_HEIGHT + 7,
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

    /* Upgrade / delete dialog */
    FiercePlanet.$upgradeDelete = $('#delete-upgrade-dialog')
        .dialog({
                                                      position: [dialogX, dialogY],
                                                      width: FiercePlanet.WORLD_WIDTH + 7,
                                                      height: FiercePlanet.WORLD_HEIGHT + 7,
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
                                                        position: [dialogX, dialogY],
                                                        width: FiercePlanet.WORLD_WIDTH + 7,
                                                        height: FiercePlanet.WORLD_HEIGHT + 7,
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

    FiercePlanet.$settingsDialog = $('#settings-dialog')
        .dialog({
                                          position: [dialogX, dialogY],
                                                       width: FiercePlanet.WORLD_WIDTH + 7,
                                                       height: FiercePlanet.WORLD_HEIGHT + 7,
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
        if (confirm("Stop current game and begin the tutorial?")) {
            FiercePlanet.currentLevelNumber = 0;
            FiercePlanet.currentLevelPreset = true;
            FiercePlanet.restartLevel();
        }
    });


    FiercePlanet.$statsDialog = $('<div></div>')
        .dialog({
                                                position: [dialogX, dialogY],
                                                    width: FiercePlanet.WORLD_WIDTH + 7,
                                                    height: FiercePlanet.WORLD_HEIGHT + 7,
            autoOpen: false,
            modal: true,
            title: 'Vital Statistics',
            buttons: {
                "OK": function() {
                    $( this ).dialog( "close" );
                }
            }
        });

    FiercePlanet.$designFeatures = $('#level-features')
        .dialog({
                                                       position: [dialogX, dialogY],
                                                       width: FiercePlanet.WORLD_WIDTH + 7,
                                                       height: FiercePlanet.WORLD_HEIGHT + 7,
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
           position: [dialogX, dialogY],
           width: FiercePlanet.WORLD_WIDTH + 7,
           height: FiercePlanet.WORLD_HEIGHT + 7,
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
//    FiercePlanet.currentProfile.updateStats(FiercePlanet.currentProfile.resources_in_store, FiercePlanet.currentProfile.saved_agent_count);
    // Try to save results to the server
    if (FiercePlanet.currentProfile.id > -1) {
        FiercePlanet.saveProfile(function(data) {
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
 * Update profile statistics, save statistics to the server if the user is logged in, and opn the complete game dialog
 */
FiercePlanet.showCompleteGameDialog = function() {
    // Try to save results to the server
    if (FiercePlanet.currentProfile.id > -1) {
        FiercePlanet.saveProfile(function(data) {
               FiercePlanet.openCompleteGameDialog();
           });
    }
    else {
        FiercePlanet.openCompleteGameDialog();
    }
};

/**
 * Open the completed game dialog
 */
FiercePlanet.openCompleteGameDialog = function() {
    FiercePlanet.$completeGame.html(
            "Congratulations! In spite of challenges ahead, the citizens of Fierce Planet look forward to a bright and sustainable future!" +
                    FiercePlanet.generateStats()
            )
            .dialog('open');
    $('#gotoResourceGallery').click(FiercePlanet.showResourceGallery);
};

/**
 * Show the completed level dialog
 */
FiercePlanet.showCompleteLevelDialog = function() {
    if (FiercePlanet.currentProfile.id > -1) {
        FiercePlanet.saveProfile(function(data) {
               FiercePlanet.openCompleteLevelDialog();
           });
    }
    else {
        FiercePlanet.openCompleteLevelDialog();
    }
};

/**
 * Open the completed level dialog
 */
FiercePlanet.openCompleteLevelDialog = function() {
    FiercePlanet.$completeLevel
            .html(
            "<div>" + FiercePlanet.currentLevel.getConclusion() + "</div>" + FiercePlanet.generateStats()
            ).dialog('open');
};

/**
 * Show the resource gallery, and allow the user to pick from a range of capabilities
 */
FiercePlanet.showResourceGallery = function() {
    FiercePlanet.pauseGame();

    $('#current-profile-class')[0].innerHTML = FiercePlanet.currentProfile.profile_class;
    $('#current-credits')[0].innerHTML = FiercePlanet.currentProfile.credits;
    $('#current-capabilities')[0].innerHTML = FiercePlanet.currentProfile.capabilities.join(",");

    var accessibleCapabilities = [];
    var purchasableItems = [];

    if (FiercePlanet.profile_class == FP_Profile.PROFILE_CLASSES[0]) {
        accessibleCapabilities = FiercePlanet.NOVICE_CAPABILITIES;
    }
    else if (FiercePlanet.profile_class == FP_Profile.PROFILE_CLASSES[1]) {
        accessibleCapabilities = FiercePlanet.PLANNER_CAPABILITIES;
    }
    else if (FiercePlanet.profile_class == FP_Profile.PROFILE_CLASSES[2]) {
        accessibleCapabilities = FiercePlanet.EXPERT_CAPABILITIES;
    }
    else if (FiercePlanet.profile_class == FP_Profile.PROFILE_CLASSES[3]) {
        accessibleCapabilities = FiercePlanet.VISIONARY_CAPABILITIES;
    }
    else if (FiercePlanet.profile_class == FP_Profile.PROFILE_CLASSES[4]) {
        accessibleCapabilities = FiercePlanet.GENIUS_CAPABILITIES;
    }
    // TODO: Temporarily enable all capabilities
    accessibleCapabilities = FiercePlanet.GENIUS_CAPABILITIES;


    // Evaluate available capabilities
    var links = $('.purchase');
    for (var i = 0; i < links.length; i++) {
        var purchasableItem = links[i];
        var id = purchasableItem.id;
        var itemName = id.split("-purchase")[0];
        var cost = 0;
        if ($.inArray(itemName, FiercePlanet.PLANNER_CAPABILITIES) > -1) {
            cost = FP_Profile.CAPABILITY_COSTS [1];
        }
        else if ($.inArray(itemName, FiercePlanet.EXPERT_CAPABILITIES) > -1) {
            cost = FP_Profile.CAPABILITY_COSTS [2];
        }
        else if ($.inArray(itemName, FiercePlanet.VISIONARY_CAPABILITIES) > -1) {
            cost = FP_Profile.CAPABILITY_COSTS [3];
        }
        else if ($.inArray(itemName, FiercePlanet.GENIUS_CAPABILITIES) > -1) {
            cost = FP_Profile.CAPABILITY_COSTS [4];
        }
        // Make item available for purchase if: (1) the player's level permits it; (2) it is not among existing capabilities and (3) there is enough money
        if ($.inArray(itemName, accessibleCapabilities) > -1 && $.inArray(itemName, FiercePlanet.currentProfile.capabilities) == -1 && cost < FiercePlanet.currentProfile.credits) {
            // Make item purchasable
            purchasableItems.push(purchasableItem);
        }
        else {
            $('#' + purchasableItem.id).css("border","1px solid white");
        }
    }
    for (var i = 0; i < purchasableItems.length; i++) {
        var purchasableItem = purchasableItems[i];
        var id = purchasableItem.id;
        var itemName = id.split("-purchase")[0];
        var cost = 0;
        if ($.inArray(itemName, FiercePlanet.PLANNER_CAPABILITIES)) {
            cost = FP_Profile.CAPABILITY_COSTS [1];
        }
        else if ($.inArray(itemName, FiercePlanet.EXPERT_CAPABILITIES)) {
            cost = FP_Profile.CAPABILITY_COSTS [2];
        }
        else if ($.inArray(itemName, FiercePlanet.VISIONARY_CAPABILITIES)) {
            cost = FP_Profile.CAPABILITY_COSTS [3];
        }
        else if ($.inArray(itemName, FiercePlanet.GENIUS_CAPABILITIES)) {
            cost = FP_Profile.CAPABILITY_COSTS [4];
        }

        purchasableItem.addEventListener('click', function(e) {
            var id = this.id;
            console.log(id);
            var swatchId = id.split("-purchase")[0];
            var itemName = $('#' + id + '')[0].title;
            if ($.inArray(swatchId, FiercePlanet.currentProfile.capabilities) == -1) {
                if (confirm('Purchase item "' + itemName + '"?')) {
                    FiercePlanet.currentProfile.credits -= cost;
                    FiercePlanet.currentProfile.capabilities.push(swatchId);
                    $('#current-credits')[0].innerHTML = FiercePlanet.currentProfile.credits;
                    $('#current-capabilities')[0].innerHTML = FiercePlanet.currentProfile.capabilities.join(", ");
                    $('#' + id).removeClass('active');
                    $('#' + id).addClass('inactive');
                }
            }
            e.stopPropagation();
            return false;
        }, true );
//        purchasableItem.css("border","9px solid red");
//        $('#' + purchasableItem.id).css("border","3px solid white");
        $('#' + purchasableItem.id).removeClass('inactive');
        $('#' + purchasableItem.id).addClass('active');
    }

    FiercePlanet.$resourceGallery.dialog('open');
};

/**
 * Shows the Fierce Planet settings
 */
FiercePlanet.showSettings = function() {
    FiercePlanet.pauseGame();
    FiercePlanet.$settingsDialog.dialog('open');
};

/**
 * Shows the Fierce Planet credits
 */
FiercePlanet.showCredits = function() {
    FiercePlanet.pauseGame();
    
    FiercePlanet.$genericDialog = $('<div></div>')
        .html(
            "<div class='credits'>Development Director</div>" +
            "<div>Liam Magee</div>" +
            "<div class='credits'>Art &amp; Design</div>" +
            "<div>Steven Harris</div>" +
            "<div class='credits'>Game Conception &amp; Testing</div>" +
            "<div>Joshua Magee</div>" +
            "<div>Jakki Mann</div>" +
            "<div class='credits'>Images and Sounds</div>" +
            "<div><a href='http://www.publicdomainpictures.net'>Public Domain Pictures</a></div>" +
            "<div><a href='http://freesound.org'>thefreesoundproject</a></div>" +
            "<div><a href='http://opengameart.org'>OpenGameArt.org</a></div>"
            )
        .dialog({
                                              position: [FiercePlanet.calculateWorldLeft(), 110],
                                              width: 487,
                                              height: 407,
                    autoOpen: false,
                    modal: true,
                    title: 'Credits',
                    buttons: {
                        "OK": function() {
                            $(this).dialog("close");
                        }
                    }

                });
    FiercePlanet.$genericDialog.dialog('open');
};
