(function (window, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Bubble improves the native bubbles. Bubble uses the 'alt' and 'title' attributes to grab its content.
     * @name Bubble
     * @class Bubble
     * @augments ch.Floats
     * @memberOf ch
     * @param {Object} [conf] Object with configuration properties.
     * @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
     * @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or centered by default: "cm cm".
     * @param {String} [conf.offset] Sets the offset in pixels that component will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
     * @returns itself
     * @factorized
     * @see ch.Modal
     * @see ch.Layer
     * @see ch.Zoom
     * @see ch.Flaots
     * @exampleDescription Create a bubble.
     * @example
     * var widget = $(".some-element").bubble();
     * @exampleDescription Create a new bubble with configuration.
     * @example
     * var widget = $("a.example").bubble({
     *     "fx": false,
     *     "offset": "10 -10",
     *     "points": "lt rt"
     * });
     * @exampleDescription
     * Now <code>widget</code> is a reference to the bubble instance controller.
     * You can set a new content by using <code>widget</code> like this:
     * @example
     * widget.width(300);
     */
    function Bubble($el, options) {

        this.init($el, options);

        /**
         * Reference to a internal component instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        /**
         * Triggers when the component is ready to use (Since 0.8.0).
         * @name ch.Layer#ready
         * @event
         * @public
         * @since 0.8.0
         * @exampleDescription Following the first example, using <code>widget</code> as layer's instance controller:
         * @example
         * widget.on("ready",function () {
         * this.show();
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    var parent = ch.util.inherits(Bubble, ch.Layer);

    Bubble.prototype.name = 'bubble';

    Bubble.prototype.constructor = Bubble;

    Bubble.prototype.init = function ($el, options) {

        options = options || {};

        options.classes = 'ch-bubble ch-box-error';
        options.side = 'right';
        options.align = 'top';
        options.offsetX = 10;

        options.content = options.content || 'Error';

        //TODO:openable false
        options.closable = false;

        parent.init.call(this, $el, options);
    };

    ch.factory(Bubble);

}(this, this.ch));