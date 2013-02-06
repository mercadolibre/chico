(function (window, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Number validates a given number.
     * @name Number
     * @class Number
     * @interface
     * @augments ch.Controls
     * @augments ch.Validation
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
     * @exampleDescription Create a number validation
     * @example
     * $("input").number("This field must be a number.");
     */
    function Number($el, options) {

        var opts = options || {};

        // Define the conditions of this interface
        opts.condition = {
            'name': 'number',
            'message': opts.content
        };

        return $el.validation(opts);
    }

    Number.prototype.name = 'number';
    Number.prototype.constructor = Number;
    Number.prototype.preset = 'validation';

    ch.factory(Number);

}(this, this.ch));