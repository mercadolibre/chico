/**
 *	Form Controller
 *	@author
 *	@Contructor
 *	@return An interface object
 */

/*

conf:{
	[ messages ]: "algo que pisa lo de andentro",
	[ callbacks ]: {
		[ submit ]: function,
		[ clear ]: function
	},
}
*/

ui.forms = function(conf){
	// Validation	
	if ($(conf.element).find(":submit").length == 0 || $(conf.element).attr('action') == "" ){ // Are there action and submit type?
		 alert("UI: Error...");
		 return;
	};
		
	if(ui.instances.forms.length > 0){ // Is there forms in map instances?
		for(var i = 0, j = ui.instances.forms.length; i < j; i ++){
			if(ui.instances.forms[i].element === conf.element){
				return { exists: true, object: ui.instances.forms[i] };
			};
		};
	};
	
	
	// Start new forms
	var that = ui.controllers(); // Inheritance
	var status = false;

	// patch exists because the components need a trigger
	$(conf.element).bind('submit', function(event){ that.prevent(event); });
	$(conf.element).find(":submit").unbind('click'); // Delete all click handlers asociated to submit button

	// Create the Messages for General Error
	if (!conf.messages) conf.messages = {};
	conf.messages["general"] = conf.messages["general"] || "Revisa los datos, por favor.";	


	// General Error	
	var createError = function(){ // Create
		$(conf.element).before('<p class="ch-validator"><span class="ico error">Error: </span>' + conf.messages["general"] + '</p>');
	};
	var removeError = function(){ // Remove
		$('.ch-validator').remove();
	};


	// Publics Methods
	
	var validate = function(event){
		that.prevent(event);

		for(var i = 0, j = that.children.length; i < j; i ++){
			// Status error (cut the flow)
			if( !that.children[i].validate().status ){				
				if (!status) removeError();				
				createError();
				status = false;
				return;
			};
		};
		// Status OK (with previous error)
		if (!status) {
			removeError();
			status = true;
		};	
		return conf.publish; // Return publish object
	};


	var submit = function(event){
		that.prevent(event);
		validate(event); // Validate start
		if (status){ // Status OK	
			if(conf.callbacks && conf.callbacks.submit) conf.callbacks.submit();
			conf.element.submit();
		};		
		return conf.publish; // Return publish object
	};


	var clear = function(event){		
		that.prevent(event);		
		conf.element.reset(); // Reset html form
		removeError();	
		for(var i = 0, j = that.children.length; i < j; i ++) that.children[i].reset(); // Reset helpers		
		return conf.publish; // Return publish object
	};



	// Bind the submit
	$(conf.element).bind('submit', function(event){
		that.prevent(event);
		submit(event);
	});
	
	// Bind the reset
	$(conf.element).find(":reset, .resetForm").bind('click', clear);
	
    // create the publish object to be returned
    conf.publish = {
        uid: conf.id,
        element: conf.element,
        type: "ui.forms",
        children: that.children,
		validate: function(event){ return validate(event) },
		submit: function(event){ return submit(event) },
		clear: function(event){ return clear(event) }
    }

	return conf.publish;
};