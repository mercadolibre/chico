$.extend($.fn.disableTextSelect = function() {
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

;(function($) { 
	
window.ui = {
	
	init: function(conf) {
		
		if (conf.modal) {
			$(conf.modal).each(function(i,e){
				new ui.Modal(e);
			});	
		}
		if (conf.layer) {
			$(conf.layer).each(function(i,e){
				new ui.Layer(e);
			});
		}
		if (conf.tabs) {
			$(conf.tabs).each(function(i,e){
				new ui.Tab(e);
			});
		}

		if (conf.dropdown) $(".dropdown").each(function(i,e){ new ui.Drop(e);  });
				
		if (conf.tooltip) $(".tip").each(function(i,e){ new ui.Tooltip(e); });

	},
	
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
		}
		
	},
	
	instances: {
		
	},
	
	create: function(o) {
			
	},
	
/**
 *	Tooltip Constructor
 */
	Tooltip: function(tip) {

	/**
	 *	Private members
	 */

		var that = this; // Instance
		
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
		this.show = function (e) {
			e.stopPropagation(); e.preventDefault(); clearTimers();
			$(".tooltip").remove();
			h.css("position", "absolute");
			h.css("top", (getPosition.pageY+20)+"px");
			h.css("left", (getPosition.pageX-40)+"px");
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
		    .bind("mouseout",setHideTimer)
		    .bind("mousemove",setPosition); // I need to know where is the Pointer, could be anywhere!		
	},
	

/**
 *  Layer Constructor
 */
		Layer: function(h) {
 
	/**
	 *  Private members
	 */
		var that = this;
		var click = (h.event)?true:false;
	
		var t = $(h.trigger);
	
		var showTimer;
		var showDelay=250;
		var hideTimer;
		var hideDelay=350;
		
		var setShowTimer = function(e) { clearTimers(); showTimer = setTimeout(function(t){ that.show(e); },showDelay); };
		var setHideTimer = function(e) { clearTimers(); hideTimer = setTimeout(function(t){ that.hide(e); },hideDelay); };
		var clearTimer = function(t) { if (t) {	clearTimeout(t); } };
		var clearTimers = function() { clearTimer(showTimer); clearTimer(hideTimer); }

		var clearHelpers = function(e) { $(".layer").removeClass("show").remove(); }
		
     /**
      *  Private layer content
      */                         
			var width = 280;  // Webkit based browsers don't know the width... so HARDCODE! (need upgrade!)
			var c = $("<dl class=\"layer\"><span class=\"btn close\">x</span><div class=\"cone\" /></dl>");             

			if (h.content.head) 
				c.append("<dt>"+h.content.head+"</dt>");
				c.append("<dd>"+h.content.body+"</dd>");
			if (h.content.actions) {
				c.append("<hr>");
				$(h.content.actions).each(function(i,e){
					c.append("<a href=\""+e.href+"\">"+e.label+"</a>");
				});
			}

			var setPosition = function(e) {
				var top = (e.pageY+20);
				var left = (e.pageX-width/2);
				if (left<0) { c.find('.cone').css("left","10px"); left = e.pageX-10; }
				if ((left+width) > ui.utils.window.width()) { left -= width/2; c.find('.cone').css("left","260px"); }
				c.css('top',top+'px').css('left',left+'px');
			};
 
       /**
         *   Public members
         */
			this.show = function (e) {
				e.stopPropagation(); e.preventDefault(); clearTimers();
				clearHelpers(); setPosition(e);

				if (click) {
					t.unbind("click"); // Avoid the repetition
				} else {
					c.bind("mouseenter",function(e){ clearTimers(e); });
					c.bind("mouseleave",function(e){ setHideTimer(e); });				
				}

				ui.utils.body.bind("click",function(e){ that.hide(e); });
				
				c.find('span').bind("click",function(e){ that.hide(e); });
				c.appendTo("body").addClass("show");                                      
			}
			
			this.hide = function (e) {
				e.stopPropagation(); e.preventDefault(); clearTimers();
				if (e.target == t)  return;
				
				if (click) {
					ui.utils.body.unbind("click");
					t.bind("click",that.show); // Set the first event again
				} else {
					c.unbind("mouseenter");
					c.unbind("mouseleave");
				}

				c.find('span').unbind("click");
				c.removeClass("show").remove();
			}
        
      /**
		*  First event
		*/
			if (click) {
				t.bind("click",that.show);
			} else {
				t.bind("mouseover",setShowTimer)
				 .bind("mouseout",setHideTimer);
			}
			
		},


/**
 *	Modal Constructor
 */
 	Modal: function(e) {
		
		var that = this;
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

		this.create = function(event) {	
			event.preventDefault();			
			event.stopPropagation();			
			ui.utils.dimmer.on();			
		// Creating stuff
			var w = $("<div>").addClass("modal box");
			var close = $("<p>x</p>").addClass("btn").addClass("close").appendTo(w).bind("click",that.remove);
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

		this.remove = function(event) {
			$("div.modal").fadeOut("fast",function(){ $(this).remove(); });
			ui.utils.window.unbind("resize");
			ui.utils.dimmer.off();
		}
		
		t.bind("click",this.create);
	},
	

/**
 *  Drop Constructor
 */
	Drop: function(e) {

		var that = this;
		var status = false;
	
		var upAll = function(event,element) { $(dropdown.triggers).each(function(i,e){ if (element!=e) e.dropdown.up(event); }) };

		// Wrap drops
		$(e).children(":first").wrap("<div class=\"dropWraper\">");
		var w = $(e).find(".dropWraper");
			w.append("<span class=\"ico down\">&raquo;</span>");

		var u = $(e).children(":first").next();
			u.addClass("dropContent");

		this.drop = function(event){
			event.stopPropagation();
			$('.dropWraper, .dropContent').disableTextSelect(); // no permite seleccionar el texto
			if (status) { that.up(event); return; }
			
		//	upAll(event,e);
			
			if ((u.width()+event.pageX) > parseInt(ui.utils.window.width())) { u.addClass("move"); } else { u.removeClass("move"); }
			$(e).addClass("on");
			status = true;		
			
			u.bind("scroll",function(){ status = false; });
			
		};

		this.up = function(event){ 
			event.stopPropagation();
			ui.utils.document.unbind("click");
			$(e).removeClass("on"); 
			status = false;
		};

		$(e).bind("mouseup",that.drop);
			
		ui.utils.document.bind("mouseup",that.up);
	}

}

})(jQuery);
