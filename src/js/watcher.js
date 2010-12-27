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
	
	// Get my parent or set it
	that.getParent = function(conf){

		if (ui.instances.forms.length > 0) {
			
			for(var i = 0, j = ui.instances.forms.length; i < j; i ++){
				if(ui.instances.forms[i].element === $(conf.element).parents("form")[0]){
					that.parent = ui.instances.forms[i]; // Get my parent
					that.parent.children.push(conf.publish); // Add me to my parent
				}
			};
			
		} else {
						
			$(conf.element).parents("form").forms();
			var last = (ui.instances.forms.length - 1);
			that.parent = ui.instances.forms[last]; // Set my parent
			that.parent.children.push(conf.publish); // Add me to my parent
			
		};
		
	};
	
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
				conf.publish.status = false; // Public status false
				$(conf.element).bind( (conf.tag == 'OPTIONS' || conf.tag == 'SELECT') ? "change" : "blur", function(){ that.validate(conf); that.parent.validate(); }); // Add blur event only on error
				return;
			};
		};
		
		// Status OK (with previous error)
		if(!conf.status){
			$(conf.element).removeClass("error"); // Remove field error style
			that.helper.hide(); // Hide helper
			conf.status = true; // Status OK
			conf.publish.status = true; // Public status OK
			$(conf.element).unbind( (conf.tag == 'OPTIONS' || conf.tag == 'SELECT') ? "change" : "blur" ); // Remove blur event on status OK
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
