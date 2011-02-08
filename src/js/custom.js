/**
 *	Custom validations
 *  @Extends Watcher
 *	@Interface
 */

ui.custom = function(conf){

    /**
	 *  Override Watcher Configuration
	 */
	// Define the validation interface    
    conf.custom = true;
	// Add validation types
	conf.types = "custom";
    // Define the conditions of this interface
    conf.conditions = {
        // I don't have conditions, you must tell me what to do
    }
    
	conf.messages = conf.messages || {};

    if (conf.msg) { conf.messages.required = conf.msg; conf.msg = null; }
	
    /**
	 *  Extend Watcher
	 */
 	var that = ui.watcher(conf);

    /**
	 *  Public Object
	 */
	return that.publish;
};
