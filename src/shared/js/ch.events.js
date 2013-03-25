(function () {

	/**
	 * Every time Chico-UI needs to inform all visual components that layout has been changed, it emits this event.
	 * @name onlayoutchange
	 * @constant
	 * @memberOf ch
	 * @type {String}
	 */
	ch.onchangelayout = 'changeLayout';

	/**
	 *
	 * @name onpointerdown
	 * @constant
	 * @memberOf ch
	 * @type {String}
	 * @see <a href="http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerdown">Pointer Events W3C Working Draft</a>
	 */
	ch.onpointerdown = (ch.support.touch) ? 'touchstart' : 'mousedown';

	/**
	 *
	 * @name onpointerup
	 * @constant
	 * @memberOf ch
	 * @type {String}
	 * @see <a href="http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerup">Pointer Events W3C Working Draft</a>
	 */
	ch.onpointerup = (ch.support.touch) ? 'touchend' : 'mouseup';

	/**
	 *
	 * @name onpointermove
	 * @constant
	 * @memberOf ch
	 * @type {String}
	 * @see <a href="http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointermove">Pointer Events W3C Working Draft</a>
	 */
	ch.onpointermove = (ch.support.touch) ? 'touchmove' : 'mousemove';

    /**
     *
     * @name onpointertap
     * @constant
     * @memberOf ch
     * @type {String}
     * @see <a href="http://www.w3.org/TR/2013/WD-pointerevents-20130115/#list-of-pointer-events">Pointer Events W3C Working Draft</a>
     */
    ch.onpointertap = (ch.support.touch) ? 'touchend' : 'click';

    /**
     *
     * @name onpointerenter
     * @constant
     * @memberOf ch
     * @type {String}
     * @see <a href="http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerenter">Pointer Events W3C Working Draft</a>
     */
    ch.onpointerenter = (ch.support.touch) ? 'touchstart' : 'mouseenter';

    /**
     *
     * @name onpointerleave
     * @constant
     * @memberOf ch
     * @type {String}
     * @see <a href="http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerleave">Pointer Events W3C Working Draft</a>
     */
    ch.onpointerleave = (ch.support.touch) ? 'touchend' : 'mouseleave';

}());