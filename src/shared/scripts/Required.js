(function (window, ch) {
    'use strict';

    function normalizeOptions(message) {
        var options,
            condition = {
                'name': 'required'
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
     * Required creates a new instance of Validation to validate required values.
     * @memberof ch
     * @constructor
     * @augments ch.Validation
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.message] The given error message to the condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: "10px".
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: "0px".
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new Required Validation.
     * var reqValidation = new ch.Required($el, [options]);
     * @example
     * // Create a new Required validation with jQuery or Zepto.
     * var reqValidation = $(selector).required([options]);
     * @example
     * // Create a new Required validation with custom options.
     * var reqValidation = $(selector).required({
     *     'message': 'This field is required.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new Required validation using the shorthand way (message as parameter).
     * var reqValidation = $(selector).required('This field is required.');
     */
    function Required($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Required.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var reqValidation = $(selector).data('validation');
     */
    Required.prototype.name = 'required';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Required.prototype
     * @function
     */
    Required.prototype.constructor = Required;

    /**
     * The preset name.
     * @memberof! ch.Required.prototype
     * @type {String}
     * @private
     */
    Required.prototype._preset = 'validation';

    ch.factory(Required, normalizeOptions);

}(this, this.ch));