/**
* Abstract class
* @abstract
* @name Controllers
* @class Controllers
* @augments ch.Uiobject
* @memberOf ch
* @returns itself
* @see ch.Accordion
* @see ch.Menu
* @see ch.Form
* @see ch.Uiobject
*/

ch.controllers = function(){

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @name ch.Controllers#that
	* @type object
	*/
	var that = this;

	/**
	*  Inheritance
	*/
	that = ch.uiobject.call(that);
	that.parent = ch.clon(that);


	/**
	* Collection of children elements.
	* @name ch.Controllers#children
	* @type collection
	*/
	that.children = [];

	/**
	*  Public Members
	*/

	return that;
};
