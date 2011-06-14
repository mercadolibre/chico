
/**
 * Validate strings.
 * @name String
 * @class String
 * @augments ch.Watcher
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a string validation
 * $("input").string("This field must be a string.");
 */

ch.string = function(conf) {

/**
 *  Constructor
 */
	conf = conf || {};
	
    conf.messages = conf.messages || {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
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
        // Conditions map TODO: uppercase, lowercase, varchar

	return ch.watcher.call(this, conf);
    
};


/**
 * Validate email sintaxis.
 * @name Email
 * @interface Email
 * @augments ch.String
 * @memberOf ch.String
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a email validation
 * $("input").email("This field must be a valid email.");
 */
 
ch.email = function(conf) {
    
    conf = conf || {};
	
	conf.email = true;
	
	conf.messages = {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
		conf.messages.email = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.string.call(this, conf);
    
};

ch.factory({ component: 'email' });


/**
 * Validate URL sintaxis.
 * @name Url
 * @interface Url
 * @augments ch.String
 * @memberOf ch.String
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a URL validation
 * $("input").url("This field must be a valid URL.");
 */

ch.url = function(conf) {
    
    conf = conf || {};
	
	conf.url = true;
	
	conf.messages = {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
		conf.messages.url = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.string.call(this, conf);
    
};

ch.factory({ component: 'url' });


/**
 * Validate a minimun amount of characters.
 * @name MinLength
 * @interface MinLength
 * @augments ch.String
 * @memberOf ch.String
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a minLength validation
 * $("input").minLength(10, "At least 10 characters..");
 */

ch.minLength = function(conf) {
    
    conf = conf || {};
	
	conf.minLength = conf.value;
	
	conf.messages = {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
		conf.messages.minLength = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.string.call(this, conf);
    
};

ch.factory({ component: 'minLength' });


/**
 * Validate a maximun amount of characters.
 * @name MaxLength
 * @interface MaxLength
 * @augments ch.String
 * @memberOf ch.String
 * @param {Number} value Maximun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a maxLength validation
 * $("input").maxLength(10, "No more than 10 characters..");
 */

ch.maxLength = function(conf) {
    
    conf = conf || {};
	
	conf.maxLength = conf.value;
	
	conf.messages = {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
		conf.messages.maxLength = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.string.call(this, conf);
    
};

ch.factory({ component: 'maxLength' });