/**
 * Menu lets you organize the links by categories.
 * @name Menu
 * @class Menu
 * @augments ch.Widget
 * @requires ch.Expandable
 * @memberOf ch
 * @param {Object} [options] Object with configuration properties.
 * @param {Number} [options.shown] Selects a child that will be open when component was loaded.
 * @param {Boolean} [options.fx] Enable or disable UI effects. By default, the effects are disable.
 * @returns itself
 * @factorized
 * @see ch.Expandable
 * @see ch.Widget
 * @exampleDescription Create a new menu without configuration.
 * @example
 * var widget = $('.example').menu();
 * @exampleDescription Create a new menu with configuration.
 * @example
 * var widget = $('.example').menu({
 *     'shown': 2,
 *     'fx': true
 * });
 */
(function (window, $, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    function Menu($el, options) {

        /**
         * Reference to a internal component instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        that.init($el, options);

        /**
         * Emits the event 'ready' when the component is ready to use.
         * @fires ch.Menu#ready
         * @exampleDescription Following the first example, using <code>widget</code> as menu's instance controller:
         * @example
         * widget.on('ready',function () {
         *  this.show();
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    /**
     * Inheritance
     */
    var parent = ch.util.inherits(Menu, ch.Widget),

    /**
     * Creates methods enable and disable into the prototype.
     */
        methods = ['enable', 'disable'],
        len = methods.length;

    function createMethods(method) {
        Menu.prototype[method] = function (child) {
            var i,
                expandable = this._children[child];

            // enable specific expandable
            if (expandable && expandable.name === 'expandable') {

                expandable[method]();

            } else {

                i = this._children.length;

                while (i) {

                    expandable = this._children[i -= 1];

                    if (expandable.name === 'expandable') {
                        expandable[method]();
                    }

                }

                // enable all
                parent[method].call(this);
            }

            return this;
        };
    }

    /**
     * Prototype
     */

    /**
     * The name of the widget. All instances are saved into a 'map', grouped by its name. You can reach for any or all of the components from a specific name with 'ch.instances'.
     * @public
     * @type {String}
     */
    Menu.prototype.name = 'menu';

    /**
     * Returns a reference to the Constructor function that created the instance's prototype.
     * @public
     * @function
     */
    Menu.prototype.constructor = Menu;

    /**
     * Configuration by default.
     * @private
     * @type {Object}
     */
    Menu.prototype._defaults = {
        'fx': 'slideDown'
    };

    /**
     * Constructs a new Menu.
     * @public
     * @function
     */
    Menu.prototype.init = function ($el, options) {
        // Call to its parents init method
        parent.init.call(this, $el, options);

        /**
         * Reference to a internal component instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

    /**
     * Protected Members
     */

        /**
         * Collection of expandables.
         * @name ch.Menu#expdanbles
         * @type {Array}
         */
        that._children = [];

        /**
         * Stores witch expandable is shown.
         * @private
         * @name ch.Menu#_shown
         * @type number
         */
        that._shown = that._options.shown;

        /**
         * Default behavior
         */

        // Inits an expandable component on each list inside main HTML code snippet
        that._createExpandables();

        that.$el
            .attr('role', 'navigation')
            .addClass('ch-menu ' + (this._options._className || '') + ' ' + (this._options.addClass || ''));

        // Select specific item if there are a "shown" parameter on component configuration object
        if (that._shown !== undefined) {
            that.select(that._shown);
        }

        return this;
    };

    /**
     * Inits an Expandable component on each list inside main HTML code snippet
     * @private
     * @name ch.Menu#_createExpandables
     * @function
     */
    Menu.prototype._createExpandables = function () {
        var that = this,
            $li,
            $child,
            $menu;

        function createExpandable(i, li) {
            // List element
            $li = $(li).addClass('ch-menu-fold');

            // Children of list elements
            $child = $li.children(':first-child');

            // Anchor inside list
            if ($child[0].tagName === 'A') {

                // Add attr role to match wai-aria
                $li.attr('role', 'presentation');

                $child.addClass('ch-fold-trigger');

                // Add anchor to that._children
                that._children.push($child);

            } else {

                // List inside list, inits an Expandable
                var expandable = $child.expandable({
                    // Show/hide on IE8- instead slideUp/slideDown
                    'fx': that._options.fx,
                    'onshow': function () {
                        // Updates shown when it's opened
                        that._shown = i + 1;

                        /**
                         * It is triggered when the a fold is shown by the user.
                         * @name ch.Menu#select
                         * @event
                         * @public
                         * @exampleDescription When the user select
                         * @example
                         * widget.on('select',function () {
                         *     app.off();
                         * });
                         */
                        that.emit('select');
                    }
                });

                $child.next()
                    .attr('role', 'menu')
                    .children().attr('role', 'presentation')
                        .children()
                            .attr('role', 'menuitem');

                // Add expandable to that._children
                that._children.push(expandable);
            }
        }

        $.each(that.$el.children(), createExpandable);

        return that;
    };

   /**
    * Shows a specific child.
    * @public
    * @name show
    * @name ch.Menu#show
    * @param {Number} child - The number of the item to be shown
    * @returns {Object}
    */
    Menu.prototype.show = function (child) {

        if (!this._enabled) {
            return this;
        }

        // Setter
        var that = this,
            // Specific item of that._children list
            item = that._children[child - 1];

        // Item as expandable
        if (item instanceof ch.Expandable) {
            item.show();
        }

        // Update shown item
        that._shown = child;

        /**
         * It is triggered when a children is shown.
         * @name ch.Menu#show
         * @event
         * @public
         * @exampleDescription
         * @example
         * widget.on('show',function(){
         *     app.off();
         * });
         */
        that.emit('show', item);

        return that;
    };

/**
    * Hides a specific child.
    * @public
    * @name hide
    * @name ch.Menu
    * @param {Number} child - The number of the item to be hidden
    * @returns {Object}
    */
    Menu.prototype.hide = function (child) {

        if (!this._enabled) {
            return this;
        }

        // Setter
        var that = this,
            // Specific item of that._children list
            item = that._children[child - 1];

        // Item as expandable
        if (item instanceof ch.Expandable) {
            // Hide
            item.hide();
        }

        // Update shown item
        that._shown = undefined;

        /**
         * It is triggered when a children is hidden.
         * @name ch.Menu#hide
         * @event
         * @public
         * @exampleDescription
         * @example
         * widget.on('hide',function(){
         *     app.off();
         * });
         */
        that.emit('hide', item);

        return that;
    };


    /**
     * Returns a Boolean if the component's core behavior is shown. That means it will return 'true' if the component is on and it will return false otherwise.
     * @name getShown
     * @methodOf ch.Menu#getShown
     * @returns {Boolean}
     * @exampleDescriptiong
     * @example
     * if (widget.getShown() === 1) {
     *     fn();
     * }
     */
    Menu.prototype.getShown = function () {
        return this._shown;
    };

    /**
     *
     */
    Menu.prototype.content = function (child, content) {
        if (child === undefined) {
            return this._children[child - 1].content();
        }

        this._children[child - 1].content(content);

        return this;
    };

    /**
     *
     * @public
     * @name ch.Menu#enable
     * @function
     * @returns itself
     */
    /**
     *
     * @public
     * @name ch.Menu#disable
     * @function
     * @returns itself
     */
    while (len) {
        createMethods(methods[len -= 1]);
    }

    Menu.prototype._normalizeOptions = function (options) {

        var num = window.parseInt(options, 10);

        if (!window.isNaN(num)) {
            options = {
                'shown': num
            };
        }

        return options;
    };

    /**
     * Factory
     */
    ch.factory(Menu, Menu.prototype._normalizeOptions);

}(this, this.ch.$, this.ch));