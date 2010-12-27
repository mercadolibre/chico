/**
 *	Number validations
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.number = function(conf){
	// Inheritance
	var that = ui.watcher();
	
	// Watcher status
	conf.status = true;
	
	// Validation types
	conf.types = "number,min,max";
	
	// Validation map
	conf.validations = that.getValidations(conf);

	if (that.checkInstance(conf)) {
	   return that;   
	}	

	// Helper
	conf.reference = $(conf.element);
	that.helper = ui.helper(conf);
	
	// Messages map TODO: float
	var messages = {
		number:	"Usa sólo números.",
		min:	"La cantidad mínima es " + conf.min + ".",
		max:	"La cantidad máxima es " + conf.max + ".",
	};
	
	// Configure messages by parameter (conf vs. default messages)
	for(var msg in conf.messages) messages[msg] = conf.messages[msg];
	conf.messages = messages;
	
	// Conditions map TODO: float
	conf.checkConditions = function(type){
		var value = $(conf.element).val();
		
		var regex = {
			number:	!isNaN(value), // value.match(/^\d+$/m),
			min:	value >= parseInt(conf.validations.min),
			max:	value <= parseInt(conf.validations.max)
		};
		
		return regex[type];
	};
	
	// Create the publish object to be returned
    conf.publish = {
    	uid: conf.id,
		element: conf.element,
		status: conf.status,
		and: function(){ return $(conf.element); },
		validations: conf.validations,
		type: "ui.number",
		validate: function(){
			that.validate(conf);
			return conf.publish;
		}
	};
	
	return conf.publish;
};
