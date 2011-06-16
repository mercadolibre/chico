
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
	// Create the Messages for General Error
	if ( !ch.utils.hasOwn(conf, "messages") ) conf.messages = {};
	conf.messages["general"] = conf.msg || conf.messages["general"]  || "Check for errors.";	
	
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
     * HTML snippet to show the general error on top of the form.
     * @private
     * @name $error
     * @type {jQuery Object}
     * @memberOf ch.Form
     */ 
	var $error = $("<p class=\"ch-validator\"><span class=\"ico error\">Error: </span>" + conf.messages["general"] + "</p>");
	
    /**
     * Inserts the general error snippet into the HTML. This implies a change in the document's flow, so it will trigger the ch.events.LAYOUT.CHANGE Event.
     * @private
     * @function
     * @name createError
     * @memberOf ch.Form
     * @see ch.events.LAYOUT.CHANGE
     */ 
	var createError = function(){ 
		that.$element.before( $error );		
		$("body").trigger(ch.events.LAYOUT.CHANGE);
	};

    /**
     * Removes the general error snippet from the HTML. This implies a change in the document's flow, so it will trigger the ch.events.LAYOUT.CHANGE Event.
     * @private
     * @function
     * @name removeError
     * @memberOf ch.Form
     * @see ch.events.LAYOUT.CHANGE
     */ 
 	var removeError = function(){
		$error.detach();
		$("body").trigger(ch.events.LAYOUT.CHANGE);
	};

    /**
     * Iterates all the Watchers defined as children, for each one of them will check it's active property and returns when finds an error.
     */
	var checkStatus = function(){
		// Check status of my childrens
		for(var i = 0, j = that.children.length; i < j; i ++){
			// Status error (cut the flow)
			if( that.children[i].active() ){
				if ( !status ) removeError();			
				createError();
				status = false;
				// Issue UI-332: On validation must focus the first field with errors.
				// Doc: http://wiki.ml.com/display/ux/Mensajes+de+error
				that.children[i].element.focus();
				return;
			};
		};

		// Status OK (with previous error)
		if ( !status ) {
			removeError();
			status = true;
		};

	};
	
    /**
     * Executes all children's validations, if finds a error will trigger 'onError' callback, if no error is found will trigger 'onValidate' callback, and allways trigger 'afterValidate' callback.
     */
	var validate = function(){

        that.callbacks("beforeValidate");
		
		// Status OK (with previous error)
		if ( !status ) {
			removeError();
			status = true;
		};
		
        var i = 0, j = that.children.length, toFocus, childrenError = [];
		// Shoot validations
		for ( i; i < j; i++ ) {
		    var child = that.children[i];
			// Validate
			if ( !child.active() ) {
                child.validate();
            } 
            // Save children with errors
            if ( child.active() ) {
                childrenError.push( child );
            }
		};
        
        // Is there's an error
        if ( childrenError.length > 0 ) {
            if ( !status ) {
                removeError();
            }
            createError();
            status = false;
            // Issue UI-332: On validation must focus the first field with errors.
            // Doc: http://wiki.ml.com/display/ux/Mensajes+de+error
            childrenError[0].element.focus();
        }
		
		status ? that.callbacks("onValidate") : that.callbacks("onError");  

        that.callbacks("afterValidate");
        
		return that;
	};

    /**
     * This methods triggers the 'beforSubmit' callback, then will execute validate() method, 
     * and if is defined triggers 'onSubmit' callback, at the end will trigger the 'afterSubmit' callback.
     */
	var submit = function(event){

        that.prevent(event);
        
        that.callbacks("beforeSubmit");

		validate(); // Validate start
		
		if ( status ){ // Status OK
			if ( !ch.utils.hasOwn(conf, "onSubmit") ) {
                // To fix Webflow dumb navigation system,
                // Clone the submit button into a hidden field
    			var hidden = that.$submit.clone();
    			    hidden.attr("type","hidden");
				    hidden.prependTo(that.element);    

			    // And send the form
				that.element.submit(event);

			}else{
				that.callbacks("onSubmit");
			};
		};		

        that.callbacks("afterSubmit");

        // re-asign submit event   
    	that.$element.one("submit", submit);
        
		return that;
	};

    /**
     * Use this method to clear al validations.
     */
	var clear = function(event){		
		that.prevent(event);		
		removeError();	
		for(var i = 0, j = that.children.length; i < j; i ++) that.children[i].reset(); // Reset helpers		
		
		that.callbacks("onClear");
		
		return that;
	};

    /**
     * Use this method to reset the form's input elements.
     */	
	var reset = function(event){
		clear();
		that.element.reset(); // Reset html form native
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
     * Iterates all the Watchers defined as children, for each one of them will check it's active property and returns when finds an error.
     * @function
     * @name checkStatus
     * @memberOf ch.Form
     * @see ch.watcher.active
     */
	that["public"].checkStatus = function() { 
		checkStatus(); 
		
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
	that.$element.one("submit", submit);
	
	// Bind the reset
	that.$element.find(":reset, .resetForm").bind("click", function(event){ reset(event); });

	return that;
};
