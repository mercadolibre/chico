    /**
     * Every time Chico UI needs to inform all visual components that layout has been changed, it emits this event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onlayoutchange = 'layoutchange';

    /**
     * Equivalent to 'resize'.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onresize = 'resize';

    /**
     * Equivalent to 'scroll'.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onscroll = 'scroll';

    /**
     * Equivalent to 'touchstart' or 'mousedown', depending on device capabilities.
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerdown | Pointer Events W3C Working Draft
     */
    ch.onpointerdown = (ch.support.touch) ? 'touchstart' : 'mousedown';

    /**
     * Equivalent to 'touchend' or 'mouseup', depending on device capabilities.
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerup | Pointer Events W3C Working Draft
     */
    ch.onpointerup = (ch.support.touch) ? 'touchend' : 'mouseup';

    /**
     * Equivalent to 'touchmove' or 'mousemove', depending on device capabilities.
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointermove | Pointer Events W3C Working Draft
     */
    ch.onpointermove = (ch.support.touch) ? 'touchmove' : 'mousemove';

    /**
     * Equivalent to 'touchend' or 'click', depending on device capabilities.
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#list-of-pointer-events | Pointer Events W3C Working Draft
     */
    ch.onpointertap = (ch.support.touch) ? 'touchend' : 'click';

    /**
     * Equivalent to 'touchstart' or 'mouseenter', depending on device capabilities.
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerenter | Pointer Events W3C Working Draft
     */
    ch.onpointerenter = (ch.support.touch) ? 'touchstart' : 'mouseenter';

    /**
     * Equivalent to 'touchend' or 'mouseleave', depending on device capabilities.
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerleave | Pointer Events W3C Working Draft
     */
    ch.onpointerleave = (ch.support.touch) ? 'touchend' : 'mouseleave';

    /**
     * Alphanumeric keys event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeyinput = ('oninput' in document.createElement('input')) ? 'input' : 'keydown';