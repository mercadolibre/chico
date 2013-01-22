(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    var defaults = {
        'classes': 'ch-modal ch-box-lite ch-dimmer',
        'open': 'click',
        'width': '500px',
        'close': 'all'
    };

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

        if (options === undefined && !ch.util.is$($el)) {
            options = $el;
            $el = undefined;
        }

        options = $.extend(ch.util.clone(defaults), options);

        return new ch.Popover($el, options);
    }


    Modal.prototype.name = 'modal';
    Modal.prototype.constructor = Modal;
    Modal.prototype.preset = 'Popover';

    ch.factory(Modal);

}(this, (this.zepto || this.jQuery), this.ch));