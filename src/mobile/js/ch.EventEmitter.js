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

    function EventEmitter() {}

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
    EventEmitter.prototype.emit = function (event, data) {

        var args = arguments,
            event = args[0],
            listeners,
            i = 0,
            len,
            // TODO: The widget should add this event - on('on' + event, this._options['on' + event]);
            fn = (this._options) ? this._options['on' + event] : undefined;

        if (event === undefined) {
            throw new Error('EventEmitter - "emit(event)": It should receive an event.');
        }

        if (typeof event === 'string') {
            event = {'type': event};
        }

        if (!event.target) {
            event.target = this;
        }

        if (this._eventsCollection !== undefined && ch.util.isArray(this._eventsCollection[event.type])) {
            listeners = this._eventsCollection[event.type];
            len = listeners.length;

            for (i; i < len; i += 1) {
                listeners[i].apply(this, arguments);

                if (listeners[i].once) {
                    this.off(event.type, listeners[i]);
                    len -= 1;
                    i -= 1;
                }
            }
        }

        // TODO: The widget should add this event - on('on' + event, this._options['on' + event]);
        if (fn !== undefined) {
            fn.call(this._options.controller || this, data);
        }

        return this;
    };

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
     * me.on("ready", startDoingStuff);
     */
    EventEmitter.prototype.on = function (event, listener, once) {
        if (event === undefined) {
            throw new Error('ch.EventEmitter - "on(event, listener)": It should receive an event.');
        }

        if (listener === undefined) {
            throw new Error('ch.EventEmitter - "on(event, listener)": It should receive a listener function.');
        }

        listener.once = once || false;

        this._eventsCollection = this._eventsCollection || {};

        if (this._eventsCollection[event] === undefined) {
            this._eventsCollection[event] = [];
        }

        this._eventsCollection[event].push(listener);

        return this;
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
    EventEmitter.prototype.once = function (event, listener) {

        this.on(event, listener, true);

        return this;
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
    EventEmitter.prototype.off = function (event, listener) {
        if (event === undefined) {
            throw new Error('EventEmitter - "off(event, listener)": It should receive an event.');
        }

        if (listener === undefined) {
            throw new Error('EventEmitter - "off(event, listener)": It should receive a listener function.');
        }

        var listeners = this._eventsCollection[event],
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

        return this;
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
    EventEmitter.prototype.listeners = function (event) {
        if (event === undefined) {
            throw new Error('EventEmitter - "listeners(event)": It should receive an event.');
        }

        return this.eventsCollection[event];
    };

    ch.EventEmitter = EventEmitter;

}(this, this.Zepto, this.ch));