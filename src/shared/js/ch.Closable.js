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

        function close(event) {
            ch.util.prevent(event);
            that.hide();
        }

        function closeTimer() {
            timeOut = setTimeout(close, 400);
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

                events[pointerLeave] = closeTimer;

                that.$trigger.on(events);
                that.$container.on(events);

                return;
            }

            // Closable button-only
            if (hiddenby === 'button-only' || hiddenby === 'all') {
                // Append a close button
                $('<a class="ch-close" role="button" aria-label="Close"></a>').on(pointerTap, close).prependTo(that.$container);
            }

            // Closable keys-only
            if (hiddenby === 'pointers-only' || hiddenby === 'all') {

                ch.shortcuts.add(ch.onkeyesc, that.uid, function() { that.hide(); });

                that.on('show', function () {
                    ch.shortcuts.on(that.uid);
                    $document.one(pointerTap, close);
                })
                .on('hide', function () {
                    ch.shortcuts.off(that.uid);
                    $document.off(pointerTap, close);
                })
                // Avoid to close when user clicks into the component
                .$container.on(pointerTap, function (event) {
                    event.stopPropagation();
                });
            }
        };
    }

    ch.Closable = Closable;

}(this, this.ch.$, this.ch));
