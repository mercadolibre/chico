(function (window, $, ch) {
    'use strict';

    var $document = $(window.document);

    ch.Popover.prototype._hidingShortcuts = function () {

        var that = this,
            pointertap = ch.onpointertap + '.' + this.name;

        function hide(event) {
            // event.button === 0: Fix issue #933 Right click closes it on Firefox.
            if (event.target !== that._el && event.target !== that.$container[0] && event.button === 0) {
                that.hide();
            }
        }

        ch.shortcuts.add(ch.onkeyesc, this.uid, function () {
            that.hide();
        });

        this
            .on('show', function () {
                ch.shortcuts.on(that.uid);
                $document.on(pointertap, hide);
            })
            .on('hide', function () {
                ch.shortcuts.off(that.uid);
                $document.off(pointertap, hide);
            })
            .once('destroy', function () {
                ch.shortcuts.remove(that.uid, ch.onkeyesc);
            });
    };

}(this, this.ch.$, this.ch));