    /**
     * Returns a data object with features supported by the device
     * @namespace
     */
    ch.support = {

        /**
         * Verify that CSS Transitions are supported (or any of its browser-specific implementations).
         *
         * @static
         * @type {Boolean|Object}
         * @example
         * if (ch.support.transition) {
         *     // Some code here!
         * }
         */
        'transition': transitionEnd(),

        /**
         * Verify that CSS Animations are supported (or any of its browser-specific implementations).
         *
         * @static
         * @type {Boolean|Object}
         * @example
         * if (ch.support.animation) {
         *     // Some code here!
         * }
         */
        'animation': animationEnd(),

        /**
         * Checks if the User Agent support touch events.
         * @type {Boolean}
         * @example
         * if (ch.support.touch) {
         *     // Some code here!
         * }
         */
        'touch': 'ontouchend' in document,

        /**
         * Checks is the User Agent supports custom events.
         * @type {Boolean}
         * @example
         * if (ch.support.customEvent) {
         *     // Some code here!
         * }
         */
        'customEvent': (function() {
            // TODO: find better solution for CustomEvent check
            try {
                // IE8 has no support for CustomEvent, in IE gte 9 it cannot be
                // instantiated but exist
                new CustomEvent(name, data);
                return true;
            } catch (e) {
                return false;
            }
        })()
    };

    /**
     * Checks for the CSS Transitions support (http://www.modernizr.com/)
     *
     * @function
     * @private
     */
    function transitionEnd() {
        var el = document.createElement('ch');

        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        };

        for (var name in transEndEventNames) {
            if (transEndEventNames.hasOwnProperty(name) && el.style[name] !== undefined) {
                return { end: transEndEventNames[name] }
            }
        }

        return false;
    }

    /**
     * Checks for the CSS Animations support
     *
     * @function
     * @private
     */
    function animationEnd() {
        var el = document.createElement('ch');

        var animEndEventNames = {
            WebkitAnimation : 'webkitAnimationEnd',
            MozAnimation    : 'animationend',
            OAnimation      : 'oAnimationEnd oanimationend',
            animation       : 'animationend'
        };

        for (var name in animEndEventNames) {
            if (animEndEventNames.hasOwnProperty(name) && el.style[name] !== undefined) {
                return { end: animEndEventNames[name] }
            }
        }

        return false;
    }
