/**
 *	Custom validations
 *  @Extends Watcher
 *	@Interface
 */

ui.custom = function(conf) {

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

    if ( conf.hasOwnProperty("msg") ) { 
    	conf.messages.custom = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };
    
	// Define the validation interface    
    conf.custom = true;

	// Add validation types
	conf.types = "custom";
    // Define the conditions of this interface
    conf.conditions = {
		// I don't have pre-conditions, comes within an argument 
        custom: { func: conf.lambda }       
    };


	return ui.watcher.call(this, conf);
    
};