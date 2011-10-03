
/**
* Validate numbers.
* @name Number
* @class Number
* @interface
* @augments ch.Uiobject
* @requires ch.Watcher
* @memberOf ch
* @param {String} [message] Validation message.
* @returns itself
* @see ch.Watcher
* @see ch.Required
* @see ch.Custom
* @see ch.String
* @see ch.Validator
* @see ch.Condition
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
* @augments ch.Uiobject
* @requires ch.Watcher
* @memberOf ch
* @param {Number} value Minimun number value.
* @param {String} [message] Validation message.
* @returns itself
* @see ch.Watcher
* @see ch.Required
* @see ch.Custom
* @see ch.String
* @see ch.Validator
* @see ch.Condition
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
* @augments ch.Uiobject
* @requires ch.Watcher
* @memberOf ch
* @param {Number} value Minimun number value.
* @param {String} [message] Validation message.
* @returns itself
* @see ch.Watcher
* @see ch.Required
* @see ch.Custom
* @see ch.String
* @see ch.Validator
* @see ch.Condition
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
* @augments ch.Uiobject
* @requires ch.Watcher
* @memberOf ch
* @param {String} [message] Validation message.
* @returns itself
* @see ch.Watcher
* @see ch.Required
* @see ch.Custom
* @see ch.String
* @see ch.Validator
* @see ch.Condition
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