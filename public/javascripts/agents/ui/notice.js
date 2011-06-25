/**
 *
 * @param text
 * @param x
 * @param y
 * @param width
 * @param height
 * @param start
 * @param duration
 */
function Notice(text, x, y, start, duration, width, height, backgroundColor, foregroundColor, lineWidth, font) {
    this._text = text || "";
    this._start = start || FiercePlanet.gameCounter;
    this._duration = duration || 150;
    this._x = x || (Math.random() * (FiercePlanet.WORLD_WIDTH - FiercePlanet.WAVE_NOTICE_WIDTH));
    this._y = y || Math.random() * (FiercePlanet.WORLD_HEIGHT - FiercePlanet.WAVE_NOTICE_HEIGHT);
    this._width = width || FiercePlanet.WAVE_NOTICE_WIDTH;
    this._height = height || FiercePlanet.WAVE_NOTICE_HEIGHT;
    this._backgroundColor = backgroundColor || 'rgba(32, 98, 210)';
    this._foregroundColor = foregroundColor || 'rgba(255, 255, 255)';
    this._lineWidth = lineWidth || 2;
    this._font = font || '500 14px/2 Unknown Font, sans-serif';
}

