/**
 *	@Interface String validations
 *	@return An interface object
 */

ui.string = function(conf) {

    /**
	 *  Override Watcher Configuration
	 */
	// Add validation types
	conf.types = "text,email,url,minLength,maxLength";
	// Redefine Helper's reference;
	conf.reference = $(conf.element);
	// Conditions map TODO: uppercase, lowercase, varchar
	/*
	       TODO: The regex object process all conditions, we need to refactor this pattern
              validation {
                  pattern: /w/
              };
              validation {
                  expresion: {
                      value1: value.length,
                      operator: >=,
                      value2: parseInt(conf.minLength)   
                  }
              };
	*/
	conf.checkConditions = function(type){
		var value = $(conf.element).val();
		var regex = {
			text:		(/^([a-zA-Z\s]+)$/m).test(value),
			email:		(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i).test(value),
			url:		(/^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([\w]+)(.[\w]+){1,2}$/).test(value), // TODO: No tendria que soportar "www.algo" (sin .com)
			minLength:	value.length >= parseInt(that.validations.minLength),
			maxLength:	value.length <= parseInt(that.validations.maxLength)
		};
		return regex[type];
	};
    // Messages
	conf.defaultMessages = {
		text:		"Usa sólo letras.",
		email:		"Usa el formato nombre@ejemplo.com.",
		url:		"Usa el formato www.sitio.com.",
		minLength:	"Ingresa al menos " + conf.minLength + " caracteres.",
		maxLength:	"El máximo de caracteres es " + conf.maxLength + "."
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
 *	@Interface Email validations
 *	@return An interface object
 */
 
ui.email = function(conf) {
    
    conf = conf || {};
    
    conf.email = true;

    return ui.string(conf);
    
}

ui.factory({ component: 'email' });

/**
 *	@Interface URL validations
 *	@return An interface object
 */
 
ui.url = function(conf) {
    
    conf = conf || {};
    
    conf.url = true;

    return ui.string(conf);
    
}

ui.factory({ component: 'url' });

/**
 *	@Interface MinLength validations
 *	@return An interface object
 */
 
ui.minLength = function(conf) {
    
    conf = conf || {};
    
    conf.minLength = conf.value;

    return ui.string(conf);
    
}

ui.factory({ component: 'minLength' });

/**
 *	@Interface MaxLength validations
 *	@return An interface object
 */
 
ui.maxLength = function(conf) {
    
    conf = conf || {};
    
    conf.maxLength = conf.value;

    return ui.string(conf);
    
}

ui.factory({ component: 'maxLength' });
