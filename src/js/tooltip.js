/**
 *	Tooltip
 *	@author 
 *	@Contructor
 *	@return An interface object
 *  @memberOf ui.Floats
 */	
ui.Tooltip = function(element){
	var that = ui.Floats(); // Inheritance
	// Global configuration	
	var conf = {
		trigger: element,
		name: 'tooltip',
		content: {
			type: 'param',
			data: element.title
		},
		align: 'drop',
		cone: true		
	};
			
	$(element).css('cursor', 'default')
		.bind('mouseover', function(event){
			$(this).removeAttr('title', '');
			that.show(event, conf);
		})
		.bind('mouseout', function(event){
			$(this).attr('title', conf.content.data);
			that.hide(event, conf);
		});
		
	return { show: function(event){ that.show(event, conf) }, hide: function(event){ that.hide(event, conf) }};
};