    /**
     * An object which contains all the public members. A short alias for el.querySelectorAll
     * @param {String} selector Valid CSS selector expression
     * @param {String|HTMLElement} context A DOM Element, Document, or selector string to use as query context
     * @returns {NodeList} A collection of matched elements
     *
     * @namespace
     *
     * @example
     * // Get all first level headings
     * var headings = ch('h1');
     *
     * // Get a list of p children elements under a container, whose parent is a div that has the class 'wrapper'
     * var paragraphs = ch('p', ch('div.wrapper'));
     * // The same as above
     * var paragraphs = ch('p', 'div.wrapper');
     */
    /*eslint-disable no-unused-vars*/
    var ch = function(selector, context) {
        if (!context) {
            context = document;
        } else if (typeof context === 'string') {
            context = document.querySelector(context);
        }
        // Since NodeList is an array-like object but Array.isArray is always falsy
        // we should detect the NodeList
        // Please replace NodeList detection with `context instanceof NodeList && context.length > 0`
        //   when IE8 support will be dropped
        // Please replace Object.prototype.hasOwnProperty.call with `context.hasOwnProperty` when IE8
        //   support will be dropped
        if (typeof context === 'object' &&
            /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(context)) &&
            Object.prototype.hasOwnProperty.call(context, 'length') && context.length > 0 && context[0].nodeType > 0) {
            context = context[0];
        }

        if (context === null || !context.nodeType) {
            context = document;
        }

        return context.querySelectorAll(selector);
    };
    /*eslint-enable no-unused-vars*/
