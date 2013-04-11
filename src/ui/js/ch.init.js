/**
 * Core constructor function.
 * @private
 */
(function init() {
	// unmark the no-js flag on html tag
	$html.removeClass('no-js');

    ch.instances = instances;

    ch.$ = window.jQuery || window.$;
}());