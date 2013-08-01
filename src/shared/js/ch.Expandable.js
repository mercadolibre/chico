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
    };

    /**
     * Expandable lets you show or hide the container. Expandable needs a pair: the title and the container related to that title.
     * @memberof ch
     * @constructor
     * @augments ch.Widget
     * @mixes ch.Collapsible
     * @mixes ch.Content
     * @param {Selector} $el Query Selector element.
     * @param {Object} [options] Configuration options.
     * @param {Boolean} [options.fx] Enable or disable UI effects. By default, the effects are disable.
     * @param {Boolean} [options.toggle]
     * @param {Boolean} [options.container]
     * @param {Boolean} [options.content]
     * @returns {expandable} Returns a new instance of ch.Expandable.
     * @example
     * // Create a new Expandable.
     *
     * var widget = $('.example').expandable();
     * @example
     * // Create a new Expandable with configuration.
     *
     * var widget = $('#element').expandable({
     *     'fx': true,
     *     'toggle': true,
     *     'content': 'Some text here!',
     *     'container': $('#container')
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
         * @event ch.Expandable#ready
         * @exampleDescription Following the first example, using <code>widget</code> as Expandable's instance controller:
         * @example
         * expandable.on('ready',function () {
         *    this.show();
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
     * @type {String}
     */
    Expandable.prototype.name = 'expandable';

    /**
     * Returns a reference to the Constructor function that created the instance's prototype.
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
        'fx': false,
        'toggle': true
    };

    /**
     * Constructs a new Expandable.
     * @memberof! ch.Expandable.prototype
     * @function
     * @returns {instance}
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
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * Public Members
         */

        /**
         * The component's trigger.
         * @type {Selector}
         */
        this.$trigger = this._$el
            .addClass(this._options._classNameTrigger)
            .on(ch.onpointertap + '.' + this.name, function (event) {
                ch.util.prevent(event);
                that.show();
            });

        /**
         * The component's container.
         * @type {Selector}
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
     * Shows component's content.
     * @memberof! ch.Expandable.prototype
     * @function
     * @returns {instance}
     * @example
     * // Show the Expandable widget.
     *
     * widget.show();
     */
    Expandable.prototype.show = function (content, options) {

        if (!this._enabled) {
            return this;
        }

        if (this._shown && this._options.toggle) {
            return this.hide();
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
     * Hides component's content.
     * @memberof! ch.Expandable.prototype
     * @function
     * @returns {instance}
     * @example
     * // Close the Expandable widget.
     *
     * widget.hide();
     */
    Expandable.prototype.hide = function () {

        if (!this._shown) {
            return this;
        }

        this._hide();

        this.$container.attr('aria-expanded', 'false');

        return this;
    };

    /**
     * Returns a Boolean if the component's core behavior is shown. That means it will return 'true' if the component is on and it will return false otherwise.
     * @memberof! ch.Expandable.prototype
     * @function
     * @returns {instance}
     * @example
     * if (widget.isShown()) {
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

    ch.factory(Expandable, normalizeOptions);

}(this, this.ch.$, this.ch));