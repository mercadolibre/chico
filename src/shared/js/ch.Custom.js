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
    function normalizeOptions(name, fn, message) {
        var options,
            condition = {};

        // If the first paramater is an object, it creates a condition and append to options
        if (typeof name === 'object') {

            // Stores the current options
            options = name;

            // Creates condition properties
            condition.name = options.name;
            condition.fn = options.fn;
            condition.message = options.message;

            // Removes the keys that has been stored into the condition
            delete options.name;
            delete options.fn;
            delete options.message;

        // Creates an option object if receive more than one parameter
        } else {
            options = {};
            condition.name = name;
            condition.fn = fn;
            condition.message = message;
        }

        // Appends condition object into conditions collection
        options.conditions = [condition];

        return options;
    }

    /**
     * Custom creates a validation interface for validation engine.
     * @name Custom
     * @class Custom
     * @augments ch.Controls
     * @augments ch.Validation
     * @memberOf ch
     * @param {Object} [conf] Object with configuration properties.
     * @param {String} [conf.message] Validation message.
     * @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
     * @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
     * @param {String} [conf.context] It's a reference to position the validation-bubble
     * @param {Function} [conf.fn] Custom function to evaluete a value.
     * @returns itself
     * @factorized
     * @see ch.Validation
     * @see ch.Required
     * @see ch.Number
     * @see ch.String
     * @see ch.Validator
     * @see ch.Condition
     * @exampleDescription Validate a even number
     * @example
     * var widget = $("input").custom(function (value) {
     *  return (value%2==0) ? true : false;
     * }, "Enter a even number");
     */
    function Custom($el, options) {
        return $el.validation(options);
    }

    Custom.prototype.name = 'custom';
    Custom.prototype.constructor = Custom;

    ch.factory(Custom, normalizeOptions);

}(this, this.ch));