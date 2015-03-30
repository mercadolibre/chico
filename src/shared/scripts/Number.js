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
                'name': 'number'
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
     * Number creates a new instance of Validation to validate a given value as number.
     * @memberof ch
     * @name ch.Number
     * @constructor
     * @augments ch.Validation
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.message] The given error message to the condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horitontally. Default: "10px".
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: "0px".
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new Number Validation.
     * var numValidation = new ch.Number($el, [options]);
     * @example
     * // Create a new Number validation with jQuery or Zepto.
     * var numValidation = $(selector).number([options]);
     * @example
     * // Create a new Number validation with custom options.
     * var numValidation = $(selector).number({
     *     'message': 'This field must be a number.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new Number validation using the shorthand way (message as parameter).
     * var numValidation = $(selector).number('This field must be a number.');
     */
    function Num($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Number.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var numValidation = $(selector).data('validation');
     */
    Num.prototype.name = 'number';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Number.prototype
     * @function
     */
    Num.prototype.constructor = Num;

    /**
     * The preset name.
     * @memberof! ch.Num.prototype
     * @type {String}
     * @private
     */
    Num.prototype._preset = 'validation';

    ch.factory(Num, normalizeOptions);

}(this.ch));