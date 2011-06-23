
/**
 * Zoom UI-Component for images.
 * @name Zoom
 * @class Zoom
 * @augments ch.Floats
 * @requires ch.Positioner
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
	conf.width = conf.width || 300;
	conf.height = conf.height || 300;
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
     * Original image.
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
     * Zoomed visual element.
     * @private
     * @name zoomed
     * @type {Object}
     * @memberOf ch.Zoom
     */
	var zoomed = {};
		zoomed.img = conf.content = $("<img>").prop("src", that.element.href);
		zoomed["width"] = zoomed.img.prop("width");
		zoomed["height"] = zoomed.img.prop("height");
	
    /**
     * Seeker is the visual element that follows mouse movement for referencing to zoomable area into original image.
     * @private
     * @name seeker
     * @type {Object}
     * @memberOf ch.Zoom
     */
	var seeker = {};
		seeker.shape = $("<div>")
			.addClass("ch-seeker ch-hide")
			// TODO: Calc relativity like in that.size (en lugar de la division por 3)
			.css({ width: conf.width / 3, height: conf.height / 3 });
    
    /**
     * Get the mouse position and moves the zoomed image.
     * @private
     * @function
     * @name move
     * @param {Mouse Event Object} event
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
	};
	
/**
 *  Protected Members
 */
	
	that.$trigger = that.$element;
	
	that.show = function(event){
		// Floats show
		that.parent.show(event);
		
		// Recalc offset of original image
		original.offset = original.img.offset();

		// Move
		that.$element.bind("mousemove", function(event){ move(event); })
		
		// Seeker
		seeker.shape.removeClass("ch-hide");

		return that;
	};
	
	that.hide = function(event){
		// Floats hide
		that.parent.hide(event);
		
		// Move
		that.$element.unbind("mousemove");
		
		// Seeker
		seeker.shape.addClass("ch-hide");
		
		return that;
	};

    /**
     * Opens the big picture.
     * @private
     * @function
     * @name enlarge
     * @memberOf ch.Layer
     */
	that.enlarge = function(event){
		that.prevent(event);
		
		// Open pop-up
	};
	
    /**
     * Getter and setter for size attributes.
     * @private
     * @function
     * @name size
     * @param {String} attr
     * @param {String} [data]
     * @memberOf ch.Layer
     */
	that.size = function(attr, data) {
		// Getter
		if (!data) {
			return that.conf[attr];
		};

		// Setter
		that.conf[attr] = data;
		
		// Container
		that.$container[attr](data);
		
		// Seeker: shape size relative to zoomed image and zoomed area
		var size = (original[attr] * data) / zoomed[attr];
		
		// Seeker: sets shape size
		seeker.shape[attr](size);
		
		// Seeker: shape half size, for position it
		seeker[attr] = size / 2;

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
     * @memberOf ch.Zoom
     */
   	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Zoom
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Zoom
     */
	that["public"].type = that.type;
    /**
     * The component's content.
     * @public
     * @name content
     * @type {String}
     * @memberOf ch.Zoom
     */
	that["public"].content = that.content;
    /**
     * Shows component's content.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Zoom
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
     * @returns {Chico-UI Object}
     * @memberOf ch.Zoom
     */
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};

    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Zoom
     * @example
     * // Change position.
     * $('a').zoom().position({ 
     *    offset: "0 10",
     *    points: "lt lb"
     * });
     */
	that["public"].position = that.position;
	
    /**
     * Gets and sets the width size.
     * @private
     * @name width
     * @param {Number} data Width value.
     * @memberOf ch.Zoom
     * @example
     * // Gets width of zoomed visual element.
     * foo.width();
     * @example
     * // Sets width of zoomed visual element and update the seeker size to keep these relation.
     * foo.width(500);
     */
	that["public"].width = function(data){
		that.size("width", data);
		
		return that["public"];
	};
	
    /**
     * Gets and sets the height size.
     * @private
     * @name height
     * @param {Number} data Height value.
     * @memberOf ch.Zoom
     * @example
     * // Gets height of zoomed visual element.
     * foo.height();
     * @example
     * // Sets height of zoomed visual element and update the seeker size to keep these relation.
     * foo.height(500);
     */
	that["public"].height = function(data){
		that.size("height", data);
		
		return that["public"];
	};

	
/**
 *  Default event delegation
 */

	that.$element
		.addClass("ch-zoom-trigger")
		
		// Seeker
		.append( seeker.shape )
		
		// Size (same as image)
		.css({"width": original["width"], "height": original["height"]})
		
		// Show
		.bind("mouseenter", function(event){ that.show(event); })
		
		// Hide
		.bind("mouseleave", function(event){ that.hide(event); })
		
		// Enlarge
		.bind("click", function(event){ that.enlarge(event); });
	
	
	return that;
};
