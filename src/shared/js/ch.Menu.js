(function (window, $, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Menu lets you organize the links by categories.
     * @memberof ch
     * @constructor
     * @augments ch.Widget
     * @requires ch.Expandable
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Menu.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.fx] Enable or disable UI effects. By default, the effect is "slideDown". You should use: "slideDown", "fadeIn" or "none".
     * @returns {menu} Returns a new instance of Menu.
     * @example
     * // Create a new menu without configuration.
     * var menu = $(selector).menu();
     * @example
     * // Create a new menu with configuration.
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

        /**
         * Event emitted when the widget is ready to use.
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
    var parent = ch.util.inherits(Menu, ch.Widget),

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
     * The name of the widget.
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
                         *  // Some code here!
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
                         *  // Some code here!
                         * });
                         */
                        that.emit('hide');
                    });

                $child.next()
                    .attr('role', 'menu')
                    .children().attr('role', 'presentation')
                        .children()
                            .attr('role', 'menuitem');

                // Add expandable to that.fold
                that.folds.push(expandable);
            }
        }

        $.each(that.$container.children(), createExpandable);

        return that;
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
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. By default is "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. By default is true.
     * @param {Boolean} [options.async]  Force to sent request asynchronously. By default is true.
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

    /**
     * Enables an instance of Menu or a specific fold.
     * @memberof! ch.Menu.prototype
     * @name enable
     * @function
     * @param {Number} [fold] - A given number of fold to enable.
     * @returns {menu} Returns an instance of Menu.
     * @expample
     * // Enabling an instance of Menu.
     * menu.enable();
     * @expample
     * // Enabling the second fold of a menu.
     * menu.enable(2);
     */

    /**
     * Disables an instance of Menu or a specific fold.
     * @memberof! ch.Menu.prototype
     * @name disable
     * @function
     * @param {Number} [fold] - A given number of fold to disable.
     * @returns {menu} Returns an instance of Menu.
     * @expample
     * // Disabling an instance of Menu.
     * menu.disable();
     * @expample
     * // Disabling the second fold.
     * menu.disable(2);
     */
    while (len) {
        createMethods(methods[len -= 1]);
    }

    /**
     * Destroys a Menu instance.
     * @memberof! ch.Menu.prototype
     * @function
     * @expample
     * // Destroying an instance of Menu.
     * menu.destroy();
     */
    Menu.prototype.destroy = function () {

        $.each(this.folds, function (i, e) {
            if (e.destroy !== undefined) {
                e.destroy();
            }
        });

        this._el.parentNode.replaceChild(this._snippet, this._el);

        $(window.document).trigger(ch.onchangelayout);

        parent.destroy.call(this);
    };

    // Factorize
    ch.factory(Menu);

}(this, this.ch.$, this.ch));
