/*!
 * Fierce Planet - A very simple Log wrapper
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var Log = (function() {


    var log = {
        FATAL: 0,
        ERROR:  1,
        WARN: 2,
        INFO:  3,
        DEBUG:  4,
        TRACE: 5,

        level: this.WARN,

        isAt: function isAt(atLevel) {
            return (atLevel <= this.level);
        },

        fatal: function fatal(message) {
            log(message, this.FATAL);
        },

        error: function error(message) {
            log(message, this.ERROR);
        },

        warn: function warn(message) {
            log(message, this.WARN);
        },

        info: function info(message) {
            log(message, this.INFO);
        },

        debug: function debug(message) {
            log(message, this.DEBUG);
        },

        trace: function trace(message) {
            log(message, this.TRACE);
        },

        log: function log(message, atLevel) {
            if (typeof console != "undefined" && this.isAt(atLevel))
                console.log(message);
        }

    };

    return log;
})();

