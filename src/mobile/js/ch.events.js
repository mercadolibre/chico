(function () {

	$.extend(ch.events, {
		/**
		 *
		 * @name TAP
		 * @constant
		 * @memberOf ch.events
		 * @type {String}
		 */
		'TAP': (('ontouchend' in window) ? 'touchend' : 'click'),

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