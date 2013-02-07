/**
 * OnImagesLoads executes a callback function when the images of a query selection loads.
 * @name onImagesLoads
 * @class onImagesLoads
 * @memberOf ch
 * @param callback function The function that the component will fire after the images load.
 * @returns jQuery
 * @factorized
 * @exampleDescription
 * @example
 * $("img").onImagesLoads(callback);
 */
(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function OnImagesLoads($el, conf) {

		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @name ch.onImagesLoads#that
		 * @type object
		 */
		var that = this;
		that.$element = $el;
		that.element = $el[0];
		that.type = 'onImagesLoads';
		conf = conf || {};

		conf = ch.util.clone(conf);
		that.conf = conf;

		that.$element
			// On load event
			.one("load", function () {
				window.setTimeout(function () {
					if (--that.$element.length <= 0) {
						that.conf.fn.call(that.$element, this);
					}
				}, 200);
			})
			// For each image
			.each(function () {
				// Cached images don't fire load sometimes, so we reset src.
				if (this.complete || this.complete === undefined) {
					var src = this.src;

					// Data uri fix bug in web-kit browsers
					this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
					this.src = src;
				}
			});

		return that;
	}

	OnImagesLoads.prototype.name = 'onImagesLoads';
	OnImagesLoads.prototype.constructor = OnImagesLoads;

	ch.factory(OnImagesLoads);

}(this, this.jQuery, this.ch));