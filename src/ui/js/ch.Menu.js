/**
* Menu lets you organize the links by categories.
* @name Menu
* @class Menu
* @augments ch.Widget
* @requires ch.Expandable
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Number} [conf.selected] Selects a child that will be open when component was loaded.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are disable.
* @returns itself
* @factorized
* @see ch.Expandable
* @see ch.Widget
* @exampleDescription Create a new menu without configuration.
* @example
* var widget = $(".example").menu();
* @exampleDescription Create a new menu with configuration.
* @example
* var widget = $(".example").menu({
*     "selected": 2,
*     "fx": true
* });
*/
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	var $html = $("html");

	function Menu($el, conf) {
		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @name ch.Menu#that
		 * @type object
		 */
		var that = this;

		that.$element = $el;
		that.element = $el[0];
		that.type = 'menu';
		conf = conf || {};

		conf = ch.util.clone(conf);
		conf.icon = ch.util.hasOwn(conf, "icon") ? conf.icon : true;

		that.conf = conf;

		/**
		 * Inheritance
		 */

		that = ch.Widget.call(that);
		that.parent = ch.util.clone(that);

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
		* Inits an Expandable component on each list inside main HTML code snippet
		* @private
		* @name ch.Menu#createLayout
		* @function
		*/
		var createLayout = function(){

			// No slide efects for IE8-
			var efects = ($html.hasClass("lt-ie8")) ? false : true;

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

				// List inside list, inits an Expandable
				var expandable = $li.expandable({
					icon: conf.icon,
					// Show/hide on IE8- instead slideUp/slideDown
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
						/**
						* It is triggered when the a fold is selected by the user.
						* @name ch.Menu#select
						* @event
						* @public
						* @exampleDescription When the user select
						* @example
						* widget.on("select",function(){
						*     app.off();
						* });
						*/
						that.trigger("select");
					}
				});

				var childs = $li.children(),
					$triggerCont = $(childs[0]),
					$menu = $(childs[1]);
					if (!conf.accordion) {
						$menu.attr("role","menu");
						$menu.children().children().attr("role", "menuitem");
						$menu.children().attr("role", "presentation");
					}
					$triggerCont.attr("role","presentation");

				// Add expandable to that.children
				that.children.push( expandable );

			});
		};

		/**
		* Opens specific Expandable child and optionally grandson
		* @private
		* @function
		* @name ch.Menu#select
		* @ignore
		*/
		var select = function (item) {

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
			if (ch.util.hasOwn(itemObject, "uid")) {

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
							(ch.util.hasOwn(e, "uid")) &&
							// If unique id is different to unique id on that.children list...
							(that.children[child].uid != that.children[i].uid)
						){
							// ...hide it
							e.hide();
						};
					});

				};

			// Item as anchor
			} else{
				// Just selects it
				that.children[child].addClass("ch-menu-on");
			};

			return that;
		};

		/**
		* Binds controller's own click to expandable triggers
		* @private
		* @name ch.Menu#configureAccordion
		* @function
		*/
		var configureAccordion = function(){

			$.each(that.children, function(i, e){
				$(e.element).find(".ch-expandable-trigger").unbind("click").bind("click", function () {
					select(i + 1);
				});
			});

			return;
		};

	/**
	*	Protected Members
	*/
		/**
		* Collection of children.
		* @name ch.Form#children
		* @type {Array}
		*/
		that.children = [];


	/**
	*	Public Members
	*/
		/**
		 * @borrows ch.Widget#uid as ch.Menu#uid
		 * @borrows ch.Widget#element as ch.Menu#element
		 * @borrows ch.Widget#type as ch.Menu#type
		 */

		/**
		* Select a specific children.
		* @public
		* @name select
		* @name ch.Menu
		* @param item The number of the item to be selected
		* @returns
		*/
		that["public"].select = function (item) {
			// Getter
			if (!item) {
				if (isNaN(selected)) {
					return "";
				}
				return selected + 1;
			}

			// Setter
			select(item);
			return that["public"];
		};

	/**
	*	Default event delegation
	*/

		// Sets component main class name

		// Inits an expandable component on each list inside main HTML code snippet
		createLayout();

		// Accordion behavior
		if (conf.accordion) {
			// Sets the interface main class name for avoid
			configureAccordion();
		} else {
			// Set the wai-aria for Menu
			that.$element.attr("role", "navigation");
		}

		that.$element.addClass('ch-' + that.type + (ch.util.hasOwn(conf, 'classes') ? ' ' + conf.classes : ''));

		// Select specific item if there are a "selected" parameter on component configuration object
		if (ch.util.hasOwn(conf, "selected")) { select(conf.selected); }

		/**
		* Triggers when the component is ready to use (Since 0.8.0).
		* @name ch.Menu#ready
		* @event
		* @public
		* @since 0.8.0
		* @exampleDescription Following the first example, using <code>widget</code> as menu's instance controller:
		* @example
		* widget.on("ready",function () {
		*	this.select();
		* });
		*/
		setTimeout(function(){ that.trigger("ready")}, 50);

		return that['public'];
	}

	Menu.prototype.name = 'menu';
	Menu.prototype.constructor = Menu;

	ch.factory(Menu);

}(this, this.jQuery, this.ch));