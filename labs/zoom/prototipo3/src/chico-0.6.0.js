/**
  * Chico-UI
  * Packer-o-matic
  * Like the pizza delivery service: "Les than 100 milisecons delivery guarantee!"
  * @components: core, positioner, object, floats, navs, controllers, watcher, sliders, carousel, dropdown, layer, modal, tabNavigator, tooltip, string, number, custom, required, helper, form, viewer, chat, expando, codelighter, accordion
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
var ch = window.ch = {

    version: "0.5.9",

    components: "carousel,dropdown,layer,modal,tabNavigator,tooltip,string,number,custom,required,helper,form,viewer,chat,expando,codelighter,accordion",

    internals: "positioner,object,floats,navs,controllers,watcher,sliders",

    instances: {},
    
    features: {},
 	
    init: function() { 
        // unmark the no-js flag on html tag
        $("html").removeClass("no-js");
        // check for browser support
		ch.features = ch.support();
        // check for pre-configured components
        ch.components = (window.components) ? ch.components+","+window.components : ch.components ;
        // check for pre-configured internals
        ch.internals = (window.internals) ? ch.internals+","+window.internals : ch.internals ;
        // iterate and create components               
        $(ch.components.split(",")).each(function(i,e){ ch.factory({component:e}); });
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
		index: 0, // global instantiation index
		isSelector: function(string){
			if(typeof string !== "string") return false;
			
			for (var regex in $.expr.match){
				if ($.expr.match[ regex ].test(string) && $(string).length > 0) {
					return true;
				};
			};
			return false;
		},
		isUrl: function(url){
			return ( (/^((https?|ftp|file):\/\/|((www|ftp)\.)|(\/|.*\/)*)[a-z0-9-]+((\.|\/)[a-z0-9-]+)+([/?].*)?$/).test(url) );
		}
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

ch.preload = function(arr) {

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
ch.factory = function(o) {

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

 			// Could be more than one argument
 			var _arguments = arguments;
 			
            that.each( function(i, e) {
            	
				var conf = options || {};

                var context = {};
                    context.type = x;
                    context.element = e;
                    context.$element = $(e);
                    context.uid = ch.utils.index += 1; // Global instantiation index
               
				switch(typeof conf) {
					// If argument is a number, join with the conf
					case "number":
						var num = conf;
						conf = {};
						conf.value = num;
						
						// Could come a messages as a second argument
		                if (_arguments[1]) {
		                    conf.msg = _arguments[1];
		                };
					break;
					
					// This could be a message
					case "string":						
						var msg = conf;
						conf = {};
						conf.msg = msg;
					break;
					
					// This is a condition for custom validation
					case "function":
						var func = conf;
						conf = {};
						conf.lambda = func;
						
						// Could come a messages as a second argument
		                if (_arguments[1]) {      	
		                    conf.msg = _arguments[1];
		                };
					break;
				};
               
                // Create a component from his constructor
                var created = ch[x].call( context, conf );

				/* 
					MAPPING INSTANCES
				
    				Internal interface for avoid mapping objects
    				{
    					exists:true,
    					object: {}
    				}
				*/
				
				created = ( created.hasOwnProperty("public") ) ? created.public : created;
				
			    if (created.type) {
			        var type = created.type;		    
                    // If component don't exists in the instances map create an empty array
                    if (!ch.instances[type]) { ch.instances[type] = []; }
                         ch.instances[type].push( created );
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
        };

        // if a callback is defined 
        if ( o.callback ) { o.callback(); }
                        
    } // end create function
    
    if ( ch[o.component] ) {
        // script already here, just create
        create(o.component);
        
    } else {
        // get resurces and call create
        ch.get({
            "method":"component",
            "component":o.component,
            "script": ( o.script )? o.script : "src/js/"+o.component+".js",
            "styles": ( o.style ) ? o.style : "src/css/"+x+".css",
            "callback":create
        });
        
        //alert("CH: " + x + " configuration error. The component do not exists");
    }
}

/**
 *  Get
 */
 
ch.get = function(o) {
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

	        var that = o.that;
	        var conf = that.conf;
			var context = ( that.controller ) ? that.controller.public : that.public;
			//Set ajax config
			//setTimeout(function(){
			
			$.ajax({
				url: conf.ajaxUrl,
				type: conf.ajaxType || 'GET',
				data: conf.ajaxParams,
				cache: true,
				async: true,
				success: function(data, textStatus, xhr){					
					that.$content.html( data ); 
					if ( conf.onContentLoad ) conf.onContentLoad.call(context);
					if ( conf.position ) ch.positioner(conf.position);
				},
				error: function(xhr, textStatus, errorThrown){
					data = (conf.hasOwnProperty("onContentError")) ? conf.onContentError.call(context, xhr, textStatus, errorThrown) : "<p>Error on ajax call </p>";
					that.$content.html( data );
					if ( conf.position ) ch.positioner(conf.position);
				}
			});
			//}, 25);
			
		break;
	        
		case "component":
	        
	        // ch.get: "Should I get a style?"
	        if ( o.style ) {
	    		var style = document.createElement('link');
	        		style.href = o.style;
	    	    	style.rel = 'stylesheet';
	            	style.type = 'text/css';
	        }
	        // ch.get: "Should I get a script?"        
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
 *  Eraser
 */
 
ch.eraser = function(data) {
	
	if(typeof data == "number"){
		
		// By UID
		for(var x in ch.instances){
			
			var component = ch.instances[x];
			
			for(var i = 0, j = component.length; i < j; i += 1){
				if(component[i].uid == data){
					// TODO: component.delete()
					delete component[i];
					component.splice(i, 1);
					
					return;
				};
			};
		};
	
	} else {
		
		// All
		if(data === "meltdown"){
			// TODO: component.delete()
			/*for(var x in ch.instances){
				var component = ch.instances[x];
				for(var i = 0, j = component.length; i < j; i += 1){
					component.delete();
				};
			};*/
			
			delete ch.instances;
			ch.instances = {};
			
		// By component name	
		} else {
			
			for(var x in ch.instances){
			
				if(x == data){
					
					var component = ch.instances[x];
					
					// TODO: component.delete()
					/*for(var i = 0; i < component.length; i += 1){
						component.delete()
					};*/
					
					delete ch.instances[x];
				};
			};
			
		};
		
	};
	
};


/**
 *  Support
 */
 
ch.support = function() {
	
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

ch.cache = {
	map: {},
	add: function(url, data) {
		ch.cache.map[url] = data;
	},
	get: function(url) {
		return ch.cache.map[url];
	},
	rem: function(url) {
		ch.cache.map[url] = null;
		delete ch.cache.map[url];
	},
	flush: function() {
		delete ch.cache.map;
		ch.cache.map = {};
	}
};


/**
 *	Clone function
 */	

ch.clon = function(o) {
	
	obj = {};
	
    for (x in o) {
    	obj[x] = o[x]; 
    };
    
    return obj;
};


$(function() { // DOM Ready
	var now = new Date().getTime();
    ch.loadTime = now - start;
});
// @arg o == configuration
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
ch.positioner = function(o) {

/**
 *  Private Members
 */

	var o = o || this.conf.position;

    // Initial configuration
	var element = $(o.element);
		element.css("position","absolute");
	var context;
	var viewport;
	var parentRelative;
    
	// Default parameters 
    o.points = o.points || "cm cm";
    o.offset = o.offset || "0 0";

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
			var viewport, width, height, left, top, pageX, pageY, scrollBar = 30;							
			
			viewport = window;
			width = viewport.innerWidth - scrollBar;
			height = viewport.innerHeight;
			pageX = viewport.pageXOffset;
			pageY = viewport.pageYOffset;

			// Return viewport object
			return {
				element: viewport,			
				left: 0 + offset_left + pageX - scrollBar,
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
			var viewport, width, height, left, top, pageX, pageY, scrollBar = 30;
			
			viewport = document.documentElement;
			width = viewport.clientWidth - scrollBar;
			height = viewport.clientHeight;
			pageX = viewport.scrollLeft;
			pageY = viewport.scrollTop;
			
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
		if ( (points == "lt lb") && ((styles.top + parentRelative.top + element.outerHeight()) > viewport.bottom) ) { // Element bottom > Viewport bottom
			unitPoints.my_y = "b";
			unitPoints.at_y = "t";

			//store old styles
			stylesDown = styles;
			
			// New styles		 
			styles = getPosition(unitPoints);
			styles.direction = "top";
			styles.top -= (2 * offset_top);
		
			// Top to Down - Default again 
			if(styles.top + parentRelative.top < viewport.top){
				unitPoints.my_y = "t";
				unitPoints.at_y = "b";
				styles = stylesDown;
				styles.direction = "down";
			};
		};
		
		// Left to right
		if ( (styles.left + parentRelative.left + element.outerWidth()) > viewport.right ) { // Element right > Viewport right
			unitPoints.my_x = "r";
			unitPoints.at_x = "r";
			
			//store old styles
			stylesLeft = styles;
			
			// New styles
			var current = styles.direction;
			styles = getPosition(unitPoints);
			styles.direction = current + "-right";						
			styles.left -= (2 * offset_left);
			if(current == "top") styles.top -= (2 * offset_top);
			
			// Right to Left - Default again 
			if(styles.left < viewport.left){
				unitPoints.my_y = "l";
				unitPoints.at_y = "l";
				styles = stylesLeft;
			};
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
			.removeClass( "ch-top ch-left ch-down ch-right ch-down-right ch-top-right  ch-right-right" )
			.addClass( "ch-" + styles.direction );
				
		if ( context.hasOwnProperty("element") && context.element !== ch.utils.window[0] ){
			$(context.element)
				.removeClass( "ch-top ch-left ch-down ch-right ch-down-right ch-top-right ch-right-right" )
				.addClass( "ch-" + styles.direction );
		};

	};	

	// Get context	
	//Conditional Advance Loading method
	var getContext = (o.context) ?		
		function getContext(){

			var contextOffset = o.context.offset();
			
		    context = {
		    	element: o.context,
				top: contextOffset.top + offset_top - parentRelative.top,
				left: contextOffset.left + offset_left - parentRelative.left,
				width: o.context.outerWidth(),
				height: o.context.outerHeight()
		    };
		    
		    return context;
		}:
		function getContext(){
			return viewport;
		};
	
	
	var getParentRelative = function(){
		
		var relative = {};
			relative.left = 0;
			relative.top = 0;
		
		var parent = element.offsetParent();

		if ( parent.css("position") == "relative" ) {
			
			var borderLeft = (parent.outerWidth() - parent.width() - ( parseInt(parent.css("padding-left")) * 2 )) / 2;
			
			relative = parent.offset();
			relative.left -= offset_left - borderLeft;
			relative.top -= offset_top;
			
		};
		
		return {
			left: relative.left,
			top: relative.top
		};
		
	};
	

    var initPosition = function(){			
	    viewport = getViewport();
	    parentRelative = getParentRelative();
	    context = getContext();
	    setPosition();
    }; 
 	 
	var scrolled = false;

/**
 *  Default event delegation
 */ 

	// Init	
	initPosition();

	// Scroll and resize events
	// Tested on IE, Magic! no lag!!
	ch.utils.window.bind("resize scroll", function() {
		scrolled = true;
	});
	
	setInterval(function() {
	    if( !scrolled ) return;
		scrolled = false;
		// Hidden behavior
		if( element.css("display") === "none" ) return; 	
		initPosition();
	}, 250);
	
	return $(element);
};
/**
 *  @class Object. Represent the abstract class of all ui objects.
 *  @return {object} Object.
 */	

ch.object = function(){
	
/**
 *  Inheritance: Create a symbolic link to myself
 */
	var that = this;	
	var conf = that.conf;
	//Porque llegan las cosas que pisa el modal cuando sube... si no estan definidas todavia.
/**
 *  Public Members
 */
	that.prevent = function(event) {
		if (event && typeof event == "object") {
		    event.preventDefault();
			event.stopPropagation();
		};
		
		return that;
	};
	
	//TODO: Analizar si unificar that.content (get and set) con that.loadContent(load).
	that.content = function(content){
		
		if ( content === undefined ) {
		
			var content = conf.content || conf.msg;
			return (content) ? (( ch.utils.isSelector(content) ) ? $(content) : content) : ((conf.ajax === true) ? (that.$trigger.attr('href') || that.$trigger.parents('form').attr('action')) : conf.ajax );
		
		} else {
			
			//TODO: We have to cache the content if it's the same
			conf.cache = false;
			
			if ( ch.utils.isUrl(content) ) {
				conf.content = undefined;
				conf.ajax = content;
			} else {
				conf.ajax = false;
				conf.content = content;
			};
	
			if ( that.active ) {
				that.$content.html(that.loadContent());
				return that.position("refresh");
			};

			if (that.active) that.position("refresh");
			return that.public;
		};
		
	};

	that.loadContent = function() {
		// TODO: Properties validation
		//if( self.ajax && (self.content || self.msg) ) { alert('CH: "Ajax" and "Content" can\'t live together.'); return; };
		
		if( conf.ajax === true){
			
			// Load URL from href or form action
			conf.ajaxUrl = that.$element.attr('href') || that.$element.parents('form').attr('action');
			
			// Ajax parameters
			conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax
			
			// If trigger is a form button...
			if(that.$element.attr('type') == 'submit'){
				conf.ajaxType = that.$element.parents('form').attr('method') || 'GET';
				var serialized = that.$element.parents('form').serialize();
				conf.ajaxParams = conf.ajaxParams + ((serialized != '') ? '&' + serialized : '');
			};

			// Returns ajax results

			ch.get({method:"content", that:that});
			
			return '<div class="loading"></div>';
			
		} else if ( conf.ajax || (conf.msg && ch.utils.isUrl(conf.msg)) ){
			// Set url
			conf.ajaxUrl = conf.ajax || conf.msg;

			// Ajax parameters
			conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax

			// Returns ajax results

			ch.get({method:"content", that:that});
			return '<div class="loading"></div>';
			
		} else {
			var content = conf.content || conf.msg;		
			return ( ch.utils.isSelector(content) ) ? $(content).detach().clone().removeClass("ch-hide").show() : content;			
		};

	};

	that.callbacks = function(when){
		if( conf.hasOwnProperty(when) ) {
			var context = ( that.controller ) ? that.controller.public : that.public;
			return conf[when].call( context );
		};
	};
	
	that.position = function(o){
	
		switch(typeof o) {
		 
			case "object":
				conf.position.context = o.context || conf.position.context;
				conf.position.points = o.points || conf.position.points;
				conf.position.offset = o.offset || conf.position.offset;				
				conf.position.fixed = o.fixed || conf.position.fixed;
			
				ch.positioner(conf.position);
				return that.public;
				break;
		
			case "string":
				if(o != "refresh"){
					alert("ChicoUI error: position() expected to find \"refresh\" parameter.");
				};

				ch.positioner(conf.position);
				return that.public;   			
				break;
		
			case "undefined":
				return conf.position;
			    break;
		};
		
	};
	

	 
 	that.public = {};
	
	return that;
};
/**
 *  @class Floats. Represent the abstract class of all floats UI-Objects.
 *  @requires object.
 *  @returns {Object} Floats.
 */

ch.floats = function() {

/**
 *  Constructor
 */
	var that = this;
	var conf = that.conf;

/**
 *  Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);
    
/**
 *  Private Members
 */
	var createCone = function() {
		$("<div>")
			.addClass("ch-cone")
			.prependTo( that.$container );
		
		return;
	};

	var createClose = function() { 
		$("<div>")
			.addClass("btn close")
			.css("z-index", ch.utils.zIndex ++)
			.bind("click", function(event){ that.hide(event); })
			.prependTo( that.$container );
			
		return;
	};

    var createLayout = function() {
		
        that.$content = $("<div>")
        	.addClass("ch-" + that.type + "-content")
        	.html( that.loadContent() );
		
    	that.$container = $("<div>")
    		.addClass("ch-" + that.type)
    		.addClass("ch-hide")
    		.css("z-index", ch.utils.zIndex ++)
    		.append( that.$content )
    		.appendTo("body");
		
		// Visual configuration
		if( conf.classes ) that.$container.addClass(conf.classes);
		if( conf.hasOwnProperty("width") ) that.$container.css("width", conf.width);
		if( conf.hasOwnProperty("height") ) that.$container.css("height", conf.height);
		if( conf.closeButton ) createClose();
		if( conf.cone ) createCone();
		
		// Cache - Default: true
		conf.cache = ( conf.hasOwnProperty("cache") ) ? conf.cache : true;
		
		// Show component
		that.$container.fadeIn("fast", function(){ that.callbacks("onShow"); });
		
		// Position component
		conf.position = conf.position || {};
		conf.position.element = that.$container;
		conf.position.hold = conf.hold || false;
		ch.positioner.call(that);
		
		return;
    };
    

/**
 *  Protected Members
 */ 
			
/**
 *  Public Members
 */
 
	that.active = false;
	
	that.show = function(event) {
		
		if ( event ) that.prevent(event);
		
		if ( that.active ) return;
		
		that.active = true;
		
		// Show if exist, else create		
		if ( that.$container ) {
				
			// If not cache... get content again! // Flush cache where?? when?? do it!
			if ( !conf.cache ) that.$content.html( that.loadContent() );
			
			// Detach the content of BODY
			var content = conf.content || conf.msg;
			if ( ch.utils.isSelector(content) ) $(content).detach();

    		that.$container
    		    .appendTo("body")
    			.css("z-index", ch.utils.zIndex++)
			    .fadeIn('fast', function(){ 
					that.active = true;
					
					// Callback execute
					that.callbacks('onShow');
				});

			that.position("refresh");
						
			return that;
		};
		
		// If you reach here, create a float
        createLayout();
        
        return that;
	};

	that.hide = function(event) {

		if (event) that.prevent(event);

		if (!that.active) return;

		that.$container.fadeOut('fast', function(){ 
			 
			that.active = false;
			
			// Append the content of BODY
			var content = conf.content || conf.msg;
			
			if(ch.utils.isSelector(content)) {
				that.$content.children()
					.clone()
					.addClass("ch-hide")
					.appendTo("body");
			};
			
			// Callback execute
			that.callbacks('onHide');
			
			$(this).detach();
			
		});
		
		return that;

	};
	
	return that;
	
};
/**
 *	Controllers
 *	@author 
 *	@Contructor
 *	@return An interface object
 */

ch.controllers = function(){

/**
 *  Constructor
 */
	var that = this;
		
/**
 *  Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);
	
	
/**
 *  Private Members
 */
 
 
/**
 *  Protected Members
 */ 
	
	that.children = [];
			
/**
 *  Public Members
 */	
	
	
	return that;
};
/**
 *  @class Sliders. Represent the abstract class of all sliders UI-Objects.
 *  @requires object.
 *  @returns {Object} Sliders.
 */

ch.sliders = function() {

/**
 *  Constructor
 */
	var that = this;
	var conf = that.conf;
	
/**
 *  Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);
    
/**
 *  Private Members
 */
	

/**
 *  Protected Members
 */ 
			
/**
 *  Public Members
 */
 
	that.active = false;
	
	return that;
	
};/**
 *	Carousel
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ch.carousel = function(conf){
	
/** 
 *  Constructor
 */
	
	var that = this;
	
	that.$element.addClass('ch-carousel');
	
	if ( conf.height ) that.$element.height( conf.height );
	if ( conf.width ) that.$element.width( conf.width );
	
	// UL configuration
	that.$content = that.$element.find('.carousel')	 // TODO: wrappear el contenido para que los botones se posicionen con respecto a su contenedor
		.addClass('ch-carousel-content')
		.wrap($('<div>').addClass('ch-mask'))//gracias al que esta abajo puedo leer el $mask.width()
	
	conf = ch.clon(conf);
	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.sliders.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */
	var page = 1;
	
	// UL Width calculator
	var htmlElementMargin = (ch.utils.html.hasClass("ie6")) ? 21 : 20; // IE needs 1px more
	var extraWidth = (ch.utils.html.hasClass("ie6")) ? that.$content.children().outerWidth() : 0;
	var htmlContentWidth = that.$content.children().size() * (that.$content.children().outerWidth() + htmlElementMargin) + extraWidth;
	that.$content.css('width', htmlContentWidth);
	
	// Mask Object and draw function	
	var $mask = that.$element.find('.ch-mask');
	var steps, totalPages, moveTo, margin;
	
	var calculateMask = function(){
		// Steps = (width - marginMask / elementWidth + elementMargin) 70 = total margin (see css)
		steps = ~~( (that.$element.width() - 70) / (that.$content.children().outerWidth() + 20));
		steps = (steps == 0) ? 1 : steps;
		totalPages = Math.ceil(that.$content.children().size() / steps);
		
		// Move to... (steps in pixels)
		moveTo = (that.$content.children().outerWidth() + 20) * steps;
		// Mask configuration
		margin = ($mask.width()-moveTo) / 2;
		$mask.width( moveTo ).height( conf.height || that.$content.children().outerHeight() + 2 ); // +2 for content with border
		
		return that;
	};

	calculateMask();

	// Pager
	var makePager = function(){
		that.$element.find(".ch-pager").remove();
			
		var pager = $("<ul class=\"ch-pager\">");
		var thumbs = [];
		
		// Create each mini thumb
		for(var i = 1, j = totalPages + 1; i < j; i += 1){
			if(i == 1) thumbs.push("<li class=\"ch-pager-on\">"); else thumbs.push("<li>");
			thumbs.push(i);
			thumbs.push("</li>");
		};
		pager.append( thumbs.join("") );
		
		// Create pager
		that.$element.append( pager );
		
		// Position
		var contextWidth = pager.parent().width();
		var pagerWidth = pager.outerWidth();
		
		pager.css('left', (contextWidth - pagerWidth) / 2);
		
		// Children functionality
		pager.children().each(function(i, e){ //TODO: unificar con el for de arriba (pager)
			$(e).bind("click", function(){
				that.select(i+1);
			});
		});

		return pager;
	};
	
	var resize = false;
	

/**
 *  Protected Members
 */

	// Buttons
	that.buttons = {
		prev: {
			//TODO usar positioner cuando esten todos los casos de posicionamiento
			$element: $('<p class="ch-prev"><span>Previous</span></p>').bind('click', function(){ that.move("prev", 1) }).css('top', (that.$element.outerHeight() - 50 + (( conf.pager ) ? 30 : 0)) / 2), // 50 = button height + margin; 30 = padding bottom if pager exists
			on: function(){ that.buttons.prev.$element.addClass("ch-prev-on") },
			off: function(){ that.buttons.prev.$element.removeClass("ch-prev-on") }
		},
		next: {
			//TODO usar positioner cuando esten todos los casos de posicionamiento
			$element: $('<p class="ch-next"><span>Next</span></p>').bind('click', function(){ that.move("next", 1) }).css('top', (that.$element.outerHeight() - 50 + (( conf.pager ) ? 30 : 0)) / 2), // 50 = button height + margin; 30 = padding bottom if pager exists
			on: function(){ that.buttons.next.$element.addClass("ch-next-on") },
			off: function(){ that.buttons.next.$element.removeClass("ch-next-on") }
		}
	};
	


	that.move = function(direction, distance){
		var movement;
		
		switch(direction){
			case "prev":
				// Validation
				if(that.active || (page - distance) <= 0) return;
				
				// Next move
				page -= distance;
				
				// Css object
				movement = that.$content.position().left + (moveTo * distance);
				
				// Buttons behavior
				if(page == 1) that.buttons.prev.off();
				that.buttons.next.on();
			break;
			case "next":
				// Validation
				if(that.active || (page + distance) > totalPages) return;
				
				// Next move
				page += distance;
				
				// Css object
				movement = that.$content.position().left - (moveTo * distance);
				
				// Buttons behavior
				if(page == totalPages) that.buttons.next.off();
				that.buttons.prev.on();
			break;
		};
				
		// Status moving
		that.active = true;
		
		// Function executed after movement
		var afterMove = function(){
			that.active = false;
			
			// Pager behavior
			if (conf.pager) {								
				that.pager.children().removeClass("ch-pager-on");
				that.pager.children(":nth-child("+page+")").addClass("ch-pager-on");
			};

			// Callbacks
			that.callbacks("onMove");
		};
		
		// Have CSS3 Transitions feature?
		if (ch.features.transition) {
			
			// Css movement
			that.$content.css({ left: movement });
			
			// Callback
			afterMove();
			
		// Ok, let JQuery do the magic...
		} else {
			
			that.$content.animate({ left: movement }, afterMove);
		};
		
		return that;
	};
	
	
	that.select = function(pageToGo){
		//var itemPage = ~~(item / steps) + 1; // Page of "item"
		
		// Move right
		if(pageToGo > page){
			that.move("next", pageToGo - page);
		// Move left
		}else if(pageToGo < page){
	        that.move("prev", page - pageToGo);
		};
		
		if (conf.pager) {
			that.pager.children().removeClass("ch-pager-on");
			that.pager.children(":nth-child("+page+")").addClass("ch-pager-on");
		};
			
	    return that;
	};
	
	that.redraw = function(){
		that.select(1); //reset the position
		calculateMask();
		if (conf.pager) that.pager = makePager();
	};

/**
 *  Public Members
 */

   	that.public.uid = that.uid;
	that.public.element = that.element;
	that.public.type = that.type;

	that.public.getSteps = function() { return steps; };
    that.public.getPage = function() { return page; };
    that.public.moveTo = function(page) {
    	that.select(page);

    	return that.public;
    };
    
    that.public.next = function(){
    	that.move("next", 1);

    	return that.public;
    };
    
	that.public.prev = function(){
		that.move("prev", 1);

		return that.public;
	};
	
	that.public.redraw = function(){
		that.redraw();
		
		return that.public;
	};


/**
 *  Default event delegation
 */
 	
	// UL width configuration
	that.$content.css('width', htmlContentWidth);
 	
	// Buttons behavior
	that.$element.prepend( that.buttons.prev.$element ).append( that.buttons.next.$element ); // Append prev and next buttons
	if (htmlContentWidth > $mask.width()) that.buttons.next.on(); // Activate Next button if items amount is over carousel size

	// Create pager if it was configured
	if (conf.pager){
		that.$element.addClass("ch-pager-bottom");
		that.pager = makePager();
	};
	
	
	// Elastic behavior    
    if ( !conf.hasOwnProperty("width") ){
		
	    ch.utils.window.bind("resize", function() {
			resize = true;
		});
		
		setInterval(function() {
		    if( !resize ) return;
			resize = false;
			that.redraw();
		}, 250);
		
	};
 
	return that;
}
/**
 *	@class Modal. Create and manage modal windows
 *  @requires: floats.
 *	@return Public Object.
 */

ch.modal = function(conf){

/**
 *	Constructor
 *	Guardo el contexto de ejecucion (this) que viene con 3 propiedades del factory (uid, element, type).
 *	Luego, seteamos la configuracion bÃƒÂ¡sica del componente y lo guardamos en el contexto para que llegue a sus padres cuando pasamos el contexto (that.conf).
 */

	var that = this;

	conf = ch.clon(conf);
	conf.ajax = ( !conf.hasOwnProperty("ajax") && !conf.hasOwnProperty("content") && !conf.hasOwnProperty("msg") ) ? true : conf.ajax; //Default	
	conf.closeButton = (that.type == "modal") ? true : false;
	conf.classes = "box";

	that.conf = conf;

/**
 *	Inheritance
 */

    that = ch.floats.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

	// Dimmer object
	var $dimmer = $("<div>").addClass("ch-dimmer");

	// Dimmer Controller
	var dimmer = {
		on: function() { //TODO: posicionar el dimmer con el positioner
			$dimmer
				.appendTo("body")
				.css("z-index", ch.utils.zIndex ++)
				.fadeIn();

			if(that.type == "modal") {
				$dimmer.one("click", function(event){ that.hide(event) });
			}
			
		},
		off: function() {
			$dimmer.fadeOut("normal", function(){ 
				$dimmer.detach();
			});
		}
	};

/**
 *  Protected Members
 */ 
	that.$trigger = that.$element;
	
	that.show = function(event) {	
		dimmer.on();
		that.parent.show(event);		
		that.$trigger.blur();
		
		return that;
	};
	
	that.hide = function(event) {
		dimmer.off();		
		that.parent.hide(event);

		return that;
	};
	
/**
 *  Public Members
 */
   	that.public.uid = that.uid;
	that.public.element = that.element;
	that.public.type = that.type;
	that.public.content = that.content;
	
	that.public.show = function(){
		that.show();
		
		return that.public;
	};
	
	that.public.hide = function(){
		that.hide();
		
		return that.public;
	};
	
	that.public.position = that.position;
 
/**
 *  Default event delegation
 */	
	that.$trigger
		.css("cursor", "pointer")
		.bind("click", function(event){ that.show(event); });

	return that;
};



/**
 *	@Interface Transition
 *	@return An interface object
 */
 
ch.transition = function(conf) {
    
    conf = conf || {};
	
	conf.closeButton = false;
	conf.msg = conf.msg || "Please wait...";
	conf.content = $("<div>")
		.addClass("loading")
		.append( $("<p>").html(conf.msg) );

	return ch.modal.call(this, conf);
    
}

/**
 *	Viewer
 *	@author
 *	@Contructor
 *	@return An interface object
 */
ch.viewer = function(conf){

/**
 *  Constructor
 */
	var that = this;

	conf = ch.clon(conf);
	that.conf = conf;
	
/**
 *  Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);
	
/**
 *  Private Members
 */
 
	/**
	 * 	Viewer
	 */
	var $viewer = that.$element.addClass("ch-viewer");
	
	/**
	 * 	Showcase
	 */
	
	var showcase = (function(){
		
		/*var lens = $("<div>")
			.addClass("ch-lens ch-hide")
			.bind("click", function(){ viewerModal.show(); });
		*/
		var display = $viewer.children(":first").addClass("ch-viewer-content");
		/*	display.find("img, object, embed, video") // TODO: Checkear que este correcto
				.bind("mouseover", function(){ lens.fadeIn(); }) // Show magnifying glass
				.bind("mouseleave", function(){ lens.fadeOut(); }); // Hide magnifying glass
		*/
		var wrapper = $("<div>")
			.addClass("ch-viewer-display")
			.append( display )
		//	.append( lens ) // Magnifying glass
			.appendTo( $viewer );

		var self = {};
		
			self.items = display.children();
			self.itemsWidth = self.items.outerWidth();
			self.itemsAmount = self.items.length;
			
			self.itemsAnchor = self.items.children("a");
			
			$.each(self.items, function(i,e){
				
				var enlarge = $("<a>")
					.addClass("ch-enlarge-proto")
					.html("Enlarge");
				
				$(e).append( enlarge );
				
				
				var zoom, img, rectangle;
				
				var created = false;
				
				var movemove = function(event){
					
					if(!created){
						
						img = $("<img>")
							.attr("src", $(e).children("link[rel=zoom]").attr("href"))
							.css("position", "absolute");
						
						zoom = $("<div>")
							.addClass("ch-zoom-proto")
							.css({
								"border": "1px solid #ccc",
								"width": $viewer.width(),
								"height": $viewer.height(),
								"overflow": "hidden",
								"position": "relative"
							})
							.append( img )
							.appendTo( "body" );
						
						ch.positioner({
							element:zoom,
							context:$viewer,
							points:"lt rt",
							offset:"20 0"
						});
						
						// Rectangle
						rectangle = $("<div>")
							.addClass("ch-rectangle-proto")
							.css({
								"background-color": "rgba(0,0,255,.1)",
								"width":zoom.width() / 3,
								"height":zoom.height() / 3,
								"border":"1px solid #00f",
								"position":"absolute",
								"cursor":"pointer"
							})
							// Zoom movement
							.bind("mousemove", movemove)
							.bind("click", function(event){ that.prevent(event); viewerModal.show(); })
							.appendTo( $viewer )
						
						created = true;
					};
					
					
					var offset = wrapper.offset();
					
					// Out of bounds? Destroy
					if(
						(event.pageX < offset.left) ||
						(event.pageY < offset.top)
					){
						$(".ch-zoom-proto, .ch-rectangle-proto").remove();
						created = false;
						return;
					};
					
					if(
						(event.pageX > offset.left + wrapper.width()) ||
						(event.pageY > offset.top + wrapper.height())
					){
						$(".ch-zoom-proto, .ch-rectangle-proto").remove();
						created = false;
						return;
					};
					/*if(
						(event.pageX < offset.left) ||
						(event.pageX > offset.left + wrapper.width()) ||
						(event.pageY < offset.top) ||
						(event.pageY < offset.top + wrapper.height())
					) {
						
					}*/	
						
					
					var diff = {
						x: img.outerWidth() / wrapper.outerWidth() - 1,
						y: img.outerHeight() / wrapper.outerHeight() - 1
					};
					
					img.css({
						left: -(event.pageX - offset.left) * diff.x + "px",
						top: -(event.pageY - offset.top) * diff.y + "px"
					});
					
					// Rectangle
					var newX = event.pageX - $viewer.offset().left - (rectangle.width() / 2);
					var newY = event.pageY - $viewer.offset().top - (rectangle.height() / 2);
					
					rectangle.css({
						"left": newX,
						"top": newY
					});
						
				};
				
				$(e).children("a")
				
				// Enlarge
				.bind("click", function(event){ that.prevent(event); viewerModal.show(); })
				
				// Zoom movement
				.bind("mousemove", movemove)
				
			});
			
			// Set visual config of content
			self.display = display.css("width", (self.itemsAmount * self.itemsWidth) + (ch.utils.html.hasClass("ie6") ? self.itemsWidth : 0)); // Extra width
			
			//self.videos = [];
		
		// Position magnifying glass
		/*ch.positioner({
	        element: lens,
	        context: wrapper
		});*/
		
		return self;
	})();
	
	
	/**
	 * 	Thumbnails
	 */
	var createThumbs = function(){
	
		var structure = $("<ul>").addClass("carousel");
		
		$.each(showcase.items, function(i, e){
			
			var thumb = $("<li>").bind("click", function(event){
				that.prevent(event);
				that.move(i + 1);
			});
			
			// Thumbnail
			if( $(e).children("link[rel=thumb]").length > 0 ) {
				$("<img>")
					.attr("src", $(e).children("link[rel=thumb]").attr("href"))
					.appendTo( thumb );
			
			// Google Map
			//} else if( ref.children("iframe").length > 0 ) {
				// Do something...
					
			// Video
			} else if( $(e).children("object").length > 0 || $(e).children("embed").length > 0 ) {
				$("<span>").html("Video").appendTo( thumb.addClass("ch-viewer-video") );
				//showcase.videos.push($(e).children("object"));
			};
			
			structure.append( thumb );
		});
		
		var self = {};
		
			self.children = structure.children();
			
			self.selected = 1;
		
			self.carousel = that.children[0] = $("<div>")
				.addClass("ch-viewer-triggers")
				.append( structure )
				.appendTo( $viewer )
				.carousel({
					width: $viewer.width()
				});
		
		return self;
	};
		
	
	
	
	
	
	/**
	 * 	Modal
	 */
	var viewerModal = that.children[1] = $("<div>").modal({
		content: "<div class=\"ch-viewer-modal-content\"></div>",
		width:600,
		onShow: function(){ // TODO: Deberia cachear el contenido para evitar recalcular todo
			
			// Pause showcase videos
			/*$.each(showcase.videos, function(i, e){
				e.pauseVideo();
				$(e).children("embed")[0].pauseVideo();
			});*/
			
			// Remove zoom
			$(".ch-zoom-proto, .ch-rectangle-proto").remove();
			
			var modalContent = $(".ch-viewer-modal-content");
				modalContent.parents(".ch-modal").addClass("ch-viewer-modal");
		
			// Create list + reset position + append it
			var list = $("<ul>");
			
			var bigId = 0;
		
			$.each(showcase.items, function(i, e) {
				
				var item = {};
				
				// Thumbnail
				if( $(e).children("a").length > 0 ) {
					item = $("<img>").attr("src", bigImages[ bigId++ ]);
					
				// Google Map
				//} else if( ref.children("iframe").length > 0 ) ? "src/assets/viewer.png" :
				
				// Video (OBJECT)
				} else if( $(e).children("object").length > 0) {
					
					// TODO: Take width and height of "bigImages". Else, 500x500.
					var resize = { "width": 500, "height": 500 };
					
					var video = $(e).children("object")[0].cloneNode(true);
					
					item = $(video).attr(resize).children("embed").attr(resize);
				
				// Video (EMBED)
				} else if ( $(e).children("embed").length > 0 ) {

					var video = $(e).children("embed")[0].cloneNode(true);
					
					// TODO: Take width and height of "bigImages". Else, 500x500.
					item = $(video).attr({ "width": 500, "height": 500 });
					
				};
					
				
				$("<li>").append( item ).appendTo( list );
			});

			list.addClass("carousel")
				.css("left", 0)
				.appendTo( modalContent );
			
			// Full behavior
			if(showcase.itemsAmount > 1) {
				// Init carousel and move to position of item selected on thumbs
				that.children[2] = modalContent.carousel({ pager: true }).moveTo( thumbnails.selected );
				
			// Basic behavior
			} else {
				// Simulate carousel structure
				modalContent.wrapInner("<div class=\"ch-viewer-oneItem\">");
			};
			
			// Zoom process
			//checkZoomImages(modalContent);
			
			// Refresh modal position
			this.position("refresh");
		},
		onHide: function(){
		
			// Reset modal content
			$(".ch-viewer-modal-content").html("").removeClass("ch-carousel");
		
			// Full behavior
			if(showcase.itemsAmount > 1) {
				// Thumbnails syncro (select thumb that was selected in modal)
				that.move( that.children[2].getPage() );
			
				// Delete modal instance // TODO pasar funcionalidad al object ("that.destroy"?)
				for(var i = 0, j = ch.instances.carousel.length; i < j; i += 1){
					if(ch.instances.carousel[i].element === that.children[2].element){
						ch.instances.carousel.splice(i, 1);
						return;
					};
				};
			};
		}
	});
	
	
	
	/**
	 * 	Zoom
	 */
	var checkZoomImages = function(modal){
		
		var zoomImages = [];
		
		$.each(showcase.items, function(i, e){
			
			// Zoom image source
			var src = $(e).children("link[rel=zoom]").attr("href");
			
			// If it has not zoom, continue
			if(!src) return;
			
			var image = $("<img>")
				.attr("src", src)
				.addClass("ch-viewer-zoomed")
				.bind("click", function(){ $(this).fadeOut(); }) // Fade Out
				.bind("mousemove", function(event){ zoomMove(event); }) // Movement
				.appendTo( (showcase.itemsAmount > 1) ? modal : modal.children() )
				.hide();
			
			var zoomMove = function(event){
				var offset = modal.offset();
				
				var diff = {
					x: image.outerWidth() / modal.outerWidth() - 1,
					y: image.outerHeight() / modal.outerHeight() - 1
				};
				
				image.css({
					left: -(event.pageX - offset.left) * diff.x + "px",
					top: -(event.pageY - offset.top) * diff.y + "px"
				});
			};
			
			// Create zoom functionality
			var zoomable = $("<a>")
				.attr("href", src)
				.addClass("ch-viewer-zoomable")
				.bind("click", function(event){
					that.prevent(event);
					zoomMove(event);
					image.fadeIn();
				}); // FadeIn
			
			// Append link to image in modal
			modal.find(".ch-carousel-content li").eq(i).wrapInner( zoomable );
			
			// Add source to preload
			zoomImages.push(src);
		});
		
		// Preload if there are zoom images
		if(zoomImages.length > 0) ch.preload(zoomImages);
	};
	
	
	
	var move = function(item){

		// Validation
		if(item > showcase.itemsAmount || item < 1 || isNaN(item)) return that;
	
		var visibles = thumbnails.carousel.getSteps(); // Items per page
		var page = thumbnails.carousel.getPage(); // Current page
		var nextPage = Math.ceil( item / visibles ); // Page of "item"

		// Visual config
	
		$(thumbnails.children[thumbnails.selected - 1]).removeClass("ch-thumbnail-on"); // Disable thumbnail
		$(thumbnails.children[item - 1]).addClass("ch-thumbnail-on"); // Enable next thumbnail

		// Content movement
		var movement = { left: (-item + 1) * showcase.itemsWidth };
	
		// CSS3 Transitions vs jQuery magic
		if(ch.features.transition) showcase.display.css(movement); else showcase.display.animate(movement);
	
		// Move thumbnails carousel if item selected is on another page
		if(page != nextPage) thumbnails.carousel.moveTo(nextPage);

		// Refresh selected thumb
		thumbnails.selected = item;

		// Callback
		that.callbacks("onMove");
	
		return that;
	};

/**
 *  Protected Members
 */ 
	
	
	

/**
 *  Public Members
 */	

	that.public.uid = that.uid;
	that.public.element = that.element;
	that.public.type = that.type;
	that.public.children = that.children;
	
	// Full behavior
	if(showcase.itemsAmount > 1) {
		that.public.moveTo = function(item){ that.move(item); return that.public; };
		that.public.next = function(){ that.move( thumbnails.selected + 1 ); return that.public; };
		that.public.prev = function(){ that.move( thumbnails.selected - 1 ); return that.public; };
		that.public.getSelected = function(){ return thumbnails.selected; }; // Is this necesary???
		// ...

/**
 *  Default event delegation
 */	
	
		// ...
		var thumbnails = createThumbs();
		that.move = move;
		that.move(1); // Move to the first item without callback
	};
	
	// Preload big images on document load
	var bigImages = [];
	
	$(function(){
		showcase.itemsAnchor.each(function(i, e){
			bigImages.push( $(e).attr("href") );
		});
		
		ch.preload(bigImages);
	});

	
	return that;
};

ch.init();
})(jQuery);