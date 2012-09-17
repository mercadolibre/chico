/**
 * Core constructor function.
 * @private
 */
(function init() {
	// unmark the no-js flag on html tag
	$html.removeClass('no-js');

	// TODO: This should be on keyboard controller.
	$document.bind('keydown', function(event){ ch.keyboard(event); });
}());