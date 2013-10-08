(function (window, $, ch) {
    'use strict';

    var util = ch.util,
        uid = 0;

    /**
     * Base class for all widgets.
     * @memberof ch
     * @constructor
     * @augments ch.EventEmitter
     * @param {(jQuerySelector | ZeptoSelector)} $el jQuery or Zepto Selector.
     * @param {Object} [options] Configuration options.
     * @returns {widget} Returns a new instance of Widget.
     */
    function Widget($el, options) {
        this._init($el, options);
    }

    ch.util.inherits(Widget, ch.EventEmitter);

    /**
     * The name of a widget.
     * @memberof! ch.Widget.prototype
     * @type {String}
     * @example
     * // You can reach the instance associated.
     * var widget = $(selector).data(name);
     */
    Widget.prototype.name = 'widget';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Widget.prototype
     * @function
     */
    Widget.prototype.constructor = Widget;

    /**
     * Initialize a new instance of Widget and merge custom options with defaults options.
     * @memberof! ch.Widget.prototype
     * @function
     * @private
     * @returns {instance} Returns an instance of Widget.
     */
    Widget.prototype._init = function ($el, options) {

        // Clones defaults or creates a defaults object
        var defaults = (this._defaults) ? util.clone(this._defaults) : {};

        // Clones the defaults options or creates a new object
        if (options === undefined) {
            if ($el === undefined) {
                this._options = defaults;

            } else if (util.is$($el)) {
                this._$el = $el;
                this._el = $el[0];
                this._options = defaults;

            } else if (typeof $el === 'object') {
                options = $el;
                $el = undefined;
                this._options = $.extend(defaults, options);
            }

        } else if (typeof options === 'object') {
            if ($el === undefined) {
                this._options = $.extend(defaults, options);

            } else if (util.is$($el)) {
                this._$el = $el;
                this._el = $el[0];
                this._options = $.extend(defaults, options);
            }

        } else {
            throw new window.Error('Unexpected parameters were found in the \'' + this.name + '\' instantiation.');
        }

        /**
         * A unique id to identify the instance of a widget.
         * @type {Number}
         */
        this.uid = (uid += 1);

        /**
         * Indicates if a widget is enabled.
         * @type {Boolean}
         * @private
         */
        this._enabled = true;
    };


    /**
     * Adds functionality or abilities from other classes.
     * @memberof! ch.Widget.prototype
     * @function
     * @returns {instance} Returns an instance of Widget.
     * @params {...String} var_args The name of the abilities to will be used.
     * @expample
     * // You can require some abilitiest to use in your widget.
     * // For example you should require the collpasible abitliy.
     * var widget = new Widget(element, options);
     * widget.require('Collapsible');
     */
    Widget.prototype.require = function () {

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
     * Enables an instance of Widget.
     * @memberof! ch.Widget.prototype
     * @function
     * @returns {instance} Returns an instance of Widget.
     * @expample
     * // Enabling an instance of Widget.
     * widget.enable();
     */
    Widget.prototype.enable = function () {
        this._enabled = true;

        /**
         * Emits when a widget is enable.
         * @event ch.Widget#enable
         * @example
         * // Subscribe to "enable" event.
         * widget.on('enable', function () {
         *  // Some code here!
         * });
         */
        this.emit('enable');

        return this;
    };

    /**
     * Disables an instance of Widget.
     * @memberof! ch.Widget.prototype
     * @function
     * @return {instance} Returns an instance of Widget.
     * @expample
     * // Disabling an instance of Widget.
     * widget.disable();
     */
    Widget.prototype.disable = function () {
        this._enabled = false;

        /**
         * Emits when a widget is disable.
         * @event ch.Widget#disable
         * @example
         * // Subscribe to "disable" event.
         * widget.on('disable', function () {
         *  // Some code here!
         * });
         */
        this.emit('disable');

        return this;
    };

    /**
     * Destroys an instance of Widget and remove its data from asociated element.
     * @memberof! ch.Widget.prototype
     * @function
     * @expample
     * // Destroying an instance of Widget.
     * widget.destroy();
     */
    Widget.prototype.destroy = function () {

        this.disable();

        if (this._el !== undefined) {
            this._$el.removeData(this.name);
        }

        /**
         * Emits when a widget is destroyed.
         * @event ch.Widget#destroy
         * @exampleDescription
         * @example
         * // Subscribe to "destroy" event.
         * widget.on('destroy', function () {
         *  // Some code here!
         * });
         */
        this.emit('destroy');
    };

    ch.Widget = Widget;

}(this, this.ch.$, this.ch));