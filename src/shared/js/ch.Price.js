(function (window, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Price validates a number like the price format.
     * @name Price
     * @class Price
     * @interface
     * @augments ch.Controls
     * @augments ch.Validation
     * @requires ch.Validation
     * @memberOf ch
     * @param {Object} [conf] Object with configuration properties.
     * @param {String} [conf.content] Validation message.
     * @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
     * @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
     * @param {String} [conf.context] It's a reference to position the validation-bubble
     * @returns itself
     * @factorized
     * @see ch.Validation
     * @see ch.Required
     * @see ch.Custom
     * @see ch.String
     * @see ch.Validator
     * @see ch.Condition
     * @exampleDescription
     * @example
     * $("input").price("Write valid price.");
     */
    function Price($el, options) {

        var opts = options || {};

        opts.condition = {
            'name': 'price',
            'message': opts.content
        };

        return $el.validation(opts);

    }

    Price.prototype.name = 'price';
    Price.prototype.constructor = Price;
    Price.prototype.preset = 'validation';

    ch.factory(Price);

}(this, this.ch));