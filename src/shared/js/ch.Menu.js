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
                expandable = this.fold[child];

            // enable specific expandable
            if (expandable && expandable.name === 'expandable') {

                expandable[method]();

            } else {

                i = this.fold.length;

                while (i) {

                    expandable = this.fold[i -= 1];

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
     * Protected Members
     */

        /**
         * Collection of expandables.
         * @name ch.Menu#expdanbles
         * @type {Array}
         */
        this.fold = [];

        /**
         * Default behavior
         */

        // Inits an expandable component on each list inside main HTML code snippet
        this._createExpandables();

        this.$el
            .attr('role', 'navigation')
            .addClass('ch-menu ' + (this._options._className || '') + ' ' + (this._options.addClass || ''));

        // Select specific item if there are a "shown" parameter on component configuration object
        if (this._options.shown !== undefined) {
            this.show(this._options.shown);
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

                // Add anchor to that.fold
                that.fold.push($child);

            } else {

                    // List inside list, inits an Expandable
                var expandable = $child.expandable({
                    // Show/hide on IE8- instead slideUp/slideDown
                    'fx': that._options.fx
                });

                expandable
                    .on('show', function () {
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
                        that.emit('show', i+1);
                    })
                    .on('hide', function () {
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
                        that.emit('hide');
                    });

                $child.next()
                    .attr('role', 'menu')
                    .children().attr('role', 'presentation')
                        .children()
                            .attr('role', 'menuitem');

                // Add expandable to that.fold
                that.fold.push(expandable);
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

        // Specific item of this.fold list
        this.fold[child - 1].show();

        return this;
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

        // Specific item of this.fold list
        this.fold[child - 1].hide();

        return this;
    };


    /**
     *
     */
    Menu.prototype.content = function (child, content, options) {
        if (child === undefined || typeof child !== 'number') {
            throw new window.Error('Menu.content(child, content, options): Expected number of fold.');
        }

        if (content === undefined) {
            return this.fold[child - 1].content();
        }

        this.fold[child - 1].content(content, options);

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
