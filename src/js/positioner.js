/**
 * Positioner is an utility that centralizes and manages changes related to positioned elements, and returns an utility that resolves positioning for all UI-Objects.
 * @abstract
 * @name ch#Positioner
 * @class Positioner
 * @param {Configuration Object} conf Configuration object with positioning properties.
 * @requires ch.Viewport
 * @returns {Positioner Control Object}
 * @example
 * // An Element centered into the Viewport (default behavior)
 * ch.positioner({
 *     element: "#element1",
 * });
 * @example
 * // An Element positioned relative to a Context through defined points
 * ch.positioner({
 *     element: "#element2",
 *     context: "#context2",
 *     points: "lt rt"                //  Element left-top point same as Context right-bottom point
 * });
 * @example
 * // An Element displaced horizontally by 10px of defined position
 * ch.positioner({
 *     element: $("#element3",
 *     context: $("#context3",
 *     points: "lt rt",
 *     offset: "10 0"
 * });
 * @example
 * // Repositionable Element if it can't be shown into viewport area
 * ch.positioner({
 *     element: $("#element4",
 *     context: $("#context4",
 *     points: "lt rt",
 *     reposition: true
 * });
 */

ch.positioner = function (o) {

	/**
	 * Constructs a new position, gets viewport size, checks for relative parent's offset,
	 * finds the context and sets the position to a given element.
	 * @private
	 * @function
	 * @constructs
	 * @name ch.Positioner#initPosition
	 */
	var initPosition = function () {
		viewport = getViewport();
		parentRelative = getParentRelative();
		context = getContext();
		setPosition();
	};


	/**
	 * Object that contains all properties for positioning
	 * @private
	 * @name ch.Positioner#o
	 * @type {Position Object}
	 * @example
	 * ch.positioner({
	 *     element: $element
	 *     [context]: $element | viewport
	 *     [points]: "cm cm"
	 *     [offset]: "x y" 
	 *     [hold]: false
	 * });
	 */
	var o = o || this.conf.position;
		o.points = o.points || "cm cm";
		o.offset = o.offset || "0 0";

	/**
	 * Reference to the DOM Element to be positioned.
	 * @private
	 * @name ch.Positioner#$element
	 * @type {jQuery Object}
	 */
	var element = $(o.element);
		element.css("position", "absolute");

	/**
	 * It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the viewport.
	 * @private
	 * @name ch.Positioner#context
	 * @type {Context Object}
	 * @default Viewport
	 */
	var context;

	/**
	 * Viewport is a reference to positions and sizes of visible area into browser.
	 * @private
	 * @name ch.Positioner#viewport
	 * @type {Viewport Object}
	 */
	var viewport;
	
	/**
	 * It's the first of context's parents that is styled positioned.
	 * @private
	 * @name ch.Positioner#parentRelative
	 * @type {Relative Parent Object}
	 */
	var parentRelative;

	/**
	 * Map that references the input points to an output friendly classname.
	 * @private
	 * @constant
	 * @name ch.Positioner#CLASS_REFERENCES
	 * @type {Map Object}
	 */
	var CLASS_REFERENCES = {
		"lt lb": "ch-left ch-bottom",
		"lb lt": "ch-left ch-top",
		"rt rb": "ch-right ch-bottom",
		"rb rt": "ch-right ch-top",
		"lt rt": "ch-right",
		"cm cm": "ch-center"
	};

	/**
	 * Array with offset configuration
	 * @private
	 * @name ch.Positioner#splittedOffset
	 * @type {Array}
	 * @default [0,0]
	 */
	var splittedOffset = o.offset.split(" ");

	/**
	 * Left offset through configuration
	 * @private
	 * @name ch.Positioner#offset_left
	 * @type {Number}
	 * @default 0
	 */
	var offset_left = parseInt(splittedOffset[0]);

	/**
	 * Right offset through configuration
	 * @private
	 * @name ch.Positioner#offset_right
	 * @type {Number}
	 * @default 0
	 */
	var offset_top = parseInt(splittedOffset[1]);

	/**
	 * Defines viewport element, its size, position, and methods to recalculate all.
	 * @function
	 * @name ch.Positioner#getViewport
	 * @returns {Viewport Object}
	 */
	var getViewport = function () {

		// TODO: Calc scrollbar size
		var viewport, width, height, left, top, pageX, pageY, scrollBar = 0;

		// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
		if (typeof window.innerWidth != "undefined") {
			viewport = window;
			width = viewport.innerWidth - scrollBar;
			height = viewport.innerHeight;
			pageX = viewport.pageXOffset;
			pageY = viewport.pageYOffset;

			// Return viewport object
			return {
				element: viewport,			
				left: 0 + offset_left + pageX - scrollBar,
				top: 0 + offset_top + pageY,
				bottom: height + pageY,
				right: width + pageX,
				width: width,
				height: height
			}
		}
		// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
		// older versions of IE - viewport = document.getElementsByTagName('body')[0];		
		else {
			viewport = document.documentElement;
			width = viewport.clientWidth - scrollBar;
			height = viewport.clientHeight;
			pageX = viewport.scrollLeft;
			pageY = viewport.scrollTop;
			
			// Return viewport object
			return {
				element: viewport,			
				left: 0 + offset_left + pageX,
				top: 0 + offset_top + pageY,
				bottom: height + pageY,
				right: width + pageX,
				width: width,
				height: height
			}
		}
	};

	/**
	 * Calculates left and top position from specific points.
	 * @private
	 * @name ch.Positioner#getPosition
	 * @function
	 * @param {Unit points} unitPoints String with points to be calculated.
	 * @returns {Axis measures}
	 * @example
	 * var foo = getCoordinates("ll");
	 * 
	 * foo = {
	 *     left: Number,
	 *     top: Number
	 * };
	 */
	var getPosition = function (unitPoints) {
		// my_x and at_x values together
		// cache properties 
		var contextLeft = context.left;
		var contextTop = context.top;
		var contextWidth = context.width;
		var contextHeight = context.height;
		var elementWidth = element.outerWidth();
		var elementHeight = element.outerHeight();
		
		var xReferences = {
			ll: contextLeft,
			lr: contextLeft + contextWidth,
			rr: contextLeft + contextWidth - elementWidth,
			cc: contextLeft + contextWidth/2 - elementWidth/2
			// TODO: lc, rl, rc, cl, cr
		}
		
		// my_y and at_y values together
		var yReferences = {
			// jquery 1.6 do not support offset on IE
			tt: contextTop,
			tb: contextTop + contextHeight,
			bt: contextTop - elementHeight,
			mm: contextTop + contextHeight/2 - elementHeight/2
			// TODO: tm, bb, bm, mt, mb
		}
		
		var axis = {
			left: xReferences[unitPoints.my_x + unitPoints.at_x],
			top: yReferences[unitPoints.my_y + unitPoints.at_y]	
		} 

		return axis;
	};
	
	/**
	 * Gets new coordinates and checks its space into viewport.
	 * @private
	 * @name ch.Positioner#calculatePoints
	 * @function
	 * @returns {Styles Object}
	 */
	var calculatePoints = function (points, unitPoints) {
		// Default styles
		var styles = getPosition(unitPoints);
		var classes = CLASS_REFERENCES[points] || "";
		
		// Hold behavior
		if (o.hold) {
			styles.classes = classes;
			return styles;
		};
		
		var stylesCache;
		classes = classes.split(" ");
		
		// Viewport limits (From bottom to top)
		if (
			// If element is positioned at bottom and...
			(points === "lt lb" || points === "rt rb") &&
			// There isn't space in viewport... (Element bottom > Viewport bottom)
			((styles.top + parentRelative.top + element.outerHeight()) > viewport.bottom)
		) {
			unitPoints.my_y = "b";
			unitPoints.at_y = "t";

			// Store old styles
			stylesCache = styles;
			
			// New styles		 
			styles = getPosition(unitPoints);
			
			// Top to Bottom - Default again 
			if (styles.top + parentRelative.top < viewport.top) {
				styles = stylesCache;
			} else {
				styles.top -= (2 * offset_top);
				classes[1] = "ch-top";
			};
		};
		
		
		// Viewport limits (From left to right)
		// If there isn't space in viewport... (Element right > Viewport right)
		if ((styles.left + parentRelative.left + element.outerWidth()) > viewport.right) {
			unitPoints.my_x = unitPoints.at_x = "r";
			
			// Store old styles
			stylesCache = styles;
			
			// New styles		 
			styles = getPosition(unitPoints);
			
			// Right to Left - Default again 
			if (styles.left < viewport.left) {
				styles = stylesCache;
			}else{
				styles.left -= (2 * offset_left);
				
				classes[0] = "ch-right";
				
				if (classes[1] === "ch-top") { styles.top -= (2 * offset_top); };
			};
		};
		
		// Changes classes or default classes
		styles.classes = classes.join(" ");

		return styles;
	};
	
	/**
	 * Checks if there are changes on coordinates to reposition the element.
	 * @private
	 * @name ch.Positioner#setPosition
	 * @function
	 */
	var setPosition = function () {
		// Separate points config
		var splitted = o.points.split(" ");

		var unitPoints = {
			my_x: splitted[0].charAt(0),
			my_y: splitted[0].charAt(1),
			at_x: splitted[1].charAt(0),
			at_y: splitted[1].charAt(1)
		};

		var styles = calculatePoints(o.points, unitPoints);
		
		element
			.css({
				left: styles.left,
				top: styles.top
			})
			.removeClass( "ch-top ch-left ch-bottom ch-right" )
			.addClass(styles.classes);
				
		if (ch.utils.hasOwn(context, "element") && context.element !== ch.utils.window[0]) {
			$(context.element)
				.removeClass( "ch-top ch-left ch-bottom ch-right" )
				.addClass(styles.classes);
		};

	};	

	/**
	 * Defines context element, its size, position.
	 * @function
	 * @name ch.Positioner#getContext
	 * @returns {Context Object}
	 */
	var getContext = function () {

		if (!o.context) {
			return viewport;
		}

		o.context = $(o.context);

		var contextOffset = o.context.offset();

		return {
			element: o.context,
			top: contextOffset.top + offset_top - parentRelative.top,
			left: contextOffset.left + offset_left - parentRelative.left,
			width: o.context.outerWidth(),
			height: o.context.outerHeight()
		};
	};

	/**
	 * Defines relative parent, its size, position.
	 * @function
	 * @name ch.Positioner#getParentRelative
	 * @returns {Relative Parent coordinates}
	 */
	var getParentRelative = function () {
		
		var relative = {};
			relative.left = 0;
			relative.top = 0;
		
		var parent = element.offsetParent();

		if (parent.css("position") === "relative") {
			
			var borderLeft = (parent.outerWidth() - parent.width() - ( parseInt(parent.css("padding-left")) * 2 )) / 2;
			
			relative = parent.offset();
			relative.left -= offset_left - borderLeft;
			relative.top -= offset_top;
			
		};
		
		return {
			left: relative.left,
			top: relative.top
		};
		
	};
	
	/**
	 * Reference that allows to know when window is being scrolled.
	 * @private
	 * @name ch.Positioner#scrolled
	 * @type {Boolean}
	 */
	var scrolled = false;

	// Scroll and resize events
	// Tested on IE, Magic! no lag!!
	ch.utils.window.bind("resize scroll", function () {
		scrolled = true;
	});
	
	setInterval(function () {
		if (!scrolled ) return;
		scrolled = false;
		// Hidden behavior
		if (element.css("display") === "none" ) return; 	
		initPosition();
	}, 350);

	/**
	 * @ignore
	 */

	initPosition();
	
	// Return the reference to the positioned element
	return $(element);
};