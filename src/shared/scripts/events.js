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
ch.onpointertap = (ch.support.touch && window.MouseEvent) ? 'pointertap' : 'click';

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

/**
 * Event utility
 *
 * @constant
 * @memberof ch
 * @type {Object}
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
        /**
         * Crossbrowser implementation of {HTMLElement}.addEventListener.
         *
         * @memberof ch.Event
         * @type {Function}
         * @param {HTMLElement} el An HTMLElement to add listener to
         * @param {String} evt Event name
         * @param {Function} fn Event handler function
         * @param {Boolean} bubbles Whether or not to be propagated to outer elements.
         * @example
         * ch.Event.addListener(document, 'click', function(){}, false);
         */
        'addListener': function addListener(el, evt, fn, bubbles) {
            el[addHandler](evtUtility(evt), fn, bubbles || false);
        },
        /**
         * Attach a handler to an event for the {HTMLElement} that executes only
         * once.
         *
         * @memberof ch.Event
         * @type {Function}
         * @param {HTMLElement} el An HTMLElement to add listener to
         * @param {String} evt Event name
         * @param {Function} fn Event handler function
         * @param {Boolean} bubbles Whether or not to be propagated to outer elements.
         * @example
         * ch.Event.addListenerOne(document, 'click', function(){}, false);
         */
        'addListenerOne': function addListener(el, evt, fn, bubbles) {

            function oneRemove() {
                el[removeHandler](evtUtility(evt), fn);
            }

            // must remove the event after executes one time
            el[addHandler](evtUtility(evt), fn, bubbles || false);
            // TODO: Review this method, looks like has wrong behavior when listener should be removed
            el[addHandler](evtUtility(evt), function () {
                oneRemove()
            }, bubbles || false);
        },
        /**
         * Crossbrowser implementation of {HTMLElement}.removeEventListener.
         *
         * @memberof ch.Event
         * @type {Function}
         * @param {HTMLElement} el An HTMLElement to remove listener from
         * @param {String} evt Event name
         * @param {Function} fn Event handler function to remove
         * @example
         * ch.Event.removeListener(document, 'click', fn);
         */
        'removeListener': function removeListener(el, evt, fn) {
            el[removeHandler](evtUtility(evt), fn);
        },
        /**
         * Crossbrowser implementation of {HTMLElement}.removeEventListener.
         *
         * @memberof ch.Event
         * @type {Function}
         * @param {HTMLElement} el An HTMLElement to dispatch event to
         * @param {String|Event} evt Event name or event object
         * @example
         * ch.Event.dispatchEvent(document, 'click');
         */
        'dispatchEvent': function dispatchEvent(el, e) {
            var event = e;

            if (typeof e === 'string') {
                event = document.createEvent('Event');
                event.initEvent(e, true, true);
            }
            el[dispatch](event);
        },
        /**
         * Dispatches the custom event that is not the part of standard DOM Event
         *
         * @memberof ch.Event
         * @type {Function}
         * @param {HTMLElement} el An HTMLElement to dispatch event to
         * @param {String} name Custom event name
         * @param {Object} params Optional event params that should be passed to an event
         * @example
         * ch.Event.dispatchCustomEvent(document, ch.onlayoutchange, {
         *   bubbles: true,
         *   cancelable: false,
         *   detail: {
         *     x: 123
         *   }
         * });
         */
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
