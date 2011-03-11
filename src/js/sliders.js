/**
 *  @class Sliders. Represent the abstract class of all sliders UI-Objects.
 *  @requires object.
 *  @returns {Object} Sliders.
 */

ui.sliders = function() {

/**
 *  Constructor
 */
	var that = this;
	var conf = that.conf;
	
/**
 *  Inheritance
 */

    that = ui.object.call(that);
    that.parent = ui.clon(that);
    
/**
 *  Private Members
 */
	

/**
 *  Protected Members
 */ 
			
/**
 *  Public Members
 */
 
	that.active = false;
	
	return that;
	
};