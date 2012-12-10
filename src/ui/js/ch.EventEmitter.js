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

		that.emitter = {};

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
		that.emitter.emit = function (event, data) {
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
		that.emitter.on = function (event, handler) {

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
		that.emitter.once = function (event, handler) {

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
		that.emitter.off = function (event, handler) {
			if (event !== undefined && handler !== undefined) {
				$(that).off('ch-' + event, handler);
			} else if (event !== undefined) {
				$(that).off('ch-' + event);
			}

			return that;
		};

	}

	ch.EventEmitter = EventEmitter;

}(this, this.jQuery, this.ch));