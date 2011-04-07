/**
 *	Controllers
 *	@author 
 *	@Contructor
 *	@return An interface object
 */

ch.controllers = function(){

/**
 *  Constructor
 */
	var that = this;
		
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
	
	that.children = [];
			
/**
 *  Public Members
 */	
	
	
	return that;
};
