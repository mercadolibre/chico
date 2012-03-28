/**
* Description
* @abstract
* @name Condition
* @class Condition
* @standalone
* @memberOf ch
* @param {Object} condition Object with configuration properties.
* @param {String} condition.name
* @param {Object} [condition.patt]
* @param {Function} [condition.expr]
* @param {Function} [condition.func]
* @param {Number || String} [condition.value]
* @param {String} condition.message Validation message
* @returns itself
* @example
* // Create a new condition object with patt.
* var me = ch.condition({
*     "name": "string",
*     "patt": /^([a-zA-Z\u00C0-\u00C4\u00C8-\u00CF\u00D2-\u00D6\u00D9-\u00DC\u00E0-\u00E4\u00E8-\u00EF\u00F2-\u00F6\u00E9-\u00FC\u00C7\u00E7\s]*)$/,
*     "message": "Some message here!"
* });
* @example
* // Create a new condition object with expr.
* var me = ch.condition({
*     "name": "maxLength",
*     "patt": function(a,b) { return a.length <= b },
*     "message": "Some message here!",
*     "value": 4
* });
* @example
* // Create a new condition object with func.
* var me = ch.condition({
*     "name": "custom",
*     "patt": function (value) { 
*         if (value === "ChicoUI") {
*
*             // Some code here!
*
*             return true;
*         };
*
*         return false;
*     },
*     "message": "Your message here!"
* });
*/

ch.condition = function(condition) {

/**
* Reference to a internal component instance, saves all the information and configuration properties.
* @protected
* @name ch.Condition#that
* @type itself
*/
	var that = this;

/**
* Private Members
*/

	/**
	* Flag that let you know if the condition is enabled or not.
	* @private
	* @name ch.Condition#enabled
	* @type boolean
	*/
	var	enabled = true,

		test = function (value) {

			if (!enabled) {
				return true;
			}
	
			if (condition.patt){
				return condition.patt.test(value);
			}
	
			if (condition.expr){
				return condition.expr(value, condition.value);
			}
	
			if (condition.func){
				// Call validation function with 'this' as scope.
				return condition.func.call(this, value);
			}
	
		},

		enable = function() {
			enabled = true;
			
			return condition;
		},
	
		disable = function() {
			enabled = false;
			
			return condition;
		};

/**
* Protected Members
*/

/**
* Public Members
*/

	/**
	* Flag that let you know if the all conditions are enabled or not.
	* @public
	* @name ch.Condition#name
	* @type string
	*/

	/**
	* Message defined for this condition
	* @public
	* @name ch.Condition#message
	* @type string
	*/

	/**
	* Run configured condition
	* @public
	* @name ch.Condition#test
	* @function
	* @returns boolean
	*/

	/**
	* Turn on condition.
	* @public
	* @function
	* @name ch.Condition#enable
	* @returns itself
	*/

	/**
	* Turn off condition.
	* @public
	* @function
	* @name ch.Condition#disable
	* @returns itself
	*/

	condition = $.extend(condition, {
		test: test,
		enable: enable,
		disable: disable
	});

	return condition;

};