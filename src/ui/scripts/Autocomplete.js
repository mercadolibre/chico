(function (Autocomplete, ch) {
    'use strict';
    /**
     * Congfigure shortcuts to navigate and set values, or cancel the typed text
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._configureShortcuts = function () {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        // Shortcuts
        ch.shortcuts.add(ch.onkeyenter, this.uid, function (event) {
            event.preventDefault();
            that._selectSuggestion();
        });

        ch.shortcuts.add(ch.onkeyesc, this.uid, function () {
            that.hide();
            that._el.value = that._originalQuery;
        });

        ch.shortcuts.add(ch.onkeyuparrow, this.uid, function (event) {
            event.preventDefault();

            var value;

            // change the selected value & stores the future HTMLInputElement value
            if (that._highlighted === null) {

                that._highlighted = that._suggestionsQuantity - 1;
                value = that._suggestions[that._highlighted];

            } else if (that._highlighted <= 0) {

                this._prevHighlighted = this._currentHighlighted = null;
                value = that._currentQuery;

            } else {

                that._highlighted -= 1;
                value = that._suggestions[that._highlighted];

            }

            that._toogleHighlighted();

            if (!that._options.html) {
                that._el.value = value;
            }

        });

        ch.shortcuts.add(ch.onkeydownarrow, this.uid, function () {
            var value;

            // change the selected value & stores the future HTMLInputElement value
            if (that._highlighted === null) {

                that._highlighted = 0;

                value = that._suggestions[that._highlighted];

            } else if (that._highlighted >= that._suggestionsQuantity - 1) {

                that._highlighted = null;
                value = that._currentQuery;

            } else {

                that._highlighted += 1;
                value = that._suggestions[that._highlighted];

            }

            that._toogleHighlighted();

            if (!that._options.html) {
                that._el.value = value;
            }

        });

        // Activate the shortcuts for this instance
        this._popover.on('show', function () { ch.shortcuts.on(that.uid); });

        // Deactivate the shortcuts for this instance
        this._popover.on('hide', function () { ch.shortcuts.off(that.uid); });

        this.on('destroy', function () {
            ch.shortcuts.remove(this.uid);
        });

        return this;
    };

}(this.ch.Autocomplete, this.ch));
