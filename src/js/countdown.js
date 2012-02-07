/**
* Counts the amount of characters that user can enter in a form control and limit the length of value of input.
* @name Countdown
* @class Countdown
* @augments ch.Controls
* @standalone
* @memberOf ch
* @param {Object} conf Object with configuration properties.
* @param {Number} conf.max Number of the maximum amount of characters user can input in form control.
* @param {String} [conf.plural] Message of remaining amount of characters, when it's different to 1. The variable that represents the number to be replaced, should be a hash. By default this parameter is "# characters left.".
* @param {String} [conf.singular] Message of remaining amount of characters, when it's only 1. The variable that represents the number to be replaced, should be a hash. By default this parameter is "# character left.".
* @returns itself
* @example
* // Create a new Countdown with configuration.
* var me = $(".some-form-control").countdown({
*     "max": 500,
*     "plural": "Restan # caracteres.",
*     "singular": "Resta # caracter."
* });
* @example
* // Create a simple Countdown
* var me = $(".some-form-control").countdown(500);
* // Now 'me' is a reference to the Countdown instance controller.
*/

ch.countdown = function (conf) {

	/**
	* Reference to an internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Countdown#that
	* @type Object
	*/
	var that = this;
	
	conf = ch.clon(conf);

	// Configuration by default
	// Max length of content
	conf.max = parseInt(conf.max) || conf.value || parseInt(conf.msg) || 500;
	
	// Messages
	conf.plural = conf.plural || "# characters left.";
	conf.singular = conf.singular || "# character left.";

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.controls.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/
	/**
	* Length of value of form control.
	* @private
	* @name ch.Countdown#contentLength
	* @type Number
	*/
	var contentLength = that.element.value.length,
	
	/**
	* Amount of free characters until full the field.
	* @private
	* @name ch.Countdown#remaining
	* @type Number
	*/
		remaining = conf.max - contentLength;
	
	/**
	* Change the visible message of remaining characters.
	* @private
	* @name ch.Countdown#updateRemaining
	* @function
	* @param num {Number} Remaining characters.
	*/
		updateRemaining = (function () {
			
			// Singular or Plural message depending on amount of remaining characters
			var message = (remaining === 1) ? conf.singular : conf.plural,
			
			// Create the DOM Element when message will be shown
				$display = $("<p class=\"ch-form-hint\">" + message.replace("#", remaining) + "</p>").insertAfter(that.$element);
			
			// Real function
			return function (num) {
				
				// Singular or Plural message depending on amount of remaining characters
				var message = (num === 1) ? conf.singular : conf.plural;
				
				// Update DOM text
				$display.text(message.replace("#", num));
				
				// Update amount of remaining characters
				remaining = num;
				
			};
		
		}());

/**
*	Protected Members
*/

	/**
	* Process input of data on form control and updates remaining amount of characters or limits the content length
	* @protected
	* @name ch.Countdown#process
	* @function
	*/
	that.process = function () {

		var len = that.element.value.length;
		
		// Countdown or Countup
		if ((len > contentLength && len <= conf.max) || (len < contentLength && len >= 0)) {
			
			// Change visible message of remaining characters
			updateRemaining(remaining - (len - contentLength));
			
			// Update length of value of form control.
			contentLength = len;
		
		// Limit Count
		} else if (len > contentLength && len > conf.max) {
			
			// Cut the string value of form control
			that.element.value = that.element.value.substr(0, conf.max);
			
		};
		
	};


/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Countdown#uid
	* @type Number
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Countdown#element
	* @type HTMLElement
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Countdown#type
	* @type String
	*/

/**
*	Default event delegation
*/

	// Bind process function to element
	that.$element.on("keyup keypress paste", function () { setTimeout(that.process, 0); });
	
	/**
	* Triggers when component is ready to use.
	* @name ch.Countdown#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as Countdown's instance controller:
	* me.on("ready",function () {
	*	this.element;
	* });
	*/
	setTimeout(function () { that.trigger("ready"); }, 50);

	return that;
};

ch.factory("countdown");