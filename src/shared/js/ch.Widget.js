(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    var util = ch.util,

        /**
         * Global instantiation widget id.
         * @private
         * @type {Number}
         */
        uid = 0;

    /**
     * Base class for all widgets.
     * @memberof ch
     * @constructor
     * @augments ch.EventEmitter
     * @param {Selector} $el Query Selector element.
     * @param {Object} [options] Configuration options.
     * @returns {Object}
     */
    function Widget($el, options) {
        this.init($el, options);

        return this;
    }

    ch.util.inherits(Widget, ch.EventEmitter);

    /**
     * The name of the widget. A new instance is saved into the $el parameter.
     * @memberof! ch.Widget.prototype
     * @type {String}
     * @expample
     * // You can reach the instance associated.
     * var widget = $(selector).data('widget');
     */
    Widget.prototype.name = 'widget';

    /**
     * Returns a reference to the Constructor function that created the instance's prototype.
     * @memberof! ch.Widget.prototype
     * @constructor
     * @private
     */
    Widget.prototype._constructor = Widget;

    /**
     * Initialize the instance and merges the user options with defaults options.
     * @memberof! ch.Widget.prototype
     * @function
     * @returns {instance} Returns an instance of Widget.
     */
    Widget.prototype.init = function ($el, options) {

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
            throw new window.Error('Expected 2 parameters or less');
        }

        /**
         * Global instantiation Widget id.
         * @type {Number}
         */
        this.uid = (uid += 1);

        /**
         * Indicates if the widget is enabled.
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
     * // For example you should require the collpasible and closable abitliy.
     * var widget = new Widget(element, options);
     * widget.require('Collapsible', 'Closable');
     */
    Widget.prototype.require = function () {

        var that = this;

        $.each(arguments, function (i, arg) {
            if (that[arg.toLowerCase()] === undefined) {
                ch[arg].call(that);
            }
        });

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
         * Emits when the widget is enable.
         * @event ch.Widget#enable
         * @example
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
     * @returns {instance} Returns an instance of Widget.
     * @expample
     * // Disabling an instance of Widget.
     * widget.disable();
     */
    Widget.prototype.disable = function () {
        this._enabled = false;

        /**
         * Emits when the widget is disable.
         * @event ch.Widget#disable
         * @example
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
         * Emits when the widget is destroyed.
         * @event ch.Widget#destroy
         * @exampleDescription
         * @example
         * widget.on('destroy', function () {
         *  // Some code here!
         * });
         */
        this.emit('destroy');
    };

    ch.Widget = Widget;

}(this, this.ch.$, this.ch));