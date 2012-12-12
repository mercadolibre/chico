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
* var positioned = ch.Positioner({
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
* @exampleDescription <strong>Offset</strong>: The Positioner could be configurated with an offset.
* This example show an element displaced horizontally by 10px of defined position.
* @example
* var positioned = ch.Positioner({
*     element: "#element3",
*     context: "#context3",
*     points: "lt rt",
*     offset: "10 0"
* });
* @exampleDescription <strong>Reposition</strong>: RePositioner feature moves the postioned element if it can be shown into the viewport.
* @example
* var positioned = ch.Positioner({
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
		$html = $('html');


	function Positioner(options) {

		// Por qué todos los métodos reciben options

		ch.EventEmitter.call(this);

		// Esto conviene que este dentor del init.
		this.$reference = options.reference;
		this.$target = options.target;
		this.$context = $(this.$reference[0].offsetParent);

		// Tiene que exponer algo para poder actualizarlo
		// TODO: Hay que tener un this.defaults y mergearlo, es lo correcto.
		this.offset = options.offset || '0 0';
		this.aligned = options.aligned || 'left';
		this.side = options.side || 'bottom';

		this.init();
	}

	Positioner.prototype.init = function (options) {
		var that = this;

		// sets position absolute before doing the calcs to avoid calcs with the element making space
		that.$target.css({'position': 'absolute'});

		that.refresh();
	};

	Positioner.prototype.refresh = function (options) {
		var that = this;
		// Aca hay que mergearlo

		that.getData();

		// the object that stores the top, left reference to set to the target
		that.setPoint({'side': that.side, 'aligned': that.aligned });

		// add offset if there is any
		// that.addOffset();
	};

	Positioner.prototype.getData = function () {
		var that = this,
			data = {
			'context': {
				'height': that.$context.outerHeight(),
				'width': that.$context.outerWidth(),
				'offset': that.$context.offset(),
				'isPositioned': (ch.util.getStyles(that.$context[0], 'position') !== 'static'),
				'border': {
					'top': parseInt(that.$reference.offsetParent().css('border-top-width'), 10),
					'left': parseInt(that.$reference.offsetParent().css('border-left-width'), 10)
				}
			},
			'reference': {
				'height': that.$reference.outerHeight(),
				'width': that.$reference.outerWidth(),
				'offset': (function () {
					var offset = {};

					if ($html.hasClass('ie7')) {
						if (data.context.isPositioned) {
							offset.top = (data.reference.offset.top - data.context.border.top - data.context.offset.top);
							offset.left = (data.reference.offset.left - data.context.border.left - data.context.offset.left);

						} else {
							offset.top = (data.reference.offset.top - data.context.border.top);
							offset.left = (data.reference.offset.left - data.context.border.left);
						}

					} else {
						offset.top = that.$reference[0].offsetTop,
						offset.left = that.$reference[0].offsetLeft
					}

					return offset;
				}())
			},
			'target': {
				'height': that.$target.outerHeight(),
				'width': that.$target.outerWidth()
			}
		};

		that.data = data;

	};

	Positioner.prototype.setPoint = function () {

		var that = this,
			side = that.side,
			aligned = that.aligned,
			data = that.data,
			oriented = (side === 'top' || side === 'bottom') ? 'horizontal' : ((side === 'right' || side === 'left') ? 'vertical' : 'centered'),
			coors;

		// take the side and calculate the alignment and make the CSSpoint
		if (oriented === 'centered') {
			// calculates the coordinates related to the center side to locate the target
			that.centered = {
				'top': (data.reference.offset.top + (data.reference.height / 2 - data.target.height / 2)),
				'left': (data.reference.offset.left + (data.reference.width / 2 - data.target.width / 2))
			};

			coors = that.centered;

		} else if (oriented === 'horizontal') {
			// calculates the coordinates related to the top or bottom side to locate the target
			this.horizontal = {
				'left': data.reference.offset.left,
				'centered': (data.reference.offset.left + (data.reference.width / 2 - data.target.width / 2)),
				'right': (data.reference.offset.left + data.reference.width - data.target.width),
				'top': data.reference.offset.top - data.target.height,
				'bottom': (data.reference.offset.top + data.reference.height)
			};

			coors = {
				'top': this.horizontal[side],
				'left': this.horizontal[aligned]
			}

		} else {
			// calculates the coordinates related to the right or left side to locate the target
			this.vertical = {
				'top': data.reference.offset.top,
				'centered': (data.reference.offset.top + (data.reference.height / 2 - data.target.height / 2)),
				'bottom': (data.reference.offset.top + data.reference.height - data.target.height),
				'right': (data.reference.offset.left + data.reference.width),
				'left': (data.reference.offset.left - data.target.width)
			};

			coors = {
				'top': this.vertical[aligned],
				'left': this.vertical[side]
			}
		}

		that.$target.css(coors);
	};

	Positioner.prototype.addOffset = function () {
		var that = this,
			offset = that.offset;

		if (offset !== '') {
			var setOffset = offset.split(' ');
			that.CSSPoint.top = (that.CSSPoint.top + (parseInt(setOffset[0], 10) || 0));
			that.CSSPoint.left = (that.CSSPoint.left + (parseInt(setOffset[1], 10) || 0));
		} else {
			return that.offset;
		}
	};

	Positioner.prototype.name = 'positioner';
	Positioner.prototype.constructor = Positioner;

	ch.Positioner = Positioner;

}(this, this.jQuery, this.ch));