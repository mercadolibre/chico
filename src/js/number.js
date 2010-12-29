/**
 *	Number validations
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.number = function(conf){
	
    /**
	 *  Override Watcher Configuration
	 */
	// Validation types
	conf.types = "number,min,max";
	// Helper
	conf.reference = $(conf.element);
	// Conditions map TODO: float
	conf.checkConditions = function(type){
		var value = $(conf.element).val();
		var regex = {
			number:	!isNaN(value), // value.match(/^\d+$/m),
			min:	value >= parseInt(that.validations.min),
			max:	value <= parseInt(that.validations.max)
		};
		return regex[type];
	};
    // Messages
	conf.messages = {
		number:	"Usa sólo números.",
		min:	"La cantidad mínima es " + conf.min + ".",
		max:	"La cantidad máxima es " + conf.max + "."
	};
	
    /**
	 *  Extend Watcher
	 */
 	var that = ui.watcher(conf);
	
    /**
	 *  Public Object
	 */
	return that.publish;
};
