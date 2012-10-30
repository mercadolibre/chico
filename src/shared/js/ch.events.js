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

	ch.events = events;
}());