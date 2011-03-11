/**
 *	Controllers
 *	@author 
 *	@Contructor
 *	@return An interface object
 */

ui.controllers = function(){

/**
 *  Constructor
 */
	var that = this;
		
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
	
	that.children = [];
			
/**
 *  Public Members
 */	
	
	
	return that;
};
