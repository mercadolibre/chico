
/**
 * Forms is a Controller of DOM's HTMLFormElement.
 * @name Form
 * @class Form
 * @augments ch.Controllers
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.form = function(conf) {

/**
 *  Validation
 */
	// Are there action and submit type?
	if ( this.$element.find(":submit").length == 0 || this.$element.attr("action") == "" ){ 
		alert("Form fatal error: The <input type=submit> is missing, or need to define a action attribute on the form tag.");
		return;
	};

	// Is there form in map instances?	
	if ( ch.utils.hasOwn(ch.instances, "form") && ch.instances.form.length > 0 ){
		for(var i = 0, j = ch.instances.form.length; i < j; i++){
			if(ch.instances.form[i].element === this.element){
				return { 
	                exists: true, 
	                object: ch.instances.form[i]
	            };
			};
		};
	};

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Form
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
     * @name status
     * @type {Boolean}
     * @memberOf ch.Form
     */ 
	var status = true;
	
    /**
     * Executes all children's validations, if finds a error will trigger 'onError' callback, if no error is found will trigger 'onValidate' callback, and allways trigger 'afterValidate' callback.
     */
	var validate = function(){

       /**
        * Callback function
        * @name beforeValidate
        * @type {Function}
        * @memberOf ch.Form
        */
        that.callbacks("beforeValidate");
		
		// Status OK (with previous error)
		if ( !status ) {
			status = true;
		};
		
        var i = 0, j = that.children.length, toFocus, childrenError = [];
		// Shoot validations
		for ( i; i < j; i++ ) {
		    var child = that.children[i];
			 // Validate
           child.validate();
           // Save children with errors
           if ( child.active() ) {
               childrenError.push( child );
           }
		};
        
        // Is there's an error
        if ( childrenError.length > 0 ) {
            status = false;
            // Issue UI-332: On validation must focus the first field with errors.
            // Doc: http://wiki.ml.com/display/ux/Mensajes+de+error
            if (childrenError[0].element.tagName === "DIV") {
                $(childrenError[0].element).find("input:first").focus();
            } else {
                childrenError[0].element.focus();
            }
        } else {
            status = true;    
        }
      /**
        * Callback function
        * @name onValidate
        * @type {Function}
        * @memberOf ch.Form
        */
      /**
        * Callback function
        * @name onError
        * @type {Function}
        * @memberOf ch.Form
        */
        status ? that.callbacks("onValidate") : that.callbacks("onError");  

      /**
        * Callback function
        * @name afterValidate
        * @type {Function}
        * @memberOf ch.Form
        */
        that.callbacks("afterValidate");

        return that;
    };

    /**
     * This methods triggers the 'beforSubmit' callback, then will execute validate() method, 
     * and if is defined triggers 'onSubmit' callback, at the end will trigger the 'afterSubmit' callback.
     */
	var submit = function(event) {

       /**
        * Callback function
        * @name beforeSubmit
        * @type {Function}
        * @memberOf ch.Form
        */
        that.callbacks("beforeSubmit");

        // re-asign submit event   
        that.$element.one("submit", submit);

        // Execute all validations
		validate();
		
		// If an error ocurs prevent default actions
		if ( !status ) {
            that.prevent(event);
		}

       /**
        * Callback function
        * @name onSubmit
        * @type {Function}
        * @memberOf ch.Form
        */

		// Is there's no error but there's a onSubmit callback
		if ( status && ch.utils.hasOwn(conf, "onSubmit")) {
            // Avoid default actions
            that.prevent(event);
            // To execute defined onSubmit callback
            that.callbacks("onSubmit");  
	    }

       /**
        * Callback function
        * @name afterSubmit
        * @type {Function}
        * @memberOf ch.Form
        */

        that.callbacks("afterSubmit");

        // Return that to chain methods
        return that;
	};

    /**
     * Use this method to clear al validations.
     */
	var clear = function(event){		
		
		that.prevent(event);		
        
        var i = 0, j = that.children.length;
		for(i; i < j; i += 1) {
		  that.children[i].reset();
		}
 
       /**
        * Callback function
        * @name onClear
        * @type {Function}
        * @memberOf ch.Form
        */
		that.callbacks("onClear");
		
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
        * @name onReset
        * @type {Function}
        * @memberOf ch.Form
        */
		that.callbacks("onReset");
		
		return that;
	};

			
/**
 *  Public Members
 */	
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Form
     */ 
	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Form
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Form
     */
	that["public"].type = that.type;
    /**
     * Watcher instances associated to this controller.
     * @public
     * @name children
     * @type {Collection}
     * @memberOf ch.Form
     */
	that["public"].children = that.children;
    /**
     * Collection of messages defined.
     * @public
     * @name messages
     * @type {String}
     * @memberOf ch.Form
     */
	that["public"].messages = conf.messages;
    /**
     * Executes all children's validations, if finds a error will trigger 'onError' callback, if no error is found will trigger 'onValidate' callback, and allways trigger 'afterValidate' callback.
     * @function
     * @name validate
     * @memberOf ch.Form
     * @returns {Chico-UI Object}
     */
	that["public"].validate = function() { 
		validate(); 
		
		return that["public"]; 
	};
	
    /**
     * This methods triggers the 'beforSubmit' callback, then will execute validate() method, and if is defined triggers 'onSubmit' callback, at the end will trigger the 'afterSubmit' callback.
     * @function
     * @name submit
     * @memberOf ch.Form
     * @returns {Chico-UI Object}
     */
	that["public"].submit = function() { 
		submit(); 
		
		return that["public"]; 
	};

    /**
     * Return the status value.
     * @function
     * @name getStatus
     * @memberOf ch.Form
     * @returns {Chico-UI Object}
     */ 	
	that["public"].getStatus = function(){
		return status;	
	};

    /**
     * Use this method to clear al validations.
     * @function
     * @name clear
     * @memberOf ch.Form
     * @returns {Chico-UI Object}
     */ 
	that["public"].clear = function() { 
		clear(); 
		
		return that["public"]; 
	};
    /**
     * Use this method to clear al validations.
     * @function
     * @name reset
     * @memberOf ch.Form
     * @returns {Chico-UI Object}
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
			//Because if you want do something on submit, you need that the trigger (submit button) 
			//don't have events associates. You can add funcionality on onSubmit callback
		that.$element.find(":submit").unbind('click');
	};

	// Bind the submit
	that.$element.bind("submit", submit);
	
	// Bind the reset
	that.$element.find(":reset, .resetForm").bind("click", function(event){ reset(event); });

	return that;
};
