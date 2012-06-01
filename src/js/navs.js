/**
* Navs is a representation of navs components.
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
	* The component's trigger.
	* @private
	* @name ch.Navs#$trigger
	* @type jQuery
	*/
	that.$trigger = that.$element.children().eq(0);
	
	/**
	* The component's content.
	* @private
	* @name ch.Navs#$content
	* @type jQuery
	*/
	that.$content = that.$element.children().eq(1);

	/**
	* Shows component's content.
	* @protected
	* @name ch.Navs#innerShow
	* @returns itself
	*/
	that.innerShow = function (event) {
		that.prevent(event);

		if (that.active) {
			return that.innerHide(event);
		}
		
		that.active = true;

		that.$trigger.addClass("ch-" + that["type"] + "-trigger-on");

		that.$content.removeClass("ch-hide");

		/**
		* onShow callback function
		* @name ch.Navs#onShow
		* @event
		*/
		// Animation
		if (conf.fx) {
			that.$content.slideDown("fast", function () {
				// new callbacks
				that.trigger("show");
				// old callback system
				that.callbacks("onShow");
			});
		} else {
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
	* @function
	* @name ch.Navs#innerHide
	* @returns itself
	*/
	that.innerHide = function (event) {
		that.prevent(event);
		
		if (!that.active) { return; }
		
		that.active = false;
		
		that.$trigger.removeClass("ch-" + that["type"] + "-trigger-on");
		/**
		* onHide callback function
		* @name ch.Navs#onHide
		* @event
		*/
		// Animation
		if (conf.fx) {
			that.$content.slideUp("fast", function () {
				that.$content.addClass("ch-hide");
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
	* @function
	* @name ch.Navs#configBehavior
	*/
	that.configBehavior = function () {
		that.$trigger
			.addClass("ch-" + that.type + "-trigger")
			.bind("click", function (event) { that.innerShow(event); });

		that.$content.addClass("ch-" + that.type + "-content ch-hide");

		// Visual configuration
		if (ch.utils.html.hasClass("lt-ie8") && conf.icon) {
			$("<span class=\"ch-" + that.type + "-ico\">Drop</span>").appendTo(that.$trigger);
		}

		if (conf.open) { that.innerShow(); }

	};

/**
* Public Members
*/
	/**
	* Shows component's content.
	* @public
	* @function
	* @name ch.Navs#show
	* @returns itself
	*/
	that["public"].show = function(){
		that.innerShow();
		return that["public"];
	};

	/**
	* Hides component's content.
	* @public
	* @function
	* @name ch.Navs#hide
	* @returns itself
	*/	
	that["public"].hide = function(){
		that.innerHide();
		return that["public"];
	};

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @function
	* @name ch.Navs#isActive
	* @returns boolean
	*/
	that["public"].isActive = function () {
		return that.active;
	};
	
/**
*	Default event delegation
*/

	that.configBehavior();
	that.$element.addClass("ch-" + that.type);

	/**
	* Triggers when component is visible.
	* @name ch.Navs#show
	* @event
	* @public
	* @example
	* widget.on("show",function () {
	*	otherComponent.hide();
	* });
	* @see ch.Navs#event:show
	*/

	/**
	* Triggers when component is not longer visible.
	* @name ch.Navs#hide
	* @event
	* @public
	* @example
	* widget.on("hide",function () {
	*	otherComponent.show();
	* });
	* @see ch.Navs#event:hide
	*/

	return that;
}
