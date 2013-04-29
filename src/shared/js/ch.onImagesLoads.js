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
(function (window, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    function onImagesLoads($el, callback) {

        $el
            .one('load', function () {
                var len = $el.length;

                window.setTimeout(function () {
                    if (--len <= 0) { callback.call($el); }
                }, 200);
            })
            .each(function () {
                // Cached images don't fire load sometimes, so we reset src.
                if (this.complete || this.complete === undefined) {
                    var src = this.src;
                    // Data uri fix bug in web-kit browsers
                    this.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
                    this.src = src;
                }
            });
    }

    ch.onImagesLoads = onImagesLoads;

}(this, this.ch));