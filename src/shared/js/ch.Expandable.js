(function (window, $, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    function normalizeOptions(options) {
        if (typeof options === 'string' || ch.util.is$(options)) {
            options = {
                'content': options
            };
        }
        return options;
    };

    /**
     * Expandable lets you show or hide the container. Expandable needs a pair: the title and the container related to that title.
     * @constructor
     * @memberOf ch
     * @augments ch.Navs
     * @param {Object} [options] Object with configuration properties.
     * @param {Boolean} [options.shown] Shows the Expandable shown when component was loaded. By default, the value is false.
     * @param {Boolean} [options.fx] Enable or disable UI effects. By default, the effects are disable.
     * @returns {Object}
     * @exampleDescription Create a new Expandable.
     * @example
     * var widget = $('.example').expandable();
     * @exampleDescription Create a new Expandable with configuration.
     * @example
     * var widget = $('.example').expandable({
     *     'shown': true,
     *     'fx': true
     * });
     */
    function Expandable($el, options) {
        /**
         * Reference to a internal component instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        this.init($el, options);

        /**
         * Emits the event 'ready' when the component is ready to use.
         * @fires ch.Expandable#ready
         * @exampleDescription Following the first example, using <code>widget</code> as Expandable's instance controller:
         * @example
         * widget.on('ready',function () {
         *  this.show();
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    /**
     * Private Expandable
     */

    /**
     * Inheritance
     */
    var $document = $(window.document),
        parent = ch.util.inherits(Expandable, ch.Widget);

    /**
     * Prototype
     */

    /**
     * The name of the widget. All instances are saved into a 'map', grouped by its name. You can reach for any or all of the components from a specific name with 'ch.instances'.
     * @public
     * @type {String}
     */
    Expandable.prototype.name = 'expandable';

    /**
     * Returns a reference to the Constructor function that created the instance's prototype.
     * @public
     * @function
     */
    Expandable.prototype.constructor = Expandable;

    /**
     * Configuration by default.
     * @private
     * @type {Object}
     */
    Expandable.prototype._defaults = {
        '_classNameTrigger': 'ch-expandable-trigger ch-expandable-ico',
        '_classNameContainer': 'ch-expandable-container ch-hide',
        'shown': false,
        'fx': false,
        'toggle': true
    };

    /**
     * Constructs a new Expandable.
     * @public
     * @function
     */
    Expandable.prototype.init = function ($el, options) {
        // Call to its parents init method
        parent.init.call(this, $el, options);

        /**
         * Set required abilities
         */
        this.require('Collapsible', 'Content');

        /**
         * Private Members
         */

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
         * The component's trigger.
         * @protected
         * @type {Selector}
         * @ignore
         */
        this.$trigger = this.$el
            .addClass(this._options._classNameTrigger)
            .on(ch.events.pointer.TAP + '.' + this.name, function (event) {
                event.preventDefault();
                that.show();
            });

        /**
         * The component's container.
         * @protected
         * @type {Selector}
         * @ignore
         */
        this.$container = this._$content = (this._options.container || this.$el.next())
            .addClass(this._options._classNameContainer);

        /**
         * Default behavior
         */
        if (this._options.content !== undefined) {
            this.once('show', function () {
                that.content(this._options.content);
            });
        }

        this
            .on('show', function () {
                $document.trigger(ch.events.layout.CHANGE);
            })
            .on('hide', function () {
                $document.trigger(ch.events.layout.CHANGE);
            });

        ch.util.avoidTextSelection(this.$trigger);

        // Is it shown by default?
        if (this._options.shown) {
            this.show();
        }

    };

    /**
     * Shows component's content.
     * @public
     * @function
     * @name ch.Expandable#show
     * @returns {Object}
     * @exampleDescription Show the Expandable widget.
     * @example
     * widget.show();
     */
    Expandable.prototype.show = function (content) {

        if (!this._enabled) {
            return this;
        }

        if (this._shown && this._options.toggle) {
            return this.hide();
        }

        this._show();

        // Set new content
        if (content !== undefined) {
            this.content(content);
        }

        return this;
    };

    /**
     * Hides component's content.
     * @public
     * @function
     * @name ch.Expandable#hide
     * @returns {Object}
     * @exampleDescription Close the Expandable widget.
     * @example
     * widget.hide();
     */
    Expandable.prototype.hide = function () {

        if (!this._shown) {
            return this;
        }

        this._hide();

        return this;
    };

    /**
     * Returns a Boolean if the component's core behavior is shown. That means it will return 'true' if the component is on and it will return false otherwise.
     * @name isShown
     * @methodOf ch.Expandable#isShown
     * @returns {Boolean}
     * @exampleDescriptiong
     * @example
     * if (widget.isShown()) {
     *     fn();
     * }
     */
    Expandable.prototype.isShown = function () {
        return this._shown;
    };

    ch.factory(Expandable, normalizeOptions);

}(this, this.ch.$, this.ch));