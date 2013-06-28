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
	 * Represents the abstract class of all widgets.
	 * @abstract
	 * @name Widget
	 * @class Widget
	 * @memberOf ch
	 */
	function Widget($el, options) {
		this.init($el, options);

		return this;
	}

	ch.util.inherits(Widget, ch.EventEmitter);

	Widget.prototype.name = 'widget';
	Widget.prototype.constructor = Widget;

	/**
	 * Initialize the instance and merges the user options with defaults options.
	 * @public
	 * @function
	 * @name ch.Widget#init
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

        this.uid = (uid += 1);

        this._enabled = true;
	};


    /**
     * Adds functionality or abilities from other classes.
     * @public
     * @function
     * @name ch.Widget#require
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
     * Turn on the Widget.
     * @public
     * @name ch.Widget#enable
     * @function
     * @returns itself
     */
    Widget.prototype.enable = function () {
        this._enabled = true;

        /**
         * Triggers when the widget is enable.
         * @name ch.Widget#enable
         * @event
         * @public
         * @exampleDescription
         * @example
         * widget.on("enable", function(){
         *  // Some code here!
         * });
         */
        this.emit('enable');

        return this;
    };

    /**
     * Turn off the Widget.
     * @public
     * @name ch.Widget#disable
     * @function
     * @returns itself
     */
    Widget.prototype.disable = function () {
        this._enabled = false;

        /**
         * Triggers when the widget is disable.
         * @name ch.Widget#disable
         * @event
         * @public
         * @exampleDescription
         * @example
         * widget.on("disable", function(){
         *  // Some code here!
         * });
         */
        this.emit('disable');

        return this;
    };

    /**
     * Destroys a widget instance and remove data from its element.
     * @public
     * @function
     * @name ch.Widget#destroy
     */
    Widget.prototype.destroy = function () {

        this.disable();

        if (this._el !== undefined) {
            this._$el.removeData(this.name);
        }

        this.emit('destroy');
    };

    ch.Widget = Widget;

}(this, this.ch.$, this.ch));