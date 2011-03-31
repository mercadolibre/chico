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
 *  Private Members
 */
	
	var generateMenu;

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
	that.public.select = function(tab){
		that.select(tab);
		
		return that.public;
	};	
	that.public.getSelected = function(){ return selected; };
	
/**
 *  Default event delegation
 */	
    
    // Create children
	$.each(that.$element.children(), function(i, e){
		
		$(e).children().eq(0).addClass("ch-bellows-trigger");
		
		// Only lists
		if($(e).children().eq(1).attr("tagName") != "UL") {
			that.children.push($(e));
			return;
		};
		
		var list = {};
			list.uid = that.uid + "#" + i;
			list.type = "bellows";
			list.element = e;
			list.$element = $(e);
			list.open = conf.hasOwnProperty("selected") && conf.selected == i;
	
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
 *  Private Members
 */
	
	
/**
 *  Protected Members
 */ 
	
	that.$container = that.$element.addClass("ch-bellows");
	
	that.$trigger = that.$container.children(":first");
	
	that.$content = that.$trigger.next();
	
	that.show = function(event){
		that.prevent(event);
		
		// Toggle
		if ( that.active ) return that.hide(event);
		
        that.parent.show(event);
		
		return that;
    };
	
    that.hide = function(event){
    	that.prevent(event);
    	
    	// Toggle
    	if (!that.active) return;
    	
        that.parent.hide(event);
        
        return that;
	};
	
/**
 *  Public Members
 */
	
	
/**
 *  Default event delegation
 */	 	
	
	// Closed by default
	if(that.open) {
		that.active = true;
		that.$trigger.addClass("ch-bellows-on");
	} else {
		that.$content.hide();
	};
	
	// Trigger
	that.$trigger
		.bind("click", function(event){ that.show(event) })
		.append("<span class=\"ch-arrow\"> &raquo;</span>");

	// Content
	that.$content
		.addClass("ch-bellows-content")
		.bind("click", function(event){ event.stopPropagation(); });
	
	
	return that;
};
