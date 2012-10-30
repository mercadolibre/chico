(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	/**
	 * Blink lets you give visual feedback to the user. Blink can be used when the user performs some action that changes some data at the screen. Blink creates a visual highlight changing background color from yellow to white.
	 * @memberOf ch
	 * @name blink
	 * @function
	 * @param {Object} options Configuration object.
	 * @param {number} [options.time] Amount of time to blink in milliseconds.
	 * @exampleDescription Blinks a element.
	 * @example
	 * $('.example').blink();
	 * @returns {Object}
	 */
	function blink($el, options) {

		options = options || {};

		var that = {},
			// Hex start level toString(16).
			level = 1,
			// Time, 200 miliseconds by default.
			t = options.time || 200;

		that.$element = $el;
		that.element = $el[0];

		// Inner highlighter.
		function highlight () {
			// Let know everyone we are active.
			that.$element.addClass('ch-blink').attr('role','alert').attr('aria-live','polite');

			// Begin steps.
			window.setTimeout(step, t);
		};

		// Color iteration.
		function step () {
			// New hex level.
			var h = level.toString(16);
			// Change background-color, redraw().
			that.element.style.backgroundColor = '#FFFF' + h + h;
			// Itearate for all hex levels.
			if (level < 15) {
				// Increment hex level.
				level += 1;
				// Inner recursion.
				window.setTimeout(step, t);
			} else {
				// Stop right there...
				that.$element.removeClass('ch-blink').attr('aria-live', 'off').removeAttr('role');
			}
		};

		// Start a blink if the element isn't active.
		if (!that.$element.hasClass('ch-blink')) {
			highlight();
		}

		// Return the element so keep chaining things.
		return that.$element;
	}

	$.fn.blink = function (options) {
		$.each(this, function (i, el) {
			blink($(el), options);
		});
		return this;
	};

	ch.blink = blink;

}(this, this.jQuery, this.ch));