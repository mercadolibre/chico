
/**
* Simple Tooltip UI-Object. It uses the 'alt' and 'title' attributes to grab its content.
* @name Tooltip
* @class Tooltip
* @augments ch.Floats
* @memberOf ch
* @param {Object} conf Object with configuration properties
* @returns {itself}
* @see ch.Modal
* @see ch.Layer
* @example
* // Create a simple tooltip
* var me = $(".some-element").tooltip();
* @example
* // Now 'me' is a reference to the tooltip instance controller.
* // You can set a new content by using 'me' like this: 
* me.width(300);
*/

ch.tooltip = function(conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Tooltip#that
	* @type {Object}
	*/
	var that = this;
	
	conf = ch.clon(conf);
	conf.cone = true;
	conf.content = "<span>" + (that.element.title || that.element.alt) + "</span>";
	conf.position = {};
	conf.position.context = $(that.element);
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
	* @type {string}
	*/
	var attrReference = (that.element.title) ? "title" : "alt";

	/**
	* The original attribute content.
	* @private
	* @name ch.Tooltip#attrContent
	* @type {string}
	*/
	var attrContent = that.element.title || that.element.alt;

/**
*	Protected Members
*/
	that.$trigger = that.$element;

	/**
	* Inner show method. Attach the component layout to the DOM tree.
	* @protected
	* @name ch.Tooltip#innerShow
	* @function
	* @returns {itself}
	*/
	that.innerShow = function(event) {
		that.element[attrReference] = ""; // IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
		that.parent.innerShow(event);

		return that;
	};
	
	/**
	* Inner hide method. Hides the component and detach it from DOM tree.
	* @protected
	* @name ch.Tooltip#innerHide
	* @function
	* @returns {itself}
	*/
	that.innerHide = function(event) {
		that.element[attrReference] = attrContent;
		that.parent.innerHide(event);
		return that;
	};

/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Tooltip#uid
	* @type {Number}
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Tooltip#element
	* @type {HTMLElement}
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Tooltip#type
	* @type {String}
	*/

	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @name ch.Tooltip#content
	* @function
	* @param {String} content Static content, DOM selector or URL. If argument is empty then will return the content.
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
	* @name ch.Tooltip#isActive
	* @function 
	* @returns {Boolean}
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Tooltip#show
	* @function
	* @returns {itself}
	* @see ch.Floats#show
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Tooltip#hide
	* @function
	* @returns {itself}
	* @see ch.Floats#hide
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/

	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @name ch.Tooltip#width
	* @function
	* @returns {itself}
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
	* @name ch.Tooltip#height
	* @function
	* @returns {itself}
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
	* @name ch.Tooltip#position
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
	
	that.$trigger
		.bind('mouseenter', that.innerShow)
		.bind('mouseleave', that.innerHide);

	// Fix: change layout problem
	$("body").bind(ch.events.LAYOUT.CHANGE, function(){ that.position("refresh") });


	/**
	* Triggers when component is visible.
	* @name ch.Tooltip#show
	* @event
	* @public
	* @example
	* me.on("show",function(){
	*	this.content("Some new content");
	* });
	* @see ch.Floats#event:show
	*/

	/**
	* Triggers when component is not longer visible.
	* @name ch.Tooltip#hide
	* @event
	* @public
	* @example
	* me.on("hide",function(){
	*	otherComponent.show();
	* });
	* @see ch.Floats#event:hide
	*/
	
	/**
	* Triggers when component is ready to use.
	* @name ch.Tooltip#ready
	* @event
	* @public	
	* @example
	* me.on("ready",function(){
	*	this.show();
	* });
	*/
	that.trigger("ready");

	return that;
};
