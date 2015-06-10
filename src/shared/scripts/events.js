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
ch.onpointerdown = window.MouseEvent ? 'pointerdown' : 'mousedown';

/**
 * Equivalent to 'touchend' or 'mouseup', depending on device capabilities.
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerup | Pointer Events W3C Working Draft
 */
ch.onpointerup = window.MouseEvent ? 'pointerup' : 'mouseup';

/**
 * Equivalent to 'touchmove' or 'mousemove', depending on device capabilities.
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointermove | Pointer Events W3C Working Draft
 */
ch.onpointermove = window.MouseEvent ? 'pointermove' : 'mousemove';

/**
 * Equivalent to 'touchend' or 'click', depending on device capabilities.
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#list-of-pointer-events | Pointer Events W3C Working Draft
 */
ch.onpointertap = (ch.support.touch && window.MouseEvent) ? 'pointertap' : 'click';

/**
 * Equivalent to 'touchstart' or 'mouseenter', depending on device capabilities.
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerenter | Pointer Events W3C Working Draft
 */
ch.onpointerenter = window.MouseEvent ? 'pointerenter' : 'mouseenter';

/**
 * Equivalent to 'touchend' or 'mouseleave', depending on device capabilities.
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerleave | Pointer Events W3C Working Draft
 */
ch.onpointerleave = window.MouseEvent ? 'pointerleave' : 'mouseleave';

/**
 * Alphanumeric keys event.
 * @constant
 * @memberof ch
 * @type {String}
 */
ch.onkeyinput = ('oninput' in document.createElement('input')) ? 'input' : 'keydown';

/**
 * Event utility
 * @constant
 * @memberof ch.util
 * @type {Object}
 * @example
 * ch.Event.addListener(document, 'click', function(){}, false);
 */
ch.Event = (function () {
    var isStandard = document.addEventListener ? true : false,
        addHandler = isStandard ? 'addEventListener' : 'attachEvent',
        removeHandler = isStandard ? 'removeEventListener' : 'detachEvent',
        dispatch = isStandard ? 'dispatchEvent' : 'fireEvent',
        _custom = {};

    function evtUtility(evt) {
        return isStandard ? evt : ('on' + evt);
    }

    return {
        'addListener': function addListener(el, evt, fn, bubbles) {
            el[addHandler](evtUtility(evt), fn, bubbles || false);
        },
        'addListenerOne': function addListener(el, evt, fn, bubbles) {

            function oneRemove() {
                el[removeHandler](evtUtility(evt), fn);
            }

            // must remove the event after executes one time
            el[addHandler](evtUtility(evt), fn, bubbles || false);
            // TODO: Review this method, wrong looks like has wrong behavior
            el[addHandler](evtUtility(evt), function () {
                oneRemove()
            }, bubbles || false);
        },
        'removeListener': function removeListener(el, evt, fn) {
            el[removeHandler](evtUtility(evt), fn);
        },
        'dispatchEvent': function dispatchEvent(el, e) {
            var event = e;

            if (typeof e === 'string') {
                event = document.createEvent('Event');
                event.initEvent(e, true, true);
            }
            el[dispatch](event);
        },
        'dispatchCustomEvent': function dispatchCustomEvent(el, name, params) {
            if (!_custom[name]) {
                var data = ch.util.extend({
                        bubbles: false,
                        cancelable: false,
                        detail: undefined
                    }, params),
                    eventName = window.CustomEvent ? 'CustomEvent' : 'Event';

                if (ch.support.customEvent) {
                    _custom[name] = new CustomEvent(name, data);
                } else {
                    _custom[name] = document.createEvent(eventName);
                    _custom[name]['init' + eventName](name, data.bubbles, data.cancelable, data.detail);
                }
            }

            el[dispatch](_custom[name]);
        }
    }
}());

/**
 * Normalizes touch/touch+click events into a 'pointertap' event that is not
 * part of standard.
 * Uses pointerEvents polyfill or native PointerEvents when supported.
 *
 * @example
 * // Use pointertap as fastclick on touch enabled devices
 * document.querySelector('.btn').addEventListener(ch.pointertap, function(e) {
 *   console.log('tap');
 * });
 */
(function () {
    'use strict';

    // IE8 has no support for custom Mouse Events, fallback to onclick
    // Use an original click on UAs with no touch
    if (!window.MouseEvent || !ch.support.touch) {
        return;
    }

    var POINTER_TYPE_TOUCH = "touch";
    var POINTER_TYPE_PEN = "pen";
    var POINTER_TYPE_MOUSE = "mouse";

    var isScrolling = false;
    var scrollTimeout = false;
    var sDistX = 0;
    var sDistY = 0;
    var activePointer;

    window.addEventListener('scroll', function () {
        if (!isScrolling) {
            sDistX = window.pageXOffset;
            sDistY = window.pageYOffset;
        }
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
            isScrolling = false;
            sDistX = 0;
            sDistY = 0;
        }, 100);
    });

    window.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointerup', pointerUp);
    window.addEventListener('pointerleave', pointerLeave);

    window.addEventListener('pointermove', function (e) {});

    /**
     * Handles the 'pointerdown' event from pointerEvents polyfill or native PointerEvents when supported.
     *
     * @private
     * @param {MouseEvent|PointerEvent} e Event.
     */
    function pointerDown(e) {
        // don't register an activePointer if more than one touch is active.
        var singleFinger = e.pointerType === POINTER_TYPE_MOUSE ||
            e.pointerType === POINTER_TYPE_PEN ||
            (e.pointerType === POINTER_TYPE_TOUCH && e.isPrimary);

        if (!isScrolling && singleFinger) {
            activePointer = {
                id: e.pointerId,
                clientX: e.clientX,
                clientY: e.clientY,
                x: (e.x || e.pageX),
                y: (e.y || e.pageY),
                type: e.pointerType
            }
        }
    }

    /**
     * Handles the 'pointerleave' event from pointerEvents polyfill or native PointerEvents when supported.
     *
     * @private
     * @param {MouseEvent|PointerEvent} e Event.
     */
    function pointerLeave(e) {
        activePointer = null;
    }

    /**
     * Handles the 'pointerup' event from pointerEvents polyfill or native PointerEvents when supported.
     *
     * @private
     * @param {MouseEvent|PointerEvent} e Event.
     */
    function pointerUp(e) {
        // Does our event is the same as the activePointer set by pointerdown?
        if (activePointer && activePointer.id === e.pointerId) {
            // Have we moved too much?
            if (Math.abs(activePointer.x - (e.x || e.pageX)) < 5 &&
                Math.abs(activePointer.y - (e.y || e.pageY)) < 5) {
                // Have we scrolled too much?
                if (!isScrolling ||
                    (Math.abs(sDistX - window.pageXOffset) < 5 &&
                    Math.abs(sDistY - window.pageYOffset) < 5)) {
                    makePointertapEvent(e);
                }
            }
        }
        activePointer = null;
    }

    /**
     * Creates the pointertap event that is not part of standard.
     *
     * @private
     * @param {MouseEvent|PointerEvent} sourceEvent An event to use as a base for pointertap.
     */
    function makePointertapEvent(sourceEvent) {
        var evt = document.createEvent('MouseEvents');
        var newTarget = document.elementFromPoint(sourceEvent.clientX, sourceEvent.clientY);

        // TODO: Replace 'initMouseEvent' with 'new MouseEvent'
        evt.initMouseEvent('pointertap', true, true, window, 1, sourceEvent.screenX, sourceEvent.screenY,
            sourceEvent.clientX, sourceEvent.clientY, sourceEvent.ctrlKey, sourceEvent.altKey,
            sourceEvent.shiftKey, sourceEvent.metaKey, sourceEvent.button, newTarget);

        evt.maskedEvent = sourceEvent;
        newTarget.dispatchEvent(evt);

        return evt;
    }
})();
