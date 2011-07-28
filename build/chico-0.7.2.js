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
	version: "0.7.2",
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
			
			if (!ch.utils.isSelector(selector)) { return false }

			return $(selector, context).length > 0;
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
			* @constant
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
			* @constant
			* @memberOf ch.Events.VIEWPORT
			* @see ch.Viewport
			*/
			SCROLL: "ch-scroll",
			/**
			* Every time Chico-UI needs to inform all visual components that window has been resized, he triggers this event.
			* @name RESIZE
			* @constant
			* @memberOf ch.Events.VIEWPORT
			* @see ch.Viewport
			*/
			RESIZE: "ch-resize"
		},
		/**
		* Keryboard event collection.
		* @name KEY
		* @constant
		* @namespace KEY
		* @memberOf ch.Events
		*/
		KEY: {
			/**
			* Enter key event.
			* @name ENTER
			* @constant
			* @memberOf ch.Events.KEY
			*/
			ENTER: "enter",
			/**
			* Esc key event.
			* @name ESC
			* @constant
			* @memberOf ch.Events.KEY
			*/
			ESC: "esc",
			/**
			* Left arrow key event.
			* @name LEFT_ARROW
			* @constant
			* @memberOf ch.Events.KEY
			*/
			LEFT_ARROW: "left_arrow",
			/**
			* Up arrow key event.
			* @name UP_ARROW
			* @constant
			* @memberOf ch.Events.KEY
			*/
			UP_ARROW: "up_arrow",
			/**
			* Rigth arrow key event.
			* @name RIGHT_ARROW
			* @constant
			* @memberOf ch.Events.KEY
			*/
			RIGHT_ARROW: "right_arrow",
			/**
			* Down arrow key event.
			* @name DOWN_ARROW
			* @constant
			* @memberOf ch.Events.KEY
			*/
			DOWN_ARROW: "down_arrow"
		}
	}
};

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
*	o {
*		component: "chat",
*		callback: function(){},
*		[script]: "http://..",
*		[style]: "http://..",
*		[callback]: function(){}	
*	}
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
*	o {
*		component: "chat",
*		[script]: "http://..",
*		[style]: "http://..",
*		[callback]: function(){}
*	}
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
};/**
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
*	element: $("#element1"),
*	context: $("#context1"),
*	points: "lt rt"		//  Element left-top point = Context left-bottom point
* });
* @example  
* // Second example
* ch.positioner({
*	element: $("#element2"),
*	context: $("#context2"),
*	points: "lt lb"		//  Element center-middle point = Context center-middle point
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
	*	element: $element
	*	[context]: $element | viewport
	*	[points]: "cm cm"
	*	[offset]: "x y"
	*	[hold]: false
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
			(points === "lt lb" || points === "rt rb") &&
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
			if (styles.top + parentRelative.top < viewport.top) {
				styles = stylesCache;
			} else {
				styles.top -= (2* offset_top);
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
			if (styles.left < viewport.left) {
				styles = stylesCache;
			} else {
				styles.left -= (2* offset_left);

				classes[0] = "ch-right";

				if(classes[1] == "ch-top") { styles.top -= (2* offset_top); };

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
				
		if (ch.utils.hasOwn(context, "element") && context.element !== ch.utils.window[0]) {
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

		if (parent.css("position") === "relative") {
			
			var borderLeft = (parent.outerWidth() - parent.width() - ( parseInt(parent.css("padding-left"))* 2 )) / 2;
			
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
	ch.utils.window.bind("resize scroll", function () {
		scrolled = true;
	});

	setInterval(function() {
		if( !scrolled ) return;
		scrolled = false;
		// Hidden behavior
		if (element.css("display") === "none" ) return; 	
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
	* @name ch.Object#that
	* @type {Object}
	*/ 
	var that = this;	
	var conf = that.conf;
		
/**
*	Public Members
*/


	/**
	* Component static content.
	* @public
	* @name ch.Object#staticContent
	* @type {String}
	*/ 
	that.staticContent;
	
	/**
	* DOM Parent of content, this is useful to attach DOM Content when float is hidding.
	* @public
	* @name ch.Object#DOMParent
	* @type {HTMLElement}
	*/ 
	that.DOMParent;

	/**
	* Flag to know if the DOM Content is visible or not.
	* @public
	* @name ch.Object#DOMContentIsVisible
	* @type {Boolean}
	*/ 
	that.DOMContentIsVisible;

	/**
	* Prevent propagation and default actions.
	* @name ch.Object#prevent
	* @function
	* @protected
	* @param {EventObject} event Recieves a event object
	*/
	that.prevent = function(event) {
		
		if (event && typeof event == "object") {
			event.preventDefault();
			event.stopPropagation();
		};
		
		return that;
	};

	/**
	* Set and get the content of a component. With no arguments will behave as a getter function. Send any kind of content and will be a setter function. Use a valid URL for AJAX content, use a CSS selector for a DOM content or just send a static content like HTML or Text.
	* @name ch.Object#content
	* @protected
	* @function
	* @param {String} [content] Could be a simple text, html or a url to get the content with ajax.
	* @returns {String} content
	* @requires ch.Cache
	* @example
	* // Simple static content
	* $(element).layer().content("Some static content");
	* @example
	* // Get DOM content
	* $(element).layer().content("#hiddenContent");
	* @example
	* // Get AJAX content
	* $(element).layer().content("http://chico.com/content/layer.html");
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
		
		// First time we need to get the content.
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

	/* Evaluate static content*/  

		// Set 'that.staticContent' and overwrite 'that.source'
		// just in case you want to update DOM or AJAX Content.
		that.staticContent = that.source = content;

		/* Evaluate DOM content*/

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

	/* Evaluate AJAX content*/  

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

	/* Set previous cache configuration*/

		conf.cache = cache;

	/* Finally return 'staticContent'*/
		
		// Update Content
		// old callback system
		that.contentCallback.call(that,that.staticContent);
		// new callbacks
		that.trigger("contentLoad");
		
		return that.staticContent;
	};

	/**
	* This method will be deprecated soon. Triggers a specific callback inside component's context.
	* @name ch.Object#callbacks
	* @function
	* @protected
	*/
	// TODO: Add examples!!!
	that.callbacks = function(when) {
		if( ch.utils.hasOwn(conf, when) ) {
			var context = ( that.controller ) ? that.controller["public"] : that["public"];
			return conf[when].call( context );
		};
	};

	/**
	* Change component's position configuration. If a "refresh" {String} is recived, will refresh component's positioning with the same configuration. You can send an {Object} with a new configuration.
	* @name ch.Object#position
	* @function
	* @protected
	* @param {String} ["refresh"] Refresh
	* @returns {Object} Configuration object if no arguments are sended.
	* @see ch.Positioner
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
	

	
	/**
	* Triggers a specific event within the component public context.
	* @name ch.Object#trigger
	* @function
	* @protected
	* @param {String} event The event name you want to trigger.
	* @since version 0.7.1
	*/	
	that.trigger = function(event) {
		$(that["public"]).trigger("ch-"+event);
	}

	/**
	* Component's public scope. In this scope you will find all public members.
	*/

	that["public"] = {};
	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Object#uid
	* @type {Number}
	* @ignore
	*/
		that["public"].uid = that.uid;
	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Object#element
	* @type {HTMLElement}
	* @ignore
	*/
	that["public"].element = that.element;
	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Object#type
	* @type {String}
	* @ignore
	*/
	that["public"].type = that.type;

	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @name ch.Object#position
	* @example
	* // Change component's position.
	* me.position({ 
	*	  offset: "0 10",
	*	  points: "lt lb"
	* });
	* @see ch.Object#position
	*/
	that["public"].position = that.position;

	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @name ch.Object#content
	* @function
	* @param {String} content Static content, DOM selector or URL. If argument is empty then will return the content.
	* @example
	* // Get the defined content
	* me.content();
	* @example
	* // Set static content
	* me.content("Some static content");
	* @example
	* // Set DOM content
	* me.content("#hiddenContent");
	* @example
	* // Set AJAX content
	* me.content("http://chico.com/some/content.html");
	*/
	that["public"].content = function(content){
		if (content) { // sets
			that.content(content);
			return that["public"];
		} else { // gets
			return that.content();
		}
	}

	/**
	* Add a callback function from specific event.
	* @public
	* @function
	* @name ch.Object#on
	* @param {String} event Event name.
	* @param {Function} handler Handler function.
	* @returns {itself}
	* @since version 0.7.1
	* @example
	* // Will add a event handler to the "ready" event
	* me.on("ready", startDoingStuff);
	*/
	that["public"].on = function(event, handler) {
		
		if (event && handler) {
			$(that["public"]).bind("ch-"+event, handler);
		}

		return that["public"];
	}
	/**
	* Removes a callback function from specific event.
	* @public
	* @function
	* @name ch.Object#off
	* @param {String} event Event name.
	* @param {Function} handler Handler function.
	* @returns {itself}
	* @since version 0.7.1
	* @example
	* // Will remove event handler to the "ready" event
	* me.off("ready", startDoingStuff);
	*/	
	that["public"].off = function(event, handler) {
	
		if (event && handler) {
			$(that["public"]).unbind("ch-"+event, handler);
		}
		
		return that["public"];		
	}
		
	return that;
};

/**
* Abstract class of all floats UI-Objects.
* @abstract
* @name ch.Floats
* @class Floats
* @augments ch.Object
* @requires ch.Positioner
* @returns {ch Object}
* @see ch.Tooltip
* @see ch.Layer
* @see ch.Modal
*/ 

ch.floats = function() {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @protected
	* @name ch.Floats#that
	* @type {Object}
	*/ 
	var that = this;
	var conf = that.conf;

/**
* Inheritance
*/

	that = ch.object.call(that);
	that.parent = ch.clon(that);

/**
* Private Members
*/

	/**
 	* Creates a 'cone', is a visual asset for floats.
 	* @private
 	* @name ch.Floats#createCone
 	* @function
 	*/ 
	var createCone = function() {
		$("<div class=\"ch-cone\">")
			.prependTo( that.$container );
	};

	/**
 	* Creates close button.
 	* @private
 	* @name ch.Floats#createClose
 	* @function
 	*/ 
	var createClose = function() {
		// Close Button
		$("<div class=\"btn close\" style=\"z-index:"+(ch.utils.zIndex+=1)+"\">")
			.bind("click", function(event){ that.innerHide(event); })
			.prependTo( that.$container );
		
		// ESC key
		ch.utils.document.bind(ch.events.KEY.ESC, function(event){ that.innerHide(event); });
		
		return;
	};

/**
* Protected Members
*/ 
	/**
	* Flag that indicates if the float is active and rendered on the DOM tree.
	* @protected
	* @name ch.Floats#active
	* @type {Boolean}
	*/ 
	that.active = false;

	/**
	* Content configuration property.
	* @protected
	* @name ch.Floats#source
	* @type {String}
	*/
	that.source = conf.content || conf.msg || conf.ajax || that.$element.attr('href') || that.$element.parents('form').attr('action');

	/**
	* Inner function that resolves the component's layout and returns a static reference.
	* @protected
	* @name ch.Floats#$container
	* @type {jQuery Object}
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
	* Inner reference to content container. Here is where the content will be added.
	* @protected
	* @name ch.Floats#$content
	* @type {jQuery Object}
	* @see ch.Object#content
	*/ 
	that.$content = $("<div class=\"ch-"+ that.type +"-content\">").appendTo(that.$container);

	/**
	* This callback is triggered when async data is loaded into component's content, when ajax content comes back.
	* @protected
	* @name ch.Floats#contentCallback
	* @function
	* @returns {this}
	*/ 
	that.contentCallback = function(data) {
		that.staticContent = data;
		that.$content.html(that.staticContent);
		if ( ch.utils.hasOwn(conf, "position") ) {
		   ch.positioner(conf.position);
		}
	}

	/**
	* Inner show method. Attach the component layout to the DOM tree.
	* @protected
	* @name ch.Floats#innerShow
	* @function
	* @returns {this}
	*/ 
	that.innerShow = function(event) {

		if (event) {
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
		* Triggers when component is visible.
		* @name ch.Floats#show
		* @event
		* @public
		*/
		// Show component with effects
		if( conf.fx ) {
			that.$container.fadeIn("fast", function(){ 
				// new callbacks
				that.trigger("show");
				// Old callback system
				that.callbacks('onShow');
			});
		} else { 
		// Show component without effects
			that.$container.removeClass("ch-hide");
			// new callbacks
			that.trigger("show");
			// Old callback system
			that.callbacks('onShow');
		};
	
		// TODO: Positioner should recalculate the element's size (width and height) 
		conf.position.element = that.$container;

		that.position("refresh");

		that.active = true;

		return that;
	};

	/**
	* Inner hide method. Hides the component and detach it from DOM tree.
	* @protected
	* @name ch.Floats#innerHide
	* @function
	* @returns {this}
	*/ 
	that.innerHide = function(event) {

		if (event) {
			that.prevent(event);
		}
		
		if (!that.active) {
			return;
		}

		var afterHide = function(){ 
			 
			that.active = false;
			
		/**
		* Triggers when component is not longer visible.
		* @name ch.Floats#hide
		* @event
		* @public
		*/
			// new callbacks
			that.trigger("hide");
			// Old callback system
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
	* @protected
	* @function
	* @name ch.Floats#size
	* @param {String} prop Property that will be setted or getted, like "width" or "height".
	* @param {String} [data] Only for setter. It's the new value of defined property.
	* @returns {this}
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
* Public Members
*/
 
	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Floats#show
	* @function
	* @returns {this}
	*/
	that["public"].show = function(){
		that.innerShow();
		return that["public"];
	};
	
	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Floats#hide
	* @function
	* @returns {this}
	*/
	that["public"].hide = function(){
		that.innerHide();
		return that["public"];
	};
	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @name ch.Floats#width
	* @function
	* @returns {this}
	* @see ch.Floats#size
	* @example
	* // to set the width
	* me.width(700);
	* @example
	* // to get the width
	* me.width // 700
	*/
	that["public"].width = function(data) {
		return that.size("width", data) || that["public"];
	};
	/**
	* Sets or gets the height of the Float element.
	* @public
	* @name ch.Floats#height
	* @function
	* @returns {this}
	* @see ch.Floats#size
	* @example
	* // to set the heigth
	* me.height(300);
	* @example
	* // to get the heigth
	* me.height // 300
	*/
	that["public"].height = function(data) {
		return that.size("height", data) || that["public"];
	};
	
	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @name ch.Floats#isActive
	* @function
	* @returns {Boolean}
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
	* @name ch.Navs#that
	* @type {Object}
	*/ 
	var that = this;
	var conf = that.conf;
		conf.icon = (ch.utils.hasOwn(conf, "icon")) ? conf.icon : true;
		conf.open = conf.open || false;
		conf.fx = conf.fx || false;

/**
*	Inheritance
*/

	that = ch.object.call(that);
	that.parent = ch.clon(that);


/**
*	Private Members
*/
	/**
	* Adds icon in trigger's content.
	* @private
	* @name ch.Navs#createIcon
	* @function
	*/
	var createIcon = function(){
		$("<span>")
			.addClass("ico")
			.html("drop")
			.appendTo( that.$trigger );

		return;
	};
	
/**
*	Protected Members
*/
	/**
	* Status of component
	* @protected
	* @name ch.Navs#active
	* @returns {Boolean}
	*/
	that.active = false;

	/**
	* Shows component's content.
	* @protected
	* @name ch.Navs#show
	* @returns {itself}
	*/
	that.show = function(event){
		that.prevent(event);

		if ( that.active ) {
			return that.hide(event);
		};
		
		that.active = true;

		that.$trigger.addClass("ch-" + that.type + "-trigger-on");
		/**
		* onShow callback function
		* @name ch.Navs#onShow
		* @event
		*/
		// Animation
		if( conf.fx ) {
			that.$content.slideDown("fast", function(){
				//that.$content.removeClass("ch-hide");
			
				// new callbacks
				that.trigger("show");
				// old callback system
				that.callbacks("onShow");
			});
		} else {
			that.$content.removeClass("ch-hide");
			// new callbacks
			that.trigger("show");
			// old callback system
			that.callbacks("onShow");
		};
		
		return that;
	};
	/**
	* Hides component's content.
	* @protected
	* @name ch.Navs#hide
	* @returns {itself}
	*/
	that.hide = function(event){
		that.prevent(event);
		
		if (!that.active) return;
		
		that.active = false;
		
		that.$trigger.removeClass("ch-" + that.type + "-trigger-on");
		/**
		* onHide callback function
		* @name ch.Navs#onHide
		* @event
		*/
		// Animation
		if( conf.fx ) {
			that.$content.slideUp("fast", function(){
				//that.$content.addClass("ch-hide");
				that.callbacks("onHide");
			});
		} else {
			that.$content.addClass("ch-hide");
			// new callbacks
			that.trigger("hide");
			// old callback system
			that.callbacks("onHide");
		};
		
		return that;
	};

	/**
	* Create component's layout
	* @protected
	* @name ch.Navs#createLayout
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

	};
	
/**
*	Default event delegation
*/
	that.$element.addClass("ch-" + that.type);

	/**
	* Triggers when component is visible.
	* @name ch.Navs#show
	* @event
	* @public
	* @example
	* me.on("show",function(){
	*	this.content("Some new content");
	* });
	* @see ch.Floats#event:show
	*/

	/**
	* Triggers when component is not longer visible.
	* @name ch.Navs#hide
	* @event
	* @public
	* @example
	* me.on("hide",function(){
	*	otherComponent.show();
	* });
	* @see ch.Floats#event:hide
	*/

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
* @param {Object} o Object with configuration properties
* @returns {itself}
* @see ch.Required
* @see ch.String
* @see ch.Number
* @see ch.Custom
*/

ch.watcher = function(conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @protected
	* @name ch.Watcher#that
	* @type {Object}
	*/ 
	var that = this;
	conf = ch.clon(conf);
	that.conf = conf;	

/**
* Inheritance
*/

	that = ch.object.call(that);
	that.parent = ch.clon(that);
	
/**
* Private Members
*/	
	/**
	* Reference to a ch.form controller. If there isn't any, the Watcher instance will create one.
	* @private
	* @name ch.Watcher#controller
	* @type {Object}
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
	* @name ch.Watcher#checkInstance
	* @function
	* @returns {Object}
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
	* @name ch.Watcher#revalidate
	* @function
	*/
	var revalidate = function() {		
		that.validate();
		controller.checkStatus();  // Check everthing?
	}; 
	
/**
* Protected Members
*/

	/**
	* Flag that let you know if there's a validation going on.
	* @protected
	* @name ch.Watcher#active
	* @type {Boolean}
	*/ 
	that.active = false;
	
	/**
	* Flag that let you know if the watchers is enabled or not.
	* @protected
	* @name ch.Watcher#enabled
	* @type {Boolean}
	*/ 
	that.enabled = true;
	
	/**
	* This clousure is used as a reference to the positioning preferences.
	* @protected
	* @name ch.Watcher#reference
	* @type {jQuery Object}
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
	* This clousure process conditions and creates a map with all configured conditions, it's messages and validations.
	* @protected
	* @name ch.Watcher#conditions
	* @type {Boolean}
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
	* @name ch.Watcher#isRequired
	* @function
	* @return {Boolean}
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
	* @private
	* @name ch.Watcher#helper
	* @type {ch.Helper}
	* @see ch.Helper
	*/
	var helper = {};
		helper.uid = that.uid + "#0";
		helper.type = "helper";
		helper.element = that.element;
		helper.$element = that.$element;

	that.helper = ch.helper.call(helper, that);

	/**
	* Process all conditions looking for errors.
	* @protected
	* @name ch.Watcher#validate
	* @function
	* @return {itself}
	*/
	that.validate = function(event) {	

		// Pre-validation: Don't validate disabled or not required & empty elements
		if ( that.$element.attr('disabled') ) { return; }

		var isRequired = that.isRequired()

		// Avoid fields that aren't required when they are empty or de-activated
		if ( !isRequired && that.isEmpty() && that.active === false) { return; }
		
		if ( that.enabled && ( that.active === false || !that.isEmpty() || isRequired ) ) {

			/**
			* Triggers before start validation process.
			* @name ch.Watcher#beforeValidate
			* @event
			* @public
			* @example
			* me.on("beforeValidate",function(){
			*	submitButton.disable();
			* });
			*/
			// old callback system
			that.callbacks('beforeValidate');
			// new callback
			that.trigger("beforeValidate");

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
					* Triggers when an error occurs on the validation process.
					* @name ch.Watcher#error
					* @event
					* @public
					* @example
					* me.on("error",function(){
					*	errorModal.show();
					* });
					*/
					// old callback system
					that.callbacks('error');
					// new callback
					that.trigger("error");

					// Field error style
					that.$element.addClass("error");

					// Show helper with message
					var text = ( condition.message ) ? condition.message : 
						(ch.utils.hasOwn(controller, "messages")) ? controller.messages[condition.name] :
						undefined;

					that.helper["public"].content(text);
					that.helper["public"].show();

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
			that.helper["public"].hide();
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
		* Triggers when the validation process ends.
		* @name ch.Watcher#afterValidate
		* @event
		* @public
		* @example
		* me.on("afterValidate",function(){
		*	submitButton.disable();
		* });
		*/
		// old callback system
		that.callbacks('afterValidate');
		// new callback
		that.trigger("afterValidate");

		return that;
	};
	
	
	/**
	* Reset all active validations messages.
	* @protected
	* @name ch.Watcher#reset
	* @function
	* @return {itself}
	*/
	that.reset = function() {
		//that.publish.status = that.status = conf.status = true; // Public status OK
		that.active = false;
		that.$element.removeClass("error");
		that.helper["public"].hide(); // Hide helper
		that.$element.unbind("blur change", that.validate); // Remove blur and change event

		/**
		* Triggers when al validations are reseted.
		* @name ch.Watcher#reset
		* @event
		* @public
		* @example
		* me.on("reset",function(){
		*	submitButton.enable();
		* });
		*/
		// old callback system
		that.callbacks('onReset');
		// new callback
		that.trigger("reset");

		return that;
	};

	/**
	* Returns false if the field has no value selected.
	* @protected
	* @name ch.Watcher#isEmpty
	* @function
	* @return {Boolean}
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

	
/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Watcher#uid
	* @type {Number}
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Watcher#element
	* @type {HTMLElement}
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Watcher#type
	* @type {String}
	*/
	that["public"].type = "watcher"; // Everything is a "watcher" type, no matter what interface is used

	/**
	* Used by the helper's positioner to do his magic.
	* @public
	* @name ch.Watcher#reference
	* @type {jQuery Object}
	* @TODO: remove 'reference' from public scope
	*/
	that["public"].reference = that.reference;

	/**
	* This public Map saves all the validation configurations from this instance.
	* @public
	* @name ch.Watcher#conditions
	* @type {Object}
	*/
	that["public"].conditions = that.conditions;

	/**
	* Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
	* @public
	* @name ch.Watcher#type
	* @type {String}
	* @see ch.Floats
	*/
	that["public"].helper = that.helper["public"];

	/**
	* Active is a boolean property that let you know if there's a validation going on.
	* @public
	* @name ch.Watcher#active
	* @function
	* @returns {itself}
	*/	
	that["public"].active = function() {
		return that.active;
	};

	/**
	* Let you keep chaining methods.
	* @public
	* @name ch.Watcher#and
	* @function
	* @returns {itself}
	*/
	that["public"].and = function() {
		return that.$element;
	};

	/**
	* Reset al active validations.
	* @public
	* @name ch.Watcher#reset
	* @function
	* @returns {itself}
	*/
	that["public"].reset = function() {
		that.reset();
		
		return that["public"];
	};

	/**
	* Run all configured validations.
	* @public
	* @function
	* @name ch.Watcher#validate
	* @returns {itself}
	*/
	that["public"].validate = function() {
		that.validate();
		
		return that["public"];
	};

	/**
	* Turn on Watcher engine.
	* @public
	* @name ch.Watcher#enable
	* @function
	* @returns {itself}
	*/
	that["public"].enable = function() {
		that.enabled = true;
				
		return that["public"];			
	};

	/**
	* Turn off Watcher engine and reset its validation.
	* @public
	* @name ch.Watcher#disable
	* @function
	* @returns {itself}
	*/
	that["public"].disable = function() {
		that.enabled = false;
		that.reset();

		return that["public"];
	};

	/**
	* Recalculate Helper's positioning.
	* @public
	* @name ch.Watcher#refresh
	* @function
	* @returns {itself}
	*/
	that["public"].refresh = function() {
		that.helper.position("refresh");

		return that["public"];
	};

/**
*	Default event delegation
*/

	/**
	* Triggers when the component is ready to use.
	* @name ch.Watcher#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.on("ready",function(){
	*	this.show();
	* });
	*/
	that.trigger("ready");
	
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
};
/**
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
*	conf.closeButton = false;
*	conf.msg = conf.msg || conf.content || "Please wait...";
*	conf.content = $("&lt;div&gt;").addClass("loading").after( $("&lt;p&gt;").html(conf.msg) );
*	return conf;
* });
*/

ch.extend = function (klass) {

	"use strict";

	return {
	as: function (name, process) {
		// Create the component in Chico-UI namespace
		ch[name] = function (conf) {
			// Some interfaces need a data value,
			// others simply need to be 'true'.
			conf[name] = conf.value || true;

			// Invoke pre-proccess if is defined,
			// or grab the raw conf argument,
			// or just create an empty object.
			conf = (process) ? process(conf) : conf || {};

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

ch.factory({ component: "onImagesLoads" });
/** 
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
	* Reference to a internal component instance, saves all the information and configuration properties.	* @private
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
*  Inheritance
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
		// new callback
		that.trigger("move");
		
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
		// new callback
		that.trigger("prev");
		
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
		// new callback
		that.trigger("next");
		
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
* Is a simple UI-Component for picking dates.
* @name Calendar
* @class Calendar
* @augments ch.Controllers
* @requires ch.Dropdown
* @memberOf ch
* @param {Object} conf Object with configuration properties
* @returns {itself}
*/
//TODO: Examples
ch.calendar = function(conf) {
	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Calendar#that
	* @type {Object}
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
*	Private Members
*/

	/**
	* Collection of months names
	* @private
	* @name ch.Calendar#MONTHS_NAMES
	* @type {Array}
	*/
	//TODO: default in english and snnif browser language
	//TODO: cambiar a sintaxis de constante
	var MONTHS_NAMES = conf.monthsNames ||["Enero","Febero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

	/**
	* Collection of weekdays short names
	* @private
	* @name ch.Calendar#SHORT_WEEK_NAMES
	* @type {Array}
	*/
	//TODO: default in english and snnif browser language
	//TODO: cambiar a sintaxis de constante
	var SHORT_WEEK_NAMES = conf.weekdays || ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

	/**
	* Date of today
	* @private
	* @name ch.Calendar#today
	* @type {Date}
	*/
	var today = new Date();

	/**
	* Date of selected day
	* @private
	* @name ch.Calendar#selected
	* @type {Date}
	*/
	var selected = conf.selected || conf.msg;

	/**
	* Creates tag thead with short name of week days
	* @private
	* @name ch.Calendar#weekdays
	* @function
	* @return {String}
	*/
	//TODO: change to constant syntax
	//TODO: subfijo de render y cambiar el nombre para que sea mas especifico, thead
	var weekdays = (function(){
		
		var weekdaysTitle = "<thead>";
		
		for (var i = 0; i < SHORT_WEEK_NAMES.length; i += 1) {
			weekdaysTitle += "<th>" + SHORT_WEEK_NAMES[i] + "</th>";
		};
		
		return weekdaysTitle += "</thead>";

	}());

	/**
	* HTML Template to months
	* @private
	* @name ch.Calendar#templateMonth
	* @type {jQuery Object}
	*/
	var templateMonth = $("<table class=\"datagrid\">")
		.addClass("ch-calendar-month")
		.append(weekdays)
		.bind("click", function(event){

			event = event || window.event;
			src = event.target || event.srcElement;

			if (src.nodeName !== "TD" || src.className.indexOf("day")) {
				that.prevent(event);
				return;
			};

			select( that.currentDate.getFullYear() + "/" + (that.currentDate.getMonth() + 1) + "/" + src.innerHTML );
		});


	/**
	* Creates a complete month and returns it in a table
	* @private
	* @name ch.Calendar#createMonth
	* @function
	* @return {String}
	*/
	var createMonth = function(date){

		var date = new Date(date);

		var tableMonth = templateMonth.clone(true);

		var currentMonth = {};
			currentMonth.fullDate = new Date(date.getFullYear(), date.getMonth(), 1);
			currentMonth.date = currentMonth.fullDate.getDate();
			currentMonth.day = currentMonth.fullDate.getDay();
			currentMonth.month = currentMonth.fullDate.getMonth();
			currentMonth.year = currentMonth.fullDate.getFullYear();


		var currentDate = {};
			currentDate.fullDate = new Date(date.getFullYear(), date.getMonth(), 1);
			currentDate.date = currentDate.fullDate.getDate();
			currentDate.day = currentDate.fullDate.getDay();
			currentDate.month = currentDate.fullDate.getMonth();
			currentDate.year = currentDate.fullDate.getFullYear();

		var firstWeekday = currentMonth.day;

		var weeks, classToday, classSelected;

		weeks = "<tbody>";

		do {
			
			weeks += "<tr class=\"week\">";

			for (var i = 0; i < 7; i += 1) {

				if (currentDate.date == 1) {
					for (var i = 0; i < firstWeekday; i += 1) {
						weeks += "<td class=\"disable\"></td>";
					};
				};
				
				classToday = (currentDate.date == today.getDate() && currentDate.month == today.getMonth() && currentDate.year == today.getFullYear()) ? " today" : "";

				classSelected = (selected && currentDate.date == selected.getDate() && currentDate.month == selected.getMonth() && currentDate.year == selected.getFullYear()) ? " selected" : "";
				
				weeks += "<td class=\"day" + classToday +  classSelected + "\">" + currentDate.date + "</td>";
				
				currentDate.fullDate.setDate(currentDate.date+1);
				currentDate.date = currentDate.fullDate.getDate();
				currentDate.day = currentDate.fullDate.getDay();
				currentDate.month = currentDate.fullDate.getMonth();
				currentDate.year = currentDate.fullDate.getFullYear();

				if ( currentDate.month != currentMonth.month ) { break; };

			};

			weeks += "</tr>";
			
		} while (currentDate.month == currentMonth.month);

		weeks += "</tbody>";

		tableMonth
			.prepend("<caption>"+MONTHS_NAMES[currentMonth.month] + " - " + currentMonth.year+"</caption>")
			.append(weeks);

		return tableMonth;
	};


	/**
	* Handles behavior of arrows
	* @private
	* @name ch.Calendar#arrows
	* @type {Object}
	*/
	var arrows = {
	
		$prev: $("<p class=\"ch-calendar-prev\">").bind("click", function(event){ that.prevent(event); prevMonth(); }),
	
		$next: $("<p class=\"ch-calendar-next\">").bind("click", function(event){ that.prevent(event); nextMonth(); })
	};

	/**
	* Creates an instance of Dropdown
	* @private
	* @name ch.Calendar#createDropdown
	* @function
	*/
	var createDropdown = function(){
		
		var dropdownTrigger = $("<strong>").html("Calendar");
		
		that.$trigger.append(dropdownTrigger).append(that.$container);

		that.children[0] = that.$trigger.dropdown({
			onShow: function(){
				// onShow callback
				// old callback system
				that.callbacks.call(that, "onShow");
				// new callback
				that.trigger("show");
			},
			onHide: function(){
				// onHide callback
				// old callback system
				that.callbacks.call(that, "onHide");
				// new callback
				that.trigger("hide");
			}
		});

		that.children[0].position({
			context: that.$element,
			points: "lt lb"
		});

	};

	/**
	* Create component's layout
	* @private
	* @name ch.Calendar#createLayout
	* @function
	*/
	var createLayout = function(){

		that.$trigger =	$("<div class=\"secondary ch-calendar\">");

		that.$container = $("<div class=\"ch-calendar-container ch-hide\">");

		that.$content = $("<div class=\"ch-calendar-content\">");

		that.$element.after(that.$trigger);

		createDropdown();

	};

	/**
	* Parse string to YY/MM/DD format date
	* @private
	* @name ch.Calendar#parseDate 	
	* @function
	*/
	var parseDate = function(value){
		var date = value.split("/");
		
		switch (conf.format) {
			case "DD/MM/YYYY":
				return date[2] + "/" + date[1] + "/" + date[0];
			break;
			
			case "MM/DD/YYYY":
				return date[2] + "/" + date[0] + "/" + date[1];
			break;
		};
	};


	/**
	* Map of formart's date
	* @private
	* @name ch.Calendar#FORMAT_DATE
	* @type {Object}
	*/
	var FORMAT_DATE = {
		"YYYY/MM/DD": function(date){ return  date.getFullYear() + "/" + (parseInt(date.getMonth(), 10) + 1 < 10 ? '0' : '') + (parseInt(date.getMonth(), 10) + 1) + "/" + (parseInt(date.getDate(), 10) < 10 ? '0' : '') + date.getDate(); },
		"DD/MM/YYYY": function(date){ return (parseInt(date.getDate(), 10) < 10 ? '0' : '') + date.getDate() + "/" + (parseInt(date.getMonth(), 10) + 1 < 10 ? '0' : '') + (parseInt(date.getMonth(), 10) + 1) + "/" + date.getFullYear()},
		"MM/DD/YYYY": function(date){ return (parseInt(date.getMonth(), 10) + 1 < 10 ? '0' : '') + "/" + (parseInt(date.getMonth(), 10) + 1) + "/" + date.getFullYear()}
	};


	/**
	* Selects an specific date to show
	* @private
	* @name ch.Calendar#select
	* @function
	* @return {itself}
	*/
	var select = function(date){

		selected = new Date(date);

		that.currentDate = selected;
		
		that.$content.html(createMonth(selected));
		
		that.element.value = FORMAT_DATE[conf.format](selected);

		/**
		* Callback function
		* @public
		* @name ch.Calendar#onSelect
		* @event
		*/
		// old callback system
		that.callbacks("onSelect");
		// new callback
		that.trigger("select");

		return that;
	};

	/**
	* Move to next month of calendar
	* @private
	* @name ch.Calendar#nextMonth
	* @function
	* @return {itself}
	*/
	//TODO: crear una interfaz que resuleva donde moverse
	var nextMonth = function(){
		that.currentDate = new Date(that.currentDate.getFullYear(),that.currentDate.getMonth()+1,1);
		that.$content.html(createMonth(that.currentDate));

		//Refresh position
		that.children[0].position("refresh");

		// Callback
		that.callbacks("onNextMonth");
		// new callback
		that.trigger("onNextMonth");
		
		return that;
	};

	/**
	* Move to prev month of calendar
	* @private
	* @name ch.Calendar#prevMonth
	* @function
	* @return {itself}
	*/
	var prevMonth = function(){
		that.currentDate = new Date(that.currentDate.getFullYear(),that.currentDate.getMonth()-1,1);
		that.$content.html(createMonth(that.currentDate));
		
		// Refresh position
		that.children[0].position("refresh");

		// Callback
		that.callbacks("onPrevMonth");
		// new callback
		that.trigger("onPrevMonth");
		
		return that;
	};

	/**
	* Move to next year of calendar
	* @private
	* @name ch.Calendar#nextYear
	* @function
	* @return {itself}
	*/
	var nextYear = function(){
		that.currentDate = new Date(that.currentDate.getFullYear()+1,that.currentDate.getMonth(),1);
		that.$content.html(createMonth(that.currentDate));

		return that;
	};

	/**
	* Move to prev year of calendar
	* @private
	* @name ch.Calendar#prevYear
	* @function
	* @return {itself}
	*/
	var prevYear = function(){
		that.currentDate = new Date(that.currentDate.getFullYear()-1,that.currentDate.getMonth(),1);
		that.$content.html(createMonth(that.currentDate));

		return that;
	};

	/**
	* Move to prev year of calendar
	* @private
	* @name ch.Calendar#reset
	* @function
	* @return {itself}
	*/
	var reset = function(){
		selected = conf.selected;
		that.currentDate = selected || today;
		that.element.value = "";

		that.$content.html(createMonth(that.currentDate));

		// Callback
		that.callbacks("onReset");
		// new callback
		that.trigger("onReset");
		return that;
	};


/**
*  Protected Members
*/

	/**
	* The current date that should show on calendar
	* @protected
	* @name ch.Calendar#currentDate
	* @type {Date}
	*/
	that.currentDate = selected || today;

/**
*  Public Members
*/
 
	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Calendar#uid
	* @type {Number}
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Calendar#element
	* @type {HTMLElement}
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Calendar#type
	* @type {String}
	*/


	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Calendar#show
	* @function
	* @returns {itself}
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/
	that["public"].show = function(){
		that.children[0].show();
		
		return that["public"];
	};

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Calendar#hide
	* @function
	* @returns {itself}
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/
	that["public"].hide = function(){
		that.children[0].hide();

		return that["public"];
	};

	/**
	* Select a specific date.
	* @public
	 * @name ch.Calendar#select
	* @function
	* @param {String} "YY/MM/DD".
	* @return {itself}
	* @TODO: Make select() method a get/set member
	*/
	that["public"].select = function(date){

		select(((date === "today")? today : parseDate(date)));

		return that["public"];
	};

	/**
	* Returns the selected date
	* @public
	* @name ch.Calendar#getSelected
	* @function
	* @return {itself}
	* @TODO: Unifiy with select() method.
	*/
	that["public"].getSelected = function(){
		return FORMAT_DATE[conf.format](selected);
	};

	/**
	* Returns date of today
	* @public
	* @name ch.Calendar#getToday
	* @function
	* @return {Date}
	*/
	that["public"].getToday = function(){
		return FORMAT_DATE[conf.format](today);
	};	

	/**
	* Move to the next month
	* @public
	* @name ch.Calendar#next
	* @function
	* @return {itself}
	*/
	that["public"].next = function(){
		nextMonth();

		return that["public"];
	};

	/**
	* Move to the prev month
	* @public
	* @name ch.Calendar#prev
	* @function
	* @return {itself}
	*/
	that["public"].prev = function(){
		prevMonth();

		return that["public"];
	};

	/**
	* Move to the next year
	* @public
	* @name ch.Calendar#nextYear
	* @function
	* @return {itself}
	*/
	that["public"].nextYear = function(){
		nextYear();

		return that["public"];
	};

	/**
	* Move to the prev year
	* @public
	* @name ch.Calendar#prevYear
	* @function
	* @return {itself}
	*/
	that["public"].prevYear = function(){
		prevYear();

		return that["public"];
	};

	/**
	* Reset the calendar to date of today
	* @public
	* @name ch.Calendar#reset
	* @function
	* @return {itself}
	*/
	that["public"].reset = function(){
		reset();

		return that["public"];
	};

/**
*	Default event delegation
*/

	that.element.type = "text";

	that.element.value = ((selected) ? FORMAT_DATE[conf.format](selected) : "");

	createLayout();

	that.$content
		.html(createMonth(that.currentDate))
		.appendTo(that.$container);

	that.$container.prepend(arrows.$prev).prepend(arrows.$next);

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
* @param {Object} conf Object with configuration properties
* @returns {itself}
* @see ch.Tooltip
* @see ch.Modal
* @example
* // Create a simple contextual layer
* var me = $(".some-element").layer("<p>Some content.</p>");
* @example
* // Now 'me' is a reference to the layer instance controller.
* // You can set a new content by using 'me' like this: 
* me.content("http://content.com/new/content");
*/

ch.layer = function(conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Layer#that
	* @type {Object}
	*/ 
	var that = this;
	
	conf = ch.clon(conf);
	conf.cone = true;
	conf.classes = "box";
	conf.closeButton =	(conf.event === 'click') ? true : false;
	conf.position = {};
	conf.position.context = that.$element;
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.floats.call(that);
	that.parent = ch.clon(that);
	
/**
*	Private Members
*/

	/**
	* Delay time to show component's contents.
	* @private
	* @name ch.Layer#showTime
	* @type {Number}
	* @default 400
	*/ 
	var showTime = conf.showTime || 400,
	/**
	* Delay time to hide component's contents.
	* @private
	* @name ch.Layer#hideTime
	* @type {Number}
	* @default 400
	*/ 
	hideTime = conf.hideTime || 400,

	/**
	* Show timer instance.
	* @private
	* @name ch.Layer#st
	* @type {Timer}
	*/ 
	st,
	
	/**
	* Hide timer instance.
	* @private
	* @name ch.Layer#ht
	* @type {Timer}
	*/ 
	ht,
	
	/**
	* Starts show timer.
	* @private
	* @name ch.Layer#showTimer
	* @function
	*/ 
	showTimer = function(){ st = setTimeout(that.innerShow, showTime) },
	
	/**
	* Starts hide timer.
	* @private
	* @name ch.Layer#hideTimer
	* @function
	*/ 
	hideTimer = function(){ ht = setTimeout(that.innerHide, hideTime) },
	
	/**
	* Clear all timers.
	* @private
	* @name ch.Layer#clearTimers
	* @function
	*/ 
	clearTimers = function(){ clearTimeout(st); clearTimeout(ht); },

	/**
	* Stop event bubble propagation to avoid hiding the layer by click on his own layout.
	* @private
	* @name ch.Layer#stopBubble
	* @function
	*/
	stopBubble = function(event){ event.stopPropagation(); };
/**
*	Protected Members
*/

	that.$trigger = that.$element;

	/**
	* Inner show method. Attach the component layout to the DOM tree.
	* @protected
	* @name ch.Layer#innerShow
	* @function
	* @returns {itself}
	*/ 
	that.innerShow = function(event) {
	
		// Reset all layers
		$.each(ch.instances.layer, function(i, e){ e.hide(); });
		//conf.position.context = that.$element;
		that.parent.innerShow(event);

		// Click
		if (conf.event == "click") {
			conf.close = true;
			// Document events
			$(document).one('click', that.innerHide);
			that.$container.bind('click', stopBubble);
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
	* Inner hide method. Hides the component and detach it from DOM tree.
	* @protected
	* @name ch.Layer#innerHide
	* @function
	* @returns {itself}
	*/ 
	that.innerHide = function(event) {
		that.$container.unbind('click', stopBubble);
		that.parent.innerHide(event);
	}

/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Layer#uid
	* @type {Number}
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Layer#element
	* @type {HTMLElement}
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Layer#type
	* @type {String}
	*/

	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @name ch.Layer#content
	* @function
	* @param {String} content Static content, DOM selector or URL. If argument is empty then will return the content.
	* @example
	* // Get the defined content
	* me.content();
	* @example
	* // Set static content
	* me.content("Some static content");
	* @example
	* // Set DOM content
	* me.content("#hiddenContent");
	* @example
	* // Set AJAX content
	* me.content("http://chico.com/some/content.html");
	* @see ch.Object#content
	*/

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @name ch.Layer#isActive
	* @function 
	* @returns {Boolean}
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Layer#show
	* @function
	* @returns {itself}
	* @see ch.Floats#show
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Layer#hide
	* @function
	* @returns {itself}
	* @see ch.Floats#hide
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/
	
	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @name ch.Layer#width
	* @function
	* @returns {itself}
	* @see ch.Floats#size
	* @example
	* // to set the width
	* me.width(700);
	* @example
	* // to get the width
	* me.width // 700
	*/
	
	/**
	* Sets or gets the height property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '100' or '100px'.
	* @public
	* @name ch.Layer#height
	* @function
	* @returns {itself}
	* @see ch.Floats#size
	* @example
	* // to set the heigth
	* me.height(300);
	* @example
	* // to get the heigth
	* me.height // 300
	*/
	
	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @name ch.Layer#position
	* @example
	* // Change component's position.
	* me.position({ 
	*	offset: "0 10",
	*	points: "lt lb"
	* });
	* @see ch.Object#position
	*/
	
/**
*	Default event delegation
*/

	// Click
	if(conf.event === 'click') {
		that.$trigger
			.css('cursor', 'pointer')
			.bind('click', that.innerShow);

	// Hover
	} else {
		that.$trigger
			.css('cursor', 'default')
			.bind('mouseenter', that.innerShow)
			.bind('mouseleave', hideTimer);
	};

	// Fix: change layout problem
	$("body").bind(ch.events.LAYOUT.CHANGE, function(){ that.position("refresh") });

	/**
	* Triggers when component is visible.
	* @name ch.Layer#show
	* @event
	* @public
	* @example
	* me.on("show",function(){
	*	this.content("Some new content");
	* });
	* @see ch.Floats#event:show
	*/

	/**
	* Triggers when component is not longer visible.
	* @name ch.Layer#hide
	* @event
	* @public
	* @example
	* me.on("hide",function(){
	*	otherComponent.show();
	* });
	* @see ch.Floats#event:hide
	*/
		
	/**
	* Triggers when the component is ready to use.
	* @name ch.Layer#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as Layer's instance controller:
	* me.on("ready",function(){
	*	this.show();
	* });
	*/
	that.trigger("ready");

	return that;

};
/**
* Is a centered floated window with a dark gray dimmer background. This component let you handle its size, positioning and content.
* @name Modal
* @class Modal
* @augments ch.Floats
* @memberOf ch
* @param {Object} conf Object with configuration properties
* @returns {itself}
* @see ch.Tooltip
* @see ch.Layer
* @example
* // Create a new modal window triggered by an anchor with a class name 'example'.
* var me = $("a.example").modal();
* @example
* // Now 'me' is a reference to the modal instance controller.
* // You can set a new content by using 'me' like this: 
* me.content("http://content.com/new/content");
*/

ch.modal = function(conf){

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Modal#that
	* @type {Object}
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
*	Private Members
*/

	/**
	* Reference to the dimmer object, the gray background element.
	* @private
	* @name ch.Modal#$dimmer
	* @type {jQuery Object}
	*/
	var $dimmer = $("<div class=\"ch-dimmer\">");
	
	// Set dimmer height for IE6
	if (ch.utils.html.hasClass("ie6")) { $dimmer.height( parseInt(document.documentElement.clientHeight, 10)* 3) };
	
	/**
	* Reference to dimmer control, turn on/off the dimmer object.
	* @private
	* @name ch.Modal#dimmer
	* @type {Object}
	*/
	var dimmer = {
		on: function() { //TODO: posicionar el dimmer con el positioner
			$dimmer
				.css("z-index", ch.utils.zIndex += 1)
				.appendTo("body")
				.fadeIn();
		
			if (that.type == "modal") {
				$dimmer.one("click", function(event){ that.innerHide(event) });
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
*	Protected Members
*/ 

	that.$trigger = that.$element;

	/**
	* Inner show method. Attach the component's layout to the DOM tree and load defined content.
	* @protected
	* @name ch.Modal#innerShow
	* @function
	* @returns {itself}
	*/ 
	that.innerShow = function(event) {	
		dimmer.on();
		that.parent.innerShow(event);		
		that.$trigger.blur();
		return that;
	};
	
	/**
	* Inner hide method. Hides the component's layout and detach it from DOM tree.
	* @protected
	* @name ch.Modal#innerHide
	* @function
	* @returns {itself}
	*/	
	that.innerHide = function(event) {
		dimmer.off();		
		that.parent.innerHide(event);
		return that;
	};
	
/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Modal#uid
	* @type {Number}
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Modal#element
	* @type {HTMLElement}
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Modal#type
	* @type {String}
	*/

	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @name ch.Modal#content
	* @function
	* @param {String} content Static content, DOM selector or URL. If argument is empty then will return the content.
	* @example
	* // Get the defined content
	* me.content();
	* @example
	* // Set static content
	* me.content("Some static content");
	* @example
	* // Set DOM content
	* me.content("#hiddenContent");
	* @example
	* // Set AJAX content
	* me.content("http://chico.com/some/content.html");
	* @see ch.Object#content
	*/

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @name ch.Modal#isActive
	* @function 
	* @returns {Boolean}
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Modal#show
	* @function
	* @returns {itself}
	* @see ch.Floats#show
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Modal#hide
	* @function
	* @returns {itself}
	* @see ch.Floats#hide
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/
	
	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @name ch.Modal#width
	* @function
	* @returns {itself}
	* @see ch.Floats#size
	* @example
	* // to set the width
	* me.width(700);
	* @example
	* // to get the width
	* me.width // 700
	*/
	
	/**
	* Sets or gets the height property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '100' or '100px'.
	* @public
	* @name ch.Modal#height
	* @function
	* @returns {itself}
	* @see ch.Floats#size
	* @example
	* // to set the heigth
	* me.height(300);
	* @example
	* // to get the heigth
	* me.height // 300
	*/

	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @name ch.Modal#position
	* @example
	* // Change component's position.
	* me.position({ 
	*	offset: "0 10",
	*	points: "lt lb"
	* });
	* @see ch.Object#position
	*/

/**
*	Default event delegation
*/
	that.$trigger
		.css("cursor", "pointer")
		.bind("click", function(event){ that.innerShow(event); });

	/**
	* Triggers when component is visible.
	* @name ch.Modal#show
	* @event
	* @public
	* @example
	* me.on("show",function(){
	*	this.content("Some new content");
	* });
	* @see ch.Floats#event:show
	*/

	/**
	* Triggers when component is not longer visible.
	* @name ch.Modal#hide
	* @event
	* @public
	* @example
	* me.on("hide",function(){
	*	otherComponent.show();
	* });
	* @see ch.Floats#event:hide
	*/

	/**
	* Triggers when the component is ready to use.
	* @name ch.Modal#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.on("ready",function(){
	*	this.show();
	* });
	*/
	that.trigger("ready");

	return that;
};


/**
* Transition
* @name Transition
* @class Transition
* @augments ch.Modal
* @memberOf ch
* @returns {itself}
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
*	Private Members
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
		// new callback
		that.trigger("select");
			
	return that;
	};

/**
*	Protected Members
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
*	Public Members
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
*	Default event delegation
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
*	Private Members
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
*	Protected Members
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
	* @memberOf ch.TabNavigator
	*/
	that.contentCallback = function(data) {
		that.staticContent = data;
	that.$content.html(that.staticContent);
	};
	

/**
*	Public Members
*/

/**
*	Default event delegation
*/

	that.configBehavior();

	return that;
}

/**
* Simple Tooltip UI-Object. It uses the 'alt' and 'title' attributes to grab its content.
* @name Tooltip
* @class Tooltip
* @augments ch.Floats
* @memberOf ch
* @param {Object} conf Object with configuration properties
* @returns {itself}
* @see ch.Modal
* @see ch.Layer
* @example
* // Create a simple tooltip
* var me = $(".some-element").tooltip();
* @example
* // Now 'me' is a reference to the tooltip instance controller.
* // You can set a new content by using 'me' like this: 
* me.width(300);
*/

ch.tooltip = function(conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Tooltip#that
	* @type {Object}
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
*/

	that = ch.floats.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/
	/**
	* The attribute that will provide the content. It can be "title" or "alt" attributes.
	* @protected
	* @name ch.Tooltip#attrReference
	* @type {string}
	*/
	var attrReference = (that.element.title) ? "title" : "alt";

	/**
	* The original attribute content.
	* @private
	* @name ch.Tooltip#attrContent
	* @type {string}
	*/
	var attrContent = that.element.title || that.element.alt;

/**
*	Protected Members
*/
	that.$trigger = that.$element;

	/**
	* Inner show method. Attach the component layout to the DOM tree.
	* @protected
	* @name ch.Tooltip#innerShow
	* @function
	* @returns {itself}
	*/
	that.innerShow = function(event) {
		that.element[attrReference] = ""; // IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
		that.parent.innerShow(event);

		return that;
	};
	
	/**
	* Inner hide method. Hides the component and detach it from DOM tree.
	* @protected
	* @name ch.Tooltip#innerHide
	* @function
	* @returns {itself}
	*/
	that.innerHide = function(event) {
		that.element[attrReference] = attrContent;
		that.parent.innerHide(event);
		return that;
	};

/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Tooltip#uid
	* @type {Number}
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Tooltip#element
	* @type {HTMLElement}
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Tooltip#type
	* @type {String}
	*/

	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @name ch.Tooltip#content
	* @function
	* @param {String} content Static content, DOM selector or URL. If argument is empty then will return the content.
	* @example
	* // Get the defined content
	* me.content();
	* @example
	* // Set static content
	* me.content("Some static content");
	* @example
	* // Set DOM content
	* me.content("#hiddenContent");
	* @example
	* // Set AJAX content
	* me.content("http://chico.com/some/content.html");
	* @see ch.Object#content
	*/

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @name ch.Tooltip#isActive
	* @function 
	* @returns {Boolean}
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Tooltip#show
	* @function
	* @returns {itself}
	* @see ch.Floats#show
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Tooltip#hide
	* @function
	* @returns {itself}
	* @see ch.Floats#hide
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/

	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @name ch.Tooltip#width
	* @function
	* @returns {itself}
	* @see ch.Floats#size
	* @example
	* // to set the width
	* me.width(700);
	* @example
	* // to get the width
	* me.width // 700
	*/

	/**
	* Sets or gets the height property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '100' or '100px'.
	* @public
	* @name ch.Tooltip#height
	* @function
	* @returns {itself}
	* @see ch.Floats#size
	* @example
	* // to set the heigth
	* me.height(300);
	* @example
	* // to get the heigth
	* me.height // 300
	*/

	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @name ch.Tooltip#position
	* @example
	* // Change component's position.
	* me.position({ 
	*	offset: "0 10",
	*	points: "lt lb"
	* });
	* @see ch.Object#position
	*/

/**
*	Default event delegation
*/
	
	that.$trigger
		.bind('mouseenter', that.innerShow)
		.bind('mouseleave', that.innerHide);

	// Fix: change layout problem
	$("body").bind(ch.events.LAYOUT.CHANGE, function(){ that.position("refresh") });


	/**
	* Triggers when component is visible.
	* @name ch.Tooltip#show
	* @event
	* @public
	* @example
	* me.on("show",function(){
	*	this.content("Some new content");
	* });
	* @see ch.Floats#event:show
	*/

	/**
	* Triggers when component is not longer visible.
	* @name ch.Tooltip#hide
	* @event
	* @public
	* @example
	* me.on("hide",function(){
	*	otherComponent.show();
	* });
	* @see ch.Floats#event:hide
	*/
	
	/**
	* Triggers when component is ready to use.
	* @name ch.Tooltip#ready
	* @event
	* @public	
	* @example
	* me.on("ready",function(){
	*	this.show();
	* });
	*/
	that.trigger("ready");

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
* @see ch.Required
* @see ch.Custom
* @see ch.Number
* @example
* // Create a string validation
* $("input").string("This field must be a string.");
*/

ch.extend("watcher").as("string", function (conf) {

	// $.string("message"); support
	if ( !conf.text && !conf.email && !conf.url && !conf.maxLength && !conf.minLength ) {
		conf.text = true;
	};
	
	/**
	* @public
	* @name ch.String#conditions
	* @type {Map}
	*/
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
* @memberOf ch
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
* @memberOf ch
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
* @memberOf ch
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
* @memberOf ch
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
* @param {Object} conf Object with configuration properties.
* @returns {itself}
* @see ch.Watcher
* @see ch.Required
* @see ch.Custom
* @see ch.String
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
		}];

	return conf;

});

/**
* Validate a number with a minimun value.
* @name Min
* @name Max
* @interface
* @augments ch.Number
* @memberOf ch
* @param {Number} value Minimun number value.
* @param {String} [message] Validation message.
* @returns {itself}
* @see ch.Watcher
* @example
* $("input").min(10, "Write a number bigger than 10");
*/

ch.extend("number").as("min");


/**
* Validate a number with a maximun value.
* @name Max
* @class Max
* @interface
* @augments ch.Number
* @memberOf ch
* @param {Number} value Minimun number value.
* @param {String} [message] Validation message.
* @returns {itself}
* @see ch.Watcher
* @example
* $("input").max(10, "Write a number smaller than 10");
*/

ch.extend("number").as("max");

/**
* Validate a number with a price format.
* @name Price
* @class Price
* @interface
* @augments ch.Watcher
* @memberOf ch
* @param {String} [message] Validation message.
* @returns {itself}
* @see ch.Watcher
* @example
* $("input").price("Write valid price.");
*/

ch.extend("watcher").as("price",function(conf){

	conf.price = true;	

	// Define the conditions of this interface
	conf.conditions = [{
			name: "price",
			patt: /^(\d+)[.,]?(\d?\d?)$/ 
		}];

	return conf;

});
/**
* Create custom validation interfaces for Watcher validation engine.
* @name Custom
* @class Custom
* @interface
* @augments ch.Watcher
* @memberOf ch
* @param {Object} conf Object with configuration properties
* @returns {itself}
* @see ch.Watcher
* @see ch.Required
* @see ch.Number
* @see ch.String
* @example
* // Validate a even number
* $("input").custom(function(value){
* 	return (value%2==0) ? true : false;
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
* Creates required validations.
* @name Required
* @class Required
* @interface
* @augments ch.Watcher
* @memberOf ch
* @param {Object} conf Object with configuration properties
* @returns {itself}
* @see ch.Watcher
* @see ch.Custom
* @see ch.Number
* @see ch.String
* @example
* // Simple validation
* $("input").required("This field is required");
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
* @param {Object} o Object with configuration properties
* @returns {itself}
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
 
	that.content("I'm not sure what just happened, this field might have some problems. Can you take a look?")
 
	/**
	* Inner show method. Attach the component layout to the DOM tree.
	* @protected
	* @name ch.Helper#innerShow
	* @function
	* @returns {itself}
	*/ 
	that.$trigger = that.$element;
		
	that.innerShow = function() {

		if ( !that.active ) {
			// Load content and show!
			that.parent.innerShow();
		};

		// Just Reload content!
		that.$content.html("<span class=\"ico error\">Error: </span><p>" + that.content() + "</p>");

		return that;
	};

/**
*  Public Members
*/
 
	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Helper#uid
	* @type {Number}
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Helper#element
	* @type {HTMLElement}
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Helper#type
	* @type {String}
	*/

	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @name ch.Helper#content
	* @function
	* @param {String} content Static content, DOM selector or URL. If argument is empty then will return the content.
	* @example
	* // Get the defined content
	* me.content();
	* @example
	* // Set static content
	* me.content("Some static content");
	* @example
	* // Set DOM content
	* me.content("#hiddenContent");
	* @example
	* // Set AJAX content
	* me.content("http://chico.com/some/content.html");
	* @see ch.Object#content
	*/

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @name ch.Helper#isActive
	* @function 
	* @returns {Boolean}
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Helper#show
	* @function
	* @returns {itself}
	* @see ch.Floats#show
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Helper#hide
	* @function
	* @returns {itself}
	* @see ch.Floats#hide
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/
	
	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @name ch.Helper#width
	* @function
	* @returns {itself}
	* @see ch.Floats#size
	* @example
	* // to set the width
	* me.width(700);
	* @example
	* // to get the width
	* me.width // 700
	*/
	
	/**
	* Sets or gets the height property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '100' or '100px'.
	* @public
	* @name ch.Helper#height
	* @function
	* @returns {itself}
	* @see ch.Floats#size
	* @example
	* // to set the heigth
	* me.height(300);
	* @example
	* // to get the heigth
	* me.height // 300
	*/
	
	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @name ch.Helper#position
	* @example
	* // Change component's position.
	* me.position({ 
	*	offset: "0 10",
	*	points: "lt lb"
	* });
	* @see ch.Object#position
	*/

/**
*  Default event delegation
*/

	$("body").bind(ch.events.LAYOUT.CHANGE, function(){ 
		that.position("refresh");
	});

	that.trigger("ready");

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
		// new callback
		that.trigger("beforeValidate");
		
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
		//status ? that.callbacks("onValidate") : that.callbacks("onError");  
		if (status) {
			that.callbacks("onValidate");
			// new callback
			that.trigger("onValidate");	
		} else {
			that.callbacks("onError");
			// new callback
			that.trigger("onError");
		}

		/**
		* Callback function
		* @name afterValidate
		* @type {Function}
		* @memberOf ch.Form
		*/
		that.callbacks("afterValidate");
		// new callback
		that.trigger("afterValidate");
		
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
		// new callback
		that.trigger("beforeSubmit");
		
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
			// new callback
			that.trigger("submit");
		}

		/**
		* Callback function
		* @name afterSubmit
		* @type {Function}
		* @memberOf ch.Form
		*/

		that.callbacks("afterSubmit");
		// new callback
		that.trigger("afterSubmit");
			
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
		// new callback
		that.trigger("clear");

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
		// new callback
		that.trigger("reset");
		
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
	that.$element.one("submit", submit);
	
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
*	Inheritance
*/

	that = ch.controllers.call(that);
	that.parent = ch.clon(that);
	
/**
*	Private Members
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
		// new callback
		that.trigger("move");

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
*	Protected Members
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
*	Public Members
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

/**
*	Default event delegation
*/

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
*	Private Members
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
					// new callback
					that.trigger("select");
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
*	Protected Members
*/

/**
*	Public Members
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
*	Default event delegation
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
* @param {Object} conf Object with configuration properties
* @returns {self}
*/

ch.zoom = function(conf) {
	/**
	* Reference to an internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Zoom#that
	* @type {Object}
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
*	Private Members
*/

	/**
	* Reference to main image declared on HTML code snippet.
	* @private
	* @name ch.Zoom#original
	* @type {Object}
	*/
	var original = {};
		original.img = that.$element.children();
		original["width"] = original.img.prop("width");
		original["height"] = original.img.prop("height");

	/**
	* Reference to the augmented version of image, that will be displayed in context.
	* @private
	* @name ch.Zoom#zoomed
	* @typeÂ {Object}
	*/
	var zoomed = {};
		// Define the content source 
		zoomed.img = that.source = $("<img>").prop("src", that.element.href);
	
	/**
	* Seeker is the visual element that follows mouse movement for referencing to zoomable area into original image.
	* @private
	* @name ch.Zoom#seeker
	* @typeÂ {Object}
	*/
	var seeker = {};
		seeker.shape = $("<div>").addClass("ch-seeker ch-hide")
	
	/**
	* Gets the mouse position relative to original image position, and accordingly moves the zoomed image.
	* @private
	* @function
	* @name ch.Zoom#move
	* @param {Event Object} event
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
			zoomed.img.css("left", -( (parseInt(zoomed["width"]* x) / original["width"]) - (conf.width / 2) ));
			seeker.shape.css("left", limit.left);
		};
		
		// Vertical: keep seeker into limits
		if(limit.top >= 0 && limit.bottom < original["height"] - 1) {
			zoomed.img.css("top", -( (parseInt(zoomed["height"]* y) / original["height"]) - (conf.height / 2) ));
			seeker.shape.css("top", limit.top);
		};
		
	};

	/**
	* Calculates zoomed image sizes and adds event listeners to trigger of float element
	* @private
	* @function
	* @name ch.Zoom#init
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
	};

/**
*	Protected Members
*/

	/**
	* Anchor that wraps the main image and links to zoomed image file.
	* @public
	* @name ch.Zoom#$trigger
	* @typeÂ {Object}
	*/
	that.$trigger = that.$element;

	that.innerShow = function(){
		// Recalc offset of original image
		original.offset = original.img.offset();

		// Move
		that.$element.bind("mousemove", function(event){ 
			move(event); 
		});

		// Seeker
		seeker.shape.removeClass("ch-hide");
		
		// Floats show
		that.parent.innerShow();

		return that;
	};

	that.innerHide = function(){
		// Move
		that.$element.unbind("mousemove");
		
		// Seeker
		seeker.shape.addClass("ch-hide");
		
		// Floats hide
		that.parent.innerHide();
		
		return that;
	};

	/**
	* Triggered on anchor click, it prevents redirection to zoomed image file.
	* @protected
	* @function
	* @name ch.Zoom#enlarge
	* @param {Mouse Event Object} event
	* @returns {itself}
	*/
	that.enlarge = function(event){
		that.prevent(event);
		// Do what you want...
		return that;
	};
	
	/**
	* Getter and setter for size attributes of float that contains the zoomed image.
	* @protected
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
			var size = (original[prop]* data) / zoomed[prop];

			// Seeker: sets shape size
			seeker.shape[prop](size);

			// Seeker: save shape half size for position it respect cursor
			seeker[prop] = size / 2;

		};

		return that.parent.size(prop, data);
	};

/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Zoom#uid
	* @type {Number}
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Zoom#element
	* @type {HTMLElement}
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Zoom#type
	* @type {String}
	*/

	/**
	* Gets component content. To get the defined content just use the method without arguments, like 'me.content()'.
	* @public
	* @name ch.Zoom#content
	* @function
	* @param {String} content Static content, DOM selector or URL. If argument is empty then will return the content.
	* @returns {HTMLIMGElement}
	* @example
	* // Get the defined content
	* me.content();
	* @see ch.Object#content
	*/

	that["public"].content = function(){
		// Only on Zoom, it's limmited to be a getter
		return that.content();
	};

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @name ch.Zoom#isActive
	* @function 
	* @returns {Boolean}
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Zoom#show
	* @function
	* @returns {itself}
	* @see ch.Floats#show
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Zoom#hide
	* @function
	* @returns {itself}
	* @see ch.Floats#hide
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/
	
	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @name ch.Zoom#width
	* @function
	* @returns {itself}
	* @see ch.Floats#size
	* @example
	* // Gets width of Zoom float element.
	* foo.width();
	* @example
	* // Sets width of Zoom float element and updates the seeker size to keep these relation.
	* foo.width(500);
	*/

	/**
	* Sets or gets the height property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '100' or '100px'.
	* @public
	* @name ch.Zoom#height
	* @function
	* @returns {itself}
	* @see ch.Floats#size
	* @example
	* // Gets height of Zoom float element.
	* foo.height();
	* @example
	* // Sets height of Zoom float element and update the seeker size to keep these relation.
	* foo.height(500);
	*/

	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @name ch.Zoom#position
	* @example
	* // Change default position.
	* $("a").zoom().position({
	*	offset: "0 10",
	*	points: "lt lb"
	* });
	* @example
	* // Refresh position.
	* $("a").zoom().position("refresh");
	* @example
	* // Get current position.
	* $("a").zoom().position();
	* @see ch.Object#position
	*/


/**
*	Default event delegation
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
