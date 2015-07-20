    /**
     * Provides varies utilities and commons functions that are used across all components.
     * @namespace ch.util
     */
    ch.util = {

        /**
         * Returns true if an object is an array, false if it is not.
         *
         * @memberof ch.util
         * @method
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
         *
         * @memberof ch.util
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
         * Detects an Internet Explorer and returns the version if so.
         *
         * @memberof ch.util
         * @see From <a href="https://github.com/ded/bowser/blob/master/bowser.js">bowser</a>
         * @returns {Boolean|Number}
         */
        'isMsie': function() {
            return (/(msie|trident)/i).test(navigator.userAgent) ?
                navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
        },

        /**
         * Adds CSS rules to disable text selection highlighting.
         *
         * @memberof ch.util
         * @param {HTMLElement} HTMLElement to disable text selection highlighting.
         * @example
         * ch.util.avoidTextSelection(document.querySelector('.menu nav'), document.querySelector('.menu ol'));
         */
        'avoidTextSelection': function () {
            var args = arguments,
                len = arguments.length,
                i = 0;

            if (arguments.length < 1) {
                throw new Error('"ch.util.avoidTextSelection(HTMLElement);": At least one Element is required.');
            }

            for (i; i < len; i += 1) {

                if (ch.util.classList(html).contains('lt-ie10')) {
                    args[i].setAttribute('unselectable', 'on');

                } else {
                    ch.util.classList(args[i]).add('ch-user-no-select');
                }

            }
        },

        /**
         * Gives the final used values of all the CSS properties of an element.
         *
         * @memberof ch.util
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
         *
         * @memberof ch.util
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
         *
         * @memberof ch.util
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
            obj.prototype = ch.util.extend(child, superConstructor.prototype);

            return superConstructor.prototype;
        },

        /**
         * Prevent default actions of a given event.
         *
         * @memberof ch.util
         * @param {Event} event The event ot be prevented.
         * @returns {Object}
         * @example
         * ch.util.prevent(event);
         */
        prevent: function (event) {
            if (typeof event === 'object' && event.preventDefault) {
                event.preventDefault();
            } else {
                return false;
            }
        },

        /**
         * Get the current vertical and horizontal positions of the scroll bar.
         *
         * @memberof ch.util
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
         *
         * @memberof ch.util
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
         *
         * @memberof ch.util
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
         *
         * @memberof ch.util
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
         *
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
        'zIndex': 1000,

        /**
         * Add or remove class
         *
         * @name classList
         * @memberof ch.util
         * @param {HTMLElement} el A given HTMLElement.
         * @see Based on: <a href="http://youmightnotneedjquery.com/" target="_blank">http://youmightnotneedjquery.com/</a>
         * @example
         * ch.util.classList(document.body).add('ch-example');
         */
        'classList': function (el) {
            var isClassList = el.classList;

            return {
                'add': function add(className) {
                    if (isClassList) {
                        el.classList.add(className);
                    } else {
                        el.setAttribute('class', el.getAttribute('class') + ' ' + className);
                    }
                },
                'remove': function remove(className) {
                    if (isClassList) {
                        el.classList.remove(className)
                    } else {
                        el.setAttribute('class', el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '));
                    }
                },
                'contains': function contains(className) {
                    var exist;
                    if (isClassList) {
                        exist = el.classList.contains(className);
                    } else {
                        exist = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
                    }
                    return exist;
                }
            }
        },

        /**
         * Extends an object with other object
         *
         * @name extend
         * @memberof ch.util
         * @method
         * @param {Object} target The destination of the other objects
         * @param {Object} obj1 The objects to be merged
         * @param {Object} objn The objects to be merged
         * @see Based on: <a href="https://github.com/jquery" target="_blank">https://github.com/jquery/</a>
         * @example
         * ch.util.extend(target, obj1, objn);
         */
        'extend': function() {
            var options,
                name,
                src,
                copy,
                copyIsArray,
                clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if (typeof target === "boolean") {
                deep = target;

                // Skip the boolean and the target
                target = arguments[i] || {};
                i++;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && !typeof target === 'function') {
                target = {};
            }

            // Nothing to extend, return original object
            if (length <= i) {
                return target;
            }

            for (; i < length; i++) {
                // Only deal with non-null/undefined values
                if ((options = arguments[i]) != null) {
                    // Extend the base object
                    for ( name in options ) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if ( target === copy ) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && (ch.util.isPlainObject(copy) || (copyIsArray = ch.util.isArray(copy)) ) ) {

                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && ch.util.isArray(src) ? src : [];

                            } else {
                                clone = src && ch.util.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = ch.util.extend( deep, clone, copy );

                        // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        },

        'isPlainObject': function(obj) {
            // Not plain objects:
            // - Any object or value whose internal [[Class]] property is not "[object Object]"
            // - DOM nodes
            // - window
            if (typeof obj !== "object" || obj.nodeType || (obj != null && obj === obj.window)) {
                return false;
            }

            if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }

            // If the function hasn't returned already, we're confident that
            // |obj| is a plain object, created by {} or constructed with new Object
            return true;
        },

        // review this method :S
        'parentElement': function(el, tagname) {
            var parent = el.parentNode,
                tag = tagname ? tagname.toUpperCase() : tagname;

            if (parent === null) { return parent; }

            // IE8 and earlier don't define the node type constants, 1 === document.ELEMENT_NODE
            if (parent.nodeType !== 1) {
                return this.parentElement(parent, tag);
            }

            if (tagname !== undefined && parent.tagName === tag) {
                return parent;
            } else if (tagname !== undefined && parent.tagName !== tag) {
                return this.parentElement(parent, tag);
            } else if (tagname === undefined) {
                return parent;
            }

        },

        /**
         * IE8 safe method to get the next element sibling
         *
         * @memberof ch.util
         * @param {HTMLElement} el A given HTMLElement.
         * @returns {HTMLElement}
         * @example
         * ch.util.nextElementSibling(el);
         */
        'nextElementSibling': function(element) {
            function next(el) {
                do {
                    el = el.nextSibling;
                } while (el && el.nodeType !== 1);

                return el;
            }

            return element.nextElementSibling || next(element);
        },

        /**
         * JSONP handler based on Promises
         *
         * @memberof ch.util
         * @method
         * @param {String} url
         * @param {Object} [options] Optional options.
         * @param {String} [options.callback] Callback prefix. Default: "__jsonp"
         * @param {String} [options.param] QS parameter. Default: "callback"
         * @param {Number} [options.timeout] How long after the request until a timeout error
         *   will occur. Default: 15000
         *
         * @returns {Object} Returns a response promise and a cancel handler.
         *
         * @example
         * var req = ch.util.loadJSONP('http://suggestgz.mlapps.com/sites/MLA/autosuggest?q=smartphone&v=1');
         * req.promise
         *   .then(function(results){
         *     console.log(results)
         *   })
         *   .catch(function(err){
         *     console.error(err);
         *   });
         * if (something) {
         *   req.cancel();
         * }
         */
        loadJSONP: (function() {
            var noop = function() {},
                // document.head is not available in IE<9
                head = document.getElementsByTagName('head')[0],
                jsonpCount = 0;

            return function (url, options) {
                var script,
                    timer,
                    cleanup,
                    promise,
                    cancel;

                options = ch.util.extend({
                    prefix: '__jsonp',
                    param: 'callback',
                    timeout : 15000
                }, options);

                // Generate a unique id for the request.
                var id = options.prefix + (jsonpCount++);

                cleanup = function() {
                    // Remove the script tag.
                    if (script && script.parentNode) {
                        script.parentNode.removeChild(script);
                    }

                    window[id] = noop;

                    if (timer) {
                        clearTimeout(timer);
                    }
                };

                promise = new Promise(function(resolve, reject) {
                    if (options.timeout) {
                        timer = setTimeout(function() {
                            cleanup();
                            reject(new Error('Timeout'));
                        }, options.timeout);
                    }

                    window[id] = function(data) {
                        cleanup();
                        resolve(data);
                    };

                    // Add querystring component
                    url += (~url.indexOf('?') ? '&' : '?') + options.param + '=' + encodeURIComponent(id);
                    url = url.replace('?&', '?');

                    // Create script element
                    script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = url;
                    script.onerror = function(e) {
                        cleanup();
                        reject(new Error(e.message || 'Script Error'));
                    };
                    head.appendChild(script);

                    // TODO: move cancel fn definition outside of promise
                    cancel = function() {
                        if (window[id]) {
                            cleanup();
                            reject(new Error('Canceled'));
                        }
                    };
                });

                return {
                    promise: promise,
                    cancel: cancel
                };
            }
        })()
    };