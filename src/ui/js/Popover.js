(function (window, ch) {
    'use strict';

    var document = window.document;

    ch.Popover.prototype._hidingShortcuts = function () {

        var that = this,
            pointertap = ch.onpointertap;

        function hide(event) {
            // event.button === 0: Fix issue #933 Right click closes it on Firefox.
            if (event.target !== that._el && event.target !== that.container && event.button === 0) {
                that.hide();
            }
        }

        ch.shortcuts.add(ch.onkeyesc, this.uid, function () {
            that.hide();
        });

        this
            .on('show', function () {
                ch.shortcuts.on(that.uid);
                ch.util.Event.addListener(document, pointertap, hide);
            })
            .on('hide', function () {
                ch.shortcuts.off(that.uid);
                ch.util.Event.removeListener(document, pointertap, hide);
            })
            .once('destroy', function () {
                ch.shortcuts.remove(that.uid, ch.onkeyesc);
            });
    };

}(this, this.ch));