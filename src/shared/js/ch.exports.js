(function () {

	/**
	 * Exposes all widget's instances into the ch.instances object.
	 * @exports exports.debug as ch.debug
	 * @returns {Object} ch
	 */
	exports.debug = function () {
		exports.instances = instances;
		return exports;
	}

	window.ch = exports;
}());