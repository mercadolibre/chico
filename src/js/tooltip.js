/**
 *	Tooltip
 *	@author 
 *	@Contructor
 *	@return An interface object
 *  @memberOf ui.Floats
 */

ui.tooltip = function(conf){
	var that = ui.floats(); // Inheritance

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
        
        return conf.publish; // Returns publish object
    }
	
    var hide = function(event) {
		$(conf.element).attr('title', conf.content);
		that.hide(event, conf);
        return conf.publish; // Returns publish object
    }
    
    var position = function(event){
		ui.positioner(conf.position);
		return conf.publish; // Returns publish object
	}
            	
	conf.$trigger = $(conf.element)
		.css('cursor', 'default')
		.bind('mouseenter', show)
		.bind('mouseleave', hide);
    
    // Create the publish object to be returned
    conf.publish.uid = conf.id;
    conf.publish.element = conf.element;
    conf.publish.type = "tooltip";
    conf.publish.content = conf.content;
    conf.publish.show = function(){ return show($.Event()) };
    conf.publish.hide = function(){ return hide($.Event()) };
    conf.publish.position = function(o){ return that.position(o, conf) };

    // Fix: change layout problem
    ui.utils.body.bind(ui.events.CHANGE_LAYOUT, function(){ that.position("refresh", conf) });

	return that.publish;
};
