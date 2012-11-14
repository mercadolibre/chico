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
		var collection = {},
			maxListeners = 10;

		/**
		* Adds a listener to the collection for a specified event.
		* @public
		* @function
		* @name ch.EventEmitter#addListener
		* @param {string} event Event name.
		* @param {function} listener Listener function.
		* @exampleDescription Adds a new listener.
		* @example
		* // Will add a event listener to the "ready" event
		* var startDoingStuff = function () {
		*     // Some code here!
		* };
		*
		* me.addListener("ready", startDoingStuff);
		* // or
		* me.on("ready", startDoingStuff);
		*/
		this.addListener = this.on = function (event, listener) { // Event: 'newListener'
			if (typeof collection[event] === "undefined") {
				collection[event] = [];
			}

			if (collection[event].length + 1 > maxListeners) {
				throw "Warning: So many listeners for an event.";
			}

			collection[event].push(listener);

			if (event !== "newListener") {
				this.emit("newListener");
			}

			return this;
		};

		/**
		* Adds a one time listener to the collection for a specified event. It will execute only once.
		* @public
		* @function
		* @name ch.EventEmitter#once
		* @param {string} event Event name.
		* @param {function} listener Listener function.
		* @returns itself
		* @exampleDescription Adds a new listener that will execute only once.
		* @example
		* // Will add a event handler to the "contentLoad" event once
		* me.once("contentLoad", startDoingStuff);
		*/
		this.once = function (event, listener) {

			var fn = function (event, data) {
				listener.call(this, event, data);
				this.off(event.type, fn);
			};

			this.on(event, fn);

			return this;
		};

		/**
		* Removes a listener from the collection for a specified event.
		* @public
		* @function
		* @name ch.EventEmitter#removeListener
		* @param {string} event Event name.
		* @param {function} listener Listener function.
		* @returns itself
		* @exampleDescription Removes a listener.
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
		this.removeListener = this.off = function (event, listener) {
			if (collection[event] instanceof Array) {

				if (listener) {
					var listeners = collection[event],
						j = 0,
						len = listeners.length;

					for (j; j < len; j += 1) {
						if (listeners[j] === listener) {
							listeners.splice(j, 1);
							break;
						}
					}
				}
			}

			return this;
		};

		/**
		* Removes all listeners from the collection for a specified event.
		* @public
		* @function
		* @name ch.EventEmitter#removeAllListeners
		* @param {string} event Event name.
		* @returns itself
		* @exampleDescription Removes all listeners.
		* @example
		* me.removeAllListeners("ready");
		*/
		this.removeAllListeners = function (event) {
			delete collection[event];

			return this;
		};

		/**
		* Increases the number of listeners. Set to zero for unlimited.
		* @public
		* @function
		* @name ch.EventEmitter#setMaxListeners
		* @param {number} n Number of max listeners.
		* @returns itself
		* @exampleDescription Increases the number of listeners.
		* @example
		* me.setMaxListeners(20);
		*/
		this.setMaxListeners = function (n) {
			maxListeners = n;

			return this;
		};

		/**
		* Returns all listeners from the collection for a specified event.
		* @public
		* @function
		* @name ch.EventEmitter#listeners
		* @param {string} event The name of the Event.
		* @returns Array
		* @exampleDescription Gets all listeners.
		* @example
		* me.listeners("ready");
		*/
		this.listeners = function (event) {
			return collection[event];
		};

		/**
		* Execute each of the listener collection in order with the data object.
		* @name ch.EventEmitter#emit
		* @public
		* @function
		* @param {string} event The event name you want to emit.
		* @param {object} data Optionl data
		* @exampleDescription Emits a new custom event.
		* @example
		* // Will add a event handler to the "ready" event
		* me.emit("ready", {});
		*/
		this.emit = function (event, data) {

			if (typeof event === "string") {
				event = { "type": event };
			}

			if (!event.target) {
				event.target = this;
			}

			if (!event.type) {
				throw new Error("Event object missing 'type' property.");
			}

			if (collection[event.type] instanceof Array) {
				var listeners = collection[event.type],
					i = 0,
					len = listeners.length;

				for (i; i < len; i += 1) {
					listeners[i].call(this, event, data);
				}
			}

			return this;

		};

		return this;
	}

	ch.EventEmitter = EventEmitter;

}(this, this.Zepto, this.ch));