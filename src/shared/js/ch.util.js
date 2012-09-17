(function () {
	/**
	 * Provides varies utilities and commons functions that are used across all widgets.
	 * @name ch.util
	 * @namespace
	 */
	var util = {};

	/**
	 * Returns a boolean indicating whether the object has the specified property.
	 * @name hasOwn
	 * @methodOf ch.util
	 * @param {Object} obj The object to be checked.
	 * @param {String} prop The name of the property to test.
	 * @returns {Boolean}
	 */
	util.hasOwn = (function () {
		var hOP = Object.prototype.hasOwnProperty;

		return function (obj, prop) {
			return hOP.call(obj, prop);
		};
	}());

	/**
	 * Returns true if an object is an array, false if it is not.
	 * @name isArray
	 * @methodOf ch.util
	 * @param {Object} obj The object to be checked.
	 * @returns {Boolean}
	 */
	util.isArray = (function () {
		if (typeof Array.isArray === 'function') {
			return Array.isArray;
		}

		return function (obj) {
			return (Object.prototype.toString.call(obj) === '[object Array]');
		};
	}());

	/**
	 * Returns a boolean indicating whether the selector is into DOM.
	 * @name inDom
	 * @methodOf ch.util
	 * @param {String} selector The selector to be checked.
	 * @param {String} [context=document] Explicit context to the selector.
	 * @returns {Boolean}
	 */
	util.inDom = function (selector, context) {
		if (typeof selector !== 'string') { return false; }
		// jQuery: If you wish to use any of the meta-characters ( such as !"#$%&'()*+,./:;<=>?@[\]^`{|}~ ) as a literal part of a name, you must escape the character with two backslashes: \\.
		selector = selector.replace(/(\!|\"|\$|\%|\&|\'|\(|\)|\*|\+|\,|\/|\;|\<|\=|\>|\?|\@|\[|\\|\]|\^|\`|\{|\||\}|\~)/gi, function (str, $1) {
			return "\\\\" + $1;
		});
		return $(selector, context).length > 0;
	};

	/**
	 * Checks if the url given is right to load content.
	 * @name isUrl
	 * @methodOf ch.util
	 * @param {String} url The url to be checked.
	 * @returns {Boolean}
	 */
	util.isUrl = function (url) {
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
	};

	/**
	 * Adds CSS rules to disable text selection highlighting.
	 * @name avoidTextSelection
	 * @methodOf ch.util
	 * @param {Object} Selector1 The HTMLElements to disable text selection highlighting.
	 * @param {Object} [Selector2] The HTMLElements to disable text selection highlighting.
	 * @param {Object} [SelectorN] The HTMLElements to disable text selection highlighting.
	 */
	util.avoidTextSelection = function () {
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
	};

	/**
	 * Gives the final used values of all the CSS properties of an element.
	 * @name getStyles
	 * @methodOf ch.util
	 * @param {object} el The HTMLElement for which to get the computed style.
	 * @param {string} prop The name of the CSS property to test.
	 * @returns {CSSStyleDeclaration}
	 * @see Based on: <a href="http://www.quirksmode.org/dom/getstyles.html" target="_blank">http://www.quirksmode.org/dom/getstyles.html</a>
	 */
	util.getStyles = function (el, prop) {
		return window.getComputedStyle(el, '').getPropertyValue(prop);
	};

	/**
	 * Returns a boolean indicating whether the string is a HTML tag.
	 * @name isTag
	 * @methodOf ch.util
	 * @param {String} tag The name of the tag to be checked.
	 * @returns {Boolean}
	 */
	util.isTag = function (tag) {
		return (/<([\w:]+)/).test(tag);
	};

	/**
	 * Returns a boolean indicating whether the string is a CSS selector.
	 * @name isSelector
	 * @methodOf ch.util
	 * @param {String} selector The selector to be checked.
	 * @returns {Boolean}
	 */
	util.isSelector = function (selector) {
		if (typeof selector !== 'string') { return false; }
		var regex;
		for (regex in $.expr.match) {
			if ($.expr.match[regex].test(selector) && !isTag(selector)) {
				return true;
			};
		};
		return false;
	};

	/**
	 * Returns a shallow-copied clone of the object.
	 * @name clone
	 * @methodOf ch.util
	 * @param {Object} obj The object to copy.
	 * @returns {Object}
	 */
	util.clone = function (obj) {
		var copy = {},
			prop;

		for (prop in obj) {
			if (util.hasOwn(obj, prop)) {
				copy[prop] = obj[prop];
			}
		}
		return copy;
	};

	/**
	 * Copy all of properties from an object to a destination object, and returns the destination object.
	 * @name extend
	 * @methodOf ch.util
	 * @param {Object} obj The object that have new members.
	 * @param {Object} destination The destination object.
	 * @returns {Object}
	 * @exampleDescription
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
	 * @exampleDescription
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
	util.extend = function (obj, destination) {
		var prop;
		for (prop in obj) {
			destination[prop] = obj[prop];
		}
		return destination;
	};

	/**
	 * Inherits the prototype methods from one constructor into another. The parent will be accessible through the obj.super property.
	 * @name inherits
	 * @methodOf ch.util
	 * @param {Object} obj The object that have new members.
	 * @param {Object} superConstructor The construsctor Class.
	 * @returns {Object}
	 * @exampleDescription
	 * @example
	 * inherit(obj, parent);
	 */
	util.inherits = function (obj, superConstructor) {
		var child = obj.prototype || {};
		util.extend(superConstructor.prototype, child);
		child.super = superConstructor.prototype;

		/*var fn = function () {};
		fn.prototype = superConstructor.prototype;
		obj.prototype = new fn();
		obj.prototype.constructor = obj;*/
	};

	/**
	 * Uses a spesific class or collecton of classes
	 * @name require
	 * @methodOf ch.util
	 * @param {Object} obj The object that have new members.
	 * @param {Object} deps The dependecies objects.
	 * @returns {Object}
	 * @exampleDescription
	 * @example
	 * require(obj, [foo, bar]);
	 */
	util.require = function (obj, deps) {
		var context = obj.prototype;

		$.each(deps, function (i, dep) {
			dep.call(context);
		});

	};

	exports.util = util;
}());