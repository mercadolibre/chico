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
var start = new Date().getTime();
/** 
  * @namespace
  */
var ui = window.ui = {

    version: "0.5.2",

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
/**
 *	@const Event's Map.
 */	
    events: {
        CHANGE_LAYOUT: "changeLayout"
    }    
};




/**
 *	Pre-Load function
 */	

ui.preload = function(arr) {

	if (typeof arr === "string") {
		arr = (arr.indexOf(",") > 0) ? arr.split(",") : [arr] ;
	}

	for (var i=0;i<arr.length;i++) {
				
		var o = document.createElement("object");
			o.data = arr[i]; // URL
			
		var h = document.getElementsByTagName("head")[0];
			h.appendChild(o);
			h.removeChild(o); 
	}       
};




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
                    conf.type = x;
                    conf.element = e;
                    conf.uid = ui.utils.index += 1; // Global instantiation index
                
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
						if(x.onContentLoad) x.onContentLoad();
					});
					if( x.position ) ui.positioner(x.position);
					
					// Data cached
					ui.cache.add(x.ajaxUrl, data);
				},
				error: function(xhr, textStatus, errorThrown){
					data = (x.onContentError) ? x.onContentError(xhr, textStatus, errorThrown) : "<p>Error on ajax call </p>";
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


/**
 *  Cache
 */

ui.cache = {
	map: {},
	add: function(url, data) {
		ui.cache.map[url] = data;
	},
	get: function(url) {
		return ui.cache.map[url];
	},
	rem: function(url) {
		ui.cache.map[url] = null;
		delete ui.cache.map[url];
	},
	flush: function() {
		delete ui.cache.map;
		ui.cache.map = {};
	}
};

$(function() { // DOM Ready
	var now = new Date().getTime();
    ui.loadTime = now - start;
});
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
        [hold]: false // default
        [draggable]: false // default
        
    } */
    
    // Initial configuration
	var element = $(o.element);
	var context;
	var viewport;
    
	// Default parameters
	if(!o.points) o.points = "cm cm"; // TODO change to ! o.hasOwnProperty("")
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
    //Conditional Advance Loading method
	var getViewport = (typeof window.innerWidth != "undefined") ?
		// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight 	
		function getViewport() {
			var viewport, width, height, left, top, pageX, pageY;							
			
			viewport = window;
			width = viewport.innerWidth;
			height = viewport.innerHeight;
			pageX = viewport.pageXOffset;
			pageY = viewport.pageYOffset;
			
			left = 0 + offset_left + pageX;
			top = 0 + offset_top + pageY;
			bottom = height + pageY;
			right = width + pageX;
			
			// Return viewport object
			return {
				element: viewport,			
				left: 0 + offset_left + pageX,
				top: 0 + offset_top + pageY,
				bottom: height + pageY,
				right: width + pageX,
				width: width,
				height: height
			}
		}:		
		// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
		// older versions of IE - viewport = document.getElementsByTagName('body')[0];
		function getViewport(){
			var viewport, width, height, left, top, pageX, pageY;
			
			viewport = document.documentElement;
			width = viewport.clientWidth;
			height = viewport.clientHeight;
			pageX = viewport.scrollLeft;
			pageY = viewport.scrollTop;
			
			left = 0 + offset_left + pageX;
			top = 0 + offset_top + pageY;
			bottom = height + pageY;
			right = width + pageX;
			
			// Return viewport object
			return {
				element: viewport,			
				left: 0 + offset_left + pageX,
				top: 0 + offset_top + pageY,
				bottom: height + pageY,
				right: width + pageX,
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
		
		// Hold behavior
		if (o.hold) return styles;
		
        // Check viewport limits	
		// Down to top
		if ( (points == "lt lb") && ((styles.top + element.outerHeight()) > viewport.bottom) ) { // Element bottom > Viewport bottom
			unitPoints.my_y = "b";
			unitPoints.at_y = "t";
			
			//store old styles
			stylesDown = styles;
			
			// New styles			 
			styles = getPosition(unitPoints);
			styles.direction = "top";
			styles.top -= context.height; // TODO: Al recalcular toma al top del context como si fuese el bottom. (Solo en componentes. En los tests anda ok)
			
			// Top to Down - Default again 
			if(styles.top < viewport.top){
				unitPoints.my_y = "t";
				unitPoints.at_y = "b";
				styles = stylesDown;
				styles.direction = "down";
			};
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
	//Conditional Advance Loading method
	var getContext = (o.context) ?		
		function getContext(){
			var contextOffset = o.context.offset();
		    context = {
		    	element: o.context,
				top: contextOffset.top + offset_top,
				left: contextOffset.left + offset_left,
				width: o.context.outerWidth(),
				height: o.context.outerHeight()
		    };
		    
		    return context;
		}:
		function getContext(){
			return viewport;
		};


	// Set element position on resize
    var initPosition = function(){  	
	    viewport = getViewport();
	    context = getContext();
	    setPosition();
    };

	// Init
	initPosition();
	
	// Scroll and resize events
	// Tested on IE = Magic, no lag!! 
	var scrolled = false;	
	
	ui.utils.window.bind("resize scroll", function() {
		scrolled = true;
	});
	
	setInterval(function() {
	    if( !scrolled ) return;
		scrolled = false;
		initPosition();
	    
	}, 250);
	

	return $(element);
};
/**
 *  @class Object. Represent the abstract class of all ui objects.
 *  @return {object} Object.
 */	

ui.object = function(){
	
	//constructor
	
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
				
			} else if ( conf.ajax || (conf.msg && conf.msg.match(/(?:(?:(https?|file):\/\/)([^\/]+)(\/(?:[^\s])+)?)|(\/(?:[^\s])+)/g)) ){
				// Set url
				conf.ajaxUrl = conf.ajax || conf.msg;

				// Ajax parameters
				conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax

				// Returns ajax results
				conf.$htmlContent.html('<div class="loading"></div>');
				return ui.get({method:"content", conf:conf});
				
			} else {
				var content = conf.content || conf.msg;				
				return ($(content).length > 0) ? $(content).clone().show() : content ;
			};

		},

		callbacks: function(conf, when){			
			if(conf[when]) return conf[when]();
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

ui.floats = function(conf) {

/**
 *  Constructor
 */

/**
 *  Inheritance
 */

	var that = ui.object(conf); // Inheritance	
    
/**
 *  Private Members
 */
	var createClose = function(conf) {
		$('<p class="btn ch-close">x</p>').one('click', function(event) {
			that.hide(event, conf);
		}).prependTo(conf.$container);
	};

	var createCone = function(conf) {
		$('<div class="ch-cone"></div>').prependTo(conf.$container);
	};

    var createLayout = function(conf) {

        // Creo el layout del float
    	conf.$container = $("<div class=\"ch-" + conf.type + "\"><div class=\"ch-" + conf.type + "-content\"></div></div>").appendTo("body").hide();
    	conf.$htmlContent = conf.$container.find(".ch-" + conf.type + "-content");
		
		conf.position = conf.position || {};
		conf.position.element = conf.$container;
		conf.position.hold = conf.hold || false;
		
    	getContent(conf);
    	
    	// Visual configuration
		if( conf.closeButton ) createClose(conf);
		if( conf.cone ) createCone(conf);
		if( conf.classes ) conf.$container.addClass(conf.classes);
		if( conf.hasOwnProperty("width") ) conf.$container.css("width", conf.width);
		if( conf.hasOwnProperty("height") ) conf.$container.css("height", conf.height);

		conf.$container
    		.css("z-index", ui.utils.zIndex++)
		    .fadeIn('fast', function(){ that.callbacks(conf, 'onShow'); });
		
		ui.positioner(conf.position);
		
		conf.visible = true;
    }

	// Obtener contenido y cachearlo
    var getContent = function(conf) {
    			
    	if ( conf.ajax || (conf.msg && conf.msg.match(/(?:(?:(https?|file):\/\/)([^\/]+)(\/(?:[^\s])+)?)|(\/(?:[^\s])+)/g)) ) {
			
    		that.loadContent(conf);
    	
		} else {
		
    		conf.$htmlContent
    			.html( that.loadContent(conf) )
    			.fadeIn('fast', function(){ that.callbacks(conf, 'onContentLoad'); });
    	};
    }


/**
 *  Public Members
 */
 
	that.show = function(event, conf) {
	
		if (event) that.prevent(event);
		
		if(conf.visible) return;
			
		// Show if exist, else create
		if (conf.$container) {
    		conf.$container
    		    .appendTo("body")
    			.css("z-index", ui.utils.zIndex++)
			    .fadeIn('fast', function(){ 
					conf.visible = true;
					
					// Callback execute
					that.callbacks(conf, 'onShow');
				});
			ui.positioner(conf.position);
			return;
		}
		
		// If you reach here, create a float
        createLayout(conf); 
	};

	that.hide = function(event, conf) {
	
		if (event) that.prevent(event);
		
		if (!conf.visible) return;
		
		conf.$container.fadeOut('fast', function(event){ 
			$(this).detach(); 
			conf.visible = false;
			
			// Callback execute
			that.callbacks(conf, 'onHide');	
		});

	};
	
	that.position = function(o, conf){
		
		switch(typeof o) {
		 
			case "object":
				conf.position.context = o.context || conf.position.context;
				conf.position.points = o.points || conf.position.points;
				conf.position.offset = o.offset || conf.position.offset;				
				conf.position.fixed = o.fixed || conf.position.fixed;
				
				ui.positioner(conf.position);
//				return conf.publish;
			    break;
			
			case "string":
				if(o != "refresh"){
					alert("ChicoUI error: position() expected to find \"refresh\" parameter.");
				};
				
				ui.positioner(conf.position);
//				return conf.publish;   			
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
		conf.$trigger.addClass("ch-" + conf.type + "-on");
		conf.$htmlContent.show();	
		that.callbacks(conf, 'onShow');
	};
	
	that.hide = function(event, conf){
		that.prevent(event);
		that.status = false;
		conf.$trigger.removeClass("ch-" + conf.type + "-on");
		conf.$htmlContent.hide();
		that.callbacks(conf, 'onHide');
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
		type: conf.type,
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
			that.callbacks(conf, "onMove");
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
	
	
	var select = function(pageToGo){
		//var itemPage = ~~(item / steps) + 1; // Page of "item"
		
		// Move right
		if(pageToGo > page){
			move("next", pageToGo - page);
		// Move left
		}else if(pageToGo < page){
	        move("prev", page - pageToGo);
		};
		
		if (conf.pager) {
			$(".ch-pager li").removeClass("ch-pager-on");
			$(".ch-pager li:nth-child(" + page + ")").addClass("ch-pager-on");
		}
			
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
		pager.children().each(function(i, e){ //TODO: unificar con el for de arriba (pager)
			$(e).bind("click", function(){
				select(i+1);
			});
		});
	};
	
	// Create pager if it was configured
	if (conf.pager) pager();
	
	
    // Create the publish object to be returned
    conf.publish = that.publish;
    
    /**
	 *  @ Public Properties
	 */
    conf.publish.uid = conf.uid;
    conf.publish.element = conf.element;
    conf.publish.type = conf.type;
    
    /**
	 *  @ Public Methods
	 */
    conf.publish.getSteps = function() { return steps; };
    conf.publish.getPage = function() { return page; };
    conf.publish.moveTo = function(page) { return select(page); };
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
    conf.publish = that.publish;
    
    /**
	 *  @ Public Properties
	 */
    conf.publish.uid = conf.uid;
    conf.publish.element = conf.element;
    conf.publish.type = conf.type;
    
    /**
	 *  @ Public Methods
	 */
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

    
/**
 *  Constructor
 */
	// Global configuration
	conf.$trigger = $(conf.element);
	conf.cone = true;
	conf.classes = "box";
	conf.visible = false;
	conf.position = {};
	conf.position.context = conf.$trigger;
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";
	
/**
 *  Inheritance
 */
	var that = ui.floats(conf);

/**
 *  Private Members
 */
    var showTime = conf.showTime || 300;
    var hideTime = conf.hideTime || 300;

	var st, ht; // showTimer and hideTimer
	var showTimer = function(event){ st = setTimeout(function(event){ show() }, showTime) };
	var hideTimer = function(event){ ht = setTimeout(function(event){ hide() }, hideTime) };
	var clearTimers = function(){ clearTimeout(st); clearTimeout(ht); };

    var show = function(event) {
    			
		that.show(event, conf);	

        if (conf.event === "click") {

            $('.ch-layer').bind('click', function(event){ event.stopPropagation() });

            // Document events
            $(document).one('click', function(event) {
                that.hide(event, conf);
            });
        }
    }

    var hide = function(event) {
        that.hide(event, conf);
    }

/**
 *  Protected Members
 */ 
 
/**
 *  Default event delegation
 */	
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

    // Fix: change layout problem
    $("body").bind(ui.events.CHANGE_LAYOUT, function(){ that.position("refresh", conf) });

/**
 *  Expose propierties and methods
 */	
	that.publish = {
	
	/**
	 *  @ Public Properties
	 */
    	uid: conf.uid,
		element: conf.element,
		type: conf.type,
		content: (conf.content) ? conf.content : conf.ajax,
	/**
	 *  @ Public Methods
	 */
		show: function(){ 
			showTimer();
			return that.publish; // Returns publish object
		},
		hide: function(){ 
			hideTimer();
			return that.publish; // Returns publish object
		},
		position: function(o){ 
			return that.position(o,conf) || that.publish;
		}
	}	 

	return that.publish;

};
/**
 *	@class Modal. Create and manage modal windows
 *  @requires: floats.
 *	@return Public Object.
 */

ui.modal = function(conf){

/**
 *  Constructor
 */
	conf.$trigger = $(conf.element);
	conf.closeButton = (conf.type == "modal") ? true : false;
	conf.classes = "box";
		
	conf.ajax = ( !conf.hasOwnProperty("ajax") && !conf.hasOwnProperty("content") && !conf.hasOwnProperty("msg") ) ? true : conf.ajax; //Default
/**
 *  Inheritance
 */

	var that = ui.floats(conf); // Inheritance	

/**
 *  Private Members
 */

	// Dimmer 2.0
	// Dimmer object
	var $dimmer = $('<div>')
			.addClass('ch-dimmer')
			.css({height:$(window).height(), display:'block', zIndex:ui.utils.zIndex++})
			.hide();

	// Dimmer Controller
	var dimmer = {
		on: function() { //TODO: posicionar el dimmer con el positioner
			$dimmer
				.appendTo('body')
				.fadeIn();

			if (conf.type == "modal") {
				$dimmer.one("click", hide);
			}
			
		},
		off: function() {
			$dimmer.fadeOut('normal', function(){ 
				$dimmer.detach(); 
			});
		}
	};

	var show = function(event) {
		dimmer.on();
		that.show(event, conf);
		ui.positioner(conf.position);
		$('.ch-modal .btn.ch-close').one('click', hide);
		conf.$trigger.blur();
	};

	var hide = function(event) {
		dimmer.off();
		that.hide(event, conf);
	};

	
/**
 *  Protected Members
 */ 
 
/**
 *  Default event delegation
 */	
	conf.$trigger
		.css('cursor', 'pointer')
		.bind('click', show);

/**
 *  Expose propierties and methods
 */	
	that.publish = {
	
	/**
	 *  @ Public Properties
	 */
    	uid: conf.uid,
		element: conf.element,
		type: conf.type,
		content: (conf.content) ? conf.content : ((conf.ajax === true) ? (conf.$trigger.attr('href') || conf.$trigger.parents('form').attr('action')) : conf.ajax ),
	/**
	 *  @ Public Methods
	 */
	 	show: function() {
			show();
			return that.publish;
		},
		hide: function() {
			hide();
			return that.publish;
		},
		position: function(o) {
			return that.position(o,conf) || that.publish;
		}
	};
	
	return that.publish;
};



/**
 *	@Interface Transition
 *	@return An interface object
 

var t = $("div").transition("Aguarde mientras transiosiono");
	t.hide();
 
 */
 
ui.transition = function(conf) {
    
    conf = conf || {};
	
	conf.closeButton = false;
	conf.msg = conf.msg || "Espere por favor...";
	conf.content = "<div class=\"loading\"></div><p>"+conf.msg+"</p>";
	
    return ui.modal(conf);
    
}

ui.factory({ component: 'transition' });
/**
 *	Tabs Navigator
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.tabNavigator = function(conf){

    var that = ui.controllers(); // Inheritance
    
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
		        
        that.children[tab].shoot(event);                

        // return publish object
        return conf.publish; 
	};
    
    // Create the publish object to be returned
    conf.publish = that.publish;
    
    /**
	 *  @ Public Properties
	 */
	conf.publish.uid = conf.uid;
	conf.publish.element = conf.element;
	conf.publish.type = conf.type;
	conf.publish.tabs = that.children;
	
	/**
	 *  @ Public Methods
	 */
	conf.publish.select = function(tab){ return show($.Event(), tab) };
      	
		
	//Default: Load hash tab or Open first tab	
    var hash = window.location.hash.replace( "#!", "" );
    var hashed = false;
	for( var i = that.children.length; i--; ){
		if ( that.children[i].conf.$htmlContent.attr("id") === hash ) {
			show($.Event(), i);
			hashed = true;
			break;
		};
	};

	if ( !hashed ) show($.Event(), 0); 

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
		type: 'tab',
		$trigger: $(element).addClass('ch-tabNavigator-trigger')
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
		
		//Change location hash
		window.location.hash = "#!" + that.conf.$htmlContent.attr("id");
		
		// Callback
		that.callbacks(conf, "onSelect");
		
	};

	// Events	
	that.conf.$trigger.bind('click', function(event){
		that.shoot(event);
	});


	return that;
}
/**
 *	Tooltip
 *	@author 
 *	@Contructor
 *	@return An interface object
 *  @memberOf ui.Floats
 */

ui.tooltip = function(conf) {
    
/**
 *  Constructor
 */
	conf.cone = true;
	conf.content = conf.element.title;	
	conf.visible = false;
	conf.position = {};
	conf.position.context = $(conf.element);
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";
	
/**
 *  Inheritance
 */
 
	var that = ui.floats(conf); // Inheritance

/**
 *  Private Members
 */
 
    var show = function(event) {
        $(conf.element).attr('title', ''); // IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
		that.show(event, conf);
	}
	
    var hide = function(event) {
		$(conf.element).attr('title', conf.content);
		that.hide(event, conf);
    }
    
/**
 *  Protected Members
 */ 
 
/**
 *  Default event delegation
 */	
 	
	conf.$trigger = $(conf.element)
		.css('cursor', 'default')
		.bind('mouseenter', show)
		.bind('mouseleave', hide);

    // Fix: change layout problem
    $("body").bind(ui.events.CHANGE_LAYOUT, function(){ that.position("refresh", conf) });
    
/**
 *  Expose propierties and methods
 */	
	that.publish = {
	
	/**
	 *  @ Public Properties
	 */
    	uid: conf.uid,
		element: conf.element,
		type: conf.type,
		content: conf.content,
	/**
	 *  @ Public Methods
	 */
		show: function() { 
			show();
			return that.publish; // Returns publish object
		},
		hide: function() { 
			hide();
			return that.publish; // Returns publish object
		},
		position: function(o) { 
			return that.position(o,conf) || that.publish;
		}
	}

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
	conf.types = "number,min,max,price";
	// Helper
	conf.reference = $(conf.element);
	// Conditions map TODO: float	
    conf.conditions = {
        number: { patt: /^([0-9\s]+)$/ },
        min:    { expr: function(a,b) { return a >= b } },
        max:    { expr: function(a,b) { return a <= b } },
		price:  { patt: /^(\d+)[.,]?(\d?\d?)$/ }
		//price:  { patt: /^\d (\Z|[\.]\d )$/ }

    };
    
    // Messages
	conf.defaultMessages = {
		number:	"Usa sÃ³lo nÃºmeros.",
		min:	"La cantidad mÃ­nima es " + conf.min + ".",
		max:	"La cantidad mÃ¡xima es " + conf.max + ".",
		price:  "El campo deberia ser un precio vÃ¡lido: 999,00"
	};

	conf.messages = conf.messages || {};

    if (conf.msg) { 
        conf.messages.number = conf.msg; 
        conf.msg = null; 
    }

    // $.number("message"); support
    if (!conf.number&&!conf.min&&!conf.max&&!conf.price){
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
 *	@Interface Price validations
 *	@return An interface object
 */
 
ui.price = function(conf) {
    
    conf = conf || {};
    
    conf.price = true;

	conf.messages = conf.messages || {};

    if (conf.msg) { conf.messages.price = conf.msg; conf.msg = null; }
    
    return ui.number(conf);
    
}

ui.factory({ component: 'price' });
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
        required: { func:'that.isEmpty' }
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
 */

ui.helper = function(parent){

/**
 *  Constructor
 */
var conf = {};
	conf.type = "helper";
	conf.$trigger = $(parent.element);
	conf.cone = true;
	conf.classes = "helper" + parent.uid;
	conf.visible = false;
	conf.position = {};
	conf.position.context = parent.reference;
	conf.position.offset = conf.offset || "15 0";
	conf.position.points = conf.points || "lt rt";

/**
 *  Inheritance
 */

	var that = ui.floats(conf); // Inheritance

/**
 *  Private Members
 */
	var hide = function(){
		$('.helper' + parent.uid).remove();
		conf.visible = false;
		that.callbacks(conf, 'hide');
	};
	
	var show = function(txt){
		conf.content = '<p><span class="ico error">Error: </span>' + txt + '</p>';		
		that.show($.Event(), conf);
	};

/**
 *  Protected Members
 */ 
 
/**
 *  Default event delegation
 */
    $("body").bind(ui.events.CHANGE_LAYOUT, function(){ 
        that.position("refresh", conf);
    });

/**
 *  Expose propierties and methods
 */	
	that.publish = {
	
	/**
	 *  @ Public Properties
	 */
    	uid: conf.uid,
		element: conf.element,
		type: conf.type,
	/**
	 *  @ Public Methods
	 */
		show: function(txt) { show(txt); },
		hide: hide,
		position: function(o) {
			return that.position(o,conf) || that.publish;
		}
	 };
	 
	 return that.publish;
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
	var $error = $('<p class="ch-validator"><span class="ico error">Error: </span>' + conf.messages["general"] + '</p>');	
	var createError = function(){ // Create
		$(conf.element).before( $error );		
		$("body").trigger(ui.events.CHANGE_LAYOUT);

	};
	var removeError = function(){ // Remove
		$error.detach();
		$("body").trigger(ui.events.CHANGE_LAYOUT);
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
		
		if ( status ){ // Status OK
			if ( that.callbacks(conf, 'submit') === false ) {
				conf.element.submit();
			}
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
	
    // Create the publish object to be returned
	conf.publish = that.publish;
	
	/**
	 *  @ Public Properties
	 */
	conf.publish.uid = conf.uid;
	conf.publish.element = conf.element;
	conf.publish.type = conf.type;
	conf.publish.status = status;
	conf.publish.children = that.children;
	
	/**
	 *  @ Public Methods
	 */
	conf.publish.validate = validate;
	conf.publish.submit = submit;
	conf.publish.checkStatus = checkStatus;
	conf.publish.clear = clear;
	
	return conf.publish;
};
/**
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
		$(e).attr("src", "") // Image source change
			.unwrap(); // Link deletion
	});
	viewerModal.showContent = function(){
		$(".ch-viewer-modal-content").parent().addClass("ch-viewer-modal");
		$(".ch-viewer-modal-content").html( viewerModal.carouselStruct );
		$(".ch-viewer-modal-content img").each(function(i,e){
			$(e).attr("src", bigImgs[i]);
		});
		
		that.children[2] = viewerModal.carousel = $(".ch-viewer-modal-content").carousel({ pager: true });

		$(".ch-viewer-modal-content .ch-carousel-content").css("left",0); // Reset position
		viewerModal.carousel.moveTo( thumbnails.selected );
		viewerModal.modal.position();
	};
	viewerModal.hideContent = function(){
		$("ch-viewer-modal").remove(); // Remove carousel wrapper

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
		onShow: viewerModal.showContent,
		onHide: viewerModal.hideContent
	});
		
	
	/**
	 * 	Showcase
	 */
	var showcase = {};
	showcase.wrapper = $("<div>").addClass("ch-viewer-display");
	showcase.display = $(conf.element).children(":first");
	$viewer.append( showcase.wrapper.append( showcase.display ) );
	$viewer.append("<div class=\"ch-lens\">");
	
	showcase.children = showcase.display.find("a");
	showcase.itemWidth = $(showcase.children[0]).parent().outerWidth();
	
	showcase.lens = $viewer.find(".ch-lens") // Get magnifying glass
	ui.positioner({
        element: showcase.lens,
        context: showcase.wrapper
	});	
	showcase.lens.bind("click", function(event){
		viewerModal.modal.show();
	});

	// Show magnifying glass
	showcase.wrapper.bind("mouseover", function(){
		showcase.lens.fadeIn(400);
	});
	
	// Hide magnifying glass
	$viewer.bind("mouseleave", function(){
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
	thumbnails.selected = 1;
	thumbnails.wrapper = $("<div>").addClass("ch-viewer-triggers");
	
	// Create carousel structure
	$viewer.append( thumbnails.wrapper.append( $viewer.find("ul").clone().addClass("carousel") ) );
	 
	thumbnails.children = thumbnails.wrapper.find("img");
	
	// Thumbnails behavior
	thumbnails.children.each(function(i, e){
		// Change image parameter (thumbnail size)
		$(e)
		     .attr("src", $(e).attr("src").replace("v=V", "v=M"))
		    .unwrap()
		    // Thumbnail link click
		    .bind("click", function(event){
            that.prevent(event);
            move(i+1);
		 });
		 
	});
	// Inits carousel
	that.children[0] = thumbnails.carousel = thumbnails.wrapper.carousel();
		
	// Hide magnifying glass
	thumbnails.wrapper.bind("mouseenter", function(){
		showcase.lens.fadeOut(400);
	});
	
	/**
	 * 	Methods
	 */
	var move = function(item){
		// Validation
		if(item > showcase.children.length || item < 1 || isNaN(item)){
			alert("Error: Expected to find a number between 1 and " + showcase.children.length + ".");
			return conf.publish;
		};
		
		var visibles = thumbnails.carousel.getSteps(); // Items per page
		var page = thumbnails.carousel.getPage(); // Current page
		var nextPage = Math.ceil( item / visibles ); // Page of "item"

		// Visual config
		$(thumbnails.children[thumbnails.selected-1]).removeClass("ch-thumbnail-on"); // thumbnails.children[0] first children
		$(thumbnails.children[item-1]).addClass("ch-thumbnail-on");

		// Content movement
		var movement = { left: (-item+1) * showcase.itemWidth };
		if(ui.features.transition) { // Have CSS3 Transitions feature?
			showcase.display.css(movement);
		} else { // Ok, let JQuery do the magic...
			showcase.display.animate(movement);
		};
		
		// Trigger movement
		if(page != nextPage) thumbnails.carousel.moveTo(nextPage);

		// Selected
		thumbnails.selected = item;
		
		// Return public object
		return conf.publish;
	};
	
	// Create the publish object to be returned
    conf.publish = that.publish;
    
    /**
	 *  @ Public Properties
	 */
	conf.publish.uid = conf.uid;
	conf.publish.element = conf.element;
	conf.publish.type = conf.type;
	conf.publish.children = that.children;
	conf.publish.moveTo = function(i) {
		// Callback
		that.callbacks(conf, 'onMove');
		return move(i);
	};
	
	// Default behavior (Move to the first item and without callback)
	move(1);
	
	// Preload big imgs on document loaded
	var bigImgs = [];
	ui.utils.window.load(function(){
		setTimeout(function(){			
			showcase.children.each(function(i, e){
				bigImgs.push( $(e).attr("href") ); // Image source change
			});
			ui.preload(bigImgs);
		},250);
	});
	
	return conf.publish;
};

/**
 *	Chat Component
 *  $("#chat").chat({
 *      ruleGroupName: "",
 *      style: ["block"],
 *      template: [1],
 *      environment: "1"|"2"|"3"
 *  });
 */

ui.chat = function(conf) {
    
   	var that = ui.object(); // Inheritance

    var getDomain = function(n) {
        switch (n) {
            case "1": return "mercadolidesa.com.ar"; break;
            case "2": return "mercadolistage.com.ar"; break;
            case "3": return "mercadolibre.com.ar"; break;
        }
    }

    if (conf.msg) {
        conf.ruleGroupName = conf.msg;
    }

    that.load = function() {
        loadChatGZ(conf.ruleGroupName, conf.element.id, conf.style||"block", conf.template||"1",conf.environment||"3"); 
    }

   	ui.get({
   	    method: "component",
   	    name: "chat",
   	    script: "http://www."+getDomain(conf.environment)+"/org-img/jsapi/chat/chatRBIScript.js",
   	    callback: function() {
       	    that.load(); 
        }
   	});

    that.publish = {
    	uid: conf.uid,
		element: conf.element,
        type: conf.type
    }
    
    return that.publish;

}
/**
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
    conf.publish = that.publish;
    
    /**
	 *  @ Public Properties
	 */
    conf.publish.uid = conf.uid;
    conf.publish.element = conf.element;
	conf.publish.type = conf.type;
    conf.publish.open = conf.open;
    
    /**
	 *  @ Public Methods
	 */
    conf.publish.show = function(){ return show() };
    conf.publish.hide = function(){ return hide() };

	return conf.publish;

};

ui.init();
})(jQuery);