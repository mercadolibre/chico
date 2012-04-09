
/**
* Create custom validation interfaces for Validator validation engine.
* @name Custom
* @class Custom
* @interface
* @augments ch.Controls
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.message] Validation message.
* @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
* @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {String} [conf.context] It's a reference to position the validation-bubble
* @param {Function} function Custom function to evaluete a value.
* @returns itself
* @see ch.Validation
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
ch.extend("validation").as("custom", function(conf) {
	
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