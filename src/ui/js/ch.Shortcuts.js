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

    Shortcuts = {

        '_active': null,

        '_queue': [],

        'configure': function () {
            var that = this;

            $document.on('keydown.shortcuts', function (event) {
                keyCode = event.keyCode.toString();

                if(codeMap[keyCode] !== undefined && that._active !== null) {
                    // Trigger custom event with original event as second parameter
                    event.type = codeMap[keyCode];
                    that._active.emit(codeMap[keyCode], event);
                }
            });

        },

        'on': function (instance) {
            var queueLength = this._queue.length
                item = queueLength -1;

            // check if the instance exist and move the order, adds it at the las position and removes the current
            for (item; item >= 0; item--) {
                if (this._queue[item] === instance) {
                    this._queue.splice(item, 1);
                }
            }

            this._queue.push(instance);
            this._active = instance;
        },

        'off': function (instance) {
            var queueLength = this._queue.length,
                item = queueLength -1;

            for (item; item >= 0; item--) {
                if (this._queue[item] === instance) {
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

    Shortcuts.configure();

    ch.Shortcuts = Shortcuts;

}(this, this.ch.$, this.ch));
