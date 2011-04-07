/**
 *	Required validations
 *  @Extends Watcher
 *	@Interface
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