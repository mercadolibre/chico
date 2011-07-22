
/**
* Watcher is a validation engine for html forms elements.
* @abstract
* @name Watcher
* @class Watcher
* @augments ch.Object
* @memberOf ch
* @requires ch.Form
* @requires ch.Positioner
* @requires ch.Events
* @param {Object} o Object with configuration properties
* @returns {itself}
* @see ch.Required
* @see ch.String
* @see ch.Number
* @see ch.Custom
*/

ch.watcher = function(conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @protected
	* @name ch.Watcher#that
	* @type {Object}
	*/ 
	var that = this;
	conf = ch.clon(conf);
	that.conf = conf;	

/**
* Inheritance
*/

	that = ch.object.call(that);
	that.parent = ch.clon(that);
	
/**
* Private Members
*/	
	/**
	* Reference to a ch.form controller. If there isn't any, the Watcher instance will create one.
	* @private
	* @name ch.Watcher#controller
	* @type {Object}
	*/
	var controller = (function() {
		if ( ch.utils.hasOwn(ch.instances, "form") && ch.instances.form.length > 0 ) {	
			var i = 0, j = ch.instances.form.length; 
			for (i; i < j; i ++) {
				if (ch.instances.form[i].element === that.$element.parents("form")[0]) {
					return ch.instances.form[i]; // Get my parent
				};
			};
		} else {
			that.$element.parents("form").form();
			var last = (ch.instances.form.length - 1);
			return ch.instances.form[last]; // Set my parent
		};
	})();
	
	
	/**
	* Search for instances of Watchers with the same trigger, and then merge it's properties with it.
	* @private
	* @name ch.Watcher#checkInstance
	* @function
	* @returns {Object}
	*/	
	var checkInstance = function() {
		var instance = ch.instances.watcher;
		if ( instance && instance.length > 0 ) {
			for (var i = 0, j = instance.length; i < j; i ++) {
				if (instance[i].element !== that.element) continue;
				// Merge Conditions
				$.merge(instance[i].conditions, that.conditions);
				return { 
					exists: true, 
					object: instance[i] 
				};
			};
		};
	};

	/**
	* Run all validations again and do form.checkStatus()
	* @private
	* @name ch.Watcher#revalidate
	* @function
	*/
	var revalidate = function() {		
		that.validate();
		controller.checkStatus();  // Check everthing?
	}; 
	
/**
* Protected Members
*/

	/**
	* Flag that let you know if there's a validation going on.
	* @protected
	* @name ch.Watcher#active
	* @type {Boolean}
	*/ 
	that.active = false;
	
	/**
	* Flag that let you know if the watchers is enabled or not.
	* @protected
	* @name ch.Watcher#enabled
	* @type {Boolean}
	*/ 
	that.enabled = true;
	
	/**
	* This clousure is used as a reference to the positioning preferences.
	* @protected
	* @name ch.Watcher#reference
	* @type {jQuery Object}
	*/ 
	that.reference = (function() {
		var reference;
		// CHECKBOX, RADIO
		if ( that.$element.hasClass("options") ) {
			// Helper reference from will be fired
			// H4
			if ( that.$element.find('h4').length > 0 ) {
				var h4 = that.$element.find('h4'); // Find h4
					h4.wrapInner('<span>'); // Wrap content with inline element
				reference = h4.children(); // Inline element in h4 like helper reference	
			// Legend
			} else if ( that.$element.prev().prop('tagName') == 'LEGEND' ) {
				reference = that.$element.prev(); // Legend like helper reference
			}
		// INPUT, SELECT, TEXTAREA
		} else {
			reference = that.$element;
		}
		return reference;
	})();


	/**
	* This clousure process conditions and creates a map with all configured conditions, it's messages and validations.
	* @protected
	* @name ch.Watcher#conditions
	* @type {Boolean}
	*/ 
	that.conditions = (function(){
		var c = []; // temp collection
		var i = 0;  // iteration
		var t = conf.conditions.length;
		for ( i; i < t; i++ ) {
			/**
			* Process conditions to find out which should be configured.
			* Add validations and messages to conditions object.
			*/
			var condition = conf.conditions[i];
			
			// If condition exists in the Configuration Object
			if ( conf[condition.name] ) {
				
				// Sabe the value
				condition.value = conf[condition.name];
				
				// If there is a message defined for that condition
				if ( conf.messages[condition.name] ) {
					condition.message = conf.messages[condition.name];
				}
				
				// Push it to the new conditions collection
				c.push(condition);
			}
		}
		// return all the configured conditions
		return c;
		
	})(); // Love this ;)

	/**
	* Return true is a required conditions is found on the condition collection.
	* @private
	* @name ch.Watcher#isRequired
	* @function
	* @return {Boolean}
	*/
	that.isRequired = function(){
		var t = that.conditions.length;
		while ( t-- ) {   
			var condition = that.conditions[t];
			if ( condition.name === "required" && condition.value ) {
				return true;
			}
		}
		return false;
	};

	/**
	* Helper is a UI Component that shows the messages of active validations.
	* @private
	* @name ch.Watcher#helper
	* @type {ch.Helper}
	* @see ch.Helper
	*/
	var helper = {};
		helper.uid = that.uid + "#0";
		helper.type = "helper";
		helper.element = that.element;
		helper.$element = that.$element;
		
	that.helper = ch.helper.call(helper, that);
	

	/**
	* Process all conditions looking for errors.
	* @protected
	* @name ch.Watcher#validate
	* @function
	* @return {itself}
	*/
	that.validate = function(event) {	
		
		// Pre-validation: Don't validate disabled or not required & empty elements
		if ( that.$element.attr('disabled') ) { return; }

		var isRequired = that.isRequired()

		// Avoid fields that aren't required when they are empty or de-activated
		if ( !isRequired && that.isEmpty() && that.active === false) { return; }
		
		if ( that.enabled && ( that.active === false || !that.isEmpty() || isRequired ) ) {

			/**
			* Triggers before start validation process.
			* @name ch.Watcher#beforeValidate
			* @event
			* @public
			* @example
			* me.on("beforeValidate",function(){
			*	submitButton.disable();
			* });
			*/
			// old callback system
			that.callbacks('beforeValidate');
			// new callback
			that.trigger("beforeValidate");

			var i = 0, t = that.conditions.length,
				value = that.$element.val(),
				gotError = false;

			// for each condition
			for ( i ; i < t ; i +=1 ) {
				
				var condition = that.conditions[i];
		
				if ( that.isRequired() ) {
					gotError = that.isEmpty();
				}
				
				if ( condition.patt ) {
					gotError = !condition.patt.test(value);
				}
				
				if ( condition.expr ) {
					gotError = !condition.expr( value, condition.value );
				}

				if ( condition.func) {
					// Call validation function with 'this' as scope.
					gotError = !condition.func.call(that["public"], value); 
				}

				if ( gotError ) {

					/**
					* Triggers when an error occurs on the validation process.
					* @name ch.Watcher#error
					* @event
					* @public
					* @example
					* me.on("error",function(){
					*	errorModal.show();
					* });
					*/
					// old callback system
					that.callbacks('error');
					// new callback
					//that.trigger("error");

					// Field error style
					that.$element.addClass("error");

					// Show helper with message
					var text = ( condition.message ) ? condition.message : 
						(ch.utils.hasOwn(controller, "messages")) ? controller.messages[condition.name] :
						undefined;

					that.helper["public"].content(text);
					that.helper["public"].show();

					that.active = true;

					var validationEvent = (that.tag == 'OPTIONS' || that.tag == 'SELECT') ? "change" : "blur";

					// Add blur or change event only one time
					that.$element.one( validationEvent , function(event){ that.validate(event); }); 

					return;
				}

			} // End for each validation

		} // End if Enabled

		// Status OK (with previous error)
		if ( that.active || !that.enabled ) {
			// Remove field error style
			that.$element.removeClass("error"); 
			// Hide helper  
			that.helper["public"].hide();
			// Public status OK
			//that.publish.status = that.status =  conf.status = true; // Status OK
			that.active = false;
			
			// If has an error, but complete the field and submit witout trigger blur event 
			if (event) {
				var originalTarget = event.originalEvent.explicitOriginalTarget || document.activeElement; // Moderns Browsers || IE
				if (originalTarget.type == "submit") { controller.submit(event); };
			};
			
			// This generates a lot of redraws... I don't want it here
			//controller.checkStatus();
		};

		/**
		* Triggers when the validation process ends.
		* @name ch.Watcher#afterValidate
		* @event
		* @public
		* @example
		* me.on("afterValidate",function(){
		*	submitButton.disable();
		* });
		*/
		// old callback system
		that.callbacks('afterValidate');
		// new callback
		that.trigger("afterValidate");

		return that;
	};
	
	
	/**
	* Reset all active validations messages.
	* @protected
	* @name ch.Watcher#reset
	* @function
	* @return {itself}
	*/
	that.reset = function() {
		//that.publish.status = that.status = conf.status = true; // Public status OK
		that.active = false;
		that.$element.removeClass("error");
		that.helper["public"].hide(); // Hide helper
		that.$element.unbind("blur change", that.validate); // Remove blur and change event

		/**
		* Triggers when al validations are reseted.
		* @name ch.Watcher#reset
		* @event
		* @public
		* @example
		* me.on("reset",function(){
		*	submitButton.enable();
		* });
		*/
		// old callback system
		that.callbacks('onReset');
		// new callback
		that.trigger("reset");
		
		return that;
	};
	
	
	/**
 	* Returns false if the field has no value selected.
 	* @protected
 	* @name ch.Watcher#isEmpty
 	* @function
 	* @return {Boolean}
 	*/
 	that.isEmpty = function() {
		that.tag = ( that.$element.hasClass("options")) ? "OPTIONS" : that.element.tagName;
		switch (that.tag) {
			case 'OPTIONS':
				return that.$element.find('input:checked').length === 0;
			break;
			
			case 'SELECT':
				var val = that.$element.val();
				return parseInt(val) === -1 || val === null;
			break;
			
			case 'INPUT':
			case 'TEXTAREA':
				return $.trim( that.$element.val() ).length === 0;
			break;
		};
				
	};

	
/**
*  Public Members
*/
 
	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Watcher#uid
	* @type {Number}
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Watcher#element
	* @type {HTMLElement}
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Watcher#type
	* @type {String}
	*/
	that["public"].type = "watcher"; // Everything is a "watcher" type, no matter what interface is used

	/**
	* Used by the helper's positioner to do his magic.
	* @public
	* @name ch.Watcher#reference
	* @type {jQuery Object}
	* @TODO: remove 'reference' from public scope
	*/
	that["public"].reference = that.reference;
	
	/**
	* This public Map saves all the validation configurations from this instance.
	* @public
	* @name ch.Watcher#conditions
	* @type {Object}
	*/	
	that["public"].conditions = that.conditions;
	
	/**
	* Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
	* @public
	* @name ch.Watcher#type
	* @type {String}
	* @see ch.Floats
	*/	
	that["public"].helper = that.helper["public"];
	
	/**
	* Active is a boolean property that let you know if there's a validation going on.
	* @public
	* @name ch.Watcher#active
	* @function
	* @returns {itself}
	*/	
	that["public"].active = function() {
		return that.active;
	};
	
	/**
	* Let you keep chaining methods.
	* @public
	* @name ch.Watcher#and
	* @function
	* @returns {itself}
	*/
	that["public"].and = function() {
		return that.$element;
	};
	/**
	* Reset al active validations.
	* @public
	* @name ch.Watcher#reset
	* @function
	* @returns {itself}
	*/
	that["public"].reset = function() {
		that.reset();
		
		return that["public"];
	};
	/**
	* Run all configured validations.
	* @public
	* @function
	* @name ch.Watcher#validate
	* @returns {itself}
	*/
	that["public"].validate = function() {
		that.validate();
		
		return that["public"];
	};
	/**
	* Turn on Watcher engine.
	* @public
	* @name ch.Watcher#enable
	* @function
	* @returns {itself}
	*/
	that["public"].enable = function() {
		that.enabled = true;
				
		return that["public"];			
	};
	/**
	* Turn off Watcher engine and reset its validation.
	* @public
	* @name ch.Watcher#disable
	* @function
	* @returns {itself}
	*/
	that["public"].disable = function() {
		that.enabled = false;
		that.reset();

		return that["public"];
	};
	/**
	* Recalculate Helper's positioning.
	* @public
	* @name ch.Watcher#refresh
	* @function
	* @returns {itself}
	*/
	that["public"].refresh = function() {
		that.helper.position("refresh");

		return that["public"];
	};



/**
* Default event delegation
*/	

	/**
	* Triggers when the component is ready to use.
	* @name ch.Watcher#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.on("ready",function(){
	*	this.show();
	* });
	*/
	that.trigger("ready");
	
	// Run the instances checker		
	// TODO: Maybe is better to check this on top to avoid all the process. 
	var check = checkInstance();
	// If a match exists
	if ( check ) {
		// Create a public object and save the existing object
		// in the public object to mantain compatibility
		var that = {};
			that["public"] = check; 
		// ;) repleace that object with the repeated instance
		console.log("repeated man")
	} else {
		// this is a new instance: "Come to papa!"
		controller.children.push(that["public"]);
	};
	
	return that;
};