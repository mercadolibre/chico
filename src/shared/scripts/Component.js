(function (window, ch) {
    'use strict';

    var uid = 0;

    /**
     * Base class for all components.
     *
     * @memberof ch
     * @constructor
     * @augments tiny.EventEmitter
     * @param {HTMLElement} [el] It must be a HTMLElement.
     * @param {Object} [options] Configuration options.
     * @returns {component} Returns a new instance of Component.
     * @example
     * // Create a new Component.
     * var component = new ch.Component();
     * var component = new ch.Component('.my-component', {'option': 'value'});
     * var component = new ch.Component('.my-component');
     * var component = new ch.Component({'option': 'value'});
     */
    function Component(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Expandable is created.
             * @memberof! ch.Expandable.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Component#ready
         * @example
         * // Subscribe to "ready" event.
         * component.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    tiny.inherits(Component, tiny.EventEmitter);

    /**
     * The name of a component.
     * @memberof! ch.Component.prototype
     * @type {String}
     */
    Component.prototype.name = 'component';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Component.prototype
     * @function
     */
    Component.prototype.constructor = Component;

    /**
     * Initialize a new instance of Component and merge custom options with defaults options.
     * @memberof! ch.Component.prototype
     * @function
     * @private
     * @returns {component}
     */
    Component.prototype._init = function (el, options) {
        // Set emitter to zero for unlimited listeners to avoid the warning in console
        // @see https://nodejs.org/api/events.html#events_emitter_setmaxlisteners_n
        this.setMaxListeners(0);

        // Clones defaults or creates a defaults object
        var defaults = (this._defaults) ? tiny.clone(this._defaults) : {};

        if (el === null) {
            throw new Error('The "el" parameter is not present in the DOM');
        }

        /**
         * A unique id to identify the instance of a component.
         * @type {Number}
         */
        this.uid = (uid += 1);

        // el is HTMLElement
        // IE8 and earlier don't define the node type constants, 1 === document.ELEMENT_NODE
        if (el !== undefined && el.nodeType !== undefined && el.nodeType === 1) {

            this._el = el;

            // set the uid to the element to help search for the instance in the collection instances
            this._el.setAttribute('data-uid', this.uid);

            // we extend defaults with options parameter
            this._options = tiny.extend(defaults, options);

        // el is an object configuration
        } else if (el === undefined || el.nodeType === undefined && typeof el === 'object') {

            // creates a empty element becouse the user not set a DOM elment to use, but we requires one
            // this._el = document.createElement('div');

            // we extend defaults with the object that is in el parameter object
            this._options = tiny.extend(defaults, el);
        }

        /**
         * Indicates if a component is enabled.
         * @type {Boolean}
         * @private
         */
        this._enabled = true;

        /**
         * Stores all instances created
         * @type {Object}
         * @public
         */
        ch.instances = ch.instances || {};
        ch.instances[this.uid] = this;
    };


    /**
     * Adds functionality or abilities from other classes.
     * @memberof! ch.Component.prototype
     * @function
     * @returns {component}
     * @params {...String} var_args The name of the abilities to will be used.
     * @example
     * // You can require some abilitiest to use in your component.
     * // For example you should require the collpasible abitliy.
     * var component = new Component(element, options);
     * component.require('Collapsible');
     */
    Component.prototype.require = function () {

        var arg,
            i = 0,
            len = arguments.length;

        for (i; i < len; i += 1) {
            arg = arguments[i];

            if (this[arg.toLowerCase()] === undefined) {
                ch[arg].call(this);
            }
        }

        return this;
    };

    /**
     * Enables an instance of Component.
     * @memberof! ch.Component.prototype
     * @function
     * @returns {component}
     * @example
     * // Enabling an instance of Component.
     * component.enable();
     */
    Component.prototype.enable = function () {
        this._enabled = true;

        /**
         * Emits when a component is enabled.
         * @event ch.Component#enable
         * @example
         * // Subscribe to "enable" event.
         * component.on('enable', function () {
         *     // Some code here!
         * });
         */
        this.emit('enable');

        return this;
    };

    /**
     * Disables an instance of Component.
     * @memberof! ch.Component.prototype
     * @function
     * @returns {component}
     * @example
     * // Disabling an instance of Component.
     * component.disable();
     */
    Component.prototype.disable = function () {
        this._enabled = false;

        /**
         * Emits when a component is disable.
         * @event ch.Component#disable
         * @example
         * // Subscribe to "disable" event.
         * component.on('disable', function () {
         *     // Some code here!
         * });
         */
        this.emit('disable');

        return this;
    };

    /**
     * Destroys an instance of Component and remove its data from asociated element.
     * @memberof! ch.Component.prototype
     * @function
     * @example
     * // Destroy a component
     * component.destroy();
     * // Empty the component reference
     * component = undefined;
     */
    Component.prototype.destroy = function () {

        this.disable();

        if (this._el !== undefined) {
            delete ch.instances[this._el.getAttribute('data-uid')];
            this._el.removeAttribute('data-uid');
        }

        /**
         * Emits when a component is destroyed.
         * @event ch.Component#destroy
         * @exampleDescription
         * @example
         * // Subscribe to "destroy" event.
         * component.on('destroy', function () {
         *     // Some code here!
         * });
         */
        this.emit('destroy');

        return;
    };

    ch.Component = Component;

}(this, this.ch));
