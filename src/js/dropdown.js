/**
 *	Dropdown
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	

ch.dropdown = function(conf){

/** 
 *  Constructor
 */
	
	var that = this;

	conf = ch.clon(conf);
	conf.skin = ( that.$element.hasClass("ch-secondary") ) ? "secondary": "primary";

	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.navs.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */
	
	

/**
 *  Protected Members
 */ 
	that.$container = that.$element.addClass("ch-dropdown");
	
	that.$trigger = that.$container.children(":first");
	
	that.show = function(event){
		that.prevent(event);
		
		// Toggle
		if ( that.active ) {
			return that.hide(event);
		};
		
        // Reset all dropdowns
		$(ch.instances.dropdown).each(function(i, e){ e.hide(); });
		
        // Show menu
		that.$content.css('z-index', ch.utils.zIndex++);
		that.$trigger.css('z-index', ch.utils.zIndex ++); // Z-index of trigger over content		
		that.parent.show(event);		
		that.position("refresh");
		
		// Secondary behavior
		if(conf.skin == "secondary"){
			that.$container.addClass("ch-dropdown-on"); // Container ON
		};
	
		// Document events
		ch.utils.document.one('click', function(event){ that.hide(event) });
		
        return that;
    };
	
    that.hide = function(event){
    	that.prevent(event);
    	
    	if (!that.active) return;
    	
    	// Secondary behavior
		if(conf.skin == "secondary"){
			that.$container.removeClass("ch-dropdown-on"); // Container OFF
		};
		
        that.parent.hide(event);
        
        return that;
	};
	
/**
 *  Public Members
 */
   	that.public.uid = that.uid;
	that.public.element = that.element;
	that.public.type = that.type;
	that.public.show = function(){
		that.show();
		
		return that.public;
	};
	
	that.public.hide = function(){
		that.hide();
		
		return that.public;
	};
	
	that.public.position = that.position;	


/**
 *  Default event delegation
 */		    
    // Trigger
	that.$trigger
		.bind("click", function(event){ that.show(event) })
		.addClass("ch-dropdown-trigger-" + conf.skin)
		.append("<span class=\"ch-down\"> &raquo;</span>");

	// Content
	that.$content = that.$trigger.next();
	that.$content
		// Prevent click on content (except links)
		.bind("click", function(event){
			event.stopPropagation();
		})
		.addClass("ch-dropdown-content-" + conf.skin)
		// Save on memory;
		.detach();
	
	// Close dropdown after click an option (link)
	that.$content.find('a').one("click", function(){ that.hide() });

	// Put content out of container
	that.$container.after( that.$content );
		
	// Position
	that.conf.position = {};
	that.conf.position.element = that.$content;
	that.conf.position.context = that.$trigger;
	that.conf.position.points = "lt lb";
	that.conf.position.offset = "0 -1";
	
	ch.positioner.call(that);
	
	return that;

};
