/**
 *	Context Layer
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.layer = function(conf){
	var that = ui.floats(); // Inheritance

	// Global configuration
	conf.$trigger = $(conf.element);
	conf.align = 'down';
	conf.cone = true;
	conf.classes = 'box';
	conf.wrappeable = true;
	conf.status = false;

	// Click
	if(conf.event === 'click'){
		// Local configuration
		conf.closeButton = true;

		// Trigger events
		conf.$trigger
			.css('cursor', 'pointer')
			.bind('click',function(event){				
				that.show(event, conf);
				$('.uiLayer').bind('click', function(event){ event.stopPropagation() });
								
				// Document events
				$(document).bind('click', function(event){
					that.hide(event, conf);
					$(document).unbind('click');
				});
			});

	// Hover
	}else{
		// Trigger events
		conf.$trigger
			.css('cursor', 'default')
			.bind('mouseover', function(event){
				that.show(event, conf);				
			})
			.bind('mouseout', function(event){
				that.hide(event, conf);
			});
	};

	return { show: function(event){ that.show(event, conf) }, hide: function(event){ that.hide(event, conf) }};
};
