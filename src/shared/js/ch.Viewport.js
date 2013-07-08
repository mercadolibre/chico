/**
 * The Viewport is a component to ease viewport management. You can get the dimensions of the viewport and beyond, which can be quite helpful to perform some checks with JavaScript.
 * @name Viewport
 * @class Viewport
 * @standalone
 * @memberOf ch
 */
(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    var $window = $(window),
        resized = false,
        scrolled = false;

    $window
        .on('resize.viewport', function () { resized = true; })
        .on('scroll.viewport', function () { scrolled = true; });

    function update() {
        // No changing, exit
        if (!resized && !scrolled) { return; }

        var eve = (resized) ? 'resize' : 'scroll';

        // Refresh viewport
        this.refresh();

        // Change status
        resized = false;
        scrolled = false;

        // Emits the current event
        this.emit(eve);
    }

    function Viewport() {
        ch.EventEmitter.call(this);
        this.init();
    }

    ch.util.inherits(Viewport, ch.EventEmitter);

    Viewport.prototype.init = function () {
        var that = this;

        /**
         * Element representing the visible area.
         * @public
         * @name ch.Viewport#element
         * @type Object
         */
        that.$el = $window;

        that.refresh();

        window.setInterval(function () {
            update.call(that);
        }, 350);
    };

    /**
     * Calculates/updates the dimensions (width and height) of viewport (in pixels).
     * @public
     * @function
     * @name ch.Viewport#calculateDimensions
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
    };

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
     };

    /**
     * Calculates/updates the viewport position.
     * @public
     * @function
     * @name ch.Viewport#calculateOffset
     */
    Viewport.prototype.calculateOffset = function () {
        var that = this,
            scroll = ch.util.getScroll();

        /**
         * Top offset of the visible area.
         * @public
         * @name ch.Viewport#top
         * @type Number
         */
        this.offsetTop = scroll.top;

        /**
         * Left offset of the visible area.
         * @public
         * @name ch.Viewport#left
         * @type Number
         */
        this.offsetLeft = scroll.left;

        /**
         * Right offset of the visible area.
         * @public
         * @name ch.Viewport#right
         * @type Number
         */
        this.offsetRight = this.left + this.width;

        /**
         * Bottom offset of the visible area.
         * @public
         * @name ch.Viewport#bottom
         * @type Number
         */
        this.offsetBottom = this.offsetTop + this.height;
    };

    /**
     * Rertuns the device orientation: landscape or portrait.
     * @public
     * @function
     * @name ch.Viewport#calculateOrientation
     * @returns {String}
     */
    Viewport.prototype.calculateOrientation = function () {
        this.orientation = (Math.abs(this.$el.orientation) === 90) ? 'landscape' : 'portrait';
    };

    /**
     * Calculates if an element is completely located in the viewport.
     * @public
     * @function
     * @name ch.Viewport#inViewport
     * @returns {Boolean}
     */
    Viewport.prototype.inViewport = function (el) {
        var r = el.getBoundingClientRect();

        return (r.top > 0) && (r.right < this.width) && (r.bottom < this.height) && (r.left > 0);
    };

    /**
     * Calculates if an element is visible in the viewport.
     * @public
     * @function
     * @name ch.Viewport#isVisible
     * @returns {Boolean}
     */
    Viewport.prototype.isVisible = function (el) {
        var r = el.getBoundingClientRect();

        return (r.height >= this.offsetTop);
    };

    /**
     * Upadtes the viewport dimension, viewport positions and orietation.
     * @public
     * @function
     * @name ch.Viewport#refresh
     */
    Viewport.prototype.refresh = function () {
        this.calculateDimensions();
        this.calculateOffset();
        this.calculateOrientation();
    };

    ch.viewport = new Viewport();

}(this, this.ch.$, this.ch));