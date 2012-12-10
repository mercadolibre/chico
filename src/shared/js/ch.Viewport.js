/**
 * Viewport is a reference to position and size of the visible area of browser.
 * @name Viewport
 * @class Viewport
 * @standalone
 * @memberOf ch
 */
(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	var $window = $(window),
		resized = false,
		scrolled = false;

	$window.on('resize', function () { resized = true; });
	$window.on('scroll', function () { scrolled = true; });

	function update() {
		// No changing, exit
		if (!resized && !scrolled) { return; }

		var eve = (resized) ? 'resize' : 'scroll';

		// Refresh viewport
		this.refresh();

		// Change status
		resized = false;
		scrolled = false;

		// Emits the current event
		this.emitter.emit(eve);
	}

	/**
	 * Viewport is a reference to position and size of the visible area of browser.
	 *
	 */
	function Viewport() {
		ch.EventEmitter.call(this);
		this.init();
	}

	Viewport.prototype.init = function () {
		var that = this;

		/**
		 * Element representing the visible area.
		 * @public
		 * @name ch.Viewport#element
		 * @type Object
		 */
		that.$element = $window;

		that.refresh();

		window.setInterval(function () {
			update.call(that);
		}, 350);
	};

	Viewport.prototype.calculateDimensions = function () {
		/**
		 * Height of the visible area.
		 * @public
		 * @name ch.Viewport#height
		 * @type Number
		 */
		this.height = this.$element.height();

		/**
		 * Width of the visible area.
		 * @public
		 * @name ch.Viewport#width
		 * @type Number
		 */
		this.width = this.$element.width();
	};

	Viewport.prototype.calculateOffset = function () {

		/**
		 * Top offset of the visible area.
		 * @public
		 * @name ch.Viewport#top
		 * @type Number
		 */
		this.top = this.$element.scrollTop();

		/**
		 * Left offset of the visible area.
		 * @public
		 * @name ch.Viewport#left
		 * @type Number
		 */
		this.left = this.$element.scrollLeft();

		/**
		 * Right offset of the visible area.
		 * @public
		 * @name ch.Viewport#right
		 * @type Number
		 */
		this.right = this.left + this.width;

		/**
		 * Bottom offset of the visible area.
		 * @public
		 * @name ch.Viewport#bottom
		 * @type Number
		 */
		this.bottom = this.top + this.height;
	};

	Viewport.prototype.calculateOrientation = function () {
		this.orientation = (Math.abs(this.$element.orientation) === 90) ? 'landscape' : 'portrait';
	};

	Viewport.prototype.inViewport = function (el) {
		var r = el.getBoundingClientRect();

		return (r.top > 0) && (r.right < this.width) && (r.bottom < this.height) && (r.left > 0);
	};

	Viewport.prototype.isVisible = function (el) {
		var r = el.getBoundingClientRect();

		return (r.height >= this.top);
	};

	Viewport.prototype.refresh = function () {
		this.calculateDimensions();
		this.calculateOffset();
		this.calculateOrientation();
	};

	ch.viewport = new Viewport();

}(this, this.jQuery, this.ch));