(function (window, ch) {
    'use strict';

    var document = window.document;

    ch.Popover.prototype._hidingShortcuts = function () {

        var that = this;

        function hide(event) {
            // event.button === 0: Fix issue #933 Right click closes it on Firefox.
            if (event.target !== that._el && event.target !== that.container && event.button === 0) {
                that.hide();
            }
        }

        ch.shortcuts.add(ch.onkeyesc, this.uid, function () {
            that.hide();
        });

        this
            .on('show', function () {
                ch.shortcuts.on(that.uid);
                tiny.on(document, ch.onpointertap, hide);
            })
            .on('hide', function () {
                ch.shortcuts.off(that.uid);
                tiny.off(document, ch.onpointertap, hide);
            })
            .once('destroy', function () {
                ch.shortcuts.remove(that.uid, ch.onkeyesc);
            });
    };

}(this, this.ch));
