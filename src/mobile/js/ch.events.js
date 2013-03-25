(function () {

	/**
	 *
	 * @name onpathchange
	 * @constant
	 * @memberOf ch
	 * @type {String}
	 */
	ch.onpathchange = (('onpopstate' in window) ? 'popstate' : 'hashchange')

}());