/**
* Modal is a centered floated window with a dark gray dimmer background. Modal lets you handle its size, positioning and content.
* @name Modal
* @class Modal
* @augments ch.Floats
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.content] Sets content by: static content, DOM selector or URL. By default, the content is the href attribute value  or form's action attribute.
* @param {Number || String} [conf.width] Sets width property of the component's layout. By default, the width is "500px".
* @param {Number || String} [conf.height] Sets height property of the component's layout. By default, the height is elastic.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
* @param {Boolean} [conf.cache] Enable or disable the content cache. By default, the cache is enable.
* @param {String} [conf.closable] Sets the way (true, "button" or false) the Modal close. By default, the modal close true.
* @returns itself
* @factorized
* @see ch.Tooltip
* @see ch.Layer
* @see ch.Zoom
* @exampleDescription Create a new modal window triggered by an anchor with a class name 'example'.
* @example
* var widget = $("a.example").modal();
* @exampleDescription Create a new modal window triggered by form.
* @example
* var widget = $("form").modal();
* @exampleDescription Create a new modal window with configuration.
* @example
* var widget = $("a.example").modal({
*     "content": "Some content here!",
*     "width": "500px",
*     "height": 350,
*     "cache": false,
*     "fx": false
* });
* @exampleDescription Now <code>widget</code> is a reference to the modal instance controller. You can set a new content by using <code>widget</code> like this:
* @example
* widget.content("http://content.com/new/content");
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

	conf.classes = conf.classes || "ch-box";
	conf.reposition = false;

	// Closable configuration
	conf.closeButton = ch.utils.hasOwn(conf, "closeButton") ? conf.closeButton : true;
	conf.closable = ch.utils.hasOwn(conf, "closable") ? conf.closable : true;
	
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

			/*if (that.type === "modal") {
				$dimmer.one("click", function (event) { that.innerHide(event) });
			}*/
			
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
	* Returns any if the component closes automatic. 
	* @protected
	* @name ch.Modal#closable
	* @function
	* @returns boolean
	*/

/**
*	Public Members
*/

	/**
	* @borrows ch.Object#uid as ch.Modal#uid
	*/	
	
	/**
	* @borrows ch.Object#element as ch.Modal#element
	*/

	/**
	* @borrows ch.Object#type as ch.Modal#type
	*/

	/**
	* @borrows ch.Uiobject#content as ch.Modal#content
	*/

	/**
	* @borrows ch.Floats#isActive as ch.Modal#isActive
	*/

	/**
	* @borrows ch.Floats#show as ch.Modal#show
	*/

	/**
	* @borrows ch.Floats#hide as ch.Modal#hide
	*/

	/**
	* @borrows ch.Floats#width as ch.Modal#width
	*/

	/**
	* @borrows ch.Floats#height as ch.Modal#height
	*/

	/**
	* @borrows ch.Floats#position as ch.Modal#position
	*/

	/**
	* @borrows ch.Floats#closable as ch.Modal#closable
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
	* Triggers when the component is ready to use.
	* @name ch.Modal#ready
	* @event
	* @public
	* @example
	* // Following the first example, using <code>widget</code> as modal's instance controller:
	* widget.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;
};

ch.factory("modal");


/**
* Transition lets you give feedback to the users when their have to wait for an action. 
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
* @param {String} [conf.closable] Sets the way (true, "button" or false) the Transition close. By default, the transition close true.
* @returns itself
* @factorized
* @see ch.Tooltip
* @see ch.Layer
* @see ch.Zoom
* @exampleDescription Create a transition.
* @example
* var widget = $("a.example").transition();
* @exampleDescription Create a transition with configuration.
* @example
* var widget = $("a.example").transition({
*     "content": "Some content here!",
*     "width": "500px",
*     "height": 350,
*     "cache": false,
*     "fx": false
* });
*/

ch.extend("modal").as("transition", function (conf) {

	conf.closable = false;
	
	conf.msg = conf.msg || conf.content || "Please wait...";
	
	conf.content = $("<div class=\"ch-loading\"></div><p>" + conf.msg + "</p>");
	
	return conf;
});