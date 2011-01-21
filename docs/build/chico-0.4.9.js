/**
  * Chico-UI
  * Packer-o-matic
  * Like the pizza delivery service: "Les than 100 milisecons delivery guarantee!"
  * @components: core, positioner, object, floats, navs, controllers, watcher, carousel, dropdown, layer, modal, tabNavigator, tooltip, string, number, required, helper, forms, viewer, chat, expando
  * @version 0.4
  * @autor Chico Team <chico@mercadolibre.com>
  *
  * @based on:
  * JSMin
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

    version: "0.4.9",

    components: "carousel,dropdown,layer,modal,tabNavigator,tooltip,string,number,required,helper,forms,viewer,chat,expando",

    internals: "positioner,object,floats,navs,controllers,watcher",

    instances: {},
    
    features: {},
 	
    init: function() { 
        // unmark the no-js flag on html tag
        $("html").removeClass("no-js");
        // check for browser support
		ui.features = ui.support();
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
	},
    
    events: {
        CHANGE_LAYOUT: "changeLayout"
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
            // Could be more than one argument
            var _arguments = arguments;

            that.each( function(i, e) {

                var conf = {};
                    conf.name = x;
                    conf.element = e;
                    conf.id = ui.utils.index++; // Global instantiation index
                
                // If argument is a number, join with the conf
                if (typeof options === "number") {
                    conf.value = options;
                    // Could come a messages as a second argument
                    if (_arguments[1]) {
                        conf.msg = _arguments[1];
                    }
                }
                
                if (typeof options === "string") { // This could be a message
                    conf.msg = options;
                }
                
                if (typeof options === "object") { 
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
                
                // Avoid mapping objects that already exists
				if (created.exists) {				
					// Return the inner object
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

	        var x = o.conf;

			//Set ajax config
			//setTimeout(function(){		
			$.ajax({
				url: x.ajaxUrl,
				type: x.ajaxType || 'GET',
				data: x.ajaxParams,
				cache: true,
				async: true,
				success: function(data, textStatus, xhr){
					x.$htmlContent.html( data ).fadeIn('fast', function(){ 
						if(x.callbacks && x.callbacks.contentLoad) x.callbacks.contentLoad(); 
					});
					if( x.position ) ui.positioner(x.position);
				},
				error: function(xhr, textStatus, errorThrown){
					data = (x.callbacks && x.callbacks.contentError) ? x.callbacks.contentError(xhr, textStatus, errorThrown) : "<p>Error on ajax call </p>";
					x.$htmlContent.html( data );
					if( x.position ) ui.positioner(x.position);
				}
			});
			//}, 25);
			
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
 *  Support
 */
 
ui.support = function() {
	
	// Based on: http://gist.github.com/373874
	// Verify that CSS3 transition is supported (or any of its browser-specific implementations)
	var transition = (function(){
		var thisBody = document.body || document.documentElement;
		var thisStyle = thisBody.style;

		return thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.OTransition !== undefined || thisStyle.transition !== undefined;
	})();
	
	return {
		transition: transition
		// gradient: gradient
	};
	
};
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
	var viewport;
    
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
 		var pageX;
 		var pageY;
 				
	 	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
		if (typeof window.innerWidth != "undefined") {
			viewport = window;
			width = viewport.innerWidth;
			height = viewport.innerHeight;
			pageX = viewport.pageXOffset;
			pageY = viewport.pageYOffset;
			
			left = 0 + offset_left + pageX;
			top = 0 + offset_top + pageY;
			bottom = height + pageY;
			right = width + pageX;
		
		// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
		// older versions of IE - viewport = document.getElementsByTagName('body')[0];
		} else if (typeof document.documentElement != "undefined" && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
			viewport = document.documentElement;
			width = viewport.clientWidth;
			height = viewport.clientHeight;
			pageX = viewport.scrollLeft;
			pageY = viewport.scrollTop;
			
			left = 0 + offset_left + pageX;
			top = 0 + offset_top + pageY;
			bottom = height + pageY;
			right = width + pageX; 
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
		// cache properties 
		var contextLeft = context.left;
		var contextTop = context.top;
		var contextWidth = context.width;
		var contextHeight = context.height;
		var elementWidth = element.outerWidth();
		var elementHeight = element.outerHeight();
		
		
		var xReferences = {
			ll: contextLeft,
			lr: contextLeft + contextWidth,
			rr: contextLeft + contextWidth - elementWidth,
			cc: contextLeft + contextWidth/2 - elementWidth/2
			// TODO: lc, rl, rc, cl, cr
		}
		
		// my_y and at_y values together
		var yReferences = {
			tt: contextTop,
			tb: contextTop + contextHeight,
			bt: contextTop - elementHeight,
			mm: contextTop + contextHeight/2 - elementHeight/2
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
		//var viewport = getViewport();
		
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
	var setPosition = function() {
		// Separate points config
        var splitted = o.points.split(" ");
        
        var unitPoints = {
        	my_x: splitted[0].slice(0,1),
        	my_y: splitted[0].slice(1,2),
        	at_x: splitted[1].slice(0,1),
        	at_y: splitted[1].slice(1,2)
        }
        
		var styles = calculatePoints(o.points, unitPoints);
		
		element
			.css({
				left: styles.left,
				top: styles.top
			})
			.removeClass( "ch-top ch-left ch-down ch-right ch-down-right ch-top-right" )
			.addClass( "ch-" + styles.direction );

	};	

	// Get context
	var getContext = function(){
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
			context = viewport;
		};
		
		return context;
	};
	
	// Set element position on resize
    var initPosition = function(){  	
	    viewport = getViewport();
	    context = getContext();
	    setPosition();
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
			//if( conf.ajax && (conf.content || conf.msg) ) { alert('UI: "Ajax" and "Content" can\'t live together.'); return; };

			if( conf.ajax === true){
				
				// Load URL from href or form action
				conf.ajaxUrl = conf.$trigger.attr('href') || conf.$trigger.parents('form').attr('action');
				
				// Ajax parameters
				conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax
				
				// If trigger is a form button...
				if(conf.$trigger.attr('type') == 'submit'){
					conf.ajaxType = conf.$trigger.parents('form').attr('method') || 'GET';
					var serialized = conf.$trigger.parents('form').serialize();
					conf.ajaxParams = conf.ajaxParams + ((serialized != '') ? '&' + serialized : '');
				};

				// Returns ajax results
				conf.$htmlContent.html('<div class="loading"></div>');
				return ui.get({method:"content", conf:conf});
				
			}else if( conf.ajax || (conf.msg && conf.msg.match(/(?:(?:(https?|file):\/\/)([^\/]+)(\/(?:[^\s])+)?)|(\/(?:[^\s])+)/g)) ){
				// Set url
				conf.ajaxUrl = conf.ajax || conf.msg;

				// Ajax parameters
				conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax

				// Returns ajax results
				conf.$htmlContent.html('<div class="loading"></div>');
				return ui.get({method:"content", conf:conf});
				
			}else{
				
				var content = conf.content || conf.msg;
				return ($(content).length > 0) ? $(content).clone().show() : content;
				
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
/*

callbacks:{
	show:,
	hide:,
	contentLoad:,
	contentError:
}
	
*/ 
ui.floats = function() {
    
	var that = ui.object(); // Inheritance	

	var createClose = function(conf) {
		$('<p class="btn ch-close">x</p>').bind('click', function(event) {
			that.hide(event, conf);
		}).prependTo(conf.$htmlContentainer);
	};

	var createCone = function(conf) {
		$('<div class="ch-cone"></div>').prependTo(conf.$htmlContentainer);
	};

	that.show = function(event, conf) {
		that.prevent(event);
		
		if(conf.visible) return;
		
		conf.$htmlContentainer = $('<div class="ch-' + conf.name + '"><div class="ch-'+conf.name+'-content"></div></div>');
		conf.$htmlContent = conf.$htmlContentainer.find(".ch-"+conf.name+"-content");
		
	
		// Visual configuration
		if( conf.closeButton ) createClose(conf);
		if( conf.cone ) createCone(conf);
		if( conf.classes ) conf.$htmlContentainer.addClass(conf.classes);
		if( conf.hasOwnProperty("width") ) conf.$htmlContentainer.css("width", conf.width);
		if( conf.hasOwnProperty("height") ) conf.$htmlContentainer.css("height", conf.height);
		
		// Show
		conf.$htmlContentainer
			.hide()
			.css("z-index", ui.utils.zIndex++)
			.appendTo("body")
			.fadeIn('fast', function(){ that.callbacks(conf, 'show'); });

		//Load content
		if( conf.ajax || (conf.msg && conf.msg.match(/(?:(?:(https?|file):\/\/)([^\/]+)(\/(?:[^\s])+)?)|(\/(?:[^\s])+)/g)) ){
			that.loadContent(conf);
		}else{
			conf.$htmlContent
				.html( that.loadContent(conf) )
				.fadeIn('fast', function(){ that.callbacks(conf, 'contentLoad'); });
		};
		
		conf.visible = true;
				
		// Positioner
		conf.position.element = conf.$htmlContentainer;
		ui.positioner(conf.position);

	};

	that.hide = function(event, conf){
		that.prevent(event);
		
		if(!conf.visible) return;
		
		conf.$htmlContentainer.fadeOut('fast', function(event){ $(this).remove(); });	
		
		// Hide
		conf.visible = false;
		that.callbacks(conf, 'hide');
	};
	
	that.position = function(o, conf){
		
		switch(typeof o){
			case "object":
				conf.position.context = o.context || conf.position.context;
				conf.position.points = o.points || conf.position.points;
				conf.position.offset = o.offset || conf.position.offset;				
				conf.position.fixed = o.fixed || conf.position.fixed;
				
				ui.positioner(conf.position);
				return conf.publish;
			break;
			
			case "string":
				if(o!="refresh"){
					alert("ChicoUI error: position() expected to find \"refresh\" parameter.");
				};
				
				ui.positioner(conf.position);
				return conf.publish;   			
			break;
			
			case "undefined":
				return conf.position;
			break;
		};
		
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
		conf.$trigger.addClass('ch-' + conf.name + '-on');
		conf.$htmlContent.show();
		
		that.callbacks(conf, 'show');
	};
	
	that.hide = function(event, conf){
		that.prevent(event);
		that.status = false;
		conf.$trigger.removeClass('ch-' + conf.name + '-on');
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
	 *  @Â Private methods
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
       
        // Validate each type of validation
		for (var type in that.validations) {
			// Status error (stop the flow)

			var condition = that.conditions[type];
            var value = $(conf.element).val();
            var gotError = true;
            
            if (condition.patt) {
                gotError = condition.patt.test(value);
            };
            
            if (condition.expr) {
                gotError = condition.expr((type.indexOf("Length")>-1) ? value.length : value, that.validations[type]);
            };
            
            if (condition.func) {
                gotError = !that.isEmpty(conf); //condition.func.apply(value);
            };
                    
			if (!gotError) {
    			// Field error style
				$(conf.element).addClass("error");
				// With previous error
				if (!conf.status) { that.helper.hide(); };
				// Show helper with message
				that.helper.show( (that.messages[type]) ? that.messages[type] : that.defaultMessages[type] ); 
				// Status false
				that.publish.status = that.status =  conf.status = false;
				
				var revalidate = function() {
                        that.validate(conf);
                        that.parent.checkStatus();  // Check everthing?
			    }
			    
				var event = (conf.tag == 'OPTIONS' || conf.tag == 'SELECT') ? "change" : "blur";
				
				$(conf.element).one(event, revalidate); // Add blur event only one time
                    
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
    	uid: conf.id,
		element: conf.element,
		type: "watcher",
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
        refresh: function(){ 
            return that.helper.position("refresh");
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
	var htmlElementMargin = (ui.utils.html.hasClass("ie6")) ? 21 : 20; // IE needs 1px more
	var extraWidth = (ui.utils.html.hasClass("ie6")) ? conf.$htmlContent.children().outerWidth() : 0;
	var htmlContentWidth = conf.$htmlContent.children().size() * (conf.$htmlContent.children().outerWidth() + htmlElementMargin) + extraWidth;
	
	// UL configuration
	conf.$htmlContent
		.wrap($('<div>').addClass('ch-mask'))//gracias al que esta abajo puedo leer el $mask.width()
		.css('width', htmlContentWidth);
		
	// Mask Object	
	var $mask = conf.$trigger.find('.ch-mask');

	// Steps = (width - marginMask / elementWidth + elementMargin) 70 = total margin (see css)
	var steps = ~~( (conf.$trigger.width() - 70) / (conf.$htmlContent.children().outerWidth() + 20));
		steps = (steps == 0) ? 1 : steps;	
	var totalPages = Math.ceil(conf.$htmlContent.children().size() / steps);

	// Move to... (steps in pixels)
	var moveTo = (conf.$htmlContent.children().outerWidth() + 20) * steps;
	// Mask configuration
	var margin = ($mask.width()-moveTo) / 2;
	$mask.width( moveTo ).height( conf.$htmlContent.children().outerHeight() + 2 ); // +2 for content with border
	//if(conf.arrows != false) $mask.css('marginLeft', margin);
	
	//En IE6 al htmlContentWidth por algun motivo se le suma el doble del width de un elemento (li) y calcula mal el next()
	if($.browser.msie && $.browser.version == '6.0') htmlContentWidth = htmlContentWidth - (conf.$htmlContent.children().outerWidth()*2);
	
	
	// Buttons
	var buttons = {
		prev: {
			$element: $('<p class="ch-prev">Previous</p>').bind('click', function(){ move("prev", 1) }).css('top', (conf.$trigger.outerHeight() - 22) / 2), // 22 = button height
			on: function(){ buttons.prev.$element.addClass("ch-prev-on") },
			off: function(){ buttons.prev.$element.removeClass("ch-prev-on") }
		},
		next: {
			$element: $('<p class="ch-next">Next</p>').bind('click', function(){ move("next", 1) }).css('top', (conf.$trigger.outerHeight() - 22) / 2), // 22 = button height
			on: function(){ buttons.next.$element.addClass("ch-next-on") },
			off: function(){ buttons.next.$element.removeClass("ch-next-on") }
		}
	};
	
	// Buttons behavior
	conf.$trigger.prepend( buttons.prev.$element ).append( buttons.next.$element ); // Append prev and next buttons
	if (htmlContentWidth > $mask.width()) buttons.next.on(); // Activate Next button if items amount is over carousel size
	
	
	var move = function(direction, distance){
		var movement;
		
		switch(direction){
			case "prev":
				// Validation
				if(status || (page - distance) <= 0) return;
				
				// Next move
				page -= distance;
				
				// Css object
				movement = conf.$htmlContent.position().left + (moveTo * distance);
				
				// Buttons behavior
				if(page == 1) buttons.prev.off();
				buttons.next.on();
			break;
			case "next":
				// Validation
				if(status || (page + distance) > totalPages) return;
				
				// Next move
				page += distance;
				
				// Css object
				movement = conf.$htmlContent.position().left - (moveTo * distance);
				
				// Buttons behavior
				if(page == totalPages) buttons.next.off();
				buttons.prev.on();
			break;
		};
				
		// Status moving
		status = true;
		
		// Function executed after movement
		var afterMove = function(){
			status = false;
			
			// Pager behavior
			if (conf.pager) {
				$(".ch-pager li").removeClass("ch-pager-on");
				$(".ch-pager li:nth-child(" + page + ")").addClass("ch-pager-on");
			};

			// Callbacks
			that.callbacks(conf, direction);
		};
		
		// Have CSS3 Transitions feature?
		if (ui.features.transition) {
			
			// Css movement
			conf.$htmlContent.css({ left: movement });
			
			// Callback
			afterMove();
			
		// Ok, let JQuery do the magic...
		} else {
			conf.$htmlContent.animate({ left: movement }, afterMove);
		};
		
		// Returns publish object
		return conf.publish;
	};
	
	
	var select = function(item){
		var itemPage = ~~(item / steps) + 1; // Page of "item"
		
		// Move right
		if(itemPage > page){
			move("next", itemPage - page);
		// Move left
		}else if(itemPage < page){
	        move("prev", page - itemPage);
		};
		
		if (conf.pager) {
			$(".ch-pager li").removeClass("ch-pager-on");
			$(".ch-pager li:nth-child(" + page + ")").addClass("ch-pager-on");
		}
		
		// Callback
		that.callbacks(conf, 'select');
		
		// return publish object
	    return conf.publish;
	};
	
	
	var pager = function(){
		var list = $("<ul class=\"ch-pager\">");
		var thumbs = [];
		
		// Create each mini thumb
		for(var i = 1, j = totalPages + 1; i < j; i += 1){
			thumbs.push("<li>");
			thumbs.push(i);
			thumbs.push("</li>");
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
	};
	
	// Create pager if it was configured
	if (conf.pager) pager();
	
	
    // Create the publish object to be returned
    conf.publish.uid = conf.id;
    conf.publish.element = conf.element;
    conf.publish.type = "carousel";
    conf.publish.getSteps = function() { return steps; };
    conf.publish.getPage = function() { return page; };
    conf.publish.select = function(item) { return select(item); };
    conf.publish.next = function(){ return move("next", 1); };
    conf.publish.prev = function(){ return move("prev", 1); };
 
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

	var skin;
	// Primary or secondary behavior
	if($(conf.element).hasClass("ch-secondary")){
		$(conf.element).addClass('ch-dropdown');
		skin = "secondary";
	}else{
		$(conf.element).addClass("ch-dropdown ch-primary");
		skin = "primary";
	};
	
	// Global configuration
	conf.$trigger = $(conf.element).children(':first');
	conf.$htmlContent = conf.$trigger.next();
    conf.publish = that.publish;
	
	// Private methods
	var show = function(event){
		that.prevent(event);
		// Toggle
		if(that.status){
			return hide();
		};
		
		// Reset all dropdowns
		$(ui.instances.dropdown).each(function(i, e){ e.hide() });
		 
        // Show menu
		conf.$htmlContent.css('z-index', ui.utils.zIndex++);		
		that.show(event, conf);
		
		// Secondary behavior
		if(skin == "secondary"){
			conf.$trigger.css('z-index', ui.utils.zIndex++); // Z-index of trigger over content
			$(conf.element).addClass("ch-dropdown-on"); // Container ON
		};
	
		// Document events
		ui.utils.document.one('click', function(event){
			that.prevent(event);
            hide();
		});
		
        return conf.publish; // Returns publish object
    };
	
    var hide = function(event){
    	that.prevent(event);
    	
    	// Secondary behavior
		if(skin == "secondary"){
			$(conf.element).removeClass("ch-dropdown-on"); // Container OFF
		};
        that.hide(event, conf);
        
        return conf.publish; // Returns publish object
    };
    
	// Trigger
	conf.$trigger
		.bind('click', function(event){
			that.prevent(event);			
			// Show dropdown
			show();
		})
		.addClass('ch-dropdown-trigger')
		.append('<span class="ch-down">&raquo;</span>');
	
	
	// Content
	conf.$htmlContent
		.bind('click', function(event){ event.stopPropagation() })
		.addClass('ch-dropdown-content')
		// Close when click an option
		.find('a').bind('click', function(){ hide() });
	

    // Create the publish object to be returned
    conf.publish.uid = conf.id;
    conf.publish.element = conf.element;
    conf.publish.type = "dropdown";
    conf.publish.show = function(){ return show() };
    conf.publish.hide = function(){ return hide() };

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
	var showTimer = function(event){ st = setTimeout(function(event){ show(event) }, showTime) };
	var hideTimer = function(event){ ht = setTimeout(function(event){ hide(event) }, hideTime) };
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

    var show = function(event) {

		that.show(event, conf);	

        if (conf.event === "click") {

            $('.ch-layer').bind('click', function(event){ event.stopPropagation() });

            // Document events
            $(document).one('click', function(event) {
                that.hide(event, conf);
            });
        }
        
        return conf.publish; // Returns publish object
    }

    var hide = function(event) {
        that.hide(event, conf);
        return conf.publish; // Returns publish object
    }

	// Click
	if(conf.event === 'click') {
		// Local configuration
		conf.closeButton = true;

		// Trigger events
		conf.$trigger
			.css('cursor', 'pointer')
			.bind('click', show);

	// Hover
	} else {
		// Trigger events
		conf.$trigger
			.css('cursor', 'default')
			.bind('mouseover', showTimer)
			.bind('mouseout', hideTimer);
	};

    // Create the publish object to be returned
    conf.publish.uid = conf.id;
    conf.publish.element = conf.element;
    conf.publish.type = "layer";
    conf.publish.content = (conf.content) ? conf.content : conf.ajax;
    conf.publish.show = function(){ return show($.Event()) };
    conf.publish.hide = function(){ return hide($.Event()) };
    conf.publish.position = function(o){ return that.position(o, conf) };

    // Fix: change layout problem
    ui.utils.body.bind(ui.events.CHANGE_LAYOUT, function(){ that.position("refresh", conf) });

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
	 
	if( !conf.hasOwnProperty("ajax") && !conf.hasOwnProperty("content") && !conf.hasOwnProperty("msg") ) conf.ajax = true; //Default	
	conf.publish = that.publish;
	
	// Privated methods
	var show = function(event){
		dimmer.on();
		that.show(event, conf);
		ui.positioner(conf.position);
		$('.ch-modal .btn.ch-close, .closeModal').bind('click', hide);
		conf.$trigger.blur();

        return conf.publish; // Returns publish object
	};

	var hide = function(event){
		dimmer.off();
		that.hide(event, conf);
        return conf.publish; // Returns publish object
	};
	
	var position = function(){
		ui.positioner(conf.position);
		return conf.publish; // Returns publish object
	}


	// Dimmer
	var dimmer = {
		on: function(){ //TODO: posicionar el dimmer con el positioner
			$('<div>').bind('click', hide).addClass('ch-dimmer').css({height:$(window).height(), display:'block', zIndex:ui.utils.zIndex++}).hide().appendTo('body').fadeIn();
		},
		off: function(){
			$('div.ch-dimmer').fadeOut('normal', function(){ $(this).remove(); });
		}
	};
	

	// Events
	conf.$trigger
		.css('cursor', 'pointer')
		.bind('click', show);
	
	
    // Create the publish object to be returned
    conf.publish.uid = conf.id;
    conf.publish.element = conf.element;
    conf.publish.type = "modal";
    conf.publish.content = (conf.content) ? conf.content : ((conf.ajax === true) ? (conf.$trigger.attr('href') || conf.$trigger.parents('form').attr('action')) : conf.ajax);
    conf.publish.show = function(){ return show($.Event()) };
    conf.publish.hide = function(){ return hide($.Event()) };
    conf.publish.position = function(o){ return that.position(o, conf) };

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
    
    // TODO: Normalizar las nomenclaturas de mÃ©todos, "show" deberÃ­a ser "select"
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
	conf.publish.uid = conf.id;
	conf.publish.element = conf.element;
	conf.publish.type = "tabNavigator";
	conf.publish.tabs = that.children;
	conf.publish.select = function(tab){ return show($.Event(), tab) };
      	
		
	//Default: Load hash tab or Open first tab
    var hash = window.location.hash.replace( "#!", "" );
	for( var i = that.children.length; i--; ){
		if( that.children[i].conf.$htmlContent.attr("id") === hash ){
			show($.Event(), i);
			break;
		} else {
			show($.Event(), 0);		
		};		  
	};	

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
	that.conf.$trigger.bind('click', function(event){
		that.shoot(event);
		
		//Change location hash
		window.location.hash = "#!" + that.conf.$htmlContent.attr("id");
	});


	return that;
}/**
 *	Tooltip
 *	@author 
 *	@Contructor
 *	@return An interface object
 *  @memberOf ui.Floats
 */

ui.tooltip = function(conf){
	var that = ui.floats(); // Inheritance

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
        
        return conf.publish; // Returns publish object
    }
	
    var hide = function(event) {
		$(conf.element).attr('title', conf.content);
		that.hide(event, conf);
        return conf.publish; // Returns publish object
    }
    
    var position = function(event){
		ui.positioner(conf.position);
		return conf.publish; // Returns publish object
	}
            	
	conf.$trigger = $(conf.element)
		.css('cursor', 'default')
		.bind('mouseenter', show)
		.bind('mouseleave', hide);
    
    // Create the publish object to be returned
    conf.publish.uid = conf.id;
    conf.publish.element = conf.element;
    conf.publish.type = "tooltip";
    conf.publish.content = conf.content;
    conf.publish.show = function(){ return show($.Event()) };
    conf.publish.hide = function(){ return hide($.Event()) };
    conf.publish.position = function(o){ return that.position(o, conf) };

    // Fix: change layout problem
    ui.utils.body.bind(ui.events.CHANGE_LAYOUT, function(){ that.position("refresh", conf) });

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
    conf.conditions = {
        text:       { patt: /^([a-zA-Z\s]+)$/ },
        email:      { patt: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/ },
        url:        { patt: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ },
        minLength:  { expr: function(a,b) { return a >= b } },
        maxLength:  { expr: function(a,b) { return a <= b } }
    }
	
    // Messages
	conf.defaultMessages = {
		text:		"Usa sÃ³lo letras.",
		email:		"Usa el formato nombre@ejemplo.com.",
		url:		"Usa el formato http://www.sitio.com.",
		minLength:	"Ingresa al menos " + conf.minLength + " caracteres.",
		maxLength:	"El mÃ¡ximo de caracteres es " + conf.maxLength + "."
	};
	
	conf.messages = conf.messages || {};	

    if (conf.msg) { 
        conf.messages.string = conf.msg;
        conf.msg = null; 
    }
    
    // $.string("message"); support
    if (!conf.text&&!conf.email&&!conf.url&&!conf.maxLength&&!conf.minLength){
        conf.text = true;
    }	
    
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

    conf.type = "email";

    conf.email = true;

	conf.messages = conf.messages || {};	

    if (conf.msg) { conf.messages.email = conf.msg; conf.msg = null; }	

    return ui.string(conf);
    
}

ui.factory({ component: 'email' });

/**
 *	@Interface URL validations
 *	@return An interface object
 */
 
ui.url = function(conf) {
    
    conf = conf || {};
    
    conf.type = "url";
    
    conf.url = true;
    
	conf.messages = conf.messages || {};	
    
    if (conf.msg) { conf.messages.url = conf.msg; conf.msg = null; }	

    return ui.string(conf);
    
}

ui.factory({ component: 'url' });

/**
 *	@Interface MinLength validations
 *	@return An interface object
 */
 
ui.minLength = function(conf) {
    
    conf = conf || {};
    
    conf.type = "minLength";
    
    conf.minLength = conf.value;

	conf.messages = conf.messages || {};	

    if (conf.msg) { conf.messages.minLength = conf.msg; conf.msg = null; }	

    return ui.string(conf);
    
}

ui.factory({ component: 'minLength' });

/**
 *	@Interface MaxLength validations
 *	@return An interface object
 */
 
ui.maxLength = function(conf) {
    
    conf = conf || {};
    
    conf.type = "maxLength";
    
    conf.maxLength = conf.value;

	conf.messages = conf.messages || {};	

    if (conf.msg) { conf.messages.maxLength = conf.msg; conf.msg = null; }

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
    conf.conditions = {
        number: { patt: /^([0-9\s]+)$/ },
        min:    { expr: function(a,b) { return a >= b } },
        max:    { expr: function(a,b) { return a <= b } }
    };
    
    // Messages
	conf.defaultMessages = {
		number:	"Usa sÃ³lo nÃºmeros.",
		min:	"La cantidad mÃ­nima es " + conf.min + ".",
		max:	"La cantidad mÃ¡xima es " + conf.max + "."
	};

	conf.messages = conf.messages || {};

    if (conf.msg) { 
        conf.messages.number = conf.msg; 
        conf.msg = null; 
    }

    // $.number("message"); support
    if (!conf.number&&!conf.min&&!conf.max){
        conf.number = true;
    }
    
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

	conf.messages = conf.messages || {};

    if (conf.msg) { conf.messages.min = conf.msg; conf.msg = null; }
    
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

	conf.messages = conf.messages || {};

    if (conf.msg) { conf.messages.max = conf.msg; conf.msg = null; }
    
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
	// Define the validation interface    
    conf.required = true;
	// Add validation types
	conf.types = "required";
    // Define the conditions of this interface
	// Conditions absorvs that.isEmpty in checkConditions for compatibility
    conf.conditions = {
        required: { func:'!that.isEmpty'}
    }
    
	// Messages
	conf.defaultMessages = {
		required: "Campo requerido."
	};	
	
	conf.messages = conf.messages || {};

    if (conf.msg) { conf.messages.required = conf.msg; conf.msg = null; }
	
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
	_conf.$trigger = $(conf.element);
	_conf.cone = true;
	_conf.classes = "helper" + conf.id;
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

    ui.utils.body.bind(ui.events.CHANGE_LAYOUT, function(){ 
            that.position("refresh", _conf) 
        });

	return { 
        show: function(text){ show(text) }, 
        hide: hide,
        position: function(o){ 
            return that.position(o, _conf) 
        }
    };

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
                ui.utils.body.trigger(ui.events.CHANGE_LAYOUT);
				return;
			};
		};
		
		// Status OK (with previous error)
		if (!status) {
			removeError();
			status = true;
            ui.utils.body.trigger(ui.events.CHANGE_LAYOUT);
		};
	};
	
	var validate = function(event){
    
        that.callbacks(conf, 'beforeValidate');
        
		that.prevent(event);
		
		// Shoot validations
		for(var i = 0, j = that.children.length; i < j; i ++){
			that.children[i].validate();
		};
		
		checkStatus();

        that.callbacks(conf, 'afterValidate');
        
		return conf.publish; // Return publish object
	};


	var submit = function(event){

        that.callbacks(conf, 'beforeSubmit');

		that.prevent(event);
		validate(event); // Validate start
		if (status){ // Status OK	
			if(conf.callbacks && conf.callbacks.submit) conf.callbacks.submit();
			conf.element.submit();
		};		

        that.callbacks(conf, 'afterSubmit');
        
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
	};
	viewerModal.hideContent = function(){
		$("ch-viewer-modal").remove();
		
		viewerModal.carouselStruct.css("left", "0"); // Reset left of carousel in modal
		
		for(var i = 0, j = ui.instances.carousel.length; i < j; i += 1){ // TODO pasar al object			
			if(ui.instances.carousel[i].element === viewerModal.carousel.element){
				ui.instances.carousel.splice(i, 1);
				return;
			} 
		};		
	};
	that.children[1] = viewerModal.modal = $("<a>").modal({ //TODO iniciar componentes sin trigger
		content: "<div class=\"ch-viewer-modal-content\">",
		width:600,
		height:545,
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
	var extraWidth = (ui.utils.html.hasClass("ie6")) ? showcase.itemWidth : 0;
	showcase.display
		.css('width', (showcase.children.length * showcase.itemWidth) + extraWidth )
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
	that.children[0] = thumbnails.carousel = thumbnails.wrapper.carousel();
	
	
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
		$(thumbnails.children[thumbnails.selected]).removeClass("ch-thumbnail-on");
		$(thumbnails.children[item]).addClass("ch-thumbnail-on");
		
		// Content movement
		var movement = { left: -item * showcase.itemWidth };
		if(ui.features.transition) { // Have CSS3 Transitions feature?
			showcase.display.css(movement);
		} else { // Ok, let JQuery do the magic...
			showcase.display.animate(movement);
		};
		
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
		select: function(i){
			// Callback
			that.callbacks(conf, 'select');
			
			return select(i);
		}
    }
	
	// Default behavior (Select first item and without callback)
	select(0);
	
	return conf.publish;
};

/**
 *	Chat Component
 *  $("#chat").chat({
 *      ruleGroupName: "",
 *      style: ["block"],
 *      template: [1],
 *      service: [http://www.mercadolibre.com.ar/org-img/jsapi/chat/chatRBIScript.js]
 *  });
 */

ui.chat = function(conf) {
    
   	var that = ui.object(); // Inheritance

    if (conf.msg) {
        conf.ruleGroupName = conf.msg;
    }

    that.load = function() {
        console.log(conf.ruleGroupName, conf.element.id, conf.style||"block", conf.template||"1");
        loadChat(conf.ruleGroupName, conf.element.id, conf.style||"block", conf.template||"1"); 
    }

   	ui.get({
   	    method: "component",
   	    name: "chat",
   	    script: conf.service||"http://www.mercadolibre.com.ar/org-img/jsapi/chat/chatRBIScript.js",
   	    callback: function() {
       	    that.load(); 
        }
   	});

    that.publish = {
    	uid: conf.id,
		element: conf.element,
        type: "chat"
    }
    
    return that.publish;

}/**
 *	Expando
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.expando = function(conf){
	var that = ui.navs(); // Inheritance

	// Global configuration
	$(conf.element).children(':first').wrapInner("<span class=\"ch-expando-trigger\"></span>");
	$(conf.element).addClass('ch-expando');		
	conf.$trigger = $(conf.element).find(".ch-expando-trigger");
	conf.$htmlContent = conf.$trigger.parent().next();
    conf.publish = that.publish;
    conf.open = conf.open || false;
	
	// Private methods
	var show = function(event){
		// Toggle
		if(that.status){
			return hide();
		};	
		// Show
        that.show(event, conf);
        return conf.publish; // Returns publish object
    };
	
    var hide = function(event){
    	// Hide
		that.hide(event, conf); 
		return conf.publish; // Returns publish object
    };
    
	// Trigger
	conf.$trigger
		.bind('click', function(event){
			// Show menu
			that.prevent(event);
			show();
		})
		.addClass('ch-expando-trigger')
		
	// Content
	conf.$htmlContent
		.bind('click', function(event){ event.stopPropagation() })		
		.addClass('ch-expando-content');

	
	// Change default behaivor (close)
	if( conf.open ) show();
	
    // Create the publish object to be returned
    conf.publish.uid = conf.id;
    conf.publish.element = conf.element;
    conf.publish.type = "expando";
    conf.publish.open = conf.open;
    conf.publish.show = function(){ return show() };
    conf.publish.hide = function(){ return hide() };

	return conf.publish;

};

ui.init();
})(jQuery);