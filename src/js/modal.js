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
	
	// Events
	$(conf.trigger).bind('click', function(event){ 
		ui.utils.dimmer.on();
		that.show(event, conf);
		
		//style conf, no me convence agregar aca los estilos pero sólo los necesita el modal
		$('.uiModal').addClass('box');		
	});
	
	return { show: function(event){ that.show(event, conf) }, hide: function(event){ that.hide(event, conf) }};
};