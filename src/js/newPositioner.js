/**
 * Positioner is an utility that centralizes and manages changes related to positioned elements, and returns an utility that resolves positioning for all UI-Objects.
 * @abstract
 * @name newPositioner
 * @class newPositioner
 * @memberOf ch
 * @requires ch.Viewport
 * @returns {Positioner Component Constructor Object}
 */
ch.newPositioner = (function () {
	
	/**
     * A map to reference the input points to output friendly classname.
     * @private
     * @name CLASS_MAP
     * @type {Map Object}
     * @memberOf ch.newPositioner
     */
	// TODO: incluir mas especificaciones como ch-out
	// TODO: analizar si reducir cantidad de clases ej:ch-out-left-bottom
	// TODO: completar clases con todas las posiciones que se soportan
	var CLASS_MAP = {
		//"lt lt"
		"lt lb": "ch-left ch-bottom",
		"lb lt": "ch-left ch-top",
		//"lm lm"
		"lt rt": "ch-right",
		//"lt rb", "lb rt", "lm rm", "rt rt"
		"rt rb": "ch-right ch-bottom",
		"rb rt": "ch-right ch-top",
		//"rm rm", "ct ct", "ct cb", "cb ct"
		"cm cm": "ch-center"
	},
	
	/**
     * A map to reference the input points to output correlative points for re-positioning intelligence.
     * @private
     * @name CORRELATION_MAP
     * @type {Map Object}
     * @memberOf ch.newPositioner
     */
		CORRELATION_MAP = {
			"lt lb": "lb lt",
			"lb lt": "lt lb",
			"lt rt": "lt lb",
			"rt rb": "rb rt",
			"rb rt": "rt rb"
		},
	
	/**
     * A reference to know when window is scrolled
     * @private
     * @name scrolling
     * @type {Boolean}
     * @memberOf ch.newPositioner
     */
		scrolling = false,
	
	/**
     * A reference to know when window is resized
     * @private
     * @name resizing
     * @type {Boolean}
     * @memberOf ch.newPositioner
     */
		resizing = false,
	
	/**
     * Checks that window is scrolled, updates viewport position and triggers internal scroll event
     * @private
     * @function
     * @memberOf ch.newPositioner
     */
		onScroll = function () {
			// No scrolling, no execution
			if (!scrolling) { return; }
			
			// Updates viewport position
			ch.viewport.getOffset();
			
			// Triggers internal scroll event
			ch.utils.window.trigger(ch.events.VIEWPORT.SCROLL);
			
			// Change scrolling status
			scrolling = false;
			
			return;
		},
	
	/**
     * Checks that window is resized, updates viewport size and triggers internal resize event
     * @private
     * @function
     * @memberOf ch.newPositioner
     */
		onResize = function () {
			// No resizing, no execution
			if (!resizing) { return; }
			
			// Updates viewport size
			ch.viewport.getSize();
			
			// Triggers internal resize event
			ch.utils.window.trigger(ch.events.VIEWPORT.RESIZE);
			
			// Change resizing status
			resizing = false;
			
			return;
		};
	
	// Resize and Scroll events binding that update respectives boolean variables
	ch.utils.window
		.bind("resize", function () { resizing = true; })
		.bind("scroll", function () { scrolling = true; });
	
	// Interval that checks for resizing status and triggers specific events
	setInterval(function () { onResize(); onScroll(); }, 350);
	
	/**
	 * Positioner is an utility that resolves positioning for all UI-Objects.
	 * @function
	 * @memberOf ch
	 * @param {Configuration Object} conf Configuration object with positioning properties.
	 * @returns {Positioner Control Object}
	 * @example
	 * // First example
	 * ch.positioner({
	 *     element: "#element1",
	 *     context: "#context1",
	 *     points: "lt rt"                //  Element left-top point = Context left-bottom point
	 * });
	 * @example  
	 * // Second example
	 * ch.positioner({
	 *     element: "#element2",
	 *     context: "#context2",
	 *     points: "lt lb"                //  Element center-middle point = Context center-middle point
	 * });
	 */
	return function (conf) {
		
		if (!ch.utils.hasOwn(conf, "element")) {
			alert("Chico-UI error: Expected to find element as configuration parameter on Positioner.");
			
			return;
		}
		
		/**
	     * Configuration parameter that enables or disables re-position intelligence of Positioner.
	     * @private
	     * @name reposition
	     * @type {Boolean}
	     * @memberOf ch.newPositioner
	     */
		conf.reposition = conf.reposition || false;
		
		/**
	     * Reference to an internal component instance that will be exposed.
	     * @private
	     * @name that
	     * @type {Object}
	     * @memberOf ch.newPositioner
	     */
		var that = {},
		
		/**
	     * Reference to the DOM Element beign positioned.
	     * @private
	     * @name $element
	     * @type {jQuery Object}
	     * @memberOf ch.newPositioner
	     */
			$element = $(conf.element),
		
		/**
	     * Points where element will be positioned, specified by configuration or centered by default.
	     * @private
	     * @name points
	     * @type {String}
	     * @example
	     * // Element left-top point = Context left-bottom point
	     * points: "lt rt"
	     * @example
	     * // Element center-middle point = Context center-middle point
	     * points: "lt lb"
	     */
			points = conf.points || "cm cm",
		
		/**
	     * Offset in pixels that element will be displaced from original position determined by points. It's specified by configuration or zero by default.
	     * @private
	     * @name offset
	     * @type {Array with X and Y references}
	     * @example
	     * // Moves 10px to right and 5px to top
	     * offset[0] = 10;
	     * offset[1] = -5;
	     * @example
	     * // Moves 15px to left and 20px to bottom
	     * offset[0] = -15;
	     * offset[1] = 20;
	     * @example
	     * // Moves 5px to right and 5px to bottom
	     * offset[0] = 5;
	     * offset[1] = 5;
	     */
			offset = (conf.offset || "0 0").split(" "),
		
		/**
		 * Defines context element, its size, position, and methods to re-calculate all.
		 * @function
		 * @name getContext
		 * @memberOf ch.newPositioner
		 * @returns {Context Object}
		 */
			getContext = function () {
				
				// Parse as Integer offset values
				offset[0] = parseInt(offset[0], 10);
				offset[1] = parseInt(offset[1], 10);
				
				// Object to be returned.
				var self = {};
				
				/**
			     * Width of context.
			     * @public
			     * @name width
			     * @type {Number}
			     * @memberOf context
			     */
				self.width =
				
				/**
			     * Height of context.
			     * @public
			     * @name height
			     * @type {Number}
			     * @memberOf context
			     */
					self.height =
				
				/**
			     * Left offset of context.
			     * @public
			     * @name left
			     * @type {Number}
			     * @memberOf context
			     */
					self.left =
				
				/**
			     * Top offset of context.
			     * @public
			     * @name top
			     * @type {Number}
			     * @memberOf context
			     */
					self.top = 0;
				
				// Context from configuration
				if (ch.utils.hasOwn(conf, "context")) {
					
					/**
				     * Context HTML Element.
				     * @public
				     * @name element
				     * @type {HTMLElement}
				     * @memberOf context
				     */
					self.element = $(conf.context);
					
					/**
				     * Re-calculates width and height of context and updates context.width and context.height.
				     * @public
				     * @function
				     * @name getSize
				     * @returns {Size Object}
				     * @memberOf context
				     */
					self.getSize = function () {
						return {
							width: context.width = self.element.outerWidth(),
							height: context.height = self.element.outerHeight()
						};
					};
					
					/**
				     * Re-calculates left and top of context and updates context.left and context.top.
				     * @public
				     * @function
				     * @name getOffset
				     * @returns {Offset Object}
				     * @memberOf context
				     */
					self.getOffset = function () {
						
						// Gets offset of context element
						var contextOffset = self.element.offset();
						
						// Left and top are calculated including offset and relative parent positions
						return {
							left: context.left = contextOffset.left + offset[0] - relativeParent.left,
							top: context.top = contextOffset.top + offset[1] - relativeParent.top
						};
					};
				
				// Context by default is viewport
				} else {
					
					// Self references to ch.viewport
					self = ch.viewport;
					
				}
				
				return self;
			},
		
		/**
		 * It's the first of context's parents that is relativitly positioned.
		 * @name relativeParent
		 * @class relativeParent
		 * @memberOf ch.newPositioner
		 * @returns {Relative Parent Object}
		 */
			relativeParent = (function () {
				
				// Context's parent that's relativitly positioned.
				// TODO: si es body no calcular borders
				var element = $element.offsetParent()[0],
				
				// Object to be returned.
					self = {};
				
				/**
			     * Left offset of relative parent.
			     * @public
			     * @name left
			     * @type {Number}
			     * @memberOf relativeParent
			     */
				self.left =
				
				/**
			     * Top offset of relative parent.
			     * @public
			     * @name top
			     * @type {Number}
			     * @memberOf relativeParent
			     */
					self.top = 0;
				
				/**
			     * Re-calculates left and top of relative parent of context and updates relativeParent.left and relativeParent.top.
			     * @public
			     * @function
			     * @name getOffset
			     * @returns {Offset Object}
			     * @memberOf relativeParent
			     */
			     // TODO: en ie6 el borde del padre relativo empuja demasiado (tambien en el positioner viejo)
				self.getOffset = function () {
					// If first parent relative is Body, don't re-calculate position
					if (element.tagName === "BODY") { return; }
					
					// Offset of first parent relative
					var parentOffset = $(element).offset(),
					
				    // Left border width of context's parent.
						borderLeft = parseInt(ch.utils.getStyles(element, "border-left-width"), 10),
					
					// Top border width of context's parent.
						borderTop = parseInt(ch.utils.getStyles(element, "border-top-width"), 10);

					// Returns left and top position of relative parent and updates relativeParent.left and relativeParent.top.
					return {
						left: relativeParent.left = parentOffset.left + borderLeft,
						top: relativeParent.top = parentOffset.top + borderTop
					};
				};
				
				return self;
			}()),
		
		/**
		 * Calculates left and top position from specific points.
		 * @function
		 * @name getCoordinates
		 * @memberOf ch.newPositioner
		 * @param {Points} points String with points to be calculated.
		 * @returns {Offset measures}
		 * @example
		 * var foo = getCoordinates("lt rt");
		 * 
		 * foo = {
		 *     left: Number,
		 *     top: Number
		 * };
		 */
			getCoordinates = function (points) {
				
				/**
				 * Calculates left or top position from points related to specific axis (X or Y).
				 * @function
				 * @memberOf getCoordinates
				 * @param {Axis Points} reference String with points of an axis.
				 * @returns {Position value}
				 * @example
				 * // Calculates X axis measure. It returns a left position value.
				 * _calculate("lr");
				 * @example
				 * // Calculates Y axis measure. It returns a top position value.
				 * _calculate("tt");
				 */
				var calculate = function (reference) {
					
					var r;
					
					switch (reference) {
					// X references
					// TODO: lc, rl, rc, cl, cr
					case "ll": r = context.left; break;
					case "lr": r = context.left + context.width; break;
					case "rr": r = context.left + context.width - $element.outerWidth(); break;
					case "cc": r = context.left + context.width / 2 - $element.outerWidth() / 2; break;
					// Y references
					// TODO: tm, bb, bm, mt, mb
					case "tt": r = context.top; break;
					case "tb": r = context.top + context.height; break;
					case "bt": r = context.top - $element.outerHeight(); break;
					case "mm": r = context.top + context.height / 2 - $element.outerHeight() / 2; break;
					}
					
					return r;
				},
				
				// Splitted points
					splittedPoints = points.split(" ");
				
				// Calculates left and top with references to X and Y axis points
				return {
					left: calculate(splittedPoints[0].charAt(0) + splittedPoints[1].charAt(0)),
					top: calculate(splittedPoints[0].charAt(1) + splittedPoints[1].charAt(1))
				};
			},
		
		/**
	     * Re-position intelligence status.
	     * @private
	     * @name repositioned
	     * @type {Boolean}
	     * @memberOf ch.newPositioner
	     */
			repositioned,
		
		/**
		 * Gets new coordinates and checks it's space into viewport.
		 * @function
		 * @name getPosition
		 * @memberOf ch.newPositioner
		 * @returns {Offset measures}
		 */
			getPosition = function () {
				
				// Gets coordinates from main points
				var coordinates = getCoordinates(points);
				
				// Default behavior: returns left and top offset related to main points
				if (!conf.reposition) {
					return {
						left: coordinates.left,
						top: coordinates.top
					};
				}
				
				// Intelligence
				// TODO: Unificar los 3 casos de inteligencia en uno (solo cambian las 2 condiciones)
				var newPoints, newCoordinates;
				
				// Elements positioned at bottom without space in viewport (Element bottom > Viewport bottom)
				// TODO: If points are in CORRELATION_MAP and last point is "b", then do it
				if (
					(points === "lt lb" || points === "rt rb") &&
						(coordinates.top + offset[1] + $element.outerHeight() > ch.viewport.height || repositioned)
				) {
					newPoints = repositioned || CORRELATION_MAP[points];
					newCoordinates = getCoordinates(newPoints);
					
					// Elements positioned at top without space in viewport (Element top < Viewport top)
					if (newCoordinates.top + offset[1] > ch.viewport.top) {
						coordinates = newCoordinates;
						repositioned = (repositioned) ? null : points;
						points = newPoints;
					}
				}
				
				if (
					(points === "lb lt" || points === "rb rt") &&
						(coordinates.top + offset[1] < ch.viewport.top || repositioned)
				) {
					newPoints = repositioned || CORRELATION_MAP[points];
					newCoordinates = getCoordinates(newPoints);
					
					// Elements positioned at top without space in viewport (Element top < Viewport top)
					if (newCoordinates.top + offset[1] + $element.outerHeight() < ch.viewport.height) {
						coordinates = newCoordinates;
						repositioned = (repositioned) ? null : points;
						points = newPoints;
					}
				}
				
				// Elements positioned at right without space in viewport (Element right > Viewport right)
				if (
					(points === "lt rt") &&
						(coordinates.left + offset[0] + $element.outerWidth() > ch.viewport.width || repositioned)
				) {
					newPoints = repositioned || CORRELATION_MAP[points];
					newCoordinates = getCoordinates(newPoints);
					
					// Elements positioned at top without space in viewport (Element top < Viewport top)
					if (newCoordinates.left + offset[0] > ch.viewport.left) {
						coordinates = newCoordinates;
						repositioned = (repositioned) ? null : points;
						points = newPoints;
					}
				}
				
				// Returns left and top offset related to modified points
				return {
					left: coordinates.left,
					top: coordinates.top
				};
			},
		
		/**
	     * Stores last changes on coordinates for evaluate necesaries redraws and reflows.
	     * @private
	     * @name lastCoordinates
	     * @type {Offset Object}
	     * @memberOf ch.newPositioner
	     */
			lastCoordinates = {},
		
		/**
		 * Triggers calculations of coordinates and checks if there are changes to re-positionate element.
		 * @function
		 * @name position
		 * @memberOf ch.newPositioner
		 * @returns {Positioned Element}
		 */
			position = function () {
				
				// Gets definitive coordinates for element re-positioning
				var coordinates = getPosition();
				
				// Coordinates equal to last coordinates means that there aren't changes on position
				if (coordinates.left === lastCoordinates.left && coordinates.top === lastCoordinates.top) { return; }
				
				// If there are changes, it stores new coordinates on lastCoordinates
				lastCoordinates = coordinates;
				
				// Element re-position
				return $element
					// Removes all classnames related to friendly positions
					// TODO: mejorar este metodo? quizas sabiendo cual era la ultima class agregada
					.removeClass("ch-left ch-top ch-right ch-bottom ch-center")
					
					// Add classname for new points
					.addClass(CLASS_MAP[points])
					
					// Updates element position based on new coordinates
					.css({
						left: coordinates.left,
						top: coordinates.top
					});
			},
		
		/**
		 * Re-calculates context position and size on "layout change" internal event triggered.
		 * @function
		 * @name onLayoutChange
		 * @memberOf ch.newPositioner
		 * @returns {Positioned Element}
		 */
			onLayoutChange = function () {
				// Only re-calculates if element is visible
				if (!$element.is(":visible")) { return; }
				
				// Re-calculates relative parent position
				relativeParent.getOffset();
				
				// If context isn't the viewport, re-calculates its position and size
				if (context !== ch.viewport) {
					context.getSize();
					context.getOffset();
				}
				
				return position();
			},
		
		/**
	     * Constructs a new positioning, get viewport size, check for relative parent's offests,
	     * find the context and set the position to a given element.
	     * @constructs
	     * @private
	     * @function
	     * @name init
	     * @memberOf ch.newPositioner
		 * @returns {Positioned Element}
	     */
			init = function () {
				// Re-calculates relative parent position
				relativeParent.getOffset();
				
				// If context isn't the viewport, re-calculates its position and size
				if (context !== ch.viewport) {
					context.getSize();
					context.getOffset();
				}
				
				return position();
			},
			
		/**
		 * Context is a reference to positions and sizes of element that will be considered to carry out the position.
		 * @name context
		 * @type {Context Object}
		 * @memberOf ch.newPositioner
		 */
			context = getContext();
		
		/**
		 * Control panel that allows change configuration properties, refresh current position or get current configuration.
		 * @name position
		 * @function
		 * @param {Object} [o] Configuration object
		 * @param {String} ["refresh"] Refresh current position
		 * @memberOf ch.newPositioner
		 * @returns {Control Panel Object}
		 * @example
		 * // Sets a new configuration
		 * var foo = ch.positioner({ ... });
		 *     foo.position({ ... });
		 * @example
		 * // Refresh current position
		 *     foo.position("refresh");
		 * @example
		 * // Gets current configuration
		 *     foo.position();
		 */
		that.position = function (o) {
			
			var r;
			
			switch (typeof o) {
			
			// Changes configuration properties and re-positions element
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
					
					// Re-generate context object
					context = getContext();
				}
				
				// Reset
				init();
				
				r = that;
				
				break;
			
			// Refresh current position
			case "string":
				if (o !== "refresh") {
					alert("Chico-UI error: expected to find \"refresh\" parameter on position() method.");
				}
				
				// Reset
				init();
				
				r = that;
				
				break;
			
			// Gets current configuration
			case "undefined":
				r = {
					context: context.element,
					element: $element,
					points: points,
					offset: offset.join(" "),
					reposition: conf.reposition
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
		
		// Change layout, resize and scroll event listeners
		ch.utils.window
			.bind(ch.events.LAYOUT.CHANGE, onLayoutChange)
			.bind(ch.events.VIEWPORT.RESIZE + " " + ch.events.VIEWPORT.SCROLL, function (event) {
				// Only re-calculates if element is visible
				if (!$element.is(":visible")) { return; }
				
				// On resize, if context isn't the viewport, re-calculates its position
				if (event.type === ch.events.VIEWPORT.RESIZE && context !== ch.viewport) {
					relativeParent.getOffset();
					context.getOffset();
				}
				
				return position();
			});
		
		return that;
	};
	
}());