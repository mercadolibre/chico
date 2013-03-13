(function () {

	var util = ch.util,
		events = ch.events;

	/**
	 * Map with references to key codes.
	 * @private
	 * @name ch.Keyboard#codeMap
	 * @type object
	 */
	var codeMap = {
		"13": "ENTER",
		"27": "ESC",
		"37": "LEFT_ARROW",
		"38": "UP_ARROW",
		"39": "RIGHT_ARROW",
		"40": "DOWN_ARROW",
		 "8": "BACKSPACE"
	};

	/**
	 * Keyboard event controller utility to know wich keys are begin.
	 * @name Keyboard
	 * @class Keyboard
	 * @memberOf ch
	 * @param event
	 */
	function keyboard(event) {

		var keyCode = event.keyCode.toString();

		// Check for event existency on the map
		if(codeMap[keyCode] !== undefined) {
    		// Trigger custom event with original event as second parameter
    		$document.trigger(events.key[codeMap[keyCode]], event);
        }
	}

	ch.keyboard = keyboard;
}());