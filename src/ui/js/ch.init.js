/**
* Core constructor function.
* @name init
* @methodOf ch
*/
(function () {
	// unmark the no-js flag on html tag
	$html.removeClass('no-js');

	// TODO: This should be on keyboard controller.
	$document.bind('keydown', function(event){ ch.keyboard(event); });
}());