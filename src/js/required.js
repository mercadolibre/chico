
/**
* Creates required validations.
* @name Required
* @class Required
* @interface
* @augments ch.Watcher
* @memberOf ch
* @param {object} conf Object with configuration properties
* @returns itself
* @see ch.Watcher
* @see ch.Custom
* @see ch.Number
* @see ch.String
* @example
* // Simple validation
* $("input").required("This field is required");
*/

ch.extend("watcher").as("required", function(conf) {

	// Define the validation interface    
	conf.required = true;
	// Define the conditions of this interface
	conf.conditions = [{
		name: "required"
	}];

	return conf;

});