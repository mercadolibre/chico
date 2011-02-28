/**
 *	Dropdown
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	

ui.dropdown = function(conf){

/** 
 *  Constructor: Redefine or preset component's settings
 */
	var $container = $(conf.element).addClass("ch-dropdown");
	var skin = ( $container.hasClass("ch-secondary") ) ? "secondary": "primary";
	
/**
 *  Inheritance: Create a symbolic link to myself and my direct parent
 */
	var that = ui.navs();
	
	
/**
 *  Private Members
 */
	var show = function(event){
		that.prevent(event);
		
		// Toggle
		if(that.status){
			return hide();
		};
		
		// Reset all dropdowns
		$(ui.instances.dropdown).each(function(i, e){ e.hide(); });
		 
        // Show menu
		conf.$htmlContent.css('z-index', ui.utils.zIndex++);		
		that.show(event, conf);
		that.position("refresh",conf);
		
		// Secondary behavior
		if(skin == "secondary"){
			conf.$trigger.css('z-index', ui.utils.zIndex ++); // Z-index of trigger over content
			$container.addClass("ch-dropdown-on"); // Container ON
		};
	
		// Document events
		ui.utils.document.one('click', hide);
		
        return that.publish; // Returns publish object
    };
	
    var hide = function(event){
    	that.prevent(event);
    	
    	// Secondary behavior
		if(skin == "secondary"){
			$container.removeClass("ch-dropdown-on"); // Container OFF
		};
        that.hide(event, conf);
        
        return that.publish; // Returns publish object
    };
    
    
    // Trigger
	conf.$trigger = $container.children(":first")
		.bind("click", show)
		.addClass("ch-dropdown-trigger-" + skin)
		.append("<span class=\"ch-down\"> &raquo;</span>");
	
	// Content
	conf.$htmlContent = conf.$trigger.next()
	
		// Prevent click on content (except links)
		.bind("click", function(event){
			event.stopPropagation()
		})
		
		.addClass("ch-dropdown-content-" + skin)
		
		// Save on memory;
		.detach();
	
	// Close dropdown after click an option (link)
	conf.$htmlContent.find('a').one('click', function(){ hide(); });
	
	// Put content out of container
	$container.after( conf.$htmlContent );
	
	// Content position
	conf.position = {
		context: conf.$trigger,
		element: conf.$htmlContent,
		points: "lt lb",
		offset: "0 -1"
	};
	
	ui.positioner(conf.position);

/**
 *  Expose propierties and methods
 */
    that.publish = {
    
    /**
	 *  @ Public Properties
	 */
    	uid: conf.uid,
    	element: conf.element,
    	type: conf.type,
    
    /**
	 *  @ Public Methods
	 */
    	show: show,
    	hide: hide,
    	position: function(o) {
			return that.position(o,conf) || that.publish;
		}
    };

	return that.publish;

};
