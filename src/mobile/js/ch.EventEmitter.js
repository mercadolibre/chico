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
		var that = this,
			collection = {},
			maxListeners = 10;

		/**
		 * Adds a listener to the collection for a specified event.
		 * @public
		 * @function
		 * @name EventEmitter#addListener
		 * @param {string} event Event name.
		 * @param {function} listener Listener function.
		 * @param {boolean} once Listener function will be called only one time.
		 * @example
		 * // Will add a event listener to the "ready" event
		 * var startDoingStuff = function (event, param1, param2, ...) {
		 *     // Some code here!
		 * };
		 *
		 * me.addListener("ready", startDoingStuff);
		 * // or
		 * me.on("ready", startDoingStuff);
		 */
		that.addListener = that.on = function (event, listener, once) {
			if (event === undefined) {
				throw new Error('jvent - "addListener(event, listener)": It should receive an event.');
			}

			if (listener === undefined) {
				throw new Error('jvent - "addListener(event, listener)": It should receive a listener function.');
			}

			listener.once = once || false;

			if (collection[event] === undefined) {
				collection[event] = [];
			}

			if (collection[event].length + 1 > maxListeners && maxListeners !== 0) {
				throw new Error('Warning: So many listeners for an event.');
			}

			collection[event].push(listener);

			// This event is emitted any time someone adds a new listener.
			that.emit('newListener');

			return that;
		};

		/**
		 * Adds a one time listener to the collection for a specified event. It will execute only once.
		 * @public
		 * @function
		 * @name EventEmitter#once
		 * @param {string} event Event name.
		 * @param {function} listener Listener function.
		 * @returns itself
		 * @example
		 * // Will add a event handler to the "contentLoad" event once
		 * me.once("contentLoad", startDoingStuff);
		 */
		that.once = function (event, listener) {

			that.on(event, listener, true);

			return that;
		};

		/**
		 * Removes a listener from the collection for a specified event.
		 * @public
		 * @function
		 * @name EventEmitter#removeListener
		 * @param {string} event Event name.
		 * @param {function} listener Listener function.
		 * @returns itself
		 * @example
		 * // Will remove event handler to the "ready" event
		 * var startDoingStuff = function () {
		 *     // Some code here!
		 * };
		 *
		 * me.removeListener("ready", startDoingStuff);
		 * // or
		 * me.off("ready", startDoingStuff);
		 */
		that.removeListener = that.off = function (event, listener) {
			if (event === undefined) {
				throw new Error('jvent - "removeListener(event, listener)": It should receive an event.');
			}

			if (listener === undefined) {
				throw new Error('jvent - "removeListener(event, listener)": It should receive a listener function.');
			}

			var listeners = collection[event],
				j = 0,
				len;

			if (ch.util.isArray(listeners)) {
				len = listeners.length;
				for (j; j < len; j += 1) {
					if (listeners[j] === listener) {
						listeners.splice(j, 1);
						break;
					}
				}
			}

			return that;
		};

		/**
		 * Removes all listeners from the collection for a specified event.
		 * @public
		 * @function
		 * @name EventEmitter#removeAllListeners
		 * @param {string} event Event name.
		 * @returns itself
		 * @example
		 * me.removeAllListeners("ready");
		 */
		that.removeAllListeners = function (event) {
			if (event === undefined) {
				throw new Error('jvent - "removeAllListeners(event)": It should receive an event.');
			}

			delete collection[event];

			return that;
		};

		/**
		 * Increases the number of listeners. Set to zero for unlimited.
		 * @public
		 * @function
		 * @name EventEmitter#setMaxListeners
		 * @param {number} n Number of max listeners.
		 * @returns itself
		 * @example
		 * me.setMaxListeners(20);
		 */
		that.setMaxListeners = function (n) {
			if (isNaN(n)) {
				throw new Error('jvent - "setMaxListeners(n)": It should receive a number.');
			}

			maxListeners = n;

			return that;
		};

		/**
		 * Returns all listeners from the collection for a specified event.
		 * @public
		 * @function
		 * @name EventEmitter#listeners
		 * @param {string} event Event name.
		 * @returns Array
		 * @example
		 * me.listeners("ready");
		 */
		that.listeners = function (event) {
			if (event === undefined) {
				throw new Error('jvent - "listeners(event)": It should receive an event.');
			}

			return collection[event];
		};

		/**
		 * Execute each item in the listener collection in order with the specified data.
		 * @name EventEmitter#emit
		 * @public
		 * @protected
		 * @param {string} event The name of the event you want to emit.
		 * @param {...object} var_args Data to pass to the listeners.
		 * @example
		 * // Will emit the "ready" event with "param1" and "param2" as arguments.
		 * me.emit("ready", "param1", "param2");
		 */
		that.emit = function (event, data) {
			var that = this,
				args = arguments,
				event = args[0],
				listeners,
				i,
				len,
				fn = that._options['on' + event];

			if (event === undefined) {
				throw new Error('jvent - "emit(event)": It should receive an event.');
			}

			if (typeof event === 'string') {
				event = {'type': event};
			}

			if (!event.target) {
				event.target = that;
			}

			if (ch.util.isArray(collection[event.type])) {
				listeners = collection[event.type];
				i = 0;
				len = listeners.length;

				for (i; i < len; i += 1) {
					listeners[i].apply(that, arguments);

					if (listeners[i].once) {
						this.off(event.type, listeners[i]);
						len -= 1;
						i -= 1;
					}
				}
			}

			if (fn !== undefined) {
				fn.call(that._options.controller || that, data);
			}

			return that;
		};

		return that;
	}

	ch.EventEmitter = EventEmitter;

}(this, this.Zepto, this.ch));