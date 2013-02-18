(function (window, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Min validates a number with a minimun value.
     * @name Min
     * @class Min
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
     * $("input").min(10, "Write a number bigger than 10");
     */
    function Min($el, options) {

        var opts = options || {};

        opts.condition = {
            'name': 'min',
            'message': opts.content,
            'num': opts.num
        };

        return $el.validation(opts);
    }

    Min.prototype.name = 'min';
    Min.prototype.constructor = Min;
    Min.prototype.preset = 'validation';

    ch.factory(Min);

}(this, this.ch));