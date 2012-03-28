/**
* Validate strings.
* @name String 
* @class String
* @interface
* @augments ch.Controls
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.message] Validation message.
* @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
* @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {String} [conf.context] It's a reference to position the validation-bubble
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.Number
* @see ch.Validator
* @see ch.Condition
* @example
* // Create a string validation
* $("input").string("This field must be a string.");
*/
ch.extend("validation").as("string", function (conf) {

	conf.condition = {
		name: "string",
		// the following regular expression has the utf code for the lating characters
		// the ranges are A,EI,O,U,a,ei,o,u,ç,Ç please for reference see http://www.fileformat.info/info/charset/UTF-8/list.htm
		patt: /^([a-zA-Z\u00C0-\u00C4\u00C8-\u00CF\u00D2-\u00D6\u00D9-\u00DC\u00E0-\u00E4\u00E8-\u00EF\u00F2-\u00F6\u00E9-\u00FC\u00C7\u00E7\s]*)$/,
		message: conf.msg || conf.message
	};

	return conf;

});

/**
* Validate email sintaxis.
* @name Email
* @class Email
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.message] Validation message.
* @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
* @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {String} [conf.context] It's a reference to position the validation-bubble
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.Number
* @see ch.Validator
* @see ch.Condition
* @example
* // Create a email validation
* $("input").email("This field must be a valid email.");
*/
ch.extend("validation").as("email", function (conf) {

	conf.condition = {
		name: "email",
		patt: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/,
		message: conf.msg || conf.message
	};

	return conf;

});

/**
* Validate URL sintaxis.
* @name Url
* @class Url
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.message] Validation message.
* @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
* @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {String} [conf.context] It's a reference to position the validation-bubble
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.Number
* @see ch.Validator
* @see ch.Condition
* @example
* // Create a URL validation
* $("input").url("This field must be a valid URL.");
*/
ch.extend("validation").as("url", function (conf) {

	conf.condition = {
		name: "url",
		patt: /^((https?|ftp|file):\/\/|((www|ftp)\.)|(\/|.*\/)*)[a-z0-9-]+((\.|\/)[a-z0-9-]+)+([/?].*)?$/,
		message: conf.msg || conf.message
	};

	return conf;

});


/**
* Validate a minimun amount of characters.
* @name MinLength
* @class MinLength
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.message] Validation message.
* @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
* @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {String} [conf.context] It's a reference to position the validation-bubble
* @param {Number} value Minimun number value.
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.Number
* @see ch.Validator
* @see ch.Condition
* @example
* // Create a minLength validation
* $("input").minLength(10, "At least 10 characters..");
*/
ch.extend("validation").as("minLength", function (conf) {

	conf.condition = {
		name: "minLength",
		expr: function(a,b) { return a.length >= b },
		message: conf.msg || conf.message,
		value: conf.value
	};

	return conf;

});


/**
* Validate a maximun amount of characters.
* @name MaxLength
* @class MaxLength
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.message] Validation message.
* @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
* @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {String} [conf.context] It's a reference to position the validation-bubble
* @param {Number} value Maximun number value.
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.Number
* @see ch.Validator
* @see ch.Condition
* @example
* // Create a maxLength validation
* $("input").maxLength(10, "No more than 10 characters..");
*/
ch.extend("validation").as("maxLength", function (conf) {

	conf.condition = {
		name: "maxLength",
		expr: function(a,b) { return a.length <= b },
		message: conf.msg || conf.message,
		value: conf.value
	};

	return conf;

});