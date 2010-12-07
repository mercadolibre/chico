/**
 *	Tooltip
 *	@author 
 *	@Contructor
 *	@return An interface object
 *  @memberOf ui.Floats
 */

ui.tooltip = function(conf){
	var that = ui.floats(); // Inheritance

	conf.name = 'tooltip';
	conf.align = 'down';
	conf.cone = true;
	conf.content = {
		type: 'param',
		data: conf.element.title
	};	
	conf.wrappeable = true;
	conf.visible = false;
		
	conf.$trigger = $(conf.element)
		.css('cursor', 'default')
		.bind('mouseenter', function(event){
			$(this).attr('title', ''); // IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
			that.show(event, conf);
		})
		.bind('mouseleave', function(event){
			$(this).attr('title', conf.content.data);
			that.hide(event, conf);
		});
    
    // create the publish object to be returned

    that.publish = {
        uid: conf.id,
        element: conf.element,
        type: "ui.layer",
        content: conf.content.data,
        show: function(event){ show(event, conf) },
        hide: function(event){ hide(event, conf) }
    }

	return that.publish;
};
