    /**
     * Provides varies utilities and commons functions that are used across all components.
     * @namespace ch.util
     */
    ch.util = {
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

            if (tiny.css(el, 'position') !== 'fixed' && fixedParent === null) {
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

                if (tiny.css(currentParent, 'position') !== position) {
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