(function () {
	/**
	 * Reference to determine what "options" member should be created using the type of parameter that is received through the $-plugin.
	 * @namespace
	 */
	// TODO: This should be in the init() method of each widget
	var map = {
		/**
		 * When a type String is received, an options.content should be created.
		 * @memberOf map
		 * @type {String}
		 */
		'string': 'content',
		/**
		 * When a type Object and instance of $ is received, an options.content should be created.
		 * @memberOf map
		 * @type {String}
		 */
		'object': 'content',
		/**
		 * When a type Number is received, an options.num should be created.
		 * @memberOf map
		 * @type {String}
		 */
		'number': 'num',
		/**
		 * When a type Function is received, an options.fn should be created.
		 * @memberOf map
		 * @type {String}
		 */
		'function': 'fn'
	};

	/**
	 * Method in change of expose a friendly interface of the Chico constructors.
	 * @methodOf ch
	 * @param {Object} Klass Direct reference to the constructor from where the $-plugin will be created.
	 * @see <a href="http://docs.jquery.com/Plugins/Authoring" target="_blank">http://docs.jquery.com/Plugins/Authoring</a>
	 */
	function factory(Klass) {
		/**
		 * Identification of the constructor, in lowercases.
		 * @type {String}
		 */
		var name = Klass.prototype.name,
			/**
			 * Reference to the class name. When it's a interface, take its constructor name via the "preset" property.
			 * @type {String}
			 */
			constructorName = Klass.prototype.preset || name;

		/**
		 * The class constructor exposed directly into the "ch" namespace.
		 * @exampleDescription Creating a widget instance by specifying a query selector and a configuration object.
		 * @example
		 * ch.Widget($('#example'), {
		 *     'key': 'value'
		 * });
		 */
		// Uses the function.name property (non-standard) on the newest browsers OR
		// uppercases the first letter from the identification name of the constructor
		ch[(name.charAt(0).toUpperCase() + name.substr(1))] = Klass;

		/**
		 * The class constructor exposed into the "$" namespace.
		 * @exampleDescription Creating a widget instance by specifying a query selector and a configuration object.
		 * @example
		 * $.widget($('#example'), {
		 *     'key': 'value'
		 * });
		 * @exampleDescription Creating a widget instance by specifying only a query selector. The default options of each widget will be used.
		 * @example
		 * $.widget($('#example')});
		 * @exampleDescription Creating a widget instance by specifying only a cofiguration object. It only works on compatible widgets, when those doesn't depends on a element to be created.
		 * @example
		 * $.widget({
		 *     'key': 'value'
		 * });
		 * @exampleDescription Creating a widget instance by no specifying parameters. It only works on compatible widgets, when those doesn't depends on a element to be created. The default options of each widget will be used.
		 * @example
		 * $.widget();
		 */
		$[name] = function ($el, options) {
			// Create a new instance of the constructor and return it
			return new Klass($el, options);
		};

		/**
		 * The class constructor exposed as a "$" plugin.
		 * @exampleDescription Creating a widget instance by specifying only a cofiguration object.
		 * @example
		 * $('#example').widget({
		 *     'key': 'value'
		 * });
		 * @exampleDescription Creating a widget instance by specifying only a query selector as parameter. It will be into the "options" object as "content".
		 * @example
		 * $('#example').widget($('#anotherElement'));
		 * @exampleDescription Creating a widget instance by specifying only a string parameter. It will be into the "options" object as "content".
		 * @example
		 * $('#example').widget('A string parameter');
		 * @exampleDescription Creating a widget instance by specifying only a numeric parameter. It will be into the "options" object as "num".
		 * @example
		 * $('#example').widget(123);
		 * @exampleDescription Creating a widget instance by specifying a numeric parameter followed by a string parameter. These will be into the "options" object as "num" and "content" respectively.
		 * @example
		 * $('#example').widget(123, 'A string parameter');
		 * @exampleDescription Creating a widget instance by specifying only a function as parameter. It will be into the "options" object as "fn".
		 * @example
		 * $('#example').widget(function () { ... });
		 * @exampleDescription Creating a widget instance by specifying a function followed by a string parameter. These will be into the "options" object as "fn" and "content" respectively.
		 * @example
		 * $('#example').widget(function () { ... }, 'A string parameter');
		 * @exampleDescription Creating a widget instance by no specifying parameters. The default options of each widget will be used.
		 * @example
		 * $('#example').widget();
		 */
		$.fn[name] = function (options) {
			// Collection with each instanced widget
			var widgets = [],
				// Each instance of the widget
				widget,
				// What kind of parameter is "options"
				type = typeof options;

			// Put the specified parameters into corresponding options object
			// when the "options" parameter is not the configuration object or
			// it's a query selector
			// TODO: This must be in the init() method of each widget
			if ((options !== undefined && type !== 'object') || ch.util.is$(options)) {
				// Grab temporally the received parameter
				var parameter = options,
					// Grab the second parameter
					content = arguments[1];
				// Empty "options" to use it as the real configuration object
				options = {};
				// Put the received parameter into options object with correspondig name getted from the map
				options[map[type]] = parameter;

				// Could have a content as a second argument when it receives a string or a query selector
				if (typeof content === 'string' || ch.util.is$(content)) {
					options.content = content;
				}
			}

			// Analize every match of the main query selector
			$.each(this, function (i, el) {
				// Get into the "$" scope
				var $el = $(el),
					// Try to get the "data" reference to this widget related to the element
					data = $el.data(constructorName);

				// When this widget isn't related to the element via data, create a new instance and save
				if (!data) {
					// Create a new instance of the widget
					widget = new Klass($el, options);
					// Save the reference to this instance into the element data
					$el.data(constructorName, widget);
				// When this widget is related to the element via data, return it
				} else {
					// Get the data as the widget itself
					widget = data;
					// By dispatching an event, widgets can know when it already exists
					if (ch.util.hasOwn(widget, 'emit')) {
						widget.emit('exists', {
							'type': name,
							'options': options
						});
					}
				}

				// Add the widget reference to the final collection
				widgets.push(widget);
			});

			// Return the instance/instances of widgets
			return ((widgets.length > 1) ? widgets : widgets[0]);
		};
	}

	// Export
	ch.factory = factory;
}());