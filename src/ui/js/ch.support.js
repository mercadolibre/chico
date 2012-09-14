(function () {
	/**
	 * Returns a data object with features supported by the device
	 * @name ch.support
	 * @namespace
	 */
	var support = {};

	/**
	 * Verify that CSS Transitions are supported (or any of its browser-specific implementations).
	 * @name transition
	 * @memberOf ch.support
	 * @type {Boolean}
	 * @see <a href="http://gist.github.com/373874" target="_blank">http://gist.github.com/373874</a>
	 */
	support.transition = body.style.WebkitTransition !== undefined || body.style.MozTransition !== undefined || body.style.MSTransition !== undefined || body.style.OTransition !== undefined || body.style.transition !== undefined;

	/**
	 * Boolean property that indicates if CSS "Fixed" positioning are supported by the device.
	 * @name fixed
	 * @memberOf ch.support
	 * @type {Boolean}
	 * @see <a href="http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED" target="_blank">http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED</a>
	 */
	support.fixed = (function () {

		// Flag to know if position is supported
		var isSupported = false,
		// Create an element to test
			el = document.createElement("div");

		// Set the position fixed
		el.style.position = "fixed";
		// Set a top
		el.style.top = "10px";

		// Add element to DOM
		body.appendChild(el);

		// Compare setted offset with "in DOM" offset of element
		isSupported = (el.offsetTop === 10);

		// Delete element from DOM
		body.removeChild(el);

		// Results
		return isSupported;
	}());

	exports.support = support;
}());