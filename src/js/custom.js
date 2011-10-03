
/**
* Create custom validation interfaces for Validator validation engine.
* @name Custom
* @class Custom
* @interface
* @augments ch.Uiobject
* @requires ch.Watcher
* @memberOf ch
* @param {Function} function Custom function to evaluete a value.
* @param {String} [message] Validation message.
* @returns itself
* @see ch.Watcher
* @see ch.Required
* @see ch.Number
* @see ch.String
* @see ch.Validator
* @see ch.Condition
* @example
* // Validate a even number
* $("input").custom(function (value) {
* 	return (value%2==0) ? true : false;
* }, "Enter a even number");
*/
ch.extend("watcher").as("custom", function(conf) {
	
	if (!conf.lambda) {
		alert("Custom Validation fatal error: Need a function to evaluate, try $().custom(function(){},\"Message\");");
	}

	// Define the conditions of this interface
	conf.condition = {
		// I don't have pre-conditions, comes within conf.lambda argument
		name: "custom",
		func: conf.lambda,
		message: conf.msg || conf.message || "Error"
	};

	return conf;
});