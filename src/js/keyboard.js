/**
 *  Keyboard
 */
 
ch.keyboard = function(event) {
    
    var keyCodes = {
        "13": "ENTER",
        "27": "ESC",
        "37": "LEFT_ARROW",
        "38": "UP_ARROW",
        "39": "RIGHT_ARROW",
        "40": "DOWN_ARROW"
    };
    
    if( !keyCodes.hasOwnProperty(event.keyCode) ) return;
    
    ch.utils.document.trigger(ch.events.KEY[ keyCodes[event.keyCode] ], event);
    
};
