;(function($) { 

window.mlui = {
	
	init: function() {

		$(".tip").each(function(i,e){ new mlui.Tooltip(e); });

	},
	
	
/**
 *	Tooltip Constructor
 */
	Tooltip: function(tip) {

	/**
	 *	Private members
	 */

		var that = this;
		
		var jtip = $(tip); // JQuery(tip)
				
		var showTimer;
		var showDelay=500;
		var hideTimer;
		var hideDelay=250;
		
		var setShowTimer = function(e) { clearTimers(); showTimer = setTimeout(function(t){ that.show(e); },showDelay); };
		var setHideTimer = function(e) { clearTimers(); hideTimer = setTimeout(function(t){ that.hide(e); },hideDelay); };
		var clearTimer = function(t) { if (t) {	clearTimeout(t); } };
		var clearTimers = function() { clearTimer(showTimer); clearTimer(hideTimer); };

	
	/**
	 *	Private tooltip content
	 */	
	
		var c = jtip.attr("title")||jtip.attr("alt"); if (!c) { return };
				jtip.removeAttr("title");
		
		var z = $("<span>").addClass("cone");
		var h = $("<p>").addClass("tooltip").html(c).append(z);
	
		var setPosition = function(e){
			
			// tomar la posicion del mouse actual y no la que llega en el evento
			var top = e.pageY;
			var left = e.pageX;
			h.css("position", "absolute");
			h.css("top", (top+20)+"px");
			h.css("left", (left-40)+"px");
		}

	/**
	 *	Public members
	 */
		this.show = function (e) {
			e.stopPropagation(); e.preventDefault(); clearTimers();
			setPosition(e);
			$(".tooltip").remove();
			h.appendTo("body");
		}

		this.hide = function (e) {
			e.stopPropagation(); e.preventDefault(); clearTimers();
			h.remove();
		}
	
	/**
	 *	First event
	 */
		jtip.bind("mouseover",setShowTimer)
		    .bind("mouseout",setHideTimer);
		
	}

}

})(jQuery);