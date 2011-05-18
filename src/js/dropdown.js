
/**
 * A navegable list of items, UI-Object.
 * @name Dropdown
 * @class Dropdown
 * @augments ch.Navs
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 */

ch.Dropdown = function(conf){


    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Dropdown
     */
	var that = this;

	conf = ch.clon(conf);
	conf.skin = ( that.$element.hasClass("secondary") ) ? "secondary": "primary";

	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.navs.call(that);
    that.parent = ch.clon(that);

/**
 *  Protected Members
 */ 
	that.$container = that.$element.addClass("ch-dropdown");
	
	that.$trigger = that.$container.children(":first");
	
	that.show = function(event){
		that.prevent(event);
		
		// Toggle
		if ( that.active ) {
			return that.hide(event);
		};
		
        // Reset all dropdowns
		$(ch.instances.dropdown).each(function(i, e){ e.hide(); });
		
        // Show menu
		that.$content.css('z-index', ch.utils.zIndex ++);
		that.$trigger.css('z-index', ch.utils.zIndex ++); // Z-index of trigger over content		
		that.parent.show(event);
		that.position("refresh");
		
		// Secondary behavior
		if(conf.skin == "secondary"){
			that.$container.addClass("ch-dropdown-on"); // Container ON
		};
		
		// Close events
		ch.utils.document.one("click", function(event){ that.hide(event); });
		ch.utils.document.bind(ch.events.KEY.ESC, function(event){ that.hide(event) });
		
		// Select first anchor child by default
		var items = that.$content.find("a");
			items.eq(0).focus();
		
		// More than one item
		if(items.length == 0) return that;
		
		// Keyboard support
		var itemSelected = 0;
		
		// Item selected by mouseover
		// TODO: It's over keyboard selection and it is generating double selection.
		items.each(function(i, e){
			$(e).bind("mouseenter", function(){
				itemSelected = i;
				items.eq( itemSelected ).focus();
			});
		});
		
		var selectItem = function(arrow, event){
			that.prevent(event);
			
			if(itemSelected == ((arrow == "down") ? items.length - 1 : 0)) return;
			
			items.eq( itemSelected ).blur();
			
			if(arrow == "down") itemSelected ++; else itemSelected --;
			
			items.eq( itemSelected ).focus();
		};
		
		// Arrows
		ch.utils.document.bind(ch.events.KEY.UP_ARROW, function(x, event){ selectItem("up", event); });
		ch.utils.document.bind(ch.events.KEY.DOWN_ARROW, function(x, event){ selectItem("down", event); });
		
        return that;
    };
	
    that.hide = function(event){
    	that.prevent(event);
    	
    	if (!that.active) return;
    	
    	// Secondary behavior
		if(conf.skin == "secondary"){
			that.$container.removeClass("ch-dropdown-on"); // Container OFF
		};
		
        that.parent.hide(event);
        
        // Unbind events
        ch.utils.document.unbind(ch.events.KEY.UP_ARROW);
        ch.utils.document.unbind(ch.events.KEY.DOWN_ARROW);
        ch.utils.document.unbind(ch.events.KEY.ESC);
        
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
     * @memberOf ch.Dropdown
     */
   	that["public"].uid = that.uid;
    
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Dropdown
     */
	that["public"].element = that.element;
    
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Dropdown
     */	
	that["public"].type = that.type;
	
    /**
     * Shows component's content.
     * @public
     * @name show
     * @return {Chico-UI Object}
     * @memberOf ch.Dropdown
     */
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};

    /**
     * Hides component's content.
     * @public
     * @name hide
     * @return {Chico-UI Object}
     * @memberOf ch.Dropdown
     */ 
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Dropdown
     */
	that["public"].position = that.position;	


/**
 *  Default event delegation
 */		    
    // Trigger
	that.$trigger
		.bind("click", function(event){ that.show(event) })
		.addClass("ch-dropdown-trigger-" + conf.skin)
		.append("<span class=\"ch-down\"> &raquo;</span>");

	// Content
	that.$content = that.$trigger.next()
		.addClass("ch-dropdown-content-" + conf.skin)
		.addClass("ch-hide")
		.bind("click", function(event){
			event.stopPropagation(); // Prevent click on content (except links)
		})
		.detach(); // Save on memory;
	
	// Close dropdown after click an option (link)
	that.$content.find("a").one("click", function(){ that.hide(); });

	// Put content out of container
	that.$container.after( that.$content );
		
	// Position
	that.conf.position = {};
	that.conf.position.element = that.$content;
	that.conf.position.context = that.$trigger;
	that.conf.position.points = "lt lb";
	that.conf.position.offset = "0 -1";
	
	return that;

};
