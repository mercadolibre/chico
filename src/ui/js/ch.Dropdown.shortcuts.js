(function ($, ch) {
    'use strict';

    ch.Dropdown.prototype._navigationShortcuts = function () {

        var that = this;

        this._$navigation = this.$trigger.next().find('a').prop('role', 'option');

        // Item selected by mouseover
        $.each(this._$navigation, function (i, e) {
            $(e).on('mouseenter.dropdown', function () {
                that._$navigation[that._selected = i].focus();
            });
        });

        ch.shortcuts.add(ch.onkeyuparrow, this.uid, function (event) { that._select(event); });
        ch.shortcuts.add(ch.onkeydownarrow, this.uid, function (event) { that._select(event); });
    };

}(this.ch.$, this.ch));