
/**
 * Simple Tooltip UI-Object.
 * @name Tooltip
 * @class Tooltip
 * @augments ch.Floats
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.tooltip = function(conf) {
    
    
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Tooltip
     */
	var that = this;
	
	conf = ch.clon(conf);
	conf.cone = true;
	conf.content = that.element.title;	
	conf.position = {};
	conf.position.context = $(that.element);
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";
	
	that.conf = conf;
	
/**
 *	Inheritance
 *		
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

    that.show = function(event) {
        that.$trigger.attr('title', ''); // IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
		that.parent.show(event);
		
		return that;
	};
	
    that.hide = function(event) {
		that.$trigger.attr('title', conf.content);
		that.parent.hide(event);
		
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
     * @memberOf ch.Tooltip
     */
    that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Tooltip
     */
    that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Tooltip
     */
    that["public"].type = that.type;
    /**
     * The component's content.
     * @public
     * @name content
     * @type {String}
     * @memberOf ch.Tooltip
     */
    that["public"].content = that.content;
    /**
     * Shows component's content.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Tooltip
     */
	that["public"].show = function(){
		that.show();

		return that["public"];
	};
    /**
     * Hides component's content.
     * @public
     * @name hide
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Tooltip
     */ 
	that["public"].hide = function(){
		that.hide();

		return that["public"];
	};
    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Tooltip
     */
	that["public"].position = that.position;

/**
 *  Default event delegation
 */	
 	
	that.$trigger
		.bind('mouseenter', that.show)
		.bind('mouseleave', that.hide);

    // Fix: change layout problem
    $("body").bind(ch.events.CHANGE_LAYOUT, function(){ that.position("refresh") });


	return that;
};
