(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Layer is a dialog window that can be shown one at a time.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Layer.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the widget initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". By default, the effect is "fadeIn".
     * @param {String} [options.width] Set a width for the container. By default is "auto".
     * @param {String} [options.height] Set a height for the container. By default is "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" (default) or "none".
     * @param {String} [options.hiddenby] Determines how to hide the widget. You must use: "button", "pointers", "pointerleave" (default), "all" or "none".
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the ch.viewport.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: left, right, top, bottom or center (default).
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: left, right, top, bottom or center (default).
     * @param {Number} [options.offsetX] The offsetX option specifies a distance to displace the target horitontally. Its value by default is 0.
     * @param {Number} [options.offsetY] The offsetY option specifies a distance to displace the target vertically. Its value by default is 0.
     * @param {String} [options.positioned] The positioned option specifies the type of positioning used. Its value can be: "absolute" (default) or "fixed".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. By default is "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. By default is true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. By default is true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading. By default it is '<div class="ch-loading ch-loading-centered"></div>'.
     * @returns {layer} Returns a new instance of ch.Layer.
     * @example
     * // Create a new Layer with defaults options.
     * var widget = $(selector).layer();
     * @example
     * // Create a new Layer without trigger.
     * var widget = $.layer();
     * @example
     * // Create a new Layer with fx disabled.
     * $(selector).layer({
     *     'fx': 'none'
     * });
     */
    function Layer($el, options) {
        /**
         * Reference to an internal widget instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        this.init($el, options);

        /**
         * Emits the event 'ready' when the widget is ready to use.
         * @event ch.Layer#ready
         * @example
         * // Subscribe to "ready" event.
         * layer.on('ready', function () {
         *     alert('Widget ready!');
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Reference to the last widget open. Allows to close and to deny to have 2 widgets open at the same time
    var lastShown,
        // Inheritance
        parent = ch.util.inherits(Layer, ch.Popover);

    /**
     * The name of the widget.
     * @type {String}
     */
    Layer.prototype.name = 'layer';

    /**
     * Returns a reference to the constructor function that created the instance.
     * @memberof! ch.Layer.prototype
     * @function
     */
    Layer.prototype.constructor = Layer;

    /**
     * Configuration by default.
     * @private
     * @type {Object}
     */
    Layer.prototype._defaults = $.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-layer ch-box-lite ch-cone',
        '_ariaRole': 'tooltip',
        'shownby': 'pointerenter',
        'hiddenby': 'pointerleave',
        'side': 'bottom',
        'align': 'left',
        'offsetX': 0,
        'offsetY': 10,
        'waiting': '<div class="ch-loading-small"></div>'
    });

    /**
     * Shows the layer container and hides other layers.
     * @memberof! ch.Layer.prototype
     * @function
     * @param {(String | jQuerySelector | ZeptoSelector)} [content] The content that will be used by layer.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @returns {layer}
     * @example
     * // Shows a basic layer.
     * widget.show();
     * @example
     * // Shows a layer with new content.
     * widget.show('Some new content here!');
     * @example
     * // Shows a layer with a new content that will be loaded by ajax and some custom options.
     * widget.show('http://chico-ui.com.ar/ajax', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Layer.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled) {
            return this;
        }

        // Only hide if there was a widget opened before
        if (lastShown !== undefined && lastShown.name === this.name && lastShown !== this) {
            lastShown.hide();
        }

        // Only save to future close if this widget is closable
        if (this._options.hiddenby !== 'none' && this._options.hiddenby !== 'button') {
            lastShown = this;
        }

        // Execute the original show()
        parent.show.call(this, content, options);

        return this;
    };

    ch.factory(Layer, parent._normalizeOptions);

}(this, this.ch.$, this.ch));