(function (window, ch) {
    'use strict';

    /**
     * Normalizes and creates an options object
     * @private
     * @function
     * @returns {Object}
     */
    function normalizeOptions(num, message) {
        var options,
            condition = {
                'name': 'max'
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
     * Max creates a new instance of Validation to validate a number with a maximun value.
     * @memberof ch
     * @constructor
     * @augments ch.Validation
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {Number} [options.num] A given maximun value.
     * @param {String} [options.message] The given error message to the condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: "10px".
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: "0px".
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new Max Validation.
     * var maxValidation = new ch.Max($el, [options]);
     * @example
     * // Create a new Max validation with jQuery or Zepto.
     * var maxValidation = $(selector).max([options]);
     * @example
     * // Create a new Max validation with custom options.
     * var maxValidation = $(selector).max({
     *     'num': 10,
     *     'message': 'Write a number smaller than 10.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new Max validation using the shorthand way (number and message as parameters).
     * var maxValidation = $(selector).max(10, 'Write a number smaller than 10.');
     */
    function Max($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Max.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var maxValidation = $(selector).data('validation');
     */
    Max.prototype.name = 'max';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Max.prototype
     * @function
     */
    Max.prototype.constructor = Max;

    /**
     * The preset name.
     * @memberof! ch.Max.prototype
     * @type {String}
     * @private
     */
    Max.prototype._preset = 'validation';

    ch.factory(Max, normalizeOptions);

}(this, this.ch));