/**
 * Menu lets you organize the links by categories.
 * @name Menu
 * @class Menu
 * @augments ch.Widget
 * @requires ch.Expandable
 * @memberOf ch
 * @param {Object} [options] Object with configuration properties.
 * @param {Number} [options.selected] Selects a child that will be open when component was loaded.
 * @param {Boolean} [options.fx] Enable or disable UI effects. By default, the effects are disable.
 * @returns itself
 * @factorized
 * @see ch.Expandable
 * @see ch.Widget
 * @exampleDescription Create a new menu without configuration.
 * @example
 * var widget = $('.example').menu();
 * @exampleDescription Create a new menu with configuration.
 * @example
 * var widget = $('.example').menu({
 *     'selected': 2,
 *     'fx': true
 * });
 */
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Menu($el, options) {

		this.init($el, options);

		/**
		 * Private Members
		 */

		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @name ch.Menu#that
		 * @type object
		 */
		var that = this,

			/**
			 * Inits an Expandable component on each list inside main HTML code snippet
			 * @private
			 * @name ch.Menu#createLayout
			 * @function
			 */
			createLayout = function () {

				// No slide efects for IE8-
				var fx = ($html.hasClass('lt-ie8')) ? false : that.options.fx;

				// List elements
				that.$el.children().each(function(i, e){
					// List element
					var $li = $(e);

					// Children of list elements
					var $child = $li.children();

					// Anchor inside list
					if($child.eq(0).prop('tagName') == 'A') {

						// Add attr role to match wai-aria
						$li.attr('role', 'presentation');

						// Add class to list and anchor
						$li.addClass('ch-bellows').children().addClass('ch-bellows-trigger');

						// Add anchor to that.children
						that.children.push( $child[0] );

						return;
					};

					// List inside list, inits an Expandable
					var expandable = $li.expandable({
						'icon': that.options.icon,
						// Show/hide on IE8- instead slideUp/slideDown
						'fx': fx,
						'onShow': function () {
							// Updates selected tab when it's opened
							that.selected = i;

							/**
							 * Callback function
							 * @name onSelect
							 * @type {Function}
							 * @memberOf ch.Menu
							 */
							that.callbacks.call(that, 'onSelect');

							// new callback
							/**
							 * It is triggered when the a fold is selected by the user.
							 * @name ch.Menu#select
							 * @event
							 * @public
							 * @exampleDescription When the user select
							 * @example
							 * widget.on('select',function(){
							 *     app.off();
							 * });
							 */
							that.emit('select');
						}
					});

					var childs = $li.children(),
						$triggerCont = $(childs[0]),
						$menu = $(childs[1]);
						if (!that.options.accordion) {
							$menu.attr('role', 'menu');
							$menu.children().children().attr('role', 'menuitem');
							$menu.children().attr('role', 'presentation');
						}
						$triggerCont.attr('role', 'presentation');

					// Add expandable to that.children
					that.children.push(expandable);

				});
			},

			/**
			 * Opens specific Expandable child and optionally grandson
			 * @private
			 * @function
			 * @name ch.Menu#select
			 * @ignore
			 */
			select = function (item) {

				var child, grandson;

				// Split item parameter, if it's a string with hash
				if (typeof item === 'string') {
					var sliced = item.split('#');
					child = sliced[0] - 1;
					grandson = sliced[1];

				// Set child when item is a Number
				} else {
					child = item - 1;
				}

				// Specific item of that.children list
				var itemObject = that.children[child];

				// Item as object
				if (ch.util.hasOwn(itemObject, 'uid')) {

					// Show this list
					itemObject.show();

					// Select grandson if splited parameter got a specific grandson

					if (grandson) {
						itemObject.$el.find('a').eq(grandson - 1).addClass('ch-menu-on');
					}

					// Accordion behavior
					if (that.options.accordion) {

						// Hides every that.children list that don't be this specific list item
						$.each(that.children, function (i, e) {
							if(
								// If it isn't an anchor...
								(e.tagName != 'A') &&
								// If there are an unique id...
								(ch.util.hasOwn(e, 'uid')) &&
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
					that.children[child].addClass('ch-menu-on');
				};

				return this;
			},

			/**
			 * Binds controller's own click to expandable triggers
			 * @private
			 * @function
			 */
			configureAccordion = function () {
				$.each(that.children, function (i, e) {
					if (ch.util.hasOwn(e, '$el')) {
						e.$el.find('.ch-expandable-trigger').off('click').on('click', function () {
							select(i + 1);
						});
					}
				});
			};

	/**
	 * Protected Members
	 */
		/**
		 * Collection of children.
		 * @name ch.Form#children
		 * @type {Array}
		 */
		this.children = [];

		/**
		 * Indicates witch child is opened
		 * @private
		 * @name ch.Menu#selected
		 * @type number
		 */
		this.selected = this.options.selected - 1;

		/**
		 * Select a specific children.
		 * @public
		 * @name select
		 * @name ch.Menu
		 * @param item The number of the item to be selected
		 * @returns
		 */
		this.select = function (item) {
			// Getter
			if (!item) {
				if (isNaN(this.selected)) {
					return '';
				}
				return this.selected + 1;
			}

			// Setter
			select(item);

			return this;
		};

	/**
	 * Default event delegation
	 */

		// Sets component main class name

		// Inits an expandable component on each list inside main HTML code snippet
		createLayout();

		// Accordion behavior
		if (this.options.accordion) {
			// Sets the interface main class name for avoid
			configureAccordion();
		} else {
			// Set the wai-aria for Menu
			this.$el.attr('role', 'navigation');
		}

		this.$el.addClass('ch-' + this['name'] + (ch.util.hasOwn(this.options, 'classes') ? ' ' + this.options.classes : ''));

		// Select specific item if there are a "selected" parameter on component configuration object
		if (ch.util.hasOwn(this.options, 'selected')) { select(this.options.selected); }

		/**
		 * Triggers when the component is ready to use (Since 0.8.0).
		 * @name ch.Menu#ready
		 * @event
		 * @public
		 * @since 0.8.0
		 * @exampleDescription Following the first example, using <code>widget</code> as menu's instance controller:
		 * @example
		 * widget.on('ready',function () {
		 *	this.select();
		 * });
		 */
		setTimeout(function(){ that.emit('ready')}, 50);

		return this;
	}

	/**
	 * Private
	 */
	var $html = $('html'),

		/**
		 * Inheritance
		 */
		parent = ch.util.inherits(Menu, ch.Widget);

	/**
	 * Prototype
	 */
	Menu.prototype.name = 'menu';

	Menu.prototype.constructor = Menu;

	Menu.prototype.defaults = {
		'icon': true,
		'fx': true,
		'accordion': false
	};

	ch.factory(Menu);

}(this, this.jQuery, this.ch));