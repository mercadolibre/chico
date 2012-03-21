
/**
* Validate numbers.
* @name Number
* @class Number
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.message] Validation message.
* @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
* @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {String} [conf.context] It's a reference to position the validation-bubble
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.String
* @see ch.Validator
* @see ch.Condition
* @example
* // Create a number validation
* $("input").number("This field must be a number.");
*/
ch.extend("validation").as("number", function(conf) {
	
	// Define the conditions of this interface
	conf.condition = {
		name: "number",
		patt: /^(-?[0-9\s]+)$/,
		message: conf.msg || conf.message
	};

	return conf;

});

/**
* Validate a number with a minimun value.
* @name Min
* @class Min
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.message] Validation message.
* @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
* @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {String} [conf.context] It's a reference to position the validation-bubble
* @param {Number} value Minimun number value.
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.String
* @see ch.Validator
* @see ch.Condition
* @example
* $("input").min(10, "Write a number bigger than 10");
*/
ch.extend("validation").as("min", function (conf) {

	conf.condition = {
		name: "min",
		expr: function(a,b) { return a >= b },
		message: conf.msg || conf.message,
		value: conf.value
	};

	return conf;

});


/**
* Validate a number with a maximun value.
* @name Max
* @class Max
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.message] Validation message.
* @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
* @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {String} [conf.context] It's a reference to position the validation-bubble
* @param {Number} value Minimun number value.
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.String
* @see ch.Validator
* @see ch.Condition
* @example
* $("input").max(10, "Write a number smaller than 10");
*/
ch.extend("validation").as("max", function (conf) {

	conf.condition = {
		name: "max",
		expr: function(a,b) { return a <= b },
		message: conf.msg || conf.message,
		value: conf.value
	};

	return conf;

});

/**
* Validate a number with a price format.
* @name Price
* @class Price
* @interface
* @augments ch.Controls* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.message] Validation message.
* @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
* @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {String} [conf.context] It's a reference to position the validation-bubble
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.String
* @see ch.Validator
* @see ch.Condition
* @example
* $("input").price("Write valid price.");
*/
ch.extend("validation").as("price", function (conf) {

	conf.condition = {
		name: "price",
		patt: /^(\d+)[.,]?(\d?\d?)$/,
		message: conf.msg || conf.message
	};

	return conf;

});