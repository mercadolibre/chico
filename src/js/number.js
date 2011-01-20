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
    conf.conditions = {
        number: { patt: /^([0-9\s]+)$/ },
        min:    { expr: function(a,b) { return a >= b } },
        max:    { expr: function(a,b) { return a <= b } }
    };
    
    // Messages
	conf.defaultMessages = {
		number:	"Usa sólo números.",
		min:	"La cantidad mínima es " + conf.min + ".",
		max:	"La cantidad máxima es " + conf.max + "."
	};

	conf.messages = conf.messages || {};

    if (conf.msg) { 
        conf.messages.number = conf.msg; 
        conf.msg = null; 
    }

    // $.number("message"); support
    if (!conf.number&&!conf.min&&!conf.max){
        conf.number = true;
    }
    
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

	conf.messages = conf.messages || {};

    if (conf.msg) { conf.messages.min = conf.msg; conf.msg = null; }
    
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

	conf.messages = conf.messages || {};

    if (conf.msg) { conf.messages.max = conf.msg; conf.msg = null; }
    
    return ui.number(conf);
    
}

ui.factory({ component: 'max' });

