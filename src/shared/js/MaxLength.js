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
                'name': 'maxLength'
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
     * MaxLength validates a maximun amount of characters.
     * @memberof ch
     * @constructor
     * @augments ch.Validation
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {Number} [options.num] A given maximun amount of characters.
     * @param {String} [options.message] The given error message to the condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] The offsetX option specifies a distance to displace the target horitontally. Default: "10px".
     * @param {Number} [options.offsetY] The offsetY option specifies a distance to displace the target vertically. Default: "0px".
     * @param {String} [options.positioned] The positioned option specifies the type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new MaxLength Validation.
     * var maxValidation = new ch.MaxLength($el, [options]);
     * @example
     * // Create a new MaxLength validation with jQuery or Zepto.
     * var maxValidation = $(selector).maxLength([options]);
     * @example
     * // Create a new MaxLength validation with custom options.
     * var maxValidation = $(selector).maxLength({
     *     'num': 10,
     *     'message': 'No more than 10 characters.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new MaxLength validation using the shorthand way (number and message as parameters).
     * var maxValidation = $(selector).maxLength(10, 'No more than 10 characters.');
     */
    function MaxLength($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the widget.
     * @memberof! ch.MaxLength.prototype
     * @type {String}
     */
    MaxLength.prototype.name = 'maxLength';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.MaxLength.prototype
     * @function
     */
    MaxLength.prototype.constructor = ch.Validation;

    ch.factory(MaxLength, normalizeOptions);

}(this, this.ch));