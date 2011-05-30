
/**
 * Abstract class
 * @abstract
 * @name Controllers
 * @class Controllers 
 * @augments ch.Object
 * @memberOf ch
 * @return {Object}
 * @see ch.Accordion
 * @see ch.Carousel
 * @see ch.Form
 */
 
ch.controllers = function(){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @name that
     * @type {Object}
     * @memberOf ch.Controllers
     */ 
 	var that = this;
		
    /**
     *  Inheritance
     */
    that = ch.object.call(that);
    that.parent = ch.clon(that);
	
 
    /**
     * Collection of children elements.
     * @name children
     * @type {Collection}
     * @memberOf ch.Controllers
     */ 
	that.children = [];
			
    /**
     *  Public Members
     */	
		
	return that;
};
