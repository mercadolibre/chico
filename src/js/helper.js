
/**
 * Shows messages on the screen with a contextual floated UI-Component.
 * @name Helper
 * @class Helper
 * @augments ch.Floats
 * @memberOf ch
 * @param {Controller Object} o Object with configuration properties
 * @returns {Chico-UI Object}
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
	that.$trigger = that.$element;
	
	that.show = function(text) {

		if ( !that.active ) {
			// Load content and show!
			conf.content = '<p><span class="ico error">Error: </span>' + text + '</p>';
			that.parent.show();
			
		} else {
			// Just Reload content!
			that.$content.html('<p><span class="ico error">Error: </span>' + text + '</p>');
			
		};

		return that;
	};

/**
 *  Public Members
 */

    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Helper
     */ 
   	that["public"].uid = that.uid;
   	
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Helper
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Helper
     */
	that["public"].type = that.type;
    /**
     * The component's content.
     * @public
     * @name content
     * @type {String}
     * @memberOf ch.Helper
     */
	that["public"].content = that.content;
    /**
     * Shows component's content.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Helper
     */
	that["public"].show = function(text){
		that.show(text);
		
		return that["public"];
	};
    /**
     * Hides component's content.
     * @public
     * @name hide
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Helper
     */ 
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Helper
     * @example
     * // Change helper's position.
     * $('input').required("message").helper.position({ 
     *    offset: "0 10",
     *    points: "lt lb"
     * });
     */
	that["public"].position = that.position;


/**
 *  Default event delegation
 */

    $("body").bind(ch.events.LAYOUT.CHANGE, function(){ 
        that.position("refresh");
    });

	 
	return that;
};
