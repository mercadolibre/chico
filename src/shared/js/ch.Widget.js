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
	 * @constructor
	 * @memberOf ch
	 * @param {Selector} $el Query Selector element.
	 * @param {Object} [options] Configuration options.
	 * @property {Object} options The configuration properties.
	 * @property {HTMLElement} element Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	 * @property {Selector} $element The cached jQuery/Zepto object.
	 * @property {Number} uid The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	 * @property {String} type This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	 * @returns {Object}
	 */
	function Widget($el, options) {
		this.init($el, options);

		return this;
	}

	Widget.prototype.name = 'widget';

	Widget.prototype.constructor = Widget;

	Widget.prototype.init = function ($el, options) {
		var defaults = util.clone(this.defaults);

		if (options === undefined) {
			if ($el === undefined) {
				this.options = defaults;

			} else if ($el instanceof $) {
				this.$el = $el;
				this.el = $el[0];
				this.snippet = this.el.cloneNode();
				this.options = defaults

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

}(this, this.jQuery, this.ch));