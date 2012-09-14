(function () {
	/**
	 * Creational patterns to create UI Components
	 * @methodOf ch
	 * @param {Object} klass
	 */
	function factory(klass) {
		// tiene que crear $.widget y $('').widget();
		var name = klass.prototype.name,
			map = {
				'string': 'message',
				'number': 'num',
				'function': 'fn'
			};

		exports[klass.name] = klass;

		// $.widget(options);
		$[name] = function (options) {
			return new klass(options);
		};

		// $(el).widget(options);
		$.fn[name] = function (options) {
			var widgets = [],
				widget,
				message = arguments[1],
				type = typeof options;

			if (options !== undefined && type !== 'object') {
				var parameter = options;
				options = {};
				options[map[type]] = parameter;

				// Could come a messages as a second argument
				if (typeof message === 'string') {
					options.message = message;
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