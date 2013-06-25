(function (window, $, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
    * Private Members
    */
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
                return (/^(-?[0-9\s]+)$/i).test(value);
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
        'price': {
            'fn': function (value) {
                return (/^([0-9\s]+)[.,]?([0-9]+)$/i).test(value);
            },
            'message': 'Use a valid price such as (1,00).'
        },
        'required': {
            'fn': function (value) {

                var tag = this.$trigger.hasClass('ch-list-options') ? 'OPTIONS' : this._el.tagName,
                    validated;

                switch (tag) {
                case 'OPTIONS':
                    validated = this.$trigger.find('input:checked').length !== 0;
                    break;

                case 'SELECT':
                    validated = (value !== '-1' && value !== '');
                    break;

                // INPUTS and TEXTAREAS
                default:
                    validated = $.trim(value).length !== 0;
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
     * @name Condition
     * @class Condition
     * @memberOf ch
     * @param {Object} condition Object with configuration properties.
     * @param {String} condition.name
     * @param {Object} [condition.patt]
     * @param {Function} [condition.expr]
     * @param {Function} [condition.fn]
     * @param {Number || String} [condition.value]
     * @param {String} condition.message Validation message
     * @returns itself
     * @exampleDescription Create a new condition object with patt.
     * @example
     * var widget = ch.condition({
     *     "name": "string",
     *     "patt": /^([a-zA-Z\u00C0-\u00C4\u00C8-\u00CF\u00D2-\u00D6\u00D9-\u00DC\u00E0-\u00E4\u00E8-\u00EF\u00F2-\u00F6\u00E9-\u00FC\u00C7\u00E7\s]*)$/,
     *     "message": "Some message here!"
     * });
     * @exampleDescription Create a new condition object with expr.
     * @example
     * var widget = ch.condition({
     *     "name": "maxLength",
     *     "patt": function(a,b) { return a.length <= b },
     *     "message": "Some message here!",
     *     "value": 4
     * });
     * @exampleDescription Create a new condition object with func.
     * @example
     * var widget = ch.condition({
     *     "name": "custom",
     *     "patt": function (value) {
     *         if (value === "ChicoUI") {
     *
     *             // Some code here!
     *
     *             return true;
     *         };
     *
     *         return false;
     *     },
     *     "message": "Your message here!"
     * });
     */
    function Condition(condition) {

        $.extend(this, conditions[condition.name], condition);

        // replaces the condition default message in the following conditions max, min, minLenght, maxLenght
        if (this.name === 'min' || this.name === 'max' || this.name === 'minLength' || this.name === 'maxLength') {
            this.message = this.message.replace('{#num#}', this.num);
        }

        return this;
    }

    /**
     * Flag that let you know if the all conditions are enabled or not.
     * @public
     * @name ch.Condition#name
     * @type string
     */
    Condition.prototype.name = 'condition';

    Condition.prototype.constructor = Condition;

    /**
     * Flag that let you know if the condition is enabled or not.
     * @private
     * @name ch.Condition-enabled
     * @type boolean
     */
    Condition.prototype._enabled = true;

    /**
     * Turn on condition.
     * @public
     * @name ch.Condition#enable
     * @function
     * @returns itself
     */
    Condition.prototype.enable = function () {
        this._enabled = true;

        return this;
    };

    /**
     * Turn off condition.
     * @public
     * @name ch.Condition#disable
     * @function
     * @returns itself
     */
    Condition.prototype.disable = function () {
        this._enabled = false;

        return this;
    };

    /**
     * Run configured condition
     * @public
     * @function
     * @name ch.Condition#test
     * @returns boolean
     */
    Condition.prototype.test = function (value, validation) {

        if (!this._enabled) {
            return true;
        }

        return this.fn.call(validation, value, this.num);
    };

    ch.Condition = Condition;

}(this, this.ch.$, this.ch));