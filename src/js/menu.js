/**
* Menu is a UI-Component.
* @name Menu
* @class Menu
* @augments ch.Controllers
* @requires ch.Expando
* @memberOf ch
* @param {object} conf Object with configuration properties
* @returns itself
*/

ch.menu = function(conf){

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Menu#that
	* @type object
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
*	Private Members
*/

	/**
	* Indicates witch child is opened
	* @private
	* @name ch.Menu#selected
	* @type number
	*/
	var selected = conf.selected - 1;

	/**
	* Inits an Expando component on each list inside main HTML code snippet
	* @private
	* @name ch.Menu#createLayout
	* @function
	*/
	var createLayout = function(){
		
		// No slide efects for IE6 and IE7
		var efects = (ch.utils.html.hasClass("ie6") || ch.utils.html.hasClass("ie7")) ? false : true;
		
		// List elements
		that.$element.children().each(function(i, e){
			// List element
			var $li = $(e);
									  
			// Children of list elements
			var $child = $li.children();
		
			// Anchor inside list
			if($child.eq(0).prop("tagName") == "A") {
				
				// Add attr role to match wai-aria
				$li.attr("role","presentation");
				
				// Add class to list and anchor
				$li.addClass("ch-bellows").children().addClass("ch-bellows-trigger");
				
				// Add anchor to that.children
				that.children.push( $child[0] );
				
				return;
			};
		
			// List inside list, inits an Expando
			var expando = $li.expando({
				// Show/hide on IE6/7 instead slideUp/slideDown
				fx: efects,
				onShow: function(){
					// Updates selected tab when it's opened
					selected = i;

					/**
					* Callback function
					* @name onSelect
					* @type {Function}
					* @memberOf ch.Menu
					*/
					that.callbacks.call(that, "onSelect");
					// new callback
					that.trigger("select");
				}
			});
			
			var childs = $li.children(),
				$triggerCont = $(childs[0]),
				$menu = $(childs[1]);
				if (!conf.accordion) {
					$menu.attr("role","menu");
					$menu.children().children().attr("role","menuitem");
				}
				$menu.children().attr("role","presentation");
				$triggerCont.attr("role","presentation");
			
			// Add expando to that.children
			that.children.push( expando );

		});
	};
	
	/**
	* Opens specific Expando child and optionally grandson
	* @private
	* @function
	* @name ch.Menu#select
	*/
	var select = function(item){

		var child, grandson;
		
		// Split item parameter, if it's a string with hash
		if (typeof item === "string") {
			var sliced = item.split("#");
			child = sliced[0] - 1;
			grandson = sliced[1];
		
		// Set child when item is a Number
		} else {
			child = item - 1;
		}

		// Specific item of that.children list
		var itemObject = that.children[ child ];
		
		// Item as object
		if (ch.utils.hasOwn(itemObject, "uid")) {
			
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
						(ch.utils.hasOwn(e, "uid")) &&
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

		return that;
	};
	
	/**
	* Binds controller's own click to expando triggers
	* @private
	* @name ch.Menu#configureAccordion
	* @function
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
*	Protected Members
*/

/**
*	Public Members
*/
	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.Menu#uid
	* @type number
	*/	
	
	/**
	* The element reference.
	* @public
	* @name ch.Menu#element
	* @type HTMLElement
	*/
	
	/**
	* The component's type.
	* @public
	* @name ch.Menu#type
	* @type string
	*/
	
	/**
	* Select a specific children.
	* @public
	* @name ch.Menu#select
	* @function
	*/
	that["public"].select = function(item){
		select(item);

		return that["public"];
	};

/**
*	Default event delegation
*/
	
	// Sets component main class name
	
	
	
	

	// Inits an Expando component on each list inside main HTML code snippet
	createLayout();

	// Accordion behavior
	if (conf.accordion) {
		// Sets the interface main class name for avoid
		configureAccordion();
		that.$element.addClass('ch-accordion')
	} else {
		that.$element.addClass('ch-menu');
		// Set the wai-aria for Menu
		that.$element.attr("role","navigation");
	}

	// Select specific item if there are a "selected" parameter on component configuration object
	if (ch.utils.hasOwn(conf, "selected")) select(conf.selected);

	return that;

};

ch.factory("menu");

/**
* Accordion is a UI-Component.
* @name Accordion
* @class Accordion
* @interface
* @augments ch.Menu
* @memberOf ch
* @param conf Object with configuration properties
* @returns itself
*/

ch.extend("menu").as("accordion");

	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.Accordion#uid
	* @type number
	*/
	
	/**
	* The element reference.
	* @public
	* @name ch.Accordion#element
	* @type HTMLElement
	*/
	
	/**
	* The component's type.
	* @public
	* @name ch.Accordion#type
	* @type string
	*/
	
	/**
	* Select a specific children.
	* @public
	* @name ch.Accordion#select
	* @function
	*/
