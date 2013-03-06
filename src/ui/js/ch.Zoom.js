(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Zoom shows a contextual reference to an augmented version of main declared image.
     * @name Zoom
     * @class Zoom
     * @augments ch.Floats
     * @requires ch.onImagesLoads
     * @memberOf ch
     * @param {Object} [conf] Object with configuration properties.
     * @param {Boolean} [conf.fx] Enable or disable fade effect on show. By default, the effect are disabled.
     * @param {Boolean} [conf.context] Sets a reference to position of component that will be considered to carry out the position. By  default is the anchor of HTML snippet.
     * @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or "lt rt" by default.
     * @param {String} [conf.offset] Sets the offset in pixels that component will be displaced from original position determined by points. It's specified by configuration or "20 0" by default.
     * @param {String} [conf.content] This message will be shown when component needs to communicate that is in process of load. It's "Loading zoom..." by default.
     * @param {Number} [conf.width] Width of floated area of zoomed image. Example: 500, "500px", "50%". Default: 350.
     * @param {Number} [conf.height] Height of floated area of zoomed image. Example: 500, "500px", "50%". Default: 350.
     * @returns itself
     * @exampleDescription Create a Zoom component wrapping the original image with a anchor element pointing to a bigger version than the original.
     * @example
     * var widget = $(".example").zoom();
     * @factorized
     * @see ch.Floats
     * @see ch.Modal
     * @see ch.Tooltip
     * @see ch.Layer
     * @see ch.OnImagesLoads
     */
    function Zoom($el, options) {

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
    var parent = ch.util.inherits(Zoom, ch.Popover),
        pointerEvents = ch.events.pointer;

    /**
     * Public members
     */
    Zoom.prototype.name = 'zoom';

    Zoom.prototype.constructor = Zoom;

    Zoom.prototype._defaults = $.extend(ch.util.clone(parent._defaults), {
        'fx': false,
        'classes': 'ch-zoom',
        'width': '300px',
        'height': '300px',
        'open': 'mouseenter',
        'close': 'mouseleave',
        'closeDelay': 0,
        'side': 'right',
        'align': 'top',
        'offsetX': 20,
        'offsetY': 0,
        'content': 'Loading zoom...'
    });

    Zoom.prototype.init = function ($el, options) {

        parent.init.call(this, $el, options);

        var that = this,

            bindings = {};

        // Prevent to redirect to href
        bindings[pointerEvents.TAP] = function (event) { ch.util.prevent(event); };

        // Bind move calculations
        bindings[pointerEvents.MOVE] = function (event) { that.move(event); };

        //
        this.$el.addClass('ch-zoom-trigger').on(bindings);

        /**
         * Element showed before zoomed image is load. It's a transition message and its content can be configured through parameter "message".
         * @private
         * @name ch.Zoom#_$loading
         */
        this._$loading = $('<div class="ch-zoom-loading ch-hide"><div class="ch-loading-big"></div><p>' + this._options.content + '</p></div>').appendTo(this.$el);

        /**
         * Element shown as seeker.
         * @private
         * @name shape
         * @memberOf ch.Zoom#_$seeker
         */
        this._$seeker = $('<div class="ch-zoom-seeker ch-hide">').appendTo(this.$el);

        /**
         *
         * @private
         * @name ch.Zoom#_$original
         */
        this._$original = this.$el.children().eq(0);

        //
        ch.onImagesLoads(this._$original, function () {

            /**
             *
             * @private
             * @name ch.Zoom#_originalWidth
             */
            that._originalWidth = this[0].width;

            /**
             *
             * @private
             * @name ch.Zoom#_originalHeight
             */
            that._originalHeight = this[0].height;

            // Anchor size (same as image)
            that.$el.css({
                'width': that._originalWidth,
                'height': that._originalHeight
            });

            // Loading position centered at anchor
            that._$loading.css({
                'left': (that._originalWidth - that._$loading.width()) / 2,
                'top': (that._originalHeight - that._$loading.height()) / 2
            });
        });

        /**
         *
         * @private
         * @name ch.Zoom#_$zoomed
         */
        this._$zoomed = $('<img src="' + this.el.href + '" class="ch-hide">').appendTo(that.$el);

        //
        ch.onImagesLoads(this._$zoomed, function () {

            /**
             * Relative size between zoomed and original width.
             * @private
             * @name ch.Zoom#_ratioX
             * @type {Number}
             */
            that._ratioX = this[0].width / that._originalWidth;

            /**
             * Relative size between zoomed and original height.
             * @private
             * @name ch.Zoom#_ratioY
             * @type {Number}
             */
            that._ratioY = this[0].height / that._originalHeight;

            /**
             *
             * @private
             * @name ch.Zoom#_seekerWidth
             * @type {Number}
             */
            that._seekerWidth = window.Math.floor(window.parseInt(that._options.width, 10) / that._ratioX);

            /**
             *
             * @private
             * @name ch.Zoom#_seekerHeight
             * @type {Number}
             */
            that._seekerHeight = window.Math.floor(window.parseInt(that._options.height, 10) / that._ratioY);

            /**
             *
             * @private
             * @name ch.Zoom#_seekerHalfWidth
             * @type {Number}
             */
            that._seekerHalfWidth = that._seekerWidth / 2;

            /**
             *
             * @private
             * @name ch.Zoom#_seekerHalfHeight
             * @type {Number}
             */
            that._seekerHalfHeight = that._seekerHeight / 2;

            // Set size of seeker
            that._$seeker.css({
                'width': that._seekerWidth,
                'height': that._seekerHeight
            });

            // Use the zoomed image as content for the floated element
            that.content(that._$zoomed);

            /**
             *
             * @private
             * @name ch.Zoom#_ready
             * @type {Boolean}
             */
            that._ready = true;

            that._$loading.addClass('ch-hide');
        });
    };

    /**
     * Inner show method. Attach the component layout to the DOM tree.
     * @protected
     * @name ch.Popover#innerShow
     * @function
     */
    Zoom.prototype.show = function (content) {
        //
        if (!this._ready) { return this._$loading.removeClass('ch-hide'); }

        this._$loading.addClass('ch-hide');
        this._$seeker.removeClass('ch-hide');

        parent.show.call(this, content);
    };

    /**
     * Inner show method. Attach the component layout to the DOM tree.
     * @protected
     * @name ch.Popover#innerShow
     * @function
     */
    Zoom.prototype.hide = function () {

        this._$seeker.addClass('ch-hide');

        parent.hide.call(this);
    };

    /**
     * Calculates movement limits and sets it to seeker and augmented image.
     * @private
     * @function
     * @name ch.Zoom#move
     * @param {Event} event Mouse event to take the cursor position.
     */
    Zoom.prototype.move = function (event) {

        //
        if (!this._ready) { return; }

        var offsetX = event.offsetX || event.layerX,
            offsetY = event.offsetY || event.layerY,
            left,
            top;

        // Left side of seeker LESS THAN left side of image
        if (offsetX - this._seekerHalfWidth < 0) {
            left = 0;
        // Right side of seeker GREATER THAN right side of image
        } else if (offsetX + this._seekerHalfWidth > this._originalWidth) {
            left = this._originalWidth - this._seekerWidth - 2;
        // Free move
        } else {
            left = offsetX - this._seekerHalfWidth;
        }

        // Top side of seeker LESS THAN top side of image
        if (offsetY - this._seekerHalfHeight < 0) {
            top = 0;
        // Bottom side of seeker GREATER THAN bottom side of image
        } else if (offsetY + this._seekerHalfHeight > this._originalHeight) {
            top = this._originalHeight - this._seekerHeight - 2;
        // Free move
        } else {
            top = offsetY - this._seekerHalfHeight;
        }

        // Move seeker
        this._$seeker.css({'left': left, 'top': top});

        // Move zoomed image
        this._$zoomed.css({'left': (-this._ratioX * left), 'top': (-this._ratioY * top)});
    };

    ch.factory(Zoom);

}(this, this.jQuery, this.ch));