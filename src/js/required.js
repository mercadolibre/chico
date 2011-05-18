
/**
 * Required interface for Watcher.
 * @name Required
 * @class Required
 * @augments ch.Watcher
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 * @see ch.Number
 * @see ch.String
 * @see ch.Custom
 * @example
 * // Simple validation
 * $("input").required("This field is required");
 * @see ch.Watcher
 */

ch.required = function(conf) {
/**
 *  Constructor
 */
	
	conf = conf || {};
	
    conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) {     	
    	conf.messages.required = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };
    
	// Define the validation interface    
    conf.required = true;
    
    // Add validation types
	conf.types = "required";
    // Define the conditions of this interface
    conf.conditions = {
        required: 'that.isEmpty' // This pattern is diferent
    };
	
	return ch.watcher.call(this, conf);
    
};