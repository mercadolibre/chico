(function (window, ch) {
    'use strict';

    /**
     * Zoom shows a contextual reference to an augmented version of a declared image.
     * @memberof ch
     * @constructor
     * @augments ch.Layer
     * @param {String} selector A CSS Selector to create an instance of ch.Zoom.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "none".
     * @param {String} [options.width] Set a width for the container. Default: "300px".
     * @param {String} [options.height] Set a height for the container. Default: "300px".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointerenter".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointerleave".
     * @param {String} [options.reference] It's a CSS Selector reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 20.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: 'Loading zoom...'.
     * @param {(HTMLElement | String)} [options.content] The content to be shown into the Zoom container.
     * @returns {zoom} Returns a new instance of Zoom.
     * @example
     * // Create a new Zoom.
     * var zoom = new ch.Zoom([selector], [options]);
     * @example
     * // Create a new Zoom with a defined width (half of the screen).
     * var zoom = new ch.Zoom({
     *     'width': (ch.viewport.width / 2) + 'px'
     * });
     */
    function Zoom(selector, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(selector, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Zoom is created.
             * @memberof! ch.Zoom.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Zoom#ready
         * @example
         * // Subscribe to "ready" event.
         * zoom.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    tiny.inherits(Zoom, ch.Layer);

    var parent = Zoom.super_.prototype;

    /**
     * The name of the component.
     * @memberof! ch.Zoom.prototype
     * @type {String}
     */
    Zoom.prototype.name = 'zoom';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Zoom.prototype
     * @function
     */
    Zoom.prototype.constructor = Zoom;

    /**
     * Configuration by default.
     * @memberof! ch.Zoom.prototype
     * @type {Object}
     * @private
     */
    Zoom.prototype._defaults = tiny.extend(tiny.clone(parent._defaults), {
        '_className': 'ch-zoom',
        '_ariaRole': 'tooltip',
        '_hideDelay': 0,
        'fx': 'none',
        'width': '300px',
        'height': '300px',
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
    Zoom.prototype._init = function (selector, options) {
        // Call to its parent init method
        parent._init.call(this, selector, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * Flag to control when zoomed image is loaded.
         * @type {Boolean}
         * @private
         */
        this._loaded = false;

        /**
         * Feedback showed before the zoomed image is load. It's a transition message and its content can be configured through parameter "waiting".
         * @type {HTMLElement}
         * @private
         * @example
         * // Changing the loading feedback.
         * var zoom = new ch.Zoom({
         *     'waiting': 'My custom message'
         * });
         */
        this._loading = (function() {
            var dummyElement = document.createElement('div');
            dummyElement.innerHTML = '<div class="ch-zoom-loading ch-hide"><div class="ch-loading-large"></div><p>' + that._options.waiting + '</p></div>';

            return dummyElement.firstChild;
        }());

        this.trigger.appendChild(this._loading);


        /**
         * HTML Element shape with visual feedback to the relative size of the zoomed area.
         * @type {HTMLDivElement}
         * @private
         */
        this._seeker = (function (){
            var dummyElement = document.createElement('div');
            dummyElement.innerHTML = '<div class="ch-zoom-seeker ch-hide"></div>';

            return dummyElement.firstChild;
        }());

        this.trigger.appendChild(this._seeker);

        /**
         * The main specified image with original size (not zoomed).
         * @type {HTMLElement}
         * @private
         */
        this._original = this.trigger.children[0];

        /**
         * The zoomed image specified as a link href (see the HTML snippet).
         * @type {HTMLImageElement}
         * @private
         */
        // Use a new Image to calculate the
        // size before append the image to DOM, in ALL the browsers.
        this._zoomed = new window.Image();

        // Assign event handlers to the original image
        onImagesLoads(this._original, function () {
            that._originalLoaded();
        });

        // Assign event handlers to the zoomed image
        onImagesLoads(this._zoomed, function () {
            that._zoomedLoaded();
        });

        // Make the entire Show process if it tried to show before
        this.on('imageload', function () {
            if (!tiny.hasClass(this._loading, 'ch-hide')) {
                that.show();
                tiny.addClass(this._loading, 'ch-hide');
            }
        });

        // Assign event handlers to the anchor
        tiny.addClass(this.trigger, 'ch-zoom-trigger');

        // Prevent to redirect to the href
        tiny.on(this.trigger, 'click', function (event) { event.preventDefault(); }, false);

        // Bind move calculations
        tiny.on(this.trigger, ch.onpointermove, function (event) { that._move(event); }, false);

        return this;
    };

    /**
     * Sets the correct size to the wrapper anchor.
     * @memberof! ch.Zoom.prototype
     * @function
     * @private
     */
    Zoom.prototype._originalLoaded = function () {

        var width = this._original.width,
            height = this._original.height,
            offset = tiny.offset(this._el);

        // Set the wrapper anchor size (same as image)
        this.trigger.style.width = width + 'px';
        this.trigger.style.height = height + 'px';

        // Loading position centered into the anchor
        this._loading.style.display = 'block';
        this._loading.style.left = (width - this._loading.clientWidth) / 2 + 'px',
        this._loading.style.top = (height - this._loading.clientHeight) / 2 + 'px';
        this._loading.style.display = '';

        /**
         * Width of the original specified image.
         * @type {Number}
         * @private
         */
        this._originalWidth = width;

        /**
         * Height of the original specified image.
         * @type {Number}
         * @private
         */
        this._originalHeight = height;

        /**
         * Left position of the original specified anchor/image.
         * @type {Number}
         * @private
         */
        this._originalOffsetLeft = offset.left;

        /**
         * Top position of the original specified anchor/image.
         * @type {Number}
         * @private
         */
        this._originalOffsetTop = offset.top;
    };

    /**
     * Loads the Zoom content and sets the Seeker size.
     * @memberof! ch.Zoom.prototype
     * @function
     * @private
     */
    Zoom.prototype._zoomedLoaded = function () {

        /**
         * Relation between the zoomed and the original image width.
         * @type {Number}
         * @private
         */
        this._ratioX = (this._zoomed.width / this._originalWidth);

        /**
         * Relation between the zoomed and the original image height.
         * @type {Number}
         * @private
         */
        this._ratioY = (this._zoomed.height / this._originalHeight);

        /**
         * Width of the Seeker, calculated from ratio.
         * @type {Number}
         * @private
         */
        this._seekerWidth = window.Math.floor(window.parseInt(this._options.width, 10) / this._ratioX);

        /**
         * Height of the Seeker, calculated from ratio.
         * @type {Number}
         * @private
         */
        this._seekerHeight = window.Math.floor(window.parseInt(this._options.height, 10) / this._ratioY);

        /**
         * Half of the width of the Seeker. Used to position it.
         * @type {Number}
         * @private
         */
        this._seekerHalfWidth = window.Math.floor(this._seekerWidth / 2);

        /**
         * Half of the height of the Seeker. Used to position it.
         * @type {Number}
         * @private
         */
        this._seekerHalfHeight = window.Math.floor(this._seekerHeight / 2);

        // Set size of the Seeker
        this._seeker.style.cssText = 'width:' + this._seekerWidth + 'px;height:' + this._seekerHeight + 'px';

        // Use the zoomed image as content for the floated element
        this.content(this._zoomed);

        // Update the flag to allow to zoom
        this._loaded = true;

        /**
         * Event emitted when the zoomed image is downloaded.
         * @event ch.Zoom#imageload
         * @example
         * // Subscribe to "imageload" event.
         * zoom.on('imageload', function () {
         *     alert('Zoomed image ready!');
         * });
         */
        this.emit('imageload');
    };

    /**
     * Calculates movement limits and sets it to Seeker and zoomed image.
     * @memberof! ch.Zoom.prototype
     * @function
     * @private
     * @param {Event} event Used to take the cursor position.
     */
    Zoom.prototype._move = function (event) {
        // Don't execute when it's disabled or it's not loaded
        if (!this._enabled || !this._loaded) {
            return;
        }

        // By defining these variables in here, it avoids to make
        // the substraction twice if it's a free movement
        var pageX = (event.pageX || event.clientX + document.documentElement.scrollLeft),
            pageY = (event.pageY || event.clientY + document.documentElement.scrollTop),
            seekerLeft = pageX - this._seekerHalfWidth,
            seekerTop = pageY - this._seekerHalfHeight,
            x,
            y;

        // Left side of seeker LESS THAN left side of image
        if (seekerLeft <= this._originalOffsetLeft) {
            x = 0;
        // Right side of seeker GREATER THAN right side of image
        } else if (pageX + this._seekerHalfWidth > this._originalWidth + this._originalOffsetLeft) {
            x = this._originalWidth - this._seekerWidth - 2;
        // Free move
        } else {
            x = seekerLeft - this._originalOffsetLeft;
        }

        // Top side of seeker LESS THAN top side of image
        if (seekerTop <= this._originalOffsetTop) {
            y = 0;
        // Bottom side of seeker GREATER THAN bottom side of image
        } else if (pageY + this._seekerHalfHeight > this._originalHeight + this._originalOffsetTop) {
            y = this._originalHeight - this._seekerHeight - 2;
        // Free move
        } else {
            y = seekerTop - this._originalOffsetTop;
        }

        // Move seeker and the zoomed image
        this._seeker.style.left = x + 'px';
        this._seeker.style.top = y + 'px';
        this._zoomed.style.cssText = 'left:' + (-this._ratioX * x) + 'px;top:' + (-this._ratioY * y) + 'px';
    };

    /**
     * Shows the zoom container and the Seeker, or show a loading feedback until the zoomed image loads.
     * @memberof! ch.Zoom.prototype
     * @function
     * @param {(String | HTMLElement)} [content] The content that will be used by dropdown.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {zoom}
     * @example
     * // Shows a basic zoom.
     * zoom.show();
     * @example
     * // Shows a zoom with new content
     * zoom.show('Some new content here!');
     * @example
     * // Shows a zoom with a new content that will be loaded by ajax with some custom options
     * zoom.show('http://domain.com/ajax/url', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Zoom.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled || this._shown) {
            return this;
        }

        // Show feedback and trigger the image load, if it's not loaded
        if (!this._loaded) {
            tiny.removeClass(this._loading, 'ch-hide');
            this.loadImage();
            return this;
        }

        // Delete the Loading and show the Seeker
        tiny.removeClass(this._seeker, 'ch-hide');

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
     * // Close a zoom
     * zoom.hide();
     */
    Zoom.prototype.hide = function () {
        if (!this._shown) {
            return this;
        }

        // Avoid unnecessary execution
        if (!this._loaded) {
            tiny.addClass(this._loading, 'ch-hide');
            return this;
        }

        tiny.addClass(this._seeker, 'ch-hide');

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
     * component.loadImage();
     */
    Zoom.prototype.loadImage = function () {

        this._zoomed.src = this._el.href;

        return this;
    };

    /**
     * Destroys a Zoom instance.
     * @memberof! ch.Zoom.prototype
     * @function
     * @returns {zoom}
     * @example
     * // Destroy a zoom
     * zoom.destroy();
     * // Empty the zoom reference
     * zoom = undefined;
     */
    Zoom.prototype.destroy = function () {
        var parentElement;

        parentElement = tiny.parent(this._seeker);
        parentElement.removeChild(this._seeker);

        parent.destroy.call(this);

        return;
    };

    ch.factory(Zoom, parent._normalizeOptions);


    /**
     * Executes a callback function when the images of a query selection loads.
     * @private
     * @param {HTMLImageElement} image An image or a collection of images.
     * @param {Function} [callback] The handler the component will fire after the images loads.
     *
     * @example
     * onImagesLoads(HTMLImageElement, function () {
     *     console.log('The size of the loaded image is ' + this.width);
     * });
     */
    function onImagesLoads(image, callback) {
        var images;

        if (Array.isArray(image)) {
            images = image;
        } else {
            images = [image];
        }

        images.forEach(function (image) {
            tiny.on(image, 'load', function onImgLoad() {
                var len = images.length;

                window.setTimeout(function () {
                    if (--len <= 0) {
                        callback.call(image);
                    }
                }, 200);

                image.removeEventListener('load', onImgLoad);
            }, false);

            if (image.complete || image.complete === undefined) {
                var src = image.src;
                // Data uri fix bug in web-kit browsers
                image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
                image.src = src;
            }
        });
    }

}(this, this.ch));
