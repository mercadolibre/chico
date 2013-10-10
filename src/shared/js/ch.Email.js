(function (window, ch) {
    'use strict';

    function normalizeOptions(message) {
        var options,
            condition = {
                'name': 'email'
            };

        if (typeof message === 'object') {

            options = message;
            condition.message = options.message;
            delete options.message;

        } else {
            options = {};
            condition.message = message;
        }

        options.conditions = [condition];

        return options;
    }

    /**
     * Email validates a correct email syntax.
     * @memberof ch
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
     * // Create a new Email Validation.
     * var emailValidation = new ch.Email($el, [options]);
     * @example
     * // Create a new Email validation with jQuery or Zepto.
     * var emailValidation = $(selector).email([options]);
     * @example
     * // Create a new Email validation with custom options.
     * var emailValidation = $(selector).email({
     *     'message': 'This field must be a valid email.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new Email validation using the shorthand way (message as parameter).
     * var emailValidation = $(selector).email('This field must be a valid email.');
     */
    function Email($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the widget.
     * @memberof! ch.Email.prototype
     * @type {String}
     */
    Email.prototype.name = 'email';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Email.prototype
     * @function
     */
    Email.prototype.constructor = ch.Validation;

    ch.factory(Email, normalizeOptions);

}(this, this.ch));