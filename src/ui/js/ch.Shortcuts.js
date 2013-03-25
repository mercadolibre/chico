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
    var codeMap = {
         '8': ch.onkeybackspace,
         '9': ch.onkeytab,
        '13': ch.onkeyenter,
        '27': ch.onkeyesc,
        '37': ch.onkeyleftarrow,
        '38': ch.onkeyuparrow,
        '39': ch.onkeyrightarrow,
        '40': ch.onkeydownarrow
    };

    /**
     * Keyboard event controller utility to know wich keys are begin.
     * @name Keyboard
     * @class Keyboard
     * @memberOf ch
     * @param event
     */

    function Shortcuts($target, events, config) {

        if ($target === undefined) {
            throw new window.Error('ch.Shortcuts(target): the "target" parameter is required.');
        }

        // Creates its private options
        this._options = ch.util.clone(this._defaults);



        this.configure($target, events, config);

    }

    Shortcuts.prototype.name = 'shortcuts';

    Shortcuts.prototype.constructor = Shortcuts;

    Shortcuts.prototype._defaults = {
        'on': 'focus.shortcuts',
        'off': 'blur.shortcuts',
        'tabindex': 0
    };

    Shortcuts.prototype.configure = function ($target, events, config) {
        var that = this;

        // Merge user options with its options
        $.extend(this._options, {'events': events}, config);

        this._$target = $target;

        if (this._$target.attr('tabindex') === undefined) {
            this._$target.attr('tabindex', this._options.tabindex);
        }

        // default behavior to activate the feature
        if (this._options.on !== 'none') {
            this._$target.on(this._options.on, function () { that.on(); });
        }

        // default behavior to deactivate the feature
        if (this._options.off !== 'none') {
            this._$target.on(this._options.off, function () { that.off(); });
        }

    };

    Shortcuts.prototype.on = function () {
        var that = this,
            keyCode,
            event;

        // start to emits predefined events
        this._$target.on('keydown.shortcuts', function (event) {
            keyCode = event.keyCode.toString();

            console.log(ch[codeMap[keyCode]], codeMap[keyCode], keyCode);
            if(codeMap[keyCode] !== undefined) {
                // Trigger custom event with original event as second parameter

                that._$target.trigger(codeMap[keyCode], event);
            }

        });

        // sacar y pasar un objeto
        // event emitter guarda con ch-nombre de evento
        //
        for (event in this._options.events) {
            this._$target.on(ch[event] + '.shortcuts', this._options.events[event]);
        }

    };

    Shortcuts.prototype.off = function () {
        var event;

        // stop to emits predefined events
        this._$target.off('keydown.shortcuts');

        for (event in this._options.events) {
            this._$target.off(ch[event], this._options.events[event]);
        }

    };

    ch.Shortcuts = Shortcuts;

}(this, (this.jQuery || this.Zepto), this.ch));