(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Tooltip improves the native tooltips. Tooltip uses the 'alt' and 'title' attributes to grab its content.
     * @name Tooltip
     * @class Tooltip
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
     * @exampleDescription Create a tooltip.
     * @example
     * var widget = $(".some-element").tooltip();
     * @exampleDescription Create a new tooltip with configuration.
     * @example
     * var widget = $("a.example").tooltip({
     *     "fx": false,
     *     "offset": "10 -10",
     *     "points": "lt rt"
     * });
     * @exampleDescription
     * Now <code>widget</code> is a reference to the tooltip instance controller.
     * You can set a new content by using <code>widget</code> like this:
     * @example
     * widget.width(300);
     */
    function Layer($el, options) {

        this.init($el, options);

        /**
         * Reference to a internal component instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        /**
         * Triggers when the component is ready to use (Since 0.8.0).
         * @name ch.Popover#ready
         * @event
         * @public
         * @since 0.8.0
         * @exampleDescription Following the first example, using <code>widget</code> as popover's instance controller:
         * @example
         * widget.on("ready",function () {
         * this.show();
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    /**
     * Private members
     */
    var parent = ch.util.inherits(Layer, ch.Popover),
        // Reference to the last widget open. Allows to close and to deny to have 2 widgets open at the same time
        lastOpen;

    /**
     * Public members
     */
    Layer.prototype.name = 'layer';

    Layer.prototype.constructor = Layer;

    Layer.prototype._defaults = $.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-layer ch-box-lite ch-cone',
        'ariaRole': 'tooltip',
        'open': 'mouseenter',
        'close': 'mouseleave',
        'side': 'bottom',
        'align': 'left',
        'offsetX': 0,
        'offsetY': 10
    });

    Layer.prototype.init = function ($el, options) {
        parent.init.call(this, $el, options);
    };

    /**
     * Inner show method. Attach the component layout to the DOM tree.
     * @protected
     * @name ch.Popover#innerShow
     * @function
     * @returns itself
     */
    Layer.prototype.show = function (content) {

        if (!this._enabled) {
            return this;
        }

        // Only hide if there was a widget opened before
        if (lastOpen !== undefined && lastOpen.name === this.name) {
            lastOpen.hide();
        }
        // Only save to future close if this widget is closable
        if (this._options.close !== 'none' && this._options.close !== false) {
            lastOpen = this;
        }
        // Execute the original show()
        parent.show.call(this, content);
        // Return the instance
        return this;
    };

    ch.factory(Layer);

}(this, (this.jQuery || this.Zepto), this.ch));