
/**
* A navegable list of items, UI-Object.
* @name Dropdown
* @class Dropdown
* @augments ch.Navs
* @memberOf ch
* @param {object} conf Object with configuration properties
* @returns itself
*/

ch.dropdown = function(conf){


	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Dropdown#that
	* @type object
	*/
	var that = this;

	conf = ch.clon(conf);
	that.conf = conf;
	
/**
*	Inheritance
*/

	that = ch.navs.call(that);
	that.parent = ch.clon(that);

/**
*  Private Members
*/
	/**
	* Adds keyboard events.
	* @private
	* @function
	* @name ch.Dropdown#shortcuts
	*/
	var shortcuts = function(items){
		
		// Keyboard support
		var selected = 0;
		
		// Item selected by mouseover
		// TODO: It's over keyboard selection and it is generating double selection.
		$.each(items, function(i, e){
			$(e).bind("mouseenter", function(){
				selected = i;
				items.eq( selected ).focus();
			});
		});
		
		var selectItem = function(arrow, event){
			that.prevent(event);
			
			if(selected == ((arrow == "bottom") ? items.length - 1 : 0)) return;
			
			items.eq( selected ).blur();
			
			if(arrow == "bottom") selected += 1; else selected -= 1;
			
			items.eq( selected ).focus();
		};
		
		// Arrows
		ch.utils.document.bind(ch.events.KEY.UP_ARROW, function(x, event){ selectItem("up", event); });
		ch.utils.document.bind(ch.events.KEY.DOWN_ARROW, function(x, event){ selectItem("bottom", event); });
	};


/**
*  Protected Members
*/
	/**
	* The component's trigger.
	* @private
	* @name ch.Dropdown#$trigger
	* @type jQuery
	*/
	that.$trigger = that.$element.children().eq(0);
	/**
	* The component's content.
	* @private
	* @name ch.Dropdown#$content
	* @type jQuery
	*/
	that.$content = that.$trigger.next().detach(); // Save on memory;

	that.show = function(event){
		that.prevent(event);

		that.$content.css('z-index', ch.utils.zIndex ++);
		
		if (that.$element.hasClass("secondary")) { // Z-index of trigger over conten 
			that.$trigger.css('z-index', ch.utils.zIndex ++);
		}; 

		
		that.$element
			.addClass("ch-dropdown-on")
			.css('z-index', ch.utils.zIndex ++);

		that.parent.show(event);
		that.position("refresh");

		// Reset all dropdowns
		$.each(ch.instances.dropdown, function(i, e){ 
			if (e.uid !== that.uid) e.hide();
		});

		// Close events
		ch.utils.document.one("click " + ch.events.KEY.ESC, function(event){ that.hide(event); });
		// Close dropdown after click an option (link)
		that.$content.find("a").one("click", function(){ that.hide(); });

		// Keyboard support
		var items = that.$content.find("a");
			items.eq(0).focus(); // Select first anchor child by default

		if (items.length > 1){ shortcuts(items); };

		return that;
	};

	that.hide = function(event){
		that.prevent(event);

		that.parent.hide(event);
			that.$element.removeClass("ch-dropdown-on");

		// Unbind events
		ch.utils.document.unbind(ch.events.KEY.ESC + " " + ch.events.KEY.UP_ARROW + " " + ch.events.KEY.DOWN_ARROW);

		return that;
	};
	
/**
*  Public Members
*/
 
	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.Dropdown#uid
	* @type number
	*/
	
	/**
	* The element reference.
	* @public
	* @name ch.Dropdown#element
	* @type HTMLElement
	*/
	
	/**
	* The component's type.
	* @public
	* @name ch.Dropdown#type
	* @type string
	*/	
	
	/**
	* Shows component's content.
	* @public
	* @function
	* @name ch.Dropdown#show
	* @returns itself
	*/
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};

	/**
	* Hides component's content.
	* @public
	* @function
	* @name ch.Dropdown#hide
	* @returns itself
	*/ 
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
	/**
	* Positioning configuration.
	* @public
	* @function
	* @name ch.Dropdown#position
	*/


/**
*  Default event delegation
*/			

	that.configBehavior();
	
	that.$element.after( that.$content ); // Put content out of element
	ch.utils.avoidTextSelection(that.$trigger);
	
	if (that.$element.hasClass("secondary")) that.$content.addClass("secondary");
	
	// Prevent click on content (except links)
	that.$content.bind("click", function(event){ event.stopPropagation(); });
	
	// Position
	that.conf.position = {};
	that.conf.position.element = that.$content;
	that.conf.position.context = that.$trigger;
	that.conf.position.points = conf.points || "lt lb";
	that.conf.position.offset = "0 -1";

	return that;

};

ch.factory("dropdown");