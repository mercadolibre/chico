(function (ch) {
    'use strict';

    // Private Members
    var conditions = {
        'string': {
            'fn': function (value) {
                // the following regular expression has the utf code for the lating characters
                // the ranges are A,EI,O,U,a,ei,o,u,ç,Ç please for reference see http://www.fileformat.info/info/charset/UTF-8/list.htm
                return (/^([a-zA-Z\u00C0-\u00C4\u00C8-\u00CF\u00D2-\u00D6\u00D9-\u00DC\u00E0-\u00E4\u00E8-\u00EF\u00F2-\u00F6\u00E9-\u00FC\u00C7\u00E7\s]*)$/i).test(value);
            },
            'message': 'Use only letters.'
        },
        'email': {
            'fn': function (value) {
                return (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i).test(value);
            },
            'message': 'Use a valid e-mail such as name@example.com.'
        },
        'url': {
            'fn': function (value) {
                return (/^((https?|ftp|file):\/\/|((www|ftp)\.)|(\/|.*\/)*)[a-z0-9-]+((\.|\/)[a-z0-9-]+)+([/?].*)?$/i).test(value);
            },
            'message': 'It must be a valid URL.'
        },
        'minLength': {
            'fn': function (a, b) { return a.length >= b; },
            'message': 'Enter at least {#num#} characters.'
        },
        'maxLength': {
            'fn': function (a, b) { return a.length <= b; },
            'message': 'The maximum amount of characters is {#num#}.'
        },
        'number': {
            'fn': function (value) {
                return (/^(-?[0-9]+)$/i).test(value);
            },
            'message': 'Use only numbers.'
        },
        'max': {
            'fn': function (a, b) { return a <= b; },
            'message': 'The amount must be smaller than {#num#}.'
        },
        'min': {
            'fn': function (a, b) { return a >= b; },
            'message': 'The amount must be higher than {#num#}.'
        },
        'required': {
            'fn': function (value) {

                var tag = tiny.hasClass(this.trigger, 'ch-form-options') ? 'OPTIONS' : this._el.tagName,
                    validated;

                switch (tag) {
                case 'OPTIONS':
                    validated = this.trigger.querySelectorAll('input:checked').length !== 0;
                    break;

                case 'SELECT':
                    validated = (value !== '-1' && value !== '');
                    break;

                // INPUTS and TEXTAREAS
                default:
                    validated = value.replace(/^\s+|\s+$/g, '').length !== 0;
                    break;
                }

                return validated;
            },
            'message': 'Fill in this information.'
        },
        'custom': {
            // I don't have pre-conditions, comes within conf.fn argument
            'message': 'Error'
        }
    };

    /**
     * Condition utility.
     * @memberof ch
     * @constructor
     * @requires ch.Validation
     * @param {Array} [condition] A conditions to validate.
     * @param {String} [condition.name] The name of the condition.
     * @param {String} [condition.message] The given error message to the condition.
     * @param {String} [condition.fn] The method to validate a given condition.
     * @returns {condition} Returns a new instance of Condition.
     * @example
     * // Create a new condition object with patt.
     * var condition = ch.Condition({
     *     'name': 'string',
     *     'patt': /^([a-zA-Z\u00C0-\u00C4\u00C8-\u00CF\u00D2-\u00D6\u00D9-\u00DC\u00E0-\u00E4\u00E8-\u00EF\u00F2-\u00F6\u00E9-\u00FC\u00C7\u00E7\s]*)$/,
     *     'message': 'Some message here!'
     * });
     * @example
     * //Create a new condition object with expr.
     * var condition = ch.Condition({
     *     'name': 'maxLength',
     *     'patt': function(a,b) { return a.length <= b },
     *     'message': 'Some message here!',
     *     'value': 4
     * });
     * @example
     * // Create a new condition object with func.
     * var condition = ch.Condition({
     *     'name': 'custom',
     *     'patt': function (value) {
     *         if (value === 'ChicoUI') {
     *
     *             // Some code here!
     *
     *             return true;
     *         };
     *
     *         return false;
     *     },
     *     'message': 'Your message here!'
     * });
     */
    function Condition(condition) {

        tiny.extend(this, conditions[condition.name], condition);

        // replaces the condition default message in the following conditions max, min, minLenght, maxLenght
        if (this.name === 'min' || this.name === 'max' || this.name === 'minLength' || this.name === 'maxLength') {
            this.message = this.message.replace('{#num#}', this.num);
        }

        this._enabled = true;

        return this;
    }

    /**
     * The name of the component.
     * @memberof! ch.Condition.prototype
     * @type {String}
     */
    Condition.prototype.name = 'condition';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Condition.prototype
     * @function
     */
    Condition.prototype.constructor = Condition;

    /**
     * Enables an instance of condition.
     * @memberof! ch.Condition.prototype
     * @function
     * @returns {condition}
     * @example
     * // Enabling an instance of Condition.
     * condition.enable();
     * @example
     * // Enabling a condition.
     * condition.enable();
     */
    Condition.prototype.enable = function () {
        this._enabled = true;

        return this;
    };

    /**
     * Disables an instance of a condition.
     * @memberof! ch.Condition.prototype
     * @function
     * @returns {condition}
     * @example
     * // Disabling an instance of Condition.
     * condition.disable();
     * @example
     * // Disabling a condition.
     * condition.disable();
     */
    Condition.prototype.disable = function () {
        this._enabled = false;

        return this;
    };

    /**
     * Enables an instance of condition.
     * @memberof! ch.Condition.prototype
     * @function
     * @param {(String | Number)} value A given value.
     * @param {condition} validation A given validation to execute.
     * @returns {Boolean} Returns a boolean indicating whether the condition fails or not.
     * @example
     * // Testing a condition.
     * condition.test('foobar', validationA);
     */
    Condition.prototype.test = function (value, validation) {

        if (!this._enabled) {
            return true;
        }

        return this.fn.call(validation, value, this.num);
    };

    ch.Condition = Condition;

}(this.ch));
