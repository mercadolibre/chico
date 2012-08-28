	/**
	 * An object which is shared between all instances.
	 * @private
	 * @name exports
	 * @type {object}
	 */
	var exports = {},
		/**
		 * A map of all widget's instances created by Chico.
		 * @private
		 * @name instances
		 * @type {object}
		 */
		instances = {},

		/**
		 * Private reference to the window object.
		 * @private
		 * @name $window
		 * @type {object}
		 */
		$window = $(window),

		/**
		 * Private reference to the navigator object.
		 * @private
		 * @name navigator
		 * @type {object}
		 */
		navigator = window.navigator,

		/**
		 *
		 * @private
		 * @name userAgent
		 * @type {string}
		 */
		userAgent = navigator.userAgent,

		/**
		 * Private reference to the HTMLDocument.
		 * @private
		 * @name document
		 * @type {object}
		 */
		document = window.document,

		/**
		 * Private reference to the document object.
		 * @private
		 * @name $document
		 * @type {object}
		 */
		$document = $(document),

		/**
		 * Private reference to the HTMLBodyElement.
		 * @private
		 * @name body
		 * @type {object}
		 */
		body = document.body,

		/**
		 * Private reference to the HTMLBodyElement.
		 * @private
		 * @name $body
		 * @type {object}
		 */
		$body = $(body),

		/**
		 * Private reference to the HTMLElement.
		 * @private
		 * @name html
		 * @type {object}
		 */
		html = document.getElementsByTagName('html')[0],

		/**
		 * Private reference to the HTMLElement.
		 * @private
		 * @name $html
		 * @type {object}
		 */
		$html = $(html),

		/**
		 * Private reference to the Object Contructor.
		 * @private
		 * @function
		 * @name Object
		 * @type {function}
		 */
		Object = window.Object,

		/**
		 * Private reference to the Array Contructor.
		 * @private
		 * @function
		 * @name Array
		 * @type {function}
		 */
		Array = window.Array,

		/**
		 * Returns a boolean indicating whether the object has the specified property.
		 * @private
		 * @function
		 * @name hasOwn
		 * @param {object} [obj] The object to be checked.
		 * @param {string} [prop] The name of the property to test.
		 * @returns {boolean}
		 */
		hasOwn = (function () {
			var hOP = Object.prototype.hasOwnProperty;

			return function (obj, prop) {
				return hOP.call(obj, prop);
			};
		}()),

		/**
		 * Returns true if an object is an array, false if it is not.
		 * @private
		 * @function
		 * @name isArray
		 * @param {object} [obj] The object to be checked.
		 * @returns {boolean}
		 */
		isArray = (function () {
			if (typeof Array.isArray === 'function') {
				return Array.isArray;
			}

			return function (obj) {
				return (Object.prototype.toString.call(obj) === '[object Array]');
			};
		}()),


		/**
		 * Grabs the vendor prefix of the current browser.
		 * @private
		 * @constant
		 * @name VENDOR_PREFIX
		 * @returns {string}
		 * @see http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser/
		 */
		VENDOR_PREFIX = (function () {

			var regex = /^(Webkit|Khtml|Moz|ms|O)(?=[A-Z])/,
				styleDeclaration = document.getElementsByTagName('script')[0].style,
				prop;

			for (prop in styleDeclaration) {
				if (regex.test(prop)) {
					return prop.match(regex)[0].toLowerCase();
				}
			}

			// Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
			// However (prop in style) returns the correct value, so we'll have to test for
			// the precence of a specific property
			if ('WebkitOpacity' in styleDeclaration) { return 'webkit'; }
			if ('KhtmlOpacity' in styleDeclaration) { return 'khtml'; }

			return '';
		}()),

		/**
		 * zIndex values
		 * @private
		 * @name index
		 * @type {number}
		 */
		zIndex = 1000,

		/**
		 * Global instantiation widget id
		 * @private
		 * @name uid
		 * @type {number}
		 */
		uid = 0,

		/**
		 * Chico UI global events reference.
		 * @name Events
		 * @class Events
		 * @memberOf ch
		 * @static
		 */
		EVENT = {
			/**
			* Layout event collection.
			* @name LAYOUT
			* @public
			* @static
			* @constant
			* @type object
			* @memberOf ch.Events
			*/
			'LAYOUT': {
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
				'CHANGE': 'change'
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
			'VIEWPORT': {
				/**
				* Every time Chico-UI needs to inform all visual components that window has been scrolled or resized, he triggers this event.
				* @name CHANGE
				* @constant
				* @memberOf ch.Events.VIEWPORT
				* @see ch.Positioner
				*/
				'CHANGE': 'change'
			}
		};

	/**
	 * Returns a boolean indicating whether the selector is into DOM.
	 * @private
	 * @function
	 * @name inDom
	 * @param {string} [selector] The selector to be checked.
	 * @param {string} [context] Explicit context to the selector.
	 * @returns {boolean}
	 */
	function inDom(selector, context) {
		if (typeof selector !== 'string') { return false; }
		// jQuery: If you wish to use any of the meta-characters ( such as !"#$%&'()*+,./:;<=>?@[\]^`{|}~ ) as a literal part of a name, you must escape the character with two backslashes: \\.
		var selector = selector.replace(/(\!|\"|\$|\%|\&|\'|\(|\)|\*|\+|\,|\/|\;|\<|\=|\>|\?|\@|\[|\\|\]|\^|\`|\{|\||\}|\~)/gi, function (str, $1) {
			return "\\\\" + $1;
		});
		return $(selector, context).length > 0;
	}

	/**
	 * Checks if the url given is right to load content.
	 * @private
	 * @function
	 * @name isUrl
	 * @param {string} [url] The url to be checked.
	 * @returns {boolean}
	 */
	function isUrl(url) {
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
	}

	/**
	 * Adds CSS rules to disable text selection highlighting.
	 * @private
	 * @function
	 * @name avoidTextSelection
	 * @param {object} The HTMLElements to disable text selection highlighting.
	 */
	function avoidTextSelection() {
		var args = arguments;

		$.each(args, function(arg){
			if ($.browser.msie) {
				$(arg).attr('unselectable', 'on');
			} else if ($.browser.opera) {
				$(arg).bind('mousedown', function () { return false; });
			} else {
				$(arg).addClass('ch-user-no-select');
			};
		});
	}

	/**
	 * Gives the final used values of all the CSS properties of an element.
	 * @private
	 * @function
	 * @name getStyles
	 * @param {object} [el] The HTMLElement for which to get the computed style.
	 * @param {string} [prop] The name of the CSS property to test.
	 * @see Based on: http://www.quirksmode.org/dom/getstyles.html
	 * @returns {CSSStyleDeclaration}
	 */
	function getStyles(el, prop) {
		return window.getComputedStyle(el, '').getPropertyValue(prop);
	}

	/**
	 * Returns a boolean indicating whether the string is a HTML tag.
	 * @private
	 * @function
	 * @name isTag
	 * @param {string} [tag] The name of the tag to be checked.
	 * @returns {boolean}
	 */
	function isTag(tag) {
		return (/<([\w:]+)/).test(tag);
	}

	/**
	 * Returns a boolean indicating whether the string is a CSS selector.
	 * @private
	 * @function
	 * @name isSelector
	 * @param {string} [selector] The selector to be checked.
	 * @returns {boolean}
	 */
	function isSelector(selector) {
		if (typeof selector !== 'string') { return false; }
		var regex;
		for (regex in $.expr.match) {
			if ($.expr.match[regex].test(selector) && !isTag(selector)) {
				return true;
			};
		};
		return false;
	}

	/**
	 * Returns a shallow-copied clone of the object.
	 * @private
	 * @function
	 * @name clone
	 * @param {object} [obj] The object to copy.
	 * @returns {object}
	 */
	function clone(obj) {
		var copy = {},
			prop;

		for (prop in obj) {
			if (hasOwn(obj, prop)) {
				copy[prop] = obj[prop];
			}
		}
		return copy;
	}

	/**
	 * Copy all of properties from an object to a destination object, and returns the destination object.
	 * @private
	 * @function
	 * @name extend
	 * @param {object} [obj] The object that have new members.
	 * @param {object} [destination] The destination object.
	 * @returns {object}
	 * @example
	 * var Gizmo = {"name": "foo"};
	 * ch.extend({
	 *     "sayName": function () { console.log(this.name); },
	 *     "foobar": "Some string"
	 * }, Gizmo);
	 *
	 * // Returns Gizmo
	 * console.dir(gizmo);
	 *
	 * // Gizmo Object
	 * // foobar: "Some string"
	 * // name: "foo"
	 * // sayName: function () {}
	 * @example
	 * // Add new funcionality to CH
	 * ch.extend({
	 *     "foobar": "Some string"
	 * });
	 *
	 * // Returns ch
	 * console.dir(ch);
	 *
	 * // ch Object
	 * // foobar: "Some string"
	 */
	function extend(obj, destination) {
		var prop;
		for (prop in obj) {
			destination[prop] = obj[prop];
		}
		return destination;
	}

	/**
	 * Inherits the prototype methods from one constructor into another. The parent will be accessible through the obj.super_ property.
	 * @private
	 * @function
	 * @name inherits
	 * @param {object} [obj] The object that have new members.
	 * @param {object} [superConstructor] The construsctor Class.
	 * @returns {object}
	 * @exampleDescription
	 * @example
	 * inherit(obj, parent);
	 */
	function inherits(obj, superConstructor) {
		var child = obj.prototype || {};
		extend(superConstructor.prototype, child);
		child.super_ = superConstructor.prototype;
		//child.constructor = child;
	}

	/**
	 * Uses a spesific class or collecton of classes
	 * @private
	 * @function
	 * @name require
	 * @param {object} [obj] The object that have new members.
	 * @param {object} [deps] The dependecies objects.
	 * @returns {object}
	 * @exampleDescription
	 * @example
	 * require(obj, [foo, bar]);
	 */
	function require(obj, deps) {
		var context = obj.prototype;

		$.each(deps, function (i, dep) {
			dep.call(context);
		});

	}