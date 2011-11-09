/**
* Shows messages on the screen with a contextual floated UI-Component.
* @name Helper
* @class Helper
* @augments ch.Floats
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
* @returns itself
* @see ch.Tooltip
* @see ch.Modal
* @see ch.Zoom
*/

ch.helper = function(conf){
	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Helper#that
	* @type object
	*/
	var that = this,

		conf = {};
		
	conf.cone = true;
	conf.cache = false;
	
	conf.aria = {};
	conf.aria.role = "alert";

	conf.position = {};
	conf.position.context = that.$element;
	conf.position.offset = "15 0";
	conf.position.points = "lt rt";

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.floats.call(that);
	that.parent = ch.clon(that);

/**
*  Private Members
*/


/**
*  Protected Members
*/

	that.content("<p class=\"ch-message error\">Error.</p>");

	/**
	* Inner show method. Attach the component layout to the DOM tree.
	* @protected
	* @function
	* @name ch.Helper#innerShow
	* @returns itself
	*/
	that.innerShow = function () {

		if (!that.active) {
			// Load content and show!
			that.parent.innerShow();
		}

		return that;
	};

/**
*  Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Helper#uid
	* @type number
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Helper#element
	* @type HTMLElement
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Helper#type
	* @type string
	*/

	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @function
	* @name ch.Helper#content
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
	that["public"].content = function (message) {

		if (message) {
			that.content("<p class=\"ch-message error\">" + message + "</p>");
		} else {
			return that.content();
		}

		return that["public"];
	};

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @function
	* @name ch.Helper#isActive
	* @returns boolean
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @function
	* @name ch.Helper#show
	* @returns itself
	* @see ch.Floats#show
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @function
	* @name ch.Helper#hide
	* @returns itself
	* @see ch.Floats#hide
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/

	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @function
	* @name ch.Helper#width
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
	* @function
	* @name ch.Helper#height
	* @returns itself
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
	* @function
	* @name ch.Helper#position
	* @example
	* // Change component's position.
	* me.position({ 
	*	offset: "0 10",
	*	points: "lt lb"
	* });
	* @see ch.Object#position
	*/

/**
*  Default event delegation
*/

	ch.utils.body.bind(ch.events.LAYOUT.CHANGE, function () { that.position("refresh"); });

	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Helper#ready
	* @event
	* @public
	* @since 0.8.0
	* @example
	* // Following the first example, using 'me' as helper's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);
	
	return that;
};

ch.factory("helper");
