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

			} else if ($el instanceof $) {
				this.$el = $el;
				this.el = $el[0];
				this._snippet = this.el.cloneNode();
				this._options = defaults;

			} else if (typeof $el === 'object') {
				this._options = $.extend(defaults, $el);
			}

		} else if ($el instanceof $ && typeof options === 'object') {
			this.$el = $el;
			this.el = $el[0];
			this._snippet = this.el.cloneNode();
			this._options = $.extend(defaults, options);

		} else {
			throw new window.Error('Expected 2 parameters or less');
		}

		this.uid = (uid += 1);

		// Gets or creates the klass's instances map
		ch.instances[this.name] = ch.instances[this.name] || {};
		ch.instances[this.name][this.uid] = this;

		this.require('EventEmitter');

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
	 * Executes a specific listener when an event has been emitted.
	 * @public
	 * @function
	 * @name ch.Widget#callbacks
	 */
	Widget.prototype.callbacks = function (when, data) {

		if (ch.util.hasOwn(this._options, when)) {
			var context = (this._options.controller) ? this._options.controller : this;

			return this._options[when].call(context, data);
		}
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

	ch.Widget = Widget;

}(this, (this.jQuery || this.Zepto), this.ch));