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

	var setTimeout = window.setTimeout;

	function Validation($el, options) {
		/**
		* Reference to a internal component instance, saves all the information and configuration properties.
		* @protected
		* @name ch.Validation#that
		* @type itself
		*/
		var that = this;


		that.init($el, options);


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
		setTimeout(function(){ that.emit("ready")}, 50);

		return this;

	};

	/**
	 * Inheritance
	 */
	var parent = ch.util.inherits(Validation, ch.Widget),

	validate = function(value) {
		var that = this;

		if (!that._enabled) { return true; }

		var condition, tested, empty, val, message, required = that.conditions["required"];

		// Avoid fields that aren't required when they are empty or de-activated
		if (!required && value === "" && that._active === false) { return {"status": true}; }

		if (that._enabled && (!that._active || value !== "" || required)) {
			/**
			 * Triggers before start validation process.
			 * @name ch.Validator#beforeValidate
			 * @event
			 * @public
			 * @exampleDescription
			 * @example
			 * widget.on("beforeValidate",function(){
			 *	submitButton.disable();
			 * });
			 */
			that.emit('beforevalidate');

			// for each condition
			for (condition in that.conditions){

				val = ((condition === "required") ? that.el : value.toLowerCase());
				// this is the validation

				// no value and no required don't validate the field
				if (value === "" && condition !== "required") {

					tested = true;

				} else {

					tested = that.conditions[condition].test(val);

					// return false if any test fails,
					if (!tested) {

						/**
						 * Triggers when an error occurs on the validation process.
						 * @name ch.Validator#error
						 * @event
						 * @public
						 * @exampleDescription
						 * @example
						 * widget.on("error",function(event, condition){
						 *	errorModal.show();
						 * });
						 */
						that.emit("error", condition);

						that._active = true;

						// stops the proccess
						//return false;
						return {
							"status": false,
							"condition": condition,
							"msg": that.conditions[condition].message
						}
					};
				};
			}
		}

		// Status OK (with previous error)
		if (that._active || !that._enabled) {
			// Public status OK
			that._active = false;
		}

		/**
		 * Triggers when the validation process ends.
		 * @name ch.Validator#afterValidate
		 * @event
		 * @public
		 * @exampleDescription
		 * @example
		 * widget.on("afterValidate",function(){
		 *	submitButton.disable();
		 * });
		 */
		that.emit('aftervalidate');

		// It's all good ;)
		//return true;
		return {
			"status": true
		}
	},

	/**
	 * Test a condition looking for error.
	 * @private
	 * @name ch.Validator#test
	 * @see ch.Condition
	 */
	test = function(condition, value){
		var that = this;

		if (value === "" && condition !== "required") { return true };

		var isOk = false,
			condition = that.conditions[condition];

		isOk = condition.test(value);
		return isOk;

	};


	Validation.prototype._defaults = {
		'offset': '10 0',
		'points': 'lt rt'
	}


	Validation.prototype.init = function($el, options) {
		parent.init.call(this, $el, options);
		var that = this;

		// Reference to a Validator instance. If there isn't any, the Validation instance will create one.
		// that.validator = (function(){
		// 	var c = {};
		// 		c.condition = conf.condition;

		//  	return that.$element.validator(c)['public'];
		// })();

		that.on('exists', function (e, data){

			var condition = {
				'name': data.type
			};

			if(data.options !== undefined){
				if(data.options.content){
					condition.message = data.options.content;
				}

				if (data.options.num) {
					condition.num = data.options.num;
				}

				if (data.options.fn) {
					condition.fn = data.options.fn;
				}
			}

			that.conditions[condition.name] = new ch.Condition(condition);

		});


		that.conditions = {};
		that.conditions[options.condition.name] = new ch.Condition(options.condition);



		// Reference to a Form instance. If there isn't any, the Validation instance will create one.
		that.form = (function() {

			if (ch.util.hasOwn(ch.instances, "form")) {
				for (var instance in ch.instances.form) {
					if (ch.instances.form[instance].el === that.$el.parents("form")[0]) {
						return ch.instances.form[instance]; // Get my parent
					}
				}
			}

			var instance = that.$el.parents("form").form();

			for (var i in ch.instances.form) {
				if (ch.instances.form[i].el === instance.el) {

					return ch.instances.form[i]; // Get my parent
				}
			}

		})();

		that.form._validations.push(that);


		/**
		* Validation event
		* @private
		* @name ch.Validation#_validationEvent
		*/
		that._validationEvent = (that.$el.hasClass("ch-form-options") || that.$el.hasClass("ch-list-options") || that.el.tagName == "SELECT" || ( that.el.tagName == "INPUT" && that.el.type === 'range') ) ? "change" : "blur";


	}

	/**
	* Private Members
	*/





		// /**
		// * Validation event
		// * @private
		// * @name ch.Validation#validationEvent
		// */
		// var validationEvent = (that.$element.hasClass("ch-form-options") || that.$element.hasClass("ch-list-options") || that.element.tagName == "SELECT" || ( that.element.tagName == "INPUT" && that.element.type === 'range') ) ? "change" : "blur";

		// var clear = function() {

		// 	that.$element.removeClass("ch-form-error");
		// 	that["float"].innerHide();

		// 	validator.clear();


		// 	*
		// 	* Triggers when al validations are cleared.
		// 	* @name ch.Validation#clear
		// 	* @event
		// 	* @public
		// 	* @exampleDescription Title
		// 	* @example
		// 	* widget.on("clear",function(){
		// 	*	submitButton.enable();
		// 	* });

		// 	// old callback system
		// 	that.callbacks('onClear');
		// 	// new callback
		// 	that.trigger("clear");
		// };

	/**
	* Protected Members
	*/

		/**
		* Flag that let you know if the validations is enabled or not.
		* @protected
		* @name ch.Validation#enabled
		* @type boolean
		*/
	Validation.prototype._enabled = true;


	Validation.prototype.helper = {};

		/**
		* Reference to the Float component instanced.
		* @protected
		* @type Object
		* @name ch.Validation#float
		*/
		// that["float"] = that.createFloat({
		// 	"$element": (function() {
		// 		var reference;
		// 		// CHECKBOX, RADIO
		// 		// TODO: when old forms be deprecated we must only support ch-list-options class
		// 		if (that.$element.hasClass("ch-form-options") || that.$element.hasClass("ch-list-options")) {
		// 			// Helper reference from will be fired
		// 			// H4
		// 			if (that.$element.find("h4").length > 0) {
		// 				var h4 = that.$element.find("h4"); // Find h4
		// 					h4.wrapInner("<span>"); // Wrap content with inline element
		// 				reference = h4.children(); // Inline element in h4 like helper reference
		// 			// Legend
		// 			} else if (that.$element.prev().prop("tagName") == "LEGEND") {
		// 				reference = that.$element.prev(); // Legend like helper reference
		// 			} else {
		// 				reference = $(that.$element.find("label")[0]);
		// 			}
		// 		// INPUT, SELECT, TEXTAREA
		// 		} else {
		// 			reference = that.$element;
		// 		}

		// 		return reference;
		// 	})(),
		// 	"type": "validation",
		// 	"content": "Error.",
		// 	"classes": conf.classes || "ch-box-error",
		// 	"cone": true,
		// 	"cache": false,
		// 	"closable": false,
		// 	"aria": {
		// 		"role": "alert"
		// 	},
		// 	"offset": conf.offset,
		// 	"points": conf.points,
		// 	"reposition": false
		// });


	/**
	 * Stores the error object
	 * @protected
	 * @type Object
	 * @name ch.Validation#error
	 */
	Validation.prototype._error = {
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
	Validation.prototype.process = function (evt) {
		var that = this;

		// Pre-validation: Don't validate disabled
		if (that.$el.attr("disabled") || !that._enabled) { return false; }

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
		that.emit('beforevalidate');

		// Executes the validators engine with a specific value and returns an object.
		// Context is the validation
		var gotError = validate.call(that, that.el.value);

		// Save the validator's status.
		var status = !gotError.status;

		// If has Error...
		if (status) {

			if (that.$el.prop("tagName") === "INPUT" || that.$el.prop("tagName") === "TEXTAREA") {
				// TODO: remove error class when deprecate old forms only ch-form error must be.
				that.$el.addClass("ch-form-error");
			}

			// to avoid reload the same content
			//if (!that["float"]["public"].isActive() || !that._error.condition || that._error.condition !== gotError.condition) {
			if (!that._error.condition || that._error.condition !== gotError.condition) { // delete when bubble will be done
				//that["float"]["public"].show((gotError.msg || form.messages[gotError.condition] || "Error"));
				// the aria-label attr should get the message element id, but is not public
				//that.$el.attr('aria-label', 'ch-' + that["float"]["public"].type + '-' + that["float"]["public"].uid );
				console.log( gotError.msg || form.messages[gotError.condition] || "Error" )
			}

			// Add blur or change event only one time to the element or to the elements's group
			if (!that.$el.data("events")) { that.$el.one(that._validationEvent, function(evt){that.process(evt);}); }

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
			that.emit("error", gotError.condition);

			// Saves gotError
			that._error = gotError;

		// else NOT Error!
		} else {
			that.$el.removeClass("ch-form-error");
			that.$el.removeAttr('aria-label');
			//that["float"].innerHide(); // uncoment when bubble were done
			form.emit('validated');
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
		that.emit("aftervalidate");

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
	Validation.prototype.type = "validation"; // Everything is a "validation" type, no matter what interface is used

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
	Validation.prototype.hasError = function(){
		return this.process();
	}

	/**
	 * Run all configured validations.
	 * @public
	 * @function
	 * @name ch.Validation#validate
	 * @returns boolean
	 */
	Validation.prototype.validate = function(){
		this.process();

		return this;
	}

	/**
	 * Clear all active validations.
	 * @public
	 * @name ch.Validation#clear
	 * @function
	 * @returns itself
	 */
	Validation.prototype.clear = function() {
		var that = this;

		that.$el.removeClass("ch-form-error");
		that["float"].innerHide();

		//validator.clear();
		this._active = false;

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
		 that.emit('clear');

		return this;
	};

	/**
	 * Let you keep chaining methods.
	 * @public
	 * @name ch.Validation#and
	 * @function
	 * @returns jQuery Object
	 */
	Validation.prototype.and = function(){
		return this.$el;
	};

	/**
	 * Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
	 * @public
	 * @name ch.Validation#form
	 * @type ch.Form
	 * @see ch.Form
	 */
	// Validation.prototype.form = form;

	/**
	 * Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
	 * @public
	 * @name ch.Validation#validator
	 * @type ch.Validator
	 * @see ch.Validator
	 */
	// Validation.prototype.validator = validator;

	/**
	 * Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
	 * @public
	 * @Deprecated
	 * @name ch.Validation#helper
	 * @type ch.Helper
	 * @see ch.Floats
	 */
	// Validation.prototype.helper = that["float"]["public"];

	/**
	 * Turn on Validation and Validator engine or an specific condition.
	 * @public
	 * @name ch.Validation#enable
	 * @function
	 * @returns itself
	 * @see ch.Validator
	 */
	Validation.prototype.enable = function(condition){
		var that = this;

		// validator.enable(condition);
		if (condition && that.conditions[condition]){
			// Enable specific condition
			that.conditions[condition].enable();
		} else {
			// enable all
			that._enabled = true;
			for (condition in that.conditions){
				that.conditions[condition].enable();
			}
		}

		// if (!condition) {
		// 	that._enabled = true;
		// }

		return this;
	};

	/**
	 * Turn off Validation and Validator engine or an specific condition.
	 * @public
	 * @name ch.Validation#disable
	 * @function
	 * @returns itself
	 * @see ch.Validator
	 */
	Validation.prototype.disable = function (condition) {
		var that = this;
		// Clean the validation if is active;
		clear();

		// Turn off validator
		//validator.disable(condition);
		if (condition && that.conditions[condition]){
			// disable specific condition
			that.conditions[condition].disable();
		} else {
			// disable all
			that._enabled = false;
			for (condition in that.conditions){
				that.conditions[condition].disable();
			}
		}

		// Turn off validation, if all conditions are disabled
	// commented because it is being done
		// if (!condition){
		// 	that._enabled = false;
		// }

		return this;
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
	Validation.prototype.toggleEnable = function () {
		var that = this;

		if (that._enabled) {
			that.disable();
		} else {
			that.enable();
		}

		return this;
	};

	/**
	 * Flag that let you know if there's a validation going on.
	 * @private
	 * @name ch.Validation#active
	 * @type boolean
	 */
	Validation.prototype._active = false;

	/**
	 * Turn off Validation and Validator engine or an specific condition.
	 * @public
	 * @name ch.Validation#isActive
	 * @function
	 * @returns boolean
	 * @see ch.Validator
	 */
	Validation.prototype.isActive = function(){
		//return validator.isActive();
		return this._active;
	};

	/**
	 * Turn off Validation and Validator engine or an specific condition.
	 * @public
	 * @name ch.Validation#test
	 * @function
	 * @returns boolean
	 * @see ch.Validator
	 */
	Validation.prototype.test = function(validation){

		var value = this.el.value;

		if(validation === 'required'){
			value = this.el;
		}

		return this.conditions[validation].test(value);
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
	Validation.prototype.position = function (o) {
		var that = this;

		if (o === undefined) { return that["float"].position(); }

		that["float"]["public"].position(o);

		return this;
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
	Validation.prototype.message = function (condition, msg) {
		var that = this;

		if (condition === undefined) {
			throw "validation.message(condition, message): Please, give me a condition as parameter.";
		}

		// Get a new message from a condition
		if (msg === undefined) {
			return that.conditions[condition].message;
		}

		// Sets a new message
		that.conditions[condition].message = msg;

		// TODO: check if the conditions seted is active
		if (validator.isActive()) {

			that["public"]["float"].content(msg);
		}

		return that["public"];
	}

	/**
	*	Default event delegation
	*/



		// that.on('exists', function (e, data){

		// 	var condition = {
		// 		'name': data.type
		// 	};

		// 	if(data.options !== undefined){
		// 		if(data.options.content){
		// 			condition.message = data.options.content;
		// 		}

		// 		if (data.options.num) {
		// 			condition.num = data.options.num;
		// 		}

		// 		if (data.options.fn) {
		// 			condition.fn = data.options.fn;
		// 		}
		// 	}

		// 	validator.extend(condition);

		// });

		// return that['public'];
	// }

	Validation.prototype.name = 'validation';
	Validation.prototype.constructor = Validation;

	ch.factory(Validation);

}(this, this.jQuery, this.ch));