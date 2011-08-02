/*!
 * Fierce Planet - Culture
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * Defines a culture.
 * The type includes the name, color, initial health, default speed and the drawing function of an agent.
 *
 * @constructor
 * @param name
 * @param color
 */
function Culure(name, color, baseSize, speed, health, drawFunction) {
    this.name = name;
    this.color = color;
    this.baseSize = baseSize;
    this.childbirthAgeMean = 0;
    this.childbirthAgeStdDev = 0;
    this.fertilityAgeMean = 0;
    this.fertilityAgeStdDev = 0;
    this.fertilityAdjustmentIncrements = 0;
    this.fertilityAdjustmentFactor = 1;
    this.lifeExpectancyMean = 0;
    this.lifeExpectancyStdDev = 0;
    this.initialHealthMean = 0;
    this.initialHealthStdDev = 0;
    this.memoryLostMean = 0.9;
    this.memoryLostStdDev = 0;
    this.killChance = 0;
    this.species = null;
    this.desires = [];
    this.agents = [];
}
