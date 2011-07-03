/*!
 * Fierce Planet - Profile
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



/**
 * Defines a series of settings.
 *
 * @constructor
 */
function Settings() {
    this.scrollingImageVisible = true;
    this.noticesVisible = true;
    this.agentsCanCommunicate = true;
    this.catastrophesVisible = true;
    this.disableKeyboardShortcuts = true;
    this.soundsPlayable = false;

    this.recording = false;

    this.invisiblePath = false;
    this.agentTracing = false;

    this.resourcesUpgradeable = false;
    this.resourcesInTension = false;
    this.resourceBonus = false;
    this.applyGeneralHealth = false;
    this.ignoreResourceBalance = false;

    this.godMode = false;

    // Dev options
    this.predatorsVisible = false;
    this.rivalsVisible = false;
    this.tilesMutable = false;
    this.tilesRemovable = false;
    this.backgroundIconsVisible = false;

}


