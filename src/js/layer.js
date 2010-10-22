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
		$(conf.trigger).css('cursor', 'pointer')
			.bind('click',function(event){
				that.show(event, conf);
				that.createClose(conf);					
			});
	// Hover
	/*}else{
		$(t).css('cursor', 'default')
			.bind('mouseover', setShowTimer)
			.bind('mouseout', setHideTimer);*/
	};		
};