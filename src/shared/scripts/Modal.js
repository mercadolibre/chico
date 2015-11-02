(function (window, ch) {
    'use strict';

    /**
     * Modal is a dialog window with an underlay.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {HTMLElement} [el] A HTMLElement to create an instance of ch.Modal.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "50%".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointertap".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "all".
     * @param {HTMLElement} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: ch.viewport.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "fixed".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading-large ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {(String | HTMLElement)} [options.content] The content to be shown into the Modal container.
     * @returns {modal} Returns a new instance of Modal.
     * @example
     * // Create a new Modal.
     * var modal = new ch.Modal([el], [options]);
     * @example
     * // Create a new Modal.
     * var modal = new ch.Modal([options]);
     * @example
     * // Create a new Modal with disabled effects.
     * var modal = new ch.Modal({
     *     'content': 'This is the content of the Modal'
     * });
     * @example
     * // Create a new Modal using the shorthand way (content as parameter).
     * var modal = new ch.Modal('http://ui.ml.com:3040/ajax');
     */
    function Modal(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Modal is created.
             * @memberof! ch.Modal.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Modal#ready
         * @example
         * // Subscribe to "ready" event.
         * modal.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    tiny.inherits(Modal, ch.Popover);

    var document = window.document,
        underlay = (function () {
            var dummyElement = document.createElement('div');
            dummyElement.innerHTML = '<div class="ch-underlay" tabindex="-1"></div>';

            return dummyElement.querySelector('div');
        }()),
        parent = Modal.super_.prototype;

    /**
     * The name of the component.
     * @memberof! ch.Modal.prototype
     * @type {String}
     */
    Modal.prototype.name = 'modal';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Modal.prototype
     * @function
     */
    Modal.prototype.constructor = Modal;

    /**
     * Configuration by default.
     * @memberof! ch.Modal.prototype
     * @type {Object}
     * @private
     */
    Modal.prototype._defaults = tiny.extend(tiny.clone(parent._defaults), {
        '_className': 'ch-modal ch-box-lite',
        '_ariaRole': 'dialog',
        'width': '50%',
        'hiddenby': 'all',
        'reference': ch.viewport,
        'waiting': '<div class="ch-loading-large ch-loading-centered"></div>',
        'position': 'fixed'
    });

    /**
     * Shows the Modal underlay.
     * @memberof! ch.Modal.prototype
     * @function
     * @private
     */
    Modal.prototype._showUnderlay = function () {
        var useAnimation = tiny.support.transition && this._options.fx !== 'none' && this._options.fx !== false,
            fxName = 'ch-fx-' + this._options.fx.toLowerCase();

        document.body.appendChild(underlay);

        function showCallback(e) {
            tiny.removeClass(underlay, fxName + '-enter-active');
            tiny.removeClass(underlay, fxName + '-enter');

            tiny.off(e.target, e.type, showCallback);
        }

        if (useAnimation) {
            tiny.addClass(underlay, fxName + '-enter');
            setTimeout(function() {
                tiny.addClass(underlay, fxName + '-enter-active');
            },10);
            tiny.on(underlay, tiny.support.transition.end, showCallback);
        }
    };

    /**
     * Hides the Modal underlay.
     * @memberof! ch.Modal.prototype
     * @function
     * @private
     */
    Modal.prototype._hideUnderlay = function () {
        var useAnimation = tiny.support.transition && this._options.fx !== 'none' && this._options.fx !== false,
            fxName = 'ch-fx-' + this._options.fx.toLowerCase(),
            parent = underlay.parentNode;

        function hideCallback(e) {
            tiny.removeClass(underlay, fxName + '-leave-active');
            tiny.removeClass(underlay, fxName + '-leave');

            tiny.off(e.target, e.type, hideCallback);
            parent.removeChild(underlay);
        }

        if (useAnimation) {
            tiny.addClass(underlay, fxName + '-leave');
            setTimeout(function() {
                tiny.addClass(underlay, fxName + '-leave-active');
            },10);
            tiny.on(underlay, tiny.support.transition.end, hideCallback);
        } else {
            parent.removeChild(underlay);
        }
    };

    /**
     * Shows the modal container and the underlay.
     * @memberof! ch.Modal.prototype
     * @function
     * @param {(String | HTMLElement)} [content] The content that will be used by modal.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {modal}
     * @example
     * // Shows a basic modal.
     * modal.show();
     * @example
     * // Shows a modal with new content
     * modal.show('Some new content here!');
     * @example
     * // Shows a modal with a new content that will be loaded by ajax with some custom options
     * modal.show('http://domain.com/ajax/url', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Modal.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled || this._shown) {
            return this;
        }

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        function hideByUnderlay(e) {
            that.hide();
            // Allow only one click to analyze the config every time and to close ONLY THIS modal
            e.target.removeEventListener(e.type, hideByUnderlay);
        }

        // Add to the underlay the ability to hide the component
        if (this._options.hiddenby === 'all' || this._options.hiddenby === 'pointers') {
            tiny.on(underlay, ch.onpointertap, hideByUnderlay);
        }

        // Show the underlay
        this._showUnderlay();
        // Execute the original show()
        parent.show.call(this, content, options);

        return this;
    };

    /**
     * Hides the modal container and the underlay.
     * @memberof! ch.Modal.prototype
     * @function
     * @returns {modal}
     * @example
     * // Close a modal
     * modal.hide();
     */
    Modal.prototype.hide = function () {
        if (!this._shown) {
            return this;
        }

        // Delete the underlay listener
        tiny.off(underlay, ch.onpointertap);
        // Hide the underlay element
        this._hideUnderlay();
        // Execute the original hide()
        parent.hide.call(this);

        return this;
    };

    ch.factory(Modal, parent._normalizeOptions);

}(this, this.ch));
