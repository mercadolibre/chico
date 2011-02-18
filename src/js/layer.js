/**
 *	Context Layer
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.layer = function(conf) {

    
/**
 *  Constructor
 */
	// Global configuration
	conf.$trigger = $(conf.element);
	conf.cone = true;
	conf.classes = "box";
	conf.visible = false;
	conf.position = {};
	conf.position.context = conf.$trigger;
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";


/**
 *  Inheritance
 */
	var that = ui.floats(conf);
    
/**
 *  Private Members
 */
    var showTime = conf.showTime || 400;
    var hideTime = conf.hideTime || 400;

	var st, ht; // showTimer and hideTimer
	var showTimer = function(event){ st = setTimeout(function(event){ show() }, showTime) };
	var hideTimer = function(event){ ht = setTimeout(function(event){ hide() }, hideTime) };
	var clearTimers = function(){ clearTimeout(st); clearTimeout(ht); };

    var show = function(event) {
	
		// Reset all layers
		$.each(ui.instances.layer, function(i, e){ e.hide() });
		
		that.show(event, conf);
		
		conf.$container.bind('click', function(event){ event.stopPropagation() });
        
        // Click
        if ( conf.event === "click" ) {	
            // Document events
            $(document).one('click', function(event) {
                that.hide(event, conf);
            });
            
        // Hover
        } else {      	
        	clearTimers();    
        	conf.$container
        		.one("mouseenter", clearTimers)
        		.bind("mouseleave", function(event){
					var target = event.srcElement || event.target;
					var relatedTarget = event.relatedTarget || event.toElement;
					var relatedParent = relatedTarget.parentNode;
					if ( target === relatedTarget || relatedParent === null || target.nodeName === "SELECT" ) return;
					hideTimer();
        		});
        };	
    };

    var hide = function(event) {
        that.hide(event, conf);
    }

/**
 *  Protected Members
 */

/**
 *  Default event delegation
 */
	// Click
	if(conf.event === 'click') {
		// Local configuration
		conf.closeButton = true;

		// Trigger events
		conf.$trigger
			.css('cursor', 'pointer')
			.bind('click', show);

	// Hover
	} else {
		// Trigger events
		conf.$trigger
			.css('cursor', 'default')
			.bind('mouseenter', show)
			.bind('mouseleave', hideTimer);
	};

    // Fix: change layout problem
    $("body").bind(ui.events.CHANGE_LAYOUT, function(){ that.position("refresh", conf) });

/**
 *  Expose propierties and methods
 */	
	that.publish = {

	/**
	 *  @ Public Properties
	 */
    	uid: conf.uid,
		element: conf.element,
		type: conf.type,
		content: (conf.content) ? conf.content : conf.ajax,
	/**
	 *  @ Public Methods
	 */
		show: function(){ 
			show();
			return that.publish; // Returns publish object
		},
		hide: function(){ 
			//hideTimer();
			hide();
			return that.publish; // Returns publish object
		},
		position: function(o){ 
			return that.position(o,conf) || that.publish;
		}
	}	 

	return that.publish;

};
