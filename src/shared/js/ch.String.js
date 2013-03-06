(function (window, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * String validates a given text as string.
     * @name String
     * @class String
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
     * @see ch.Required
     * @see ch.Custom
     * @see ch.Number
     * @see ch.Validator
     * @see ch.Condition
     * @exampleDescription Create a string validation
     * @example
     * $("input").string("This field must be a string.");
     */
    function String($el, options) {

        var opts = options || {};

        opts.condition = {
            'name': 'string',
            'message': opts.content
        };

        return $el.validation(opts);

    }

    String.prototype.name = 'string';
    String.prototype.constructor = String;
    String.prototype.preset = 'validation';

    ch.factory(String);

}(this, this.ch));