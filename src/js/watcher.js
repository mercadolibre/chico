/**
* Watcher is a validation engine for html forms elements.
* @name Watcher
* @class Watcher
* @augments ch.Uiobject
* @requires ch.Form
* @requires ch.Validator
* @requires ch.Helper
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @returns itself
* @see ch.Required
* @see ch.String
* @see ch.Number
* @see ch.Custom
*/

ch.watcher = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @protected
	* @name ch.Watcher#that
	* @type itself
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
	
	// Reference to a Validator instance. If there isn't any, the Watcher instance will create one.
	var validator = that.validator = (function(){
		var c = {};
			c.condition = conf.condition
	 	return that.$element.validator(c);
	})();

	/**
	* Search for instances of Watcher with the same trigger, and then merge it's properties with it.
	* @private
	* @name ch.Watcher#checkInstance
	* @function
	* @returns Object
	*/
	var checkInstance;
	if (checkInstance = function() {

		var instance, instances = ch.instances.watcher;
		if ( instances && instances.length > 0 ) {
			for (var i = 0, j = instances.length; i < j; i+=1) {
				instance = instances[i];

				if (instance.element !== that.element) {
					continue;
				}

				return {
					exists: true,
					object: instance
				}
			}
		}
	}()){
		return checkInstance;
	};

	// Reference to a Form instance. If there isn't any, the Watcher instance will create one.
	var form = that.form = (function() {
		if (ch.utils.hasOwn(ch.instances, "form") && ch.instances.form.length > 0) {
			var i = 0, j = ch.instances.form.length;
			for (i; i < j; i+=1) {
				if (ch.instances.form[i].element === that.$element.parents("form")[0]) {
					return ch.instances.form[i]; // Get my parent
				};
			};
		} else {
			that.$element.parents("form").form();
			var last = (ch.instances.form.length - 1);
			return ch.instances.form[last]; // Set my parent
		}
	})();
	form.children.push(that["public"]);

	/**
	* Validation event
	* @private
	* @name ch.Watcher#validationEvent
	*/
	var validationEvent = (that.$element.hasClass("options") || that.$element.hasClass("ch-form-options") || that.element.tagName == "SELECT") ? "change" : "blur";

	var hasError = function () {

		// Pre-validation: Don't validate disabled
		if (that.$element.attr('disabled') || !that.enabled) { return false; }

		/**
		* Triggers before start validation process.
		* @name ch.Watcher#beforeValidate
		* @event
		* @public
		* @example
		* me.on("beforeValidate",function(event) {
		*	submitButton.disable();
		* });
		*/
		// old callback system
		that.callbacks('beforeValidate');
		// new callback
		that.trigger("beforeValidate");
		
		var gotError = validator.validate(value());

		var status = !gotError.status;

		if (status) {

			if (that.$element.prop("tagName") === "INPUT" || that.$element.prop("tagName") === "TEXTAREA") {
				that.$element.addClass("error ch-form-error");
			}

			that.helper.show(gotError.msg || form.messages[gotError.condition] || "Error.");

			// Add blur or change event only one time
			if (!that.$element.data("events")) { that.$element.one(validationEvent, function(event){ hasError(); }); }

			/**
			* Triggers when an error occurs on the validation process.
			* @name ch.Watcher#error
			* @event
			* @public
			* @example
			* me.on("error",function(event, condition) {
			*	if (condition === "required") {
			* 		errorModal.show();
			* 	}
			* });
			*/
			// old callback system
			that.callbacks('onError', gotError.condition);
			// new callback
			that.trigger("error", gotError.condition);

		} else {
			that.$element.removeClass("error ch-form-error");
			that.helper.hide();
		}

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

		return status;

	};

	var clear = function() {

		that.$element.removeClass("error ch-form-error");
		that.helper.hide();

		// Don't work
		//that.$element.unbind(validationEvent, hasError); // Remove blur and change event
		
		validator.clear();

		/**
		* Triggers when al validations are cleared.
		* @name ch.Watcher#clear
		* @event
		* @public
		* @example
		* me.on("clear",function(){
		*	submitButton.enable();
		* });
		*/
		// old callback system
		that.callbacks('onClear');
		// new callback
		that.trigger("clear");
	};

	/**
	* Returns a value of element
	* @private
	* @name ch.Watcher#value
	* @function
	* @returns string
	*/
	var value = function(){
		return that.element.value;
	};


/**
* Protected Members
*/

	/**
	* Flag that let you know if the watchers is enabled or not.
	* @protected
	* @name ch.Watcher#enabled
	* @type boolean
	*/
	that.enabled = true;

	that.$reference = (function() {
		var reference;
		// CHECKBOX, RADIO
		if (that.$element.hasClass("options") || that.$element.hasClass("ch-form-options")) {
			// Helper reference from will be fired
			// H4
			if (that.$element.find("h4").length > 0) {
				var h4 = that.$element.find("h4"); // Find h4
					h4.wrapInner("<span>"); // Wrap content with inline element
				reference = h4.children(); // Inline element in h4 like helper reference
			// Legend
			} else if (that.$element.prev().prop("tagName") == "LEGEND") {
				reference = that.$element.prev(); // Legend like helper reference
			} else {
				reference = $(that.$element.find("label")[0]);
			}
		// INPUT, SELECT, TEXTAREA
		} else {
			reference = that.$element;
		}

		return reference;
	})();

	that.helper = that.$reference.helper();

/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Watcher#uid
	* @type number
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Watcher#element
	* @type HTMLElement
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Watcher#type
	* @type string
	*/
	that["public"].type = "watcher"; // Everything is a "watcher" type, no matter what interface is used

	/**
	* Used by the helper's positioner to do his magic.
	* @public
	* @name ch.Watcher#reference
	* @type jQuery Object
	* @TODO: remove 'reference' from public scope
	*/
	that["public"].reference = that.$reference;

	/**
	* Run all configured validations.
	* @public
	* @function
	* @name ch.Watcher#hasError
	* @returns boolean
	*/
	that["public"].hasError = function(){
		return hasError();
	}
	
	/**
	* Run all configured validations.
	* @public
	* @function
	* @name ch.Watcher#validate
	* @returns boolean
	*/
	that["public"].validate = function(){
		hasError();

		return that["public"];
	}

	/**
	* Clear all active validations.
	* @public
	* @name ch.Watcher#clear
	* @function
	* @returns itself
	*/
	that["public"].clear = function() {
		clear();

		return that["public"];
	};

	/**
	* Let you keep chaining methods.
	* @public
	* @name ch.Watcher#and
	* @function
	* @returns jQuery Object
	*/
	that["public"].and = function(){
		return that.$element;
	};

	/**
	* Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
	* @public
	* @name ch.Watcher#form
	* @type ch.Form
	* @see ch.Form
	*/
	that["public"].form = form;

	/**
	* Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
	* @public
	* @name ch.Watcher#validator
	* @type ch.Validator
	* @see ch.Validator
	*/
	that["public"].validator = validator;
	
	/**
	* Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
	* @public
	* @name ch.Watcher#helper
	* @type ch.Helper
	* @see ch.Floats
	* @see ch.Helper
	*/
	that["public"].helper = that.helper;

	/**
	* Turn on Watcher and Validator engine or an specific condition.
	* @public
	* @name ch.Watcher#enable
	* @function
	* @returns itself
	* @see ch.Validator
	*/
	that["public"].enable = function(condition){
		validator.enable(condition);

		if (!condition) {
			that.enabled = true;
		}

		return that["public"];
	}

	/**
	* Turn off Watcher and Validator engine or an specific condition.
	* @public
	* @name ch.Watcher#disable
	* @function
	* @returns itself
	* @see ch.Validator
	*/
	that["public"].disable = function(condition){
		validator.disable(condition);

		if (!condition){
			that.enabled = false;
		}

		return that["public"];
	}


	/**
	* Turn off Watcher and Validator engine or an specific condition.
	* @public
	* @name ch.Watcher#isActive
	* @function
	* @returns boolean
	* @see ch.Validator
	*/
	that["public"].isActive = function(){
		return validator.isActive();
	}

/**
*	Default event delegation
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

	return that;
};
ch.factory("watcher");
