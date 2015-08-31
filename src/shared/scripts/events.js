/**
 * Every time Chico UI needs to inform all visual components that layout has
 * been changed, it emits this event.
 *
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
 * Equivalent to 'pointerdown' or 'mousedown', depending on browser capabilities.
 *
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerdown | Pointer Events W3C Recommendation
 */
ch.onpointerdown = window.MouseEvent ? 'pointerdown' : 'mousedown';

/**
 * Equivalent to 'pointerup' or 'mouseup', depending on browser capabilities.
 *
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerup | Pointer Events W3C Recommendation
 */
ch.onpointerup = window.MouseEvent ? 'pointerup' : 'mouseup';

/**
 * Equivalent to 'pointermove' or 'mousemove', depending on browser capabilities.
 *
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointermove | Pointer Events W3C Recommendation
 */
ch.onpointermove = window.MouseEvent ? 'pointermove' : 'mousemove';

/**
 * Equivalent to 'pointertap' or 'click', depending on browser capabilities.
 *
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#list-of-pointer-events | Pointer Events W3C Recommendation
 */
ch.onpointertap = (tiny.support.touch && window.MouseEvent) ? 'pointertap' : 'click';

/**
 * Equivalent to 'pointerenter' or 'mouseenter', depending on browser capabilities.
 *
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerenter | Pointer Events W3C Recommendation
 */
ch.onpointerenter = window.MouseEvent ? 'pointerenter' : 'mouseenter';

/**
 * Equivalent to 'pointerleave' or 'mouseleave', depending on browser capabilities.
 *
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerleave | Pointer Events W3C Recommendation
 */
ch.onpointerleave = window.MouseEvent ? 'pointerleave' : 'mouseleave';

/**
 * The DOM input event that is fired when the value of an <input> or <textarea>
 * element is changed. Equivalent to 'input' or 'keydown', depending on browser
 * capabilities.
 *
 * @constant
 * @memberof ch
 * @type {String}
 */
ch.onkeyinput = ('oninput' in document.createElement('input')) ? 'input' : 'keydown';

