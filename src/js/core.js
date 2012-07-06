/**
* ch is the namespace for Chico-UI.
* @namespace ch
* @name ch
* @static
*/

var ch = window.ch = {

	/**
	* Current version
	* @name version
	* @type number
	* @memberOf ch
	*/
	version: "0.11.1",
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
	* @name Utils
	* @class Utils
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
		isTag: function(string){
			return (/<([\w:]+)/).test(string);
		},
		isSelector: function (selector) {
			if (typeof selector !== "string") return false;
			for (var regex in $.expr.match){
				if ($.expr.match[ regex ].test(selector) && !ch.utils.isTag(selector)) {
					return true;
				};
			};
			return false;
		},
		inDom: function (selector, context) {
			if (typeof selector !== "string") return false;
			// jQuery: If you wish to use any of the meta-characters ( such as !"#$%&'()*+,./:;<=>?@[\]^`{|}~ ) as a literal part of a name, you must escape the character with two backslashes: \\.
			var selector = selector.replace(/(\!|\"|\$|\%|\&|\'|\(|\)|\*|\+|\,|\/|\;|\<|\=|\>|\?|\@|\[|\\|\]|\^|\`|\{|\||\}|\~)/gi, function (str, $1) {
				return "\\\\" + $1;
			});
			return $(selector, context).length > 0;
		},
		/**
		* Checks if the parameter given is an Array.
		* @name isArray
		* @public
		* @param o The member to be checked
		* @function
		* @memberOf ch.Utils
		* @returns boolean
		*/
		isArray: (function () {

			if (Array.hasOwnProperty("isArray")) {
				return Array.isArray;
			}

			return function (o) {
				return Object.prototype.toString.apply(o) === "[object Array]";
			};
		}()),
		/**
		* Checks if the url given is right to load content.
		* @name isUrl
		* @public
		* @function
		* @memberOf ch.Utils
		* @returns boolean
		*/
		isUrl: function (url) {
		/* 
		# RegExp

		https://github.com/mercadolibre/chico/issues/579#issuecomment-5206670

		```javascript
		1	1.1						   1.2	 1.3  1.4		1.5		  1.6					2					   3 			   4					5
		/^(((https|http|ftp|file):\/\/)|www\.|\.\/|(\.\.\/)+|(\/{1,2})|(\d{1,3}\.){3}\d{1,3})(((\w+|-)(\.?)(\/?))+)(\:\d{1,5}){0,1}(((\w+|-)(\.?)(\/?))+)((\?)(\w+=(\w?)+(&?))+)?$/
		```

		## Description
		1. Checks for the start of the URL
			1. if starts with a protocols followed by :// Example: file://chico
			2. if start with www followed by . (dot) Example: www.chico
			3. if starts with ./ 
			4. if starts with ../ and can repeat one or more times
			5. if start with double slash // Example: //chico.server
			6. if start with an ip address
		2. Checks the domain
		  letters, dash followed by a dot or by a slash. All this group can repeat one or more times
		3. Ports
		 Zero or one time
		4. Idem to point two
		5. QueryString pairs

		## Allowed URLs
		1. http://www.mercadolibre.com
		2. http://mercadolibre.com/
		3. http://mercadolibre.com:8080?hola=
		4. http://mercadolibre.com/pepe
		5. http://localhost:2020
		6. http://192.168.1.1
		7. http://192.168.1.1:9090
		8. www.mercadolibre.com
		9. /mercadolibre
		10. /mercadolibre/mercado
		11. /tooltip?siteId=MLA&categId=1744&buyingMode=buy_it_now&listingTypeId=bronze
		12. ./pepe
		13. ../../mercado/
		14. www.mercadolibre.com?siteId=MLA&categId=1744&buyingMode=buy_it_now&listingTypeId=bronze
		15. www.mercado-libre.com
		16. http://ui.ml.com:8080/ajax.html

		## Forbiden URLs
		1. http://
		2. http://www&
		3. http://hola=
		4. /../../mercado/
		5. /mercado/../pepe
		6. mercadolibre.com
		7. mercado/mercado
		8. localhost:8080/mercadolibre
		9. pepe/../pepe.html
		10. /pepe/../pepe.html
		11. 192.168.1.1
		12. localhost:8080/pepe
		13. localhost:80-80
		14. www.mercadolibre.com?siteId=MLA&categId=1744&buyi ngMode=buy_it_now&listingTypeId=bronze
		15. `<asd src="www.mercadolibre.com">`
		16. Mercadolibre.................
		17. /laksjdlkasjd../
		18. /..pepe..
		19. /pepe..
		20. pepe:/
		21. /:pepe
		22. dadadas.pepe
		23. qdasdasda
		24. http://ui.ml.com:8080:8080/ajax.html
		*/
			return ((/^(((https|http|ftp|file):\/\/)|www\.|\.\/|(\.\.\/)+|(\/{1,2})|(\d{1,3}\.){3}\d{1,3})(((\w+|-)(\.?)(\/?))+)(\:\d{1,5}){0,1}(((\w+|-)(\.?)(\/?)(#?))+)((\?)(\w+=(\w?)+(&?))+)?(\w+#\w+)?$/).test(url));
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
		hasOwn: (function () {
			var hOP = Object.prototype.hasOwnProperty;

			return function (o, property) {
				return hOP.call(o, property);
			};
		}()),
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
		},
		// Grab the vendor prefix of the current browser
		// Based on: http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser/
		"VENDOR_PREFIX": (function () {
			
			var regex = /^(Webkit|Khtml|Moz|ms|O)(?=[A-Z])/,
			
				styleDeclaration = document.getElementsByTagName("script")[0].style;

			for (var prop in styleDeclaration) {
				if (regex.test(prop)) {
					return prop.match(regex)[0].toLowerCase();
				}
			}
			
			// Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
			// However (prop in style) returns the correct value, so we'll have to test for
			// the precence of a specific property
			if ("WebkitOpacity" in styleDeclaration) { return "webkit"; }
			if ("KhtmlOpacity" in styleDeclaration) { return "khtml"; }

			return "";
		}())
	}
};
/**
* Chico UI global events reference.
* @name Events
* @class Events
* @memberOf ch
* @static
*/	
ch.events = {
	/**
	* Layout event collection.
	* @name LAYOUT
	* @public
	* @static
	* @constant
	* @type object
	* @memberOf ch.Events
	*/
	LAYOUT: {
		/**
		* Every time Chico-UI needs to inform al visual components that layout has been changed, he triggers this event.
		* @name CHANGE
		* @memberOf ch.Events.LAYOUT
		* @public
		* @type string
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
	* @public
	* @static
	* @constant
	* @type object
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
	* @public
	* @static
	* @constant
	* @type object
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
		DOWN_ARROW: "down_arrow",
		/**
		* Backspace key event.
		* @name BACKSPACE
		* @constant
		* @memberOf ch.Events.KEY
		*/
		BACKSPACE: "backspace"
	}
};

/**
* Keyboard event controller utility to know wich keys are begin.
* @name Keyboard
* @class Keyboard
* @memberOf ch
* @param event
*/
ch.keyboard = (function () {

	/**
	* Map with references to key codes.
	* @private
	* @name ch.Keyboard#codeMap
	* @type object
	*/ 
	var codeMap = {
		"13": "ENTER",
		"27": "ESC",
		"37": "LEFT_ARROW",
		"38": "UP_ARROW",
		"39": "RIGHT_ARROW",
		"40": "DOWN_ARROW",
		 "8": "BACKSPACE"
	};

	return function (event) {

		// Check for event existency on the map
		if(!ch.utils.hasOwn(codeMap, event.keyCode)) { return; }

		// Trigger custom event with original event as second parameter
		ch.utils.document.trigger(ch.events.KEY[codeMap[event.keyCode]], event);
	};
}());

/** 
* Utility to clone objects
* @function
* @name clon
* @param o Object to clone
* @returns object
* @memberOf ch
*/
ch.clon = function(o) {

	var copy = {},
		x;

	for (x in o) {
		if (ch.utils.hasOwn(o, x)) {
			copy[x] = o[x];
		}
	};

	return copy;
};


/** 
* Class to create UI Components
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
// TODO: Always it should receive a conf object as parameter (see Multiple component)
// TODO: Try to deprecate .and() method on Validator
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
* @name Support
* @class Support
* @returns {object}
* @memberOf ch 
*/
ch.support = function () {

	/**
	* Private reference to the <body> element
	* @private
	* @name body
	* @type HTMLBodyElement
	* @memberOf ch.Support
	*/
	var body = document.body || document.documentElement,

	/**
	* Public reference to features support
	* @public
	* @name self
	* @type Object
	* @memberOf ch.Support
	*/
		self = {};

	/**
	* Verify that CSS Transitions are supported (or any of its browser-specific implementations).
	* @basedOn http://gist.github.com/373874
	* @public
	* @name transition
	* @type Boolean
	* @memberOf ch.Support#self
	*/
	self.transition = (function () {

		// Get reference to CSS Style Decalration
		var style = body.style,
		// Grab "undefined" into a privated scope
			u = undefined;

		// Analize availability of transition on all browsers
		return style.WebkitTransition !== u || style.MozTransition !== u || style.MSTransition !== u || style.OTransition !== u || style.transition !== u;
	}());

	/**
	* Boolean property that indicates if CSS "Fixed" positioning are supported by the device.
	* @basedOn http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED
	* @public
	* @name fixed
	* @type Boolean
	* @memberOf ch.Support#self
	*/
	self.fixed = (function () {

		// Flag to know if position is supported
		var isSupported = false,
		// Create an element to test
			el = document.createElement("div");

		// Set the position fixed
		el.style.position = "fixed";
		// Set a top
		el.style.top = "10px";

		// Add element to DOM
		body.appendChild(el);

		// Compare setted offset with "in DOM" offset of element
		if (el.offsetTop === 10) {
			isSupported = true;
		}

		// Delete element from DOM
		body.removeChild(el);

		// Results
		return isSupported;
	}());

	// Return public object
	return self;
};


/**
* Extend is a utility that resolve creating interfaces problem for all UI-Objects.
* @name Extend
* @class Extend
* @memberOf ch
* @param {string} name Interface's name.
* @param {function} klass Class to inherit from.
* @param {function} [process] Optional function to pre-process configuration, recieves a 'conf' param and must return the configration object.
* @returns class
* @exampleDescription Create an URL interface type based on String component.
* @example
* ch.extend("string").as("url");
* @exampleDescription Create an Accordion interface type based on Menu component.
* @example
* ch.extend("menu").as("accordion"); 
* @exampleDescription And the coolest one... Create an Transition interface type based on his Modal component, with some conf manipulations:
* @example
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
