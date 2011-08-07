/*!
 * Fierce Planet - Isometric utilities
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * @namespace Contains isometric utility functions
 */
var Isometric = Isometric || {};

// Adapted from Danko Kozar, http://www.flashperfection.com/tutorials/Isometric-Transformations-15818.html

// "0.46365 (radians) - it's a “classic” 1:2 isometric angle which lays up perfectly into pixel grid of the computer screen. "
Isometric.PERSPECTIVE_ANGLE = 0.46365;

/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.offsets3DPoint = function (point3d) {
    var x = point3d[0];
    var y = point3d[1];
    var z = point3d[2];
    // Cartesian coordinates
    var xCart = (x-z)*Math.cos(Isometric.PERSPECTIVE_ANGLE);
    // flash coordinates
    var xI = xCart;
    // Cartesian coordinates
    var yCart = y+(x+z)*Math.sin(Isometric.PERSPECTIVE_ANGLE);
    // flash coordinates
    var yI = -yCart;
    return {x: xI, y: yI};
};


/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.generate2DPoint = function (origin, point3d) {
    var xOrigin = origin[0];
    var yOrigin = origin[1];
    var point = Isometric.offsets3DPoint(point3d);
    var xI = point.x + xOrigin;
    var yI = point.y + yOrigin;
    return {x: xI, y: yI};
};

/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.lineTo3DPoint = function (context, origin, point3d) {
    var point = Isometric.generate2DPoint(origin, point3d);
    context.lineTo(point.x, point.y);
    return point;
};

/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.draw3DTile = function (context, origin, tileSize) {
    var x3d = [tileSize, 0, 0];
    var y3d = [0, tileSize, 0];
    var z3d = [0, 0, tileSize];
    var xOrigin = origin[0];
    var yOrigin = origin[1];
    var point = Isometric.offsets3DPoint(x3d);
    // Revise height
    var isoTileHeight = - point.y * 2;
//    var originCoordX = xOrigin + point.x;
//    var originCoordY = yOrigin + isoTileHeight;
//    var endCoordX = xOrigin - point.x;
//    var endCoordY = yOrigin;
    y3d = [0, isoTileHeight, 0];

//    context.clearRect();

    context.beginPath();
    context.moveTo(xOrigin, yOrigin);
    Isometric.lineTo3DPoint(context, origin, x3d);
    Isometric.lineTo3DPoint(context, origin, y3d);
    Isometric.lineTo3DPoint(context, origin, z3d);
    context.lineTo(xOrigin, yOrigin);
    context.closePath();
};

/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.doIsometricOffset = function (xPos, yPos) {
    var tileOffset = Isometric.offsets3DPoint([FiercePlanet.cellHeight, 0, 0]);
    var midTileX = (FiercePlanet.worldWidth - 1) / 2;
    var midTileY = (FiercePlanet.worldHeight - 1) / 2;
    var midTilePosX = midTileX * FiercePlanet.cellWidth;
    var midTilePosY = midTileY * FiercePlanet.cellHeight;

    var diffX = xPos - midTileX;
    var diffY = yPos - midTileY;
    var diffXY = diffX - diffY;
    var x = midTilePosX + (tileOffset.x * 2 * (diffX - (diffXY * 0.5)));
    var y = midTilePosY - (tileOffset.y * 2 * (diffXY * - 0.5));

    return {x: x, y: y};
};

/**
 * Normalises the isometric co-ordinate to a convention co-ordinate position
 */
Isometric.normaliseCoordinates = function (x, y) {
    var tileOffset = Isometric.offsets3DPoint([FiercePlanet.cellHeight, 0, 0]);
    var midTileX = (FiercePlanet.worldWidth - 1) / 2;
    var midTileY = (FiercePlanet.worldHeight - 1) / 2;
    var midTilePosX = FiercePlanet.WORLD_WIDTH / 2;
    var midTilePosY = FiercePlanet.WORLD_HEIGHT / 2;
//    var midTilePosX = midTileX * FiercePlanet.cellWidth;
//    var midTilePosY = midTileY * FiercePlanet.cellHeight;

    var posX = (x / FiercePlanet.cellWidth);
    var posY = (y / FiercePlanet.cellHeight);
    var p = Isometric.doIsometricOffset(posX, posY);

//    var diffX = posX - midTileX;
//    var diffY = posY - midTileY;
//    var diffX = Isometric.roundTo((x - midTilePosX) / FiercePlanet.cellWidth, 0.5);
//    var diffY = Isometric.roundTo((y - midTilePosY) / FiercePlanet.cellHeight, 0.5);
//    var newXPos = diffX - diffY;
//    var newYPos = diffX + diffY;
//    var a = midTilePosX + (FiercePlanet.cellWidth * (newXPos));
//    var b = midTilePosY + (FiercePlanet.cellHeight * (newYPos));
    var isoCellRatio = FiercePlanet.cellWidth / (tileOffset.x * 2);
    var diffX = (x - midTilePosX) * isoCellRatio;
    var diffY = (y - midTilePosY);
    var newXPos = diffX - (diffY * midTilePosX / midTilePosY);
    var newYPos = (diffX * midTilePosY / midTilePosX + diffY);
    var a = midTilePosX + ((newXPos));
    var b = midTilePosY + ((newYPos));
    /*
    console.log("------------------------------");
    console.log(isoCellRatio);
    console.log(tileOffset.x);
    console.log(tileOffset.y);
    console.log(FiercePlanet.cellHeight);
    console.log(FiercePlanet.cellWidth);
    console.log("mid points");
    console.log(midTilePosX);
    console.log(midTilePosY);
    console.log("old coords");
    console.log(x);
    console.log(y);
    console.log("diffs");
    console.log(diffX);
    console.log(diffY);
    console.log("differences");
    console.log(newXPos);
    console.log(newYPos);
    console.log("new coords");
    console.log(a);
    console.log(b);
    */
    return {x: a, y: b};
};

/**
 * Normalises the isometric co-ordinate to a convention co-ordinate position
 */
Isometric.roundTo = function (value, number) {
    var isNeg = (value < 0);
    var baseValue = (isNeg ? Math.ceil(value) : Math.floor(value));
  var remainder = value % 1;
  if (!isNeg && remainder > number)
    value = baseValue + number;
  else if (isNeg && remainder < - number)
    value = baseValue - number;
  else
    value = baseValue;
  return value;
};


/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.xFla = function (xOrigin, point3d) {
    x = point3d[0];
    y = point3d[1];
    z = point3d[2];
    var xCart = (x-z)*Math.cos(Isometric.PERSPECTIVE_ANGLE);
    // flash coordinates
    var xI = xCart + xOrigin;
    return (xI);
};


/**
 * Transforms x,y,z coordinates into Flash y coordinate
 * @param x
 * @param y
 * @param z
 */
Isometric.yFla = function (yOrigin, point3d) {
    x = point3d[0];
    y = point3d[1];
    z = point3d[2];
    var yCart = y+(x+z)*Math.sin(Isometric.PERSPECTIVE_ANGLE);
    // flash coordinates
    var yI = -yCart + yOrigin;
    return (yI);
};

// --- drawing functions --------------------------------
Isometric.style = function (l, r, g, b, a) {
    // a: line width
    // b: line color
    // c: line alpha
    ctx.lineWidth = l;
    ctx.strokeStyle = rgb(r, g, b, a);
};
Isometric.plot = function (ctx, x, y, z) {
    ctx.moveTo(xFla(x, y, z), yFla(x, y, z));
};
Isometric.draw = function (ctx, x, y, z) {
    ctx.lineTo(xFla(x, y, z), yFla(x, y, z));
};