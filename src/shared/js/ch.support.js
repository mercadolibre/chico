    /**
     * Returns a data object with features supported by the device
     * @namespace
     */
    ch.support = {

        /**
         * Verify that CSS Transitions are supported (or any of its browser-specific implementations).
         * @type {Boolean}
         * @link http://gist.github.com/373874
         * @example
         * if (ch.support.transition) {
         *     // Some code here!
         * }
         */
        'transition': body.style.WebkitTransition !== undefined || body.style.MozTransition !== undefined || body.style.MSTransition !== undefined || body.style.OTransition !== undefined || body.style.transition !== undefined,

        /**
         * Checks if the $ library has fx methods.
         * @type {Boolean}
         * @example
         * if (ch.support.fx) {
         *     // Some code here!
         * }
         */
        'fx': !!$.fn.slideDown,

        /**
         * Checks if the User Agent support touch events.
         * @type {Boolean}
         * @example
         * if (ch.support.touch) {
         *     // Some code here!
         * }
         */
        'touch': 'createTouch' in document
    };