/**
 * Tabs lets you create tabs for static and dynamic content.
 * @name Tabs
 * @class Tabs
 * @augments ch.Widget
 * @memberOf ch
 * @param {Object} [options] Object with configuration properties.
 * @param {Number} [options.selected] Selects a child that will be open when component was loaded. By default, the value is 1.
 * @returns itself
 * @factorized
 * @exampleDescription Create a new Tab Navigator without configuration.
 * @example
 * var widget = $('.example').tabs();
 * @exampleDescription Create a new Tab Navigator with configuration.
 * @example
 * var widget = $('.example').tabs({
 *     'selected': 2
 * });
 * @see ch.Widget
 */
(function (window, $, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    function normalizeOptions(options) {

        var num = window.parseInt(options, 10);

        if (!window.isNaN(num)) {
            options = {
                'selected': num
            };
        }

        return options;
    }


    function Tabs($el, options) {

        this.init($el, options);

        /**
         * Reference to a internal component instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        /**
         * Triggers when the component is ready to use (Since 0.8.0).
         * @name ch.Tabs#ready
         * @event
         * @public
         * @since 0.8.0
         * @example
         * // Following the first example, using <code>widget</code> as Tabs's instance controller:
         * widget.on('ready',function () {
         *  this.show();
         * });
         */
        //This avoit to trigger execute after the component was instanciated
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }


    /**
     * Inheritance
     */
    var parent = ch.util.inherits(Tabs, ch.Widget);

    /**
     * Prototype
     */
    Tabs.prototype.name = 'tabs';

    Tabs.prototype.constructor = Tabs;

    Tabs.prototype._defaults = {
        'selected': 1
    };

    Tabs.prototype.init = function ($el, options) {
        parent.init.call(this, $el, options);

        var that = this;

        /**
        * The actual location hash, is used to know if there's a specific tab selected.
        * @private
        * @name ch.Tabs#hash
        * @type {String}
        */
        this._initialHash = window.location.hash.replace('#!/', '');

        /**
         * Children instances associated to this controller.
         * @public
         * @name ch.Form#children
         * @type {Array}
         */
        this._children = [];

        /**
         * The component's triggers container.
         * @protected
         * @name ch.Tabs#$triggers
         * @type {jQuery}
         */
        this.$triggers = this.$el.children(':first-child');

        /**
         * The component's container.
         * @protected
         * @name ch.Tabs#$container
         * @type {jQuery}
         */
        this.$container = this.$el.children(':last-child');

        /**
         * The tabpanel's containers.
         * @private
         * @name ch.Tabs#_$tabsContainers
         * @type {jQuery}
         */
        this._$tabsContainers = this.$container.children();

        /**
         * Default behavior
         */
        this.$el.addClass('ch-tabs');

        this.$triggers
            .addClass('ch-tabs-triggers')
            .attr('role', 'tablist');

        this.$container
            .addClass('ch-tabs-container ch-box-lite')
            .attr('role', 'presentation');

        // Creates children tab
        this.$triggers.find('a').each(function (i, e) {
            that._createTab(i, e);
        });

        this._selected = this._options.selected;

        this._hasHash();

        return this;
    };

    /**
     * Create controller's children.
     * @private
     * @name ch.Tabs#_createTabs
     * @function
     */
    Tabs.prototype._createTab = function (i, e) {
        var that = this,

            tab,

            $container = this._$tabsContainers.eq(i),

            // Create Tab's options
            options = {
                '_classNameTrigger': 'ch-tab',
                '_classNameContainer': 'ch-tabpanel ch-hide',
                'toggle': false
            };

        // Tab async configuration
        if ($container[0] === undefined) {

            $container = $('<div id="' + e.href.split('#')[1] + '" class="ch-hide">').appendTo(this.$container);

            options.content = e.href;
            options.waiting = this._options.waiting;
            options.cache = this._options.cache;
            options.method = this._options.method;
        }

        // Tab container configuration
        options.container = $container;

        // Creates new tab
        tab = new ch.Expandable($(e), options);

        // Creates tab's hash
        tab._hash = tab.el.href.split('#')[1];

        // Binds tap and focus events
        tab.$el
            .on(ch.events.pointer.TAP + '.tabs focus.tabs', function () {
                that.select(i + 1);
            });

        // Adds tabs to the collection
        this._children.push(tab);

        return this;
    };

    Tabs.prototype._hasHash = function () {
        var i = 0,
            // Shows the first tab if not hash or it's hash and it isn't from the current tab,
            len = this._children.length;
        // If hash open that tab
        for (i; i < len; i += 1) {
            if (this._children[i]._hash === this._initialHash) {
                this._selected = i + 1;
                break;
            }
        }

        this._children[this._selected - 1].show();

        /**
         * Fired when a tab is selected.
         * @name ch.Tabs#select
         * @event
         * @public
         */
        this.emit('select');

        return this;
    };

    /**
     * Select a specific tab or get the selected tab.
     * @public
     * @name ch.Tabs#select
     * @function
     * @param {Number} [tab] Tab's index.
     * @exampleDescription Selects a specific tab
     * @example
     * widget.select(0);
     * @exampleDescription Returns the selected tab's index
     * @example
     * var selected = widget.select();
     */
    Tabs.prototype.select = function (index) {

        if (index === undefined) {
            return this._selected;
        }

        var selected = this._selected,
            // Sets the tab's index
            tab = this._children[index - 1];

        // If select a tab that doesn't exist do nothing
        // Don't click me if I'm open
        if (tab === undefined || selected === index) {
            return this;
        }

        // Hides the open tab
        if (selected !== undefined) {
            this._children[selected - 1].hide();
        }

        /**
         * Get wich tab is selected.
         * @private
         * @name ch.Tabs#_selected
         * @type {Number}
         */
        this._selected = index;

        if (!tab.isActive()) {
            tab.show();
        }

        //Change location hash
        window.location.hash = '#!/' + tab._hash;

        /**
         * Fired when a tab is selected.
         * @name ch.Tabs#select
         * @event
         * @public
         */
        this.emit('select');

        return this;

    };

    /**
     * Factory
     */
    ch.factory(Tabs, normalizeOptions);

}(this, this.jQuery, this.ch));