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
        $underlay = $('<div class="ch-underlay ch-hide" tabindex="-1">');

    /**
     * Public members
     */
    Modal.prototype.name = 'modal';

    Modal.prototype.constructor = Modal;

    Modal.prototype._defaults = $.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-modal ch-box-lite',
        '_ariaRole': 'dialog',
        'width': '50%',
        'hiddenby': 'all',
        'reference': ch.viewport,
        'waiting': '<div class="ch-loading-big ch-loading-centered"></div>',
        'positioned': 'fixed'
    });

    Modal.prototype.init = function ($el, options) {

        parent.init.call(this, $el, options);

        // Determine a specific Show and Hide for the underlay, defined
        // by the ability (and user's request) to have effects or not
        if (ch.support.fx && this._options.fx !== false && this._options.fx !== 'none') {
            this._showUnderlay = function () {
                $underlay.css('z-index', ch.util.zIndex).appendTo($body).fadeIn();
            };
            this._hideUnderlay = function () {
                $underlay.fadeOut('normal', function () { $underlay.remove(null, true); });
            };
        } else {
            this._showUnderlay = function () {
                $underlay.css('z-index', ch.util.zIndex).appendTo($body).removeClass('ch-hide');
            };

            this._hideUnderlay = function () {
                $underlay.addClass('ch-hide').remove(null, true);
            };
        }
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

        var that = this;

        // Add to the underlay the ability to close the widget only if the closable config. allows
        if (this._options.hiddenby === 'all' || this._options.hiddenby === 'pointers-only') {
            // Allow only one click to analize the config every time
            $underlay.one(ch.onpointertap, function () {
                that.hide();
            });
        }

        // Show the underlay
        this._showUnderlay();
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
        // Delete the underlay listener
        $underlay.off(ch.onpointertap);
        // Hide the underlay element
        this._hideUnderlay();
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
