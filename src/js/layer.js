/**
* Is a contextual floated UI-Object.
* @name Layer
* @class Layer
* @augments ch.Floats
* @standalone
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.content] Sets content by: static content, DOM selector or URL. By default, the content is empty.
* @param {Number || String} [conf.width] Sets width property of the component's layout. By default, the width is "500px".
* @param {Number || String} [conf.height] Sets height property of the component's layout. By default, the height is elastic.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
* @param {String} [conf.event] Sets the event ("click" or "hover") that trigger show method. By default, the event is "hover".
* @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or centered by default: "cm cm".
* @param {String} [conf.offset] Sets the offset in pixels that component will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {Number} [conf.showTime] Sets a delay time to show component's contents. By default, the value is 400ms.
* @param {Number} [conf.hideTime] Sets a delay time to hide component's contents. By default, the value is 400ms.
* @param {Boolean} [conf.cache] Enable or disable the content cache. By default, the cache is enable.
* @param {String} [conf.closeHandler] Sets the way ("any" or "button") the Layer close when conf.event is set as "click". By default, the layer close "any".
* @returns itself
* @see ch.Tooltip
* @see ch.Modal
* @see ch.Zoom
* @example
* // Create a new contextual layer with configuration.
* var me = $(".some-element").layer({
*     "content": "Some content here!",
*     "width": "200px",
*     "height": 50,
*     "event": "click",
*     "showTime": 600,
*     "hideTime": 200,
*     "offset": "10 -10",
*     "cache": false,
*     "points": "lt rt"
* });
* @example
* // Create a simple contextual layer
* var me = $(".some-element").layer("<tag>Some content.</tag>");
* @example
* // Now 'me' is a reference to the layer instance controller.
* // You can set a new content by using 'me' like this: 
* me.content("http://content.com/new/content");
*/

ch.layer = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Layer#that
	* @type object
	*/
	var that = this;
	conf = ch.clon(conf);
	
	conf.cone = true;
	conf.closeButton = conf.event === "click";
	conf.classes = "box";
	conf.closeHandler = conf.closeHandler || "any";
	
	conf.aria = {};
	conf.aria.role = "tooltip";
	conf.aria.identifier = "aria-describedby";
	
	conf.position = {};
	conf.position.context = that.$element;
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";

	that.conf = conf;


/**
*	Inheritance
*/

	that = ch.floats.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/

	/**
	* Delay time to show component's contents.
	* @private
	* @name ch.Layer#showTime
	* @type number
	* @default 400
	*/
	var showTime = conf.showTime || 400,

	/**
	* Delay time to hide component's contents.
	* @private
	* @name ch.Layer#hideTime
	* @type number
	* @default 400
	*/
		hideTime = conf.hideTime || 400,

	/**
	* Show timer instance.
	* @private
	* @name ch.Layer#st
	* @type timer
	*/
		st,

	/**
	* Hide timer instance.
	* @private
	* @name ch.Layer#ht
	* @type timer
	*/
		ht,

	/**
	* Starts show timer.
	* @private
	* @function
	* @name ch.Layer#showTimer
	*/
		showTimer = function () { st = setTimeout(that.innerShow, showTime); },

	/**
	* Starts hide timer.
	* @private
	* @function
	* @name ch.Layer#hideTimer
	*/
		hideTimer = function (event) {
			if (conf.event !== "click") {
				var target = event.srcElement || event.target;
				
				var relatedTarget = event.relatedTarget || event.toElement;
				
				if (target === relatedTarget || relatedTarget === undefined || relatedTarget.parentNode === null || target.nodeName === "SELECT") { return; }
			}

			ht = setTimeout(that.innerHide, hideTime);
		},

	/**
	* Clear all timers.
	* @private
	* @function
	* @name ch.Layer#clearTimers
	*/
		clearTimers = function () { clearTimeout(st); clearTimeout(ht); },

	/**
	* Stop event bubble propagation to avoid hiding the layer by click on his own layout.
	* @private
	* @function
	* @name ch.Layer#stopBubble
	*/
		stopBubble = function (event) { event.stopPropagation(); };

	/**
	* Stop event bubble propagation to avoid hiding the layer by click on his own layout.
	* @private
	* @name ch.Layer#stopBubble
	* @function
	*/
/*	stopBubble = function (event) {
		var target = event.srcElement || event.target;
		var relatedTarget = event.relatedTarget || event.toElement;
		if (target === relatedTarget || relatedTarget === undefined || relatedTarget.parentNode === null || target.nodeName === "SELECT") { return; };
		hideTimer();
	};*/

/**
*	Protected Members
*/

	/**
	* It sets the hablity of auto close the component or indicate who closes the component.
	* @protected
	* @function
	* @name ch.Layer#closeHandler
	* @returns itself
	*/
	that.closeHandler = conf.closeHandler;

	/**
	* Inner show method. Attach the component layout to the DOM tree.
	* @protected
	* @function
	* @name ch.Layer#innerShow
	* @returns itself
	*/
	that.innerShow = function (event) {
		// Reset all layers, except me and not auto closable layers
		$.each(ch.instances.layer, function (i, e) {
			if (e !== that["public"] && e.closable()==="any") {
				e.hide();
			}
		});
		
		// conf.position.context = that.$element;
		that.parent.innerShow(event);

		// Click in the button
		if (conf.event === "click" && conf.close === "button") {
			// Document events
			that.$container.find(".close").one("click", that.innerHide);
		// Click anywhere
		} else if (conf.event === "click") {
			// Document events
			ch.utils.document.one("click", that.innerHide);
			that.$container.bind("click", stopBubble);
		// Hover
		} else { 		
			clearTimers();
			that.$container.one("mouseenter", clearTimers).bind("mouseleave", hideTimer);
		}

		return that;
	};

	/**
	* Inner hide method. Hides the component and detach it from DOM tree.
	* @protected
	* @function
	* @name ch.Layer#innerHide
	* @returns itself
	*/
	that.innerHide = function (event) {
		that.$container.unbind("click", stopBubble).unbind("mouseleave", hideTimer);
		
		that.parent.innerHide(event);
	}

/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Layer#uid
	* @type number
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Layer#element
	* @type HTMLElement
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Layer#type
	* @type string
	*/

	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @name ch.Layer#content
	* @function
	* @param {string} content Static content, DOM selector or URL. If argument is empty then will return the content.
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
	* Returns any if the component closes automatic. 
	* @public
	* @name ch.Layer#closable
	* @function
	* @returns boolean
	*/
	that["public"].closable = function (content) {
		if (content === true && content !== undefined) { 
			that.closeHandler = "any"; 
		} else if(content !== undefined) { 
			that.closeHandler = content; 
		}
		return that.closeHandler;
	};

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @name ch.Layer#isActive
	* @function
	* @returns boolean
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Layer#show
	* @function
	* @returns itself
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
	* @returns itself
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
	* @returns itself
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
	* @returns itself
	* @see ch.Floats#size
	* @example
	* // to set the height
	* me.height(300);
	* @example
	* // to get the height
	* me.height // 300
	*/

	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @name ch.Layer#position
	* @function
	* @example
	* // Change component's position.
	* me.position({
	*	offset: "0 10",
	*	points: "lt lb"
	* });
	* @see ch.Object#position
	*/

/**
*	Default event delegation
*/

	// Click
	if (conf.event === "click") {
		that.$element
			.css("cursor", "pointer")
			.bind("click", that.innerShow);

	// Hover
	} else {
		that.$element
			.css("cursor", "default")
			.bind("mouseenter", that.innerShow)
			.bind("mouseleave", hideTimer);
	}

	// Fix: change layout problem
	ch.utils.body.bind(ch.events.LAYOUT.CHANGE, function () { that.position("refresh"); });

	/**
	* Triggers when component is visible.
	* @name ch.Layer#show
	* @event
	* @public
	* @example
	* me.on("show",function () {
	*	this.content("Some new content");
	* });
	* @see ch.Floats#event:show
	*/

	/**
	* Triggers when component is not longer visible.
	* @name ch.Layer#hide
	* @event
	* @public
	* @example
	* me.on("hide",function () {
	*	otherComponent.show();
	* });
	* @see ch.Floats#event:hide
	*/

	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Layer#ready
	* @event
	* @public
	* @since 0.8.0
	* @example
	* // Following the first example, using 'me' as layer's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;

};

ch.factory("layer");