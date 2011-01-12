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
	// Conditions absorvs that.isEmpty in checkConditions for compatibility
	/*conf.checkConditions = function(type) { // We recibe "type" arguemnt, but we don't care
		return !that.isEmpty(conf);
	}
    */
    conf.conditions = {
        required: { func:'!that.isEmpty'},
    }
    
	// Messages
	conf.messages = {
		required: "Campo requerido."
	};	
	
    // Process Messages
//    if (that.messages) that.messages = that.processMessages(conf);
	
    /**
	 *  Extend Watcher
	 */
 	var that = ui.watcher(conf);

    /**
	 *  Public Object
	 */
	return that.publish;
};
