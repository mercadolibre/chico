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

	Widget.prototype.init = function ($el, options) {

		var defaults = (this.defaults) ? util.clone(this.defaults) : {};

		if (options === undefined) {
			if ($el === undefined) {
				this.options = defaults;

			} else if ($el instanceof $) {
				this.$el = $el;
				this.el = $el[0];
				this.snippet = this.el.cloneNode();
				this.options = defaults;

			} else if (typeof $el === 'object') {
				this.options = $.extend(defaults, $el);
			}

		} else if ($el instanceof $ && typeof options === 'object') {
			this.$el = $el;
			this.el = $el[0];
			this.snippet = this.el.cloneNode();
			this.options = $.extend(defaults, options);

		} else {
			throw new window.Error('Expected 2 parameters or less');
		}

		this.uid = (uid += 1);

		// Gets or creates the klass's instances map
		ch.instances[this.name] = ch.instances[this.name] || {};
		ch.instances[this.name][this.uid] = this;

		this.require('EventEmitter');

	};

	Widget.prototype.destroy = function () {

		this.$el.removeData(this.name);

		delete ch.instances[this.name][this.uid];

	};

	Widget.prototype.callbacks = function (when, data) {

		if (ch.util.hasOwn(this.options, when)) {
			var context = (this.controller) ? this.controller : this;

			return this.options[when].call(context, data);
		}

	};

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