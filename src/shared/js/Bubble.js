(function (window, $, ch) {
    'use strict';

    /**
     * Bubble is a dialog window with alert/error skin.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Bubble.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the widget initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". By default, the effect is "fadeIn".
     * @param {String} [options.width] Set a width for the container. By default is "auto".
     * @param {String} [options.height] Set a height for the container. By default is "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none" (default).
     * @param {String} [options.hiddenby] Determines how to hide the widget. You must use: "button", "pointers", "pointerleave", "all" or "none" (default).
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the ch.viewport.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: left, right (default), top, bottom or center.
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: left, right, top (default), bottom or center.
     * @param {Number} [options.offsetX] The offsetX option specifies a distance to displace the target horitontally. Its value by default is 10.
     * @param {Number} [options.offsetY] The offsetY option specifies a distance to displace the target vertically. Its value by default is 0.
     * @param {String} [options.positioned] The positioned option specifies the type of positioning used. Its value can be: "absolute" (default) or "fixed".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. By default is "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. By default is true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. By default is true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading. By default it is '<div class="ch-loading ch-loading-centered"></div>'.
     * @returns {bubble} Returns a new instance of ch.Bubble.
     * @example
     * // Create a new Bubble with defaults options.
     * var widget = $(selector).bubble();
     * @example
     * // Create a new Bubble without trigger.
     * var widget = $.bubble();
     * @example
     * // Create a new Bubble with fx disabled.
     * $(selector).bubble({
     *     'fx': 'none'
     * });
     */
    function Bubble($el, options) {

        this._init($el, options);

        /**
         * Reference to a internal component instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        /**
         * Triggers when the component is ready to use (Since 0.8.0).
         * @name ch.Bubble#ready
         * @event
         * @public
         * @since 0.8.0
         * @exampleDescription Following the first example, using <code>widget</code> as bubble's instance controller:
         * @example
         * widget.on("ready",function () {
         * this.show();
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Bubble, ch.Popover);

    /**
     * The name of the widget.
     * @type {String}
     */
    Bubble.prototype.name = 'bubble';

    /**
     * Returns a reference to the constructor function that created the instance.
     * @memberof! ch.Bubble.prototype
     * @function
     */
    Bubble.prototype.constructor = Bubble;

    /**
     * Configuration by default.
     * @private
     * @type {Object}
     */
    Bubble.prototype._defaults = $.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-bubble ch-box-icon ch-box-error ch-cone',
        '_ariaRole': 'alert',
        'shownby': 'none',
        'hiddenby': 'none',
        'side': 'right',
        'align': 'top',
        'offsetX': 10,
        'content': 'Check the information, please.'
    });

    /**
     * Initialize a new instance of Bubble and merge custom options with defaults options.
     * @memberof! ch.Bubble.prototype
     * @function
     * @private
     * @returns {bubble}
     */
    Bubble.prototype._init = function ($el, options) {
        // Call to its parent init method
        parent._init.call(this, $el, options);

        $('<i class="ch-icon-remove-sign"></i>').prependTo(this.$container);

        return this;
    };

    ch.factory(Bubble, parent._normalizeOptions);

}(this, this.ch.$, this.ch));
