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
	events.layout.CHANGE = 'changeLayout';

	/**
	 * Pointer events collection.
	 * @name pointer
	 * @namespace
	 * @memberOf ch.events
     * @see <a href="http://www.w3.org/TR/2013/WD-pointerevents-20130115/#list-of-pointer-events">Pointer Events W3C Working Draft</a>
	 */
	events.pointer = {};

	/**
	 *
	 * @name DOWN
	 * @constant
	 * @memberOf ch.events.pointer
	 * @type {String}
	 */
	events.pointer.DOWN = (ch.support.touch) ? 'touchstart' : 'mousedown';

	/**
	 *
	 * @name UP
	 * @constant
	 * @memberOf ch.events.pointer
	 * @type {String}
	 */
	events.pointer.UP = (ch.support.touch) ? 'touchend' : 'mouseup';

	/**
	 *
	 * @name MOVE
	 * @constant
	 * @memberOf ch.events.pointer
	 * @type {String}
	 */
	events.pointer.MOVE = (ch.support.touch) ? 'touchmove' : 'mousemove';

    /**
     *
     * @name TAP
     * @constant
     * @memberOf ch.events.pointer
     * @type {String}
     */
    events.pointer.TAP = (ch.support.touch) ? 'touchend' : 'click';

    /**
     *
     * @name ENTER
     * @constant
     * @memberOf ch.events.pointer
     * @type {String}
     */
    events.pointer.ENTER = (ch.support.touch) ? 'touchstart' : 'mouseenter';

    /**
     *
     * @name LEAVE
     * @constant
     * @memberOf ch.events.pointer
     * @type {String}
     */
    events.pointer.LEAVE = (ch.support.touch) ? 'touchend' : 'mouseleave';

	ch.events = events;
}());