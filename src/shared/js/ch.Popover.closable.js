(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    var $document = $(window.document),
        keyEsc = ch.onkeyesc ? ch.onkeyesc : 'touchend';

     /**
      * Gives to widgets the ability to be closed.
      * @memberOf ch
      * @mixin
      * @returns {Function} Returns a private function.
      */
    function Closable() {

        var that = this,
            setTimeout = window.setTimeout,
            clearTimeout = window.clearTimeout,
            hiddenby = this._options.hiddenby,
            pointerTap = ch.onpointertap + '.' + this.name,
            pointerEnter = ch.onpointerenter + '.' + this.name,
            pointerLeave = ch.onpointerleave + '.' + this.name,
            escEvent = keyEsc + '.' + this.name,
            timeOut;

        function hide(event) {
            if (event.target !== that._el && event.target !== that.$container[0]) {
                that.hide();
            }
        }

        function hideTimer() {
            timeOut = setTimeout(function () {
                that.hide();
            }, that._options._hideDelay);
        }

        /**
         * Allows to manage the widgets content.
         * @param {String} content - Description.
         * @param {Object} [options] - Description.
         * @private
         */
        this._closable = function () {

            // Closable none
            if (hiddenby === 'none') { return; }

            // Closable by leaving the widget
            if (hiddenby === 'mouseleave' && that.$trigger !== undefined) {

                var events = {};

                events[pointerEnter] = function () {
                    clearTimeout(timeOut);
                };

                events[pointerLeave] = hideTimer;

                that.$trigger.on(events);
                that.$container.on(events);
            }

            // Closable button-only
            if (hiddenby === 'button-only' || hiddenby === 'all') {
                // Append a close button
                $('<i class="ch-close" role="button" aria-label="Close"></i>').on(pointerTap, function () {
                    that.hide();
                }).prependTo(that.$container);
            }

            if (hiddenby === 'pointers-only' || hiddenby === 'all') {
                ch.shortcuts.add(ch.onkeyesc, that.uid, function() { that.hide(); });
                that
                    .on('show', function () {
                        ch.shortcuts.on(that.uid);
                        $document.on(pointerTap, hide);
                    })
                    .on('hide', function () {
                        ch.shortcuts.off(that.uid);
                        $document.off(pointerTap, hide);
                    });
            }

        };
    }

    ch.Closable = Closable;

}(this, this.ch.$, this.ch));