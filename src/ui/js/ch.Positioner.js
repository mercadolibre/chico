/**
* Positioner lets you centralize and manage changes related to positioned elements. Positioner returns an utility that resolves positioning for all widget.
* @name Positioner
* @class Positioner
* @memberOf ch
* @param {Object} conf Configuration object with positioning properties.
* @param {String} conf.element Reference to the DOM Element to be positioned.
* @param {String} [conf.context] It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the viewport.
* @param {String} [conf.points] Points where element will be positioned, specified by configuration or centered by default.
* @param {String} [conf.offset] Offset in pixels that element will be displaced from original position determined by points. It's specified by configuration or zero by default.
* @param {Boolean} [conf.reposition] Parameter that enables or disables reposition intelligence. It's disabled by default.
* @requires ch.Viewport
* @see ch.Viewport
* @returns {Function} The Positioner returns a Function that it works in 3 ways: as a setter, as a getter and with the "refresh" parameter refreshes the position.
* @exampleDescription
* Instance the Positioner It requires a little configuration.
* The default behavior place an element centered into the Viewport.
*
* @example
* var positioned = ch.positioner({
*     element: "#element1",
* });
* @exampleDescription 1. Getting the current configuration properties.
* @example
* var configuration = positioned()
* @exampleDescription 2. Updates the current position with <code>refresh</code> as a parameter.
* @example
* positioned("refresh");
* @exampleDescription 3. Define a new position
* @example
* positioned({
*     element: "#element2",
*     context: "#context2",
*     points: "lt rt"
* });
* @exampleDescription <strong>Offset</strong>: The positioner could be configurated with an offset.
* This example show an element displaced horizontally by 10px of defined position.
* @example
* var positioned = ch.positioner({
*     element: "#element3",
*     context: "#context3",
*     points: "lt rt",
*     offset: "10 0"
* });
* @exampleDescription <strong>Reposition</strong>: Repositionable feature moves the postioned element if it can be shown into the viewport.
* @example
* var positioned = ch.positioner({
*     element: "#element4",
*     context: "#context4",
*     points: "lt rt",
*     reposition: true
* });
*/

(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	var $window = $(window),
		parseInt = window.parseInt;

	/**
	 * Converts points in className.
	 * @private
	 * @name ch.Positioner#classNamePoints
	 * @function
	 * @returns String
	 */
	var classNamePoints = function (points) {
		return "ch-points-" + points.replace(" ", "");
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
			$window.trigger(ch.events.viewport.CHANGE);

			// Change scrolling status
			changing = false;
		};

	// Resize and Scroll events binding. These updates respectives boolean variables
	$window.bind("resize scroll", function () { changing = true; });

	// Interval that checks for resizing status and triggers specific events
	window.setInterval(triggerChange, 0);

	// Returns Positioner Abstract Component
	function Positioner(conf) {

		// Validation for required "element" parameter
		if (!ch.util.hasOwn(conf, "element")) {
			throw new window.Error('Chico UI error: Expected to find \"element\" as required configuration parameter of ch.Positioner.');

			return;
		}

		/**
		 * Configuration parameter that enables or disables reposition intelligence. It's disabled by default.
		 * @private
		 * @name ch.Positioner#reposition
		 * @type Boolean
		 * @default false
		 * @exampleDescription Repositionable Element if it can't be shown into viewport area
		 * @example
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
		 * @exampleDescription Element left-top point = Context right-bottom point
		 * @example
		 * ch.positioner({
		 *     element: "#element1",
		 *     points: "lt rt"
		 * });
		 * @exampleDescription Element center-middle point = Context center-middle point
		 * @example
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
		 * @exampleDescription Moves 5px to right and 5px to bottom
		 * @example
		 * ch.positioner({
		 *     element: "#element1",
		 *     offset: "5 5"
		 * });
		 * @exampleDescription It will be worth:
		 * @example
		 * offset[0] = 5;
		 * offset[1] = 5;
		 * @exampleDescription Moves 10px to right and 5px to top
		 * @example
		 * ch.positioner({
		 *     element: "#element1",
		 *     offset: "10 -5"
		 * });
		 * @exampleDescription It will be worth:
		 * @example It will be worth:
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
				if (!ch.util.hasOwn(conf, "context") || !conf.context || conf.context === "viewport") {
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
		 * Reference to know if direct parent is the body HTML element.
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
				var element = (contextIsNotViewport) ? context.element.offsetParent()[0] : window.document.body,

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
				self.getOffset = function () {
					// If first parent relative is Body, don't recalculate position
					if (element.tagName === "BODY") { return; }

					// Offset of first parent relative
					var parentOffset = $(element).offset(),

					// Left border width of context's parent.
						borderLeft = parseInt(ch.util.getStyles(element, "border-left-width"), 10),

					// Top border width of context's parent.
						borderTop = parseInt(ch.util.getStyles(element, "border-top-width"), 10);

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
		 * @exampleDescription
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

					// Use Position or Offset of Viewport if position is fixed or absolute respectively
					var ctx = (!contextIsNotViewport && ch.support.fixed) ? ch.viewport.getPosition() : context,

					// Returnable value
						r;

					switch (reference) {
					// X references
					case "ll": r = ctx.left + offset[0]; break;
					case "lr": r = ctx.right + offset[0]; break;
					case "rl": r = ctx.left - $element.outerWidth() + offset[0]; break;
					case "rr": r = ctx.right - $element.outerWidth() + offset[0]; break;
					case "cc": r = ctx.left + (ctx.width / 2) - ($element.outerWidth() / 2) + offset[0]; break;
					// Y references
					case "tt": r = ctx.top + offset[1]; break;
					case "tb": r = ctx.bottom + offset[1]; break;
					case "bt": r = ctx.top - $element.outerHeight() + offset[1]; break;
					case "bb": r = ctx.bottom - $element.outerHeight() + offset[1]; break;
					case "mm": r = ctx.top + (ctx.height / 2) - ($element.outerHeight() / 2) + offset[1]; break;
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

				// Update classPoints
				// TODO: Is this ok in this place?
				classPoints = classNamePoints(points);

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

					newData.classPoints = classNamePoints(newPoints);

					if (newData.top + offsetY > ch.viewport.top) {
						coordinates.top = newData.top - (2 * offset[1]);
						coordinates.left = newData.left;
						classPoints = newData.classPoints;
					}
				}

				// Viewport limits (From right to left)
				if (coordinates.left + offsetX + $element.outerWidth() > ch.viewport.right) {
					// TODO: Improve this
					var orientation = (newPoints.charAt(0) === "r") ? "l" : "r";
					// TODO: Use splice or slice
					newPoints = orientation + newPoints.charAt(1) + " " + orientation + newPoints.charAt(4);

					newData = getCoordinates(newPoints);

					newData.classPoints = classNamePoints(newPoints);

					if (newData.left + offsetX > ch.viewport.left) {
						coordinates.top = newData.top;
						coordinates.left = newData.left - (2 * offset[0]);
						classPoints = newData.classPoints;
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

				// New element position
				var coordinates,

					// Update classname related to position
					updateClassName = function ($element) {
						$element.removeClass(lastClassPoints).addClass(classPoints);
					};

				// Save the last className before calculate new points
				lastClassPoints = classPoints;

				// Gets definitive coordinates for element repositioning
				coordinates = getPosition();

				// Coordinates equal to last coordinates means that there aren't changes on position
				if (coordinates.left === lastCoordinates.left && coordinates.top === lastCoordinates.top) {
					return;
				}

				// If there are changes, it stores new coordinates on lastCoordinates
				lastCoordinates = coordinates;

				// Element reposition (Updates element position based on new coordinates)
				updateClassName($element.css({ "left": coordinates.left, "top": coordinates.top }));

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
		 * Listen to LAYOUT.CHANGE and VIEWPORT.CHANGE events and recalculate data as needed.
		 * @private
		 * @function
		 * @name ch.Positioner#changesListener
		 */
			changesListener = function (event) {
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
			},

		/**
		 * Position "element" as fixed or absolute as needed.
		 * @private
		 * @function
		 * @name ch.Positioner#addCSSproperties
		 */
			addCSSproperties = function () {

				// Fixed position behavior
				if (!contextIsNotViewport && ch.support.fixed) {

					// Sets position of element as fixed to avoid recalculations
					$element.css("position", "fixed");

					// Bind reposition only on resize
					$window.bind("resize", changesListener);

				// Absolute position behavior
				} else {

					// Sets position of element as absolute to allow continuous positioning
					$element.css("position", "absolute");

					// Bind reposition recalculations (scroll, resize and changeLayout)
					$window.bind(ch.events.viewport.CHANGE + " " + ch.events.layout.CHANGE, changesListener);
				}

			},

		/**
		 * Classname relative to position points.
		 * @private
		 * @name ch.Positioner#classPoints
		 * @type String
		 * @default "ch-points-cmcm"
		 */
			classPoints = classNamePoints(points),

		/**
		 * The last className before calculate new points.
		 * @private
		 * @name ch.Positioner#lastClassPoints
		 * @type string
		 */
			lastClassPoints = classPoints;

		/**
		 * Control object that allows to change configuration properties, refresh current position or get current configuration.
		 * @ignore
		 * @protected
		 * @name ch.Positioner#position
		 * @function
		 * @param {Object} [o] Configuration object.
		 * @param {String} ["refresh"] Refresh current position.
		 * @returns Control Object
		 * @exampleDescription Sets a new configuration
		 * @example
		 * var foo = ch.positioner({ ... });
		 * foo.position({ ... });
		 * @exampleDescription Refresh current position
		 * @example
		 * foo.position("refresh");
		 * @exampleDescription Gets current configuration properties
		 * @example
		 * foo.position();
		 */
		that.position = function (o) {

			var r = that;

			switch (typeof o) {

			// Changes configuration properties and repositions the element
			case "object":
				// New points
				if (ch.util.hasOwn(o, "points")) { points = o.points; }

				// New reposition
				if (ch.util.hasOwn(o, "reposition")) { conf.reposition = o.reposition; }

				// New offset (splitted)
				if (ch.util.hasOwn(o, "offset")) { offset = o.offset.split(" "); }

				// New context
				if (ch.util.hasOwn(o, "context")) {
					// Sets conf value
					conf.context = o.context;

					// Clear the conf.context variable
					if (o.context === "viewport") { conf.context = undefined; }

					// Regenerate the context object
					context = getContext();

					// Update CSS properties to element (position fixed or absolute)
					addCSSproperties();
				}

				// Reset
				init();

				break;

			// Refresh current position
			case "string":
				if (o !== "refresh") {
					window.alert("Chico UI error: expected to find \"refresh\" parameter on position() method of Positioner component.");
				}

				// Reset
				init();

				break;

			// Gets current configuration
			case "undefined":
			default:
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

		// Apply CSS properties to element (position fixed or absolute)
		addCSSproperties();

		// Inits positioning
		init();

		return that.position;
	}

	Positioner.prototype.name = 'positioner';
	Positioner.prototype.constructor = Positioner;

	ch.Positioner = Positioner;

}(this, this.jQuery, this.ch));