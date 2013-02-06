(function (window, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * MaxLength validates a maximun amount of characters.
     * @name MaxLength
     * @class MaxLength
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
     * @param {Number} num Maximun number of characters.
     * @returns itself
     * @factorized
     * @see ch.Validation
     * @see ch.Required
     * @see ch.Custom
     * @see ch.Number
     * @see ch.Validator
     * @see ch.Condition
     * @exampleDescription Create a maxLength validation
     * @example
     * $("input").maxLength(10, "No more than 10 characters..");
     */
    function MaxLength($el, options) {

        var opts = options || {};

        opts.condition = {
            'name': 'maxLength',
            'message': opts.content,
            'num': opts.num
        };

        return $el.validation(opts);

    }

    MaxLength.prototype.name = 'maxLength';
    MaxLength.prototype.constructor = MaxLength;
    MaxLength.prototype.preset = 'validation';

    ch.factory(MaxLength);

}(this, this.ch));