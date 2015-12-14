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
