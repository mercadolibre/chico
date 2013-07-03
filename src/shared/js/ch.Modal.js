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
    function Modal($el, options) {

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
    var parent = ch.util.inherits(Modal, ch.Popover),

        $body = $('body'),

        $dimmer = $('<div class="ch-dimmer ch-hide">');

    /**
     * Public members
     */
    Modal.prototype.name = 'modal';

    Modal.prototype.constructor = Modal;

    Modal.prototype._defaults = $.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-modal ch-box-lite',
        'ariaRole': 'dialog',
        'width': '50%',
        'close': 'all',
        'reference': ch.viewport,
        'waiting': '<div class="ch-loading-big ch-loading-centered"></div>'
    });

    Modal.prototype.init = function ($el, options) {
        parent.init.call(this, $el, options);
    };

    /**
     * Inner show method. Attach the component layout to the DOM tree.
     * @protected
     * @name ch.Popover#innerShow
     * @function
     * @returns itself
     */
    Modal.prototype.show = function (content) {

        if (!this._enabled) {
            return this;
        }

        var that = this,
            close = this._options.close;

        // Add to the dimmer the ability to close the widget only if the closable config. allows
        if (close === 'all' || close === 'pointers-only' || close === true) {
            // Allow only one click to analize the config every time
            $dimmer.one(ch.onpointertap, function (event) {
                // Close dimmer and execute the original hide()
                that.hide();
            });
        }

        // Append dimmer element
        $dimmer.css('z-index', ch.util.zIndex).appendTo($body);

        if (ch.support.fx) {
            $dimmer.fadeIn();
        } else {
            $dimmer.removeClass('ch-hide');
        }

        // Execute the original show()
        parent.show.call(this, content);

        // Return the instance
        return this;
    };

    /**
     * Inner hide method. Hides the component and detach it from DOM tree.
     * @protected
     * @name ch.Popover#innerHide
     * @function
     * @returns itself
     */
    Modal.prototype.hide = function () {
        // Delete the dimmer element
        if (ch.support.fx) {
            $dimmer.fadeOut('normal', function () {
                $dimmer.remove(null, true);
            });
        } else {
            $dimmer.addClass('ch-hide').remove(null, true);
        }
        // Execute the original hide()
        parent.hide.call(this);
        // Return the instance
        return this;
    };

    /**
     * Factory
     */
    ch.factory(Modal, parent._normalizeOptions);

}(this, this.ch.$, this.ch));
