/**
 *	Dropdown
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.dropdown = function(conf){
	var that = ui.navs(); // Inheritance

	var skin;
	// Primary or secondary behavior
	if($(conf.element).hasClass("ch-secondary")){
		$(conf.element).addClass('ch-dropdown');
		skin = "secondary";
	}else{
		$(conf.element).addClass("ch-dropdown ch-primary");
		skin = "primary";
	};
	
	// Global configuration
	conf.$trigger = $(conf.element).children(':first');
	conf.$htmlContent = conf.$trigger.next();
    conf.publish = that.publish;
	
	// Private methods
	var show = function(event){
		that.prevent(event);
		// Toggle
		if(that.status){
			return hide();
		};
		
		// Reset all dropdowns
		$(ui.instances.dropdown).each(function(i, e){ e.hide() });
		 
        // Show menu
		conf.$htmlContent.css('z-index', ui.utils.zIndex++);		
		that.show(event, conf);
		
		// Secondary behavior
		if(skin == "secondary"){
			conf.$trigger.css('z-index', ui.utils.zIndex++); // Z-index of trigger over content
			$(conf.element).addClass("ch-dropdown-on"); // Container ON
		};
	
		// Document events
		ui.utils.document.one('click', function(event){
			that.prevent(event);
            hide();
		});
		
        return conf.publish; // Returns publish object
    };
	
    var hide = function(event){
    	that.prevent(event);
    	
    	// Secondary behavior
		if(skin == "secondary"){
			$(conf.element).removeClass("ch-dropdown-on"); // Container OFF
		};
        that.hide(event, conf);
        
        return conf.publish; // Returns publish object
    };
    
	// Trigger
	conf.$trigger
		.bind('click', function(event){
			that.prevent(event);			
			// Show dropdown
			show();
		})
		.addClass('ch-dropdown-trigger')
		.append('<span class="ch-down">&raquo;</span>');
	
	
	// Content
	conf.$htmlContent
		.bind('click', function(event){ event.stopPropagation() })
		.addClass('ch-dropdown-content')
		// Close when click an option
		.find('a').bind('click', function(){ hide() });
	

    // Create the publish object to be returned
    conf.publish.uid = conf.id;
    conf.publish.element = conf.element;
    conf.publish.type = "dropdown";
    conf.publish.show = function(){ return show() };
    conf.publish.hide = function(){ return hide() };

	return conf.publish;

};
