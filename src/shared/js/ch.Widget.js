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
                this.$el = $el;
                this.el = $el[0];
                // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
                this._snippet = this.el.cloneNode(true);
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
                this.$el = $el;
                this.el = $el[0];
                this._snippet = this.el.cloneNode(true);
                this._options = $.extend(defaults, options);
            }

        } else {
            throw new window.Error('Expected 2 parameters or less');
        }

        this.uid = (uid += 1);


        this._enabled = true;

        // Gets or creates the klass's instances map
        ch.instances[this.name] = ch.instances[this.name] || {};
        ch.instances[this.name][this.uid] = this;
	};

    /**
     * Destroys the widget instance and remove data from the element.
     * @public
     * @function
     * @name ch.Widget#destroy
     */
    Widget.prototype.destroy = function () {

        this.$el.removeData(this.name);

        delete ch.instances[this.name][this.uid];
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
    Widget.prototype.enable = function (condition) {
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
    Widget.prototype.disable = function (condition) {
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

    ch.Widget = Widget;

}(this, (this.jQuery || this.Zepto), this.ch));