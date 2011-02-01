/**
 *	Tooltip
 *	@author 
 *	@Contructor
 *	@return An interface object
 *  @memberOf ui.Floats
 */

ui.tooltip = function(conf) {
    
/**
 *  Constructor
 */
	conf.cone = true;
	conf.content = conf.element.title;	
	conf.visible = false;
	conf.position = {};
	conf.position.context = $(conf.element);
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";
	
/**
 *  Inheritance
 */
 
	var that = ui.floats(conf); // Inheritance

/**
 *  Private Members
 */
 
    var show = function(event) {
        $(conf.element).attr('title', ''); // IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
		that.show(event, conf);
	}
	
    var hide = function(event) {
		$(conf.element).attr('title', conf.content);
		that.hide(event, conf);
    }
    
/**
 *  Protected Members
 */ 
 
/**
 *  Default event delegation
 */	
 	
	conf.$trigger = $(conf.element)
		.css('cursor', 'default')
		.bind('mouseenter', show)
		.bind('mouseleave', hide);

    // Fix: change layout problem
    $("body").bind(ui.events.CHANGE_LAYOUT, function(){ that.position("refresh", conf) });
    
/**
 *  Expose propierties and methods
 */	
	that.publish = {
	
	/**
	 *  @ Public Properties
	 */
    	uid: conf.id,
		element: conf.element,
		type: "tooltip",
		content: conf.content,
	/**
	 *  @ Public Methods
	 */
		show: function() { 
			show();
			return that.publish; // Returns publish object
		},
		hide: function() { 
			hide();
			return that.publish; // Returns publish object
		},
		position: function(o) { 
			return that.position(o,conf) || that.publish;
		}
	}

	return that.publish;
};
