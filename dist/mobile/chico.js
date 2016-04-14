/*!
 * Chico UI v2.0.4
 * http://chico-ui.com.ar/
 *
 * Copyright (c) 2016, MercadoLibre.com
 * Released under the MIT license.
 * http://chico-ui.com.ar/license
 */

(function (window) {
	'use strict';

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

    /**
     * Method in change of expose a friendly interface of the Chico constructors.
     *
     * @memberof ch
     * @param {Object} Klass Direct reference to the constructor from where the $-plugin will be created.
     * @link http://docs.jquery.com/Plugins/Authoring | Authoring
     */
    ch.factory = function (Klass) {
        /**
         * Identification of the constructor, in lowercases.
         * @type {String}
         */
        var name = Klass.prototype.name;

        // Uses the function.name property (non-standard) on the newest browsers OR
        // uppercases the first letter from the identification name of the constructor
        ch[(name.charAt(0).toUpperCase() + name.substr(1))] = Klass;
    };

    // Remove no-js classname
    tiny.removeClass(document.documentElement, 'no-js');

    // Expose event names
    for (var m in tiny) {
        if (/^on\w+/.test(m) && typeof tiny[m] === 'string') {
            ch[m] = tiny[m];
        }
    }

    // Iphone scale fix
    scaleFix();

    // Prevent zoom onfocus
    preventZoom();

    // Fix the broken iPad/iPhone form label click issue
    fixLabels();

    // Cancel pointers if the user scroll.
    cancelPointerOnScroll();

    var viewportmeta = document.querySelector('meta[name=viewport]');

    /**
     * Fixes the broken iPad/iPhone form label click issue.
     * @name fixLabels
     * @see Based on: <a href="http://www.quirksmode.org/dom/getstyles.html" target="_blank">http://www.quirksmode.org/dom/getstyles.html</a>
     */
    function fixLabels() {
        var labels = document.getElementsByTagName('label'),
            el,
            i = 0;

        function labelTap() {
            el = document.getElementById(this.getAttribute('for'));
            if (['radio', 'checkbox'].indexOf(el.getAttribute('type')) !== -1) {
                el.setAttribute('selected', !el.getAttribute('selected'));
            } else {
                el.focus();
            }
        }

        for (; labels[i]; i += 1) {
            if (labels[i].getAttribute('for')) {
                tiny.on(labels[i], ch.onpointertap, labelTap);
            }
        }
    }

    /**
     * Cancel pointers if the user scroll.
     * @name cancelPointerOnScroll
     */
    function cancelPointerOnScroll() {

        function blockPointer() {
            ch.pointerCanceled = true;

            function unblockPointer() {
                ch.pointerCanceled = false;
            }

            tiny.once(document, 'touchend', unblockPointer);
        }

        tiny.on(document, 'touchmove', blockPointer);
    }

    function gestureStart() {
        viewportmeta.setAttribute('content', 'width=device-width, minimum-scale=0.25, maximum-scale=1.6');
    }

    // Fix for iPhone viewport scale bug
    // http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
    // @see View on <a href="https://github.com/h5bp/mobile-boilerplate" target="_blank">https://github.com/h5bp/mobile-boilerplate</a>
    function scaleFix() {
        var ua = navigator.userAgent;
        if (viewportmeta && /iPhone|iPad|iPod/.test(ua) && !/Opera Mini/.test(ua)) {
            viewportmeta.setAttribute('content', 'width=device-width, minimum-scale=1.0, maximum-scale=1.0');
            document.addEventListener('gesturestart', gestureStart, false);
        }
    }

    // Prevent iOS from zooming onfocus
    // https://github.com/h5bp/mobile-boilerplate/pull/108
    // @see View on <a href="https://github.com/h5bp/mobile-boilerplate" target="_blank">https://github.com/h5bp/mobile-boilerplate</a>
    function preventZoom() {
        var formFields = document.querySelectorAll('input, select, textarea'),
            contentString = 'width=device-width,initial-scale=1,maximum-scale=',
            i = 0;

        if (!viewportmeta) {
            return;
        }

        for (; i < formFields.length; i += 1) {
            formFields[i].onfocus = function() {
                viewportmeta.setAttribute('content', contentString + '1');
            };

            formFields[i].onblur = function () {
                viewportmeta.setAttribute('content', contentString + '10');
            };
        }
    }

	ch.version = '2.0.4';
	window.ch = ch;
}(this));
(function (ch) {
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
                'waiting': this._options.waiting
            };

        /**
         * Set async content into component's container and emits the current event.
         * @private
         */
        function setAsyncContent(event) {

            that._content.innerHTML = event.response;

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

            if (content.nodeType !== undefined) {
                that._content.innerHTML = '';
                that._content.appendChild(content);
            } else {
                that._content.innerHTML = content;
            }


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
            var requestCfg;
            // Initial options to be merged with the user's options
            options = tiny.extend({
                'method': 'GET',
                'params': '',
                'waiting': '<div class="ch-loading-large"></div>'
            }, defaults, options);

            // Set loading
            setAsyncContent({
                'status': 'waiting',
                'response': options.waiting
            });

            requestCfg = {
                method: options.method,
                success: function(resp) {
                    setAsyncContent({
                        'status': 'done',
                        'response': resp
                    });
                },
                error: function(err) {
                    setAsyncContent({
                        'status': 'error',
                        'response': '<p>Error on ajax call.</p>',
                        'data': err.message || JSON.stringify(err)
                    });
                }
            };

            if (options.cache !== undefined) {
                that._options.cache = options.cache;
            }

            if (options.cache === false && ['GET', 'HEAD'].indexOf(options.method.toUpperCase()) !== -1) {
                requestCfg.cache = false;
            }

            if (options.params) {
                if (['GET', 'HEAD'].indexOf(options.method.toUpperCase()) !== -1) {
                    url += (url.indexOf('?') !== -1 || options.params[0] === '?' ? '' : '?') + options.params;
                } else {
                    requestCfg.data = options.params;
                }
            }

            // Make a request
            tiny.ajax(url, requestCfg);
        }

        /**
         * Allows to manage the components content.
         * @function
         * @memberof! ch.Content#
         * @param {(String | HTMLElement)} content The content that will be used by a component.
         * @param {Object} [options] A custom options to be used with content loaded by ajax.
         * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
         * @param {String} [options.params] Params like query string to be sent to the server.
         * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true. false value will work only with HEAD and GET requests
         * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
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
            var parent;

            // Returns the last updated content.
            if (content === undefined) {
                return that._content.innerHTML;
            }

            that._options.content = content;

            if (that._options.cache === undefined) {
                that._options.cache = true;
            }

            if (typeof content === 'string') {
                // Case 1: AJAX call
                if ((/^(((https|http|ftp|file):\/\/)|www\.|\.\/|(\.\.\/)+|(\/{1,2})|(\d{1,3}\.){3}\d{1,3})(((\w+|-)(\.?)(\/?))+)(\:\d{1,5}){0,1}(((\w+|-)(\.?)(\/?)(#?))+)((\?)(\w+=(\w?)+(&?))+)?(\w+#\w+)?$/).test(content)) {
                    getAsyncContent(content.replace(/#.+/, ''), options);
                // Case 2: Plain text
                } else {
                    setContent(content);
                }
            // Case 3: HTML Element
            } else if (content.nodeType !== undefined) {

                tiny.removeClass(content, 'ch-hide');
                parent = tiny.parent(content);

                setContent(content);

                if (!that._options.cache) {
                    parent.removeChild(content);
                }

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

}(this.ch));

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
            useEffects = (tiny.support.transition && fx !== 'none' && fx !== false),
            pt, pb;

        function showCallback(e) {
            if (useEffects) {
                tiny.removeClass(that.container, 'ch-fx-' + fx);

                // TODO: Use original height when it is defined
                if (/^slide/.test(fx)) {
                    that.container.style.height = '';
                }
            }
            tiny.removeClass(that.container, 'ch-hide');
            that.container.setAttribute('aria-hidden', 'false');

            if (e) {
                e.target.removeEventListener(e.type, showCallback);
            }

            /**
             * Event emitted when the component is shown.
             * @event ch.Collapsible#show
             * @example
             * // Subscribe to "show" event.
             * collapsible.on('show', function () {
             *     // Some code here!
             * });
             */
            that.emit('show');
        }

        function hideCallback(e) {
            if (useEffects) {
                tiny.removeClass(that.container, 'ch-fx-' + toggleEffects[fx]);
                that.container.style.display = '';
                if (/^slide/.test(fx)) {
                    that.container.style.height = '';
                }
            }
            tiny.addClass(that.container, 'ch-hide');
            that.container.setAttribute('aria-hidden', 'true');

            if (e) {
                e.target.removeEventListener(e.type, hideCallback);
            }

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

            if (that.trigger !== undefined) {
                tiny.addClass(that.trigger, triggerClass);
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
                var _h = 0;

                // Be sure to remove an opposite class that probably exist and
                // transitionend listener for an opposite transition, aka $.fn.stop(true, true)
                tiny.off(that.container, tiny.support.transition.end, hideCallback);
                tiny.removeClass(that.container, 'ch-fx-' + toggleEffects[fx]);

                tiny.on(that.container, tiny.support.transition.end, showCallback);

                // Reveal an element before the transition
                that.container.style.display = 'block';

                // Set margin and padding to 0 to prevent content jumping at the transition end
                if (/^slide/.test(fx)) {
                    // Cache the original paddings for the first time
                    if (!pt || !pb) {
                        pt = tiny.css(that.container, 'padding-top');
                        pb = tiny.css(that.container, 'padding-bottom');

                        that.container.style.marginTop = that.container.style.marginBottom =
                            that.container.style.paddingTop = that.container.style.paddingBottom ='0px';
                    }

                    that.container.style.opacity = '0.01';
                    _h = that.container.offsetHeight;
                    that.container.style.opacity = '';
                    that.container.style.height = '0px';
                }

                // Transition cannot be applied at the same time when changing the display property
                setTimeout(function() {
                    if (/^slide/.test(fx)) {
                        that.container.style.height = _h + 'px';
                    }
                    that.container.style.paddingTop = pt;
                    that.container.style.paddingBottom = pb;
                    tiny.addClass(that.container, 'ch-fx-' + fx);
                }, 0);
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

            if (that.trigger !== undefined) {
                tiny.removeClass(that.trigger, triggerClass);
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
                // Be sure to remove an opposite class that probably exist and
                // transitionend listener for an opposite transition, aka $.fn.stop(true, true)
                tiny.off(that.container, tiny.support.transition.end, showCallback);
                tiny.removeClass(that.container, 'ch-fx-' + fx);

                tiny.on(that.container, tiny.support.transition.end, hideCallback);
                // Set margin and padding to 0 to prevent content jumping at the transition end
                if (/^slide/.test(fx)) {
                    that.container.style.height = tiny.css(that.container, 'height');
                    // Uses nextTick to trigger the height change
                    setTimeout(function() {
                        that.container.style.height = '0px';
                        that.container.style.paddingTop = that.container.style.paddingBottom ='0px';
                        tiny.addClass(that.container, 'ch-fx-' + toggleEffects[fx]);
                    }, 0);
                } else {
                    setTimeout(function() {
                        tiny.addClass(that.container, 'ch-fx-' + toggleEffects[fx]);
                    }, 0);
                }
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

(function (window, ch) {
    'use strict';

    var resized = false,
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
     * @augments tiny.EventEmitter
     * @returns {viewport} Returns a new instance of Viewport.
     */
    function Viewport() {
        this._init();
    }

    tiny.inherits(Viewport, tiny.EventEmitter);

    /**
     * Initialize a new instance of Viewport.
     * @memberof! ch.Viewport.prototype
     * @function
     * @private
     * @returns {viewport}
     */
    Viewport.prototype._init = function () {
        // Set emitter to zero for unlimited listeners to avoid the warning in console
        // @see https://nodejs.org/api/events.html#events_emitter_setmaxlisteners_n
        this.setMaxListeners(0);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * Element representing the visible area.
         * @memberof! ch.viewport#element
         * @type {Object}
         */
        this.el = window;

        this.refresh();


        function viewportResize() {
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
        }

        function viewportScroll() {
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
        }

        tiny.on(window, ch.onscroll, viewportScroll, false);
        tiny.on(window, ch.onresize, viewportResize, false);
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
        this.bottom = Math.max(this.el.innerHeight || 0, document.documentElement.clientHeight);

        /**
         * The current right client rect of the viewport (in pixels).
         * @public
         * @name ch.Viewport#right
         * @type {Number}
         * @example
         * // Checks if the right client rect of the viewport is equal to a number.
         * (ch.viewport.bottom === 1200) ? 'Yes': 'No';
         */
        this.right = Math.max(this.el.innerWidth || 0, document.documentElement.clientWidth);

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
        var scroll = tiny.scroll();

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
        this.orientation = (Math.abs(this.el.orientation) === 90) ? 'landscape' : 'portrait';

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

}(this, this.ch));

(function (window, ch) {
    'use strict';

    /**
     * The Positioner lets you position elements on the screen and changes its positions.
     * @memberof ch
     * @constructor
     * @param {Object} options Configuration object.
     * @param {String} options.target A HTMLElement that reference to the element to be positioned.
     * @param {String} [options.reference] A HTMLElement that it's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the ch.viewport.
     * @param {String} [options.side] The side option where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {String} [options.align] The align options where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] Thethe type of positioning used. You must use: "absolute" or "fixed". Default: "fixed".
     * @requires ch.Viewport
     * @returns {positioner} Returns a new instance of Positioner.
     * @example
     * // Instance the Positioner It requires a little configuration.
     * // The default behavior place an element center into the Viewport.
     * var positioned = new ch.Positioner({
     *     'target': document.querySelector('.target'),
     *     'reference': document.querySelector('.reference'),
     *     'side': 'top',
     *     'align': 'left',
     *     'offsetX': 20,
     *     'offsetY': 10
     * });
     * @example
     * // offsetX: The Positioner could be configurated with an offsetX.
     * // This example show an element displaced horizontally by 10px of defined position.
     * var positioned = new ch.Positioner({
     *     'target': document.querySelector('.target'),
     *     'reference': document.querySelector('.reference'),
     *     'side': 'top',
     *     'align': 'left',
     *     'offsetX': 10
     * });
     * @example
     * // offsetY: The Positioner could be configurated with an offsetY.
     * // This example show an element displaced vertically by 10px of defined position.
     * var positioned = new ch.Positioner({
     *     'target': document.querySelector('.target'),
     *     'reference': document.querySelector('.reference'),
     *     'side': 'top',
     *     'align': 'left',
     *     'offsetY': 10
     * });
     * @example
     * // positioned: The positioner could be configured to work with fixed or absolute position value.
     * var positioned = new ch.Positioner({
     *     'target': document.querySelector('.target'),
     *     'reference': document.querySelector('.reference'),
     *     'position': 'fixed'
     * });
     */
    function Positioner(options) {

        if (options === undefined) {
            throw new window.Error('ch.Positioner: Expected options defined.');
        }

        // Creates its private options
        this._options = tiny.clone(this._defaults);

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
        tiny.extend(this._options, options);

        this._options.offsetX = parseInt(this._options.offsetX, 10);
        this._options.offsetY = parseInt(this._options.offsetY, 10);

        /**
         * Reference to the element to be positioned.
         * @type {HTMLElement}
         */
        this.target = options.target || this.target;


        /**
         * It's a reference to position and size of element that will be considered to carry out the position.
         * @type {HTMLElement}
         */
        this.reference = options.reference || this.reference;
        this._reference = this._options.reference;

        this.target.style.position = this._options.position;

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

        var reference = this.reference,
            offset;

        reference.setAttribute('data-side', this._options.side);
        reference.setAttribute('data-align', this._options.align);

        this._reference = this._getOuterDimensions(reference);

        if (reference.offsetParent === this.target.offsetParent) {
            this._reference.left = reference.offsetLeft;
            this._reference.top = reference.offsetTop;

        } else {
            offset = tiny.offset(reference);
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

        var target = this.target;
        target.setAttribute('data-side', this._options.side);
        target.setAttribute('data-align', this._options.align);

        this._target = this._getOuterDimensions(target);

        return this;
    };

    /**
     * Get the current outer dimensions of an element.
     *
     * @memberof ch.Positioner.prototype
     * @param {HTMLElement} el A given HTMLElement.
     * @returns {Object}
     */
    Positioner.prototype._getOuterDimensions = function (el) {
        var obj = el.getBoundingClientRect();

        return {
            'width': (obj.right - obj.left),
            'height': (obj.bottom - obj.top)
        };
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
            orientation = (side === 'top' || side === 'bottom') ? 'horizontal' : ((side === 'right' || side === 'left') ? 'vertical' : 'center'),
            coors,
            orientationMap;

        // take the side and calculate the alignment and make the CSSpoint
        if (orientation === 'center') {
            // calculates the coordinates related to the center side to locate the target
            coors = {
                'top': (this._reference.top + (this._reference.height / 2 - this._target.height / 2)),
                'left': (this._reference.left + (this._reference.width / 2 - this._target.width / 2))
            };

        } else if (orientation === 'horizontal') {
            // calculates the coordinates related to the top or bottom side to locate the target
            orientationMap = {
                'left': this._reference.left,
                'center': (this._reference.left + (this._reference.width / 2 - this._target.width / 2)),
                'right': (this._reference.left + this._reference.width - this._target.width),
                'top': this._reference.top - this._target.height,
                'bottom': (this._reference.top + this._reference.height)
            };

            coors = {
                'top': orientationMap[side],
                'left': orientationMap[this._options.align]
            };

        } else {
            // calculates the coordinates related to the right or left side to locate the target
            orientationMap = {
                'top': this._reference.top,
                'center': (this._reference.top + (this._reference.height / 2 - this._target.height / 2)),
                'bottom': (this._reference.top + this._reference.height - this._target.height),
                'right': (this._reference.left + this._reference.width),
                'left': (this._reference.left - this._target.width)
            };

            coors = {
                'top': orientationMap[this._options.align],
                'left': orientationMap[side]
            };
        }

        coors.top += this._options.offsetY;
        coors.left += this._options.offsetX;

        this.target.style.top = coors.top + 'px';
        this.target.style.left = coors.left + 'px';

        return this;
    };

    ch.Positioner = Positioner;

}(this, this.ch));

(function (window, ch) {
    'use strict';

    var uid = 0;

    /**
     * Base class for all components.
     *
     * @memberof ch
     * @constructor
     * @augments tiny.EventEmitter
     * @param {HTMLElement} [el] It must be a HTMLElement.
     * @param {Object} [options] Configuration options.
     * @returns {component} Returns a new instance of Component.
     * @example
     * // Create a new Component.
     * var component = new ch.Component();
     * var component = new ch.Component('.my-component', {'option': 'value'});
     * var component = new ch.Component('.my-component');
     * var component = new ch.Component({'option': 'value'});
     */
    function Component(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

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

    tiny.inherits(Component, tiny.EventEmitter);

    /**
     * The name of a component.
     * @memberof! ch.Component.prototype
     * @type {String}
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
    Component.prototype._init = function (el, options) {
        // Set emitter to zero for unlimited listeners to avoid the warning in console
        // @see https://nodejs.org/api/events.html#events_emitter_setmaxlisteners_n
        this.setMaxListeners(0);

        // Clones defaults or creates a defaults object
        var defaults = (this._defaults) ? tiny.clone(this._defaults) : {};

        if (el === null) {
            throw new Error('The "el" parameter is not present in the DOM');
        }

        /**
         * A unique id to identify the instance of a component.
         * @type {Number}
         */
        this.uid = (uid += 1);

        // el is HTMLElement
        // IE8 and earlier don't define the node type constants, 1 === document.ELEMENT_NODE
        if (el !== undefined && el.nodeType !== undefined && el.nodeType === 1) {

            this._el = el;

            // set the uid to the element to help search for the instance in the collection instances
            this._el.setAttribute('data-uid', this.uid);

            // we extend defaults with options parameter
            this._options = tiny.extend(defaults, options);

        // el is an object configuration
        } else if (el === undefined || el.nodeType === undefined && typeof el === 'object') {

            // creates a empty element becouse the user not set a DOM elment to use, but we requires one
            // this._el = document.createElement('div');

            // we extend defaults with the object that is in el parameter object
            this._options = tiny.extend(defaults, el);
        }

        /**
         * Indicates if a component is enabled.
         * @type {Boolean}
         * @private
         */
        this._enabled = true;

        /**
         * Stores all instances created
         * @type {Object}
         * @public
         */
        ch.instances = ch.instances || {};
        ch.instances[this.uid] = this;
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
            delete ch.instances[this._el.getAttribute('data-uid')];
            this._el.removeAttribute('data-uid');
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

}(this, this.ch));

(function (window, ch) {
    'use strict';

    function normalizeOptions(options) {
        if (typeof options === 'string' || options instanceof HTMLElement) {
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
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Expandable.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "none".
     * @param {Boolean} [options.toggle] Customize toggle behavior. Default: true.
     * @param {HTMLElement} [options.container] The container where the expanbdale puts its content. Default: the next sibling of el parameter.
     * @param {(String | HTMLElement)} [options.content] The content to be shown into the expandable container.
     * @returns {expandable} Returns a new instance of Expandable.
     * @example
     * // Create a new Expandable.
     * var expandable = new ch.Expandable([el], [options]);
     * @example
     * // Create a new Expandable with custom options.
     * var expandable = new ch.Expandable({
     *     'container': document.querySelector('.my-container'),
     *     'toggle': false,
     *     'fx': 'slideDown',
     *     'content': 'http://ui.ml.com:3040/ajax'
     * });
     * @example
     * // Create a new Expandable using the shorthand way (content as parameter).
     * var expandable = new ch.Expandable('http://ui.ml.com:3040/ajax');
     */
    function Expandable(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

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
    tiny.inherits(Expandable, ch.Component);

    var parent = Expandable.super_.prototype;

    /**
     * The name of the component.
     * @memberof! ch.Expandable.prototype
     * @type {String}
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
        '_classNameTrigger': 'ch-expandable-trigger',
        '_classNameIcon': 'ch-expandable-ico',
        '_classNameContainer': 'ch-expandable-container',
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
    Expandable.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

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
         * @type {HTMLElement}
         * @example
         * // Gets the expandable trigger.
         * expandable.trigger;
         */
        this.trigger = this._el;
        tiny.addClass(this.trigger, this._options._classNameTrigger);
        tiny.addClass(this.trigger, this._options._classNameIcon);

        if (navigator.pointerEnabled) {
            tiny.on(this._el, 'click', function(e) {
                if (e.target.tagName === 'A') {
                    e.preventDefault();
                }
            });
        }

        tiny.on(this.trigger, ch.onpointertap, function (event) {
            if (ch.pointerCanceled) {
                return;
            }

            event.preventDefault();

            if (that._options.toggle) {
                that._toggle();
            } else {
                that.show();
            }
        });

        /**
         * The expandable container.
         * @type {HTMLElement}
         * @example
         * // Gets the expandable container.
         * expandable.container;
         */
        this.container = this._content = (this._options.container ?
            this._options.container : tiny.next(this._el));
        tiny.addClass(this.container, this._options._classNameContainer);
        tiny.addClass(this.container, 'ch-hide');
        if (tiny.support.transition && this._options.fx !== 'none' && this._options.fx !== false) {
            tiny.addClass(this.container, 'ch-fx');
        }
        this.container.setAttribute('aria-expanded', 'false');

        /**
         * Default behavior
         */
        if (this.container.getAttribute('id') === '') {
            this.container.setAttribute('id', 'ch-expandable-' + this.uid);
        }

        this.trigger.setAttribute('aria-controls', this.container.getAttribute('id'));

        this
            .on('show', function () {
                tiny.trigger(window.document, ch.onlayoutchange);
            })
            .on('hide', function () {
                tiny.trigger(window.document, ch.onlayoutchange);
            });

        this.trigger.setAttribute('unselectable', 'on');
        tiny.addClass(this.trigger, 'ch-user-no-select');

        return this;
    };

    /**
     * Shows expandable's content.
     * @memberof! ch.Expandable.prototype
     * @function
     * @param {(String | HTMLElement)} [content] The content that will be used by expandable.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
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
        this.container.setAttribute('aria-expanded', 'true');

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

        this.container.setAttribute('aria-expanded', 'false');

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
        var trigger = this.trigger;

        [
            'ch-expandable-trigger',
            'ch-expandable-ico',
            'ch-user-no-select'
        ].forEach(function(className){
            tiny.removeClass(trigger, className);
        });

        this.trigger.removeAttribute('unselectable');
        this.trigger.removeAttribute('aria-controls');
        tiny.removeClass(this.container, 'ch-expandable-container');
        tiny.removeClass(this.container, 'ch-hide');
        this.container.removeAttribute('aria-expanded');
        this.container.removeAttribute('aria-hidden');

        tiny.trigger(window.document, ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    // Factorize
    ch.factory(Expandable, normalizeOptions);

}(this, this.ch));

(function (window, ch) {
    'use strict';

    /**
     * Menu lets you organize the links by categories.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Expandable
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Menu.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.fx] Enable or disable UI effects. You should use: "slideDown", "fadeIn" or "none". Default: "slideDown".
     * @returns {menu} Returns a new instance of Menu.
     * @example
     * // Create a new Menu.
     * var menu = new ch.Menu(el, [options]);
     * @example
     * // Create a new Menu with custom options.
     * var menu = new ch.Menu({
     *     'fx': 'none'
     * });
     */
    function Menu(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        that._init(el, options);

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
    tiny.inherits(Menu, ch.Component);

    var parent = Menu.super_.prototype,

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
    Menu.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._el.cloneNode(true);

        /**
         * The menu container.
         * @type {HTMLElement}
         */
        this.container = this._el;
        this.container.setAttribute('role', 'navigation');
        tiny.addClass(this.container, 'ch-menu');

        this._options._className ? tiny.addClass(this.container, this._options._className) : null;
        this._options.addClass ? tiny.addClass(this.container, this._options.addClass) : null;

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
            child;

        function createExpandable(li, i) {
            var expandable,
                menu;

            // List element
            tiny.addClass(li, 'ch-menu-fold');

            // Children of list elements
            child = li.children[0];

            // Anchor inside list
            if (child.tagName === 'A') {
                // Add attr role to match wai-aria
                li.setAttribute('role', 'presentation');
                //
                tiny.addClass(child, 'ch-fold-trigger');
                // Add anchor to that.fold
                that.folds.push(child);

            } else {
                // List inside list, inits an Expandable
                expandable = new ch.Expandable(child, {
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

                menu = tiny.next(child);
                menu.setAttribute('role', 'menu');

                Array.prototype.forEach.call(menu.children, function (item){
                    item.setAttribute('role', 'presentation');
                    item.children[0] ? item.children[0].setAttribute('role', 'menuitem') : null;
                });

                // Add expandable to that.fold
                that.folds.push(expandable);
            }
        }

        Array.prototype.forEach.call(this.container.children, createExpandable);

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
     * @param {(String | HTMLElement)} content The content that will be used by a fold.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @example
     * // Updates the content of the second fold with some string.
     * menu.content(2, 'http://ajax.com', {'cache': false});
     */
    Menu.prototype.content = function (fold, content, options) {
        if (fold === undefined || typeof fold !== 'number') {
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

        this.folds.forEach(function (e) {
            if (e.destroy !== undefined) {
                e.destroy();
            }
        });

        this._el.parentNode.replaceChild(this._snippet, this._el);

        tiny.trigger(window.document, ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    ch.factory(Menu);

}(this, this.ch));

(function (window, ch) {
    'use strict';

    /**
     * Popover is the basic unit of a dialog window.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @mixes ch.Collapsible
     * @mixes ch.Content
     * @requires ch.Positioner
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Popover.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointertap".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "button".
     * @param {HTMLElement} [options.reference] It's a HTMLElement reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {(String | HTMLElement)} [options.content] The content to be shown into the Popover container.
     * @param {(Boolean | String)} [options.wrapper] Wrap the reference element and place the container into it instead of body. When value is a string it will be applied as additional wrapper class. Default: false.
     *
     * @returns {popover} Returns a new instance of Popover.
     *
     * @example
     * // Create a new Popover.
     * var popover = new ch.Popover([el], [options]);
     * @example
     * // Create a new Popover with disabled effects.
     * var popover = new ch.Popover(el, {
     *     'fx': 'none'
     * });
     * @example
     * // Create a new Popover using the shorthand way (content as parameter).
     * var popover = new ch.Popover(document.querySelector('.popover'), {'content': 'http://ui.ml.com:3040/ajax'});
     */
    function Popover(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

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

    // Inheritance
    tiny.inherits(Popover, ch.Component);

    var document = window.document,
        parent = Popover.super_.prototype,
        shownbyEvent = {
            'pointertap': ch.onpointertap,
            'pointerenter': ch.onpointerenter
        };

    /**
     * The name of the component.
     * @memberof! ch.Popover.prototype
     * @type {String}
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
        'position': 'absolute',
        'wrapper': false
    };

    /**
     * Initialize a new instance of Popover and merge custom options with defaults options.
     * @memberof! ch.Popover.prototype
     * @function
     * @private
     * @returns {popover}
     */
    Popover.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

        // Require abilities
        this.require('Collapsible', 'Content');

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            container = document.createElement('div');

        this._configureWrapper();

        container.innerHTML = [
            '<div',
            ' class="ch-popover ch-hide ' + this._options._className + ' ' + this._options.addClass +
                (tiny.support.transition && this._options.fx !== 'none' && this._options.fx !== false ? ' ch-fx' : '') + '"',
            ' role="' + this._options._ariaRole + '"',
            ' id="ch-' + this.name + '-' + this.uid + '"',
            ' style="width:' + this._options.width + ';height:' + this._options.height + '"',
            '></div>'
        ].join('');

        /**
         * The popover container. It's the element that will be shown and hidden.
         * @type {HTMLDivElement}
         */
        this.container = container.querySelector('div');

        tiny.on(this.container, ch.onpointertap, function (event) {
            event.stopPropagation();
        });

        /**
         * Element where the content will be added.
         * @private
         * @type {HTMLDivElement}
         */
        this._content = document.createElement('div');

        tiny.addClass(this._content, 'ch-popover-content');

        this.container.appendChild(this._content);

        // Add functionality to the trigger if it exists
        this._configureTrigger();

        this._positioner = new ch.Positioner({
            'target': this.container,
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

        this._hideTimer = function () {
            that._timeout = window.setTimeout(function () {
                that.hide();
            }, that._options._hideDelay);
        };

        this._hideTimerCleaner = function () {
            window.clearTimeout(that._timeout);
        };

        // Configure the way it hides
        this._configureHiding();

        // Refresh position:
        // on layout change
        tiny.on(document, ch.onlayoutchange, this._refreshPositionListener);
        // on resize
        ch.viewport.on(ch.onresize, this._refreshPositionListener);

        this
            .once('_show', this._refreshPositionListener)
            // on content change
            .on('_contentchange', this._refreshPositionListener);

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
        this._options.reference = this._options.reference || this._el;

        // Open event when configured as able to shown anyway
        if (this._options.shownby !== 'none') {

            tiny.addClass(this._el, 'ch-shownby-' + this._options.shownby);

            if (this._options.shownby === shownbyEvent.pointertap && navigator.pointerEnabled) {
                tiny.on(this._el, 'click', function(e) {
                    e.preventDefault();
                });
            }

            tiny.on(this._el, shownbyEvent[this._options.shownby], function (event) {
                event.stopPropagation();
                event.preventDefault();
                showHandler();
            });
        }

        // Get a content if it's not defined
        if (this._options.content === undefined) {
            // Content from anchor href
            // IE defines the href attribute equal to src attribute on images.
            if (this._el.nodeName === 'A' && this._el.href !== '') {
                this._options.content = this._el.href;

            // Content from title or alt
            } else if (this._el.title !== '' || this._el.alt !== '') {
                // Set the configuration parameter
                this._options.content = this._el.title || this._el.alt;
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
         * @type {HTMLElement}
         */
        this.trigger = this._el;
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
            dummy,
            button;



        // Don't hide anytime
        if (hiddenby === 'none') { return; }

        // Hide by leaving the component
        if (hiddenby === 'pointerleave' && this.trigger !== undefined) {

            [this.trigger, this.container].forEach(function(el) {
                tiny.on(el, ch.onpointerenter, that._hideTimerCleaner);
            });
            [this.trigger, this.container].forEach(function(el) {
                tiny.on(el, ch.onpointerleave, that._hideTimer);
            });
        }

        // Hide with the button Close
        if (hiddenby === 'button' || hiddenby === 'all') {
            dummy = document.createElement('div');
            dummy.innerHTML = '<i class="ch-close" role="button" aria-label="Close"></i>';
            button = dummy.querySelector('i');

            tiny.on(button, ch.onpointertap, function () {
                that.hide();
            });

            this.container.insertBefore(button, this.container.firstChild);

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
        // IE8 and earlier don't define the node type constants, 1 === document.ELEMENT_NODE
        if (typeof options === 'string' || (typeof options === 'object' && options.nodeType === 1)) {
            options = {
                'content': options
            };
        }
        return options;
    };

    /**
     * Wraps the target element and use the wrapper as the placement for container
     * @memberof! ch.Popover.prototype
     * @private
     * @function
     */
    Popover.prototype._configureWrapper = function() {
        var target = this._el || this._options.reference,
            wrapper = this._options.wrapper;

        if (wrapper && target && target.nodeType === 1) {
            // Create the wrapper element and append to it
            wrapper = document.createElement('span');
            tiny.addClass(wrapper, 'ch-popover-wrapper');

            if (typeof this._options.wrapper === 'string') {
                this._options.wrapper.split(' ').forEach(function(className) {
                    tiny.addClass(wrapper, className);
                });
            }

            tiny.parent(target).insertBefore(wrapper, target);
            wrapper.appendChild(target);
            if (tiny.css(wrapper, 'position') === 'static') {
                tiny.css(wrapper, {
                    display: 'inline-block',
                    position: 'relative'
                });
            }

            this._containerWrapper = wrapper;
        } else {
            this._containerWrapper = document.body;
        }
    };

    /**
     * Shows the popover container and appends it to the body.
     * @memberof! ch.Popover.prototype
     * @function
     * @param {(String | HTMLElement)} [content] The content that will be used by popover.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
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

        // Append to the configured holder
        this._containerWrapper.appendChild(this.container);

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
    Popover.prototype.hide = function() {
        var self = this,
            parent;
        // Don't execute when it's disabled
        if (!this._enabled || !this._shown) {
            return this;
        }

        // Detach the container from the DOM when it is hidden
        this.once('hide', function() {
            // Due to transitions this._shown can be outdated here
            parent = self.container.parentNode;
            if (parent !== null) {
                parent.removeChild(self.container);
            }
        });

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

        this.container.style.width = data;

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

        this.container.style.height = data;

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

        if (this.trigger !== undefined) {

            tiny.off(this.trigger, ch.onpointerenter, this._hideTimerCleaner);
            tiny.off(this.trigger, ch.onpointerleave, this._hideTimer);

            tiny.removeClass(this.trigger, 'ch-' + this.name + '-trigger');

            this.trigger.removeAttribute('data-title');
            this.trigger.removeAttribute('aria-owns');
            this.trigger.removeAttribute('aria-haspopup');
            this.trigger.removeAttribute('data-side');
            this.trigger.removeAttribute('data-align');
            this.trigger.removeAttribute('role');

            this._snippet.alt ? this.trigger.setAttribute('alt', this._snippet.alt) : null;
            this._snippet.title ? this.trigger.setAttribute('title', this._snippet.title) : null;
        }

        tiny.off(document, ch.onlayoutchange, this._refreshPositionListener);

        ch.viewport.removeListener(ch.onresize, this._refreshPositionListener);

        parent.destroy.call(this);

        return;
    };

    ch.factory(Popover, Popover.prototype._normalizeOptions);

}(this, this.ch));

(function (window, ch) {
    'use strict';

    /**
     * Layer is a dialog window that can be shown one at a time.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {String} [el] A HTMLElement to create an instance of ch.Layer.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointerenter".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointerleave".
     * @param {HTMLElement} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "left".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 10.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {( String | HTMLElement)} [options.content] The content to be shown into the Layer container.
     * @param {(Boolean | String)} [options.wrapper] Wrap the reference element and place the container into it instead of body. When value is a string it will be applied as additional wrapper class. Default: false.
     *
     * @returns {layer} Returns a new instance of Layer.
     * @example
     * // Create a new Layer.
     * var layer = new ch.Layer([el], [options]);
     * @example
     * // Create a new Layer with disabled effects.
     * var layer = new ch.Layer({
     *     'content': 'This is the content of the Layer'
     * });
     * @example
     * // Create a new Layer using the shorthand way (content as parameter).
     * var layer = new ch.Layer('http://ui.ml.com:3040/ajax');
     */
    function Layer(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

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

    // Inheritance
    tiny.inherits(Layer, ch.Popover);

    // Reference to the last component open. Allows to close and to deny to
    // have 2 components open at the same time
    var lastShown,
        parent = Layer.super_.prototype;

    /**
     * The name of the component.
     * @memberof! ch.Layer.prototype
     * @type {String}
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
    Layer.prototype._defaults = tiny.extend(tiny.clone(parent._defaults), {
        '_className': 'ch-layer ch-box-lite ch-cone',
        '_ariaRole': 'tooltip',
        'shownby': 'pointerenter',
        'hiddenby': 'pointerleave',
        'side': 'bottom',
        'align': 'left',
        'offsetX': 0,
        'offsetY': 10,
        'waiting': '<div class="ch-loading-small"></div>',
        'wrapper': false
    });

    /**
     * Shows the layer container and hides other layers.
     * @memberof! ch.Layer.prototype
     * @function
     * @param {(String | HTMLElement)} [content] The content that will be used by layer.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
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
        if (lastShown !== undefined && lastShown.name === this.name && lastShown !== this) {
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

}(this, this.ch));

(function (window, ch) {
    'use strict';

    /**
     * Modal is a dialog window with an underlay.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {HTMLElement} [el] A HTMLElement to create an instance of ch.Modal.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "50%".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointertap".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "all".
     * @param {HTMLElement} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: ch.viewport.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "fixed".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading-large ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {(String | HTMLElement)} [options.content] The content to be shown into the Modal container.
     * @returns {modal} Returns a new instance of Modal.
     * @example
     * // Create a new Modal.
     * var modal = new ch.Modal([el], [options]);
     * @example
     * // Create a new Modal.
     * var modal = new ch.Modal([options]);
     * @example
     * // Create a new Modal with disabled effects.
     * var modal = new ch.Modal({
     *     'content': 'This is the content of the Modal'
     * });
     * @example
     * // Create a new Modal using the shorthand way (content as parameter).
     * var modal = new ch.Modal('http://ui.ml.com:3040/ajax');
     */
    function Modal(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

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

    // Inheritance
    tiny.inherits(Modal, ch.Popover);

    var document = window.document,
        underlay = (function () {
            var dummyElement = document.createElement('div');
            dummyElement.innerHTML = '<div class="ch-underlay" tabindex="-1"></div>';

            return dummyElement.querySelector('div');
        }()),
        parent = Modal.super_.prototype;

    /**
     * The name of the component.
     * @memberof! ch.Modal.prototype
     * @type {String}
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
    Modal.prototype._defaults = tiny.extend(tiny.clone(parent._defaults), {
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
        var useAnimation = tiny.support.transition && this._options.fx !== 'none' && this._options.fx !== false,
            fxName = 'ch-fx-' + this._options.fx.toLowerCase();

        document.body.appendChild(underlay);

        function showCallback(e) {
            tiny.removeClass(underlay, fxName + '-enter-active');
            tiny.removeClass(underlay, fxName + '-enter');

            tiny.off(e.target, e.type, showCallback);
        }

        if (useAnimation) {
            tiny.addClass(underlay, fxName + '-enter');
            setTimeout(function() {
                tiny.addClass(underlay, fxName + '-enter-active');
            },10);
            tiny.on(underlay, tiny.support.transition.end, showCallback);
        }
    };

    /**
     * Hides the Modal underlay.
     * @memberof! ch.Modal.prototype
     * @function
     * @private
     */
    Modal.prototype._hideUnderlay = function () {
        var useAnimation = tiny.support.transition && this._options.fx !== 'none' && this._options.fx !== false,
            fxName = 'ch-fx-' + this._options.fx.toLowerCase(),
            parent = underlay.parentNode;

        function hideCallback(e) {
            tiny.removeClass(underlay, fxName + '-leave-active');
            tiny.removeClass(underlay, fxName + '-leave');

            tiny.off(e.target, e.type, hideCallback);
            parent.removeChild(underlay);
        }

        if (useAnimation) {
            tiny.addClass(underlay, fxName + '-leave');
            setTimeout(function() {
                tiny.addClass(underlay, fxName + '-leave-active');
            },10);
            tiny.on(underlay, tiny.support.transition.end, hideCallback);
        } else {
            parent.removeChild(underlay);
        }
    };

    /**
     * Shows the modal container and the underlay.
     * @memberof! ch.Modal.prototype
     * @function
     * @param {(String | HTMLElement)} [content] The content that will be used by modal.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
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

        function hideByUnderlay(e) {
            that.hide();
            // Allow only one click to analyze the config every time and to close ONLY THIS modal
            e.target.removeEventListener(e.type, hideByUnderlay);
        }

        // Add to the underlay the ability to hide the component
        if (this._options.hiddenby === 'all' || this._options.hiddenby === 'pointers') {
            tiny.on(underlay, ch.onpointertap, hideByUnderlay);
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
        tiny.off(underlay, ch.onpointertap);
        // Hide the underlay element
        this._hideUnderlay();
        // Execute the original hide()
        parent.hide.call(this);

        return this;
    };

    ch.factory(Modal, parent._normalizeOptions);

}(this, this.ch));

(function (ch) {
    'use strict';

    /**
     * Transition lets you give feedback to the users when their have to wait for an action.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {HTMLElement} [el] A HTMLElement to create an instance of ch.Transition.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "50%".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointertap".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "none".
     * @param {String} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: ch.viewport.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "fixed".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(HTMLElement | String)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading-large ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {(HTMLElement | String)} [options.content] The content to be shown into the Transition container. Default: "Please wait..."
     * @returns {transition} Returns a new instance of Transition.
     * @example
     * // Create a new Transition.
     * var transition = new ch.Transition([el], [options]);
     * @example
     * // Create a new Transition with disabled effects.
     * var transition = new ch.Transition({
     *     'fx': 'none'
     * });
     * @example
     * // Create a new Transition using the shorthand way (content as parameter).
     * var transition = new ch.Transition('http://ui.ml.com:3040/ajax');
     */
    function Transition(el, options) {

        if (el === undefined || options === undefined) {
            options = {};
        }

        options.content = (function () {
            var dummyElement = document.createElement('div'),
                content = options.waiting || '';

            // TODO: options.content could be a HTMLElement
            dummyElement.innerHTML = '<div class="ch-loading-large"></div><p>' + content + '</p>';

            return dummyElement.firstChild;
        }());

        // el is not defined
        if (el === undefined) {
            el = tiny.extend(tiny.clone(this._defaults), options);
        // el is present as a object configuration
        } else if (el.nodeType === undefined && typeof el === 'object') {
            el = tiny.extend(tiny.clone(this._defaults), el);
        } else if (options !== undefined) {
            options = tiny.extend(tiny.clone(this._defaults), options);
        }

        return new ch.Modal(el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Transition.prototype
     * @type {String}
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
    Transition.prototype._defaults = tiny.extend(tiny.clone(ch.Modal.prototype._defaults), {
        '_className': 'ch-transition ch-box-lite',
        '_ariaRole': 'alert',
        'hiddenby': 'none',
        'content': 'Please wait...'
    });

    ch.factory(Transition, ch.Modal.prototype._normalizeOptions);

}(this.ch));

(function (window, ch) {
    'use strict';

    /**
     * Dropdown shows a list of options for navigation.
     * @memberof ch
     * @constructor
     * @augments ch.Layer
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Dropdown.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "none".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointertap".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointers".
     * @param {HTMLElement} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "left".
     * @param {Number} [options.offsetX] The offsetX option specifies a distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] The offsetY option specifies a distance to displace the target vertically. Default: -1.
     * @param {String} [options.position] The position option specifies the type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {Boolean} [options.skin] Sets a CSS class name to the trigger and container to get a variation of Dropdown. Default: false.
     * @param {Boolean} [options.shortcuts] Configures navigation shortcuts. Default: true.
     * @param {(String | HTMLElement)} [options.content] The content to be shown into the Dropdown container.
     * @returns {dropdown} Returns a new instance of Dropdown.
     * @example
     * // Create a new Dropdown.
     * var dropdown = new ch.Dropdown([el], [options]);
     * @example
     * // Create a new skinned Dropdown.
     * var dropdown = new ch.Dropdown({
     *     'skin': true
     * });
     */
    function Dropdown(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

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

    // Inheritance
    tiny.inherits(Dropdown, ch.Layer);

    var parent = Dropdown.super_.prototype;

    /**
     * The name of the component.
     * @memberof! ch.Dropdown.prototype
     * @type {String}
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
    Dropdown.prototype._defaults = tiny.extend(tiny.clone(parent._defaults), {
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
    Dropdown.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            // The second element of the HTML snippet (the dropdown content)
            content = tiny.next(this.trigger);

        /**
         * The dropdown trigger. It's the element that will show and hide the container.
         * @type {HTMLElement}
         */
        this.trigger.setAttribute('aria-activedescendant', 'ch-dropdown' + this.uid + '-selected');
        tiny.addClass(this.trigger, 'ch-dropdown-trigger');

        this.trigger.setAttribute('unselectable', 'on');
        tiny.addClass(this.trigger, 'ch-user-no-select');

        // Skinned dropdown
        if (this._options.skin) {
            tiny.addClass(this.trigger, 'ch-dropdown-trigger-skin');
            tiny.addClass(this.container, 'ch-dropdown-skin');
        // Default Skin
        } else {
            tiny.addClass(this.trigger, 'ch-btn-skin');
            tiny.addClass(this.trigger, 'ch-btn-small');
        }

        /**
         * A list of links with the navigation options of the component.
         * @type {NodeList}
         * @private
         */
        this._navigation = (function () {
            var items = content.querySelectorAll('a');
            Array.prototype.forEach.call(items, function (item, index) {
                item.setAttribute('role', 'option');
                tiny.on(item, ch.onpointerenter, function () {
                    that._navigation[that._selected = index].focus();
                });
            });
            return items;
        }());


        if (this._options.shortcuts && this._navigationShortcuts !== undefined) {
            this._navigationShortcuts();
        }

        this._options.content = content;

        /**
         * The original and entire element and its state, before initialization.
         * @private
         * @type {HTMLElement}
         */
        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._options.content.cloneNode(true);

        return this;
    };

    /**
     * Shows the dropdown container.
     * @memberof! ch.Dropdown.prototype
     * @function
     * @param {(String | HTMLElement)} [content] The content that will be used by dropdown.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
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
        var trigger = this.trigger;

        [
            'ch-dropdown-trigger',
            'ch-dropdown-trigger-skin',
            'ch-user-no-select',
            'ch-btn-skin',
            'ch-btn-small'
        ].forEach(function(className){
            tiny.removeClass(trigger, className);
        });

        trigger.removeAttribute('unselectable');
        trigger.removeAttribute('aria-controls');

        trigger.insertAdjacentHTML('afterend', this._snippet);

        tiny.trigger(window.document, ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    ch.factory(Dropdown);

}(this, this.ch));

(function (window, ch) {
    'use strict';

    /**
     * Form is a controller of DOM's HTMLFormElement.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Validations
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Form.
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
     * var form = new ch.Form(el, [options]);
     * @example
     * // Create a new Form with custom messages.
     * var form = new ch.Form({
     *     'messages': {
     *          'required': 'Some message!',
     *          'email': 'Another message!'
     *     }
     * });
     */
    function Form(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        that._init(el, options);

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
    tiny.inherits(Form, ch.Component);

    var parent = Form.super_.prototype;

    /**
     * The name of the component.
     * @memberof! ch.Form.prototype
     * @type {String}
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
    Form.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

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
         * @type {HTMLElement}
         */
        this.container = this._el;
            // Add classname
        tiny.addClass(this.container, 'ch-form');
            // Disable HTML5 browser-native validations
        this.container.setAttribute('novalidate', 'novalidate');
            // Bind the submit
        tiny.on(this.container, 'submit', function (event) {
            // Runs validations
            that.validate(event);
        });

        // Bind the reset
        if (this.container.querySelector('input[type="reset"]')) {
            tiny.on(this.container.querySelector('input[type="reset"]'), ch.onpointertap, function (event) {
                event.preventDefault();
                that.reset();
            });
        }
        // Stub for EventEmitter to prevent the errors throwing
        this.on('error', function(){});

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
            firstErrorVisible,
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
            firstErrorVisible = firstError.trigger;

            // Find the closest visible parent if current element is hidden
            while (tiny.css(firstErrorVisible, 'display') === 'none' && firstErrorVisible !== document.documentElement) {
                firstErrorVisible = firstErrorVisible.parentElement;
            }

            firstErrorVisible.scrollIntoView();

            // Issue UI-332: On validation must focus the first field with errors.
            // Doc: http://wiki.ml.com/display/ux/Mensajes+de+error
            triggerError = firstError.trigger;

            if (triggerError.tagName === 'DIV') {
                firstError.trigger.querySelector('input:first-child').focus();
            }

            if (triggerError.type !== 'hidden' || triggerError.tagName === 'SELECT') {
                triggerError.focus();
            }

            if (event && event.preventDefault) {
                event.preventDefault();
            }

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

        return this.errors.length > 0;
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

        // this.$container.off('.form')
        this.container.removeAttribute('novalidate');

        this.validations.forEach(function (e) {
            e.destroy();
        });

        parent.destroy.call(this);

        return;
    };

    // Factorize
    ch.factory(Form);

}(this, this.ch));

(function (ch) {
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

                var tag = tiny.hasClass(this.trigger, 'ch-form-options') ? 'OPTIONS' : this._el.tagName,
                    validated;

                switch (tag) {
                case 'OPTIONS':
                    validated = this.trigger.querySelectorAll('input:checked').length !== 0;
                    break;

                case 'SELECT':
                    validated = (value !== '-1' && value !== '');
                    break;

                // INPUTS and TEXTAREAS
                default:
                    validated = value.replace(/^\s+|\s+$/g, '').length !== 0;
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

        tiny.extend(this, conditions[condition.name], condition);

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

}(this.ch));

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
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {Array} [options.conditions] A collection of conditions to validate.
     * @param {String} [options.conditions.name] The name of the condition.
     * @param {String} [options.conditions.message] The given error message to the condition.
     * @param {String} [options.conditions.fn] The method to validate a given condition.
     * @param {HTMLElement} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 10.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new Validation.
     * var validation = new ch.Validation(document.querySelector('.name-field'), [options]);
     * @example
     * // Create a validation with with custom options.
     * var validation = new ch.Validation({
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
    function Validation(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

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
    tiny.inherits(Validation, ch.Component);

    var parent = Validation.super_.prototype,
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
        'offsetX': 10
    };

    /**
     * Initialize a new instance of Validation and merge custom options with defaults options.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    Validation.prototype._init = function (el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        parent._init.call(this, el, options);

        /**
         * The validation trigger.
         * @type {HTMLElement}
         */
        this.trigger = this._el;

        /**
         * The validation container.
         * @type {HTMLElement}
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
            // Clean the validation if is shown;
            .on('disable', this.clear);

        this.on('error', this._handleError);

        /**
         * Reference to a Form instance. If there isn't any, the Validation instance will create one.
         * @type {form}
         */
        this.form = (ch.instances[tiny.parent(that.trigger, 'form').getAttribute('data-uid')] || new ch.Form(tiny.parent(that.trigger, 'form')));

        this.form.validations.push(this);

        /**
         * Set a validation event to add listeners.
         * @private
         */
        this._validationEvent = (tiny.hasClass(this.trigger, 'ch-form-options') || this._el.tagName === 'SELECT' || (this._el.tagName === 'INPUT' && this._el.type === 'range')) ? 'change' : 'blur';

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
        tiny.on(this.trigger, this._validationEvent, function () {

            if (previousValue !== this.value || that._validationEvent === 'change' && that.isShown()) {
                previousValue = this.value;
                that.validate();
            }

            if (that.conditions.required === undefined && this.value === '') {
                that.clear();
            }

        });

        /**
         * It emits an error event when a validation got an error.
         * @event ch.Validation#error
         *
         * @example
         * // Subscribe to "error" event.
         * validation.on('error', function (errors) {
         *     console.log(errors.length);
         * });
         */
        this.emit('error', this.error);

        return this;
    };

    /**
     * Internal error handler, shows the errors when needed
     *
     * @param err {Object} A ch.Validation#error object that contain the error message and the error condition
     * @private
     */
    Validation.prototype._handleError = function(err) {
        var that = this;

        if (!that._previousError.condition || !that._shown) {
            if (that._el.nodeName === 'INPUT' || that._el.nodeName === 'TEXTAREA') {
                tiny.addClass(that.trigger, 'ch-validation-error');
            }

            that._showErrorMessage(err.message || 'Error');
        }

        if (err.condition !== that._previousError.condition) {
            that._showErrorMessage(err.message || that.form._messages[err.condition] || 'Error');
        }

        that._shown = true;
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

        this.trigger.removeAttribute('aria-label');
        tiny.removeClass(this.trigger, 'ch-validation-error');


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
        if (this.trigger.getAttribute('disabled') || !this._enabled) {
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
        this._previousError = tiny.clone(this.error);

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

        this.trigger.removeAttribute('aria-label');
        tiny.removeClass(this.trigger, 'ch-validation-error');

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

        // this.$trigger.off('.validation')
        this.trigger.removeAttribute('data-side data-align');

        parent.destroy.call(this);

        return;
    };

    // Factorize
    ch.factory(Validation);

}(this, this.ch));

(function (ch) {
    'use strict';

    /**
     * Creates a container to show the validation message.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    ch.Validation.prototype._configureContainer = function () {
        var parent = tiny.parent(this.trigger);
        parent.insertAdjacentHTML('beforeend', '<div class="ch-validation-message ch-hide"></div>');
        this._container = parent.querySelector('.ch-validation-message');
        return this;
    };

    /**
     * Shows the validation message.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    ch.Validation.prototype._showErrorMessage = function (message) {
        this._container.innerHTML = message;
        tiny.removeClass(this._container, 'ch-hide');

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
        tiny.addClass(this._container, 'ch-hide');

        return this;
    };

}(this.ch));

(function (window, ch) {
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
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Countdown.
     * @param {Object} [options] Options to customize an instance.
     * @param {Number} [options.max] Number of the maximum amount of characters user can input in form control. Default: 500.
     * @param {String} [options.plural] Message of remaining amount of characters, when it's different to 1. The variable that represents the number to be replaced, should be a hash. Default: "# characters left.".
     * @param {String} [options.singular] Message of remaining amount of characters, when it's only 1. The variable that represents the number to be replaced, should be a hash. Default: "# character left.".
     * @returns {countdown} Returns a new instance of Countdown.
     * @example
     * // Create a new Countdown.
     * var countdown = new ch.Countdown([el], [options]);
     * @example
     * // Create a new Countdown with custom options.
     * var countdown = new ch.Countdown({
     *     'max': 250,
     *     'plural': 'Left: # characters.',
     *     'singular': 'Left: # character.'
     * });
     * @example
     * // Create a new Countdown using the shorthand way (max as parameter).
     * var countdown = new ch.Countdown({'max': 500});
     */
    function Countdown(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

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
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    tiny.inherits(Countdown, ch.Component);

    var parent = Countdown.super_.prototype;

    /**
     * The name of the component.
     * @memberof! ch.Countdown.prototype
     * @type {String}
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
    Countdown.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

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
         * @type {HTMLTextAreaElement}
         * @example
         * // Gets the countdown trigger.
         * countdown.trigger;
         */
        this.trigger = this._el;
        'keyup keypress keydown input paste cut'.split(' ')
            .forEach(function(name) {
                tiny.on(that.trigger, name, function () { that._count(); });
            });

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
         * @type {HTMLParagraphElement}
         */
        that.container = (function () {
            var parent = tiny.parent(that._el);
            parent.insertAdjacentHTML('beforeend', '<span class="ch-countdown ch-form-hint" id="' + messageID + '">' + message.replace('#', that._remaining) + '</span>');

            return parent.querySelector('#' + messageID);
        }());

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

            this.trigger.setAttribute('aria-invalid', 'true');
            tiny.addClass(this.trigger, 'ch-validation-error');

            tiny.addClass(this.container, 'ch-countdown-exceeded');
        }

        // Change visible message of remaining characters
        // Singular or Plural message depending on amount of remaining characters
        message = (this._remaining !== 1 ? this._options.plural : this._options.singular).replace(/\#/g, this._remaining);

        // Update DOM text
        this.container.innerText  = message;

        return this;

    };

     /**
     * Process input of data on form control and updates remaining amount of characters or limits the content length. Also, change the visible message of remaining characters.
     * @function
     * @private
     * @returns {countdown}
     */
    Countdown.prototype._removeError = function () {
        tiny.removeClass(this.trigger, 'ch-validation-error');
        this.trigger.setAttribute('aria-invalid', 'false');

        tiny.removeClass(this.container, 'ch-countdown-exceeded');

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
        var parentElement = tiny.parent(this.container);
        parentElement.removeChild(this.container);

        tiny.trigger(window.document, ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    // Factorize
    ch.factory(Countdown, normalizeOptions);

}(this, this.ch));

(function (window, ch) {
    'use strict';

    /**
     * A large list of elements. Some elements will be shown in a preset area, and others will be hidden waiting for the user interaction to show it.
     * @memberof ch
     * @constructor
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Carousel.
     * @param {Object} [options] Options to customize an instance.
     * @param {Number} [options.async] Defines the number of future asynchronous items to add to the component. Default: 0.
     * @param {Boolean} [options.arrows] Defines if the arrow-buttons must be created or not at initialization. Default: true.
     * @param {Boolean} [options.pagination] Defines if a pagination must be created or not at initialization. Default: false.
     * @param {Boolean} [options.fx] Enable or disable the slide effect. Default: true.
     * @param {Boolean} [options.autoHeight] Enable or disable the recalculation of item height on a proportional basis maintaining the proportions of an item. Default: true.
     * @param {Number} [options.limitPerPage] Set the maximum amount of items to show in each page.
     * @returns {carousel} Returns a new instance of Carousel.
     * @example
     * // Create a new carousel.
     * var carousel = new ch.Carousel(el, [options]);
     * @example
     * // Create a new Carousel with disabled effects.
     * var carousel = new ch.Carousel(el, {
     *     'fx': false
     * });
     * @example
     * // Create a new Carousel with items asynchronously loaded.
     * var carousel = new ch.Carousel(el, {
     *     'async': 10
     * }).on('itemsadd', function (collection) {
     *     // Inject content into the added <li> elements
     *     $.each(collection, function (i, e) {
     *         e.innerHTML = 'Content into one of newly inserted <li> elements.';
     *     });
     * });
     */
    function Carousel(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

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

    // Inheritance
    tiny.inherits(Carousel, ch.Component);

    var pointertap = ch.onpointertap,
        Math = window.Math,
        setTimeout = window.setTimeout,
        parent = Carousel.super_.prototype;

    /**
     * Reference to the vendor prefix of the current browser.
     *
     * @private
     * @constant
     * @type {String}
     * @link http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser
     * @example
     * VENDOR_PREFIX === 'webkit';
     */
    var VENDOR_PREFIX = (function () {

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
     * The name of the component.
     * @memberof! ch.Carousel.prototype
     * @type {String}
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
        'fx': true,
        'autoHeight': true
    };

    /**
     * Initialize a new instance of Carousel and merge custom options with defaults options.
     * @memberof! ch.Carousel.prototype
     * @function
     * @private
     * @returns {carousel}
     */
    Carousel.prototype._init = function (el, options) {
        // Call to its parents init method
        parent._init.call(this, el, options);

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
         * @type {HTMLElement}
         */
        this._list = this._el.children[0];

        tiny.addClass(this._el, 'ch-carousel');
        tiny.addClass(this._list, 'ch-carousel-list');

        /**
         * Collection of each child of the slider list.
         * @private
         * @type {HTMLCollection}
         */
        this._items = (function () {
            var collection = that._list.querySelectorAll('li');

            Array.prototype.forEach.call(collection, function (item) {
                tiny.addClass(item, 'ch-carousel-item');
            });

            return collection;
        }());

        /**
         * Element that wraps the list and denies its overflow.
         * @private
         * @type {HTMLDivElement}
         */
        this._mask = document.createElement('div');
        this._mask.setAttribute('role', 'tabpanel');
        this._mask.setAttribute('class','ch-carousel-mask');
        this._mask.appendChild(this._list);

        this._el.appendChild(this._mask);

        /**
         * Size of the mask (width). Updated in each refresh.
         * @private
         * @type {Number}
         */
        this._maskWidth = this._getOuterDimensions(this._mask).width;

        /**
         * The width of each item, including paddings, margins and borders. Ideal for make calculations.
         * @private
         * @type {Number}
         */
        this._itemWidth = this._getOuterDimensions(this._items[0]).width;

        /**
         * The width of each item, without paddings, margins or borders. Ideal for manipulate CSS width property.
         * @private
         * @type {Number}
         */
        this._itemOuterWidth = parseInt(tiny.css(this._items[0], 'width'));

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
        this._itemHeight = this._getOuterDimensions(this._items[0]).height;

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
         * @type {HTMLDivElement}
         */
        this._prevArrow = document.createElement('div');
        this._prevArrow.setAttribute('role', 'button');
        this._prevArrow.setAttribute('aria-hidden', 'true');
        this._prevArrow.setAttribute('class', 'ch-carousel-prev ch-carousel-disabled');
        tiny.on(this._prevArrow, pointertap, function () { that.prev(); }, false);

        /**
         * UI element of arrow that moves the Carousel to the next page.
         * @private
         * @type {HTMLDivElement}
         */
        this._nextArrow = document.createElement('div');
        this._nextArrow.setAttribute('role', 'button');
        this._nextArrow.setAttribute('aria-hidden', 'true');
        this._nextArrow.setAttribute('class', 'ch-carousel-next');
        tiny.on(this._nextArrow, pointertap, function () { that.next(); }, false);

        /**
         * UI element that contains all the thumbnails for pagination.
         * @private
         * @type {HTMLDivElement}
         */
        this._pagination = document.createElement('div');
        this._pagination.setAttribute('role', 'navigation');
        this._pagination.setAttribute('class', 'ch-carousel-pages');

        tiny.on(this._pagination, pointertap, function (event) {
            // Get the page from the element
            var page = event.target.getAttribute('data-page');
            // Allow interactions from a valid page of pagination
            if (page !== null) { that.select(window.parseInt(page, 10)); }
        }, false);

        // Refresh calculation when the viewport resizes
        ch.viewport.on('resize', function () { that.refresh(); });

        // If efects aren't needed, avoid transition on list
        if (!this._options.fx) { tiny.addClass(this._list, 'ch-carousel-nofx'); }

        // Position absolutelly the list when CSS transitions aren't supported
        if (!tiny.support.transition) {
            this._list.style.cssText += 'position:absolute;left:0;';
        }

        // If there is a parameter specifying a pagination, add it
        if (this._options.pagination) { this._addPagination(); }

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
            total = this._items.length + this._async,
            // Page where each item is in
            page;

        // Update WAI-ARIA properties on all items
        Array.prototype.forEach.call(this._items, function (item, i) {
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
            amount = total - this._items.length,
            // The new width calculated from current width plus extraWidth
            width = (this._itemWidth + this._itemExtraWidth),
            // Get the height using new width and relation between width and height of item (ratio)
            height = ((width * this._itemHeight) / this._itemWidth).toFixed(3),
            // Generic <LI> HTML Element to be added to the Carousel
            item = [
                '<li',
                ' class="ch-carousel-item"',
                ' style="width:' + (width % 1 === 0 ? width : width.toFixed(4)) + 'px;',
                (this._options.autoHeight ? 'height:' + height + 'px;' : ''),
                'margin-right:' + (this._itemMargin % 1 === 0 ? this._itemMargin : this._itemMargin.toFixed(4)) + 'px"',
                '></li>'
            ].join(''),
            // It stores <LI> that will be added to the DOM collection
            items = '',
            // It stores the items that must be added, it helps to slice the items in the list
            counter = 0;

        // Load only when there are items to add
        if (amount < 1) { return; }

        // If next page needs less items than it support, then add that amount
        amount = (this._async < amount) ? this._async : amount;

        // Add the necessary amount of items
        while (amount) {
            items += item;
            amount -= 1;
            counter += 1;
        }

        // Add sample items to the list
        this._list.insertAdjacentHTML('beforeend', items);

        // Update items collection
        // uses querySelectorAll because it need a static collection
        this._items = this._list.querySelectorAll('li');

        // Set WAI-ARIA properties to each item
        this._updateARIA();

        // Update amount of items to add asynchronously
        this._async -= amount;

        /**
         * Event emitted when the component creates new asynchronous empty items.
         * @event ch.Carousel#itemsadd
         * @example
         * // Create a new Carousel with items asynchronously loaded.
         * var carousel = new ch.Carousel({
         *     'async': 10
         * }).on('itemsadd', function (collection) {
         *     // Inject content into the added <li> elements
         *     $.each(collection, function (i, e) {
         *         e.innerHTML = 'Content into one of newly inserted <li> elements.';
         *     });
         * });
         */
        this.emit('itemsadd', Array.prototype.slice.call(this._items, -counter));
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
        that._pagination.innerHTML = thumbs.join('');
        that._el.appendChild(that._pagination);

        // Avoid selection on the pagination
        that._pagination.setAttribute('unselectable', 'on');
        tiny.addClass(that._pagination, 'ch-user-no-select');

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
        this._pagination.innerHTML = '';
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
        if (this._options.fx && tiny.support.transition) {
            // Delete efects on list to make changes instantly
            tiny.addClass(this._list, 'ch-carousel-nofx');
            // Execute the custom method
            callback.call(this);
            // Restore efects to list
            // Use a setTimeout to be sure to do this AFTER changes
            setTimeout(function () { tiny.removeClass(that._list, 'ch-carousel-nofx'); }, 0);
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
        this._pages = Math.ceil((this._items.length + this._async) / this._limitPerPage);
        // Add items to the list, if it's necessary
        this._loadAsyncItems();
        // Set WAI-ARIA properties to each item
        this._updateARIA();
        // Update arrows (when pages === 1, there is no arrows)
        this._updateArrows();
        // Update pagination
        if (this._options.pagination) {
            this._addPagination();
        }
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
            extraWidth = moreThanOne ? (freeSpace / this._limitPerPage / 2) : freeSpace,
            // Amount of spaces to distribute the free space
            spaces,
            // The new width calculated from current width plus extraWidth
            width,
            // Styles to update the item element width, height & margin-right
            cssItemText;

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
        this._itemMargin = moreThanOne ? (freeSpace / spaces / 2) : 0;

        // Update distance needed to move ONLY ONE page
        // The width of all items on a page, plus the width of all margins of items
        this._pageWidth = (this._itemOuterWidth + extraWidth + this._itemMargin) * this._limitPerPage;

        // Update the list width
        // Do it before item resizing to make space to all items
        // Delete efects on list to change width instantly
        this._standbyFX(function () {
            this._list.style.cssText = this._list.style.cssText + '; ' + 'width:' + (this._pageWidth * this._pages) + 'px;';
        });

        // Get the height using new width and relation between width and height of item (ratio)
        cssItemText = [
            'width:' + (width % 1 === 0 ? width : width.toFixed(4)) + 'px;',
            this._options.autoHeight ? 'height:' + ((width * this._itemHeight) / this._itemWidth).toFixed(4) + 'px;' : '',
            'margin-right:' + (this._itemMargin % 1 === 0 ? this._itemMargin : this._itemMargin.toFixed(4)) + 'px;'
        ].join('');

        // Update element styles
        Array.prototype.forEach.call(this._items, function (item){
            item.setAttribute('style', cssItemText);
        });

        // Update the mask height with the list height
        this._mask.style.height = this._getOuterDimensions(this._list).height + 'px';

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
        [this._prevArrow, this._nextArrow].forEach(function(el){
            el.setAttribute('unselectable', 'on');
            tiny.addClass(el, 'ch-user-no-select');
        });

        // Add arrows to DOM
        this._el.insertBefore(this._prevArrow, this._el.children[0]);
        this._el.appendChild(this._nextArrow);
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
        this._prevArrow.setAttribute('aria-disabled', prev);
        this._prevArrow.setAttribute('aria-hidden', prev);
        tiny[prev ? 'addClass' : 'removeClass'](this._prevArrow, 'ch-carousel-disabled');

        this._nextArrow.setAttribute('aria-disabled', next);
        this._nextArrow.setAttribute('aria-hidden', next);
        tiny[next ? 'addClass' : 'removeClass'](this._nextArrow, 'ch-carousel-disabled');
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
        var vendorTransformKey = VENDOR_PREFIX ? VENDOR_PREFIX + 'Transform' : null;

        // Use CSS transform to move
        if (tiny.support.transition) {
            return function (displacement) {
                // Firefox has only "transform", Safari only "webkitTransform",
                // Chrome has support for both. Applied required minimum
                if (vendorTransformKey) {
                    this._list.style[vendorTransformKey] = 'translateX(' + displacement + 'px)';
                }
                this._list.style.transform = 'translateX(' + displacement + 'px)';
            };
        }

        // Use left position to move
        return function (displacement) {
            this._list.style.left = displacement + 'px';
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
        var children = this._pagination.children,
            fromItem = children[from - 1],
            toItem = children[to - 1];

        // Unselect the thumbnail previously selected
        fromItem.setAttribute('aria-selected', false);
        tiny.removeClass(fromItem, 'ch-carousel-selected');

        // Select the new thumbnail
        toItem.setAttribute('aria-selected', true);
        tiny.addClass(toItem, 'ch-carousel-selected');
    };

    /**
     * Get the current outer dimensions of an element.
     *
     * @memberof ch.Carousel.prototype
     * @param {HTMLElement} el A given HTMLElement.
     * @returns {Object}
     */
    Carousel.prototype._getOuterDimensions = function (el) {
        var obj = el.getBoundingClientRect();

        return {
            'width': (obj.right - obj.left),
            'height': (obj.bottom - obj.top)
        };
    };

    /**
     * Triggers all the necessary recalculations to be up-to-date.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.refresh = function () {

        var that = this,
            maskWidth = this._getOuterDimensions(this._mask).width;

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
        if (this._list.children.length !== this._items.length) {
            // Update the entire reference to items
            // uses querySelectorAll because it need a static collection
            this._items = this._list.querySelectorAll('li');
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

        tiny.trigger(window.document, ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    ch.factory(Carousel);

}(this, this.ch));

(function (window, ch) {
    'use strict';

    function normalizeOptions(options) {
        if (typeof options === 'string' || Array.isArray(options)) {
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
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Calendar.
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
     * var calendar = new ch.Calendar([el], [options]);
     * @example
     * // Creates a new Calendar with custom options.
     * var calendar =  new ch.Calendar({
     *     'format': 'MM/DD/YYYY',
     *     'selected': '2011/12/25',
     *     'from': '2010/12/25',
     *     'to': '2012/12/25',
     *     'monthsNames': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
     *     'weekdays': ['Su', 'Mo', 'Tu', 'We', 'Thu', 'Fr', 'Sa']
     * });
     * @example
     * // Creates a new Calendar using a shorthand way (selected date as parameter).
     * var calendar = new ch.Calendar('2011/12/25');
     */
    function Calendar(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

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

    // Inheritance
    tiny.inherits(Calendar, ch.Component);

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

        parent = Calendar.super_.prototype;

    /**
     * The name of the component.
     * @memberof! ch.Calendar.prototype
     * @type {String}
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
    Calendar.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

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
            if (!Array.isArray(selected)) {

                if (selected !== 'today') {
                    // Return date object and update currentDate
                    selected = that._dates.current = createDateObject(selected);

                } else {
                    selected = that._dates.today;
                }

            // Multiple date selection
            } else {
                selected.forEach(function (e, i){
                    // Simple date
                    if (!Array.isArray(e)) {
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

        /**
         * Template of previous arrow.
         * @type {HTMLDivElement}
         */
        this._prev = document.createElement('div');
        this._prev.setAttribute('aria-controls', 'ch-calendar-grid-' + this.uid);
        this._prev.setAttribute('role', 'button');
        this._prev.setAttribute('aria-hidden', 'false');
        tiny.addClass(this._prev, 'ch-calendar-prev');

        /**
         * Template of next arrow.
         * @type {HTMLDivElement}
         */
        this._next = document.createElement('div');
        this._next.setAttribute('aria-controls', 'ch-calendar-grid-' + this.uid);
        this._next.setAttribute('role', 'button');
        this._next.setAttribute('aria-hidden', 'false');
        tiny.addClass(this._next, 'ch-calendar-next');


        // Show or hide arrows depending on "from" and "to" limits
        tiny.on(this._prev, ch.onpointertap, function (event) {
            event.preventDefault();
            that.prevMonth();
        });
        tiny.on(this._next, ch.onpointertap, function (event) {
            event.preventDefault();
            that.nextMonth();
        });

        /**
         * The calendar container.
         * @type {HTMLElement}
         */
        this.container = this._el;
        this.container.insertBefore(this._prev, this.container.firstChild);
        this.container.insertBefore(this._next, this.container.firstChild);
        tiny.addClass(this.container, 'ch-calendar');
        this.container.insertAdjacentHTML('beforeend', this._createTemplate(this._dates.current));

        this._updateControls();

        // Avoid selection on the component
        that.container.setAttribute('unselectable', 'on');
        tiny.addClass(that.container, 'ch-user-no-select');

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
            tiny.removeClass(this._prev, 'ch-hide');
            this._prev.setAttribute('aria-hidden', 'false');

        // Hide previous arrow when it's out of limit
        } else {
            tiny.addClass(this._prev, 'ch-hide');
            this._prev.setAttribute('aria-hidden', 'true');
        }

        // Show next arrow when it's out of limit
        if (this._hasNextMonth()) {
            tiny.removeClass(this._next, 'ch-hide');
            this._next.setAttribute('aria-hidden', 'false');

        // Hide next arrow when it's out of limit
        } else {
            tiny.addClass(this._next, 'ch-hide');
            this._next.setAttribute('aria-hidden', 'true');
        }

        return this;
    };

    /**
     * Refresh the structure of Calendar's table with a new date.
     * @function
     * @private
     */
    Calendar.prototype._updateTemplate = function (date) {
        var month;

        // Update "currentDate" object
        this._dates.current = (typeof date === 'string') ? createDateObject(date) : date;

        // Delete old table
        month = this.container.querySelector('table');
        this.container.removeChild(month);

        // Append new table to content
        this.container.insertAdjacentHTML('beforeend', this._createTemplate(this._dates.current));

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
        if (!Array.isArray(this._dates.selected)) {
            if (year === this._dates.selected.year && month === this._dates.selected.month && day === this._dates.selected.day) {
                yepnope = true;
                return yepnope;
            }

        // Multiple selection (ranges)
        } else {
            this._dates.selected.forEach(function (e) {
                // Simple date
                if (!Array.isArray(e)) {
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
        if (!this._enabled || !this._hasNextMonth()) {
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

        if (!this._enabled || !this._hasPrevMonth()) {
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

        if (!this._enabled || !this._hasNextMonth()) {
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

        if (!this._enabled || !this._hasPrevMonth()) {
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

        tiny.trigger(window.document, ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    // Factorize
    ch.factory(Calendar, normalizeOptions);

}(this, this.ch));

(function (window, ch) {
    'use strict';

    /**
     * Datepicker lets you select dates.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Calendar
     * @param {HTMLElement} [el] A HTMLElement to create an instance of ch.Datepicker.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.format] Sets the date format. Default: "DD/MM/YYYY".
     * @param {String} [options.selected] Sets a date that should be selected by default. Default: "today".
     * @param {String} [options.from] Set a minimum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @param {String} [options.to] Set a maximum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @param {Array} [options.monthsNames] A collection of months names. Default: ["Enero", ... , "Diciembre"].
     * @param {Array} [options.weekdays] A collection of weekdays. Default: ["Dom", ... , "Sab"].
     * @param {Boolean} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointers".
     * @param {HTMLElement} [options.context] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally.
     * @param {Number} [options.offsetY] Distance to displace the target vertically.
     * @param {String} [options.position] The type of positioning used. You must use: "absolute" or "fixed". Default: "absolute".
     * @returns {datepicker} Returns a new instance of Datepicker.
     * @example
     * // Create a new Datepicker.
     * var datepicker = new ch.Datepicker([selector], [options]);
     * @example
     * // Create a new Datepicker with custom options.
     * var datepicker = new ch.Datepicker({
     *     "format": "MM/DD/YYYY",
     *     "selected": "2011/12/25",
     *     "from": "2010/12/25",
     *     "to": "2012/12/25",
     *     "monthsNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
     *     "weekdays": ["Su", "Mo", "Tu", "We", "Thu", "Fr", "Sa"]
     * });
     */
    function Datepicker(selector, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(selector, options);

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
    tiny.inherits(Datepicker, ch.Component);

    var parent = Datepicker.super_.prototype,
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
    Datepicker.prototype._init = function (selector, options) {
        // Call to its parent init method
        parent._init.call(this, selector, options);

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
        this.field.insertAdjacentHTML('afterend', '<i role="button" class="ch-datepicker-trigger ch-icon-calendar"></i>');

        /**
         * The datepicker trigger.
         * @type {HTMLElement}
         */
        this.trigger = tiny.next(this.field);

        /**
         * Reference to the Calendar component instanced.
         * @type {ch.Calendar}
         * @private
         */
        this._calendar = new ch.Calendar(document.createElement('div'), options);

        /**
         * Reference to the Popover component instanced.
         * @type {ch.Popover}
         * @private
         */
        this._popover = new ch.Popover(this.trigger, {
            '_className': 'ch-datepicker ch-cone',
            '_ariaRole': 'tooltip',
            'content': this._calendar.container,
            'side': this._options.side,
            'align': this._options.align,
            'offsetX': 1,
            'offsetY': 10,
            'shownby': 'pointertap',
            'hiddenby': this._options.hiddenby
        });

        tiny.on(this._popover._content, ch.onpointertap, function (event) {
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

        tiny.parent(this.trigger).removeChild(this.trigger);

        this._el.removeAttribute('aria-describedby');
        this._el.type = 'date';

        this._popover.destroy();

        parent.destroy.call(this);
    };

    // Factorize
    ch.factory(Datepicker);

}(this, this.ch));

(function (Datepicker) {
    'use strict';

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Datepicker.prototype._defaults.align = 'right';
    //ch-form-icon-inner


}(this.ch.Datepicker));

(function (window, ch) {
    'use strict';


    function highlightSuggestion(target) {
        var posinset;

        Array.prototype.forEach.call(this._suggestionsList.childNodes, function(e) {
            if(e.contains(target)){
                posinset = parseInt(target.getAttribute('aria-posinset'), 10) - 1;
            }
        });

        this._highlighted = (typeof posinset === 'number') ? posinset : null;

        this._toogleHighlighted();

        return this;
    }

    var specialKeyCodeMap = {
        9: 'tab',
        27: 'esc',
        37: 'left',
        39: 'right',
        13: 'enter',
        38: 'up',
        40: 'down'
    };

    /**
     * Autocomplete Component shows a list of suggestions for a HTMLInputElement.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Popover
     * @param {HTMLElement} [el] A HTMLElement to create an instance of ch.Autocomplete.
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
     * @param {(Boolean | String)} [options.wrapper] Wrap the reference element and place the container into it instead of body. When value is a string it will be applied as additional wrapper class. Default: false.
     *
     * @returns {autocomplete}
     * @example
     * // Create a new AutoComplete.
     * var autocomplete = new AutoComplete([el], [options]);
     * @example
     * // Create a new AutoComplete with configuration.
     * var autocomplete = new AutoComplete('.my-autocomplete', {
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
    function Autocomplete(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

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
    tiny.inherits(Autocomplete, ch.Component);

    var parent = Autocomplete.super_.prototype,
        // there is no mouseenter to highlight the item, so it happens when the user do mousedown
        highlightEvent = (tiny.support.touch) ? ch.onpointerdown : 'mouseover';

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
        '_itemTemplate': '<li class="{{itemClass}}"{{suggestedData}}>{{term}}<i class="ch-icon-arrow-up" data-js="ch-autocomplete-complete-query"></i></li>',
        'wrapper': false
    };

    /**
     * Initialize a new instance of Autocomplete and merge custom options with defaults options.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._init = function (el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        // Call to its parent init method
        parent._init.call(this, el, options);

        // creates the basic item template for this instance
        this._options._itemTemplate = this._options._itemTemplate.replace('{{itemClass}}', this._options.itemClass);

        if (this._options.html) {
            // remove the suggested data space when html is configured
            this._options._itemTemplate = this._options._itemTemplate.replace('{{suggestedData}}', '');
        }

        // The component who shows and manage the suggestions.
        this._popover = new ch.Popover({
            'reference': this._el,
            'content': this._suggestionsList,
            'side': this._options.side,
            'align': this._options.align,
            'addClass': this._options.addClass,
            'hiddenby': this._options._hiddenby,
            'width': this._el.getBoundingClientRect().width + 'px',
            'fx': this._options.fx,
            'wrapper': this._options.wrapper
        });

        /**
         * The autocomplete container.
         * @type {HTMLDivElement}
         * @example
         * // Gets the autocomplete container to append or prepend content.
         * autocomplete.container.appendChild(document.createElement('div'));
         */
        this.container = this._popover.container;

        this.container.setAttribute('aria-hidden', 'true');

        /**
         * The autocomplete suggestion list.
         * @type {HTMLUListElement}
         * @private
         */
        this._suggestionsList = document.createElement('ul');
        tiny.addClass(this._suggestionsList, 'ch-autocomplete-list');

        this.container.appendChild(this._suggestionsList);

        /**
         * Selects the items
         * @memberof! ch.Autocomplete.prototype
         * @function
         * @private
         * @returns {autocomplete}
         */

        this._highlightSuggestion = function (event) {
            var target = event.target || event.srcElement,
                item = (target.nodeName === 'LI') ? target : (target.parentNode.nodeName === 'LI') ? target.parentNode : null;

            if (item !== null) {
                highlightSuggestion.call(that, item);
            }

        };

        tiny.on(this.container, highlightEvent, this._highlightSuggestion);


        tiny.on(this.container, ch.onpointertap, function itemEvents(event) {
            var target = event.target || event.srcElement;

            // completes the value, it is a shortcut to avoid write the complete word
            if (target.nodeName === 'I' && !that._options.html) {
                event.preventDefault();
                that._el.value = that._suggestions[that._highlighted];
                that.emit('type', that._el.value);
                return;
            }

            if ((target.nodeName === 'LI' && target.className.indexOf(that._options.itemClass) !== -1) || (target.parentElement.nodeName === 'LI' && target.parentElement.className.indexOf(that._options.itemClass) !== -1)) {
                that._selectSuggestion();
            }
        });

        /**
         * The autocomplete trigger.
         * @type {HTMLElement}
         */
        this.trigger = this._el;

        this.trigger.setAttribute('aria-autocomplete', 'list');
        this.trigger.setAttribute('aria-haspopup', 'true');
        this.trigger.setAttribute('aria-owns', this.container.getAttribute('id'));
        this.trigger.setAttribute('autocomplete', 'off');

        tiny.on(this.trigger, 'focus', function turnon() { that._turn('on'); });
        tiny.on(this.trigger, 'blur', function turnoff() {that._turn('off'); });

        // Turn on when the input element is already has focus
        if (this._el === document.activeElement && !this._enabled) {
            this._turn('on');
        }

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
    Autocomplete.prototype._turn = function (turn) {
        var that = this;

        if (!this._enabled) {
            return this;
        }


        function turnOn() {
            that._currentQuery = that._el.value.trim();

            // when the user writes
            window.clearTimeout(that._stopTyping);

            that._stopTyping = window.setTimeout(function () {

                tiny.addClass(that.trigger, that._options.loadingClass);
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
        }

        function turnOnFallback(e) {
            if (specialKeyCodeMap[e.which || e.keyCode]) {
                return;
            }
            // When keydown is fired that.trigger still has an old value
            setTimeout(turnOn, 1);
        }

        this._originalQuery = this._el.value;

        // IE8 don't support the input event at all
        // IE9 is the only browser that doesn't fire the input event when characters are removed
        var ua = navigator.userAgent;
        var MSIE = (/(msie|trident)/i).test(ua) ?
            ua.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;

        if (turn === 'on') {
            if (!MSIE || MSIE > 9) {
                tiny.on(this.trigger, ch.onkeyinput, turnOn);
            } else {
                'keydown cut paste'.split(' ').forEach(function(evtName) {
                    tiny.on(that.trigger, evtName, turnOnFallback);
                });
            }
        } else if (turn === 'off') {
            this.hide();
            if (!MSIE || MSIE > 9) {
                tiny.off(this.trigger, ch.onkeyinput, turnOn);
            } else {
                'keydown cut paste'.split(' ').forEach(function(evtName) {
                    tiny.off(that.trigger, evtName, turnOnFallback);
                });
            }
        }

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
     * It highlights the item adding the "ch-autocomplete-highlighted" class name or the class name that you configured as "highlightedClass" option.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._toogleHighlighted = function () {
        // null is when is not a selected item but,
        // increments 1 _highlighted because aria-posinset starts in 1 instead 0 as the collection that stores the data
        var current = (this._highlighted === null) ? null : (this._highlighted + 1),
            currentItem = this.container.querySelector('[aria-posinset="' + current + '"]'),
            selectedItem = this.container.querySelector('[aria-posinset].' + this._options.highlightedClass);

        if (selectedItem !== null) {
            // background the highlighted item
            tiny.removeClass(selectedItem, this._options.highlightedClass);
        }

        if (currentItem !== null) {
            // highlight the selected item
            tiny.addClass(currentItem, this._options.highlightedClass);
        }

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
            matchedRegExp = new RegExp('(' + this._currentQuery.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1') + ')', 'ig'),
            totalItems = 0,
            itemDOMCollection,
            itemTemplate = this._options._itemTemplate,
            suggestedItem,
            term,
            suggestionsLength = suggestions.length,
            el,
            itemSelected = this.container.querySelector('.' + this._options.highlightedClass);

        // hide the loading feedback
        tiny.removeClass(this.trigger, that._options.loadingClass);

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
        if (itemSelected !== null) {
            tiny.removeClass(itemSelected, this._options.highlightedClass);
        }

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

        this._suggestionsList.innerHTML = items.join('');

        itemDOMCollection = this.container.querySelectorAll('.' + this._options.itemClass);

        // with this we set the aria-setsize value that counts the total
        totalItems = itemDOMCollection.length;

        // Reset suggestions collection.
        this._suggestions.length = 0;

        for (suggestedItem = 0; suggestedItem < totalItems; suggestedItem += 1) {
            el = itemDOMCollection[suggestedItem];

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

        tiny.off(this.container, highlightEvent, this._highlightSuggestion);

        this.trigger.removeAttribute('autocomplete');
        this.trigger.removeAttribute('aria-autocomplete');
        this.trigger.removeAttribute('aria-haspopup');
        this.trigger.removeAttribute('aria-owns');

        this._popover.destroy();

        parent.destroy.call(this);

        return;
    };

    ch.factory(Autocomplete);

}(this, this.ch));
