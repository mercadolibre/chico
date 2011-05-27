
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
 
ch.navs = function(){
	
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Navs
     */ 
	var that = this;
	var conf = that.conf;
		conf.icon = (conf.hasOwnProperty("icon")) ? conf.icon : true;
		conf.open = conf.open || false;
		conf.fx = conf.fx || false;

/**
 *  Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);


/**
 *  Private Members
 */
    /**
     * Adds icon in trigger's content.
     * @private
     * @name createIcon
     * @function
     * @memberOf ch.Navs
     */
	var createIcon = function(){
		$("<span>")
			.addClass("ico")
			.html("drop")
			.appendTo( that.$trigger );

		return;
	};
	
/**
 *  Protected Members
 */ 	
     /**
     * Status of component
     * @public
     * @name active
     * @return {Boolean}
     * @memberOf ch.Navs
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

		if ( that.active ) {
			return that.hide(event);
		};
		
		that.active = true;

		that.$trigger.addClass("ch-" + that.type + "-trigger-on");
		
		// Animation
		if( conf.fx ) {
			that.$content.slideDown("fast", function(){
				that.$content.removeClass("ch-hide");
				that.callbacks("onShow");
			});
		} else {
			that.$content.removeClass("ch-hide");
			that.callbacks("onShow");
		};
		
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
		
		that.$trigger.removeClass("ch-" + that.type + "-trigger-on");

		// Animation
		if( conf.fx ) {
			that.$content.slideUp("fast", function(){
				that.$content.addClass("ch-hide");
				that.callbacks("onHide");
			});
		} else {
			that.$content.addClass("ch-hide");
			that.callbacks("onHide");
		};
		
		return that;
	};

     /**
     * Create component's layout
     * @public
     * @name createLayout
     * @return {void}
     * @memberOf ch.Navs
     */
	that.configBehavior = function(){
		that.$trigger
			.addClass("ch-" + that.type + "-trigger")
			.bind("click", function(event){ that.show(event); });

		that.$content
			.addClass("ch-" + that.type + "-content ch-hide");

		// Visual configuration
		if( conf.icon ) createIcon();
		if( conf.open ) that.show();

		return;
	};
	
/**
 *  Default event delegation
 */
	that.$element.addClass("ch-" + that.type);


	return that;
}
