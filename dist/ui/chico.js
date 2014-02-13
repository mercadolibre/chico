/*!
 * Chico UI v1.1.1
 * http://chico-ui.com.ar/
 *
 * Copyright (c) 2014, MercadoLibre.com
 * Released under the MIT license.
 * http://chico-ui.com.ar/license
 */


(function (window, $) {
	'use strict';

var ch = {},

        /**
         * Reference to the window jQuery or Zepto Selector.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        $window = $(window),

        /**
         * Reference to the navigator object.
         * @private
         * @type {Object}
         */
        navigator = window.navigator,

        /**
         * Reference to the userAgent.
         * @private
         * @type {String}
         */
        userAgent = navigator.userAgent,

        /**
         * Reference to the HTMLDocument.
         * @private
         * @type {Object}
         */
        document = window.document,

        /**
         * Reference to the document jQuery or Zepto Selector.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        $document = $(document),

        /**
         * Reference to the HTMLBodyElement.
         * @private
         * @type {HTMLBodyElement}
         */
        body = document.body,

        /**
         * Reference to the body jQuery or Zepto Selector.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        $body = $(body),

        /**
         * Reference to the HTMLhtmlElement.
         * @private
         * @type {HTMLhtmlElement}
         */
        html = document.getElementsByTagName('html')[0],

        /**
         * Reference to the html jQuery or Zepto Selector.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        $html = $(html),

        /**
         * Reference to the Object Contructor.
         * @private
         * @constructor
         */
        Object = window.Object,

        /**
         * Reference to the Array Contructor.
         * @private
         * @constructor
         */
        Array = window.Array,

        /**
         * Reference to the vendor prefix of the current browser.
         * @constant
         * @private
         * @type {String}
         * @link http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser
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
        }());
ch.util = {

        /**
         * Returns true if an object is an array, false if it is not.
         * @param {Object} obj The object to be checked.
         * @returns {Boolean}
         * @example
         * ch.util.isArray([1, 2, 3]); // true
         */
        'isArray': (function () {
            if (typeof Array.isArray === 'function') {
                return Array.isArray;
            }

            return function (obj) {
                if (obj === undefined) {
                    throw new Error('"ch.util.isArray(obj)": It must receive a parameter.');
                }

                return (Object.prototype.toString.call(obj) === '[object Array]');
            };
        }()),

        /**
         * Checks if the url given is right to load content.
         * @param {String} url The url to be checked.
         * @returns {Boolean}
         * @example
         * ch.util.isUrl('www.chico-ui.com.ar'); // true
         */
        'isUrl': function (url) {
            if (url === undefined || typeof url !== 'string') {
                return false;
            }

            /*
            # RegExp

            https://github.com/mercadolibre/chico/issues/579#issuecomment-5206670

            ```javascript
            1   1.1                        1.2   1.3  1.4       1.5       1.6                   2                      3               4                    5
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

        /**
         * Determines if a specified element is an instance of $.
         * @param {Object} $el The element to be checked as instance of $.
         * @returns {Boolean}
         * @example
         * ch.util.is$($('element')); // true
         */
        'is$': (function () {
            if ($.zepto === undefined) {
                return function ($el) {
                    return $el instanceof $;
                };
            } else {
                return function ($el) {
                    return $.zepto.isZ($el);
                };
            }
        }()),

        /**
         * Adds CSS rules to disable text selection highlighting.
         * @param {...jQuerySelector} jQuery or Zepto Selector to disable text selection highlighting.
         * @example
         * ch.util.avoidTextSelection($(selector));
         */
        'avoidTextSelection': function () {
            var args = arguments,
                len = arguments.length,
                i = 0;

            if (arguments.length < 1) {
                throw new Error('"ch.util.avoidTextSelection(selector);": The selector parameter is required.');
            }

            for (i; i < len; i += 1) {

                if (!(args[i] instanceof $ || $.zepto.isZ(args[i]))) {
                    throw new Error('"ch.util.avoidTextSelection(selector);": The parameter must be a jQuery or Zepto selector.');
                }

                if ($html.hasClass('lt-ie10')) {
                    args[i].attr('unselectable', 'on');

                } else {
                    args[i].addClass('ch-user-no-select');
                }

            }
        },

        /**
         * Gives the final used values of all the CSS properties of an element.
         * @param {HTMLElement} el The HTMLElement for which to get the computed style.
         * @param {string} prop The name of the CSS property to test.
         * @returns {CSSStyleDeclaration}
         * @link http://www.quirksmode.org/dom/getstyles.html
         * @example
         * ch.util.getStyles(HTMLElement, 'color'); // true
         */
        'getStyles': function (el, prop) {

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
        },

        /**
         * Returns a shallow-copied clone of the object.
         * @param {Object} obj The object to copy.
         * @returns {Object}
         * @example
         * ch.util.clone(object);
         */
        'clone': function (obj) {
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
        },

        /**
         * Inherits the prototype methods from one constructor into another. The parent will be accessible through the obj.super property.
         * @param {Function} obj The object that have new members.
         * @param {Function} superConstructor The construsctor Class.
         * @returns {Object}
         * @exampleDescription
         * @example
         * ch.util.inherit(obj, parent);
         */
        'inherits': function (obj, superConstructor) {

            if (obj === undefined || typeof obj !== 'function') {
                throw new Error('"ch.util.inherits(obj, superConstructor)": The "obj" parameter is required and must be a constructor function.');
            }

            if (superConstructor === undefined || typeof superConstructor !== 'function') {
                throw new Error('"ch.util.inherits(obj, superConstructor)": The "superConstructor" parameter is required and must be a constructor function.');
            }

            var child = obj.prototype || {};
            obj.prototype = $.extend(child, superConstructor.prototype);

            return superConstructor.prototype;
        },

        /**
         * Prevent default actions of a given event.
         * @param {Event} event The event ot be prevented.
         * @returns {Object}
         * @example
         * ch.util.prevent(event);
         */
        prevent: function (event) {
            if (typeof event === 'object') {
                event.preventDefault();
            }
        },

        /**
         * Get the current vertical and horizontal positions of the scroll bar.
         * @returns {Object}
         * @example
         * ch.util.getScroll();
         */
        'getScroll': function () {
            return {
                'left': window.pageXOffset || document.documentElement.scrollLeft || 0,
                'top': window.pageYOffset || document.documentElement.scrollTop || 0
            };
        },

        /**
         * Get the current outer dimensions of an element.
         * @param {HTMLElement} el A given HTMLElement.
         * @returns {Object}
         * @example
         * ch.util.getOuterDimensions(el);
         */
        'getOuterDimensions': function (el) {
            var obj = el.getBoundingClientRect();

            return {
                'width': (obj.right - obj.left),
                'height': (obj.bottom - obj.top)
            };
        },

        /**
         * Get the current offset of an element.
         * @param {HTMLElement} el A given HTMLElement.
         * @returns {Object}
         * @example
         * ch.util.getOffset(el);
         */
        'getOffset': function (el) {

            var rect = el.getBoundingClientRect(),
                fixedParent = ch.util.getPositionedParent(el, 'fixed'),
                scroll = ch.util.getScroll(),
                offset = {
                    'left': rect.left,
                    'top': rect.top
                };

            if (ch.util.getStyles(el, 'position') !== 'fixed' && fixedParent === null) {
                offset.left += scroll.left;
                offset.top += scroll.top;
            }

            return offset;
        },

        /**
         * Get the current parentNode with the given position.
         * @param {HTMLElement} el A given HTMLElement.
         * @param {String} position A given position (static, relative, fixed or absolute).
         * @returns {HTMLElement}
         * @example
         * ch.util.getPositionedParent(el, 'fixed');
         */
        'getPositionedParent': function (el, position) {
            var currentParent = el.offsetParent,
                parent;

            while (parent === undefined) {

                if (currentParent === null) {
                    parent = null;
                    break;
                }

                if (ch.util.getStyles(currentParent, 'position') !== position) {
                    currentParent = currentParent.offsetParent;
                } else {
                    parent = currentParent;
                }

            };

            return parent;
        },

        /**
         * Reference to the vendor prefix of the current browser.
         * @constant
         * @memberof ch.util
         * @type {String}
         * @link http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser
         * @example
         * ch.util.VENDOR_PREFIX === 'webkit';
         */
        'VENDOR_PREFIX': (function () {

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
         * zIndex values.
         * @type {Number}
         * @example
         * ch.util.zIndex += 1;
         */
        'zIndex': 1000
    };
ch.support = {

        /**
         * Verify that CSS Transitions are supported (or any of its browser-specific implementations).
         * @type {Boolean}
         * @link http://gist.github.com/373874
         * @example
         * if (ch.support.transition) {
         *     // Some code here!
         * }
         */
        'transition': body.style.WebkitTransition !== undefined || body.style.MozTransition !== undefined || body.style.MSTransition !== undefined || body.style.OTransition !== undefined || body.style.transition !== undefined,

        /**
         * Checks if the $ library has fx methods.
         * @type {Boolean}
         * @example
         * if (ch.support.fx) {
         *     // Some code here!
         * }
         */
        'fx': !!$.fn.slideDown,

        /**
         * Checks if the User Agent support touch events.
         * @type {Boolean}
         * @example
         * if (ch.support.touch) {
         *     // Some code here!
         * }
         */
        'touch': 'createTouch' in document
    };
ch.onlayoutchange = 'layoutchange';

    /**
     * Equivalent to 'resize'.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onresize = 'resize';

    /**
     * Equivalent to 'scroll'.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onscroll = 'scroll';

    /**
     * Equivalent to 'touchstart' or 'mousedown', depending on device capabilities.
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerdown | Pointer Events W3C Working Draft
     */
    ch.onpointerdown = (ch.support.touch) ? 'touchstart' : 'mousedown';

    /**
     * Equivalent to 'touchend' or 'mouseup', depending on device capabilities.
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerup | Pointer Events W3C Working Draft
     */
    ch.onpointerup = (ch.support.touch) ? 'touchend' : 'mouseup';

    /**
     * Equivalent to 'touchmove' or 'mousemove', depending on device capabilities.
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointermove | Pointer Events W3C Working Draft
     */
    ch.onpointermove = (ch.support.touch) ? 'touchmove' : 'mousemove';

    /**
     * Equivalent to 'touchend' or 'click', depending on device capabilities.
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#list-of-pointer-events | Pointer Events W3C Working Draft
     */
    ch.onpointertap = (ch.support.touch) ? 'touchend' : 'click';

    /**
     * Equivalent to 'touchstart' or 'mouseenter', depending on device capabilities.
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerenter | Pointer Events W3C Working Draft
     */
    ch.onpointerenter = (ch.support.touch) ? 'touchstart' : 'mouseenter';

    /**
     * Equivalent to 'touchend' or 'mouseleave', depending on device capabilities.
     * @constant
     * @memberof ch
     * @type {String}
     * @link http://www.w3.org/TR/2013/WD-pointerevents-20130115/#dfn-pointerleave | Pointer Events W3C Working Draft
     */
    ch.onpointerleave = (ch.support.touch) ? 'touchend' : 'mouseleave';

    /**
     * Alphanumeric keys event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeyinput = ('oninput' in document.createElement('input')) ? 'input' : 'keydown';
ch.onkeytab = 'tab';

    /**
     * Enter key event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeyenter = 'enter';

    /**
     * Esc key event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeyesc = 'esc';

    /**
     * Left arrow key event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeyleftarrow = 'left_arrow';

    /**
     * Up arrow key event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeyuparrow = 'up_arrow';

    /**
     * Rigth arrow key event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeyrightarrow = 'right_arrow';

    /**
     * Down arrow key event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeydownarrow = 'down_arrow';

    /**
     * Backspace key event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeybackspace = 'backspace';
ch.factory = function (Klass, fn) {
        /**
         * Identification of the constructor, in lowercases.
         * @type {String}
         */
        var name = Klass.prototype.name,

            /**
             * Reference to the class name. When it's a preset, take its constructor name via the "preset" property.
             * @type {String}
             */
            constructorName = Klass.prototype._preset || name;

        /**
         * The class constructor exposed directly into the "ch" namespace.
         * @exampleDescription Creating a component instance by specifying a query selector and a configuration object.
         * @example
         * ch.Component($('#example'), {
         *     'key': 'value'
         * });
         */
        // Uses the function.name property (non-standard) on the newest browsers OR
        // uppercases the first letter from the identification name of the constructor
        ch[(name.charAt(0).toUpperCase() + name.substr(1))] = Klass;

        /**
         * The class constructor exposed into the "$" namespace.
         * @ignore
         * @exampleDescription Creating a component instance by specifying a query selector and a configuration object.
         * @example
         * $.component($('#example'), {
         *     'key': 'value'
         * });
         * @exampleDescription Creating a component instance by specifying only a query selector. The default options of each component will be used.
         * @example
         * $.component($('#example')});
         * @exampleDescription Creating a component instance by specifying only a cofiguration object. It only works on compatible components, when those doesn't depends on a element to be created.
         * @example
         * $.component({
         *     'key': 'value'
         * });
         * @exampleDescription Creating a component instance by no specifying parameters. It only works on compatible components, when those doesn't depends on a element to be created. The default options of each component will be used.
         * @example
         * $.component();
         */
        $[name] = function ($el, options) {
            // Create a new instance of the constructor and return it
            return new Klass($el, options);
        };

        /**
         * The class constructor exposed as a "$" plugin.
         */
        $.fn[name] = function (options) {

            // Collection with each instanced component
            var components = [];

            // Normalize options
            options = (fn !== undefined) ? fn.apply(this, arguments) : options;

            // Analize every match of the main query selector
            $.each(this, function () {
                // Get into the "$" scope
                var $el = $(this),
                    // Try to get the "data" reference to this component related to the element
                    data = $el.data(constructorName);

                // When this component isn't related to the element via data, create a new instance and save
                if (data === undefined) {

                    // Save the reference to this instance into the element data
                    data = new Klass($el, options);
                    $el.data(constructorName, data);

                } else {

                    if (data.emit !== undefined) {
                        data.emit('exist', options);
                    }
                }

                // Add the component reference to the final collection
                components.push(data);

            });

            // Return the instance/instances of components
            return (components.length > 1) ? components : components[0];
        };
    };
    // Remove the no-js classname from html tag
    $html.removeClass('no-js');

    // Exposse private $ (jQuery) into ch.$
    ch.$ = window.$;
	ch.version = '1.1.1';
	window.ch = ch;
}(this, this.$));
(function (ch) {
    'use strict';

    /**
     * Event Emitter Class for the browser.
     * @memberof ch
     * @constructor
     * @returns {Object} Returns a new instance of EventEmitter.
     * @example
     * // Create a new instance of EventEmitter.
     * var emitter = new ch.EventEmitter();
     * @example
     * // Inheriting from EventEmitter.
     * ch.util.inherits(Component, ch.EventEmitter);
     */
    function EventEmitter() {}

    /**
     * Adds a listener to the collection for a specified event.
     * @memberof! ch.EventEmitter.prototype
     * @function
     * @param {String} event The event name to subscribe.
     * @param {Function} listener Listener function.
     * @param {Boolean} once Indicate if a listener function will be called only one time.
     * @returns {component}
     * @example
     * // Will add an event listener to 'ready' event.
     * component.on('ready', listener);
     */
    EventEmitter.prototype.on = function (event, listener, once) {

        if (event === undefined) {
            throw new Error('ch.EventEmitter - "on(event, listener)": It should receive an event.');
        }

        if (listener === undefined) {
            throw new Error('ch.EventEmitter - "on(event, listener)": It should receive a listener function.');
        }

        this._eventsCollection = this._eventsCollection || {};

        listener.once = once || false;

        if (this._eventsCollection[event] === undefined) {
            this._eventsCollection[event] = [];
        }

        this._eventsCollection[event].push(listener);

        return this;
    };

    /**
     * Adds a listener to the collection for a specified event to will execute only once.
     * @memberof! ch.EventEmitter.prototype
     * @function
     * @param {String} event Event name.
     * @param {Function} listener Listener function.
     * @returns {component}
     * @example
     * // Will add an event handler to 'contentLoad' event once.
     * component.once('contentLoad', listener);
     */
    EventEmitter.prototype.once = function (event, listener) {

        this.on(event, listener, true);

        return this;
    };

    /**
     * Removes a listener from the collection for a specified event.
     * @memberof! ch.EventEmitter.prototype
     * @function
     * @param {String} event Event name.
     * @param {Function} listener Listener function.
     * @returns {component}
     * @example
     * // Will remove event listener to 'ready' event.
     * component.off('ready', listener);
     */
    EventEmitter.prototype.off = function (event, listener) {

        if (event === undefined) {
            throw new Error('EventEmitter - "off(event, listener)": It should receive an event.');
        }

        if (listener === undefined) {
            throw new Error('EventEmitter - "off(event, listener)": It should receive a listener function.');
        }

        var listeners = this._eventsCollection[event],
            i = 0,
            len;

        if (listeners !== undefined) {
            len = listeners.length;
            for (i; i < len; i += 1) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }

        return this;
    };

    /**
     * Returns all listeners from the collection for a specified event.
     * @memberof! ch.EventEmitter.prototype
     * @function
     * @param {String} event The event name.
     * @returns {Array}
     * @example
     * // Returns listeners from 'ready' event.
     * component.getListeners('ready');
     */
    EventEmitter.prototype.getListeners = function (event) {
        if (event === undefined) {
            throw new Error('ch.EventEmitter - "getListeners(event)": It should receive an event.');
        }

        return this._eventsCollection[event];
    };

    /**
     * Execute each item in the listener collection in order with the specified data.
     * @memberof! ch.EventEmitter.prototype
     * @function
     * @param {String} event The name of the event you want to emit.
     * @param {...Object} var_args Data to pass to the listeners.
     * @returns {component}
     * @example
     * // Will emit the 'ready' event with 'param1' and 'param2' as arguments.
     * component.emit('ready', 'param1', 'param2');
     */
    EventEmitter.prototype.emit = function () {

        var args = Array.prototype.slice.call(arguments, 0), // converted to array
            event = args.shift(), // Store and remove events from args
            listeners,
            i = 0,
            len;

        if (event === undefined) {
            throw new Error('ch.EventEmitter - "emit(event)": It should receive an event.');
        }

        if (typeof event === 'string') {
            event = {'type': event};
        }

        if (!event.target) {
            event.target = this;
        }

        if (this._eventsCollection !== undefined && this._eventsCollection[event.type] !== undefined) {
            listeners = this._eventsCollection[event.type];
            len = listeners.length;

            for (i; i < len; i += 1) {
                listeners[i].apply(this, args);

                if (listeners[i].once) {
                    this.off(event.type, listeners[i]);
                    len -= 1;
                    i -= 1;
                }
            }
        }

        return this;
    };

    // Expose EventEmitter
    ch.EventEmitter = EventEmitter;

}(this.ch));
(function ($, ch) {
    'use strict';

    /**
     * Add a function to manage components content.
     * @memberOf ch
     * @mixin
     * @returns {Function}
     */
    function Content() {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            defaults = {
                'method': this._options.method,
                'params': this._options.params,
                'cache': this._options.cache,
                'async': this._options.async,
                'waiting': this._options.waiting
            };

        /**
         * Set async content into component's container and emits the current event.
         * @private
         */
        function setAsyncContent(event) {

            that._$content.html(event.response);

            /**
             * Event emitted when the content change.
             * @event ch.Content#contentchange
             * @private
             */
            that.emit('_contentchange');

            /**
             * Event emitted if the content is loaded successfully.
             * @event ch.Content#contentdone
             * @ignore
             */

            /**
             * Event emitted when the content is loading.
             * @event ch.Content#contentwaiting
             * @example
             * // Subscribe to "contentwaiting" event.
             * component.on('contentwaiting', function (event) {
             *     // Some code here!
             * });
             */

            /**
             * Event emitted if the content isn't loaded successfully.
             * @event ch.Content#contenterror
             * @example
             * // Subscribe to "contenterror" event.
             * component.on('contenterror', function (event) {
             *     // Some code here!
             * });
             */

            that.emit('content' + event.status, event);
        }

        /**
         * Set content into component's container and emits the contentdone event.
         * @private
         */
        function setContent(content) {

            that._$content.html(content);

            that._options.cache = true;

            /**
             * Event emitted when the content change.
             * @event ch.Content#contentchange
             * @private
             */
            that.emit('_contentchange');

            /**
             * Event emitted if the content is loaded successfully.
             * @event ch.Content#contentdone
             * @example
             * // Subscribe to "contentdone" event.
             * component.on('contentdone', function (event) {
             *     // Some code here!
             * });
             */
            that.emit('contentdone');
        }

        /**
         * Get async content with given URL.
         * @private
         */
        function getAsyncContent(url, options) {
            // Initial options to be merged with the user's options
            options = $.extend({
                'method': 'GET',
                'params': '',
                'async': true,
                'waiting': '<div class="ch-loading-large"></div>'
            }, options || defaults);

            if (options.cache !== undefined) {
                that._options.cache = options.cache;
            }

            // Set loading
            setAsyncContent({
                'status': 'waiting',
                'response': options.waiting
            });

            // Make async request
            $.ajax({
                'url': url,
                'type': options.method,
                'data': 'x=x' + ((options.params !== '') ? '&' + options.params : ''),
                'cache': that._options.cache,
                'async': options.async,
                'beforeSend': function (jqXHR) {
                    // Set the AJAX default HTTP headers
                    jqXHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                },
                'success': function (data) {
                    // Send the result data to the client
                    setAsyncContent({
                        'status': 'done',
                        'response': data
                    });
                },
                'error': function (jqXHR, textStatus, errorThrown) {
                    // Send a defined error message
                    setAsyncContent({
                        'status': 'error',
                        'response': '<p>Error on ajax call.</p>',

                         // Grab all the parameters into a JSON to send to the client
                        'data': {
                            'jqXHR': jqXHR,
                            'textStatus': textStatus,
                            'errorThrown': errorThrown
                        }
                    });
                }
            });
        }

        /**
         * Allows to manage the components content.
         * @function
         * @memberof! ch.Content#
         * @param {(String | jQuerySelector | ZeptoSelector)} content The content that will be used by a component.
         * @param {Object} [options] A custom options to be used with content loaded by ajax.
         * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
         * @param {String} [options.params] Params like query string to be sent to the server.
         * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
         * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
         * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading.
         * @example
         * // Update content with some string.
         * component.content('Some new content here!');
         * @example
         * // Update content that will be loaded by ajax with custom options.
         * component.content('http://chico-ui.com.ar/ajax', {
         *     'cache': false,
         *     'params': 'x-request=true'
         * });
         */
        this.content = function (content, options) {

            // Returns the last updated content.
            if (content === undefined) {
                return that._$content.html();
            }

            that._options.content = content;

            if (that._options.cache === undefined) {
                that._options.cache = true;
            }

            if (typeof content === 'string') {
                // Case 1: AJAX call
                if (ch.util.isUrl(content)) {
                    getAsyncContent(content, options);
                // Case 2: Plain text
                } else {
                    setContent(content);
                }
            // Case 3: jQuery/Zepto/HTML Element
            } else if (ch.util.is$(content) || content.nodeType !== undefined) {
                setContent($(content).remove(null, true).removeClass('ch-hide'));
            }

            return that;
        };

        // Loads content once. If the cache is disabled the content loads in each show.
        this.once('_show', function () {

            that.content(that._options.content);

            that.on('show', function () {
                if (!that._options.cache) {
                    that.content(that._options.content);
                }
            });
        });
    }

    ch.Content = Content;

}(this.ch.$, this.ch));
(function (ch) {
    'use strict';

    var toggleEffects = {
        'slideDown': 'slideUp',
        'slideUp': 'slideDown',
        'fadeIn': 'fadeOut',
        'fadeOut': 'fadeIn'
    };

    /**
     * The Collapsible class gives to components the ability to shown or hidden its container.
     * @memberOf ch
     * @mixin
     * @returns {Function} Returns a private function.
     */
    function Collapsible() {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            triggerClass = 'ch-' + this.name + '-trigger-on',
            fx = this._options.fx,
            useEffects = (ch.support.fx && fx !== 'none' && fx !== false);

        function showCallback() {
            that.$container.removeClass('ch-hide').attr('aria-hidden', 'false');

            /**
             * Event emitted when the componentg is shown.
             * @event ch.Collapsible#show
             * @example
             * // Subscribe to "show" event.
             * collapsible.on('show', function () {
             *     // Some code here!
             * });
             */
            that.emit('show');
        }

        function hideCallback() {
            that.$container.addClass('ch-hide').attr('aria-hidden', 'true');

            /**
             * Event emitted when the component is hidden.
             * @event ch.Collapsible#hide
             * @example
             * // Subscribe to "hide" event.
             * collapsible.on('hide', function () {
             *     // Some code here!
             * });
             */
            that.emit('hide');
        }

        this._shown = false;

        /**
         * Shows the component container.
         * @function
         * @private
         */
        this._show = function () {

            that._shown = true;

            if (that.$trigger !== undefined) {
                that.$trigger.addClass(triggerClass);
            }

            /**
             * Event emitted before the component is shown.
             * @event ch.Collapsible#beforeshow
             * @example
             * // Subscribe to "beforeshow" event.
             * collapsible.on('beforeshow', function () {
             *     // Some code here!
             * });
             */
            that.emit('beforeshow');

            // Animate or not
            if (useEffects) {
                that.$container[fx]('fast', showCallback);
            } else {
                showCallback();
            }

            that.emit('_show');

            return that;
        };

        /**
         * Hides the component container.
         * @function
         * @private
         */
        this._hide = function () {

            that._shown = false;

            if (that.$trigger !== undefined) {
                that.$trigger.removeClass(triggerClass);
            }

            /**
             * Event emitted before the component is hidden.
             * @event ch.Collapsible#beforehide
             * @example
             * // Subscribe to "beforehide" event.
             * collapsible.on('beforehide', function () {
             *     // Some code here!
             * });
             */
            that.emit('beforehide');

            // Animate or not
            if (useEffects) {
                that.$container[toggleEffects[fx]]('fast', hideCallback);
            } else {
                hideCallback();
            }

            return that;
        };

        /**
         * Shows or hides the component.
         * @function
         * @private
         */
        this._toggle = function () {

            if (that._shown) {
                that.hide();
            } else {
                that.show();
            }

            return that;
        };

        this.on('disable', this.hide);
    }

    ch.Collapsible = Collapsible;

}(this.ch));
(function (window, $, ch) {
    'use strict';

    var $window = $(window),
        resized = false,
        scrolled = false,
        requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        }());

    function update() {

        var eve = (resized ? ch.onresize : ch.onscroll);

        // Refresh viewport
        this.refresh();

        // Change status
        resized = false;
        scrolled = false;

        /**
         * Event emitted when the dimensions of the viewport changes.
         * @event ch.viewport#resize
         * @example
         * ch.viewport.on('resize', function () {
         *     // Some code here!
         * });
         */

        /**
         * Event emitted when the viewport is scrolled.
         * @event ch.viewport#scroll
         * @example
         * ch.viewport.on('scroll', function () {
         *     // Some code here!
         * });
         */

        // Emits the current event
        this.emit(eve);
    }

    /**
     * The Viewport is a component to ease viewport management. You can get the dimensions of the viewport and beyond, which can be quite helpful to perform some checks with JavaScript.
     * @memberof ch
     * @constructor
     * @augments ch.EventEmitter
     * @requires ch.util
     * @returns {viewport} Returns a new instance of Viewport.
     */
    function Viewport() {
        this._init();
    }

    ch.util.inherits(Viewport, ch.EventEmitter);

    /**
     * Initialize a new instance of Viewport.
     * @memberof! ch.Viewport.prototype
     * @function
     * @private
     * @returns {viewport}
     */
    Viewport.prototype._init = function () {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * Element representing the visible area.
         * @memberof! ch.viewport#element
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$el = $window;

        this.refresh();

        $window
            .on(ch.onresize + '.viewport', function () {
                // No changing, exit
                if (!resized) {
                    resized = true;

                    /**
                     * requestAnimationFrame
                     */
                    requestAnimFrame(function updateResize() {
                        update.call(that);
                    });
                }
            })
            .on(ch.onscroll + '.viewport', function () {
                // No changing, exit
                if (!scrolled) {
                    scrolled = true;

                    /**
                     * requestAnimationFrame
                     */
                    requestAnimFrame(function updateScroll() {
                        update.call(that);
                    });
                }
            });
    };

    /**
     * Calculates/updates the client rects of viewport (in pixels).
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {viewport}
     * @example
     * // Update the client rects of the viewport.
     * ch.viewport.calculateClientRect();
     */
    Viewport.prototype.calculateClientRect = function () {
        /**
         * The current top client rect of the viewport (in pixels).
         * @public
         * @name ch.Viewport#top
         * @type {Number}
         * @example
         * // Checks if the top client rect of the viewport is equal to 0.
         * (ch.viewport.top === 0) ? 'Yes': 'No';
         */

         /**
         * The current left client rect of the viewport (in pixels).
         * @public
         * @name ch.Viewport#left
         * @type {Number}
         * @example
         * // Checks if the left client rect of the viewport is equal to 0.
         * (ch.viewport.left === 0) ? 'Yes': 'No';
         */
        this.top = this.left = 0;

        /**
         * The current bottom client rect of the viewport (in pixels).
         * @public
         * @name ch.Viewport#bottom
         * @type {Number}
         * @example
         * // Checks if the bottom client rect of the viewport is equal to a number.
         * (ch.viewport.bottom === 900) ? 'Yes': 'No';
         */
        this.bottom = this.$el.height();

        /**
         * The current right client rect of the viewport (in pixels).
         * @public
         * @name ch.Viewport#right
         * @type {Number}
         * @example
         * // Checks if the right client rect of the viewport is equal to a number.
         * (ch.viewport.bottom === 1200) ? 'Yes': 'No';
         */
        this.right = this.$el.width();

        return this;
    };

    /**
     * Calculates/updates the dimensions (width and height) of the viewport (in pixels).
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {viewport}
     * @example
     * // Update the dimensions values of the viewport.
     * ch.viewport.calculateDimensions();
     */
    Viewport.prototype.calculateDimensions = function () {
        this.calculateClientRect();

        /**
         * The current height of the viewport (in pixels).
         * @public
         * @name ch.Viewport#height
         * @type Number
         * @example
         * // Checks if the height of the viewport is equal to a number.
         * (ch.viewport.height === 700) ? 'Yes': 'No';
         */
        this.height = this.bottom;

        /**
         * The current width of the viewport (in pixels).
         * @public
         * @name ch.Viewport#width
         * @type Number
         * @example
         * // Checks if the height of the viewport is equal to a number.
         * (ch.viewport.width === 1200) ? 'Yes': 'No';
         */
        this.width = this.right;

        return this;
    };

    /**
     * Calculates/updates the viewport position.
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {viewport}
     * @example
     * // Update the offest values of the viewport.
     * ch.viewport.calculateOffset();
     */
    Viewport.prototype.calculateOffset = function () {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var scroll = ch.util.getScroll();

        /**
         * The offset top of the viewport.
         * @memberof! ch.Viewport#offsetTop
         * @type {Number}
         * @example
         * // Checks if the offset top of the viewport is equal to a number.
         * (ch.viewport.offsetTop === 200) ? 'Yes': 'No';
         */
        this.offsetTop = scroll.top;

        /**
         * The offset left of the viewport.
         * @memberof! ch.Viewport#offsetLeft
         * @type {Number}
         * @example
         * // Checks if the offset left of the viewport is equal to a number.
         * (ch.viewport.offsetLeft === 200) ? 'Yes': 'No';
         */
        this.offsetLeft = scroll.left;

        /**
         * The offset right of the viewport.
         * @memberof! ch.Viewport#offsetRight
         * @type {Number}
         * @example
         * // Checks if the offset right of the viewport is equal to a number.
         * (ch.viewport.offsetRight === 200) ? 'Yes': 'No';
         */
        this.offsetRight = this.left + this.width;

        /**
         * The offset bottom of the viewport.
         * @memberof! ch.Viewport#offsetBottom
         * @type {Number}
         * @example
         * // Checks if the offset bottom of the viewport is equal to a number.
         * (ch.viewport.offsetBottom === 200) ? 'Yes': 'No';
         */
        this.offsetBottom = this.offsetTop + this.height;

        return this;
    };

    /**
     * Rertuns/updates the viewport orientation: landscape or portrait.
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {viewport}
     * @example
     * // Update the dimensions values of the viewport.
     * ch.viewport.calculateDimensions();
     */
    Viewport.prototype.calculateOrientation = function () {
        /** The viewport orientation: landscape or portrait.
         * @memberof! ch.Viewport#orientation
         * @type {String}
         * @example
         * // Checks if the orientation is "landscape".
         * (ch.viewport.orientation === 'landscape') ? 'Yes': 'No';
         */
        this.orientation = (Math.abs(this.$el.orientation) === 90) ? 'landscape' : 'portrait';

        return this;
    };

    /**
     * Calculates if an element is completely located in the viewport.
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {Boolean}
     * @params {HTMLElement} el A given HMTLElement.
     * @example
     * // Checks if an element is in the viewport.
     * ch.viewport.inViewport(HTMLElement) ? 'Yes': 'No';
     */
    Viewport.prototype.inViewport = function (el) {
        var r = el.getBoundingClientRect();

        return (r.top > 0) && (r.right < this.width) && (r.bottom < this.height) && (r.left > 0);
    };

    /**
     * Calculates if an element is visible in the viewport.
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {Boolean}
     * @params {HTMLElement} el A given HTMLElement.
     * @example
     * // Checks if an element is visible.
     * ch.viewport.isVisisble(HTMLElement) ? 'Yes': 'No';
     */
    Viewport.prototype.isVisible = function (el) {
        var r = el.getBoundingClientRect();

        return (r.height >= this.offsetTop);
    };

    /**
     * Upadtes the viewport dimension, viewport positions and orietation.
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {viewport}
     * @example
     * // Refreshs the viewport.
     * ch.viewport.refresh();
     */
    Viewport.prototype.refresh = function () {
        this.calculateDimensions();
        this.calculateOffset();
        this.calculateOrientation();

        return this;
    };

    // Creates an instance of the Viewport into ch namespace.
    ch.viewport = new Viewport();

}(this, this.ch.$, this.ch));
(function (window, $, ch) {
    'use strict';

    /**
     * The Positioner lets you position elements on the screen and changes its positions.
     * @memberof ch
     * @constructor
     * @param {Object} options Configuration object.
     * @param {(jQuerySelector | ZeptoSelector)} options.target Reference to the element to be positioned.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the ch.viewport.
     * @param {String} [options.side] The side option where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {String} [options.align] The align options where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] Thethe type of positioning used. You must use: "absolute" or "fixed". Default: "fixed".
     * @requires ch.util
     * @requires ch.Viewport
     * @returns {positioner} Returns a new instance of Positioner.
     * @example
     * // Instance the Positioner It requires a little configuration.
     * // The default behavior place an element center into the Viewport.
     * var positioned = new ch.Positioner({
     *     'target': $(selector),
     *     'reference': $(selector),
     *     'side': 'top',
     *     'align': 'left',
     *     'offsetX': 20,
     *     'offsetY': 10
     * });
     * @example
     * // offsetX: The Positioner could be configurated with an offsetX.
     * // This example show an element displaced horizontally by 10px of defined position.
     * var positioned = new ch.Positioner({
     *     'target': $(selector),
     *     'reference': $(selector),
     *     'side': 'top',
     *     'align': 'left',
     *     'offsetX': 10
     * });
     * @example
     * // offsetY: The Positioner could be configurated with an offsetY.
     * // This example show an element displaced vertically by 10px of defined position.
     * var positioned = new ch.Positioner({
     *     'target': $(selector),
     *     'reference': $(selector),
     *     'side': 'top',
     *     'align': 'left',
     *     'offsetY': 10
     * });
     * @example
     * // positioned: The positioner could be configured to work with fixed or absolute position value.
     * var positioned = new ch.Positioner({
     *     'target': $(selector),
     *     'reference': $(selector),
     *     'position': 'fixed'
     * });
     */
    function Positioner(options) {

        if (options === undefined) {
            throw new window.Error('ch.Positioner: Expected options defined.');
        }

        // Creates its private options
        this._options = ch.util.clone(this._defaults);

        // Init
        this._configure(options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Positioner.prototype
     * @type {String}
     */
    Positioner.prototype.name = 'positioner';

    /**
     * Returns a reference to the Constructor function that created the instance's prototype.
     * @memberof! ch.Positioner.prototype
     * @function
     * @private
     */
    Positioner.prototype._constructor = Positioner;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Positioner.prototype._defaults = {
        'offsetX': 0,
        'offsetY': 0,
        'side': 'center',
        'align': 'center',
        'reference': ch.viewport,
        'position': 'fixed'
    };

    /**
     * Configures the positioner instance with a given options.
     * @memberof! ch.Positioner.prototype
     * @function
     * @private
     * @returns {positioner}
     * @params {Object} options A configuration object.
     */
    Positioner.prototype._configure = function (options) {

        // Merge user options with its options
        $.extend(this._options, options);

        this._options.offsetX = parseInt(this._options.offsetX, 10);
        this._options.offsetY = parseInt(this._options.offsetY, 10);

        /**
         * Reference to the element to be positioned.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$target = options.target || this.$target;


        /**
         * It's a reference to position and size of element that will be considered to carry out the position.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$reference = options.reference || this.$reference;
        this._reference = this._options.reference;

        this.$target.css('position', this._options.position);

        return this;
    };

    /**
     * Updates the current position with a given options
     * @memberof! ch.Positioner.prototype
     * @function
     * @returns {positioner}
     * @params {Object} options A configuration object.
     * @example
     * // Updates the current position.
     * positioned.refresh();
     * @example
     * // Updates the current position with new offsetX and offsetY.
     * positioned.refresh({
     *     'offestX': 100,
     *     'offestY': 10
     * });
     */
    Positioner.prototype.refresh = function (options) {

        if (options !== undefined) {
            this._configure(options);
        }

        if (this._reference !== ch.viewport) {
            this._calculateReference();
        }

        this._calculateTarget();

        // the object that stores the top, left reference to set to the target
        this._setPoint();

        return this;
    };

    /**
     * Calculates the reference (element or ch.viewport) of the position.
     * @memberof! ch.Positioner.prototype
     * @function
     * @private
     * @returns {positioner}
     */
    Positioner.prototype._calculateReference = function () {

        var reference = this.$reference[0],
            offset;

        reference.setAttribute('data-side', this._options.side);
        reference.setAttribute('data-align', this._options.align);

        this._reference = ch.util.getOuterDimensions(reference);

        if (reference.offsetParent === this.$target[0].offsetParent) {
            this._reference.left = reference.offsetLeft;
            this._reference.top = reference.offsetTop;

        } else {
            offset = ch.util.getOffset(reference);
            this._reference.left = offset.left;
            this._reference.top = offset.top;
        }

        return this;
    };

    /**
     * Calculates the positioned element.
     * @memberof! ch.Positioner.prototype
     * @function
     * @private
     * @returns {positioner}
     */
    Positioner.prototype._calculateTarget = function () {

        var target = this.$target[0];
        target.setAttribute('data-side', this._options.side);
        target.setAttribute('data-align', this._options.align);

        this._target = ch.util.getOuterDimensions(target);

        return this;
    };

    /**
     * Calculates the points.
     * @memberof! ch.Positioner.prototype
     * @function
     * @private
     * @returns {positioner}
     */
    Positioner.prototype._setPoint = function () {
        var side = this._options.side,
            oritentation = (side === 'top' || side === 'bottom') ? 'horizontal' : ((side === 'right' || side === 'left') ? 'vertical' : 'center'),
            coors,
            oritentationMap;

        // take the side and calculate the alignment and make the CSSpoint
        if (oritentation === 'center') {
            // calculates the coordinates related to the center side to locate the target
            coors = {
                'top': (this._reference.top + (this._reference.height / 2 - this._target.height / 2)),
                'left': (this._reference.left + (this._reference.width / 2 - this._target.width / 2))
            };

        } else if (oritentation === 'horizontal') {
            // calculates the coordinates related to the top or bottom side to locate the target
            oritentationMap = {
                'left': this._reference.left,
                'center': (this._reference.left + (this._reference.width / 2 - this._target.width / 2)),
                'right': (this._reference.left + this._reference.width - this._target.width),
                'top': this._reference.top - this._target.height,
                'bottom': (this._reference.top + this._reference.height)
            };

            coors = {
                'top': oritentationMap[side],
                'left': oritentationMap[this._options.align]
            };

        } else {
            // calculates the coordinates related to the right or left side to locate the target
            oritentationMap = {
                'top': this._reference.top,
                'center': (this._reference.top + (this._reference.height / 2 - this._target.height / 2)),
                'bottom': (this._reference.top + this._reference.height - this._target.height),
                'right': (this._reference.left + this._reference.width),
                'left': (this._reference.left - this._target.width)
            };

            coors = {
                'top': oritentationMap[this._options.align],
                'left': oritentationMap[side]
            };
        }

        coors.top += this._options.offsetY;
        coors.left += this._options.offsetX;

        this.$target.css(coors);

        return this;
    };

    ch.Positioner = Positioner;

}(this, this.ch.$, this.ch));
(function (window, $, ch) {
    'use strict';

    var $document = $(window.document),
        codeMap = {
            '8': ch.onkeybackspace,
            '9': ch.onkeytab,
            '13': ch.onkeyenter,
            '27': ch.onkeyesc,
            '37': ch.onkeyleftarrow,
            '38': ch.onkeyuparrow,
            '39': ch.onkeyrightarrow,
            '40': ch.onkeydownarrow
        },

        /**
         * Shortcuts
         * @memberof ch
         * @namespace
         */
        shortcuts = {

            '_active': null,

            '_queue': [],

            '_collection': {},

            /**
             * Add a callback to a shortcut with given name.
             * @param {(ch.onkeybackspace | ch.onkeytab | ch.onkeyenter | ch.onkeyesc | ch.onkeyleftarrow | ch.onkeyuparrow | ch.onkeyrightarrow | ch.onkeydownarrow)} shortcut Shortcut to subscribe.
             * @param {String} name A name to add in the collection.
             * @param {Function} callback A given function.
             * @returns {Object} Retuns the ch.shortcuts.
             * @example
             * // Add a callback to ESC key with "component" name.
             * ch.shortcuts.add(ch.onkeyesc, 'component', component.hide);
             */
            'add': function (shortcut, name, callback) {

                if (this._collection[name] === undefined) {
                    this._collection[name] = {};
                }

                if (this._collection[name][shortcut] === undefined) {
                    this._collection[name][shortcut] = [];
                }

                this._collection[name][shortcut].push(callback);

                return this;

            },

            /**
             * Removes a callback from a shortcut with given name.
             * @param {String} name A name to remove from the collection.
             * @param {(ch.onkeybackspace | ch.onkeytab | ch.onkeyenter | ch.onkeyesc | ch.onkeyleftarrow | ch.onkeyuparrow | ch.onkeyrightarrow | ch.onkeydownarrow)} [shortcut] Shortcut to unsubscribe.
             * @param {Function} callback A given function.
             * @returns {Object} Retuns the ch.shortcuts.
             * @example
             * // Remove a callback from ESC key with "component" name.
             * ch.shortcuts.remove(ch.onkeyesc, 'component', component.hide);
             */
            'remove': function (name, shortcut, callback) {
                var evt,
                    evtCollection,
                    evtCollectionLenght;

                if (name === undefined) {
                    throw new Error('Shortcuts - "remove(name, shortcut, callback)": "name" parameter must be defined.');
                }

                if (shortcut === undefined) {
                    delete this._collection[name];
                    return this;
                }

                if (callback === undefined) {
                    delete this._collection[name][shortcut];
                    return this;
                }

                evtCollection = this._collection[name][shortcut];

                evtCollectionLenght = evtCollection.length;

                for (evt = 0; evt < evtCollectionLenght; evt += 1) {

                    if (evtCollection[evt] === callback) {
                        evtCollection.splice(evt, 1);
                    }
                }

                return this;

            },

            /**
             * Turn on shortcuts associated to a given name.
             * @param {String} name A given name from the collection.
             * @returns {Object} Retuns the ch.shortcuts.
             * @example
             * // Turn on shortcuts associated to "component" name.
             * ch.shortcuts.on('component');
             */
            'on': function (name) {
                var queueLength = this._queue.length,
                    item = queueLength - 1;

                // check if the instance exist and move the order, adds it at the las position and removes the current
                for (item; item >= 0; item -= 1) {
                    if (this._queue[item] === name) {
                        this._queue.splice(item, 1);
                    }
                }

                this._queue.push(name);
                this._active = name;

                return this;
            },

            /**
             * Turn off shortcuts associated to a given name.
             * @param {String} name A given name from the collection.
             * @returns {Object} Retuns the ch.shortcuts.
             * @example
             * // Turn off shortcuts associated to "component" name.
             * ch.shortcuts.off('component');
             */
            'off': function (name) {
                var queueLength = this._queue.length,
                    item = queueLength - 1;

                for (item; item >= 0; item -= 1) {
                    if (this._queue[item] === name) {
                        // removes the instance that I'm setting off
                        this._queue.splice(item, 1);

                        // the queue is full
                        if (this._queue.length > 0) {
                            this._active = this._queue[this._queue.length - 1];
                        } else {
                        // the queue no has elements
                            this._active = null;
                        }
                    }
                }

                return this;
            }
        };

    $document.on('keydown.shortcuts', function (event) {
        var keyCode = event.keyCode.toString(),
            shortcut = codeMap[keyCode],
            callbacks,
            callbacksLenght,
            i = 0;

        if (shortcut !== undefined && shortcuts._active !== null) {
            callbacks = shortcuts._collection[shortcuts._active][shortcut];

            event.type = shortcut;


            if (callbacks !== undefined) {

                callbacksLenght = callbacks.length;

                for (i = 0; i < callbacksLenght; i += 1) {
                    callbacks[i](event);
                }

            }

        }
    });

    ch.shortcuts = shortcuts;

}(this, this.ch.$, this.ch));

(function (window, ch) {
    'use strict';

    /**
     * Executes a callback function when the images of a query selection loads.
     * @memberof! ch
     * @param $el An image or a collection of images.
     * @param callback The handler the component will fire after the images loads.
     * @example
     * $('selector').onImagesLoads(function () {
     *     console.log('The size of the loaded image is ' + this.width);
     * });
     */
    function onImagesLoads($el, callback) {

        $el
            .one('load', function () {
                var len = $el.length;

                window.setTimeout(function () {
                    if (--len <= 0) { callback.call($el); }
                }, 200);
            })
            .each(function () {
                // Cached images don't fire load sometimes, so we reset src.
                if (this.complete || this.complete === undefined) {
                    var src = this.src;
                    // Data uri fix bug in web-kit browsers
                    this.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
                    this.src = src;
                }
            });
    }

    ch.onImagesLoads = onImagesLoads;

}(this, this.ch));
(function (window, $, ch) {
    'use strict';

    var util = ch.util,
        uid = 0;

    /**
     * Base class for all components.
     * @memberof ch
     * @constructor
     * @augments ch.EventEmitter
     * @param {(jQuerySelector | ZeptoSelector)} $el jQuery or Zepto Selector.
     * @param {Object} [options] Configuration options.
     * @returns {component} Returns a new instance of Component.
     */
    function Component($el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Expandable is created.
             * @memberof! ch.Expandable.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Component#ready
         * @example
         * // Subscribe to "ready" event.
         * component.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    ch.util.inherits(Component, ch.EventEmitter);

    /**
     * The name of a component.
     * @memberof! ch.Component.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var component = $(selector).data(name);
     */
    Component.prototype.name = 'component';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Component.prototype
     * @function
     */
    Component.prototype.constructor = Component;

    /**
     * Initialize a new instance of Component and merge custom options with defaults options.
     * @memberof! ch.Component.prototype
     * @function
     * @private
     * @returns {component}
     */
    Component.prototype._init = function ($el, options) {

        // Clones defaults or creates a defaults object
        var defaults = (this._defaults) ? util.clone(this._defaults) : {};

        // Clones the defaults options or creates a new object
        if (options === undefined) {
            if ($el === undefined) {
                this._options = defaults;

            } else if (util.is$($el)) {
                this._$el = $el;
                this._el = $el[0];
                this._options = defaults;

            } else if (typeof $el === 'object') {
                options = $el;
                $el = undefined;
                this._options = $.extend(defaults, options);
            }

        } else if (typeof options === 'object') {
            if ($el === undefined) {
                this._options = $.extend(defaults, options);

            } else if (util.is$($el)) {
                this._$el = $el;
                this._el = $el[0];
                this._options = $.extend(defaults, options);
            }

        } else {
            throw new window.Error('Unexpected parameters were found in the \'' + this.name + '\' instantiation.');
        }

        /**
         * A unique id to identify the instance of a component.
         * @type {Number}
         */
        this.uid = (uid += 1);

        /**
         * Indicates if a component is enabled.
         * @type {Boolean}
         * @private
         */
        this._enabled = true;
    };


    /**
     * Adds functionality or abilities from other classes.
     * @memberof! ch.Component.prototype
     * @function
     * @returns {component}
     * @params {...String} var_args The name of the abilities to will be used.
     * @example
     * // You can require some abilitiest to use in your component.
     * // For example you should require the collpasible abitliy.
     * var component = new Component(element, options);
     * component.require('Collapsible');
     */
    Component.prototype.require = function () {

        var arg,
            i = 0,
            len = arguments.length;

        for (i; i < len; i += 1) {
            arg = arguments[i];

            if (this[arg.toLowerCase()] === undefined) {
                ch[arg].call(this);
            }
        }

        return this;
    };

    /**
     * Enables an instance of Component.
     * @memberof! ch.Component.prototype
     * @function
     * @returns {component}
     * @example
     * // Enabling an instance of Component.
     * component.enable();
     */
    Component.prototype.enable = function () {
        this._enabled = true;

        /**
         * Emits when a component is enabled.
         * @event ch.Component#enable
         * @example
         * // Subscribe to "enable" event.
         * component.on('enable', function () {
         *     // Some code here!
         * });
         */
        this.emit('enable');

        return this;
    };

    /**
     * Disables an instance of Component.
     * @memberof! ch.Component.prototype
     * @function
     * @returns {component}
     * @example
     * // Disabling an instance of Component.
     * component.disable();
     */
    Component.prototype.disable = function () {
        this._enabled = false;

        /**
         * Emits when a component is disable.
         * @event ch.Component#disable
         * @example
         * // Subscribe to "disable" event.
         * component.on('disable', function () {
         *     // Some code here!
         * });
         */
        this.emit('disable');

        return this;
    };

    /**
     * Destroys an instance of Component and remove its data from asociated element.
     * @memberof! ch.Component.prototype
     * @function
     * @example
     * // Destroy a component
     * component.destroy();
     * // Empty the component reference
     * component = undefined;
     */
    Component.prototype.destroy = function () {

        this.disable();

        if (this._el !== undefined) {
            this._$el.removeData(this.name);
        }

        /**
         * Emits when a component is destroyed.
         * @event ch.Component#destroy
         * @exampleDescription
         * @example
         * // Subscribe to "destroy" event.
         * component.on('destroy', function () {
         *     // Some code here!
         * });
         */
        this.emit('destroy');

        return;
    };

    ch.Component = Component;

}(this, this.ch.$, this.ch));
(function (window, $, ch) {
    'use strict';

    /**
     * Form is a controller of DOM's HTMLFormElement.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Validations
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Form.
     * @param {Object} [options] Options to customize an instance.
     * @param {Object} [options.messages] A collections of validations messages.
     * @param {String} [options.messages.required] A validation message.
     * @param {String} [options.messages.string] A validation message.
     * @param {String} [options.messages.url] A validation message.
     * @param {String} [options.messages.email] A validation message.
     * @param {String} [options.messages.maxLength] A validation message.
     * @param {String} [options.messages.minLength] A validation message.
     * @param {String} [options.messages.custom] A validation message.
     * @param {String} [options.messages.number] A validation message.
     * @param {String} [options.messages.min] A validation message.
     * @param {String} [options.messages.max] A validation message.
     * @returns {form} Returns a new instance of Form.
     * @example
     * // Create a new Form.
     * var form = new ch.Form($el, [options]);
     * @example
     * // Create a new Form with jQuery or Zepto.
     * var form = $(selector).form();
     * @example
     * // Create a new Form with custom messages.
     * var form = $(selector).form({
     *     'messages': {
     *          'required': 'Some message!',
     *          'email': 'Another message!'
     *     }
     * });
     */
    function Form($el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        that._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Form is created.
             * @memberof! ch.Form.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * It emits an event when the form is ready to use.
         * @event ch.Form#ready
         * @example
         * // Subscribe to "ready" event.
         * form.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Form, ch.Component);

    /**
     * The name of the component.
     * @memberof! ch.Form.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var form = $(selector).data('form');
     */
    Form.prototype.name = 'form';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Form.prototype
     * @function
     */
    Form.prototype.constructor = Form;

    /**
     * Initialize a new instance of Form and merge custom options with defaults options.
     * @memberof! ch.Form.prototype
     * @function
     * @private
     * @returns {form}
     */
    Form.prototype._init = function ($el, options) {
        // Call to its parent init method
        parent._init.call(this, $el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * A collection of active errors.
         * @type {Array}
         */
        this.errors = [];

        /**
         * Collection of defined messages.
         * @type {Object}
         * @private
         */
        this._messages = this._options.messages || {};

        /**
         * A collection of validations instances.
         * @type {Array}
         */
        this.validations = [];

        /**
         * The form container.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$container = this._$el
            // Add classname
            .addClass('ch-form')
            // Disable HTML5 browser-native validations
            .attr('novalidate', 'novalidate')
            // Bind the submit
            .on('submit.form', function (event) {
                // Runs validations
                that.validate(event);
            });

        this.$container
            // Bind the reset
            .find('input[type="reset"]').on(ch.onpointertap + '.form', function (event) {
                ch.util.prevent(event);
                that.reset();
            });

        // Clean validations
        this.on('disable', this.clear);

        return this;
    };

    /**
     * Executes all validations.
     * @memberof! ch.Form.prototype
     * @function
     * @returns {form}
     */
    Form.prototype.validate = function (event) {

        if (!this._enabled) {
            return this;
        }

        /**
         * It emits an event when the form will be validated.
         * @event ch.Form#beforevalidate
         * @example
         * // Subscribe to "beforevalidate" event.
         * component.on('beforevalidate', function () {
         *     // Some code here!
         * });
         */
        this.emit('beforevalidate');

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            i = 0,
            j = that.validations.length,
            validation,
            firstError,
            triggerError;

        this.errors.length = 0;

        // Run validations
        for (i; i < j; i += 1) {
            validation = that.validations[i];

            // Validate
            validation.validate();

            // Store validations with errors
            if (validation.isShown()) {
                that.errors.push(validation);
            }
        }

        // Is there's an error
        if (that.errors.length > 0) {
            firstError = that.errors[0];

            firstError.$trigger[0].scrollIntoView();

            // Issue UI-332: On validation must focus the first field with errors.
            // Doc: http://wiki.ml.com/display/ux/Mensajes+de+error
            triggerError = firstError.$trigger[0];

            if (triggerError.tagName === 'DIV') {
                firstError.$trigger.find('input:first').focus();
            }

            if (triggerError.type !== 'hidden' || triggerError.tagName === 'SELECT') {
                triggerError.focus();
            }

            ch.util.prevent(event);

            /**
             * It emits an event when a form has got errors.
             * @event ch.Form#error
             * @example
             * // Subscribe to "error" event.
             * form.on('error', function (errors) {
             *     console.log(errors.length);
             * });
             */
            this.emit('error', this.errors);

        } else {

            /**
             * It emits an event when a form hasn't got errors.
             * @event ch.Form#success
             * @example
             * // Subscribe to "success" event.
             * form.on("submit",function () {
             *     // Some code here!
             * });
             * @example
             * // Subscribe to "success" event and prevent the submit event.
             * form.on("submit",function (event) {
             *     event.preventDefault();
             *     // Some code here!
             * });
             */
            this.emit('success', event);
        }

        return this;
    };

    /**
     * Checks if the form has got errors but it doesn't show bubbles.
     * @memberof! ch.Form.prototype
     * @function
     * @returns {Boolean}
     * @example
     * // Checks if a form has errors and do something.
     * if (form.hasError()) {
     *     // Some code here!
     * };
     */
    Form.prototype.hasError = function () {

        if (!this._enabled) {
            return false;
        }

        this.errors.length = 0;

        var i = 0,
            j = this.validations.length,
            validation;

        // Run hasError
        for (i; i < j; i += 1) {

            validation = this.validations[i];

            if (validation.hasError()) {
                this.errors.push(validation);
            }

        }

        if (this.errors.length > 0) {
            return true;
        }

        return false;
    };

    /**
     * Clear all active errors.
     * @memberof! ch.Form.prototype
     * @function
     * @returns {form}
     * @example
     * // Clear active errors.
     * form.clear();
     */
    Form.prototype.clear = function () {
        var i = 0,
            j = this.validations.length;

        for (i; i < j; i += 1) {
            this.validations[i].clear();
        }

        /**
         * It emits an event when the form is cleaned.
         * @event ch.Form#clear
         * @example
         * // Subscribe to "clear" event.
         * form.on('clear', function () {
         *     // Some code here!
         * });
         */
        this.emit('clear');

        return this;
    };

    /**
     * Clear all active errors and executes the reset() native mehtod.
     * @memberof! ch.Form.prototype
     * @function
     * @returns {form}
     * @example
     * // Resets form fields and clears active errors.
     * form.reset();
     */
    Form.prototype.reset = function () {

        // Clears all shown validations
        this.clear();

        // Executes the native reset() method
        this._el.reset();

        /**
         * It emits an event when a form resets its fields.
         * @event ch.Form#reset
         * @example
         * // Subscribe to "reset" event.
         * form.on('reset', function () {
         *     // Some code here!
         * });
         */
        this.emit('reset');

        return this;
    };

    /**
     * Destroys a Form instance.
     * @memberof! ch.Form.prototype
     * @function
     * @example
     * // Destroy a form
     * form.destroy();
     * // Empty the form reference
     * form = undefined;
     */
    Form.prototype.destroy = function () {

        this.$container
            .off('.form')
            .removeAttr('novalidate');

        $.each(this.validations, function (i, e) {
            e.destroy();
        });

        parent.destroy.call(this);

        return;
    };

    // Factorize
    ch.factory(Form);

}(this, this.ch.$, this.ch));
(function ($, ch) {
    'use strict';

    // Private Members
    var conditions = {
        'string': {
            'fn': function (value) {
                // the following regular expression has the utf code for the lating characters
                // the ranges are A,EI,O,U,a,ei,o,u,ç,Ç please for reference see http://www.fileformat.info/info/charset/UTF-8/list.htm
                return (/^([a-zA-Z\u00C0-\u00C4\u00C8-\u00CF\u00D2-\u00D6\u00D9-\u00DC\u00E0-\u00E4\u00E8-\u00EF\u00F2-\u00F6\u00E9-\u00FC\u00C7\u00E7\s]*)$/i).test(value);
            },
            'message': 'Use only letters.'
        },
        'email': {
            'fn': function (value) {
                return (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i).test(value);
            },
            'message': 'Use a valid e-mail such as name@example.com.'
        },
        'url': {
            'fn': function (value) {
                return (/^((https?|ftp|file):\/\/|((www|ftp)\.)|(\/|.*\/)*)[a-z0-9-]+((\.|\/)[a-z0-9-]+)+([/?].*)?$/i).test(value);
            },
            'message': 'It must be a valid URL.'
        },
        'minLength': {
            'fn': function (a, b) { return a.length >= b; },
            'message': 'Enter at least {#num#} characters.'
        },
        'maxLength': {
            'fn': function (a, b) { return a.length <= b; },
            'message': 'The maximum amount of characters is {#num#}.'
        },
        'number': {
            'fn': function (value) {
                return (/^(-?[0-9]+)$/i).test(value);
            },
            'message': 'Use only numbers.'
        },
        'max': {
            'fn': function (a, b) { return a <= b; },
            'message': 'The amount must be smaller than {#num#}.'
        },
        'min': {
            'fn': function (a, b) { return a >= b; },
            'message': 'The amount must be higher than {#num#}.'
        },
        'required': {
            'fn': function (value) {

                var tag = this.$trigger.hasClass('ch-form-options') ? 'OPTIONS' : this._el.tagName,
                    validated;

                switch (tag) {
                case 'OPTIONS':
                    validated = this.$trigger.find('input:checked').length !== 0;
                    break;

                case 'SELECT':
                    validated = (value !== '-1' && value !== '');
                    break;

                // INPUTS and TEXTAREAS
                default:
                    validated = $.trim(value).length !== 0;
                    break;
                }

                return validated;
            },
            'message': 'Fill in this information.'
        },
        'custom': {
            // I don't have pre-conditions, comes within conf.fn argument
            'message': 'Error'
        }
    };

    /**
     * Condition utility.
     * @memberof ch
     * @constructor
     * @requires ch.Validation
     * @param {Array} [condition] A conditions to validate.
     * @param {String} [condition.name] The name of the condition.
     * @param {String} [condition.message] The given error message to the condition.
     * @param {String} [condition.fn] The method to validate a given condition.
     * @returns {condition} Returns a new instance of Condition.
     * @example
     * // Create a new condition object with patt.
     * var condition = ch.Condition({
     *     'name': 'string',
     *     'patt': /^([a-zA-Z\u00C0-\u00C4\u00C8-\u00CF\u00D2-\u00D6\u00D9-\u00DC\u00E0-\u00E4\u00E8-\u00EF\u00F2-\u00F6\u00E9-\u00FC\u00C7\u00E7\s]*)$/,
     *     'message': 'Some message here!'
     * });
     * @example
     * //Create a new condition object with expr.
     * var condition = ch.Condition({
     *     'name': 'maxLength',
     *     'patt': function(a,b) { return a.length <= b },
     *     'message': 'Some message here!',
     *     'value': 4
     * });
     * @example
     * // Create a new condition object with func.
     * var condition = ch.Condition({
     *     'name': 'custom',
     *     'patt': function (value) {
     *         if (value === 'ChicoUI') {
     *
     *             // Some code here!
     *
     *             return true;
     *         };
     *
     *         return false;
     *     },
     *     'message': 'Your message here!'
     * });
     */
    function Condition(condition) {

        $.extend(this, conditions[condition.name], condition);

        // replaces the condition default message in the following conditions max, min, minLenght, maxLenght
        if (this.name === 'min' || this.name === 'max' || this.name === 'minLength' || this.name === 'maxLength') {
            this.message = this.message.replace('{#num#}', this.num);
        }

        this._enabled = true;

        return this;
    }

    /**
     * The name of the component.
     * @memberof! ch.Condition.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var condition = $(selector).data('condition');
     */
    Condition.prototype.name = 'condition';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Condition.prototype
     * @function
     */
    Condition.prototype.constructor = Condition;

    /**
     * Enables an instance of condition.
     * @memberof! ch.Condition.prototype
     * @function
     * @returns {condition}
     * @example
     * // Enabling an instance of Condition.
     * condition.enable();
     * @example
     * // Enabling a condition.
     * condition.enable();
     */
    Condition.prototype.enable = function () {
        this._enabled = true;

        return this;
    };

    /**
     * Disables an instance of a condition.
     * @memberof! ch.Condition.prototype
     * @function
     * @returns {condition}
     * @example
     * // Disabling an instance of Condition.
     * condition.disable();
     * @example
     * // Disabling a condition.
     * condition.disable();
     */
    Condition.prototype.disable = function () {
        this._enabled = false;

        return this;
    };

    /**
     * Enables an instance of condition.
     * @memberof! ch.Condition.prototype
     * @function
     * @param {(String | Number)} value A given value.
     * @param {condition} validation A given validation to execute.
     * @returns {Boolean} Returns a boolean indicating whether the condition fails or not.
     * @example
     * // Testing a condition.
     * condition.test('foobar', validationA);
     */
    Condition.prototype.test = function (value, validation) {

        if (!this._enabled) {
            return true;
        }

        return this.fn.call(validation, value, this.num);
    };

    ch.Condition = Condition;

}(this.ch.$, this.ch));
(function (window, ch) {
    'use strict';

    /**
     * Validation is an engine to validate HTML forms elements.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Condition
     * @requires ch.Form
     * @requires ch.Bubble
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {Array} [options.conditions] A collection of conditions to validate.
     * @param {String} [options.conditions.name] The name of the condition.
     * @param {String} [options.conditions.message] The given error message to the condition.
     * @param {String} [options.conditions.fn] The method to validate a given condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 10.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new Validation.
     * var validation = new ch.Validation($el, [options]);
     * @example
     * // Create a new Validation with jQuery or Zepto.
     * var validation = $(selector).validation([options]);
     * @example
     * // Create a validation with with custom options.
     * var validation = $(selector).validation({
     *     'conditions': [
     *         {
     *             'name': 'required',
     *             'message': 'Please, fill in this information.'
     *         },
     *         {
     *             'name': 'custom-email',
     *             'fn': function (value) { return value === "customail@custom.com"; },
     *             'message': 'Use a valid e-mail such as name@custom.com.'
     *         }
     *     ],
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     */
    function Validation($el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Validation is created.
             * @memberof! ch.Validation.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Validation#ready
         * @example
         * // Subscribe to "ready" event.
         * validation.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Validation, ch.Component),
        // Creates methods enable and disable into the prototype.
        methods = ['enable', 'disable'],
        len = methods.length;

    function createMethods(method) {
        Validation.prototype[method] = function (condition) {
            var key;

            // Specific condition
            if (condition !== undefined && this.conditions[condition] !== undefined) {

                this.conditions[condition][method]();

            } else {

                // all conditions
                for (key in this.conditions) {
                    if (this.conditions[key] !== undefined) {
                        this.conditions[key][method]();
                    }
                }

                parent[method].call(this);
            }

            return this;
        };
    }

    /**
     * The name of the component.
     * @memberof! ch.Validation.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var validation = $(selector).data('validation');
     */
    Validation.prototype.name = 'validation';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Validation.prototype
     * @function
     */
    Validation.prototype.constructor = Validation;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Validation.prototype._defaults = {
        'offsetX': 10
    };

    /**
     * Initialize a new instance of Validation and merge custom options with defaults options.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    Validation.prototype._init = function ($el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        parent._init.call(this, $el, options);

        /**
         * The validation trigger.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$trigger = this._$el;

        /**
         * The validation container.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._configureContainer();

        /**
         * The collection of conditions.
         * @type {Object}
         */
        this.conditions = {};

        // Merge conditions
        this._mergeConditions(options.conditions);

        /**
         * Flag that let you know if there's a validation going on.
         * @type {Boolean}
         * @private
         */
        this._shown = false;

        /**
         * The current error. If the validations has not error is "null".
         * @type {Object}
         */
        this.error = null;

        this
            .on('exist', function (data) {
                this._mergeConditions(data.conditions);
            })
            // Clean the validation if is shown;
            .on('disable', this.clear);

        /**
         * Reference to a Form instance. If there isn't any, the Validation instance will create one.
         * @type {form}
         */
        this.form = (that.$trigger.parents('form').data('form') || that.$trigger.parents('form').form());

        this.form.validations.push(this);

        /**
         * Set a validation event to add listeners.
         * @private
         */
        this._validationEvent = (this.$trigger.hasClass('ch-form-options') || this._el.tagName === 'SELECT' || (this._el.tagName === 'INPUT' && this._el.type === 'range')) ? 'change' : 'blur';

        return this;
    };

    /**
     * Merges the collection of conditions with a given conditions.
     * @function
     * @private
     */
    Validation.prototype._mergeConditions = function (conditions) {
        var i = 0,
            j = conditions.length;

        for (i; i < j; i += 1) {
            this.conditions[conditions[i].name] = new ch.Condition(conditions[i]);
        }

        return this;
    };

    /**
     * Validates the value of $el.
     * @memberof! ch.Validation.prototype
     * @function
     * @returns {validation}
     */
    Validation.prototype.validate = function () {

        if (this.hasError()) {
            this._error();
        } else {
            this._success();
        }

        return this;
    };

    /**
     * If the validation has got an error executes this function.
     * @private
     */
    Validation.prototype._error = function () {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            previousValue;

        // It must happen only once.
        this.$trigger.on(this._validationEvent + '.validation', function () {

            if (previousValue !== this.value || that._validationEvent === 'change' && that.isShown()) {
                previousValue = this.value;
                that.validate();
            }

            if (that.conditions.required === undefined && this.value === '') {
                that.clear();
            }

        });

        // Lazy Loading pattern
        this._error = function () {

            if (!that._previousError.condition || !that._shown) {
                if (that._el.nodeName === 'INPUT' || that._el.nodeName === 'TEXTAREA') {
                    that.$trigger.addClass('ch-validation-error');
                }

                that._showErrorMessage(that.error.message || 'Error');
            }

            if (that.error.condition !== that._previousError.condition) {
                that._showErrorMessage(that.error.message || that.form._messages[that.error.condition] || 'Error');
            }

            that._shown = true;

            /**
             * It emits an event when a validation hasn't got an error.
             * @event ch.Validation#error
             * @example
             * // Subscribe to "error" event.
             * validation.on('error', function (errors) {
             *     console.log(errors.length);
             * });
             */
            that.emit('error', that.error);

            return that;
        };

        this._error();

        return this;
    };

    /**
     * If the validation hasn't got an error executes this function.
     * @private
     */
    Validation.prototype._success = function () {

        // Status OK (with previous error) this._previousError
        if (this._shown || !this._enabled) {
            // Public status OK
            this._shown = false;
        }

        this.$trigger
            .removeClass('ch-validation-error')
            .removeAttr('aria-label');

        this._hideErrorMessage();

        /**
         * It emits an event when a validation hasn't got an error.
         * @event ch.Validation#success
         * @example
         * // Subscribe to "success" event.
         * validation.on("submit",function () {
         *     // Some code here!
         * });
         */
        this.emit('success');

        return this;
    };

    /**
     * Checks if the validation has got errors but it doesn't show bubbles.
     * @memberof! ch.Validation.prototype
     * @function
     * @returns {Boolean}
     * @example
     * // Checks if a validation has errors and do something.
     * if (validation.hasError()) {
     *     // Some code here!
     * };
     */
    Validation.prototype.hasError = function () {

        // Pre-validation: Don't validate disabled
        if (this.$trigger.attr('disabled') || !this._enabled) {
            return false;
        }

        var condition,
            required = this.conditions.required,
            value = this._el.value;

        // Avoid fields that aren't required when they are empty or de-activated
        if (!required && value === '' && this._shown === false) {
            // Has got an error? Nop
            return false;
        }

        /**
         * Stores the previous error object
         * @private
         */
        this._previousError = ch.util.clone(this.error);

        // for each condition
        for (condition in this.conditions) {

            if (this.conditions[condition] !== undefined && !this.conditions[condition].test(value, this)) {
                // Update the error object
                this.error = {
                    'condition': condition,
                    'message': this.conditions[condition].message
                };

                // Has got an error? Yeah
                return true;
            }

        }

        // Update the error object
        this.error = null;

        // Has got an error? No
        return false;
    };

    /**
     * Clear active error.
     * @memberof! ch.Validation.prototype
     * @function
     * @returns {validation}
     * @example
     * // Clear active error.
     * validation.clear();
     */
    Validation.prototype.clear = function () {

        this.$trigger
            .removeClass('ch-validation-error')
            .removeAttr('aria-label');

        this.error = null;

        this._hideErrorMessage();

        this._shown = false;

        /**
         * It emits an event when a validation is cleaned.
         * @event ch.Validation#clear
         * @example
         * // Subscribe to "clear" event.
         * validation.on('clear', function () {
         *     // Some code here!
         * });
         */
        this.emit('clear');

        return this;
    };

    /**
     * Returns the jQuerySelector or ZeptoSelector to chaining more validations.
     * @memberof! ch.Validation.prototype
     * @function
     * @returns {(jQuerySelector | ZeptoSelector)}
     * @example
     * // Concatenates another validation.
     * validation.and().validation();
     */
    Validation.prototype.and = function () {
        return this.$trigger;
    };

    /**
     * Indicates if the validation is shown.
     * @memberof! ch.Validation.prototype
     * @function
     * @returns {Boolean}
     * @example
     * // Execute a function if the validation is shown.
     * if (validation.isShown()) {
     *     fn();
     * }
     */
    Validation.prototype.isShown = function () {
        return this._shown;
    };

    /**
     * Sets or gets messages to specifics conditions.
     * @memberof! ch.Validation.prototype
     * @function
     * @returns {(validation | String)}
     * @example
     * // Gets a message from a condition
     * validation.message('required');
     * @example
     * // Sets a new message
     * validation.message('required', 'New message for required validation');
     */
    Validation.prototype.message = function (condition, message) {

        if (condition === undefined) {
            throw new Error('validation.message(condition, message): Please, a condition parameter is required.');
        }

        // Get a new message from a condition
        if (message === undefined) {
            return this.conditions[condition].message;
        }

        // Sets a new message
        this.conditions[condition].message = message;

        if (this.isShown() && this.error.condition === condition) {
            this._showErrorMessage(message);
        }

        return this;
    };

    /**
     * Enables an instance of validation or a specific condition.
     * @memberof! ch.Validation.prototype
     * @name enable
     * @function
     * @param {String} [condition] - A given number of fold to enable.
     * @returns {validation} Returns an instance of Validation.
     * @example
     * // Enabling an instance of Validation.
     * validation.enable();
     * @example
     * // Enabling the "max" condition.
     * validation.enable('max');
     */

    /**
     * Disables an instance of a validation or a specific condition.
     * @memberof! ch.Validation.prototype
     * @name disable
     * @function
     * @param {String} [condition] - A given number of fold to disable.
     * @returns {validation} Returns an instance of Validation.
     * @example
     * // Disabling an instance of Validation.
     * validation.disable();
     * @example
     * // Disabling the "email" condition.
     * validation.disable('email');
     */
    while (len) {
        createMethods(methods[len -= 1]);
    }

    /**
     * Destroys a Validation instance.
     * @memberof! ch.Validation.prototype
     * @function
     * @example
     * // Destroying an instance of Validation.
     * validation.destroy();
     */
    Validation.prototype.destroy = function () {

        this.$trigger
            .off('.validation')
            .removeAttr('data-side data-align');

        parent.destroy.call(this);

        return;
    };

    // Factorize
    ch.factory(Validation);

}(this, this.ch));
(function ($, ch) {
    'use strict';

    /**
     * Creates a bubble to show the validation message.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    ch.Validation.prototype._configureContainer = function () {

        var that = this;

        /**
         * Is the little sign that popover showing the validation message. It's a Popover component, so you can change it's content, width or height and change its visibility state.
         * @type {Bubble}
         * @see ch.Bubble
         */
        this.bubble = this._container = $.bubble({
            'reference': that._options.reference || (function () {
                var reference,
                    $trigger = that.$trigger,
                    h4;
                // CHECKBOX, RADIO
                // TODO: when old forms be deprecated we must only support ch-form-options class
                if ($trigger.hasClass('ch-form-options')) {
                // Helper reference from will be fired
                // H4
                    if ($trigger.find('h4').length > 0) {
                        h4 = $trigger.find('h4'); // Find h4
                        h4.wrapInner('<span>'); // Wrap content with inline element
                        reference = h4.children(); // Inline element in h4 like helper reference
                    // Legend
                    } else if ($trigger.prev().prop('tagName') === 'LEGEND') {
                        reference = $trigger.prev(); // Legend like helper reference
                    } else {
                        reference = $($trigger.find('label')[0]);
                    }
                // INPUT, SELECT, TEXTAREA
                } else {
                    reference = $trigger;
                }

                return reference;
            }()),
            'align': that._options.align,
            'side': that._options.side,
            'offsetY': that._options.offsetY,
            'offsetX': that._options.offsetX,
            'position': that._options.position
        });

    };

    /**
     * Shows the validation message.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    ch.Validation.prototype._showErrorMessage = function (message) {
        this.bubble.show(message);
        this.$trigger.attr('aria-label', 'ch-' + this.bubble.name + '-' + this.bubble.uid);

        return this;
    };

    /**
     * Hides the validation message.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    ch.Validation.prototype._hideErrorMessage = function () {
        this.bubble.hide();
        this.$trigger.removeAttr('aria-label');

        return this;
    };

    /**
     * Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
     * @memberof! ch.Validation.prototype
     * @function
     * @returns {validation}
     * @example
     * // Change validaton bubble's position.
     * validation.refreshPosition({
     *     offsetY: -10,
     *     side: 'top',
     *     align: 'left'
     * });
     */
    ch.Validation.prototype.refreshPosition = function (options) {

        if (options === undefined) {
            return this.bubble._position;
        }

        this.bubble.refreshPosition(options);

        return this;
    };

}(this.ch.$, this.ch));
(function (ch) {
    'use strict';

    /**
     * Normalizes and creates an options object
     * @private
     * @function
     * @returns {Object}
     */
    function normalizeOptions(message) {
        var options,
            condition = {
                'name': 'string'
            };

        // If the first paramater is an object, it creates a condition and append to options
        if (typeof message === 'object') {

            // Stores the current options
            options = message;

            // Creates condition properties
            condition.message = options.message;

            // Removes the keys that has been stored into the condition
            delete options.message;

        // Creates an option object if receive more than one parameter
        } else {
            options = {};
            condition.message = message;
        }

        // Appends condition object into conditions collection
        options.conditions = [condition];

        return options;
    }

    /**
     * String creates a new instance of Validation to validate a given value as string.
     * @memberof ch
     * @name ch.String
     * @constructor
     * @augments ch.Validation
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.message] The given error message to the condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: "10px".
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: "0px".
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new String Validation.
     * var strValidation = new ch.String($el, [options]);
     * @example
     * // Create a new String validation with jQuery or Zepto.
     * var strValidation = $(selector).string([options]);
     * @example
     * // Create a new String validation with custom options.
     * var strValidation = $(selector).string({
     *     'message': 'This field must be a string.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new String validation using the shorthand way (message as parameter).
     * var strValidation = $(selector).string('This field must be a string.');
     */
    function Str($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.String.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var strValidation = $(selector).data('validation');
     */
    Str.prototype.name = 'string';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.String.prototype
     * @function
     */
    Str.prototype.constructor = Str;

    /**
     * The preset name.
     * @memberof! ch.String.prototype
     * @type {String}
     * @private
     */
    Str.prototype._preset = 'validation';

    ch.factory(Str, normalizeOptions);

}(this.ch));
(function (window, ch) {
    'use strict';

    /**
     * Normalizes and creates an options object
     * @private
     * @function
     * @returns {Object}
     */
    function normalizeOptions(num, message) {
        var options,
            condition = {
                'name': 'maxLength'
            };

        // If the first paramater is an object, it creates a condition and append to options
        if (typeof num === 'object') {

            // Stores the current options
            options = num;

            // Creates condition properties
            condition.num = options.num;
            condition.message = options.message;

            // Removes the keys that has been stored into the condition
            delete options.num;
            delete options.message;

        // Creates an option object if receive more than one parameter
        } else {
            options = {};
            condition.num = num;
            condition.message = message;
        }

        // Appends condition object into conditions collection
        options.conditions = [condition];

        return options;
    }

    /**
     * MaxLength creates a new instance of Validation to validate a maximun amount of characters.
     * @memberof ch
     * @constructor
     * @augments ch.Validation
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {Number} [options.num] A given maximun amount of characters.
     * @param {String} [options.message] The given error message to the condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horitontally. Default: "10px".
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: "0px".
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new MaxLength Validation.
     * var maxLengthValidation = new ch.MaxLength($el, [options]);
     * @example
     * // Create a new MaxLength validation with jQuery or Zepto.
     * var maxLengthValidation = $(selector).maxLength([options]);
     * @example
     * // Create a new MaxLength validation with custom options.
     * var maxLengthValidation = $(selector).maxLength({
     *     'num': 10,
     *     'message': 'No more than 10 characters.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new MaxLength validation using the shorthand way (number and message as parameters).
     * var maxLengthValidation = $(selector).maxLength(10, 'No more than 10 characters.');
     */
    function MaxLength($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.MaxLength.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var maxLengthValidation = $(selector).data('validation');
     */
    MaxLength.prototype.name = 'maxLength';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.MaxLength.prototype
     * @function
     */
    MaxLength.prototype.constructor = ch.MaxLength;

    /**
     * The preset name.
     * @memberof! ch.MaxLength.prototype
     * @type {String}
     * @private
     */
    MaxLength.prototype._preset = 'validation';

    ch.factory(MaxLength, normalizeOptions);

}(this, this.ch));
(function (window, ch) {
    'use strict';

    /**
     * Normalizes and creates an options object
     * @private
     * @function
     * @returns {Object}
     */
    function normalizeOptions(num, message) {
        var options,
            condition = {
                'name': 'minLength'
            };

        // If the first paramater is an object, it creates a condition and append to options
        if (typeof num === 'object') {

            // Stores the current options
            options = num;

            // Creates condition properties
            condition.num = options.num;
            condition.message = options.message;

            // Removes the keys that has been stored into the condition
            delete options.num;
            delete options.message;

        // Creates an option object if receive more than one parameter
        } else {
            options = {};
            condition.num = num;
            condition.message = message;
        }

        // Appends condition object into conditions collection
        options.conditions = [condition];

        return options;
    }

    /**
     * MinLength creates a new instance of Validation to validate a minimun amount of characters.
     * @memberof ch
     * @constructor
     * @augments ch.Validation
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {Number} [options.num] A given minimun amount of characters.
     * @param {String} [options.message] The given error message to the condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: "10px".
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: "0px".
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new MinLength Validation.
     * var minLengthValidation = new ch.MinLength($el, [options]);
     * @example
     * // Create a new MinLength validation with jQuery or Zepto.
     * var minLengthValidation = $(selector).minLength([options]);
     * @example
     * // Create a new MinLength validation with custom options.
     * var minLengthValidation = $(selector).minLength({
     *     'num': 10,
     *     'message': 'At least 10 characters.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new MinLength validation using the shorthand way (number and message as parameters).
     * var minLengthValidation = $(selector).minLength('At least 10 characters.');
     */
    function MinLength($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.MinLength.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var minLengthValidation = $(selector).data('validation');
     */
    MinLength.prototype.name = 'minLength';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.MinLength.prototype
     * @function
     */
    MinLength.prototype.constructor = ch.MinLength;

    /**
     * The preset name.
     * @memberof! ch.MinLength.prototype
     * @type {String}
     * @private
     */
    MinLength.prototype._preset = 'validation';


    ch.factory(MinLength, normalizeOptions);

}(this, this.ch));
(function (window, ch) {
    'use strict';

    function normalizeOptions(message) {
        var options,
            condition = {
                'name': 'email'
            };

        if (typeof message === 'object') {

            options = message;
            condition.message = options.message;
            delete options.message;

        } else {
            options = {};
            condition.message = message;
        }

        options.conditions = [condition];

        return options;
    }

    /**
     * Email creates a new instance of Validation to validate a correct email syntax.
     * @memberof ch
     * @constructor
     * @augments ch.Validation
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.message] The given error message to the condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: "10px".
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: "0px".
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new Email Validation.
     * var emailValidation = new ch.Email($el, [options]);
     * @example
     * // Create a new Email validation with jQuery or Zepto.
     * var emailValidation = $(selector).email([options]);
     * @example
     * // Create a new Email validation with custom options.
     * var emailValidation = $(selector).email({
     *     'message': 'This field must be a valid email.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new Email validation using the shorthand way (message as parameter).
     * var emailValidation = $(selector).email('This field must be a valid email.');
     */
    function Email($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Email.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var emailValidation = $(selector).data('email');
     */
    Email.prototype.name = 'email';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Email.prototype
     * @function
     */
    Email.prototype.constructor = Email;

    /**
     * The preset name.
     * @memberof! ch.Email.prototype
     * @type {String}
     * @private
     */
    Email.prototype._preset = 'validation';

    ch.factory(Email, normalizeOptions);

}(this, this.ch));
(function (ch) {
    'use strict';

    /**
     * Normalizes and creates an options object
     * @private
     * @function
     * @returns {Object}
     */
    function normalizeOptions(message) {
        var options,
            condition = {
                'name': 'url'
            };

        // If the first paramater is an object, it creates a condition and append to options
        if (typeof message === 'object') {

            // Stores the current options
            options = message;

            // Creates condition properties
            condition.message = options.message;

            // Removes the keys that has been stored into the condition
            delete options.message;

        // Creates an option object if receive more than one parameter
        } else {
            options = {};
            condition.message = message;
        }

        // Appends condition object into conditions collection
        options.conditions = [condition];

        return options;
    }

    /**
     * URL creates a new instance of Validation to validate a correct URL syntax.
     * @memberof ch
     * @constructor
     * @augments ch.Validation
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.message] The given error message to the condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: "10px".
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: "0px".
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new URL Validation.
     * var urlValidation = new ch.Url($el, [options]);
     * @example
     * // Create a new URL validation with jQuery or Zepto.
     * var urlValidation = $(selector).url([options]);
     * @example
     * // Create a new URL validation with custom options.
     * var urlValidation = $(selector).url({
     *     'message': 'This field must be a valid URL.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new URL validation using the shorthand way (message as parameter).
     * var urlValidation = $(selector).url('This field must be a valid URL.');
     */
    function URL($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.URL.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var urlValidation = $(selector).data('validation');
     */
    URL.prototype.name = 'url';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Url.prototype
     * @function
     */
    URL.prototype.constructor = URL;

    /**
     * The preset name.
     * @memberof! ch.URL.prototype
     * @type {String}
     * @private
     */
    URL.prototype._preset = 'validation';

    ch.factory(URL, normalizeOptions);

}(this.ch));
(function (ch) {
    'use strict';

    /**
     * Normalizes and creates an options object
     * @private
     * @function
     * @returns {Object}
     */
    function normalizeOptions(message) {
        var options,
            condition = {
                'name': 'number'
            };

        // If the first paramater is an object, it creates a condition and append to options
        if (typeof message === 'object') {

            // Stores the current options
            options = message;

            // Creates condition properties
            condition.message = options.message;

            // Removes the keys that has been stored into the condition
            delete options.message;

        // Creates an option object if receive more than one parameter
        } else {
            options = {};
            condition.message = message;
        }

        // Appends condition object into conditions collection
        options.conditions = [condition];

        return options;
    }

    /**
     * Number creates a new instance of Validation to validate a given value as number.
     * @memberof ch
     * @name ch.Number
     * @constructor
     * @augments ch.Validation
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.message] The given error message to the condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horitontally. Default: "10px".
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: "0px".
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new Number Validation.
     * var numValidation = new ch.Number($el, [options]);
     * @example
     * // Create a new Number validation with jQuery or Zepto.
     * var numValidation = $(selector).number([options]);
     * @example
     * // Create a new Number validation with custom options.
     * var numValidation = $(selector).number({
     *     'message': 'This field must be a number.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new Number validation using the shorthand way (message as parameter).
     * var numValidation = $(selector).number('This field must be a number.');
     */
    function Num($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Number.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var numValidation = $(selector).data('validation');
     */
    Num.prototype.name = 'number';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Number.prototype
     * @function
     */
    Num.prototype.constructor = Num;

    /**
     * The preset name.
     * @memberof! ch.Num.prototype
     * @type {String}
     * @private
     */
    Num.prototype._preset = 'validation';

    ch.factory(Num, normalizeOptions);

}(this.ch));
(function (window, ch) {
    'use strict';

    /**
     * Normalizes and creates an options object
     * @private
     * @function
     * @returns {Object}
     */
    function normalizeOptions(num, message) {
        var options,
            condition = {
                'name': 'min'
            };

        // If the first paramater is an object, it creates a condition and append to options
        if (typeof num === 'object') {

            // Stores the current options
            options = num;

            // Creates condition properties
            condition.num = options.num;
            condition.message = options.message;

            // Removes the keys that has been stored into the condition
            delete options.num;
            delete options.message;

        // Creates an option object if receive more than one parameter
        } else {
            options = {};
            condition.num = num;
            condition.message = message;
        }

        // Appends condition object into conditions collection
        options.conditions = [condition];

        return options;
    }

    /**
     * Min creates a new instance of Validation to validate a number with a minimun value.
     * @memberof ch
     * @constructor
     * @augments ch.Validation
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {Number} [options.num] A given minimun value.
     * @param {String} [options.message] The given error message to the condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: "10px".
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: "0px".
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new Min Validation.
     * var minValidation = new ch.Min($el, [options]);
     * @example
     * // Create a new Min validation with jQuery or Zepto.
     * var minValidation = $(selector).min([options]);
     * @example
     * // Create a new Min validation with custom options.
     * var minValidation = $(selector).min({
     *     'num': 10,
     *     'message': 'Write a number bigger than 10.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new Min validation using the shorthand way (number and message as parameters).
     * var minValidation = $(selector).min(10, 'Write a number bigger than 10.');
     */
    function Min($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Min.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var minValidation = $(selector).data('validation');
     */
    Min.prototype.name = 'min';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Min.prototype
     * @function
     */
    Min.prototype.constructor = Min;

    /**
     * The preset name.
     * @memberof! ch.Min.prototype
     * @type {String}
     * @private
     */
    Min.prototype._preset = 'validation';

    ch.factory(Min, normalizeOptions);

}(this, this.ch));
(function (window, ch) {
    'use strict';

    /**
     * Normalizes and creates an options object
     * @private
     * @function
     * @returns {Object}
     */
    function normalizeOptions(num, message) {
        var options,
            condition = {
                'name': 'max'
            };

        // If the first paramater is an object, it creates a condition and append to options
        if (typeof num === 'object') {

            // Stores the current options
            options = num;

            // Creates condition properties
            condition.num = options.num;
            condition.message = options.message;

            // Removes the keys that has been stored into the condition
            delete options.num;
            delete options.message;

        // Creates an option object if receive more than one parameter
        } else {
            options = {};
            condition.num = num;
            condition.message = message;
        }

        // Appends condition object into conditions collection
        options.conditions = [condition];

        return options;
    }

    /**
     * Max creates a new instance of Validation to validate a number with a maximun value.
     * @memberof ch
     * @constructor
     * @augments ch.Validation
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {Number} [options.num] A given maximun value.
     * @param {String} [options.message] The given error message to the condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: "10px".
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: "0px".
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new Max Validation.
     * var maxValidation = new ch.Max($el, [options]);
     * @example
     * // Create a new Max validation with jQuery or Zepto.
     * var maxValidation = $(selector).max([options]);
     * @example
     * // Create a new Max validation with custom options.
     * var maxValidation = $(selector).max({
     *     'num': 10,
     *     'message': 'Write a number smaller than 10.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new Max validation using the shorthand way (number and message as parameters).
     * var maxValidation = $(selector).max(10, 'Write a number smaller than 10.');
     */
    function Max($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Max.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var maxValidation = $(selector).data('validation');
     */
    Max.prototype.name = 'max';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Max.prototype
     * @function
     */
    Max.prototype.constructor = Max;

    /**
     * The preset name.
     * @memberof! ch.Max.prototype
     * @type {String}
     * @private
     */
    Max.prototype._preset = 'validation';

    ch.factory(Max, normalizeOptions);

}(this, this.ch));
(function (window, ch) {
    'use strict';

    /**
     * Normalizes and creates an options object
     * @private
     * @function
     * @returns {Object}
     */
    function normalizeOptions(name, fn, message) {
        var options,
            condition = {};

        // If the first paramater is an object, it creates a condition and append to options
        if (typeof name === 'object') {

            // Stores the current options
            options = name;

            // Creates condition properties
            condition.name = options.name;
            condition.fn = options.fn;
            condition.message = options.message;

            // Removes the keys that has been stored into the condition
            delete options.name;
            delete options.fn;
            delete options.message;

        // Creates an option object if receive more than one parameter
        } else {
            options = {};
            condition.name = name;
            condition.fn = fn;
            condition.message = message;
        }

        // Appends condition object into conditions collection
        options.conditions = [condition];

        return options;
    }

    /**
     * Custom creates a new instance of Validation to validate a custom condition.
     * @memberof ch
     * @constructor
     * @augments ch.Validation
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.name] The name of the custom condition.
     * @param {String} [options.fn] The method to validate the custom condition.
     * @param {String} [options.message] The given error message to the condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: "10px".
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: "0px".
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new Custom Validation.
     * var customValidation = new ch.Custom($el, [options]);
     * @example
     * // Create a new Custom validation with jQuery or Zepto.
     * var customValidation = $(selector).custom([options]);
     * @example
     * // Create a new Custom validation with custom options.
     * var customValidation = $(selector).custom({
     *     'name': 'myCustom',
     *     'fn': function (value) {
     *         return (value % 2 == 0) ? true : false;
     *     },
     *     'message': 'Enter an even number.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new Custom validation using the shorthand way (name, fn and message as parameters).
     * var customValidation = $(selector).custom('myCustom', function (value) {
     *     return (value % 2 == 0) ? true : false;
     * }, 'Enter an even number.');
     */
    function Custom($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Custom.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var custom = $(selector).data('custom');
     */
    Custom.prototype.name = 'custom';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Custom.prototype
     * @function
     */
    Custom.prototype.constructor = Custom;

    /**
     * The preset name.
     * @memberof! ch.Custom.prototype
     * @type {String}
     * @private
     */
    Custom.prototype._preset = 'validation';

    ch.factory(Custom, normalizeOptions);

}(this, this.ch));
(function (window, ch) {
    'use strict';

    function normalizeOptions(message) {
        var options,
            condition = {
                'name': 'required'
            };

        if (typeof message === 'object') {

            options = message;
            condition.message = options.message;
            delete options.message;

        } else {
            options = {};
            condition.message = message;
        }

        options.conditions = [condition];

        return options;
    }

    /**
     * Required creates a new instance of Validation to validate required values.
     * @memberof ch
     * @constructor
     * @augments ch.Validation
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.message] The given error message to the condition.
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: "10px".
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: "0px".
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new Required Validation.
     * var reqValidation = new ch.Required($el, [options]);
     * @example
     * // Create a new Required validation with jQuery or Zepto.
     * var reqValidation = $(selector).required([options]);
     * @example
     * // Create a new Required validation with custom options.
     * var reqValidation = $(selector).required({
     *     'message': 'This field is required.',
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     * @example
     * // Create a new Required validation using the shorthand way (message as parameter).
     * var reqValidation = $(selector).required('This field is required.');
     */
    function Required($el, options) {
        return new ch.Validation($el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Required.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var reqValidation = $(selector).data('validation');
     */
    Required.prototype.name = 'required';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Required.prototype
     * @function
     */
    Required.prototype.constructor = Required;

    /**
     * The preset name.
     * @memberof! ch.Required.prototype
     * @type {String}
     * @private
     */
    Required.prototype._preset = 'validation';

    ch.factory(Required, normalizeOptions);

}(this, this.ch));
(function (window, $, ch) {
    'use strict';

    function normalizeOptions(options) {
        if (typeof options === 'string' || ch.util.is$(options)) {
            options = {
                'content': options
            };
        }
        return options;
    }

    /**
     * Expandable lets you show or hide content. Expandable needs a pair: a title and a container related to title.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @mixes ch.Collapsible
     * @mixes ch.Content
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Expandable.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "none".
     * @param {Boolean} [options.toggle] Customize toggle behavior. Default: true.
     * @param {(jQuerySelector | ZeptoSelector)} [options.container] The container where the expanbdale puts its content. Default: the next sibling of $el.
     * @param {(jQuerySelector | ZeptoSelector | String)} [options.content] The content to be shown into the expandable container.
     * @returns {expandable} Returns a new instance of Expandable.
     * @example
     * // Create a new Expandable.
     * var expandable = new ch.Expandable($el, [options]);
     * @example
     * // Create a new Expandable with jQuery or Zepto.
     * var expandable = $(selector).expandable([options]);
     * @example
     * // Create a new Expandable with custom options.
     * var expandable = $(selector).expandable({
     *     'container': $(selector),
     *     'toggle': false,
     *     'fx': 'slideDown',
     *     'content': 'http://ui.ml.com:3040/ajax'
     * });
     * @example
     * // Create a new Expandable using the shorthand way (content as parameter).
     * var expandable = $(selector).expandable('http://ui.ml.com:3040/ajax');
     */
    function Expandable($el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Expandable is created.
             * @memberof! ch.Expandable.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Expandable#ready
         * @example
         * // Subscribe to "ready" event.
         * expandable.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var $document = $(window.document),
        parent = ch.util.inherits(Expandable, ch.Component);

    /**
     * The name of the component.
     * @memberof! ch.Expandable.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var expandable = $(selector).data('expandable');
     */
    Expandable.prototype.name = 'expandable';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Expandable.prototype
     * @function
     */
    Expandable.prototype.constructor = Expandable;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Expandable.prototype._defaults = {
        '_classNameTrigger': 'ch-expandable-trigger ch-expandable-ico',
        '_classNameContainer': 'ch-expandable-container ch-hide',
        'fx': false,
        'toggle': true
    };

    /**
     * Initialize a new instance of Expandable and merge custom options with defaults options.
     * @memberof! ch.Expandable.prototype
     * @function
     * @private
     * @returns {expandable}
     */
    Expandable.prototype._init = function ($el, options) {
        // Call to its parent init method
        parent._init.call(this, $el, options);

        // Requires abilities
        this.require('Collapsible', 'Content');

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * The expandable trigger.
         * @type {(jQuerySelector | ZeptoSelector)}
         * @example
         * // Gets the expandable trigger.
         * expandable.$trigger;
         */
        this.$trigger = this._$el
            .addClass(this._options._classNameTrigger)
            .on(ch.onpointertap + '.' + this.name, function (event) {

                if (ch.pointerCanceled) {
                    return;
                }

                ch.util.prevent(event);

                if (that._options.toggle) {
                    that._toggle();
                } else {
                    that.show();
                }
            });

        /**
         * The expandable container.
         * @type {(jQuerySelector | ZeptoSelector)}
         * @example
         * // Gets the expandable container.
         * expandable.$container;
         */
        this.$container = this._$content = (this._options.container || this._$el.next())
            .addClass(this._options._classNameContainer)
            .attr('aria-expanded', 'false');

        /**
         * Default behavior
         */
        if (this.$container.prop('id') === '') {
            this.$container.prop('id', 'ch-expandable-' + this.uid);
        }

        this.$trigger.attr('aria-controls', this.$container.prop('id'));

        this
            .on('show', function () {
                $document.trigger(ch.onlayoutchange);
            })
            .on('hide', function () {
                $document.trigger(ch.onlayoutchange);
            });

        ch.util.avoidTextSelection(this.$trigger);

        return this;
    };

    /**
     * Shows expandable's content.
     * @memberof! ch.Expandable.prototype
     * @function
     * @param {(String | jQuerySelector | ZeptoSelector)} [content] The content that will be used by expandable.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {expandable}
     * @example
     * // Shows a basic expandable.
     * component.show();
     * @example
     * // Shows an expandable with new content.
     * component.show('Some new content here!');
     * @example
     * // Shows an expandable with a new content that will be loaded by ajax and some custom options.
     * component.show('http://chico-ui.com.ar/ajax', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Expandable.prototype.show = function (content, options) {

        if (!this._enabled) {
            return this;
        }

        this._show();

        // Update ARIA
        this.$container.attr('aria-expanded', 'true');

        // Set new content
        if (content !== undefined) {
            this.content(content, options);
        }

        return this;
    };

    /**
     * Hides component's container.
     * @memberof! ch.Expandable.prototype
     * @function
     * @returns {expandable}
     * @example
     * // Close an expandable.
     * expandable.hide();
     */
    Expandable.prototype.hide = function () {

        if (!this._enabled) {
            return this;
        }

        this._hide();

        this.$container.attr('aria-expanded', 'false');

        return this;
    };


    /**
     * Returns a Boolean specifying if the component's core behavior is shown. That means it will return 'true' if the component is on, and it will return false otherwise.
     * @memberof! ch.Expandable.prototype
     * @function
     * @returns {Boolean}
     * @example
     * // Execute a function if the component is shown.
     * if (expandable.isShown()) {
     *     fn();
     * }
     */
    Expandable.prototype.isShown = function () {
        return this._shown;
    };

    /**
     * Destroys an Expandable instance.
     * @memberof! ch.Expandable.prototype
     * @function
     * @example
     * // Destroy an expandable
     * expandable.destroy();
     * // Empty the expandable reference
     * expandable = undefined;
     */
    Expandable.prototype.destroy = function () {

        this.$trigger
            .off('.expandable')
            .removeClass('ch-expandable-trigger ch-expandable-ico ch-user-no-select')
            .removeAttr('aria-controls');

        this.$container
            .removeClass('ch-expandable-container ch-hide')
            .removeAttr('aria-expanded aria-hidden');

        $document.trigger(ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    // Factorize
    ch.factory(Expandable, normalizeOptions);

}(this, this.ch.$, this.ch));
(function (window, $, ch) {
    'use strict';

    /**
     * Menu lets you organize the links by categories.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Expandable
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Menu.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.fx] Enable or disable UI effects. You should use: "slideDown", "fadeIn" or "none". Default: "slideDown".
     * @returns {menu} Returns a new instance of Menu.
     * @example
     * // Create a new Menu.
     * var menu = new ch.Menu($el, [options]);
     * @example
     * // Create a new Menu with jQuery or Zepto.
     * var menu = $(selector).menu();
     * @example
     * // Create a new Menu with custom options.
     * var menu = $(selector).menu({
     *     'fx': 'none'
     * });
     */
    function Menu($el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        that._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Menu is created.
             * @memberof! ch.Menu.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Menu#ready
         * @example
         * // Subscribe to "ready" event.
         * menu.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Menu, ch.Component),

        // Creates methods enable and disable into the prototype.
        methods = ['enable', 'disable'],
        len = methods.length;

    function createMethods(method) {
        Menu.prototype[method] = function (child) {
            var i,
                fold = this.folds[child - 1];

            // Enables or disables a specific expandable fold
            if (fold && fold.name === 'expandable') {

                fold[method]();

            // Enables or disables Expandable folds
            } else {

                i = this.folds.length;

                while (i) {

                    fold = this.folds[i -= 1];

                    if (fold.name === 'expandable') {
                        fold[method]();
                    }
                }

                // Executes parent method
                parent[method].call(this);

                // Updates "aria-disabled" attribute
                this._el.setAttribute('aria-disabled', !this._enabled);
            }

            return this;
        };
    }

    /**
     * The name of the component.
     * @memberof! ch.Menu.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var menu = $(selector).data('menu');
     */
    Menu.prototype.name = 'menu';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Menu.prototype
     * @function
     */
    Menu.prototype.constructor = Menu;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Menu.prototype._defaults = {
        'fx': 'slideDown'
    };

    /**
     * Initialize a new instance of Menu and merge custom options with defaults options.
     * @memberof! ch.Menu.prototype
     * @function
     * @private
     * @returns {menu}
     */
    Menu.prototype._init = function ($el, options) {
        // Call to its parent init method
        parent._init.call(this, $el, options);

        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._el.cloneNode(true);

        /**
         * The menu container.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$container = this._$el
            .attr('role', 'navigation')
            .addClass('ch-menu ' + (this._options._className || '') + ' ' + (this._options.addClass || ''));

        /**
         * A collection of folds.
         * @type {Array}
         */
        this.folds = [];

        // Inits an expandable component on each list inside main HTML code snippet
        this._createExpandables();

        return this;
    };

    /**
     * Inits an Expandable component on each list inside main HTML code snippet.
     * @function
     * @private
     */
    Menu.prototype._createExpandables = function () {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            $li,
            $child;

        function createExpandable(i, li) {
            // List element
            $li = $(li).addClass('ch-menu-fold');

            // Children of list elements
            $child = $li.children(':first-child');

            // Anchor inside list
            if ($child[0].tagName === 'A') {
                // Add attr role to match wai-aria
                $li.attr('role', 'presentation');
                //
                $child.addClass('ch-fold-trigger');
                // Add anchor to that.fold
                that.folds.push($child);

            } else {
                // List inside list, inits an Expandable
                var expandable = $child.expandable({
                    // Show/hide on IE8- instead slideUp/slideDown
                    'fx': that._options.fx
                });

                expandable
                    .on('show', function () {
                        /**
                         * Event emitted when the menu shows a fold.
                         * @event ch.Menu#show
                         * @example
                         * // Subscribe to "show" event.
                         * menu.on('show', function (shown) {
                         *     // Some code here!
                         * });
                         */
                        that.emit('show', i + 1);
                    })
                    .on('hide', function () {
                        /**
                         * Event emitted when the menu hides a fold.
                         * @event ch.Menu#hide
                         * @example
                         * // Subscribe to "hide" event.
                         * menu.on('hide', function () {
                         *     // Some code here!
                         * });
                         */
                        that.emit('hide');
                    });

                $child.next()
                    .attr('role', 'menu')
                    .children()
                        .attr('role', 'presentation')
                        .children()
                            .attr('role', 'menuitem');

                // Add expandable to that.fold
                that.folds.push(expandable);
            }
        }

        $.each(this.$container.children(), createExpandable);

        return this;
    };

    /**
     * Shows a specific fold.
     * @memberof! ch.Menu.prototype
     * @function
     * @param {Number} child - A given number of fold.
     * @returns {menu}
     * @example
     * // Shows the second fold.
     * menu.show(2);
     */
    Menu.prototype.show = function (child) {

        this.folds[child - 1].show();

        return this;
    };

    /**
     * Hides a specific fold.
     * @memberof! ch.Menu.prototype
     * @function
     * @param {Number} child - A given number of fold.
     * @returns {menu}
     * @example
     * // Hides the second fold.
     * menu.hide(2);
     */
    Menu.prototype.hide = function (child) {

        this.folds[child - 1].hide();

        return this;
    };

    /**
     * Allows to manage the menu content.
     * @param {Number} fold A given fold to change its content.
     * @param {(String | jQuerySelector | ZeptoSelector)} content The content that will be used by a fold.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @example
     * // Updates the content of the second fold with some string.
     * menu.content(2, 'http://ajax.com', {'cache': false});
     */
    Menu.prototype.content = function (fold, content, options) {
        if (fold === undefined || typeof fold !== 'number') {
            throw new window.Error('Menu.content(fold, content, options): Expected number of fold.');
        }

        if (content === undefined) {
            return this.folds[fold - 1].content();
        }

        this.folds[fold - 1].content(content, options);

        return this;
    };

    while (len) {
        createMethods(methods[len -= 1]);
    }

    /**
     * Destroys a Menu instance.
     * @memberof! ch.Menu.prototype
     * @function
     * @example
     * // Destroy a menu
     * menu.destroy();
     * // Empty the menu reference
     * menu = undefined;
     */
    Menu.prototype.destroy = function () {

        $.each(this.folds, function (i, e) {
            if (e.destroy !== undefined) {
                e.destroy();
            }
        });

        this._el.parentNode.replaceChild(this._snippet, this._el);

        $(window.document).trigger(ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    ch.factory(Menu);

}(this, this.ch.$, this.ch));

(function (window, $, ch) {
    'use strict';

    /**
     * Popover is the basic unit of a dialog window.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @mixes ch.Collapsible
     * @mixes ch.Content
     * @requires ch.Positioner
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Popover.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointertap".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "button".
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {(jQuerySelector | ZeptoSelector | HTMLElement | String)} [options.content] The content to be shown into the Popover container.
     * @returns {popover} Returns a new instance of Popover.
     * @example
     * // Create a new Popover.
     * var popover = new ch.Popover($el, [options]);
     * @example
     * // Create a new Popover with jQuery or Zepto.
     * var popover = $(selector).popover([options]);
     * @example
     * // Create a new Popover with disabled effects.
     * var popover = $(selector).popover({
     *     'fx': 'none'
     * });
     * @example
     * // Create a new Popover using the shorthand way (content as parameter).
     * var popover = $(selector).popover('http://ui.ml.com:3040/ajax');
     */
    function Popover($el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Popover is created.
             * @memberof! ch.Popover.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Popover#ready
         * @example
         * // Subscribe to "ready" event.
         * popover.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    var $document = $(window.document),
        $body = $('body'),
        // Inheritance
        parent = ch.util.inherits(Popover, ch.Component),
        shownbyEvent = {
            'pointertap': ch.onpointertap,
            'pointerenter': ch.onpointerenter
        };

    /**
     * The name of the component.
     * @memberof! ch.Popover.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var popover = $(selector).data('popover');
     */
    Popover.prototype.name = 'popover';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Popover.prototype
     * @function
     */
    Popover.prototype.constructor = Popover;

    /**
     * Configuration by default.
     * @memberof! ch.Popover.prototype
     * @type {Object}
     * @private
     */
    Popover.prototype._defaults = {
        '_ariaRole': 'dialog',
        '_className': '',
        '_hideDelay': 400,
        'addClass': '',
        'fx': 'fadeIn',
        'width': 'auto',
        'height': 'auto',
        'shownby': 'pointertap',
        'hiddenby': 'button',
        'waiting': '<div class="ch-loading ch-loading-centered"></div>',
        'position': 'absolute'
    };

    /**
     * Initialize a new instance of Popover and merge custom options with defaults options.
     * @memberof! ch.Popover.prototype
     * @function
     * @private
     * @returns {popover}
     */
    Popover.prototype._init = function ($el, options) {
        // Call to its parent init method
        parent._init.call(this, $el, options);

        // Require abilities
        this.require('Collapsible', 'Content');

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * The popover container. It's the element that will be shown and hidden.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$container = $([
            '<div',
            ' class="ch-popover ch-hide ' + this._options._className + ' ' + this._options.addClass + '"',
            ' role="' + this._options._ariaRole + '"',
            ' id="ch-' + this.name + '-' + this.uid + '"',
            ' style="z-index:' + (ch.util.zIndex += 1) + ';width:' + this._options.width + ';height:' + this._options.height + '"',
            '>'
        ].join('')).on(ch.onpointertap + '.' + this.name, function (event) {
            event.stopPropagation();
        });

        /**
         * Element where the content will be added.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._$content = $('<div class="ch-popover-content">').appendTo(this.$container);

        // Add functionality to the trigger if it exists
        this._configureTrigger();
        // Configure the way it hides
        this._configureHiding();

        this._positioner = new ch.Positioner({
            'target': this.$container,
            'reference': this._options.reference,
            'side': this._options.side,
            'align': this._options.align,
            'offsetX': this._options.offsetX,
            'offsetY': this._options.offsetY,
            'position': this._options.position
        });

        /**
         * Handler to execute the positioner refresh() method on layout changes.
         * @private
         * @function
         * @todo Define this function on prototype and use bind(): $document.on(ch.onlayoutchange, this.refreshPosition.bind(this));
         */
        this._refreshPositionListener = function () {
            if (that._shown) {
                that._positioner.refresh(options);
            }

            return that;
        };

        // Refresh position:
        // on layout change
        $document.on(ch.onlayoutchange, this._refreshPositionListener);
        // on resize
        ch.viewport.on(ch.onresize, this._refreshPositionListener);

        this
            .once('_show', this._refreshPositionListener)
            // on content change
            .on('_contentchange', this._refreshPositionListener)
            // Remove from DOM the component container after hide
            .on('hide', function () {
                that.$container.remove(null, true);
            });

        return this;
    };

    /**
     * Adds functionality to the trigger. When a non-trigger popover is initialized, this method isn't executed.
     * @memberof! ch.Popover.prototype
     * @private
     * @function
     */
    Popover.prototype._configureTrigger = function () {

        if (this._el === undefined) {
            return;
        }

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            // It will be triggered on pointertap/pointerenter of the $trigger
            // It can toggle, show, or do nothing (in specific cases)
            showHandler = (function () {
                // Toggle as default
                var fn = that._toggle;
                // When a Popover is shown on pointerenter, it will set a timeout to manage when
                // to close the component. Avoid to toggle and let choise when to close to the timer
                if (that._options.shownby === 'pointerenter' || that._options.hiddenby === 'none' || that._options.hiddenby === 'button') {
                    fn = function () {
                        if (!that._shown) {
                            that.show();
                        }
                    };
                }

                return fn;
            }());

        /**
         * The original and entire element and its state, before initialization.
         * @private
         * @type {HTMLDivElement}
         */
        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._el.cloneNode(true);

        // Use the trigger as the positioning reference
        this._options.reference = this._options.reference || this._$el;

        // Open event when configured as able to shown anyway
        if (this._options.shownby !== 'none') {
            this._$el
                .addClass('ch-shownby-' + this._options.shownby)
                .on(shownbyEvent[this._options.shownby] + '.' + this.name, function (event) {
                    ch.util.prevent(event);
                    showHandler();
                });
        }

        // Get a content if it's not defined
        if (this._options.content === undefined) {
            // Content from anchor href
            // IE defines the href attribute equal to src attribute on images.
            if (this._el.nodeName === 'A' && this._el.href !== '') {
                this._options.content = this._el.href;

            // Content from title or alt
            } else if (this._el.title !== '' || this._el.alt !== '') {
                // Set the configuration parameter
                this._options.content = this._el.title || this._el.alt;
                // Keep the attributes content into the element for possible usage
                this._el.setAttribute('data-title', this._options.content);
                // Avoid to trigger the native tooltip
                this._el.title = this._el.alt = '';
            }
        }

        // Set WAI-ARIA
        this._el.setAttribute('aria-owns', 'ch-' + this.name + '-' + this.uid);
        this._el.setAttribute('aria-haspopup', 'true');

        /**
         * The popover trigger. It's the element that will show and hide the container.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$trigger = this._$el;
    };

    /**
     * Determines how to hide the component.
     * @memberof! ch.Popover.prototype
     * @private
     * @function
     */
    Popover.prototype._configureHiding = function () {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            hiddenby = this._options.hiddenby,
            pointertap = ch.onpointertap + '.' + this.name,
            timeout,
            events = {};

        function hideTimer() {
            timeout = window.setTimeout(function () {
                that.hide();
            }, that._options._hideDelay);
        }

        // Don't hide anytime
        if (hiddenby === 'none') { return; }

        // Hide by leaving the component
        if (hiddenby === 'pointerleave' && this.$trigger !== undefined) {

            events[ch.onpointerenter + '.' + this.name] = function () {
                window.clearTimeout(timeout);
            };

            events[ch.onpointerleave + '.' + this.name] = hideTimer;

            this.$trigger.on(events);
            this.$container.on(events);
        }

        // Hide with the button Close
        if (hiddenby === 'button' || hiddenby === 'all') {
            $('<i class="ch-close" role="button" aria-label="Close"></i>').on(pointertap, function () {
                that.hide();
            }).prependTo(this.$container);
        }

        if ((hiddenby === 'pointers' || hiddenby === 'all') && this._hidingShortcuts !== undefined) {
            this._hidingShortcuts();
        }

    };

    /**
     * Creates an options object from the parameters arriving to the constructor method.
     * @memberof! ch.Popover.prototype
     * @private
     * @function
     */
    Popover.prototype._normalizeOptions = function (options) {
        if (typeof options === 'string' || ch.util.is$(options)) {
            options = {
                'content': options
            };
        }
        return options;
    };

    /**
     * Shows the popover container and appends it to the body.
     * @memberof! ch.Popover.prototype
     * @function
     * @param {(String | jQuerySelector | ZeptoSelector)} [content] The content that will be used by popover.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {popover}
     * @example
     * // Shows a basic popover.
     * popover.show();
     * @example
     * // Shows a popover with new content
     * popover.show('Some new content here!');
     * @example
     * // Shows a popover with a new content that will be loaded by ajax with some custom options
     * popover.show('http://domain.com/ajax/url', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Popover.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled || this._shown) {
            return this;
        }

        // Increase z-index and append to body
        // Do it before set content because when content sets, it triggers the position refresh
        this.$container.css('z-index', (ch.util.zIndex += 1)).appendTo($body);

        // Open the collapsible
        this._show();

        // Request the content
        if (content !== undefined) {
            this.content(content, options);
        }

        return this;
    };

    /**
     * Hides the popover container and deletes it from the body.
     * @memberof! ch.Popover.prototype
     * @function
     * @returns {popover}
     * @example
     * // Close a popover
     * popover.hide();
     */
    Popover.prototype.hide = function () {
        // Don't execute when it's disabled
        if (!this._enabled || !this._shown) {
            return this;
        }

        // Close the collapsible
        this._hide();

        return this;
    };

    /**
     * Returns a Boolean specifying if the container is shown or not.
     * @memberof! ch.Popover.prototype
     * @function
     * @returns {Boolean}
     * @example
     * // Check the popover status
     * popover.isShown();
     * @example
     * // Check the popover status after an user action
     * $(window).on(ch.onpointertap, function () {
     *     if (popover.isShown()) {
     *         alert('Popover: visible');
     *     } else {
     *         alert('Popover: not visible');
     *     }
     * });
     */
    Popover.prototype.isShown = function () {
        return this._shown;
    };

    /**
     * Sets or gets the width of the container.
     * @memberof! ch.Popover.prototype
     * @function
     * @param {String} [data] Set a width for the container.
     * @returns {(Number | popover)}
     * @example
     * // Set a new popover width
     * component.width('300px');
     * @example
     * // Get the current popover width
     * component.width(); // '300px'
     */
    Popover.prototype.width = function (data) {

        if (data === undefined) {
            return this._options.width;
        }

        this.$container.css('width', data);

        this._options.width = data;

        this.refreshPosition();

        return this;
    };

    /**
     * Sets or gets the height of the container.
     * @memberof! ch.Popover.prototype
     * @function
     * @param {String} [data] Set a height for the container.
     * @returns {(Number | popover)}
     * @example
     * // Set a new popover height
     * component.height('300px');
     * @example
     * // Get the current popover height
     * component.height(); // '300px'
     */
    Popover.prototype.height = function (data) {

        if (data === undefined) {
            return this._options.height;
        }

        this.$container.css('height', data);

        this._options.height = data;

        this.refreshPosition();

        return this;
    };

    /**
     * Updates the current position of the container with given options or defaults.
     * @memberof! ch.Popover.prototype
     * @function
     * @params {Object} [options] A configuration object.
     * @returns {popover}
     * @example
     * // Update the current position
     * popover.refreshPosition();
     * @example
     * // Update the current position with a new offsetX and offsetY
     * popover.refreshPosition({
     *     'offestX': 100,
     *     'offestY': 10
     * });
     */
    Popover.prototype.refreshPosition = function (options) {

        if (this._shown) {
            // Refresh its position.
            this._positioner.refresh(options);

        } else {
            // Update its options. It will update position the next time to be shown.
            this._positioner._configure(options);
        }

        return this;
    };

    /**
     * Enables a Popover instance.
     * @memberof! ch.Popover.prototype
     * @function
     * @returns {popover}
     * @example
     * // Enable a popover
     * popover.enable();
     */
    Popover.prototype.enable = function () {

        if (this._el !== undefined) {
            this._el.setAttribute('aria-disabled', false);
        }

        parent.enable.call(this);

        return this;
    };

    /**
     * Disables a Popover instance.
     * @memberof! ch.Popover.prototype
     * @function
     * @returns {popover}
     * @example
     * // Disable a popover
     * popover.disable();
     */
    Popover.prototype.disable = function () {

        if (this._el !== undefined) {
            this._el.setAttribute('aria-disabled', true);
        }

        if (this._shown) {
            this.hide();
        }

        parent.disable.call(this);

        return this;
    };

    /**
     * Destroys a Popover instance.
     * @memberof! ch.Popover.prototype
     * @function
     * @returns {popover}
     * @example
     * // Destroy a popover
     * popover.destroy();
     * // Empty the popover reference
     * popover = undefined;
     */
    Popover.prototype.destroy = function () {

        if (this.$trigger !== undefined) {
            this.$trigger
                .off('.' + this.name)
                .removeClass('ch-' + this.name + '-trigger')
                .removeAttr('data-title aria-owns aria-haspopup data-side data-align role')
                .attr({
                    'alt': this._snippet.alt,
                    'title': this._snippet.title
                });
        }

        $document.off(ch.onlayoutchange, this._refreshPositionListener);

        ch.viewport.off(ch.onresize, this._refreshPositionListener);

        parent.destroy.call(this);

        return;
    };

    ch.factory(Popover, Popover.prototype._normalizeOptions);

}(this, this.ch.$, this.ch));

(function (window, $, ch) {
    'use strict';

    var $document = $(window.document);

    ch.Popover.prototype._hidingShortcuts = function () {

        var that = this,
            pointertap = ch.onpointertap + '.' + this.name;

        function hide(event) {
            // event.button === 0: Fix issue #933 Right click closes it on Firefox.
            if (event.target !== that._el && event.target !== that.$container[0] && event.button === 0) {
                that.hide();
            }
        }

        ch.shortcuts.add(ch.onkeyesc, this.uid, function () {
            that.hide();
        });

        this
            .on('show', function () {
                ch.shortcuts.on(that.uid);
                $document.on(pointertap, hide);
            })
            .on('hide', function () {
                ch.shortcuts.off(that.uid);
                $document.off(pointertap, hide);
            })
            .once('destroy', function () {
                ch.shortcuts.remove(that.uid, ch.onkeyesc);
            });
    };

}(this, this.ch.$, this.ch));
(function (window, $, ch) {
    'use strict';

    /**
     * Layer is a dialog window that can be shown one at a time.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Layer.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointerenter".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointerleave".
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "left".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 10.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {(jQuerySelector | ZeptoSelector | HTMLElement | String)} [options.content] The content to be shown into the Layer container.
     * @returns {layer} Returns a new instance of Layer.
     * @example
     * // Create a new Layer.
     * var layer = new ch.Layer($el, [options]);
     * @example
     * // Create a new Layer with jQuery or Zepto.
     * var layer = $(selector).layer([options]);
     * @example
     * // Create a new Layer with disabled effects.
     * var layer = $(selector).layer({
     *     'fx': 'none'
     * });
     * @example
     * // Create a new Layer using the shorthand way (content as parameter).
     * var layer = $(selector).layer('http://ui.ml.com:3040/ajax');
     */
    function Layer($el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Layer is created.
             * @memberof! ch.Layer.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Layer#ready
         * @example
         * // Subscribe to "ready" event.
         * layer.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Reference to the last component open. Allows to close and to deny to
    // have 2 components open at the same time
    var lastShown,
        // Inheritance
        parent = ch.util.inherits(Layer, ch.Popover);

    /**
     * The name of the component.
     * @memberof! ch.Layer.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var layer = $(selector).data('layer');
     */
    Layer.prototype.name = 'layer';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Layer.prototype
     * @function
     */
    Layer.prototype.constructor = Layer;

    /**
     * Configuration by default.
     * @memberof! ch.Layer.prototype
     * @type {Object}
     * @private
     */
    Layer.prototype._defaults = $.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-layer ch-box-lite ch-cone',
        '_ariaRole': 'tooltip',
        'shownby': 'pointerenter',
        'hiddenby': 'pointerleave',
        'side': 'bottom',
        'align': 'left',
        'offsetX': 0,
        'offsetY': 10,
        'waiting': '<div class="ch-loading-small"></div>'
    });

    /**
     * Shows the layer container and hides other layers.
     * @memberof! ch.Layer.prototype
     * @function
     * @param {(String | jQuerySelector | ZeptoSelector)} [content] The content that will be used by layer.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {layer}
     * @example
     * // Shows a basic layer.
     * layer.show();
     * @example
     * // Shows a layer with new content
     * layer.show('Some new content here!');
     * @example
     * // Shows a layer with a new content that will be loaded by ajax with some custom options
     * layer.show('http://domain.com/ajax/url', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Layer.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled || this._shown) {
            return this;
        }

        // Only hide if there was a component opened before
        if (lastShown !== undefined && lastShown.name === this.name && lastShown !== this) {
            lastShown.hide();
        }

        // Only save to future close if this component is closable
        if (this._options.hiddenby !== 'none' && this._options.hiddenby !== 'button') {
            lastShown = this;
        }

        // Execute the original show()
        parent.show.call(this, content, options);

        return this;
    };

    ch.factory(Layer, parent._normalizeOptions);

}(this, this.ch.$, this.ch));

(function ($, ch) {
    'use strict';

    /**
     * Improves the native tooltips.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Tooltip.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointerenter".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointerleave".
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "left".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 10.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '<div class="ch-loading ch-loading-centered"></div>'.
     * @param {(jQuerySelector | ZeptoSelector | HTMLElement | String)} [options.content] The content to be shown into the Tooltip container.
     * @returns {tooltip} Returns a new instance of Tooltip.
     * @example
     * // Create a new Tooltip.
     * var tooltip = new ch.Tooltip($el, [options]);
     * @example
     * // Create a new Tooltip with jQuery or Zepto.
     * var tooltip = $(selector).tooltip([options]);
     * @example
     * // Create a new Tooltip with disabled effects.
     * var tooltip = $(selector).tooltip({
     *     'fx': 'none'
     * });
     * @example
     * // Create a new Tooltip using the shorthand way (content as parameter).
     * var tooltip = $(selector).tooltip('http://ui.ml.com:3040/ajax');
     */
    function Tooltip($el, options) {

        if (options === undefined && $el !== undefined && !ch.util.is$($el)) {
            options = $el;
            $el = undefined;
        }

        options = $.extend(ch.util.clone(this._defaults), options);

        return new ch.Layer($el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Tooltip.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var tooltip = $(selector).data('tooltip');
     */
    Tooltip.prototype.name = 'tooltip';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Tooltip.prototype
     * @function
     */
    Tooltip.prototype.constructor = Tooltip;

    /**
     * Configuration by default.
     * @memberof! ch.Tooltip.prototype
     * @type {Object}
     * @private
     */
    Tooltip.prototype._defaults = $.extend(ch.util.clone(ch.Layer.prototype._defaults), {
        '_className': 'ch-tooltip ch-cone'
    });

    ch.factory(Tooltip, ch.Layer.prototype._normalizeOptions);

}(this.ch.$, this.ch));

(function (window, $, ch) {
    'use strict';

    /**
     * Dialog window with an error skin.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Positioner
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Bubble.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "none".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "none".
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 10.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {(jQuerySelector | ZeptoSelector | HTMLElement | String)} [options.content] The content to be shown into the Bubble container. Default: "Check the information, please."
     * @returns {bubble} Returns a new instance of Bubble.
     * @example
     * // Create a new Bubble.
     * var bubble = new ch.Bubble($el, [options]);
     * @example
     * // Create a new Bubble with jQuery or Zepto.
     * var bubble = $(selector).bubble([options]);
     * @example
     * // Create a new Bubble with disabled effects.
     * var bubble = $(selector).bubble({
     *     'fx': 'none'
     * });
     * @example
     * // Create a new Bubble using the shorthand way (content as parameter).
     * var bubble = $(selector).bubble('http://ui.ml.com:3040/ajax');
     */
    function Bubble($el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Bubble is created.
             * @memberof! ch.Bubble.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Bubble#ready
         * @example
         * // Subscribe to "ready" event.
         * bubble.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Bubble, ch.Popover);

    /**
     * The name of the component.
     * @memberof! ch.Bubble.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var bubble = $(selector).data('bubble');
     */
    Bubble.prototype.name = 'bubble';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Bubble.prototype
     * @function
     */
    Bubble.prototype.constructor = Bubble;

    /**
     * Configuration by default.
     * @memberof! ch.Bubble.prototype
     * @type {Object}
     * @private
     */
    Bubble.prototype._defaults = $.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-bubble ch-box-icon ch-box-error ch-cone',
        '_ariaRole': 'alert',
        'shownby': 'none',
        'hiddenby': 'none',
        'side': 'right',
        'align': 'center',
        'offsetX': 10,
        'content': 'Check the information, please.'
    });

    /**
     * Initialize a new instance of Bubble and merge custom options with defaults options.
     * @memberof! ch.Bubble.prototype
     * @function
     * @private
     * @returns {bubble}
     */
    Bubble.prototype._init = function ($el, options) {
        // Call to its parent init method
        parent._init.call(this, $el, options);

        $('<i class="ch-icon-remove-sign"></i>').prependTo(this.$container);

        return this;
    };

    ch.factory(Bubble, parent._normalizeOptions);

}(this, this.ch.$, this.ch));

(function (window, $, ch) {
    'use strict';

    /**
     * Modal is a dialog window with an underlay.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Modal.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "50%".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointertap".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "all".
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: ch.viewport.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "fixed".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading-large ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {(jQuerySelector | ZeptoSelector | HTMLElement | String)} [options.content] The content to be shown into the Modal container.
     * @returns {modal} Returns a new instance of Modal.
     * @example
     * // Create a new Modal.
     * var modal = new ch.Modal($el, [options]);
     * @example
     * // Create a new Modal with jQuery or Zepto.
     * var modal = $(selector).modal([options]);
     * @example
     * // Create a new Modal with disabled effects.
     * var modal = $(selector).modal({
     *     'fx': 'none'
     * });
     * @example
     * // Create a new Modal using the shorthand way (content as parameter).
     * var modal = $(selector).modal('http://ui.ml.com:3040/ajax');
     */
    function Modal($el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Modal is created.
             * @memberof! ch.Modal.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Modal#ready
         * @example
         * // Subscribe to "ready" event.
         * modal.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    var $body = $('body'),
        $underlay = $('<div class="ch-underlay ch-hide" tabindex="-1">'),
        // Inheritance
        parent = ch.util.inherits(Modal, ch.Popover);

    /**
     * The name of the component.
     * @memberof! ch.Modal.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var modal = $(selector).data('modal');
     */
    Modal.prototype.name = 'modal';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Modal.prototype
     * @function
     */
    Modal.prototype.constructor = Modal;

    /**
     * Configuration by default.
     * @memberof! ch.Modal.prototype
     * @type {Object}
     * @private
     */
    Modal.prototype._defaults = $.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-modal ch-box-lite',
        '_ariaRole': 'dialog',
        'width': '50%',
        'hiddenby': 'all',
        'reference': ch.viewport,
        'waiting': '<div class="ch-loading-large ch-loading-centered"></div>',
        'position': 'fixed'
    });

    /**
     * Shows the Modal underlay.
     * @memberof! ch.Modal.prototype
     * @function
     * @private
     */
    Modal.prototype._showUnderlay = function () {

        $underlay.css('z-index', ch.util.zIndex).appendTo($body);

        if (this._options.fx !== 'none') {
            $underlay.fadeIn(function () {
                $underlay.removeClass('ch-hide');
            });
        } else {
            $underlay.removeClass('ch-hide');
        }
    };

    /**
     * Hides the Modal underlay.
     * @memberof! ch.Modal.prototype
     * @function
     * @private
     */
    Modal.prototype._hideUnderlay = function () {
        if (this._options.fx !== 'none') {
            $underlay.fadeOut('normal', function () { $underlay.remove(null, true); });
        } else {
            $underlay.addClass('ch-hide').remove(null, true);
        }
    };

    /**
     * Shows the modal container and the underlay.
     * @memberof! ch.Modal.prototype
     * @function
     * @param {(String | jQuerySelector | ZeptoSelector)} [content] The content that will be used by modal.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {modal}
     * @example
     * // Shows a basic modal.
     * modal.show();
     * @example
     * // Shows a modal with new content
     * modal.show('Some new content here!');
     * @example
     * // Shows a modal with a new content that will be loaded by ajax with some custom options
     * modal.show('http://domain.com/ajax/url', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Modal.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled || this._shown) {
            return this;
        }

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        // Add to the underlay the ability to hide the component
        if (this._options.hiddenby === 'all' || this._options.hiddenby === 'pointers') {
            // Allow only one click to analize the config every time and to close ONLY THIS modal
            $underlay.one(ch.onpointertap, function () {
                that.hide();
            });
        }

        // Show the underlay
        this._showUnderlay();
        // Execute the original show()
        parent.show.call(this, content, options);

        return this;
    };

    /**
     * Hides the modal container and the underlay.
     * @memberof! ch.Modal.prototype
     * @function
     * @returns {modal}
     * @example
     * // Close a modal
     * modal.hide();
     */
    Modal.prototype.hide = function () {
        if (!this._shown) {
            return this;
        }

        // Delete the underlay listener
        $underlay.off(ch.onpointertap);
        // Hide the underlay element
        this._hideUnderlay();
        // Execute the original hide()
        parent.hide.call(this);

        return this;
    };

    ch.factory(Modal, parent._normalizeOptions);

}(this, this.ch.$, this.ch));

(function ($, ch) {
    'use strict';

    /**
     * Transition lets you give feedback to the users when their have to wait for an action.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Transition.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "50%".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointertap".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "none".
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: ch.viewport.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "fixed".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading-large ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {(jQuerySelector | ZeptoSelector | HTMLElement | String)} [options.content] The content to be shown into the Transition container. Default: "Please wait..."
     * @returns {transition} Returns a new instance of Transition.
     * @example
     * // Create a new Transition.
     * var transition = new ch.Transition($el, [options]);
     * @example
     * // Create a new Transition with jQuery or Zepto.
     * var transition = $(selector).transition([options]);
     * @example
     * // Create a new Transition with disabled effects.
     * var transition = $(selector).transition({
     *     'fx': 'none'
     * });
     * @example
     * // Create a new Transition using the shorthand way (content as parameter).
     * var transition = $(selector).transition('http://ui.ml.com:3040/ajax');
     */
    function Transition($el, options) {

        if (options === undefined && $el !== undefined && !ch.util.is$($el)) {
            options = $el;
            $el = undefined;
        }

        options = $.extend(ch.util.clone(this._defaults), options);

        options.content = $('<div class="ch-loading-large"></div><p>' + options.content + '</p>');

        return new ch.Modal($el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Transition.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var transition = $(selector).data('transition');
     */
    Transition.prototype.name = 'transition';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Transition.prototype
     * @function
     */
    Transition.prototype.constructor = Transition;

    /**
     * Configuration by default.
     * @memberof! ch.Transition.prototype
     * @type {Object}
     * @private
     */
    Transition.prototype._defaults = $.extend(ch.util.clone(ch.Modal.prototype._defaults), {
        '_className': 'ch-transition ch-box-lite',
        '_ariaRole': 'alert',
        'hiddenby': 'none',
        'content': 'Please wait...'
    });

    ch.factory(Transition, ch.Modal.prototype._normalizeOptions);

}(this.ch.$, this.ch));

(function (window, $, ch) {
    'use strict';

    /**
     * Zoom shows a contextual reference to an augmented version of a declared image.
     * @memberof ch
     * @constructor
     * @augments ch.Layer
     * @requires ch.OnImagesLoads
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Zoom.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "none".
     * @param {String} [options.width] Set a width for the container. Default: "300px".
     * @param {String} [options.height] Set a height for the container. Default: "300px".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointerenter".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointerleave".
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 20.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading. Default: 'Loading zoom...'.
     * @param {(jQuerySelector | ZeptoSelector | HTMLElement | String)} [options.content] The content to be shown into the Zoom container.
     * @returns {zoom} Returns a new instance of Zoom.
     * @example
     * // Create a new Zoom.
     * var zoom = new ch.Zoom($el, [options]);
     * @example
     * // Create a new Zoom with jQuery or Zepto.
     * var zoom = $(selector).zoom([options]);
     * @example
     * // Create a new Zoom with a defined width (half of the screen).
     * $(selector).zoom({
     *     'width': (ch.viewport.width / 2) + 'px'
     * });
     */
    function Zoom($el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Zoom is created.
             * @memberof! ch.Zoom.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Zoom#ready
         * @example
         * // Subscribe to "ready" event.
         * zoom.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Zoom, ch.Layer);

    /**
     * The name of the component.
     * @memberof! ch.Zoom.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var zoom = $(selector).data('zoom');
     */
    Zoom.prototype.name = 'zoom';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Zoom.prototype
     * @function
     */
    Zoom.prototype.constructor = Zoom;

    /**
     * Configuration by default.
     * @memberof! ch.Zoom.prototype
     * @type {Object}
     * @private
     */
    Zoom.prototype._defaults = $.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-zoom',
        '_ariaRole': 'tooltip',
        '_hideDelay': 0,
        'fx': 'none',
        'width': '300px',
        'height': '300px',
        'side': 'right',
        'align': 'top',
        'offsetX': 20,
        'offsetY': 0,
        'waiting': 'Loading zoom...'
    });

    /**
     * Initialize a new instance of Zoom and merge custom options with defaults options.
     * @memberof! ch.Zoom.prototype
     * @function
     * @private
     * @returns {zoom}
     */
    Zoom.prototype._init = function ($el, options) {
        // Call to its parent init method
        parent._init.call(this, $el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * Flag to control when zoomed image is loaded.
         * @type {Boolean}
         * @private
         */
        this._loaded = false;

        /**
         * Feedback showed before the zoomed image is load. It's a transition message and its content can be configured through parameter "waiting".
         * @type {(jQuerySelector | ZeptoSelector)}
         * @private
         * @example
         * // Changing the loading feedback.
         * $(selector).zoom({
         *     'waiting': 'My custom message'
         * });
         */
        this._$loading = $('<div class="ch-zoom-loading ch-hide"><div class="ch-loading-large"></div><p>' + this._options.waiting + '</p></div>').appendTo(this.$trigger);

        /**
         * jQuery/Zepto Element (shape) with visual feedback to the relative size of the zoomed area.
         * @type {(jQuerySelector | ZeptoSelector)}
         * @private
         */
        this._$seeker = $('<div class="ch-zoom-seeker ch-hide">').appendTo(this.$trigger);

        /**
         * HTML Element shape with visual feedback to the relative size of the zoomed area.
         * @type {HTMLDivElement}
         * @private
         */
        this._seeker = this._$seeker[0];

        /**
         * The main specified image with original size (not zoomed).
         * @type {(jQuerySelector | ZeptoSelector)}
         * @private
         */
        this._$original = this.$trigger.children().eq(0);

        /**
         * The zoomed image specified as a link href (see the HTML snippet).
         * @type {(jQuerySelector | ZeptoSelector)}
         * @private
         */
        // Use a new Image instead $('<img ...>') to calculate the
        // size before append the image to DOM, in ALL the browsers.
        this._zoomed = new window.Image();

        // Assign event handlers to the original image
        ch.onImagesLoads(this._$original, function () {
            that._originalLoaded();
        });

        // Assign event handlers to the zoomed image
        ch.onImagesLoads($(this._zoomed), function () {
            that._zoomedLoaded();
        });

        // Make the entire Show process if it tried to show before
        this.on('imageload', function () {
            if (!that._$loading.hasClass('ch-hide')) {
                that.show();
            }
        });

        // Assign event handlers to the anchor
        this.$trigger.addClass('ch-zoom-trigger').on({
            // Prevent to redirect to the href
            'click.zoom': function (event) { ch.util.prevent(event); },
            // Bind move calculations
            'mousemove.zoom': function (event) { that._move(event); }
        });

        return this;
    };

    /**
     * Sets the correct size to the wrapper anchor.
     * @memberof! ch.Zoom.prototype
     * @function
     * @private
     */
    Zoom.prototype._originalLoaded = function () {

        var width = this._$original[0].width,
            height = this._$original[0].height,
            offset = ch.util.getOffset(this._el);

        // Set the wrapper anchor size (same as image)
        this.$trigger.css({
            'width': width,
            'height': height
        });

        // Loading position centered into the anchor
        this._$loading.css({
            'left': (width - this._$loading.width()) / 2,
            'top': (height - this._$loading.height()) / 2
        });

        /**
         * Width of the original specified image.
         * @type {Number}
         * @private
         */
        this._originalWidth = width;

        /**
         * Height of the original specified image.
         * @type {Number}
         * @private
         */
        this._originalHeight = height;

        /**
         * Left position of the original specified anchor/image.
         * @type {Number}
         * @private
         */
        this._originalOffsetLeft = offset.left;

        /**
         * Top position of the original specified anchor/image.
         * @type {Number}
         * @private
         */
        this._originalOffsetTop = offset.top;
    };

    /**
     * Loads the Zoom content and sets the Seeker size.
     * @memberof! ch.Zoom.prototype
     * @function
     * @private
     */
    Zoom.prototype._zoomedLoaded = function () {

        /**
         * Relation between the zoomed and the original image width.
         * @type {Number}
         * @private
         */
        this._ratioX = (this._zoomed.width / this._originalWidth);

        /**
         * Relation between the zoomed and the original image height.
         * @type {Number}
         * @private
         */
        this._ratioY = (this._zoomed.height / this._originalHeight);

        /**
         * Width of the Seeker, calculated from ratio.
         * @type {Number}
         * @private
         */
        this._seekerWidth = window.Math.floor(window.parseInt(this._options.width, 10) / this._ratioX);

        /**
         * Height of the Seeker, calculated from ratio.
         * @type {Number}
         * @private
         */
        this._seekerHeight = window.Math.floor(window.parseInt(this._options.height, 10) / this._ratioY);

        /**
         * Half of the width of the Seeker. Used to position it.
         * @type {Number}
         * @private
         */
        this._seekerHalfWidth = window.Math.floor(this._seekerWidth / 2);

        /**
         * Half of the height of the Seeker. Used to position it.
         * @type {Number}
         * @private
         */
        this._seekerHalfHeight = window.Math.floor(this._seekerHeight / 2);

        // Set size of the Seeker
        this._seeker.style.cssText = 'width:' + this._seekerWidth + 'px;height:' + this._seekerHeight + 'px';

        // Use the zoomed image as content for the floated element
        this.content(this._zoomed);

        // Update the flag to allow to zoom
        this._loaded = true;

        /**
         * Event emitted when the zoomed image is downloaded.
         * @event ch.Zoom#imageload
         * @example
         * // Subscribe to "imageload" event.
         * zoom.on('imageload', function () {
         *     alert('Zoomed image ready!');
         * });
         */
        this.emit('imageload');
    };

    /**
     * Calculates movement limits and sets it to Seeker and zoomed image.
     * @memberof! ch.Zoom.prototype
     * @function
     * @private
     * @param {Event} event Used to take the cursor position.
     */
    Zoom.prototype._move = function (event) {
        // Don't execute when it's disabled or it's not loaded
        if (!this._enabled || !this._loaded) {
            return;
        }

        // By defining these variables in here, it avoids to make
        // the substraction twice if it's a free movement
        var seekerLeft = event.pageX - this._seekerHalfWidth,
            seekerTop = event.pageY - this._seekerHalfHeight,
            x,
            y;

        // Left side of seeker LESS THAN left side of image
        if (seekerLeft <= this._originalOffsetLeft) {
            x = 0;
        // Right side of seeker GREATER THAN right side of image
        } else if (event.pageX + this._seekerHalfWidth > this._originalWidth + this._originalOffsetLeft) {
            x = this._originalWidth - this._seekerWidth - 2;
        // Free move
        } else {
            x = seekerLeft - this._originalOffsetLeft;
        }

        // Top side of seeker LESS THAN top side of image
        if (seekerTop <= this._originalOffsetTop) {
            y = 0;
        // Bottom side of seeker GREATER THAN bottom side of image
        } else if (event.pageY + this._seekerHalfHeight > this._originalHeight + this._originalOffsetTop) {
            y = this._originalHeight - this._seekerHeight - 2;
        // Free move
        } else {
            y = seekerTop - this._originalOffsetTop;
        }

        // Move seeker and the zoomed image
        this._seeker.style.left = x + 'px';
        this._seeker.style.top = y + 'px';
        this._zoomed.style.cssText = 'left:' + (-this._ratioX * x) + 'px;top:' + (-this._ratioY * y) + 'px';
    };

    /**
     * Shows the zoom container and the Seeker, or show a loading feedback until the zoomed image loads.
     * @memberof! ch.Zoom.prototype
     * @function
     * @param {(String | jQuerySelector | ZeptoSelector)} [content] The content that will be used by dropdown.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {zoom}
     * @example
     * // Shows a basic zoom.
     * zoom.show();
     * @example
     * // Shows a zoom with new content
     * zoom.show('Some new content here!');
     * @example
     * // Shows a zoom with a new content that will be loaded by ajax with some custom options
     * zoom.show('http://domain.com/ajax/url', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Zoom.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled || this._shown) {
            return this;
        }

        // Show feedback and trigger the image load, if it's not loaded
        if (!this._loaded) {
            this._$loading.removeClass('ch-hide');
            this.loadImage();
            return this;
        }

        // Delete the Loading and show the Seeker
        this._$loading.remove();
        this._$seeker.removeClass('ch-hide');

        // Execute the original show()
        parent.show.call(this, content, options);

        return this;
    };

    /**
     * Hides the zoom container and the Seeker.
     * @memberof! ch.Zoom.prototype
     * @function
     * @returns {zoom}
     * @example
     * // Close a zoom
     * zoom.hide();
     */
    Zoom.prototype.hide = function () {
        if (!this._shown) {
            return this;
        }

        // Avoid unnecessary execution
        if (!this._loaded) {
            this._$loading.addClass('ch-hide');
            return this;
        }

        this._$seeker.addClass('ch-hide');

        parent.hide.call(this);

        return this;
    };

    /**
     * Adds the zoomed image source to the <img> tag to trigger the request.
     * @memberof! ch.Zoom.prototype
     * @function
     * @returns {zoom}
     * @example
     * // Load the zoomed image on demand.
     * component.loadImage();
     */
    Zoom.prototype.loadImage = function () {

        this._zoomed.src = this._el.href;

        return this;
    };

    /**
     * Destroys a Zoom instance.
     * @memberof! ch.Zoom.prototype
     * @function
     * @returns {zoom}
     * @example
     * // Destroy a zoom
     * zoom.destroy();
     * // Empty the zoom reference
     * zoom = undefined;
     */
    Zoom.prototype.destroy = function () {

        this._$seeker.remove();

        parent.destroy.call(this);

        return;
    };

    ch.factory(Zoom, parent._normalizeOptions);

}(this, this.ch.$, this.ch));

(function (window, $, ch) {
    'use strict';

    function normalizeOptions(options) {
        if (typeof options === 'string' || ch.util.isArray(options)) {
            options = {
                'selected': options
            };
        }
        return options;
    }

    /**
     * It lets you move across the months of the year and allow to set dates as selected.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Calendar.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.format] Sets the date format. You must use "DD/MM/YYYY", "MM/DD/YYYY" or "YYYY/MM/DD". Default: "DD/MM/YYYY".
     * @param {String} [options.selected] Sets a date that should be selected by default. Default: The date of today.
     * @param {String} [options.from] Set a minimum selectable date. The format of the given date should be YYYY/MM/DD.
     * @param {String} [options.to] Set a maximum selectable date. The format of the given date should be YYYY/MM/DD.
     * @param {Array} [options.monthsNames] A collection of months names. Default: ["Enero", ... , "Diciembre"].
     * @param {Array} [options.weekdays] A collection of weekdays. Default: ["Dom", ... , "Sab"].
     * @returns {calendar} Returns a new instance of Calendar.
     * @example
     * // Create a new Calendar.
     * var calendar = new ch.Calendar($el, [options]);
     * @example
     * // Create a new Calendar with jQuery or Zepto.
     * var calendar = $(selector).calendar();
     * @example
     * // Creates a new Calendar with custom options.
     * var calendar =  $(selector).calendar({
     *     'format': 'MM/DD/YYYY',
     *     'selected': '2011/12/25',
     *     'from': '2010/12/25',
     *     'to': '2012/12/25',
     *     'monthsNames': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
     *     'weekdays': ['Su', 'Mo', 'Tu', 'We', 'Thu', 'Fr', 'Sa']
     * });
     * @example
     * // Creates a new Calendar using a shorthand way (selected date as parameter).
     * var calendar = $(selector).calendar('2011/12/25');
     */
    function Calendar($el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Calendar is created.
             * @memberof! ch.Calendar.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Calendar#ready
         * @example
         * // Subscribe to "ready" event.
         * calendar.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    /**
     * Completes with zero the numbers less than 10.
     * @function
     * @private
     * @returns {String}
     */
    var addZero = function (num) {
            return (parseInt(num, 10) < 10) ? '0' + num : num;
        },

        /**
         * Map of date formats.
         * @type {Object}
         * @private
         */
        FORMAT_dates = {

            /**
             * Converts a given date to "YYYY/MM/DD" format.
             * @params {Date} date A given date to convert.
             * @function
             * @returns {String}
             */
            'YYYY/MM/DD': function (date) {
                return [date.year, addZero(date.month), addZero(date.day)].join('/');
            },

            /**
             * Converts a given date to "DD/MM/YYYY" format.
             * @params {Date} date A given date to convert.
             * @function
             * @returns {String}
             */
            'DD/MM/YYYY': function (date) {
                return [addZero(date.day), addZero(date.month), date.year].join('/');
            },

            /**
             * Converts a given date to "MM/DD/YYYY" format.
             * @params {Date} date A given date to convert.
             * @function
             * @returns {String}
             */
            'MM/DD/YYYY': function (date) {
                return [addZero(date.month), addZero(date.day), date.year].join('/');
            }
        },

        /**
         * Creates a JSON Object with reference to day, month and year, from a determinated date.
         * @function
         * @private
         * @returns {Object}
         */
        createDateObject = function (date) {

            // Uses date parameter or create a date from today
            date = (date === 'today') ? new Date() : new Date(date);

            /**
             * Returned custom Date object.
             * @type {Object}
             * @private
             */
            return {

                /**
                 * Reference to native Date object.
                 * @type {Date}
                 * @private
                 */
                'native': date,

                /**
                 * Number of day.
                 * @type {Number}
                 * @private
                 */
                'day': date.getDate(),

                /**
                 * Order of day in a week.
                 * @type {Number}
                 * @private
                 */
                'order': date.getDay(),

                /**
                 * Number of month.
                 * @type {Number}
                 * @private
                 */
                'month': date.getMonth() + 1,

                /**
                 * Number of full year.
                 * @type {Number}
                 * @private
                 */
                'year': date.getFullYear()
            };
        },

        /**
         * Templates of arrows to move around months.
         * @type {Object}
         * @private
         */
        arrows = {

            /**
             * Template of previous arrow.
             * @type {String}
             */
            'prev': '<div class="ch-calendar-prev" role="button" aria-hidden="false"></div>',

            /**
             * Template of next arrow.
             * @type {String}
             */
            'next': '<div class="ch-calendar-next" role="button" aria-hidden="false"></div>'
        },

        // Inheritance
        parent = ch.util.inherits(Calendar, ch.Component);

    /**
     * The name of the component.
     * @memberof! ch.Calendar.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var calendar = $(selector).data('calendar');
     */
    Calendar.prototype.name = 'calendar';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Calendar.prototype
     * @function
     */
    Calendar.prototype.constructor = Calendar;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Calendar.prototype._defaults = {
        'monthsNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        'weekdays': ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        'format': 'DD/MM/YYYY'
    };

    /**
     * Initialize a new instance of Calendar and merge custom options with defaults options.
     * @memberof! ch.Calendar.prototype
     * @function
     * @private
     * @returns {calendar}
     */
    Calendar.prototype._init = function ($el, options) {
        // Call to its parent init method
        parent._init.call(this, $el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._el.cloneNode(true);

        /**
         * Object to mange the date and its ranges.
         * @type {Object}
         * @private
         */
        this._dates = {
            'range': {}
        };

        this._dates.today = createDateObject('today');

        this._dates.current = this._dates.today;

        /**
         * Date of selected day.
         * @type {Object}
         * @private
         */
        this._dates.selected = (function () {

            // Get date from configuration or input value, if configured could be an Array with multiple selections
            var selected = that._options.selected;

            // Do it only if there are a "selected" parameter
            if (!selected) { return selected; }

            // Simple date selection
            if (!ch.util.isArray(selected)) {

                if (selected !== 'today') {
                    // Return date object and update currentDate
                    selected = that._dates.current = createDateObject(selected);

                } else {
                    selected = that._dates.today;
                }

            // Multiple date selection
            } else {
                $.each(selected, function (i, e) {
                    // Simple date
                    if (!ch.util.isArray(e)) {
                        selected[i] = (selected[i] !== 'today') ? createDateObject(e) : that._dates.today;
                    // Range
                    } else {
                        selected[i][0] = (selected[i][0] !== 'today') ? createDateObject(e[0]) : that._dates.today;
                        selected[i][1] = (selected[i][1] !== 'today') ? createDateObject(e[1]) : that._dates.today;
                    }
                });
            }

            return selected;
        }());

        // Today's date object
        this._dates.today = createDateObject('today');

        // Minimum selectable date
        this._dates.range.from = (function () {

            // Only works when there are a "from" parameter on configuration
            if (that._options.from === undefined || !that._options.from) { return; }

            // Return date object
            return (that._options.from === 'today') ? that._dates.today : createDateObject(that._options.from);

        }());

        // Maximum selectable date
        this._dates.range.to = (function () {

            // Only works when there are a "to" parameter on configuration
            if (that._options.to === undefined || !that._options.to) { return; }

            // Return date object
            return (that._options.to === 'today') ? that._dates.today : createDateObject(that._options.to);

        }());

        // Show or hide arrows depending on "from" and "to" limits
        this._$prev = $(arrows.prev).attr('aria-controls', 'ch-calendar-grid-' + this.uid).on(ch.onpointertap + '.' + this.name, function (event) { ch.util.prevent(event); that.prevMonth(); });
        this._$next = $(arrows.next).attr('aria-controls', 'ch-calendar-grid-' + this.uid).on(ch.onpointertap + '.' + this.name, function (event) { ch.util.prevent(event); that.nextMonth(); });

        /**
         * The calendar container.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$container = this._$el
            .addClass('ch-calendar')
            .prepend(this._$prev)
            .prepend(this._$next)
            .append(this._createTemplate(this._dates.current));

        this._updateControls();

        // Avoid selection on the component
        ch.util.avoidTextSelection(that.$container);

        return this;
    };

    /**
     * Checks if it has got a previous month to show depending on "from" limit.
     * @function
     * @private
     */
    Calendar.prototype._hasPrevMonth = function () {
        return this._dates.range.from === undefined || !(this._dates.range.from.month >= this._dates.current.month && this._dates.range.from.year >= this._dates.current.year);
    };

    /**
     * Checks if it has got a next month to show depending on "to" limits.
     * @function
     * @private
     */
    Calendar.prototype._hasNextMonth = function () {
        return this._dates.range.to === undefined || !(this._dates.range.to.month <= this._dates.current.month && this._dates.range.to.year <= this._dates.current.year);
    };

    /**
     * Refresh arrows visibility depending on "from" and "to" limits.
     * @function
     * @private
     */
    Calendar.prototype._updateControls = function () {

        // Show previous arrow when it's out of limit
        if (this._hasPrevMonth()) {
            this._$prev.removeClass('ch-hide').attr('aria-hidden', 'false');

        // Hide previous arrow when it's out of limit
        } else {
            this._$prev.addClass('ch-hide').attr('aria-hidden', 'true');
        }

        // Show next arrow when it's out of limit
        if (this._hasNextMonth()) {
            this._$next.removeClass('ch-hide').attr('aria-hidden', 'false');

        // Hide next arrow when it's out of limit
        } else {
            this._$next.addClass('ch-hide').attr('aria-hidden', 'true');
        }

        return this;
    };

    /**
     * Refresh the structure of Calendar's table with a new date.
     * @function
     * @private
     */
    Calendar.prototype._updateTemplate = function (date) {
        // Update "currentDate" object
        this._dates.current = (typeof date === 'string') ? createDateObject(date) : date;

        // Delete old table
        this.$container.children('table').remove();

        // Append new table to content
        this.$container.append(this._createTemplate(this._dates.current));

        // Refresh arrows
        this._updateControls();

        return this;
    };

    /**
     * Creates a complete month in a table.
     * @function
     * @private
     */
    Calendar.prototype._createTemplate = function (date) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            cell,
            positive,
            day,
            isSelected,
            thead = (function () {

                // Create thead structure
                var t = ['<thead><tr role="row">'],
                    dayIndex;

                // Add week names
                for (dayIndex = 0; dayIndex < 7; dayIndex += 1) {
                    t.push('<th role="columnheader">' + that._defaults.weekdays[dayIndex] + '</th>');
                }

                // Close thead structure
                t.push('</tr></thead>');

                // Join structure and return
                return t.join('');

            }()),

            table = [
                '<table class="ch-calendar-month" role="grid" id="ch-calendar-grid-' + that.uid + '">',
                '<caption>' + that._defaults.monthsNames[date.month - 1] + ' - ' + date.year + '</caption>',
                thead
            ],

            // Total amount of days into month
            cells = (function () {

                // Amount of days of current month
                var currentMonth = new Date(date.year, date.month, 0).getDate(),

                // Amount of days of previous month
                    prevMonth = new Date([date.year, date.month, '01'].join('/')).getDay(),

                // Merge amount of previous and current month
                    subtotal = prevMonth + currentMonth,

                // Amount of days into last week of month
                    latest = subtotal % 7,

                // Amount of days of next month
                    nextMonth = (latest > 0) ? 7 - latest : 0;

                return {
                    'previous': prevMonth,
                    'subtotal': subtotal,
                    'total': subtotal + nextMonth
                };

            }());

        table.push('<tbody><tr class="ch-calendar-week" role="row">');

        // Iteration of weekdays
        for (cell = 0; cell < cells.total; cell += 1) {

            // Push an empty cell on previous and next month
            if (cell < cells.previous || cell > cells.subtotal - 1) {
                table.push('<td role="gridcell" class="ch-calendar-other">X</td>');
            } else {

                // Positive number of iteration
                positive = cell + 1;

                // Day number
                day = positive - cells.previous;

                // Define if it's the day selected
                isSelected = this._isSelected(date.year, date.month, day);

                // Create cell
                table.push(
                    // Open cell structure including WAI-ARIA and classnames space opening
                    '<td role="gridcell"' + (isSelected ? ' aria-selected="true"' : '') + ' class="ch-calendar-day',

                    // Add Today classname if it's necesary
                    (date.year === that._dates.today.year && date.month === that._dates.today.month && day === that._dates.today.day) ? ' ch-calendar-today' : null,

                    // Add Selected classname if it's necesary
                    (isSelected ? ' ch-calendar-selected ' : null),

                    // From/to range. Disabling cells
                    (
                        // Disable cell if it's out of FROM range
                        (that._dates.range.from && day < that._dates.range.from.day && date.month === that._dates.range.from.month && date.year === that._dates.range.from.year) ||

                        // Disable cell if it's out of TO range
                        (that._dates.range.to && day > that._dates.range.to.day && date.month === that._dates.range.to.month && date.year === that._dates.range.to.year)

                    ) ? ' ch-calendar-disabled' : null,

                    // Close classnames attribute and print content closing cell structure
                    '">' + day + '</td>'
                );

                // Cut week if there are seven days
                if (positive % 7 === 0) {
                    table.push('</tr><tr class="ch-calendar-week" role="row">');
                }

            }

        }

        table.push('</tr></tbody></table>');

        // Return table object
        return table.join('');

    };

    /**
     * Checks if a given date is into 'from' and 'to' dates.
     * @function
     * @private
     */
    Calendar.prototype._isInRange = function (date) {
        var inRangeFrom = true,
            inRangeTo = true;

        if (this._dates.range.from) {
            inRangeFrom = (this._dates.range.from.native <= date.native);
        }

        if (this._dates.range.to) {
            inRangeTo = (this._dates.range.to.native >= date.native);
        }

        return inRangeFrom && inRangeTo;
    };

    /**
     * Indicates if an specific date is selected or not (including date ranges and simple dates).
     * @function
     * @private
     */
    Calendar.prototype._isSelected = function (year, month, day) {
        var yepnope;

        if (!this._dates.selected) { return; }

        yepnope = false;

        // Simple selection
        if (!ch.util.isArray(this._dates.selected)) {
            if (year === this._dates.selected.year && month === this._dates.selected.month && day === this._dates.selected.day) {
                yepnope = true;
                return yepnope;
            }

        // Multiple selection (ranges)
        } else {
            $.each(this._dates.selected, function (i, e) {
                // Simple date
                if (!ch.util.isArray(e)) {
                    if (year === e.year && month === e.month && day === e.day) {
                        yepnope = true;
                        return yepnope;
                    }
                // Range
                } else {
                    if (
                        (year >= e[0].year && month >= e[0].month && day >= e[0].day) &&
                            (year <= e[1].year && month <= e[1].month && day <= e[1].day)
                    ) {
                        yepnope = true;
                        return yepnope;
                    }
                }
            });
        }

        return yepnope;
    };

    /**
     * Selects a specific date or returns the selected date.
     * @memberof! ch.Calendar.prototype
     * @function
     * @param {String} [date] A given date to select. The format of the given date should be "YYYY/MM/DD".
     * @returns {calendar}
     * @example
     * // Returns the selected date.
     * calendar.select();
     * @example
     * // Select a specific date.
     * calendar.select('2014/05/28');
     */
    Calendar.prototype.select = function (date) {
        // Getter
        if (!date) {
            if (this._dates.selected === undefined) {
                return;
            }
            return FORMAT_dates[this._options.format](this._dates.selected);
        }

        // Setter
        var newDate = createDateObject(date);


        if (!this._isInRange(newDate)) {
            return this;
        }

        // Update selected date
        this._dates.selected = (date === 'today') ? this._dates.today : newDate;

        // Create a new table of selected month
        this._updateTemplate(this._dates.selected);

        /**
         * Event emitted when a date is selected.
         * @event ch.Calendar#select
         * @example
         * // Subscribe to "select" event.
         * calendar.on('select', function () {
         *     // Some code here!
         * });
         */
        this.emit('select');

        return this;
    };

    /**
     * Returns date of today
     * @memberof! ch.Calendar.prototype
     * @function
     * @returns {String} The date of today
     * @example
     * // Get the date of today.
     * var today = calendar.getToday();
     */
    Calendar.prototype.getToday = function () {
        return FORMAT_dates[this._options.format](this._dates.today);
    };

    /**
     * Moves to the next month.
     * @memberof! ch.Calendar.prototype
     * @function
     * @returns {calendar}
     * @example
     * // Moves to the next month.
     * calendar.nextMonth();
     */
    Calendar.prototype.nextMonth = function () {
        if (!this._enabled || !this._hasNextMonth()) {
            return this;
        }

        // Next year
        if (this._dates.current.month === 12) {
            this._dates.current.month = 0;
            this._dates.current.year += 1;
        }

        // Create a new table of selected month
        this._updateTemplate([this._dates.current.year, this._dates.current.month + 1, '01'].join('/'));

        /**
         * Event emitted when a next month is shown.
         * @event ch.Calendar#nextmonth
         * @example
         * // Subscribe to "nextmonth" event.
         * calendar.on('nextmonth', function () {
         *     // Some code here!
         * });
         */
        this.emit('nextmonth');

        return this;
    };

    /**
     * Move to the previous month.
     * @memberof! ch.Calendar.prototype
     * @function
     * @returns {calendar}
     * @example
     * // Moves to the prev month.
     * calendar.prevMonth();
     */
    Calendar.prototype.prevMonth = function () {

        if (!this._enabled || !this._hasPrevMonth()) {
            return this;
        }

        // Previous year
        if (this._dates.current.month === 1) {
            this._dates.current.month = 13;
            this._dates.current.year -= 1;
        }

        // Create a new table to the prev month
        this._updateTemplate([this._dates.current.year, this._dates.current.month - 1, '01'].join('/'));

        /**
         * Event emitted when a previous month is shown.
         * @event ch.Calendar#prevmonth
         * @example
         * // Subscribe to "prevmonth" event.
         * calendar.on('prevmonth', function () {
         *     // Some code here!
         * });
         */
        this.emit('prevmonth');

        return this;
    };

    /**
     * Move to the next year.
     * @memberof! ch.Calendar.prototype
     * @function
     * @returns {calendar}
     * @example
     * // Moves to the next year.
     * calendar.nextYear();
     */
    Calendar.prototype.nextYear = function () {

        if (!this._enabled || !this._hasNextMonth()) {
            return this;
        }

        // Create a new table of selected month
        this._updateTemplate([this._dates.current.year + 1, this._dates.current.month, '01'].join('/'));

        /**
         * Event emitted when a next year is shown.
         * @event ch.Calendar#nextyear
         * @example
         * // Subscribe to "nextyear" event.
         * calendar.on('nextyear', function () {
         *     // Some code here!
         * });
         */
        this.emit('nextyear');

        return this;
    };

    /**
     * Move to the previous year.
     * @memberof! ch.Calendar.prototype
     * @function
     * @returns {calendar}
     * @example
     * // Moves to the prev year.
     * calendar.prevYear();
     */
    Calendar.prototype.prevYear = function () {

        if (!this._enabled || !this._hasPrevMonth()) {
            return this;
        }

        // Create a new table to the prev year
        this._updateTemplate([this._dates.current.year - 1, this._dates.current.month, '01'].join('/'));

        /**
         * Event emitted when a previous year is shown.
         * @event ch.Calendar#prevyear
         * @example
         * // Subscribe to "prevyear" event.
         * calendar.on('prevyear', function () {
         *     // Some code here!
         * });
         */
        this.emit('prevyear');

        return this;
    };

    /**
     * Set a minimum selectable date.
     * @memberof! ch.Calendar.prototype
     * @function
     * @param {String} date A given date to set as minimum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @returns {calendar}
     * @example
     * // Set a minimum selectable date.
     * calendar.setFrom('2010/05/28');
     */
    Calendar.prototype.setFrom = function (date) {
        // this from is a reference to the global form
        this._dates.range.from = (date === 'auto') ? undefined : createDateObject(date);
        this._updateTemplate(this._dates.current);

        return this;
    };

    /**
     * Set a maximum selectable date.
     * @memberof! ch.Calendar.prototype
     * @function
     * @param {String} date A given date to set as maximum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @returns {calendar}
     * @example
     * // Set a maximum selectable date.
     * calendar.setTo('2014/05/28');
     */
    Calendar.prototype.setTo = function (date) {
        // this to is a reference to the global to
        this._dates.range.to = (date === 'auto') ? undefined : createDateObject(date);
        this._updateTemplate(this._dates.current);

        return this;
    };

    /**
     * Destroys a Calendar instance.
     * @memberof! ch.Calendar.prototype
     * @function
     * @example
     * // Destroy a calendar
     * calendar.destroy();
     * // Empty the calendar reference
     * calendar = undefined;
     */
    Calendar.prototype.destroy = function () {

        this._el.parentNode.replaceChild(this._snippet, this._el);

        $(window.document).trigger(ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    // Factorize
    ch.factory(Calendar, normalizeOptions);

}(this, this.ch.$, this.ch));
(function (window, $, ch) {
    'use strict';

    /**
     * Dropdown shows a list of options for navigation.
     * @memberof ch
     * @constructor
     * @augments ch.Layer
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Dropdown.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "none".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointertap".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointers".
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "left".
     * @param {Number} [options.offsetX] The offsetX option specifies a distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] The offsetY option specifies a distance to displace the target vertically. Default: -1.
     * @param {String} [options.position] The position option specifies the type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {Boolean} [options.skin] Sets a CSS class name to the trigger and container to get a variation of Dropdown. Default: false.
     * @param {Boolean} [options.shortcuts] Configures navigation shortcuts. Default: true.
     * @param {(jQuerySelector | ZeptoSelector | HTMLElement | String)} [options.content] The content to be shown into the Dropdown container.
     * @returns {dropdown} Returns a new instance of Dropdown.
     * @example
     * // Create a new Dropdown.
     * var dropdown = new ch.Dropdown($el, [options]);
     * @example
     * // Create a new Dropdown with jQuery or Zepto.
     * var dropdown = $(selector).dropdown([options]);
     * @example
     * // Create a new skinned Dropdown.
     * var dropdown = $(selector).dropdown({
     *     'skin': true
     * });
     */
    function Dropdown($el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Dropdown is created.
             * @memberof! ch.Dropdown.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Dropdown#ready
         * @example
         * // Subscribe to "ready" event.
         * dropdown.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    var $document = $(window.document),
        pointerenter = ch.onpointerenter + '.dropdown',
        // Inheritance
        parent = ch.util.inherits(Dropdown, ch.Layer);

    /**
     * The name of the component.
     * @memberof! ch.Dropdown.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var dropdown = $(selector).data('dropdown');
     */
    Dropdown.prototype.name = 'dropdown';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Dropdown.prototype
     * @function
     */
    Dropdown.prototype.constructor = Dropdown;

    /**
     * Configuration by default.
     * @memberof! ch.Dropdown.prototype
     * @type {Object}
     * @private
     */
    Dropdown.prototype._defaults = $.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-dropdown ch-box-lite',
        '_ariaRole': 'combobox',
        'fx': 'none',
        'shownby': 'pointertap',
        'hiddenby': 'pointers',
        'offsetY': -1,
        'skin': false,
        'shortcuts': true
    });

    /**
     * Initialize a new instance of Dropdown and merge custom options with defaults options.
     * @memberof! ch.Dropdown.prototype
     * @function
     * @private
     * @returns {dropdown}
     */
    Dropdown.prototype._init = function ($el, options) {
        // Call to its parent init method
        parent._init.call(this, $el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            // The second element of the HTML snippet (the dropdown content)
            $content = this.$trigger.next();

        /**
         * The dropdown trigger. It's the element that will show and hide the container.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$trigger
            .addClass('ch-dropdown-trigger')
            .prop('aria-activedescendant', 'ch-dropdown' + this.uid + '-selected');

        ch.util.avoidTextSelection(this.$trigger);

        // Skinned dropdown
        if (this._options.skin) {
            this.$trigger.addClass('ch-dropdown-trigger-skin');
            this.$container.addClass('ch-dropdown-skin');
        // Default Skin
        } else {
            this.$trigger.addClass('ch-btn-skin ch-btn-small');
        }

        /**
         * A list of links with the navigation options of the component.
         * @type {(jQuerySelector | ZeptoSelector)}
         * @private
         */
        this._$navigation = $content.find('a').prop('role', 'option');

        // Item selected by mouseover
        $.each(this._$navigation, function (i, e) {
            $(e).on(pointerenter, function () {
                that._$navigation[that._selected = i].focus();
            });
        });

        if (this._options.shortcuts && this._navigationShortcuts !== undefined) {
            this._navigationShortcuts();
        }

        this._options.content = $content;

        /**
         * The original and entire element and its state, before initialization.
         * @private
         * @type {HTMLElement}
         */
        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._options.content[0].cloneNode();

        return this;
    };

    /**
     * Shows the dropdown container.
     * @memberof! ch.Dropdown.prototype
     * @function
     * @param {(String | jQuerySelector | ZeptoSelector)} [content] The content that will be used by dropdown.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {dropdown}
     * @example
     * // Shows a basic dropdown.
     * dropdown.show();
     * @example
     * // Shows a dropdown with new content
     * dropdown.show('Some new content here!');
     * @example
     * // Shows a dropdown with a new content that will be loaded by ajax with some custom options
     * dropdown.show('http://domain.com/ajax/url', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Dropdown.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled) {
            return this;
        }

        // Execute the original show()
        parent.show.call(this, content, options);

        // Z-index of trigger over content (secondary / skin dropdown)
        if (this._options.skin) {
            this.$trigger.css('z-index', ch.util.zIndex += 1);
        }

        this._selected = -1;

        return this;
    };

    /**
     * Destroys a Dropdown instance.
     * @memberof! ch.Dropdown.prototype
     * @function
     * @example
     * // Destroy a dropdown
     * dropdown.destroy();
     * // Empty the dropdown reference
     * dropdown = undefined;
     */
    Dropdown.prototype.destroy = function () {

        this.$trigger
            .off('.dropdown')
            .removeClass('ch-dropdown-trigger ch-dropdown-trigger-skin ch-user-no-select ch-btn-skin ch-btn-small')
            .removeAttr('aria-controls')
            .after(this._snippet);

        this.$container.off('.dropdown');

        $document.trigger(ch.onlayoutchange);

        $.each(this._$navigation, function (i, e) {
            $(e).off(pointerenter);
        });

        parent.destroy.call(this);

        return;
    };

    ch.factory(Dropdown);

}(this, this.ch.$, this.ch));

(function (ch) {
    'use strict';

    /**
     * Highlights the current option when navigates by keyboard.
     * @function
     * @private
     */
    ch.Dropdown.prototype._highlightOption = function (key) {

        var optionsLength = this._$navigation.length;

        if (!this._shown) { return; }

        // Sets limits behavior
        if (this._selected === (key === 'down_arrow' ? optionsLength - 1 : 0)) { return; }

        // Unselects current option
        if (this._selected !== -1) {
            this._$navigation[this._selected].blur();
            this._$navigation[this._selected].removeAttribute('id');
        }

        if (key === 'down_arrow') { this._selected += 1; } else { this._selected -= 1; }

        // Selects new current option
        this._$navigation[this._selected].focus();
        this._$navigation[this._selected].id = 'ch-dropdown' + this.uid + '-selected';
    };

    /**
     * Add handlers to manage the keyboard on Dropdown navigation.
     * @function
     * @private
     */
    ch.Dropdown.prototype._navigationShortcuts = function () {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        ch.shortcuts.add(ch.onkeyuparrow, this.uid, function (event) {
            // Prevent default behavior
            ch.util.prevent(event);

            that._highlightOption(event.type);
        });

        ch.shortcuts.add(ch.onkeydownarrow, this.uid, function (event) {
            // Prevent default behavior
            ch.util.prevent(event);

            that._highlightOption(event.type);
        });

        this.once('destroy', function () {
            ch.shortcuts.remove(ch.onkeyuparrow, that.uid);
            ch.shortcuts.remove(ch.onkeydownarrow, that.uid);
        });

        return this;
    };

}(this.ch));
(function (window, $, ch) {
    'use strict';

    /**
     * Tabs lets you create tabs for static and dynamic content.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Expandable
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Tabs.
     * @returns {tabs} Returns a new instance of Tabs.
     * @example
     * // Create a new Tabs.
     * var tabs = new ch.Tabs($el);
     * @example
     * // Create a new Tabs with jQuery or Zepto.
     * var tabs = $(selector).tabs();
     */
    function Tabs($el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Tabs is created.
             * @memberof! ch.Tabs.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Emits the event 'ready' when the component is ready to use.
         * @event ch.Tabs#ready
         * @example
         * // Subscribe to "ready" event.
         * tabs.on('ready',function () {
         *     this.show();
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Tabs, ch.Component),

        location = window.location,

        // Creates methods enable and disable into the prototype.
        methods = ['enable', 'disable'],
        len = methods.length,

        // Regular expresion to get hash
        hashRegExp = new RegExp('\\#!?\\/?(.[^\\?|\\&|\\s]+)');


    function createMethods(method) {
        Tabs.prototype[method] = function (tab) {
            var i;

            // Enables or disables an specifc tab panel
            if (tab !== undefined) {
                this.tabpanels[tab - 1][method]();

            // Enables or disables Tabs
            } else {

                i = this.tabpanels.length;

                while (i) {
                    this.tabpanels[i -= 1][method]();
                }

                // Executes parent method
                parent[method].call(this);

                // Updates "aria-disabled" attribute
                this._el.setAttribute('aria-disabled', !this._enabled);
            }

            return this;
        };
    }

    /**
     * The name of the component.
     * @memberof! ch.Tabs.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var tabs = $(selector).data('tabs');
     */
    Tabs.prototype.name = 'tabs';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Tabs.prototype
     * @function
     */
    Tabs.prototype.constructor = Tabs;

    /**
     * Initialize a new instance of Tabs and merge custom options with defaults options.
     * @memberof! ch.Tabs.prototype
     * @function
     * @private
     * @returns {tabs}
     */
    Tabs.prototype._init = function ($el, options) {
        parent._init.call(this, $el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
        * The actual location hash, is used to know if there's a specific tab panel shwown.
        * @type {String}
        * @private
        */
        this._currentHash = (function () {
            var hash = location.hash.match(hashRegExp);
            return (hash !== null) ? hash[1] : '';
        }());

        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._el.cloneNode(true);

        /**
         * The tabs container.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$container = this._$el
            .addClass('ch-tabs');

        /**
         * The tabs triggers.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$triggers = this.$container.children(':first-child')
            .addClass('ch-tabs-triggers')
            .attr('role', 'tablist');

        /**
         * A collection of tab panel.
         * @type {Array}
         */
        this.tabpanels = [];

        /**
         * The container of tab panels.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$panel = this.$container.children(':last-child')
            .addClass('ch-tabs-panel ch-box-lite')
            .attr('role', 'presentation');

        /**
         * The tab panel's containers.
         * @type {jQuery}
         * @private
         */
        this._$tabsPanels = this.$panel.children();

        // Creates tab
        this.$triggers.find('a').each(function (i, e) {
            that._createTab(i, e);
        });

        // Set the default shown tab.
        this._shown = 1;

        // Checks if the url has a hash to shown the associated tab.
        this._hasHash();

        return this;
    };

    /**
     * Create tab panels.
     * @function
     * @private
     */
    Tabs.prototype._createTab = function (i, e) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            tab,

            $panel = this._$tabsPanels.eq(i),

            // Create Tab panel's options
            options = {
                '_classNameTrigger': 'ch-tab',
                '_classNameContainer': 'ch-tabpanel ch-hide',
                'toggle': false
            };

        // Tab panel async configuration
        if ($panel[0] === undefined) {

            $panel = $('<div id="' + e.href.split('#')[1] + '">').appendTo(this.$panel);

            options.content = e.href;
            options.waiting = this._options.waiting;
            options.cache = this._options.cache;
            options.method = this._options.method;
        }

        // Tab panel container configuration
        options.container = $panel;

        // Creates new Tab panel
        tab = new ch.Expandable($(e), options);

        // Creates tab's hash
        tab._hash = e.href.split('#')[1];

        // Add ARIA roles
        tab.$trigger.attr('role', 'tab');
        tab.$container.attr('role', 'tabpanel');

        // Binds show event
        tab.on('show', function () {
            that._updateShown(i + 1);
        });

        // Adds tab panel to the collection
        this.tabpanels.push(tab);

        return this;
    };

    /**
     * Checks if the url has a hash to shown the associated tab panel.
     * @function
     * @private
     */
    Tabs.prototype._hasHash = function () {

        /**
         * Event emitted when a tab hide a tab panel container.
         * @event ch.Tabs#hide
         * @example
         * // Subscribe to "hide" event.
         * tabs.on('hide', function () {
         *     // Some code here!
         * });
         */
        this.emit('hide', this._shown);

        var i = 0,
            // Shows the first tab panel if not hash or it's hash and it isn't from the current tab panel,
            l = this.tabpanels.length;

        // If hash open that tab panel
        for (i; i < l; i += 1) {
            if (this.tabpanels[i]._hash === this._currentHash) {
                this._shown = i + 1;
                break;
            }
        }

        this.tabpanels[this._shown - 1].show();

        /**
         * Event emitted when the tabs shows a tab panel container.
         * @event ch.Tabs#show
         * @ignore
         */
        this.emit('show', this._shown);

        return this;
    };

    /**
     * Shows a specific tab panel.
     * @memberof! ch.Tabs.prototype
     * @function
     * @param {Number} tab - A given number of tab panel.
     * @returns {tabs}
     * @example
     * // Shows the second tab panel.
     * tabs.show(2);
     */
    Tabs.prototype.show = function (tab) {

        // Shows the current tab
        this.tabpanels[tab - 1].show();

        return this;
    };

    /**
     * Updates the shown tab panel, hides the previous tab panel, changes window location and emits "show" event.
     * @memberof! ch.Tabs.prototype
     * @function
     * @private
     * @param {Number} tab - A given number of tab panel.
     */
    Tabs.prototype._updateShown = function (tab) {

        // If tab doesn't exist or if it's shown do nothing
        if (this._shown === tab) {
            return this;
        }

        /**
         * Event emitted when a tab hide a tab panel container.
         * @event ch.Tabs#hide
         * @example
         * // Subscribe to "hide" event.
         * tabs.on('hide', function () {
         *     // Some code here!
         * });
         */
        this.emit('hide', this._shown);

        // Hides the shown tab
        this.tabpanels[this._shown - 1].hide();

        /**
         * Get wich tab panel is shown.
         * @name ch.Tabs#_shown
         * @type {Number}
         * @private
         */
        this._shown = tab;

        // Update window location hash
        location.hash = this._currentHash = (this._currentHash === '')
            // If the current hash is empty, create it.
            ? '#!/' + this.tabpanels[this._shown - 1]._hash
            // update only the previous hash
            : location.hash.replace(location.hash.match(hashRegExp)[1], this.tabpanels[this._shown - 1]._hash);

        /**
         * Event emitted when the tabs shows a tab panel container.
         * @event ch.Tabs#show
         * @example
         * // Subscribe to "show" event.
         * tabs.on('show', function (shownTab) {
         *     // Some code here!
         * });
         */
        this.emit('show', this._shown);

        return this;
    };

    /**
     * Returns the number of the shown tab panel.
     * @memberof! ch.Tabs.prototype
     * @function
     * @returns {Boolean}
     * @example
     * if (tabs.getShown() === 1) {
     *     fn();
     * }
     */
    Tabs.prototype.getShown = function () {
        return this._shown;
    };

    /**
     * Allows to manage the tabs content.
     * @param {Number} tab A given tab to change its content.
     * @param {(String | jQuerySelector | ZeptoSelector)} content The content that will be used by a tabpanel.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @example
     * // Updates the content of the second tab with some string.
     * tabs.content(2, 'http://ajax.com', {'cache': false});
     */
    Tabs.prototype.content = function (tab, content, options) {
        if (tab === undefined || typeof tab !== 'number') {
            throw new window.Error('Tabs.content(tab, content, options): Expected a number of tab.');
        }

        if (content === undefined) {
            return this.tab[tab - 1].content();
        }

        this.tabpanels[tab - 1].content(content, options);

        return this;
    };

    /**
     * Enables an instance of Tabs or a specific tab panel.
     * @memberof! ch.Tabs.prototype
     * @name enable
     * @function
     * @param {Number} [tab] - A given number of tab panel to enable.
     * @returns {tabs} Returns an instance of Tabs.
     * @example
     * // Enabling an instance of Tabs.
     * tabs.enable();
     * @example
     * // Enabling the second tab panel of a tabs.
     * tabs.enable(2);
     */

    /**
     * Disables an instance of Tabs or a specific tab panel.
     * @memberof! ch.Tabs.prototype
     * @name disable
     * @function
     * @param {Number} [tab] - A given number of tab panel to disable.
     * @returns {tabs} Returns an instance of Tabs.
     * @example
     * // Disabling an instance of Tabs.
     * tabs.disable();
     * @example
     * // Disabling the second tab panel.
     * tabs.disable(2);
     */
    while (len) {
        createMethods(methods[len -= 1]);
    }

    /**
     * Destroys a Tabs instance.
     * @memberof! ch.Tabs.prototype
     * @function
     * @example
     * // Destroying an instance of Tabs.
     * tabs.destroy();
     */
    Tabs.prototype.destroy = function () {

        this._el.parentNode.replaceChild(this._snippet, this._el);

        $(window.document).trigger(ch.onlayoutchange);

        parent.destroy.call(this);
    };

    /**
     * Factory
     */
    ch.factory(Tabs);

}(this, this.ch.$, this.ch));
(function (window, $, ch) {
    'use strict';

    /**
     * A large list of elements. Some elements will be shown in a preset area, and others will be hidden waiting for the user interaction to show it.
     * @memberof ch
     * @constructor
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Carousel.
     * @param {Object} [options] Options to customize an instance.
     * @param {Number} [options.async] Defines the number of future asynchronous items to add to the component. Default: 0.
     * @param {Boolean} [options.arrows] Defines if the arrow-buttons must be created or not at initialization. Default: true.
     * @param {Boolean} [options.pagination] Defines if a pagination must be created or not at initialization. Default: false.
     * @param {Boolean} [options.fx] Enable or disable the slide effect. Default: true.
     * @param {Number} [options.limitPerPage] Set the maximum amount of items to show in each page.
     * @returns {carousel} Returns a new instance of Carousel.
     * @example
     * // Create a new carousel.
     * var carousel = new ch.Carousel($el, [options]);
     * @example
     * // Create a new Carousel with jQuery or Zepto.
     * var carousel = $(selector).carousel([options]);
     * @example
     * // Create a new Carousel with disabled effects.
     * var carousel = $(selector).carousel({
     *     'fx': false
     * });
     * @example
     * // Create a new Carousel with items asynchronously loaded.
     * var carousel = $(selector).carousel({
     *     'async': 10
     * }).on('itemsadd', function ($items) {
     *     // Inject content into the added <li> elements
     *     $.each($items, function (i, e) {
     *         e.innerHTML = 'Content into one of newly inserted <li> elements.';
     *     });
     * });
     */
    function Carousel($el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Carousel is created.
             * @memberof! ch.Carousel.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Carousel#ready
         * @example
         * // Subscribe to "ready" event.
         * carousel.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    var pointertap = ch.onpointertap + '.carousel',
        Math = window.Math,
        setTimeout = window.setTimeout,
        // Inheritance
        parent = ch.util.inherits(Carousel, ch.Component);

    /**
     * The name of the component.
     * @memberof! ch.Carousel.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var carousel = $(selector).data('carousel');
     */
    Carousel.prototype.name = 'carousel';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Carousel.prototype
     * @function
     */
    Carousel.prototype.constructor = Carousel;

    /**
     * Configuration by default.
     * @memberof! ch.Carousel.prototype
     * @type {Object}
     * @private
     */
    Carousel.prototype._defaults = {
        'async': 0,
        'arrows': true,
        'pagination': false,
        'fx': true
    };

    /**
     * Initialize a new instance of Carousel and merge custom options with defaults options.
     * @memberof! ch.Carousel.prototype
     * @function
     * @private
     * @returns {carousel}
     */
    Carousel.prototype._init = function ($el, options) {
        // Call to its parents init method
        parent._init.call(this, $el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * The original and entire element and its state, before initialization.
         * @type {HTMLDivElement}
         * @private
         */
        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._el.cloneNode(true);

        /**
         * Element that moves (slides) across the component (inside the mask).
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._$list = this._$el.addClass('ch-carousel').children().addClass('ch-carousel-list');

        /**
         * Collection of each child of the slider list.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._$items = this._$list.children().addClass('ch-carousel-item');

        /**
         * Element that wraps the list and denies its overflow.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._$mask = $('<div class="ch-carousel-mask" role="tabpanel">').html(this._$list).appendTo(this._$el);

        /**
         * Size of the mask (width). Updated in each refresh.
         * @private
         * @type {Number}
         */
        this._maskWidth = ch.util.getOuterDimensions(this._$mask[0]).width;

        /**
         * The width of each item, including paddings, margins and borders. Ideal for make calculations.
         * @private
         * @type {Number}
         */
        this._itemWidth = this._$items.width();

        /**
         * The width of each item, without paddings, margins or borders. Ideal for manipulate CSS width property.
         * @private
         * @type {Number}
         */
        this._itemOuterWidth = ch.util.getOuterDimensions(this._$items[0]).width;

        /**
         * The size added to each item to make it elastic/responsive.
         * @private
         * @type {Number}
         */
        this._itemExtraWidth = 0;

        /**
         * The height of each item, including paddings, margins and borders. Ideal for make calculations.
         * @private
         * @type {Number}
         */
        this._itemHeight = this._$items.height();

        /**
         * The margin of all items. Updated in each refresh only if it's necessary.
         * @private
         * @type {Number}
         */
        this._itemMargin = 0;

        /**
         * Flag to control when arrows were created.
         * @private
         * @type {Boolean}
         */
        this._arrowsCreated = false;

        /**
         * Flag to control when pagination was created.
         * @private
         * @type {Boolean}
         */
        this._paginationCreated = false;

        /**
         * Amount of items in each page. Updated in each refresh.
         * @private
         * @type {Number}
         */
        this._limitPerPage = 0;

        /**
         * Page currently showed.
         * @private
         * @type {Number}
         */
        this._currentPage = 1;

        /**
         * Total amount of pages. Data updated in each refresh.
         * @private
         * @type {Number}
         */
        this._pages = 0;

        /**
         * Distance needed to move ONLY ONE PAGE. Data updated in each refresh.
         * @private
         * @type {Number}
         */
        this._pageWidth = 0;

        /**
         * List of items that should be loaded asynchronously on page movement.
         * @private
         * @type {Number}
         */
        this._async = this._options.async;

        /**
         * UI element of arrow that moves the Carousel to the previous page.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._$prevArrow = $('<div class="ch-carousel-prev ch-carousel-disabled" role="button" aria-hidden="true">')
            .on(pointertap, function () { that.prev(); });

        /**
         * UI element of arrow that moves the Carousel to the next page.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        that._$nextArrow = $('<div class="ch-carousel-next" role="button" aria-hidden="false">')
            .on(pointertap, function () { that.next(); });

        /**
         * UI element that contains all the thumbnails for pagination.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._$pagination = $('<div class="ch-carousel-pages" role="navigation">').on(pointertap, function (event) {
            // Get the page from the element
            var page = event.target.getAttribute('data-page');
            // Allow interactions from a valid page of pagination
            if (page !== null) { that.select(window.parseInt(page, 10)); }
        });

        // Refresh calculation when the viewport resizes
        ch.viewport.on('resize', function () { that.refresh(); });

        // If efects aren't needed, avoid transition on list
        if (!this._options.fx) { this._$list.addClass('ch-carousel-nofx'); }

        // Position absolutelly the list when CSS transitions aren't supported
        if (!ch.support.transition) { this._$list.css({'position': 'absolute', 'left': '0'}); }

        // If there are a parameter specifying a pagination, add it
        if (this._options.pagination !== undefined) { this._addPagination(); }

        // Allow to render the arrows
        if (this._options.arrows !== undefined && this._options.arrows !== false) { this._addArrows(); }

        // Set WAI-ARIA properties to each item depending on the page in which these are
        this._updateARIA();

        // Calculate items per page and calculate pages, only when the amount of items was changed
        this._updateLimitPerPage();

        // Update the margin between items and its size
        this._updateDistribution();

        return this;
    };

    /**
     * Set accesibility properties to each item depending on the page in which these are.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._updateARIA = function () {
        /**
         * Reference to an internal component instance, saves all the information and configuration properties.
         * @type {Object}
         * @private
         */
        var that = this,
            // Amount of items when ARIA is updated
            total = this._$items.length + this._async,
            // Page where each item is in
            page;

        // Update WAI-ARIA properties on all items
        $.each(this._$items, function (i, item) {
            // Update page where this item is in
            page = Math.floor(i / that._limitPerPage) + 1;
            // Update ARIA attributes
            item.setAttribute('aria-hidden', (page !== that._currentPage));
            item.setAttribute('aria-setsize', total);
            item.setAttribute('aria-posinset', (i + 1));
            item.setAttribute('aria-label', 'page' + page);
        });
    };

    /**
     * Adds items when page/pages needs to load it asynchronously.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._loadAsyncItems = function () {

        // Load only when there are items to load
        if (this._async === 0) { return; }

        // Amount of items from the beginning to current page
        var total = this._currentPage * this._limitPerPage,
            // How many items needs to add to items rendered to complete to this page
            amount = total - this._$items.length,
            // The new width calculated from current width plus extraWidth
            width = (this._itemWidth + this._itemExtraWidth),
            // Get the height using new width and relation between width and height of item (ratio)
            height = ((width * this._itemHeight) / this._itemWidth).toFixed(3),
            // Generic <LI> HTML Element to be added to the Carousel
            item = [
                '<li',
                ' class="ch-carousel-item"',
                ' style="width:' + width + 'px;height:' + height + 'px;margin-right:' + this._itemMargin + 'px"',
                '></li>'
            ].join(''),
            // It stores <LI> that will be added to the DOM collection
            items = '',
            // Wrapped items
            $items;

        // Load only when there are items to add
        if (amount < 1) { return; }

        // If next page needs less items than it support, then add that amount
        amount = (this._async < amount) ? this._async : amount;

        // Add the necessary amount of items
        while (amount) {
            items += item;
            amount -= 1;
        }

        // Wrap the string elements into jQuery/Zepto
        $items = $(items);

        // Add sample items to the list
        this._$list.append($items);

        // Update items collection
        this._$items = this._$list.children();

        // Set WAI-ARIA properties to each item
        this._updateARIA();

        // Update amount of items to add asynchronously
        this._async -= amount;

        /**
         * Event emitted when the component creates new asynchronous empty items.
         * @event ch.Carousel#itemsadd
         * @example
         * // Create a new Carousel with items asynchronously loaded.
         * var carousel = $(selector).carousel({
         *     'async': 10
         * }).on('itemsadd', function ($items) {
         *     // Inject content into the added <li> elements
         *     $.each($items, function (i, e) {
         *         e.innerHTML = 'Content into one of newly inserted <li> elements.';
         *     });
         * });
         */
        this.emit('itemsadd', $items);
    };

    /**
     * Creates the pagination of the component.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._addPagination = function () {
        // Remove the current pagination if it's necessary to create again
        if (this._paginationCreated) {
            this._removePagination();
        }

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            thumbs = [],
            page = that._pages,
            isSelected;

        // Generate a thumbnail for each page on Carousel
        while (page) {
            // Determine if this thumbnail is selected or not
            isSelected = (page === that._currentPage);
            // Add string to collection
            thumbs.unshift(
                '<span',
                ' role="button"',
                ' aria-selected="' + isSelected + '"',
                ' aria-controls="page' + page + '"',
                ' data-page="' + page + '"',
                ' class="' + (isSelected ? 'ch-carousel-selected' : '') + '"',
                '>' + page + '</span>'
            );

            page -= 1;
        }

        // Append thumbnails to pagination and append this to Carousel
        that._$pagination.html(thumbs.join('')).appendTo(that._$el);

        // Avoid selection on the pagination
        ch.util.avoidTextSelection(that._$pagination);

        // Check pagination as created
        that._paginationCreated = true;
    };

    /**
     * Deletes the pagination from the component.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._removePagination = function () {
        // Avoid to change something that not exists
        if (!this._paginationCreated) { return; }
        // Delete thumbnails
        this._$pagination[0].innerHTML = '';
        // Check pagination as deleted
        this._paginationCreated = false;
    };

    /**
     * It stops the slide effect while the list moves.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     * @param {Function} callback A function to execute after disable the effects.
     */
    Carousel.prototype._standbyFX = function (callback) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        // Do it if is required
        if (this._options.fx) {
            // Delete efects on list to make changes instantly
            this._$list.addClass('ch-carousel-nofx');
            // Execute the custom method
            callback.call(this);
            // Restore efects to list
            // Use a setTimeout to be sure to do this AFTER changes
            setTimeout(function () { that._$list.removeClass('ch-carousel-nofx'); }, 0);
        // Avoid to add/remove classes if it hasn't effects
        } else {
            callback.call(this);
        }
    };

    /**
     * Calculates the total amount of pages and executes internal methods to load asynchronous items, update WAI-ARIA, update the arrows and update pagination.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._updatePages = function () {
        // Update the amount of total pages
        // The ratio between total amount of items and items in each page
        this._pages = Math.ceil((this._$items.length + this._async) / this._limitPerPage);
        // Add items to the list, if it's necessary
        this._loadAsyncItems();
        // Set WAI-ARIA properties to each item
        this._updateARIA();
        // Update arrows (when pages === 1, there is no arrows)
        this._updateArrows();
        // Update pagination
        this._addPagination();
    };

    /**
     * Calculates the correct items per page and calculate pages, only when the amount of items was changed.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._updateLimitPerPage = function () {

        var max = this._options.limitPerPage,
            // Go to the current first item on the current page to restore if pages amount changes
            firstItemOnPage,
            // The width of each item into the width of the mask
            // Avoid zero items in a page
            limitPerPage = Math.floor(this._maskWidth / this._itemOuterWidth) || 1;

        // Limit amount of items when user set a limitPerPage amount
        if (max !== undefined && limitPerPage > max) { limitPerPage = max; }

        // Set data and calculate pages, only when the amount of items was changed
        if (limitPerPage === this._limitPerPage) { return; }

        // Restore if limitPerPage is NOT the same after calculations (go to the current first item page)
        firstItemOnPage = ((this._currentPage - 1) * this._limitPerPage) + 1;
        // Update amount of items into a single page (from conf or auto calculations)
        this._limitPerPage = limitPerPage;
        // Calculates the total amount of pages and executes internal methods
        this._updatePages();
        // Go to the current first item page
        this.select(Math.ceil(firstItemOnPage / limitPerPage));
    };

    /**
     * Calculates and set the size of the items and its margin to get an adaptive Carousel.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._updateDistribution = function () {

        var moreThanOne = this._limitPerPage > 1,
            // Total space to use as margin into mask
            // It's the difference between mask width and total width of all items
            freeSpace = this._maskWidth - (this._itemOuterWidth * this._limitPerPage),
            // Width to add to each item to get responsivity
            // When there are more than one item, get extra width for each one
            // When there are only one item, extraWidth must be just the freeSpace
            extraWidth = moreThanOne ? Math.ceil(freeSpace / this._limitPerPage / 2) : Math.ceil(freeSpace),
            // Amount of spaces to distribute the free space
            spaces,
            // The new width calculated from current width plus extraWidth
            width;

        // Update ONLY IF margin changed from last refresh
        // If *new* and *old* extra width are 0, continue too
        if (extraWidth === this._itemExtraWidth && extraWidth > 0) { return; }

        // Update global value of width
        this._itemExtraWidth = extraWidth;

        // When there are 6 items on a page, there are 5 spaces between them
        // Except when there are only one page that NO exist spaces
        spaces = moreThanOne ? this._limitPerPage - 1 : 0;
        // The new width calculated from current width plus extraWidth
        width = this._itemWidth + extraWidth;

        // Free space for each space between items
        // Ceil to delete float numbers (not Floor, because next page is seen)
        // There is no margin when there are only one item in a page
        // Update global values
        this._itemMargin = moreThanOne ? Math.ceil(freeSpace / spaces / 2) : 0;

        // Update distance needed to move ONLY ONE page
        // The width of all items on a page, plus the width of all margins of items
        this._pageWidth = (this._itemOuterWidth + extraWidth + this._itemMargin) * this._limitPerPage;

        // Update the list width
        // Do it before item resizing to make space to all items
        // Delete efects on list to change width instantly
        this._standbyFX(function () {
            this._$list.css('width', this._pageWidth * this._pages);
        });

        // Update element styles
        // Get the height using new width and relation between width and height of item (ratio)
        this._$items.css({
            'width': width,
            'height': ((width * this._itemHeight) / this._itemWidth).toFixed(3),
            'margin-right': this._itemMargin
        });

        // Update the mask height with the list height
        this._$mask[0].style.height = ch.util.getOuterDimensions(this._$items[0]).height + 'px';

        // Suit the page in place
        this._standbyFX(function () {
            this._translate(-this._pageWidth * (this._currentPage - 1));
        });
    };

    /**
     * Adds arrows to the component.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._addArrows = function () {
        // Avoid selection on the arrows
        ch.util.avoidTextSelection(this._$prevArrow, this._$nextArrow);
        // Add arrows to DOM
        this._$el.prepend(this._$prevArrow).append(this._$nextArrow);
        // Check arrows as created
        this._arrowsCreated = true;
    };

    /**
     * Set as disabled the arrows by adding a classname and a WAI-ARIA property.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     * @param {Boolean} prev Defines if the "previous" arrow must be disabled or not.
     * @param {Boolean} next Defines if the "next" arrow must be disabled or not.
     */
    Carousel.prototype._disableArrows = function (prev, next) {
        this._$prevArrow.attr('aria-disabled', prev)[prev ? 'addClass' : 'removeClass']('ch-carousel-disabled');
        this._$nextArrow.attr('aria-disabled', next)[next ? 'addClass' : 'removeClass']('ch-carousel-disabled');
    };

    /**
     * Check for arrows behavior on first, last and middle pages, and update class name and WAI-ARIA values.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._updateArrows = function () {
        // Check arrows existency
        if (!this._arrowsCreated) {
            return;
        }
        // Case 1: Disable both arrows if there are ony one page
        if (this._pages === 1) {
            this._disableArrows(true, true);
        // Case 2: "Previous" arrow hidden on first page
        } else if (this._currentPage === 1) {
            this._disableArrows(true, false);
        // Case 3: "Next" arrow hidden on last page
        } else if (this._currentPage === this._pages) {
            this._disableArrows(false, true);
        // Case 4: Enable both arrows on Carousel's middle
        } else {
            this._disableArrows(false, false);
        }
    };

    /**
     * Moves the list corresponding to specified displacement.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     * @param {Number} displacement Distance to move the list.
     */
    Carousel.prototype._translate = (function () {
        // CSS property written as string to use on CSS movement
        var transform = '-' + ch.util.VENDOR_PREFIX + '-transform';

        // Use CSS transform to move
        if (ch.support.transition) {
            return function (displacement) {
                this._$list.css(transform, 'translateX(' + displacement + 'px)');
            };
        }

        // Use JS to move
        // Ask for fx INTO the method because the "fx" is an instance property
        return function (displacement) {
            this._$list[(this._options.fx) ? 'animate' : 'css']({'left': displacement});
        };
    }());

    /**
     * Updates the selected page on pagination.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     * @param {Number} from Page previously selected. It will be unselected.
     * @param {Number} to Page to be selected.
     */
    Carousel.prototype._switchPagination = function (from, to) {
        // Avoid to change something that not exists
        if (!this._paginationCreated) { return; }
        // Get all thumbnails of pagination element
        var children = this._$pagination.children();
        // Unselect the thumbnail previously selected
        children.eq(from - 1).attr('aria-selected', false).removeClass('ch-carousel-selected');
        // Select the new thumbnail
        children.eq(to - 1).attr('aria-selected', true).addClass('ch-carousel-selected');
    };

    /**
     * Triggers all the necessary recalculations to be up-to-date.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.refresh = function () {

        var that = this,
            maskWidth = ch.util.getOuterDimensions(this._$mask[0]).width;

        // Check for changes on the width of mask, for the elastic carousel
        // Update the width of the mask
        if (maskWidth !== this._maskWidth) {
            // Update the global reference to the with of the mask
            this._maskWidth = maskWidth;
            // Calculate items per page and calculate pages, only when the amount of items was changed
            this._updateLimitPerPage();
            // Update the margin between items and its size
            this._updateDistribution();

            /**
             * Event emitted when the component makes all the necessary recalculations to be up-to-date.
             * @event ch.Carousel#refresh
             * @example
             * // Subscribe to "refresh" event.
             * carousel.on('refresh', function () {
             *     alert('Carousel was refreshed.');
             * });
             */
            this.emit('refresh');
        }

        // Check for a change in the total amount of items
        // Update items collection
        if (this._$list.children().length !== this._$items.length) {
            // Update the entire reference to items
            this._$items = this._$list.children();
            // Calculates the total amount of pages and executes internal methods
            this._updatePages();
            // Go to the last page in case that the current page no longer exists
            if (this._currentPage > this._pages) {
                this._standbyFX(function () {
                    that.select(that._pages);
                });
            }

            /**
             * Event emitted when the component makes all the necessary recalculations to be up-to-date.
             * @event ch.Carousel#refresh
             * @ignore
             */
            this.emit('refresh');
        }

        return this;
    };

    /**
     * Moves the list to the specified page.
     * @memberof! ch.Carousel.prototype
     * @function
     * @param {Number} page Reference of page where the list has to move.
     * @returns {carousel}
     */
    Carousel.prototype.select = function (page) {
        // Getter
        if (page === undefined) {
            return this._currentPage;
        }

        // Avoid to move if it's disabled
        // Avoid to select the same page that is selected yet
        // Avoid to move beyond first and last pages
        if (!this._enabled || page === this._currentPage || page < 1 || page > this._pages) {
            return this;
        }

        // Perform these tasks in the following order:
        // Task 1: Move the list from 0 (zero), to page to move (page number beginning in zero)
        this._translate(-this._pageWidth * (page - 1));
        // Task 2: Update selected thumbnail on pagination
        this._switchPagination(this._currentPage, page);
        // Task 3: Update value of current page
        this._currentPage = page;
        // Task 4: Check for arrows behavior on first, last and middle pages
        this._updateArrows();
        // Task 5: Add items to the list, if it's necessary
        this._loadAsyncItems();

        /**
         * Event emitted when the component moves to another page.
         * @event ch.Carousel#select
         * @example
         * // Subscribe to "select" event.
         * carousel.on('select', function () {
         *     alert('Carousel was moved.');
         * });
         */
        this.emit('select');

        return this;
    };

    /**
     * Moves the list to the previous page.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.prev = function () {

        this.select(this._currentPage - 1);

        /**
         * Event emitted when the component moves to the previous page.
         * @event ch.Carousel#prev
         * @example
         * carousel.on('prev', function () {
         *     alert('Carousel has moved to the previous page.');
         * });
         */
        this.emit('prev');

        return this;
    };

    /**
     * Moves the list to the next page.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.next = function () {

        this.select(this._currentPage + 1);

        /**
         * Event emitted when the component moves to the next page.
         * @event ch.Carousel#next
         * @example
         * carousel.on('next', function () {
         *     alert('Carousel has moved to the next page.');
         * });
         */
        this.emit('next');

        return this;
    };

    /**
     * Enables a Carousel instance.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.enable = function () {

        this._el.setAttribute('aria-disabled', false);

        this._disableArrows(false, false);

        parent.enable.call(this);

        return this;
    };

    /**
     * Disables a Carousel instance.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.disable = function () {

        this._el.setAttribute('aria-disabled', true);

        this._disableArrows(true, true);

        parent.disable.call(this);

        return this;
    };

    /**
     * Destroys a Carousel instance.
     * @memberof! ch.Carousel.prototype
     * @function
     */
    Carousel.prototype.destroy = function () {

        this._el.parentNode.replaceChild(this._snippet, this._el);

        $(window.document).trigger(ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    ch.factory(Carousel);

}(this, this.ch.$, this.ch));

(function (window, $, ch) {
    'use strict';

    function normalizeOptions(options) {
        var num = window.parseInt(options, 10);

        if (!window.isNaN(num)) {
            options = {
                'max': num
            };
        }

        return options;
    }

    /**
     * Countdown counts the maximum of characters that user can enter in a form control. Countdown could limit the possibility to continue inserting charset.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Countdown.
     * @param {Object} [options] Options to customize an instance.
     * @param {Number} [options.max] Number of the maximum amount of characters user can input in form control. Default: 500.
     * @param {String} [options.plural] Message of remaining amount of characters, when it's different to 1. The variable that represents the number to be replaced, should be a hash. Default: "# characters left.".
     * @param {String} [options.singular] Message of remaining amount of characters, when it's only 1. The variable that represents the number to be replaced, should be a hash. Default: "# character left.".
     * @returns {countdown} Returns a new instance of Countdown.
     * @example
     * // Create a new Countdown.
     * var countdown = new ch.Countdown($el, [options]);
     * @example
     * // Create a new Countdown with jQuery or Zepto.
     * var countdown = $(selector).countdown();
     * @example
     * // Create a new Countdown with custom options.
     * var countdown = $(selector).countdown({
     *     'max': 250,
     *     'plural': 'Left: # characters.',
     *     'singular': 'Left: # character.'
     * });
     * @example
     * // Create a new Countdown using the shorthand way (max as parameter).
     * $(selector).countdown(500);
     */
    function Countdown($el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        that._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Countdown is created.
             * @memberof! ch.Countdown.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Countdown#ready
         * @example
         * // Subscribe to "ready" event.
         * countdown.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit("ready"); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Countdown, ch.Component);

    /**
     * The name of the component.
     * @memberof! ch.Countdown.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var countdown = $(selector).data('countdown');
     */
    Countdown.prototype.name = 'countdown';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Countdown.prototype
     * @function
     */
    Countdown.prototype.constructor = Countdown;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Countdown.prototype._defaults = {
        'plural': '# characters left.',
        'singular': '# character left.',
        'max': 500
    };

    /**
     * Initialize a new instance of Countdown and merge custom options with defaults options.
     * @memberof! ch.Countdown.prototype
     * @function
     * @private
     * @returns {countdown}
     */
    Countdown.prototype._init = function ($el, options) {
        // Call to its parent init method
        parent._init.call(this, $el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,

            /**
             * Create the "id" attribute.
             * @type {String}
             * @private
             */
            messageID = 'ch-countdown-message-' + that.uid,

           /**
             * Singular or Plural message depending on amount of remaining characters.
             * @type {String}
             * @private
             */
            message;

        /**
         * The countdown trigger.
         * @type {(jQuerySelector | ZeptoSelector)}
         * @example
         * // Gets the countdown trigger.
         * countdown.$trigger;
         */
        this.$trigger = this._$el.on('keyup.countdown keypress.countdown keydown.countdown paste.countdown cut.countdown input.countdown', function () { that._count(); });

        /**
         * Amount of free characters until full the field.
         * @type {Number}
         * @private
         */
        that._remaining = that._options.max - that._contentLength();

        // Update the message
        message = ((that._remaining === 1) ? that._options.singular : that._options.plural);

        /**
         * The countdown container.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        that.$container = $('<p class="ch-countdown ch-form-hint" id="' + messageID + '">' + message.replace('#', that._remaining) + '</p>').appendTo(that._$el.parent());

        this.on('disable', this._removeError);

        return this;
    };

    /**
     * Returns the length of value.
     * @function
     * @private
     * @returns {Number}
     */
    Countdown.prototype._contentLength = function () {
        return this._el.value.length;
    };

    /**
     * Process input of data on form control and updates remaining amount of characters or limits the content length. Also, change the visible message of remaining characters.
     * @function
     * @private
     * @returns {countdown}
     */
    Countdown.prototype._count = function () {

        if (!this._enabled) {
            return this;
        }

        var length = this._contentLength(),
            message;

        this._remaining = this._options.max - length;

        // Limit Count alert the user
        if (length <= this._options.max) {

            if (this._exceeded) {
                // Update exceeded flag
                this._exceeded = false;
                this._removeError();
            }

        } else if (length > this._options.max) {

            /**
             * Event emitted when the lenght of characters is exceeded.
             * @event ch.Countdown#exceed
             * @example
             * // Subscribe to "exceed" event.
             * countdown.on('exceed', function () {
             *     // Some code here!
             * });
             */
            this.emit('exceed');

            // Update exceeded flag
            this._exceeded = true;

            this.$trigger
                .addClass('ch-validation-error')
                .attr('aria-invalid', 'true');

            this.$container.addClass('ch-countdown-exceeded');
        }

        // Change visible message of remaining characters
        // Singular or Plural message depending on amount of remaining characters
        message = (this._remaining !== 1 ? this._options.plural : this._options.singular).replace(/\#/g, this._remaining);

        // Update DOM text
        this.$container.text(message);

        return this;

    };

     /**
     * Process input of data on form control and updates remaining amount of characters or limits the content length. Also, change the visible message of remaining characters.
     * @function
     * @private
     * @returns {countdown}
     */
    Countdown.prototype._removeError = function () {
        this.$trigger
            .removeClass('ch-validation-error')
            .attr('aria-invalid', 'false');

        this.$container.removeClass('ch-countdown-exceeded');

        return this;
    };

    /**
     * Destroys a Countdown instance.
     * @memberof! ch.Countdown.prototype
     * @function
     * @example
     * // Destroy a countdown
     * countdown.destroy();
     * // Empty the countdown reference
     * countdown = undefined;
     */
    Countdown.prototype.destroy = function () {

        this.$trigger.off('.countdown');

        this.$container.remove();

        $(window.document).trigger(ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    // Factorize
    ch.factory(Countdown, normalizeOptions);

}(this, this.ch.$, this.ch));
(function (window, $, ch) {
    'use strict';

    /**
     * Datepicker lets you select dates.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Calendar
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Datepicker.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.format] Sets the date format. Default: "DD/MM/YYYY".
     * @param {String} [options.selected] Sets a date that should be selected by default. Default: "today".
     * @param {String} [options.from] Set a minimum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @param {String} [options.to] Set a maximum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @param {Array} [options.monthsNames] A collection of months names. Default: ["Enero", ... , "Diciembre"].
     * @param {Array} [options.weekdays] A collection of weekdays. Default: ["Dom", ... , "Sab"].
     * @param {Boolean} [conf.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointers".
     * @param {(jQuerySelector | ZeptoSelector)} [options.context] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally.
     * @param {Number} [options.offsetY] Distance to displace the target vertically.
     * @param {String} [options.position] The type of positioning used. You must use: "absolute" or "fixed". Default: "absolute".
     * @returns {datepicker} Returns a new instance of Datepicker.
     * @example
     * // Create a new Datepicker.
     * var datepicker = new ch.Datepicker($el, [options]);
     * @example
     * // Create a new Datepicker with jQuery or Zepto.
     * var datepicker = $(selector).datepicker();
     * @example
     * // Create a new Datepicker with custom options.
     * var datepicker = $(selector).datepicker({
     *     "format": "MM/DD/YYYY",
     *     "selected": "2011/12/25",
     *     "from": "2010/12/25",
     *     "to": "2012/12/25",
     *     "monthsNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
     *     "weekdays": ["Su", "Mo", "Tu", "We", "Thu", "Fr", "Sa"]
     * });
     */
    function Datepicker($el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Datepicker is created.
             * @memberof! ch.Datepicker.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Datepicker#ready
         * @example
         * // Subscribe to "ready" event.
         * datepicker.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Datepicker, ch.Component),
        // Creates methods enable and disable into the prototype.
        methods = ['enable', 'disable'],
        len = methods.length;

    function createMethods(method) {
        Datepicker.prototype[method] = function () {

            this._popover[method]();

            parent[method].call(this);

            return this;
        };
    }

    /**
     * The name of the component.
     * @memberof! ch.Datepicker.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var datepicker = $(selector).data('datepicker');
     */
    Datepicker.prototype.name = 'datepicker';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Datepicker.prototype
     * @function
     */
    Datepicker.prototype.constructor = Datepicker;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Datepicker.prototype._defaults = {
        'format': 'DD/MM/YYYY',
        'side': 'bottom',
        'align': 'center',
        'hiddenby': 'pointers'
    };

    /**
     * Initialize a new instance of Datepicker and merge custom options with defaults options.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @private
     * @returns {datepicker}
     */
    Datepicker.prototype._init = function ($el, options) {
        // Call to its parent init method
        parent._init.call(this, $el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * The datepicker input field.
         * @type {HTMLElement}
         */
        this.field = this._el;

        /**
         * The datepicker trigger.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$trigger = $('<i role="button" class="ch-datepicker-trigger ch-icon-calendar"></i>').insertAfter(this.field);

        /**
         * Reference to the Calendar component instanced.
         * @type {ch.Calendar}
         * @private
         */
        this._calendar = $('<div>').calendar(options);

        /**
         * Reference to the Popover component instanced.
         * @type {ch.Popover}
         * @private
         */
        this._popover = this.$trigger.popover({
            '_className': 'ch-datepicker ch-cone',
            '_ariaRole': 'tooltip',
            'content': this._calendar.$container,
            'side': this._options.side,
            'align': this._options.align,
            'offsetX': 1,
            'offsetY': 10,
            'shownby': 'pointertap',
            'hiddenby': this._options.hiddenby
        });

        this._popover._$content.on(ch.onpointertap, function (event) {
            var el = event.target;

            // Day selection
            if (el.nodeName === 'TD' && el.className.indexOf('ch-calendar-disabled') === -1 && el.className.indexOf('ch-calendar-other') === -1) {
                that.pick(el.innerHTML);
            }

        });

        this.field.setAttribute('aria-describedby', 'ch-popover-' + this._popover.uid);

        // Change type of input to "text"
        this.field.type = 'text';

        // Change value of input if there are a selected date
        this.field.value = (this._options.selected) ? this._calendar.select() : this.field.value;

        // Hide popover
        this.on('disable', this.hide);

        return this;
    };

    /**
     * Shows the datepicker.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Shows a datepicker.
     * datepicker.show();
     */
    Datepicker.prototype.show = function () {

        if (!this._enabled) {
            return this;
        }

        this._popover.show();

        /**
         * Event emitted when a datepicker is shown.
         * @event ch.Datepicker#show
         * @example
         * // Subscribe to "show" event.
         * datepicker.on('show', function () {
         *     // Some code here!
         * });
         */
        this.emit('show');

        return this;
    };

    /**
     * Hides the datepicker.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Shows a datepicker.
     * datepicker.hide();
     */
    Datepicker.prototype.hide = function () {
        this._popover.hide();

        /**
         * Event emitted when a datepicker is hidden.
         * @event ch.Datepicker#hide
         * @example
         * // Subscribe to "hide" event.
         * datepicker.on('hide', function () {
         *     // Some code here!
         * });
         */
        this.emit('hide');

        return this;
    };

    /**
     * Selects a specific day into current month and year.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @private
     * @param {(String | Number)} day A given day to select.
     * @returns {datepicker}
     * @example
     * // Select a specific day.
     * datepicker.pick(28);
     */
    Datepicker.prototype.pick = function (day) {

        // Select the day and update input value with selected date
        this.field.value = [this._calendar._dates.current.year, this._calendar._dates.current.month, day].join('/');

        // Hide float
        this._popover.hide();

        // Select a date
        this.select(this.field.value);

        return this;
    };

    /**
     * Selects a specific date or returns the selected date.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @param {String} [date] A given date to select. The format of the given date should be "YYYY/MM/DD".
     * @returns {(datepicker | String)}
     * @example
     * // Returns the selected date.
     * datepicker.select();
     * @example
     * // Select a specific date.
     * datepicker.select('2014/05/28');
     */
    Datepicker.prototype.select = function (date) {

       // Setter
       // Select the day and update input value with selected date
        if (date) {
            this._calendar.select(date);
            this.field.value = this._calendar.select();

            /**
             * Event emitted when a date is selected.
             * @event ch.Datepicker#select
             * @example
             * // Subscribe to "select" event.
             * datepicker.on('select', function () {
             *     // Some code here!
             * });
             */
            this.emit('select');

            return this;
        }

        // Getter
        return this._calendar.select();
    };

    /**
     * Returns date of today
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {String} The date of today
     * @example
     * // Get the date of today.
     * var today = datepicker.getToday();
     */
    Datepicker.prototype.getToday = function () {
        return this._calendar.getToday();
    };

    /**
     * Moves to the next month.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Moves to the next month.
     * datepicker.nextMonth();
     */
    Datepicker.prototype.nextMonth = function () {
        this._calendar.nextMonth();

        /**
         * Event emitted when a next month is shown.
         * @event ch.Datepicker#nextmonth
         * @example
         * // Subscribe to "nextmonth" event.
         * datepicker.on('nextmonth', function () {
         *     // Some code here!
         * });
         */
        this.emit('nextmonth');

        return this;
    };

    /**
     * Move to the previous month.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Moves to the prev month.
     * datepicker.prevMonth();
     */
    Datepicker.prototype.prevMonth = function () {

        this._calendar.prevMonth();

        /**
         * Event emitted when a previous month is shown.
         * @event ch.Datepicker#prevmonth
         * @example
         * // Subscribe to "prevmonth" event.
         * datepicker.on('prevmonth', function () {
         *     // Some code here!
         * });
         */
        this.emit('prevmonth');

        return this;
    };

    /**
     * Move to the next year.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Moves to the next year.
     * datepicker.nextYear();
     */
    Datepicker.prototype.nextYear = function () {

        this._calendar.nextYear();

        /**
         * Event emitted when a next year is shown.
         * @event ch.Datepicker#nextyear
         * @example
         * // Subscribe to "nextyear" event.
         * datepicker.on('nextyear', function () {
         *     // Some code here!
         * });
         */
        this.emit('nextyear');

        return this;
    };

    /**
     * Move to the previous year.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Moves to the prev year.
     * datepicker.prevYear();
     */
    Datepicker.prototype.prevYear = function () {

        this._calendar.prevYear();

        /**
         * Event emitted when a previous year is shown.
         * @event ch.Datepicker#prevyear
         * @example
         * // Subscribe to "prevyear" event.
         * datepicker.on('prevyear', function () {
         *     // Some code here!
         * });
         */
        this.emit('prevyear');

        return this;
    };

    /**
     * Reset the Datepicker to date of today
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Resset the datepicker
     * datepicker.reset();
     */
    Datepicker.prototype.reset = function () {

        // Delete input value
        this.field.value = '';
        this._calendar.reset();

        /**
         * Event emitter when the datepicker is reseted.
         * @event ch.Datepicker#reset
         * @example
         * // Subscribe to "reset" event.
         * datepicker.on('reset', function () {
         *     // Some code here!
         * });
         */
        this.emit('reset');

        return this;
    };

    /**
     * Set a minimum selectable date.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @param {String} date A given date to set as minimum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @returns {datepicker}
     * @example
     * // Set a minimum selectable date.
     * datepicker.setFrom('2010/05/28');
     */
    Datepicker.prototype.setFrom = function (date) {
        this._calendar.setFrom(date);

        return this;
    };

    /**
     * Set a maximum selectable date.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @param {String} date A given date to set as maximum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @returns {datepicker}
     * @example
     * // Set a maximum selectable date.
     * datepicker.setTo('2014/05/28');
     */
    Datepicker.prototype.setTo = function (date) {
        this._calendar.setTo(date);

        return this;
    };

    /**
     * Enables an instance of Datepicker.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker} Returns an instance of Datepicker.
     * @example
     * // Enabling an instance of Datepicker.
     * datepicker.enable();
     */

    /**
     * Disables an instance of Datepicker.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker} Returns an instance of Datepicker.
     * @example
     * // Disabling an instance of Datepicker.
     * datepicker.disable();
     */
    while (len) {
        createMethods(methods[len -= 1]);
    }

    /**
     * Destroys a Datepicker instance.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @example
     * // Destroying an instance of Datepicker.
     * datepicker.destroy();
     */
    Datepicker.prototype.destroy = function () {

        this.$trigger.remove();

        this._el.removeAttribute('aria-describedby');
        this._el.type = 'date';

        this._popover.destroy();

        parent.destroy.call(this);
    };

    // Factorize
    ch.factory(Datepicker);

}(this, this.ch.$, this.ch));
(function (window, $, ch) {
    'use strict';

    /**
     * Autocomplete Component shows a list of suggestions for a HTMLInputElement.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Popover
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Autocomplete.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.loadingClass] Default: "ch-autocomplete-loading".
     * @param {String} [options.highlightedClass] Default: "ch-autocomplete-highlighted".
     * @param {String} [options.itemClass] Default: "ch-autocomplete-item".
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization. Default: "ch-box-lite ch-autocomplete".
     * @param {Number} [options.keystrokesTime] Default: 150.
     * @param {Boolean} [options.html] Default: false.
     * @param {String} [options.side] The side option where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "left".
     * @param {Number} [options.offsetX] The offsetX option specifies a distance to displace the target horitontally.
     * @param {Number} [options.offsetY] The offsetY option specifies a distance to displace the target vertically.
     * @param {String} [options.positioned] The positioned option specifies the type of positioning used. You must use: "absolute" or "fixed". Default: "absolute".
     * @returns {autocomplete}
     * @example
     * // Create a new AutoComplete.
     * var autocomplete = new AutoComplete($el, [options]);
     * @example
     * // Create a new AutoComplete with configuration.
     * var autocomplete = new AutoComplete($el, {
     *  'loadingClass': 'custom-loading',
     *  'highlightedClass': 'custom-highlighted',
     *  'itemClass': 'custom-item',
     *  'addClass': 'carousel-cities',
     *  'keystrokesTime': 600,
     *  'html': true,
     *  'side': 'center',
     *  'align': 'center',
     *  'offsetX': 0,
     *  'offsetY': 0,
     *  'positioned': 'fixed'
     * });
     */
    function Autocomplete($el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Autocomplete is created.
             * @memberof! ch.Autocomplete.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Autocomplete#ready
         * @example
         * // Subscribe to "ready" event.
         * autocomplete.on('ready',function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);

        return this;

    }

    // Inheritance
    var parent = ch.util.inherits(Autocomplete, ch.Component);

    /**
     * The name of the component.
     * @type {String}
     */
    Autocomplete.prototype.name = 'autocomplete';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Autocomplete.prototype
     * @function
     */
    Autocomplete.prototype.constructor = Autocomplete;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Autocomplete.prototype._defaults = {
        'loadingClass': 'ch-autocomplete-loading',
        'highlightedClass': 'ch-autocomplete-highlighted',
        'itemClass': 'ch-autocomplete-item',
        'addClass': 'ch-box-lite ch-autocomplete',
        'side': 'bottom',
        'align': 'left',
        'html': false,
        '_hiddenby': 'none',
        'keystrokesTime': 150,
        '_itemTemplate': '<li class="{{itemClass}}"{{suggestedData}}>{{term}}<i class="ch-icon-arrow-up" data-js="ch-autocomplete-complete-query"></i></li>'
    };

    /**
     * Initialize a new instance of Autocomplete and merge custom options with defaults options.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._init = function ($el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            POINTERDOWN = 'mousedown' + '.' + this.name,
            MOUSEENTER = 'mouseover' + '.' + this.name,
            // there is no mouseenter to highlight the item, so it happens when the user do mousedown
            highlightEvent = (ch.support.touch) ? POINTERDOWN : MOUSEENTER;

        // Call to its parent init method
        parent._init.call(this, $el, options);

        // creates the basic item template for this instance
        this._options._itemTemplate = this._options._itemTemplate.replace('{{itemClass}}', this._options.itemClass);

        if (this._options.html) {
            // remove the suggested data space when html is configured
            this._options._itemTemplate = this._options._itemTemplate.replace('{{suggestedData}}', '');
        }

        /**
         * The autocomplete suggestion list.
         * @type {(jQuerySelector | ZeptoSelector)}
         * @private
         */
        this._$suggestionsList = $('<ul class="ch-autocomplete-list"></ul>');

        // The component who shows and manage the suggestions.
        this._popover = $.popover({
            'reference': this._$el,
            'content': this._$suggestionsList,
            'side': this._options.side,
            'align': this._options.align,
            'addClass': this._options.addClass,
            'hiddenby': this._options._hiddenby,
            'width': this._el.getBoundingClientRect().width + 'px',
            'fx': this._options.fx
        });
        /**
         * The autocomplete container.
         * @type {(jQuerySelector | ZeptoSelector)}
         * @example
         * // Gets the autocomplete container to append or prepend content.
         * autocomplete.$container.append('&lt;button&gt;Hide Suggestions&lt;/button&gt;');
         */
        this.$container = this._popover.$container.attr('aria-hidden', 'true')
            .on(highlightEvent, function (event) {
                that._highlightSuggestion($(event.target));
            })
            .on(POINTERDOWN, function (event) {

                // completes the value, it is a shortcut to avoid write the complete word
                if (event.target.nodeName === 'I' && !that._options.html) {
                    ch.util.prevent(event);
                    that._el.value = that._suggestions[that._highlighted];
                    that.emit('type', that._el.value);
                    return;
                }

                if ((event.target.nodeName === 'LI' && event.target.className.indexOf(that._options.itemClass) !== -1) || (event.target.parentElement.nodeName === 'LI' && event.target.parentElement.className.indexOf(that._options.itemClass) !== -1)) {
                    that._selectSuggestion();
                }
            });

        /**
         * The autocomplete trigger.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$trigger = this._$el
            .attr({
                'aria-autocomplete': 'list',
                'aria-haspopup': 'true',
                'aria-owns': this.$container[0].id,
                'autocomplete': 'off'
            })
            .on('focus.' + this.name, function () {
                that._turnOn();
            })
            .on('blur.' + this.name, function () {
                that._turnOff();
            });

        // The number of the selected item or null when no selected item is.
        this._highlighted = null;

        // Collection of suggestions to be shown.
        this._suggestions = [];

        // Used to show when the user cancel the suggestions
        this._originalQuery = this._currentQuery = this._el.value;

        if (this._configureShortcuts !== undefined) {
            this._configureShortcuts();
        }

        return this;
    };

    /**
     * Turns on the ability off listen the keystrokes
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._turnOn = function () {

        if (!this._enabled) {
            return this;
        }

        var that = this;

        this._originalQuery = this._el.value;

        this.$trigger.on(ch.onkeyinput, function () {

            // .trim()
            that._currentQuery = that._el.value.replace(/^\s+|\s+$/g, '');

            if (that._currentQuery === '') {
                return that.hide();
            }

            // when the user writes
            window.clearTimeout(that._stopTyping);

            that._stopTyping = window.setTimeout(function () {
                that.$trigger.addClass(that._options.loadingClass);
                /**
                 * Event emitted when the user is typing.
                 * @event ch.Autocomplete#type
                 * @example
                 * // Subscribe to "type" event with ajax call
                 * autocomplete.on('type', function (userInput) {
                 *      $.ajax({
                 *          'url': '/countries?q=' + userInput,
                 *          'dataType': 'json',
                 *          'success': function (response) {
                 *              autocomplete.suggest(response);
                 *          }
                 *      });
                 * });
                 * @example
                 * // Subscribe to "type" event with jsonp
                 * autocomplete.on('type', function (userInput) {
                 *       $.ajax({
                 *           'url': '/countries?q='+ userInput +'&callback=parseResults',
                 *           'dataType': 'jsonp',
                 *           'cache': false,
                 *           'global': true,
                 *           'context': window,
                 *           'jsonp': 'parseResults',
                 *           'crossDomain': true
                 *       });
                 * });
                 */
                that.emit('type', that._currentQuery);
            }, that._options.keystrokesTime);

        });

        return this;

    };

    /**
     * Turns off the ability off listen the keystrokes
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._turnOff = function () {

        if (!this._enabled) {
            return this;
        }

        this.hide();

        this.$trigger.off(ch.onkeyinput);

        return this;
    };

    /**
     * It sets to the HTMLInputElement the selected query and it emits a 'select' event.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._selectSuggestion = function () {

        window.clearTimeout(this._stopTyping);

        if (this._highlighted === null) {
            return this;
        }

        if (!this._options.html) {
            this._el.value = this._suggestions[this._highlighted];
        }

        this._el.blur();

        /**
         * Event emitted when a suggestion is selected.
         * @event ch.Autocomplete#select
         * @example
         * // Subscribe to "select" event.
         * autocomplete.on('select', function () {
         *     // Some code here!
         * });
         */
        this.emit('select');

        return this;
    };

    /**
     * Selects the items
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._highlightSuggestion = function ($target) {
        var $suggestion = $target.attr('aria-posinset') ? $target : $target.parents('li[aria-posinset]');

        // TODO: Documentation - Number or null
        this._highlighted = ($suggestion[0] !== undefined) ? (parseInt($suggestion.attr('aria-posinset'), 10) - 1) : null;

        this._toogleHighlighted();

        return this;
    };

    /**
     * It highlights the item adding the "ch-autocomplete-highlighted" class name or the class name that you configured as "highlightedClass" option.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._toogleHighlighted = function () {

        var id = '#' + this.$container[0].id,
            // null is when is not a selected item but,
            // increments 1 _highlighted because aria-posinset starts in 1 instead 0 as the collection that stores the data
            current = (this._highlighted === null) ? null : (this._highlighted + 1);

        // background the highlighted item
        $(id + ' [aria-posinset].' + this._options.highlightedClass).removeClass(this._options.highlightedClass);
        // highlight the selected item
        $(id + ' [aria-posinset="' + current + '"]').addClass(this._options.highlightedClass);

        return this;
    };

    /**
     * Add suggestions to be shown.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @returns {autocomplete}
     * @example
     * // The suggest method needs an Array of strings to work with default configuration
     * autocomplete.suggest(['Aruba','Armenia','Argentina']);
     * @example
     * // To work with html configuration, it needs an Array of strings. Each string must to be as you wish you watch it
     * autocomplete.suggest([
     *  '<strong>Ar</strong>uba <i class="flag-aruba"></i>',
     *  '<strong>Ar</strong>menia <i class="flag-armenia"></i>',
     *  '<strong>Ar</strong>gentina <i class="flag-argentina"></i>'
     * ]);
     */
    Autocomplete.prototype.suggest = function (suggestions) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            items = [],
            matchedRegExp = new RegExp('(' + this._currentQuery.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1") + ')', 'ig'),
            totalItems = 0,
            $items,
            itemTemplate = this._options._itemTemplate,
            suggestedItem,
            term,
            suggestionsLength = suggestions.length,
            el;

        // hide the loading feedback
        this.$trigger.removeClass(that._options.loadingClass);

        // hides the suggestions list
        if (suggestionsLength === 0) {
            this._popover.hide();

            return this;
        }

        // shows the suggestions list when the is closed and the element is withs focus
        if (!this._popover.isShown() && window.document.activeElement === this._el) {
            this._popover.show();
        }

        // remove the class from the extra added items
        $('.' + this._options.highlightedClass, this.$container).removeClass(this._options.highlightedClass);

        // add each suggested item to the suggestion list
        for (suggestedItem = 0; suggestedItem < suggestionsLength; suggestedItem += 1) {
            // get the term to be replaced
            term = suggestions[suggestedItem];

            // for the html configured component doesn't highlight the term matched it must be done by the user
            if (!that._options.html) {
                term = term.replace(matchedRegExp, '<strong>$1</strong>');
                itemTemplate = this._options._itemTemplate.replace('{{suggestedData}}', ' data-suggested="' + suggestions[suggestedItem] + '"');
            }

            items.push(itemTemplate.replace('{{term}}', term));
        }

        this._$suggestionsList[0].innerHTML = items.join('');

        $items = $('.' + this._options.itemClass, this.$container);

        // with this we set the aria-setsize value that counts the total
        totalItems = $items.length;

        // Reset suggestions collection.
        this._suggestions.length = 0;

        for (suggestedItem = 0; suggestedItem < totalItems; suggestedItem += 1) {
            el = $items[suggestedItem];

            // add the data to the suggestions collection
            that._suggestions.push(el.getAttribute('data-suggested'));

            el.setAttribute('aria-posinset', that._suggestions.length);
            el.setAttribute('aria-setsize', totalItems);
        }

        this._highlighted = null;

        this._suggestionsQuantity = this._suggestions.length;

        return this;
    };

    /**
     * Hides component's container.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @returns {autocomplete}
     * @example
     * // Hides the autocomplete.
     * autocomplete.hide();
     */
    Autocomplete.prototype.hide = function () {

        if (!this._enabled) {
            return this;
        }

        this._popover.hide();

        /**
         * Event emitted when the Autocomplete container is hidden.
         * @event ch.Autocomplete#hide
         * @example
         * // Subscribe to "hide" event.
         * autocomplete.on('hide', function () {
         *  // Some code here!
         * });
         */
        this.emit('hide');

        return this;
    };

    /**
     * Returns a Boolean if the component's core behavior is shown. That means it will return 'true' if the component is on and it will return false otherwise.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @returns {Boolean}
     * @example
     * // Execute a function if the component is shown.
     * if (autocomplete.isShown()) {
     *     fn();
     * }
     */
    Autocomplete.prototype.isShown = function () {
        return this._popover.isShown();
    };

    Autocomplete.prototype.disable = function () {
        if (this.isShown()) {
            this.hide();
            this._el.blur();
        }

        parent.disable.call(this);

        return this;
    };

    /**
     * Destroys an Autocomplete instance.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @example
     * // Destroying an instance of Autocomplete.
     * autocomplete.destroy();
     */
    Autocomplete.prototype.destroy = function () {

        this.$trigger
            .off('.' + this.name)
            .removeAttr('autocomplete aria-autocomplete aria-haspopup aria-owns');

        this._popover.destroy();

        parent.destroy.call(this);

        return;
    };

    ch.factory(Autocomplete);

}(this, this.ch.$, this.ch));

(function (Autocomplete, ch) {
    'use strict';
    /**
     * Congfigure shortcuts to navigate and set values, or cancel the typed text
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._configureShortcuts = function () {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        // Shortcuts
        ch.shortcuts.add(ch.onkeyenter, this.uid, function (event) {
            ch.util.prevent(event);
            that._selectSuggestion();
        });

        ch.shortcuts.add(ch.onkeyesc, this.uid, function () {
            that.hide();
            that._el.value = that._originalQuery;
        });

        ch.shortcuts.add(ch.onkeyuparrow, this.uid, function (event) {
            ch.util.prevent(event);

            var value;

            // change the selected value & stores the future HTMLInputElement value
            if (that._highlighted === null) {

                that._highlighted = that._suggestionsQuantity - 1;
                value = that._suggestions[that._highlighted];

            } else if (that._highlighted <= 0) {

                this._prevHighlighted = this._currentHighlighted = null;
                value = that._currentQuery;

            } else {

                that._highlighted -= 1;
                value = that._suggestions[that._highlighted];

            }

            that._toogleHighlighted();

            if (!that._options.html) {
                that._el.value = value;
            }

        });

        ch.shortcuts.add(ch.onkeydownarrow, this.uid, function () {
            var value;

            // change the selected value & stores the future HTMLInputElement value
            if (that._highlighted === null) {

                that._highlighted = 0;

                value = that._suggestions[that._highlighted];

            } else if (that._highlighted >= that._suggestionsQuantity - 1) {

                that._highlighted = null;
                value = that._currentQuery;

            } else {

                that._highlighted += 1;
                value = that._suggestions[that._highlighted];

            }

            that._toogleHighlighted();

            if (!that._options.html) {
                that._el.value = value;
            }

        });

        // Activate the shortcuts for this instance
        this._popover.on('show', function () { ch.shortcuts.on(that.uid); });

        // Deactivate the shortcuts for this instance
        this._popover.on('hide', function () { ch.shortcuts.off(that.uid); });

        this.on('destroy', function () {
            ch.shortcuts.remove(this.uid);
        });

        return this;
    };

}(this.ch.Autocomplete, this.ch));