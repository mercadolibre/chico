(function () {

	/**
	 * Alphanumeric keys event.
	 * @name onkeyinput
	 * @constant
	 * @memberOf ch
	 * @type {String}
	 */
	ch.onkeyinput = ('oninput' in document.createElement('input')) ? 'input' : 'keydown';

	/**
	 * Tab key event.
	 * @name onkeytab
	 * @constant
	 * @memberOf ch
	 * @type {String}
	 */
	ch.onkeytab = 'tab';

	/**
	 * Enter key event.
	 * @name onkeyenter
	 * @constant
	 * @memberOf ch
	 * @type {String}
	 */
	ch.onkeyenter = 'enter';

	/**
	 * Esc key event.
	 * @name onkeyesc
	 * @constant
	 * @memberOf ch
	 * @type {String}
	 */
	ch.onkeyesc = 'esc';

	/**
	 * Left arrow key event.
	 * @name onkeyleftarrow
	 * @constant
	 * @memberOf ch
	 * @type {String}
	 */
	ch.onkeyleftarrow = 'left_arrow';

	/**
	 * Up arrow key event.
	 * @name onkeyuparrow
	 * @constant
	 * @memberOf ch
	 * @type {String}
	 */
	ch.onkeyuparrow = 'up_arrow';

	/**
	 * Rigth arrow key event.
	 * @name onkeyrightarrow
	 * @constant
	 * @memberOf ch
	 * @type {String}
	 */
	ch.onkeyrightarrow = 'right_arrow';

	/**
	 * Down arrow key event.
	 * @name onkeydownarrow
	 * @constant
	 * @memberOf ch
	 * @type {String}
	 */
	ch.onkeydownarrow = 'down_arrow';

	/**
	 * Backspace key event.
	 * @name onkeybackspace
	 * @constant
	 * @memberOf ch
	 * @type {String}
	 */
	ch.onkeybackspace = 'backspace';




}());