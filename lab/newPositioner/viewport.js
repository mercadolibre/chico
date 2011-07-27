/**
 * Viewport is a reference to positions and sizes of visible area into browser.
 * @abstract
 * @name Viewport
 * @class Viewport
 * @memberOf ch
 * @returns {Viewport Object}
 */
ch.viewport = (function () {
	
	// Object to be returned
	var self = {};
	
	/**
	 * Width of viewport.
	 * @public
	 * @name width
	 * @type {Number}
	 * @memberOf ch.Viewport
	 */
	self.width =
	
	/**
	 * Height of viewport.
	 * @public
	 * @name height
	 * @type {Number}
	 * @memberOf ch.Viewport
	 */
		self.height =
	
	/**
	 * Left offset of viewport.
	 * @public
	 * @name left
	 * @type {Number}
	 * @memberOf ch.Viewport
	 */
		self.left =
	
	/**
	 * Top offset of viewport.
	 * @public
	 * @name top
	 * @type {Number}
	 * @memberOf ch.Viewport
	 */
		self.top,
	
	/**
	 * right offset of viewport.
	 * @public
	 * @name right
	 * @type {Number}
	 * @memberOf ch.Viewport
	 */
		self.right =
	
	/**
	 * Bottom offset of viewport.
	 * @public
	 * @name bottom
	 * @type {Number}
	 * @memberOf ch.Viewport
	 */
		self.bottom = 0;
	
	// Main browsers
	if (typeof window.innerWidth !== "undefined") {
		
		/**
	     * Viewport HTML Element.
	     * @public
	     * @name element
	     * @type {HTMLElement}
	     * @memberOf ch.Viewport
	     */
		self.element = window;
		
		/**
	     * Re-calculates width and height of viewport and updates ch.viewport.width and ch.viewport.height.
	     * @public
	     * @function
	     * @name getSize
	     * @returns {Size Object}
	     * @memberOf ch.Viewport
	     */
		self.getSize = function () {
			return {
				width: ch.viewport.width = self.element.innerWidth,
				height: ch.viewport.height = self.element.innerHeight
			};
		};
		
		/**
	     * Re-calculates left and top of viewport and updates ch.viewport.left and ch.viewport.top.
	     * @public
	     * @function
	     * @name getOffset
	     * @returns {Offset Object}
	     * @memberOf ch.Viewport
	     */
		self.getOffset = function () {
			
			var size = self.getSize(),
				left = self.element.pageXOffset,
				top = self.element.pageYOffset;
			
			return {
				left: ch.viewport.left = left,
				top: ch.viewport.top = top,
				right: ch.viewport.right = left + size.width,
				bottom: ch.viewport.bottom = top + size.height
			};
		};
	
	// Fallback
	} else {
		
		/**
	     * Viewport HTML Element.
	     * @public
	     * @type {HTMLElement}
	     * @memberOf ch.Viewport
	     */
		self.element = document.documentElement;
		
		/**
	     * Re-calculates width and height of viewport and updates ch.viewport.width and ch.viewport.height.
	     * @public
	     * @function
	     * @returns {Size Object}
	     * @memberOf ch.Viewport
	     */
		self.getSize = function () {
			return {
				width: ch.viewport.width = self.element.clientWidth,
				height: ch.viewport.height = self.element.clientHeight
			};
		};
		
		/**
	     * Re-calculates left and top of viewport and updates ch.viewport.left and ch.viewport.top.
	     * @public
	     * @function
	     * @returns {Offset Object}
	     * @memberOf ch.Viewport
	     */
		self.getOffset = function () {
			
			var size = self.getSize(),
				left = self.element.scrollLeft,
				top = self.element.scrollTop;
			
			return {
				left: ch.viewport.left = left,
				top: ch.viewport.top = top,
				right: ch.viewport.right = left + size.width,
				bottom: ch.viewport.bottom = top + size.height
			};

		};
	}
	
	return self;
}());

// Calculates size and position
ch.viewport.getOffset();