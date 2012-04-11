
/**
* Forms is a Controller of DOM's HTMLFormElement.
* @name Form
* @class Form
* @augments ch.Controllers
* @standalone
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Object} [conf.messages]
* @see ch.Validation
* @returns itself
* @example
* // Create a new form with configuration.
* var me = $(".example").form({
* 	"messages": {
* 		"required": "Error message for all required fields.",
* 		"email": "Show this message on email format error."
* 	}
* });
* @example
* // Create a new form without configuration.
* var me = $(".example").form();
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
		* Callback function
		* @name ch.Form#beforeValidate
		* @event
		* @public
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
		* Callback function
		* @name ch.Form#validate
		* @event
		* @public
		*/
		/**
		* Callback function
		* @name ch.Form#error
		* @event
		* @public
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
		* Callback function
		* @name ch.Form#afterValidate
		* @event
		* @public
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
		* Callback function
		* @name ch.Form#beforeSubmit
		* @event
		* @public
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
		* Callback function
		* @name ch.Form#submit
		* @event
		* @public
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
		* Callback function
		* @name ch.Form#afterSubmit
		* @event
		* @public
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
		* Callback function
		* @name ch.Form#onClear
		* @event
		* @public
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
		* Callback function
		* @name ch.Form#onReset
		* @event
		* @public
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
	* The component's instance unique identifier.
	* @public
	* @name ch.Form#uid
	* @type number
	*/

	/**
	* The element reference.
	* @public
	* @name ch.Form#element
	* @type HTMLElement
	*/

	/**
	* The component's type.
	* @public
	* @name ch.Form#type
	* @type string
	*/

	/**
	* Watcher instances associated to this controller.
	* @public
	* @name ch.Form#children
	* @type collection
	*/
	that["public"].children = that.children;

	/**
	* Collection of messages defined.
	* @public
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
	* @example
	* // Following the first example, using 'me' as form's instance controller:
	* me.on("ready",function () {
	*	this.reset();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;
};

ch.factory("form");