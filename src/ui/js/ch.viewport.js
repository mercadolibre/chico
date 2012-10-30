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
		// Viewport is a reference to position and size of the visible area of browser.
		viewport = {};

	/**
	 * Width of the visible area.
	 * @public
	 * @name ch.Viewport#width
	 * @type Number
	 */
	viewport.width = $window.width();

	/**
	 * Height of the visible area.
	 * @public
	 * @name ch.Viewport#height
	 * @type Number
	 */
	viewport.height = $window.height();

	/**
	 * Left offset of the visible area.
	 * @public
	 * @name ch.Viewport#left
	 * @type Number
	 */
	viewport.left = $window.scrollLeft();

	/**
	 * Top offset of the visible area.
	 * @public
	 * @name ch.Viewport#top
	 * @type Number
	 */
	viewport.top = $window.scrollTop();

	/**
	 * Right offset of the visible area.
	 * @public
	 * @name ch.Viewport#right
	 * @type Number
	 */
	viewport.right = $window.scrollLeft() + $window.width();

	/**
	 * Bottom offset of the visible area.
	 * @public
	 * @name ch.Viewport#bottom
	 * @type Number
	 */
	viewport.bottom = $window.scrollTop() + $window.height();

	/**
	 * Element representing the visible area.
	 * @public
	 * @name ch.Viewport#element
	 * @type Object
	 */
	viewport.element = $window;

	/**
	 * Updates width and height of the visible area and updates ch.viewport.width and ch.viewport.height
	 * @public
	 * @function
	 * @name ch.Viewport#getSize
	 * @returns Object
	 */
	viewport.getSize = function () {

		return {
			"width": ch.viewport.width = $window.width(),
			"height": ch.viewport.height = $window.height()
		};
	};

	/**
	 * Updates left, top, right and bottom coordinates of the visible area, relative to the window.
	 * @public
	 * @function
	 * @name ch.Viewport#getPosition
	 * @returns Object
	 */
	viewport.getPosition = function () {

		var size = viewport.getSize();

		return {
			"left": 0,
			"top": 0,
			"right": size.width,
			"bottom": size.height,
			// Size is for use as context on Positioner
			// (see getCoordinates method on Positioner)
			"width": size.width,
			"height": size.height
		};
	};

	/**
	 * Updates left, top, right and bottom coordinates of the visible area, relative to the document.
	 * @public
	 * @function
	 * @name ch.Viewport#getOffset
	 * @returns Object
	 */
	viewport.getOffset = function () {

		var position = viewport.getPosition(),
			scrollLeft = $window.scrollLeft(),
			scrollTop = $window.scrollTop();

		return {
			"left": ch.viewport.left = scrollLeft,
			"top": ch.viewport.top = scrollTop,
			"right": ch.viewport.right = scrollLeft + position.right,
			"bottom": ch.viewport.bottom = scrollTop + position.bottom
		};
	};

	ch.viewport = viewport;

}(this, this.jQuery, this.ch));