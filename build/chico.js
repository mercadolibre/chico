/**
  * Chico-UI
  * Packer-o-matic
  * Like the pizza delivery service: "Les than 100 milisecons delivery guarantee!"
  * @components: core, position, positioner, object, floats, navs, controllers, watcher, carousel, dropdown, layer, modal, tabNavigator, tooltip, string, number, required, helper, forms, viewer
  * @version 0.4
  * @autor Chico Team <chico@mercadolibre.com>
  *
  * @based on:
  * @package JSMin
  * @author Ryan Grove <ryan@wonko.com> 
  * @copyright 2002 Douglas Crockford <douglas@crockford.com> (jsmin.c) 
  * @copyright 2008 Ryan Grove <ryan@wonko.com> (PHP port) 
  * @link http://code.google.com/p/jsmin-php/ 
  */
;(function($){
/** 
  * @namespace
  */
var ui = window.ui = {

    version: "0.4.8",

    components: "carousel,dropdown,layer,modal,tabNavigator,tooltip,string,number,required,helper,forms,viewer",

    internals: "position,positioner,object,floats,navs,controllers,watcher",

    instances: {},
 	
    init: function() { 
        // unmark the no-js flag on html tag
        $("html").removeClass("no-js");
        // check for pre-configured components
        ui.components = (window.components) ? ui.components+","+window.components : ui.components ;
        // check for pre-configured internals
        ui.internals = (window.internals) ? ui.internals+","+window.internals : ui.internals ;
        // iterate and create components               
        $(ui.components.split(",")).each(function(i,e){ ui.factory({component:e}); });
    },
/**
 *	@static Utils. Common usage functions.
 */		
    utils: {
		body: $('body'),
		html: $('html'),
		window: $(window),
		document: $(document),
		zIndex: 1000,
		index: 0 // global instantiation index
	}
}

/**
*	Factory
*/	
ui.factory = function(o) {

    /**
    *   o {
            component: "chat",
            callback: function(){},
            [script]: "http://..",
            [style]: "http://..",
            [callback]: function(){}    
    *    }
    *
    *	@return A collection of object instances
    */
    
    if (!o) { 
        alert("Factory fatal error: Need and object {component:\"\"} to configure a component."); 
        return;
    };

    if (!o.component) { 
        alert("Factory fatal error: No component defined."); 
        return;
    };

    var x = o.component;

    var create = function(x) { 

        // Send configuration to a component trough options object
        $.fn[x] = function( options ) {

            var results = [];			    
            var that = this;
            var options = options || {};

            that.each( function(i, e) {

                var conf = {};
                    conf.name = x;
                    conf.element = e ;
                    conf.id = ui.utils.index++; // Global instantiation index
                
                // If argument is a number, join with the conf
                if (typeof options === "number") {
                    conf.value = options;
                } else {
                    // Check for an object
                    if (typeof options !== "object") { 
                        alert("Factory " + x + " configure error: Need a basic configuration."); 
                        return;
                    };
                    // Extend conf with the options
                    $.extend( conf , options );   
                }

                // Create a component from his constructor
                var created = ui[x]( conf );

				/* 
					MAPPING INSTANCES
				
    				Internal interface for avoid mapping objects
    				{
    					exists:true,
    					object: {}
    				}
				*/

			    if (created.type) {
			        var type = created.type;		    
                    // If component don't exists in the instances map create an empty array
                    if (!ui.instances[type]) { ui.instances[type] = []; }
                         ui.instances[type].push( created );
			    }
			    		
				if (created.exists) {				
					// Avoid mapping objects that already exists
					created = created.object;
				}			

			    results.push( created );

            });
            
            // return the created components or component   
            return ( results.length > 1 ) ? results : results[0];
        }

        // if a callback is defined 
        if ( o.callback ) { o.callback(); }
                        
    } // end create function
    
    if ( ui[o.component] ) {
        // script already here, just create
        create(o.component);
        
    } else {
        // get resurces and call create
        ui.get({
            "method":"component",
            "component":o.component,
            "script": ( o.script )? o.script : "src/js/"+o.component+".js",
            "styles": ( o.style ) ? o.style : "src/css/"+x+".css",
            "callback":create
        });
        
        //alert("UI: " + x + " configuration error. The component do not exists");
    }
}

/**
 *  Get
 */
 
ui.get = function(o) {
    /**
    *   o {
            method: "content"|"component",
            component: "chat",
            [script]: "http://..",
            [style]: "http://..",
            [callback]: function(){}
    *    }
    */
    
    switch(o.method) {

	case "content":
			
		var result;
        var x = o.conf;
        
		x.$htmlContent.html('<div class="loading"></div>');
				
		$.ajax({
			url: x.ajaxUrl,
			type: x.ajaxType || 'POST', // Because ajax.data is sent everytime, Solucion temporal por el modal
			data: x.ajaxParams,
			cache: true,
			async: false, // Because getAjaxContent function returnaba before success and error
			success: function(data, textStatus, xhr){
				result = data;
				if(x.callbacks && x.callbacks.success) x.callbacks.success(data, textStatus, xhr);			
			},
			error: function(xhr, textStatus, errorThrown){
				result = (x.callbacks && x.callbacks.error) ? x.callbacks.error(xhr, textStatus, errorThrown) : "<p>Error on ajax call</p>";
			}
		});
			
		return result;
	
		break;
        
	case "component":
        
        // ui.get: "Should I get a style?"
        if ( o.style ) {
    		var style = document.createElement('link');
        		style.href = o.style;
    	    	style.rel = 'stylesheet';
            	style.type = 'text/css';
        }
        // ui.get: "Should I get a script?"        
        if ( o.script ) {
    	   	var script = document.createElement("script");
    			script.src = o.script;
        }
        
        var head = document.getElementsByTagName("head")[0] || document.documentElement;

		// Handle Script loading
		var done = false;

		// Attach handlers for all browsers
		script.onload = script.onreadystatechange = function() {
    
    	if ( !done && (!this.readyState || 
					this.readyState === "loaded" || this.readyState === "complete") ) {
					
				done = true;
            
	   			// if callback is defined call it
	   	        if ( o.callback ) { o.callback( o.component ); }
									
		   		// Handle memory leak in IE
	   			script.onload = script.onreadystatechange = null;
   			
		   		if ( head && script.parentNode ) { head.removeChild( script ); }
			}
		};
            
		// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
		// This arises when a base node is used.
		if ( o.script ) { head.insertBefore( script, head.firstChild ); }
		if ( o.style ) { head.appendChild( style ); }
    
		break;        
    }

}
/**
 *      DEPRECATED
 */
/**
*  @static @class Positionator
*	@author <a href="mailto:leandro.linares@mercadolibre.com">Leandro Linares</a>
*	@author <a href="mailto:guillermo.paz@mercadolibre.com">Guillermo Paz</a>
*  @function 
*/	

ui.position = {
	// Vertical & horizontal alignment
	center: function(conf){
		var align = function(){
			conf.$htmlContent.css({
				left: (parseInt(ui.utils.window.width()) - conf.$htmlContent.outerWidth() ) /2,
				top: (ui.utils.html.hasClass('ie6')) ? '' : (parseInt(ui.utils.window.height()) - conf.$htmlContent.outerHeight() ) /2
			});
		};
		align();
		ui.utils.window.bind('resize', align);
	},
	
	// Layer, drop, mega-drop
	down: function(conf){
		var align = function(){
			conf.$htmlContent.css({
				top: conf.$wrapper.outerHeight() + 10,
				left: (conf.$wrapper.outerWidth() / 2) - 20
			});
		};
		align();
		ui.utils.window.bind('resize', align);
	},
	
	// Helpers
	right: function(conf){		
		var align = function(){
			conf.$htmlContent.css({
				top: (conf.$wrapper.height() / 2) - 11,
				left: conf.$wrapper.outerWidth() + 13
			});
		};
		align();
		ui.utils.window.bind('resize', align);
	},		
	
	// Tooltip
	follow: function(conf){
		conf.$trigger.bind('mousemove', function(event){
			conf.$htmlContent.css({
				top: event.pageY + 20,
				left: event.pageX - 32
			});
		});
	}
}
// @arg o == configuration
ui.positioner = function( o ) {

/*   References
     points: x, y 
         x values: center, left, right
         y values: middle, top, bottom
         
     examples:
         "cm" = center middle
         "tl" = top left
         "tr" = top right
         "bl" = bottom left
         "br" = bottom right

    example configuration:
    {
        element: $element
        [context]: $element | viewport
        [offset]: "x y" 
        [points]: "cm cm" // default
        [fixed]: false // default
        [draggable]: false // default
        
    } */
    
    // Initial configuration
	var element = $(o.element);
	var context;
    
	// Default parameters
	if(!o.points) o.points = "cm cm";    
    if(!o.offset) o.offset = "0 0";
    
    // Class names
    var classReferences = {
		"lt lb": "down",
		"lb lt": "top",
		"rt rb": "down",
		"rb rt": "top",
		"lt rt": "right",
		"cm cm": "center"
	};
	
	// Offset parameter
    var splittedOffset = o.offset.split(" ");
   	var offset_left = parseInt(splittedOffset[0]);
	var offset_top = parseInt(splittedOffset[1]);
	
    // Get viewport with your configuration - Crossbrowser
	var getViewport = function() {
    	var viewport;
    	var width;
 		var height;
 		var left;
 		var top;
 				
	 	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
		if (typeof window.innerWidth != "undefined") {
			viewport = window;
			width = viewport.innerWidth;
			height = viewport.innerHeight;
			left = 0 + offset_left + viewport.pageXOffset;
			top = 0 + offset_top + viewport.pageYOffset;
			bottom = height + viewport.pageYOffset;
			right = width + viewport.pageXOffset;
		
		// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
		// older versions of IE - viewport = document.getElementsByTagName('body')[0];
		} else if (typeof document.documentElement != "undefined" && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
			viewport = document.documentElement;
			width = viewport.clientWidth;
			height = viewport.clientHeight;
			left = 0 + offset_left + viewport.scrollLeft;
			top = 0 + offset_top + viewport.scrollTop;
			bottom = height + viewport.scrollTop;
			right = width + viewport.scrollLeft; 
		}

		// Return viewport object
		return {
			element: viewport,			
			left: left,
			top: top,
			bottom: bottom,
			right: right,
			width: width,
			height: height
		}
    };
    
	// Calculate css left and top to element on context
	var getPosition = function(unitPoints) {		     
		// my_x and at_x values together
		var xReferences = {
			ll: context.left,
			lr: context.left + context.width,
			rr: context.left + context.width - element.outerWidth(),
			cc: context.left + context.width/2 - element.outerWidth()/2
			// TODO: lc, rl, rc, cl, cr
		}
		
		// my_y and at_y values together
		var yReferences = {
			tt: context.top,
			tb: context.top + context.height,
			bt: context.top - element.outerHeight(),
			mm: context.top + context.height/2 - element.outerHeight()/2
			// TODO: tm, bb, bm, mt, mb
		}
		
		var axis = {
			left: xReferences[unitPoints.my_x + unitPoints.at_x],
			top: yReferences[unitPoints.my_y + unitPoints.at_y]	
		} 

		return axis;
	};
	
	// Evaluate viewport spaces and set points
	var calculatePoints = function(points, unitPoints){	
		
		// Default styles
        var styles = getPosition(unitPoints);
        	styles.direction = classReferences[points];
        
        // Check viewport limits
		var viewport = getViewport();
		
		// Down to top
		if ( (points == "lt lb") && ((styles.top + element.outerHeight()) > viewport.bottom) ) { // Element bottom > Viewport bottom
			unitPoints.my_y = "b";
			unitPoints.at_y = "t";
			
			// New styles
			styles = getPosition(unitPoints);
			styles.direction = "top";
			styles.top -= context.height; // TODO: Al recalcular toma al top del context como si fuese el bottom. (Solo en componentes. En los tests anda ok)
		};
		
		// Left to right
		if ( (styles.left + element.outerWidth()) > viewport.right ) { // Element right > Viewport right
			unitPoints.my_x = "r";
			unitPoints.at_x = "r";
			
			// New styles
			var current = styles.direction;
			styles = getPosition(unitPoints);
			styles.direction = current + "-right";
			if(current == "top") styles.top -= context.height; // TODO: Al recalcular toma al top del context como si fuese el bottom. (Solo en componentes. En los tests anda ok)
		};
		
		return styles;
	};
	
	
	// Set position to element on context
	var setPosition = function(points) {
		// Separate points config
        var splitted = points.split(" ");
        
        var unitPoints = {
        	my_x: splitted[0].slice(0,1),
        	my_y: splitted[0].slice(1,2),
        	at_x: splitted[1].slice(0,1),
        	at_y: splitted[1].slice(1,2)
        }
        
		var styles = calculatePoints(points, unitPoints);
		
		element
			.css({
				left: styles.left,
				top: styles.top
			})
			.removeClass( "ch-top ch-left ch-down ch-right ch-down-right ch-top-right" )
			.addClass( "ch-" + styles.direction );
	};	
	
	// Get context object and set element position
    var initPosition = function(){
    	// Context by parameter
    	if (o.context) {
    		
		    var contextOffset = o.context.offset();
		    context = {
		    	element: o.context,
				top: contextOffset.top + offset_top,
				left: contextOffset.left + offset_left,
				width: o.context.outerWidth(),
				height: o.context.outerHeight()
		    };
		    
		// Viewport as context
	    } else {
			context = getViewport();
	    };
	    
	    // Set element position	    
	    setPosition(o.points);
    };
    
    // Init
    
    initPosition();    
   	ui.utils.window.bind("resize scroll", initPosition);
   	return $(element);
};
/**
 *  @class Object. Represent the abstract class of all ui objects.
 *  @return {object} Object.
 */	

ui.object = function(){
	
	var that = this;
	
	return {
				
		prevent: function(event){
			if (event) {
			    event.preventDefault();
				event.stopPropagation();
			}
		},
		
		/*
		conf.content
		conf.content: "selector css" || "<tag>texto plano</tag>" || "texto plano"	
		conf.ajax
		conf.ajax:true (levanta href o action) || "http://www..." || "../test/test.html"
		*/
		loadContent: function(conf) {
			// Properties validation
			if (conf.ajax && conf.content) { alert('UI: "Ajax" and "Content" can\'t live together.'); return; };

			// Returns css selector, html code or plain text as content
			if (!conf.ajax) return ($(conf.content).length > 0) ? $(conf.content).clone().show() : conf.content;

			// Return Ajax content from ajax:true
			if (conf.ajax === true) {
				
				// Load URL from href or form action
				conf.ajaxUrl = conf.$trigger.attr('href') || conf.$trigger.parents('form').attr('action');
				
				// Ajax parameters
				conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax
				
				// If trigger is a form button...
				if(conf.$trigger.attr('type') == 'submit'){
					conf.ajaxType = conf.$trigger.parents('form').attr('method') || 'POST';
					var serialized = conf.$trigger.parents('form').serialize();
					conf.ajaxParams = conf.ajaxParams + ((serialized != '') ? '&' + serialized : '');
				};

				// Returns ajax results
				return ui.get({method:"content", conf:conf}) || '<p>Error on ajax call</p>';

			// Returns Ajax content from ajax:URL
			} else if ( conf.ajax.match(/(?:(?:(https?|file):\/\/)([^\/]+)(\/(?:[^\s])+)?)|(\/(?:[^\s])+)/g) ) { // Relatives and absolutes url regex
				// Set url
				conf.ajaxUrl = conf.ajax;

				// Ajax parameters
				conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax

				// Returns ajax results
				return ui.get({method:"content", conf:conf});
			
			// Invalid Ajax parameter
			} else {
				alert('UI: "Ajax" attribute error.'); return;				
			};

		},
		
		callbacks: function(conf, when){
			if(conf.callbacks && conf.callbacks[when]) conf.callbacks[when](conf.publish);
		},
        
        publish: { 
            // The publish Object will be returned in all instanced component, all public methods and properties goes here.
        }

	};
}/**
 *  @class Floats. Represent the abstract class of all floats UI-Objects.
 *  @requires object.
 *  @returns {Object} Floats.
 */
 
ui.floats = function() {
    
	var that = ui.object(); // Inheritance	

	var createClose = function(conf) {
		$('<p class="btn close">x</p>').bind('click', function(event) {
			that.hide(event, conf);
		}).prependTo(conf.$htmlContent);
	};

	var createCone = function(conf) {
		$('<div class="cone"></div>').prependTo(conf.$htmlContent);
	};

	that.show = function(event, conf) {
		that.prevent(event);
		
		if(conf.visible) return;
		
		conf.$htmlContent = $('<div class="ch-' + conf.name + '">');

		conf.$htmlContent
			.hide()
			.css("z-index", ui.utils.zIndex++)
			.appendTo("body")
			.html( that.loadContent(conf) );
				
		// Visual configuration
		if(conf.closeButton) createClose(conf);
		if(conf.cone) createCone(conf);
		if(conf.classes) conf.$htmlContent.addClass(conf.classes);	
		
		// Positioner
		conf.position.element = conf.$htmlContent;
		ui.positioner(conf.position);

		// Show
		conf.visible = true;
		conf.$htmlContent.fadeIn('fast', function(){ that.callbacks(conf, 'show'); });			
	};

	that.hide = function(event, conf){
		that.prevent(event);
		
		if(!conf.visible) return;
		
		conf.$htmlContent.fadeOut('fast', function(event){ $(this).remove(); });	
		
		// Hide
		conf.visible = false;
		that.callbacks(conf, 'hide');
	};

	return that;
}

/**
*  @static @class Navigators. Represent the abstract class of all navigators ui objects.
*  @requires PowerConstructor
*  @returns {Object} New Navigators.
*/	
ui.navs = function(){
	var that = ui.object(); // Inheritance
	
	that.status = false;
		
	that.show = function(event, conf){
		that.prevent(event);
		that.status = true;
		conf.$trigger.addClass('on');
		conf.$htmlContent.show();
		
		that.callbacks(conf, 'show');
	};
	
	that.hide = function(event, conf){
		that.prevent(event);
		that.status = false;
		conf.$trigger.removeClass('on');
		conf.$htmlContent.hide();
		
		that.callbacks(conf, 'hide');
	};		
	
	return that;
}
/**
 *	Controllers
 *	@author 
 *	@Contructor
 *	@return An interface object
 */

ui.controllers = function(){
	var that = ui.object(); // Inheritance
	
	that.children = [];
	
	return that;
};
/**
 *	Field validation Watcher
 *	@author 
 *	@Contructor
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
                    // Merge Messages
                    $.extend(instance[i].messages, getMessages(conf));
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
    	if (conf.types.indexOf("required") > -1 ) {
	       collection = { required: true };
	    } else {
            var types = conf.types.split(",");
        	for (var i = 0, j = types.length; i < j; i ++) {
        		for (var val in conf) {
        			if (types[i] == val) {
        				collection[val] = conf[val];
        				// TODO: eliminar conf[val]???
        			};
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

	/**
	 *  @ Protected Members, Properties and Methods ;)
	 */	
    
    // Status
	that.status = true;
	
	// Types
	that.types = conf.types;
	
	// Reference
	that.reference = conf.reference = getReference(conf);

	// Parent
	that.parent = conf.parent = getParent(conf);

	// Validations Map
	that.validations = getValidations(conf);

    // Messages
    that.messages = getMessages(conf);

	// Helper
    that.helper = ui.helper(conf);
    
    // Validate Method
	that.validate = function(conf) {
		
		// Pre-validation: Don't validate disabled or not required elements
		if ($(conf.element).attr('disabled')) { return; };
		if (that.publish.types.indexOf("required") == -1 && that.isEmpty(conf)) { return; };
        
		// Validate each type of validation
		for (var type in that.validations) {
			// Status error (stop the flow)
			if (!conf.checkConditions(type)) {
    			// Field error style
				$(conf.element).addClass("error");
				// With previous error
				if (!conf.status) { that.helper.hide(); };
				// Show helper with message
				that.helper.show( that.messages[type] ); 
				// Status false
				that.publish.status = that.status =  conf.status = false;
				$(conf.element).bind( (conf.tag == 'OPTIONS' || conf.tag == 'SELECT') ? "change" : "blur", function() { that.validate(conf); that.parent.checkStatus(); }); // Add blur event only on error
				return;
			};    
        };
		
		// Status OK (with previous error)
		if (!conf.status) {
		    // Remove field error style
			$(conf.element).removeClass("error"); 
            // Hide helper  
			that.helper.hide();
			// Public status OK
			that.publish.status = that.status =  conf.status = true; // Status OK
			// Remove blur event on status OK
			$(conf.element).unbind( (conf.tag == 'OPTIONS' || conf.tag == 'SELECT') ? "change" : "blur" ); 
		};
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
    	uid: conf.id,
		element: conf.element,
		type: "watcher",
		types: that.types,
		status: that.status,
		reference: that.reference,
		parent: that.parent,
		validations: that.validations,
		messages: that.messages,
	/**
	 *  @ Public Methods
	 */
		and: function() {
		  return $(conf.element);
		},
		reset: function() {
			that.reset(conf);
    		that.callbacks(conf, 'reset');
			return that.publish;
		},
		validate: function() {
			that.validate(conf);
    		that.callbacks(conf, 'validate');
			return that.publish;
		}
	};

    // Run the instances checker        TODO: Maybe is better to check this on top to avoid all the process. 
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
/**
 *	Carousel
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.carousel = function(conf){
	var that = ui.object(); // Inheritance
	var status = false;
	var page = 1;

	// Global configuration
	conf.$trigger = $(conf.element).addClass('ch-carousel');
	conf.$htmlContent = $(conf.element).find('.carousel').addClass('ch-carousel-content'); // TODO: wrappear el contenido para que los botones se posicionen con respecto a su contenedor
    conf.publish = that.publish;

	// UL Width calculator
	var htmlElementMargin = ($.browser.msie && $.browser.version == '6.0') ? 21 : 20;//IE necesita 1px de más
	var htmlContentWidth = conf.$htmlContent.children().size() * (conf.$htmlContent.children().outerWidth() + htmlElementMargin);
	
	// UL configuration
	conf.$htmlContent
		.wrap($('<div>').addClass('mask'))//gracias al que esta abajo puedo leer el $mask.width()
		.css('width', htmlContentWidth);
		
	// Mask Object	
	var $mask = conf.$trigger.find('.mask');

	// Steps = (width - marginMask / elementWidth + elementMargin)
	var steps = ~~( (conf.$trigger.width() - 70) / (conf.$htmlContent.children().outerWidth() + 20));
		steps = (steps == 0) ? 1 : steps;	

	// Move to... (steps in pixels)
	var moveTo = (conf.$htmlContent.children().outerWidth() + 20) * steps;

	// Mask configuration
	var margin = ($mask.width()-moveTo) / 2;
	$mask.width( moveTo ).height( conf.$htmlContent.children().outerHeight() + 2 ); // +2 for content with border
	//if(conf.arrows != false) $mask.css('marginLeft', margin);
	
	var prev = function(event) {
		if(status) return;//prevButton.css('display') === 'none' limit public movement
		
		var htmlContentPosition = conf.$htmlContent.position();
		
		status = true;
		
		conf.$htmlContent.animate({ left: htmlContentPosition.left + moveTo }, function(){
			htmlContentPosition = conf.$htmlContent.position();			
			if(htmlContentPosition.left >= 0) buttons.prev.hide();
			buttons.next.show();
			status = false;
		});
        
        page--;
        
        if (conf.pager) {
			$(".ch-pager li").removeClass("on");
			$(".ch-pager li:nth-child(" + page + ")").addClass("on");
		}
        
        // return publish object
        return conf.publish;
	}
	
	//En IE6 al htmlContentWidth por algun motivo se le suma el doble del width de un elemento (li) y calcula mal el next()
	if($.browser.msie && $.browser.version == '6.0') htmlContentWidth = htmlContentWidth - (conf.$htmlContent.children().outerWidth()*2);
	
	var next = function(event){
		if(status) return;//nextButton.css('display') === 'none' limit public movement
		
		var htmlContentPosition = conf.$htmlContent.position(); // Position before moving
		
		status = true;
		
		conf.$htmlContent.animate({ left: htmlContentPosition.left - moveTo }, function(){
			htmlContentPosition = conf.$htmlContent.position(); // Position after moving
			if(htmlContentPosition.left + htmlContentWidth <= $mask.width()) buttons.next.hide();
			buttons.prev.show();
			status = false;
		});

		page++;
		
		if (conf.pager) {
			$(".ch-pager li").removeClass("on");
			$(".ch-pager li:nth-child(" + page + ")").addClass("on");
		}
		
        // return publish object
        return conf.publish;
	}
	
	
	
	// Create buttons
	var buttons = {};
	
	buttons.prev = {};
	
	buttons.prev.$element = $('<p class="prev">Previous</p>')
		.bind('click', function(){ buttons.prev.move(1) })
		.css('top', (conf.$trigger.outerHeight() - 22) / 2) // 22 = button height
	
	buttons.prev.show = function(){
		buttons.prev.$element
			.addClass("on")
			.bind('click', function(){ buttons.prev.move(1) })
	};
	
	buttons.prev.hide = function(){
		buttons.prev.$element
			.removeClass("on")
			.unbind('click')
	};
	
	buttons.prev.move = function(distance){
		if(status || conf.$htmlContent.position().left == 0) return;
		
		var htmlContentPosition = conf.$htmlContent.position();
		
		status = true;
		
		conf.$htmlContent.animate({ left: htmlContentPosition.left + (moveTo * distance) }, function(){
			htmlContentPosition = conf.$htmlContent.position();			
			if(htmlContentPosition.left >= 0) buttons.prev.hide();
			buttons.next.show();
			status = false;
		});
        
        page -= distance;
        
        if (conf.pager) {
			$(".ch-pager li").removeClass("on");
			$(".ch-pager li:nth-child(" + page + ")").addClass("on");
		}
        
        // return publish object
        return conf.publish;
	};
	
	
	
	buttons.next = {};
	
	buttons.next.$element = $('<p class="next">Next</p>')
		.bind('click', function(){ buttons.next.move(1) })
		.css('top', (conf.$trigger.outerHeight() - 22) / 2) // 22 = button height
	
	buttons.next.show = function(){
		buttons.next.$element
			.addClass("on")
			.bind('click', function(){ buttons.next.move(1) })
	};
	
	buttons.next.hide = function(){
		buttons.next.$element
			.removeClass("on")
			.unbind('click')
	};
	
	buttons.next.move = function(distance){
		if(status || conf.$htmlContent.position().left + htmlContentWidth == $mask.width()) return;
		
		var htmlContentPosition = conf.$htmlContent.position(); // Position before moving
		
		status = true;
		
		conf.$htmlContent.animate({ left: htmlContentPosition.left - (moveTo * distance) }, function(){
			htmlContentPosition = conf.$htmlContent.position(); // Position after moving
			if(htmlContentPosition.left + htmlContentWidth <= $mask.width()) buttons.next.hide();
			buttons.prev.show();
			status = false;
		});

		page += distance;
		
		if (conf.pager) {
			$(".ch-pager li").removeClass("on");
			$(".ch-pager li:nth-child(" + page + ")").addClass("on");
		}
		
        // return publish object
        return conf.publish;
	};
	
	
		
	var select = function(item){
		var itemPage = ~~(item / steps) + 1; // Page of "item"
		
		// Move right
		if(itemPage > page){
			buttons.next.move(itemPage - page);
		// Move left
		}else if(itemPage < page){
	        buttons.prev.move(page - itemPage);
		};
		
		if (conf.pager) {
			$(".ch-pager li").removeClass("on");
			$(".ch-pager li:nth-child(" + page + ")").addClass("on");
		}
		
		// return publish object
	    return conf.publish;
	};
	
	
	
	/**
	 *	Buttons
	 */
	
	// Append prev and next
	conf.$trigger.prepend(buttons.prev.$element).append(buttons.next.$element);
	
	// Si el ancho del UL es mayor que el de la mascara, activa next
	if(htmlContentWidth > $mask.width()){
		buttons.next.show();
	}
	
	// Pager
	if (conf.pager) {
		var totalPages = Math.ceil(conf.$htmlContent.children().size() / steps); 
		var list = $("<ul class=\"ch-pager\">");
		var thumbs = [];
		
		// Create each mini thumb
		for(var i = 1, j = totalPages + 1; i < j; i += 1){
			thumbs.push( "<li>" + i + "</li>" );
		};
		list.append( thumbs.join("") );
		
		// Create pager
		conf.$trigger.append( list );
		
		// Position
		var pager = $(".ch-pager");
		var contextWidth = pager.parent().width();
		var pagerWidth = pager.outerWidth();
		
		pager.css('left', (contextWidth - pagerWidth) / 2);
		
		// Children functionality
		pager.children().each(function(i, e){
			$(e).bind("click", function(){
				select(i);
			});
		});
	}


    // Create the publish object to be returned
    conf.publish.uid = conf.id;
    conf.publish.element = conf.element;
    conf.publish.type = "carousel";
    conf.publish.getSteps = function() { return steps; };
    conf.publish.getPage = function() { return page; };
    conf.publish.select = function(item) { return select(item); };
    conf.publish.next = function(){ return buttons.next.move(1); };
    conf.publish.prev = function(){ return buttons.prev.move(1); };
    
    

	return conf.publish;
}
/**
 *	Dropdown
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.dropdown = function(conf){
	var that = ui.navs(); // Inheritance

	// Global configuration
	$(conf.element).addClass('ch-dropdown');
	conf.$trigger = $(conf.element).children(':first');
	conf.$htmlContent = conf.$trigger.next().bind('click', function(event){ event.stopPropagation() });
    conf.publish = that.publish;
	
	// Methods
	var show = function(event){ 

        that.show(event, conf);

        // return publish object
        return conf.publish;  
    };
	
    var hide = function(event){ 

        that.hide(event, conf); 

        // return publish object
        return conf.publish; 
    };
    
	// Trigger
	conf.$trigger
		.bind('click', function(event){
			if(that.status){ that.hide(event, conf); return; };
			
			// Reset all dropdowns
			$(ui.instances.dropdown).each(function(i, e){ e.hide() });
			
			that.show(event, conf);
		
			// Document events
			$(document).bind('click', function(event){
				//that.hide(event, conf);
                hide(event);
				$(document).unbind('click');
			});
		})
		.css('cursor','pointer')
		.addClass('ch-dropdown-trigger')
		.append('<span class="down">&raquo;</span>');
	
	// Content
	conf.$htmlContent
		.addClass('ch-dropdown-content')
		.css('z-index', ui.utils.zIndex++)
		.find('a')
			.bind('click', function(){ hide($.Event()) });

    // create the publish object to be returned
        conf.publish.uid = conf.id,
        conf.publish.element = conf.element,
        conf.publish.type = "dropdown",
        conf.publish.show = function(event){ return show(event, conf) },
        conf.publish.hide = function(event){ return hide(event, conf) }

	return conf.publish;

};
/**
 *	Context Layer
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.layer = function(conf) {
    
	var that = ui.floats(); // Inheritance

    var showTime = conf.showTime || 300;
    var hideTime = conf.hideTime || 300;
    
	var st, ht; // showTimer and hideTimer
	var showTimer = function(e){ st = setTimeout(function(){ show(e) }, showTime)};
	var hideTimer = function(e){ ht = setTimeout(function(){ hide(e) }, hideTime)};
	var clearTimers = function(){ clearTimeout(st); clearTimeout(ht); };

	// Global configuration
	conf.$trigger = $(conf.element);
	conf.cone = true;
	conf.classes = 'box';
	conf.visible = false;	
	conf.position = {
   		context: conf.$trigger,
        offset: conf.offset || "0 10",
		points: conf.points || "lt lb"
    }
    conf.publish = that.publish;

	var clearTimers = function() {
		clearTimeout(st);
		clearTimeout(ht);
	};

    var show = function(event) {

        that.show(event, conf);				

        if (conf.event === "click") {
            
            $('.ch-layer').bind('click', function(event){ event.stopPropagation() });
	
            // Document events
            $(document).bind('click', function(event) {
                that.hide(event, conf);
                $(document).unbind('click');
            });
        }
        
        // return publish object
        return conf.publish;    
    }

    var hide = function(event) {

        that.hide(event, conf);
        
        // return publish object
        return conf.publish;
    }
    
    var position = function(event) {
		ui.positioner(conf.position);
		
		return conf.publish;
	}

	// Click
	if(conf.event === 'click') {
		// Local configuration
		conf.closeButton = true;

		// Trigger events
		conf.$trigger
			.css('cursor', 'pointer')
			.bind('click',show);

	// Hover
	} else {
		// Trigger events
		conf.$trigger
			.css('cursor', 'default')
			.bind('mouseover', showTimer)
			.bind('mouseout', hideTimer);
	};

    // create the publish object to be returned

        conf.publish.uid = conf.id,
        conf.publish.element = conf.element,
        conf.publish.type = "layer",
        conf.publish.content = (conf.content) ? conf.content : conf.ajax,
        conf.publish.show = function(event){ return show(event, conf) },
        conf.publish.hide = function(event){ return hide(event, conf) },
        conf.publish.position = function(event){return position(event) }

	return conf.publish;
    
};
/**
 *	@class Modal. Create and manage modal windows
 *  @requires: floats.
 *	@return Public Object.
 */

ui.modal = function(conf){
	var that = ui.floats(); // Inheritance
	
	// Global configuration
	conf.$trigger = $(conf.element);
	conf.closeButton = true;
	conf.classes = 'box';
	conf.position = {
		fixed:true
	};
	conf.publish = that.publish;
			
	
	// Methods Privates
	var show = function(event){
		dimmer.on();
		that.show(event, conf);
		$('.ch-modal .btn.close, .closeModal').bind('click', hide);
		conf.$trigger.blur();
        
        // return publish object
        return conf.publish;        
	};

	var hide = function(event){
		dimmer.off();
		that.hide(event, conf);

        // return publish object
        return conf.publish;
	};
	
	var position = function(event){
		ui.positioner(conf.position);
		
		// return publish object
		return conf.publish;
	}

	// Dimmer
	var dimmer = {
		on:function(){
			$('<div>').bind('click', hide).addClass('ch-dimmer').css({height:$(window).height(), display:'block', zIndex:ui.utils.zIndex++}).hide().appendTo('body').fadeIn();
			/*ui.positioner({
				element: $('.ch-dimmer'),
				fixed: true,
				points: 'lt lt'
			});*/
			//$('.ch-dimmer').fadeIn();
		},
		off:function(){
			$('div.ch-dimmer').fadeOut('normal', function(){ $(this).remove(); });
		}
	};
	

	// Events
	conf.$trigger
		.css('cursor', 'pointer')
		.bind('click', show);
		
        // create the publish object to be returned
        conf.publish.uid = conf.id,
        conf.publish.element = conf.element,
        conf.publish.type = "modal",
        conf.publish.content = (conf.content) ? conf.content : ((conf.ajax === true) ? (conf.$trigger.attr('href') || conf.$trigger.parents('form').attr('action')) : conf.ajax),
        conf.publish.show = function(event){ return show(event) },
        conf.publish.hide = function(event){ return hide(event) },
        conf.publish.position = function(event){return position(event) }

	return conf.publish;

};
/**
 *	Tabs Navigator
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.tabNavigator = function(conf){

    var that = ui.controllers();
    
    conf.publish = that.publish;

	var $triggers = $(conf.element).children(':first').find('a');
	var $htmlContent = $(conf.element).children(':first').next();

	// Global configuration
	$(conf.element).addClass('ch-tabNavigator');
	$(conf.element).children(':first').addClass('ch-tabNavigator-triggers');
	$triggers.addClass('ch-tabNavigator-trigger');
	$htmlContent.addClass('ch-tabNavigator-content box');

	// Starts (Mother is pregnant, and her children born)
	$.each($triggers, function(i, e){
		that.children.push(ui.tab(i, e, conf));
	});
    
    // TODO: Normalizar las nomenclaturas de métodos, "show" debería ser "select"
	var show = function(event, tab){
		//ui.instances.tabNavigator[conf.instance].tabs[tab].shoot(event);
		        
        that.children[tab].shoot(event);
        
        /* The potato is ready!!
		Use this to execute a specific tab on console (on h1 click)
		$('h1').click(function(event){
			ui.instances.tabNavigator[0].show(event, 2);
		});*/

        // return publish object
        return conf.publish; 
	};
    
    // create the publish object to be returned

        conf.publish.uid = conf.id,
        conf.publish.element = conf.element,
        conf.publish.type = "tabNavigator",
        conf.publish.tabs = that.children,
        conf.publish.select = function(tab){ return show($.Event(), tab) }
    
	return conf.publish;
};


/**
 *	Tab
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.tab = function(index, element, conf){
	var that = ui.navs(); // Inheritance
	var display = element.href.split('#');
	var $tabContent = $(element).parents('.ch-tabNavigator').find('#' + display[1]);

	// Global configuration
	that.conf = {
		name: 'tab',
		$trigger: $(element).addClass('ch-tabNavigator-trigger'),
		callbacks: conf.callbacks
	};

	var results = function(){
		
        // If there are a tabContent...
		if ( $tabContent.attr('id') ) {
			return $tabContent; 		
		// If tabContent doesn't exists        
		} else {
			// Set ajax configuration
			that.conf.ajax = true;
						
			// Create tabContent
			var w = $('<div>').attr('id', 'ch-tab' + index);
				w.hide().appendTo( that.conf.$trigger.parents('.ch-tabNavigator').find('.ch-tabNavigator-content') );
			return w;
		};
	};
	that.conf.$htmlContent = results();

	// Open first tab by default
	if(index == 0){
		that.status = true;
		that.conf.$trigger.addClass('on');
	};

	// Hide all closed tabs
	if(!that.status) that.conf.$htmlContent.hide();

	// Process show event
	that.shoot = function(event){
		that.prevent(event);
        
		var tabs = conf.publish.tabs; //ui.instances.tabNavigator[conf.id].tabs; // All my bros
		if(tabs[index].status) return; // Don't click me if I'm open

		// Hide my open bro
		$.each(tabs, function(i, e){
			if(e.status) e.hide(event, e.conf);
		});

		// Load my content if I'need an ajax request
		if(that.conf.$htmlContent.html() === '') that.conf.$htmlContent.html( that.loadContent(that.conf) );

		// Show me
		that.show(event, that.conf);
	};

	// Events
	that.conf.$trigger.bind('click', that.shoot);

	return that;
}
/**
 *	Tooltip
 *	@author 
 *	@Contructor
 *	@return An interface object
 *  @memberOf ui.Floats
 */

ui.tooltip = function(conf){
	var that = ui.floats(); // Inheritance

	conf.name = 'tooltip';
	conf.cone = true;
	conf.content = conf.element.title;	
	conf.visible = false;   	
   	conf.position = {
   		context: $(conf.element),
        offset: "0 10",
		points: "lt lb"
    }
	conf.publish = that.publish;

    var show = function(event) {
        $(conf.element).attr('title', ''); // IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
		that.show(event, conf);
        
        // return publish object
        return conf.publish;  
    }
	
    var hide = function(event) {
		$(conf.element).attr('title', conf.content);
		that.hide(event, conf);

        // return publish object
        return conf.publish;
    }
    
    var position = function(event){
		ui.positioner(conf.position);
		
		return conf.publish;
	}
            	
	conf.$trigger = $(conf.element)
		.css('cursor', 'default')
		.bind('mouseenter', show)
		.bind('mouseleave', hide);
    
    // create the publish object to be returned

        conf.publish.uid = conf.id,
        conf.publish.element = conf.element,
        conf.publish.type = "tooltip",
        conf.publish.content = conf.content,
        conf.publish.show = function(event){ return show(event, conf) },
        conf.publish.hide = function(event){ return hide(event, conf) },
        conf.publish.position = function(event){return position(event) }
        
	return that.publish;
};
/**
 *	@Interface String validations
 *	@return An interface object
 */

ui.string = function(conf) {

    /**
	 *  Override Watcher Configuration
	 */
	// Add validation types
	conf.types = "text,email,url,minLength,maxLength";
	// Redefine Helper's reference;
	conf.reference = $(conf.element);
	// Conditions map TODO: uppercase, lowercase, varchar
	/*
	             Awful performance!!!!!!
	       TODO: The regex object process all conditions, we need to refactor this pattern
              validation {
                  pattern: /w/
              };
              validation {
                  expresion: {
                      value1: value.length,
                      operator: >=,
                      value2: parseInt(conf.minLength)   
                  }
              };
	*/
	conf.checkConditions = function(type){
		var value = $(conf.element).val();
		var regex = {
			text:		(/^([a-zA-Z\s]+)$/m).test(value),
			email:		(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i).test(value),
//			url:		(/^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([\w]+)(.[\w]+){1,2}$/).test(value), 
			url:        (/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/).test(value),
			minLength:	value.length >= parseInt(that.validations.minLength),
			maxLength:	value.length <= parseInt(that.validations.maxLength)
		};
		return regex[type];
	};
    // Messages
	conf.defaultMessages = {
		text:		"Usa sólo letras.",
		email:		"Usa el formato nombre@ejemplo.com.",
		url:		"Usa el formato http://www.sitio.com.",
		minLength:	"Ingresa al menos " + conf.minLength + " caracteres.",
		maxLength:	"El máximo de caracteres es " + conf.maxLength + "."
	};
	
	conf.messages = {}
	
    var types = conf.types.split(",");
	for (var i = 0, j = types.length; i < j; i ++) {
		for (var val in conf) {
			if (types[i] == val) {
				conf.messages[val] = conf.defaultMessages[val];
			};
		};
	};
	
    /**
	 *  Extend Watcher
	 */
	var that = ui.watcher(conf);

    /**
	 *  Public Object
	 */
    return that.publish;
};


/**
 *	@Interface Email validations
 *	@return An interface object
 */
 
ui.email = function(conf) {
    
    conf = conf || {};
    
    conf.email = true;

    return ui.string(conf);
    
}

ui.factory({ component: 'email' });

/**
 *	@Interface URL validations
 *	@return An interface object
 */
 
ui.url = function(conf) {
    
    conf = conf || {};
    
    conf.url = true;

    return ui.string(conf);
    
}

ui.factory({ component: 'url' });

/**
 *	@Interface MinLength validations
 *	@return An interface object
 */
 
ui.minLength = function(conf) {
    
    conf = conf || {};
    
    conf.minLength = conf.value;

    return ui.string(conf);
    
}

ui.factory({ component: 'minLength' });

/**
 *	@Interface MaxLength validations
 *	@return An interface object
 */
 
ui.maxLength = function(conf) {
    
    conf = conf || {};
    
    conf.maxLength = conf.value;

    return ui.string(conf);
    
}

ui.factory({ component: 'maxLength' });
/**
 *	Number validations
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.number = function(conf){
	
    /**
	 *  Override Watcher Configuration
	 */
	// Validation types
	conf.types = "number,min,max";
	// Helper
	conf.reference = $(conf.element);
	// Conditions map TODO: float
	conf.checkConditions = function(type){
		var value = $(conf.element).val();
		var regex = {
			number:	!isNaN(value), // value.match(/^\d+$/m),
			min:	value >= parseInt(that.validations.min),
			max:	value <= parseInt(that.validations.max)
		};
		return regex[type];
	};
    // Messages
	conf.defaultMessages = {
		number:	"Usa sólo números.",
		min:	"La cantidad mínima es " + conf.min + ".",
		max:	"La cantidad máxima es " + conf.max + "."
	};
	
	conf.messages = {}
	
    var types = conf.types.split(",");
	for (var i = 0, j = types.length; i < j; i ++) {
		for (var val in conf) {
			if (types[i] == val) {
				conf.messages[val] = conf.defaultMessages[val];
			};
		};
	};
	
    /**
	 *  Extend Watcher
	 */
 	var that = ui.watcher(conf);
	
    /**
	 *  Public Object
	 */
	return that.publish;
};


/**
 *	@Interface Min validations
 *	@return An interface object
 */
 
ui.min = function(conf) {
    
    conf = conf || {};
    
    conf.min = conf.value;

    return ui.number(conf);
    
}

ui.factory({ component: 'min' });

/**
 *	@Interface Max validations
 *	@return An interface object
 */
 
ui.max = function(conf) {
    
    conf = conf || {};
    
    conf.max = conf.value;

    return ui.number(conf);
    
}

ui.factory({ component: 'max' });

/**
 *	Required validations
 *  @Extends Watcher
 *	@Interface
 */

ui.required = function(conf){

    /**
	 *  Override Watcher Configuration
	 */
	// Add validation types
	conf.types = "required";
    // Define the conditions of this interface
	// Conditions absorvs that.isEmpty in checkConditions for compatibility
	conf.checkConditions = function(type) { // We recibe "type" arguemnt, but we don't care
		return !that.isEmpty(conf);
	}
	// Messages
	conf.messages = {
		required: "Campo requerido."
	};	
	
    // Process Messages
//    if (that.messages) that.messages = that.processMessages(conf);
	
    /**
	 *  Extend Watcher
	 */
 	var that = ui.watcher(conf);

    /**
	 *  Public Object
	 */
	return that.publish;
};
/**
 *	Helper
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.helper = function(conf){
	var that = ui.floats(); // Inheritance

	// Global configuration
	var _conf = {};
	_conf.name = "helper";
	_conf.$trigger = $(conf.element),
	_conf.cone = true;
	_conf.classes = "helper" + conf.id,
	_conf.visible = false;
	_conf.position = {};
	_conf.position.context = conf.reference;
	_conf.position.offset = "15 0";
	_conf.position.points = "lt rt";

	var hide = function(){
		$('.helper' + conf.id).remove();
		_conf.visible = false;
		that.callbacks(conf, 'hide');
	};
	
	var show = function(text){
		_conf.content = '<p><span class="ico error">Error: </span>' + text + '</p>';		
		that.show($.Event(), _conf);
	};

	return { show: function(text){ show(text) }, hide: hide };
};
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
	// Are there action and submit type?
	if ($(conf.element).find(":submit").length == 0 || $(conf.element).attr('action') == "" ){ 
		 alert("Forms fatal error: The <input type=submit> is missing, or need to define a action attribute on the form tag.");
		 return;
	};
	
	if (ui.instances.forms) {
	
	if(ui.instances.forms.length > 0){ // Is there forms in map instances?
		for(var i = 0, j = ui.instances.forms.length; i < j; i ++){
			if(ui.instances.forms[i].element === conf.element){
				return { 
                    exists: true, 
                    object: ui.instances.forms[i]
                };
			};
		};
	};
	}
	
	// Start new forms
	var that = ui.controllers(); // Inheritance
	var status = false;

	// patch exists because the components need a trigger
	$(conf.element).bind('submit', function(event){ that.prevent(event); });
	$(conf.element).find(":submit").unbind('click'); // Delete all click handlers asociated to submit button >NATAN: Why?

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
	var checkStatus = function(){
		// Check status of my childrens
		for(var i = 0, j = that.children.length; i < j; i ++){
			// Status error (cut the flow)
			if( !that.children[i].status ){				
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
	};
	
	var validate = function(event){
		that.prevent(event);
		
		// Shoot validations
		for(var i = 0, j = that.children.length; i < j; i ++){
			that.children[i].validate();
		};
		
		checkStatus();
		
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
        type: "forms",
        children: that.children,
		validate: function(event){ return validate(event) },
		checkStatus: function(event){ return checkStatus(event) },
		submit: function(event){ return submit(event) },
		clear: function(event){ return clear(event) }
    }

	return conf.publish;
};/**
 *	Viewer
 *	@author
 *	@Contructor
 *	@return An interface object
 */
ui.viewer = function(conf){
	var that = ui.controllers(); // Inheritance
	
	/**
	 * 	Viewer
	 */
	var $viewer = $(conf.element);
	$viewer.addClass("ch-viewer"); // Create magnifying glass

	/**
	 * 	Modal of Viewer
	 */
	var viewerModal = {};
	viewerModal.carouselStruct = $(conf.element).find("ul").clone().addClass("carousel");	
	viewerModal.carouselStruct.find("img").each(function(i, e){
		$(e).attr("src", $(e).parent().attr("href")) // Image source change
			.unwrap(); // Link deletion
	});
	viewerModal.showContent = function(){
		$(".ch-viewer-modal-content").parent().addClass("ch-viewer-modal");
		$(".ch-viewer-modal-content").html( viewerModal.carouselStruct );
		that.children[2] = viewerModal.carousel = $(".ch-viewer-modal-content").carousel({ pager: true });
		$(".ch-viewer-modal-content .ch-carousel-content").css("left",0); // Reset position
		viewerModal.carousel.select(thumbnails.selected);
		viewerModal.modal.position();
		viewerModal.carouselStruct.find("a").each(function(i, e){			
		});
		
	};
	viewerModal.hideContent = function(){		
		$("ch-viewer-modal").remove();
		for(var i = 0, j = ui.instances.carousel.length; i < j; i ++){ // TODO pasar al object			
			if(ui.instances.carousel[i].element === viewerModal.carousel.element){
				ui.instances.carousel.splice(i,1);
				return;
			} 
		};		
	};
	that.children[1] = viewerModal.modal = $("<a>").modal({ //TODO iniciar componentes sin trigger
		content: "<div class=\"ch-viewer-modal-content\">",
		callbacks: {
			show: viewerModal.showContent,
			hide: viewerModal.hideContent
		}
	});
		
	
	/**
	 * 	Showcase
	 */
	var showcase = {};
	showcase.wrapper = $("<div>").addClass("ch-viewer-display");
	showcase.display = $(conf.element).children(":first");
	$viewer.append( showcase.wrapper.append( showcase.display ).append("<div class=\"ch-lens\">") );
	
	showcase.children = showcase.display.find("a");
	showcase.itemWidth = $(showcase.children[0]).parent().outerWidth();
	
	showcase.lens = $viewer.find(".ch-lens") // Get magnifying glass
	ui.positioner({
        element: $(showcase.lens),
        context: $(".ch-viewer li"),
        offset: "-20px 0"
	});	
	showcase.lens.bind("click", function(event){
		viewerModal.modal.show();
	});
	
	showcase.wrapper
		// Show magnifying glass
		.bind("mouseover", function(){
			showcase.lens.fadeIn(400);
		})
		// Hide magnifying glass
		.bind("mouseleave", function(){
			showcase.lens.fadeOut(400);
		});
	
	// Set content visual config
	showcase.display
		.css('width', showcase.children.length * showcase.itemWidth)
		.addClass("ch-viewer-content")
		
	
	// Showcase functionality
	showcase.children.bind("click", function(event){
		that.prevent(event);
		viewerModal.modal.show();
	});
	
	
	/**
	 * 	Thumbnails
	 */
	var thumbnails = {};
	thumbnails.selected = 0;
	thumbnails.wrapper = $("<div>").addClass("ch-viewer-triggers");
	
	// Create carousel structure
	$viewer.append( thumbnails.wrapper.append( $viewer.find("ul").clone().addClass("carousel") ) );
		 
	thumbnails.children = thumbnails.wrapper.find("a");
	
	// Thumbnails behavior
	thumbnails.children.find("img").each(function(i, e){
		// Change image parameter (thumbnail size)
		$(e).attr("src", $(e).attr("src").replace("v=V", "v=M"));
		
		// Thumbnail link click
		$(e).parent().bind("click", function(event){
			that.prevent(event);
			select(i);
		});
	});
	// Inits carousel
	that.children[0] = thumbnails.carousel = thumbnails.wrapper.carousel(); // TODO: guardar el carrousel dentro del viewer
	
	
	/**
	 * 	Methods
	 */
	var select = function(item){
		// Validation
		if(item > showcase.children.length-1 || item < 0 || isNaN(item)){
			alert("Error: Expected to find a number between 0 and " + (showcase.children.length - 1) + ".");
			return conf.publish;
		};
		
		var visibles = thumbnails.carousel.getSteps(); // Items per page
		var page = thumbnails.carousel.getPage(); // Current page
		var nextPage = ~~(item / visibles) + 1; // Page of "item"
		
		// Visual config		
		$(thumbnails.children[thumbnails.selected]).removeClass("on");
		$(thumbnails.children[item]).addClass("on");
		
		// Content movement
		showcase.display.animate({ left: -item * showcase.itemWidth });// Reposition content
		// Trigger movement
		if (thumbnails.selected < visibles && item >= visibles && nextPage > page) {
			thumbnails.carousel.next();
		}else if (thumbnails.selected >= visibles && item < visibles && nextPage < page ) {
			thumbnails.carousel.prev();
		};
		
		// Selected
		thumbnails.selected = item;
		
		// Return public object
		return conf.publish;
	};
	
	
	// Public object
    conf.publish = {
		uid: conf.id,
		element: conf.element,
		type: "viewer",
		children: that.children,
		select: function(i){ return select(i); }
    }
	
	// Default behavior
	select(0);
	
	return conf.publish;
};

ui.init();
})(jQuery);