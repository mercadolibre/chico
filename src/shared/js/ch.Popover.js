(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Popover improves the native popovers. Popover uses the 'alt' and 'title' attributes to grab its content.
     * @name Popover
     * @class Popover
     * @augments ch.Floats
     * @memberOf ch
     * @param {Object} [conf] Object with configuration properties.
     * @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
     * @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or centered by default: "cm cm".
     * @param {String} [conf.offset] Sets the offset in pixels that component will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
     * @returns itself
     * @factorized
     * @see ch.Modal
     * @see ch.Popover
     * @see ch.Zoom
     * @see ch.Flaots
     * @exampleDescription Create a popover.
     * @example
     * var widget = $(".some-element").popover();
     * @exampleDescription Create a new popover with configuration.
     * @example
     * var widget = $("a.example").popover({
     *     "fx": false,
     *     "offset": "10 -10",
     *     "points": "lt rt"
     * });
     * @exampleDescription
     * Now <code>widget</code> is a reference to the popover instance controller.
     * You can set a new content by using <code>widget</code> like this:
     * @example
     * widget.width(300);
     */
    function Popover($el, options) {

        this.init($el, options);

        /**
         * Reference to a internal component instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        /**
         * Triggers when the component is ready to use (Since 0.8.0).
         * @name ch.Popover#ready
         * @event
         * @public
         * @since 0.8.0
         * @exampleDescription Following the first example, using <code>widget</code> as popover's instance controller:
         * @example
         * widget.on("ready",function () {
         * this.show();
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    /**
     * Private members
     */
    var $body = $('body'),
        /**
         * Inheritance
         */
        parent = ch.util.inherits(Popover, ch.Widget),

        openEvent = {
            'click': ch.events.pointer.TAP,
            'mouseenter': ch.events.pointer.ENTER
        };

    /**
     * Public members
     */
    Popover.prototype.name = 'popover';

    Popover.prototype.constructor = Popover;

    Popover.prototype._defaults = {
        'fx': 'fadeIn',
        'classes': 'ch-box-lite',
        'width': 'auto',
        'height': 'auto',
        'open': 'click',
        'close': 'button-only'
    };

    Popover.prototype.init = function ($el, options) {

        parent.init.call(this, $el, options);

        this.require('Collapsible', 'Content', 'Closable');

        var that = this,
            // Used to ARIA attributes
            id = ['ch', this.name, this.uid].join('-');

        // Grab the instances map to close all sibling on show
        this._instances = ch.instances[this.name];

        /**
         * Inner function that resolves the component's layout and returns a static reference.
         * @protected
         * @name ch.Floats#$container
         * @type jQuery
         */
        this.$container = $('<div>')
            .addClass('ch-popover ch-hide ' + this._options.classes)
            .attr({
                'role': 'tooltip',
                'id': id
            })
            .css({
                'z-index': (ch.util.zIndex += 1),
                'width': this._options.width,
                'height': this._options.height
            });

        this.on('hide', function () {
            that.$container.remove(null, true);
        });

        /**
         * Inner reference to content container. Here is where the content will be added.
         * @protected
         * @name ch.Floats#$content
         * @type jQuery
         * @see ch.Content
         */
        this._$content = $('<div class="ch-popover-content">').appendTo(this.$container);

        // Add functionality to the trigger if it exists
        if (this.$el !== undefined) {

            // Set WAI-ARIA to the main element
            this.$el.attr('aria-describedby', id);

            // Bind the open event when configured as openable
            if (this._options.open !== 'none' && this._options.open !== false) {
                this.$el.on(openEvent[this._options.open] + '.' + this.name, function (event) {
                    ch.util.prevent(event);
                    that.show();
                });
            }

            // Use the trigger as the positioning reference
            if (this._options.reference === undefined) {
                this._options.reference = this.$el;
            }

            // Use the "title" or "alt" attributes when a content was not defined
            if (this._options.content === undefined) {
                this._options.content = this.el.title || this.el.alt;
                // Keep the attributes content into the element for possible usage
                this.el.setAttribute('data-title', this._options.content);
                // Avoid to trigger the native tooltip
                this.el.title = this.el.alt = '';
            }
        }

        // Configure Content
        this.content.configure({
            'input': this._options.content,
            'method': this._options.method,
            'params': this._options.params,
            'cache': this._options.cache,
            'async': this._options.async
        });

        this.content.onmessage = function (data) {
            that._$content.html(data);
            that.emit('contentLoad');
            that.position.refresh();
        };

        this.content.onerror = function (data) {
            that._$content.html(data);
            that.emit('contentError');
            that.position.refresh();
        };

        //if(this.name === 'popover'){ console.log(this._options.reference, that.uid) }

        // Configure Positioner
        this.position = new ch.Positioner({
            'target': this.$container,
            'reference': this._options.reference,
            'side': this._options.side,
            'align': this._options.align,
            'offsetX': this._options.offsetX,
            'offsetY': this._options.offsetY
        });

        // Configure Closable
        this._closable();
    };

    /**
     * Inner show method. Attach the component layout to the DOM tree.
     * @protected
     * @name ch.Popover#innerShow
     * @function
     * @returns itself
     */
    Popover.prototype.show = function (content) {

        var that = this,
            uid;

        // Close another opened widgets
        // TODO: This "close !== none" conditional must be in ch.Closable.js
        // for (uid in this._instances) {
        //     if (this._instances[uid] !== undefined && uid !== that.uid && that._instances[uid]._options.close !== 'none') {
        //         that._instances[uid].hide();
        //     }
        // }

        // Do it before content.set, because content.set triggers the position.refresh)
        this.$container.css('z-index', (ch.util.zIndex += 1)).appendTo($body);
        // Request the content
        this.content.set({'input': content});
        // Open the collapsible
        this._show();

        return this;
    };

    /**
     * Inner hide method. Hides the component and detach it from DOM tree.
     * @protected
     * @name ch.Popover#innerHide
     * @function
     * @returns itself
     */
    Popover.prototype.hide = function () {
        //
        this._hide();
        //
        return this;
    };

    /**
     * Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
     * @public
     * @function
     * @name ch.Floats#isActive
     * @returns boolean
     */
    Popover.prototype.isActive = function () {
        return this._active;
    };

    /**
     * Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
     * @public
     * @function
     * @name ch.Floats#width
     * @param {Number|String} [width]
     * @returns itself
     * @see ch.Zarasa#size
     * @see ch.Floats#size
     * @exampleDescription to set the width
     * @example
     * widget.width(700);
     * @exampleDescription to get the width
     * @example
     * widget.width() // 700
     */
    Popover.prototype.width = function (data) {

        if (data === undefined) {
            return this._options.width;
        }

        this.$container.css('width', data);

        this._options.width = data;

        return this;
    };

    /**
     * Sets or gets the height of the Float element.
     * @public
     * @function
     * @name ch.Floats#height
     * @returns itself
     * @see ch.Floats#size
     * @exampleDescription to set the height
     * @example
     * widget.height(300);
     * @exampleDescription to get the height
     * @example
     * widget.height // 300
     */
    Popover.prototype.height = function (data) {

        if (data === undefined) {
            return this._options.height;
        }

        this.$container.css('height', data);

        this._options.height = data;

        return this;
    };

    ch.factory(Popover);

}(this, (this.jQuery || this.Zepto), this.ch));
