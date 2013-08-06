(function (window, $, ch) {
    'use strict';

    var $document = $(window.document),
        codeMap = {
            '8': ch.onkeybackspace,
            '9': ch.onkeytab,
            '13': ch.onkeyenter,
            '27': ch.onkeyesc,
            '37': ch.onkeyleftarrow,
            '38': ch.onkeyuparrow,
            '39': ch.onkeyrightarrow,
            '40': ch.onkeydownarrow
        },

        /**
         * Shortcuts
         * @memberof ch
         * @namespace
         */
        shortcuts = {

            '_active': null,

            '_queue': [],

            '_collection': {},

            /**
             * Add a callback to a shortcut with given name.
             * @param {(ch.onkeybackspace | ch.onkeytab | ch.onkeyenter | ch.onkeyesc | ch.onkeyleftarrow | ch.onkeyuparrow | ch.onkeyrightarrow | ch.onkeydownarrow)} shortcut Shortcut to subscribe.
             * @param {String} name A name to add in the collection.
             * @param {Function} callback A given function.
             * @returns {Object} Retuns the ch.shortcuts.
             * @example
             * // Add a callback to ESC key with "widget" name.
             * ch.shortcuts.add(ch.onkeyesc, 'widget', widget.hide);
             */
            'add': function (shortcut, name, callback) {

                if (this._collection[name] === undefined) {
                    this._collection[name] = {};
                }

                if (this._collection[name][shortcut] === undefined) {
                    this._collection[name][shortcut] = [];
                }

                this._collection[name][shortcut].push(callback);

                return this;

            },

            /**
             * Removes a callback from a shortcut with given name.
             * @param {(ch.onkeybackspace | ch.onkeytab | ch.onkeyenter | ch.onkeyesc | ch.onkeyleftarrow | ch.onkeyuparrow | ch.onkeyrightarrow | ch.onkeydownarrow)} shortcut Shortcut to unsubscribe.
             * @param {String} name A name to remove from the collection.
             * @param {Function} callback A given function.
             * @returns {Object} Retuns the ch.shortcuts.
             * @example
             * // Remove a callback from ESC key with "widget" name.
             * ch.shortcuts.remove(ch.onkeyesc, 'widget', widget.hide);
             */
            'remove': function (shortcut, name, callback) {
                var evt,
                    evtCollection,
                    evtCollectionLenght;

                if (shortcut === undefined) {
                    throw new Error('Shortcuts - "remove(shortcut, name, callback)": "shortcut" parameter must be defined.');
                }

                if (name === undefined) {
                    throw new Error('Shortcuts - "remove(shortcut, name, callback)": "name" parameter must be defined.');
                }

                if (callback === undefined) {
                    delete this._collection[name][shortcut];
                }

                evtCollection = this._collection[name][shortcut];

                evtCollectionLenght = evtCollection.length;

                for (evt = 0; evt < evtCollectionLenght; evt += 1) {

                    if (evtCollection[evt] === callback) {
                        evtCollection.splice(evt, 1);
                    }
                }

                return this;

            },

            /**
             * Turn on shortcuts associated to a given name.
             * @param {String} name A given name from the collection.
             * @returns {Object} Retuns the ch.shortcuts.
             * @example
             * // Turn on shortcuts associated to "widget" name.
             * ch.shortcuts.on('widget');
             */
            'on': function (name) {
                var queueLength = this._queue.length,
                    item = queueLength - 1;

                // check if the instance exist and move the order, adds it at the las position and removes the current
                for (item; item >= 0; item -= 1) {
                    if (this._queue[item] === name) {
                        this._queue.splice(item, 1);
                    }
                }

                this._queue.push(name);
                this._active = name;

                return this;
            },

            /**
             * Turn off shortcuts associated to a given name.
             * @param {String} name A given name from the collection.
             * @returns {Object} Retuns the ch.shortcuts.
             * @example
             * // Turn off shortcuts associated to "widget" name.
             * ch.shortcuts.off('widget');
             */
            'off': function (name) {
                var queueLength = this._queue.length,
                    item = queueLength - 1;

                for (item; item >= 0; item -= 1) {
                    if (this._queue[item] === name) {
                        // removes the instance that I'm setting off
                        this._queue.splice(item, 1);

                        // the queue is full
                        if (this._queue.length > 0) {
                            this._active = this._queue[this._queue.length - 1];
                        } else {
                        // the queue no has elements
                            this._active = null;
                        }
                    }
                }

                return this;
            }
        };

    $document.on('keydown.shortcuts', function (event) {
        var keyCode = event.keyCode.toString(),
            shortcut = codeMap[keyCode],
            callbacks,
            callbacksLenght,
            i = 0;

        if (shortcut !== undefined && shortcuts._active !== null) {
            callbacks = shortcuts._collection[shortcuts._active][shortcut];

            event.type = shortcut;


            if (callbacks !== undefined) {

                callbacksLenght = callbacks.length;

                for (i = 0; i < callbacksLenght; i += 1) {
                    callbacks[i](event);
                }

            }

        }
    });

    ch.shortcuts = shortcuts;

}(this, this.ch.$, this.ch));