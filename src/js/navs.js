
/**
*  @static @class Navigators. Represent the abstract class of all navigators ui objects.
*  @requires PowerConstructor
*  @returns {Object} New Navigators.
*/	
ui.navs = function(){
	
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
		
	that.show = function(event){
		that.prevent(event);
		
		if ( that.active ) return;
		
		that.active = true;

		that.$trigger.addClass("ch-" + that.type + "-on");
		that.$content.show();
		that.callbacks("onShow");
		
		return that;
	};
	
	that.hide = function(event){
		that.prevent(event);
		
		if (!that.active) return;
		
		that.active = false;
		
		that.$trigger.removeClass("ch-" + that.type + "-on");
		that.$content.hide();
		that.callbacks("onHide");
		
		return that;
	};		
	
	return that;
}
