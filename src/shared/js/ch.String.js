(function (window, ch) {
    'use strict';

    /**
     * Normalizes and creates an options object
     * @private
     * @function
     * @returns {Object}
     */
    function normalizeOptions(message) {
        var options,
            condition = {
                'name': 'string'
            };

        // If the first paramater is an object, it creates a condition and append to options
        if (typeof message === 'object') {

            // Stores the current options
            options = message;

            // Creates condition properties
            condition.message = options.message;

            // Removes the keys that has been stored into the condition
            delete options.message;

        // Creates an option object if receive more than one parameter
        } else {
            options = {};
            condition.message = message;
        }

        // Appends condition object into conditions collection
        options.conditions = [condition];

        return options;
    }

    /**
     * String validates a given text as string.
     * @name String
     * @class String
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
     * @see ch.Number
     * @see ch.Validator
     * @see ch.Condition
     * @exampleDescription Create a string validation
     * @example
     * $("input").string("This field must be a string.");
     */
    function String($el, options) {
        return $el.validation(options);
    }

    String.prototype.name = 'string';
    String.prototype.constructor = String;

    ch.factory(String, normalizeOptions);

}(this, this.ch));