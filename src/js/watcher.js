
/**
 * Watcher is a validation engine for html forms elements.
 * @name Watcher
 * @class Watcher
 * @augments ch.Object
 * @memberOf ch
 * @requires ch.Form
 * @param {Configuration Object} o Object with configuration properties
 * @return {Chico-UI Object}
 * @see ch.Required
 * @see ch.String
 * @see ch.Number
 * @see ch.Custom
 */

ch.Watcher = function(conf) {

// Private members

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Watcher
     */
	var that = this;
	conf = ch.clon(conf);
	that.conf = conf;	

    // Inheritance
    that = ch.object.call(that);
    that.parent = ch.clon(that);
	
	
    /**
     * Reference to a ch.form controller. If there isn't any, the Watcher instance will create one.
     * @private
     * @name controller
     * @type {Chico-UI Object}
     * @memberOf ch.Watcher
     */
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
	
    
    /**
     * Will search for instances of Watchers with the same trigger, and then merge it's properties with it.
     * @private
     * @function
     * @name checkInstance
     * @return {Instance Object}
     * @memberOf ch.Watcher
     */	
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
    
    /**
     * Given an Array of types will merge with the current types and will return the new collection.
     * @private
     * @function
     * @name mergeTypes
     * @param {Array} types Collection of types
     * @return {Instance Object}
     * @memberOf ch.Watcher
     */
	var mergeTypes = function(types) {
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
    
    /**
     * Run all validations again and do form.checkStatus()
     * @private
     * @function
     * @name revalidate
     * @memberOf ch.Watcher
     */
	var revalidate = function() {		
		that.validate();
        controller.checkStatus();  // Check everthing?
	}; 

// Protected Members 

    /**
     * Active is a boolean property that let you know if there's a validation going on.
     */
	that.active = false;
	
    /**
     * Enabled is a boolean property that let you know if the watchers is enabled or not.
     */	
    that.enabled = true;
	
    /**
     * Reference is used to assign a context to the positioning preferences.
     */
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
            } else if ( that.$element.prev().prop('tagName') == 'LEGEND' ) {
                reference = that.$element.prev(); // Legend like helper reference
            }
        // INPUT, SELECT, TEXTAREA
        } else {
            reference = that.$element;
        }
        return reference;
    })();

    /**
     * Validations is a map with all configured validations.
     */
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


	/**
     * Conditions is a map with all configured conditions.
     */
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
	
    /**
     * Messages is a map with all configured messages.
     */
    that.messages = ch.clon(conf.messages);
 
    /**
     * Helper is a UI Component that shows the messages of active validations.
     * @type {Chico-UI Object}
     */
     var helper = {};
		helper.uid = that.uid + "#0";
		helper.type = "helper";
		helper.element = that.element;
		helper.$element = that.$element;
		
    that.helper = ch.helper.call(helper, that);
    
    /**
     * Validate executes all configured validations.
     */
 	that.validate = function(event) {	
		// Pre-validation: Don't validate disabled or not required & empty elements
		if ( that.$element.attr('disabled') ) { return; }
		if ( !that.validations.hasOwnProperty("required") && that.isEmpty() && that.active === false) { return; }

		if ( that.enabled && ( that.active === false || !that.isEmpty() || that.validations.hasOwnProperty("required") ) ) {
	
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

					that.$element.one(event, function(event){ that.validate(event); }); // Add blur or change event only one time

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
			
			// If has an error, but complete the field and submit witout trigger blur event
			if (event) {
				var originalTarget = event.originalEvent.explicitOriginalTarget || document.activeElement; // Moderns Browsers || IE
				if (originalTarget.type == "submit") { controller.submit(); };
			};
			
			controller.checkStatus();
		};
        
        that.callbacks('afterValidate');
        
        return that;
	};
	
    /**
     * Reset all active validations messages.
     */
 	that.reset = function() {
		//that.publish.status = that.status = conf.status = true; // Public status OK
		that.active = false;
		that.$element.removeClass("error");
		that.helper.hide(); // Hide helper
		that.$element.unbind("blur change", that.validate); // Remove blur and change event
		
		that.callbacks("onReset");
		
		return that;
	};
	
    /**
     * isEmpty determine if the field has no value selected.
     */	
     that.isEmpty = function() {
		that.tag = ( that.$element.hasClass("options")) ? "OPTIONS" : that.element.tagName;
		switch (that.tag) {
			case 'OPTIONS':
				return that.$element.find('input:checked').length === 0;
			break;
			
			case 'SELECT':
			    var val = that.$element.val();
				return parseInt(val) === -1 || val === null;
			break;
			
			case 'INPUT':
			case 'TEXTAREA':
				return $.trim( that.$element.val() ).length === 0;
			break;
		};
				
	};

	
			
// Public Members
	
	/**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Watcher
     */ 
	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Watcher
     */
	that["public"].element = that.element;
	/**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Watcher
     */
	that["public"].type = "watcher"; // Everything is a "watcher" type, no matter what interface is used
    /**
     * Validations supported.
     * @public
     * @name types
     * @type {String}
     * @memberOf ch.Watcher
     */
	that["public"].types = conf.types;
    /**
     * Positioner reference.
     * @public
     * @name reference
     * @type {jQuery Object}
     * @memberOf ch.Watcher
     */
	that["public"].reference = that.reference;
    /**
     * Configured validations.
     * @public
     * @name validations
     * @type {Object Literal}
     * @memberOf ch.Watcher
     */
	that["public"].validations = that.validations;
    /**
     * Configured conditions.
     * @public
     * @name conditions
     * @type {Object Literal}
     * @memberOf ch.Watcher
     */
	that["public"].conditions = that.conditions;
    /**
     * Configured messages.
     * @public
     * @name messages
     * @type {Object Literal}
     * @memberOf ch.Watcher
     */
	that["public"].messages = that.messages;
    /**
     * Helper's instance reference.
     * @public
     * @name helper
     * @type {ch.Helper}
     * @memberOf ch.Watcher
     * @see ch.Helper
     */
	that["public"].helper = that.helper["public"];
    /**
     * Active is a boolean property that let you know if there's a validation going on.
     * @public
     * @function
     * @name active
     * @return {Boolean}
     * @memberOf ch.Watcher
     */
	that["public"].active = function() {
		return that.active;
	};
    /**
     * Let you concatenate methods.
     * @public
     * @function
     * @name and
     * @return {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	that["public"].and = function() {
		return that.$element;
	};
    /**
     * Reset al active validations.
     * @public
     * @function
     * @name reset
     * @return {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	that["public"].reset = function() {
		that.reset();
		
		return that["public"];
	};
    /**
     * Run all configured validations.
     * @public
     * @function
     * @name validate
     * @return {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	that["public"].validate = function() {
		that.validate();
		
		return that["public"];
	};
    /**
     * Turn on Watcher engine.
     * @public
     * @function
     * @name enable
     * @return {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	that["public"].enable = function() {
		that.enabled = true;
				
		return that["public"];			
	};
    /**
     * Turn off Watcher engine.
     * @public
     * @function
     * @name disable
     * @return {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	that["public"].disable = function() {
		that.enabled = false;
		
		return that["public"];
	};
	/**
     * Recalculate Helper's positioning.
     * @public
     * @function
     * @name refresh
     * @return {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	that["public"].refresh = function() { 
		return that.helper.position("refresh");
    };

	

/**
 * Default event delegation
 * @ignore
 */	

    // Run the instances checker        
    // TODO: Maybe is better to check this on top to avoid all the process. 
    var check = checkInstance();
    // If a match exists
    if ( check ) {
        // Create a public object and save the existing object
        // in the public object to mantain compatibility
        var that = {};
            that["public"] = check; 
        // ;) repleace that object with the repeated instance
    } else {
        // this is a new instance: "Come to papa!"
        controller.children.push(that["public"]);
    };

	return that;
};
