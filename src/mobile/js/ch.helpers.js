/**
 * Chico Mobile global events reference.
 * @private
 * @constant
 * @name Event
 */
EVENT.TAP = (('ontouchend' in window) ? 'touchend' : 'click');
EVENT.PATH_CHANGE = (('onpopstate' in window) ? 'popstate' : 'hashchange');

/**
* Private reference to the index page
* @privated
* @name ch.Modal#$mainView
* @type Zepto Object
*/
util.$mainView = (function () {
	var $view = $('div[data-page=index]');

	if ($view.length === 0) {
		alert('Chico Mobile Error\n$mainView: The document doesn\'t contain an index "page" view.');
		throw new Error('Chico Mobile Error\n$mainView: The document doesn\'t contain an index "page" view.');
	}

	return $view;
}());

/**
* Fixes the broken iPad/iPhone form label click issue.
* @private
* @function
* @name fixLabels
* @see Based on: http://www.quirksmode.org/dom/getstyles.html
*/
util.fixLabels = function () {
	var labels = document.getElementsByTagName('label'),
		target_id,
		el,
		i = 0;

	function labelClick() {
		el = document.getElementById(this.getAttribute('for'));
		if (['radio', 'checkbox'].indexOf(el.getAttribute('type')) != -1) {
			el.setAttribute('selected', !el.getAttribute('selected'));
		} else {
			el.focus();
		}
	}

	for (; labels[i]; i += 1) {
		if (labels[i].getAttribute('for')) {
			$(labels[i]).bind(EVENT.TAP, labelClick);
		}
	}
};

/*
 * MBP - Mobile boilerplate helper functions
 */
util.MBP = {};

// Fix for iPhone viewport scale bug
// http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
util.MBP.viewportmeta = $('meta[name=viewport]');

util.MBP.gestureStart = function () {
	util.MBP.viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
};

util.MBP.scaleFix = function () {
	if (util.MBP.viewportmeta && /iPhone|iPad|iPod/.test(userAgent) && !/Opera Mini/.test(userAgent)) {
		util.MBP.viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
		document.addEventListener('gesturestart', util.MBP.gestureStart, false);
	}
};

/*
* Normalized hide address bar for iOS & Android
* (c) Scott Jehl, scottjehl.com
* MIT License
*/
// If we cache this we don't need to re-calibrate everytime we call
// the hide url bar
util.MBP.BODY_SCROLL_TOP = false;

// So we don't redefine this function everytime we
// we call hideUrlBar
util.MBP.getScrollTop = function () {
	return window.pageYOffset || document.compatMode === 'CSS1Compat' && document.documentElement.scrollTop || document.body.scrollTop || 0;
};

// It should be up to the mobile
util.MBP.hideUrlBar = function () {
	// if there is a hash, or MBP.BODY_SCROLL_TOP hasn't been set yet, wait till that happens
	if (!window.location.hash && util.MBP.BODY_SCROLL_TOP !== false) {
		window.scrollTo( 0, util.MBP.BODY_SCROLL_TOP === 1 ? 0 : 1 );
	}
};

util.MBP.hideUrlBarOnLoad = function () {
	// If there's a hash, or addEventListener is undefined, stop here
	if( !window.location.hash && window.addEventListener ) {

		//scroll to 1
		window.scrollTo(0, 1);
		util.MBP.BODY_SCROLL_TOP = 1;

		//reset to 0 on bodyready, if needed
		var bodycheck = setInterval(function () {
			if(body) {
				clearInterval(bodycheck);
				util.MBP.BODY_SCROLL_TOP = util.MBP.getScrollTop();
				util.MBP.hideUrlBar();
			}
		}, 15 );

		window.addEventListener('load', function() {
			setTimeout(function () {
				//at load, if user hasn't scrolled more than 20 or so...
				if(util.MBP.getScrollTop() < 20) {
					//reset to hide addr bar at onload
					util.MBP.hideUrlBar();
				}
			}, 0);
		});
	}
};

// Prevent iOS from zooming onfocus
// https://github.com/h5bp/mobile-boilerplate/pull/108
util.MBP.preventZoom = function () {
	var formFields = $('input, select, textarea'),
		contentString = 'width=device-width,initial-scale=1,maximum-scale=',
		i = 0;
	for (; i < formFields.length; i += 1) {

		formFields[i].onfocus = function() {
			util.MBP.viewportmeta.content = contentString + '1';
		};

		formFields[i].onblur = function () {
			util.MBP.viewportmeta.content = contentString + '10';
		};
	}
};