/**
* Returns a data object with features supported by the device
* @name Support
* @class Support
* @returns {object}
* @memberOf ch
*/
(function () {

	var support = {
		/**
		 * Verify that CSS Transitions are supported (or any of its browser-specific implementations).
		 * @basedOn http://gist.github.com/373874
		 * @public
		 * @name transition
		 * @type Boolean
		 * @memberOf ch.Support#self
		 */
		'transition': body.style.WebkitTransition !== undefined || body.style.MozTransition !== undefined || body.style.MSTransition !== undefined || body.style.OTransition !== undefined || body.style.transition !== undefined,

		/**
		 * Boolean property that indicates if CSS "Fixed" positioning are supported by the device.
		 * @basedOn http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED
		 * @public
		 * @name fixed
		 * @type Boolean
		 * @memberOf ch.Support#self
		 */
		'fixed': (function () {

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
		}())
	};

	exports.support = support;
}());