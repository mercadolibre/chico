
/**
 * Expando is a UI-Component.
 * @name Expando
 * @class Expando
 * @augments ch.Navs
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */
 
ch.expando = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Expando
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
     * @name uid
     * @type {Number}
     * @memberOf ch.Expando
     */
   	that["public"].uid = that.uid;
    
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Expando
     */
 	that["public"].element = that.element;
 	
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Expando
     */
	that["public"].type = that.type;
	
    /**
     * Shows component's content.
     * @public
     * @name show
     * @returns {Chico-UI Object}
     * @memberOf ch.Expando
     */
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};

    /**
     * Hides component's content.
     * @public
     * @name hide
     * @returns {Chico-UI Object}
     * @memberOf ch.Expando
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
