/**
 *	Required validations
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.required = function(conf){
	// Inheritance
	var that = ui.watcher();
	
	// Watcher status
	conf.status = true;
	
	// Validation types
	conf.types = "required";
	
	// Validation map
	conf.validations = {};
	conf.validations["required"] = true;
	
	// Helper
	that.helper = ui.helper(conf);
	
	// Configure message by parameter
	if(!conf.messages) conf.messages = {};
	conf.messages["required"] = conf.messages["required"] || "Completa este campo.";
	
	// Conditions
	conf.checkConditions = function(){
		return (conf.element.tagName == 'SELECT') ? $(conf.element).val() != -1 : $.trim( $(conf.element).val() ).length > 0; // TODO: Revisar el estandar de <select>
	};
	
	// Create the publish object to be returned
    conf.publish = {
    	uid: conf.id,
		element: conf.element,
		status: conf.status,
		and: function(){ return $(conf.element); },
		validations: conf.validations,
		type: "ui.required",
		validate: function(){
			that.validate(conf);
			return conf.publish;
		}
	};
	
	return conf.publish;
};
