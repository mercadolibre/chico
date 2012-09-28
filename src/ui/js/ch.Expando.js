/**
* Expando lets you show or hide the content. Expando needs a pair: the title and the content related to that title.
* @name Expando
* @class Expando
* @augments ch.Navs
* @see ch.Dropdown
* @see ch.TabNavigator
* @see ch.Navs
* @standalone
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.open] Shows the expando open when component was loaded. By default, the value is false.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are disable.
* @returns itself
* @factorized
* @exampleDescription Create a new expando without configuration.
* @example
* var widget = $(".example").expando();
* @exampleDescription Create a new expando with configuration.
* @example
* var widget = $(".example").expando({
*     "open": true,
*     "fx": true
* });
*/

ch.expando = function (conf) {

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
			"aria-controls":"ch-expando-" + that.uid
		},
		contentAttr = {
			id:triggerAttr["aria-controls"],
			"aria-hidden":!triggerAttr["aria-expanded"]
		};

	/**
	* The component's trigger.
	* @protected
	* @name ch.Expando#$trigger
	* @type jQuery
	*/
	that.$trigger = that.$trigger.attr(triggerAttr);

	/**
	* The component's trigger.
	* @protected
	* @name ch.Expando#$content
	* @type jQuery
	*/
	that.$content = $nav.eq(1).attr(contentAttr);

	/**
	* Shows component's content.
	* @protected
	* @function
	* @name ch.Expando#innerShow
	* @returns itself
	*/
	that.innerShow = function(event){
		that.$trigger.attr("aria-expanded","true");
		that.$content.attr("aria-hidden","false");
		that.parent.innerShow();
		return that;
	}

	/**
	* Hides component's content.
	* @protected
	* @function
	* @name ch.Expando#innerHide
	* @returns itself
	*/
	that.innerHide = function(event){
		that.$trigger.attr("aria-expanded","false");
		that.$content.attr("aria-hidden","true");
		that.parent.innerHide();
		return that;
	}


/**
*  Public Members
*/

	/**
	* @borrows ch.Object#uid as ch.Expando#uid
	*/

	/**
	* @borrows ch.Object#element as ch.Expando#element
	*/

	/**
	* @borrows ch.Object#type as ch.Expando#type
	*/

	/**
	* @borrows ch.Navs#show as ch.Expando#show
	*/

	/**
	* @borrows ch.Navs#hide as ch.Expando#hide
	*/

/**
*  Default event delegation
*/

	that.$trigger.children().attr("role","presentation");
	ch.utils.avoidTextSelection(that.$trigger);

	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Expando#ready
	* @event
	* @public
	* @since 0.8.0
	* @exampleDescription Following the first example, using <code>widget</code> as expando's instance controller:
	* @example
	* widget.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.trigger("ready") }, 50);

	return that;
};

ch.factory("expando");