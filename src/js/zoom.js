
/**
* Zoom is a standalone UI component that shows a contextual reference to an augmented version of main declared image.
* @name Zoom
* @class Zoom
* @augments ch.Floats
* @requires ch.Positioner
* @requires ch.onImagesLoads
* @memberOf ch
* @param {Object} conf Object with configuration properties
* @returns {self}
*/

ch.zoom = function(conf) {
	/**
	* Reference to an internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Zoom#that
	* @type {Object}
	*/
	var that = this;

	conf = ch.clon(conf);
	conf.fx = false;
	
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
	* @type {Object}
	*/
	var original = {};
		original.img = that.$element.children();
		original["width"] = original.img.prop("width");
		original["height"] = original.img.prop("height");

	/**
	* Reference to the augmented version of image, that will be displayed in context.
	* @private
	* @name ch.Zoom#zoomed
	* @type {Object}
	*/
	var zoomed = {};
		// Define the content source 
		zoomed.img = that.source = $("<img>").prop("src", that.element.href);
	
	/**
	* Seeker is the visual element that follows mouse movement for referencing to zoomable area into original image.
	* @private
	* @name ch.Zoom#seeker
	* @type {Object}
	*/
	var seeker = {};
		seeker.shape = $("<div>").addClass("ch-seeker ch-hide")
	
	/**
	* Gets the mouse position relative to original image position, and accordingly moves the zoomed image.
	* @private
	* @function
	* @name ch.Zoom#move
	* @param {Event Object} event
	*/
	var move = function(event){
		
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
		if(limit.left >= 0 && limit.right < original["width"] - 1) {
			zoomed.img.css("left", -( (parseInt(zoomed["width"]* x) / original["width"]) - (conf.width / 2) ));
			seeker.shape.css("left", limit.left);
		};
		
		// Vertical: keep seeker into limits
		if(limit.top >= 0 && limit.bottom < original["height"] - 1) {
			zoomed.img.css("top", -( (parseInt(zoomed["height"]* y) / original["height"]) - (conf.height / 2) ));
			seeker.shape.css("top", limit.top);
		};
		
	};

	/**
	* Calculates zoomed image sizes and adds event listeners to trigger of float element
	* @private
	* @function
	* @name ch.Zoom#init
	*/
	var init = function(){
		// Zoomed image size
		zoomed["width"] = zoomed.img.prop("width");
		zoomed["height"] = zoomed.img.prop("height");
		
		// Anchor
		that.$element
			// Apend Seeker
			.append( seeker.shape )
			
			// Show
			.bind("mouseenter", that.show)
			
			// Hide
			.bind("mouseleave", that.hide)
	};

/**
*	Protected Members
*/

	/**
	* Anchor that wraps the main image and links to zoomed image file.
	* @public
	* @name ch.Zoom#$trigger
	* @type {Object}
	*/
	that.$trigger = that.$element;

	that.innerShow = function(){
		// Recalc offset of original image
		original.offset = original.img.offset();

		// Move
		that.$element.bind("mousemove", function(event){ 
			move(event); 
		});

		// Seeker
		seeker.shape.removeClass("ch-hide");
		
		// Floats show
		that.parent.innerShow();

		return that;
	};

	that.innerHide = function(){
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
	* @param {Mouse Event Object} event
	* @returns {itself}
	*/
	that.enlarge = function(event){
		that.prevent(event);
		// Do what you want...
		return that;
	};
	
	/**
	* Getter and setter for size attributes of float that contains the zoomed image.
	* @protected
	* @function
	* @name size
	* @param {String} prop Property that will be setted or getted, like "width" or "height".
	* @param {String} [data] Only for setter. It's the new value of defined property.
	* @returns {Internal component instance}
	* @memberOf ch.Zoom
	*/
	that.size = function(prop, data) {

		if (data) {

			// Seeker: shape size relative to zoomed image respect zoomed area
			var size = (original[prop]* data) / zoomed[prop];

			// Seeker: sets shape size
			seeker.shape[prop](size);

			// Seeker: save shape half size for position it respect cursor
			seeker[prop] = size / 2;

		};

		return that.parent.size(prop, data);
	};

/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Zoom#uid
	* @type {Number}
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Zoom#element
	* @type {HTMLElement}
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Zoom#type
	* @type {String}
	*/

	/**
	* Gets component content. To get the defined content just use the method without arguments, like 'me.content()'.
	* @public
	* @name ch.Zoom#content
	* @function
	* @param {String} content Static content, DOM selector or URL. If argument is empty then will return the content.
	* @returns {HTMLIMGElement}
	* @example
	* // Get the defined content
	* me.content();
	* @see ch.Object#content
	*/

	that["public"].content = function(){
		// Only on Zoom, it's limmited to be a getter
		return that.content();
	};

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @name ch.Zoom#isActive
	* @function 
	* @returns {Boolean}
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Zoom#show
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
	* @name ch.Zoom#hide
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
	* @name ch.Zoom#width
	* @function
	* @returns {itself}
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
	* @name ch.Zoom#height
	* @function
	* @returns {itself}
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
		.bind("click", function(event){ that.enlarge(event); });
	
	// Initialize when zoomed image loads...
	zoomed.img.onImagesLoads( init );

	return that;
};
