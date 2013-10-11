(function (ch) {
    'use strict';

    /**
     * Adds shortcuts navigation.
     * @memberof! ch.Dropdown.prototype
     * @function
     * @private
     * @returns {dropdown}
     */
    ch.Dropdown.prototype._navigationShortcuts = function () {

        var that = this;

        ch.shortcuts.add(ch.onkeyuparrow, this.uid, function (event) { that._select(event); });
        ch.shortcuts.add(ch.onkeydownarrow, this.uid, function (event) { that._select(event); });

        this.once('destroy', function () {
            ch.shortcuts.remove(ch.onkeyuparrow, that.uid);
            ch.shortcuts.remove(ch.onkeydownarrow, that.uid);
        });

        return this;
    };

}(this.ch));