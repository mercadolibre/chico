/**
* Positioner is an utility that centralizes and manages changes related to positioned elements, and returns an utility that resolves positioning for all UI-Objects.
* @name Positioner
* @class Positioner
* @requires Viewport
* @memberOf ch
* @param {Object} conf Configuration object with positioning properties.
* @param {String} conf.element Reference to the DOM Element to be positioned.
* @param {String} [conf.context] It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the viewport.
* @param {String} [conf.points] Points where element will be positioned, specified by configuration or centered by default.
* @param {String} [conf.offset] Offset in pixels that element will be displaced from original position determined by points. It's specified by configuration or zero by default.
* @param {Boolean} [conf.reposition] Parameter that enables or disables reposition intelligence. It's disabled by default.
* @requires ch.Viewport
* @returns Object
* @example
* // An Element centered into the Viewport (default behavior)
* ch.positioner({
*     element: "#element1",
* });
* @example
* // An Element positioned relative to a Context through defined points
* // The Element left-top point will be the same as Context right-bottom point
* ch.positioner({
*     element: "#element2",
*     context: "#context2",
*     points: "lt rt"
* });
* @example
* // An Element displaced horizontally by 10px of defined position
* ch.positioner({
*     element: "#element3",
*     context: "#context3",
*     points: "lt rt",
*     offset: "10 0"
* });
* @example
* // Repositionable Element if it can't be shown into viewport area
* ch.positioner({
*     element: "#element4",
*     context: "#context4",
*     points: "lt rt",
*     reposition: true
* });
*/

ch.positioner = (function () {

	/**
	* Map that references the input points to an output friendly classname.
	* @private
	* @constant
	* @name ch.Positioner#CLASS_MAP
	* @type Object
	*/
	// TODO: include more specifications like ch-in ch-out
	// TODO: analize if reduct classnames amount. example:ch-out-left-bottom
	// TODO: complete classnames with all supported positions
	var CLASS_MAP = {
		"lt lb": "ch-left ch-bottom",
		"lb lt": "ch-left ch-top",
		"lt rt": "ch-right",
		"rt rb": "ch-right ch-bottom",
		"rb rt": "ch-right ch-top",
		"cm cm": "ch-center"
	},

	/**
	* Reference that allows to know when window is being scrolled or resized.
	* @private
	* @name ch.Positioner#changing
	* @type Boolean
	*/
		changing = false,

	/**
	* Checks if window is being scrolled or resized, updates viewport position and triggers internal Change event.
	* @private
	* @name ch.Positioner#triggerScroll
	* @function
	*/
		triggerChange = function () {
			// No changing, no execution
			if (!changing) { return; }

			// Updates viewport position
			ch.viewport.getOffset();

			/**
			* Triggers when window is being scrolled or resized.
			* @private
			* @name ch.Positioner#change
			* @event
			*/
			ch.utils.window.trigger(ch.events.VIEWPORT.CHANGE);

			// Change scrolling status
			changing = false;
		};

	// Resize and Scroll events binding. These updates respectives boolean variables
	ch.utils.window.bind("resize scroll", function () { changing = true; });

	// Interval that checks for resizing status and triggers specific events
	setInterval(triggerChange, 350);

	// Returns Positioner Abstract Component
	return function (conf) {

		// Validation for required "element" parameter
		if (!ch.utils.hasOwn(conf, "element")) {
			alert("Chico UI error: Expected to find \"element\" as required configuration parameter of ch.Positioner");

			return;
		}

		/**
		* Configuration parameter that enables or disables reposition intelligence. It's disabled by default.
		* @private
		* @name ch.Positioner#reposition
		* @type Boolean
		* @default false
		* @example
		* // Repositionable Element if it can't be shown into viewport area
		* ch.positioner({
		*     element: "#element1",
		*     reposition: true
		* });
		*/
		conf.reposition = conf.reposition || false;

		/**
		* Reference that saves all members to be published.
		* @private
		* @name ch.Positioner#that
		* @type Object
		*/
		var that = {},

		/**
		* Reference to the DOM Element to be positioned.
		* @private
		* @name ch.Positioner#$element
		* @type jQuery Object
		*/
			$element = $(conf.element),

		/**
		* Points where element will be positioned, specified by configuration or centered by default.
		* @private
		* @name ch.Positioner#points
		* @type String
		* @default "cm cm"
		* @example
		* // Element left-top point = Context right-bottom point
		* ch.positioner({
		*     element: "#element1",
		*     points: "lt rt"
		* });
		* @example
		* // Element center-middle point = Context center-middle point
		* ch.positioner({
		*     element: "#element2",
		*     points: "cm cm"
		* });
		*/
			points = conf.points || "cm cm",

		/**
		* Offset in pixels that element will be displaced from original position determined by points. It's specified by configuration or zero by default.
		* @private
		* @name ch.Positioner#offset
		* @type {Array} X and Y references determined by "offset" configuration parameter.
		* @default "0 0"
		* @example
		* // Moves 5px to right and 5px to bottom
		* ch.positioner({
		*     element: "#element1",
		*     offset: "5 5"
		* });
		* // It will be worth:
		* offset[0] = 5;
		* offset[1] = 5;
		* @example
		* // Moves 10px to right and 5px to top
		* ch.positioner({
		*     element: "#element1",
		*     offset: "10 -5"
		* });
		* // It will be worth:
		* offset[0] = 10;
		* offset[1] = -5;
		*/
			offset = (conf.offset || "0 0").split(" "),

		/**
		* Defines context element, its size, position, and methods to recalculate all.
		* @function
		* @name ch.Positioner#getContext
		* @returns Context Object
		*/
			getContext = function () {

				// Parse as Integer offset values
				offset[0] = parseInt(offset[0], 10);
				offset[1] = parseInt(offset[1], 10);

				// Context by default is viewport
				if (!ch.utils.hasOwn(conf, "context")) {
					contextIsNotViewport = false;
					return ch.viewport;
				}

				// Context from configuration
				// Object to be returned.
				var self = {};

				/**
				* Width of context.
				* @private
				* @name width
				* @type Number
				* @memberOf ch.Positioner#context
				*/
				self.width =

				/**
				* Height of context.
				* @private
				* @name height
				* @type Number
				* @memberOf ch.Positioner#context
				*/
					self.height =

				/**
				* Left offset of context.
				* @private
				* @name left
				* @type Number
				* @memberOf ch.Positioner#context
				*/
					self.left =

				/**
				* Top offset of context.
				* @private
				* @name top
				* @type Number
				* @memberOf ch.Positioner#context
				*/
					self.top =

				/**
				* Right offset of context.
				* @private
				* @name right
				* @type Number
				* @memberOf ch.Positioner#context
				*/
					self.right =

				/**
				* Bottom offset of context.
				* @private
				* @name bottom
				* @type Number
				* @memberOf ch.Positioner#context
				*/
					self.bottom = 0;

				/**
				* Context HTML Element.
				* @private
				* @name element
				* @type HTMLElement
				* @memberOf ch.Positioner#context
				*/
				self.element = $(conf.context);

				/**
				* Recalculates width and height of context and updates size on context object.
				* @private
				* @function
				* @name getSize
				* @returns Object
				* @memberOf ch.Positioner#context
				*/
				self.getSize = function () {

					return {
						"width": context.width = self.element.outerWidth(),
						"height": context.height = self.element.outerHeight()
					};

				};

				/**
				* Recalculates left and top of context and updates offset on context object.
				* @private
				* @function
				* @name getOffset
				* @returns Object
				* @memberOf ch.Positioner#context
				*/
				self.getOffset = function () {

					// Gets offset of context element
					var contextOffset = self.element.offset(),
						size = self.getSize(),
						scrollLeft = contextOffset.left, // + offset[0], // - relativeParent.left,
						scrollTop = contextOffset.top; // + offset[1]; // - relativeParent.top;

					if (!parentIsBody) {
						scrollLeft -= relativeParent.left,
						scrollTop -= relativeParent.top;
					}
					
					// Calculated including offset and relative parent positions
					return {
						"left": context.left = scrollLeft,
						"top": context.top = scrollTop,
						"right": context.right = scrollLeft + size.width,
						"bottom": context.bottom = scrollTop + size.height
					};
				};

				contextIsNotViewport = true;

				return self;
			},

		/**
		* Reference that allows to know if context is different to viewport.
		* @private
		* @name ch.Positioner#contextIsNotViewport
		* @type Boolean
		*/
			contextIsNotViewport,

		/**
		* It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the viewport.
		* @private
		* @name ch.Positioner#context
		* @type Object
		* @default ch.Viewport
		*/
			context = getContext(),
		
		/**
		* 
		* @private
		* @name ch.Positioner#parentIsBody
		* @type Boolean
		*/
			parentIsBody,

		/**
		* It's the first of context's parents that is styled positioned. If it isn't defined through configuration, it will be the HTML Body Element.
		* @private
		* @name ch.Positioner#relativeParent
		* @type Object
		* @default HTMLBodyElement
		*/
			relativeParent = (function () {

				// Context's parent that's positioned.
				var element = (contextIsNotViewport) ? context.element.offsetParent()[0] : ch.utils.body[0],

				// Object to be returned.
					self = {};

				/**
				* Left offset of relative parent.
				* @private
				* @name left
				* @type Number
				* @memberOf ch.Positioner#relativeParent
				*/
				self.left =

				/**
				* Top offset of relative parent.
				* @private
				* @name top
				* @type Number
				* @memberOf ch.Positioner#relativeParent
				*/
					self.top = 0;

				/**
				* Recalculates left and top of relative parent of context and updates offset on relativeParent object.
				* @private
				* @name getOffset
				* @function
				* @memberOf ch.Positioner#relativeParent
				* @returns Offset Object
				*/
				// TODO: on ie6 the relativeParent border push too (also on old positioner)
				self.getOffset = function () {
					// If first parent relative is Body, don't recalculate position
					if (element.tagName === "BODY") { return; }

					// Offset of first parent relative
					var parentOffset = $(element).offset(),

					// Left border width of context's parent.
						borderLeft = parseInt(ch.utils.getStyles(element, "border-left-width"), 10),

					// Top border width of context's parent.
						borderTop = parseInt(ch.utils.getStyles(element, "border-top-width"), 10);

					// Returns left and top position of relative parent and updates offset on relativeParent object.
					return {
						"left": relativeParent.left = parentOffset.left + borderLeft,
						"top": relativeParent.top = parentOffset.top + borderTop
					};
				};
				
				return self;
			}()),

		/**
		* Calculates left and top position from specific points.
		* @private
		* @name ch.Positioner#getCoordinates
		* @function
		* @param {String} points String with points to be calculated.
		* @returns Offset measures
		* @example
		* var foo = getCoordinates("lt rt");
		* 
		* foo = {
		*     left: Number,
		*     top: Number
		* };
		*/
			getCoordinates = function (pts) {

				// Calculates left or top position from points related to specific axis (X or Y).
				// TODO: Complete cases: X -> lc, cl, rc, cr. Y -> tm, mt, bm, mb.
				var calculate = function (reference) {

					var r;

					switch (reference) {
					// X references
					case "ll": r = context.left + offset[0]; break;
					case "lr": r = context.right + offset[0]; break;
					case "rl": r = context.left - $element.outerWidth() + offset[0]; break;
					case "rr": r = context.right - $element.outerWidth() + offset[0]; break;
					case "cc": r = context.left + (context.width / 2) - ($element.outerWidth() / 2) + offset[0]; break;
					// Y references
					case "tt": r = context.top + offset[1]; break;
					case "tb": r = context.bottom + offset[1]; break;
					case "bt": r = context.top - $element.outerHeight() + offset[1]; break;
					case "bb": r = context.bottom - $element.outerHeight() + offset[1]; break;
					case "mm": r = context.top + (context.height / 2) - ($element.outerHeight() / 2) + offset[1]; break;
					}

					return r;
				},

				// Splitted points
					splittedPoints = pts.split(" ");

				// Calculates left and top with references to X and Y axis points (crossed points)
				return {
					"left": calculate(splittedPoints[0].charAt(0) + splittedPoints[1].charAt(0)),
					"top": calculate(splittedPoints[0].charAt(1) + splittedPoints[1].charAt(1))
				};
			},

		/**
		* Gets new coordinates and checks its space into viewport.
		* @private
		* @name ch.Positioner#getPosition
		* @function
		* @returns Offset measures
		*/
			getPosition = function () {

				// Gets coordinates from main points
				var coordinates = getCoordinates(points);

				// Update friendly classname
				// TODO: Is this ok in this place?
				friendly = CLASS_MAP[points];

				// Default behavior: returns left and top offset related to main points
				if (!conf.reposition) { return coordinates; }

				if (points !== "lt lb" && points !== "rt rb" && points !== "lt rt") { return coordinates; }

				// Intelligence
				// TODO: Improve and unify intelligence code
				var newData,
					newPoints = points,
					offsetX = /*relativeParent.left + */offset[0],
					offsetY = /*relativeParent.top + */offset[1];
				
				if (!parentIsBody) {
					offsetX += relativeParent.left;
					offsetY += relativeParent.top;
				}

				// Viewport limits (From bottom to top)
				if (coordinates.top + offsetY + $element.outerHeight() > ch.viewport.bottom && points !== "lt rt") {
					newPoints = newPoints.charAt(0) + "b " + newPoints.charAt(3) + "t";
					newData = getCoordinates(newPoints);

					newData.friendly = CLASS_MAP[newPoints];

					if (newData.top + offsetY > ch.viewport.top) {
						coordinates.top = newData.top - (2 * offset[1]);
						coordinates.left = newData.left;
						friendly = newData.friendly;
					}
				}

				// Viewport limits (From right to left)
				if (coordinates.left + offsetX + $element.outerWidth() > ch.viewport.right) {
					// TODO: Improve this
					var orientation = (newPoints.charAt(0) === "r") ? "l" : "r";
					// TODO: Use splice or slice
					newPoints = orientation + newPoints.charAt(1) + " " + orientation + newPoints.charAt(4);

					newData = getCoordinates(newPoints);
					newData.friendly = CLASS_MAP[newPoints];

					if (newData.left + offsetX > ch.viewport.left) {
						coordinates.top = newData.top;
						coordinates.left = newData.left - (2 * offset[0]);
						friendly = newData.friendly;
					}
				}

				// Returns left and top offset related to modified points
				return coordinates;
			},

		/**
		* Reference that stores last changes on coordinates for evaluate necesaries redraws.
		* @private
		* @name ch.Positioner#lastCoordinates
		* @type Object
		*/
			lastCoordinates = {},

		/**
		* Checks if there are changes on coordinates to reposition the element.
		* @private
		* @name ch.Positioner#draw
		* @function
		*/
			draw = function () {

				if (ch.utils.getStyles($element[0], "width") !== "auto") {
					$element.css({ left: 0, top: 0 });
				}

				// Gets definitive coordinates for element repositioning
				var coordinates = getPosition();

				// Coordinates equal to last coordinates means that there aren't changes on position
				// TODO: Avoid redraw when corrdinates are same. We set to 0 the
				// css left and top coordinates for correct width calculations
				if (coordinates.left === lastCoordinates.left && coordinates.top === lastCoordinates.top) {
					if (ch.utils.getStyles($element[0], "width") !== "auto") {
						$element.css({ left: lastCoordinates.left, top: lastCoordinates.top });
					}

					return;
				}

				// If there are changes, it stores new coordinates on lastCoordinates
				lastCoordinates = coordinates;

				// Removes all classnames related to friendly positions and adds classname for new points
				// TODO: improve this method. maybe knowing which one was the last added classname
				var updateClassName = function (element) {
					element.removeClass("ch-left ch-top ch-right ch-bottom ch-center").addClass(friendly);
				};

				// Element reposition (Updates element position based on new coordinates)
				updateClassName($element.css({ left: coordinates.left, top: coordinates.top }));

				// Context class-names
				if (contextIsNotViewport) { updateClassName(context.element); }
			},

		/**
		* Constructs a new position, gets viewport size, checks for relative parent's offset,
		* finds the context and sets the position to a given element.
		* @private
		* @function
		* @constructs
		* @name ch.Positioner#init
		*/
			init = function () {
				// Calculates viewport position for prevent auto-scrolling
				//ch.viewport.getOffset();
				
				// Refresh parent parameter
				// TODO: Put this code in some better place, where it's been calculated few times
				parentIsBody = $element.parent().length > 0 && $element.parent().prop("tagName") === "BODY";
				
				// Calculates relative parent position
				relativeParent.getOffset();

				// If context isn't the viewport, calculates its position and size
				if (contextIsNotViewport) { context.getOffset(); }

				// Calculates coordinates and redraws if it's necessary	
				draw();
			},

		/**
		* Friendly classname relative to position points.
		* @private
		* @name ch.Positioner#friendly
		* @type Boolean
		* @default "ch-center"
		*/
			friendly = CLASS_MAP[points];

		/**
		* Control object that allows to change configuration properties, refresh current position or get current configuration.
		* @public
		* @name ch.Positioner#position
		* @function
		* @param {Object} [o] Configuration object.
		* @param {String} ["refresh"] Refresh current position.
		* @returns Control Object
		* @example
		* // Sets a new configuration
		* var foo = ch.positioner({ ... });
		*     foo.position({ ... });
		* @example
		* // Refresh current position
		*     foo.position("refresh");
		* @example
		* // Gets current configuration properties
		*     foo.position();
		*/
		that.position = function (o) {

			var r = that;

			switch (typeof o) {

			// Changes configuration properties and repositions the element
			case "object":
				// New points
				if (ch.utils.hasOwn(o, "points")) { points = o.points; }

				// New reposition
				if (ch.utils.hasOwn(o, "reposition")) { conf.reposition = o.reposition; }

				// New offset (splitted)
				if (ch.utils.hasOwn(o, "offset")) { offset = o.offset.split(" "); }

				// New context
				if (ch.utils.hasOwn(o, "context")) {
					// Sets conf value
					conf.context = o.context;

					// Regenerate the context object
					context = getContext();
				}

				// Reset
				init();

				break;

			// Refresh current position
			case "string":
				if (o !== "refresh") {
					alert("Chico UI error: expected to find \"refresh\" parameter on position() method.");
				}

				// Reset
				init();

				break;

			// Gets current configuration
			case "undefined":
				r = {
					"context": context.element,
					"element": $element,
					"points": points,
					"offset": offset.join(" "),
					"reposition": conf.reposition
				};

				break;
			}

			return r;
		};

		/**
		* @ignore
		*/

		// Sets position of element as absolute to allow positioning
		$element.css("position", "absolute");

		// Inits positioning
		init();

		// Layout change and Viewport change, event listeners
		ch.utils.window.bind(ch.events.VIEWPORT.CHANGE + " " + ch.events.LAYOUT.CHANGE, function (event) {
			// Only recalculates if element is visible
			if (!$element.is(":visible")) { return; }

			// If context isn't the viewport...
			if (contextIsNotViewport) {
				// On resize and layout change, recalculates relative parent position
				relativeParent.getOffset();

				// Recalculates its position and size
				context.getOffset();
			}

			draw();
		});

		return that.position;
	};

}());