(function () {

	/**
	 * Exposes all widget's instances into the ch.instances object.
	 * @returns {Object} ch
	 */
	function debug () {
		ch.instances = instances;
		return ch;
	}

	ch.instances = instances;

	ch.debug = debug;
}());