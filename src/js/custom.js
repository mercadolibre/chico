
/**
* Create custom validation interfaces for Validator validation engine.
* @name Custom
* @class Custom
* @interface
* @augments ch.Validator
* @memberOf ch
* @param {object} conf Object with configuration properties
* @returns itself
* @see ch.Validator
* @see ch.Required
* @see ch.Number
* @see ch.String
* @example
* // Validate a even number
* $("input").custom(function(value){
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