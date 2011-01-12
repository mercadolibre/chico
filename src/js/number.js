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
	/*conf.checkConditions = function(type){
		var value = $(conf.element).val();
		var regex = {
			number:	!isNaN(value), // value.match(/^\d+$/m),
			min:	value >= parseInt(that.validations.min),
			max:	value <= parseInt(that.validations.max)
		};
		return regex[type];
	};*/
	
    conf.conditions = {
        number: { patt: /^\d+$/ },
        min:    { expr: function(a,b) { return a >= b } },
        max:    { expr: function(a,b) { return a <= b } },
    };
    
    // Messages
	conf.defaultMessages = {
		number:	"Usa sólo números.",
		min:	"La cantidad mínima es " + conf.min + ".",
		max:	"La cantidad máxima es " + conf.max + "."
	};
	
	conf.messages = {}
	
    var types = conf.types.split(",");
	for (var i = 0, j = types.length; i < j; i ++) {
		for (var val in conf) {
			if (types[i] == val) {
				conf.messages[val] = conf.defaultMessages[val];
			};
		};
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


/**
 *	@Interface Min validations
 *	@return An interface object
 */
 
ui.min = function(conf) {
    
    conf = conf || {};
    
    conf.min = conf.value;

    return ui.number(conf);
    
}

ui.factory({ component: 'min' });

/**
 *	@Interface Max validations
 *	@return An interface object
 */
 
ui.max = function(conf) {
    
    conf = conf || {};
    
    conf.max = conf.value;

    return ui.number(conf);
    
}

ui.factory({ component: 'max' });

