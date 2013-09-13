(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Popover is the basic unit of a dialog window.
     * @memberof ch
     * @constructor
     * @augments ch.Widget
     * @mixes ch.Collapsible
     * @mixes ch.Content
     * @requires ch.Positioner
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Popover.
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
     * @returns {popover} Returns a new instance of ch.Popover.
     * @example
     * // Create a new Popover with defaults options.
     * var widget = $(selector).popover();
     * @example
     * // Create a new Popover without trigger.
     * var widget = $.popover();
     * @example
     * // Create a new Popover with fx disabled.
     * $(selector).popover({
     *     'fx': 'none'
     * });
     */
    function Popover($el, options) {
        /**
         * Reference to an internal widget instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        this._init($el, options);

        /**
         * Emits the event 'ready' when the widget is ready to use.
         * @event ch.Popover#ready
         * @example
         * // Subscribe to "ready" event.
         * popover.on('ready', function () {
         *     alert('Widget ready!');
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    var $document = $(window.document),
        $body = $('body'),
        // Inheritance
        parent = ch.util.inherits(Popover, ch.Widget),
        shownbyEvent = {
            'pointertap': ch.onpointertap,
            'pointerenter': ch.onpointerenter
        };

    /**
     * The name of the widget.
     * @type {String}
     */
    Popover.prototype.name = 'popover';

    /**
     * Returns a reference to the constructor function that created the instance.
     * @memberof! ch.Popover.prototype
     * @function
     */
    Popover.prototype.constructor = Popover;

    /**
     * Configuration by default.
     * @private
     * @type {Object}
     */
    Popover.prototype._defaults = {
        '_ariaRole': 'dialog',
        '_className': '',
        '_hideDelay': 400,
        'addClass': '',
        'fx': 'fadeIn',
        'width': 'auto',
        'height': 'auto',
        'shownby': 'pointertap',
        'hiddenby': 'button',
        'waiting': '<div class="ch-loading ch-loading-centered"></div>',
        'positioned': 'absolute'
    };

    /**
     * Initialize a new instance of Popover and merge custom options with defaults options.
     * @memberof! ch.Popover.prototype
     * @function
     * @private
     * @returns {popover}
     */
    Popover.prototype._init = function ($el, options) {
        // Call to its parent init method
        parent._init.call(this, $el, options);

        // Require abilities
        this.require('Collapsible', 'Content');

        /**
         * Reference to an internal widget instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        /**
         * The popover container. It's the element that will be shown and hidden.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$container = $([
            '<div',
            ' class="ch-popover ch-hide ' + this._options._className + ' ' + this._options.addClass + '"',
            ' role="' + this._options._ariaRole + '"',
            ' id="ch-' + this.name + '-' + this.uid + '"',
            ' style="z-index:' + (ch.util.zIndex += 1) + ';width:' + this._options.width + ';height:' + this._options.height + '"',
            '>'
        ].join('')).on(ch.onpointertap + '.' + this.name, function (event) {
            event.stopPropagation();
        });

        /**
         * Element where the content will be added.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._$content = $('<div class="ch-popover-content">').appendTo(this.$container);

        // Add functionality to the trigger if it exists
        this._configureTrigger();
        // Configure the way it hides
        this._configureHiding();

        this._positioner = new ch.Positioner({
            'target': this.$container,
            'reference': this._options.reference,
            'side': this._options.side,
            'align': this._options.align,
            'offsetX': this._options.offsetX,
            'offsetY': this._options.offsetY,
            'positioned': this._options.positioned
        });

        /**
         * Handler to execute the positioner refresh() method on layout changes.
         * @private
         * @type {Function}
         * @todo Define this function on prototype and use bind(): $document.on(ch.onchangelayout, this.refreshPosition.bind(this));
         */
        this._refreshPositionListener = function () {
            that._positioner.refresh(options);
            return that;
        };

        // Refresh position:
        // on layout change
        $document.on(ch.onchangelayout, this._refreshPositionListener);
        // on resize
        ch.viewport.on(ch.onresize, this._refreshPositionListener);

        this
            .once('_show', this._refreshPositionListener)
            // on content change
            .on('_contentchange', this._refreshPositionListener)
            // Remove from DOM the widget container after hide
            .on('hide', function () {
                that.$container.remove(null, true);
            });

        return this;
    };

    /**
     * Adds functionality to the trigger. When a non-trigger popover is initialized, this method isn't executed.
     * @memberof! ch.Popover.prototype
     * @private
     * @function
     */
    Popover.prototype._configureTrigger = function () {

        if (this._el === undefined) {
            return;
        }

        /**
         * Reference to an internal widget instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this,
            // It will be triggered on pointertap/pointerenter of the $trigger
            // It can toggle, show, or do nothing (in specific cases)
            showHandler = (function () {
                // Toggle as default
                var fn = that._toggle;
                // When a Popover is shown on pointerenter, it will set a timeout to manage when
                // to close the widget. Avoid to toggle and let choise when to close to the timer
                if (that._options.shownby === 'pointerenter' || that._options.hiddenby === 'none' || that._options.hiddenby === 'button') {
                    fn = function () {
                        if (!that._shown) {
                            that.show();
                        }
                    };
                }

                return fn;
            }());

        /**
         * The original and entire element and its state, before initialization.
         * @private
         * @type {HTMLDivElement}
         */
        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._el.cloneNode(true);

        // Use the trigger as the positioning reference
        this._options.reference = this._options.reference || this._$el;

        // Open event when configured as able to shown anyway
        if (this._options.shownby !== 'none') {
            this._$el
                .addClass('ch-shownby-' + this._options.shownby)
                .on(shownbyEvent[this._options.shownby] + '.' + this.name, function (event) {
                    ch.util.prevent(event);
                    showHandler();
                });
        }

        // Get a content if it's not defined
        if (this._options.content === undefined) {
            // Content from anchor href
            if (this._el.href) {
                this._options.content = this._el.href;

            // Content from title or alt
            } else if (this._el.title || this._el.alt) {
                // Set the configuration parameter
                this._options.content = this._el.title || this._el.alt;
                // Keep the attributes content into the element for possible usage
                this._el.setAttribute('data-title', this._options.content);
                // Avoid to trigger the native tooltip
                this._el.title = this._el.alt = '';
            }
        }

        // Set WAI-ARIA
        this._el.setAttribute('aria-owns', 'ch-' + this.name + '-' + this.uid);
        this._el.setAttribute('aria-haspopup', 'true');

        /**
         * The popover trigger. It's the element that will show and hide the container.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$trigger = this._$el;
    };

    /**
     * Determines how to hide the widget.
     * @memberof! ch.Popover.prototype
     * @private
     * @function
     */
    Popover.prototype._configureHiding = function () {
        /**
         * Reference to an internal widget instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this,
            hiddenby = this._options.hiddenby,
            pointertap = ch.onpointertap + '.' + this.name,
            timeout,
            events = {};

        function hide(event) {
            if (event.target !== that._el && event.target !== that.$container[0]) {
                that.hide();
            }
        }

        function hideTimer() {
            timeout = window.setTimeout(function () {
                that.hide();
            }, that._options._hideDelay);
        }

        // Don't hide anytime
        if (hiddenby === 'none') { return; }

        // Hide by leaving the widget
        if (hiddenby === 'pointerleave' && this.$trigger !== undefined) {

            events[ch.onpointerenter + '.' + this.name] = function () {
                window.clearTimeout(timeout);
            };

            events[ch.onpointerleave + '.' + this.name] = hideTimer;

            this.$trigger.on(events);
            this.$container.on(events);
        }

        // Hide with the button Close
        if (hiddenby === 'button' || hiddenby === 'all') {
            $('<i class="ch-close" role="button" aria-label="Close"></i>').on(pointertap, function () {
                that.hide();
            }).prependTo(this.$container);
        }

        if (hiddenby === 'pointers' || hiddenby === 'all') {

            ch.shortcuts.add((ch.onkeyesc || 'touchend'), this.uid, function () { that.hide(); });

            this
                .on('show', function () {
                    ch.shortcuts.on(that.uid);
                    $document.on(pointertap, hide);
                })
                .on('hide', function () {
                    ch.shortcuts.off(that.uid);
                    $document.off(pointertap, hide);
                });
        }
    };

    /**
     * Creates an options object from the parameters arriving to the constructor method.
     * @memberof! ch.Popover.prototype
     * @private
     * @function
     * @example
     */
    Popover.prototype._normalizeOptions = function (options) {
        if (typeof options === 'string' || ch.util.is$(options)) {
            options = {
                'content': options
            };
        }
        return options;
    };

    /**
     * Shows the popover container and appends it to the body.
     * @memberof! ch.Popover.prototype
     * @function
     * @param {(String | jQuerySelector | ZeptoSelector)} [content] The content that will be used by popover.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @returns {popover}
     * @example
     * // Shows a basic popover.
     * widget.show();
     * @example
     * // Shows a popover with new content.
     * widget.show('Some new content here!');
     * @example
     * // Shows a popover with a new content that will be loaded by ajax and some custom options.
     * widget.show('http://chico-ui.com.ar/ajax', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Popover.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled) {
            return this;
        }

        // Increase z-index and append to body
        // Do it before set content because when content sets, it triggers the position refresh
        this.$container.css('z-index', (ch.util.zIndex += 1)).appendTo($body);

        // Open the collapsible
        this._show();

        // Request the content
        if (content !== undefined) {
            this.content(content, options);
        }

        return this;
    };

    /**
     * Hides the popover container and deletes it from the body.
     * @memberof! ch.Popover.prototype
     * @function
     * @returns {popover}
     * @example
     * // Close a popover.
     * widget.hide();
     */
    Popover.prototype.hide = function () {
        // Don't execute when it's disabled
        if (!this._enabled) {
            return this;
        }

        // Close the collapsible
        this._hide();

        return this;
    };

    /**
     * Returns a Boolean specifying if the container is shown or not.
     * @memberof! ch.Popover.prototype
     * @function
     * @returns {Boolean}
     * @example
     * // Check the popover status after an user action
     * var foo = $.popover();
     * $(button).on(ch.onpointertap, function () {
     *     if (foo.isShown()) {
     *         alert('Popover: visible');
     *     } else {
     *         alert('Popover: not visible');
     *     }
     * });
     */
    Popover.prototype.isShown = function () {
        return this._shown;
    };

    /**
     * Sets or gets the width of the container.
     * @memberof! ch.Popover.prototype
     * @function
     * @param {String} [data] Set a width for the container.
     * @returns {(Number | popover)}
     * @example
     * // Set a new popover width.
     * widget.width('300px');
     * @example
     * // Get the popover width.
     * widget.width(); // '300px'
     */
    Popover.prototype.width = function (data) {

        if (data === undefined) {
            return this._options.width;
        }

        this.$container.css('width', data);

        this._options.width = data;

        this.refreshPosition();

        return this;
    };

    /**
     * Sets or gets the hight of the container.
     * @memberof! ch.Popover.prototype
     * @function
     * @param {String} [data] Set a height for the container.
     * @returns {(Number | popover)}
     * @example
     * // Set a new popover height.
     * widget.height('300px');
     * @example
     * // Get the popover height.
     * widget.height(); // '300px'
     */
    Popover.prototype.height = function (data) {

        if (data === undefined) {
            return this._options.height;
        }

        this.$container.css('height', data);

        this._options.height = data;

        this.refreshPosition();

        return this;
    };

    /**
     * Updates the current position of the container with given options or defaults.
     * @memberof! ch.Popover.prototype
     * @function
     * @params {Object} [options] A configuration object.
     * @returns {popover}
     * @example
     * // Updates the current position.
     * popover.refreshPosition();
     * @example
     * // Updates the current position with new offsetX and offsetY.
     * popover.refresh({
     *     'offestX': 100,
     *     'offestY': 10
     * });
     */
    Popover.prototype.refreshPosition = function (options) {

        if (this._shown) {
            this._positioner.refresh(options);
        }

        return this;
    };

    /**
     * Enables a Popover instance.
     * @memberof! ch.Popover.prototype
     * @function
     * @returns {popover}
     */
    Popover.prototype.enable = function () {

        if (this._el !== undefined) {
            this._el.setAttribute('aria-disabled', false);
        }

        parent.enable.call(this);

        return this;
    };

    /**
     * Disables a Popover instance.
     * @memberof! ch.Popover.prototype
     * @function
     * @returns {popover}
     */
    Popover.prototype.disable = function () {

        if (this._el !== undefined) {
            this._el.setAttribute('aria-disabled', true);
        }

        if (this._shown) {
            this.hide();
        }

        parent.disable.call(this);

        return this;
    };

    /**
     * Destroys a Popover instance.
     * @memberof! ch.Popover.prototype
     * @function
     * @returns {popover}
     */
    Popover.prototype.destroy = function () {

        if (this.$trigger !== undefined) {
            this.$trigger
                .off('.' + this.name)
                .removeClass('ch-' + this.name + '-trigger')
                .removeAttr('data-title')
                .removeAttr('aria-owns')
                .removeAttr('aria-haspopup')
                .removeAttr('data-side')
                .removeAttr('data-align')
                .removeAttr('role')
                .attr('alt', this._snippet.alt)
                .attr('title', this._snippet.title);
        }

        $document.off(ch.onchangelayout, this._refreshPositionListener);

        ch.viewport.off(ch.onresize, this._refreshPositionListener);

        parent.destroy.call(this);

        return this;
    };

    ch.factory(Popover, Popover.prototype._normalizeOptions);

}(this, this.ch.$, this.ch));
