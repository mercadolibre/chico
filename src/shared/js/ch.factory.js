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
				'string': 'message',
				'number': 'num',
				'function': 'fn'
			};

		function checkParams($el, options) {

			var obj = {};

			// Only first parameter
			if (options === undefined) {
				// DOM object as first parameter
				if ($el instanceof $) {
					obj.$el = $el;
				// Options object as first parameter
				} else if (typeof $el === 'object') {
					obj.options = $el;
				}
			// Two spected parameters (a DOM element + options object)
			} else if ($el instanceof $ && typeof options === 'object') {
				obj.$el = $el;
				obj.options = options;
			}

			return obj;
		};

		/**
		 *
		 * @example
		 * ch.widget(el, options);
		 */
		exports[klass.name] = klass;

		/**
		 *
		 * @example
		 * $.widget(el, options);
		 * $.widget(el);
		 * $.widget(options);
		 * $.widget();
		 */
		$[name] = function ($el, options) {

			//var params = checkParams($el, options);

			//console.log(params.$el+","+ params.options);

			//return new klass(params.$el, params.options);
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
					data = $el.data(name),
					params;

				if (!data) {
					//params = checkParams($el, options);
					//new klass(params.$el, params.options);
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