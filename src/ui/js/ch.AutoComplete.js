(function (window, AutoComplete, ch) {
    'use strict';
    /**
     * Congfigure shortcuts to navigate and set values, or cancel the typed text
     * @memberof! ch.AutoComplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    AutoComplete.prototype._configureShortcuts = function () {
        var that = this;

        // Shortcuts
        ch.shortcuts.add(ch.onkeybackspace, this.uid, function () {
            // hides and clear the list
            if (that._el.value.length <= 1) {
                that._$suggestionsList[0].innerHTML = '';
                that._popover.hide();
            }
        });

        ch.shortcuts.add(ch.onkeyenter, this.uid, function (event) {
            ch.util.prevent(event);
            that._setQuery();
        });

        ch.shortcuts.add(ch.onkeyesc, this.uid, function () {
            that.hide();
            that._el.value = that._originalQuery;
        });

        ch.shortcuts.add(ch.onkeyuparrow, this.uid, function () {
            var value;

            // change the selected value & stores the future HTMLInputElement value
            if (that._selected === null) {
                that._selected = that._suggestionsQuantity -1;
                value = that._suggestions[that._selected];
            } else if (that._selected <= 0) {
                that._selected = null;
                value = that._currentQuery;
            } else {
                that._selected -= 1;
                value = that._suggestions[that._selected];
            }

            that._toogleHighlighted();

            if (!that._options.html) {
                that._el.value = value;
            }
        });

        ch.shortcuts.add(ch.onkeydownarrow, this.uid, function () {
            var value;

            // change the selected value & stores the future HTMLInputElement value
            if (that._selected === null) {
                that._selected = 0;
                value = that._suggestions[that._selected];
            } else if (that._selected >= that._suggestionsQuantity - 1) {
                that._selected = null;
                value = that._currentQuery;
            } else {
                that._selected += 1;
                value = that._suggestions[that._selected];
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

}(this, this.ch.AutoComplete, this.ch));
