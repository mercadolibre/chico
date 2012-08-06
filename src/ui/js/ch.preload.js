/**
* Preload lets you load images on browser's memory. An array of sources will iterate and preload each one, a single source will do the same thing.
* @name Preload
* @class Preload
* @standalone
* @memberOf ch
* @param {array} [arr] Collection of image sources
* @param {string} [str] A single image source
* @exampleDescription
* @example
* ch.preload(["img1.jpg","img2.jpg","img3.png"]);
* @exampleDescription
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