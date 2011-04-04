/**
 *	Accordion
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.accordion = function(conf){

/** 
 *  Constructor
 */
	
	var that = this;

	that.$element.addClass('ch-accordion');
		
	conf = ui.clon(conf);
	
	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ui.controllers.call(that);
    that.parent = ui.clon(that);

/**
 *  Protected Members
 */

/**
 *  Public Members
 */
	
	that.public.uid = that.uid;
	that.public.element = that.element;
	that.public.type = that.type;
	that.public.children = that.children;
	that.public.select = function(bellows){
		
		if(typeof bellows == "string") {
			var sliced = bellows.split("#");
		
			that.children[ sliced[0] ].select( sliced[1] );
		} else {
			that.children[ bellows ].show();
		};
		
		that.callbacks("onSelect");
		
		return that.public;
	};	
	
/**
 *  Default event delegation
 */	
    
    // Create children
	$.each(that.$element.children(), function(i, e){
		
		// Links are pushed directly
		if($(e).children().eq(1).attr("tagName") != "UL") {
			that.children.push( $(e).addClass("ch-bellows").children().addClass("ch-bellows-trigger") );
			return;
		};
		
		var list = {};
			list.uid = that.uid + "#" + i;
			list.type = "bellows";
			list.element = e;
			list.$element = $(e);
			// Selected -> It can be for example "2" or "2#1"
			if(conf.hasOwnProperty("selected")) {
				list.open = (typeof conf.selected == "number") ? conf.selected == i : (conf.selected.split("#")[0] == i) ? conf.selected.split("#")[1] : false;
			} else {
				list.open = false;
			};
			
		that.children.push( ui.bellows.call(list, that) );
	});
    
    
	return that;
	
};


ui.bellows = function(controller){

/** 
 *  Constructor
 */
	
	var that = this;
	
	conf = {};
	
	that.conf = conf;
/**
 *	Inheritance
 */

    that = ui.navs.call(that);
    that.parent = ui.clon(that);
	that.controller = controller;
	
/**
 *  Protected Members
 */ 
	
	that.$container = that.$element.addClass("ch-bellows");
	
	that.$trigger = that.$container.children(":first");
	
	that.$content = that.$trigger.next();
	
	that.show = function(event){
		that.prevent(event);
		
		// Toggle
		if (that.active) return that.hide(event);
		
		// Accordion behavior (hide last active)
		if(!controller.conf.menu) {
			$.each(controller.children, function(i, e){
				if(e.hasOwnProperty("active") && e.active == true && e.element !== that.element) e.hide();
			});
		};
		
        that.$content.slideDown("fast");
        
        that.parent.show(event);
        
        return that;
    };
	
    that.hide = function(event){
    	that.prevent(event);
    	
    	// Toggle
    	if (!that.active) return;
    	
    	that.active = false;
    	
   		that.parent.hide(event);
    	that.$content.slideUp("fast");

        that.$trigger.removeClass("ch-" + that.type + "-on");
        
		that.$content.slideUp("fast");
		
		that.callbacks("onHide");
        
        return that;
	};
	
	that.select = function(child) {
		that.show();
		
		// L2 selection
		that.$content.find("a").eq( child ).addClass("ch-bellows-on");
	};
	
	
/**
 *  Default event delegation
 */	 	
	
	// Closed by default
	if(that.open) that.select( parseInt(that.open) ); else that.$content.hide();
	
	// Trigger
	that.$trigger
		.addClass("ch-bellows-trigger")
		.bind("click", function(event){ that.show(event) })
		.append("<span class=\"ch-arrow\"> &raquo;</span>");

	// Content
	that.$content
		.addClass("ch-bellows-content")
		.bind("click", function(event){ event.stopPropagation(); });
	
	
	return that;
};


/**
 *	@Interface Menu
 *	@return An interface object
 */

ui.menu = function(conf) {
    
    conf = conf || {};
	
	conf.menu = true;
	
	return ui.accordion.call(this, conf);
    
};

ui.factory({ component: 'menu' });
