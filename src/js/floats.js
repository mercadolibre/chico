

/**
 * Abstract class of all floats UI-Objects.
 * @abstract
 * @name Floats
 * @class Floats
 * @augments ch.Object
 * @memberOf ch
 * @requires ch.Positioner
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Tooltip
 * @see ch.Layer
 * @see ch.Modal
 */ 

ch.floats = function() {

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Floats
     */ 
 	var that = this;
	var conf = that.conf;

/**
 *  Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

    /**
     * Creates a 'cone', is a visual asset for floats.
     * @private
     * @name createCone
     * @function
     * @memberOf ch.Floats
     */ 
	var createCone = function() {
		$("<div class=\"ch-cone\">")
			.prependTo( that.$container );
	};

    /**
     * Creates close button.
     * @private
     * @name createClose
     * @function
     * @memberOf ch.Floats
     */ 
	var createClose = function() {
		// Close Button
		$("<div class=\"btn close\" style=\"z-index:"+(ch.utils.zIndex+=1)+"\">")
			.bind("click", function(event){ that.hide(event); })
			.prependTo( that.$container );
		
		// ESC key
		ch.utils.document.bind(ch.events.KEY.ESC, function(event){ that.hide(event); });
		
		return;
	};

    /**
     * Process al UI configuration and creates the components layout.
     * @private
     * @name createLayout
     * @function
     * @memberOf ch.Floats
     */ 
    var createLayout = function() {

		// Create the component container
		that.$container = $("<div class=\"ch-"+ that.type +"\" style=\"z-index:"+(ch.utils.zIndex+=1)+"\">");
		// Create the content container
		that.$content = $("<div class=\"ch-"+ that.type +"-content\">").appendTo(that.$container);
		
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
		conf.position.element = that.$container;
		conf.position.hold = conf.hold || false;
		ch.positioner.call(that);
		
		// Return the entire Layout
		return that.$container;
    };
    

/**
 *  Protected Members
 */ 
			
/**
 *  Public Members
 */
     /**
     * Flag that indicates if the float is active on the DOM tree.
     * @public
     * @name active
     * @type {Boolean}
     * @memberOf ch.Floats
     */ 
	that.active = false;

    /**
     * Content configuration propertie.
     * @public
     * @name source
     * @type {String}
     * @memberOf ch.Floats
     */
	that.source = conf.content || conf.msg || that.$element.attr('href') || that.$element.parents('form').attr('action');

    /**
     * This callback is triggered when async data is loaded into component's content, when ajax content comes back.
     * @public
     * @name contentCallback
     * @returns {Chico-UI Object}
     * @memberOf ch.Floats
     */ 
    that.contentCallback = function(data) {
        that.staticContent = data;
        that.$content.html(that.staticContent);
        
    	if ( ch.utils.hasOwn(conf, "position") ) {
    	   ch.positioner(conf.position);
    	}
    }

    /**
     * Renders the component in the display by adding it to the DOM tree.
     * @public
     * @name show
     * @returns {Chico-UI Object}
     * @memberOf ch.Floats
     */ 
	that.show = function(event) {
		
		if ( event ) that.prevent(event);
		
		// Avoid showing things that are already shown
		if ( that.active ) return;
		
		// Need to have a Layout		
		if ( !that.$container ) {
            createLayout();
		}

		that.staticContent = that.content();
        that.$content.html(that.staticContent);

        // Add layout to DOM tree
        // Increment zIndex
		that.$container
		    .appendTo("body")
			.css("z-index", ch.utils.zIndex++);

        /**
         * Callback function
         * @name onShow
         * @type {Function}
         * @memberOf ch.Floats
         */
		// Show component with effects
		if( conf.fx ) {
			that.$container.fadeIn("fast", function(){ that.callbacks("onShow"); });
		} else { 
        // Show component without effects
			that.$container.removeClass("ch-hide");
			that.callbacks("onShow");
		};

		that.position("refresh");

		that.active = true;

        return that;
	};

    /**
     * Hides the component and detach it from DOM tree.
     * @public
     * @name hide
     * @returns {Chico-UI Object}
     * @memberOf ch.Floats
     */ 
	that.hide = function(event) {

		if (event) that.prevent(event);
		
		if (!that.active) return;

		var afterHide = function(){ 
			 
			that.active = false;
			
           /**
            * Callback function
            * @name onHide
            * @type {Function}
            * @memberOf ch.Floats
            */
			that.callbacks('onHide');
			
			that.$container.detach();
			
			// TODO: This should be wrapped on Object.content() method
			// We need to be able to use interal callbacks...
			if (!ch.utils.isSelector(that.source)) {
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
	
	return that;
	
};
