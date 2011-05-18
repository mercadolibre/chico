
/**
 * Pre-load is an utility to preload images on browser's memory. An array of sources will iterate and preload each one, a single source will do the same thing.
 * @name Preload
 * @class Preload
 * @memberOf ch
 * @param {Array} [arr] Collection of image sources
 * @param {String} [str] A single image source
 * @example
 * ch.preload(["img1.jpg","img2.jpg","img3.png"]);
 * @example
 * ch.preload("logo.jpg");
 */
ch.preload = function(arr) {

    if (typeof arr === "string") {
        arr = (arr.indexOf(",") > 0) ? arr.split(",") : [arr] ;
    }

    for (var i=0;i<arr.length;i++) {
                
        var o = document.createElement("object");
            o.data = arr[i]; // URL
            
        var h = document.getElementsByTagName("head")[0];
            h.appendChild(o);
            h.removeChild(o); 
    }       
};