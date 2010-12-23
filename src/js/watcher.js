/**
 *	Field validation Watcher
 *	@author 
 *	@Contructor
 *	@return An interface object
 */

ui.watcher = function(){
	var that = ui.object(); // Inheritance
	
	/*
	TODO Script para instancias repetidas: $(q).string().and().string()
	if(ui.instances.string.length > 0){
		for(var i = 0, j = ui.instances.string.length; i < j; i ++){
			if(ui.instances.string[i].element === conf.element){
				// The watcher for this trigger already exists
				// Merge the validations object and return Internal interface for avoid mapping objects 
				$.extend( ui.instances.string[i].validations, that.getValidations(conf) );
				return { exists: true, object: ui.instances.string[i] };
			};
		};
	};*/
	
	that.parent;	
	 // Get my papa or set it
	that.getPapa = function(conf){
		
		if (ui.instances.forms.length > 0) {
			
			for(var i = 0, j = ui.instances.forms.length; i < j; i ++){
				if(ui.instances.forms[i].element === $(conf.element).parents("form")[0]){
					that.parent = ui.instances.forms[i]; // Get my papa
					that.parent.children.push(conf.publish); // Add me to my papa
				}
			};
			
		} else {
			
			$(conf.element).parents("form").forms();
			var last = (ui.instances.forms.length - 1);
			that.parent = ui.instances.forms[last]; // Set my papa
			that.parent.children.push(conf.publish); // Add me to my papa
			
			
		};
		
	};
	
	// Collect validations
	that.getValidations = function(conf){
		var typesCollection = conf.types.split(",");
		
		var collection = {};
		
		for(var i = 0, j = typesCollection.length; i < j; i ++){
			for(var val in conf){
				if(typesCollection[i] == val){
					collection[val] = conf[val];
					// TODO: eliminar conf[val]???
				};
			};
		};

		return collection;
	};
	
	// Helper
	that.helper;

	// Validation
	that.validate = function(conf){
		// Refresh field value
		conf.value = $(conf.element).val();
		
		// Validate each type of validation
		for(var type in conf.validations){
			// Status error (cut the flow)
			if(!conf.checkConditions(type)){
				$(conf.element).addClass("error"); // Field error style
				if(!conf.status) that.helper.hide(); // With previous error
				that.helper.show( conf.messages[type] ); // Show helper with message
				conf.status = false; // Status false
				conf.publish.status = false; // Public status false
				$(conf.element).bind("blur", function(){ that.validate(conf); that.parent.validate(); }); // Add blur event only on error
				return;
			};
		};
		
		// Status OK (with previous error)
		if(!conf.status){
			$(conf.element).removeClass("error"); // Remove field error style
			that.helper.hide(); // Hide helper
			conf.status = true; // Status OK
			conf.publish.status = true; // Public status OK
			$(conf.element).unbind("blur"); // Remove blur event on status OK
		};
	};
	
	// Reset watcher
	that.reset = function(conf){
		conf.status = true; // Status OK
		conf.publish.status = true; // Public status OK
		$(conf.element).removeClass("error");
		that.helper.hide(); // Hide helper
		$(conf.element).unbind("blur"); // Remove blur event 
	};
		
	return that;
};
