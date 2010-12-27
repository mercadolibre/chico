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
	
	// Validation map
	conf.validations = {};
	conf.validations.required = true;

	if (that.checkInstance(conf)) {
	   return that;   
	}	


	// CHECKBOX, RADIO
	if($(conf.element).hasClass("options")){
		// Helper reference from will be fired
		// H4
		if($(conf.element).find('h4').length > 0){
			var h4 = $(conf.element).find('h4'); // Find h4
				h4.wrapInner('<span>'); // Wrap content with inline element
			conf.reference = h4.children(); // Inline element in h4 like helper reference
			
		// Legend
		}else if($(conf.element).prev().attr('tagName') == 'LEGEND'){
			conf.reference = $(conf.element).prev(); // Legend like helper reference
		};
	
	// INPUT, SELECT, TEXTAREA
	} else {
		conf.reference = $(conf.element);
	};
	
	// Helper
	that.helper = ui.helper(conf);
	
	// Configure message by parameter
	if(!conf.messages) conf.messages = {};
	conf.messages.required = conf.messages.required || "Completa este campo.";
	
	// Conditions absorvs that.isEmpty in checkConditions for compatibility
	conf.checkConditions = function(type) { // We recibe "type" arguemnt, but we don't care
		return !that.isEmpty(conf);
	}
	
	// Create the publish object to be returned
    conf.publish = {
    	uid: conf.id,
		element: conf.element,
		status: conf.status,
		and: function(){ return $(conf.element); },
		validations: conf.validations,
		type: "ui.required",
		reset: function(){
			that.reset(conf);
			return conf.publish;
		},
		validate: function(){
			that.validate(conf);
			return conf.publish;
		}
	};
	
	that.getParent(conf); // Get my parent or set it
	
	return conf.publish;
};
