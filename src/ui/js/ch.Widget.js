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
			// TODO: Ver el cappítulo del libro de zakas Maintenible JavaScript para ver si nos conviene crear nuestro propios errores
			throw new window.Error('Expected 2 parameters or less');
		}

		this.uid = (uid += 1);

		// Gets or creates the klass's instances map
		ch.instances[this['name']] = ch.instances[this['name']] || {};
		ch.instances[this['name']][this.uid] = this;
	};

	Widget.prototype.destroy = function () {

		this.$el.removeData(this['name']);

		delete ch.instances[this['name']][this.uid];

	};

	Widget.prototype.callbacks = function (when, data) {

		if (ch.util.hasOwn(this.options, when)) {
			var context = (this.controller) ? this.controller : this;

			return this.options[when].call(context, data);
		}

	};

	/**
	 * Triggers a specific event within the component public context.
	 * @name trigger
	 * @methodOf ch.Widget#
	 * @param {String} event The event name you want to trigger.
	 * @returns {Object}
	 * @since 0.7.1
	 * @exampleDescription Emits an event with data
	 * @example
	 * widget.trigger('someEvent', data);
	 */
	Widget.prototype.trigger = function (event, data) {
		$(this).trigger('ch-' + event, data);

		return this;
	};


	/**
	 * Add a callback function from specific event.
	 * @name on
	 * @methodOf ch.Widget#
	 * @param {string} event Event nawidget.
	 * @param {function} handler Handler function.
	 * @returns {Object}
	 * @since version 0.7.1
	 * @exampleDescription Will add a event handler to the "ready" event
	 * @example
	 * widget.on('ready', startDoingStuff);
	 */
	Widget.prototype.on = function (event, handler) {

		if (event !== undefined && handler !== undefined) {
			$(this).on('ch-' + event, handler);
		}

		return this;
	};

	/**
	 * Add a callback function from specific event that it will execute once.
	 * @name once
	 * @methodOf ch.Widget#
	 * @param {String} event Event nawidget.
	 * @param {Function} handler Handler function.
	 * @returns {Object}
	 * @since version 0.8.0
	 * @exampleDescription Will add a event handler to the "contentLoad" event once
	 * @example
	 * widget.once('contentLoad', startDoingStuff);
	 */
	Widget.prototype.once = function (event, handler) {

		if (event !== undefined && handler !== undefined) {
			$(this).one('ch-' + event, handler);
		}

		return this;
	};

	/**
	 * Removes a callback function from specific event.
	 * @name off
	 * @methodOf ch.Widget#
	 * @param {String} event Event nawidget.
	 * @param {Function} handler Handler function.
	 * @returns {Object}
	 * @since version 0.7.1
	 * @exampleDescription Will remove event handler to the "ready" event
	 * @example
	 * var startDoingStuff = function () {
	 *     // Some code here!
	 * };
	 *
	 * widget.off('ready', startDoingStuff);
	 */
	Widget.prototype.off = function (event, handler) {
		if (event !== undefined && handler !== undefined) {
			$(this).off('ch-' + event, handler);
		} else if (event !== undefined) {
			$(this).off('ch-' + event);
		}

		return this;
	};

	ch.Widget = Widget;

}(this, this.jQuery, this.ch));