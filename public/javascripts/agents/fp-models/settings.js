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
    // Game-play settings
    /** Can agents share memories of places visited? */
    this.agentsCanCommunicate = true;
    /** Can resources be upgraded? (TODO: Semantics needs to be clear about what this means) */
    this.resourcesUpgradeable = false;
    /** Are resources in tension - does proximity of resources impact on their benefit */
    this.resourcesInTension = false;
    /** Does a resource bonus apply, for using an even mix of resources? TODO: not yet implemented */
    this.resourceBonus = false;
    /** Do all resources impact upon agents equivalently? */
    this.applyGeneralHealth = false;
    /** Ignores the weighting of resources when calculating benefits */
    this.ignoreResourceBalance = false;

    // Visibility settings
    /** Is the scrolling image visible? */
    this.scrollingImageVisible = true;
    /** Are the notices visible? */
    this.noticesVisible = true;
    /** Are catastrophes visible? */
    this.catastrophesVisible = true;
    /** Whether sounds should be playable */
    this.soundsPlayable = false;
    /** Whether agents' paths are visible */
    this.agentTracing = false;
    /** Is the path visible? */
    this.invisiblePath = false;
    /** Whether background icons are visible */
    this.backgroundIconsVisible = false;
    /** EXPERIMENTAL - whether predators are visible */
    this.predatorsVisible = false;
    /** EXPERIMENTAL - whether rivals are visible */
    this.rivalsVisible = false;

    // Interaction settings
    /** Shows an inline resource swatch - useful for mobiles, constrained environments */
    this.useInlineResourceSwatch = false;
    /** Allows inline panning, by dragging the canvas */
    this.allowInlinePanning = false;
    /** Disables keyboard shortcuts */
    this.disableKeyboardShortcuts = true;
    /** Whether tiles can be added to the map */
    this.tilesMutable = false;
    /** Whether tiles can be removed from the map */
    this.tilesRemovable = false;

    // Control/test settings
    /** Whether level recording is turned on */
    this.recording = false;
    /** Ensures agents are impervious */
    this.godMode = false;


}


