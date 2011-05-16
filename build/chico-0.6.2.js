/**
  * Chico-UI
  * Packer-o-matic
  * Like the pizza delivery service: "Les than 100 milisecons delivery guarantee!"
  * @components: core, positioner, object, floats, navs, controllers, watcher, sliders, keyboard, carousel, dropdown, layer, modal, tabNavigator, tooltip, string, number, custom, required, helper, form, viewer, chat, expando, codelighter, accordion, zoom
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

    version: "0.6.2",

    components: "carousel,dropdown,layer,modal,tabNavigator,tooltip,string,number,custom,required,helper,form,viewer,chat,expando,codelighter,accordion,zoom",

    internals: "positioner,object,floats,navs,controllers,watcher,sliders,keyboard",

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
        
		ch.utils.document.bind("keydown", function(event){ ch.keyboard(event); });
        
    },
/**
 *	@static Utils. Common usage functions.
 */		
    utils: {
		body: $("body"),
		html: $("html"),
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
        CHANGE_LAYOUT: "changeLayout",
        KEY: {
        	ENTER: "enter",
			ESC: "esc",
			LEFT_ARROW: "left_arrow",
			UP_ARROW: "up_arrow",
			RIGHT_ARROW: "right_arrow",
			DOWN_ARROW: "down_arrow"
        }
    }
};


/**
 *  Clone function
 */ 

ch.clon = function(o) {
    
    obj = {};
    
    for (x in o) {
        obj[x] = o[x]; 
    };
    
    return obj;
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
				
				created = ( created.hasOwnProperty("public") ) ? created["public"] : created;
				
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
			var context = ( that.controller ) ? that.controller["public"] : that["public"];

			// Set ajax config
			// On IE (6-7) "that" reference losts when I call ch.get for second time
			// Why?? I don't know... but with a setTimeOut() work fine!
			setTimeout(function(){
			
				$.ajax({
					url: conf.ajaxUrl,
					type: conf.ajaxType || 'GET',
					data: conf.ajaxParams,
					cache: true,
					async: true,
					beforeSend: function(jqXHR){
						jqXHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					},
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
				
			}, 0);
			
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
 *  Support
 */
 
ch.support = function() {
	var thisBody = document.body || document.documentElement;
	// Based on: http://gist.github.com/373874
	// Verify that CSS3 transition is supported (or any of its browser-specific implementations)
	var transition = (function(){
		var thisStyle = thisBody.style;

		return thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.OTransition !== undefined || thisStyle.transition !== undefined;
	})();
	
	// Based on: http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED
	// Verify that position fixed is supported
	var fixed = (function(){
		var isSupported = false;
		var e = document.createElement("div");
			e.style.position = "fixed";
			e.style.top = "10px";
			
		thisBody.appendChild(e);
		if (e.offsetTop === 10) { isSupported = true; };
  		thisBody.removeChild(e);
  		
  		return isSupported;
  		
	})();

	return {
		transition: transition,
		fixed: fixed
		// gradient: gradient
	};
	
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
			// jquery 1.6 do not support offset on IE
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
			return that["public"];
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
			var context = ( that.controller ) ? that.controller["public"] : that["public"];
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
				return that["public"];
				break;
		
			case "string":
				if(o != "refresh"){
					alert("ChicoUI error: position() expected to find \"refresh\" parameter.");
				};

				ch.positioner(conf.position);
				return that["public"];   			
				break;
		
			case "undefined":
				return conf.position;
			    break;
		};
		
	};
	

	 
 	that["public"] = {};
	
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
		// Close Button
		$("<div>")
			.addClass("btn close")
			.css("z-index", ch.utils.zIndex ++)
			.bind("click", function(event){ that.hide(event); })
			.prependTo( that.$container );
		
		// ESC key
		ch.utils.document.bind(ch.events.KEY.ESC, function(event){ that.hide(event); });
		
		return;
	};

    var createLayout = function() {
		
        that.$content = $("<div>")
        	.addClass("ch-" + that.type + "-content")
        	.html( that.loadContent() );
		
    	that.$container = $("<div>")
    		.addClass("ch-hide ch-" + that.type)
    		.css("z-index", ch.utils.zIndex ++)
    		.append( that.$content )
    		.appendTo("body");
		
		// Visual configuration
		if( conf.hasOwnProperty("classes") ) that.$container.addClass(conf.classes);
		if( conf.hasOwnProperty("width") ) that.$container.css("width", conf.width);
		if( conf.hasOwnProperty("height") ) that.$container.css("height", conf.height);
		if( conf.hasOwnProperty("closeButton") ) createClose();
		if( conf.hasOwnProperty("cone") ) createCone();
		if( conf.hasOwnProperty("fx") ) conf.fx = conf.fx; else conf.fx = true;
		
		// Cache - Default: true
		conf.cache = ( conf.hasOwnProperty("cache") ) ? conf.cache : true;
		
		// Show component with effects
		if( conf.fx ) {
			that.$container.fadeIn("fast", function(){ that.callbacks("onShow"); });
		
		// Show component without effects
		} else {
			// TODO: that.$container.removeClass("ch-hide");
			that.$container.show();
			that.callbacks("onShow");
		};
		
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

		var afterHide = function(){ 
			 
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
			
		};
		
		// Show component with effects
		if( conf.fx ) {
			that.$container.fadeOut("fast", afterHide);
		
		// Show component without effects
		} else {
			// TODO: that.$container.addClass("ch-hide");
			that.$container.hide();
			afterHide();
		};
		
		return that;

	};
	
	return that;
	
};
/**
*  @static @class Navigators. Represent the abstract class of all navigators ui objects.
*  @requires PowerConstructor
*  @returns {Object} New Navigators.
*/	
ch.navs = function(){
	
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
		
	that.show = function(event){
		that.prevent(event);
		
		if ( that.active ) return;
		
		that.active = true;

		that.$trigger.addClass("ch-" + that.type + "-on");
		that.$content.removeClass("ch-hide");
		that.callbacks("onShow");
		
		return that;
	};
	
	that.hide = function(event){
		that.prevent(event);
		
		if (!that.active) return;
		
		that.active = false;
		
		that.$trigger.removeClass("ch-" + that.type + "-on");
		that.$content.addClass("ch-hide");
		that.callbacks("onHide");
		
		return that;
	};		
	
	return that;
}
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
            } else if ( that.$element.prev().prop('tagName') == 'LEGEND' ) {
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
	
	// Reset Method
	that.reset = function() {
		//that.publish.status = that.status = conf.status = true; // Public status OK
		that.active = false;
		that.$element.removeClass("error");
		that.helper.hide(); // Hide helper
		that.$element.unbind("blur change", that.validate); // Remove blur and change event
		
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
				return parseInt(val) === -1 || val === null;
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
	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = "watcher"; // Everything is a "watcher" type, no matter what interface is used
	that["public"].types = conf.types;
	that["public"].reference = that.reference;
	that["public"].validations = that.validations;
	that["public"].conditions = that.conditions;
	that["public"].messages = that.messages;
	that["public"].helper = that.helper["public"];
	that["public"].active = function() {
		return that.active;
	};
	
	that["public"].and = function() {
		return that.$element;
	};
	
	that["public"].reset = function() {
		that.reset();
		
		return that["public"];
	};
	
	that["public"].validate = function() {
		that.validate();
		
		return that["public"];
	};
	  
	that["public"].enable = function() {
		that.enabled = true;
				
		return that["public"];			
	};
	
	that["public"].disable = function() {
		that.enabled = false;
		
		return that["public"];
	};
	
	that["public"].refresh = function() { 
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
            that["public"] = check; 
        // ;) repleace that object with the repeated instance
    } else {
        // this is a new instance: "Come to papa!"
        controller.children.push(that["public"]);
    };

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
 *  Keyboard
 */
 
ch.keyboard = function(event) {
    
    var keyCodes = {
        "13": "ENTER",
        "27": "ESC",
        "37": "LEFT_ARROW",
        "38": "UP_ARROW",
        "39": "RIGHT_ARROW",
        "40": "DOWN_ARROW"
    };
    
    if( !keyCodes.hasOwnProperty(event.keyCode) ) return;
    
    ch.utils.document.trigger(ch.events.KEY[ keyCodes[event.keyCode] ], event);
    
};
/**
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
	if ( conf.hasOwnProperty("arrows") ) conf.arrows = conf.arrows; else conf.arrows = true;
	
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
	var marginChildren = parseInt( that.$content.children().css("marginLeft") ) * 2;

	var extraWidth = (ch.utils.html.hasClass("ie6")) ? that.$content.children().outerWidth() : 0;
	var htmlContentWidth = that.$content.children().size() * (that.$content.children().outerWidth() + htmlElementMargin) + extraWidth;
	that.$content.css('width', htmlContentWidth);
	
	// Mask Object and draw function	
	var $mask = that.$element.find('.ch-mask');
	var steps, totalPages, moveTo, margin;
	
	var calculateMask = function(){
		// Steps = (width - marginMask / elementWidth + elementMargin) 70 = total margin (see css)
		steps = ~~( (that.$element.width() - 70) / (that.$content.children().outerWidth() + marginChildren));
		steps = (steps == 0) ? 1 : steps;
		totalPages = Math.ceil(that.$content.children().size() / steps);
		
		// Move to... (steps in pixels)
		moveTo = (that.$content.children().outerWidth() + marginChildren) * steps;
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
			if(i == page) thumbs.push("<li class=\"ch-pager-on\">"); else thumbs.push("<li>");
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

		if ( ch.utils.html.hasClass("ie6") ) { pager.css('top', that.$element.height() + 15) };

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
			$element: $('<p class="ch-prev"><span>Previous</span></p>').bind('click', function(){ that.move("prev", 1) }),
			on: function(){ that.buttons.prev.$element.addClass("ch-prev-on") },
			off: function(){ that.buttons.prev.$element.removeClass("ch-prev-on") }
		},
		next: {
			//TODO usar positioner cuando esten todos los casos de posicionamiento
			$element: $('<p class="ch-next"><span>Next</span></p>').bind('click', function(){ that.move("next", 1) }),
			on: function(){ that.buttons.next.$element.addClass("ch-next-on") },
			off: function(){ that.buttons.next.$element.removeClass("ch-next-on") }
		},
		position: function(){
			// 50 = button height + "margin"; 10 = bottom position if pager exists },
			var newTop = {'top': (that.$element.outerHeight() - 50 + (( conf.pager ) ? 10 : 0)) / 2};
				
			that.buttons.prev.$element.css(newTop);
			that.buttons.next.$element.css(newTop);
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
				if ( conf.arrows ) {
					if(page == 1) that.buttons.prev.off();
					that.buttons.next.on();
				};
			break;
			case "next":
				// Validation
				if(that.active || (page + distance) > totalPages) return;
				
				// Next move
				page += distance;
				
				// Css object
				movement = that.$content.position().left - (moveTo * distance);
				
				// Buttons behavior
				if ( conf.arrows ) {
					if(page == totalPages) that.buttons.next.off();
					that.buttons.prev.on();
				};
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
		if (steps > 1){ that.select(1); } //reset the position
		
		calculateMask();
		
		that.buttons.position();
		
		if (conf.pager && totalPages > 1) that.pager = makePager();
	};

/**
 *  Public Members
 */

   	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;

	that["public"].getSteps = function() { return steps; };
    that["public"].getPage = function() { return page; };
    that["public"].moveTo = function(page) {
    	that.select(page);

    	return that["public"];
    };
    
    that["public"].next = function(){
    	that.move("next", 1);

    	return that["public"];
    };
    
	that["public"].prev = function(){
		that.move("prev", 1);

		return that["public"];
	};
	
	that["public"].redraw = function(){
		that.redraw();
		
		return that["public"];
	};


/**
 *  Default event delegation
 */
 	
	// UL width configuration
	that.$content.css('width', htmlContentWidth);

	// Create pager if it was configured
	if (conf.pager){
		that.$element.addClass("ch-pager-bottom");
		that.pager = makePager();	
	};
	
	// Buttons behavior
	if ( conf.arrows ){
		that.$element.prepend( that.buttons.prev.$element ).append( that.buttons.next.$element ); // Append prev and next buttons
		if (htmlContentWidth > $mask.width()) that.buttons.next.on(); // Activate Next button if items amount is over carousel size
		that.buttons.position();
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
 *	Dropdown
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	

ch.dropdown = function(conf){

/** 
 *  Constructor
 */
	
	var that = this;

	conf = ch.clon(conf);
	conf.skin = ( that.$element.hasClass("secondary") ) ? "secondary": "primary";

	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.navs.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */
	

/**
 *  Protected Members
 */ 
	that.$container = that.$element.addClass("ch-dropdown");
	
	that.$trigger = that.$container.children(":first");
	
	that.show = function(event){
		that.prevent(event);
		
		// Toggle
		if ( that.active ) {
			return that.hide(event);
		};
		
        // Reset all dropdowns
		$(ch.instances.dropdown).each(function(i, e){ e.hide(); });
		
        // Show menu
		that.$content.css('z-index', ch.utils.zIndex ++);
		that.$trigger.css('z-index', ch.utils.zIndex ++); // Z-index of trigger over content		
		that.parent.show(event);
		that.position("refresh");
		
		// Secondary behavior
		if(conf.skin == "secondary"){
			that.$container.addClass("ch-dropdown-on"); // Container ON
		};
		
		// Close events
		ch.utils.document.one("click", function(event){ that.hide(event); });
		ch.utils.document.bind(ch.events.KEY.ESC, function(event){ that.hide(event) });
		
		// Select first anchor child by default
		var items = that.$content.find("a");
			items.eq(0).focus();
		
		// More than one item
		if(items.length == 0) return that;
		
		// Keyboard support
		var itemSelected = 0;
		
		// Item selected by mouseover
		// TODO: It's over keyboard selection and it is generating double selection.
		items.each(function(i, e){
			$(e).bind("mouseenter", function(){
				itemSelected = i;
				items.eq( itemSelected ).focus();
			});
		});
		
		var selectItem = function(arrow, event){
			that.prevent(event);
			
			if(itemSelected == ((arrow == "down") ? items.length - 1 : 0)) return;
			
			items.eq( itemSelected ).blur();
			
			if(arrow == "down") itemSelected ++; else itemSelected --;
			
			items.eq( itemSelected ).focus();
		};
		
		// Arrows
		ch.utils.document.bind(ch.events.KEY.UP_ARROW, function(x, event){ selectItem("up", event); });
		ch.utils.document.bind(ch.events.KEY.DOWN_ARROW, function(x, event){ selectItem("down", event); });
		
        return that;
    };
	
    that.hide = function(event){
    	that.prevent(event);
    	
    	if (!that.active) return;
    	
    	// Secondary behavior
		if(conf.skin == "secondary"){
			that.$container.removeClass("ch-dropdown-on"); // Container OFF
		};
		
        that.parent.hide(event);
        
        // Unbind events
        ch.utils.document.unbind(ch.events.KEY.UP_ARROW);
        ch.utils.document.unbind(ch.events.KEY.DOWN_ARROW);
        ch.utils.document.unbind(ch.events.KEY.ESC);
        
        return that;
	};
	
/**
 *  Public Members
 */
   	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};
	
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
	
	that["public"].position = that.position;	


/**
 *  Default event delegation
 */		    
    // Trigger
	that.$trigger
		.bind("click", function(event){ that.show(event) })
		.addClass("ch-dropdown-trigger-" + conf.skin)
		.append("<span class=\"ch-down\"> &raquo;</span>");

	// Content
	that.$content = that.$trigger.next()
		.addClass("ch-dropdown-content-" + conf.skin)
		.addClass("ch-hide")
		.bind("click", function(event){
			event.stopPropagation(); // Prevent click on content (except links)
		})
		.detach(); // Save on memory;
	
	// Close dropdown after click an option (link)
	that.$content.find("a").one("click", function(){ that.hide(); });

	// Put content out of container
	that.$container.after( that.$content );
		
	// Position
	that.conf.position = {};
	that.conf.position.element = that.$content;
	that.conf.position.context = that.$trigger;
	that.conf.position.points = "lt lb";
	that.conf.position.offset = "0 -1";
	
	return that;

};
/**
 *	Context Layer
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ch.layer = function(conf) {

    
/**
 *	Constructor
 *	Guardo el contexto de ejecucion (this) que viene con 3 propiedades del factory (uid, element, type).
 *	Luego, seteamos la configuracion bÃ¡sica del componente y lo guardamos en el contexto para que llegue a sus padres cuando pasamos el contexto (that.conf)
 */

	var that = this;
	
	conf = ch.clon(conf);
	conf.cone = true;
	conf.classes = "box";
	conf.position = {};
	conf.position.context = that.$element;
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";

	that.conf = conf;

/**
 *	Inheritance
 *		
 */

    that = ch.floats.call(that);
    that.parent = ch.clon(that);
    
/**
 *  Private Members
 */
 
    var showTime = conf.showTime || 400;
    var hideTime = conf.hideTime || 400;

	var st, ht; // showTimer and hideTimer
	
	var showTimer = function(){ st = setTimeout(that.show, showTime) };
	var hideTimer = function(){ ht = setTimeout(that.hide, hideTime) };
	
	var clearTimers = function(){ clearTimeout(st); clearTimeout(ht); };

/**
 *  Protected Members
 */
	
	that.$trigger = that.$element;
	
	that.show = function(event) {
	
		// Reset all layers
		$.each(ch.instances.layer, function(i, e){ e.hide(); });
		//conf.position.context = that.$element;
		that.parent.show(event);

		that.$container.bind('click', function(event){ event.stopPropagation() });
        
        // Click
        if (conf.event == "click") {
			conf.close = true;
            // Document events
            $(document).one('click', that.hide);
            
        // Hover
        } else {      	
        	clearTimers();    
        	that.$container
        		.one("mouseenter", clearTimers)
        		.bind("mouseleave", function(event){
					var target = event.srcElement || event.target;
					var relatedTarget = event.relatedTarget || event.toElement;
					var relatedParent = relatedTarget.parentNode;
					if ( target === relatedTarget || relatedParent === null || target.nodeName === "SELECT" ) return;
					hideTimer();
        		});
        };
        
        return that;
    };

/**
 *  Public Members
 */
   	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].content = that.content;
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};
	
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
	
	that["public"].position = that.position;
	
/**
 *  Default event delegation
 */
	// Click
	if(conf.event === 'click') {
		// Local configuration
		conf.closeButton = true;

		// Trigger events
		that.$trigger
			.css('cursor', 'pointer')
			.bind('click', that.show);

	// Hover
	} else {
		// Trigger events
		that.$trigger
			.css('cursor', 'default')
			.bind('mouseenter', that.show)
			.bind('mouseleave', hideTimer);
	};

    // Fix: change layout problem
    $("body").bind(ch.events.CHANGE_LAYOUT, function(){ that.position("refresh") });
 

	return that;

};
/**
 *	@class Modal. Create and manage modal windows
 *  @requires: floats.
 *	@return Public Object.
 */

ch.modal = function(conf){

/**
 *	Constructor
 *	Guardo el contexto de ejecucion (this) que viene con 3 propiedades del factory (uid, element, type).
 *	Luego, seteamos la configuracion bÃ¡sica del componente y lo guardamos en el contexto para que llegue a sus padres cuando pasamos el contexto (that.conf).
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
	
	// Set dimmer height for IE6
	if (ch.utils.html.hasClass("ie6")) { $dimmer.height( parseInt(document.documentElement.clientHeight, 10) * 3) };
	
	// Dimmer Controller
	var dimmer = {
		on: function() { //TODO: posicionar el dimmer con el positioner
			$dimmer
				.appendTo("body")
				.css("z-index", ch.utils.zIndex ++)
				.fadeIn();
		
			if (that.type == "modal") {
				$dimmer.one("click", function(event){ that.hide(event) });
			};
			
			if (!ch.features.fixed) {
			  	ch.positioner({ element: $dimmer });
			};
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
   	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].content = that.content;
	
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};
	
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
	
	that["public"].position = that.position;
 
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

ch.factory({ component: 'transition' });
/**
 *	Tabs Navigator
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ch.tabNavigator = function(conf){

/** 
 *  Constructor
 */
	
	var that = this;

	that.$element.addClass('ch-tabNavigator');
		
	conf = ch.clon(conf);
	conf.selected = conf.selected || conf.value || 0;
	
	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */
	
	var ul = that.$element.children(':first').addClass('ch-tabNavigator-triggers');
	
	var hash = window.location.hash.replace("#!", "");
	
    var hashed = false;
    
    var selected = conf.selected;

/**
 *  Protected Members
 */ 
 
 	that.$trigger = ul.find('a');
	that.$content = ul.next().addClass('ch-tabNavigator-content box');
	
	that.select = function(tab){		
		
		selected = parseInt(tab);
		
		tab = that.children[selected];
		
		if(tab.active) return; // Don't click me if I'm open

		// Hide my open bro
		$.each(that.children, function(i, e){
			if( e.active ) e.hide();
		});
        
        tab.shoot();
        
        //Change location hash
		window.location.hash = "#!" + tab.$content.attr("id");		
		
		// Callback
		that.callbacks("onSelect");
		
        return that;
	};
    
/**
 *  Public Members
 */
	
	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].children = that.children;
	that["public"].select = function(tab){
		that.select(tab);
		
		return that["public"];
	};	
	that["public"].getSelected = function(){ return selected; };
	
/**
 *  Default event delegation
 */	
    
	// Create children
	$.each(that.$trigger, function(i, e){
		var tab = {};
			tab.uid = that.uid + "#" + i;
			tab.type = "tab";
			tab.element = e;
			tab.$element = $(e);
			
		that.children.push( ch.tab.call(tab, that) );
	});
	
	//Default: Load hash tab or Open first tab	
	for(var i = that.children.length; i--; ){
		if ( that.children[i].$content.attr("id") === hash ) {
			that.select(i);
			
			hashed = true;
			
			break;
		};
	};

	if ( !hashed ) that.children[conf.selected].shoot();

	return that;
	
};


/**
 *	Tab
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ch.tab = function(controller){

/** 
 *  Constructor
 */
	
	var that = this;
	
	conf = {};
	if ( controller.conf.hasOwnProperty("onContentLoad") ) conf.onContentLoad = controller.conf.onContentLoad;
	if ( controller.conf.hasOwnProperty("onContentError") ) conf.onContentError = controller.conf.onContentError;	
	
	that.conf = conf;
/**
 *	Inheritance
 */

    that = ch.navs.call(that);
    that.parent = ch.clon(that);
	that.controller = controller;

/**
 *  Private Members
 */
	
	
/**
 *  Protected Members
 */ 
	
	that.$trigger = that.$element.addClass("ch-tabNavigator-trigger");
	
	that.$content = (function(){
		
		var content = controller.$element.find("#" + that.element.href.split("#")[1]);
		
		// If there are a tabContent...
		if ( content.length > 0 ) {
			
			return content;
		
		// If tabContent doesn't exists        
		} else {
			// Set ajax configuration
			conf.ajax = true;

			// Create tabContent
			return $("<div>")
				.attr("id", (that.element.href.split("#").length == 2) ? that.element.href.split("#")[1] : "ch-tab" + that.uid.replace("#","-") )
				.addClass("ch-hide")
				.appendTo( controller.$content );
		}; 

	})();
	
	// Process show event
	that.shoot = function(event){
		that.prevent(event);

		// Load my content if I'need an ajax request 
		if( that.$content.html() == "" ) that.$content.html( that.loadContent() );

		// Show me
		that.show(event);
		
		return that;
	};

/**
 *  Public Members
 */
	
	
/**
 *  Default event delegation
 */	 	
	
	// Hide my content if im inactive
	if(!that.active) that.$content.addClass("ch-hide");

	that.$trigger.bind('click', function(event){
		that.prevent(event);
		controller.select(that.uid.split("#")[1]);
	});
	
	return that;
}
/**
 *	Tooltip
 *	@author 
 *	@Contructor
 *	@return An interface object
 *  @memberOf ch.Floats
 */

ch.tooltip = function(conf) {
    
/**
 *	Constructor
 *	Guardo el contexto de ejecucion (this) que viene con 3 propiedades del factory (uid, element, type).
 *	Luego, seteamos la configuracion bÃ¡sica del componente y lo guardamos en el contexto para que llegue a sus padres cuando pasamos el contexto (that.conf)
 */

	var that = this;
	
	conf = ch.clon(conf);
	conf.cone = true;
	conf.content = that.element.title;	
	conf.position = {};
	conf.position.context = $(that.element);
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";
	
	that.conf = conf;
	
/**
 *	Inheritance
 *		
 */

    that = ch.floats.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

    
/**
 *  Protected Members
 */     
    that.$trigger = that.$element;

    that.show = function(event) {
        that.$trigger.attr('title', ''); // IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
		that.parent.show(event);
		
		return that;
	};
	
    that.hide = function(event) {
		that.$trigger.attr('title', conf.content);
		that.parent.hide(event);
		
		return that;
    };

/**
 *  Public Members
 */
 	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].content = that.content;
	that["public"].show = function(){
		that.show();

		return that["public"];
	};
	that["public"].hide = function(){
		that.hide();

		return that["public"];
	};	
	that["public"].position = that.position;
    


/**
 *  Default event delegation
 */	
 	
	that.$trigger
		.bind('mouseenter', that.show)
		.bind('mouseleave', that.hide);

    // Fix: change layout problem
    $("body").bind(ch.events.CHANGE_LAYOUT, function(){ that.position("refresh") });


	return that;
};
/**
 *	@Interface String validations
 *	@return An interface object
 */

ch.string = function(conf) {

/**
 *  Constructor
 */
	conf = conf || {};
	
    conf.messages = conf.messages || {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.string = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };
    
    // $.string("message"); support
    if ( !conf.text && !conf.email && !conf.url && !conf.maxLength && !conf.minLength ) {
        conf.text = true;
    };

	// Add validation types
	conf.types = "text,email,url,minLength,maxLength";
    
    // Define the conditions of this interface
    conf.conditions = {
		text:       { patt: /^([a-zA-Z\s]+)$/ },
        email:      { patt: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/ },
        //url:        { patt: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ },
        // TODO: Improve this expression.
       	//url:        { patt: /((ftp|http|https):\/\/)?(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ },
        url:		{ patt: /^((https?|ftp|file):\/\/|((www|ftp)\.)|(\/|.*\/)*)[a-z0-9-]+((\.|\/)[a-z0-9-]+)+([/?].*)?$/ },
        minLength:  { expr: function(a,b) { return a >= b } },
        maxLength:  { expr: function(a,b) { return a <= b } }
        // Conditions map TODO: uppercase, lowercase, varchar
    };


	return ch.watcher.call(this, conf);
    
};


/**
 *	@Interface Email validations
 *	@return An interface object
 */

ch.email = function(conf) {
    
    conf = conf || {};
	
	conf.email = true;
	
	conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.email = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.string.call(this, conf);
    
};

ch.factory({ component: 'email' });

/**
 *	@Interface URL validations
 *	@return An interface object
 */

ch.url = function(conf) {
    
    conf = conf || {};
	
	conf.url = true;
	
	conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.url = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.string.call(this, conf);
    
};

ch.factory({ component: 'url' });

/**
 *	@Interface MinLength validations
 *	@return An interface object
 */

ch.minLength = function(conf) {
    
    conf = conf || {};
	
	conf.minLength = conf.value;
	
	conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.minLength = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.string.call(this, conf);
    
};

ch.factory({ component: 'minLength' });

/**
 *	@Interface MaxLength validations
 *	@return An interface object
 */

ch.maxLength = function(conf) {
    
    conf = conf || {};
	
	conf.maxLength = conf.value;
	
	conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.maxLength = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.string.call(this, conf);
    
};

ch.factory({ component: 'maxLength' });/**
 *	Number validations
 *	@author
 *	@Contructor
 *	@return An interface object
 */


ch.number = function(conf) {

/**
 *  Constructor
 */

	conf = conf || {};
	
    conf.messages = conf.messages || {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.number = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };
    
    // $.number("message"); support
	if ( !conf.number && !conf.min && !conf.max && !conf.price ) {
		conf.number = true;
	};
  
	// Add validation types
	conf.types = "number,min,max,price";
    
    // Define the conditions of this interface
    conf.conditions = {
		number: { patt: /^([0-9\s]+)$/ },
        min:    { expr: function(a,b) { return a >= b } },
        max:    { expr: function(a,b) { return a <= b } },
		price:  { patt: /^(\d+)[.,]?(\d?\d?)$/ }
		// price:  { patt: /^\d (\Z|[\.]\d )$/ }
		// float: TODO       
    };


	return ch.watcher.call(this, conf);
    
};

/**
 *	@Interface Min validations
 *	@return An interface object
 */

ch.min = function(conf) {
    
    conf = conf || {};
	
	conf.min = conf.value;
	
	conf.value = null;
	
	delete conf.value;
	
	conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.min = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.number.call(this, conf);
    
};

ch.factory({ component: 'min' });

/**
 *	@Interface Max validations
 *	@return An interface object
 */
 
ch.max = function(conf) {
    
    conf = conf || {};
	
	conf.max = conf.value;
	
	conf.value = null;
	
	delete conf.value;
	
	conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.max = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.number.call(this, conf);
    
}

ch.factory({ component: 'max' });


/**
 *	@Interface Price validations
 *	@return An interface object
 */
 
ch.price = function(conf) {
    
    conf = conf || {};
	
	conf.price = true;
	
	conf.value = null;
	
	delete conf.value;
	
	conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) { 
		conf.messages.price = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.number.call(this, conf);
    
}

ch.factory({ component: 'price' });
/**
 *	Custom validations
 *  @Extends Watcher
 *	@Interface
 */

ch.custom = function(conf) {

/**
 *  Validation
 */	
	
	if (!conf.lambda) {
        alert("Custom Validation fatal error: Need a function to evaluate, try $().custom(function(){},\"Message\");");
    };

/**
 *  Constructor
 */

	conf = conf || {};
    conf.messages = conf.messages || {};

    if ( conf.hasOwnProperty("msg") ) { 
    	conf.messages.custom = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };
    
	// Define the validation interface    
    conf.custom = true;

	// Add validation types
	conf.types = "custom";
    // Define the conditions of this interface
    conf.conditions = {
		// I don't have pre-conditions, comes within an argument 
        custom: { func: conf.lambda }       
    };


	return ch.watcher.call(this, conf);
    
};/**
 *	Required validations
 *  @Extends Watcher
 *	@Interface
 */

ch.required = function(conf) {
/**
 *  Constructor
 */
	
	conf = conf || {};
	
    conf.messages = {};

    if ( conf.hasOwnProperty("msg") ) {     	
    	conf.messages.required = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };
    
	// Define the validation interface    
    conf.required = true;
    
    // Add validation types
	conf.types = "required";
    // Define the conditions of this interface
    conf.conditions = {
        required: 'that.isEmpty' // This pattern is diferent
    };
	
	return ch.watcher.call(this, conf);
    
};/**
 *	Helper
 */

ch.helper = function(controller){

/** 
 *  Constructor
 */
	
	var that = this;

	var conf = {};		
		conf.cone = true;
		conf.position = {};
		conf.position.context = controller.reference;
		conf.position.offset = "15 0";
		conf.position.points = "lt rt";
		conf.cache = false;
	
	that.conf = conf;

/**
 *	Inheritance
 */

    that = ch.floats.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */



/**
 *  Protected Members
 */ 
	that.$trigger = that.$element;
	
	that.show = function(text) {

		if ( !that.active ) {
			// Load content and show!
			conf.content = '<p><span class="ico error">Error: </span>' + text + '</p>';
			that.parent.show();
			
		} else {
			// Just Reload content!
			that.$content.html('<p><span class="ico error">Error: </span>' + text + '</p>');
			
		};

		return that;
	};

/**
 *  Public Members
 */

   	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].content = that.content;
	that["public"].show = function(text){
		that.show(text);
		
		return that["public"];
	};
	
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
	
	that["public"].position = that.position;


/**
 *  Default event delegation
 */

    $("body").bind(ch.events.CHANGE_LAYOUT, function(){ 
        that.position("refresh");
    });

	 
	return that;
};
/**
 *	Form Controller
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ch.form = function(conf){

/**
 *  Validation
 */
	// Are there action and submit type?
	if ( this.$element.find(":submit").length == 0 || this.$element.attr("action") == "" ){ 
		alert("Form fatal error: The <input type=submit> is missing, or need to define a action attribute on the form tag.");
		return;
	};

	// Is there form in map instances?	
	if ( ch.instances.hasOwnProperty("form") && ch.instances.form.length > 0 ){
		for(var i = 0, j = ch.instances.form.length; i < j; i++){
			if(ch.instances.form[i].element === this.element){
				return { 
	                exists: true, 
	                object: ch.instances.form[i]
	            };
			};
		};
	};

/**
 *  Constructor
 */
	var that = this;
	
	conf = ch.clon(conf);
	// Create the Messages for General Error
	if ( !conf.hasOwnProperty("messages") ) conf.messages = {};
	conf.messages["general"] = conf.messages["general"] || "Check for errors.";	
	
	// Disable HTML5 browser-native validations
	that.$element.attr("novalidate", "novalidate");	
	
	that.conf = conf;

/**
 *  Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);
	
	
/**
 *  Private Members
 */
 
	var status = true;
	
	// General Error
	var $error = $("<p class=\"ch-validator\"><span class=\"ico error\">Error: </span>" + conf.messages["general"] + "</p>");
	
	// Create
	var createError = function(){ 
		that.$element.before( $error );		
		$("body").trigger(ch.events.CHANGE_LAYOUT);
	};
	
	// Remove
	var removeError = function(){
		$error.detach();
		$("body").trigger(ch.events.CHANGE_LAYOUT);
	};

	var checkStatus = function(){
		// Check status of my childrens
		for(var i = 0, j = that.children.length; i < j; i ++){
			// Status error (cut the flow)
			if( that.children[i].active() ){
				if ( !status ) removeError();			
				createError();
				status = false;
				return;
			};
		};

		// Status OK (with previous error)
		if ( !status ) {
			removeError();
			status = true;
		};

	};

	var validate = function(){

        that.callbacks("beforeValidate");

		// Shoot validations
		for(var i = 0, j = that.children.length; i < j; i ++){
			that.children[i].validate();
			// Issue UI-332: On validation must focus the first field with errors.
			// Doc: http://wiki.ml.com/display/ux/Mensajes+de+error
			if (i==0) that.children[i].element.focus();
		};

		checkStatus();
		
		status ? that.callbacks("onValidate") : that.callbacks("onError");  

        that.callbacks("afterValidate");
        
		return that;
	};

	var submit = function(event){

        that.prevent(event);
        
        that.callbacks("beforeSubmit");

		validate(); // Validate start
		
		if ( status ){ // Status OK
			if ( !conf.hasOwnProperty("onSubmit") ) {
				that.element.submit();
			}else{
				that.callbacks("onSubmit");
			};
		};		

        that.callbacks("afterSubmit");
        
		return that;
	};

	var clear = function(event){		
		that.prevent(event);		
		removeError();	
		for(var i = 0, j = that.children.length; i < j; i ++) that.children[i].reset(); // Reset helpers		
		
		that.callbacks("onClear");
		
		return that;
	};
	
	var reset = function(event){
		clear();
		that.element.reset(); // Reset html form native
		that.callbacks("onReset");
		
		return that;
	};


/**
 *  Protected Members
 */

	
			
/**
 *  Public Members
 */	

	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].children = that.children;
	that["public"].messages = conf.messages;
	that["public"].validate = function() { 
		validate(); 
		
		return that["public"]; 
	};
	
	that["public"].submit = function() { 
		submit(); 
		
		return that["public"]; 
	};
	
	that["public"].checkStatus = function() { 
		checkStatus(); 
		
		return that["public"]; 
	};
	
	that["public"].getStatus = function(){
		return status;	
	};
	
	that["public"].clear = function() { 
		clear(); 
		
		return that["public"]; 
	};
	
	that["public"].reset = function() { 
		reset(); 
		
		return that["public"]; 
	};


/**
 *  Default event delegation
 */	

	// patch exists because the components need a trigger
	if (conf.hasOwnProperty("onSubmit")) {
		that.$element.bind('submit', function(event){ that.prevent(event); });
		// Delete all click handlers asociated to submit button >NATAN: Why?
			//Because if you want do something on submit, you need that the trigger (submit button) 
			//don't have events associates. You can add funcionality on onSubmit callback
		that.$element.find(":submit").unbind('click');
	};

	// Bind the submit
	that.$element.bind("submit", function(event){
		submit(event);
	});
	
	// Bind the reset
	that.$element.find(":reset, .resetForm").bind("click", function(event){ reset(event); });

	return that;
};
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
	conf.width = $viewer.outerWidth();
	conf.height = $viewer.outerHeight();
	
	var $content = $viewer.children().addClass("ch-viewer-content carousel");

	/**
	 * 	Display
	 */
	var $display = $("<div>")
		.addClass("ch-viewer-display")
		.append( $content )
		.appendTo( $viewer )
		.carousel({
			width: conf.width,
			arrows: false,
			onMove: function(){
				var carousel = this;
				var page = carousel.getPage();
				that.move(page);

				// Resize display
				var currentHeight = $(itemsChildren[page - 1]).height();
				$viewer.find(".ch-mask").eq(0).height(currentHeight);
			}
		})

	var items = $content.children();
	var itemsAmount = items.length;
	var itemsAnchor = items.children("a");
	var itemsChildren = items.find("img, object");
	
	/**
	 * 	Zoom
	 */
	if( ch.hasOwnProperty("zoom") ) {
		var zoomChildren = [];
	
		$.each(itemsAnchor, function(i, e){
			
			var component = {
				uid: that.uid + "#" + i,
				type: "zoom",
				element: e,
				$element: $(e)
			};
			
			var config = {
	    		context: $viewer,
	    		onShow: function(){
	    			var rest = (ch.utils.body.outerWidth() - $viewer.outerWidth());
	    			var zoomDisplayWidth = (conf.width < rest)? conf.width :	(rest - 65 );
	    			this.width( zoomDisplayWidth );
	    			this.height( $viewer.height() );
	    		}
	    	};
			
			zoomChildren.push( ch.zoom.call(component, config) );
		});
		
		that.children.push( zoomChildren );
	};
	
	/**
	 * 	Thumbnails
	 */
	var createThumbs = function(){
	
		var structure = $("<ul>").addClass("carousel");
		
		$.each(items, function(i, e){
			
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
				.carousel({ width: conf.width });
		
		return self;
	};
	
	var move = function(item){
		// Validation
		if(item > itemsAmount || item < 1 || isNaN(item)) return that;

		// Visual config
		$(thumbnails.children[thumbnails.selected - 1]).removeClass("ch-thumbnail-on"); // Disable thumbnail
		$(thumbnails.children[item - 1]).addClass("ch-thumbnail-on"); // Enable next thumbnail
		
		// Move Display carousel
		$display.moveTo(item);
		
		// Move thumbnails carousel if item selected is in other page
		var nextThumbsPage = Math.ceil( item / thumbnails.carousel.getSteps() );
		if(thumbnails.carousel.getPage() != nextThumbsPage) thumbnails.carousel.moveTo( nextThumbsPage );
		
		// Buttons behavior
		if(item > 1 && item < itemsAmount){
			arrows.prev.on();
			arrows.next.on();
		} else {
			if(item == 1){ arrows.prev.off(); arrows.next.on(); };
			if(item == itemsAmount){ arrows.next.off(); arrows.prev.on(); };
		};
		
		// Refresh selected thumb
		thumbnails.selected = item;
		
		// Callback
		that.callbacks("onMove");
	
		return that;
	};
	
	// Arrows
	var arrows = {};
	
	arrows.prev = {
		$element: $("<p>").addClass("ch-viewer-prev").bind("click", function(){ that.prev(); }),
		on: function(){ arrows.prev.$element.addClass("ch-viewer-prev-on") },
		off: function(){ arrows.prev.$element.removeClass("ch-viewer-prev-on") }
	};
	
	arrows.next = {
		$element: $("<p>").addClass("ch-viewer-next").bind("click", function(){ that.next(); }),
		on: function(){ arrows.next.$element.addClass("ch-viewer-next-on") },
		off: function(){ arrows.next.$element.removeClass("ch-viewer-next-on") }
	};

/**
 *  Protected Members
 */ 
	
	that.prev = function(){
		that.move( thumbnails.selected - 1 );
		
		return that;
	};
	
	that.next = function(){
		that.move( thumbnails.selected + 1 );
		
		return that;
	};

/**
 *  Public Members
 */	

	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].children = that.children;
	
	// Full behavior
	if(itemsAmount > 1) {
		that["public"].moveTo = function(item){ that.move(item); return that["public"]; };
		that["public"].next = function(){ that.next(); return that["public"]; };
		that["public"].prev = function(){ that.prev(); return that["public"]; };
		that["public"].getSelected = function(){ return thumbnails.selected; }; // Is this necesary???
		// ...

/**
 *  Default event delegation
 */
	
		// ...
		
		// Create thumbnails
		var thumbnails = createThumbs();
		
		// Create Viewer buttons
		$viewer.append( arrows.prev.$element ).append( arrows.next.$element );
		
		// Create movement method
		that.move = move;
		that.move(1); // Move to the first item without callback
		arrows.next.on();
	};

	$viewer.find(".ch-mask").eq(0).height( $(itemsChildren[0]).height() );
	
	return that;
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

ch.chat = function(conf) {
    
   	var that = ch.object(); // Inheritance

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

   	ch.get({
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
ch.expando = function(conf){

/** 
 *  Constructor
 */
	
	var that = this;
	
	that.$element.addClass("ch-expando")
		.children(":first").wrapInner("<span class=\"ch-expando-trigger\"></span>");
		
    conf = ch.clon(conf);
    conf.open = conf.open || false;

	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.navs.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */
	
	

/**
 *  Protected Members
 */ 

	that.$content = that.$element.children().eq(1);
	that.$trigger = that.$element.find(".ch-expando-trigger");
	
	that.show = function(event){
		that.prevent(event);
		
		// Toggle
		if ( that.active ) {
			return that.hide(event);
		};
		
		that.parent.show(event);
		
		return that;
	};

/**
 *  Public Members
 */
   	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};
	
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
	

/**
 *  Default event delegation
 */		
    
	// Trigger
	that.$trigger
		.bind('click', function(event){	that.show(event); })
		.addClass('ch-expando-trigger');
		
	// Content
	that.$content.addClass('ch-expando-content ch-hide');
	
	// Change default behaivor (close)
	if( conf.open ) that.show();
	
    
    // Create the publish object to be returned
    conf.publish = that.publish;

	return that;

};
/**
 *	@Codelighter
 * 
 * ch.codelighter();
 * $(".xml").codeXML();
 */

ch.codelighter = function() {
/**
 *  Constructor
 */
	var that = this;
		
/**
 *  Inheritance
 */

    that = ch.controllers.call(that);
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
	
	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;	
	that["public"].children = that.children;	


/**
 *  Default event delegation
 */	

	$("pre[name=code]").each(function(i, e){
		
		var codesnippet = {};
			codesnippet.uid = ch.utils.index += 1;
			codesnippet.type = "codesnippet";
			codesnippet.element = e;
			codesnippet.snippet = e.innerHTML;			

		that.children.push( ch["code" + e.className.toUpperCase()].call(codesnippet) );

	});

	ch.instances.codelighter = that.children; // Create codeligther instance
	
	return that;
};



/**
 *	@Codesnippet
 */
 
ch.codesnippet = function(conf){
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

	var paint = function() {
		for (var x in conf.brush){
			if (conf.brush[ x ].test(that.paintedSnippet)) {
				that.paintedSnippet = that.paintedSnippet.replace(conf.brush[ x ], x);
			};
		};

		return that.paintedSnippet;
	};
 
/**
 *  Protected Members
 */ 

	that.paintedSnippet = that.snippet;	
			
/**
 *  Public Members
 */	

	that["public"] = {};
	that["public"].uid = that.uid;
	that["public"].type = conf.type;
	that["public"].element = that.element;
	that["public"].snippet = that.snippet;
	that["public"].paintedSnippet = that.paintedSnippet;	

/**
 *  Default event delegation
 */		 	
	
	that.element.innerHTML = paint();
	
	return that;
};


/**
 *	@Interface xml
 *	@return An interface object
 */

ch.codeXML = function(conf) {
    
/** 
 *  Constructor: Redefine or preset component's settings
 */

	conf = conf || {};
	
	conf.type = "codeXML";

	conf.brush = {
		"&lt;": /</g, // Menor
		"&gt;": />/g , // Mayor
		"<span class='ch-comment'>$&</span>": /(\&lt;|&lt;)!--\s*.*?\s*--(\&gt;|&gt;)/g, // comments		
		"<span class='ch-attrName'>$&</span>": /(id|name|class|title|alt|value|type|style|method|href|action|lang|dir|src|tabindex|usemap|data|rel|charset|encoding|size|selected|checked|placeholder|target|required|disabled|max|min|maxlength|accesskey)=".*"/g, // Attributes name
		"<span class='ch-attrValue'>$&</span>": /".+?"/g, // Attributes
		"<span class='ch-tag'>$&</span>": /(&lt;([a-z]|\/).*?&gt;)/g, // Tag
		"    ": /\t/g // Tab
	};
    
    this.snippet = this.snippet || this.element.innerHTML;
    
    return ch.codesnippet.call(this, conf);
    
};

ch.factory({ component: 'codeXML' });



/**
 *	@Interface js
 *	@return An interface object
 */

ch.codeJS = function(conf) {
    
/** 
 *  Constructor: Redefine or preset component's settings
 */
	
	conf = conf || {};
	
	conf.type = "codeJS";
	
	conf.brush = {
		"$1 $2 $3": /(<)([a-z]|\/|.*?)(>)/g,
		"<span class='ch-operator'>$&</span>": /(\+|\-|=|\*|&|\||\%|\!|\?)/g,
		">": />amp;/g,
		"<span class='ch-atom'>$&</span>": /(false|null|true|undefined)/g,		
		"$1<span class='ch-keywords'>$2</span>$3": /(^|\s|\(|\{)(return|new|delete|throw|else|case|break|case|catch|const|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|switch|throw|try|typeof|var|void|while|with)(\s*)/g,
		"<span class='ch-attrValue'>$&</span>": /(".+?")|[0-9]/g, // Attributes & numbers
		"    ": /\t/g, // Tab
		"<span class='ch-comment'>$&</span>": /(\/\*)\s*.*\s*(\*\/)/g, // Comments
		"<span class='ch-comment'>$&</span>": /(\/\/)\s*.*\s*\n*/g // Comments
		
	};
	    
    this.snippet = this.snippet || this.element.innerHTML;
    
    return ch.codesnippet.call(this, conf);
    
};

ch.factory({ component: 'codeJS' });


/**
 *	@Interface css
 *	@return An interface object
 */

ch.codeCSS = function(conf) {
    
/** 
 *  Constructor: Redefine or preset component's settings
 */
	
	conf = conf || {};
	
	conf.type = "codeCSS";
	
	conf.brush = {
		//"<span class='ch-selector'>$&</span>": /(a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1> - <h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|keygen|kbd|label|legend|li|link|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|u|ul|var|video|wbr|xmp)(\{*)/g, // Selectors
		"<span class='ch-comment'>$&</span>": /(\/\*)\s*.*\s*(\*\/)/g, // Comments
		"<span class='ch-attrName'>$&</span>": /(\w)\s*:".*"/g, // Attributes name
		"<span class='ch-selector'>$1$2</span>$3": /(#|\.)(\w+)({)/g, // Selectors
		"$1<span class='ch-property'>$2</span>$3": /({|;|\s)(\w*-*\w*)(\s*:)/g, // Properties
		"$1<span class='ch-attrValue'>$2</span>$3": /(:)(.+?)(;)/g, // Attributes
		"    ": /\t/g // Tab
	};
	
	this.snippet = this.snippet || this.element.innerHTML;
	
    return ch.codesnippet.call(this, conf);
    
};

ch.factory({ component: 'codeCSS' });/**
 *	Accordion
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ch.accordion = function(conf){

/** 
 *  Constructor
 */
	
	var that = this;

	that.$element.addClass('ch-accordion');
		
	conf = ch.clon(conf);
	
	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);

/**
 *  Protected Members
 */

/**
 *  Public Members
 */
	
	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].select = function(bellows){
		
		if(typeof bellows == "string") {
			var sliced = bellows.split("#");
		
			that.children[ sliced[0] ].select( sliced[1] );
		} else {
			that.children[ bellows ].show();
		};
		
		that.callbacks("onSelect");
		
		return that["public"];
	};	
	
/**
 *  Default event delegation
 */	
    
    // Children
	that.$element.children().each(function(i, e){
		
		var $child = $(e).children();
		
		// Link
		if($child.eq(0).prop("tagName") == "A") {
			$(e).addClass("ch-bellows").children().addClass("ch-bellows-trigger");
			that.children.push( $child[0] );
			return;
		};
		
		// Bellows
		var list = {};
			list.uid = that.uid + "#" + i;
			list.type = "bellows";
			list.element = e;
			list.$element = $(e);
			
		// Selected -> It can be for example "2" or "2#1"
		if(conf.hasOwnProperty("selected")) {
			list.open = (typeof conf.selected == "number") ? conf.selected == i : (conf.selected.split("#")[0] == i) ? conf.selected.split("#")[1] : false;
		} else {
			list.open = false;
		};
			
		that.children.push( ch.bellows.call(list, that) );
	});
    
    
	return that;
	
};


ch.bellows = function(controller){

/** 
 *  Constructor
 */
	
	var that = this;
	
	conf = {};
	
	that.conf = conf;
/**
 *	Inheritance
 */

    that = ch.navs.call(that);
    that.parent = ch.clon(that);
	that.controller = controller;
	
/**
 *  Protected Members
 */ 
	
	that.$container = that.$element.addClass("ch-bellows");
	
	that.$trigger = that.$container.children(":first");
	
	that.$content = that.$trigger.next();
	
	that.show = function(event){
		that.prevent(event);

		// Toggle
		if (that.active) return that.hide(event);

		// Accordion behavior (hide last active)
		if (!controller.conf.hasOwnProperty("menu")) {

			$.each(controller.children, function(i, e){
				if (e.tagName == "A") return;
				if ( e.hasOwnProperty("active") && e.hasOwnProperty("element") ) {
					if (e.active == true && e.element !== that.element) { e.hide(); };
				}; 
			});
			
		};
		
		that.$content.slideDown("fast");
        
        that.parent.show(event);
        
        return that;
    };
	
    that.hide = function(event){
    	that.prevent(event);
    	
    	// Toggle
    	if (!that.active) return;
    	
    	that.active = false;
    	
   		that.parent.hide(event);
    	that.$content.slideUp("fast");

        that.$trigger.removeClass("ch-" + that.type + "-on");
        
		if(!ch.utils.html.hasClass("ie6")) that.$content.slideUp("fast");
		
		that.callbacks("onHide");
		
        return that;
	};
	
	that.select = function(child) {
		that.show();
		
		// L2 selection
		that.$content.find("a").eq( child ).addClass("ch-bellows-on");
	};
	
	
/**
 *  Default event delegation
 */	 	
	
	// Closed by default
	if(that.open) that.select( parseInt(that.open) ); else that.$content.addClass("ch-hide");
	
	// Trigger
	that.$trigger
		.addClass("ch-bellows-trigger")
		.bind("click", function(event){ that.show(event) })
		.append("<span class=\"ch-arrow\"> &raquo;</span>");

	// Content
	that.$content
		.addClass("ch-bellows-content")
		.bind("click", function(event){ event.stopPropagation(); });
	
	
	return that;
};


/**
 *	@Interface Menu
 *	@return An interface object
 */

ch.menu = function(conf) {
    
    conf = conf || {};
	
	conf.menu = true;
	
	return ch.accordion.call(this, conf);
    
};

ch.factory({ component: 'menu' });
/**
 *	Zoom
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ch.zoom = function(conf) {

/**
 *	Constructor
 */

	var that = this;
	
	conf = ch.clon(conf);
	
	// Link source as zoomed image
	conf.content = $("<img>").attr("src", that.element.href);
	
	conf.position = {};
	conf.position.context = conf.context || that.$element;
	conf.position.offset = conf.offset || "20 0";
	conf.position.points = conf.points || "lt rt";
	conf.position.hold = true;
	
	conf.width = conf.width || 300;
	conf.height = conf.height || 300;
	
	conf.fx = false;

	that.conf = conf;

/**
 *	Inheritance
 */

    that = ch.floats.call(that);
    that.parent = ch.clon(that);
    
/**
 *  Private Members
 */
	
	var main = {};
		main.img = that.$element.children();
		main.w = main.img.width();
		main.h = main.img.height();
	
	var zoomed = {};
		zoomed.img = conf.content;
	
	// Magnifying glass
	//var $lens = $("<div>").addClass("ch-lens ch-hide");
	
	// Seeker
	var seeker = {};
		// TODO: Calc relativity like in that.size (en lugar de la division por 3)
		seeker.w = conf.width / 3;
		seeker.h = conf.height / 3;
		seeker.shape = $("<div>")
			.addClass("ch-seeker ch-hide")
			.bind("mousemove", function(event){ move(event); })
			.css({width: seeker.w, height: seeker.h});
	
	var move = function(event){
		var offset = main.img.offset();
		
		var x = event.pageX - offset.left;
		var y = event.pageY - offset.top;
		
		// Zoomed image
		zoomed.img.css({
			"left": -( ((zoomed.w * x) / main.w) - (conf.width / 2) ),
			"top": -( ((zoomed.h * y) / main.h) - (conf.height / 2) )
		});
		
		// Seeker shape
		seeker.shape.css({
			"left": x - (seeker.w / 2),
			"top": y - (seeker.h / 2)
		});
	};
	
/**
 *  Protected Members
 */
	
	that.$trigger = that.$element;
	
	that.show = function(event){
		that.prevent(event);
		
		// Floats show
		that.parent.show();
		
		// Magnifying glass
		//$lens.fadeIn();
		
		// Seeker
		seeker.shape.removeClass("ch-hide");
		
		return that;
	};
	
	that.hide = function(event){
		that.prevent(event);
		
		// Seeker
		seeker.shape.addClass("ch-hide");
		
		// Magnifying glass
		//$lens.fadeOut();
		
		// Floats hide
		that.parent.hide();
		
		return that;
	};
	
	that.enlarge = function(event){
		that.prevent(event);
		
		// Open pop-up
	};
	
	that.size = function(attr, data) {
		if (!data) return conf[attr]; // Getter
		
		// Size of zoomed image
		zoomed.w = zoomed.img.width();
		zoomed.h = zoomed.img.height();
		zoomed.ref_x = (zoomed.w / main.w - 1);
		zoomed.ref_y = (zoomed.h / main.h - 1);
		
		var at = attr.substr(0,1);
		
		// Configuration
		that.conf[attr] = data;
		
		// Container
		that.$container[attr](data);
		
		// Seeker
		var rel = (main[at] * data) / zoomed[at];
		seeker[at] = rel;
		seeker.shape[attr](rel);

		return that["public"];
	};

/**
 *  Public Members
 */
   	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].content = that.content;
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};
	
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
	
	that["public"].position = that.position;
	
	that["public"].width = function(data){ that.size("width", data); };
	that["public"].height = function(data){ that.size("height", data) };

	
/**
 *  Default event delegation
 */
	
	// TODO: El setTimeout soluciona problemas en el viewer
	setTimeout( function(){
		that.$element
			.addClass("ch-zoom-trigger")
			
			// Magnifying glass
			//.append( $lens )
			
			// Seeker
			.append( seeker.shape )
			
			// Size (same as image)
			.css({"width": main.w, "height": main.h})
			
			// Show
			.bind("mouseover", that.show)
			
			// Hide
			.bind("mouseleave", that.hide)
			
			// Move
			.bind("mousemove", function(event){ move(event); })
			
			// Enlarge
			.bind("click", function(event){ that.enlarge(event); });
	},50);	
	
	// Preload zoomed image
	if(ch.hasOwnProperty("preload")) ch.preload(that.element.href);
	
	return that;
};

ch.init();
})(jQuery);