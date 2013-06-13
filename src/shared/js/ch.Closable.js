/**
 * The Closable class gives to widgets the ability to be closed.
 * @name Closable
 * @class Closable
 * @standalone
 * @memberOf ch
 */
(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    var $document = $(window.document),
        keyEsc = ch.onkeyesc ? ch.onkeyesc : 'touchend';

    function Closable() {

        var that = this,
            setTimeout = window.setTimeout,
            clearTimeout = window.clearTimeout,
            closableType = this._options.close,
            delay = this._options.closeDelay,
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
            timeOut = setTimeout(close, delay);
        }

        this._closable = function () {

            /**
             * Closable none
             */
            if (closableType === 'none' || !closableType) { return; }

            /**
             * Closable by leaving the widget
             */
            if (closableType === 'mouseleave' && that.$el !== undefined) {

                // this.$el.on(pointerLeave, close);

                var events = {};

                if (delay === 0) {

                    events[pointerLeave] = close;

                } else {
                    events[pointerEnter] = function () {
                        clearTimeout(timeOut);
                    };

                    events[pointerLeave] = closeTimer;

                    that.$container.on(events);
                }

                that.$el.on(events);

                return;
            }

            /**
             * Closable button-only
             */
            if (closableType === 'button-only' || closableType === 'all' || closableType === true) {
                // Append a close button
                $('<a class="ch-close" role="button" aria-label="Close"></a>').on(pointerTap, close).prependTo(that.$container);
            }

            /**
             * Closable keys-only
             */
            if (closableType === 'pointers-only' || closableType === 'all' || closableType === true) {

                ch.shortcuts.add(ch.onkeyesc, that.uid, function() {that.hide(); });

                that.on('show', function () {

                    ch.shortcuts.on(that.uid);

                    $document.one(pointerTap, close);

                });

                that.on('hide', function () { ch.shortcuts.off(that.uid); });

                // Avoid to close when user clicks into the component
                that.$container.on(pointerTap, function (event) {
                    event.stopPropagation();
                });

            }
        };
    }

    ch.Closable = Closable;

}(this, this.ch.$, this.ch));
