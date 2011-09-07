/**
* Viewport is a reference to position and size of the visible area of browser.
* @abstract
* @name Viewport
* @class Viewport
* @memberOf ch
*/
ch.viewport = {

	/**
	* Width of the visible area.
	* @public
	* @name ch.Viewport#width
	* @type Number
	*/
	"width": ch.utils.window.width(),

	/**
	* Height of the visible area.
	* @public
	* @name ch.Viewport#height
	* @type Number
	*/
	"height": ch.utils.window.height(),

	/**
	* Left offset of the visible area.
	* @public
	* @name ch.Viewport#left
	* @type Number
	*/
	"left": ch.utils.window.scrollLeft(),

	/**
	* Top offset of the visible area.
	* @public
	* @name ch.Viewport#top
	* @type Number
	*/
	"top": ch.utils.window.scrollTop(),

	/**
	* Right offset of the visible area.
	* @public
	* @name ch.Viewport#right
	* @type Number
	*/
	"right": ch.utils.window.scrollLeft() + ch.utils.window.width(),

	/**
	* Bottom offset of the visible area.
	* @public
	* @name ch.Viewport#bottom
	* @type Number
	*/
	"bottom": ch.utils.window.scrollTop() + ch.utils.window.height(),

	/**
	* Updates width and height of the visible area and updates ch.viewport.width and ch.viewport.height
	* @public
	* @function
	* @name ch.Viewport#getSize
	* @returns Size Object
	*/
	"getSize": function () {

		return {
			"width": this.width = ch.utils.window.width(),
			"height": this.height = ch.utils.window.height()
		};

	},

	/**
	* Updates left, top, right and bottom offset of the visible area and updates respective ch.viewport properties.
	* @public
	* @function
	* @name ch.Viewport#getOffset
	* @returns Offset Object
	*/
	"getOffset": function () {

		var size = this.getSize(),
			scrollLeft = ch.utils.window.scrollLeft(),
			scrollTop = ch.utils.window.scrollTop();

		return {
			"left": this.left = scrollLeft,
			"top": this.top = scrollTop,
			"right": this.right = scrollLeft + size.width,
			"bottom": this.bottom = scrollTop + size.height
		};
		
	}
};