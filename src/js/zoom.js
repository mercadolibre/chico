/**
* Zoom is a standalone UI component that shows a contextual reference to an augmented version of main declared image.
* @name Zoom
* @class Zoom
* @augments ch.Floats
* @requires ch.onImagesLoads
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
* @param {Boolean} [conf.context] Sets a reference to position and size of component that will be considered to carry out the position. By default is the viewport.
* @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or centered by default: "cm cm".
* @param {String} [conf.offset] Sets the offset in pixels that component will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {Boolean} [conf.cache] Enable or disable the content cache. By default, the cache is enable.
* @returns itself
* @see ch.Modal
* @see ch.Tooltip
* @see ch.Layer
*/

ch.zoom = function (conf) {
	/**
	* Reference to an internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Zoom#that
	* @type itself
	*/
	var that = this;

/**
*	Constructor
*/
	conf = ch.clon(conf);
	conf.fx = false;

	conf.aria = {};
	conf.aria.role = "tooltip";
	conf.aria.identifier = "aria-describedby";

	conf.position = {};
	conf.position.context = conf.context || that.$element;
	conf.position.offset = conf.offset || "20 0";
	conf.position.points = conf.points || "lt rt";
	conf.position.hold = true;

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
	* Reference to main image declared on HTML code snippet.
	* @private
	* @name ch.Zoom#original
	* @type object
	*/
	var original = {};
		original.img = that.$element.children();
		original["width"] = original.img.prop("width");
		original["height"] = original.img.prop("height");

	/**
	* Reference to the augmented version of image, that will be displayed in context.
	* @private
	* @name ch.Zoom#zoomed
	* @type object
	*/
	var zoomed = {};
		// Define the content source 
		zoomed.img = that.source = $("<img src=\"" + that.element.href + "\" alt=\"Zoomed image\">");

	/**
	* Seeker is the visual element that follows mouse movement for referencing to zoomable area into original image.
	* @private
	* @name ch.Zoom#seeker
	* @type object
	*/
	var seeker = {};
		seeker.shape = $("<div class=\"ch-seeker ch-hide\">");

	/**
	* Gets the mouse position relative to original image position, and accordingly moves the zoomed image.
	* @private
	* @function
	* @name ch.Zoom#move
	* @param event event
	*/
	var move = function (event) {

		// Cursor coordinates relatives to original image
		var x = event.pageX - original.offset.left;
		var y = event.pageY - original.offset.top;

		// Seeker axis
		var limit = {};
			limit.left = parseInt(x - seeker["width"]);
			limit.right = parseInt(x + seeker["width"]);
			limit.top = parseInt(y - seeker["height"]);
			limit.bottom = parseInt(y + seeker["height"]);

		// Horizontal: keep seeker into limits
		if (limit.left >= 0 && limit.right < original["width"] - 1) {
			zoomed.img.css("left", -((parseInt(zoomed["width"]* x) / original["width"]) - (conf.width / 2)));
			seeker.shape.css("left", limit.left);
		}

		// Vertical: keep seeker into limits
		if (limit.top >= 0 && limit.bottom < original["height"] - 1) {
			zoomed.img.css("top", -((parseInt(zoomed["height"]* y) / original["height"]) - (conf.height / 2)));
			seeker.shape.css("top", limit.top);
		}

	};

	/**
	* Calculates zoomed image sizes and adds event listeners to trigger of float element
	* @private
	* @function
	* @name ch.Zoom#init
	*/
	var init = function () {
		// Zoomed image size
		zoomed["width"] = zoomed.img.prop("width");
		zoomed["height"] = zoomed.img.prop("height");

		// Anchor
		that.$element
			// Apend Seeker
			.append(seeker.shape)

			// Show
			.bind("mouseenter", that.show)

			// Hide
			.bind("mouseleave", that.hide)
	};

/**
*	Protected Members
*/

	that.innerShow = function () {
		// Recalc offset of original image
		original.offset = original.img.offset();

		// Move
		that.$element.bind("mousemove", function (event) {
			move(event);
		});

		// Seeker
		seeker.shape.removeClass("ch-hide");

		// Floats show
		that.parent.innerShow();

		return that;
	};

	that.innerHide = function () {
		// Move
		that.$element.unbind("mousemove");

		// Seeker
		seeker.shape.addClass("ch-hide");

		// Floats hide
		that.parent.innerHide();

		return that;
	};

	/**
	* Triggered on anchor click, it prevents redirection to zoomed image file.
	* @protected
	* @function
	* @name ch.Zoom#enlarge
	* @param {mouseEvent} event
	* @returns itself
	*/
	that.enlarge = function (event) {
		that.prevent(event);
		// Do what you want...
		return that;
	};

	/**
	* Getter and setter for size attributes of float that contains the zoomed image.
	* @protected
	* @function
	* @name ch.Zoom#size
	* @param {string} prop Property that will be setted or getted, like "width" or "height".
	* @param {string} [data] Only for setter. It's the new value of defined property.
	* @returns itself
	*/
	that.size = function (prop, data) {

		if (data) {

			// Seeker: shape size relative to zoomed image respect zoomed area
			var size = (original[prop] * data) / zoomed[prop];

			// Seeker: sets shape size
			seeker.shape[prop](size);

			// Seeker: save shape half size for position it respect cursor
			seeker[prop] = size / 2;

		}

		return that.parent.size(prop, data);
	};

/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Zoom#uid
	* @type number
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Zoom#element
	* @type HTMLElement
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Zoom#type
	* @type string
	*/

	/**
	* Gets component content. To get the defined content just use the method without arguments, like 'me.content()'.
	* @public
	* @name ch.Zoom#content
	* @function
	* @param {string} content Static content, DOM selector or URL. If argument is empty then will return the content.
	* @returns {HTMLIMGElement}
	* @example
	* // Get the defined content
	* me.content();
	* @see ch.Object#content
	*/

	that["public"].content = function () {
		// Only on Zoom, it's limmited to be a getter
		return that.content();
	};

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @function 
	* @name ch.Zoom#isActive
	* @returns boolean
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @function
	* @name ch.Zoom#show
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
	* @name ch.Zoom#hide
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
	* @name ch.Zoom#width
	* @returns itself
	* @see ch.Floats#size
	* @example
	* // Gets width of Zoom float element.
	* foo.width();
	* @example
	* // Sets width of Zoom float element and updates the seeker size to keep these relation.
	* foo.width(500);
	*/

	/**
	* Sets or gets the height property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '100' or '100px'.
	* @public
	* @function
	* @name ch.Zoom#height
	* @returns itself
	* @see ch.Floats#size
	* @example
	* // Gets height of Zoom float element.
	* foo.height();
	* @example
	* // Sets height of Zoom float element and update the seeker size to keep these relation.
	* foo.height(500);
	*/

	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @function
	* @name ch.Zoom#position
	* @example
	* // Change default position.
	* $("a").zoom().position({
	*	offset: "0 10",
	*	points: "lt lb"
	* });
	* @example
	* // Refresh position.
	* $("a").zoom().position("refresh");
	* @example
	* // Get current position.
	* $("a").zoom().position();
	* @see ch.Object#position
	*/


/**
*	Default event delegation
*/

	// Anchor
	that.$element
		.addClass("ch-zoom-trigger")

		// Size (same as image)
		.css({"width": original["width"], "height": original["height"]})

		// Enlarge
		.bind("click", function (event) { that.enlarge(event); });
	
	// Initialize when zoomed image loads...
	zoomed.img.onImagesLoads(init);

	/**
	* Triggers when component is visible.
	* @name ch.Zoom#show
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
	* @name ch.Zoom#hide
	* @event
	* @public
	* @example
	* me.on("hide",function () {
	*	otherComponent.show();
	* });
	* @see ch.Floats#event:hide
	*/

	/**
	* Triggers when the component is ready to use.
	* @name ch.Zoom#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	that.trigger("ready");

	return that;
};

ch.factory("zoom");