/**
* Blink lets you give visual feedback to the user. Blink can be used when the user performs some action that changes some data at the screen. Blink creates a visual highlight changing background color from yellow to white.
* @name Blink
* @class Blink
* @memberOf ch
* @param {Object} conf Configuration object
* @param {number} [conf.time] Amount of time to blink in milliseconds
* @returns jQuery Object 
* @factorized
* @exampleDescription Blinks a element.  
* @example
* var widget = $(".example").blink();
*/
ch.blink = function (conf) {

	var that = this,
		// Hex start level toString(16).
		level = 1, 
		// Time, 200 miliseconds by default.
		t = conf.time || 200,
		// Inner highlighter.
		highlight = function (e) {
			// Let know everyone we are active.
			that.$element.addClass("ch-active").attr("role","alert").attr("aria-live","polite");
			// Color iteration.
			function step () {
				// New hex level.
				var h = level.toString(16);
				// Change background-color, redraw().
				e.style.backgroundColor = '#FFFF' + h + h;
				// Itearate for all hex levels.
				if (level < 15) {
					// Increment hex level.
					level += 1;
					// Inner recursion.
					setTimeout(step, t);
				} else {
					// Stop right there...
					that.$element.removeClass("ch-active").attr("aria-live","off").removeAttr("role");
				}
			};
		// Begin steps.
		setTimeout(step, t);
	}
	// Start a blink if the element isn't active.
	if (!that.$element.hasClass("ch-active")) {
		highlight(that.element);
	}
	// Return the element so keep chaining things.
	return that.$element;
}
ch.factory("blink");