
/**
* Abstract representation of navs components.
* @abstract
* @name Navs
* @class Navs
* @standalone
* @augments ch.Uiobject
* @memberOf ch
* @param {object} conf Object with configuration properties
* @returns itself
* @see ch.Dropdown
* @see ch.Expando
*/

ch.navs = function () {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Navs#that
	* @type object
	*/ 
	var that = this,
		conf = that.conf;
	
	conf.icon = ch.utils.hasOwn(conf, "icon") ? conf.icon : true;
	conf.open = conf.open || false;
	conf.fx = conf.fx || false;

/**
*	Inheritance
*/

	that = ch.uiobject.call(that);
	that.parent = ch.clon(that);
	
/**
*	Protected Members
*/
	/**
	* Status of component
	* @protected
	* @name ch.Navs#active
	* @returns boolean
	*/
	that.active = false;

	/**
	* Shows component's content.
	* @protected
	* @name ch.Navs#show
	* @returns itself
	*/
	that.show = function (event) {
		that.prevent(event);

		if (that.active) {
			return that.hide(event);
		}
		
		that.active = true;

		that.$trigger.addClass("ch-" + that.type + "-trigger-on");
		/**
		* onShow callback function
		* @name ch.Navs#onShow
		* @event
		*/
		// Animation
		if (conf.fx) {
			that.$content.slideDown("fast", function () {
				//that.$content.removeClass("ch-hide");
			
				// new callbacks
				that.trigger("show");
				// old callback system
				that.callbacks("onShow");
			});
		} else {
			that.$content.removeClass("ch-hide");
			// new callbacks
			that.trigger("show");
			// old callback system
			that.callbacks("onShow");
		}
		
		return that;
	};
	/**
	* Hides component's content.
	* @protected
	* @name ch.Navs#hide
	* @returns itself
	*/
	that.hide = function (event) {
		that.prevent(event);
		
		if (!that.active) { return; }
		
		that.active = false;
		
		that.$trigger.removeClass("ch-" + that.type + "-trigger-on");
		/**
		* onHide callback function
		* @name ch.Navs#onHide
		* @event
		*/
		// Animation
		if (conf.fx) {
			that.$content.slideUp("fast", function () {
				//that.$content.addClass("ch-hide");
				that.callbacks("onHide");
			});
		} else {
			that.$content.addClass("ch-hide");
			// new callbacks
			that.trigger("hide");
			// old callback system
			that.callbacks("onHide");
		}
		
		return that;
	};

	/**
	* Create component's layout
	* @protected
	* @name ch.Navs#createLayout
	*/
	that.configBehavior = function () {
		that.$trigger
			.addClass("ch-" + that.type + "-trigger")
			.bind("click", function (event) { that.show(event); });

		that.$content.addClass("ch-" + that.type + "-content ch-hide");

		// Visual configuration
		if (conf.icon) { $("<span class=\"ch-" + that.type + "-ico\">Drop</span>").appendTo(that.$trigger); }
		if (conf.open) { that.show(); }

	};
	
/**
*	Default event delegation
*/
	that.$element.addClass("ch-" + that.type);

	/**
	* Triggers when component is visible.
	* @name ch.Navs#show
	* @event
	* @public
	* @example
	* me.on("show",function () {
	*	this.content("Some new content");
	* });
	* @see ch.Floats#event:show
	*/

	/**
	* Triggers when component is not longer visible.
	* @name ch.Navs#hide
	* @event
	* @public
	* @example
	* me.on("hide",function () {
	*	otherComponent.show();
	* });
	* @see ch.Floats#event:hide
	*/

	return that;
}
