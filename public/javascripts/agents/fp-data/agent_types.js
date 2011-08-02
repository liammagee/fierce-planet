/*!
 * Fierce Planet - AgentTypes
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/*
Agent Type setup
 */

var AgentTypes = function() {};

/**
 *
 * @param cellWidth
 * @param x - the leftmost x co-ordinate for drawing the figure
 * @param y - the topmost y co-ordinate for drawing the figure
 */
function AgentStickFigure(x, _y, _figureWidth, _figureHeight) {
    var x = x, y = _y, figureWidth = _figureWidth, figureHeight = _figureHeight;
    var wholeBodyLength = (figureHeight * 1);
    var headRadius = (wholeBodyLength / 8) + 0.5 | 0;
    var bodyLength = (wholeBodyLength / 3) + 0.5 | 0;
    var shoulderPoint = (bodyLength / 3) + 0.5 | 0;
    var shoulderToElbowLength = (wholeBodyLength / 8) + 0.5 | 0;
    var elbowToHandLength = (wholeBodyLength / 6) + 0.5 | 0;
    var hipToKneeLength = (wholeBodyLength / 6) + 0.5 | 0;
    var kneeToFootLength = (wholeBodyLength / 6) + 0.5 | 0;
    var startOfHeadY = y - headRadius;
    var startOfBodyY = y + headRadius;
    var startOfShoulderY = startOfBodyY + shoulderPoint;
    var startOfHipY = startOfBodyY + bodyLength;

    var defaultAngle = Math.PI / 4;
    var fShoulderAngle = defaultAngle,
            fElbowAngle = defaultAngle,
            bShoulderAngle = defaultAngle,
            bElbowAngle = defaultAngle,
            fHipAngle = defaultAngle,
            fKneeAngle = defaultAngle,
            bHipAngle = defaultAngle,
            bKneeAngle = defaultAngle;
    var fElbowX, fElbowY,
        bElbowX, bElbowY,
        fHandX, fHandY,
        bHandX, bHandY,
        fKneeX, fKneeY,
        bKneeX, bKneeY,
        fFootX, fFootY,
        bFootX, bFootY;

    // Stick figure actions
    this.run = function(frame, direction) {
        switch (frame) {
            case 0:
                fShoulderAngle = Math.PI * (12 / 12);
                fElbowAngle = Math.PI * (6 / 12);
                bShoulderAngle = Math.PI * (4 / 12);
                bElbowAngle = Math.PI * (20 / 12);

                fHipAngle = Math.PI * (9 / 12);
                fKneeAngle = Math.PI * (9 / 12);
                bHipAngle = Math.PI * (1 / 12);
                bKneeAngle = Math.PI * (7 / 12);
                break;
            case 1:
                fShoulderAngle = Math.PI * (9 / 12);
                fElbowAngle = Math.PI * (3 / 12);
                bShoulderAngle = Math.PI * (5 / 12);
                bElbowAngle = Math.PI * (21 / 12);

                fHipAngle = Math.PI * (10 / 12);
                fKneeAngle = Math.PI * (15 / 12);
                bHipAngle = Math.PI * (3 / 12);
                bKneeAngle = Math.PI * (4 / 12);
                break;
            case 2:
                fShoulderAngle = Math.PI * (6 / 12);
                fElbowAngle = Math.PI * (0 / 12);
                bShoulderAngle = Math.PI * (9 / 12);
                bElbowAngle = Math.PI * (2 / 12);

                fHipAngle = Math.PI * (5 / 12);
                fKneeAngle = Math.PI * (13 / 12);
                bHipAngle = Math.PI * (6 / 12);
                bKneeAngle = Math.PI * (7 / 12);
                break;
        }
        if (direction == 1) {
            this.flipHorizontalDirection();
        }

        this.generateCoordinates();
    };

    // Stick figure actions
    this.runUpsideDown = function(frame, direction) {
        this.run(frame, direction);

        this.flipVerticalDirection();
        this.generateCoordinates();
    };

    // Stick figure actions
    this.walk = function(frame, direction) {
        switch (frame) {
            case 0:
                fShoulderAngle = Math.PI * (9 / 12);
                fElbowAngle = Math.PI * (8 / 12);
                bShoulderAngle = Math.PI * (4 / 12);
                bElbowAngle = Math.PI * (4 / 12);

                fHipAngle = Math.PI * (8 / 12);
                fKneeAngle = Math.PI * (9 / 12);
                bHipAngle = Math.PI * (4 / 12);
                bKneeAngle = Math.PI * (4 / 12);
                break;
            case 1:
                fShoulderAngle = Math.PI * (7 / 12);
                fElbowAngle = Math.PI * (6 / 12);
                bShoulderAngle = Math.PI * (6 / 12);
                bElbowAngle = Math.PI * (5 / 12);

                fHipAngle = Math.PI * (7 / 12);
                fKneeAngle = Math.PI * (8 / 12);
                bHipAngle = Math.PI * (5 / 12);
                bKneeAngle = Math.PI * (6 / 12);
                break;
            case 2:
                fShoulderAngle = Math.PI * (5 / 12);
                fElbowAngle = Math.PI * (4 / 12);
                bShoulderAngle = Math.PI * (7 / 12);
                bElbowAngle = Math.PI * (7 / 12);

                fHipAngle = Math.PI * (5 / 12);
                fKneeAngle = Math.PI * (6 / 12);
                bHipAngle = Math.PI * (7 / 12);
                bKneeAngle = Math.PI * (8 / 12);
                break;
        }
        if (direction == 1) {
            this.flipHorizontalDirection();
        }
        this.generateCoordinates();
    };

    this.flipHorizontalDirection = function() {
        fShoulderAngle = (Math.PI / 2) + ((Math.PI / 2) - fShoulderAngle);
        fElbowAngle = (Math.PI / 2) + ((Math.PI / 2) - fElbowAngle);
        bShoulderAngle = (Math.PI / 2) + ((Math.PI / 2) - bShoulderAngle);
        bElbowAngle = (Math.PI / 2) + ((Math.PI / 2) - bElbowAngle);

        fHipAngle = (Math.PI / 2) + ((Math.PI / 2) - fHipAngle);
        fKneeAngle = (Math.PI / 2) + ((Math.PI / 2) - fKneeAngle);
        bHipAngle = (Math.PI / 2) + ((Math.PI / 2) - bHipAngle);
        bKneeAngle = (Math.PI / 2) + ((Math.PI / 2) - bKneeAngle);
    };

    this.flipVerticalDirection = function() {
        y = y + figureHeight;
        wholeBodyLength = (figureHeight * 1);
        headRadius = (wholeBodyLength / 8) + 0.5 | 0;
        bodyLength = -bodyLength;
        shoulderPoint = -shoulderPoint;
        shoulderToElbowLength = -shoulderToElbowLength;
        elbowToHandLength = -elbowToHandLength;
        hipToKneeLength = -hipToKneeLength;
        kneeToFootLength = -kneeToFootLength;
        startOfHeadY = y + headRadius;
        startOfBodyY = y - headRadius;
        startOfShoulderY = startOfBodyY + shoulderPoint;
        startOfHipY = startOfBodyY + bodyLength;

    };

    this.generateCoordinates = function() {
        fElbowX = (x + Math.cos(fShoulderAngle) * shoulderToElbowLength);
        fElbowY = (startOfShoulderY + Math.sin(fShoulderAngle) * shoulderToElbowLength);
        fHandX = (fElbowX + Math.cos(fElbowAngle) * elbowToHandLength);
        fHandY = (fElbowY + Math.sin(fElbowAngle) * elbowToHandLength);

        bElbowX = (x + Math.cos(bShoulderAngle) * shoulderToElbowLength);
        bElbowY = (startOfShoulderY + Math.sin(bShoulderAngle) * shoulderToElbowLength);
        bHandX = (bElbowX + Math.cos(bElbowAngle) * elbowToHandLength);
        bHandY = (fElbowY + Math.sin(bElbowAngle) * elbowToHandLength);

        fKneeX = (x + Math.cos(fHipAngle) * hipToKneeLength);
        fKneeY = (startOfHipY + Math.sin(fHipAngle) * hipToKneeLength);
        fFootX = (fKneeX + Math.cos(fKneeAngle) * kneeToFootLength);
        fFootY = (fKneeY + Math.sin(fKneeAngle) * kneeToFootLength);

        bKneeX = (x + Math.cos(bHipAngle) * hipToKneeLength);
        bKneeY = (startOfHipY + Math.sin(bHipAngle) * hipToKneeLength);
        bFootX = (bKneeX + Math.cos(bKneeAngle) * kneeToFootLength);
        bFootY = (bKneeY + Math.sin(bKneeAngle) * kneeToFootLength);
    };

    this.drawFigure = function(context) {
        context.beginPath();

        // Head
        context.arc(x, y, headRadius, 0, Math.PI * 2, false);

        // Body
        context.moveTo(x, startOfBodyY);
        context.lineTo(x, startOfBodyY + bodyLength);

        // Front arm
        context.moveTo(x, startOfShoulderY);
        context.lineTo(fElbowX, fElbowY);
        context.moveTo(fElbowX, fElbowY);
        context.lineTo(fHandX, fHandY);

        // Back arm
        context.moveTo(x, startOfShoulderY);
        context.lineTo(bElbowX, bElbowY);
        context.moveTo(bElbowX, bElbowY);
        context.lineTo(bHandX, bHandY);

        // Front leg
        context.moveTo(x, startOfHipY);
        context.lineTo(fKneeX, fKneeY);
        context.moveTo(fKneeX, fKneeY);
        context.lineTo(fFootX, fFootY);

        // Back leg
        context.moveTo(x, startOfHipY);
        context.lineTo(bKneeX, bKneeY);
        context.moveTo(bKneeX, bKneeY);
        context.lineTo(bFootX, bFootY);

        context.closePath();
    };

    this.defaultAction = this.run;
}

/**
 * Register the default agent types
 */
(function() {
    AgentTypes.CITIZEN_AGENT_TYPE = new AgentType("Citizen", "000", World.resourceCategories);
    AgentTypes.CITIZEN_AGENT_TYPE.isHitable = (true);
    AgentTypes.CITIZEN_AGENT_TYPE.drawFunction = (function(ctx, agent, x, y, pieceWidth, pieceHeight, newColor, counter, direction) {

        if (pieceWidth < 8 || pieceHeight < 8) {
            var radius = (pieceWidth / 4);

            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.strokeStyle = "#ccc";
            ctx.stroke();
            ctx.fillStyle = "#" + newColor;
            ctx.fill();
        }
        else {
            // Define agent elements here
            var frames = 3;
            var speed = agent.speed;
            var countdown = agent.countdownToMove;
            var frame = Math.floor((countdown / (speed + 1)) * frames);

            var sf = new AgentStickFigure(x, y, pieceWidth, pieceHeight);
            if (speed > 5)
                sf.defaultAction = sf.walk;
            else
                sf.defaultAction = sf.run;
            sf.defaultAction(frame, direction);
            sf.drawFigure(ctx);


            // Now draw the figure
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = "#" + newColor;
            ctx.lineCap = "round";
            ctx.stroke();
            ctx.fillStyle = "#" + newColor;
            ctx.fill();
        }
    });


    AgentTypes.CITIZEN_AGENT_TYPE.drawExpired = function(ctx, agent, x, y, pieceWidth, pieceHeight, newColor, counter, direction) {
        // Draw an explosion here
        var explosionX = x;
        var explosionY = y  + pieceWidth / 2;

        var radgrad = ctx.createRadialGradient(explosionX,explosionY,0,explosionX,explosionY,pieceWidth / 2);
          radgrad.addColorStop(0, 'rgba(255, 168, 81,1)');
          radgrad.addColorStop(0.8, '#FFF354');
          radgrad.addColorStop(1, 'rgba(255, 168, 81,0)');
        ctx.fillStyle = radgrad ;
        ctx.fillRect(x - pieceWidth / 2, y, pieceWidth, pieceHeight);


        if (pieceWidth < 8 || pieceHeight < 8) {
            var radius = (pieceWidth / 4);

            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.strokeStyle = "#ccc";
            ctx.stroke();
            ctx.fillStyle = "#" + newColor;
            ctx.fill();
        }
        else {
            // Define agent elements here

            // Quick round: + 0.5 | 0
            var wholeBodyLength = (pieceWidth * 1);
            var headRadius = (wholeBodyLength / 8) + 0.5 | 0;
            var bodyLength = (wholeBodyLength / 3) + 0.5 | 0;
            var shoulderPoint = (bodyLength / 3) + 0.5 | 0;
            var shoulderToElbowLength = (wholeBodyLength / 8) + 0.5 | 0;
            var elbowToHandLength = (wholeBodyLength / 6) + 0.5 | 0;
            var hipToKneeLength = (wholeBodyLength / 6) + 0.5 | 0;
            var kneeToFootLength = (wholeBodyLength / 6) + 0.5 | 0;
            var startOfHeadY = y - headRadius;
            var startOfBodyY = y + headRadius;
            var startOfShoulderY = startOfBodyY + shoulderPoint;
            var startOfHipY = startOfBodyY + bodyLength;

            ctx.lineWidth = 1;
            ctx.beginPath();

            // Angles
            var fShoulderAngle, fElbowAngle, bShoulderAngle, bElbowAngle;
            var fHipAngle, fKneeAngle, bHipAngle, bKneeAngle;

            fShoulderAngle = Math.PI * (14 / 12);
            fElbowAngle = Math.PI * (14 / 12);
            bShoulderAngle = Math.PI * (22 / 12);
            bElbowAngle = Math.PI * (22 / 12);

            fHipAngle = Math.PI * (10 / 12);
            fKneeAngle = Math.PI * (10 / 12);
            bHipAngle = Math.PI * (2 / 12);
            bKneeAngle = Math.PI * (2 / 12);

            // Head
            ctx.arc(x, y, headRadius, 0, Math.PI * 2, false);

            // Body
            ctx.moveTo(x, startOfBodyY);
            ctx.lineTo(x, startOfBodyY + bodyLength);

            // Front arm
            ctx.moveTo(x, startOfShoulderY);
            var fElbowX = (x + Math.cos(fShoulderAngle) * shoulderToElbowLength);
            var fElbowY = (startOfShoulderY + Math.sin(fShoulderAngle) * shoulderToElbowLength);
            ctx.lineTo(fElbowX, fElbowY);
            ctx.moveTo(fElbowX, fElbowY);
            var fHandX = (fElbowX + Math.cos(fElbowAngle) * elbowToHandLength);
            var fHandY = (fElbowY + Math.sin(fElbowAngle) * elbowToHandLength);
            ctx.lineTo(fHandX, fHandY);

            // Back arm
            ctx.moveTo(x, startOfShoulderY);
            var bElbowX = (x + Math.cos(bShoulderAngle) * shoulderToElbowLength);
            var bElbowY = (startOfShoulderY + Math.sin(bShoulderAngle) * shoulderToElbowLength);
            ctx.lineTo(bElbowX, bElbowY);
            ctx.moveTo(bElbowX, bElbowY);
            var bHandX = (bElbowX + Math.cos(bElbowAngle) * elbowToHandLength);
            var bHandY = (fElbowY + Math.sin(bElbowAngle) * elbowToHandLength);
            ctx.lineTo(bHandX, bHandY);



            // Front leg
            ctx.moveTo(x, startOfHipY);
            var fKneeX = (x + Math.cos(fHipAngle) * hipToKneeLength);
            var fKneeY = (startOfHipY + Math.sin(fHipAngle) * hipToKneeLength);
            ctx.lineTo(fKneeX, fKneeY);
            ctx.moveTo(fKneeX, fKneeY);
            var fFootX = (fKneeX + Math.cos(fKneeAngle) * kneeToFootLength);
            var fFootY = (fKneeY + Math.sin(fKneeAngle) * kneeToFootLength);
            ctx.lineTo(fFootX, fFootY);

            // Back leg
            ctx.moveTo(x, startOfHipY);
            var bKneeX = (x + Math.cos(bHipAngle) * hipToKneeLength);
            var bKneeY = (startOfHipY + Math.sin(bHipAngle) * hipToKneeLength);
            ctx.lineTo(bKneeX, bKneeY);
            ctx.moveTo(bKneeX, bKneeY);
            var bFootX = (bKneeX + Math.cos(bKneeAngle) * kneeToFootLength);
            var bFootY = (bKneeY + Math.sin(bKneeAngle) * kneeToFootLength);
            ctx.lineTo(bFootX, bFootY);

            ctx.closePath();
            ctx.strokeStyle = "#" + newColor;
            ctx.lineCap = "round";
            ctx.stroke();
            ctx.fillStyle = "#" + newColor;
            ctx.fill();
        }
    };

    AgentTypes.PREDATOR_AGENT_TYPE = new AgentType("Predator", "fbe53b", World.resourceCategories);
    AgentTypes.PREDATOR_AGENT_TYPE.canHit = (true);
    AgentTypes.PREDATOR_AGENT_TYPE.drawFunction = (function(ctx, agent, intX, intY, pieceWidth, pieceHeight, newColor, counter, direction) {
        var radius = (pieceWidth / 4);
        var bodyLength = (pieceWidth / 2);

        var img = new Image();
//    img.src = "/images/agents/fierce_planet_monster1.png";

        if (counter % 4 == 0) {
            img.src = "/images/agents/monster1.png";
        }
        else if (counter % 4 == 1) {
            img.src = "/images/agents/monster2.png";
        }
        else if (counter % 4 == 2) {
            img.src = "/images/agents/monster1.png";
        }
        else {
            img.src = "/images/agents/monster3.png";
        }
        ctx.drawImage(img, intX - pieceWidth / 2, intY - pieceWidth / 2, pieceWidth, pieceWidth);
    });

    AgentTypes.RIVAL_AGENT_TYPE = new AgentType("Rival", "3be5fb", World.resourceCategories);
    AgentTypes.RIVAL_AGENT_TYPE.drawFunction = (function(ctx, agent, intX, intY, pieceWidth, pieceHeight, newColor, counter, direction) {
        var radius = (pieceWidth / 4);
        var bodyLength = (pieceWidth / 2);

        ctx.beginPath();
        ctx.arc(intX, intY, radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
        ctx.fillStyle = "#" + newColor;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(intX, intY + radius);
        ctx.lineTo(intX, intY + radius + bodyLength / 2);
        if (counter % 2 == 0) {
            // Legs
            var xOffset = Math.sin(30 * Math.PI/180) * bodyLength / 2;
            var yOffset = Math.cos(30 * Math.PI/180) * bodyLength / 2;
            ctx.moveTo(intX, intY + radius + bodyLength / 2);
            ctx.lineTo(intX - xOffset, intY + radius + bodyLength / 2 + yOffset);
            ctx.moveTo(intX, intY + radius + bodyLength / 2);
            ctx.lineTo(intX + xOffset, intY + radius + bodyLength / 2 + yOffset);
            // Arms - 90 degrees
            ctx.moveTo(intX - bodyLength / 2, intY + radius + bodyLength / 6);
            ctx.lineTo(intX + bodyLength / 2, intY + radius + bodyLength / 6);
        }
        else {
            // Legs - straight
            ctx.moveTo(intX, intY + radius + bodyLength / 2);
            ctx.lineTo(intX, intY + radius + bodyLength);
            // Arms - 45 degrees
            var xOffset = Math.sin(45 * Math.PI/180) * bodyLength / 2;
            var yOffset = Math.cos(45 * Math.PI/180) * bodyLength / 2;
            ctx.moveTo(intX - xOffset, intY + radius + bodyLength / 6 + yOffset);
            ctx.lineTo(intX, intY + radius + bodyLength / 6);
            ctx.moveTo(intX + xOffset, intY + radius + bodyLength / 6 + yOffset);
            ctx.lineTo(intX, intY + radius + bodyLength / 6);

        }
        ctx.closePath();
        ctx.strokeStyle = "#" + newColor;
        ctx.lineWidth = 2;
        ctx.stroke();

    });

    World.registerAgentTypes([AgentTypes.CITIZEN_AGENT_TYPE, AgentTypes.PREDATOR_AGENT_TYPE, AgentTypes.RIVAL_AGENT_TYPE]);
})();

FiercePlanet.registerDefaultAgentTypes = function() {
    AgentTypes.CITIZEN_AGENT_TYPE = new AgentType("Citizen", "000", World.resourceCategories);
    AgentTypes.CITIZEN_AGENT_TYPE.drawFunction = (function(ctx, agent, x, y, pieceWidth, pieceHeight, newColor, counter, direction) {
        if (pieceWidth < 8 || pieceHeight < 8) {
            var radius = (pieceWidth / 4);

            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.strokeStyle = "#ccc";
            ctx.stroke();
            ctx.fillStyle = "#" + newColor;
            ctx.fill();
        }
        else {
            var radius = (pieceWidth / 4);

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.strokeStyle = "#ccc";
            ctx.stroke();
            ctx.fillStyle = "#" + newColor;
            ctx.fill();

            var bodyLength = (pieceWidth / 2);

            ctx.beginPath();
            ctx.moveTo(x, y - radius + 6);
            ctx.lineTo(x - 1, y - radius + 6 + bodyLength);

            if (counter % 2 == 1) {
                var start = (direction == 0 ? -1 : 1);
                var end = (direction == 0 ? -4 : 4);

                // Arms
                ctx.moveTo(x + 4, y + 8 + 2 * start);
                ctx.lineTo(x - 4, y + 8 - 2 * start);

                // 1st leg
                ctx.moveTo(x, y - radius + 6 + bodyLength);
                ctx.lineTo(x + start + end, y - radius + 6 + bodyLength + Math.abs(end));

                // 2nd leg
                ctx.moveTo(x, y - radius + 5 + bodyLength);
                ctx.lineTo(x - start - end / 2, y - radius + 6 + bodyLength);
                ctx.moveTo(x - start - end / 2, y - radius + 6 + bodyLength);
                ctx.lineTo(x - start - end / 2, y - radius + 6 + bodyLength + Math.abs(end) / 2);
            }
            else {
                var start = (direction == 0 ? 1 : -1);
                var end = (direction == 0 ? 4 : -4);

                // Arms
                ctx.moveTo(x + 4, y + 8 + 2 * start);
                ctx.lineTo(x - 4, y + 8 - 2 * start);

                // 1st leg
                ctx.moveTo(x, y - radius + 6 + bodyLength);
//        ctx.lineTo(x + end, y  - radius + 8 + bodyLength);
//        ctx.moveTo(x + end, y - radius + 8 + bodyLength);
                ctx.lineTo(x + end, y - radius + 6 + bodyLength + Math.abs(end));

                // 2nd leg
                ctx.moveTo(x, y - radius + 6 + bodyLength);
                ctx.lineTo(x - end / 2, y - radius + 6 + bodyLength + Math.abs(end) / 2);
                ctx.moveTo(x - end / 2, y - radius + 6 + bodyLength + Math.abs(end) / 2);
                ctx.lineTo(x - end, y - radius + 6 + bodyLength);
            }
            ctx.closePath();
            ctx.strokeStyle = "#" + newColor;
            ctx.stroke();
            ctx.fillStyle = "#" + newColor;
            ctx.fill();
        }

    });

    AgentTypes.PREDATOR_AGENT_TYPE = new AgentType("Predator", "fbe53b", World.resourceCategories);
    AgentTypes.PREDATOR_AGENT_TYPE.drawFunction = (function(ctx, agent, intX, intY, pieceWidth, pieceHeight, newColor, counter, direction) {
        var radius = (pieceWidth / 4);
        var bodyLength = (pieceWidth / 2);

        var img = new Image();
//    img.src = "/images/agents/fierce_planet_monster1.png";

        if (counter % 4 == 0) {
            img.src = "/images/agents/monster1.png";
        }
        else if (counter % 4 == 1) {
            img.src = "/images/agents/monster2.png";
        }
        else if (counter % 4 == 2) {
            img.src = "/images/agents/monster1.png";
        }
        else {
            img.src = "/images/agents/monster3.png";
        }
        ctx.drawImage(img, intX - pieceWidth / 2, intY - pieceWidth / 2, pieceWidth, pieceWidth);
    });

    AgentTypes.RIVAL_AGENT_TYPE = new AgentType("Rival", "3be5fb", World.resourceCategories);
    AgentTypes.RIVAL_AGENT_TYPE.drawFunction = (function(ctx, agent, intX, intY, pieceWidth, pieceHeight, newColor, counter, direction) {
        var radius = (pieceWidth / 4);
        var bodyLength = (pieceWidth / 2);

        ctx.beginPath();
        ctx.arc(intX, intY, radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
        ctx.fillStyle = "#" + newColor;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(intX, intY + radius);
        ctx.lineTo(intX, intY + radius + bodyLength / 2);
        if (counter % 2 == 0) {
            // Legs
            var xOffset = Math.sin(30 * Math.PI/180) * bodyLength / 2;
            var yOffset = Math.cos(30 * Math.PI/180) * bodyLength / 2;
            ctx.moveTo(intX, intY + radius + bodyLength / 2);
            ctx.lineTo(intX - xOffset, intY + radius + bodyLength / 2 + yOffset);
            ctx.moveTo(intX, intY + radius + bodyLength / 2);
            ctx.lineTo(intX + xOffset, intY + radius + bodyLength / 2 + yOffset);
            // Arms - 90 degrees
            ctx.moveTo(intX - bodyLength / 2, intY + radius + bodyLength / 6);
            ctx.lineTo(intX + bodyLength / 2, intY + radius + bodyLength / 6);
        }
        else {
            // Legs - straight
            ctx.moveTo(intX, intY + radius + bodyLength / 2);
            ctx.lineTo(intX, intY + radius + bodyLength);
            // Arms - 45 degrees
            var xOffset = Math.sin(45 * Math.PI/180) * bodyLength / 2;
            var yOffset = Math.cos(45 * Math.PI/180) * bodyLength / 2;
            ctx.moveTo(intX - xOffset, intY + radius + bodyLength / 6 + yOffset);
            ctx.lineTo(intX, intY + radius + bodyLength / 6);
            ctx.moveTo(intX + xOffset, intY + radius + bodyLength / 6 + yOffset);
            ctx.lineTo(intX, intY + radius + bodyLength / 6);

        }
        ctx.closePath();
        ctx.strokeStyle = "#" + newColor;
        ctx.lineWidth = 2;
        ctx.stroke();

    });
};
