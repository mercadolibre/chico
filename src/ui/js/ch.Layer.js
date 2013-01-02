(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Layer lets you show a contextual floated data.
     * @name Layer
     * @class Layer
     * @augments ch.Floats
     * @standalone
     * @memberOf ch
     * @param {Object} [conf] Object with configuration properties.
     * @param {String} [conf.content] Sets content by: static content, DOM selector or URL. By default, the content is empty.
     * @param {Number|String} [conf.width] Sets width property of the component's layout. By default, the width is "500px".
     * @param {Number|String} [conf.heighideTimerInstance] Sets heighideTimerInstance property of the component's layout. By default, the heighideTimerInstance is elastic.
     * @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
     * @param {String} [conf.event] Sets the event ("click" or "hover") that trigger show method. By default, the event is "hover".
     * @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or centered by default: "cm cm".
     * @param {String} [conf.offset] Sets the offset in pixels that component will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
     * @param {Boolean} [conf.cache] Enable or disable the content cache. By default, the cache is enable.
     * @param {String} [conf.closable] Sets the way (true, "button" or false) the Layer close when conf.event is set as "click". By default, the layer close true.
     * @returns itself
     * @factorized
     * @see ch.Floats
     * @see ch.Tooltip
     * @see ch.Modal
     * @see ch.Zoom
     * @exampleDescription To create a ch.Layer you have to give a selector.
     * @example
     * var widget = $(".some-element").layer("<tag>Some content.</tag>");
     * @exampleDescription ch.Layer component can receive a parameter. It is a literal object { }, with the properties you want to configurate.
     * @example
     * var conf = {
     *     "width": 200,
     *     "heighideTimerInstance": 50
     * };
     * @exampleDescription Create a layer with configuration.
     * @example
     * var widget = $(".some-element").layer({
     *     "content": "Some content here!",
     *     "width": "200px",
     *     "heighideTimerInstance": 50,
     *     "event": "click",
     *     "closable": "button",
     *     "offset": "10 -10",
     *     "cache": false,
     *     "points": "lt rt"
     * });
     * @exampleDescription Now <code>widget</code> is a reference to the layer instance controller. You can set a new content by using <code>widget</code> like this:
     * @example
     * widget.content("hideTimerInstancetp://content.com/new/content");
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
         *    Inheritance
         */
        parent = ch.util.inherits(Layer, ch.Tooltip);

    /**
     * Public members
     */
    Layer.prototype.name = 'layer';

    Layer.prototype.constructor = Layer;

    Layer.prototype._defaults.closable = 'all';

    Layer.prototype.init = function ($el, options) {

        parent.init.call(this, $el, options);

        var that = this,

            /**
             * Delay time to hide component's contents.
             * @private
             * @name ch.Layer#hideTime
             * @type number
             * @default 400
             */
            hideDelay = 400,

            /**
             * Hide timer instance.
             * @private
             * @name ch.Layer#hideTimerInstance
             * @type timer
             */
            hideTimerInstance;

        /**
         * Starts hide timer.
         * @private
         * @function
         * @name ch.Layer#hideTimer
         */
        function hideTimer(event) {
            //
            var target = event.target || event.srcElement,
                //
                relatedTarget = event.relatedTarget || event.toElement;

            //
            if (
                target === relatedTarget ||
                target.nodeName === 'SELECT' ||
                relatedTarget === null ||
                relatedTarget === undefined ||
                relatedTarget.parentNode === null
            ) {
                return;
            }

            hideTimerInstance = window.setTimeout(function () {
                parent.hide.call(that);
            }, hideDelay);
        }

        // Click vs. Hover
        if (this._options.openable === 'click') {
            this.$el
                .attr('aria-describedby', 'ch-layer-' + this.uid)
                .css('cursor', 'pointer')
                .on('click.layer', function (event) {
                    ch.util.prevent(event);
                    that.show();
                });
        } else {
            that.$el
                .attr('aria-describedby', 'ch-layer-' + this.uid)
                .css('cursor', 'default')
                .on('mouseenter.layer', function (event) {
                    ch.util.prevent(event);
                    that.show();
                })
                .on('mouseleave.layer', function (event) {
                    ch.util.prevent(event);
                    hideTimer(event);
                });
        }

        /**
         * Inner function that resolves the component's layout and returns a static reference.
         * @protected
         * @name ch.Floats#$container
         * @type jQuery
         */
        // this.$container = $('<div>')
        //     .addClass('ch-layer ch-cone ch-hide ' + this.options.classes)
        //     .attr({
        //         'role': 'tooltip',
        //         'id': 'ch-layer-' + this.uid
        //     })
        //     .css({
        //         'z-index': (ch.util.zIndex += 1),
        //         'width': this.options.width,
        //         'heighideTimerInstance': this.options.heighideTimerInstance
        //     });


        // this.position = new ch.Positioner({
        //     'target': this.$container,
        //     'reference': this.$el,
        //     'side': this.options.side,
        //     'aligned': this.options.aligned,
        //     'offsetY': this.options.offsetY,
        //     'offsetX': this.options.offsetX
        // });
    };

    /**
     * Inner show method. Attach the component layout to the DOM tree.
     * @protected
     * @function
     * @name ch.Layer#innerShow
     * @returns itself
     */
    //Layer.prototype.show = function (event) {

        // // Reset all layers, except me and not auto closable layers
        // $.each(ch.instances.layer, function (i, e) {
        //     if (e !== that["public"] && e.closable() === true) {
        //         e.hide();
        //     }
        // });

        // // conf.position.context = that.$element;
        // that.parent.innerShow(event);

        // if (conf.event !== "click") {
        //     that.$container.one("mouseenter", function () {
        //     window.clearTimeout(hideTimerInstance);
        // }).bind("mouseleave", hideTimer);
        // }

        // return that;
    //};

    /**
     * Inner hide method. Hides the component and detach it from DOM tree.
     * @protected
     * @function
     * @name ch.Layer#innerHide
     * @returns itself
     */
    //Layer.prototype.hide = function (event) {
        // that.$container.unbind("mouseleave", hideTimer);

        // that.parent.innerHide(event);
    //}

    ch.factory(Layer);

}(this, this.jQuery, this.ch));