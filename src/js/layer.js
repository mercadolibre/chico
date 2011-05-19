
/**
 * Is a contextual floated UI-Object.
 * @name Layer
 * @class Layer
 * @augments ch.Floats
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 * @see ch.Tooltip
 * @see ch.Modal
 * @example
 * // Create a simple contextual layer
 * $("element").layer("<p>Content.</p>");
 */ 

ch.layer = function(conf) {
    
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Layer
     */ 
	var that = this;
	
	conf = ch.clon(conf);
	conf.cone = true;
	conf.classes = "box";
	conf.position = {};
	conf.position.context = that.$element;
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";

	that.conf = conf;

/**
 *	Inheritance
 *		
 */

    that = ch.floats.call(that);
    that.parent = ch.clon(that);
    
/**
 *  Private Members
 */
 
    /**
     * Delay time to show component's contents.
     * @private
     * @name showTime
     * @type {Number}
     * @default 400
     * @memberOf ch.Layer
     */ 
    var showTime = conf.showTime || 400;
    /**
     * Delay time to hide component's contents.
     * @private
     * @name hideTime
     * @type {Number}
     * @default 400
     * @memberOf ch.Layer
     */ 
    var hideTime = conf.hideTime || 400;

    /**
     * Show timer instance.
     * @private
     * @name st
     * @type {Timer}
     * @memberOf ch.Layer
     */ 
	var st;
	/**
     * Hide timer instance.
     * @private
     * @name ht
     * @type {Timer}
     * @memberOf ch.Layer
     */ 
	var ht;
    /**
     * Starts show timer.
     * @private
     * @name showTimer
     * @function
     * @memberOf ch.Layer
     */ 
	var showTimer = function(){ st = setTimeout(that.show, showTime) };
    /**
     * Starts hide timer.
     * @private
     * @name hideTimer
     * @function
     * @memberOf ch.Layer
     */ 
	var hideTimer = function(){ ht = setTimeout(that.hide, hideTime) };
    /**
     * Clear all timers.
     * @private
     * @name clearTimers
     * @function
     * @memberOf ch.Layer
     */ 
	var clearTimers = function(){ clearTimeout(st); clearTimeout(ht); };

/**
 *  Protected Members
 */
	
	that.$trigger = that.$element;
	
	that.show = function(event) {
	
		// Reset all layers
		$.each(ch.instances.layer, function(i, e){ e.hide(); });
		//conf.position.context = that.$element;
		that.parent.show(event);

		that.$container.bind('click', function(event){ event.stopPropagation() });
        
        // Click
        if (conf.event == "click") {
			conf.close = true;
            // Document events
            $(document).one('click', that.hide);
            
        // Hover
        } else {      	
        	clearTimers();    
        	that.$container
        		.one("mouseenter", clearTimers)
        		.one("mouseleave", function(event){
					var target = event.srcElement || event.target;
					var relatedTarget = event.relatedTarget || event.toElement;
					var relatedParent = relatedTarget.parentNode;
					if ( target === relatedTarget || relatedParent === null || target.nodeName === "SELECT" ) return;
					hideTimer();
        		});
        };
        
        return that;
    };

/**
 *  Public Members
 */
 
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Layer
     */
   	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Layer
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Layer
     */
	that["public"].type = that.type;
    /**
     * The component's content.
     * @public
     * @name content
     * @type {String}
     * @memberOf ch.Layer
     */
	that["public"].content = that.content;
    /**
     * Shows component's content.
     * @public
     * @name show
     * @function
     * @return {Chico-UI Object}
     * @memberOf ch.Layer
     */
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};
    /**
     * Hides component's content.
     * @public
     * @name hide
     * @function
     * @return {Chico-UI Object}
     * @memberOf ch.Layer
     */	
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Layer
     * @example
     * // Change layer's position.
     * $('input').layer("content").position({ 
     *    offset: "0 10",
     *    points: "lt lb"
     * });
     */
	that["public"].position = that.position;
	
/**
 *  Default event delegation
 */
	// Click
	if(conf.event === 'click') {
		// Local configuration
		conf.closeButton = true;

		// Trigger events
		that.$trigger
			.css('cursor', 'pointer')
			.bind('click', that.show);

	// Hover
	} else {
		// Trigger events
		that.$trigger
			.css('cursor', 'default')
			.bind('mouseenter', that.show)
			.bind('mouseleave', hideTimer);
	};

    // Fix: change layout problem
    $("body").bind(ch.events.CHANGE_LAYOUT, function(){ that.position("refresh") });
 

	return that;

};
