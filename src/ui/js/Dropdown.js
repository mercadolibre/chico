(function (ch) {
    'use strict';

    /**
     * Highlights the current option when navigates by keyboard.
     * @function
     * @private
     */
    ch.Dropdown.prototype._highlightOption = function (key) {

        var optionsLength = this._$navigation.length,
            lastSelection,
            currentSelection;

        if (!this._shown) { return; }

        // Sets limits behavior when up arrow
        if (key === ch.onkeyuparrow && this._selected === -1) { return; }

        if (this._selected === (key === ch.onkeydownarrow ? optionsLength - 1 : 0)) { return; }

        if (this._selected !== -1) {
            // Save this to send in the event emition
            lastSelection = this._selected;

            // Remove last option selected
            this._$navigation[this._selected].removeAttribute('id');
        }

        if (key === ch.onkeydownarrow) { this._selected += 1; } else { this._selected -= 1; }

        // Saves this to send in the event emition
        currentSelection = this._selected;

        this._$navigation[this._selected].setAttribute('id', 'ch-' + this.name + this.uid + '-selected');

        this.emit('highlight', currentSelection, lastSelection);

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
            ch.shortcuts.remove(that.uid, ch.onkeyuparrow);
            ch.shortcuts.remove(that.uid, ch.onkeydownarrow);
        });

        return this;
    };

    ch.Dropdown.prototype.initialize = function () {
        
        this.on('highlight', function(current, last) {

            if (last !== undefined) { this._$navigation[last].blur() };

            this._$navigation[current].focus();

        });
    }


}(this.ch));