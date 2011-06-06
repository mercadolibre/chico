
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
		zoomed.img = conf.content = $("<img>");
	
	// Magnifying glass (enlarge)
	//var $lens = $("<div>").addClass("ch-lens ch-hide");
	
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
			.bind("mousemove", function(event){ move(event); })
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
		var offset = original.img.offset();
		
		var x = event.pageX - offset.left;
		var y = event.pageY - offset.top;
		
		// Zoomed image
		zoomed.img.css({
			"left": -( ((zoomed["width"] * x) / original["width"]) - (conf.width / 2) ),
			"top": -( ((zoomed["height"] * y) / original["height"]) - (conf.height / 2) )
		});
		
		// Seeker shape
		seeker.shape.css({
			"left": x - seeker["width"],
			"top": y - seeker["height"]
		});
	};
	
/**
 *  Protected Members
 */
	
	that.$trigger = that.$element;
	
	that.show = function(event){
		that.prevent(event);

		zoomed.img.prop("src", that.element.href);

		// Floats show
		that.parent.show();

		// Magnifying glass
		//$lens.fadeIn();

		// Seeker
		seeker.shape.removeClass("ch-hide");
		
		return that;
	};
	
	that.hide = function(event){
		that.prevent(event);
		
		// Seeker
		seeker.shape.addClass("ch-hide");
		
		// Magnifying glass
		//$lens.fadeOut();
		
		// Floats hide
		that.parent.hide();
		
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
		if (!data) return conf[attr]; // Getter

		// Configuration
		that.conf[attr] = data;
		
		// Container
		that.$container[attr](data);
		
		// Seeker
		var size = (original[attr] * data) / zoomed[attr]; // Shape size relative to zoomed image and zoomed area
		seeker.shape[attr](size); // Sets shape size
		seeker[attr] = size / 2; // Shape half size: for position it

		return that["public"];
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
     * $('input').zoom().position({ 
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
	that["public"].width = function(data){ that.size("width", data); };
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
	that["public"].height = function(data){ that.size("height", data) };

	
/**
 *  Default event delegation
 */
	
	// TODO: El setTimeout soluciona problemas en el viewer
	setTimeout( function(){
		that.$element
			.addClass("ch-zoom-trigger")
			
			// Magnifying glass
			//.append( $lens )
			
			// Seeker
			.append( seeker.shape )
			
			// Size (same as image)
			.css({"width": original["width"], "height": original["height"]})
			
			// Show
			.bind("mouseenter", that.show)
			
			// Hide
			.bind("mouseleave", that.hide)
			
			// Move
			.bind("mousemove", function(event){ move(event); })
			
			// Enlarge
			.bind("click", function(event){ that.enlarge(event); });
	},50);	

	// Preload zoomed image
	ch.utils.window.one("load", function(){
		zoomed.img.prop("src", that.element.href).one("load", function(){
			zoomed["width"] = zoomed.img.prop("width");
			zoomed["height"] = zoomed.img.prop("height");
		});
	});


	return that;
};
