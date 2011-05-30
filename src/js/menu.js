/**
 * Menu is a UI-Component.
 * @name Menu
 * @class Menu
 * @augments ch.Controllers
 * @requires ch.Expando
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 */
 
ch.menu = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Menu
     */
	var that = this;
	
	conf = ch.clon(conf);
	
	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

	/**
     * Indicates witch child is opened
     * @private
     * @name selected
     * @type {Number}
     * @memberOf ch.Menu
     */
	var selected = conf.selected - 1;

	/**
     * Inits an Expando component on each list inside main HTML code snippet
     * @private
     * @name createLayout
     * @function
     * @memberOf ch.Menu
     */
	var createLayout = function(){
		
		// No slide efects for IE6 and IE7
		var efects = (ch.utils.html.hasClass("ie6") || ch.utils.html.hasClass("ie7")) ? false : true;
		
		// List elements
		that.$element.children().each(function(i, e){
			
			// Children of list elements
			var $child = $(e).children();
		
			// Anchor inside list
			if($child.eq(0).prop("tagName") == "A") {
				
				// Add class to list and anchor
				$(e).addClass("ch-bellows").children().addClass("ch-bellows-trigger");
				
				// Add anchor to that.children
				that.children.push( $child[0] );
				
				return;
			};
		
			// List inside list, inits an Expando
			var expando = $(e).expando({
				// Show/hide on IE6/7 instead slideUp/slideDown
				fx: efects,
				onShow: function(){
					// Updates selected tab when it's opened
					selected = i;
				}
			});
			
			// Add expando to that.children
			that.children.push( expando );

		});
	};
	
	/**
     * Opens specific Expando child and optionally grandson
     * @private
     * @name select
     * @function
     * @memberOf ch.Menu
     */
	var select = function(item){

		var child, grandson;
		
		// Split item parameter, if it's a string with hash
		if (typeof item == "string") {
			var sliced = item.split("#");
			child = sliced[0] - 1;
			grandson = sliced[1];
		
		// Set child when item is a Number
		} else {
			child = item - 1;
		};
		
		// Specific item of that.children list
		var itemObject = that.children[ child ];
		
		// Item as object
		if (itemObject.hasOwnProperty("uid")) {
			
			// Show this list
			itemObject.show();
			
			// Select grandson if splited parameter got a specific grandson
			if (grandson) $(itemObject.element).find("a").eq(grandson - 1).addClass("ch-menu-on");
			
			// Accordion behavior
			if (conf.accordion) {
				
				// Hides every that.children list that don't be this specific list item
				$.each(that.children, function(i, e){
					if(
						// If it isn't an anchor...
						(e.tagName != "A") &&
						// If there are an unique id...
						(e.hasOwnProperty("uid")) &&
						// If unique id is different to unique id on that.children list...
						(that.children[ child ].uid != that.children[i].uid)
					){
						// ...hide it
						e.hide();
					};
				});
				
			};
		
		// Item as anchor
		} else{
			// Just selects it
			that.children[ child ].addClass("ch-menu-on");
		};
		
		// onSelect callback
		that.callbacks("onSelect");

		return that;
	};
	
	/**
     * Binds controller's own click to expando triggers
     * @private
     * @name configureAccordion
     * @function
     * @memberOf ch.Menu
     */
	var configureAccordion = function(){

		$.each(that.children, function(i, e){
			$(e.element).find(".ch-expando-trigger").unbind("click").bind("click", function(){
				select(i + 1);
			});
		});
		
		return;
	};

/**
 *  Protected Members
 */

/**
 *  Public Members
 */
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Menu
     */ 	
	that["public"].uid = that.uid;
	
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Menu
     */
	that["public"].element = that.element;
	
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Menu
     */
	that["public"].type = that.type;
	
    /**
     * Select a specific children.
     * @public
     * @name select
     * @function
     * @memberOf ch.Menu
     */
	that["public"].select = function(item){
		select(item);

		return that["public"];
	};

/**
 *  Default event delegation
 */	
	
	// Sets component main class name
	that.$element.addClass('ch-menu');
	
	// Inits an Expando component on each list inside main HTML code snippet
	createLayout();
	
	// Accordion behavior
	if (conf.accordion) configureAccordion();
	
	// Select specific item if there are a "selected" parameter on component configuration object
    if (conf.hasOwnProperty("selected")) select(conf.selected);
    
	return that["public"];
	
};


/**
 * Accordion is a UI-Component.
 * @name Accordion
 * @class Accordion
 * @augments ch.Accordion
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 */

ch.accordion = function(conf) {
    
    conf = conf || {};
	
	conf.accordion = true;

	return ch.menu.call(this, conf);

    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Accordion
     */     
    
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Accordion
     */
    
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Accordion
     */
    
    /**
     * Select a specific children.
     * @public
     * @name select
     * @function
     * @memberOf ch.Accordion
     */
    
};

ch.factory({ component: "accordion" });
