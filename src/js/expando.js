
/**
 * Expando is a UI-Component.
 * @name Expando
 * @class Expando
 * @augments ch.Navs
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 */
 
ch.Expando = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Expando
     */
    var that = this;
	
	that.$element.addClass("ch-expando")
		.children(":first").wrapInner("<span class=\"ch-expando-trigger\"></span>");
		
    conf = ch.clon(conf);
    conf.open = conf.open || false;

	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.navs.call(that);
    that.parent = ch.clon(that);

/**
 *  Protected Members
 */ 

	that.$content = that.$element.children().eq(1);
	that.$trigger = that.$element.find(".ch-expando-trigger");
	
	that.show = function(event){
		that.prevent(event);
		
		// Toggle
		if ( that.active ) {
			return that.hide(event);
		};
		
		that.parent.show(event);
		
		return that;
	};

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
     * @return {Chico-UI Object}
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
     * @return {Chico-UI Object}
     * @memberOf ch.Expando
     */	
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
	

/**
 *  Default event delegation
 */		
    
	// Trigger
	that.$trigger
		.bind('click', function(event){	that.show(event); })
		.addClass('ch-expando-trigger');
		
	// Content
	that.$content.addClass('ch-expando-content ch-hide');
	
	// Change default behaivor (close)
	if( conf.open ) that.show();
	
    
    // Create the publish object to be returned
    conf.publish = that.publish;

	return that;

};
