(function () {

	$.extend(ch.events, {
		/**
		 *
		 * @name PATH_CHANGE
		 * @constant
		 * @memberOf ch.events
		 * @type {String}
		 */
		'PATH_CHANGE': (('onpopstate' in window) ? 'popstate' : 'hashchange')

	});

}());