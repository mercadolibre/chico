(function (ch) {
    'use strict';

    /**
     * Highlights the current option when navigates by keyboard.
     * @function
     * @private
     */
    ch.Dropdown.prototype._highlightOption = function (key) {

        var optionsLength = this._$navigation.length;

        if (!this._shown) { return; }

        // Sets limits behavior
        if (this._selected === (key === 'down_arrow' ? optionsLength - 1 : 0)) { return; }

        // Unselects current option
        if (this._selected !== -1) {
            this._$navigation[this._selected].blur();
            this._$navigation[this._selected].removeAttribute('id');
        }

        if (key === 'down_arrow') { this._selected += 1; } else { this._selected -= 1; }

        // Selects new current option
        this._$navigation[this._selected].focus();
        this._$navigation[this._selected].id = 'ch-dropdown' + this.uid + '-selected';
    };

    /**
     * Add handlers to manage the keyboard on Dropdown navigation.
     * @function
     * @private
     */
    ch.Dropdown.prototype._navigationShortcuts = function () {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        ch.shortcuts.add(ch.onkeyuparrow, this.uid, function (event) {
            // Prevent default behavior
            ch.util.prevent(event);

            that._highlightOption(event.type);
        });

        ch.shortcuts.add(ch.onkeydownarrow, this.uid, function (event) {
            // Prevent default behavior
            ch.util.prevent(event);

            that._highlightOption(event.type);
        });

        this.once('destroy', function () {
            ch.shortcuts.remove(ch.onkeyuparrow, that.uid);
            ch.shortcuts.remove(ch.onkeydownarrow, that.uid);
        });

        return this;
    };

}(this.ch));