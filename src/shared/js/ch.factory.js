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

		exports[klass.name || (name[0].toUpperCase() + name.substr(1))] = klass;

		// $.widget(options);
		$[name] = function (options) {
			return new klass(options);
		};

		// $(el).widget(options);
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
					data = $el.data(name);

				if (!data) {
					widget = new klass($el, options);
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