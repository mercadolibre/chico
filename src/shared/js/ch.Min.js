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
                'name': 'min'
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
     * Min validates a number with a minimun value.
     * @name Min
     * @class Min
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
     * @param {Number} value Minimun number value.
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
     * $("input").min(10, "Write a number bigger than 10");
     */
    function Min($el, options) {
        return $el.validation(options);
    }

    Min.prototype.name = 'min';
    Min.prototype.constructor = Min;

    ch.factory(Min, normalizeOptions);

}(this, this.ch));