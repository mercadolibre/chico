
/**
* Validate strings.
* @name String 
* @class String
* @interface
* @augments ch.Watcher
* @memberOf ch
* @param {String} msg Validation message
* @returns {Chico-UI Object}
* @see ch.Watcher
* @see ch.Required
* @see ch.Custom
* @see ch.Number
* @example
* // Create a string validation
* $("input").string("This field must be a string.");
*/

ch.extend("watcher").as("string", function (conf) {

    // $.string("message"); support
    if ( !conf.text && !conf.email && !conf.url && !conf.maxLength && !conf.minLength ) {
        conf.text = true;
    };
    
    /**
    * @public
    * 
    * @type {Map}
    */
    // Define the conditions of this interface
    conf.conditions = [{
            name: "text", 
            patt: /^([a-zA-Z\s]+)$/
        },{
            name:"email",
            patt: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/ 
        },{
            name: "url",
            patt: /^((https?|ftp|file):\/\/|((www|ftp)\.)|(\/|.*\/)*)[a-z0-9-]+((\.|\/)[a-z0-9-]+)+([/?].*)?$/ 
        },{
            name: "minLength",
            expr: function(a,b) { return a.length >= b } 
        },{
            name: "maxLength",
            expr: function(a,b) { return a.length <= b } 
        }];

    return conf;

});

/**
 * Validate email sintaxis.
 * @name Email
 * @interface
 * @augments ch.String
 * @memberOf ch
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a email validation
 * $("input").email("This field must be a valid email.");
 */

ch.extend("string").as("email");

/**
 * Validate URL sintaxis.
 * @name Url
 * @interface
 * @augments ch.String
 * @memberOf ch
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a URL validation
 * $("input").url("This field must be a valid URL.");
 */

ch.extend("string").as("url");


/**
 * Validate a minimun amount of characters.
 * @name MinLength
 * @interface
 * @augments ch.String
 * @memberOf ch
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a minLength validation
 * $("input").minLength(10, "At least 10 characters..");
 */

ch.extend("string").as("minLength");


/**
 * Validate a maximun amount of characters.
 * @name MaxLength
 * @interface
 * @augments ch.String
 * @memberOf ch
 * @param {Number} value Maximun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a maxLength validation
 * $("input").maxLength(10, "No more than 10 characters..");
 */

ch.extend("string").as("maxLength");