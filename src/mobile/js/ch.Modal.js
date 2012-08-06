/**
* Modal is a centered floated window with a dark gray dimmer background. Modal lets you handle its size, positioning and content.
* @name Modal
* @class Modal
* @augments ch.Widget
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.content] Sets content by: static content, DOM selector or URL. By default, the content is the href attribute value  or form's action attribute.
* @returns itself
* @factorized
* @see ch.Widget
* @see ch.Routes
* @exampleDescription Create a new modal window triggered by an anchor with a class name 'example'.
* @example
* var widget = $("a.example").modal();
* @exampleDescription Create a new modal window triggered by form.
* @example
* var widget = $("form").modal();
* @exampleDescription Create a new modal window with configuration.
* @example
* var widget = $("a.example").modal({
*     "content": "#someDivHidden"
* });
*/

ch.Modal = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Modal-that
	* @type object
	*/
	var that = this,

		/**
		* Reference to Parent Class.
		* @private
		* @name ch.Modal-parent
		* @type object
		*/
		parent,

		/**
		* Reference to configuration object.
		* @private
		* @name ch.Modal-conf
		* @type object
		*/
		conf = clone(conf) || {};

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
	* @name ch.Modal-el
	* @type HTMLElement
	*/
	var el = that.el,


		/**
		* Private reference to the Zepto element
		* @privated
		* @name ch.Modal-$el
		* @type Zepto Object
		*/
		$el = that.$el,

		/**
		* Hides component's content.
		* @privated
		* @function
		* @name ch.Modal-hide
		* @returns itself
		*/
		hide = function () {

			if (!that.active) { return; }

			that.active = false;
			
			that.$container.addClass("ch-hide");

			$mainView.removeClass("ch-hide");
			$mainView[0].setAttribute("aria-hidden", false);

			return that;
		},

		/**
		* Hash name
		* @privated
		* @name ch.Modal-hash
		* @type String
		*/
		hash = conf.hash || el.href.split("#")[1] || that["type"] + "-" + that.uid,

		/**
		* Routes maps
		* @privated
		* @name ch.Modal-routes
		* @type Object
		*/
		routes = {};


/**
*  Protected Members
*/


	/**
	* The component's source.
	* @protected
	* @name ch.Modal#$source
	* @type Zepto Object
	*/
	that.source = $(conf.content).removeClass("ch-hide");

	/**
	* The component's content.
	* @protected
	* @name ch.Modal#$content
	* @type Zepto Object
	*/
	that.$content = $("<div class=\"ch-modal-content\">").append(that.source);

	/**
	* The component's container
	* @protected
	* @name ch.Modal#$container
	* @type Zepto Object
	*/
	that.$container = (function () {
		var $container = $("<div data-page=\"ch-" + that["type"] + "-" + that.uid +"\" role=\"dialog\" aria-hidden=\"true\" class=\"ch-modal ch-hide\" id=\"ch-" + that["type"] + "-" + that.uid +"\">");

		$container.append(that.$content);

		return $container;
	}())

	/**
	* Shows component's content.
	* @protected
	* @function
	* @name ch.Modal#innerShow
	* @returns itself
	*/
	that.innerShow = function (event) {

		if (that.active) { return; }

		that.active = true;

		ch.routes.update(hash);

		$mainView.addClass("ch-hide");
		$mainView[0].setAttribute("aria-hidden", true);

		that.$container.removeClass("ch-hide");

		return that;
	};

	/**
	* Hides component's content.
	* @protected
	* @function
	* @name ch.Modal#innerHide
	* @returns itself
	*/
	that.innerHide = function (hash) {
		hide();
		ch.routes.update(hash);

		return that;
	};

	/**
	* Create component's layout and add behaivor
	* @protected
	* @function
	* @name ch.Modal#configBehavior
	*/
	that.configBehavior = function () {

		// ARIA
		el.setAttribute("aria-label", "ch-" + that["type"] + "-" + that.uid);

		// Update hash
		el.href = "#!/" + hash; 

		// Content behaivor
		// ClassNames
		that.$content
			.addClass("ch-" + that.type + "-content")
			.removeClass("ch-hide");

		$mainView.after(that.$container);

		// Visual configuration
		if (conf.open) { that.innerShow(); }

		// Sets hash routes
		routes[""] = hide;
		routes[hash] = that.innerShow;
		ch.routes.add(routes);
	};

/**
*  Public Members
*/
 
	/**
	* @borrows ch.Widget#uid as ch.Modal#uid
	*/	
	
	/**
	* @borrows ch.Widget#el as ch.Modal#el
	*/

	/**
	* @borrows ch.Widget#type as ch.Modal#type
	*/

	/**
	* @borrows ch.Widget#emit as ch.Modal#emit
	*/

	/**
	* @borrows ch.Widget#on as ch.Modal#on
	*/

	/**
	* @borrows ch.Widget#once as ch.Modal#once
	*/

	/**
	* @borrows ch.Widget#off as ch.Modal#off
	*/

	/**
	* @borrows ch.Widget#offAll as ch.Modal#offAll
	*/

	/**
	* @borrows ch.Widget#setMaxListeners as ch.Modal#setMaxListeners
	*/

	/**
	* Shows component's content.
	* @public
	* @function
	* @name ch.Modal#show
	* @returns itself
	*/
	that["public"].show = function () {
		that.innerShow();
		return that["public"];
	};

	/**
	* Hides component's content.
	* @public
	* @function
	* @name ch.Modal#hide
	* @returns itself
	*/	
	that["public"].hide = function (page) {
		that.innerHide(page);
		return that["public"];
	};

/**
*  Default behaivor
*/
	
	that.configBehavior();

	/**
	* Emits an event when the component is ready to use.
	* @name ch.Modal#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* widget.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.emit("ready")}, 50);

	return that;
};
ch.factory("Modal");