/**
* Validation is a engine for HTML forms elements.
* @name Validation
* @class Validation
* @augments ch.Controls
* @requires ch.Form
* @requires ch.Validator
* @requires ch.Required
* @requires ch.String
* @requires ch.Number
* @requires ch.Custom
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.content] Validation message.
* @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
* @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {String} [conf.context] It's a reference to position the validation-bubble.
* @returns itself
* @factorized
* @see ch.Controls
* @see ch.Form
* @see ch.Validator
* @see ch.Required
* @see ch.String
* @see ch.Number
* @see ch.Custom
*/

(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	var setTimeout = window.setTimeout,
		setInterval = window.setInterval,
		$document = $(window.document);

	function Validation($el, conf) {

		/**
		* Reference to a internal component instance, saves all the information and configuration properties.
		* @protected
		* @name ch.Validation#that
		* @type itself
		*/
		var that = this;

		that.$element = $el;
		that.element = $el[0];
		that.type = 'validation';
		conf = conf || {};

		conf = ch.util.clone(conf);

		// Configuration by default
		conf.offset = conf.offset || "10 0";
		conf.points = conf.points || "lt rt";

		that.conf = conf;

	/**
	* Inheritance
	*/

		that = ch.Controls.call(that);
		that.parent = ch.util.clone(that);

	/**
	* Private Members
	*/

		// Reference to a Validator instance. If there isn't any, the Validation instance will create one.
		var validator = that.validator = (function(){
			var c = {};
				c.condition = conf.condition;
		 	return that.$element.validator(c)['public'];
		 	//return ch.Validator(that.$element, c);
		})();

		/**
		* Search for instances of Validation with the same trigger, and then merge it's properties with it.
		* @private
		* @name ch.Validation#checkInstance
		* @function
		* @returns Object
		*/
		var checkInstance;
		if (checkInstance = function() {

			var instance, instances = ch.instances.validation;
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

		// Reference to a Form instance. If there isn't any, the Validation instance will create one.
		var form = that.form = (function() {

			if (ch.util.hasOwn(ch.instances, "form")) {

				// var i = 0, j = ch.instances.form.length;
				// for (i; i < j; i+=1) {
				// 	if (ch.instances.form[i].element === that.$element.parents("form")[0]) {
				// 		return ch.instances.form[i]; // Get my parent
				// 	}
				// };

				for (var instance in ch.instances.form) {
					if (ch.instances.form[instance].element === that.$element.parents("form")[0]) {

						return ch.instances.form[instance]; // Get my parent
					}
				}
			}

			var instance = that.$element.parents("form").form();

			for (var i in ch.instances.form) {
				if (ch.instances.form[i].element === instance.element) {

					return ch.instances.form[i]; // Get my parent
				}
			}

		})();

		form.children.push(that["public"]);

		/**
		* Validation event
		* @private
		* @name ch.Validation#validationEvent
		*/
		var validationEvent = (that.$element.hasClass("options") || that.$element.hasClass("ch-form-options") || that.element.tagName == "SELECT") ? "change" : "blur";

		var clear = function() {

			that.$element.removeClass("error ch-form-error");
			that["float"].innerHide();

			validator.clear();


			/**
			* Triggers when al validations are cleared.
			* @name ch.Validation#clear
			* @event
			* @public
			* @exampleDescription Title
			* @example
			* widget.on("clear",function(){
			*	submitButton.enable();
			* });
			*/
			// old callback system
			that.callbacks('onClear');
			// new callback
			that.trigger("clear");
		};

	/**
	* Protected Members
	*/

		/**
		* Flag that let you know if the validations is enabled or not.
		* @protected
		* @name ch.Validation#enabled
		* @type boolean
		*/
		that.enabled = true;

		/**
		* Reference to the Float component instanced.
		* @protected
		* @type Object
		* @name ch.Validation#float
		*/
		that["float"] = that.createFloat({
			"$element": (function() {
				var reference;
				// CHECKBOX, RADIO
				// TODO: when old forms be deprecated we must only support ch-form-options class
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
			})(),
			"type": "validation",
			"content": "Error.",
			"classes": conf.classes || "ch-box-error",
			"cone": true,
			"cache": false,
			"closable": false,
			"aria": {
				"role": "alert"
			},
			"offset": conf.offset,
			"points": conf.points,
			"reposition": false
		});


		/**
		* Stores the error object
		* @protected
		* @type Object
		* @name ch.Validation#error
		*/
		that.error = {
			"condition": false,
			"msg": ""
		}

		/**
		* Runs all validations to check if it has an error.
		* @protected
		* @type function
		* @returns boolean
		* @name ch.Validation#process
		*/
		that.process = function (evt) {

			// Pre-validation: Don't validate disabled
			if (that.$element.attr("disabled") || !that.enabled) { return false; }

			/**
			* Triggers before start validation process.
			* @name ch.Validation#beforeValidate
			* @event
			* @public
			* @exampleDescription
			* @example
			* widget.on("beforeValidate",function(event) {
			*	submitButton.disable();
			* });
			*/
			// old callback system
			that.callbacks('beforeValidate');
			// new callback
			that.trigger("beforeValidate");

			// Executes the validators engine with a specific value and returns an object.
			// Context is the validation
			var gotError = validator.validate.call(that["public"], that.element.value);

			// Save the validator's status.
			var status = !gotError.status;

			// If has Error...
			if (status) {

				if (that.$element.prop("tagName") === "INPUT" || that.$element.prop("tagName") === "TEXTAREA") {
					// TODO: remove error class when deprecate old forms only ch-form error must be.
					that.$element.addClass("error ch-form-error");
				}

				// to avoid reload the same content
				if (!that["float"]["public"].isActive() || !that.error.condition || that.error.condition !== gotError.condition) {
					that["float"]["public"].show((gotError.msg || form.messages[gotError.condition] || "Error"));
				}

				// Add blur or change event only one time to the element or to the elements's group
				if (!that.$element.data("events")) { that.$element.one(validationEvent, function(evt){that.process(evt);}); }

				/**
				* Triggers when an error occurs on the validation process.
				* @name ch.Validation#error
				* @event
				* @public
				* @exampleDescription
				* @example
				* widget.on("error",function(event, condition) {
				*	if (condition === "required") {
				* 		errorModal.show();
				* 	}
				* });
				*/
				// old callback system
				that.callbacks('onError', gotError.condition);
				// new callback
				that.trigger("error", gotError.condition);

				// Saves gotError
				that.error = gotError;

			// else NOT Error!
			} else {
				that.$element.removeClass("error ch-form-error");
				that["float"].innerHide();
			}

			/**
			* Triggers when the validation process ends.
			* @name ch.Validation#afterValidate
			* @event
			* @public
			* @exampleDescription
			* @example
			* widget.on("afterValidate",function(){
			*	submitButton.disable();
			* });
			*/
			// old callback system
			that.callbacks('afterValidate');
			// new callback
			that.trigger("afterValidate");

			return status;

		};


	/**
	*	Public Members
	*/

		/**
		* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
		* @public
		* @name ch.Validation#uid
		* @type number
		*/

		/**
		* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
		* @public
		* @name ch.Validation#element
		* @type HTMLElement
		*/

		/**
		* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
		* @public
		* @name ch.Validation#type
		* @type string
		*/
		that["public"].type = "validation"; // Everything is a "validation" type, no matter what interface is used

		/**
		* Deprecated: Used by the helper's positioner to do his magic.
		* @public
		* @deprecated
		* @name ch.Validation#reference
		* @type jQuery Object
		* @TODO: remove 'reference' from public scope
		*/
		//that["public"].reference = that.$reference;

		/**
		* Run all configured validations.
		* @public
		* @function
		* @name ch.Validation#hasError
		* @returns boolean
		*/
		that["public"].hasError = function(){
			return that.process();
		}

		/**
		* Run all configured validations.
		* @public
		* @function
		* @name ch.Validation#validate
		* @returns boolean
		*/
		that["public"].validate = function(){
			that.process();

			return that["public"];
		}

		/**
		* Clear all active validations.
		* @public
		* @name ch.Validation#clear
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
		* @name ch.Validation#and
		* @function
		* @returns jQuery Object
		*/
		that["public"].and = function(){
			return that.$element;
		};

		/**
		* Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
		* @public
		* @name ch.Validation#form
		* @type ch.Form
		* @see ch.Form
		*/
		that["public"].form = form;

		/**
		* Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
		* @public
		* @name ch.Validation#validator
		* @type ch.Validator
		* @see ch.Validator
		*/
		that["public"].validator = validator;

		/**
		* Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
		* @public
		* @Deprecated
		* @name ch.Validation#helper
		* @type ch.Helper
		* @see ch.Floats
		*/
		that["public"].helper = that["float"]["public"];

		/**
		* Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
		* @public
		* @since 0.10.2
		* @name float
		* @memberOf ch.Validation
		* @type ch.Floats
		* @see ch.Floats
		*/
		that["public"]["float"] = that["float"]["public"];

		/**
		* Turn on Validation and Validator engine or an specific condition.
		* @public
		* @name ch.Validation#enable
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
		};

		/**
		* Turn off Validation and Validator engine or an specific condition.
		* @public
		* @name ch.Validation#disable
		* @function
		* @returns itself
		* @see ch.Validator
		*/
		that["public"].disable = function (condition) {
			// Clean the validation if is active;
			clear();

			// Turn off validator
			validator.disable(condition);

			// Turn off validation, if all conditions are disabled
			if (!condition){
				that.enabled = false;
			}

			return that["public"];
		};

		/**
		* Turn on/off the Validation and Validator engine.
		* @public
		* @since 0.10.4
		* @name ch.Validation#toggleEnable
		* @function
		* @returns itself
		* @see ch.Validator
		*/
		that["public"].toggleEnable = function () {

			if (that.enabled) {
				that["public"].disable();
			} else {
				that["public"].enable();
			}

			return that["public"];
		};

		/**
		* Turn off Validation and Validator engine or an specific condition.
		* @public
		* @name ch.Validation#isActive
		* @function
		* @returns boolean
		* @see ch.Validator
		*/
		that["public"].isActive = function(){
			return validator.isActive();
		};

		/**
		* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
		* @public
		* @since 0.10.4
		* @name ch.Validation#position
		* @function
		* @returns itself
		* @exampleDescription Change validaton bubble's position.
		* @example
		* validation.position({
		*	  offset: "0 10",
		*	  points: "lt lb"
		* });
		*/
		that["public"].position = function (o) {

			if (o === undefined) { return that["float"].position(); }

			that["float"]["public"].position(o);

			return that["public"];
		};

		/**
		* Sets or gets conditions messages
		* @public
		* @since 0.10.4
		* @name ch.Validation#message
		* @function
		* @returns itself
		* @exampleDescription Sets a new message
		* @example
		* validation.message("required", "New message for required validation");
		* @exampleDescription Gets a message from a condition
		* @example
		* validation.message("required");
		*/
		that["public"].message = function (condition, msg) {
			if (condition === undefined) {
				throw "validation.message(condition, message): Please, give me a condition as parameter.";
			}

			// Get a new message from a condition
			if (msg === undefined) {
				return validator.conditions[condition].message;
			}

			// Sets a new message
			validator.conditions[condition].message = msg;

			if (validator.isActive()) {
				that["public"]["float"].content.configure({
					'input': msg
				});
			}

			return that["public"];
		}

	/**
	*	Default event delegation
	*/

		/**
		* Triggers when the component is ready to use.
		* @name ch.Validation#ready
		* @event
		* @public
		* @exampleDescription Following the first example, using <code>widget</code> as modal's instance controller:
		* @example
		* widget.on("ready",function(){
		*	this.show();
		* });
		*/
		that.trigger("ready");

		return that['public'];
	}

	Validation.prototype.name = 'validation';
	Validation.prototype.constructor = Validation;

	ch.factory(Validation);

}(this, this.jQuery, this.ch));