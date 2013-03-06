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
            // the following regular expression has the utf code for the lating characters
            // the ranges are A,EI,O,U,a,ei,o,u,ç,Ç please for reference see http://www.fileformat.info/info/charset/UTF-8/list.htm
            'patt': /^([a-zA-Z\u00C0-\u00C4\u00C8-\u00CF\u00D2-\u00D6\u00D9-\u00DC\u00E0-\u00E4\u00E8-\u00EF\u00F2-\u00F6\u00E9-\u00FC\u00C7\u00E7\s]*)$/,
            'message': 'Use only letters.'
        },
        'email': {
            'patt': /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            'message': 'Use a valid e-mail such as name@example.com.'
        },
        'url': {
            'patt': /^((https?|ftp|file):\/\/|((www|ftp)\.)|(\/|.*\/)*)[a-z0-9-]+((\.|\/)[a-z0-9-]+)+([/?].*)?$/,
            'message': 'It must be a valid URL.'
        },
        'minLength': {
            'expr': function (a, b) { return a.length >= b; },
            'message': 'Enter at least {#num#} characters.'
        },
        'maxLength': {
            'expr': function (a, b) { return a.length <= b; },
            'message': 'The maximum amount of characters is {#num#}.'
        },
        'number': {
            'patt': /^(-?[0-9\s]+)$/,
            'message': 'Use only numbers.'
        },
        'max': {
            'expr': function (a, b) { return a <= b; },
            'message': 'The amount must be smaller than {#num#}.'
        },
        'min': {
            'expr': function (a, b) { return a >= b; },
            'message': 'The amount must be higher than {#num#}.'
        },
        'price': {
            'patt': /^(\d+)[.,]?(\d?\d?)$/,
            'message': 'Use a valid price such as (1,00).'
        },
        'required': {
            'expr': function (e) {

                if (e === undefined) {
                    throw new window.Error('"instance.test(HTMLElement)": The "HTMLElement" parameter must be defined and be HTMLElement object.');
                }

                var $e = $(e),
                    tag = ($e.hasClass('ch-form-options') || $e.hasClass('ch-list-options')) ? 'OPTIONS' : e.tagName,
                    val,
                    validated;

                switch (tag) {
                case 'OPTIONS':
                    validated = $e.find('input:checked').length !== 0;
                    break;

                case 'SELECT':
                    val = $e.val();
                    validated = (val !== '-1' && val !== '');
                    break;

                case 'INPUT':
                case 'TEXTAREA':
                    validated = $.trim($e.val()).length !== 0;
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

        if (condition === undefined) {
            throw new window.Error('"ch.Condition(condition)": Expected condition be defined and be an object.');
        }

        if ((condition.name === undefined) || (typeof condition.name !== 'string')) {
            throw new window.Error('"ch.Condition({ \'name\': \'custom\' })": Expected property name be defined and be a string.');
        }

        if ((condition.name === 'custom') && (typeof condition.fn !== 'function')) {
            throw new window.Error('"ch.Condition({ \'name\': \'custom\', \'fn\': function(){} })": Expected property "fn" be defined as a function with "custom" condition name.');
        }

        if ((condition.name === 'min') && ((condition.num === undefined) || (typeof condition.num !== 'number'))) {
            throw new window.Error('"ch.Condition({ \'name\': \'min\', \'num\': 10 })": Expected property "num" be defined as a number with "min" condition name.');
        }

        if ((condition.name === 'max') && ((condition.num === undefined) || (typeof condition.num !== 'number'))) {
            throw new window.Error('"ch.Condition({ \'name\': \'max\', \'num\': 10 })": Expected property "num" be defined as a number with "max" condition name.');
        }

        if ((condition.name === 'minLength') && ((condition.num === undefined) || (typeof condition.num !== 'number'))) {
            throw new window.Error('"ch.Condition({ \'name\': \'minLength\', \'num\': 10 })": Expected property "num" be defined as a number with "minLength" condition name.');
        }

        if ((condition.name === 'maxLength') && ((condition.num === undefined) || (typeof condition.num !== 'number'))) {
            throw new window.Error('"ch.Condition({ \'name\': \'maxLength\', \'num\': 10 })": Expected property "num" be defined as a number with "maxLength" condition name.');
        }

        if (conditions[condition.name] === undefined) {
            throw new window.Error('"ch.Condition({ \'name\': \'' + condition.name + '\' })": "' + condition.name + '" Condition is not defined. Use "custom" to define your own condition.');
        }

        $.extend(this, conditions[condition.name], condition);


        // replaces the condition default message in the following conditions max, min, minLenght, maxLenght
        if (!condition.message && (condition.name === 'min' || condition.name === 'max' || condition.name === 'minLength' || condition.name === 'maxLength')) {

            /**
             * Message defined for this condition
             * @public
             * @name ch.Condition#message
             * @type string
             */
            this.message = conditions[condition.name].message.replace('{#num#}', condition.num);

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
     * Returns true if the condition is enabled.
     * @public
     * @name ch.Condition#isEnabled
     * @function
     * @returns itself
     */
    Condition.prototype.isEnabled = function () {

        return this._enabled;
    };

    /**
     * Run configured condition
     * @public
     * @function
     * @name ch.Condition#test
     * @returns boolean
     */
    Condition.prototype.test = function (value, reference) {

        var that = this;

        if (value === undefined) {
            throw new window.Error('"instance.test(value)": The "value" parameter must be defined.');
        }

        if (!that._enabled) {
            return true;
        }

        if (that.patt) {
            return that.patt.test(value);
        }

        if (that.expr) {
            return that.expr(value, that.num);
        }

        if (that.fn) {
            // Call validation function with 'that' as scope.
            return that.fn.call(reference, value);
        }
    };

    ch.Condition = Condition;

}(this, (this.jQuery || this.Zepto), this.ch));