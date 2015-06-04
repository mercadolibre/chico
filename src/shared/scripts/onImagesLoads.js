(function (window, ch) {
    'use strict';

    /**
     * Executes a callback function when the images of a query selection loads.
     * @memberof! ch
     * @param {HTMLImageElement} image An image or a collection of images.
     * @param {Function} [callback] The handler the component will fire after the images loads.
     * @example
     * new ch.onImagesLoads(HTMLImageElement, function () {
     *     console.log('The size of the loaded image is ' + this.width);
     * });
     */
    function onImagesLoads(image, callback) {
        var images;

        if (ch.util.isArray(image)) {
            images = image;
        } else {
            images = [image];
        }

        images.forEach(function (image, i) {

            ch.Event.addListenerOne(image, 'load', function () {
                var len = images.length;

                window.setTimeout(function () {
                    if (--len <= 0) { callback.call(image); }
                }, 200);
            }, false);

            if (image.complete || image.complete === undefined) {
                var src = image.src;
                // Data uri fix bug in web-kit browsers
                image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
                image.src = src;
            }

        });

    }

    ch.onImagesLoads = onImagesLoads;

}(this, this.ch));