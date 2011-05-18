
/**
 * Abstract representation of navs components.
 * @name Navs
 * @class Navs
 * @augments ch.Object
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 * @see ch.Dropdown
 * @see ch.Expando
 */
 
ch.Navs = function(){
	
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Navs
     */ 
	var that = this;
	var conf = that.conf;
/**
 *  Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);
			
/**
 *  Public Members
 */ 	
	that.active = false;

    /**
     * Shows component's content.
     * @public
     * @name show
     * @return {Chico-UI Object}
     * @memberOf ch.Navs
     */
	that.show = function(event){
		that.prevent(event);
		
		if ( that.active ) return;
		
		that.active = true;

		that.$trigger.addClass("ch-" + that.type + "-on");
		that.$content.removeClass("ch-hide");
		that.callbacks("onShow");
		
		return that;
	};
    /**
     * Hides component's content.
     * @public
     * @name hide
     * @return {Chico-UI Object}
     * @memberOf ch.Navs
     */
	that.hide = function(event){
		that.prevent(event);
		
		if (!that.active) return;
		
		that.active = false;
		
		that.$trigger.removeClass("ch-" + that.type + "-on");
		that.$content.addClass("ch-hide");
		that.callbacks("onHide");
		
		return that;
	};		
	
	return that;
}
