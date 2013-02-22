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
     * Triggers a specific event within the component public context.
     * @name trigger
     * @methodOf ch.Widget#
     * @param {String} event The event name you want to trigger.
     * @returns {Object}
     * @since 0.7.1
     * @exampleDescription Emits an event with data
     * @example
     * widget.trigger('someevent', data);
     */
    EventEmitter.prototype.emit = function (event, data) {

        // TODO: The widget should add this event - on('on' + event, this._options['on' + event]);
        var fn = (this._options) ? this._options['on' + event] : undefined;

        // TODO: The widget should add this event - on('on' + event, this._options['on' + event]);
        if (fn !== undefined) {
            fn.call((this._options.controller || this), data);
        }

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
    EventEmitter.prototype.on = function (event, handler) {

        if (event !== undefined && handler !== undefined) {
            $(this).on('ch-' + event, handler);
        }

        return this;
    };

    /**
     * Add a callback function from specific event will execute once.
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
    EventEmitter.prototype.once = function (event, handler) {

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
    EventEmitter.prototype.off = function (event, handler) {
        if (event !== undefined && handler !== undefined) {
            $(this).off('ch-' + event, handler);
        } else if (event !== undefined) {
            $(this).off('ch-' + event);
        }

        return this;
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
    EventEmitter.prototype.listeners = function (event) {
        if (event === undefined) {
            throw new Error('EventEmitter - "listeners(event)": It should receive an event.');
        }

        var events = $._data(this, 'events');

        return (events) ? (this._eventsCollection = events['ch-' + event]) : undefined;
    };

    ch.EventEmitter = EventEmitter;

}(this, this.jQuery, this.ch));