/*!
 * Fierce Planet - Utils
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */




var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains development functions
 */
FiercePlanet.Dev = FiercePlanet.Dev || {};

(function() {

    /**
     * Opens a console for executing JavaScript
     */
    this.openConsole = function() {
        alert('Not yet implemented');
    };


    /**
     * Shows the narrative for FP
     */
    this.showStoryboard = function() {
        var storyboard = '';
        storyboard += FiercePlanet.Dev.buildStoryboardForLevel(FiercePlanet.PresetLevels.level0);
        storyboard += FiercePlanet.Dev.buildStoryboardForLevel(FiercePlanet.PresetLevels.level1);
        storyboard += FiercePlanet.Dev.buildStoryboardForLevel(FiercePlanet.PresetLevels.level2);
        storyboard += FiercePlanet.Dev.buildStoryboardForLevel(FiercePlanet.PresetLevels.level3);
        storyboard += FiercePlanet.Dev.buildStoryboardForLevel(FiercePlanet.PresetLevels.level4);
        storyboard += FiercePlanet.Dev.buildStoryboardForLevel(FiercePlanet.PresetLevels.level5);
        storyboard += FiercePlanet.Dev.buildStoryboardForLevel(FiercePlanet.PresetLevels.level6);
        storyboard += FiercePlanet.Dev.buildStoryboardForLevel(FiercePlanet.PresetLevels.level7);
        storyboard += FiercePlanet.Dev.buildStoryboardForLevel(FiercePlanet.PresetLevels.level8);
        storyboard += FiercePlanet.Dev.buildStoryboardForLevel(FiercePlanet.PresetLevels.level9);
        storyboard += FiercePlanet.Dev.buildStoryboardForLevel(FiercePlanet.PresetLevels.level10);
        storyboard += FiercePlanet.Dev.buildStoryboardForLevel(FiercePlanet.PresetLevels.level11);

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
    this.buildStoryboardForLevel = function(level) {
        var levelStoryboard = '';
        if (level.name)
            levelStoryboard += '<h3>' + level.name + '</h3>';
        levelStoryboard += '<div>Level ID: ' + level.id + '</div>';
        levelStoryboard += '<div>Initial number of agents: ' + level.initialAgentNumber + '</div>';
        levelStoryboard += '<div>Number of waves: ' + level.waveNumber + '</div>';
        levelStoryboard += '<div>Expiry limit: ' + level.expiryLimit + '</div>';
        levelStoryboard += '<div>Initial resource store: ' + level.initialResourceStore + '</div>';
        if (level.image) {
            levelStoryboard += '<h4>Level Image</h4>';
            levelStoryboard += '<img src="' + level.image + '" alt="City Image" width="460" height="140">';
        }
        if (level.introduction) {
            levelStoryboard += '<h4>Introduction</h4>';
            levelStoryboard += level.introduction;
        }
        if (level.tip) {
            levelStoryboard += '<h4>Tip</h4>';
            levelStoryboard += level.tip.text;
        }
        if (level.catastrophe) {
            levelStoryboard += '<h4>Catastrohe</h4>';
            levelStoryboard += level.catastrophe.notice.text;
        }
        if (level.conclusion) {
            levelStoryboard += '<h4>Conclusion</h4>';
            levelStoryboard += level.conclusion;
        }
        levelStoryboard += '<hr/>';

        return levelStoryboard;
    };

}).apply(FiercePlanet.Dev);
