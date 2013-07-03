    /**
     * Returns a data object with features supported by the device
     * @name ch.support
     * @namespace
     */
    ch.support = {

        /**
         * Verify that CSS Transitions are supported (or any of its browser-specific implementations).
         * @name transition
         * @memberOf ch.support
         * @type {Boolean}
         * @see <a href="http://gist.github.com/373874" target="_blank">http://gist.github.com/373874</a>
         */
        'transition': body.style.WebkitTransition !== undefined || body.style.MozTransition !== undefined || body.style.MSTransition !== undefined || body.style.OTransition !== undefined || body.style.transition !== undefined,

        'fx': !!$.fn.slideDown,

        /**
         *
         * @name touch
         * @memberOf ch.support
         * @type {Boolean}
         */
        'touch': 'createTouch' in document
    };