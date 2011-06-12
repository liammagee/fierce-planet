/*
 *	zoom 0.8 - jQuery function that acts as an event handler for browser zooming
 *
 *  Copyright (c) 2008 Jared Mellentine
 *  Author: Jared Mellentine (http://design.mellentine.com)
 *  Last updated: Dec. 11, 2008
 *
 *  Known issues:
 *   - Opera doesn't run the callback function for the scrollwheel when the CTRL key is pressed
 *   - No browser support for scrollwheel zooming in Safari 2
 *
 *  Example usage:
 * 
 *  <script src="jquery.zoom.js"></script>
 *  <script>
 *     jQuery().zoom(function(){ alert('I zoomed'); });
 *  </script>
 *
 *	This would be so much easier with events similar to MozAfterPaint (FF 3.1) -JM
 *	https://developer.mozilla.org/en/Gecko-Specific_DOM_Events
 * 
 *	http://design.mellentine.com/2008/12/11/javascript-jquery-zoom-event-plugin/
 *
 *  Browser event support: http://www.quirksmode.org/dom/events/index.html
 */

$.fn.zoom = function(fn) {
	// Set handler for keyboard zooming in Firefox, IE, Opera, Safari.
	// This is the only valid case of browser-specific code I've ever seen -JM
	$(document).keydown(function(e){
		switch (true) {
			case $.browser.mozilla || $.browser.msie :
				if (e.ctrlKey && (
					e.which == 187 || // =/+ (zoom in [FF, IE])
					e.which == 107    // +   (numpad) (zoom in [FF, IE])
				)) fn(1);
				else if (e.ctrlKey && (
					e.which == 189 || // -   (zoom out [FF, IE])
					e.which == 109 // -   (numpad) (zoom out [FF, IE])
				)) fn(-1);
				else if (e.ctrlKey && (
					e.which == 96  || // 0   (reset zoom [FF, IE])
					e.which == 48     // 0   (numpad) (reset zoom [IE, FF, Opera])
				)) fn(0);
				break;
			case $.browser.opera :
				// Opera requires CTRL to be pressed for reset (using num 0)
				if (
					e.which == 43   // +   (numpad) (zoom in [Opera, Safari])
				) fn(1);
				else if (
					e.which == 45   // -   (numpad) (zoom out [Opera, Safari])
				) fn(-1);
				else if (
					e.which == 42 ||             // *   (numpad) (reset zoom [Opera])
					(e.ctrlKey && e.which == 48) // 0   (numpad) (reset zoom [FF, IE, Opera])
				) fn(0);
				break;
			case $.browser.webkit :
				// Use e.metaKey for the Apple key
				if (e.metaKey && (
					e.charCode == 43    // +   (numpad) (zoom in [Opera, Safari])
				)) fn(1);
				else if (e.metaKey && (
					e.charCode == 45    // -   (numpad) (zoom out [Opera, Safari])
				)) fn(-1);
				else if (e.ctrlKey && (
					e.which == 187 || // =/+ (zoom in [FF, IE])
					e.which == 107    // +   (numpad) (zoom in [FF, IE])
				)) fn(1);
				else if (e.ctrlKey && (
					e.which == 189 || // -   (zoom out [FF, IE])
					e.which == 109 // -   (numpad) (zoom out [FF, IE])
				)) fn(-1);
				else if (e.ctrlKey && (
					e.which == 96  || // 0   (reset zoom [FF, IE])
					e.which == 48     // 0   (numpad) (reset zoom [IE, FF, Opera])
				)) fn(0);

				break;
		}
		return;
	});

	// Set handler for scrollwheel zooming in IE
	$(document).bind('mousewheel', function(e){
		if (e.ctrlKey) fn();
	});

	// Set handler for scrollwheel zooming in Firefox
	$(document).bind('DOMMouseScroll', function(e){
		if (e.ctrlKey) fn();
	});
};
