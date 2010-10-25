/**
 *	Tooltip
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.Tooltip = function(element){
	var that = ui.Floats(); // Inheritance
	var conf = {
		name:'tooltip',
		content:{
			type:'param',
			data: element.title
		}
	};
			
	$(element).css('cursor', 'default')
		.bind('mouseover', function(event){
			// Clear helpers						
			that.show(event, conf);
		})
		.bind('mouseout', function(event){
			that.hide(event, conf);
		});
		
	return { show: function(event){ that.show(event, conf) }, hide: function(event){ that.hide(event, conf) }};
};