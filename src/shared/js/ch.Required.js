(function (window, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

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
     * Required validates that a must be filled.
     * @name Required
     * @class Required
     * @interface
     * @augments ch.Controls
     * @augments ch.Validation
     * @memberOf ch
     * @param {Object} [conf] Object with configuration properties.
     * @param {String} [conf.content] Validation message.
     * @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
     * @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
     * @param {String} [conf.context] It's a reference to position the validation-bubble
     * @returns itself
     * @factorized
     * @see ch.Validation
     * @see ch.Custom
     * @see ch.Number
     * @see ch.String
     * @see ch.Validator
     * @see ch.Condition
     * @exampleDescription Simple validation
     * @example
     * $("input").required("This field is required");
     */
    function Required($el, options) {
        return $el.validation(options);
    }

    Required.prototype.name = 'required';
    Required.prototype.constructor = Required;

    ch.factory(Required, normalizeOptions);

}(this, this.ch));