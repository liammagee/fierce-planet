/*!
 * Fierce Planet - Utils
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */




var FiercePlanet = FiercePlanet || {};



/**
 * Opens a console for executing JavaScript
 */
FiercePlanet.openConsole = function() {
    alert('Not yet implemented');
};


/**
 * Shows the narrative for FP
 */
FiercePlanet.showStoryboard = function() {
    var storyboard = '';
    storyboard += FiercePlanet.buildStoryboardForLevel(PresetLevels.level0);
    storyboard += FiercePlanet.buildStoryboardForLevel(PresetLevels.level1);
    storyboard += FiercePlanet.buildStoryboardForLevel(PresetLevels.level2);
    storyboard += FiercePlanet.buildStoryboardForLevel(PresetLevels.level3);
    storyboard += FiercePlanet.buildStoryboardForLevel(PresetLevels.level4);
    storyboard += FiercePlanet.buildStoryboardForLevel(PresetLevels.level5);
    storyboard += FiercePlanet.buildStoryboardForLevel(PresetLevels.level6);
    storyboard += FiercePlanet.buildStoryboardForLevel(PresetLevels.level7);
    storyboard += FiercePlanet.buildStoryboardForLevel(PresetLevels.level8);
    storyboard += FiercePlanet.buildStoryboardForLevel(PresetLevels.level9);
    storyboard += FiercePlanet.buildStoryboardForLevel(PresetLevels.level10);
    storyboard += FiercePlanet.buildStoryboardForLevel(PresetLevels.level11);

    var storyboardWindow =  window.open('','RecipeWindow','width=600,height=600');
    var html = '<html><head><title>FiercePlanet Storyboard</title></head><body><div id="storyboard">' +
            $('<div />').append($(storyboard).clone()).html() +
            '</div></body></html>';
    storyboardWindow.document.open();
    storyboardWindow.document.write(html);
    storyboardWindow.document.close();

    return false;
    /*
    var showNarrative = $('<div></div>')
        .html(storyboard)
        .dialog({
            position: [10, 10],
            width: $(document).width() - 20,
            height: $(document).height() - 20,
            autoOpen: false,
            modal: true,
            title: 'Fierce Planet Storyboard',
            buttons: {
                "OK": function() {
                    $( this ).dialog( "close" );
                },
                "Cancel": function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    showNarrative.dialog('open');
    */
};

/**
 * Shows the narrative for FP
 */
FiercePlanet.buildStoryboardForLevel = function(level) {
    var levelStoryboard = '';
    if (level.getName())
        levelStoryboard += '<h3>' + level.getName() + '</h3>';
    levelStoryboard += '<div>Level ID: ' + level.getId() + '</div>';
    levelStoryboard += '<div>Initial number of agents: ' + level.getInitialAgentNumber() + '</div>';
    levelStoryboard += '<div>Number of waves: ' + level.getWaveNumber() + '</div>';
    levelStoryboard += '<div>Expiry limit: ' + level.getExpiryLimit() + '</div>';
    levelStoryboard += '<div>Initial resource store: ' + level.getInitialResourceStore() + '</div>';
    if (level.getImage()) {
        levelStoryboard += '<h4>Level Image</h4>';
        levelStoryboard += '<img src="' + level.getImage() + '" alt="City Image" width="460" height="140">';
    }
    if (level.getIntroduction()) {
        levelStoryboard += '<h4>Introduction</h4>';
        levelStoryboard += level.getIntroduction();
    }
    if (level.getTip()) {
        levelStoryboard += '<h4>Tip</h4>';
        levelStoryboard += level.getTip()._text;
    }
    if (level.getCatastrophe()) {
        levelStoryboard += '<h4>Catastrohe</h4>';
        levelStoryboard += level.getCatastrophe()._notice._text;
    }
    if (level.getConclusion()) {
        levelStoryboard += '<h4>Conclusion</h4>';
        levelStoryboard += level.getConclusion();
    }
    levelStoryboard += '<hr/>';

    return levelStoryboard;
};
