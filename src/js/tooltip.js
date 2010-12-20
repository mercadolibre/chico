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
	conf.cone = true;
	conf.content = conf.element.title;	
	conf.visible = false;   	
   	conf.position = {
   		context: $(conf.element),
        offset: "0 10",
		points: "lt lb"
    }
	conf.publish = that.publish;

    var show = function(event) {
        $(conf.element).attr('title', ''); // IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
		that.show(event, conf);
        
        // return publish object
        return conf.publish;  
    }
	
    var hide = function(event) {
		$(conf.element).attr('title', conf.content);
		that.hide(event, conf);

        // return publish object
        return conf.publish;
    }
    
    var position = function(event){
		ui.positioner(conf.position);
		
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
        conf.publish.content = conf.content,
        conf.publish.show = function(event){ return show(event, conf) },
        conf.publish.hide = function(event){ return hide(event, conf) },
        conf.publish.position = function(event){return position(event) }
        
	return that.publish;
};
