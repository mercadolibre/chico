
/**
 * Create custom validation interfaces for Watcher validation engine.
 * @name Custom
 * @class Custom
 * @augments ch.Watcher
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @example
 * // Validate a even number
 * $("input").custom(function(value){
 *      return (value%2==0) ? true : false;
 * }, "Enter a even number");
 * @see ch.Watcher
 */

ch.custom = function(conf) {

/**
 *  Validation
 */	
	
	if (!conf.lambda) {
        alert("Custom Validation fatal error: Need a function to evaluate, try $().custom(function(){},\"Message\");");
    };

/**
 *  Constructor
 */

	conf = conf || {};
    conf.messages = conf.messages || {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
    	conf.messages.custom = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };
    
	// Define the validation interface    
    conf.custom = true;

	// Add validation types
	conf.types = "custom";
    // Define the conditions of this interface
    conf.conditions = [{
		// I don't have pre-conditions, comes within conf.lambda argument 
        name: "custom",
        func: conf.lambda 
    }];


	return ch.watcher.call(this, conf);
    
};