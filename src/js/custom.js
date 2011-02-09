/**
 *	Custom validations
 *  @Extends Watcher
 *	@Interface
 */

ui.custom = function(conf){
    
    if (!conf.lambda) {
        alert("Custom Validation fatal error: Need a function to evaluate, try $().custom(function(){},\"Message\");");
    }
    
    /**
	 *  Override Watcher Configuration
	 */
	// Define the validation interface    
    conf.custom = true;
	// Add validation types
	conf.types = "custom";
    // Define the conditions of this interface
    conf.conditions = {
        // I don't have pre-conditions, comes within an argument 
        custom: { func: conf.lambda }
    }

	conf.messages = conf.messages || {};

    if (conf.msg) { conf.messages.custom = conf.msg; conf.msg = null; }
	
    /**
	 *  Extend Watcher
	 */
 	var that = ui.watcher(conf);

    /**
	 *  Public Object
	 */
	return that.publish;
};
