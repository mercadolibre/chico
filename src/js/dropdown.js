/**
 *	Dropdown
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.Dropdown = function(conf){
	var that = ui.Navigators(); // Inheritance

	// Global configuration
	var $trigger = $(conf.element).children(':first');
	var conf = {
		name: 'dropdown',
		$trigger: $trigger,
		$htmlContent: $trigger.next()
	};

	// Events
	// Trigger
	conf.$trigger
		.bind('click', function(event){
			if(that.status){ that.hide(event, conf); return; };
			that.show(event, conf);
		})
		.css('cursor','pointer')
		.addClass('uiTrigger')
		.append('<span class="ico down">&raquo;</span>');
	
	// Content
	conf.$htmlContent.addClass('uiContent');

	return { show: function(event){ that.show(event, conf) }, hide: function(event){ that.hide(event, conf) }};
};