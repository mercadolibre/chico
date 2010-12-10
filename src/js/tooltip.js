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
   	conf.publish = that.publish;


    var show = function(event) {
        $(conf.element).attr('title', ''); // IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
		that.show(event, conf);
        
        // return publish object
        return conf.publish;  
    }
	
    var hide = function(event) {
		$(conf.element).attr('title', conf.content.data);
		that.hide(event, conf);

        // return publish object
        return conf.publish;
    }
            	
	conf.$trigger = $(conf.element)
		.css('cursor', 'default')
		.bind('mouseenter', show)
		.bind('mouseleave', hide);
    
    // create the publish object to be returned

        conf.publish.uid = conf.id,
        conf.publish.element = conf.element,
        conf.publish.type = "ui.tooltip",
        conf.publish.content = conf.content.data,
        conf.publish.show = function(event){ return show(event, conf) },
        conf.publish.hide = function(event){ return hide(event, conf) }
        
	return that.publish;
};
