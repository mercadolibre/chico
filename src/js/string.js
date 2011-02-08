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
    conf.conditions = {
        text:       { patt: /^([a-zA-Z\s]+)$/ },
        email:      { patt: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/ },
        url:        { patt: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ },
        minLength:  { expr: function(a,b) { return a >= b } },
        maxLength:  { expr: function(a,b) { return a <= b } }
    }
	
	conf.messages = conf.messages || {};	

    if (conf.msg) { 
        conf.messages.string = conf.msg;
        conf.msg = null; 
    }
    
    // $.string("message"); support
    if (!conf.text&&!conf.email&&!conf.url&&!conf.maxLength&&!conf.minLength){
        conf.text = true;
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
 *	@Interface Email validations
 *	@return An interface object
 */
 
ui.email = function(conf) {
    
    conf = conf || {};

    conf.type = "email";

    conf.email = true;

	conf.messages = conf.messages || {};	

    if (conf.msg) { conf.messages.email = conf.msg; conf.msg = null; }	

    return ui.string(conf);
    
}

ui.factory({ component: 'email' });

/**
 *	@Interface URL validations
 *	@return An interface object
 */
 
ui.url = function(conf) {
    
    conf = conf || {};
    
    conf.type = "url";
    
    conf.url = true;
    
	conf.messages = conf.messages || {};	
    
    if (conf.msg) { conf.messages.url = conf.msg; conf.msg = null; }	

    return ui.string(conf);
    
}

ui.factory({ component: 'url' });

/**
 *	@Interface MinLength validations
 *	@return An interface object
 */
 
ui.minLength = function(conf) {
    
    conf = conf || {};
    
    conf.type = "minLength";
    
    conf.minLength = conf.value;

	conf.messages = conf.messages || {};	

    if (conf.msg) { conf.messages.minLength = conf.msg; conf.msg = null; }	

    return ui.string(conf);
    
}

ui.factory({ component: 'minLength' });

/**
 *	@Interface MaxLength validations
 *	@return An interface object
 */
 
ui.maxLength = function(conf) {
    
    conf = conf || {};
    
    conf.type = "maxLength";
    
    conf.maxLength = conf.value;

	conf.messages = conf.messages || {};	

    if (conf.msg) { conf.messages.maxLength = conf.msg; conf.msg = null; }

    return ui.string(conf);
    
}

ui.factory({ component: 'maxLength' });
