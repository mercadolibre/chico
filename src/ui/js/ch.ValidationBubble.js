(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    var defaults = {
        'classes': 'ch-validation-bubble ch-box-error ch-cone',
        'side': 'right',
        'align': 'top',
        'offsetX': 10,
        'offsetY': 0,
        'open': 'none',
        'close': 'none',
        'content': 'Error.'
    };

    /**
     *
     * @name validationBubble
     * @class validationBubble
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
    function ValidationBubble($el, options) {

        if (options === undefined && !ch.util.is$($el)) {
            options = $el;
            $el = undefined;
        }

        options = $.extend(ch.util.clone(defaults), options);

        return new ch.Popover($el, options);
    }

    ValidationBubble.prototype.name = 'validationBubble';
    ValidationBubble.prototype.constructor = ValidationBubble;
    ValidationBubble.prototype.preset = 'Popover';

    ch.factory(ValidationBubble);

}(this, (this.zepto || this.jQuery), this.ch));