/**
 *	Context Layer
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.Layer = function(conf){
	var that = ui.Floats(); // Inheritance
	 
	// Click
	if(conf.event === 'click'){
		conf.closeButton = true;
		$(conf.trigger).css('cursor', 'pointer')
			.bind('click',function(event){
				// Clear helpers
				that.show(event, conf);								
			});
	// Hover
	}else{
		$(conf.trigger).css('cursor', 'default')
			.bind('mouseover', function(event){
				// Clear helpers						
				that.show(event, conf);
			})
			.bind('mouseout', function(event){
				that.hide(event, conf);
			});
	};
	
	return { show: function(event){ that.show(event, conf) }, hide: function(event){ that.hide(event, conf) }};		
};