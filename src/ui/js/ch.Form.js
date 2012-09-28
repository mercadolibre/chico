/**
* Forms is a Controller of DOM's HTMLFormElement.
* @name Form
* @class Form
* @augments ch.Controllers
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Object} [conf.messages]
* @see ch.Validation
* @see ch.Controllers
* @returns itself
* @factorized
* @exampleDescription Create a new Form.
* @example
* var widget = $(".example").form();
* @exampleDescription Create a new Form with some messages that will be use the validation engine.
* @example
* var widget = $(".example").form({
* 	"messages": {
* 		"required": "Error message for all required fields.",
* 		"email": "Show this message on email format error."
* 	}
* });
*/

ch.form = function(conf) {

/**
* Validation
*/
	// Are there action and submit type?
	if ( this.$element.find(":submit").length == 0 || this.$element.attr("action") == "" ){
		alert("Form fatal error: The <input type=submit> is missing, or need to define a action attribute on the form tag.");
		return;
	};

	// Is there form in map instances?
	if ( ch.utils.hasOwn(ch.instances, "form") && ch.instances.form.length > 0 ){
		for(var i = 0, j = ch.instances.form.length; i < j; i+=1){
			if(ch.instances.form[i].element === this.element){
				return {
					exists: true,
					object: ch.instances.form[i]
				};
			}
		};
	}

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Form#that
	* @type object
	*/
	var that = this;

	conf = ch.clon(conf);
	// Disable HTML5 browser-native validations
	that.$element.attr("novalidate", "novalidate");
	// Grab submit button
	that.$submit = that.$element.find("input:submit");

	that.conf = conf;

/**
*  Inheritance
*/

	that = ch.controllers.call(that);
	that.parent = ch.clon(that);

/**
*  Private Members
*/

	/**
	* A Boolean property that indicates is exists errors in the form.
	* @private
	* @name ch.Form#status
	* @type boolean
	*/
	var status = true;

	/**
	* Executes all children's validations, if finds a error will trigger 'onError' callback, if no error is found will trigger 'onValidate' callback, and allways trigger 'afterValidate' callback.
	*/
	var validate = function(event){

		/**
		* Fired before the validations engine start.
		* @name ch.Form#beforeValidate
		* @event
		* @public
		* @exampleDescription
		* @example
		* widget.on("beforeValidate",function () {
		*	sowidget.action();
		* });
		*/
		that.callbacks("beforeValidate");
		// new callback
		that.trigger("beforeValidate");

		// Status OK (with previous error)
		if ( !status ) {
			status = true;
		};

		var i = 0, j = that.children.length, toFocus, childrenError = [];

		// Shoot validations
		for (i; i < j; i+=1) {
			var child = that.children[i];

			// Validate
			// Save children with errors
			if ( child.hasError() ) {
				childrenError.push(child);
			}
		};

		// Is there's an error
		if (childrenError.length > 0) {
			status = false;
			// Issue UI-332: On validation must focus the first field with errors.
			// Doc: http://wiki.ml.com/display/ux/Mensajes+de+error
			if (childrenError[0].element.tagName === "DIV") {
				$(childrenError[0].element).find("input:first").focus();
			} else if (childrenError[0].element.type !== "hidden") {
				childrenError[0].element.focus();
			}
		} else {
			status = true;
		}

		/**
		* Fired when the form validates.
		* @name ch.Form#validate
		* @event
		* @public
		* @exampleDescription
		* @example
		* widget.on("validate",function () {
		*	sowidget.action();
		* });
		*/

		/**
		* Fired when the form fall on a error.
		* @name ch.Form#error
		* @event
		* @public
		* @exampleDescription
		* @example
		* widget.on("error",function () {
		*	sowidget.action();
		* });
		*/
		if (status) {
			that.callbacks("onValidate");
			// new callback
			that.trigger("validate");
		} else {
			that.callbacks("onError");
			// new callback
			that.trigger("error");
		}

		/**
		* Fired when the validations end.
		* @name ch.Form#afterValidate
		* @event
		* @public
		* @exampleDescription
		* @example
		* widget.on("afterValidate",function () {
		*	sowidget.action();
		* });
		*/
		that.callbacks("afterValidate");
		// new callback
		that.trigger("afterValidate");

		return that;
	};

	/**
	* This methods triggers the 'beforSubmit' callback, then will execute validate() method,
	* and if is defined triggers 'onSubmit' callback, at the end will trigger the 'afterSubmit' callback.
	*/
	var submit = function(event) {

		/**
		* Fired before the form's submition.
		* @name ch.Form#beforeSubmit
		* @event
		* @public
		* @exampleDescription
		* @example
		* widget.on("beforeSubmit",function () {
		*	sowidget.action();
		* });
		*/
		that.callbacks("beforeSubmit");
		// new callback
		that.trigger("beforeSubmit");

		// Execute all validations
		validate(event);

		// If an error occurs prevent default actions
		if (!status) {
			that.prevent(event);
	        if (event) {
	            event.stopImmediatePropagation();
	        }
		}

		// OLD CALLBACK SYSTEM!
		// Is there's no error but there's a onSubmit callback
		if ( status && ch.utils.hasOwn(conf, "onSubmit")) {
			// Avoid default actions
			that.prevent(event);
			// To execute defined onSubmit callback
			that.callbacks("onSubmit");
		}

		/**
		* Fired when submits the form.
		* @name ch.Form#submit
		* @event
		* @public
		* @exampleDescription
		* @example
		* widget.on("afterSubmit",function () {
		*	sowidget.action();
		* });
		*/
		// * New callback system *
		// Check inside $.data if there's a handler for ch-submit event
		// if something found there, avoid submit.

		var formEvents = $(that["public"]).data("events");
		var isSubmitEventDefined = (formEvents && ch.utils.hasOwn(formEvents, "ch-submit"));

		if (status && isSubmitEventDefined){
			// Avoid default actions
			that.prevent(event);
			// new callback
			that.trigger("submit");
		};

		/**
		* Fired after the form's submition.
		* @name ch.Form#afterSubmit
		* @event
		* @public
		* @exampleDescription
		* @example
		* widget.on("afterSubmit",function () {
		*	this.reset();
		* });
		*/
		that.callbacks("afterSubmit");
		// new callback
		that.trigger("afterSubmit");

		// Return that to chain methods
		return that;
	};

	/**
	* Use this method to clear al validations.
	*/
	var clear = function(){

		var i = 0, j = that.children.length;
		for(i; i < j; i += 1) {
			that.children[i].clear();
		}

		status = true;

		/**
		* Fired when clean the form's data.
		* @name ch.Form#clear
		* @event
		* @public
		* @exampleDescription
		* @example
		* widget.on("clear",function () {
		*	this.reset();
		* });
		*/
		that.callbacks("onClear");
		// new callback
		that.trigger("clear");

		return that;
	};

	/**
	* Use this method to reset the form's input elements.
	*/
	var reset = function(event){
		clear();
		that.element.reset(); // Reset html form native

		/**
		* Fired when resets the form.
		* @name ch.Form#reset
		* @event
		* @public
		* @exampleDescription
		* @example
		* widget.on("reset",function () {
		*	sowidget.action();
		* });
		*/
		that.callbacks("onReset");
		// new callback
		that.trigger("reset");

		return that;
	};


/**
*  Public Members
*/
	/**
	* @borrows ch.Object#uid as ch.Expando#uid
	*/

	/**
	* @borrows ch.Object#element as ch.Expando#element
	*/

	/**
	* @borrows ch.Object#type as ch.Expando#type
	*/

	/**
	* Watcher instances associated to this controller.
	* @public
	* @function
	* @name ch.Form#children
	* @type collection
	*/
	that["public"].children = that.children;

	/**
	* Collection of messages defined.
	* @public
	* @function
	* @name ch.Form#messages
	* @type string
	*/
	that["public"].messages = conf.messages || {};

	/**
	* Executes all children's validations, if finds a error will trigger 'onError' callback, if no error is found will trigger 'onValidate' callback, and allways trigger 'afterValidate' callback.
	* @public
	* @function
	* @name ch.Form#validate
	* @returns itself
	*/
	that["public"].validate = function() {
		validate();

		return that["public"];
	};

	/**
	* This methods triggers the 'beforSubmit' callback, then will execute validate() method, and if is defined triggers 'onSubmit' callback, at the end will trigger the 'afterSubmit' callback.
	* @public
	* @function
	* @name ch.Form#submit
	* @returns itself
	*/
	that["public"].submit = function() {
		submit();

		return that["public"];
	};

	/**
	* Return the status value.
	* @public
	* @function
	* @name ch.Form#getStatus
	* @returns itself
	*/
	that["public"].getStatus = function(){
		return status;
	};

	/**
	* Use this method to clear al validations.
	* @public
	* @function
	* @function
	* @name ch.Form#clear
	* @returns itself
	*/
	that["public"].clear = function() {
		clear();

		return that["public"];
	};

	/**
	* Use this method to clear al validations.
	* @public
	* @function
	* @name ch.Form#reset
	* @returns itself
	*/
	that["public"].reset = function() {
		reset();

		return that["public"];
	};

/**
*  Default event delegation
*/

	// patch exists because the components need a trigger
	if (ch.utils.hasOwn(conf, "onSubmit")) {
		that.$element.bind('submit', function(event){ that.prevent(event); });
		// Delete all click handlers asociated to submit button >NATAN: Why?
			//Because if you want to do something on submit, you need that the trigger (submit button)
			//don't have events associates. You can add funcionality on onSubmit callback
		that.$element.find(":submit").unbind('click');
	};

	// Bind the submit
	that.$element.bind("submit", function(event) { submit(event) });

	// Bind the reset
	that.$element.find(":reset, .resetForm").bind("click", function(event){ reset(event); });

	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Form#ready
	* @event
	* @public
	* @since 0.8.0
	* @exampleDescription Following the first example, using <code>widget</code> as form's instance controller:
	* @example
	* widget.on("ready",function () {
	*	this.reset();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;
};

ch.factory("form");