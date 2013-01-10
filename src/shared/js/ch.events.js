(function () {
	/**
	 * Global events reference.
	 * @name ch.events
	 * @namespace
	 */
	var events = {};

	/**
	 * Layout events collection.
	 * @name layout
	 * @namespace
	 * @memberOf ch.events
	 */
	events.layout = {};

	/**
	 * Every time Chico-UI needs to inform all visual components that layout has been changed, it emits this event.
	 * @name CHANGE
	 * @constant
	 * @memberOf ch.events.layout
	 * @type {String}
	 */
	events.layout.CHANGE = 'change';

	/**
	 * Viewport events collection.
	 * @name viewport
	 * @namespace
	 * @memberOf ch.events
	 */
	events.viewport = {};

	/**
	 * Every time Chico UI needs to inform all visual components that window has been scrolled or resized, it emits this event.
	 * @name CHANGE
	 * @constant
	 * @memberOf ch.events.viewport
	 * @type {String}
	 * @see ch.Positioner
	 */
	events.viewport.CHANGE = 'change';

	/**
	 * Pointer events collection.
	 * @name pointer
	 * @namespace
	 * @memberOf ch.events
	 */
	events.pointer = {};

	/**
	 *
	 * @name DOWN
	 * @constant
	 * @memberOf ch.events.pointers
	 * @type {String}
	 */
	events.pointer.DOWN = (ch.support.touch) ? 'touchstart' : 'mousedown';

	/**
	 *
	 * @name TAP
	 * @constant
	 * @memberOf ch.events.pointers
	 * @type {String}
	 */
	events.pointer.TAP = (ch.support.touch) ? 'touchend' : 'click';

	/**
	 *
	 * @name UP
	 * @constant
	 * @memberOf ch.events.pointers
	 * @type {String}
	 */
	events.pointer.UP = (ch.support.touch) ? 'touchend' : 'mouseup';

	/**
	 *
	 * @name MOVE
	 * @constant
	 * @memberOf ch.events.pointers
	 * @type {String}
	 */
	events.pointer.MOVE = (ch.support.touch) ? 'touchmove' : 'mousemove';

	ch.events = events;
}());