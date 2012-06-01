/**
* Tooltip improves the native tooltips. Tooltip uses the 'alt' and 'title' attributes to grab its content.
* @name Tooltip
* @class Tooltip
* @augments ch.Floats
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
* @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or centered by default: "cm cm".
* @param {String} [conf.offset] Sets the offset in pixels that component will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @returns itself
* @factorized
* @see ch.Modal
* @see ch.Layer
* @see ch.Zoom
* @exampleDescription Create a tooltip.
* @example
* var widget = $(".some-element").tooltip();
* @exampleDescription Create a new tooltip with configuration.
* @example
* var widget = $("a.example").tooltip({
*     "fx": false,
*     "offset": "10 -10",
*     "points": "lt rt"
* });
* @exampleDescription
* Now <code>widget</code> is a reference to the tooltip instance controller.
* You can set a new content by using <code>widget</code> like this: 
* @example
* widget.width(300);
*/

ch.tooltip = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Tooltip#that
	* @type object
	*/
	var that = this;

	conf = ch.clon(conf);

	conf.cone = true;
	conf.content = that.element.title || that.element.alt;
	
	// Closable configuration
	conf.closable = false;

	conf.aria = {};
	conf.aria.role = "tooltip";
	conf.aria.identifier = "aria-describedby";

	conf.position = {};
	conf.position.context = that.$element;
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";

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
	* The attribute that will provide the content. It can be "title" or "alt" attributes.
	* @protected
	* @name ch.Tooltip#attrReference
	* @type string
	*/
	var attrReference = (that.element.title) ? "title" : "alt",

	/**
	* The original attribute content.
	* @private
	* @name ch.Tooltip#attrContent
	* @type string
	*/
		attrContent = that.element.title || that.element.alt;

/**
*	Protected Members
*/

	/**
	* Inner show method. Attach the component layout to the DOM tree.
	* @protected
	* @name ch.Tooltip#innerShow
	* @function
	* @returns itself
	*/
	that.innerShow = function (event) {
		
		// Reset all tooltip, except me
		$.each(ch.instances.tooltip, function (i, e) {
			if (e !== that["public"]) {
				e.hide();
			}
		});
		
		// IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
		that.element[attrReference] = "";

		that.parent.innerShow(event);

		return that;
	};

	/**
	* Inner hide method. Hides the component and detach it from DOM tree.
	* @protected
	* @name ch.Tooltip#innerHide
	* @function
	* @returns itself
	*/
	that.innerHide = function (event) {
		that.element[attrReference] = attrContent;

		that.parent.innerHide(event);

		return that;
	};

/**
*	Public Members
*/

	/**
	* @borrows ch.Object#uid as ch.Tooltip#uid
	*/	
	
	/**
	* @borrows ch.Object#element as ch.Tooltip#element
	*/

	/**
	* @borrows ch.Object#type as ch.Tooltip#type
	*/

	/**
	* @borrows ch.Object#content as ch.Tooltip#content
	*/

	/**
	* @borrows ch.Floats#isActive as ch.Tooltip#isActive
	*/

	/**
	* @borrows ch.Floats#show as ch.Tooltip#show
	*/

	/**
	* @borrows ch.Floats#hide as ch.Tooltip#hide
	*/

	/**
	* @borrows ch.Floats#width as ch.Tooltip#width
	*/

	/**
	* @borrows ch.Floats#height as ch.Tooltip#height
	*/

	/**
	* @borrows ch.Floats#position as ch.Tooltip#position
	*/

	/**
	* @borrows ch.Floats#closable as ch.Tooltip#closable
	*/

/**
*	Default event delegation
*/

	that.$element
		.bind("mouseenter", that.innerShow)
		.bind("mouseleave", that.innerHide);
	
	/**
	* Triggers when component is ready to use.
	* @name ch.Tooltip#ready
	* @event
	* @public
	* @example
	* // Following the first example, using <code>widget</code> as tooltip's instance controller:
	* widget.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;
};

ch.factory("tooltip");