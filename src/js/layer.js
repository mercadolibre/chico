/**
*  Contextual Layer Constructor
*/

ui.Layer = function(h) {

/**
 *  Private members
 */
	var t = h.trigger;	 
 	var timer;
	var setTimer = function(e) { timer = setTimeout(function(e){ hide(e); }, 4000); };

	var showTimer;
	var showDelay = 250;
	var hideTimer;
	var hideDelay = 350;

	var setShowTimer = function(e) { clearTimers(); showTimer = setTimeout(function(t){ show(e); },showDelay); };
	var setHideTimer = function(e) { clearTimers(); hideTimer = setTimeout(function(t){ hide(e); },hideDelay); };
	var clearTimer = function(t) { if (t) clearTimeout(t); };
	var clearTimers = function() { clearTimer(timer); clearTimer(showTimer); clearTimer(hideTimer); }

	var clearHelpers = function(e) { $(".layer").removeClass("show").remove(); }
		
/**
 *  Private layer content
 */                         
	var width = 280; // Webkit based browsers don't know the width... so HARDCODE! (need upgrade!)
	var c = $('<div class="article layer">' + ((h.event === 'click') ? '<span class="btn close">x</span>' : '') + '<div class="cone"/></div>'); // Close button if event is click
	
	// Content from DOM element
	if(h.content && h.content.element){
		c.append($(h.content.element).html());
	// Content from ajax
	}else if(h.ajax){
		c.append($('<div class="loading"></div>'));
		$.getJSON(h.ajax, function(data){
               $('.layer div.loading').remove();
               c.append(data);
           });
	// Content from parameters
	}else{
		// Head and body
		if(h.content && h.content.head && h.content.body) $('<dl><dt>' + h.content.head + '</dt><dd>' + h.content.body + '</dd></dl>').appendTo(c);
		// Body without head
		if(h.content && h.content.body && !h.content.head) c.append(h.content.body);
		// Actions
		if(h.content && h.content.actions){
			c.append('<hr>');
			$.each(h.content.actions, function(i, e){
				c.append('<a href="' + e.href + '">' + e.label + '</a>');
			});
		};
	};

	var setPosition = function(){
		var offset = $(t).offset();
		c.css({
			top: (offset.top + $(t).height() + 5) + 'px', // Trigger bottom + 5 px
			left: (offset.left + ($(t).width() / 2) - 20) + 'px' // Trigger middle - Cone middle
		});
	};
	 
/**
 *   Public members
 */
	var show = function(e){
		e.stopPropagation(); e.preventDefault();
		clearHelpers();
		
		// Click
		if(h.event === 'click'){
			c.find('.close').bind('click', hide);
			$(t).bind('click', hide);
			$(document).bind('click', hide);
		// Hover
		}else{
			clearTimers();
			c.bind('mouseenter', clearTimers)
			 .bind('mouseleave', setHideTimer);
		};
		
		// Create
		setPosition();
		c.bind('click', function(e){ e.stopPropagation(); }).appendTo($('body')).addClass('show');
	};
			
	var hide = function (e){
		e.stopPropagation(); e.preventDefault();
		
		// Click
		if(h.event === 'click'){
			c.find('.close').unbind('click');
			$(t).unbind('click').bind('click', show); // Reset trigger click event
			$(document).unbind('click');
		// Hover
		}else{
			clearTimers();
			c.unbind('mouseenter')
			 .unbind('mouseleave');
		};
		
		// Destroy
		c.removeClass('show').remove();
	};
		    
/**
 *  First event
 */
	// Click
	if(h.event === 'click'){
		$(t).css('cursor', 'pointer')
			.bind('click',show);
	// Hover
	}else{
		$(t).css('cursor', 'default')
			.bind('mouseover', setShowTimer)
			.bind('mouseout', setHideTimer);
	};
	return {show:show,hide:hide}
}