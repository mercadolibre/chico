
/**
* Validate numbers.
* @name Number
* @class Number
* @interface
* @augments ch.Watcher
* @memberOf ch
* @param {Object} conf Object with configuration properties.
* @returns {itself}
* @see ch.Watcher
* @see ch.Required
* @see ch.Custom
* @see ch.String
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
        }];

    return conf;

});

/**
 * Validate a number with a minimun value.
 * @name Min
 * @name Max
 * @interface
 * @augments ch.Number
 * @memberOf ch
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @returns {itself}
 * @see ch.Watcher
 * @example
 * $("input").min(10, "Write a number bigger than 10");
 */

ch.extend("number").as("min");


/**
 * Validate a number with a maximun value.
 * @name Max
 * @class Max
 * @interface
 * @augments ch.Number
 * @memberOf ch
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @returns {itself}
 * @see ch.Watcher
 * @example
 * $("input").max(10, "Write a number smaller than 10");
 */
 
ch.extend("number").as("max");

/**
 * Validate a number with a price format.
 * @name Price
 * @class Price
 * @interface
 * @augments ch.Watcher
 * @memberOf ch
 * @param {String} [message] Validation message.
 * @returns {itself}
 * @see ch.Watcher
 * @example
 * $("input").price("Write valid price.");
 */
 
ch.extend("watcher").as("price",function(conf){

	conf.price = true;	

    // Define the conditions of this interface
    conf.conditions = [{
            name: "price",
            patt: /^(\d+)[.,]?(\d?\d?)$/ 
        }];

    return conf;

});