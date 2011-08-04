
/**
* Keyboard event controller utility to know wich keys are begin
* @abstract
* @name Keyboard
* @class Keyboard
* @memberOF ch
* @param event
*/ 

ch.keyboard = function(event) {

	/**
	* Map with references to key codes.
	* @private
	* @name ch.Keyboard#keyCodes
	* @type object
	*/ 
	var keyCodes = {
		"13": "ENTER",
		"27": "ESC",
		"37": "LEFT_ARROW",
		"38": "UP_ARROW",
		"39": "RIGHT_ARROW",
		"40": "DOWN_ARROW"
	};

	if( !ch.utils.hasOwn(keyCodes, event.keyCode) ) return;

	ch.utils.document.trigger(ch.events.KEY[ keyCodes[event.keyCode] ], event);

};