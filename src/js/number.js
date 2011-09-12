
/**
* Validate numbers.
* @name Number
* @class Number
* @interface
* @augments ch.Validator
* @memberOf ch
* @param {object} conf Object with configuration properties
* @returns itself
* @see ch.Validator
* @see ch.Required
* @see ch.Custom
* @see ch.String
* @example
* // Create a number validation
* $("input").number("This field must be a number.");
*/
ch.extend("watcher").as("number", function(conf) {
	
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
* @augments ch.Validator
* @memberOf ch
* @param {number} value Minimun number value.
* @param {string} [message] Validation message.
* @returns itself
* @see ch.Validator
* @example
* $("input").min(10, "Write a number bigger than 10");
*/
ch.extend("watcher").as("min", function (conf) {

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
* @augments ch.Validator
* @memberOf ch
* @param {number} value Minimun number value.
* @param {string} [message] Validation message.
* @returns itself
* @see ch.Validator
* @example
* $("input").max(10, "Write a number smaller than 10");
*/
ch.extend("watcher").as("max", function (conf) {

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
* @augments ch.Validator
* @memberOf ch
* @param {string} [message] Validation message.
* @returns itself
* @see ch.Validator
* @example
* $("input").price("Write valid price.");
*/
ch.extend("watcher").as("price", function (conf) {

	conf.condition = {
		name: "price",
		patt: /^(\d+)[.,]?(\d?\d?)$/,
		message: conf.msg || conf.message
	};

	return conf;

});