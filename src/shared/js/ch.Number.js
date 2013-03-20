(function (window, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Normalizes and creates an options object
     * @private
     * @function
     * @returns {Object}
     */
    function normalizeOptions(num, message) {
        var options,
            condition = {
                'name': 'number'
            };

        // If the first paramater is an object, it creates a condition and append to options
        if (typeof num === 'object') {

            // Stores the current options
            options = num;

            // Creates condition properties
            condition.num = options.num;
            condition.message = options.message;

            // Removes the keys that has been stored into the condition
            delete options.num;
            delete options.message;

        // Creates an option object if receive more than one parameter
        } else {
            options = {};
            condition.num = num;
            condition.message = message;
        }

        // Appends condition object into conditions collection
        options.conditions = [condition];

        return options;
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
        return $el.validation(options);
    }

    Number.prototype.name = 'number';
    Number.prototype.constructor = Number;

    ch.factory(Number, normalizeOptions);

}(this, this.ch));