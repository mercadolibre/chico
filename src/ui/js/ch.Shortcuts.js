/**
* Shortcuts lets you centralize and manage changes related to positioned elements. Positioner returns an utility that resolves positioning for all widget.
* @name Shortcuts
* @class Shortcuts
* @memberOf ch
* @param {Object} conf Configuration object with positioning properties.
* @param {String} conf.target Reference to the DOM Element to be positioned.
* @param {String} [conf.activate] It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the viewport.
* @param {String} [conf.deactivate] Points where element will be positioned, specified by configuration or center by default.
* @returns {Object} The Positioner returns a Function that it works in 3 ways: as a setter, as a getter and with the "refresh" parameter refreshes the position.
*
* @exampleDescription
* Instance the Positioner It requires a little configuration.
* The default behavior place an element center into the Viewport.
* @example
* var navigation = new ch.Shortcuts({
*     'target': $('.myCarousel'),
* });
*
* $('.myCarousel')
*     .on(ch.onkeyrightarrow, function () { carousel.next() })
*     .on(ch.onkeyleftarrow, function () { carousel.prev() });
*/
(function (window, $, ch) {

    /**
     * Map with references to key codes.
     * @private
     * @name ch.Keyboard#codeMap
     * @type object
     */
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
     * Keyboard event controller utility to know wich keys are begin.
     * @name Keyboard
     * @class Keyboard
     * @memberOf ch
     * @param event
     */


//

    shortcuts = {

        '_active': null,

        '_queue': [],

        '_collection': {},

        'configure': function () {
            var that = this;

            $document.on('keydown.shortcuts', function (event) {
                var keyCode = event.keyCode.toString(),
                    eventType = codeMap[keyCode],
                    callbacks,
                    i;

                if(eventType !== undefined && that._active !== null) {
                    callbacks = that._collection[that._active][eventType];
                    // Trigger custom event with original event as second parameter
                    event.type = codeMap[keyCode];
                    //that._active.emit(codeMap[keyCode], event);

                    if (callbacks !== undefined) {
                        for (i = 0; i < callbacks.length; i++) {
                            callbacks[i](event);
                        }
                    }

                }
            });

        },

        'add': function (event, name, callback) {

            if (this._collection[name] === undefined) {
                this._collection[name] = {};
            }

            if (this._collection[name][event] === undefined) {
                this._collection[name][event] = [];
            }

            this._collection[name][event].push(callback);

        },

        'remove': function (event, name, callback) {
            var evt,
                evtCollectionLenght;

            if (event === undefined){
                throw new Error('Shortcuts - "remove(event, name, callback)": "event" parameter must be defined.');
            }

            if (name === undefined){
                throw new Error('Shortcuts - "remove(event, name, callback)": "name" parameter must be defined.');
            }

            if (callback === undefined) {
                // borra todos los eventos
                delete this._collection[name][event];
            }

            evtCollection = this._collection[name][event];

            evtCollectionLenght = evtCollection.length;

            for (evt = 0; evt < evtCollectionLenght; evt++) {

                if (evtCollection[evt] === callback) {
                    evtCollection.splice(evt, 1);
                }
            }

        },

        'on': function (name) {
            var queueLength = this._queue.length
                item = queueLength -1;

            // check if the instance exist and move the order, adds it at the las position and removes the current
            for (item; item >= 0; item--) {
                if (this._queue[item] === name) {
                    this._queue.splice(item, 1);
                }
            }

            this._queue.push(name);
            this._active = name;

        },

        'off': function (name) {
            var queueLength = this._queue.length,
                item = queueLength -1;

            for (item; item >= 0; item--) {
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
        }
    };

    shortcuts.configure();

    ch.shortcuts = shortcuts;

}(this, this.ch.$, this.ch));
