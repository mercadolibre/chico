
/**
 * Zoom UI-Component for images.
 * @name Zoom
 * @class Zoom
 * @augments ch.Floats
 * @requires ch.Positioner
 * @requires ch.Preload
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 */

ch.zoom = function(conf) {

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Zoom
     */
	var that = this;
	conf = ch.clon(conf);

	// Link source as zoomed image
	conf.content = $("<img>").attr("src", that.element.href);

	conf.position = {};
	conf.position.context = conf.context || that.$element;
	conf.position.offset = conf.offset || "20 0";
	conf.position.points = conf.points || "lt rt";
	conf.position.hold = true;
	
	conf.width = conf.width || 300;
	conf.height = conf.height || 300;
	
	conf.fx = false;

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
     * Main configuration object.
     * @private
     * @name main
     * @type {Object}
     * @memberOf ch.Zoom
     */
	var main = {};
		main.img = that.$element.children();
		main.w = main.img.width();
		main.h = main.img.height();

    /**
     * The zoomed visual element.
     * @private
     * @name zoomed
     * @type {Object}
     * @memberOf ch.Zoom
     */
	var zoomed = {};
		zoomed.img = conf.content;
	
	// Magnifying glass
	//var $lens = $("<div>").addClass("ch-lens ch-hide");
	
    /**
     * The seeker is the visual element that follows mouse movement.
     * @private
     * @name seeker
     * @type {Object}
     * @memberOf ch.Zoom
     */
	var seeker = {};
		// TODO: Calc relativity like in that.size (en lugar de la division por 3)
		seeker.w = conf.width / 3;
		seeker.h = conf.height / 3;
		seeker.shape = $("<div>")
			.addClass("ch-seeker ch-hide")
			.bind("mousemove", function(event){ move(event); })
			.css({width: seeker.w, height: seeker.h});
    
    /**
     * Get the mouse position and moves the zoomed image.
     * @private
     * @function
     * @name move
     * @param {Mouse Event Object} event
     * @memberOf ch.Zoom
     */
	var move = function(event){
		var offset = main.img.offset();
		
		var x = event.pageX - offset.left;
		var y = event.pageY - offset.top;
		
		// Zoomed image
		zoomed.img.css({
			"left": -( ((zoomed.w * x) / main.w) - (conf.width / 2) ),
			"top": -( ((zoomed.h * y) / main.h) - (conf.height / 2) )
		});
		
		// Seeker shape
		seeker.shape.css({
			"left": x - (seeker.w / 2),
			"top": y - (seeker.h / 2)
		});
	};
	
/**
 *  Protected Members
 */
	
	that.$trigger = that.$element;
	
	that.show = function(event){
		that.prevent(event);
		
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
		
		// Size of zoomed image
		zoomed.w = zoomed.img.width();
		zoomed.h = zoomed.img.height();
		zoomed.ref_x = (zoomed.w / main.w - 1);
		zoomed.ref_y = (zoomed.h / main.h - 1);
		
		var at = attr.substr(0,1);
		
		// Configuration
		that.conf[attr] = data;
		
		// Container
		that.$container[attr](data);
		
		// Seeker
		var rel = (main[at] * data) / zoomed[at];
		seeker[at] = rel;
		seeker.shape[attr](rel);

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
     * @return {Chico-UI Object}
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
     * @return {Chico-UI Object}
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
     * Sets the width size.
     * @private
     * @name width
     * @param {Number} data Width value.
     * @memberOf ch.Zoom
     */
	that["public"].width = function(data){ that.size("width", data); };
    /**
     * Sets the height size.
     * @private
     * @name height
     * @param {Number} data Height value.
     * @memberOf ch.Zoom
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
			.css({"width": main.w, "height": main.h})
			
			// Show
			.bind("mouseover", that.show)
			
			// Hide
			.bind("mouseleave", that.hide)
			
			// Move
			.bind("mousemove", function(event){ move(event); })
			
			// Enlarge
			.bind("click", function(event){ that.enlarge(event); });
	},50);	
	
	// Preload zoomed image
	if(ch.hasOwnProperty("preload")) ch.preload(that.element.href);
	
	return that;
};
