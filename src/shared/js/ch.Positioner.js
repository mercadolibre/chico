/**
* Positioner lets you centralize and manage changes related to positioned elements. Positioner returns an utility that resolves positioning for all widget.
* @name Positioner
* @class Positioner
* @memberOf ch
* @param {Object} conf Configuration object with positioning properties.
* @param {String} conf.element Reference to the DOM Element to be positioned.
* @param {String} [conf.context] It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the viewport.
* @param {String} [conf.points] Points where element will be positioned, specified by configuration or center by default.
* @param {String} [conf.offset] Offset in pixels that element will be displaced from original position determined by points. It's specified by configuration or zero by default.
* @param {Boolean} [conf.reposition] Parameter that enables or disables reposition intelligence. It's disabled by default.
* @requires ch.Viewport
* @see ch.Viewport
* @returns {Function} The Positioner returns a Function that it works in 3 ways: as a setter, as a getter and with the "refresh" parameter refreshes the position.
* @exampleDescription
* Instance the Positioner It requires a little configuration.
* The default behavior place an element center into the Viewport.
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
		if (options === undefined) {
			throw new window.Error('ch.Positioner: Expected options defined.');
		}

		ch.EventEmitter.call(this);

		this.init(options);
	}

	Positioner.prototype.name = 'positioner';

	Positioner.prototype.constructor = Positioner;

	Positioner.prototype._defaults = {
		'offsetX': 0,
		'offsetY': 0,
		'side': 'center',
		'align': 'center',
		'reference': ch.viewport,
		'position': 'fixed'
	};

	Positioner.prototype.init = function (options) {
		var that = this;

		that._options = $.extend(ch.util.clone(that._defaults), options);

		that._options.offsetX = parseInt(that._options.offsetX, 10);
		that._options.offsetY = parseInt(that._options.offsetY, 10);

		that.$target = that._options.target;
		// Default is the viewport
		that.$reference = that.reference = that._options.reference;

		if (that.reference !== ch.viewport) {
			that._options.position = 'absolute';
		}

		that.$target.css('position', that._options.position);

		return that;

	};

	Positioner.prototype.refresh = function (options) {
		var that = this;

		if (options !== undefined) {
			that._options = $.extend(that._options, options);
			that._options.offsetX = parseInt(that._options.offsetX, 10);
			that._options.offsetY = parseInt(that._options.offsetY, 10);

			that.$target = options.target || that.$target;
			that.$reference = options.reference || that.$reference;
		}

		that.calculateTarget();

		if (that.reference !== ch.viewport) {
			that.calculateReference();
			// that.calculateContext();
		} else {
			// TODO: remove this and review the viewport
			that.reference.top = 0;
			that.reference.left = 0;
		}

		// the object that stores the top, left reference to set to the target
		that.setPoint();

		return that;
	};

	Positioner.prototype.calculateTarget = function ($target) {
		if ($target !== undefined) {
			this.$target = $target;
		}

		var that = this,
			$target = that.$target.attr({
				'data-side': that._options.side,
				'data-align': that._options.align
			});

		that.target = {
			'$el': $target,
			'width': $target.outerWidth(),
			'height': $target.outerHeight()
		};

		return that;
	};

	Positioner.prototype.calculateReference = function ($reference) {
		if ($reference !== undefined) {
			this.$reference = $reference;
		}

		var that = this,
			offset = {},
			$reference = that.$reference.attr({
				'data-side': that._options.side,
				'data-align': that._options.align
			});


		// target and reference are in the same element
		if (that.$target[0].offsetParent === that.$reference[0].offsetParent) {
			offset.top = $reference[0].offsetTop;
			offset.left = $reference[0].offsetLeft;

		// target in the body
		} else if (that.$target[0].parentNode.nodeName === 'BODY' ){
			offset.top = that.$reference.offset().top;
			offset.left = that.$reference.offset().left;

		} else {
			// TODO: review the case where the element is in other element positioned absolute and the targe is in other that is the same situation
			throw new window.Error('Target and Reference must be at the same element, or target must be at the BODY elment.');
		}

		that.reference = {
			'$el': $reference,
			'width': $reference.outerWidth(),
			'height': $reference.outerHeight(),
			'left': offset.left,
			'top': offset.top
		};

		return that;
	};

	Positioner.prototype.setPoint = function () {

		var that = this,
			side = that._options.side,
			oritentation = (side === 'top' || side === 'bottom') ? 'horizontal' : ((side === 'right' || side === 'left') ? 'vertical' : 'center'),
			coors,
			oritentationMap;

		// take the side and calculate the alignment and make the CSSpoint
		if (oritentation === 'center') {
			// calculates the coordinates related to the center side to locate the target
			coors = {
				'top': (that.reference.top + (that.reference.height / 2 - that.target.height / 2)),
				'left': (that.reference.left + (that.reference.width / 2 - that.target.width / 2))
			};

		} else if (oritentation === 'horizontal') {
			// calculates the coordinates related to the top or bottom side to locate the target
			oritentationMap = {
				'left': that.reference.left,
				'center': (that.reference.left + (that.reference.width / 2 - that.target.width / 2)),
				'right': (that.reference.left + that.reference.width - that.target.width),
				'top': that.reference.top - that.target.height,
				'bottom': (that.reference.top + that.reference.height)
			};

			coors = {
				'top': oritentationMap[side],
				'left': oritentationMap[that._options.align]
			}

		} else {
			// calculates the coordinates related to the right or left side to locate the target
			oritentationMap = {
				'top': that.reference.top,
				'center': (that.reference.top + (that.reference.height / 2 - that.target.height / 2)),
				'bottom': (that.reference.top + that.reference.height - that.target.height),
				'right': (that.reference.left + that.reference.width),
				'left': (that.reference.left - that.target.width)
			};

			coors = {
				'top': oritentationMap[that._options.align],
				'left': oritentationMap[side]
			}
		}

		coors.top += that._options.offsetY;
		coors.left += that._options.offsetX;

		that.target.$el.css(coors);

		return that;
	};

	ch.Positioner = Positioner;

}(this, (this.jQuery || this.Zepto), this.ch));