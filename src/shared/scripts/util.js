    /**
     * Provides varies utilities and commons functions that are used across all components.
     * @namespace ch.util
     */
    ch.util = {

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

                if (ch.util.classList(document.documentElement).contains('lt-ie10')) {
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
         * tiny.clone(object);
         */
        'clone': function (obj) {
            if (obj === undefined || typeof obj !== 'object') {
                throw new Error('"tiny.clone(obj)": The "obj" parameter is required and must be a object.');
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
        }
    };