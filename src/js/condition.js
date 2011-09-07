/**
* Description
* @abstract
* @name Condition
* @class Condition
* @memberOf ch
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
				return condition.func.call(that, value);
			}
	
		},

		enable = function() {
			enabled = true;
		},
	
		disable = function() {
			enabled = false;
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
	*/

	/**
	* Turn off condition.
	* @public
	* @function
	* @name ch.Condition#disable
	*/

	condition = $.extend(condition, {
		test: test,
		enable: enable,
		disable: disable
	});

	return condition;

};