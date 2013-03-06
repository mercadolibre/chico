(function (window, $, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Expandable lets you show or hide the container. Expandable needs a pair: the title and the container related to that title.
     * @constructor
     * @memberOf ch
     * @augments ch.Navs
     * @param {Object} [options] Object with configuration properties.
     * @param {Boolean} [options.open] Shows the expandable open when component was loaded. By default, the value is false.
     * @param {Boolean} [options.fx] Enable or disable UI effects. By default, the effects are disable.
     * @returns {Object}
     * @exampleDescription Create a new Expandable.
     * @example
     * var widget = $('.example').expandable();
     * @exampleDescription Create a new Expandable with configuration.
     * @example
     * var widget = $('.example').expandable({
     *     'open': true,
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
         * @exampleDescription Following the first example, using <code>widget</code> as expandable's instance controller:
         * @example
         * widget.on('ready',function () {
         *  this.show();
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    /**
     * Private
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
        'open': false,
        'fx': false
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
        var that = this,

            /**
             * Map that contains the ARIA attributes for the trigger element
             * @private
             * @type {Object}
             * @ignore
             */
            triggerAttr = {
                'aria-expanded': this._options.open,
                'aria-controls': 'ch-' + this.name + '-' + this.uid
            },

            /**
             * Map that contains the ARIA attributes for the container element
             * @private
             * @type {Object}
             * @ignore
             */
            containerAttr = {
                'id': triggerAttr['aria-controls'],
                'aria-hidden': !triggerAttr['aria-expanded']
            };

        /**
         * Protected Members
         */

        /**
         * The component's trigger.
         * @protected
         * @type {Selector}
         * @ignore
         */
        this.$trigger = this.$el.children(':first-child')
            .attr(triggerAttr)
            .addClass('ch-' + this.name + '-trigger ch-' + this.name + '-ico')
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
        this.$container = this.$el.children(':last-child')
            .attr(containerAttr)
            .addClass('ch-' + this.name + '-container ch-hide');

        /**
         * Default behavior
         */
        this.$el.addClass('ch-' + this.name);

        // Content configuration
        this.content.onmessage = function (data) {
            that.$container.html(data);
        };

        this.content.set({
            'input': this.$container.html()
        });

        // Is it open by default?
        if (this._options.open) {
            this.show();
        }

        ch.util.avoidTextSelection(this.$trigger);

        this
            .on('show', function () {
                $document.trigger(ch.events.layout.CHANGE);
            })
            .on('hide', function () {
                $document.trigger(ch.events.layout.CHANGE);
            });
    };

    /**
     * Shows component's content.
     * @public
     * @function
     * @name ch.Expabdable#show
     * @returns {Object}
     * @exampleDescription Open the Expandable widget.
     * @example
     * widget.show();
     */
    Expandable.prototype.show = function (content) {

        if (this._active) {
            return this.hide();
        }

        this._show();

        // Request the content
        if (content !== undefined) {
            this.content.configure({
                'input': content
            });
        }

        this.content.set();

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
        if (!this._active) {
            return;
        }

        this._hide();

        return this;
    };

    /**
     * Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
     * @name isActive
     * @methodOf ch.Expandable#isActive
     * @returns {Boolean}
     * @exampleDescription
     * @example
     * if (widget.isActive()) {
     *     fn();
     * }
     */
    Expandable.prototype.isActive = function () {
        return this._active;
    };

    ch.factory(Expandable);

}(this, (this.jQuery || this.Zepto), this.ch));