/*
 * jQuery Zoom Event
 * Copyright 2011 Mauro Colella
 * Released under the MIT and GPL licenses.
 */

(function($) {
	// *** Register our plugin.
	$.fn.zoomListener = function () {
		// *** Plugin variables.
		var data = this.data("zoomEvent"); 
		if(!data){
			this.data("zoomEvent", data = {
				interval: 100,
				lastWidth: 0,
				lastHeight: 0,
				lastFontSize: 0
			});
			data = this.data("zoomEvent"); 
		}
		
		// *** Hook main program loop into the jQuery animation system.
		this.animate({opacity:"1.0"}, data.interval, function() {
			
			$(this).toggle().zoomListener();
//			console.log(($("span:last-child").height()*100/data.firstFontSize)+"%");
			// *** Get current window dimensions
			var widthNow = $(window).width(), heightNow = $(window).height(), fontSizeNow = $("#zsp_ez").height();
			if (data.lastWidth !== widthNow || data.lastFontSize !== fontSizeNow){	// || data.lastHeight !== heightNow){
				// *** If dimensions have changed, update data, and
				// *** fire documentZoomed event on all available components.
				//console.log(fontSizeNow);
				$(this).data("zoomEvent",{
					interval: data.interval,
					lastWidth: widthNow,
					lastHeight: heightNow,
					lastFontSize: fontSizeNow
				});
				//if(data.lastWidth)
					$("*").trigger("documentzoom");	
			}
		
			// *** Make plugin chainable.
			return $(this);
		});
	}
	
	
	// Auto-start
	$(document).ready(function(){
		var $zsp = $("<span id=\"zsp_ez\">&nbsp</span>");
		$zsp.hide();
		
		//$zsp.attr("class","zoomSizePublisher");
		$("body").append($zsp);
		$zsp.zoomListener();
	})
	

})(jQuery);

