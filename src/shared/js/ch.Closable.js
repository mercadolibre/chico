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

	var $document = $(document),
        pointerTap = ch.events.pointer.TAP,
        pointerLeave = ch.events.pointer.LEAVE,
        keyEsc = ch.events.key.ESC;

	function Closable() {

		var that = this,
            closableType = this._options.close,
            tapEvent = pointerTap + '.' + this.name,
            escEvent = keyEsc + '.' + this.name;

        function close(event) {
            ch.util.prevent(event);
            that.hide();
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
                //
                that.$el.on(pointerLeave, close);
                // Don't analize another case
                return;
            }

            /**
             * Closable button-only
             */
			if (closableType === 'button-only' || closableType === 'all' || closableType === true) {
				// Append a close button
				$('<a class="ch-close" role="button"></a>').on(tapEvent, close).prependTo(that.$container);
			}

            /**
             * Closable keys-only
             */
            if (closableType === 'pointers-only' || closableType === 'all' || closableType === true) {

                that.on('show', function () {
                    $document.one(tapEvent + ' ' + escEvent, close);
                });

                // Avoid to close when user clicks into the component
                that.$container.on(tapEvent, function (event) {
                    event.stopPropagation();
                });
            }
		}
	}

	ch.Closable = Closable;

}(this, (this.jQuery || this.Zepto), this.ch));