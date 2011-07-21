
/**
 * Is a contextual floated UI-Object.
 * @name Layer
 * @class Layer
 * @augments ch.Floats
 * @memberOf ch
 * @param {Object} conf Object with configuration properties
 * @returns {itself}
 * @see ch.Tooltip
 * @see ch.Modal
 * @example
 * // Create a simple contextual layer
 * var me = $(".some-element").layer("<p>Some content.</p>");
 * @example
 * // Now 'me' is a reference to the layer instance controller.
 * // You can set a new content by using 'me' like this: 
 * me.content("http://content.com/new/content");
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
	conf.closeButton = 	(conf.event === 'click') ? true : false;
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
	var showTimer = function(){ st = setTimeout(that.innerShow, showTime) };
    /**
     * Starts hide timer.
     * @private
     * @name hideTimer
     * @function
     * @memberOf ch.Layer
     */ 
	var hideTimer = function(){ ht = setTimeout(that.innerHide, hideTime) };
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

	/**
	* Inner show method. Attach the component layout to the DOM tree.
	* @protected
	* @name ch.Layer#innerShow
	* @function
	* @returns {itself}
	*/ 
	that.innerShow = function(event) {
	
		// Reset all layers
		$.each(ch.instances.layer, function(i, e){ e.hide(); });
		//conf.position.context = that.$element;
		that.parent.innerShow(event);

		that.$container.bind('click', function(event){ event.stopPropagation() });
        
        // Click
        if (conf.event == "click") {
			conf.close = true;
            // Document events
            $(document).one('click', that.innerHide);
            
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
     * The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
     * @public
     * @name ch.Layer#uid
     * @type {Number}
     */

    /**
     * Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
     * @public
     * @name ch.Layer#element
     * @type {HTMLElement}
     */

    /**
     * This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
     * @public
     * @name ch.Layer#type
     * @type {String}
     */

    /**
    * Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
    * @public
    * @name ch.Layer#content
    * @function
    * @param {String} content Static content, DOM selector or URL. If argument is empty then will return the content.
    * @example
    * // Get the defined content
    * me.content();
    * @example
    * // Set static content
    * me.content("Some static content");
    * @example
    * // Set DOM content
    * me.content("#hiddenContent");
    * @example
    * // Set AJAX content
	* me.content("http://chico.com/some/content.html");
	* @see ch.Object#content
    */

    /**
    * Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
    * @name ch.Layer#isActive
    * @function 
    * @returns {Boolean}
    */

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Layer#show
	* @function
	* @returns {itself}
	* @see ch.Floats#show
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Layer#hide
	* @function
	* @returns {itself}
	* @see ch.Floats#hide
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/
	
	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @name ch.Layer#width
	* @function
	* @returns {itself}
	* @see ch.Floats#size
	* @example
	* // to set the width
	* me.width(700);
	* @example
	* // to get the width
	* me.width // 700
	*/
	
	/**
	* Sets or gets the height property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '100' or '100px'.
	* @public
	* @name ch.Layer#height
	* @function
	* @returns {itself}
	* @see ch.Floats#size
	* @example
	* // to set the heigth
	* me.height(300);
	* @example
	* // to get the heigth
	* me.height // 300
	*/
	
    /**
     * Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
     * @public
     * @name ch.Layer#position
     * @example
     * // Change component's position.
     * me.position({ 
     *    offset: "0 10",
     *    points: "lt lb"
     * });
     * @see ch.Object#position
     */
	
/**
 *  Default event delegation
 */

	// Click
	if(conf.event === 'click') {

		// Trigger events
		that.$trigger
			.css('cursor', 'pointer')
			.bind('click', that.innerShow);

	// Hover
	} else {
	
		// Trigger events
		that.$trigger
			.css('cursor', 'default')
			.bind('mouseenter', that.innerShow)
			.bind('mouseleave', hideTimer);
	};

    // Fix: change layout problem
    $("body").bind(ch.events.LAYOUT.CHANGE, function(){ that.position("refresh") });
 
	/**
	* Triggers when component is visible.
	* @name ch.Layer#show
	* @event
    * @public
	* @example
	* me.on("show",function(){
	*    this.content("Some new content");
	* });
	* @see ch.Floats#event:show
	*/

	/**
	* Triggers when component is not longer visible.
	* @name ch.Layer#hide
	* @event
    * @public
	* @example
	* me.on("hide",function(){
	*    otherComponent.show();
	* });
	* @see ch.Floats#event:hide
	*/
		
	/**
	* Triggers when the component is ready to use.
	* @name ch.Layer#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as Layer's instance controller:
	* me.on("ready",function(){
	*    this.show();
	* });
	*/
	that.trigger("ready");


	return that;

};
