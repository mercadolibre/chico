/**
 *	Field validation Watcher
 *	@return An interface object
 */

ui.watcher = function(conf) {

	/**
	 *  Alerts
	 *  Configration is needed
	 */	

    if (!conf) {
        alert("Watcher fatal error: Need a configuration object to create a validation.");
    }
    
	/**
	 *  Inheritance
	 */	

    var that = ui.object();

	/**
	 *  @ Private methods
	 */
    
	/**
	 *  Check for instances with the same trigger
	 */
	var checkInstance = function(conf) {
        var instance = ui.instances.watcher;
        if (instance&&instance.length>0) {
            for (var i = 0, j = instance.length; i < j; i ++) {                
                if (instance[i].element === conf.element) {
            	    // Mergeo Validations
                    $.extend(instance[i].validations, getValidations(conf));
            	    // Mergeo Conditions
                    $.extend(instance[i].conditions, getConditions(conf));
                    // Merge Messages
                    $.extend(instance[i].messages, conf.messages);
                    // Merge Default Messages
                    // TODO: ????? something
                    // Merge types
            	    instance[i].types = mergeTypes(instance[i].types);
    				return { 
    				    exists: true, 
    				    object: instance[i] 
    			    };
                }
            }
        }
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
                }
            }
            // If are things to merge, do it.
            if (toMerge.length > 0) {
                $.merge(currentTypes, toMerge);
            }
            // Return as string
            return currentTypes.join(",");
        }    
    }
    
    // Reference: for the Positioner
    var getReference = function(conf) {
        var reference;
        // CHECKBOX, RADIO
        if ($(conf.element).hasClass("options")) {
        	// Helper reference from will be fired
        	// H4
        	if ($(conf.element).find('h4').length > 0) {
        		var h4 = $(conf.element).find('h4'); // Find h4
        			h4.wrapInner('<span>'); // Wrap content with inline element
        		reference = h4.children(); // Inline element in h4 like helper reference	
        	// Legend
        	} else if ($(conf.element).prev().attr('tagName') == 'LEGEND') {
        		reference = $(conf.element).prev(); // Legend like helper reference
        	};
        // INPUT, SELECT, TEXTAREA
        } else {
        	reference = $(conf.element);
        };
        return reference;
    }
    
	// Get my parent or set it
	var getParent = function(conf) {
		if (ui.instances.forms.length > 0) {	
		  var i = 0, j = ui.instances.forms.length; 
		  for (i; i < j; i ++) {
				if (ui.instances.forms[i].element === $(conf.element).parents("form")[0]) {
					return ui.instances.forms[i]; // Get my parent
				}
			};
		} else {
			$(conf.element).parents("form").forms();
			var last = (ui.instances.forms.length - 1);
			return ui.instances.forms[last]; // Set my parent
		};
	}
    
    // Collect validations
    var getValidations = function(conf) {
        var collection = {};
        var types = conf.types.split(",");
        for (var i = 0, j = types.length; i < j; i ++) {
            for (var val in conf) {
                if (types[i] == val) {
                    collection[val] = conf[val];
                    // TODO: eliminar conf[val]???
                };
            };
        };
        return collection;
    };

    // Collect conditions
    var getConditions = function(conf) {
        var collection = {};        
        var types = conf.types.split(",");
        for (var i = 0, j = types.length; i < j; i ++) {
            for (var val in conf) {
                if (types[i] == val) {
                    collection[val] = conf.conditions[val];
                    // TODO: eliminar conf[val]???
                };
            };
        };
        return collection;
    };

	// Get Messages
    var getMessages = function(conf) {	
    	// Configure messages by parameter (conf vs. default messages)
    	var messages = {};
    	for (var msg in conf.messages) {
    	   messages[msg] = conf.messages[msg];
    	}
        return messages;
    };

	// Revalidate
	var revalidate = function() {
		that.validate(conf);
        that.parent.checkStatus();  // Check everthing?
	}

	/**
	 *  @ Protected Members, Properties and Methods ;)
	 */	
    
    // Status
	that.status = true;
	
	// Enabled
	that.enabled = true;
	
	// Types
	that.types = conf.types;
	
	// Reference
	that.reference = conf.reference = getReference(conf);

	// Parent
	that.parent = conf.parent = getParent(conf);

	// Validations Map
	that.validations = getValidations(conf);

	// Conditions Map
	that.conditions = getConditions(conf);

    // Messages
    that.messages = getMessages(conf);

    // Default Messages
    that.defaultMessages = conf.defaultMessages;
    
    // Helper
    that.helper = ui.helper(conf);
    
    // Validate Method
	that.validate = function(conf) {
		
		// Pre-validation: Don't validate disabled or not required&empty elements
		if ($(conf.element).attr('disabled')) { return; };
		if (that.publish.types.indexOf("required") == -1 && that.isEmpty(conf)) { return; };

		if (that.enabled) {
        // Validate each type of validation
		for (var type in that.validations) {
			// Status error (stop the flow)
			
			var condition = that.conditions[type];
            var value = $(conf.element).val();
            var gotError = true;

            if (type=="required") {
                gotError = !that.isEmpty(conf);
            };
            
            if (condition.patt) {
                gotError = condition.patt.test(value);
            };
            
            if (condition.expr) {
                gotError = condition.expr((type.indexOf("Length")>-1) ? value.length : value, that.validations[type]);
            };
            
            if (condition.func&&type!="required") {
                gotError = condition.func.call(this, value); // Call validation function with 'this' as scope
            };
                    
			if (!gotError) {
    			// Field error style
				$(conf.element).addClass("error");
				// With previous error
				if (!conf.status) { that.helper.hide(); };
				// Show helper with message
				that.helper.show( (that.messages[type]) ? that.messages[type] : that.parent.messages[type] ); 
				// Status false
				that.publish.status = that.status =  conf.status = false;
			    
				var event = (conf.tag == 'OPTIONS' || conf.tag == 'SELECT') ? "change" : "blur";
				
				$(conf.element).one(event, revalidate); // Add blur event only one time
                    
                return;
			};
        }; 
		}; // Enabled
		
		// Status OK (with previous error)
		if (!that.status||!that.enabled) {
		    // Remove field error style
			$(conf.element).removeClass("error"); 
            // Hide helper  
			that.helper.hide();
			// Public status OK
			that.publish.status = that.status =  conf.status = true; // Status OK
			// Remove blur event on status OK
			$(conf.element).unbind( (conf.tag == 'OPTIONS' || conf.tag == 'SELECT') ? "change" : "blur" );
		};
        
        that.callbacks(conf, 'validate');
	};
	
	// Reset Method
	that.reset = function(conf) {
		that.publish.status = that.status = conf.status = true; // Public status OK
		$(conf.element).removeClass("error");
		that.helper.hide(); // Hide helper
		$(conf.element).unbind("blur"); // Remove blur event 
		
		that.callbacks(conf, 'reset');
	};
	
	// isEmpty Method
	that.isEmpty = function(conf) {
		conf.tag = ($(conf.element).hasClass("options")) ? "OPTIONS" : conf.element.tagName;
		switch (conf.tag) {
			case 'OPTIONS':
				return $(conf.element).find('input:checked').length == 0;
			break;
			
			case 'SELECT':
			    var val = $(conf.element).val();
				return val == -1 || val == null;
			break;
			
			case 'INPUT':
			case 'TEXTAREA':
				return $.trim( $(conf.element).val() ).length == 0;
			break;
		};
	};
    
/**
 *  Expose propierties and methods
 */	
	that.publish = {
	/**
	 *  @ Public Properties
	 */
    	uid: conf.uid,
		element: conf.element,
		type: "watcher", //conf.type, // Everything is a "watcher" type, no matter what interface is used
		types: that.types,
		status: that.status,
		reference: that.reference,
		parent: that.parent,
		validations: that.validations,
		conditions: that.conditions,
		messages: that.messages,
	/**
	 *  @ Public Methods
	 */
		and: function() {
		  return $(conf.element);
		},
		reset: function() {
			that.reset(conf);
			return that.publish;
		},
		validate: function() {
			that.validate(conf);
			return that.publish;
		},
        refresh: function() { 
            return that.helper.position("refresh");
        },
		enable: function() {
			that.enabled = true;		
			return that.publish;			
		},
		disable: function() {
			that.enabled = false;
			return that.publish;
		}
	};

    // Run the instances checker        
    // TODO: Maybe is better to check this on top to avoid all the process. 
    var check = checkInstance(conf);
    // If a match exists
    if (check) {
        // Create a publish object and save the existing object
        // in the publish object to mantain compatibility
        var that = {};
            that.publish = check; 
        // ;) repleace that object with the repeated instance
    } else {
        // this is a new instance: "Come to papa!"
        that.parent.children.push(that.publish);
    }

	// return public object
	return that;
};
