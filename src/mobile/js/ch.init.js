/**
* Core constructor function.
* @private
* @function
* @name init
*/
(function init() {
	// Remove no-js classname
	$html.removeClass('no-js');
	// Iphone scale fix
	MBP.scaleFix();
	// Hide navigation url bar
	MBP.hideUrlBarOnLoad();
	// Prevent zoom onfocus
	MBP.preventZoom();
	// Fix the broken iPad/iPhone form label click issue
	fixLabels();
}());