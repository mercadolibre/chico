/**
 * Execute callback when images of a query selection loads
 * @abstract
 * @name onImagesLoads
 * @class onImagesLoads
 * @memberOf ch
 * @param {Array of images}
 * @returns {jQuery Object}
 * @example
 * $("img").onImagesLoads(function(){ ... });
 */

ch.onImagesLoads = function(conf){

	/**
	 * Reference to a internal component instance, saves all the information and configuration properties.
	 * @private
	 * @name that
	 * @type {Object}
	 * @memberOf ch.onImagesLoads
	 */
	var that = this;
	conf = ch.clon(conf);
	that.conf = conf;
	
	that.$element
		// On load event
		.bind("load", function(){
			setTimeout(function(){
				if (--that.$element.length <= 0) {
					that.conf.lambda.call(that.$element, this);
				};
			}, 200);
		})
		// For each image
		.each(function(){
			// Cached images don't fire load sometimes, so we reset src.
			if (this.complete || this.complete === undefined) {
				var src = this.src;
				
				// Data uri fix bug in web-kit browsers
				this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
				this.src = src;
			};
		});
	
	return that;
};

ch.factory({ component: "onImagesLoads" });