    /**
     * Every time Chico UI needs to inform all visual components that layout has been changed, it emits this event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onchangelayout = 'changeLayout';

    /**
     *
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onresize = 'resize';

    /**
     *
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onscroll = 'scroll';

    /**
     *
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerdown | Pointer Events W3C Working Draft
     */
    ch.onpointerdown = (ch.support.touch) ? 'touchstart' : 'mousedown';

    /**
     *
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerup | Pointer Events W3C Working Draft
     */
    ch.onpointerup = (ch.support.touch) ? 'touchend' : 'mouseup';

    /**
     *
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointermove | Pointer Events W3C Working Draft
     */
    ch.onpointermove = (ch.support.touch) ? 'touchmove' : 'mousemove';

    /**
     *
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#list-of-pointer-events | Pointer Events W3C Working Draft
     */
    ch.onpointertap = (ch.support.touch) ? 'touchend' : 'click';

    /**
     *
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerenter | Pointer Events W3C Working Draft
     */
    ch.onpointerenter = (ch.support.touch) ? 'touchstart' : 'mouseenter';

    /**
     *
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerleave | Pointer Events W3C Working Draft
     */
    ch.onpointerleave = (ch.support.touch) ? 'touchend' : 'mouseleave';