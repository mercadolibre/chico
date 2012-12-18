(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	var $document = $(document);

	function Closable() {
		var that = this,
			events = 'click.' + that.name + ' ' + ch.events.key.ESC + '.' + that.name;

		that.closable = function () {
			if (!that.options.closable) {
				return;
			}

			// Closable On
			if (that.options.closable && ch.util.hasOwn(that.options, 'event') && that.options.event === 'click') {
				// Append close buttons
				// It will close with close button
				that.$container
					.prepend('<a class="ch-close" role="button"></a>')
					.on('click.' + that.name, function (event) {
						if ($(event.target || event.srcElement).hasClass('ch-close')) {
							ch.util.prevent(event);
							that.hide();
						}
					});
			}

			// It will close only with close button
			if (that.options.closable === 'button') {
				return;
			}

			// Default Closable behavior
			// It will close with click on document, too
			that.on('show.' + that.name, function () {
				$document
					.off(events)
					.one(events, function () {
						that.hide();
					});
			});

			// Stop event propatation, if click container.
			that.$container.on('click.' + that.name, function (event) {
				event.stopPropagation();
			});
		}
	}

	ch.Closable = Closable;

}(this, (this.jQuery || this.Zepto), this.ch));