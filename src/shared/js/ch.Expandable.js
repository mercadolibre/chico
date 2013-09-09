(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

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
     * @augments ch.Widget
     * @mixes ch.Collapsible
     * @mixes ch.Content
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Expandable.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.fx] Enable or disable UI effects. By default, the effects are disabled. You should use: "slideDown", "fadeIn" or "none".
     * @param {Boolean} [options.toggle] Customize toggle behavior. By default, the toggle is enabled.
     * @param {(jQuerySelector | ZeptoSelector)} [options.container] The container where the expanbdale puts its content. By default, the container will be the next sibling of $el.
     * @param {String} [options.content] The content to be shown into the expandable container.
     * @returns {expandable} Returns a new instance of Expandable.
     * @example
     * // Create a new Expandable with defaults options.
     * var widget = $(selector).expandable();
     * @example
     * // Create a new Expandable with toggle disabled.
     * $(selector).expandable({
     *     'toggle': false
     * });
     * @example
     * // Create a new Expandable with fx enabled.
     * $(selector).expandable({
     *     'fx': 'slideDown'
     * });
     * @example
     * // Create a new Expandable with a specific container.
     * $(selector).expandable({
     *     'container': $(selector)
     * });
     * @example
     * // Create a new Expandable with content loaded by ajax.
     * $(selector).expandable({
     *     'content': 'http://ui.ml.com:3040/ajax'
     * });
     *
     * // or you can use the short
     * $(selector).expandable('http://ui.ml.com:3040/ajax');
     */
    function Expandable($el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        /**
         * Event emitted when the widget is ready to use.
         * @event ch.Expandable#ready
         * @example
         * // Subscribe to "ready" event.
         * expandable.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);

        return this;
    }

    // Inheritance
    var $document = $(window.document),
        parent = ch.util.inherits(Expandable, ch.Widget);

    /**
     * The name of the widget.
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
         */
        this.$trigger = this._$el
            .addClass(this._options._classNameTrigger)
            .on(ch.onpointertap + '.' + this.name, function (event) {

                ch.util.prevent(event);
                that._options.toggle ? that._toggle() : that.show();

            });

        /**
         * The expandable container.
         * @type {(jQuerySelector | ZeptoSelector)}
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
                $document.trigger(ch.onchangelayout);
            })
            .on('hide', function () {
                $document.trigger(ch.onchangelayout);
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
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. By default is "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. By default is true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. By default is true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {expandable}
     * @example
     * // Shows a basic expandable.
     * widget.show();
     * @example
     * // Shows an expandable with new content.
     * widget.show('Some new content here!');
     * @example
     * // Shows an expandable with a new content that will be loaded by ajax and some custom options.
     * widget.show('http://chico-ui.com.ar/ajax', {
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
     * Hides widget's content.
     * @memberof! ch.Expandable.prototype
     * @function
     * @returns {expandable}
     * @example
     * // Close an expandable.
     * widget.hide();
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
     * Returns a Boolean if the widget's core behavior is shown. That means it will return 'true' if the widget is on and it will return false otherwise.
     * @memberof! ch.Expandable.prototype
     * @function
     * @returns {Boolean}
     * @example
     * // Execute a function if the widget is shown.
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
     * @expample
     * // Destroying an instance of Expandable.
     * expandable.destroy();
     */
    Expandable.prototype.destroy = function () {

        this.$trigger
            .off('.expandable')
            .removeClass('ch-expandable-trigger ch-expandable-ico ch-user-no-select')
            .removeAttr('aria-controls');

        this.$container
            .removeClass('ch-expandable-container ch-hide')
            .removeAttr('aria-expanded')
            .removeAttr('aria-hidden');

        $document.trigger(ch.onchangelayout);

        parent.destroy.call(this);
    };

    // Factorize
    ch.factory(Expandable, normalizeOptions);

}(this, this.ch.$, this.ch));