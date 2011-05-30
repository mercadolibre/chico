
/**
 * Validate numbers.
 * @name Number
 * @class Number
 * @augments ch.Watcher
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties.
 * @return {Chico-UI Object}
 * @see ch.Min
 * @see ch.Max
 * @see ch.Price
 * @example
 * // Create a number validation
 * $("input").number("This field must be a number.");
 */

ch.number = function(conf) {

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
    conf.conditions = [{
            name: "number",
            patt: /^([0-9\s]+)$/ 
    	},{
            name: "min",
            expr: function(a,b) { return a >= b } 
        },{
            name: "max",
            expr: function(a,b) { return a <= b } 
        },{
            name: "price",
            patt: /^(\d+)[.,]?(\d?\d?)$/ 
        }];


	return ch.watcher.call(this, conf);
    
};

/**
 * Validate a number with a minimun value.
 * @name Min
 * @class Min
 * @augments ch.Number
 * @memberOf ch
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @return {Chico-UI Object}
 * @see ch.Max
 * @see ch.Price
 * @example
 * $("input").min(10, "Write a number bigger than 10");
 */

ch.min = function(conf) {
    
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

	return ch.number.call(this, conf);
    
};

ch.factory({ component: 'min' });

/**
 * Validate a number with a maximun value.
 * @name Max
 * @class Max
 * @augments ch.Number
 * @memberOf ch
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @return {Chico-UI Object}
 * @see ch.Min
 * @see ch.Price
 * @example
 * $("input").max(10, "Write a number smaller than 10");
 */
 
ch.max = function(conf) {
    
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

	return ch.number.call(this, conf);
    
}

ch.factory({ component: 'max' });


/**
 * Validate a number with a price format.
 * @name Price
 * @class Price
 * @augments ch.Number
 * @memberOf ch
 * @param {String} [message] Validation message.
 * @return {Chico-UI Object}
 * @see ch.Min
 * @see ch.Max
 * @example
 * $("input").price("Write valid price.");
 */
 
ch.price = function(conf) {
    
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

	return ch.number.call(this, conf);
    
}

ch.factory({ component: 'price' });
