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
 * Register the default agent types
 */
FiercePlanet.registerDefaultAgentTypes = function() {
    AgentTypes.CITIZEN_AGENT_TYPE = new AgentType("Citizen", "000", FiercePlanet.resourceCategories);
    AgentTypes.CITIZEN_AGENT_TYPE.setDrawFunction(function(ctx, agent, x, y, pieceWidth, pieceHeight, newColor, counter, direction) {
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

    AgentTypes.PREDATOR_AGENT_TYPE = new AgentType("Predator", "fbe53b", FiercePlanet.resourceCategories);
    AgentTypes.PREDATOR_AGENT_TYPE.setDrawFunction(function(ctx, agent, intX, intY, pieceWidth, pieceHeight, newColor, counter, direction) {
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

    AgentTypes.RIVAL_AGENT_TYPE = new AgentType("Rival", "3be5fb", FiercePlanet.resourceCategories);
    AgentTypes.RIVAL_AGENT_TYPE.setDrawFunction(function(ctx, agent, intX, intY, pieceWidth, pieceHeight, newColor, counter, direction) {
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
