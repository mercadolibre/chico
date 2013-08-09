(function (window, Carousel) {
    'use strict';

    if (Carousel === undefined) {
        throw new window.Error('Expected ch.Carousel constructor defined.');
    }

    var pointertap = window.ch.onpointertap + '.carousel';

    /**
     * Animates the Carousel automatically. (Since 0.10.6)
     * @since 0.10.6
     * @function
     * @param {Number} t Delay of transition between pages, expressed in milliseconds.
     * @public
     * @name ch.Carousel#play
     * @returns Chico UI Object
     * @exampleDescription Start automatic animation.
     * @example
     * foo.play();
     * @exampleDescription Start automatic animation with a 5 seconds delay between pages.
     * @example
     * foo.play(5000);
     */
    Carousel.prototype.play = function (delay) {

        var that = this;

        // Clear the timer if it's in use
        if (this._timer !== undefined) {
            this.pause();
        }

        // Stop the automatic movement when the user interacts with the widget
        this._$el.one(pointertap, function () {
            that.pause();
        });

        /**
         * Interval used to animate the component autamatically.
         * @private
         * @name ch.Carousel#_timer
         * @type Object
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
     * Pause the Carousel automatic playing. (Since 0.10.6)
     * @since 0.10.6
     * @function
     * @public
     * @name ch.Carousel#pause
     * @returns Chico UI Object
     * @exampleDescription Pause automatic animation.
     * @example
     * foo.pause();
     */
    Carousel.prototype.pause = function () {
        window.clearInterval(this._timer);
        return this;
    };

}(this, this.ch.Carousel));