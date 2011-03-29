/**
 *	@Interface String validations
 *	@return An interface object
 */

ui.string = function(conf) {

/**
 *  Constructor
 */
	conf = conf || {};
	
    conf.messages = conf.messages || {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.string = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };
    
    // $.string("message"); support
    if ( !conf.text && !conf.email && !conf.url && !conf.maxLength && !conf.minLength ) {
        conf.text = true;
    };

	// Add validation types
	conf.types = "text,email,url,minLength,maxLength";
    
    // Define the conditions of this interface
    conf.conditions = {
		text:       { patt: /^([a-zA-Z\s]+)$/ },
        email:      { patt: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/ },
        //url:        { patt: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ },
        // TODO: Improve this expression.
        url:        { patt: /((ftp|http|https):\/\/)?(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ },
        minLength:  { expr: function(a,b) { return a >= b } },
        maxLength:  { expr: function(a,b) { return a <= b } }
        // Conditions map TODO: uppercase, lowercase, varchar
    };


	return ui.watcher.call(this, conf);
    
};


/**
 *	@Interface Email validations
 *	@return An interface object
 */

ui.email = function(conf) {
    
    conf = conf || {};
	
	conf.email = true;
	
	conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.email = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ui.string.call(this, conf);
    
};

ui.factory({ component: 'email' });

/**
 *	@Interface URL validations
 *	@return An interface object
 */

ui.url = function(conf) {
    
    conf = conf || {};
	
	conf.url = true;
	
	conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.url = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ui.string.call(this, conf);
    
};

ui.factory({ component: 'url' });

/**
 *	@Interface MinLength validations
 *	@return An interface object
 */

ui.minLength = function(conf) {
    
    conf = conf || {};
	
	conf.minLength = conf.value;
	
	conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.minLength = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ui.string.call(this, conf);
    
};

ui.factory({ component: 'minLength' });

/**
 *	@Interface MaxLength validations
 *	@return An interface object
 */

ui.maxLength = function(conf) {
    
    conf = conf || {};
	
	conf.maxLength = conf.value;
	
	conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.maxLength = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ui.string.call(this, conf);
    
};

ui.factory({ component: 'maxLength' });