/**
* Event Emitter Class for the browser.
* @name EventEmitter
* @class EventEmitter
* @memberOf ch
*/
(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function EventEmitter() {
		var that = this;

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
		that.emit = function (event, data) {

			var fn = (that._options) ? that._options['on' + event] : undefined;

			if (fn !== undefined) {
				fn.call((that._options.controller || that), data);
			}

			$(that).trigger('ch-' + event, data);

			return that;
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
		that.on = function (event, handler) {

			if (event !== undefined && handler !== undefined) {
				$(that).on('ch-' + event, handler);
			}

			return that;
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
		that.once = function (event, handler) {

			if (event !== undefined && handler !== undefined) {
				$(that).one('ch-' + event, handler);
			}

			return that;
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
		that.off = function (event, handler) {
			if (event !== undefined && handler !== undefined) {
				$(that).off('ch-' + event, handler);
			} else if (event !== undefined) {
				$(that).off('ch-' + event);
			}

			return that;
		};

		/**
		 * Returns all listeners from the collection for a specified event.
		 * @name listeners
		 * @methodOf ch.Widget#
		 * @param {string} event Event name.
		 * @returns Array
		 * @example
		 * me.listeners('ready');
		 */
		that.listeners = function (event) {
			if (event === undefined) {
				throw new Error('EventEmitter - "listeners(event)": It should receive an event.');
			}

			return $._data(that, 'events')['ch-' + event];
		};

	}

	ch.EventEmitter = EventEmitter;

}(this, this.jQuery, this.ch));