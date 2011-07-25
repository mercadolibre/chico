
/**
* Create custom validation interfaces for Watcher validation engine.
* @name Custom
* @class Custom
* @interface
* @augments ch.Watcher
* @memberOf ch
* @param {Object} conf Object with configuration properties
* @returns {itself}
* @see ch.Watcher
* @see ch.Required
* @see ch.Number
* @see ch.String
* @example
* // Validate a even number
* $("input").custom(function(value){
*      return (value%2==0) ? true : false;
* }, "Enter a even number");
*/

ch.extend("watcher").as("custom", function(conf) {
	
	if (!conf.lambda) {
        alert("Custom Validation fatal error: Need a function to evaluate, try $().custom(function(){},\"Message\");");
    };
	// Define the validation interface    
    conf.custom = true;
    // Define the conditions of this interface
    conf.conditions = [{
		// I don't have pre-conditions, comes within conf.lambda argument 
        name: "custom",
        func: conf.lambda 
    }];

    return conf;  
});