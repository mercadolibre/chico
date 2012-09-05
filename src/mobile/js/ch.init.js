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
	util.MBP.scaleFix();
	// Hide navigation url bar
	util.MBP.hideUrlBarOnLoad();
	// Prevent zoom onfocus
	util.MBP.preventZoom();
	// Fix the broken iPad/iPhone form label click issue
	util.fixLabels();
}());