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
	
	
	// Check chaining validations
	(function(){
		
			
		
	});
	
	// And() Concatenate the validations on this Watcher return trigger element
	that.and = function(conf) {
	
		return $(conf.element);
	
	};
	
	that.isEmpty = function(conf){

		conf.tag = ($(conf.element).hasClass("options")) ? "OPTIONS" : conf.element.tagName;

		switch(conf.tag){
			case 'OPTIONS':
				return $(conf.publish.element).find('input:checked').length == 0;
			break;
			
			case 'SELECT':
				return $(conf.publish.element).val() == -1; // TODO: Revisar el estandar de <select>
			break;
			
			case 'INPUT':
			case 'TEXTAREA':
				return $.trim( $(conf.publish.element).val() ).length == 0;
			break;
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
		// Pre-validation: Don't validate disabled or not required elements
		if($(conf.element).attr('disabled')) return;
		if(conf.name != "required" && that.isEmpty(conf)) return;

		// Validate each type of validation
		for(var type in conf.validations){
			// Status error (cut the flow)
			if(!conf.checkConditions(type)){
				$(conf.element).addClass("error"); // Field error style
				if(!conf.status) that.helper.hide(); // With previous error
				that.helper.show( conf.messages[type] ); // Show helper with message
				conf.status = false; // Status false
				$(conf.element).bind("blur", function(){ that.validate(conf); }); // Add blur event only on error
				return;
			};
		};
		
		// Status OK (with previous error)
		if(!conf.status){
			$(conf.element).removeClass("error"); // Remove field error style
			that.helper.hide(); // Hide helper
			conf.status = true; // Status OK
			$(conf.element).unbind("blur"); // Remove blur event on status OK
		};
	};
		
	return that;
};
