/**
* Zoom shows a contextual reference to an augmented version of main declared image.
* @name Zoom
* @class Zoom
* @augments ch.Floats
* @requires ch.onImagesLoads
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.fx] Enable or disable fade effect on show. By default, the effect are disabled.
* @param {Boolean} [conf.context] Sets a reference to position of component that will be considered to carry out the position. By default is the anchor of HTML snippet.
* @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or "lt rt" by default.
* @param {String} [conf.offset] Sets the offset in pixels that component will be displaced from original position determined by points. It's specified by configuration or "20 0" by default.
* @param {String} [conf.content] This message will be shown when component needs to communicate that is in process of load. It's "Loading zoom..." by default.
* @param {Number} [conf.width] Width of floated area of zoomed image. Example: 500, "500px", "50%". Default: 350.
* @param {Number} [conf.height] Height of floated area of zoomed image. Example: 500, "500px", "50%". Default: 350.
* @returns itself
* @exampleDescription Create a Zoom component wrapping the original image with a anchor element pointing to a bigger version than the original.
* @example
* var widget = $(".example").zoom();
* @factorized
* @see ch.Floats
* @see ch.Modal
* @see ch.Tooltip
* @see ch.Layer
* @see ch.OnImagesLoads
*/
(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Zoom($el, conf) {

		/**
		 * Reference to an internal component instance, saves all the information and configuration properties.
		 * @private
		 * @name ch.Zoom#that
		 * @type itself
		 */
		var that = this;
		that.$element = $el;
		that.element = $el[0];
		that.type = 'zoom';
		conf = conf || {};

		/**
		 * Constructor
		 */
		conf = ch.util.clone(conf);

		conf.fx = conf.fx || false;

		conf.cache = false;

		// WAI-ARIA
		conf.aria = {};
		conf.aria.role = "tooltip";
		conf.aria.identifier = "aria-describedby";

		// Position
		conf.position = {};
		conf.position.context = conf.context || that.$element;
		conf.position.offset = conf.offset || "20 0";
		conf.position.points = conf.points || "lt rt";
		conf.reposition = false;

		// Transition message and size
		conf.content = conf.content || "Loading zoom...";
		conf.width = conf.width || 300;
		conf.height = conf.height || 300;

		// Closable configuration
		conf.closable = false;

		that.conf = conf;

		var isIE = $('html').hasClass('lt-ie10');

		/**
		 * Element showed before zoomed image is load. It's a transition message and its content can be configured through parameter "message".
		 * @private
		 * @name ch.Zoom#$loading
		 * @type Object
		 */
		/**
		 * Content configuration property.
		 * @protected
		 * @name ch.Modal#source
		 */
		var $loading = that.source = $("<p class=\"ch-zoom-loading ch-hide\">" + conf.content + "</p>").appendTo(that.$element);

	/**
	 * Inheritance
	 */

		that = ch.Floats.call(that);
		that.parent = ch.util.clone(that);

	/**
	 * Private Members
	 */

		/**
		 * Position of main anchor. It's for calculate cursor position hover the image.
		 * @private
		 * @name ch.Zoom#offset
		 * @type Object
		 */
		var offset = that.$element.offset(),

		/**
		 * Visual element that follows mouse movement for reference to zoomed area into original image.
		 * @private
		 * @name ch.Zoom#seeker
		 * @type Object
		 */
			seeker = {
				/**
				 * Element shown as seeker.
				 * @private
				 * @name shape
				 * @memberOf ch.Zoom#seeker
				 * @type Object
				 */
				"$shape": $("<div class=\"ch-zoom-seeker ch-hide\">"),

				/**
				 * Half of width of seeker element. It's only half to facilitate move calculations.
				 * @private
				 * @name width
				 * @memberOf ch.Zoom#seeker
				 * @type Number
				 */
				"width": 0,

				/**
				 * Half of height of seeker element. It's only half to facilitate move calculations.
				 * @private
				 * @name height
				 * @memberOf ch.Zoom#seeker
				 * @type Number
				 */
				"height": 0
			},

		/**
		 * Reference to main image declared on HTML code snippet.
		 * @private
		 * @name ch.Zoom#original
		 * @type Object
		 */
			original = (function () {
				// Define the content source
				var $img = that.$element.children("img");

				// Grab some data when image loads
				$img.onImagesLoads(function () {

					// Grab size of original image
					original.width = $img.prop("width");
					original.height = $img.prop("height");

					// Anchor size (same as image)
					that.$element.css({
						"width": original.width,
						"height": original.height
					});

					// Loading position centered at anchor
					$loading.css({
						"left": (original.width - $loading.width()) / 2,
						"top": (original.height - $loading.height()) / 2
					});

				});

				return {
					/**
					 * Reference to HTML Element of original image.
					 * @private
					 * @name img
					 * @memberOf ch.Zoom#original
					 * @type Object
					 */
					"$image": $img,

					/**
					 * Position of original image relative to viewport.
					 * @private
					 * @name offset
					 * @memberOf ch.Zoom#original
					 * @type Object
					 */
					"offset": {},

					/**
					 * Width of original image.
					 * @private
					 * @name width
					 * @memberOf ch.Zoom#original
					 * @type Number
					 */
					"width": 0,

					/**
					 * Height of original image.
					 * @private
					 * @name height
					 * @memberOf ch.Zoom#original
					 * @type Number
					 */
					"height": 0
				};
			}()),

		/**
		 * Relative size between zoomed and original image.
		 * @private
		 * @name ch.Zoom#ratio
		 * @type Object
		 */
			ratio = {
				/**
				 * Relative size of X axis.
				 * @private
				 * @name width
				 * @memberOf ch.Zoom#ratio
				 * @type Number
				 */
				"width": 0,

				/**
				 * Relative size of Y axis.
				 * @private
				 * @name height
				 * @memberOf ch.Zoom#ratio
				 * @type Number
				 */
				"height": 0
			},

		/**
		 * Reference to the augmented version of image, that will be displayed into a floated element.
		 * @private
		 * @name ch.Zoom#zoomed
		 * @type Object
		 */
			zoomed = (function () {
				// Define the content source
				var $img = $("<img src=\"" + that.element.href + "\" class=\"ch-hide\">").appendTo(that.$element);

				if (isIE) { $img.css('visibility', 'hidden').removeClass('ch-hide'); }

				// Grab some data when zoomed image loads
				$img.onImagesLoads(function () {

					// Save the zoomed image size
					zoomed.width = $img.prop("width");
					zoomed.height = $img.prop("height");

					if (isIE) { $img.css('visibility', 'visible').addClass('ch-hide'); }

					that.content.configure({
						'input': $img
					});

					// Save the zoom ratio
					ratio.width = zoomed.width / original.width;
					ratio.height = zoomed.height / original.height;

					// Seeker: Size relative to zoomed image respect zoomed area
					var w = ~~(conf.width / ratio.width),
						h = ~~(conf.height / ratio.height);

					// Seeker: Save half width and half height
					seeker.width = w / 2;
					seeker.height = h / 2;

					// Seeker: Set size and append it
					seeker.$shape.css({"width": w, "height": h}).appendTo(that.$element);

					// Remove loading
					$loading.remove();

					// Change zoomed image status to Ready
					zoomed.ready = true;

					// TODO: MAGIC here! if mouse is over image show seeker and make all that innerShow do
				});

				return {
					/**
					 * Reference to HTML Element of augmented image.
					 * @private
					 * @name img
					 * @memberOf ch.Zoom#zoomed
					 * @type Object
					 */
					"$image": $img,

					/**
					 * Status of augmented image. When it's load, the status is "true".
					 * @private
					 * @name ready
					 * @memberOf ch.Zoom#zoomed
					 * @type Boolean
					 */
					"ready": false,

					/**
					 * Width of augmented image.
					 * @private
					 * @name width
					 * @memberOf ch.Zoom#zoomed
					 * @type Number
					 */
					"width": 0,

					/**
					 * Height of augmented image.
					 * @private
					 * @name height
					 * @memberOf ch.Zoom#zoomed
					 * @type Number
					 */
					"height": 0
				};
			}()),

		/**
		 * Calculates movement limits and sets it to seeker and augmented image.
		 * @private
		 * @function
		 * @name ch.Zoom#move
		 * @param {Event} event Mouse event to take the cursor position.
		 */
			move = function (event) {

				var x, y;

				// Left side of seeker LESS THAN left side of image
				if (event.pageX - seeker.width < offset.left) {
					x = 0;
				// Right side of seeker GREATER THAN right side of image
				} else if (event.pageX + seeker.width > original.width + offset.left) {
					x = original.width - (seeker.width * 2) - 2;
				// Free move
				} else {
					x = event.pageX - offset.left - seeker.width;
				}

				// Top side of seeker LESS THAN top side of image
				if (event.pageY - seeker.height < offset.top) {
					y = 0;
				// Bottom side of seeker GREATER THAN bottom side of image
				} else if (event.pageY + seeker.height > original.height + offset.top) {
					y = original.height - (seeker.height * 2) - 2;
				// Free move
				} else {
					y = event.pageY - offset.top - seeker.height;
				}

				// Move seeker
				seeker.$shape.css({"left": x, "top": y});
				
				// Move zoomed image
				zoomed.$image.css({"left": (-ratio.width * x), "top": (-ratio.height * y)});

			};

	/**
	 * Protected Members
	 */

		/**
		 * Inner show method. Attach the component's layout to the DOM tree and load defined content.
		 * @protected
		 * @name ch.Zoom#innerShow
		 * @function
		 * @returns itself
		 */
		that.innerShow = function () {

			// If the component isn't loaded, show loading transition
			if (!zoomed.ready) {
				$loading.removeClass("ch-hide");
				return that;
			}

			// Update position of anchor here because Zoom can be inside a Carousel and its position updates
			offset = that.$element.offset();

			// Bind move calculations
			that.$element.bind("mousemove", function (event) { move(event); });

			// Show seeker
			seeker.$shape.removeClass("ch-hide");

			// Show float
			that.parent.innerShow();

			return that;
		};

		/**
		 * Inner hide method. Hides the component's layout and detach it from DOM tree.
		 * @protected
		 * @name ch.Zoom#innerHide
		 * @function
		 * @returns itself
		 */
		that.innerHide = function () {

			// If the component isn't loaded, hide loading transition
			if (!zoomed.ready) {
				$loading.addClass("ch-hide");
				return that;
			}

			// Unbind move calculations
			that.$element.unbind("mousemove");

			// Hide seeker
			seeker.$shape.addClass("ch-hide");

			// Hide float
			that.parent.innerHide();

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

			// Seeker: Updates styles and size value
			if (data) {
				// Seeker: Size relative to zoomed image respect zoomed area
				var size = ~~(data / ratio[prop]);

				// Seeker: Save half width and half height
				seeker[prop] = size / 2;

				// Seeker: Set size
				seeker.$shape.css(prop, size);
			}

			// Change float size
			return that.parent.size(prop, data);
		};

	/**
	 * Public Members
	 */

		/**
		 * @borrows ch.Widget#uid as ch.Modal#uid
		 * @borrows ch.Widget#element as ch.Zoom#element
		 * @borrows ch.Widget#type as ch.Zoom#type
		 * @borrows ch.Floats#isActive as ch.Zoom#isActive
		 * @borrows ch.Floats#show as ch.Zoom#show
		 * @borrows ch.Floats#hide as ch.Zoom#hide
		 * @borrows ch.Floats#width as ch.Zoom#width
		 * @borrows ch.Floats#height as ch.Zoom#height
		 * @borrows ch.Floats#position as ch.Zoom#position
		 */

	/**
	 * Default event delegation
	 */

		// Anchor
		that.$element
			.addClass("ch-zoom-trigger")
			// Prevent click
			.bind("click", function (event) { ch.util.prevent(event); })
			// Show component or loading transition
			.bind("mouseenter", that.innerShow)
			// Hide component or loading transition
			.bind("mouseleave", that.innerHide);

		/**
		 * Triggers when component is visible.
		 * @name ch.Zoom#show
		 * @event
		 * @public
		 * @example
		 * widget.on("show",function () {
		 * this.content("Some new content");
		 * });
		 * @see ch.Floats#event:show
		 */

		/**
		 * Triggers when component is not longer visible.
		 * @name ch.Zoom#hide
		 * @event
		 * @public
		 * @example
		 * widget.on("hide",function () {
		 * otherComponent.show();
		 * });
		 * @see ch.Floats#event:hide
		 */

		/**
		 * Triggers when the component is ready to use (Since 0.8.0).
		 * @name ch.Zoom#ready
		 * @event
		 * @public
		 * @since 0.8.0
		 * @example
		 * // Following the first example, using <code>widget</code> as zoom's instance controller:
		 * widget.on("ready",function () {
		 * this.show();
		 * });
		 */
		window.setTimeout(function () { that.trigger("ready"); }, 50);

		return that['public'];
	}

	Zoom.prototype.name = 'zoom';
	Zoom.prototype.constructor = Zoom;

	ch.factory(Zoom);

}(this, this.jQuery, this.ch));