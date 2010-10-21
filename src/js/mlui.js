;(function($) { 
	
window.ui = {

/**
 *	Factory Pattern
 */	
 	instances: {},
 	
	init: function(conf){
		
		if(typeof conf !== 'object'){
			throw("UI: Can't start without a configuration."); return;
		}else{
			// Each configuration
			for(var x in conf){
	    		var component = ui[ui.utils.ucfirst(x)]; //var component = eval('ui.'+ ucfirst(x));   // FUCK the eval!
				
				// If component configuration is an array, each array. Else each DOM elements with component class
	    		$( ($.isArray(conf[x])) ? conf[x] : '.' + x ).each(function(i,e){
		    		if(!ui.instances[x]) ui.instances[x] = []; // If component instances don't exists, create this like array
	    			ui.instances[x].push(component(e));
	    		});
	    	};
		}
	},
	
/**
 *	
 */		
	utils: {
		body: $("body"),
		window: $(window),
		document: $(document),
		dimmer: {
			on:function() { 
				$("<div>").css({"height":$(window).height(),"display":"block"}).appendTo("body").fadeIn().addClass("dimmer"); 
			},
			off:function() { 
				$("div.dimmer").fadeOut("fast",function(){ $(this).remove(); }); 
			}
		},
		ucfirst: function (S) { return S.charAt(0).toUpperCase() + S.substr(1); }
		
	},	
	
/**
 *	Helper Constructor
 */
	Tip: function(tip) {

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
	},
	

/**
 *  Layer Constructor
 */
	Layer: function(h) {

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
	},

/**
 *	Modal Constructor
 */
 	Modal: function(e) {
		
		var t = $(e.trigger);
		
		// Need to know if the trigger is a link or a form
		var uri = (t.attr("href"))?t.attr("href"):t.parents("form").attr('action');
		var setPosition = function(w) {
			return {left:parseInt(ui.utils.window.width())/2-parseInt(w.css("width"))/2,
					top:parseInt(ui.utils.window.height())/2-parseInt(w.css("height"))/2};			
		};
		
		var setSize = function() {
			return {width:((!e.width)|(parseInt(e.width)>=parseInt(ui.utils.window.width())))?parseInt(ui.utils.window.width())/1.5+"px":e.width,
					height:((!e.height)|(parseInt(e.height)>=parseInt(ui.utils.window.height())))?parseInt(ui.utils.window.height())/2+"px":e.height};
		};

		var create = function(event) {	
			event.preventDefault();			
			event.stopPropagation();			
			ui.utils.dimmer.on();			
		// Creating stuff
			var w = $("<div>").addClass("modal box");
			var close = $("<p>x</p>").addClass("btn").addClass("close").appendTo(w).bind("click",remove);
		// Cheking properties
			if (e.title) w.append("<h2>"+e.title+"</h2>");
			if (e.content) w.append(e.content);
		// Setting some attributes
			w.css(setSize());
			w.css(setPosition(w));			
		// Getting content 
			if (e.ajax) {
				w.append( $("<div><div class=\"loading\"></div>").addClass("content").css("height", (e.title)?"90%":"100%") );
				w.find(".loading").css("margin-top",(parseInt(w.css("height"))/2-25));
				w.find(".content").load(uri,{"x":"x"},function(){ $("div.loading").remove(); });						
			}

		// FIX: when the windows resize, need to rethink the position of the window and his size
			ui.utils.window.bind("resize",function(){ 
				w.css(setSize());
				w.css(setPosition(w));
			}); 

		// Placing modal window in the <body> ;)
			w.appendTo("body").fadeIn("slow");
		}

		var remove = function(event) {
			$("div.modal").fadeOut("fast",function(){ $(this).remove(); });
			ui.utils.window.unbind("resize");
			ui.utils.dimmer.off();
		}
		
		t.bind("click",create);
		
		return {create:create, remove:remove};
	},
	

/**
 *  Dropdown Constructor
 */
	Dropdown: function(e) {

		var status = false;
	
		var upAll = function(event,element) { $(dropdown.triggers).each(function(i,e){ if (element!=e) e.dropdown.up(event); }) };

		// Wrap drops
		$(e).children(":first").wrap("<div class=\"dropWraper\">");
		var w = $(e).find(".dropWraper");
			w.append("<span class=\"ico down\">&raquo;</span>");

		var u = $(e).children(":first").next();
			u.addClass("dropContent");

		var drop = function(event){
			event.stopPropagation();
			 // no permite seleccionar el texto
			/*$.extend($.fn.disableTextSelect = function() {
					return this.each(function(){
					if($.browser.mozilla){//Firefox
						$(this).css('MozUserSelect','none');
					}else if($.browser.msie){//IE
						$(this).bind('selectstart',function(){return false;});
					}else{//Opera, etc.
						$(this).mousedown(function(){return false;});
					}
				});
			});
			$('.dropWraper, .dropContent').disableTextSelect();*/
			if (status) { up(event); return; }
			
		//	upAll(event,e);
			
			if ((u.width()+event.pageX) > parseInt(ui.utils.window.width())) { u.addClass("move"); } else { u.removeClass("move"); }
			$(e).addClass("on");
			status = true;		
			
			u.bind("scroll",function(){ status = false; });
			
		};

		var up = function(event){ 
			event.stopPropagation();
			ui.utils.document.unbind("click");
			$(e).removeClass("on"); 
			status = false;
		};

		$(e).bind("mouseup",drop);
			
		ui.utils.document.bind("mouseup",up);
		
		return {drop:drop,up:up}
	}

}

})(jQuery);
