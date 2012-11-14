(function () {

	$.extend(ch.util, {

		/**
		 * Reference to the index page
		 * @name $mainView
		 * @memberOf ch.util
		 * @type {Selector}
		 */
		'$mainView': (function () {
			var $view = $('div[data-page=index]');

			if ($view.length === 0) {
				alert('Chico Mobile Error\n$mainView: The document doesn\'t contain an index "page" view.');
				throw new Error('Chico Mobile Error\n$mainView: The document doesn\'t contain an index "page" view.');
			}

			return $view;
		}()),

		/**
		 * Fixes the broken iPad/iPhone form label click issue.
		 * @name fixLabels
		 * @methodOf ch.util
		 * @see Based on: <a href="http://www.quirksmode.org/dom/getstyles.html" target="_blank">http://www.quirksmode.org/dom/getstyles.html</a>
		 */
		'fixLabels': function () {
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
					$(labels[i]).bind(ch.events.TAP, labelClick);
				}
			}
		},

		/*!
		 * MBP - Mobile boilerplate helper functions
		 * @name MBP
		 * @memberOf ch.util
		 * @namespace
		 * @see View on <a href="https://github.com/h5bp/mobile-boilerplate" target="_blank">https://github.com/h5bp/mobile-boilerplate</a>
		 */
		'MBP': {

			// Fix for iPhone viewport scale bug
			// http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
			'viewportmeta': $('meta[name=viewport]'),

			'gestureStart': function () {
				ch.util.MBP.viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
			},

			'scaleFix': function () {
				if (ch.util.MBP.viewportmeta && /iPhone|iPad|iPod/.test(userAgent) && !/Opera Mini/.test(userAgent)) {
					ch.util.MBP.viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
					document.addEventListener('gesturestart', ch.util.MBP.gestureStart, false);
				}
			},

			/*
			* Normalized hide address bar for iOS & Android
			* (c) Scott Jehl, scottjehl.com
			* MIT License
			*/
			// If we cache this we don't need to re-calibrate everytime we call
			// the hide url bar
			'BODY_SCROLL_TOP': false,

			// So we don't redefine this function everytime we
			// we call hideUrlBar
			'getScrollTop': function () {
				return window.pageYOffset || document.compatMode === 'CSS1Compat' && document.documentElement.scrollTop || document.body.scrollTop || 0;
			},

			// It should be up to the mobile
			'hideUrlBar': function () {
				// if there is a hash, or MBP.BODY_SCROLL_TOP hasn't been set yet, wait till that happens
				if (!window.location.hash && ch.util.MBP.BODY_SCROLL_TOP !== false) {
					window.scrollTo( 0, ch.util.MBP.BODY_SCROLL_TOP === 1 ? 0 : 1 );
				}
			},

			'hideUrlBarOnLoad': function () {
				// If there's a hash, or addEventListener is undefined, stop here
				if( !window.location.hash && window.addEventListener ) {

					//scroll to 1
					window.scrollTo(0, 1);
					ch.util.MBP.BODY_SCROLL_TOP = 1;

					//reset to 0 on bodyready, if needed
					var bodycheck = setInterval(function () {
						if(body) {
							clearInterval(bodycheck);
							ch.util.MBP.BODY_SCROLL_TOP = ch.util.MBP.getScrollTop();
							ch.util.MBP.hideUrlBar();
						}
					}, 15 );

					window.addEventListener('load', function() {
						setTimeout(function () {
							//at load, if user hasn't scrolled more than 20 or so...
							if(ch.util.MBP.getScrollTop() < 20) {
								//reset to hide addr bar at onload
								ch.util.MBP.hideUrlBar();
							}
						}, 0);
					});
				}
			},

			// Prevent iOS from zooming onfocus
			// https://github.com/h5bp/mobile-boilerplate/pull/108
			'preventZoom': function () {
				var formFields = $('input, select, textarea'),
					contentString = 'width=device-width,initial-scale=1,maximum-scale=',
					i = 0;
				for (; i < formFields.length; i += 1) {

					formFields[i].onfocus = function() {
						ch.util.MBP.viewportmeta.content = contentString + '1';
					};

					formFields[i].onblur = function () {
						ch.util.MBP.viewportmeta.content = contentString + '10';
					};
				}
			}
		}

	});

}());