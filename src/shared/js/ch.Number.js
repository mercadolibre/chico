/**
* Number validates a given number.
* @name Number
* @class Number
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
* @see ch.String
* @see ch.Validator
* @see ch.Condition
* @exampleDescription Create a number validation
* @example
* $("input").number("This field must be a number.");
*/
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Number($el, options){

		var options = options || {};

		// Define the conditions of this interface
		options.condition = {
			'name': 'number',
			'message': options.content
		};

		return $el.validation(options);
	}

	Number.prototype.name = 'number';
	Number.prototype.constructor = Number;
	Number.prototype.interface = 'validation';

	ch.factory(Number);

}(this, this.jQuery, this.ch));


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
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Min($el, options) {

		var options = options || {};

		options.condition = {
			'name': 'min',
			'message': options.content,
			'num': options.num
		};

		return $el.validation(options);
	}

	Min.prototype.name = 'min';
	Min.prototype.constructor = Min;
	Min.prototype.interface = 'validation';

	ch.factory(Min);

}(this, this.jQuery, this.ch));

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
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Max($el, options) {

		var options = options || {};

		options.condition = {
			'name': 'max',
			'message': options.content,
			'num': options.num
		};

		return $el.validation(options);

	}

	Max.prototype.name = 'max';
	Max.prototype.constructor = Max;
	Max.prototype.interface = 'validation';

	ch.factory(Max);

}(this, this.jQuery, this.ch));

/**
* Price validates a number like the price format.
* @name Price
* @class Price
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
* @see ch.String
* @see ch.Validator
* @see ch.Condition
* @exampleDescription
* @example
* $("input").price("Write valid price.");
*/
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Price($el, options) {

		var options = options || {};

		options.condition = {
			'name': 'price',
			'message': options.content
		};

		return $el.validation(options);

	}

	Price.prototype.name = 'price';
	Price.prototype.constructor = Price;
	Price.prototype.interface = 'validation';

	ch.factory(Price);

}(this, (this.jQuery || this.Zepto), this.ch));