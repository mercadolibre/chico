/**
* Viewport is a reference to position and size of the visible area of browser.
* @name Viewport
* @class Viewport
* @standalone
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
	* Element representing the visible area.
	* @public
	* @name ch.Viewport#element
	* @type Object
	*/
	"element": ch.utils.window,

	/**
	* Updates width and height of the visible area and updates ch.viewport.width and ch.viewport.height
	* @public
	* @function
	* @name ch.Viewport#getSize
	* @returns Object
	*/
	"getSize": function () {

		return {
			"width": this.width = ch.utils.window.width(),
			"height": this.height = ch.utils.window.height()
		};

	},

	/**
	* Updates left, top, right and bottom coordinates of the visible area, relative to the window.
	* @public
	* @function
	* @name ch.Viewport#getPosition
	* @returns Object
	*/
	"getPosition": function () {

		var size = this.getSize();

		return {
			"left": 0,
			"top": 0,
			"right": size.width,
			"bottom": size.height,
			// Size is for use as context on Positioner
			// (see getCoordinates method on Positioner)
			"width": size.width,
			"height": size.height
		};
		
	},
	
	/**
	* Updates left, top, right and bottom coordinates of the visible area, relative to the document.
	* @public
	* @function
	* @name ch.Viewport#getOffset
	* @returns Object
	*/
	"getOffset": function () {

		var position = this.getPosition(),
			scrollLeft = ch.utils.window.scrollLeft(),
			scrollTop = ch.utils.window.scrollTop();

		return {
			"left": this.left = scrollLeft,
			"top": this.top = scrollTop,
			"right": this.right = scrollLeft + position.right,
			"bottom": this.bottom = scrollTop + position.bottom
		};
		
	}
};