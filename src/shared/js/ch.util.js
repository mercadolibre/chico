(function () {

	/**
	 * Provides varies utilities and commons functions that are used across all widgets.
	 * @name ch.util
	 * @namespace
	 */
	var util = {};

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
			if(obj === undefined){
				throw new Error('"ch.util.isArray(obj)": It must receive a parameter.');
			}

			return (Object.prototype.toString.call(obj) === '[object Array]');
		};
	}());

	/**
	 * Checks if the url given is right to load content.
	 * @name isUrl
	 * @methodOf ch.util
	 * @param {String} url The url to be checked.
	 * @returns {Boolean}
	 */
	util.isUrl = function (url) {
		if (url === undefined || typeof url !== 'string') {
			return false;
		}

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
     * Determines if a specified element is an instance of $.
     * @name is$
     * @methodOf ch.util
     * @param {Object} $el The element to be checked as instance of $.
     * @returns {Boolean}
     */
    util.is$ = (function () {

        if ($.zepto === undefined) {
            return function ($el) {
                return $el instanceof $;
            };
        } else {
            return function ($el) {
                return $.zepto.isZ($el);
            };
        }
    }());

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

		if (arguments.length < 1) {
			throw new Error('"ch.util.avoidTextSelection(selector)": The selector parameter is required.');
		}

		$.each(args, function(i, $arg){
			if (!($arg instanceof $ || $.zepto.isZ($arg))) {
				throw new Error('"ch.util.avoidTextSelection(selector)": The parameter must be a query selector.');
			}

			if ($.browser.msie) {
				$arg.attr('unselectable', 'on');
			} else if ($.browser.opera) {
				$arg.bind('mousedown', function () { return false; });
			} else {
				$arg.addClass('ch-user-no-select');
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

		if (el === undefined || !(el.nodeType === 1)) {
			throw new Error('"ch.util.getStyles(el, prop)": The "el" parameter is required and must be a HTMLElement.');
		}

		if (prop === undefined || typeof prop !== 'string') {
			throw new Error('"ch.util.getStyles(el, prop)": The "prop" parameter is required and must be a string.');
		}

		if (window.getComputedStyle) {
			return window.getComputedStyle(el, "").getPropertyValue(prop);
		// IE
		} else {
			// Turn style name into camel notation
			prop = prop.replace(/\-(\w)/g, function (str, $1) { return $1.toUpperCase(); });
			return el.currentStyle[prop];
		}
	};

	/**
	 * Returns a shallow-copied clone of the object.
	 * @name clone
	 * @methodOf ch.util
	 * @param {Object} obj The object to copy.
	 * @returns {Object}
	 */
	util.clone = function (obj) {
		if (obj === undefined || typeof obj !== 'object') {
			throw new Error('"ch.util.clone(obj)": The "obj" parameter is required and must be a object.');
		}
		var copy = {},
			prop;

		for (prop in obj) {
			if (obj[prop] !== undefined) {
				copy[prop] = obj[prop];
			}
		}
		return copy;
	};

	/**
	 * Inherits the prototype methods from one constructor into another. The parent will be accessible through the obj.super property.
	 * @name inherits
	 * @methodOf ch.util
	 * @param {Function} obj The object that have new members.
	 * @param {Function} superConstructor The construsctor Class.
	 * @returns {Object}
	 * @exampleDescription
	 * @example
	 * inherit(obj, parent);
	 */
	util.inherits = function (obj, superConstructor) {

		if (obj === undefined || typeof obj !== 'function') {
			throw new Error('"ch.util.inherits(obj, superConstructor)": The "obj" parameter is required and must be a constructor function.');
		}
		if (superConstructor === undefined || typeof superConstructor !== 'function') {
			throw new Error('"ch.util.inherits(obj, superConstructor)": The "superConstructor" parameter is required and must be a constructor function.');
		}

		var child = obj.prototype || {};
		obj.prototype = $.extend(child, superConstructor.prototype);

		return superConstructor.prototype;
	};

	/**
	 * Uses a spesific class or collecton of classes
	 * @name use
	 * @methodOf ch.util
	 * @param {Object} obj The object that have new members.
	 * @param {Function} deps The dependecies objects.
	 * @returns {Object}
	 * @exampleDescription
	 * @example
	 * use(obj, [foo, bar]);
	 */
	util.use = function (obj, deps) {
		if (obj === undefined) {
			throw new Error('"ch.util.use(obj, deps)": The "obj" parameter is required and must be an object or constructor function.');
		}

		if (deps === undefined) {
			throw new Error('"ch.util.use(obj, deps)": The "deps" parameter is required and must be a function or collection.');
		}

		var context = obj.prototype
			deps = (util.isArray(deps)) ? deps : [deps];

		$.each(deps, function (i, dep) {
			dep.call(context);
		});

	};

	/**
	 * Prevent propagation and default actions.
	 * @name prevent
	 * @methodOf ch.util
	 * @param {Event} event The event ot be prevented.
	 * @returns {Object}
	 */
	util.prevent = function (event) {

		if (typeof event === 'object') {
			event.preventDefault();
			event.stopPropagation();
		}
	};

    /**
     * Get the current vertical and horizontal positions of the scroll bar.
     * @name getScroll
     * @returns {Object}
     */
    util.getScroll = function () {
    	return {
    		'left': window.pageXOffset || document.documentElement.scrollLeft || 0,
    		'top': window.pageYOffset || document.documentElement.scrollTop || 0
    	}
    };

    /**
     * Get the current outer dimensions of an element.
     * @name getOuterDimensions
     * @returns {Object}
     */
	util.getOuterDimensions = function (el) {
        var obj = el.getBoundingClientRect();

        return {
            'width': (obj.right - obj.left),
            'height': (obj.bottom - obj.top)
        }
    };

    /**
     * Get the current offset of an element.
     * @name getOffset
     * @returns {Object}
     */
	util.getOffset = function (el) {
		var obj = el.getBoundingClientRect(),
			scroll = util.getScroll();

		return {
			'left': obj.left + scroll.left,
			'top': obj.top + scroll.top
		}
	};

	/**
	 * Reference to the vendor prefix of the current browser.
	 * @name VENDOR_PREFIX
	 * @constant
	 * @methodOf ch.util
	 * @type {String}
	 * @see <a href="http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser/" target="_blank">http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser/</a>
	 */
	util.VENDOR_PREFIX = (function () {

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
	}());

	/**
	 * zIndex values.
	 * name zIndex
	 * @methodOf ch.util
	 * @type {Number}
	 */
	util.zIndex = 1000;

	ch.util = util;
}());