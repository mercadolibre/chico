/**
  * Chico-UI
  * Packer-o-matic
  * Like the pizza delivery service: "Les than 100 milisecons delivery guarantee!"
  * @components: core, cache, positioner, object, floats, navs, controllers, watcher, keyboard, preload, list, extend, onImagesLoads, blink, carousel, calendar, dropdown, layer, modal, tabNavigator, tooltip, string, number, custom, required, helper, form, viewer, expando, menu, zoom
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

/**
 * Chico-UI namespace
 * @namespace ch
 * @name ch
 */

var ch = window.ch = {

	/**
	* Current version
	* @name version
	* @type {Number}
	* @memberOf ch
	*/
	version: "0.7.1",
	/**
	* List of UI components available.
	* @name components
	* @type {String}
	* @memberOf ch
	*/
	components: "blink,carousel,calendar,dropdown,layer,modal,tabNavigator,tooltip,string,number,custom,required,helper,form,viewer,expando,menu,zoom",
	/**
	* List of internal components available.
	* @name internals
	* @type {String}
	* @memberOf ch
	*/
	internals: "cache,positioner,object,floats,navs,controllers,watcher,keyboard,preload,list,extend,onImagesLoads",
	/**
	* Here you will find a map of all component's instances created by Chico-UI.
	* @name instances
	* @type {Map Object}
	* @memberOf ch
	*/
	instances: {},
	/**
	* Available device's features.
	* @name features
	* @type {Map Object}
	* @see ch.Support
	* @memberOf ch
	*/
	features: {},
	/**
	* Core constructor function.
	* @name init
	* @function
	* @memberOf ch
	*/
	init: function() { 
		// unmark the no-js flag on html tag
		$("html").removeClass("no-js");
		// check for browser support
		ch.features = ch.support();
		// iterate and create components  			
		$(ch.components.split(",")).each(function(i,e){ ch.factory({component:e}); });
		// TODO: This should be on keyboard controller.
		ch.utils.document.bind("keydown", function(event){ ch.keyboard(event); });
	},
	/**
	* References and commons functions.
	* @name utils
	* @type {Object Literal}
	* @memberOf ch
	*/
	utils: {
		body: $("body"),
		html: $("html"),
		window: $(window),
		document: $(document),
		zIndex: 1000,
		index: 0, // global instantiation index
		isTag: function(string){
			return (/<([\w:]+)/).test(string);
		},
		isSelector: function(string){
			if (typeof string !== "string") return false;
			for (var regex in $.expr.match){
				if ($.expr.match[ regex ].test(string) && !ch.utils.isTag(string)) {
					return true;
				};
			};
			return false;
		},
		inDom: function (selector, context) {
			
			if ($(selector, context).length > 0) {
				return true;
			}

			return false;
		},
		isArray: function( o ) {
			return Object.prototype.toString.apply( o ) === "[object Array]";
		},
		isUrl: function(url){
			return ((/^((http(s)?|ftp|file):\/{2}(www)?|(\/?([\w]|\.{1,2})*\/)+|[\w]+(\.|\/|\:\d))([\w\-]*)?(((\.|\/)[\w\-]+)+)?([\/?]\S*)?/).test(url));
		},
		avoidTextSelection: function(){
			$.each(arguments, function(i, e){
				if ( $.browser.msie ) {
					$(e).attr('unselectable', 'on');
				} else if ($.browser.opera) {
					$(e).bind("mousedown", function(){ return false; });
				} else { 
					$(e).addClass("ch-user-no-select");
				};
			});
			return;
		},
		hasOwn: function(o, property) {
			return Object.prototype.hasOwnProperty.call(o, property);
		},
		// Based on: http://www.quirksmode.org/dom/getstyles.html
		getStyles: function (element, style) {
			// Main browsers
			if (window.getComputedStyle) {
				
				return getComputedStyle(element, "").getPropertyValue(style);
			
			// IE
			} else {
				
				// Turn style name into camel notation
				style = style.replace(/\-(\w)/g, function (str, $1) { return $1.toUpperCase(); });
				
				return element.currentStyle[style];
				
			}
		}
	},

	/**
	 * Chico-UI global events reference.
	 * @abstract
	 * @name Events
	 * @class Events
	 * @type {Map Object}
	 * @memberOf ch 
	 * @see ch.Events.KEY
	 */	
	events: {
		/**
		 * Layout event collection.
		 * @name LAYOUT
		 * @namespace LAYOUT
		 * @memberOf ch.Events
		 */
		LAYOUT: {
			/**
			 * Every time Chico-UI needs to inform al visual components that layout has been changed, he triggers this event.
			 * @name CHANGE
			 * @memberOf ch.Events.LAYOUT
			 * @see ch.Form
			 * @see ch.Layer
			 * @see ch.Tooltip
			 * @see ch.Helper 
			 */
			CHANGE: "change"
		},
		/**
         * Viewport event collection.
         * @name VIEWPORT
         * @namespace VIEWPORT
         * @memberOf ch.Events
         */
        VIEWPORT: {
            /**
             * Every time Chico-UI needs to inform all visual components that window has been scrolled, he triggers this event.
             * @name SCROLL
             * @memberOf ch.Events.VIEWPORT
             * @see ch.Viewport
             */
            SCROLL: "ch-scroll",
            /**
             * Every time Chico-UI needs to inform all visual components that window has been resized, he triggers this event.
             * @name RESIZE
             * @memberOf ch.Events.VIEWPORT
             * @see ch.Viewport
             */
            RESIZE: "ch-resize"
        },
		/**
		 * Keryboard event collection.
		 * @name KEY
		 * @namespace KEY
		 * @memberOf ch.Events
		 */
		KEY: {
			/**
			 * Enter key event.
			* @name ENTER
			* @memberOf ch.Events.KEY
			*/
			ENTER: "enter",
			/**
			* Esc key event.
			* @name ESC
			* @memberOf ch.Events.KEY
			*/
			ESC: "esc",
			/**
			* Left arrow key event.
			* @name LEFT_ARROW
			* @memberOf ch.Events.KEY
			*/
			LEFT_ARROW: "left_arrow",
			/**
			* Up arrow key event.
			* @name UP_ARROW
			* @memberOf ch.Events.KEY
			*/
			UP_ARROW: "up_arrow",
			/**
			* Rigth arrow key event.
			* @name RIGHT_ARROW
			* @memberOf ch.Events.KEY
			*/
			RIGHT_ARROW: "right_arrow",
			/**
			* Down arrow key event.
			* @name DOWN_ARROW
			* @memberOf ch.Events.KEY
			*/
			DOWN_ARROW: "down_arrow"
		}
	}
};



/** 
 * UI feedback utility, creates a visual highlight
 * changing background color from yellow to white.
 * @function
 * @name blink
 * @param {Array} [o] Array of Objects to blink
 * @param {Selector} [selector] CSS Selector to blink a collection
 * @param {jQueryObject} [$object] jQuery Object to blink
 * @returns {Object}
 * @memberOf ch
 */
ch.blink = function (o, t) {
	if (!o) {
		return;
	}
	var level = 1, 
		t = t || 120,
		highlight = function (e) {
			function step () {
				var h = level.toString(16);
				e.style.backgroundColor = '#FFFF' + h + h;
					if (level < 15) {
						level += 1;
						setTimeout(step, t);
					}
		};
		setTimeout(step, t);
	}
	$(o).each(function (i,e) {
		highlight(e);
	});
}


/** 
 * Utility to clone objects
 * @function
 * @name clon
 * @param {Object} o Object to clone
 * @returns {Object}
 * @memberOf ch
 */
ch.clon = function(o) {

	obj = {};

	for (x in o) {
		obj[x] = o[x]; 
	};
	
	return obj;
};


/** 
 * Class to create UI Components
 * @abstract
 * @name Factory
 * @class Factory
 * @param {Configuration Object} o 
 * @example
 *   o {
 * 	component: "chat",
 * 	callback: function(){},
 * 	[script]: "http://..",
 * 	[style]: "http://..",
 * 	[callback]: function(){}	
 *   }
 * @returns {Collection} A collection of object instances
 * @memberOf ch
 */	

ch.factory = function(o) {

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

				created = ( ch.utils.hasOwn(created, "public") ) ? created["public"] : created;

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

			// return the created components collection or single component
			return ( results.length > 1 ) ? results : results[0];
		};

		// if a callback is defined 
		if ( o.callback ) { o.callback(); }

	} // end create function

	if ( ch[o.component] ) {
		// script already here, just create it
		create(o.component);

	} else {
		// get resurces and call create later
		ch.get({
			"method":"component",
			"component":o.component,
			"script": ( o.script )? o.script : "src/js/"+o.component+".js",
			"styles": ( o.style ) ? o.style : "src/css/"+x+".css",
			"callback":create
		});
	}
}

/**
 * Load components or content
 * @abstract
 * @name Get
 * @class Get
 * @param o {Object} object 
 * @example
 *   o {
 * 	component: "chat",
 * 	[script]: "http://..",
 * 	[style]: "http://..",
 * 	[callback]: function(){}
 *   }
 * @memberOf ch
 */
ch.get = function(o) {
	
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

	// Use insertBefore instead of appendChild to circumvent an IE6 bug.
	// This arises when a base node is used.
	if ( o.script ) { head.insertBefore( script, head.firstChild ); }
	if ( o.style ) { head.appendChild( style ); }

}


/**
 * Returns a data object with features supported by the device
 * @abstract
 * @name Support
 * @class Support
 * @returns {Object}
 * @memberOf ch 
 */
ch.support = function() {
	
	/**
	 * Private reference to the <body> element
	 * @private
	 * @name thisBody
	 * @type {HTMLBodyElement}
	 * @memberOf ch.Support
	 */
	var thisBody = document.body || document.documentElement;
	
	/**
	* Based on: http://gist.github.com/373874
	* Verify that CSS3 transition is supported (or any of its browser-specific implementations)
	*
	* @private
	* @returns {Boolean}
	* @memberOf ch.Support
	*/
	var transition = (function(){
		var thisStyle = thisBody.style;
		return thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.OTransition !== undefined || thisStyle.transition !== undefined;
	})();

	/**
	* Based on: http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED
	* Verify that position fixed is supported
	* 
	* @private
	* @returns {Boolean}
	* @memberOf ch.Support
	*/	
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
		/**
		* Boolean property that indicates if CSS3 Transitions are supported by the device.
		* @public
		* @name transition
		* @type {Boolean}
		* @memberOf ch.Support
		*/
		transition: transition,
		/**
		* Boolean property that indicates if Fixed positioning are supported by the device.
		* @public
		* @name fixed
		* @type {Boolean}
		* @memberOf ch.Support
		*/
		fixed: fixed
	};

};

/**
 * Cache control utility.
 * @abstract
 * @name Cache
 * @class Cache
 * @memberOf ch
 */
 
ch.cache = {

    /**
     * Map of resources cached
     * @name map 
     * @type {Object}
     * @memberOf ch.Cache
     */
    map: {},
    
    /**
     * Set a resource to the cache control
     * @function 
     * @name set
     * @param {String} url Resource location
     * @param {String} data Resource information
     * @memberOf ch.Cache
     */
    set: function(url, data) {
        ch.cache.map[url] = data;
    },
    
    /**
     * Get a resource from the cache
     * @function
     * @name get
     * @param {String} url Resource location
     * @returns {String} data Resource information
     * @memberOf ch.Cache
     */
    get: function(url) {
        return ch.cache.map[url];
    },
    
    /**
     * Remove a resource from the cache
     * @function
     * @name rem
     * @param {String} url Resource location
     * @memberOf ch.Cache
     */
    rem: function(url) {
        ch.cache.map[url] = null;
        delete ch.cache.map[url];
    },
    
    /**
     * Clears the cache map
     * @function
     * @name flush
     * @memberOf ch.Cache
     */
    flush: function() {
        delete ch.cache.map;
        ch.cache.map = {};
    }
};
/**
 * Positioner is a utility that resolve positioning problem for all UI-Objects.
 * @abstract
 * @name Positioner
 * @class Positioner
 * @memberOf ch
 * @param {Position Object} o Object with positioning properties
 * @returns {jQuery Object}
 * @example
 * // First example
 * ch.positioner({
 *     element: $("#element1"),
 *     context: $("#context1"),
 *     points: "lt rt"                //  Element left-top point = Context left-bottom point
 * });
 * @example  
 * // Second example
 * ch.positioner({
 *     element: $("#element2"),
 *     context: $("#context2"),
 *     points: "lt lb"                //  Element center-middle point = Context center-middle point
 * });
 */
 
ch.positioner = function(o) {

    /**
     * Constructs a new positioning, get viewport size, check for relative parent's offests, 
     * find the context and set the position to a given element.
     * @constructs
     * @private
     * @function
     * @name initPosition
     * @memberOf ch.Positioner
     */
    var initPosition = function(){
        viewport = getViewport();
        parentRelative = getParentRelative();
        context = getContext();
        setPosition();   
    };


    /**
     * Object that contains all properties for positioning
     * @private
     * @name o
     * @type {Position Object}
     * @example
     * ch.Positioner({
     *   element: $element
     *   [context]: $element | viewport
     *   [points]: "cm cm"
     *   [offset]: "x y" 
     *   [hold]: false
     * });
     * @memberOf ch.Positioner
     */
	var o = o || this.conf.position;
        o.points = o.points || "cm cm";
        o.offset = o.offset || "0 0";
    
    /**
     * Reference to the DOM Element beign positioned
     * @private
     * @name element
     * @type {jQuery Object}
     * @memberOf ch.Positioner
     */
	var element = $(o.element);
		element.css("position","absolute");
    
    /**
     * Reference to the DOM Element that we will use as a reference
     * @private
     * @name context
     * @typeÂ {HTMLElement}
     * @memberOf ch.Positioner
     */
	var context;
    
    /**
     * Reference to the Window Object and it's size
     * @private
     * @name viewport
     * @type {Viewport Object}
     * @memberOf ch.Positioner
     */
	var viewport;
	
    /**
     * Reference to the element beign positioned
     * @private
     * @name parentRelative
     * @memberOf ch.Positioner
     */
	var parentRelative;

    /**
     * A map to reference the input points to output className
     * @private
     * @name _CLASS_REFERENCES
     * @memberOf ch.Positioner
     */
    var _CLASS_REFERENCES = {
		"lt lb": "ch-left ch-bottom",
		"lb lt": "ch-left ch-top",
		"rt rb": "ch-right ch-bottom",
		"rb rt": "ch-right ch-top",
		"lt rt": "ch-right",
		"cm cm": "ch-center"
	};

    /**
     * Array with offset information
     * @private
     * @name splittedOffset
     * @memberOf ch.Positioner
     */
    var splittedOffset = o.offset.split(" ");
   	/**
     * String with left offset information
     * @private
     */
   	var offset_left = parseInt(splittedOffset[0]);
   	/**
     * String with top offset information
     * @private
     */
    var offset_top = parseInt(splittedOffset[1]);

    /**
     * Get the viewport size
     * @private
     * @function
     * @name getViewport
     * @returns {Viewport Object}
     * @memberOf ch.Positioner
     */
	var getViewport = function() {
        
        // TODO: Calc scrollbar size
        var viewport, width, height, left, top, pageX, pageY, scrollBar = 0;
	    	    
        // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
	    if (typeof window.innerWidth != "undefined") {
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
		}
        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
        // older versions of IE - viewport = document.getElementsByTagName('body')[0];		
		else {
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
	    }
	    
	};
	
 	
	/**
     * Calculate css left and top to element on context
     * @private
     * @function
     * @name getPosition
     * @returns {Axis Object}
     * @memberOf ch.Positioner
     */
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
	
    /**
     * Evaluate viewport spaces and set points
     * @private
     * @function
     * @name calculatePoints
     * @returns {Styles Object}
     * @memberOf ch.Positioner
     */
	var calculatePoints = function(points, unitPoints){
		// Default styles
        var styles = getPosition(unitPoints);
        var classes = _CLASS_REFERENCES[points] || "";
		
		// Hold behavior
		if (o.hold) {
			styles.classes = classes;
			return styles;
		};
		
		var stylesCache;
		classes = classes.split(" ");
		
        // Viewport limits (From bottom to top)
		if (
			// If element is positioned at bottom and...
			(points == "lt lb" || points == "rt rb") &&
			// There isn't space in viewport... (Element bottom > Viewport bottom)
			((styles.top + parentRelative.top + element.outerHeight()) > viewport.bottom)
		) {
			unitPoints.my_y = "b";
			unitPoints.at_y = "t";

			// Store old styles
			stylesCache = styles;
			
			// New styles		 
			styles = getPosition(unitPoints);
			
			// Top to Bottom - Default again 
			if(styles.top + parentRelative.top < viewport.top){
				styles = stylesCache;
			} else {
				styles.top -= (2 * offset_top);
				classes[1] = "ch-top";
			};
		};
		
		
		// Viewport limits (From left to right)
		// If there isn't space in viewport... (Element right > Viewport right)
		if ((styles.left + parentRelative.left + element.outerWidth()) > viewport.right) {
			unitPoints.my_x = unitPoints.at_x = "r";
			
			// Store old styles
			stylesCache = styles;
			
			// New styles		 
			styles = getPosition(unitPoints);
			
			// Right to Left - Default again 
			if(styles.left < viewport.left){
				styles = stylesCache;
			}else{
				styles.left -= (2 * offset_left);
				
				classes[0] = "ch-right";
				
				if(classes[1] == "ch-top") { styles.top -= (2 * offset_top); };
			};
		};
		
		// Changes classes or default classes
		styles.classes = classes.join(" ");

		return styles;
	};
	
	
    /**
     * Set position to element
     * @private
     * @function
     * @name setPosition
     * @memberOf ch.Positioner
     */
	var setPosition = function() {
		// Separate points config
        var splitted = o.points.split(" ");
        
        var unitPoints = {
        	my_x: splitted[0].charAt(0),
        	my_y: splitted[0].charAt(1),
        	at_x: splitted[1].charAt(0),
        	at_y: splitted[1].charAt(1)
        }

		var styles = calculatePoints(o.points, unitPoints);
		
		element
			.css({
				left: styles.left,
				top: styles.top
			})
			.removeClass( "ch-top ch-left ch-bottom ch-right" )
			.addClass(styles.classes);
				
		if ( ch.utils.hasOwn(context, "element") && context.element !== ch.utils.window[0] ){
			$(context.element)
				.removeClass( "ch-top ch-left ch-bottom ch-right" )
				.addClass(styles.classes);
		};

	};	

    /**
     * Get context element for positioning, if ain't one, select the viewport as context.
     * @private
     * @function
     * @name getContext
     * @returns {Context Object}
     * @memberOf ch.Positioner
     */
	var getContext = function(){
	    
	    if (!o.context) {
	        return viewport;
	    }
	     
        var contextOffset = o.context.offset();
        
        context = {
            element: o.context,
            top: contextOffset.top + offset_top - parentRelative.top,
            left: contextOffset.left + offset_left - parentRelative.left,
            width: o.context.outerWidth(),
            height: o.context.outerHeight()
        };
        
        return context;	        
	    
	};
	
    /**
     * Get offset values from relative parents
     * @private
     * @function
     * @name getParentRelative
     * @returns {Offset Object}
     * @memberOf ch.Positioner 
     */
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
	
 	 
	var scrolled = false;

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
	}, 350);

   /**
    * @ignore
    */
    
    initPosition();
	
	// Return the reference to the positioned element
	return $(element);
};


/**
 * Object represent the abstract class of all UI Objects.
 * @abstract
 * @name Object
 * @class Object 
 * @memberOf ch
 * @see ch.Controllers
 * @see ch.Floats
 * @see ch.Navs
 * @see ch.Watcher
 */
 
ch.object = function(){
	
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Object
     */ 
	var that = this;	
	var conf = that.conf;
		
/**
 *  Public Members
 */
 

   /**
    * Component's static content.
    * @public
    * @name staticContent
	* @type {String}
    * @memberOf ch.Object
    */ 
    that.staticContent;
    
   /**
    * DOM Parent of content, this is useful to attach DOM Content when float is hidding.
    * @public
    * @name DOMParent
    * @type {HTMLElement}
    * @memberOf ch.Object
    */ 
    that.DOMParent;

   /**
    * Flag to know if the DOM Content is visible or not.
    * @public
    * @name DOMContentIsVisible
    * @type {Boolean}
    * @memberOf ch.Object
    */ 
    that.DOMContentIsVisible;

   /**
    * Prevent propagation and default actions.
    * @name prevent
    * @function
    * @param {EventObject} event Recieves a event object
    * @memberOf ch.Object
    */
	that.prevent = function(event) {
	   
		if (event && typeof event == "object") {
		    event.preventDefault();
			event.stopPropagation();
		};
		
		return that;
	};


   /**
    * Set and get the content of a component
    * @name content
    * @function
    * @param {String} [content] Could be a simple text, html or a url to get the content with ajax.
    * @returns {String} content
    * @memberOf ch.Object
    * @requires ch.Cache
    * @example
    * // Simple static content
    * $(element).layer("Some static content");
    * @example
    * // Get DOM content
    * $(element).layer("#hiddenContent");
    * @example
    * // Get AJAX content
	* $(element).layer("http://chico.com/content/layer.html");
    */
    that.content = function(content) {

        var _get = (content) ? false : true,

            // Local argument
            content = content,
            // Local isURL
            sourceIsUrl = ch.utils.isUrl(that.source),
            // Local isSelector
            sourceIsSelector = ch.utils.isSelector(that.source),
           	// Local inDom
			sourceInDom = ch.utils.inDom(that.source),
            // Get context, could be a single component or a controller
            context = ( ch.utils.hasOwn(that, "controller") ) ? that.controller : that["public"],
            // undefined, for comparison.
            undefined,
            // Save cache configuration
            cache = ( ch.utils.hasOwn(conf, "cache") ) ? conf.cache : true;

    /**
     * Get content
     */
		// return defined content
		if (_get) {

			// no source, no content
            if (that.source === undefined) {
                return "<p>No content defined for this component</p>";    
            }

            // Get data from cache for DOMContent or AJAXContent
            if (cache && ( sourceIsSelector || sourceIsUrl)) {
                var fromCache = ch.cache.get(that.source);
                if (fromCache) {
                	$(that.source).detach();
                    return fromCache;
                }
            }
            
            // First time we need to get the contemt.
            // Is cache is off, go and get content again.
            // Yeap, recursive.
            if (!cache || that.staticContent === undefined) {
            	var content = that.content(that.source);
            	$(that.source).detach();
            	return content;
            }

            // Flag to remove DOM content and avoid ID duplication the first time
            if (sourceIsSelector && sourceInDom) {
            	$(that.source).detach();
            }
            
			// get at last
            return that.staticContent;

		}

    /**
     * Set content
     */	

    // Reset cache to overwrite content
	conf.cache = false;

		// Local isURL
	var isUrl = ch.utils.isUrl(content),
		// Local isSelector
		isSelector = ch.utils.isSelector(content),
		// Local inDom
		inDom = ch.utils.inDom(content);

    /* Evaluate static content */  

        // Set 'that.staticContent' and overwrite 'that.source'
		// just in case you want to update DOM or AJAX Content.
		that.staticContent = that.source = content;

    /* Evaluate DOM content */

        if (isSelector && inDom) {
			
			// Save DOMParent, so we know where to re-insert the content.
            that.DOMParent = $(content).parent();
            // Check if content was visible or not.
            that.DOMContentIsVisible = $(content).is(":visible")

            // Return DOM content, remove it from DOM to avoid ID duplications
			that.staticContent = $(content).removeClass("ch-hide").remove();
			
			// Save new data to the cache
            if (cache) {
            	ch.cache.set(that.source, that.staticContent);
            }       
        }

        // trigger onContentLoad callback for DOM and Static,
        // Avoid trigger this callback on AJAX requests.
		if ( ch.utils.hasOwn(conf, "onContentLoad") && !isUrl) { conf.onContentLoad.call( context ); }

    /* Evaluate AJAX content */  

        if (isUrl) {
            
            // First check Cache
            // Check if this source is in our cache
            if (cache) {
                var fromCache = ch.cache.get(that.source);
                if (fromCache) {
                    return fromCache;
                }
            }

            var _method, _serialized, _params = "x=x";
            
			// If the trigger is a form button, serialize its parent to send data to the server.
			if (that.$element.attr('type') == 'submit') {
				_method = that.$element.parents('form').attr('method') || 'GET';
				_serialized = that.$element.parents('form').serialize();
				_params = _params + ((_serialized != '') ? '&' + _serialized : '');
			};
			
			$.ajax({
				url: that.source,
				type: _method || 'GET',
				data: _params,
				// each component could have a different cache configuration
				cache: cache,
				async: true,
				beforeSend: function(jqXHR){
					// Ajax default HTTP headers
					jqXHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				},
				success: function(data, textStatus, jqXHR){
					// TODO: It would be nice to re-use the onContentLoad callback.
                    that.contentCallback.call(that,data);
                    // Callback your way out
					if (ch.utils.hasOwn(conf, "onContentLoad")) {
					   conf.onContentLoad.call(context, data, textStatus, jqXHR);
					}
					// Save new data to the cache
                    if (cache) {
                        ch.cache.set(that.source,data);
                    }
				},
				error: function(jqXHR, textStatus, errorThrown){
					// TODO: It would be nice to re-use the onContentError callback.                    
                    that.contentCallback.call(that,"<p>Error on ajax call </p>");
                    // Callback your way out                    
					if (ch.utils.hasOwn(conf, "onContentError")) {
					   conf.onContentError.call(context, jqXHR, textStatus, errorThrown)
					}
				}
			});

            // Return Spinner and wait for callbacks
			that.staticContent = '<div class="loading"></div>';

        }

     /* Set previous cache configuration */

		conf.cache = cache;

     /* Finally return 'staticContent' */
		
		// Update Content
		that.contentCallback.call(that,that.staticContent);

		return that.staticContent;
    };

   /**
    * Executes a specific callback
    * @name callbacks
    * @function
    * @memberOf ch.Object
    */
    // TODO: Add examples!!!
	that.callbacks = function(when) {
		if( ch.utils.hasOwn(conf, when) ) {
			var context = ( that.controller ) ? that.controller["public"] : that["public"];
			return conf[when].call( context );
		};
	};

   /**
    * Change components position
    * @name position
    * @function
    * @param {Object} [o] Configuration object
    * @param {String} ["refresh"] Refresh
    * @memberOf ch.Object
    * @returns {Object} o Configuration object is arguments are empty
    */	
    // TODO: Add examples!!!
	that.position = function(o) {
	
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
				if(o != "refresh") {
					alert("Chico UI error: position() expected to find \"refresh\" parameter.");
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
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Object
     */
   	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Object
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Object
     */
	that["public"].type = that.type;
    
    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Object
     */
	that["public"].position = that.position;
    /**
     * Positioning configuration.
     * @public
     * @function
     * @name content
     * @memberOf ch.Object
     */
	that["public"].content = that.content;
	
	return that;
};


/**
 * Abstract class of all floats UI-Objects.
 * @abstract
 * @name Floats
 * @class Floats
 * @augments ch.Object
 * @memberOf ch
 * @requires ch.Positioner
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Tooltip
 * @see ch.Layer
 * @see ch.Modal
 */ 

ch.floats = function() {

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Floats
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
     * Creates a 'cone', is a visual asset for floats.
     * @private
     * @name createCone
     * @function
     * @memberOf ch.Floats
     */ 
	var createCone = function() {
		$("<div class=\"ch-cone\">")
			.prependTo( that.$container );
	};

    /**
     * Creates close button.
     * @private
     * @name createClose
     * @function
     * @memberOf ch.Floats
     */ 
	var createClose = function() {
		// Close Button
		$("<div class=\"btn close\" style=\"z-index:"+(ch.utils.zIndex+=1)+"\">")
			.bind("click", function(event){ that.hide(event); })
			.prependTo( that.$container );
		
		// ESC key
		ch.utils.document.bind(ch.events.KEY.ESC, function(event){ that.hide(event); });
		
		return;
	};

/**
 *  Protected Members
 */ 
			
/**
 *  Public Members
 */
     /**
     * Flag that indicates if the float is active on the DOM tree.
     * @public
     * @name active
     * @type {Boolean}
     * @memberOf ch.Floats
     */ 
	that.active = false;

    /**
     * Content configuration propertie.
     * @public
     * @name source
     * @type {String}
     * @memberOf ch.Floats
     */
	that.source = conf.content || conf.msg || conf.ajax || that.$element.attr('href') || that.$element.parents('form').attr('action');

    /**
     * Container for UI Component.
     * @public
     * @name $container
     * @type {jQuery Object}
     * @memberOf ch.Floats
     */ 
    that.$container = (function() { // Create Layout

		// Create the component container
		that.$container = $("<div class=\"ch-"+ that.type +"\" style=\"z-index:"+(ch.utils.zIndex+=1)+"\">");
				
		// Visual configuration
		if( ch.utils.hasOwn(conf, "classes") ) { that.$container.addClass(conf.classes); }
		if( ch.utils.hasOwn(conf, "width") ) { that.$container.css("width", conf.width); }
		if( ch.utils.hasOwn(conf, "height") ) { that.$container.css("height", conf.height); }
		if( ch.utils.hasOwn(conf, "closeButton") && conf.closeButton ) { createClose(); }
		if( ch.utils.hasOwn(conf, "cone") ) { createCone(); }
		if( ch.utils.hasOwn(conf, "fx") ) { conf.fx = conf.fx; } else { conf.fx = true; }
		
		// Cache - Default: true
		//conf.cache = ( ch.utils.hasOwn(conf, "cache") ) ? conf.cache : true;

		// Position component
		conf.position = conf.position || {};
		//conf.position.element = that.$container;
		conf.position.hold = conf.hold || false;
		//ch.positioner.call(that); // Is this necesary?

		// Return the entire Layout
		return that.$container;

    })(); 

    /**
     * Container for UI Component's content.
     * @public
     * @name $content
     * @type {jQuery Object}
     * @memberOf ch.Floats
     */ 
	that.$content = $("<div class=\"ch-"+ that.type +"-content\">").appendTo(that.$container);

    /**
     * This callback is triggered when async data is loaded into component's content, when ajax content comes back.
     * @public
     * @name contentCallback
     * @returns {Chico-UI Object}
     * @memberOf ch.Floats
     */ 
    that.contentCallback = function(data) {
        that.staticContent = data;
        that.$content.html(that.staticContent);
    	if ( ch.utils.hasOwn(conf, "position") ) {
    	   ch.positioner(conf.position);
    	}
    }

    /**
     * Renders the component in the display by adding it to the DOM tree.
     * @public
     * @name show
     * @returns {Chico-UI Object}
     * @memberOf ch.Floats
     */ 
	that.show = function(event) {

		if ( event ) {
			that.prevent(event);
		}
		
		// Avoid showing things that are already shown
		if ( that.active ) return;

		// Get content
		that.staticContent = that.content();
		// Saves content
        that.$content.html(that.staticContent);

        // Add layout to DOM tree
        // Increment zIndex
		that.$container
		    .appendTo("body")
			.css("z-index", ch.utils.zIndex++);

        /**
         * Callback function
         * @name onShow
         * @type {Function}
         * @memberOf ch.Floats
         */
		// Show component with effects
		if( conf.fx ) {
			that.$container.fadeIn("fast", function(){ that.callbacks("onShow"); });
		} else { 
        // Show component without effects
			that.$container.removeClass("ch-hide");
			that.callbacks("onShow");
		};
	
		// TODO: Positioner should recalculate the element's size (width and height) 
		conf.position.element = that.$container;

		that.position("refresh");

		that.active = true;

        return that;
	};

    /**
     * Hides the component and detach it from DOM tree.
     * @public
     * @name hide
     * @returns {Chico-UI Object}
     * @memberOf ch.Floats
     */ 
	that.hide = function(event) {

		if (event) {
			that.prevent(event);
		}
		
		if (!that.active) {
			return;
		}

		var afterHide = function(){ 
			 
			that.active = false;
			
           /**
            * Callback function
            * @name onHide
            * @type {Function}
            * @memberOf ch.Floats
            */
			that.callbacks('onHide');
			
			that.$container.detach();
			
			// TODO: This should be wrapped on Object.content() method
			// We need to be able to use interal callbacks...
			if (ch.utils.isSelector(that.source) && !ch.utils.inDom(that.source) && !ch.utils.isUrl(that.source)) {
				var original = $(that.staticContent).clone();
					original.appendTo(that.DOMParent||"body");

			   if (!that.DOMContentIsVisible) {
					original.addClass("ch-hide");
		       }

			};
		};
		
		// Show component with effects
		if( conf.fx ) {
			that.$container.fadeOut("fast", afterHide);
		
		// Show component without effects
		} else {
			that.$container.addClass("ch-hide");
			afterHide();
		};
		
		return that;

	};
	
	/**
     * Getter and setter for size attributes on any float component.
     * @private
     * @function
     * @name size
     * @param {String} prop Property that will be setted or getted, like "width" or "height".
     * @param {String} [data] Only for setter. It's the new value of defined property.
	 * @returns {Internal component instance}
     * @memberOf ch.Floats
     */
	that.size = function(prop, data) {
		// Getter
		if (!data) {
			return that.conf[prop];
		};

		// Setter
		that.conf[prop] = data;
		
		// Container
		that.$container[prop](data);
		
		that.position("refresh");
		
		return that["public"];
	};

    /**
     * Shows float element that contains the zoomed image.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Float
     */
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};
	
    /**
     * Hides float element that contains the zoomed image.
     * @public
     * @name hide
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Float
     */
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
    /**
     * Sets or gets the width of the Float element.
     * @public
     * @name width
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Float
     */
	that["public"].width = function(data) {
		
		return that.size("width", data) || that["public"];
	};
    /**
     * Sets or gets the height of the Float element.
     * @public
     * @name height
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Float
     */
	that["public"].height = function(data) {
			
		return that.size("height", data) || that["public"];
	};
    
    /**
     * Returns true if the component is active.
     * @public
     * @name isActive
     * @function
     * @returns {Boolean}
     * @memberOf ch.Floats
     */
	that["public"].isActive = function() {
	   return that.active;
	};
	
	return that;
	
};

/**
 * Abstract representation of navs components.
 * @abstract
 * @name Navs
 * @class Navs
 * @augments ch.Object
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Dropdown
 * @see ch.Expando
 */
 
ch.navs = function(){
	
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Navs
     */ 
	var that = this;
	var conf = that.conf;
		conf.icon = (ch.utils.hasOwn(conf, "icon")) ? conf.icon : true;
		conf.open = conf.open || false;
		conf.fx = conf.fx || false;

/**
 *  Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);


/**
 *  Private Members
 */
    /**
     * Adds icon in trigger's content.
     * @private
     * @name createIcon
     * @function
     * @memberOf ch.Navs
     */
	var createIcon = function(){
		$("<span>")
			.addClass("ico")
			.html("drop")
			.appendTo( that.$trigger );

		return;
	};
	
/**
 *  Protected Members
 */ 	
     /**
     * Status of component
     * @public
     * @name active
     * @returns {Boolean}
     * @memberOf ch.Navs
     */
	that.active = false;

    /**
     * Shows component's content.
     * @public
     * @name show
     * @returns {Chico-UI Object}
     * @memberOf ch.Navs
     */
	that.show = function(event){
		that.prevent(event);

		if ( that.active ) {
			return that.hide(event);
		};
		
		that.active = true;

		that.$trigger.addClass("ch-" + that.type + "-trigger-on");
       /**
        * Callback function
        * @name onShow
        * @type {Function}
        * @memberOf ch.Navs
        */
		// Animation
		if( conf.fx ) {
			that.$content.slideDown("fast", function(){
				//that.$content.removeClass("ch-hide");
				that.callbacks("onShow");
			});
		} else {
			that.$content.removeClass("ch-hide");
			that.callbacks("onShow");
		};
		
		return that;
	};
    /**
     * Hides component's content.
     * @public
     * @name hide
     * @returns {Chico-UI Object}
     * @memberOf ch.Navs
     */
	that.hide = function(event){
		that.prevent(event);
		
		if (!that.active) return;
		
		that.active = false;
		
		that.$trigger.removeClass("ch-" + that.type + "-trigger-on");
      /**
        * Callback function
        * @name onHide
        * @type {Function}
        * @memberOf ch.Navs
        */
		// Animation
		if( conf.fx ) {
			that.$content.slideUp("fast", function(){
				//that.$content.addClass("ch-hide");
				that.callbacks("onHide");
			});
		} else {
			that.$content.addClass("ch-hide");
			that.callbacks("onHide");
		};
		
		return that;
	};

     /**
     * Create component's layout
     * @public
     * @name createLayout
     * @returns {void}
     * @memberOf ch.Navs
     */
	that.configBehavior = function(){
		that.$trigger
			.addClass("ch-" + that.type + "-trigger")
			.bind("click", function(event){ that.show(event); });

		that.$content
			.addClass("ch-" + that.type + "-content ch-hide");

		// Visual configuration
		if( conf.icon ) createIcon();
		if( conf.open ) that.show();

		return;
	};
	
/**
 *  Default event delegation
 */
	that.$element.addClass("ch-" + that.type);


	return that;
}

/**
 * Abstract class
 * @abstract
 * @name Controllers
 * @class Controllers 
 * @augments ch.Object
 * @memberOf ch
 * @returns {Object}
 * @see ch.Accordion
 * @see ch.Carousel
 * @see ch.Form
 */
 
ch.controllers = function(){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @name that
     * @type {Object}
     * @memberOf ch.Controllers
     */ 
 	var that = this;
		
    /**
     *  Inheritance
     */
    that = ch.object.call(that);
    that.parent = ch.clon(that);
	
 
    /**
     * Collection of children elements.
     * @name children
     * @type {Collection}
     * @memberOf ch.Controllers
     */ 
	that.children = [];
			
    /**
     *  Public Members
     */	
		
	return that;
};

/**
 * Watcher is a validation engine for html forms elements.
 * @abstract
 * @name Watcher
 * @class Watcher
 * @augments ch.Object
 * @memberOf ch
 * @requires ch.Form
 * @requires ch.Positioner
 * @requires ch.Events
 * @param {Configuration Object} o Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Required
 * @see ch.String
 * @see ch.Number
 * @see ch.Custom
 */

ch.watcher = function(conf) {

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
		if ( ch.utils.hasOwn(ch.instances, "form") && ch.instances.form.length > 0 ) {	
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
     * Search for instances of Watchers with the same trigger, and then merge it's properties with it.
     * @private
     * @function
     * @name checkInstance
     * @returns {Instance Object}
     * @memberOf ch.Watcher
     */	
	var checkInstance = function() {
        var instance = ch.instances.watcher;
        if ( instance && instance.length > 0 ) {
			for (var i = 0, j = instance.length; i < j; i ++) {
                if (instance[i].element !== that.element) continue;
        	    // Merge Conditions        	    
                $.merge(instance[i].conditions, that.conditions);
				return { 
				    exists: true, 
				    object: instance[i] 
			    };
			    
            };
        };
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
     * Process conditions and creates a map with all configured conditions, it's messages and validations.
     */
    that.conditions = (function(){
        var c = []; // temp collection
        var i = 0;  // iteration
        var t = conf.conditions.length;
        for ( i; i < t; i++ ) {

            /**
             * Process conditions to find out which should be configured.
             * Add validations and messages to conditions object.
             */
            var condition = conf.conditions[i];
            
            // If condition exists in the Configuration Object
            if ( conf[condition.name] ) {
                
                // Sabe the value
                condition.value = conf[condition.name];
                
                // If there is a message defined for that condition
                if ( conf.messages[condition.name] ) {
                    condition.message = conf.messages[condition.name];
                }
                
                // Push it to the new conditions collection
                c.push(condition);
            }
        }
        
        // return all the configured conditions
        return c;
        
    })(); // Love this ;)

    /**
     * Return true is a required conditions is found on the condition collection.
     * @private
     * @function
     * @name isRequired
     * @memberOf ch.Watcher
     */
    that.isRequired = function(){
        var t = that.conditions.length;
        while ( t-- ) {   
            var condition = that.conditions[t];
            if ( condition.name === "required" && condition.value ) {
                return true;
            }
        }
        return false;
    };

    /**
     * Helper is a UI Component that shows the messages of active validations.
     * @name helper
     * @type {ch.Helper}
     * @memberOf ch.Watcher
     * @see ch.Helper
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

        var isRequired = that.isRequired()

        // Avoid fields that aren't required when they are empty or de-activated
		if ( !isRequired && that.isEmpty() && that.active === false) { return; }
        
        if ( that.enabled && ( that.active === false || !that.isEmpty() || isRequired ) ) {

            /**
             * Callback function
             * @name beforeValidate
             * @type {Function}
             * @memberOf ch.Watcher
             */
			that.callbacks('beforeValidate');

            var i = 0, t = that.conditions.length,
                value = that.$element.val(),
                gotError = false;

            // for each condition
            for ( i ; i < t ; i +=1 ) {
                
            	var condition = that.conditions[i];
        
            	if ( that.isRequired() ) {
                    gotError = that.isEmpty();
            	}
            	
                if ( condition.patt ) {
                    gotError = !condition.patt.test(value);
                }
                
                if ( condition.expr ) {
                    gotError = !condition.expr( value, condition.value );
                }

                if ( condition.func) {
                    // Call validation function with 'this' as scope.
                    gotError = !condition.func.call(that["public"], value); 
                }
                
                if ( gotError ) {

                   /**
                    * Callback function
                    * @name onError
                    * @type {Function}
                    * @memberOf ch.Watcher
                    */
                    that.callbacks('onError');
		
                	// Field error style
                	that.$element.addClass("error");

                	// Show helper with message
                	var text = ( condition.message ) ? condition.message : 
                		(ch.utils.hasOwn(controller, "messages")) ? controller.messages[condition.name] :
                		undefined;

					that.helper.content(text);
                	that.helper.show();
                
                	that.active = true;
                
                	var validationEvent = (that.tag == 'OPTIONS' || that.tag == 'SELECT') ? "change" : "blur";

                    // Add blur or change event only one time
                	that.$element.one( validationEvent , function(event){ that.validate(event); }); 
                
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
				if (originalTarget.type == "submit") { controller.submit(event); };
			};
			
			// This generates a lot of redraws... I don't want it here
			//controller.checkStatus();
		};


       /**
        * Callback function
        * @name afterValidate
        * @type {Function}
        * @memberOf ch.Watcher
        */
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
       /**
        * Callback function
        * @name onReset
        * @type {Function}
        * @memberOf ch.Watcher
        */
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
     * Positioner reference.
     * @public
     * @name reference
     * @type {jQuery Object}
     * @memberOf ch.Watcher
     */
	that["public"].reference = that.reference;
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
	that["public"].helper = that.helper["public"];
    /**
     * Active is a boolean property that let you know if there's a validation going on.
     * @public
     * @function
     * @name active
     * @returns {Boolean}
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
     * @returns {Chico-UI Object}
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
     * @returns {Chico-UI Object}
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
     * @returns {Chico-UI Object}
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
     * @returns {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	that["public"].enable = function() {
		that.enabled = true;
				
		return that["public"];			
	};
    /**
     * Turn off Watcher engine and reset its validation.
     * @public
     * @function
     * @name disable
     * @returns {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	that["public"].disable = function() {
		that.enabled = false;
		that.reset();

		return that["public"];
	};
	/**
     * Recalculate Helper's positioning.
     * @public
     * @function
     * @name refresh
     * @returns {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	that["public"].refresh = function() {
		that.helper.position("refresh");

		return that["public"];
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

/**
 * Keyboard event controller utility to know wich keys are begin
 * @abstract
 * @name Keyboard  
 * @class Keyboard
 * @memberOF ch
 * @param {Event Object} event
 */ 
ch.keyboard = function(event) {
    
    /**
     * Map with references to key codes.
     * @private
     * @name keyCodes
     * @type {Object}
     * @memberOf ch.Keyboard
     */ 
    var keyCodes = {
        "13": "ENTER",
        "27": "ESC",
        "37": "LEFT_ARROW",
        "38": "UP_ARROW",
        "39": "RIGHT_ARROW",
        "40": "DOWN_ARROW"
    };
    
    if( !ch.utils.hasOwn(keyCodes, event.keyCode) ) return;
    
    ch.utils.document.trigger(ch.events.KEY[ keyCodes[event.keyCode] ], event);
    
};

/**
 * Pre-load is an utility to preload images on browser's memory. An array of sources will iterate and preload each one, a single source will do the same thing.
 * @abstract
 * @name Preload
 * @class Preload
 * @memberOf ch
 * @param {Array} [arr] Collection of image sources
 * @param {String} [str] A single image source
 * @example
 * ch.preload(["img1.jpg","img2.jpg","img3.png"]);
 * @example
 * ch.preload("logo.jpg");
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
};/**
 * Manage collections with abstract lists. Create a list of objects, add, get and remove.
 * @abstract
 * @name List
 * @class List
 * @memberOf ch
 * @param {Array} [collection] Constructs a List with an optional initial collection
 */

ch.list = function( collection ) {

    var that = this;

    /**
     * @public
     * @name children
     * @type {Collection}
     * @memberOf ch.List
     */
    var _children = ( collection && ch.utils.isArray( collection ) ) ? collection : [] ;

    /**
     * Seek members inside the collection by index, query string or object comparison.
     * @private
     * @function
     * @name _find
     * @param {Number} [q]
     * @param {String} [q]
     * @param {Object} [q]
     * @param {Function} [a]
     * @return {Object} Returns the finded element
     * @memberOf ch.List
     */
    var _find = function(q, a) {
        // null search return the entire collection
        if ( !q ) {
            return _children;
        }

        var c = typeof q;
        // number? return a specific position
        if ( c === "number" ) {
            q--; // _children is a Zero-index based collection
            return ( a ) ? a.call( that , q ) : _children[q] ;
        }
        
        // string? ok, let's find it
        var t = size(), _prop, child;
        if ( c === "string" || c === "object" ) {
            while ( t-- ) {
                child = _children[t];
                // object or string strict equal
                if ( child === q ) {
                    return ( a ) ? a.call( that , t ) : child ;
                }
                // if isn't finded yet
                // search inside an object for a string
                for ( _prop in child ) {
                    if ( _prop === q || child[_prop] === q ) {
                        return ( a ) ? a.call( that , t ) : child ;
                    }
                } // end for
            } // end while
        }
    };

    /**
     * Adds a new child (or more) to the collection.
     * @public
     * @function
     * @name add
     * @param {String} [child]
     * @param {Object} [child]
     * @param {Array} [child]
     * @memberOf ch.List
     * @returns {Number} The index of the added child.
     * @returns {Collection} Returns the entire collecction if the input is an array.
     */
    var add = function( child ) {
        
        if ( ch.utils.isArray( child ) ) {
            var i = 0, t = child.length;
            for ( i; i < t; i++ ) {
                _children.push( child[i] );
            }            
            return _children;
        }
        return _children.push( child );
    };
    
    /**
     * Removes a child from the collection by index, query string or object comparison.
     * @public
     * @function
     * @name rem
     * @param {Number} [q]
     * @param {String} [q]
     * @param {Object} [q]
     * @return {Object} Returns the removed element
     * @memberOf ch.List
     */
    var rem = function( q ) {
        // null search return
        if ( !q ) {
            return that;
        }
        
        var remove = function( t ) {
            return _children.splice( t , 1 )[0];
        }

        return _find( q , remove );

    };

    /**
     * Get a child from the collection by index, query string or object comparison.
     * @public
     * @function
     * @name get
     * @param {Number} [q] Get a child from the collection by index number.
     * @param {String} [q] Get a child from the collection by a query string.
     * @param {Object} [q] Get a child from the collection by comparing objects.
     * @memberOf ch.List
     */
    var get = function( q ) {

        return _find( q );  

    };

    /**
     * Get the amount of children from the collection.
     * @public
     * @function
     * @name size
     * @return {Number}
     * @memberOf ch.List
     */

    var size = function() {
        return _children.length;    
    };

    /**
     * @public
     */
    var that = {
        children: _children,
        add: add,
        rem: rem,
        get: get,
        size: size
    };
    
    return that;
    
};
/**
 * Extend is a utility that resolve creating interfaces problem for all UI-Objects.
 * @abstract
 * @name Extend
 * @class Extend
 * @memberOf ch
 * @param {String} name Interface's name.
 * @param {Function} klass Class to inherit from.
 * @param {Function} [process] Optional function to pre-process configuration, recieves a 'conf' param and must return the configration object.
 * @example
 * // Create an URL interface type based on String component.
 * ch.extend("string").as("url");
 * @example
 * // Create an Accordion interface type based on Menu component.
 * ch.extend("menu").as("accordion"); 
 * @example
 * // And the coolest one...
 * // Create an Transition interface type based on his Modal component, with some conf manipulations:
 * ch.extend("modal").as("transition", function(conf) {
 *     conf.closeButton = false;
 *     conf.msg = conf.msg || conf.content || "Please wait...";
 *     conf.content = $("&lt;div&gt;").addClass("loading").after( $("&lt;p&gt;").html(conf.msg) );
 *     return conf;
 * });
 */

ch.extend = function (klass) {

    "use strict";
    
    return {
        as: function (name, process) {
            // Create the component in Chico-UI namespace
            ch[name] = function (conf) {
                // Invoke pre-proccess if is defined,
                // or grab the raw conf argument,
                // or just create an empty object.
                conf = (process) ? process(conf) : conf || {};

                // Some interfaces need a data value,
                // others simply need to be 'true'.
                conf[name] = conf.value || true;
        
                // Here we recieve messages,
                // or create an empty object.
                conf.messages = conf.messages || {};
        
                // If the interface recieve a 'msg' argument,
                // store it in the message map.
                if (ch.utils.hasOwn(conf, "msg")) {
                    conf.messages[name] = conf.msg;
                    conf.msg = null;
                    delete conf.msg;
                }
                // Here is where the magic happen,
                // invoke the class with the new conf,
                // and return the instance to the namespace.
                return ch[klass].call(this, conf);
            };
            // Almost done, now we need expose the new component,
            // let's ask the factory to do it for us.
            ch.factory({
                component: name
            });
        } // end as method
    } // end return
};/**
 * Execute callback when images of a query selection loads
 * @abstract
 * @name onImagesLoads
 * @class onImagesLoads
 * @memberOf ch
 * @param {Array of images}
 * @returns {jQuery Object}
 * @example
 * $("img").onImagesLoads(function(){ ... });
 */

ch.onImagesLoads = function(conf){

	/**
	 * Reference to a internal component instance, saves all the information and configuration properties.
	 * @private
	 * @name that
	 * @type {Object}
	 * @memberOf ch.onImagesLoads
	 */
	var that = this;
	conf = ch.clon(conf);
	that.conf = conf;
	
	that.$element
		// On load event
		.bind("load", function(){
			setTimeout(function(){
				if (--that.$element.length <= 0) {
					that.conf.lambda.call(that.$element, this);
				};
			}, 200);
		})
		// For each image
		.each(function(){
			// Cached images don't fire load sometimes, so we reset src.
			if (this.complete || this.complete === undefined) {
				var src = this.src;
				
				// Data uri fix bug in web-kit browsers
				this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
				this.src = src;
			};
		});
	
	return that;
};

ch.factory({ component: "onImagesLoads" });/** 
 * UI feedback utility, creates a visual highlight
 * changing background color from yellow to white.
 * @function
 * @name blink
 * @param {Selector} selector CSS Selector to blink a collection
 * @param {Number} [time] Amount of time to blink
 * @returns {jQuery Object}
 * @memberOf ch
 */
ch.blink = function (conf) {

	var that = this,
		// Hex start level toString(16).
		level = 1, 
		// Time, 200 miliseconds by default.
		t = conf.value || 200,
		// Inner highlighter.
		highlight = function (e) {
			// Let know everyone we are active.
			that.$element.addClass("ch-active");
			// Color iteration.
			function step () {
				// New hex level.
				var h = level.toString(16);
				// Change background-color, redraw().
				e.style.backgroundColor = '#FFFF' + h + h;
				// Itearate for all hex levels.
				if (level < 15) {
					// Increment hex level.
					level += 1;
					// Inner recursion.
					setTimeout(step, t);
				} else {
					// Stop right there...
					that.$element.removeClass("ch-active");
				}
		};
		// Begin steps.
		setTimeout(step, t);
	}
	// Start a blink if the element isn't active.
	if (!that.$element.hasClass("ch-active")) {
		highlight(that.element);
	}
	// Return the element so keep chaining things.
	return that.$element;
}
/**
 * Carousel is a UI-Component.
 * @name Carousel
 * @class Carousel
 * @augments ch.Object
 * @requires ch.List   
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */
 
ch.carousel = function(conf){
	
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Carousel
     */	
	var that = this;
	
	conf = ch.clon(conf);
	
	// Configurable pagination
	conf.pagination = conf.pagination || false;
	
	// Configuration for continue carousel
	// TODO: Rolling is forced to be false. Use this instead:
	// if( ch.utils.hasOwn(conf, "rolling") ) { conf.rolling = conf.rolling; } else { conf.rolling = true; };
	conf.rolling = false;
	
	// Configurable arrows
	if( ch.utils.hasOwn(conf, "arrows") ) { conf.arrows = conf.arrows; } else { conf.arrows = true; };
	
	// Configurable efects
	if( ch.utils.hasOwn(conf, "fx") ) { conf.fx = conf.fx; } else { conf.fx = true; };
	
	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */
	
	/**
     * Creates the necesary structure to carousel operation.
     * @private
     * @function
     * @name _createLayout
     * @memberOf ch.Carousel
     */
	var _createLayout = function() {

		// Create carousel's content
		that.$content = $("<div>")
			.addClass("ch-carousel-content")
			.append( that.$collection );

		// Create carousel's mask
		that.$container = $("<div>")
			.addClass("ch-carousel-container")
			.css("height", that.itemSize.height)
			.append( that.$content )
			.appendTo( that.$element );

		// Visual configuration
		if ( ch.utils.hasOwn(conf, "width") ) { that.$element.css("width", conf.width); };
		if ( ch.utils.hasOwn(conf, "height") ) { that.$element.css("height", conf.height); };
		if ( !conf.fx && ch.features.transition ) { that.$content.addClass("ch-carousel-nofx"); };

		return;
	},
	
	/**
     * Creates Previous and Next arrows.
     * @private
     * @function
     * @name _createArrows
     * @memberOf ch.Carousel
     */
	_createArrows = function(){
		
		// Previous arrow
		that.prevArrow = $("<p>")
			.addClass("ch-prev-arrow")
			.append("<span>Previous</span>")
			.bind("click", that.prev);
		
		// Next arrow
		that.nextArrow = $("<p>")
			.addClass("ch-next-arrow")
			.append("<span>Next</span>")
			.bind("click", that.next);
		
		// Continue carousel arrows behavior
		if ( !conf.rolling ) { that.prevArrow.addClass("ch-hide") };
		
		// Append arrows to carousel
		that.$element.prepend(that.prevArrow).append(that.nextArrow);
		
		// Positions arrows vertically inside carousel
		var arrowsPosition = (that.$element.outerHeight() - that.nextArrow.outerHeight()) / 2;
		$(that.prevArrow).css("top", arrowsPosition);
		$(that.nextArrow).css("top", arrowsPosition);

		return;
	},
	
	/**
     * Manages arrows turning it on and off when non-continue carousel is on first or last page.
     * @private
     * @function
     * @name _toggleArrows
     * @param {Number} page Page to be moved
     * @memberOf ch.Carousel
     */
	_toggleArrows = function(page){
 		
 		// Both arrows shown on carousel's middle
		if (page > 1 && page < that.pages ){
			that.prevArrow.removeClass("ch-hide");
			that.nextArrow.removeClass("ch-hide");
		} else {
			// Previous arrow hidden on first page
			if (page == 1) { that.prevArrow.addClass("ch-hide"); that.nextArrow.removeClass("ch-hide"); };
			
			// Next arrow hidden on last page
			if (page == that.pages) { that.prevArrow.removeClass("ch-hide"); that.nextArrow.addClass("ch-hide"); };
		};

		return;
	},
	
	/**
     * Creates carousel pagination.
     * @private
     * @function
     * @name _createPagination
     * @memberOf ch.Carousel
     */
	_createPagination = function(){
		
		// Deletes pagination if already exists
		that.$element.find(".ch-carousel-pages").remove();
		
		// Create an list of elements for new pagination
		that.$pagination = $("<ul>").addClass("ch-carousel-pages");

		// Create each mini thumbnail
		for (var i = 1; i <= that.pages; i += 1) {
			// Thumbnail <li>
			var thumb = $("<li>").html(i);
			
			// Mark as actived if thumbnail is the same that current page
			if (i == that.currentPage) { thumb.addClass("ch-carousel-pages-on"); };
			
			// Append thumbnail to list
			that.$pagination.append(thumb);
		};

		// Bind each thumbnail behavior
		$.each(that.$pagination.children(), function(i, e){
			$(e).bind("click", function(){
				that.goTo(i + 1);
			});
		});
		
		// Append list to carousel
		that.$element.append( that.$pagination );
		
		// Positions list
		that.$pagination.css("left", (that.$element.outerWidth() - that.$pagination.outerWidth()) / 2);
		
		// Save each generated thumb into an array
		_$itemsPagination = that.$pagination.children();
			
		return;
	},
	
	/**
     * Calculates items amount on each page.
     * @private
     * @function
     * @name _getItemsPerPage
     * @memberOf ch.Carousel
     * @returns {Number} Items amount on each page
     */
	_getItemsPerPage = function(){
		// Space to be distributed among all items
		var _widthDiff = that.$element.outerWidth() - that.itemSize.width;
		
		// If there are space to be distributed, calculate pages
		return (_widthDiff > that.itemSize.width) ? ~~(_widthDiff / that.itemSize.width) : 1;
	},
	
	/**
     * Calculates total amount of pages.
     * @private
     * @function
     * @name _getPages
     * @memberOf ch.Carousel
     * @returns {Number} Total amount of pages
     */
	_getPages = function(){
		// (Total amount of items) / (items amount on each page)
		return  Math.ceil( that.items.children.length / that.itemsPerPage );
	},

	/**
     * Calculates all necesary data to draw carousel correctly.
     * @private
     * @function
     * @name _draw
     * @memberOf ch.Carousel
     */
	_draw = function(){
		
		// Reset size of carousel mask
		_maskWidth = that.$container.outerWidth();

		// Recalculate items amount on each page
		that.itemsPerPage = _getItemsPerPage();
		
		// Recalculate total amount of pages
		that.pages = _getPages();
		
		// Calculate variable margin between each item
		var _itemMargin = (( _maskWidth - (that.itemSize.width * that.itemsPerPage) ) / that.itemsPerPage ) / 2;
		
		// Modify sizes only if new items margin are positive numbers
		if (_itemMargin < 0) return;
		
		// Detach content from DOM for make a few changes
		that.$content.detach();
		
		// Move carousel to first page for reset initial position
		that.goTo(1);
		
		// Sets new margin to each item
		$.each(that.items.children, function(i, e){
			e.style.marginLeft = e.style.marginRight = _itemMargin + "px";
		});
		
		// Change content size and append it to DOM again
		that.$content
			.css("width", ((that.itemSize.width + (_itemMargin * 2)) * that.items.size() + _extraWidth) )
			.appendTo(that.$container);
		
		// Create pagination if there are more than one page on total amount of pages
		if ( conf.pagination && that.pages > 1) { _createPagination(); };
		
		return;
	},
	
	/**
     * Size of carousel mask.
     * @private
     * @name _maskWidth
     * @type {Number}
     * @memberOf ch.Carousel
     */
	_maskWidth,
	
	/**
     * List of pagination thumbnails.
     * @private
     * @name _$itemsPagination
     * @type {Array}
     * @memberOf ch.Carousel
     */
	_$itemsPagination,
	
	/**
     * Extra size calculated on content
     * @private
     * @name _extraWidth
     * @type {Number}
     * @memberOf ch.Carousel
     */
	_extraWidth,
	
	/**
     * Resize status of Window.
     * @private
     * @name _resize
     * @type {Boolean}
     * @memberOf ch.Carousel
     */
	_resize = false;

/**
 *  Protected Members
 */

	/**
     * UL list of items.
     * @private
     * @name $collection
     * @type {Array}
     * @memberOf ch.Carousel
     */
	that.$collection = that.$element.children();
	
	/**
     * List object created from each item.
     * @private
     * @name items
     * @type {Object}
     * @memberOf ch.Carousel
     */
	that.items = ch.list( that.$collection.children().toArray() );
	
	/**
     * Width and height of first item.
     * @private
     * @name itemSize
     * @type {Object}
     * @memberOf ch.Carousel
     */
	that.itemSize = {
		width: $(that.items.children[0]).outerWidth(),
		height: $(that.items.children[0]).outerHeight()
	};

	/**
     * Page selected.
     * @private
     * @name currentPage
     * @type {Number}
     * @memberOf ch.Carousel
     */
	that.currentPage = 1;

	that.goTo = function(page){
		
		// Validation of page parameter
		if (page == that.currentPage || page > that.pages || page < 1 || isNaN(page)) { return that; };
		
		// Coordinates to next movement
		var movement = -(_maskWidth * (page - 1));

		// TODO: review this conditional
		// Movement with CSS transition
		if (conf.fx && ch.features.transition) {
			that.$content.css("left", movement);
		// Movement with jQuery animate
		} else if (conf.fx){
			that.$content.animate({ left: movement });
		// Movement without transition or jQuery
		} else {
			that.$content.css("left", movement);
		};

		// Manage arrows
		if (!conf.rolling && conf.arrows) { _toggleArrows(page); };
		
		// Refresh selected page
		that.currentPage = page;
		
		// TODO: Use toggleClass() instead remove and add.
		// Select thumbnail on pagination
		if (conf.pagination) {
			_$itemsPagination
				.removeClass("ch-carousel-pages-on")
				.eq(page - 1)
				.addClass("ch-carousel-pages-on");
		};
		
       /**
        * Callback function
        * @name onMove
        * @type {Function}
        * @memberOf ch.Carousel
        */
		that.callbacks("onMove");

 		return that;
	};

	that.prev = function(){
		that.goTo(that.currentPage - 1);

       /**
        * Callback function
        * @name onPrev
        * @type {Function}
        * @memberOf ch.Carousel
        */

		that.callbacks("onPrev");

		return that;
	};
	
	that.next = function(){
		that.goTo(that.currentPage + 1);

       /**
        * Callback function
        * @name onNext
        * @type {Function}
        * @memberOf ch.Carousel
        */

		that.callbacks("onNext");

		return that;
	};


/**
 *  Public Members
 */

    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Carousel
     */ 
   	that["public"].uid = that.uid;
    
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Carousel
     */
	that["public"].element = that.element;
   
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Carousel
     */
	that["public"].type = that.type;

    /**
     * Get the items amount of each page.
     * @public
     * @name getItemsPerPage
     * @returns {Number}
     * @memberOf ch.Carousel
     */
	that["public"].getItemsPerPage = function() { return that.itemsPerPage; };
    
    /**
     * Get the total amount of pages.
     * @public
     * @name getPage
     * @returns {Number}
     * @memberOf ch.Carousel
     */
    that["public"].getPage = function() { return that.currentPage; };
    
    /**
     * Moves to a defined page.
     * @public
     * @function
     * @name goTo
     * @returns {Chico-UI Object}
     * @param {Number} page Page to be moved
     * @memberOf ch.Carousel
     * @example
     * // Create a carousel
     * var foo = $("bar").carousel();
     * 
     * // Go to second page
     * foo.goTo(2);
     */
    that["public"].goTo = function(page) {
    	that.goTo(page);

   		return that["public"];
    };
    
    /**
     * Moves to the next page.
     * @public
     * @name next
     * @returns {Chico-UI Object}
     * @memberOf ch.Carousel
     * @example
     * // Create a carousel
     * var foo = $("bar").carousel();
     * 
     * // Go to next page
     * foo.next();
     */
    that["public"].next = function(){
		that.next();

    	return that["public"];
    };

    /**
     * Moves to the previous page.
     * @public
     * @name prev
     * @returns {Chico-UI Object}
     * @memberOf ch.Carousel
     * @example
     * // Create a carousel
     * var foo = $("bar").carousel();
     * 
     * // Go to previous page
     * foo.prev();
     */
	that["public"].prev = function(){
		that.prev();

		return that["public"];
	};

    /**
     * Re-calculate positioning, sizing, paging, and re-draw.
     * @public
     * @name redraw
     * @returns {Chico-UI Object}
     * @memberOf ch.Carousel
     * @example
     * // Create a carousel
     * var foo = $("bar").carousel();
     * 
     * // Re-draw carousel
     * foo.redraw();
     */
	that["public"].redraw = function(){
		_draw();
		
		return that["public"];
	};


/**
 *  Default event delegation
 */
	
	// Add class name to carousel container
	that.$element.addClass("ch-carousel");

	// Add class name to collection and its children
	that.$collection
		.detach()
		.addClass("ch-carousel-list")
		.children()
			.addClass("ch-carousel-item");

	// Creates the necesary structure to carousel operation
 	_createLayout();

	// Calculate extra width for content before draw carousel
	_extraWidth = (ch.utils.html.hasClass("ie6")) ? that.itemSize.width : 0;
	
	// Calculates all necesary data to draw carousel correctly
	_draw();

	// Creates Previous and Next arrows
	if ( conf.arrows && that.pages > 1) { _createArrows(); };

	// Elastic behavior    
    if ( !conf.hasOwnProperty("width") ){
		
		// Change resize status on Window resize event
	    ch.utils.window.bind("resize", function() {
			_resize = true;
		});
		
		// Limit resize execution to a quarter of second
		setInterval(function() {
		    if( !_resize ) { return; };
			_resize = false;
			_draw();
		}, 250);
		
	};

	return that;
}
/**
 * Calendar UI-Component for static and dinamic content.
 * @name Calendar
 * @class Calendar
 * @augments ch.Controllers
 * @requires ch.Dropdown
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */
//TODO: Examples
ch.calendar = function(conf) {
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Calendar
     */
    var that = this;

	conf = ch.clon(conf);

	conf.format = conf.format || "DD/MM/YYYY";
		
	if (ch.utils.hasOwn(conf, "msg")) { conf.msg = ((conf.msg === "today")) ? new Date() : new Date(conf.msg); };
	if (ch.utils.hasOwn(conf, "selected")) { conf.selected = ((conf.selected === "today")) ? new Date() : new Date(conf.selected); };

	that.conf = conf;

/**
 *	Inheritance
 */

	that = ch.controllers.call(that);
	that.parent = ch.clon(that);

/**
 *  Private Members
 */

    /**
     * Collection of months names
     * @private
     * @name _monthsNames
     * @type {Array}
     * @memberOf ch.Calendar
     */
	//TODO: default in english and snnif browser language
	//TODO: cambiar a sintaxis de constante
	var _monthsNames = conf.monthsNames ||["Enero","Febero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

    /**
     * Collection of weekdays short names
     * @private
     * @name _shortWeekdaysNames
     * @type {Array}
     * @memberOf ch.Calendar
     */
	//TODO: default in english and snnif browser language
	//TODO: cambiar a sintaxis de constante
	var _shortWeekdaysNames = conf.weekdays || ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

    /**
     * Date of today
     * @private
     * @name _today
     * @type {Date}
     * @memberOf ch.Calendar
     */
	var _today = new Date();

    /**
     * Date of selected day
     * @private
     * @name _selected
     * @type {Date}
     * @memberOf ch.Calendar
     */
	var _selected = conf.selected || conf.msg;

    /**
     * Creates tag thead with short name of week days
     * @private
     * @function 
     * @name name _weekdays
     * @memberOf ch.Calendar
     */
	//TODO: change to constant syntax
	//TODO: subfijo de render y cambiar el nombre para que sea mas especifico, thead
	var _weekdays = (function(){
		
		var _weekdaysTitle = "<thead>";
		
		for (var i = 0; i < _shortWeekdaysNames.length; i += 1) {
			_weekdaysTitle += "<th>" + _shortWeekdaysNames[i] + "</th>";
		};
		
		return _weekdaysTitle += "</thead>";

	}());

	/**
     * HTML Template to months
     * @private
     * @name _templateMonth
	 * @type {jQuery Object}
     * @memberOf ch.Calendar
     */
	var _templateMonth = $("<table>")
		.addClass("ch-calendar-month")
		.append(_weekdays)
		.bind("click", function(event){

			event = event || window.event;
			src = event.target || event.srcElement;

			if (src.nodeName !== "TD" || src.className.indexOf("day")) {
				that.prevent(event);
				return;
			};

			_select( that.currentDate.getFullYear() + "/" + (that.currentDate.getMonth() + 1) + "/" + src.innerHTML );

		});


    /**
     * Creates a complete month and returns it in a table
     * @private
     * @function 
     * @name name _createMonth
     * @memberOf ch.Calendar
     */
	var _createMonth = function(date){

		var date = new Date(date);

		var _tableMonth = _templateMonth.clone(true);

		var _currentMonth = {};
			_currentMonth.fullDate = new Date(date.getFullYear(), date.getMonth(), 1);
			_currentMonth.date = _currentMonth.fullDate.getDate();
			_currentMonth.day = _currentMonth.fullDate.getDay();
			_currentMonth.month = _currentMonth.fullDate.getMonth();
			_currentMonth.year = _currentMonth.fullDate.getFullYear();


		var _currentDate = {};
			_currentDate.fullDate = new Date(date.getFullYear(), date.getMonth(), 1);
			_currentDate.date = _currentDate.fullDate.getDate();
			_currentDate.day = _currentDate.fullDate.getDay();
			_currentDate.month = _currentDate.fullDate.getMonth();
			_currentDate.year = _currentDate.fullDate.getFullYear();

		var first_weekday = _currentMonth.day;

		var _weeks, _classToday, _classSelected;

		_weeks = "<tbody>";

		do {
			
			_weeks += "<tr class=\"week\">";

			for (var i = 0; i < 7; i += 1) {

				if (_currentDate.date == 1) {
					for (var i = 0; i < first_weekday; i += 1) {
						_weeks += "<td class=\"disable\"></td>";
					};
				};
				
				_classToday = (_currentDate.date == _today.getDate() && _currentDate.month == _today.getMonth() && _currentDate.year == _today.getFullYear()) ? " today" : "";

				_classSelected = (_selected && _currentDate.date == _selected.getDate() && _currentDate.month == _selected.getMonth() && _currentDate.year == _selected.getFullYear()) ? " selected" : "";
				
				_weeks += "<td class=\"day" + _classToday +  _classSelected + "\">" + _currentDate.date + "</td>";
				
				_currentDate.fullDate.setDate(_currentDate.date+1);
				_currentDate.date = _currentDate.fullDate.getDate();
				_currentDate.day = _currentDate.fullDate.getDay();
				_currentDate.month = _currentDate.fullDate.getMonth();
				_currentDate.year = _currentDate.fullDate.getFullYear();

				if ( _currentDate.month != _currentMonth.month ) { break; };

			};

			_weeks += "</tr>";
			
		} while (_currentDate.month == _currentMonth.month);

		_weeks += "</tbody>";

		_tableMonth
			.prepend("<caption>"+_monthsNames[_currentMonth.month] + " - " + _currentMonth.year+"</caption>")
			.append(_weeks);

		return _tableMonth;
	};


    /**
     * Handles behavior of arrows
     * @private
     * @name _arrows
     * @type {Object}
     * @memberOf ch.Calendar
     */
	var _arrows = {
	
		$prev: $("<p class=\"ch-calendar-prev\">").bind("click", function(event){ that.prevent(event); _prevMonth(); }),
	
		$next: $("<p class=\"ch-calendar-next\">").bind("click", function(event){ that.prevent(event); _nextMonth(); })
	};

    /**
     * Creates an instance of Dropdown
     * @private
     * @function 
     * @name name _createDropdown
     * @memberOf ch.Calendar
     */
	var _createDropdown = function(){
		
		var _dropdownTrigger = $("<strong>").html("Calendar");
		
		that.$trigger.append(_dropdownTrigger).append(that.$container);

		that.children[0] = that.$trigger.dropdown({
			onShow: function(){
				// onShow callback
				that.callbacks.call(that, "onShow");
			},
			onHide: function(){
				// onHide callback
				that.callbacks.call(that, "onHide");
			}
		});

		that.children[0].position({
			context: that.$element,
			points: "lt lb"
		});

		return;
	};

     /**
     * Create component's layout
     * @private
	 * @function
     * @name _createLayout
     * @memberOf ch.Calendar
     */
	var _createLayout = function(){

		that.$trigger =	$("<div class=\"secondary ch-calendar\">");

		that.$container = $("<div class=\"ch-calendar-container ch-hide\">");

		that.$content = $("<div class=\"ch-calendar-content\">");

		that.$element.after(that.$trigger);

		_createDropdown();

		return;
	};

     /**
     * Parse string to YY/MM/DD format date
     * @private
	 * @function
     * @name _parseDate
     * @memberOf ch.Calendar
     */
	var _parseDate = function(value){
		var _date = value.split("/");
		
		switch (conf.format) {
			case "DD/MM/YYYY":
				return _date[2] + "/" + _date[1] + "/" + _date[0];
			break;
			
			case "MM/DD/YYYY":
				return _date[2] + "/" + _date[0] + "/" + _date[1];
			break;
		};
	};


    /**
     * Map of formart's date
     * @private
     * @name _FORMAT_DATE
     * @memberOf ch.Calendar
     */
	var _FORMAT_DATE = {
		"YYYY/MM/DD": function(date){ return  date.getFullYear() + "/" + (parseInt(date.getMonth(), 10) + 1 < 10 ? '0' : '') + (parseInt(date.getMonth(), 10) + 1) + "/" + (parseInt(date.getDate(), 10) < 10 ? '0' : '') + date.getDate(); },
		"DD/MM/YYYY": function(date){ return (parseInt(date.getDate(), 10) < 10 ? '0' : '') + date.getDate() + "/" + (parseInt(date.getMonth(), 10) + 1 < 10 ? '0' : '') + (parseInt(date.getMonth(), 10) + 1) + "/" + date.getFullYear()},
		"MM/DD/YYYY": function(date){ return (parseInt(date.getMonth(), 10) + 1 < 10 ? '0' : '') + "/" + (parseInt(date.getMonth(), 10) + 1) + "/" + date.getFullYear()}
	};


    /**
     * Selects an specific date to show
     * @private
	 * @function
     * @name _select
     * @memberOf ch.Calendar
     */
	var _select = function(date){

		_selected = new Date(date);

		that.currentDate = _selected;
		
		that.$content.html(_createMonth(_selected));
		
		that.element.value = _FORMAT_DATE[conf.format](_selected);

       /**
        * Callback function
        * @name onSelect
        * @type {Function}
        * @memberOf ch.Calendar
        */

		that.callbacks("onSelect");

		return that;
	};

     /**
     * Move to next month of calendar
     * @private
	 * @function
     * @name _nextMonth
     * @memberOf ch.Calendar
     */
    //TODO: crear una interfaz que resuleva donde moverse
	var _nextMonth = function(){
		that.currentDate = new Date(that.currentDate.getFullYear(),that.currentDate.getMonth()+1,1);
		that.$content.html(_createMonth(that.currentDate));

		// Callback
		that.callbacks("onNextMonth");

		return that;
	};

     /**
     * Move to prev month of calendar
     * @private
	 * @function
     * @name _prevMonth
     * @memberOf ch.Calendar
     */
	var _prevMonth = function(){
		that.currentDate = new Date(that.currentDate.getFullYear(),that.currentDate.getMonth()-1,1);
		that.$content.html(_createMonth(that.currentDate));

		// Callback
		that.callbacks("onPrevMonth");

		return that;
	};

     /**
     * Move to next year of calendar
     * @private
	 * @function
     * @name _nextYear
     * @memberOf ch.Calendar
     */
	var _nextYear = function(){
		that.currentDate = new Date(that.currentDate.getFullYear()+1,that.currentDate.getMonth(),1);
		that.$content.html(_createMonth(that.currentDate));

		return that;
	};

     /**
     * Move to prev year of calendar
     * @private
	 * @function
     * @name _prevYear
     * @memberOf ch.Calendar
     */
	var _prevYear = function(){
		that.currentDate = new Date(that.currentDate.getFullYear()-1,that.currentDate.getMonth(),1);
		that.$content.html(_createMonth(that.currentDate));

		return that;
	};

     /**
     * Move to prev year of calendar
     * @private
	 * @function
     * @name _reset
     * @memberOf ch.Calendar
     */
	var _reset = function(){
		_selected = conf.selected;
		that.currentDate = _selected || _today;
		that.element.value = "";

		that.$content.html(_createMonth(that.currentDate));

		// Callback
		that.callbacks("onReset");

		return that;
	};


/**
 *  Protected Members
 */

    /**
     * The current date that should show on calendar
     * @private
     * @name currentDate
     * @type {Date}
     * @memberOf ch.Calendar
     */
	that.currentDate = _selected || _today;

/**
 *  Public Members
 */
 
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Calendar
     */
   	that["public"].uid = that.uid;
    
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Calendar
     */
	that["public"].element = that.element;
    
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Calendar
     */	
	that["public"].type = that.type;

    /**
     * Open calendar
     * @public
     * @function
     * @name show
     * @memberOf ch.Calendar
     */
	that["public"].show = function(){
		that.children[0].show();
		
		return that["public"];
	};

    /**
     * Open calendar
     * @public
     * @function
     * @name hide
     * @memberOf ch.Calendar
     */
	that["public"].hide = function(){
		that.children[0].hide();

		return that["public"];
	};

    /**
     * Select a specific date.
     * @public
     * @function
     * @name select
     * @param {String} "YY/MM/DD".
     * @memberOf ch.Calendar
     */
	that["public"].select = function(date){

		_select(((date === "today")? _today : _parseDate(date)));

		return that["public"];
	};

    /**
     * Returns the selected date
     * @public
     * @function
     * @name getSelected
     * @memberOf ch.Calendar
     */
	that["public"].getSelected = function(){
		return _FORMAT_DATE[conf.format](_selected);
	};

    /**
     * Returns date of today
     * @public
     * @function
     * @name getToday
     * @memberOf ch.Calendar
     */
	that["public"].getToday = function(){
		return _FORMAT_DATE[conf.format](_today);
	};	

    /**
     * Move to the next month
     * @public
     * @function
     * @name next
     * @memberOf ch.Calendar
     */
	that["public"].next = function(){
		_nextMonth();

		return that["public"];
	};

    /**
     * Move to the prev month
     * @public
     * @function
     * @name prev
     * @memberOf ch.Calendar
     */
	that["public"].prev = function(){
		_prevMonth();

		return that["public"];
	};

    /**
     * Move to the next year
     * @public
     * @function
     * @name nextYear
     * @memberOf ch.Calendar
     */
	that["public"].nextYear = function(){
		_nextYear();

		return that["public"];
	};

    /**
     * Move to the prev year
     * @public
     * @function
     * @name prevYear
     * @memberOf ch.Calendar
     */
	that["public"].prevYear = function(){
		_prevYear();

		return that["public"];
	};

    /**
     * Reset the calendar to date of today
     * @public
     * @function
     * @name reset
     * @memberOf ch.Calendar
     */
	that["public"].reset = function(){
		_reset();

		return that["public"];
	};

/**
 *  Default event delegation
 */

	that.element.type = "text";

	that.element.value = ((_selected) ? _FORMAT_DATE[conf.format](_selected) : "");

	_createLayout();

	that.$content
		.html(_createMonth(that.currentDate))
		.appendTo(that.$container);

	that.$container.prepend(_arrows.$prev).prepend(_arrows.$next);

	return that;
		
};
/**
 * A navegable list of items, UI-Object.
 * @name Dropdown
 * @class Dropdown
 * @augments ch.Navs
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.dropdown = function(conf){


    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Dropdown
     */
	var that = this;

	conf = ch.clon(conf);
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
     * Adds keyboard events.
     * @private
     * @name shortcuts
     * @function
     * @memberOf ch.TabNavigator
     */
	var shortcuts = function(items){
		
		// Keyboard support
		var selected = 0;
		
		// Item selected by mouseover
		// TODO: It's over keyboard selection and it is generating double selection.
		$.each(items, function(i, e){
			$(e).bind("mouseenter", function(){
				selected = i;
				items.eq( selected ).focus();
			});
		});
		
		var selectItem = function(arrow, event){
			that.prevent(event);
			
			if(selected == ((arrow == "bottom") ? items.length - 1 : 0)) return;
			
			items.eq( selected ).blur();
			
			if(arrow == "bottom") selected += 1; else selected -= 1;
			
			items.eq( selected ).focus();
		};
		
		// Arrows
		ch.utils.document.bind(ch.events.KEY.UP_ARROW, function(x, event){ selectItem("up", event); });
		ch.utils.document.bind(ch.events.KEY.DOWN_ARROW, function(x, event){ selectItem("bottom", event); });
	};


/**
 *  Protected Members
 */
    /**
     * The component's trigger.
     * @private
     * @name $trigger
     * @type {jQuery Object}
     * @memberOf ch.Dropdown
     */
	that.$trigger = that.$element.children().eq(0);
    /**
     * The component's content.
     * @private
     * @name $content
     * @type {jQuery Object}
     * @memberOf ch.Dropdown
     */
	that.$content = that.$trigger.next().detach(); // Save on memory;

	that.show = function(event){
		that.prevent(event);

		that.$content.css('z-index', ch.utils.zIndex ++);
		
		if (that.$element.hasClass("secondary")) { // Z-index of trigger over conten 
			that.$trigger.css('z-index', ch.utils.zIndex ++);
		}; 

		
		that.$element
			.addClass("ch-dropdown-on")
			.css('z-index', ch.utils.zIndex ++);

		that.parent.show(event);
		that.position("refresh");

		// Reset all dropdowns
		$.each(ch.instances.dropdown, function(i, e){ 
			if (e.uid !== that.uid) e.hide();
		});

		// Close events
		ch.utils.document.one("click " + ch.events.KEY.ESC, function(event){ that.hide(event); });
		// Close dropdown after click an option (link)
		that.$content.find("a").one("click", function(){ that.hide(); });

		// Keyboard support
		var items = that.$content.find("a");
			items.eq(0).focus(); // Select first anchor child by default

		if (items.length > 1){ shortcuts(items); };

		return that;
	};

	that.hide = function(event){
		that.prevent(event);

        that.parent.hide(event);
        	that.$element.removeClass("ch-dropdown-on");

        // Unbind events
        ch.utils.document.unbind(ch.events.KEY.ESC + " " + ch.events.KEY.UP_ARROW + " " + ch.events.KEY.DOWN_ARROW);

		return that;
	};
	
/**
 *  Public Members
 */
 
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Dropdown
     */
   	that["public"].uid = that.uid;
    
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Dropdown
     */
	that["public"].element = that.element;
    
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Dropdown
     */	
	that["public"].type = that.type;
	
    /**
     * Shows component's content.
     * @public
     * @name show
     * @returns {Chico-UI Object}
     * @memberOf ch.Dropdown
     */
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};

    /**
     * Hides component's content.
     * @public
     * @name hide
     * @returns {Chico-UI Object}
     * @memberOf ch.Dropdown
     */ 
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Dropdown
     */
	that["public"].position = that.position;	


/**
 *  Default event delegation
 */		    

	that.configBehavior();
	
	that.$element.after( that.$content ); // Put content out of element
	ch.utils.avoidTextSelection(that.$trigger);
	
	if (that.$element.hasClass("secondary")) that.$content.addClass("secondary");
	
	// Prevent click on content (except links)
	that.$content.bind("click", function(event){ event.stopPropagation(); });
	
	// Position
	that.conf.position = {};
	that.conf.position.element = that.$content;
	that.conf.position.context = that.$trigger;
	that.conf.position.points = conf.points || "lt lb";
	that.conf.position.offset = "0 -1";

	return that;

};

/**
 * Is a contextual floated UI-Object.
 * @name Layer
 * @class Layer
 * @augments ch.Floats
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Tooltip
 * @see ch.Modal
 * @example
 * // Create a simple contextual layer
 * $("element").layer("<p>Content.</p>");
 */ 

ch.layer = function(conf) {
    
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Layer
     */ 
	var that = this;
	
	conf = ch.clon(conf);
	conf.cone = true;
	conf.classes = "box";
	conf.closeButton = 	(conf.event === 'click') ? true : false;
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
 
    /**
     * Delay time to show component's contents.
     * @private
     * @name showTime
     * @type {Number}
     * @default 400
     * @memberOf ch.Layer
     */ 
    var showTime = conf.showTime || 400;
    /**
     * Delay time to hide component's contents.
     * @private
     * @name hideTime
     * @type {Number}
     * @default 400
     * @memberOf ch.Layer
     */ 
    var hideTime = conf.hideTime || 400;

    /**
     * Show timer instance.
     * @private
     * @name st
     * @type {Timer}
     * @memberOf ch.Layer
     */ 
	var st;
	/**
     * Hide timer instance.
     * @private
     * @name ht
     * @type {Timer}
     * @memberOf ch.Layer
     */ 
	var ht;
    /**
     * Starts show timer.
     * @private
     * @name showTimer
     * @function
     * @memberOf ch.Layer
     */ 
	var showTimer = function(){ st = setTimeout(that.show, showTime) };
    /**
     * Starts hide timer.
     * @private
     * @name hideTimer
     * @function
     * @memberOf ch.Layer
     */ 
	var hideTimer = function(){ ht = setTimeout(that.hide, hideTime) };
    /**
     * Clear all timers.
     * @private
     * @name clearTimers
     * @function
     * @memberOf ch.Layer
     */ 
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
        		.one("mouseleave", function(event){
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
 
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Layer
     */
   	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Layer
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Layer
     */
	that["public"].type = that.type;
    /**
     * The component's content.
     * @public
     * @name content
     * @type {String}
     * @memberOf ch.Layer
     */
	that["public"].content = that.content;
	
    /**
     * Returns true if the component is active.
     * @public
     * @name isActive
     * @function 
     * @returns {Boolean}
     * @memberOf ch.Layer
     */
	that["public"].isActive = function(){
	   return that.active;
	}
    /**
     * Shows component's content.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Layer
     */
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};
    /**
     * Hides component's content.
     * @public
     * @name hide
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Layer
     */	
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Layer
     * @example
     * // Change layer's position.
     * $('input').layer("content").position({ 
     *    offset: "0 10",
     *    points: "lt lb"
     * });
     */
	that["public"].position = that.position;
	
/**
 *  Default event delegation
 */
	// Click
	if(conf.event === 'click') {
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
    $("body").bind(ch.events.LAYOUT.CHANGE, function(){ that.position("refresh") });
 

	return that;

};

/**
 * Is a centered floated window UI-Object.
 * @name Modal
 * @class Modal
 * @augments ch.Floats
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Tooltip
 * @see ch.Layer
 */ 

ch.modal = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Modal
     */
  	var that = this;
	conf = ch.clon(conf);
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

    /**
     * Reference to the dimmer object, the gray background element.
     * @private
     * @name $dimmer
     * @type {jQuery Object}
     * @memberOf ch.Modal
     */
	var $dimmer = $("<div class=\"ch-dimmer\">");
	
	// Set dimmer height for IE6
	if (ch.utils.html.hasClass("ie6")) { $dimmer.height( parseInt(document.documentElement.clientHeight, 10) * 3) };
	
    /**
     * Reference to dimmer control, turn on/off the dimmer object.
     * @private
     * @name dimmer
     * @type {Object}
     * @memberOf ch.Modal
     */
	var dimmer = {
		on: function() { //TODO: posicionar el dimmer con el positioner
			$dimmer
				.css("z-index", ch.utils.zIndex += 1)
				.appendTo("body")
				.fadeIn();
		
			if (that.type == "modal") {
				$dimmer.one("click", function(event){ that.hide(event) });
			};
			
			if (!ch.features.fixed) {
			  	ch.positioner({ element: $dimmer });
			};

			if ($("html").hasClass("ie6")) {
				$("select, object").css("visibility", "hidden");
			};
		},
		off: function() {
			$dimmer.fadeOut("normal", function(){
				$dimmer.detach();

				if ($("html").hasClass("ie6")) {
					$("select, object").css("visibility", "visible");
				};
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
 
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Modal
     */

    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Modal
     */

    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Modal
     */

    /**
     * Set and get component's content.
     * @public
     * @name content
     * @function
     * @param {String} Static content, DOM selector or URL. If argument is empty then will return the content.
     * @memberOf ch.Modal
     */

    /**
     * Returns true if the component is active.
     * @public
     * @name isActive
     * @function 
     * @returns {Boolean}
     * @memberOf ch.Modal
     */
	that["public"].isActive = function(){
	   return that.active;
	}
    /**
     * Create the UI if necesary and added to the DOM tree.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Modal
     */

    /**
     * Removes component from DOM tree.
     * @public
     * @name hide
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Modal
     */ 

    /**
     * Positioning configuration.
     * @public
     * @name position
     * @see ch.Object.position
     * @memberOf ch.Modal
     */
 
/**
 *  Default event delegation
 */	
	that.$trigger
		.css("cursor", "pointer")
		.bind("click", function(event){ that.show(event); });

	return that;
};


/**
 * Transition
 * @name Transition
 * @interface Transition
 * @augments ch.Modal
 * @memberOf ch.Modal
 * @returns {Chico-UI Object}
 */
ch.extend("modal").as("transition", function(conf) {
	conf.closeButton = false;
	conf.msg = conf.msg || conf.content || "Please wait...";
	conf.content = $("<div>")
		.addClass("loading")
		.after( $("<p>").html(conf.msg) );
	return conf;
});

/**
 * TabNavigator UI-Component for static and dinamic content.
 * @name TabNavigator
 * @class TabNavigator
 * @augments ch.Controllers
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.tabNavigator = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.TabNavigator
     */
	var that = this;

	conf = ch.clon(conf);

	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

    /**
     * The actual location hash, is used to know if there's a specific tab selected.
     * @private
     * @name hash
     * @type {String}
     * @memberOf ch.TabNavigator
     */
	var hash = window.location.hash.replace("#!", "");
    /**
     * A boolean property to know if the some tag should be selected.
     * @private
     * @name hashed
     * @type {Boolean}
     * @default false
     * @memberOf ch.TabNavigator
     */
    var hashed = false;
    /**
     * Get wich tab is selected.
     * @private
     * @name selected
     * @type {Number}
     * @memberOf ch.TabNavigator
     */
    var selected = conf.selected - 1 || conf.value - 1 || 0;
    /**
     * Create controller's children.
     * @private
     * @name createTabs
     * @function
     * @memberOf ch.TabNavigator
     */
	var createTabs = function(){

		// Children
		that.$triggers.find("a").each(function(i, e){

			// Tab context
			var tab = {};
				tab.uid = that.uid + "#" + i;
				tab.type = "tab";
				tab.element = e;
				tab.$element = $(e);
				tab.controller = that["public"];

			// Tab configuration
			var config = {};
				config.open = (selected == i);
				config.onShow = function(){
					selected = i;
				};
				
			if(ch.utils.hasOwn(that.conf, "cache")) {
				config.cache = that.conf.cache;
			};

           /**
            * Callback function
            * @name onContentLoad
            * @type {Function}
            * @memberOf ch.TabNavigator
            */
			if ( ch.utils.hasOwn(that.conf, "onContentLoad") ) config.onContentLoad = that.conf.onContentLoad;
           /**
            * Callback function
            * @name onContentError
            * @type {Function}
            * @memberOf ch.TabNavigator
            */
			if ( ch.utils.hasOwn(that.conf, "onContentError") ) config.onContentError = that.conf.onContentError;

			// Create Tabs
			that.children.push(
				ch.tab.call(tab, config)
			);

			// Bind new click to have control
			$(e).unbind("click").bind("click", function(event){
				that.prevent(event);
				select(i + 1);
			});

		});

		return;

	};
    /**
     * Select a child to show its content.
     * @private
     * @function
     * @memberOf ch.TabNavigator
     */
	var select = function(tab){

		tab = that.children[tab - 1];
		
		if(tab === that.children[selected]) return; // Don't click me if I'm open

		// Hide my open bro
		$.each(that.children, function(i, e){
			if(tab !== e) e.hide();
		});

		tab.show();

        //Change location hash
		window.location.hash = "#!" + tab.$content.attr("id");	
		
       /**
        * Callback function
        * @name onSelect
        * @type {Function}
        * @memberOf ch.TabNavigator
        */
		that.callbacks("onSelect");
		
        return that;
	};

/**
 *  Protected Members
 */ 
    
    /**
     * The component's triggers container.
     * @private
     * @name $triggers
     * @type {jQuery Object}
     * @memberOf ch.TabNavigator
     */
	that.$triggers = that.$element.children(":first").addClass("ch-tabNavigator-triggers");
    
    /**
     * The component's content.
     * @private
     * @name $content
     * @type {jQuery Object}
     * @memberOf ch.TabNavigator
     */
	that.$content = that.$triggers.next().addClass("ch-tabNavigator-content box");

    
/**
 *  Public Members
 */

    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.TabNavigator
     */
	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.TabNavigator
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.TabNavigator
     */
	that["public"].type = that.type;
    /**
     * Children instances associated to this controller.
     * @public
     * @name children
     * @type {Collection}
     * @memberOf ch.TabNavigator
     */
	that["public"].children = that.children;
    /**
     * Select a specific child.
     * @public
     * @function
     * @name select
     * @param {Number} tab Tab's index.
     * @memberOf ch.TabNavigator
     */
	that["public"].select = function(tab){
		select(tab);
		
		return that["public"];
	};
    /**
     * Returns the selected child's index.
     * @public
     * @function
     * @name getSelected
     * @returns {Number} selected Tab's index.
     * @memberOf ch.TabNavigator
     */	
	that["public"].getSelected = function(){ return (selected + 1); };

/**
 *  Default event delegation
 */	

    that.$element.addClass("ch-tabNavigator");

	createTabs();

	//Default: Load hash tab or Open first tab	
	for(var i = that.children.length; i--; ){
		if ( that.children[i].$content.attr("id") === hash ) {
			select(i + 1);
			
			hashed = true;
			
			break;
		};
	};

	return that;
	
};



/**
 * Simple unit of content for TabNavigators.
 * @abstract
 * @name Tab
 * @class Tab
 * @augments ch.Navs
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.tab = function(conf){
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Tab
     */
    var that = this;

	conf = ch.clon(conf);
	conf.icon = false;
	
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
     * Creates the basic structure for the tab's content.
     * @private
     * @name createContent
     * @function
     * @memberOf ch.Tab
     */
	var createContent = function(){
		var href = that.element.href.split("#");
		var controller = that.$element.parents(".ch-tabNavigator");
		var content = controller.find("#" + href[1]);
		
		// If there are a tabContent...
		if ( content.length > 0 ) {
			
			return content;
		
		// If tabContent doesn't exists        
		} else {
			/**
		     * Content configuration property.
		     * @public
		     * @name source
		     * @type {String}
		     * @memberOf ch.Tab
		     */
			that.source = that.element.href;
			
			var id = (href.length == 2) ? href[1] : "ch-tab" + that.uid.replace("#","-");
			
			// Create tabContent
			return $("<div id=\"" + id + "\" class=\"ch-hide\">").appendTo( controller.children().eq(1) );
		};

	};

/**
 *  Protected Members
 */ 
    /**
     * Reference to the trigger element.
     * @private
     * @name $trigger
     * @type {jQuery Object}
     * @memberOf ch.Tab
     */
	that.$trigger = that.$element;

    /**
     * The component's content.
     * @private
     * @name $content
     * @type {jQuery Object}
     * @memberOf ch.Tab
     */	
	that.$content = createContent();

    /**
     * Process the show event.
     * @private
     * @function
     * @name show
     * @returns {jQuery Object}
     * @memberOf ch.Tab
     */ 
	that.show = function(event){
		that.prevent(event);

		// Load my content if I'need an ajax request 
		if( ch.utils.hasOwn(that, "source") ) {
			that.$content.html( that.content() );
		};

		// Show me
		that.parent.show(event);
		
		return that;
	};
	
	/**
     * This callback is triggered when async data is loaded into component's content, when ajax content comes back.
     * @public
     * @name contentCallback
     * @returns {Chico-UI Object}
     * @memberOf ch.Floats
     */
    that.contentCallback = function(data) {
		that.staticContent = data;
        that.$content.html(that.staticContent);
    };
	

/**
 *  Public Members
 */
	
	
/**
 *  Default event delegation
 */

	that.configBehavior();
	
	return that;
}

/**
 * Simple Tooltip UI-Object.
 * @name Tooltip
 * @class Tooltip
 * @augments ch.Floats
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.tooltip = function(conf) {
    
    
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Tooltip
     */
	var that = this;
	
	conf = ch.clon(conf);
	conf.cone = true;
	conf.content = "<span>" + (that.element.title || that.element.alt) + "</span>";
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
     * The attribute that will provide the content. It can be "title" or "alt" attributes.
     * @private
     * @name attrReference
     * @type {string}
     * @memberOf ch.Tooltip
     */ 
	var attrReference = (that.element.title) ? "title" : "alt";

	/**
     * The original attribute content.
     * @private
     * @name attrContent
     * @type {string}
     * @memberOf ch.Tooltip
     */ 
	var attrContent = that.element.title || that.element.alt;

/**
 *  Protected Members
 */     
    that.$trigger = that.$element;

    that.show = function(event) {
        that.element[attrReference] = ""; // IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
		that.parent.show(event);
		
		return that;
	};
	
    that.hide = function(event) {
		that.element[attrReference] = attrContent;
		that.parent.hide(event);
		
		return that;
    };

/**
 *  Public Members
 */
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Tooltip
     */
    that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Tooltip
     */
    that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Tooltip
     */
    that["public"].type = that.type;
    /**
     * The component's content.
     * @public
     * @name content
     * @type {String}
     * @memberOf ch.Tooltip
     */
    that["public"].content = that.content;
    /**
     * Returns true if the component is active.
     * @public
     * @name isActive
     * @function 
     * @returns {Boolean}
     * @memberOf ch.Tooltip
     */
	that["public"].isActive = function() {
	   return that.active;
    };
    /**
     * Shows component's content.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Tooltip
     */
	that["public"].show = function(){
		that.show();

		return that["public"];
	};
    /**
     * Hides component's content.
     * @public
     * @name hide
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Tooltip
     */ 
	that["public"].hide = function(){
		that.hide();

		return that["public"];
	};
    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Tooltip
     */
	that["public"].position = that.position;

/**
 *  Default event delegation
 */	
 	
	that.$trigger
		.bind('mouseenter', that.show)
		.bind('mouseleave', that.hide);

    // Fix: change layout problem
    $("body").bind(ch.events.LAYOUT.CHANGE, function(){ that.position("refresh") });


	return that;
};

/**
 * Validate strings.
 * @name String 
 * @class String
 * @interface
 * @augments ch.Watcher
 * @memberOf ch
 * @param {String} msg Validation message
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a string validation
 * $("input").string("This field must be a string.");
 */

ch.extend("watcher").as("string", function (conf) {

    // $.string("message"); support
    if ( !conf.text && !conf.email && !conf.url && !conf.maxLength && !conf.minLength ) {
        conf.text = true;
    };
    
    // Define the conditions of this interface
    conf.conditions = [{
            name: "text", 
            patt: /^([a-zA-Z\s]+)$/
        },{
            name:"email",
            patt: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/ 
        },{
            name: "url",
            patt: /^((https?|ftp|file):\/\/|((www|ftp)\.)|(\/|.*\/)*)[a-z0-9-]+((\.|\/)[a-z0-9-]+)+([/?].*)?$/ 
        },{
            name: "minLength",
            expr: function(a,b) { return a.length >= b } 
        },{
            name: "maxLength",
            expr: function(a,b) { return a.length <= b } 
        }];

    return conf;

});

/**
 * Validate email sintaxis.
 * @name Email
 * @interface
 * @augments ch.String
 * @memberOf ch.String
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a email validation
 * $("input").email("This field must be a valid email.");
 */

ch.extend("string").as("email");

/**
 * Validate URL sintaxis.
 * @name Url
 * @interface
 * @augments ch.String
 * @memberOf ch.String
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a URL validation
 * $("input").url("This field must be a valid URL.");
 */

ch.extend("string").as("url");


/**
 * Validate a minimun amount of characters.
 * @name MinLength
 * @interface
 * @augments ch.String
 * @memberOf ch.String
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a minLength validation
 * $("input").minLength(10, "At least 10 characters..");
 */

ch.extend("string").as("minLength");


/**
 * Validate a maximun amount of characters.
 * @name MaxLength
 * @interface
 * @augments ch.String
 * @memberOf ch.String
 * @param {Number} value Maximun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a maxLength validation
 * $("input").maxLength(10, "No more than 10 characters..");
 */

ch.extend("string").as("maxLength");
/**
 * Validate numbers.
 * @name Number
 * @class Number
 * @interface
 * @augments ch.Watcher
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Create a number validation
 * $("input").number("This field must be a number.");
 */

ch.extend("watcher").as("number", function(conf) {

    // $.number("message"); support
	if ( !conf.number && !conf.min && !conf.max && !conf.price ) {
		conf.number = true;
	};
  
    // Define the conditions of this interface
    conf.conditions = [{
            name: "number",
            patt: /^([0-9\s]+)$/ 
    	},{
            name: "min",
            expr: function(a,b) { return a >= b } 
        },{
            name: "max",
            expr: function(a,b) { return a <= b } 
        },{
            name: "price",
            patt: /^(\d+)[.,]?(\d?\d?)$/ 
        }];

    return conf;

});

/**
 * Validate a number with a minimun value.
 * @name Min
 * @interface
 * @augments ch.Number
 * @memberOf ch.Number
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * $("input").min(10, "Write a number bigger than 10");
 */

ch.extend("number").as("min");


/**
 * Validate a number with a maximun value.
 * @name Max
 * @interface
 * @augments ch.Number
 * @memberOf ch.Number
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * $("input").max(10, "Write a number smaller than 10");
 */
 
ch.extend("number").as("max");

/**
 * Validate a number with a price format.
 * @name Price
 * @interface
 * @augments ch.Number
 * @memberOf ch.Number
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * $("input").price("Write valid price.");
 */
 
ch.extend("number").as("price");
/**
 * Create custom validation interfaces for Watcher validation engine.
 * @name Custom
 * @class Custom
 * @interface
 * @augments ch.Watcher
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Watcher
 * @example
 * // Validate a even number
 * $("input").custom(function(value){
 *      return (value%2==0) ? true : false;
 * }, "Enter a even number");
 */

ch.extend("watcher").as("custom", function(conf) {
	
	if (!conf.lambda) {
        alert("Custom Validation fatal error: Need a function to evaluate, try $().custom(function(){},\"Message\");");
    };
	// Define the validation interface    
    conf.custom = true;
    // Define the conditions of this interface
    conf.conditions = [{
		// I don't have pre-conditions, comes within conf.lambda argument 
        name: "custom",
        func: conf.lambda 
    }];

    return conf;  
});
/**
 * Required interface for Watcher.
 * @name Required
 * @class Required
 * @interface
 * @augments ch.Watcher
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Number
 * @see ch.String
 * @see ch.Custom
 * @example
 * // Simple validation
 * $("input").required("This field is required");
 * @see ch.Watcher
 */

ch.extend("watcher").as("required", function(conf) {
    
    // Define the validation interface    
    conf.required = true;
    // Define the conditions of this interface
    conf.conditions = [{
        name: "required"
    }];
    
    return conf;
    
});
/**
 * Shows messages on the screen with a contextual floated UI-Component.
 * @name Helper
 * @class Helper
 * @augments ch.Floats
 * @memberOf ch
 * @param {Controller Object} o Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.helper = function(controller){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Helper
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
	
//	that.$content.prepend('<span class="ico error">Error: </span>');
	
	that.show = function() {

		if ( !that.active ) {
			// Load content and show!
			that.parent.show();
		};			

		// Just Reload content!
		that.$content.html('<span class="ico error">Error: </span><p>' + that.content() + '</p>');		

		return that;
	};


/**
 *  Public Members
 */

    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Helper
     */ 

   	
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Helper
     */

    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Helper
     */

    /**
     * The component's content.
     * @public
     * @function
     * @name content
     * @param {String}
     * @memberOf ch.Helper
     */

    /**
     * Returns true if the component is active.
     * @public
     * @name active
     * @function
     * @returns {Boolean}
     * @memberOf ch.Helper
     */

    /**
     * Shows component's content.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Helper
     */

    /**
     * Hides component's content.
     * @public
     * @name hide
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Helper
     */ 

    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Helper
     * @example
     * // Change helper's position.
     * $('input').required("message").helper.position({ 
     *    offset: "0 10",
     *    points: "lt lb"
     * });
     */


/**
 *  Default event delegation
 */

    $("body").bind(ch.events.LAYOUT.CHANGE, function(){ 
        that.position("refresh");
    });

	 
	return that;
};

/**
 * Forms is a Controller of DOM's HTMLFormElement.
 * @name Form
 * @class Form
 * @augments ch.Controllers
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.form = function(conf) {

/**
 *  Validation
 */
	// Are there action and submit type?
	if ( this.$element.find(":submit").length == 0 || this.$element.attr("action") == "" ){ 
		alert("Form fatal error: The <input type=submit> is missing, or need to define a action attribute on the form tag.");
		return;
	};

	// Is there form in map instances?	
	if ( ch.utils.hasOwn(ch.instances, "form") && ch.instances.form.length > 0 ){
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
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Form
     */ 
	var that = this;
	
	conf = ch.clon(conf);
	// Disable HTML5 browser-native validations
	that.$element.attr("novalidate", "novalidate");
	// Grab submit button
	that.$submit = that.$element.find("input:submit");
	
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
     * A Boolean property that indicates is exists errors in the form.
     * @private
     * @name status
     * @type {Boolean}
     * @memberOf ch.Form
     */ 
	var status = true;
	
    /**
     * Executes all children's validations, if finds a error will trigger 'onError' callback, if no error is found will trigger 'onValidate' callback, and allways trigger 'afterValidate' callback.
     */
	var validate = function(){

       /**
        * Callback function
        * @name beforeValidate
        * @type {Function}
        * @memberOf ch.Form
        */
        that.callbacks("beforeValidate");
		
		// Status OK (with previous error)
		if ( !status ) {
			status = true;
		};
		
        var i = 0, j = that.children.length, toFocus, childrenError = [];
		// Shoot validations
		for ( i; i < j; i++ ) {
		    var child = that.children[i];
			 // Validate
           child.validate();
           // Save children with errors
           if ( child.active() ) {
               childrenError.push( child );
           }
		};
        
        // Is there's an error
        if ( childrenError.length > 0 ) {
            status = false;
            // Issue UI-332: On validation must focus the first field with errors.
            // Doc: http://wiki.ml.com/display/ux/Mensajes+de+error
            if (childrenError[0].element.tagName === "DIV") {
                $(childrenError[0].element).find("input:first").focus();
            } else {
                childrenError[0].element.focus();
            }
        } else {
            status = true;    
        }
      /**
        * Callback function
        * @name onValidate
        * @type {Function}
        * @memberOf ch.Form
        */
      /**
        * Callback function
        * @name onError
        * @type {Function}
        * @memberOf ch.Form
        */
        status ? that.callbacks("onValidate") : that.callbacks("onError");  

      /**
        * Callback function
        * @name afterValidate
        * @type {Function}
        * @memberOf ch.Form
        */
        that.callbacks("afterValidate");

        return that;
    };

    /**
     * This methods triggers the 'beforSubmit' callback, then will execute validate() method, 
     * and if is defined triggers 'onSubmit' callback, at the end will trigger the 'afterSubmit' callback.
     */
	var submit = function(event) {

       /**
        * Callback function
        * @name beforeSubmit
        * @type {Function}
        * @memberOf ch.Form
        */
        that.callbacks("beforeSubmit");

        // re-asign submit event   
        that.$element.one("submit", submit);

        // Execute all validations
		validate();
		
		// If an error ocurs prevent default actions
		if ( !status ) {
            that.prevent(event);
		}

       /**
        * Callback function
        * @name onSubmit
        * @type {Function}
        * @memberOf ch.Form
        */

		// Is there's no error but there's a onSubmit callback
		if ( status && ch.utils.hasOwn(conf, "onSubmit")) {
            // Avoid default actions
            that.prevent(event);
            // To execute defined onSubmit callback
            that.callbacks("onSubmit");  
	    }

       /**
        * Callback function
        * @name afterSubmit
        * @type {Function}
        * @memberOf ch.Form
        */

        that.callbacks("afterSubmit");

        // Return that to chain methods
        return that;
	};

    /**
     * Use this method to clear al validations.
     */
	var clear = function(event){		
		
		that.prevent(event);		
        
        var i = 0, j = that.children.length;
		for(i; i < j; i += 1) {
		  that.children[i].reset();
		}
 
       /**
        * Callback function
        * @name onClear
        * @type {Function}
        * @memberOf ch.Form
        */
		that.callbacks("onClear");
		
		return that;
	};

    /**
     * Use this method to reset the form's input elements.
     */	
	var reset = function(event){
		clear();
		that.element.reset(); // Reset html form native
       /**
        * Callback function
        * @name onReset
        * @type {Function}
        * @memberOf ch.Form
        */
		that.callbacks("onReset");
		
		return that;
	};

			
/**
 *  Public Members
 */	
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Form
     */ 
	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Form
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Form
     */
	that["public"].type = that.type;
    /**
     * Watcher instances associated to this controller.
     * @public
     * @name children
     * @type {Collection}
     * @memberOf ch.Form
     */
	that["public"].children = that.children;
    /**
     * Collection of messages defined.
     * @public
     * @name messages
     * @type {String}
     * @memberOf ch.Form
     */
	that["public"].messages = conf.messages || {};
    /**
     * Executes all children's validations, if finds a error will trigger 'onError' callback, if no error is found will trigger 'onValidate' callback, and allways trigger 'afterValidate' callback.
     * @function
     * @name validate
     * @memberOf ch.Form
     * @returns {Chico-UI Object}
     */
	that["public"].validate = function() { 
		validate(); 
		
		return that["public"]; 
	};
	
    /**
     * This methods triggers the 'beforSubmit' callback, then will execute validate() method, and if is defined triggers 'onSubmit' callback, at the end will trigger the 'afterSubmit' callback.
     * @function
     * @name submit
     * @memberOf ch.Form
     * @returns {Chico-UI Object}
     */
	that["public"].submit = function() { 
		submit(); 
		
		return that["public"]; 
	};

    /**
     * Return the status value.
     * @function
     * @name getStatus
     * @memberOf ch.Form
     * @returns {Chico-UI Object}
     */ 	
	that["public"].getStatus = function(){
		return status;	
	};

    /**
     * Use this method to clear al validations.
     * @function
     * @name clear
     * @memberOf ch.Form
     * @returns {Chico-UI Object}
     */ 
	that["public"].clear = function() { 
		clear(); 
		
		return that["public"]; 
	};
    /**
     * Use this method to clear al validations.
     * @function
     * @name reset
     * @memberOf ch.Form
     * @returns {Chico-UI Object}
     */ 
	that["public"].reset = function() { 
		reset(); 
		
		return that["public"]; 
	};


/**
 *  Default event delegation
 */	

	// patch exists because the components need a trigger
	if (ch.utils.hasOwn(conf, "onSubmit")) {
		that.$element.bind('submit', function(event){ that.prevent(event); });
		// Delete all click handlers asociated to submit button >NATAN: Why?
			//Because if you want do something on submit, you need that the trigger (submit button) 
			//don't have events associates. You can add funcionality on onSubmit callback
		that.$element.find(":submit").unbind('click');
	};

	// Bind the submit
	that.$element.bind("submit", submit);
	
	// Bind the reset
	that.$element.find(":reset, .resetForm").bind("click", function(event){ reset(event); });

	return that;
};
/**
 * Viewer UI-Component for images, videos and maps.
 * @name Viewer
 * @class Viewer
 * @augments ch.Controllers
 * @requires ch.Carousel
 * @requires ch.Zoom
 * @memberOf ch
 * @requires ch.onImagesLoads
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.viewer = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Viewer
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
     * Reference to the viewer's visual object.
     * @private
     * @name $viewer
     * @type {jQuery Object}
     * @memberOf ch.Viewer
     */
	var $viewer = that.$element.addClass("ch-viewer");
	conf.width = $viewer.outerWidth();
	conf.height = $viewer.outerHeight();

    /**
     * Reference to the viewer's internal content.
     * @private
     * @name $content
     * @type {jQuery Object}
     * @memberOf ch.Viewer
     */
	var $content = $viewer.children().addClass("ch-viewer-content");

    /**
     * Reference to the viewer's display element.
     * @private
     * @name $display
     * @type {jQuery Object}
     * @memberOf ch.Viewer
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

    /**
     * Collection of viewer's children.
     * @private
     * @name items
     * @type {Collection}
     * @memberOf ch.Viewer
     */
	var items = $content.children();
	
    /**
     * Amount of children.
     * @private
     * @name itemsAmount
     * @type {Number}
     * @memberOf ch.Viewer
     */
	var itemsAmount = items.length;
	
    /**
     * Collection of anchors finded on items collection.
     * @private
     * @name itemsAnchor
     * @type {Collection}
     * @memberOf ch.Viewer
     */
	var itemsAnchor = items.children("a");
	
    /**
     * Collection of references to HTMLIMGElements or HTMLObjectElements.
     * @private
     * @name itemsChildren
     * @type {Object}
     * @memberOf ch.Viewer
     */
	var itemsChildren = items.find("img, object");
	
	/**
     * Iniatilizes Zoom component on each anchor
     * @private
     * @name instanceZoom
     * @type {Object}
     * @memberOf ch.Viewer
     */
	var instanceZoom = function() {
		
		var _size = {};
			_size.width = conf.zoomWidth || $viewer.width();
			
			if(_size.width === "auto"){
				_size.width = $viewer.parent().width() - $viewer.outerWidth() - 20; // 20px of Zoom default offset
			};
			
			_size.height = conf.zoomHeight || $viewer.height();
		
		itemsAnchor.each(function(i, e){
			
			// Initialize zoom on imgs loaded
			$(e).children("img").onImagesLoads(function(){
				var component = {
					uid: that.uid + "#" + i,
					type: "zoom",
					element: e,
					$element: $(e)
				};
	
				var configuration = {
					context: $viewer,
					onShow: function(){
						this.width( _size.width );
						this.height( _size.height );
					}
				};
	
				that.children.push( ch.zoom.call(component, configuration).public );
			});
			
		});
	};
	
    /**
     * Creates all thumbnails and configure it as a Carousel.
     * @private
     * @function
     * @name createThumbs
     * @memberOf ch.Viewer
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
	
    /**
     * Moves the viewer's content.
     * @private
     * @function
     * @name move
     * @param {Number} item
     * @returns {Chico-UI Object} that
     * @memberOf ch.Viewer
     */
	var move = function(item){
		// Validation
		if(item > itemsAmount || item < 1 || isNaN(item)) return that;

		// Visual config
		$(thumbnails.children[thumbnails.selected - 1]).removeClass("ch-thumbnail-on"); // Disable thumbnail
		$(thumbnails.children[item - 1]).addClass("ch-thumbnail-on"); // Enable next thumbnail
		
		// Move Display carousel
		$display.goTo(item);
		
		// Move thumbnails carousel if item selected is in other page
		var nextThumbsPage = Math.ceil( item / thumbnails.carousel.getItemsPerPage() );
		if(thumbnails.carousel.getPage() != nextThumbsPage) thumbnails.carousel.goTo( nextThumbsPage );
		
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
		
       /**
        * Callback function
        * @name onMove
        * @type {Function}
        * @memberOf ch.Viewer
        */
		that.callbacks("onMove");
	
		return that;
	};
	
    /**
     * Handles the visual behavior of arrows
     * @private
     * @name arrows
     * @type {Object}
     * @memberOf ch.Viewer
     */
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

    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Viewer
     */
	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Viewer
     */
	that["public"].element = that.element;
	
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Viewer
     */
	that["public"].type = that.type;
	
    /**
     * Children instances associated to this controller.
     * @public
     * @name children
     * @type {Collection}
     * @memberOf ch.Viewer
     */
 	that["public"].children = that.children;
	
	// Full behavior
	if(itemsAmount > 1) {
        /**
         * Selects a specific viewer's child.
         * @public
         * @function
         * @name moveTo 
         * @param {Number} item Recieve a index to select a children.
         * @memberOf ch.Viewer
         */
        // TODO: This method should be called 'select'?
		that["public"].moveTo = function(item){ that.move(item); return that["public"]; };
		
        /**
         * Selects the next child available.
         * @public
         * @function
         * @name next
         * @memberOf ch.Viewer
         */
		that["public"].next = function(){ that.next(); return that["public"]; };
		
        /**
         * Selects the previous child available.
         * @public
         * @function
         * @name prev
         * @memberOf ch.Viewer
         */
		that["public"].prev = function(){ that.prev(); return that["public"]; };
		
        /**
         * Get the index of the selected child.
         * @public
         * @function
         * @name getSelected
         * @memberOf ch.Viewer
         */
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
		
		// Move to the first item without callback
		that.move(1);
		
		// Turn on Next arrow
		arrows.next.on();
	};

	$viewer.find(".ch-mask").eq(0).height( $(itemsChildren[0]).height() );
	
	// Initialize Zoom if there are anchors
	if( ch.utils.hasOwn(ch, "zoom") && itemsAnchor.length > 0) {
		instanceZoom();
	};
	
	ch.utils.avoidTextSelection(that.element);

	return that;
};

/**
 * Expando is a UI-Component.
 * @name Expando
 * @class Expando
 * @augments ch.Navs
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */
 
ch.expando = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Expando
     */
    var that = this;
		
	conf = ch.clon(conf);
	that.conf = conf;
	
/**
 *	Inheritance
 */

	that = ch.navs.call(that);
	that.parent = ch.clon(that);

/**
 *  Protected Members
 */ 

	that.$trigger = that.$element.children().eq(0).wrapInner("<span>").children();

	that.$content = that.$element.children().eq(1);

/**
 *  Public Members
 */
 
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Expando
     */
   	that["public"].uid = that.uid;
    
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Expando
     */
 	that["public"].element = that.element;
 	
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Expando
     */
	that["public"].type = that.type;
	
    /**
     * Shows component's content.
     * @public
     * @name show
     * @returns {Chico-UI Object}
     * @memberOf ch.Expando
     */
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};

    /**
     * Hides component's content.
     * @public
     * @name hide
     * @returns {Chico-UI Object}
     * @memberOf ch.Expando
     */	
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
	

/**
 *  Default event delegation
 */		
    
	that.configBehavior();
	ch.utils.avoidTextSelection(that.$trigger);

	return that;

};
/**
 * Menu is a UI-Component.
 * @name Menu
 * @class Menu
 * @augments ch.Controllers
 * @requires ch.Expando
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */
 
ch.menu = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Menu
     */
	var that = this;
	
	conf = ch.clon(conf);
	
	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

	/**
     * Indicates witch child is opened
     * @private
     * @type {Number}
     * @memberOf ch.Menu
     */
	var selected = conf.selected - 1;

	/**
     * Inits an Expando component on each list inside main HTML code snippet
     * @private
     * @name createLayout
     * @function
     * @memberOf ch.Menu
     */
	var createLayout = function(){
		
		// No slide efects for IE6 and IE7
		var efects = (ch.utils.html.hasClass("ie6") || ch.utils.html.hasClass("ie7")) ? false : true;
		
		// List elements
		that.$element.children().each(function(i, e){
			
			// Children of list elements
			var $child = $(e).children();
		
			// Anchor inside list
			if($child.eq(0).prop("tagName") == "A") {
				
				// Add class to list and anchor
				$(e).addClass("ch-bellows").children().addClass("ch-bellows-trigger");
				
				// Add anchor to that.children
				that.children.push( $child[0] );
				
				return;
			};
		
			// List inside list, inits an Expando
			var expando = $(e).expando({
				// Show/hide on IE6/7 instead slideUp/slideDown
				fx: efects,
				onShow: function(){
					// Updates selected tab when it's opened
					selected = i;

                    /**
                     * Callback function
                     * @name onSelect
                     * @type {Function}
                     * @memberOf ch.Menu
                     */
					that.callbacks.call(that, "onSelect");
				}
			});
			
			// Add expando to that.children
			that.children.push( expando );

		});
	};
	
	/**
     * Opens specific Expando child and optionally grandson
     * @private
     * @function
     * @memberOf ch.Menu
     */
	var select = function(item){

		var child, grandson;
		
		// Split item parameter, if it's a string with hash
		if (typeof item == "string") {
			var sliced = item.split("#");
			child = sliced[0] - 1;
			grandson = sliced[1];
		
		// Set child when item is a Number
		} else {
			child = item - 1;
		};
		
		// Specific item of that.children list
		var itemObject = that.children[ child ];
		
		// Item as object
		if (ch.utils.hasOwn(itemObject, "uid")) {
			
			// Show this list
			itemObject.show();
			
			// Select grandson if splited parameter got a specific grandson
			if (grandson) $(itemObject.element).find("a").eq(grandson - 1).addClass("ch-menu-on");
			
			// Accordion behavior
			if (conf.accordion) {
				// Hides every that.children list that don't be this specific list item
				$.each(that.children, function(i, e){
					if(
						// If it isn't an anchor...
						(e.tagName != "A") &&
						// If there are an unique id...
						(ch.utils.hasOwn(e, "uid")) &&
						// If unique id is different to unique id on that.children list...
						(that.children[ child ].uid != that.children[i].uid)
					){
						// ...hide it
						e.hide();
					};
				});
				
			};
		
		// Item as anchor
		} else{
			// Just selects it
			that.children[ child ].addClass("ch-menu-on");
		};

		return that;
	};
	
	/**
     * Binds controller's own click to expando triggers
     * @private
     * @name configureAccordion
     * @function
     * @memberOf ch.Menu
     */
	var configureAccordion = function(){

		$.each(that.children, function(i, e){
			$(e.element).find(".ch-expando-trigger").unbind("click").bind("click", function(){
				select(i + 1);
			});
		});
		
		return;
	};

/**
 *  Protected Members
 */

/**
 *  Public Members
 */
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Menu
     */ 	
	that["public"].uid = that.uid;
	
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Menu
     */
	that["public"].element = that.element;
	
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Menu
     */
	that["public"].type = that.type;
	
    /**
     * Select a specific children.
     * @public
     * @name select
     * @function
     * @memberOf ch.Menu
     */
	that["public"].select = function(item){
		select(item);

		return that["public"];
	};

/**
 *  Default event delegation
 */	
	
	// Sets component main class name
	that.$element.addClass('ch-menu');
	
	// Inits an Expando component on each list inside main HTML code snippet
	createLayout();
	
	// Accordion behavior
	if (conf.accordion) configureAccordion();
	
	// Select specific item if there are a "selected" parameter on component configuration object
    if (ch.utils.hasOwn(conf, "selected")) select(conf.selected);
    
	return that;
	
};


/**
 * Accordion is a UI-Component.
 * @name Accordion
 * @interface Accordion
 * @augments ch.Menu
 * @memberOf ch.Menu
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.extend("menu").as("accordion");

    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Menu.Accordion
     */     
    
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Menu.Accordion
     */
    
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Menu.Accordion
     */
    
    /**
     * Select a specific children.
     * @public
     * @name select
     * @function
     * @memberOf ch.Menu.Accordion
     */

/**
 * Zoom is a standalone UI component that shows a contextual reference to an augmented version of main declared image.
 * @name Zoom
 * @class Zoom
 * @augments ch.Floats
 * @requires ch.Positioner
 * @requires ch.onImagesLoads
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.zoom = function(conf) {

    /**
     * Reference to an internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Zoom
     */
	var that = this;

	conf = ch.clon(conf);
	conf.fx = false;
	
	conf.position = {};
	conf.position.context = conf.context || that.$element;
	conf.position.offset = conf.offset || "20 0";
	conf.position.points = conf.points || "lt rt";
	conf.position.hold = true;

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
     * Reference to main image declared on HTML code snippet.
     * @private
     * @name original
     * @type {Object}
     * @memberOf ch.Zoom
     */
	var original = {};
		original.img = that.$element.children();
		original["width"] = original.img.prop("width");
		original["height"] = original.img.prop("height");

    /**
     * Reference to the augmented version of image, that will be displayed in context.
     * @private
     * @name zoomed
     * @typeÂ {Object}
     * @memberOf ch.Zoom
     */
	var zoomed = {};
		// Define the content source 
		zoomed.img = that.source = $("<img>").prop("src", that.element.href);
	
    /**
     * Seeker is the visual element that follows mouse movement for referencing to zoomable area into original image.
     * @private
     * @name seeker
     * @typeÂ {Object}
     * @memberOf ch.Zoom
     */
	var seeker = {};
		seeker.shape = $("<div>").addClass("ch-seeker ch-hide")
    
    /**
     * Gets the mouse position relative to original image position, and accordingly moves the zoomed image.
     * @private
     * @function
     * @name move
     * @param {Mouse Event Object} event
	 * @returns {void}
     * @memberOf ch.Zoom
     */
	var move = function(event){
		
		// Cursor coordinates relatives to original image
		var x = event.pageX - original.offset.left;
		var y = event.pageY - original.offset.top;
		
		// Seeker axis
		var limit = {};
			limit.left = parseInt(x - seeker["width"]);
			limit.right = parseInt(x + seeker["width"]);
			limit.top = parseInt(y - seeker["height"]);
			limit.bottom = parseInt(y + seeker["height"]);

		// Horizontal: keep seeker into limits
		if(limit.left >= 0 && limit.right < original["width"] - 1) {
			zoomed.img.css("left", -( (parseInt(zoomed["width"] * x) / original["width"]) - (conf.width / 2) ));
			seeker.shape.css("left", limit.left);
		};
		
		// Vertical: keep seeker into limits
		if(limit.top >= 0 && limit.bottom < original["height"] - 1) {
			zoomed.img.css("top", -( (parseInt(zoomed["height"] * y) / original["height"]) - (conf.height / 2) ));
			seeker.shape.css("top", limit.top);
		};
		
		return;
	};
		
	/**
     * Calculates zoomed image sizes and adds event listeners to trigger of float element
     * @private
     * @function
     * @name init
	 * @returns {void}
     * @memberOf ch.Zoom
     */
	var init = function(){
		// Zoomed image size
		zoomed["width"] = zoomed.img.prop("width");
		zoomed["height"] = zoomed.img.prop("height");
		
		// Anchor
		that.$element
			// Apend Seeker
			.append( seeker.shape )
			
			// Show
			.bind("mouseenter", that.show)
			
			// Hide
			.bind("mouseleave", that.hide)
		
		return;
	};
	
/**
 *  Protected Members
 */
	
	/**
     * Anchor that wraps the main image and links to zoomed image file.
     * @public
     * @name $trigger
     * @typeÂ {Object}
     * @memberOf ch.Zoom
     */
	that.$trigger = that.$element;
	
	that.show = function(){
		// Recalc offset of original image
		original.offset = original.img.offset();

		// Move
		that.$element.bind("mousemove", function(event){ 
			move(event); 
		});

		// Seeker
		seeker.shape.removeClass("ch-hide");
		
		// Floats show
		that.parent.show();

		return that;
	};
	
	that.hide = function(){
		// Move
		that.$element.unbind("mousemove");
		
		// Seeker
		seeker.shape.addClass("ch-hide");
		
		// Floats hide
		that.parent.hide();
		
		return that;
	};

    /**
     * Triggered on anchor click, it prevents redirection to zoomed image file.
     * @private
     * @function
     * @name enlarge
     * @param {Mouse Event Object} event
	 * @returns {Internal component instance}
     * @memberOf ch.Zoom
     */
	that.enlarge = function(event){
		that.prevent(event);
		
		// Do what you want...
		
		return that;
	};
	
    /**
     * Getter and setter for size attributes of float that contains the zoomed image.
     * @private
     * @function
     * @name size
     * @param {String} prop Property that will be setted or getted, like "width" or "height".
     * @param {String} [data] Only for setter. It's the new value of defined property.
	 * @returns {Internal component instance}
     * @memberOf ch.Zoom
     */
	that.size = function(prop, data) {

		if (data) {

			// Seeker: shape size relative to zoomed image respect zoomed area
			var size = (original[prop] * data) / zoomed[prop];
		
			// Seeker: sets shape size
			seeker.shape[prop](size);
		
			// Seeker: save shape half size for position it respect cursor
			seeker[prop] = size / 2;

		};

		return that.parent.size(prop, data);
	};

/**
 *  Public Members
 */
 
    /**
     * Unique identifier of component instance.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Zoom
     */
   	
    /**
     * Reference to trigger element.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Zoom
     */
	
    /**
     * Component type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Zoom
     */
	
    /**
     * Gets the component content. In Zoom component it's the zoomed image reference.
     * @public
     * @name content
     * @function
	 * @returns {HTMLIMGElement}
     * @memberOf ch.Zoom
     */
	that["public"].content = function(){
		// Only on Zoom, it's limmited to be a getter
		return that.content();
	};
	
    /**
     * Shows float element that contains the zoomed image.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Zoom
     */
	
    /**
     * Hides float element that contains the zoomed image.
     * @public
     * @name hide
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Zoom
     */

    /**
     * Gets and sets Zoom position.
     * @public
     * @name position
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Zoom
     * @example
     * // Change default position.
     * $("a").zoom().position({
     *    offset: "0 10",
     *    points: "lt lb"
     * });
     * @example
     * // Refresh position.
     * $("a").zoom().position("refresh");
     * @example
     * // Get current position.
     * $("a").zoom().position();
     */
	
    /**
     * Gets and sets the width size of float element.
     * @private
     * @name width
     * @function
     * @returns {Chico-UI Object}
     * @param {Number} data Width value.
     * @memberOf ch.Zoom
     * @example
     * // Gets width of Zoom float element.
     * foo.width();
     * @example
     * // Sets width of Zoom float element and updates the seeker size to keep these relation.
     * foo.width(500);
     */

	
    /**
     * Gets and sets the height size of float element.
     * @private
     * @name height
     * @function
     * @returns {Chico-UI Object}
     * @param {Number} data Height value.
     * @memberOf ch.Zoom
     * @example
     * // Gets height of Zoom float element.
     * foo.height();
     * @example
     * // Sets height of Zoom float element and update the seeker size to keep these relation.
     * foo.height(500);
     */

	
/**
 *  Default event delegation
 */
	
	// Anchor
	that.$element
		.addClass("ch-zoom-trigger")
		
		// Size (same as image)
		.css({"width": original["width"], "height": original["height"]})
		
		// Enlarge
		.bind("click", function(event){ that.enlarge(event); });
	
	// Initialize when zoomed image loads...
	zoomed.img.onImagesLoads( init );
	
	return that;
};

ch.init();
