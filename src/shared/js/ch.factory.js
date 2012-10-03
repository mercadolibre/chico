(function () {
	/**
	 * Creational patterns to create UI Components
	 * @methodOf ch
	 * @param {Object} klass
	 */
	function factory(klass) {
		// $.widget y $('').widget();
		var name = klass.prototype.name,
			map = {
				'string': 'content',
				'object': 'content', // Only if it's an instanceof $.
				'number': 'num',
				'function': 'fn'
			};

		/**
		 *
		 * @example
		 * ch.widget(el, options);
		 */
		exports[klass.name || (name[0].toUpperCase() + name.substr(1))] = klass;

		/**
		 *
		 * @example
		 * $.widget(el, options);
		 * $.widget(el);
		 * $.widget(options);
		 * $.widget();
		 */
		$[name] = function ($el, options) {
			// Only first parameter with the options object
			// TODO: This should be done by the init() method on each widget
			if (options === undefined && typeof $el === 'object') {
				options = $el;
				$el = undefined;
			}

			return new klass($el, options);
		};

		/**
		 *
		 * @example
		 * $(el).widget(options);
		 * $(el).widget(string);
		 * $(el).widget(number);
		 * $(el).widget(number, string);
		 * $(el).widget(function);
		 * $(el).widget(function, string);
		 * $(el).widget();
		 */
		$.fn[name] = function (options) {
			var widgets = [],
				widget,
				content = arguments[1],
				type = typeof options;

			// $(el).widget(string); || $(el).widget(number); || $(el).widget(fn); || $(el).widget($(selector));
			if ((options !== undefined && type !== 'object') || options instanceof $) {
				var parameter = options;
				options = {};
				options[map[type]] = parameter;

				// Could come a content as a second argument
				if (typeof content === 'string' || content instanceof $) {
					options.content = content;
				}
			}

			// http://docs.jquery.com/Plugins/Authoring
			$.each(this, function (i, el) {
				var $el = $(el),
					data = $el.data(name),
					params;

				if (!data) {
					new klass($el, options);
					$el.data(name, widget);

				} else {
					widget = data;
				}

				widgets.push(widget);
			});

			return ((widgets.length > 1) ? widgets : widgets[0]);
		};
	}

	exports.factory = factory;
}());