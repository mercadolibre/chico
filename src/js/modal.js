/**
 *	Modal window
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.Modal = function(conf){
	var that = ui.Floats(); // Inheritance
	if(conf.content.type == 'ajax') conf.content.data = $(conf.trigger).attr('href'); // Content from href/action		
	
	// Global configuration
	conf.closeButton = true;	
	conf.align = 'center';
	conf.classes = 'box';

	// Events
	$(conf.trigger).css('cursor', 'pointer')
		.bind('click', function(event){ 
			ui.utils.dimmer.on();
			that.show(event, conf);
		});
	
	return { show: function(event){ that.show(event, conf) }, hide: function(event){ that.hide(event, conf) }};
};