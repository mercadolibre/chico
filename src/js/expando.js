
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
	
	var $nav = that.$element.children(),
		triggerAttr = {
			"aria-expanded":conf.open,
			"aria-controls":"ch-expando-"+that.uid
		},
		contentAttr = {
			id:triggerAttr["aria-controls"],
			"aria-hidden":!triggerAttr["aria-expanded"]
		};
		
	that.$trigger = $nav.eq(0).attr("role","presentation").wrapInner("<span>").children().attr(triggerAttr);
	that.$content = $nav.eq(1).attr(contentAttr);
	
	that.show = function(event){
		that.$trigger.attr("aria-expanded","true");
		that.$content.attr("aria-hidden","false");
		that.parent.show();
		return that;
	}
	// 
	that.hide = function(event){
		that.$trigger.attr("aria-expanded","false");
		that.$content.attr("aria-hidden","true");
		that.parent.hide();
		return that;
	}
	
	
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
	that.$trigger.children().attr("role","presentation");
	ch.utils.avoidTextSelection(that.$trigger);
	
	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Expando#ready
	* @event
	* @public
	* @since 0.8.0
	* @example
	* // Following the first example, using 'me' as expando's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;
};

ch.factory("expando");