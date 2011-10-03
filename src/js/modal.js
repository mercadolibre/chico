/**
* Is a centered floated window with a dark gray dimmer background. This component let you handle its size, positioning and content.
* @name Modal
* @class Modal
* @augments ch.Floats
* @standalone
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.content] Sets content by: static content, DOM selector or URL. By default, the content is the href attribute value  or form's action attribute.
* @param {Number || String} [conf.width] Sets width property of the component's layout. By default, the width is "500px".
* @param {Number || String} [conf.height] Sets height property of the component's layout. By default, the height is elastic.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
* @param {Boolean} [conf.cache] Enable or disable the content cache. By default, the cache is enable.
* @returns itself
* @see ch.Tooltip
* @see ch.Layer
* @see ch.Zoom
* @example
* // Create a new modal window with configuration.
* var me = $("a.example").modal({
*     "content": "Some content here!",
*     "width": "500px",
*     "height": 350,
*     "cache": false,
*     "fx": false
* });
* @example
* // Create a new modal window triggered by an anchor with a class name 'example'.
* var me = $("a.example").modal();
* @example
* // Now 'me' is a reference to the modal instance controller.
* // You can set a new content by using 'me' like this:
* me.content("http://content.com/new/content");
*/

ch.modal = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Modal#that
	* @type object
	*/
	var that = this;
	conf = ch.clon(conf);
	
	conf.classes = "box";
	conf.closeButton = that.type === "modal";
	
	conf.aria = {};
	
	if (conf.closeButton) {
		conf.aria.role = "dialog";
		conf.aria.identifier = "aria-label";
	} else {
		conf.aria.role = "alert";
	}
	
	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.floats.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/

	/**
	* Reference to the dimmer object, the gray background element.
	* @private
	* @name ch.Modal#$dimmer
	* @type jQuery
	*/
	var $dimmer = $("<div class=\"ch-dimmer\">");

	// Set dimmer height for IE6
	if (ch.utils.html.hasClass("ie6")) { $dimmer.height(parseInt(document.documentElement.clientHeight, 10) * 3); }

	/**
	* Reference to dimmer control, turn on/off the dimmer object.
	* @private
	* @name ch.Modal#dimmer
	* @type object
	*/
	var dimmer = {
		on: function () {

			if (that.active) { return; }

			$dimmer
				.css("z-index", ch.utils.zIndex += 1)
				.appendTo(ch.utils.body)
				.fadeIn();

			if (that.type === "modal") {
				$dimmer.one("click", function (event) { that.innerHide(event) });
			}
			
			// TODO: position dimmer with Positioner
			if (!ch.features.fixed) {
			 	ch.positioner({ element: $dimmer });
			}

			if (ch.utils.html.hasClass("ie6")) {
				$("select, object").css("visibility", "hidden");
			}
		},
		off: function () {
			$dimmer.fadeOut("normal", function () {
				$dimmer.detach();
				if (ch.utils.html.hasClass("ie6")) {
					$("select, object").css("visibility", "visible");
				}
			});
		}
	};

/**
*	Protected Members
*/

	/**
	* Inner show method. Attach the component's layout to the DOM tree and load defined content.
	* @protected
	* @name ch.Modal#innerShow
	* @function
	* @returns itself
	*/
	that.innerShow = function (event) {
		dimmer.on();
		that.parent.innerShow(event);		
		that.$element.blur();
		return that;
	};

	/**
	* Inner hide method. Hides the component's layout and detach it from DOM tree.
	* @protected
	* @name ch.Modal#innerHide
	* @function
	* @returns itself
	*/
	that.innerHide = function (event) {
		dimmer.off();
		that.parent.innerHide(event);
		return that;
	};

/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Modal#uid
	* @type number
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Modal#element
	* @type HTMLElement
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Modal#type
	* @type string
	*/

	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @name ch.Modal#content
	* @function
	* @param {string} content Static content, DOM selector or URL. If argument is empty then will return the content.
	* @example
	* // Get the defined content
	* me.content();
	* @example
	* // Set static content
	* me.content("Some static content");
	* @example
	* // Set DOM content
	* me.content("#hiddenContent");
	* @example
	* // Set AJAX content
	* me.content("http://chico.com/some/content.html");
	* @see ch.Object#content
	*/

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @name ch.Modal#isActive
	* @function
	* @returns boolean
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Modal#show
	* @function
	* @returns itself
	* @see ch.Floats#show
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Modal#hide
	* @function
	* @returns itself
	* @see ch.Floats#hide
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/

	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @name ch.Modal#width
	* @function
	* @returns itself
	* @see ch.Floats#size
	* @example
	* // to set the width
	* me.width(700);
	* @example
	* // to get the width
	* me.width // 700
	*/

	/**
	* Sets or gets the height property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '100' or '100px'.
	* @public
	* @name ch.Modal#height
	* @function
	* @returns itself
	* @see ch.Floats#size
	* @example
	* // to set the heigth
	* me.height(300);
	* @example
	* // to get the heigth
	* me.height // 300
	*/

	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @name ch.Modal#position
	* @function
	* @example
	* // Change component's position.
	* me.position({
	*	offset: "0 10",
	*	points: "lt lb"
	* });
	* @see ch.Object#position
	*/

/**
*	Default event delegation
*/

	if (that.element.tagName === "INPUT" && that.element.type === "submit") {
		that.$element.parents("form").bind("submit", function (event) { that.innerShow(event); });
	} else {
		that.$element.bind("click", function (event) { that.innerShow(event); });
	}

	/**
	* Triggers when component is visible.
	* @name ch.Modal#show
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
	* @name ch.Modal#hide
	* @event
	* @public
	* @example
	* me.on("hide",function () {
	*	otherComponent.show();
	* });
	* @see ch.Floats#event:hide
	*/

	/**
	* Triggers when the component is ready to use.
	* @name ch.Modal#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	that.trigger("ready");

	return that;
};

ch.factory("modal");


/**
* Transition
* @name Transition
* @class Transition
* @interface
* @augments ch.Floats
* @requires ch.Modal
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.content] Sets content by: static content, DOM selector or URL. By default, the content is the href attribute value  or form's action attribute.
* @param {Number || String} [conf.width] Sets width property of the component's layout. By default, the width is "500px".
* @param {Number || String} [conf.height] Sets height property of the component's layout. By default, the height is elastic.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
* @param {Boolean} [conf.cache] Enable or disable the content cache. By default, the cache is enable.
* @returns itself
* @see ch.Tooltip
* @see ch.Layer
* @see ch.Zoom
* @example
* // Create a new modal window with configuration.
* var me = $("a.example").transition({
*     "content": "Some content here!",
*     "width": "500px",
*     "height": 350,
*     "cache": false,
*     "fx": false
* });
*/

ch.extend("modal").as("transition", function (conf) {
	
	conf.closeButton = false;
	
	conf.msg = conf.msg || conf.content || "Please wait...";
	
	conf.content = $("<div class=\"loading\"></div><p>" + conf.msg + "</p>");
	
	return conf;
});