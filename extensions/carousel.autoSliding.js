(function (window, Carousel) {
    'use strict';

    var pointertap = window.ch.onpointertap + '.carousel';

    /**
     * Animates the Carousel automatically.
     * @memberof! ch.Carousel.prototype
     * @function
     * @param {Number} delay Delay of transition between pages, expressed in milliseconds.
     * @returns {carousel}
     * @example
     * // Start automatic animation
     * carousel.play();
     * @example
     * // Start automatic animation with a 5 seconds delay between pages
     * carousel.play(5000);
     */
    Carousel.prototype.play = function (delay) {
        /**
         * Reference to the context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        // Clear the timer if it's in use
        if (this._timer !== undefined) {
            this.pause();
        }

        // Stop the automatic movement when the user interacts with the component
        this._$el.one(pointertap, function () {
            that.pause();
        });

        /**
         * Interval used to animate the component autamatically.
         * @private
         * @type {Number}
         */
        this._timer = window.setInterval(function () {
            // Normal behavior: Move to next page
            if (that._currentPage < that._pages) {
                that.next();
            // On last page: Move to first page
            } else {
                that.select(1);
            }
        // Use the setted or default timing
        }, delay || 3000);

        return this;
    };

    /**
     * Stops the Carousel auto sliding.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     * @example
     * // Stop automatic animation
     * carousel.stop();
     */
    Carousel.prototype.pause = function () {
        window.clearInterval(this._timer);
        return this;
    };

}(this, this.ch.Carousel));
