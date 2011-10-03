/**
* A navegable list of items, UI-Object.
* @name Dropdown
* @class Dropdown
* @augments ch.Navs
* @memberOf ch
* @param {object} conf Object with configuration properties
* @returns itself
*/

ch.dropdown = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Dropdown#that
	* @type object
	*/
	var that = this;

	conf = ch.clon(conf);
	
	conf.reposition = ch.utils.hasOwn(conf, "reposition") ? conf.reposition : true;
	
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
	var shortcuts = function (items) {

		// Keyboard support
		var selected = 0;

		// Item selected by mouseover
		// TODO: It's over keyboard selection and it is generating double selection.
		$.each(items, function (i, e) {
			$(e).bind("mouseenter", function () {
				selected = i;
				items.eq(selected).focus();
			});
		});

		var selectItem = function (arrow, event) {
			that.prevent(event);

			if (selected === (arrow === "bottom" ? items.length - 1 : 0)) { return; }

			items.eq(selected).blur();

			if (arrow === "bottom") { selected += 1; } else { selected -= 1; }
			
			items.eq(selected).focus();
		};
		
		// Arrows
		ch.utils.document.bind(ch.events.KEY.UP_ARROW, function (x, event) { selectItem("up", event); });
		ch.utils.document.bind(ch.events.KEY.DOWN_ARROW, function (x, event) { selectItem("bottom", event); });
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
	that.$content = (function () {
		
		// jQuery Object
		var $content = that.$trigger.next()
		// Visible
			.removeClass("ch-hide")
		// Prevent click on content (except links)
			.bind("click", function(event) {
				if ((event.target || event.srcElement).tagName === "A") {
					that.hide();
				}

				event.stopPropagation();
			})
		// WAI-ARIA properties
			.attr({ "role": "menu", "aria-hidden": "true" });
		
		// WAI-ARIA for items into content
		$content.children("a").attr("role", "menuitem");

		// Position
		that.position = ch.positioner({
			"element": $content,
			"context": that.$trigger,
			"points": (conf.points || "lt lb"),
			"offset": "0 -1",
			"reposition": conf.reposition
		});
		
		return $content;
	}());


	that.show = function (event) {
		
		// Stop propagation
		that.prevent(event);
		
		// Z-index of content
		that.$content.css("z-index", ch.utils.zIndex += 1).attr("aria-hidden", "false");
		
		// Z-index of trigger over content (secondary dropdown)
		if (that.$element.hasClass("secondary")) { that.$trigger.css("z-index", ch.utils.zIndex += 1); }
		
		// Inheritance show
		that.parent.show(event);
		
		// Refresh position
		that.position("refresh");

		// Reset all dropdowns except itself
		$.each(ch.instances.dropdown, function (i, e) { 
			if (e.uid !== that.uid) { e.hide(); }
		});

		// Close events
		ch.utils.document.one("click " + ch.events.KEY.ESC, function (event) { that.hide(event); });

		// Keyboard support
		var items = that.$content.find("a");
		// Select first anchor child by default
			items.eq(0).focus();

		if (items.length > 1) { shortcuts(items); };

		return that;
	};

	that.hide = function (event) {
		that.prevent(event);

		that.parent.hide(event);
		
		that.$content.attr("aria-hidden", "true");

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
	that["public"].show = function () {
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
	that["public"].hide = function () {
		that.hide();
		
		return that["public"];
	};
	
	/**
	* Positioning configuration.
	* @public
	* @function
	* @name ch.Dropdown#position
	*/
	that["public"].position = that.position;

/**
*  Default event delegation
*/			

	that.configBehavior();

	ch.utils.avoidTextSelection(that.$trigger);

	return that;
};

ch.factory("dropdown");