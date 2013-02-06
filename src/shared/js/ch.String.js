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

(function (window, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Email validates a correct email syntax.
     * @name Email
     * @class Email
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
     * @returns itself
     * @factorized
     * @see ch.Validation
     * @see ch.Required
     * @see ch.Custom
     * @see ch.Number
     * @see ch.Validator
     * @see ch.Condition
     * @exampleDescription Create a email validation
     * @example
     * $("input").email("This field must be a valid email.");
     */
    function Email($el, options) {

        var opts = options || {};

        opts.condition = {
            'name': 'email',
            'message': opts.content
        };

        return $el.validation(opts);

    }

    Email.prototype.name = 'email';
    Email.prototype.constructor = Email;
    Email.prototype.preset = 'validation';

    ch.factory(Email);

}(this, this.ch));

(function (window, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Url validates URL syntax.
     * @name Url
     * @class Url
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
     * @returns itself
     * @factorized
     * @see ch.Validation
     * @see ch.Required
     * @see ch.Custom
     * @see ch.Number
     * @see ch.Validator
     * @see ch.Condition
     * @exampleDescription Create a URL validation
     * @example
     * $("input").url("This field must be a valid URL.");
     */
    function URL($el, options) {

        var opts = options || {};

        opts.condition = {
            'name': 'url',
            'message': opts.content
        };

        return $el.validation(opts);

    }

    URL.prototype.name = 'url';
    URL.prototype.constructor = URL;
    URL.prototype.preset = 'validation';

    ch.factory(URL);

}(this, this.ch));

(function (window, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * MinLength validates a minimun amount of characters.
     * @name MinLength
     * @class MinLength
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
     * @param {Number} num Minimun number characters.
     * @returns itself
     * @factorized
     * @see ch.Validation
     * @see ch.Required
     * @see ch.Custom
     * @see ch.Number
     * @see ch.Validator
     * @see ch.Condition
     * @exampleDescription Create a minLength validation
     * @example
     * $("input").minLength(10, "At least 10 characters..");
     */
    function MinLength($el, options) {

        var opts = options || {};

        opts.condition = {
            'name': 'minLength',
            'message': opts.content,
            'num': opts.num
        };

        return $el.validation(opts);

    }

    MinLength.prototype.name = 'minLength';
    MinLength.prototype.constructor = MinLength;
    MinLength.prototype.preset = 'validation';

    ch.factory(MinLength);

}(this, this.ch));

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