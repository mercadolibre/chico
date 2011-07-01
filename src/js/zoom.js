
/**
 * Zoom is a standalone UI component that shows a contextual reference to an augmented version of main declared image.
 * @name Zoom
 * @class Zoom
 * @augments ch.Floats
 * @requires ch.Positioner
 * @requires ch.onImagesLoads
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.zoom = function(conf) {

    /**
     * Reference to an internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Zoom
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
 *  Private Members
 */

    /**
     * Reference to main image declared on HTML code snippet.
     * @private
     * @name original
     * @type {Object}
     * @memberOf ch.Zoom
     */
	var original = {};
		original.img = that.$element.children();
		original["width"] = original.img.prop("width");
		original["height"] = original.img.prop("height");

    /**
     * Reference to the augmented version of image, that will be displayed in context.
     * @private
     * @name zoomed
     * @type {Object}
     * @memberOf ch.Zoom
     */
	var zoomed = {};
		// Define the content source 
		zoomed.img = that.source = $("<img>").prop("src", that.element.href);
	
    /**
     * Seeker is the visual element that follows mouse movement for referencing to zoomable area into original image.
     * @private
     * @name seeker
     * @type {Object}
     * @memberOf ch.Zoom
     */
	var seeker = {};
		seeker.shape = $("<div>").addClass("ch-seeker ch-hide")
    
    /**
     * Gets the mouse position relative to original image position, and accordingly moves the zoomed image.
     * @private
     * @function
     * @name move
     * @param {Mouse Event Object} event
	 * @returns {void}
     * @memberOf ch.Zoom
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
			zoomed.img.css("left", -( (parseInt(zoomed["width"] * x) / original["width"]) - (conf.width / 2) ));
			seeker.shape.css("left", limit.left);
		};
		
		// Vertical: keep seeker into limits
		if(limit.top >= 0 && limit.bottom < original["height"] - 1) {
			zoomed.img.css("top", -( (parseInt(zoomed["height"] * y) / original["height"]) - (conf.height / 2) ));
			seeker.shape.css("top", limit.top);
		};
		
		return;
	};
		
	/**
     * Calculates zoomed image sizes and adds event listeners to trigger of float element
     * @private
     * @function
     * @name init
	 * @returns {void}
     * @memberOf ch.Zoom
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
		
		return;
	};
	
/**
 *  Protected Members
 */
	
	/**
     * Anchor that wraps the main image and links to zoomed image file.
     * @public
     * @name $trigger
     * @type {Object}
     * @memberOf ch.Zoom
     */
	that.$trigger = that.$element;
	
	that.show = function(){
		// Recalc offset of original image
		original.offset = original.img.offset();

		// Move
		that.$element.bind("mousemove", function(event){ 
			move(event); 
		});

		// Seeker
		seeker.shape.removeClass("ch-hide");
		
		// Floats show
		that.parent.show();

		return that;
	};
	
	that.hide = function(){
		// Move
		that.$element.unbind("mousemove");
		
		// Seeker
		seeker.shape.addClass("ch-hide");
		
		// Floats hide
		that.parent.hide();
		
		return that;
	};

    /**
     * Triggered on anchor click, it prevents redirection to zoomed image file.
     * @private
     * @function
     * @name enlarge
     * @param {Mouse Event Object} event
	 * @returns {Internal component instance}
     * @memberOf ch.Zoom
     */
	that.enlarge = function(event){
		that.prevent(event);
		
		// Do what you want...
		
		return that;
	};
	
    /**
     * Getter and setter for size attributes of float that contains the zoomed image.
     * @private
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
			var size = (original[prop] * data) / zoomed[prop];
		
			// Seeker: sets shape size
			seeker.shape[prop](size);
		
			// Seeker: save shape half size for position it respect cursor
			seeker[prop] = size / 2;

		};

		return that.parent.size(prop, data);
	};

/**
 *  Public Members
 */
 
    /**
     * Unique identifier of component instance.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Zoom
     */
   	
    /**
     * Reference to trigger element.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Zoom
     */
	
    /**
     * Component type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Zoom
     */
	
    /**
     * Gets the component content. In Zoom component it's the zoomed image reference.
     * @public
     * @name content
     * @function
	 * @returns {HTMLIMGElement}
     * @memberOf ch.Zoom
     */
	that["public"].content = function(){
		// Only on Zoom, it's limmited to be a getter
		return that.content();
	};
	
    /**
     * Shows float element that contains the zoomed image.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Zoom
     */
	
    /**
     * Hides float element that contains the zoomed image.
     * @public
     * @name hide
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Zoom
     */

    /**
     * Gets and sets Zoom position.
     * @public
     * @name position
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Zoom
     * @example
     * // Change default position.
     * $("a").zoom().position({
     *    offset: "0 10",
     *    points: "lt lb"
     * });
     * @example
     * // Refresh position.
     * $("a").zoom().position("refresh");
     * @example
     * // Get current position.
     * $("a").zoom().position();
     */
	
    /**
     * Gets and sets the width size of float element.
     * @private
     * @name width
     * @function
     * @returns {Chico-UI Object}
     * @param {Number} data Width value.
     * @memberOf ch.Zoom
     * @example
     * // Gets width of Zoom float element.
     * foo.width();
     * @example
     * // Sets width of Zoom float element and updates the seeker size to keep these relation.
     * foo.width(500);
     */

	
    /**
     * Gets and sets the height size of float element.
     * @private
     * @name height
     * @function
     * @returns {Chico-UI Object}
     * @param {Number} data Height value.
     * @memberOf ch.Zoom
     * @example
     * // Gets height of Zoom float element.
     * foo.height();
     * @example
     * // Sets height of Zoom float element and update the seeker size to keep these relation.
     * foo.height(500);
     */

	
/**
 *  Default event delegation
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
