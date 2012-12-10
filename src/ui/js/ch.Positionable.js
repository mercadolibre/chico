/**
* Positionable lets you centralize and manage changes related to positioned elements. Positionable returns an utility that resolves positioning for all widget.
* @name Positionable
* @class Positionable
* @memberOf ch
* @param {Object} conf Configuration object with positioning properties.
* @param {String} conf.element Reference to the DOM Element to be positioned.
* @param {String} [conf.context] It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the viewport.
* @param {String} [conf.points] Points where element will be positioned, specified by configuration or centered by default.
* @param {String} [conf.offset] Offset in pixels that element will be displaced from original position determined by points. It's specified by configuration or zero by default.
* @param {Boolean} [conf.reposition] Parameter that enables or disables reposition intelligence. It's disabled by default.
* @requires ch.Viewport
* @see ch.Viewport
* @returns {Function} The Positionable returns a Function that it works in 3 ways: as a setter, as a getter and with the "refresh" parameter refreshes the position.
* @exampleDescription
* Instance the Positionable It requires a little configuration.
* The default behavior place an element centered into the Viewport.
*
* @example
* var positioned = ch.Positionable({
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
* @exampleDescription <strong>Offset</strong>: The Positionable could be configurated with an offset.
* This example show an element displaced horizontally by 10px of defined position.
* @example
* var positioned = ch.Positionable({
*     element: "#element3",
*     context: "#context3",
*     points: "lt rt",
*     offset: "10 0"
* });
* @exampleDescription <strong>Reposition</strong>: Repositionable feature moves the postioned element if it can be shown into the viewport.
* @example
* var positioned = ch.Positionable({
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


	function Positionable(options) {

		this.$reference = options.reference;
		this.$target = options.target;
		this.$context = this.$reference.offsetParent();
		this.offset = options.offset || this.offset;

		this.init(options);

		return this;
	}

	Positionable.prototype.getData = function () {
		var data = {
			'context': {
				'$element': this.$context,
				'height': this.$context.outerHeight(),
				'width': this.$context.outerWidth(),
				'offset': this.$context.offset(),
				'isPositioned': (ch.util.getStyles(this.$target.offsetParent()[0], 'position') !== 'static'),
				'border': {
					'top': parseInt(this.$reference.offsetParent().css('border-top-width'), 10),
					'left': parseInt(this.$reference.offsetParent().css('border-left-width'), 10)
				}
			},
			'reference': {
				'$element': this.$reference,
				'height': this.$reference.outerHeight(),
				'width': this.$reference.outerWidth(),
				'offset': this.$reference.offset()
			},
			'target': {
				'$element': this.$target,
				'height': this.$target.outerHeight(),
				'width': this.$target.outerWidth(),
				'offset': {}
			}
		};

		if (data.context.isPositioned) {
			data.target.offset.top = (data.reference.offset.top - data.context.border.top - data.context.offset.top);
			data.target.offset.left = (data.reference.offset.left - data.context.border.left - data.context.offset.left);
		} else {
			data.target.offset.top = (data.reference.offset.top - data.context.border.top);
			data.target.offset.left = (data.reference.offset.left - data.context.border.left);
		}

		this.data = data;

		return this;

	}

	Positionable.prototype.init = function (options) {

		// sets position absolute before doing the calcs to avoid calcs with the element making space
		this.$target.css({'position': 'absolute'});

		this.getData();

		// the object that stores the top, left reference to set to the target
		this.CSSPoint = this.setPoint({'side': options.side, 'aligned': options.aligned });

		// add offset if there is any
		this.addOffset((options.offset || this.offset));

		this.$target.css(this.CSSPoint);

		return this;
	}

	Positionable.prototype.setPoint = function (options) {

		var side = options.side,
			aligned = options.aligned,
			data = this.data,
			oriented = (side === 'top' || side === 'bottom')?'horizontal':((side === 'right' || side === 'left')?'vertical':'centered');


		// take the side and calculate the alignment and make the CSSpoint
		if (oriented === 'centered') {
			// calculates the coordinates related to the center side to locate the target
			this.centered = {
				'top': (data.target.offset.top + (data.reference.height / 2 - data.target.height / 2)),
				'left': (data.target.offset.left + (data.reference.width / 2 - data.target.width / 2))
			};

			return this.centered;

		} else if (oriented === 'horizontal') {
			// calculates the coordinates related to the top or bottom side to locate the target
			this.horizontal = {
				'left': data.target.offset.left,
				'centered': (data.target.offset.left + (data.reference.width / 2 - data.target.width / 2)),
				'right': (data.target.offset.left + data.reference.width - data.target.width),
				'top': data.target.offset.top - data.target.height,
				'bottom': (data.target.offset.top + data.reference.height)
			};

			return {
				'top': this.horizontal[side],
				'left': this.horizontal[aligned]
			}

		} else {
			// calculates the coordinates related to the right or left side to locate the target
			this.vertical = {
				'top': data.target.offset.top,
				'centered': (data.target.offset.top + (data.reference.height / 2 - data.target.height / 2)),
				'bottom': (data.target.offset.top + data.reference.height - data.target.height),
				'right': (data.target.offset.left + data.reference.width),
				'left': (data.target.offset.left - data.target.width)
			};

			return {
				'top': this.vertical[aligned],
				'left': this.vertical[side]
			}
		}
	}

	Positionable.prototype.addOffset = function (offset) {
		if(offset !== ''){
			var setOffset = offset.split(' ');
			this.CSSPoint.top = (this.CSSPoint.top + (parseInt(setOffset[0], 10) || 0));
			this.CSSPoint.left = (this.CSSPoint.left + (parseInt(setOffset[1], 10) || 0));
		} else {
			return this.offset;
		}
	}

	Positionable.prototype.offset = '';
	Positionable.prototype.coords = {};

	Positionable.prototype.name = 'positionable';
	Positionable.prototype.constructor = Positionable;

	ch.Positionable = Positionable;

}(this, this.jQuery, this.ch));