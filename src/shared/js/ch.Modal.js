(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Modal is a dialog window with an underlay.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Modal.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the widget initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". By default, the effect is "fadeIn".
     * @param {String} [options.width] Set a width for the container. By default is "50%".
     * @param {String} [options.height] Set a height for the container. By default is "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap" (default), "pointerenter" or "none".
     * @param {String} [options.hiddenby] Determines how to hide the widget. You must use: "button", "pointers", "pointerleave", "all" (default) or "none".
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the ch.viewport.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: left, right, top, bottom or center (default).
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: left, right, top, bottom or center (default).
     * @param {Number} [options.offsetX] The offsetX option specifies a distance to displace the target horitontally. Its value by default is 0.
     * @param {Number} [options.offsetY] The offsetY option specifies a distance to displace the target vertically. Its value by default is 0.
     * @param {String} [options.positioned] The positioned option specifies the type of positioning used. Its value can be: "absolute" or "fixed" (default).
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. By default is "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. By default is true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. By default is true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading. By default it is '<div class="ch-loading-big ch-loading-centered"></div>'.
     * @returns {modal} Returns a new instance of ch.Modal.
     * @example
     * // Create a new Modal with defaults options.
     * var widget = $(selector).modal();
     * @example
     * // Create a new Modal without trigger.
     * var widget = $.modal();
     * @example
     * // Create a new Modal with fx disabled.
     * $(selector).modal({
     *     'fx': 'none'
     * });
     */
    function Modal($el, options) {
        /**
         * Reference to an internal widget instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        this._init($el, options);

        /**
         * Emits the event 'ready' when the widget is ready to use.
         * @event ch.Modal#ready
         * @example
         * // Subscribe to "ready" event.
         * modal.on('ready', function () {
         *     alert('Widget ready!');
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    var $body = $('body'),
        $underlay = $('<div class="ch-underlay ch-hide" tabindex="-1">'),
        // Inheritance
        parent = ch.util.inherits(Modal, ch.Popover);

    /**
     * The name of the widget.
     * @type {String}
     */
    Modal.prototype.name = 'modal';

    /**
     * Returns a reference to the constructor function that created the instance.
     * @memberof! ch.Modal.prototype
     * @function
     */
    Modal.prototype.constructor = Modal;

    /**
     * Configuration by default.
     * @private
     * @type {Object}
     */
    Modal.prototype._defaults = $.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-modal ch-box-lite',
        '_ariaRole': 'dialog',
        'width': '50%',
        'hiddenby': 'all',
        'reference': ch.viewport,
        'waiting': '<div class="ch-loading-big ch-loading-centered"></div>',
        'positioned': 'fixed'
    });

    /**
     * Shows the Modal underlay.
     * @memberof! ch.Modal.prototype
     * @private
     * @function
     */
    Modal.prototype._showUnderlay = function () {

        $underlay.css('z-index', ch.util.zIndex).appendTo($body);

        if (this._options.fx !== 'none') {
            $underlay.fadeIn();
        } else {
            $underlay.removeClass('ch-hide');
        }
    };

    /**
     * Hides the Modal underlay.
     * @memberof! ch.Modal.prototype
     * @private
     * @function
     */
    Modal.prototype._hideUnderlay = function () {
        if (this._options.fx !== 'none') {
            $underlay.fadeOut('normal', function () { $underlay.remove(null, true); });
        } else {
            $underlay.addClass('ch-hide').remove(null, true);
        }
    };

    /**
     * Shows the modal container and the underlay.
     * @memberof! ch.Modal.prototype
     * @function
     * @param {(String | jQuerySelector | ZeptoSelector)} [content] The content that will be used by modal.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @returns {modal}
     * @example
     * // Shows a basic modal.
     * widget.show();
     * @example
     * // Shows a modal with new content.
     * widget.show('Some new content here!');
     * @example
     * // Shows a modal with a new content that will be loaded by ajax and some custom options.
     * widget.show('http://chico-ui.com.ar/ajax', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Modal.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled) {
            return this;
        }

        /**
         * Reference to an internal widget instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        // Add to the underlay the ability to hide the widget
        if (this._options.hiddenby === 'all' || this._options.hiddenby === 'pointers') {
            // Allow only one click to analize the config every time and to close ONLY THIS modal
            $underlay.one(ch.onpointertap, function () {
                that.hide();
            });
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
     * // Close a modal.
     * widget.hide();
     */
    Modal.prototype.hide = function () {
        // Delete the underlay listener
        $underlay.off(ch.onpointertap);
        // Hide the underlay element
        this._hideUnderlay();
        // Execute the original hide()
        parent.hide.call(this);

        return this;
    };

    ch.factory(Modal, parent._normalizeOptions);

}(this, this.ch.$, this.ch));
