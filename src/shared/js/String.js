(function (ch) {
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
     * @memberof ch
     * @name ch.String
     * @constructor
     * @augments ch.Validation
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.message] The given error message to the condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] The offsetX option specifies a distance to displace the target horitontally. Default: "10px".
     * @param {Number} [options.offsetY] The offsetY option specifies a distance to displace the target vertically. Default: "0px".
     * @param {String} [options.positioned] The positioned option specifies the type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new String Validation.
     * var strValidation = new ch.String($el, [options]);
     * @example
     * // Create a new String validation with jQuery or Zepto.
     * var strValidation = $(selector).string([options]);
     * @example
     * // Create a new String validation with custom options.
     * var strValidation = $(selector).string({
     *     'message': 'This field must be a string.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new String validation using the shorthand way (message as parameter).
     * var strValidation = $(selector).string('This field must be a string.');
     */
    function Str($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the widget.
     * @memberof! ch.String.prototype
     * @type {String}
     */
    Str.prototype.name = 'string';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.String.prototype
     * @function
     */
    Str.prototype.constructor = ch.Validation;

    ch.factory(Str, normalizeOptions);

}(this.ch));