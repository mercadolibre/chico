(function () {

	exports.util.extend({
		/**
		 * Keryboard event collection.
		 * @private
		 * @namespace
		 * @memberOf events
		 */
		'key': {

			/**
			 * Enter key event.
			 * @private
			 * @constant
			 * @memberOf events.key
			 * @type {String}
			 */
			'ENTER': 'enter',

			/**
			 * Esc key event.
			 * @private
			 * @constant
			 * @memberOf events.key
			 * @type {String}
			 */
			'ESC': 'esc',

			/**
			 * Left arrow key event.
			 * @private
			 * @constant
			 * @memberOf events.key
			 * @type {String}
			 */
			'LEFT_ARROW': 'left_arrow',

			/**
			 * Up arrow key event.
			 * @private
			 * @constant
			 * @memberOf events.key
			 * @type {String}
			 */
			'UP_ARROW': 'up_arrow',

			/**
			 * Rigth arrow key event.
			 * @private
			 * @constant
			 * @memberOf events.key
			 * @type {String}
			 */
			'RIGHT_ARROW': 'right_arrow',

			/**
			 * Down arrow key event.
			 * @private
			 * @constant
			 * @memberOf events.key
			 * @type {String}
			 */
			'DOWN_ARROW': 'down_arrow',

			/**
			 * Backspace key event.
			 * @private
			 * @constant
			 * @memberOf events.key
			 * @type {String}
			 */
			'BACKSPACE': 'backspace'
		}

	}, exports.events);

}());