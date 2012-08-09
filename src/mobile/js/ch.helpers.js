/**
* Private reference to the window obecjt
* @private
* @name win
* @type Window object
*/
var win = window,


	/**
	* Private reference to the html zepto object
	* @private
	* @name $win
	* @type Zepto Object
	*/
	$win = $(win),

	/**
	* Private reference to the navigator object
	* @private
	* @name browser
	* @type Navigator Object
	*/
	browser = win.navigator,

	/**
	* Private reference to the document object
	* @private
	* @name doc
	* @type Document Object
	*/
	doc = win.document,

	/**
	* Private reference to the body element
	* @private
	* @name body
	* @type HTMLBodyElement
	*/
	body = doc.body,

	/**
	* Private reference to the html element
	* @private
	* @name html
	* @type HTMLElement
	*/
	html = doc.getElementsByTagName("html")[0],

	/**
	* Private reference to the html zepto object
	* @private
	* @name $html
	* @type Zepto Object
	*/
	$html = $(html),

	/** 
	* Utility to clone objects
	* @private
	* @function
	* @name clon
	* @param {Object} [o] Object to clone
	* @returns object
	*/
	clone = function (o) {
		var copy = {},
			x;
		for (x in o) {
			if (hasOwn(o, x)) {
				copy[x] = o[x];
			}
		}
		return copy;
	},
	/**
	* Extend is a method that allows you to extend Chico or other objects with new members.
	* @private
	* @name extend
	* @function
	* @param {Object} [obj] The object that have new members.
	* @param {Object} [destination] The destination object. If this object is undefined, ch will be the destination object.
	* @returns Object
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
	extend = function(o, destination) {
		var x,
			d = destination || this;
		for (x in o) {
			d[x] = o[x];
		}
		return d;
	},

	/** 
	* Returns if an object is an array.
	* @private
	* @function
	* @name isArray
	* @param {Object} [o] The object to be checked.
	* @returns {boolean}
	*/
	isArray = (function () {

		if (Array.hasOwnProperty("isArray")) {
			return Array.isArray;
		}

		return function (o) {
			return Object.prototype.toString.apply(o) === "[object Array]";
		};
	}()),

	/** 
	* Returns a boolean indicating whether the object has the specified property.
	* @private
	* @function
	* @name hasOwn
	* @param {Object} [o] The object to be checked.
	* @param {String} [property] The name of the property to test.
	* @returns {boolean}
	*/
	hasOwn = (function () {
		var hOP = Object.prototype.hasOwnProperty;

		return function (o, property) {
			return hOP.call(o, property);
		};
	}()),

	/** 
	* Returns a boolean indicating whether the string is a HTML tag.
	* @private
	* @function
	* @name isTag
	* @param {String} [tag] The name of the tag to be checked.
	* @returns {boolean}
	*/
	isTag = function (tag) {
		return (/<([\w:]+)/).test(tag);
	},

	/** 
	* Returns a boolean indicating whether the string is a CSS selector.
	* @private
	* @function
	* @name isSelector
	* @param {String} [selector] The selector to be checked.
	* @returns {boolean}
	*/
	isSelector = function (selector) {
		if (typeof selector !== "string") { return false; }
		var regex;
		for (regex in $.expr.match) {
			if ($.expr.match[ regex ].test(selector) && !isTag(selector)) {
				return true;
			};
		};
		return false;
	},

	/** 
	* Returns a boolean indicating whether the selector is into DOM.
	* @private
	* @function
	* @name inDom
	* @param {String} [selector] The selector to be checked.
	* @param {String} [context] Explicit context to the selector.
	* @returns {boolean}
	*/
	inDom = function (selector, context) {
		if (typeof selector !== "string") { return false; }
		// jQuery: If you wish to use any of the meta-characters ( such as !"#$%&'()*+,./:;<=>?@[\]^`{|}~ ) as a literal part of a name, you must escape the character with two backslashes: \\.
		var selector = selector.replace(/(\!|\"|\$|\%|\&|\'|\(|\)|\*|\+|\,|\/|\;|\<|\=|\>|\?|\@|\[|\\|\]|\^|\`|\{|\||\}|\~)/gi, function (str, $1) {
			return "\\\\" + $1;
		});
		return $(selector, context).length > 0;
	},

	/** 
	* Returns a boolean indicating whether the string is an URL.
	* @private
	* @function
	* @name isUrl
	* @param {String} [url] The URL to be checked.
	* @returns {boolean}
	*/
	isUrl = function (url) {
		return ((/^((http(s)?|ftp|file):\/{2}(www)?|www.|((\/|\.{1,2})([\w]|\.{1,2})*\/)+|(\.\/|\/|\:\d))([\w\-]*)?(((\.|\/)[\w\-]+)+)?([\/?]\S*)?/).test(url));
	},

	/** 
	* Adds CSS rules to disable text selection highlighting.
	* @private
	* @function
	* @name avoidTextSelection
	* @param {HTMLElement} The HTMLElement to disable text selection highlighting.
	*/
	avoidTextSelection = function () {
		$.each(arguments, function(e){
			if ($.browser.msie) {
				$(e).attr('unselectable', 'on');
			} else if ($.browser.opera) {
				$(e).bind("mousedown", function(){ return false; });
			} else { 
				$(e).addClass("ch-user-no-select");
			};
		});
		return;
	},

	/** 
	* Gives the final used values of all the CSS properties of an element.
	* @private
	* @function
	* @name getStyles
	* @param {HTMLElement} [element] The element for which to get the computed style.
	* @param {String} [style] The name of the CSS property to test.
	* @see Based on: http://www.quirksmode.org/dom/getstyles.html
	* @returns {CSSStyleDeclaration}
	*/
	getStyles = function (element, style) {
		return getComputedStyle(element, "").getPropertyValue(style);
	},

	/** 
	* Fixes the broken iPad/iPhone form label click issue.
	* @private
	* @function
	* @name labels
	* @see Based on: http://www.quirksmode.org/dom/getstyles.html
	* @returns {CSSStyleDeclaration}
	*/
	fixLabels = function () {
		var labels = document.getElementsByTagName("label"),
			target_id, 
			el,
			i = 0;

		function labelClick() {
			el = document.getElementById(this.getAttribute('for'));
			if (['radio', 'checkbox'].indexOf(el.getAttribute('type')) != -1) {
				el.setAttribute('selected', !el.getAttribute('selected'));
			} else {
				el.focus();
			}
		}

		for (; labels[i]; i += 1) {
			if (labels[i].getAttribute("for")) {
				$(labels[i]).bind(EVENT.TAP, labelClick);
			}
		}
	},

	/** 
	* zIndex values
	* @private
	* @name index
	* @type {Number}
	*/
	zIndex = 1000,

	/** 
	* Global instantiation widget id
	* @private
	* @name uid
	* @type {Number}
	*/
	uid = 0,

	/**
	* Private reference to the index page
	* @privated
	* @name ch.Modal#$mainView
	* @type Zepto Object
	*/
	$mainView = (function () {
		var $view = $("div[data-page=index]");

		if ($view.length === 0) {
			alert("Chico Mobile Error\n$mainView: The document doesn't contain an index \"page\" view.");
			throw new Error("Chico Mobile Error\n$mainView: The document doesn't contain an index \"page\" view.");
		}

		return $view;
	}()),

	/**
	* Chico Mobile global events reference.
	* @name Event
	* @class Event
	* @static
	*/	
	EVENT = {
		"TAP": (("ontouchend" in win) ? "touchend" : "click"),
		"PATH_CHANGE": (("onpopstate" in win) ? "popstate" : "hashchange")
	};