/**
* Dropdown shows a list of options for navigation.
* @name Dropdown
* @class Dropdown
* @augments ch.Navs
* @requires ch.Positioner
* @see ch.Navs
* @see ch.Positioner
* @see ch.Expando
* @see ch.TabNavigator
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.open] Shows the dropdown open when component was loaded. By default, the value is false.
* @param {Boolean} [conf.icon] Shows an arrow as icon. By default, the value is true.
* @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or centered by default: "cm cm".
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are disable.
* @returns itself
* @factorized
* @exampleDescription Create a new dropdown without configuration.
* @example
* var widget = $(".example").dropdown();
* @exampleDescription Create a new dropdown with configuration.
* @example
* var widget = $(".example").dropdown({
*     "open": true,
*     "icon": false,
*     "points": "lt lt",
*     "fx": true
* });
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
*  Protected Members
*/
	/**
	* The component's trigger.
	* @protected
	* @name ch.Dropdown#$trigger
	* @type jQuery
	*/
	that.$trigger = (function () {

		var $el = that.$trigger;

		if (!that.$element.hasClass("ch-dropdown-skin")) {
			$el.addClass("ch-btn-skin ch-btn-small");
		}

		return $el;

	}());

	/**
	* The component's content.
	* @protected
	* @name ch.Dropdown#$content
	* @type jQuery
	*/
	that.$content = (function () {

		// jQuery Object
		var $content = that.$content
		// Prevent click on content (except links)
			.bind("click", function(event) {
				if ((event.target || event.srcElement).tagName === "A") {
					that.innerHide();
				}
				event.stopPropagation();
			})
		// WAI-ARIA properties
			.attr({ "role": "menu", "aria-hidden": "true" });

		// WAI-ARIA for options into content
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


	/**
	* Dropdown options.
	* @protected
	* @jQuery Collection
	* @name ch.Dropdown#$options
	*/
	that.$options = that.$content.find("a");


	/**
	* Keyboard events object.
	* @protected
	* @Object
	* @name ch.Dropdown#shortcuts
	*/
	that.shortcuts = (function () {
		var selected,
			map = {},
			arrow,
			optionsLength = that.$options.length,
			selectOption = function (key, event) {
				// Validations
				if (!that.active) { return; }

				// Prevent default behaivor
				that.prevent(event);

				// Sets the arrow that user press
				arrow = key.type;

				// Sets limits behaivor
				if (selected === (arrow === "down_arrow" ? optionsLength - 1 : 0)) { return; }

				// Unselects current option
				that.$options[selected].blur();

				if (arrow === "down_arrow") { selected += 1; } else { selected -= 1; }

				// Selects new current option
				that.$options[selected].focus();
			};

		return function () {
			// Keyboard support initialize
			selected = 0;

			// Item selected by mouseover
			$.each(that.$options, function (i, e) {
				$(e).bind("mouseenter", function () {
					that.$options[selected = i].focus();
				});
			});

			// Creates keyboard shortcuts map and binding events
			map["click " + ch.events.KEY.ESC] = function () { that.innerHide(); };
			map[ch.events.KEY.UP_ARROW + " " +ch.events.KEY.DOWN_ARROW] = selectOption;
			ch.utils.document.on(map);
		}
	}());

	/**
	* Shows component's content.
	* @protected
	* @function
	* @name ch.Dropdown#innerShow
	* @returns itself
	*/
	that.innerShow = function (event) {

		// Stop propagation
		that.prevent(event);

		// Z-index of content and updates aria values
		that.$content.css("z-index", ch.utils.zIndex += 1).attr("aria-hidden", "false");

		// Z-index of trigger over content (secondary / skin dropdown)
		if (that.$element.hasClass("ch-dropdown-skin")) { that.$trigger.css("z-index", ch.utils.zIndex += 1); }

		// Inheritance innerShow
		that.parent.innerShow(event);

		// Refresh position
		that.position("refresh");

		// Reset all dropdowns except itself
		$.each(ch.instances.dropdown, function (i, e) {
			if (e.uid !== that.uid) { e.hide(); }
		});

		that.$options[0].focus();

		return that;
	};

	/**
	* Hides component's content.
	* @protected
	* @function
	* @name ch.Dropdown#innerHide
	* @returns itself
	*/
	that.innerHide = function (event) {

		// Inheritance innerHide
		that.parent.innerHide(event);

		// Updates aria values
		that.$content.attr("aria-hidden", "true");

		return that;
	};

/**
*  Public Members
*/

	/**
	* @borrows ch.Object#uid as ch.Menu#uid
	*/

	/**
	* @borrows ch.Object#element as ch.Menu#element
	*/

	/**
	* @borrows ch.Object#type as ch.Menu#type
	*/

	/**
	* @borrows ch.Navs#show as ch.Dropdown#type
	*/

	/**
	* @borrows ch.Navs#hide as ch.Dropdown#hide
	*/

	/**
	* Positioning configuration.
	* @public
	* @name ch.Dropdown#position
	* @function
	*/
	that["public"].position = that.position;

/**
*  Default event delegation
*/

	ch.utils.avoidTextSelection(that.$trigger);

	// Inits keyboards support
	that.shortcuts();

	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Dropdown#ready
	* @event
	* @public
	* @since 0.8.0
	* @exampleDescription Following the first example, using <code>widget</code> as dropdown's instance controller:
	* @example
	* widget.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;
};

ch.factory("dropdown");