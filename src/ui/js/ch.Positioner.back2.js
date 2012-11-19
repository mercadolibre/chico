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

	var $window = $(window);

	function Positioner(options) {

		this.$reference = options.reference;
		this.$target = options.target;
		this.$context = this.$reference.offsetParent();
		this.offset = options.offset || this.offset;

		// sets position absolute before doing the calcs to avoid calcs with the element making space
		this.$target.css('position', 'absolute');
		this.init(options);

		// this.target = {}

		// this.target.$element
		// this.target.offset
		// this.target.width
		// this.target.height

		// this.context.$element
		// this.context.offset
		// this.context.isPositioned
		// this.context.width
		// this.context.height

		// this.reference.$element
		// this.reference.offset
		// this.reference.width
		// this.reference.height

		// this.getPosition()
		// this.position() > getter / setter


		return this;
	}

	Positioner.prototype.init = function (options) {

		var that = this,
			side = options.side,
			aligned = options.aligned,
			setOffset,
			// the object that stores the top, left reference to set to the target
			CSSPoint = {},
			// the object that stores the alignments related to the location's side
			coordinates = {},
			// the offsets to the parent, if where relative or absolute
			offsetParent = (function(){

				var offset = {
					'context': that.$context.offset(),
					'reference': that.$reference.offset(),
					'target': {}
				}
				offset.context.isPositioned = (ch.util.getStyles(that.$target.offsetParent()[0], 'position') !== 'static');
				offset.context.border = {
					'top': parseInt(that.$reference.offsetParent().css('border-top-width'), 10),
					'left': parseInt(that.$reference.offsetParent().css('border-left-width'), 10)
				};

				if ( offset.context.isPositioned ) {
					offset.target = {
						'top': (offset.reference.top - offset.context.border.top - offset.context.top),
						'left': (offset.reference.left - offset.context.border.left - offset.context.left)
					}
				} else {
					offset.target = {
						'top': (offset.reference.top - offset.context.border.top),
						'left': (offset.reference.left - offset.context.border.left)
					}
				}
				console.log(offset, offset.target)
				return offset.target;

			}()),
			// reference dimensions
			reference = {
				width: this.$reference.outerWidth(),
				height: this.$reference.outerHeight()
			},
			// target dimensions
			target = {
				width: this.$target.outerWidth(),
				height: this.$target.outerHeight()
			};

		// take the side and calculate the alignment and make the CSSpoint
		if (side === 'centered') {
			// calculates the coordinates related to the center side to locate the target
			coordinates = {
				top: (offsetParent.top + (reference.height / 2 - target.height / 2)),
				left: (offsetParent.left + (reference.width / 2 - target.width / 2))
			};
			CSSPoint = coordinates;
		} else if (side === 'top' || side === 'bottom') {
			// calculates the coordinates related to the top or bottom side to locate the target
			coordinates = {
				left: offsetParent.left,
				centered: (offsetParent.left + (reference.width / 2 - target.width / 2)),
				right: (offsetParent.left + reference.width - target.width),
				top: offsetParent.top - target.height,
				bottom: (offsetParent.top + reference.height)
			};

			CSSPoint.top = coordinates[side];
			CSSPoint.left = coordinates[aligned];

		} else {
			// calculates the coordinates related to the right or left side to locate the target
			coordinates = {
				top: offsetParent.top,
				centered: (offsetParent.top + (reference.height / 2 - target.height / 2)),
				bottom: (offsetParent.top + reference.height - target.height),
				right: (offsetParent.left + reference.width),
				left: (offsetParent.left - target.width)
			};

			CSSPoint.top = coordinates[aligned];
			CSSPoint.left = coordinates[side];
		}
		// add offset if there is any
		if(this.offset !== ''){
			setOffset = this.offset.split(' ');
			CSSPoint.top = (CSSPoint.top + (parseInt(setOffset[0], 10) || 0));
			CSSPoint.left = (CSSPoint.left + (parseInt(setOffset[1], 10) || 0));
		}

		this.$target.css(CSSPoint);
		return this;
	}

	Positioner.prototype.locate = Positioner.prototype.init;

	Positioner.prototype.offset = '';

	Positioner.prototype.name = 'positioner';
	Positioner.prototype.constructor = Positioner;

	ch.Positioner = Positioner;

}(this, this.jQuery, this.ch));