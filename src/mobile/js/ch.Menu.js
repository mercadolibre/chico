/**
* Menu lets you organize the links by categories.
* @name Menu
* @class Menu
* @augments ch.Widget
* @requires ch.Expandable
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Number} [conf.selected] Selects a child that will be open when component was loaded.
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
*     "selected": 2
* });
*/
(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Menu($el, conf) {
		/**
		* Reference to a internal component instance, saves all the information and configuration properties.
		* @private
		* @name ch.Menu-that
		* @type object
		*/
		var that = this,

			/**
			* Reference to Parent Class.
			* @private
			* @name ch.Menu-parent
			* @type object
			*/
			parent;

		that.$element = $el;
		that.element = $el[0];
		that.type = that.type || 'menu';
		conf = conf || {};

		conf = ch.util.clone(conf);
		conf.icon = ch.util.hasOwn(conf, "icon") ? conf.icon : true;

		that.conf = conf;

		/**
		 * Inheritance
		 */
		// Borrow a constructor and return a parent
		that = ch.Widget.call(that);
		parent = ch.util.clone(that);;

		/**
		*  Private Members
		*/

		/**
		* Private reference to the element
		* @privated
		* @name ch.Menu-el
		* @type HTMLElement
		*/
		var el = that.element,

			/**
			* Private reference to the Zepto element
			* @privated
			* @name ch.Menu-$el
			* @type Zepto Object
			*/
			$el = that.$element,

			/**
			* Indicates witch child is opened
			* @private
			* @name ch.Menu-selected
			* @type number
			*/
			selected = (conf.selected) ? conf.selected - 1 : undefined,

			/**
			* Opens specific Expandable child and optionally grandson
			* @private
			* @function
			* @name ch.Menu-select
			*/
			select = function (child) {
				var child = child - 1,
					c = that.children[child];

				if (child > that.children.length) { return; }

				if (c.nodeType) {

					if (c.firstElementChild.tagName === "A") {
						win.location.href = c.firstElementChild.href;
					}

					return;
				}

				that.children[child].show();
			};

	/**
	*  Protected Members
	*/

		/**
		* The component's triggers.
		* @protected
		* @name ch.Menu#trigger
		* @type HTMLElement
		*/
		that.triggers = el.children;

		/**
		* Collection of expandables and bellows.
		* @protected
		* @name ch.Menu#children
		* @type Array
		*/
		that.children = [];


		/**
		* Inits an Menu component on each list inside main HTML code snippet
		* @protected
		* @name ch.Menu#createBellows
		* @function
		*/
		that.cretateBellows = function (bellows) {
			var $bellows = $(bellows);

			$bellows
				.addClass("ch-bellows")
				.children(":first-child")
					.addClass("ch-bellows-trigger");

			that.children.push($bellows);
		};

		/**
		* Inits an Menu component on each list inside main HTML code snippet
		* @protected
		* @name ch.Menu#createLayout
		* @function
		*/
		that.createLayout = function () {

			$.each(that.triggers, function (i, e) {
				var c = e.children;

				if (c.length === 1) {
					that.cretateBellows(e);

					return;
				}

				that.children.push(
					$(e).expandable({
						"icon": conf.icon
					})
				);
			});
		};

		/**
		* Create component's layout and add behaivor
		* @protected
		* @function
		* @name ch.Menu#configBehavior
		*/
		that.configBehavior = function () {

			$el.addClass("ch-"+that.type);

			// ARIA
			el.setAttribute("role", "navigation");

		};


	/**
	*  Public Members
	*/

		/**
		* @borrows ch.Widget#uid as ch.Menu#uid
		*/

		/**
		* @borrows ch.Widget#el as ch.Menu#el
		*/

		/**
		* @borrows ch.Widget#type as ch.Menu#type
		*/

		/**
		* @borrows ch.Widget#emit as ch.Menu#emit
		*/

		/**
		* @borrows ch.Widget#on as ch.Menu#on
		*/

		/**
		* @borrows ch.Widget#once as ch.Menu#once
		*/

		/**
		* @borrows ch.Widget#off as ch.Menu#off
		*/

		/**
		* @borrows ch.Widget#offAll as ch.Menu#offAll
		*/

		/**
		* @borrows ch.Widget#setMaxListeners as ch.Menu#setMaxListeners
		*/


		/**
		* Select a specific children.
		* @public
		* @name ch.Menu#select
		* @function
		* @param {Number} [item] The number of the item to be selected
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
	*  Default behaivor
	*/

		that.createLayout();
		that.configBehavior();


		/**
		* Emit when the component is ready to use.
		* @name ch.Menu#ready
		* @event
		* @public
		* @example
		* // Following the first example, using 'me' as menu's instance controller:
		* me.on("ready",function () {
		*	this.show();
		* });
		*/
		window.setTimeout(function(){ that.emit("ready")}, 50);

		return that['public'];
	}

	Menu.prototype.name = 'menu';
	Menu.prototype.constructor = Menu;

	ch.factory(Menu);

}(this, this.Zepto, this.ch));