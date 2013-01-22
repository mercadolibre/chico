(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    var openEvent = {
        'click': ch.events.pointer.TAP,
        'mouseenter': ch.events.pointer.ENTER
    };

    /**
     * Layer improves the native layers. Layer uses the 'alt' and 'title' attributes to grab its content.
     * @name Layer
     * @class Layer
     * @augments ch.Floats
     * @memberOf ch
     * @param {Object} [conf] Object with configuration properties.
     * @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
     * @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or centered by default: "cm cm".
     * @param {String} [conf.offset] Sets the offset in pixels that component will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
     * @returns itself
     * @factorized
     * @see ch.Modal
     * @see ch.Layer
     * @see ch.Zoom
     * @see ch.Flaots
     * @exampleDescription Create a layer.
     * @example
     * var widget = $(".some-element").layer();
     * @exampleDescription Create a new layer with configuration.
     * @example
     * var widget = $("a.example").layer({
     *     "fx": false,
     *     "offset": "10 -10",
     *     "points": "lt rt"
     * });
     * @exampleDescription
     * Now <code>widget</code> is a reference to the layer instance controller.
     * You can set a new content by using <code>widget</code> like this:
     * @example
     * widget.width(300);
     */
    function Layer($el, options) {

        this.init($el, options);

        /**
         * Reference to a internal component instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        /**
         * Triggers when the component is ready to use (Since 0.8.0).
         * @name ch.Layer#ready
         * @event
         * @public
         * @since 0.8.0
         * @exampleDescription Following the first example, using <code>widget</code> as layer's instance controller:
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
        parent = ch.util.inherits(Layer, ch.Widget);

    /**
     * Public members
     */
    Layer.prototype.name = 'layer';

    Layer.prototype.constructor = Layer;

    Layer.prototype._defaults = {
        'fx': false,
        'classes': 'ch-box-lite',
        'width': 'auto',
        'height': 'auto',
        'side': 'bottom',
        'align': 'left',
        'offsetX': 0,
        'offsetY': 10,
        'open': 'mouseenter',
        'close': 'mouseleave'
    };

    Layer.prototype.init = function ($el, options) {

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
            .addClass('ch-layer ch-hide ' + this._options.classes)
            .attr({
                'role': 'tooltip',
                'id': id
            })
            .css({
                'z-index': (ch.util.zIndex += 1),
                'width': this._options.width,
                'height': this._options.height
            });

        /**
         * Inner reference to content container. Here is where the content will be added.
         * @protected
         * @name ch.Floats#$content
         * @type jQuery
         * @see ch.Content
         */
        this._$content = $('<div class="ch-layer-content">').appendTo(this.$container);

        // Add functionality to the trigger if it exists
        if (this.$el !== undefined) {

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

        // Set WAI-ARIA to the main element (trigger or position reference)
        this._options.reference.attr('aria-describedby', id);

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

        // Configure Positioner
        this.position = new ch.Positioner({
            'target': this.$container,
            'reference': this._options.reference,
            'side': this._options.side,
            'align': this._options.align,
            'offsetY': this._options.offsetY,
            'offsetX': this._options.offsetX
        });

        // Configure Closable
        this._closable();
    };

    /**
     * Inner show method. Attach the component layout to the DOM tree.
     * @protected
     * @name ch.Layer#innerShow
     * @function
     * @returns itself
     */
    Layer.prototype.show = function (content) {

        var that = this,
            instance,
            uid;

        // Close another opened widgets
        for (uid in this._instances) {

            instance = that._instances[uid];

            // TODO: This "close !== none" conditional must be in ch.Closable.js
            if (uid !== that.uid && instance._options.close !== 'none') {
                instance.hide();
            }
        }

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
     * @name ch.Layer#innerHide
     * @function
     * @returns itself
     */
    Layer.prototype.hide = function () {
        //
        this._hide();
        //
        this.$container.detach();
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
    Layer.prototype.isActive = function () {
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
    Layer.prototype.width = function (data) {

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
    Layer.prototype.height = function (data) {

        if (data === undefined) {
            return this._options.height;
        }

        this.$container.css('height', data);

        this._options.height = data;

        return this;
    };

    ch.factory(Layer);

}(this, this.jQuery, this.ch));