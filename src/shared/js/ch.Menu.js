/**
 * Menu lets you organize the links by categories.
 * @name Menu
 * @class Menu
 * @augments ch.Widget
 * @requires ch.Expandable
 * @memberOf ch
 * @param {Object} [options] Object with configuration properties.
 * @param {Number} [options.selected] Selects a child that will be open when component was loaded.
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
 *     'selected': 2,
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
        'fx': 'slideDown',
        'accordion': false
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
         * Stores witch expandable is selected.
         * @private
         * @name ch.Menu#_selected
         * @type number
         */
        that._selected = that._options.selected;

        /**
         * Default behavior
         */

        // Inits an expandable component on each list inside main HTML code snippet
        that._createExpandables();

        // Accordion behavior
        if (this._options.accordion) {
            // Sets the interface main class name for avoid
            that._configureAccordion();

        } else {
            // Set the wai-aria for Menu
            that.$el.attr('role', 'navigation');
        }

        that.$el.addClass('ch-menu ' + (this._options._className || '') + ' ' + (this._options.addClass || ''));

        // Select specific item if there are a "selected" parameter on component configuration object
        if (that._selected !== undefined) {
            that.select(that._selected);
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
                        // Updates selected when it's opened
                        that._selected = i + 1;

                        /**
                         * It is triggered when the a fold is selected by the user.
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

                if (!that._options.accordion) {
                    $child.next()
                        .attr('role', 'menu')
                        .children().attr('role', 'presentation')
                            .children()
                                .attr('role', 'menuitem');
                }

                // Add expandable to that._children
                that._children.push(expandable);
            }
        }

        $.each(that.$el.children(), createExpandable);

        return that;
    };

   /**
    * Selects a specific expandable to be shown or hidden.
    * @public
    * @name select
    * @name ch.Menu
    * @param item The number of the item to be selected
    * @returns
    */
    Menu.prototype.select = function (child) {

        if (!this._enabled) {
            return this;
        }

        // Getter
        if (child === undefined) {
            return this._selected;
        }

        // Setter
        var that = this,
            // Specific item of that._children list
            item = that._children[child - 1];

        // Item as expandable
        if (item instanceof ch.Expandable) {

            if (this._options.accordion && this._selected !== undefined && this._selected !== child) {
                this._children[this._selected - 1].hide();
            }

            // Show
            item.show();
        }

        // Update selected item
        that._selected = child;

        /**
         * It is triggered when the a fold is selected by the user.
         * @name ch.Menu#select
         * @event
         * @public
         * @exampleDescription When the user select
         * @example
         * widget.on('select',function(){
         *     app.off();
         * });
         */
        that.emit('select');

        return that;
    };

    /**
     * Binds controller's own click to expandable triggers
     * @private
     * @function
     */
    Menu.prototype._configureAccordion = function () {
        var that = this;

        $.each(that._children, function (i, expandable) {
            if (expandable instanceof ch.Expandable) {
                expandable.$el
                    .off('.expandable')
                    .on(ch.events.pointer.TAP + '.accordion', function () {
                        var opened = that._children[that._selected - 1];

                        if (that._selected !== undefined && expandable !== opened) {
                            opened.hide();
                        }

                        that.select(i + 1);
                    });
            }
        });
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
                'selected': num
            };
        }

        return options;
    };

    /**
     * Factory
     */
    ch.factory(Menu, Menu.prototype._normalizeOptions);

}(this, this.ch.$, this.ch));