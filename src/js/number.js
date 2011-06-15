
/**
 * Validate numbers.
 * @name Number
 * @class Number
 * @augments ch.Watcher
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
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

    if ( ch.utils.hasOwn(conf, "msg") ) { 
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
 * @interface Min
 * @augments ch.Number
 * @memberOf ch.Number
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * $("input").min(10, "Write a number bigger than 10");
 */

ch.interface( "min", "number" );


/**
 * Validate a number with a maximun value.
 * @name Max
 * @interface Max
 * @augments ch.Number
 * @memberOf ch.Number
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * $("input").max(10, "Write a number smaller than 10");
 */
 
ch.interface( "max", "number" );

/**
 * Validate a number with a price format.
 * @name Price
 * @interface Price
 * @augments ch.Number
 * @memberOf ch.Number
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * $("input").price("Write valid price.");
 */
 
ch.interface( "price", "number" );