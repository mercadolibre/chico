    /**
     * Returns a data object with features supported by the device
     * @namespace
     */
    ch.support = {

        /**
         * Verify that CSS Transitions are supported (or any of its browser-specific implementations).
         * @type {Boolean}
         * @link http://gist.github.com/373874
         */
        'transition': body.style.WebkitTransition !== undefined || body.style.MozTransition !== undefined || body.style.MSTransition !== undefined || body.style.OTransition !== undefined || body.style.transition !== undefined,

        /**
         * Description.
         * @type {Boolean}
         */
        'fx': !!$.fn.slideDown,

        /**
         * Description.
         * @type {Boolean}
         */
        'touch': 'createTouch' in document
    };