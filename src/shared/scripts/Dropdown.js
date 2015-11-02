(function (window, ch) {
    'use strict';

    /**
     * Dropdown shows a list of options for navigation.
     * @memberof ch
     * @constructor
     * @augments ch.Layer
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Dropdown.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "none".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointertap".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointers".
     * @param {HTMLElement} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "left".
     * @param {Number} [options.offsetX] The offsetX option specifies a distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] The offsetY option specifies a distance to displace the target vertically. Default: -1.
     * @param {String} [options.position] The position option specifies the type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {Boolean} [options.skin] Sets a CSS class name to the trigger and container to get a variation of Dropdown. Default: false.
     * @param {Boolean} [options.shortcuts] Configures navigation shortcuts. Default: true.
     * @param {(String | HTMLElement)} [options.content] The content to be shown into the Dropdown container.
     * @returns {dropdown} Returns a new instance of Dropdown.
     * @example
     * // Create a new Dropdown.
     * var dropdown = new ch.Dropdown([el], [options]);
     * @example
     * // Create a new skinned Dropdown.
     * var dropdown = new ch.Dropdown({
     *     'skin': true
     * });
     */
    function Dropdown(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Dropdown is created.
             * @memberof! ch.Dropdown.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Dropdown#ready
         * @example
         * // Subscribe to "ready" event.
         * dropdown.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    tiny.inherits(Dropdown, ch.Layer);

    var parent = Dropdown.super_.prototype;

    /**
     * The name of the component.
     * @memberof! ch.Dropdown.prototype
     * @type {String}
     */
    Dropdown.prototype.name = 'dropdown';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Dropdown.prototype
     * @function
     */
    Dropdown.prototype.constructor = Dropdown;

    /**
     * Configuration by default.
     * @memberof! ch.Dropdown.prototype
     * @type {Object}
     * @private
     */
    Dropdown.prototype._defaults = tiny.extend(tiny.clone(parent._defaults), {
        '_className': 'ch-dropdown ch-box-lite',
        '_ariaRole': 'combobox',
        'fx': 'none',
        'shownby': 'pointertap',
        'hiddenby': 'pointers',
        'offsetY': -1,
        'skin': false,
        'shortcuts': true
    });

    /**
     * Initialize a new instance of Dropdown and merge custom options with defaults options.
     * @memberof! ch.Dropdown.prototype
     * @function
     * @private
     * @returns {dropdown}
     */
    Dropdown.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            // The second element of the HTML snippet (the dropdown content)
            content = tiny.next(this.trigger);

        /**
         * The dropdown trigger. It's the element that will show and hide the container.
         * @type {HTMLElement}
         */
        this.trigger.setAttribute('aria-activedescendant', 'ch-dropdown' + this.uid + '-selected');
        tiny.addClass(this.trigger, 'ch-dropdown-trigger');

        this.trigger.setAttribute('unselectable', 'on');
        tiny.addClass(this.trigger, 'ch-user-no-select');

        // Skinned dropdown
        if (this._options.skin) {
            tiny.addClass(this.trigger, 'ch-dropdown-trigger-skin');
            tiny.addClass(this.container, 'ch-dropdown-skin');
        // Default Skin
        } else {
            tiny.addClass(this.trigger, 'ch-btn-skin');
            tiny.addClass(this.trigger, 'ch-btn-small');
        }

        /**
         * A list of links with the navigation options of the component.
         * @type {NodeList}
         * @private
         */
        this._navigation = (function () {
            var items = content.querySelectorAll('a');
            Array.prototype.forEach.call(items, function (item, index) {
                item.setAttribute('role', 'option');
                tiny.on(item, ch.onpointerenter, function () {
                    that._navigation[that._selected = index].focus();
                });
            });
            return items;
        }());


        if (this._options.shortcuts && this._navigationShortcuts !== undefined) {
            this._navigationShortcuts();
        }

        this._options.content = content;

        /**
         * The original and entire element and its state, before initialization.
         * @private
         * @type {HTMLElement}
         */
        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._options.content.cloneNode(true);

        return this;
    };

    /**
     * Shows the dropdown container.
     * @memberof! ch.Dropdown.prototype
     * @function
     * @param {(String | HTMLElement)} [content] The content that will be used by dropdown.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {dropdown}
     * @example
     * // Shows a basic dropdown.
     * dropdown.show();
     * @example
     * // Shows a dropdown with new content
     * dropdown.show('Some new content here!');
     * @example
     * // Shows a dropdown with a new content that will be loaded by ajax with some custom options
     * dropdown.show('http://domain.com/ajax/url', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Dropdown.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled) {
            return this;
        }

        // Execute the original show()
        parent.show.call(this, content, options);

        this._selected = -1;

        return this;
    };

    /**
     * Destroys a Dropdown instance.
     * @memberof! ch.Dropdown.prototype
     * @function
     * @example
     * // Destroy a dropdown
     * dropdown.destroy();
     * // Empty the dropdown reference
     * dropdown = undefined;
     */
    Dropdown.prototype.destroy = function () {
        var trigger = this.trigger;

        [
            'ch-dropdown-trigger',
            'ch-dropdown-trigger-skin',
            'ch-user-no-select',
            'ch-btn-skin',
            'ch-btn-small'
        ].forEach(function(className){
            tiny.removeClass(trigger, className);
        });

        trigger.removeAttribute('unselectable');
        trigger.removeAttribute('aria-controls');

        trigger.insertAdjacentHTML('afterend', this._snippet);

        tiny.trigger(window.document, ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    ch.factory(Dropdown);

}(this, this.ch));
