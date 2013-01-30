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
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function String($el, options) {

		var options = options || {};

		options.condition = {
			'name': 'string',
			'message': options.content
		};

		return $el.validation(options);

	}

	String.prototype.name = 'string';
	String.prototype.constructor = String;
	String.prototype.interface = 'validation';

	ch.factory(String);

}(this, this.jQuery, this.ch));

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
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Email($el, options) {

		var options = options || {};

		options.condition = {
			'name': 'email',
			'message': options.content
		};

		return $el.validation(options);

	}

	Email.prototype.name = 'email';
	Email.prototype.constructor = Email;
	Email.prototype.interface = 'validation';

	ch.factory(Email);

}(this, this.jQuery, this.ch));



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
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function URL($el, options) {

		var options = options || {};

		options.condition = {
			'name': 'url',
			'message': options.content
		};

		return $el.validation(options);

	}

	URL.prototype.name = 'url';
	URL.prototype.constructor = URL;
	URL.prototype.interface = 'validation';

	ch.factory(URL);

}(this, this.jQuery, this.ch));

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
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function MinLength($el, options) {

		var options = options || {};

		options.condition = {
			'name': 'minLength',
			'message': options.content,
			'num': options.num
		};

		return $el.validation(options);

	}

	MinLength.prototype.name = 'minLength';
	MinLength.prototype.constructor = MinLength;
	MinLength.prototype.interface = 'validation';

	ch.factory(MinLength);

}(this, this.jQuery, this.ch));

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
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function MaxLength($el, options) {

		var options = options || {};

		options.condition = {
			'name': 'maxLength',
			'message': options.content,
			'num': options.num
		};

		return $el.validation(options);

	}

	MaxLength.prototype.name = 'maxLength';
	MaxLength.prototype.constructor = MaxLength;
	MaxLength.prototype.interface = 'validation';

	ch.factory(MaxLength);

}(this, (this.jQuery || this.Zepto), this.ch));