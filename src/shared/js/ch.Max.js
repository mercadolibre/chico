(function (window, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Max validates a number with a maximun value.
     * @name Max
     * @class Max
     * @interface
     * @augments ch.Controls
     * @augments ch.Validation
     * @requires ch.Validation
     * @memberOf ch
     * @param {Object} [conf] Object with configuration properties.
     * @param {String} [conf.content] Validation message.
     * @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
     * @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
     * @param {String} [conf.context] It's a reference to position the validation-bubble
     * @param {Number} value Minimun number value.
     * @returns itself
     * @factorized
     * @see ch.Validation
     * @see ch.Required
     * @see ch.Custom
     * @see ch.String
     * @see ch.Validator
     * @see ch.Condition
     * @exampleDescription
     * @example
     * $("input").max(10, "Write a number smaller than 10");
     */
    function Max($el, options) {

        var opts = options || {};

        opts.condition = {
            'name': 'max',
            'message': opts.content,
            'num': opts.num
        };

        return $el.validation(opts);

    }

    Max.prototype.name = 'max';
    Max.prototype.constructor = Max;
    Max.prototype.preset = 'validation';

    ch.factory(Max);

}(this, this.ch));