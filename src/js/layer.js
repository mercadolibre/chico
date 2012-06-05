/**
* Layer lets you show a contextual floated data.
* @name Layer
* @class Layer
* @augments ch.Floats
* @standalone
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.content] Sets content by: static content, DOM selector or URL. By default, the content is empty.
* @param {Number|String} [conf.width] Sets width property of the component's layout. By default, the width is "500px".
* @param {Number|String} [conf.height] Sets height property of the component's layout. By default, the height is elastic.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
* @param {String} [conf.event] Sets the event ("click" or "hover") that trigger show method. By default, the event is "hover".
* @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or centered by default: "cm cm".
* @param {String} [conf.offset] Sets the offset in pixels that component will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {Boolean} [conf.cache] Enable or disable the content cache. By default, the cache is enable.
* @param {String} [conf.closable] Sets the way (true, "button" or false) the Layer close when conf.event is set as "click". By default, the layer close true.
* @returns itself
* @factorized
* @see ch.Floats
* @see ch.Tooltip
* @see ch.Modal
* @see ch.Zoom
* @exampleDescription To create a ch.Layer you have to give a selector.
* @example
* var widget = $(".some-element").layer("<tag>Some content.</tag>");
* @exampleDescription ch.Layer component can receive a parameter. It is a literal object { }, with the properties you want to configurate. 
* @example
* var conf = {
*     "width": 200,
*     "height": 50
* };
* @exampleDescription Create a layer with configuration.
* @example
* var widget = $(".some-element").layer({
*     "content": "Some content here!",
*     "width": "200px",
*     "height": 50,
*     "event": "click",
*     "closable": "button",
*     "offset": "10 -10",
*     "cache": false,
*     "points": "lt rt"
* });
* @exampleDescription Now <code>widget</code> is a reference to the layer instance controller. You can set a new content by using <code>widget</code> like this:
* @example
* widget.content("http://content.com/new/content");
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
	conf.classes = conf.classes || "ch-box";

	// Closable configuration
	conf.closeButton = ch.utils.hasOwn(conf, "closeButton") ? conf.closeButton : (conf.event === "click");
	conf.closable = ch.utils.hasOwn(conf, "closable") ? conf.closable : true;
	
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
	* Delay time to hide component's contents.
	* @private
	* @name ch.Layer#hideTime
	* @type number
	* @default 400
	*/
	var hideTime = 400,

	/**
	* Hide timer instance.
	* @private
	* @name ch.Layer#ht
	* @type timer
	*/
		ht,

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
				
				if (relatedTarget === null || target === relatedTarget || relatedTarget === undefined || relatedTarget.parentNode === null || target.nodeName === "SELECT") {
					return;
				}
			}

			ht = setTimeout(function () { that.innerHide() }, hideTime);
		},

	/**
	* Clear all timers.
	* @private
	* @function
	* @name ch.Layer#clearTimers
	*/
		clearTimers = function () { clearTimeout(ht); };

/**
*	Protected Members
*/

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
			if (e !== that["public"] && e.closable() === true) {
				e.hide();
			}
		});
		
		// conf.position.context = that.$element;
		that.parent.innerShow(event);

		if (conf.event !== "click") {
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
		that.$container.unbind("mouseleave", hideTimer);
		
		that.parent.innerHide(event);
	}

/**
*	Public Members
*/
	
	/**
	* @borrows ch.Object#on as ch.Layer#on
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

	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Layer#ready
	* @event
	* @public
	* @since 0.8.0
	* @exampleDescription Following the first example, using <code>widget</code> as layer's instance controller:
	* @example 	
	* widget.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;

};

ch.factory("layer");