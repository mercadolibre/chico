/**
 *	Form Controller
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ch.form = function(conf){

/**
 *  Validation
 */
	// Are there action and submit type?
	if ( this.$element.find(":submit").length == 0 || this.$element.attr("action") == "" ){ 
		alert("Form fatal error: The <input type=submit> is missing, or need to define a action attribute on the form tag.");
		return;
	};

	// Is there form in map instances?	
	if ( ch.instances.hasOwnProperty("form") && ch.instances.form.length > 0 ){
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
 *  Constructor
 */
	var that = this;
	
	conf = ch.clon(conf);
	// Create the Messages for General Error
	if ( !conf.hasOwnProperty("messages") ) conf.messages = {};
	conf.messages["general"] = conf.messages["general"] || "Check for errors.";	
	
	// Disable HTML5 browser-native validations
	that.$element.attr("novalidate", "novalidate");	
	
	that.conf = conf;

/**
 *  Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);
	
	
/**
 *  Private Members
 */
 
	var status = true;
	
	// General Error
	var $error = $("<p class=\"ch-validator\"><span class=\"ico error\">Error: </span>" + conf.messages["general"] + "</p>");
	
	// Create
	var createError = function(){ 
		that.$element.before( $error );		
		$("body").trigger(ch.events.CHANGE_LAYOUT);
	};
	
	// Remove
	var removeError = function(){
		$error.detach();
		$("body").trigger(ch.events.CHANGE_LAYOUT);
	};

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

	var validate = function(){

        that.callbacks("beforeValidate");

		// Shoot validations
		for(var i = 0, j = that.children.length; i < j; i ++){
			that.children[i].validate();
		};

		checkStatus();
		
		status ? that.callbacks("onValidate") : that.callbacks("onError");  

        that.callbacks("afterValidate");
        
		return that;
	};

	var submit = function(event){

        that.prevent(event);
        
        that.callbacks("beforeSubmit");

		validate(); // Validate start
		
		if ( status ){ // Status OK
			if ( !conf.hasOwnProperty("onSubmit") ) {
				that.element.submit();
			}else{
				that.callbacks("onSubmit");
			};
		};		

        that.callbacks("afterSubmit");
        
		return that;
	};

	var clear = function(event){		
		that.prevent(event);		
		removeError();	
		for(var i = 0, j = that.children.length; i < j; i ++) that.children[i].reset(); // Reset helpers		
		
		that.callbacks("onClear");
		
		return that;
	};
	
	var reset = function(event){
		clear();
		that.element.reset(); // Reset html form native
		that.callbacks("onReset");
		
		return that;
	};


/**
 *  Protected Members
 */

	
			
/**
 *  Public Members
 */	

	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].children = that.children;
	that["public"].messages = conf.messages;
	that["public"].validate = function() { 
		validate(); 
		
		return that["public"]; 
	};
	
	that["public"].submit = function() { 
		submit(); 
		
		return that["public"]; 
	};
	
	that["public"].checkStatus = function() { 
		checkStatus(); 
		
		return that["public"]; 
	};
	
	that["public"].getStatus = function(){
		return status;	
	};
	
	that["public"].clear = function() { 
		clear(); 
		
		return that["public"]; 
	};
	
	that["public"].reset = function() { 
		reset(); 
		
		return that["public"]; 
	};


/**
 *  Default event delegation
 */	

	// patch exists because the components need a trigger
	if (conf.hasOwnProperty("onSubmit")) {
		that.$element.bind('submit', function(event){ that.prevent(event); });
		// Delete all click handlers asociated to submit button >NATAN: Why?
			//Because if you want do something on submit, you need that the trigger (submit button) 
			//don't have events associates. You can add funcionality on onSubmit callback
		that.$element.find(":submit").unbind('click');
	};

	// Bind the submit
	that.$element.bind("submit", function(event){
		submit(event);
	});
	
	// Bind the reset
	that.$element.find(":reset, .resetForm").bind("click", function(event){ reset(event); });

	return that;
};
