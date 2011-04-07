/**
 *	Field validation Watcher
 *	@return An interface object
 */

ch.watcher = function(conf) {

/**
 *  Validation
 */

    /*if ( !conf ) {
        alert("Watcher fatal error: Need a configuration object to create a validation.");
    };*/

/**
 *  Constructor
 */

	var that = this;
	
	conf = ch.clon(conf);
	that.conf = conf;	

/**
 *  Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);
	
	
/**
 *  Private Members
 */
	
	// Enabled
	
	
	// Get my parent or set it
	var controller = (function() {
		if ( ch.instances.hasOwnProperty("form") && ch.instances.form.length > 0 ) {	
		  var i = 0, j = ch.instances.form.length; 
		  for (i; i < j; i ++) {
				if (ch.instances.form[i].element === that.$element.parents("form")[0]) {
					return ch.instances.form[i]; // Get my parent
				};
			};
		} else {
			that.$element.parents("form").form();
			var last = (ch.instances.form.length - 1);
			return ch.instances.form[last]; // Set my parent
		};
	})();
	
 	//  Check for instances with the same trigger	
	var checkInstance = function() {
        var instance = ch.instances.watcher;
        
        if ( instance && instance.length > 0 ) {
			for (var i = 0, j = instance.length; i < j; i ++) {            	                
                
                if (instance[i].element !== that.element) continue;
        	    
        	    // Merge Validations        	    
                $.extend(instance[i].validations, that.validations);
        	    
        	    // Merge Conditions        	    
                $.extend(instance[i].conditions, that.conditions);

                // Merge Messages
                $.extend(instance[i].messages, that.messages);
                
                // Merge types
        	    instance[i].types = mergeTypes(instance[i].types);

				return { 
				    exists: true, 
				    object: instance[i] 
			    };
			    
            };
        };
    };
    
	var mergeTypes = function (types) {
        if (!types || types == "") {
            return conf.types;
        } else {
            var currentTypes = types.split(",");
            var newTypes = conf.types.split(",");

            var toMerge = [];
            // For all new types, check if don't exists
            var e = 0; g = newTypes.length;
            for (e; e < g; e++) {
                if (types.indexOf(newTypes[e]) === -1) {
                    // If is a new type, pushed to merge it with the currents
                    toMerge.push(newTypes[e]);
                };
            };
            // If are things to merge, do it.
            if (toMerge.length > 0) {
                $.merge(currentTypes, toMerge);
            };

            // Return as string
            return currentTypes.join(",");
        }    
    };
    
	// Revalidate
	var revalidate = function() {		
		that.validate();
        controller.checkStatus();  // Check everthing?
	}; 


/**
 *  Protected Members
 */ 

    // Status
	that.active = false;
	
	// Enabled
	that.enabled = true;
	
	// Reference: for the Positioner
	that.reference = (function() {
        var reference;
        // CHECKBOX, RADIO
        if ( that.$element.hasClass("options") ) {
            // Helper reference from will be fired
            // H4
            if ( that.$element.find('h4').length > 0 ) {
                var h4 = that.$element.find('h4'); // Find h4
                    h4.wrapInner('<span>'); // Wrap content with inline element
                reference = h4.children(); // Inline element in h4 like helper reference	
            // Legend
            } else if ( that.$element.prev().attr('tagName') == 'LEGEND' ) {
                reference = that.$element.prev(); // Legend like helper reference
            }
        // INPUT, SELECT, TEXTAREA
        } else {
            reference = that.$element;
        }
        return reference;
    })();

	// Validations Map - Collect validations
	that.validations = (function() {
        var collection = {};
        var types = conf.types.split(",");
        for (var i = 0, j = types.length; i < j; i ++) {
            for (var val in conf) {
                if (types[i] == val) {
                    collection[val] = conf[val];
                    // TODO: eliminar conf[val]???
                }
            }
        }

        return collection;
    })();


	// Conditions Map
	that.conditions = (function() {
        var collection = {};        
        var types = conf.types.split(",");
        for (var i = 0, j = types.length; i < j; i ++) {
            for (var val in conf) {
                if (types[i] == val) {
                    collection[val] = conf.conditions[val];
                    // TODO: eliminar conf[val]???
                }
            }
        }

        return collection;
    })();


	
    // Messages

    that.messages = ch.clon(conf.messages);
 
    // Helper
    var helper = {};
		helper.uid = that.uid + "#0";
		helper.type = "helper";
		helper.element = that.element;
		helper.$element = that.$element;
		
    that.helper = ch.helper.call(helper, that);
    
    // Validate Method
	that.validate = function() {		
		// Pre-validation: Don't validate disabled or not required & empty elements
		if ( that.$element.attr('disabled') ) { return; }
		if ( !that.validations.hasOwnProperty("required") && that.isEmpty() ) { return; }

		if ( that.enabled ) {
			
			that.callbacks('beforeValidate');

	        // Validate each type of validation
	        
			for (var type in that.validations) {
				
				// Status error (stop the flow)
				var condition = that.conditions[type];
	            var value = that.$element.val();
	            var gotError = false;
				
	            if ( type == "required" ) {
	                gotError = that.isEmpty();
	            }
	            
	            if ( condition.patt ) {
	                gotError = !condition.patt.test(value);
	            }
	            
	            if ( condition.expr ) {
	                gotError = !condition.expr((type.indexOf("Length")>-1) ? value.length : value, that.validations[type]);
	            }

	            if ( condition.func && type != "required" ) {
	                gotError = !condition.func.call(this, value); // Call validation function with 'this' as scope
	            }
				
				if ( gotError ) {
										
	    			// Field error style
					that.$element.addClass("error");

					// Show helper with message
					var text = ( that.messages.hasOwnProperty(type) ) ? that.messages[type] : 
						(controller.hasOwnProperty("messages")) ? controller.messages[type] :
						undefined;

					that.helper.show( text );

					that.active = true;

					var event = (that.tag == 'OPTIONS' || that.tag == 'SELECT') ? "change" : "blur";

					that.$element.one(event, that.validate); // Add blur or change event only one time

	                return;
				}
	        } // End for each validation
		} // End if Enabled
		
		// Status OK (with previous error)
		if ( that.active || !that.enabled ) {
		    // Remove field error style
			that.$element.removeClass("error"); 
            // Hide helper  
			that.helper.hide();
			// Public status OK
			//that.publish.status = that.status =  conf.status = true; // Status OK
			that.active = false;
			
			controller.checkStatus();
		}
        
        that.callbacks('afterValidate');
        
        return that;
	};
	
	// Reset Method
	that.reset = function() {
		//that.publish.status = that.status = conf.status = true; // Public status OK
		that.active = false;
		that.$element.removeClass("error");
		that.helper.hide(); // Hide helper
		that.$element.unbind("blur"); // Remove blur event 
		
		that.callbacks("onReset");
		
		return that;
	};
	
	// isEmpty Method
	that.isEmpty = function() {
		that.tag = ( that.$element.hasClass("options")) ? "OPTIONS" : that.element.tagName;
		switch (that.tag) {
			case 'OPTIONS':
				return that.$element.find('input:checked').length === 0;
			break;
			
			case 'SELECT':
			    var val = that.$element.val();
				return val === -1 || val === null;
			break;
			
			case 'INPUT':
			case 'TEXTAREA':
				return $.trim( that.$element.val() ).length === 0;
			break;
		};
				
	};

	
			
/**
 *  Public Members
 */	
	that.public.uid = that.uid;
	that.public.element = that.element;
	that.public.type = "watcher"; // Everything is a "watcher" type, no matter what interface is used
	that.public.types = conf.types;
	that.public.reference = that.reference;
	that.public.validations = that.validations;
	that.public.conditions = that.conditions;
	that.public.messages = that.messages;
	that.public.helper = that.helper;
	that.public.active = function() {
		return that.active;
	};
	
	that.public.and = function() {
		return that.$element;
	};
	
	that.public.reset = function() {
		that.reset();
		
		return that.public;
	};
	
	that.public.validate = function() {
		that.validate();
		
		return that.public;
	};
	  
	that.public.enable = function() {
		that.enabled = true;
				
		return that.public;			
	};
	
	that.public.disable = function() {
		that.enabled = false;
		
		return that.public;
	};
	
	that.public.refresh = function() { 
		return that.helper.position("refresh");
   };

	

/**
 *  Default event delegation
 */	

    // Run the instances checker        
    // TODO: Maybe is better to check this on top to avoid all the process. 
    var check = checkInstance();
    // If a match exists
    if ( check ) {
        // Create a public object and save the existing object
        // in the public object to mantain compatibility
        var that = {};
            that.public = check; 
        // ;) repleace that object with the repeated instance
    } else {
        // this is a new instance: "Come to papa!"
        controller.children.push(that.public);
    };

	return that;
};
