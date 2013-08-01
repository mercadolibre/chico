(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    var $window = $(window),
        resized = false,
        scrolled = false,
        requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        }());

    $window
        .on(ch.onresize + '.viewport', function () { resized = true; })
        .on(ch.onscroll + '.viewport', function () { scrolled = true; });

    function update() {
        // No changing, exit
        if (!resized && !scrolled) { return; }

        var eve = (resized) ? ch.onresize : ch.onscroll;

        // Refresh viewport
        this.refresh();

        // Change status
        resized = false;
        scrolled = false;

        // Emits the current event
        this.emit(eve);
    }


    /**
     * The Viewport is a component to ease viewport management. You can get the dimensions of the viewport and beyond, which can be quite helpful to perform some checks with JavaScript.
     * @memberof ch
     * @constructor
     * @augments ch.EventEmitter
     * @returns {Object}
     */
    function Viewport() {
        this.init();

        return this;
    }

    ch.util.inherits(Viewport, ch.EventEmitter);


    /**
     * Initialize a new instance of ch.Viewport.
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {instance}
     */
    Viewport.prototype.init = function () {
        var that = this;

        /**
         * Element representing the visible area.
         * @memberof! ch.viewport#element
         * @type {Object}
         */
        that.$el = $window;

        that.refresh();

        (function updateFrame() {
            requestAnimFrame(updateFrame);
            update.call(that);
        }());
    };

    /**
     * Calculates/updates the dimensions (width and height) of viewport (in pixels).
     * @memberof! ch.Viewport.prototype
     * @function
     */
    Viewport.prototype.calculateDimensions = function () {
        this.calculateClientRect();

        /**
         * Height of the visible area.
         * @public
         * @name ch.Viewport#height
         * @type Number
         */
        this.height = this.bottom;

        /**
         * Width of the visible area.
         * @public
         * @name ch.Viewport#width
         * @type Number
         */
        this.width = this.right;

        return this;
    };


    /**
     * Calculates/updates the dimensions (width and height) of viewport (in pixels).
     * @memberof! ch.Viewport.prototype
     * @function
     */
     Viewport.prototype.calculateClientRect = function () {
        /**
         * Top rect.
         * @public
         * @name ch.Viewport#top
         * @type Number
         */

         /**
         * Left rect.
         * @public
         * @name ch.Viewport#left
         * @type Number
         */
        this.top = this.left = 0;

        /**
         * Bottom rect.
         * @public
         * @name ch.Viewport#bottom
         * @type Number
         */
        this.bottom = this.$el.height();

        /**
         * Right rect.
         * @public
         * @name ch.Viewport#right
         * @type Number
         */
        this.right = this.$el.width();

        return this;
     };

    /**
     * Calculates/updates the viewport position.
     * @memberof! ch.Viewport.prototype
     * @function
     */
    Viewport.prototype.calculateOffset = function () {
        var that = this,
            scroll = ch.util.getScroll();

        /**
         * Top offset of the visible area.
         * @memberof! ch.Viewport#
         * @type {Number}
         */
        this.offsetTop = scroll.top;

        /**
         * Left offset of the visible area.
         * @memberof! ch.Viewport#
         * @type {Number}
         */
        this.offsetLeft = scroll.left;

        /**
         * Right offset of the visible area.
         * @memberof! ch.Viewport#
         * @type {Number}
         */
        this.offsetRight = this.left + this.width;

        /**
         * Bottom offset of the visible area.
         * @memberof! ch.Viewport#
         * @type {Number}
         */
        this.offsetBottom = this.offsetTop + this.height;

        return this;
    };

    /**
     * Rertuns/updates the device orientation: landscape or portrait.
     * @memberof! ch.Viewport.prototype
     * @function
     */
    Viewport.prototype.calculateOrientation = function () {
        /** The viewport orientation.
         * @memberof! ch.Viewport#
         * @type {String}
         */
        this.orientation = (Math.abs(this.$el.orientation) === 90) ? 'landscape' : 'portrait';

        return this;
    };

    /**
     * Calculates if an element is completely located in the viewport.
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {Boolean}
     * @params {nodeElement} el A given nodeElement.
     */
    Viewport.prototype.inViewport = function (el) {
        var r = el.getBoundingClientRect();

        return (r.top > 0) && (r.right < this.width) && (r.bottom < this.height) && (r.left > 0);
    };

    /**
     * Calculates if an element is visible in the viewport.
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {Boolean}
     * @params {nodeElement} el A given nodeElement.
     */
    Viewport.prototype.isVisible = function (el) {
        var r = el.getBoundingClientRect();

        return (r.height >= this.offsetTop);
    };

    /**
     * Upadtes the viewport dimension, viewport positions and orietation.
     * @memberof! ch.Viewport.prototype
     * @function
     */
    Viewport.prototype.refresh = function () {
        this.calculateDimensions();
        this.calculateOffset();
        this.calculateOrientation();

        return this;
    };

    ch.viewport = new Viewport();

}(this, this.ch.$, this.ch));