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
     * The name of the widget. All instances are saved into a 'map', grouped by its name. You can reach for any or all of the components from a specific name with 'ch.instances'.
     * @memberof! ch.Widget.prototype
     * @type {String}
     */
    Widget.prototype.name = 'widget';

    /**
     * Returns a reference to the Constructor function that created the instance's prototype.
     * @memberof! ch.Widget.prototype
     * @function
     */
    Widget.prototype.constructor = Widget;

    /**
     * Initialize the instance and merges the user options with defaults options.
     * @memberof! ch.Widget.prototype
     * @function
     * @returns {instance}
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
     * @returns {instance}
     */
    Widget.prototype.require = function () {

        var that = this;

        $.each(arguments, function (i, arg) {
            if (that[arg.toLowerCase()] === undefined) {
                ch[arg].call(that);
            }
        });
    };

    /**
     * Turns on the Widget.
     * @memberof! ch.Widget.prototype
     * @function
     * @returns {instance}
     */
    Widget.prototype.enable = function () {
        this._enabled = true;

        /**
         * Emits when the widget is enable.
         * @event ch.Widget#enable
         * @exampleDescription
         * @example
         * widget.on('enable', function(){
         *  // Some code here!
         * });
         */
        this.emit('enable');

        return this;
    };

    /**
     * Turns off the Widget.
     * @memberof! ch.Widget.prototype
     * @function
     * @returns {instance}
     */
    Widget.prototype.disable = function () {
        this._enabled = false;

        /**
         * Emits when the widget is disable.
         * @event ch.Widget#disable
         * @exampleDescription
         * @example
         * widget.on('disable', function(){
         *  // Some code here!
         * });
         */
        this.emit('disable');

        return this;
    };

    /**
     * Destroys a widget instance and remove data from its element.
     * @memberof! ch.Widget.prototype
     * @function
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
         * widget.on('destroy', function(){
         *  // Some code here!
         * });
         */
        this.emit('destroy');
    };

    ch.Widget = Widget;

}(this, this.ch.$, this.ch));