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
*     .on(ch.events.key.RIGHT_ARROW, function () { carousel.next() })
*     .on(ch.events.key.LEFT_ARROW, function () { carousel.prev() });
*/
(function (window, $, ch) {

    /**
     * Map with references to key codes.
     * @private
     * @name ch.Keyboard#codeMap
     * @type object
     */
    var codeMap = {
         '8': 'BACKSPACE',
         '9': 'TAB',
        '13': 'ENTER',
        '27': 'ESC',
        '37': 'LEFT_ARROW',
        '38': 'UP_ARROW',
        '39': 'RIGHT_ARROW',
        '40': 'DOWN_ARROW'
    };

    /**
     * Keyboard event controller utility to know wich keys are begin.
     * @name Keyboard
     * @class Keyboard
     * @memberOf ch
     * @param event
     */

    function Shortcuts(options) {

        if (options === undefined) {
            throw new window.Error('ch.Shortcuts: Expected options defined.');
        }

        // Creates its private options
        this._options = ch.util.clone(this._defaults);

        this.configure(options);

    }

    Shortcuts.prototype.name = 'shortcuts';

    Shortcuts.prototype.constructor = Shortcuts;

    Shortcuts.prototype._defaults = {
        'activate': 'focus.shortcuts',
        'deactivate': 'blur.shortcuts',
        'tabindex': 0
    };

    Shortcuts.prototype.configure = function (options) {
        var that = this;

        // Merge user options with its options
        $.extend(this._options, options);

        this._$target = this._options.target;

        if (this._$target.attr('tabindex') === undefined) {
            this._$target.attr('tabindex', this._options.tabindex);
        }

        // default behavior to activate the feature
        if (this._options.activate !== 'none') {
            this._$target.on(this._options.activate, function () { that.on(); });
        }

        // default behavior to deactivate the feature
        if (this._options.deactivate !== 'none') {
            this._$target.on(this._options.deactivate, function () { that.off(); });
        }

    };

    Shortcuts.prototype.on = function () {
        var that = this,
            keyCode;

        // start to emits predefined events
        this._$target.on('keydown.shortcuts', function (event) {
            keyCode = event.keyCode.toString();

            if(codeMap[keyCode] !== undefined) {
                // Trigger custom event with original event as second parameter
                that._$target.trigger(ch.events.key[codeMap[keyCode]], event);
            }

        });

    };

    Shortcuts.prototype.off = function () {

        // stop to emits predefined events
        this._$target.off('keydown.shortcuts');

    };

    ch.Shortcuts = Shortcuts;

}(this, (this.jQuery || this.Zepto), this.ch));