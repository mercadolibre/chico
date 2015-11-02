(function (window, ch) {
    'use strict';

    /**
     * Dialog window with an error skin.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Positioner
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Bubble.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "none".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "none".
     * @param {HTMLElement} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 10.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {(String | HTMLElement)} [options.content] The content to be shown into the Bubble container. Default: "Check the information, please."
     * @returns {bubble} Returns a new instance of Bubble.
     * @example
     * // Create a new Bubble.
     * var bubble = new ch.Bubble($el, [options]);
     * @example
     * // Create a new Bubble with disabled effects.
     * var bubble = new ch.Bubble({
     *     'fx': 'none'
     * });
     * @example
     * // Create a new Bubble using the shorthand way (content as parameter).
     * var bubble = new ch.Bubble('http://ui.ml.com:3040/ajax');
     */
    function Bubble(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Bubble is created.
             * @memberof! ch.Bubble.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Bubble#ready
         * @example
         * // Subscribe to "ready" event.
         * bubble.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    tiny.inherits(Bubble, ch.Popover);

    var parent = Bubble.super_.prototype;

    /**
     * The name of the component.
     * @memberof! ch.Bubble.prototype
     * @type {String}
     */
    Bubble.prototype.name = 'bubble';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Bubble.prototype
     * @function
     */
    Bubble.prototype.constructor = Bubble;

    /**
     * Configuration by default.
     * @memberof! ch.Bubble.prototype
     * @type {Object}
     * @private
     */
    Bubble.prototype._defaults = tiny.extend(tiny.clone(parent._defaults), {
        '_className': 'ch-bubble ch-box-icon ch-box-error ch-cone',
        '_ariaRole': 'alert',
        'shownby': 'none',
        'hiddenby': 'none',
        'side': 'right',
        'align': 'center',
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
    Bubble.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

        this.container.insertAdjacentHTML('beforeend', '<i class="ch-icon-remove-sign"></i>');

        return this;
    };

    ch.factory(Bubble, parent._normalizeOptions);

}(this, this.ch));
