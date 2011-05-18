
/**
 * Accordion is a UI-Component.
 * @name Accordion
 * @class Accordion
 * @augments ch.Controllers
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 */
 
ch.Accordion = function(conf){

// Private members

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Accordion
     */	
	var that = this;
	that.$element.addClass('ch-accordion');
	conf = ch.clon(conf);
	that.conf = conf;
	
    // Inheritance
    that = ch.controllers.call(that);
    that.parent = ch.clon(that);

    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Accordion
     */ 	
	that["public"].uid = that.uid;
	
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Accordion
     */
	that["public"].element = that.element;
	
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Accordion
     */
	that["public"].type = that.type;
	
    /**
     * Select a specific children.
     * @public
     * @name select
     * @function
     * @memberOf ch.Accordion
     */
	that["public"].select = function(bellows){
		
		if(typeof bellows == "string") {
			var sliced = bellows.split("#");
		
			that.children[ sliced[0] ].select( sliced[1] );
		} else {
			that.children[ bellows ].show();
		};
		
		that.callbacks("onSelect");
		
		return that["public"];
	};	
	
/**
 *  Default event delegation
 */	
    
    // Children
	that.$element.children().each(function(i, e){
		
		var $child = $(e).children();
		
		// Link
		if($child.eq(0).prop("tagName") == "A") {
			$(e).addClass("ch-bellows").children().addClass("ch-bellows-trigger");
			that.children.push( $child[0] );
			return;
		};
		
		// Bellows
		var list = {};
			list.uid = that.uid + "#" + i;
			list.type = "bellows";
			list.element = e;
			list.$element = $(e);
			
		// Selected -> It can be for example "2" or "2#1"
		if(conf.hasOwnProperty("selected")) {
			list.open = (typeof conf.selected == "number") ? conf.selected == i : (conf.selected.split("#")[0] == i) ? conf.selected.split("#")[1] : false;
		} else {
			list.open = false;
		};
			
		that.children.push( ch.bellows.call(list, that) );
	});
    
    
	return that;
	
};



/**
 * Accordion's content container.
 * @name Bellows
 * @class Bellows
 * @augments ch.Navs
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 */
ch.bellows = function(controller){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Bellows
     */ 
	var that = this;
	
	conf = {};
	
	that.conf = conf;
/**
 *	Inheritance
 */

    that = ch.navs.call(that);
    that.parent = ch.clon(that);
	that.controller = controller;
	
/**
 *  Protected Members
 */ 
	
	that.$container = that.$element.addClass("ch-bellows");
	
	that.$trigger = that.$container.children(":first");
	
    /**
     * Component's content.
     * @public
     * @name $content
     * @type {jQuery Object}
     * @memberOf ch.Bellows
     */
	that.$content = that.$trigger.next();
    
    /**
     * Shows component's content.
     * @public
     * @name show
     * @return {Chico-UI Object}
     * @memberOf ch.Bellows
     */
	that.show = function(event){

		that.prevent(event);

		// Toggle
		if (that.active) return that.hide(event);

		// Accordion behavior (hide last active)
		if (!controller.conf.hasOwnProperty("menu")) {

			$.each(controller.children, function(i, e){
				if (e.tagName == "A") return;
				if ( e.hasOwnProperty("active") && e.hasOwnProperty("element") ) {
					if (e.active == true && e.element !== that.element) { e.hide(); };
				}; 
			});
			
		};
		
		that.$content.slideDown("fast");
        
        that.parent.show(event);
        
        return that;
    };
    
    /**
     * Hides component's content.
     * @public
     * @name hide
     * @return {Chico-UI Object}
     * @memberOf ch.Bellows
     */
    that.hide = function(event){
    	that.prevent(event);
    	
    	// Toggle
    	if (!that.active) return;
    	
    	that.active = false;
    	
   		that.parent.hide(event);
    	that.$content.slideUp("fast");

        that.$trigger.removeClass("ch-" + that.type + "-on");
        
		if(!ch.utils.html.hasClass("ie6")) that.$content.slideUp("fast");
		
		that.callbacks("onHide");
		
        return that;
	};
	
    /**
     * Select component's content.
     * @public
     * @name select
     * @return {Chico-UI Object}
     * @memberOf ch.Bellows
     */
	that.select = function(child) {
		that.show();
		
		// L2 selection
		that.$content.find("a").eq( child ).addClass("ch-bellows-on");
	};
	
	
/**
 *  Default event delegation
 */	 	
	
	// Closed by default
	if(that.open) that.select( parseInt(that.open) ); else that.$content.addClass("ch-hide");
	
	// Trigger
	that.$trigger
		.addClass("ch-bellows-trigger")
		.bind("click", function(event){ that.show(event) })
		.append("<span class=\"ch-arrow\"> &raquo;</span>");

	// Content
	that.$content
		.addClass("ch-bellows-content")
		.bind("click", function(event){ event.stopPropagation(); });
	
	
	return that;
};


/**
 * Menu is a UI-Component.
 * @name Menu
 * @class Menu
 * @augments ch.Accordion
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 */

ch.menu = function(conf) {
    
    conf = conf || {};
	
	conf.menu = true;

	return ch.accordion.call(this, conf);

    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Menu
     */     
    
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Menu
     */
    
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Menu
     */
    
    /**
     * Select a specific children.
     * @public
     * @name select
     * @function
     * @memberOf ch.Menu
     */
    
};

ch.factory({ component: 'menu' });
