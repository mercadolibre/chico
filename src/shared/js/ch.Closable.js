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
        keyEsc = ch.events.key.ESC;

	function Closable() {

		var that = this,
            tapEvent = pointerTap + '.' + this.name,
            escEvent = keyEsc + '.' + this.name;

        function close(event) {
            ch.util.prevent(event);
            that.hide();
        }

		that._closable = function () {

            /**
             * Closable none
             */
            if (!that._options.closable || that._options.closable === 'none') { return; }

            /**
             * Closable button-only
             */
			if (that._options.closable === 'button-only' || that._options.closable === 'all') {
				// Append a close button
				$('<a class="ch-close" role="button"></a>').on(tapEvent, close).prependTo(that.$container);
			}

            /**
             * Closable keys-only
             */
            if (that._options.closable === 'keys-only' || that._options.closable === 'all') {

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