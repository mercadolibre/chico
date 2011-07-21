
/**
 * Abstract class of all floats UI-Objects.
 * @abstract
 * @name ch.Floats
 * @class Floats
 * @augments ch.Object
 * @requires ch.Positioner
 * @returns {ch Object}
 * @see ch.Tooltip
 * @see ch.Layer
 * @see ch.Modal
 */ 

ch.floats = function() {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @protected
	* @name ch.Floats#that
	* @type {Object}
	*/ 
	var that = this;
	var conf = that.conf;

/**
 * Inheritance
 */

	that = ch.object.call(that);
	that.parent = ch.clon(that);

/**
 * Private Members
 */

	/**
 	* Creates a 'cone', is a visual asset for floats.
 	* @private
 	* @name ch.Floats#createCone
 	* @function
 	*/ 
	var createCone = function() {
		$("<div class=\"ch-cone\">")
			.prependTo( that.$container );
	};

	/**
 	* Creates close button.
 	* @private
 	* @name ch.Floats#createClose
 	* @function
 	*/ 
	var createClose = function() {
		// Close Button
		$("<div class=\"btn close\" style=\"z-index:"+(ch.utils.zIndex+=1)+"\">")
			.bind("click", function(event){ that.innerHide(event); })
			.prependTo( that.$container );
		
		// ESC key
		ch.utils.document.bind(ch.events.KEY.ESC, function(event){ that.innerHide(event); });
		
		return;
	};

/**
 * Protected Members
 */ 
	/**
	* Flag that indicates if the float is active and rendered on the DOM tree.
	* @protected
	* @name ch.Floats#active
	* @type {Boolean}
	*/ 
	that.active = false;

	/**
	* Content configuration property.
	* @protected
	* @name ch.Floats#source
	* @type {String}
	*/
	that.source = conf.content || conf.msg || conf.ajax || that.$element.attr('href') || that.$element.parents('form').attr('action');

	/**
	* Inner function that resolves the component's layout and returns a static reference.
	* @protected
	* @name ch.Floats#$container
	* @type {jQuery Object}
	*/ 
	that.$container = (function() { // Create Layout

		// Create the component container
		that.$container = $("<div class=\"ch-"+ that.type +"\" style=\"z-index:"+(ch.utils.zIndex+=1)+"\">");

		// Visual configuration
		if( ch.utils.hasOwn(conf, "classes") ) { that.$container.addClass(conf.classes); }
		if( ch.utils.hasOwn(conf, "width") ) { that.$container.css("width", conf.width); }
		if( ch.utils.hasOwn(conf, "height") ) { that.$container.css("height", conf.height); }
		if( ch.utils.hasOwn(conf, "closeButton") && conf.closeButton ) { createClose(); }
		if( ch.utils.hasOwn(conf, "cone") ) { createCone(); }
		if( ch.utils.hasOwn(conf, "fx") ) { conf.fx = conf.fx; } else { conf.fx = true; }
		
		// Cache - Default: true
		//conf.cache = ( ch.utils.hasOwn(conf, "cache") ) ? conf.cache : true;

		// Position component
		conf.position = conf.position || {};
		//conf.position.element = that.$container;
		conf.position.hold = conf.hold || false;
		//ch.positioner.call(that); // Is this necesary?

		// Return the entire Layout
		return that.$container;

	})(); 

	/**
	* Inner reference to content container. Here is where the content will be added.
	* @protected
	* @name ch.Floats#$content
	* @type {jQuery Object}
	* @see ch.Object#content
	*/ 
	that.$content = $("<div class=\"ch-"+ that.type +"-content\">").appendTo(that.$container);

	/**
	* This callback is triggered when async data is loaded into component's content, when ajax content comes back.
	* @protected
	* @name ch.Floats#contentCallback
	* @function
	* @returns {this}
	*/ 
	that.contentCallback = function(data) {
		that.staticContent = data;
		that.$content.html(that.staticContent);
		if ( ch.utils.hasOwn(conf, "position") ) {
		   ch.positioner(conf.position);
		}
	}

	/**
	* Inner show method. Attach the component layout to the DOM tree.
	* @protected
	* @name ch.Floats#innerShow
	* @function
	* @returns {this}
	*/ 
	that.innerShow = function(event) {

		if (event) {
			that.prevent(event);
		}
				
		// Avoid showing things that are already shown
		if ( that.active ) return;

		// Get content
		that.staticContent = that.content();
		// Saves content
		that.$content.html(that.staticContent);

		// Add layout to DOM tree
		// Increment zIndex
		that.$container
			.appendTo("body")
			.css("z-index", ch.utils.zIndex++);

		/**
		* Triggers when component is visible.
		* @name ch.Floats#show
		* @event
		* @public
		*/
		// Show component with effects
		if( conf.fx ) {
			that.$container.fadeIn("fast", function(){ 
				// new callbacks
				that.trigger("show");
				// Old callback sistem
				that.callbacks('onShow');
			});
		} else { 
		// Show component without effects
			that.$container.removeClass("ch-hide");
			// new callbacks
			that.trigger("show");
			// Old callback sistem
			that.callbacks('onShow');
		};
	
		// TODO: Positioner should recalculate the element's size (width and height) 
		conf.position.element = that.$container;

		that.position("refresh");

		that.active = true;

		return that;
	};

	/**
	* Inner hide method. Hides the component and detach it from DOM tree.
	* @protected
	* @name ch.Floats#innerHide
	* @function
	* @returns {this}
	*/ 
	that.innerHide = function(event) {

		if (event) {
			that.prevent(event);
		}
		
		if (!that.active) {
			return;
		}

		var afterHide = function(){ 
			 
			that.active = false;
			
		/**
		* Triggers when component is not longer visible.
		* @name ch.Floats#hide
		* @event
		* @public
		*/
			// new callbacks
			that.trigger("hide");
			// Old callback sistem
			that.callbacks('onHide');

			that.$container.detach();

			// TODO: This should be wrapped on Object.content() method
			// We need to be able to use interal callbacks...
			if (ch.utils.isSelector(that.source) && !ch.utils.inDom(that.source) && !ch.utils.isUrl(that.source)) {
				var original = $(that.staticContent).clone();
					original.appendTo(that.DOMParent||"body");

				if (!that.DOMContentIsVisible) {
					original.addClass("ch-hide");
				}

			};
		};
		
		// Show component with effects
		if( conf.fx ) {
			that.$container.fadeOut("fast", afterHide);
		
		// Show component without effects
		} else {
			that.$container.addClass("ch-hide");
			afterHide();
		};

		return that;

	};
	
	/**
	* Getter and setter for size attributes on any float component.
	* @protected
	* @function
	* @name ch.Floats#size
	* @param {String} prop Property that will be setted or getted, like "width" or "height".
	* @param {String} [data] Only for setter. It's the new value of defined property.
	* @returns {this}
	*/
	that.size = function(prop, data) {
		// Getter
		if (!data) {
			return that.conf[prop];
		};
		// Setter
		that.conf[prop] = data;
		// Container
		that.$container[prop](data);
		that.position("refresh");
		return that["public"];
	};


			
/**
 * Public Members
 */
 
	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Floats#show
	* @function
	* @returns {this}
	*/
	that["public"].show = function(){
		that.innerShow();
		return that["public"];
	};
	
	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Floats#hide
	* @function
	* @returns {this}
	*/
	that["public"].hide = function(){
		that.innerHide();
		return that["public"];
	};
	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @name ch.Floats#width
	* @function
	* @returns {this}
	* @see ch.Floats#size
	* @example
	* // to set the width
	* me.width(700);
	* @example
	* // to get the width
	* me.width // 700
	*/
	that["public"].width = function(data) {
		return that.size("width", data) || that["public"];
	};
	/**
	* Sets or gets the height of the Float element.
	* @public
	* @name ch.Floats#height
	* @function
	* @returns {this}
	* @see ch.Floats#size
	* @example
	* // to set the heigth
	* me.height(300);
	* @example
	* // to get the heigth
	* me.height // 300
	*/
	that["public"].height = function(data) {
		return that.size("height", data) || that["public"];
	};
	
	/**
    * Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @name ch.Floats#isActive
	* @function
	* @returns {Boolean}
	*/
	that["public"].isActive = function() {
		return that.active;
	};

	return that;
 
};
