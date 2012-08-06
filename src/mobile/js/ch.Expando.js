/**
* Expando lets you show or hide the content. Expando needs a pair: the title and the content related to that title.
* @name Expando
* @class Expando
* @augments ch.Widget
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.open] Shows the expando open when component was loaded. By default, the value is false.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are disable.
* @returns itself
* @factorized
* @see ch.Widget
* @exampleDescription Create a new expando without configuration.
* @example
* var widget = $(".example").expando();
* @exampleDescription Create a new expando with configuration.
* @example
* var widget = $(".example").expando({
*     "open": true
* });
*/
ch.Expando = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Expando-that
	* @type object
	*/
	var that = this,

		/**
		* Reference to Parent Class.
		* @private
		* @name ch.Expando-parent
		* @type object
		*/
		parent,

		/**
		* Reference to configuration object.
		* @private
		* @name ch.Expando-conf
		* @type object
		*/
		conf = clone(conf) || {};

	//conf.icon = hasOwn(conf, "icon") ? conf.icon : true;
	conf.open = conf.open || false;
	conf.classes = conf.classes || "";

	that.conf = conf;

/**
*	Inheritance
*/
	// Borrow a constructor and return a parent
	parent = ch.inherit(ch.Widget, that);

/**
*  Private Members
*/

	/**
	* Private reference to the element
	* @privated
	* @name ch.Expando-el
	* @type HTMLElement
	*/
	var el = that.el,

		/**
		* Private reference to the Zepto element
		* @privated
		* @name ch.Expando-$el
		* @type Zepto Object
		*/
		$el = that.$el,

		/**
		* The component's toggle.
		* @privated
		* @function
		* @name ch.Expando-$toggle
		* @returns itself
		*/
		toggle = function () {
			that.$trigger.toggleClass("ch-" + that["type"] + "-trigger-on");
			that.$content.toggleClass("ch-hide");

			// Arrows icons
			/*if (conf.icon) { }*/

			return that;
		};

/**
*  Protected Members
*/

	/**
	* The component's trigger.
	* @protected
	* @name ch.Expando#trigger
	* @type HTMLElement
	*/
	that.trigger = el.firstElementChild;

	/**
	* The component's trigger.
	* @protected
	* @name ch.Expando#$trigger
	* @type Zepto Object
	*/
	that.$trigger = $(that.trigger);
	
	/**
	* The component's content.
	* @protected
	* @name ch.Expando#content
	* @type HTMLElement
	*/
	that.content = el.lastElementChild;

	/**
	* The component's content.
	* @protected
	* @name ch.Expando#$content
	* @type Zepto Object
	*/
	that.$content = $(that.content);

	/**
	* Shows component's content.
	* @protected
	* @function
	* @name ch.Expando#innerShow
	* @returns itself
	*/
	that.innerShow = function (event) {

		if (that.active) { return that.innerHide(event); }

		that.active = true;

		toggle();

		// ARIA attr
		that.trigger.setAttribute("aria-expanded", "true");
		that.content.setAttribute("aria-hidden", "false");


		/**
		* Triggers when component is visible.
		* @name ch.Expando#show
		* @event
		* @public
		* @exampleDescription It change the content when the component was shown.
		* @example
		* widget.on("show",function () {
		*	this.content("Some new content");
		* });
		*/
		that.emit("show");

		return that;
	};

	/**
	* Hides component's content.
	* @protected
	* @function
	* @name ch.Expando#innerHide
	* @returns itself
	*/
	that.innerHide = function (event) {

		if (!that.active) { return; }

		that.active = false;

		toggle();

		// ARIA attr
		that.trigger.setAttribute("aria-expanded", "false");
		that.content.setAttribute("aria-hidden", "true");


		/**
		* Triggers when component is not longer visible.
		* @name ch.Expando#hide
		* @event
		* @public
		* @exampleDescription When the component hides show other component.
		* @example
		* widget.on("hide",function () {
		*	otherComponent.show();
		* });
		*/
		that.emit("hide");

		return that;
	};

	/**
	* Create component's behaivor
	* @protected
	* @function
	* @name ch.Expando#configBehavior
	*/
	that.configBehavior = function () {

		$el.addClass("ch-" + that.type);

		// ARIA
		el.setAttribute("role", "presentation");

		that.trigger.setAttribute("aria-expanded", false);
		that.trigger.setAttribute("aria-controls", "ch-" + that["type"] + "-" + that.uid);

		that.content.setAttribute("id", "ch-" + that["type"] + "-" + that.uid);
		that.content.setAttribute("aria-hidden", true);

		// Trigger behaivor
		// ClassNames
		that.$trigger.addClass("ch-" + that.type + "-trigger");


		/*if (conf.icon) { }*/

		// Events
		that.$trigger.bind(EVENT.TAP, function (event) { event.preventDefault(); that.innerShow(event); });

		// Content behaivor

		// ClassNames
		that.$content.addClass("ch-" + that.type + "-content ch-hide " + conf.classes);

		// Visual configuration
		if (conf.open) { that.innerShow(); }

	};


/**
*  Public Members
*/
 
	/**
	* @borrows ch.Widget#uid as ch.Expando#uid
	*/	
	
	/**
	* @borrows ch.Widget#el as ch.Expando#el
	*/

	/**
	* @borrows ch.Widget#type as ch.Expando#type
	*/

	/**
	* @borrows ch.Widget#emit as ch.Expando#emit
	*/

	/**
	* @borrows ch.Widget#on as ch.Expando#on
	*/

	/**
	* @borrows ch.Widget#once as ch.Expando#once
	*/

	/**
	* @borrows ch.Widget#off as ch.Expando#off
	*/

	/**
	* @borrows ch.Widget#offAll as ch.Expando#offAll
	*/

	/**
	* @borrows ch.Widget#setMaxListeners as ch.Expando#setMaxListeners
	*/

	
	/**
	* Shows component's content.
	* @public
	* @function
	* @name ch.Expando#show
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
	* @name ch.Expando#hide
	* @returns itself
	*/	
	that["public"].hide = function(){
		that.innerHide();
		return that["public"];
	};

/**
*  Default behaivor
*/
	
	that.configBehavior();

	/**
	* Emits an event when the component is ready to use.
	* @name ch.Expando#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as expando's instance controller:
	* widget.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.emit("ready")}, 50);

	return that;
};
ch.factory("Expando");