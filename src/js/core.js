/**
* Chico-UI namespace
* @namespace ch
* @name ch
*/

var ch = window.ch = {

	/**
	* Current version
	* @name version
	* @type number
	* @memberOf ch
	*/
	version: "0.10",
	/**
	* Here you will find a map of all component's instances created by Chico-UI.
	* @name instances
	* @type object
	* @memberOf ch
	*/
	instances: {},
	/**
	* Available device's features.
	* @name features
	* @type object
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
		// TODO: This should be on keyboard controller.
		ch.utils.document.bind("keydown", function(event){ ch.keyboard(event); });
	},
	/**
	* References and commons functions.
	* @name utils
	* @type object
	* @memberOf ch
	*/
	utils: {
		body: $("body"),
		html: $("html"),
		window: $(window),
		document: $(document),
		zIndex: 1000,
		index: 0, // global instantiation index
		isTag: function (tag) {
			var el = document.createElement(tag)
			return !(el instanceof HTMLUnknownElement);
		},
		isSelector: function (selector) {
			if (typeof selector !== "string") { return false; }
			var style = document.createElement("style");
			style.innerHTML = selector + "{}";
			document.body.appendChild(style);
			var ret = !!style.sheet.cssRules[0];
			document.body.removeChild(style);
			return ret;
		},
		inDom: function (selector, context) {
			if (typeof selector !== "string") return false;
			// jQuery: If you wish to use any of the meta-characters ( such as !"#$%&'()*+,./:;<=>?@[\]^`{|}~ ) as a literal part of a name, you must escape the character with two backslashes: \\.
			var selector = selector.replace(/(\!|\"|\$|\%|\&|\'|\(|\)|\*|\+|\,|\/|\;|\<|\=|\>|\?|\@|\[|\\|\]|\^|\`|\{|\||\}|\~)/gi, function (str, $1) {
				return "\\\\" + $1;
			});
			return $(selector, context).length > 0;
		},
		isArray: function (o) {
			return Object.prototype.toString.apply(o) === "[object Array]";
		},
		isUrl: function (url) {
			return ((/^((http(s)?|ftp|file):\/{2}(www)?|www.|((\/|\.{1,2})([\w]|\.{1,2})*\/)+|(\.\/|\/|\:\d))([\w\-]*)?(((\.|\/)[\w\-]+)+)?([\/?]\S*)?/).test(url));
		},
		avoidTextSelection: function () {
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
	* @type object
	* @standalone
	* @memberOf ch 
	* @see ch.Events.KEY
	* @see ch.Events.LAYOUT
	* @see ch.Events.VIEWPORT
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
			* Every time Chico-UI needs to inform all visual components that window has been scrolled or resized, he triggers this event.
			* @name CHANGE
			* @constant
			* @memberOf ch.Events.VIEWPORT
			* @see ch.Positioner
			*/
			CHANGE: "change"
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
* @param o Object to clone
* @returns object
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
* @param o Configuration Object
* @example
*	o {
*		component: "chat",
*		callback: function(){},
*		[script]: "http://..",
*		[style]: "http://..",
*		[callback]: function(){}	
*	}
* @returns collection
* @memberOf ch
*/

ch.factory = function(o) {

	var x = o.component || o;
	
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

	if ( ch[x] ) {
		// script already here, just create it
		create(x);

	} else {
		// get resurces and call create later
		ch.get({
			"method":"component",
			"component": x,
			"script": (o.script)? o.script : "src/js/"+x+".js",
			"styles": (o.style)? o.style : "src/css/"+x+".css",
			"callback":create
		});
	}
}

/**
* Load components or content
* @abstract
* @name Get
* @class Get
* @param {object} o Configuration object 
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
* @returns object
* @memberOf ch 
*/
ch.support = function() {
	
	/**
	* Private reference to the <body> element
	* @private
	* @name thisBody
	* @type HTMLBodyElement
	* @memberOf ch.Support
	*/
	var thisBody = document.body || document.documentElement;
	
	/**
	* Based on: http://gist.github.com/373874
	* Verify that CSS3 transition is supported (or any of its browser-specific implementations)
	*
	* @private
	* @returns boolean
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
	* @returns boolean
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
		* @type boolean
		* @memberOf ch.Support
		*/
		transition: transition,
		/**
		* Boolean property that indicates if Fixed positioning are supported by the device.
		* @public
		* @name fixed
		* @type boolean
		* @memberOf ch.Support
		*/
		fixed: fixed
	};

};


/**
* Extend is a utility that resolve creating interfaces problem for all UI-Objects.
* @abstract
* @name Extend
* @class Extend
* @memberOf ch
* @param {string} name Interface's name.
* @param {function} klass Class to inherit from.
* @param {function} [process] Optional function to pre-process configuration, recieves a 'conf' param and must return the configration object.
* @returns class
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
			ch.factory(name);
		} // end as method
	} // end return
};
