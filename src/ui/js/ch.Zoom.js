(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Zoom shows a contextual reference to an augmented version of a declared image.
     * @memberof ch
     * @constructor
     * @augments ch.Layer
     * @requires ch.onImagesLoads
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Zoom.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the widget initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". By default, the effect is "fadeIn".
     * @param {String} [options.width] Set a width for the container. By default is "auto".
     * @param {String} [options.height] Set a height for the container. By default is "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap" (default), "pointerenter" or "none".
     * @param {String} [options.hiddenby] Determines how to hide the widget. You must use: "button" (default), "pointers", "pointerleave", "all" or "none".
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the ch.viewport.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: left, right, top, bottom or center (default).
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: left, right, top, bottom or center (default).
     * @param {Number} [options.offsetX] The offsetX option specifies a distance to displace the target horitontally. Its value by default is 0.
     * @param {Number} [options.offsetY] The offsetY option specifies a distance to displace the target vertically. Its value by default is 0.
     * @param {String} [options.positioned] The positioned option specifies the type of positioning used. Its value can be: "absolute" (default) or "fixed".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. By default is "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. By default is true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. By default is true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading. By default it is '<div class="ch-loading ch-loading-centered"></div>'.
     * @returns {zoom} Returns a new instance of ch.Zoom.
     * @example
     * // Create a new Zoom with defaults options.
     * var widget = $(selector).zoom();
     * @example
     * // Create a new Zoom with a defined width.
     * $(selector).zoom({
     *     'width': '500px'
     * });
     */
    function Zoom($el, options) {
        /**
         * Reference to an internal widget instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        this._init($el, options);

        /**
         * Emits the event 'ready' when the widget is ready to use.
         * @event ch.Zoom#ready
         * @example
         * // Subscribe to "ready" event.
         * zoom.on('ready', function () {
         *     alert('Widget ready!');
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Zoom, ch.Layer);

    /**
     * The name of the widget.
     * @type {String}
     */
    Zoom.prototype.name = 'zoom';

    /**
     * Returns a reference to the constructor function that created the instance.
     * @memberof! ch.Zoom.prototype
     * @function
     */
    Zoom.prototype.constructor = Zoom;

    /**
     * Configuration by default.
     * @private
     * @type {Object}
     */
    Zoom.prototype._defaults = $.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-zoom',
        '_ariaRole': 'tooltip',
        '_hideDelay': 0,
        'fx': false,
        'width': '300px',
        'height': '300px',
        'shownby': 'pointerenter',
        'hiddenby': 'pointerleave',
        'side': 'right',
        'align': 'top',
        'offsetX': 20,
        'offsetY': 0,
        'waiting': 'Loading zoom...'
    });

    /**
     * Initialize a new instance of Zoom and merge custom options with defaults options.
     * @memberof! ch.Zoom.prototype
     * @function
     * @private
     * @returns {zoom}
     */
    Zoom.prototype._init = function ($el, options) {
        // Call to its parent init method
        parent._init.call(this, $el, options);

        /**
         * Reference to an internal widget instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this,
            bindings = {};

        /**
         * Flag to control when zoomed image is loaded.
         * @private
         * @type {Boolean}
         */
        this._loaded = false;

        /**
         * Feedback showed before the zoomed image is load. It's a transition message and its content can be configured through parameter "waiting".
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         * @example
         * // Changing the loading feedback.
         * $(selector).zoom({
         *     'waiting': 'My custom message'
         * });
         */
        this._$loading = $('<div class="ch-zoom-loading ch-hide"><div class="ch-loading-big"></div><p>' + this._options.waiting + '</p></div>').appendTo(this.$trigger);

        /**
         * Shape with visual feedback to the relative size of the zoomed area.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._$seeker = $('<div class="ch-zoom-seeker ch-hide">').appendTo(this.$trigger);

        /**
         * The main specified image with original size (not zoomed).
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._$original = this.$trigger.children(':first');

        /**
         * The zoomed image specified as a link href (see the HTML snippet).
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._$zoomed = this._options.content = $('<img class="ch-hide">');

        // Prevent to redirect to the href
        bindings[ch.onpointertap + '.zoom'] = function (event) { ch.util.prevent(event); };

        // Bind move calculations
        bindings[ch.onpointermove + '.zoom'] = function (event) { that._move(event); };

        // Bind those events
        this.$trigger.addClass('ch-zoom-trigger').on(bindings);

        // Assign event handlers to the original image
        ch.onImagesLoads(this._$original, function () {
            // THIS is the loaded image
            that._originalLoaded(this);
        });

        // Assign event handlers to the original image
        ch.onImagesLoads(this._$zoomed, function () {
            // THIS is the loaded image
            that._zoomedLoaded(this);
        });
    };

    /**
     * Sets the correct size to the wrapper anchor.
     * @memberof! ch.Zoom.prototype
     * @private
     * @function
     * @param {(jQuerySelector | ZeptoSelector)} $img Reference to the loaded image (the original).
     */
    Zoom.prototype._originalLoaded = function ($img) {

        var width = $img[0].width,
            height = $img[0].height;

        // Set the wrapper anchor size (same as image)
        this.$trigger.css({
            'width': width,
            'height': height
        });

        // Loading position centered into the anchor
        this._$loading.css({
            'left': (width - this._$loading.width()) / 2,
            'top': (height - this._$loading.height()) / 2
        });

        /**
         * Width of the original specified image.
         * @private
         * @type {Number}
         */
        this._originalWidth = width;

        /**
         * Height of the original specified image.
         * @private
         * @type {Number}
         */
        this._originalHeight = height;
    };

    /**
     * Loads the content and sets the Seeker size.
     * @memberof! ch.Zoom.prototype
     * @private
     * @function
     * @param {(jQuerySelector | ZeptoSelector)} $img Reference to the loaded image (the zoomed).
     */
    Zoom.prototype._zoomedLoaded = function ($img) {

        /**
         * Relation between the zoomed and the original image width.
         * @private
         * @type {Number}
         */
        this._ratioX = $img[0].width / this._originalWidth;

        /**
         * Relation between the zoomed and the original image height.
         * @private
         * @type {Number}
         */
        this._ratioY = $img[0].height / this._originalHeight;

        /**
         * Width of the Seeker, calculated from ratio.
         * @private
         * @type {Number}
         */
        this._seekerWidth = window.Math.floor(window.parseInt(this._options.width, 10) / this._ratioX);

        /**
         * Height of the Seeker, calculated from ratio.
         * @private
         * @type {Number}
         */
        this._seekerHeight = window.Math.floor(window.parseInt(this._options.height, 10) / this._ratioY);

        /**
         * Half of the width of the Seeker. Used to position it.
         * @private
         * @type {Number}
         */
        this._seekerHalfWidth = this._seekerWidth / 2;

        /**
         * Half of the height of the Seeker. Used to position it.
         * @private
         * @type {Number}
         */
        this._seekerHalfHeight = this._seekerHeight / 2;

        // Set size of the Seeker
        this._$seeker.css({
            'width': this._seekerWidth,
            'height': this._seekerHeight
        });

        // Use the zoomed image as content for the floated element
        // Use "this._$zoomed" instead "$img" to don't loose reference to the element
        this.content(this._$zoomed);

        // Update the flag to allow to zoom
        this._loaded = true;

        /**
         * Emits the event 'imageloaded' when the zoomed image is downloaded.
         * @event ch.Zoom#imageloaded
         * @example
         * // Subscribe to "imageloaded" event.
         * zoom.on('imageloaded', function () {
         *     alert('Zoomed image ready!');
         * });
         */
        this.emit('imageloaded');

        // Make the entire Show process if it tried to show before
        if (!this._$loading.hasClass('ch-hide')) {
            this.show();
        }
    };

    /**
     * Calculates movement limits and sets it to Seeker and zoomed image.
     * @memberof! ch.Zoom.prototype
     * @private
     * @function
     * @param {Event} event Used to take the cursor position.
     */
    Zoom.prototype._move = function (event) {
        // Don't execute when it's disabled or it's not loaded
        if (!this._enabled || !this._loaded) {
            return;
        }

        var offsetX = event.offsetX || event.layerX,
            offsetY = event.offsetY || event.layerY,
            x,
            y;

        // Left side of seeker LESS THAN left side of image
        if (offsetX - this._seekerHalfWidth < 0) {
            x = 0;
        // Right side of seeker GREATER THAN right side of image
        } else if (offsetX + this._seekerHalfWidth > this._originalWidth) {
            x = this._originalWidth - this._seekerWidth - 2;
        // Free move
        } else {
            x = offsetX - this._seekerHalfWidth;
        }

        // Top side of seeker LESS THAN top side of image
        if (offsetY - this._seekerHalfHeight < 0) {
            y = 0;
        // Bottom side of seeker GREATER THAN bottom side of image
        } else if (offsetY + this._seekerHalfHeight > this._originalHeight) {
            y = this._originalHeight - this._seekerHeight - 2;
        // Free move
        } else {
            y = offsetY - this._seekerHalfHeight;
        }

        // Move seeker
        this._$seeker.css({'left': x, 'top': y});

        // Move zoomed image
        this._$zoomed.css({'left': (-this._ratioX * x), 'top': (-this._ratioY * y)});
    };

    /**
     * Shows the zoom container and the Seeker, or show a loading feedback until the zoomed image loads.
     * @memberof! ch.Zoom.prototype
     * @function
     * @param {(String | jQuerySelector | ZeptoSelector)} [content] The content that will be used by zoom.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @returns {zoom}
     * @example
     * // Shows a zoom.
     * widget.zoom();
     * @example
     * // Shows a zoom with new content.
     * widget.show('Some new content here!');
     * @example
     * // Shows a zoom with a new content that will be loaded by ajax and some custom options.
     * widget.show('http://chico-ui.com.ar/ajax', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Zoom.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled) {
            return this;
        }

        // Show feedback and trigger the image load, if it's not loaded
        if (!this._loaded) {
            this._$loading.removeClass('ch-hide');
            this.loadImage();
            return this;
        }

        // Delete the Loading and show the Seeker
        this._$loading.remove();
        this._$seeker.removeClass('ch-hide');

        // Execute the original show()
        parent.show.call(this, content, options);

        return this;
    };

    /**
     * Hides the zoom container and the Seeker.
     * @memberof! ch.Zoom.prototype
     * @function
     * @returns {zoom}
     * @example
     * // Close a zoom.
     * widget.hide();
     */
    Zoom.prototype.hide = function () {
        // Avoid unnecessary execution
        if (!this._loaded) {
            this._$loading.addClass('ch-hide');
            return this;
        }

        this._$seeker.addClass('ch-hide');

        parent.hide.call(this);

        return this;
    };

    /**
     * Adds the zoomed image source to the <img> tag to trigger the request.
     * @memberof! ch.Zoom.prototype
     * @function
     * @returns {zoom}
     * @example
     * // Load the zoomed image on demand.
     * widget.loadImage();
     */
    Zoom.prototype.loadImage = function () {
        this._$zoomed[0].src = this._el.href;
        return this;
    };

    /**
     * Destroys a Zoom instance.
     * @memberof! ch.Zoom.prototype
     * @function
     * @returns {zoom}
     */
    Zoom.prototype.destroy = function () {
        this._$seeker.remove();
        parent.destroy.call(this);
        return this;
    };

    ch.factory(Zoom, parent._normalizeOptions);

}(this, this.ch.$, this.ch));
