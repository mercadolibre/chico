/**
 *	Required validations
 *  @Extends Watcher
 *	@Interface
 */

ui.required = function(conf){

    /**
	 *  Override Watcher Configuration
	 */
	// Define the validation interface    
    conf.required = true;
	// Add validation types
	conf.types = "required";
    // Define the conditions of this interface
    conf.conditions = {
        required: 'that.isEmpty' // This pattern is diferent
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
