/**
* ch is the namespace for Chico Mobile.
* @namespace ch
* @name ch
* @static
*/
var ch = {

	/**
	* Current version
	* @name version
	* @type number
	* @memberOf ch
	*/
	"VERSION": "1.0",

	/**
	* Here you will find a map of all component's instances created by Chico Mobile.
	* @name instances
	* @type object
	* @memberOf ch
	*/
	"instances": {},

	/**
	* Inherits from a Class borrowing a constructor
	* @name inherits
	* @function
	* @returns {object}
	* @memberOf ch
	*/
	"inherit": function (Parent, child) {
		if (Parent !== undefined) {
			Parent.call(child, child.conf);
			return clone(child);
		}

		throw("Chico Mobile - ch.inherit: Parent is not defined.");
	},

	/**
	* Use a spesific class or collecton of classes
	* @name use
	* @function
	* @param {object} [use] Object that will be used into another object.
	* @param {object} [who] The object that will be used as context.
	* @returns {object}
	* @memberOf ch
	* @exampleDescription 
	* @example
	* ch.use(foobar, context);
	* @exampleDescription 
	* @example
	* ch.use([foo, bar], context);
	*/
	"use": function (use, who) {
		use = (isArray(use) ? use : [use]);

		$.each(use, function (i, klass) {
			if (klass !== undefined) {
				klass.call(who);
			} else {
				throw new Error("Chico Mobile - ch.use: " + klass + " is not defined.");
			}
		});

		return who;
	},

	/**
	* Core constructor function.
	* @name init
	* @function
	* @memberOf ch
	*/
	"init": function () {
		// Iphone scale fix
		ch.scaleFix();
		// Hide navigation url bar
		ch.hideUrlBarOnLoad();
		// Prevent zoom onfocus
		ch.preventZoom();
		// Fix the broken iPad/iPhone form label click issue
		fixLabels();
		// Remove no-js classname
		$html.removeClass("no-js");
	},

	/**
	* Available device's features
	* @name Support
	* @class Support
	* @returns {Object}
	* @memberOf ch 
	*/
	"SUPPORT": (function () {

	}())

};


/*
 * MBP - Mobile boilerplate helper functions
 */
(function () {

	var MBP = exports.MBP || {};

	// Fix for iPhone viewport scale bug 
	// http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
	MBP.viewportmeta = $('meta[name="viewport"]');
	MBP.ua = browser.userAgent || navigator.userAgent;

	MBP.gestureStart = function () {
		MBP.viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
	};

	MBP.scaleFix = function () {
		if (MBP.viewportmeta && /iPhone|iPad|iPod/.test(MBP.ua) && !/Opera Mini/.test(MBP.ua)) {
			MBP.viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
			doc.addEventListener("gesturestart", MBP.gestureStart, false);
		}
	};

	/*
	* Normalized hide address bar for iOS & Android
	* (c) Scott Jehl, scottjehl.com
	* MIT License
	*/
	// If we cache this we don't need to re-calibrate everytime we call
	// the hide url bar
	MBP.BODY_SCROLL_TOP = false;

	// So we don't redefine this function everytime we
	// we call hideUrlBar
	MBP.getScrollTop = function () {
		return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
	};

	// It should be up to the mobile
	MBP.hideUrlBar = function () {
		// if there is a hash, or MBP.BODY_SCROLL_TOP hasn't been set yet, wait till that happens
		if( !win.location.hash && MBP.BODY_SCROLL_TOP !== false){
			win.scrollTo( 0, MBP.BODY_SCROLL_TOP === 1 ? 0 : 1 );
		}
	};

	MBP.hideUrlBarOnLoad = function () {
		// If there's a hash, or addEventListener is undefined, stop here
		if( !win.location.hash && win.addEventListener ) {

			//scroll to 1
			win.scrollTo(0, 1);
			MBP.BODY_SCROLL_TOP = 1;

			//reset to 0 on bodyready, if needed
			var bodycheck = setInterval(function () {
				if(body) {
					clearInterval(bodycheck);
					MBP.BODY_SCROLL_TOP = MBP.getScrollTop();
					MBP.hideUrlBar();
				}
			}, 15 );

			win.addEventListener("load", function() {
				setTimeout(function () {
					//at load, if user hasn't scrolled more than 20 or so...
					if(MBP.getScrollTop() < 20) {
						//reset to hide addr bar at onload
						MBP.hideUrlBar();
					}
				}, 0);
			});
		}
	};

	// Prevent iOS from zooming onfocus
	// https://github.com/h5bp/mobile-boilerplate/pull/108
	MBP.preventZoom = function () {
		var formFields = $('input, select, textarea'),
			contentString = 'width=device-width,initial-scale=1,maximum-scale=',
			i = 0;
		for (; i < formFields.length; i += 1) {

			formFields[i].onfocus = function() {
				MBP.viewportmeta.content = contentString + '1';
			};

			formFields[i].onblur = function () {
				MBP.viewportmeta.content = contentString + '10';
			};
		}
	};

	extend(MBP, ch);
}());