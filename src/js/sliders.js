/**
 *  @class Sliders. Represent the abstract class of all sliders UI-Objects.
 *  @requires object.
 *  @returns {Object} Sliders.
 */

ch.sliders = function() {

/**
 *  Constructor
 */
	var that = this;
	var conf = that.conf;
	
/**
 *  Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);
    
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