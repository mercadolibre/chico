
/**
 * Validate numbers.
 * @name Number
 * @class
 * @interface
 * @augments ch.Watcher
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a number validation
 * $("input").number("This field must be a number.");
 */

ch.extend("watcher").as("number", function(conf) {

    // $.number("message"); support
	if ( !conf.number && !conf.min && !conf.max && !conf.price ) {
		conf.number = true;
	};
  
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

    return conf;

});

/**
 * Validate a number with a minimun value.
 * @name Min
 * @interface
 * @augments ch.Number
 * @memberOf ch.Number
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * $("input").min(10, "Write a number bigger than 10");
 */

ch.extend("number").as("min");


/**
 * Validate a number with a maximun value.
 * @name Max
 * @interface
 * @augments ch.Number
 * @memberOf ch.Number
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * $("input").max(10, "Write a number smaller than 10");
 */
 
ch.extend("number").as("max");

/**
 * Validate a number with a price format.
 * @name Price
 * @interface
 * @augments ch.Number
 * @memberOf ch.Number
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * $("input").price("Write valid price.");
 */
 
ch.extend("number").as("price");