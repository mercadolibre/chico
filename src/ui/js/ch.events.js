    /**
     * Keryboard event collection.
     * @name key
     * @namespace
     * @memberOf ch.events
     */
    ch.events.key = {};

    /**
     * Alphanumeric keys event.
     * @name INPUT
     * @constant
     * @memberOf ch.events.key
     * @type {String}
     */
    ch.events.key.INPUT = ('oninput' in document.createElement('input')) ? 'input' : 'keydown';

    /**
     * Tab key event.
     * @name TAB
     * @constant
     * @memberOf ch.events.key
     * @type {String}
     */
    ch.events.key.TAB = 'tab';

    /**
     * Enter key event.
     * @name ENTER
     * @constant
     * @memberOf ch.events.key
     * @type {String}
     */
    ch.events.key.ENTER = 'enter';

    /**
     * Esc key event.
     * @name ESC
     * @constant
     * @memberOf ch.events.key
     * @type {String}
     */
    ch.events.key.ESC = 'esc';

    /**
     * Left arrow key event.
     * @name LEFT_ARROW
     * @constant
     * @memberOf ch.events.key
     * @type {String}
     */
    ch.events.key.LEFT_ARROW = 'left_arrow';

    /**
     * Up arrow key event.
     * @name UP_ARROW
     * @constant
     * @memberOf ch.events.key
     * @type {String}
     */
    ch.events.key.UP_ARROW = 'up_arrow';

    /**
     * Rigth arrow key event.
     * @name RIGHT_ARROW
     * @constant
     * @memberOf ch.events.key
     * @type {String}
     */
    ch.events.key.RIGHT_ARROW = 'right_arrow';

    /**
     * Down arrow key event.
     * @name DOWN_ARROW
     * @constant
     * @memberOf ch.events.key
     * @type {String}
     */
    ch.events.key.DOWN_ARROW = 'down_arrow';

    /**
     * Backspace key event.
     * @name BACKSPACE
     * @constant
     * @memberOf ch.events.key
     * @type {String}
     */
    ch.events.key.BACKSPACE = 'backspace';