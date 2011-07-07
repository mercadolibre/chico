/** 
 * UI feedback utility, creates a visual highlight
 * changing background color from yellow to white.
 * @function
 * @name blink
 * @param {Selector} selector CSS Selector to blink a collection
 * @param {Number} [time] Amount of time to blink
 * @returns {jQuery Object}
 * @memberOf ch
 */
ch.blink = function (conf) {

	var that = this,
		// Hex start level toString(16).
		level = 1, 
		// Time, 200 miliseconds by default.
		t = conf.value || 200,
		// Inner highlighter.
		highlight = function (e) {
			// Let know everyone we are active.
			that.$element.addClass("ch-active");
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
					that.$element.removeClass("ch-active");
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