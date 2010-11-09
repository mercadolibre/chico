/**
 *	Tooltip
 *	@author 
 *	@Contructor
 *	@return An interface object
 *  @memberOf ui.Floats
 */

ui.Tooltip = function(conf){
	var that = ui.Floats(); // Inheritance

	// Global configuration
	var conf = {
		$trigger: $(conf.element),
		name: 'tooltip',
		content: {
			type: 'param',
			data: conf.element.title
		},
		align: 'drop',
		cone: true
	};

	conf.$trigger
		.css('cursor', 'default')
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