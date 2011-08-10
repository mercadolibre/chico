
/**
* Shows messages on the screen with a contextual floated UI-Component.
* @name Helper
* @class Helper
* @augments ch.Floats
* @memberOf ch
* @param {Object} o Object with configuration properties
* @returns {itself}
*/

ch.helper = function(controller){

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name that
	* @type {Object}
	* @memberOf ch.Helper
	*/
	var that = this;

	var conf = {};		
		conf.cone = true;
		conf.position = {};
		conf.position.context = controller.reference;
		conf.position.offset = "15 0";
		conf.position.points = "lt rt";
		conf.cache = false;
	
	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.floats.call(that);
	that.parent = ch.clon(that);

/**
*  Private Members
*/



/**
*  Protected Members
*/ 
 
	that.content("I'm not sure what just happened, this field might have some problems. Can you take a look?")
 
	/**
	* Inner show method. Attach the component layout to the DOM tree.
	* @protected
	* @name ch.Helper#innerShow
	* @function
	* @returns {itself}
	*/ 
	that.$trigger = that.$element;

	that.innerShow = function() {

		if ( !that.active ) {
			// Load content and show!
			that.parent.innerShow();
		};

		return that;
	};

/**
*  Public Members
*/
 
	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Helper#uid
	* @type {Number}
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Helper#element
	* @type {HTMLElement}
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Helper#type
	* @type {String}
	*/

	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @name ch.Helper#content
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
	* @name ch.Helper#isActive
	* @function 
	* @returns {Boolean}
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Helper#show
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
	* @name ch.Helper#hide
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
	* @name ch.Helper#width
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
	* @name ch.Helper#height
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
	* @name ch.Helper#position
	* @example
	* // Change component's position.
	* me.position({ 
	*	offset: "0 10",
	*	points: "lt lb"
	* });
	* @see ch.Object#position
	*/

/**
*  Default event delegation
*/

	$("body").bind(ch.events.LAYOUT.CHANGE, function(){ 
		that.position("refresh");
	});

	that.trigger("ready");

	return that;
};
