/**
 *	Number validations
 *	@author
 *	@Contructor
 *	@return An interface object
 */


ui.number = function(conf) {

/**
 *  Constructor
 */

	conf = conf || {};
	
    conf.messages = conf.messages || {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.number = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };
    
    // $.number("message"); support
	if ( !conf.number && !conf.min && !conf.max && !conf.price ) {
		conf.number = true;
	};
  
	// Add validation types
	conf.types = "number,min,max,price";
    
    // Define the conditions of this interface
    conf.conditions = {
		number: { patt: /^([0-9\s]+)$/ },
        min:    { expr: function(a,b) { return a >= b } },
        max:    { expr: function(a,b) { return a <= b } },
		price:  { patt: /^(\d+)[.,]?(\d?\d?)$/ }
		// price:  { patt: /^\d (\Z|[\.]\d )$/ }
		// float: TODO       
    };


	return ui.watcher.call(this, conf);
    
};

/**
 *	@Interface Min validations
 *	@return An interface object
 */

ui.min = function(conf) {
    
    conf = conf || {};
	
	conf.min = conf.value;
	
	conf.value = null;
	
	delete conf.value;
	
	conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.min = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ui.number.call(this, conf);
    
};

ui.factory({ component: 'min' });

/**
 *	@Interface Max validations
 *	@return An interface object
 */
 
ui.max = function(conf) {
    
    conf = conf || {};
	
	conf.max = conf.value;
	
	conf.value = null;
	
	delete conf.value;
	
	conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.max = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ui.number.call(this, conf);
    
}

ui.factory({ component: 'max' });


/**
 *	@Interface Price validations
 *	@return An interface object
 */
 
ui.price = function(conf) {
    
    conf = conf || {};
	
	conf.price = true;
	
	conf.value = null;
	
	delete conf.value;
	
	conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.price = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ui.number.call(this, conf);
    
}

ui.factory({ component: 'price' });
