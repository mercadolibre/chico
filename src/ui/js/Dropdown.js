(function ($, ch) {
    'use strict';

    ch.Dropdown.prototype._navigationShortcuts = function () {

        var that = this;

        ch.shortcuts.add(ch.onkeyuparrow, this.uid, function (event) { that._select(event); });
        ch.shortcuts.add(ch.onkeydownarrow, this.uid, function (event) { that._select(event); });

        this.once('destroy', function () {
            ch.shortcuts.remove(ch.onkeyuparrow, that.uid);
            ch.shortcuts.remove(ch.onkeydownarrow, that.uid);
        });
    };

}(this.ch.$, this.ch));