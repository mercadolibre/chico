
/**
* Expando is a UI-Component.
* @name Expando
* @class Expando
* @augments ch.Navs
* @memberOf ch
* @param {object} conf Object with configuration properties
* @returns itself
*/
 
ch.expando = function(conf){

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Expando#that
	* @type object
	*/
	var that = this;
		
	conf = ch.clon(conf);
	that.conf = conf;
	
/**
*	Inheritance
*/

	that = ch.navs.call(that);
	that.parent = ch.clon(that);

/**
*  Protected Members
*/ 

	that.$trigger = that.$element.children().eq(0).wrapInner("<span>").children();

	that.$content = that.$element.children().eq(1);

/**
*  Public Members
*/
 
	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.Expando#uid
	* @type number
	*/
	
	/**
	* The element reference.
	* @public
	* @name ch.Expando#element
	* @type HTMLElement
	*/
	
	/**
	* The component's type.
	* @public
	* @name ch.Expando#type
	* @type string
	*/
	
	/**
	* Shows component's content.
	* @public
	* @function
	* @name ch.Expando#show
	* @returns itself
	*/
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};

	/**
	* Hides component's content.
	* @public
	* @function
	* @name ch.Expando#hide
	* @returns itself
	*/	
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
	

/**
*  Default event delegation
*/		
	
	that.configBehavior();
	ch.utils.avoidTextSelection(that.$trigger);

	return that;

};

ch.factory("expando");