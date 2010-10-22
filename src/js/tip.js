/**
*  Tooltip Constructor
*/

ui.Tip = function(tip) {

/**
 *	Private members
 */

	var jtip = $(tip); // JQuery(tip)
	
	var showTimer;		
	var showDelay=300;
	var hideTimer;		
	var hideDelay=150;
	
	var setShowTimer = function(e) { clearTimers(); showTimer = setTimeout(function(t){ show(e); },showDelay); };
	var setHideTimer = function(e) { clearTimers(); hideTimer = setTimeout(function(t){ hide(e); },hideDelay); };
	var clearTimer = function(t) { if (t) {	clearTimeout(t); } };
	var clearTimers = function() { clearTimer(showTimer); clearTimer(hideTimer); }


/**
 *	Private tooltip content
 */	

	var c = jtip.attr("title") || jtip.attr("alt"); 
	
	if (!c) return;
	jtip.removeAttr("title");
	
	var z = $("<span>").addClass("cone");
	var h = $("<p>").addClass("tooltip").html(c).append(z);

	var getPosition = {
			pageX:0,
			pageY:0
		}

	var setPosition = function(e) {
		getPosition.pageY = e.pageY;
		getPosition.pageX = e.pageX;
	}
/**
 *	Public members
 */
	var show = function (e) {
		e.stopPropagation(); e.preventDefault();
		clearTimers();
		$(".tooltip").remove();
		h.css("position", "absolute");
		h.css("top", (getPosition.pageY+20)+"px");
		h.css("left", (getPosition.pageX-40)+"px");
		h.appendTo("body");
	}

	var hide = function (e) {
		e.stopPropagation(); e.preventDefault();
		clearTimers();
		h.remove();
	}

/**
 *	First event
 */
	jtip.bind("mouseenter",setShowTimer)
		.bind("mousemove", setPosition)
	   	.bind("mouseout",setHideTimer);
	
	return {show:show,hide:hide}
}