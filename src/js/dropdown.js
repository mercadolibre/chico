/**
 *	Dropdown
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.dropdown = function(conf){
	var that = ui.navs(); // Inheritance

	// Global configuration
	$(conf.element).addClass('uiDropdown');
	conf.$trigger = $(conf.element).children(':first');
	conf.$htmlContent = conf.$trigger.next().bind('click', function(event){ event.stopPropagation() });
	
	// Trigger
	conf.$trigger
		.bind('click', function(event){
			if(that.status){ that.hide(event, conf); return; };
			
			// Reset all dropdowns
			$(ui.instances.dropdown).each(function(i, e){ e.hide() });
			
			that.show(event, conf);
		
			// Document events
			$(document).bind('click', function(event){
				that.hide(event, conf);
				$(document).unbind('click');
			});
		})
		.css('cursor','pointer')
		.addClass('uiTrigger')
		.append('<span class="down">&raquo;</span>');
	
	// Content
	conf.$htmlContent
		.addClass('uiContent')
		.find('a')
			.bind('click', function(){ hide($.Event()) });
			
	// Public members
	var show = function(event){ that.show(event, conf); };
	var hide = function(event){ that.hide(event, conf); };


    // create the publish object to be returned

    that.publish = {
        uid: conf.id,
        element: conf.element,
        type: "ui.dropdown",
        show: function(event){ show(event, conf) },
        hide: function(event){ hide(event, conf) }
    }

	return that.publish;

};
