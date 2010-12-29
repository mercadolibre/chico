/**
 *	Dropdown
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.dropdown = function(conf){
	var that = ui.navs(); // Inheritance

	// Global configuration
	$(conf.element).addClass('ch-dropdown');
	conf.$trigger = $(conf.element).children(':first');
	conf.$htmlContent = conf.$trigger.next().bind('click', function(event){ event.stopPropagation() });
    conf.publish = that.publish;
	
	// Methods
	var show = function(event){ 

        that.show(event, conf);

        // return publish object
        return conf.publish;  
    };
	
    var hide = function(event){ 

        that.hide(event, conf); 

        // return publish object
        return conf.publish; 
    };
    
	// Trigger
	conf.$trigger
		.bind('click', function(event){
			if(that.status){ that.hide(event, conf); return; };
			
			// Reset all dropdowns
			$(ui.instances.dropdown).each(function(i, e){ e.hide() });
			
			that.show(event, conf);
		
			// Document events
			$(document).bind('click', function(event){
				//that.hide(event, conf);
                hide(event);
				$(document).unbind('click');
			});
		})
		.css('cursor','pointer')
		.addClass('ch-dropdown-trigger')
		.append('<span class="down">&raquo;</span>');
	
	// Content
	conf.$htmlContent
		.addClass('ch-dropdown-content')
		.css('z-index', ui.utils.zIndex++)
		.find('a')
			.bind('click', function(){ hide($.Event()) });

    // create the publish object to be returned
        conf.publish.uid = conf.id,
        conf.publish.element = conf.element,
        conf.publish.type = "dropdown",
        conf.publish.show = function(event){ return show(event, conf) },
        conf.publish.hide = function(event){ return hide(event, conf) }

	return conf.publish;

};
