(function ($, ch) {
	'use strict';

	// Initial options to be merged with the user's options
	var defaults = {
		'method': 'GET',
		'params': '',
		'cache': true,
		'async': true
	};

	/**
	 * Creates a component to manage content through 3 ways: plain text, DOM elements, AJAX requests.
	 * @memberOf ch
	 * @class ch.Content
	 * @require ch.cache
	 * @returns {Object}
	 */
	function Content() {

		var that = this,
			// Merged options of each instance
			options,
			// The lastest data sent to the client. Used to return on the .get() method
			current,
			/**
			 * Allows to manage the widgets content.
			 * @namespace
			 */
			content = function ($content) {
				// Gets a new content
				if ($content === undefined) {
					return that.content.get();
				}

				// Configures a new content
				that.content.configure({
					'input': $content
				});

				// Sets the new content only if the component is active
				if (that.active) {
					that.content.set();
				}

				return that;

			};

		/**
		 * Send the result data to the "client".
		 * @private
		 */
		function postMessage(data) {
			// Update the lastest reference of data sent to the user
			content.onmessage(current = data);
			// TODO: Trigger the "message" event to allow multiple suscription
			// that.trigger('message', data)
		}

		/**
		 * Serves data from cache or AJAX.
		 * @private
		 */
		function getContentFromAJAX() {

			// When exists posibilities of find something saved into ch.cache...
			if (options.cache) {
				// Try to get data from cache
				var cached = ch.cache.get(options.input);
				// If there are data, then send to the client and avoid the AJAX request
				if (cached) { return postMessage(cached); }
			}

			$.ajax({
				'url': options.input,
				'type': options.method,
				'data': 'x=x' + ((options.params !== '') ? '&' + options.params : ''),
				'cache': options.cache,
				'async': options.async,
				'beforeSend': function (jqXHR) {
					// Set the AJAX default HTTP headers
					jqXHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				},
				'success': function (data) {
					// Grab the data on the cache if it's necessary
					if (options.cache) { ch.cache.set(options.input, data); }
					// Send the result data to the client
					postMessage(data);
				},
				'error': function (jqXHR, textStatus, errorThrown) {
					// Grab all the parameters into a JSON to send to the client
					var data = {
						'jqXHR': jqXHR,
						'textStatus': textStatus,
						'errorThrown': errorThrown
					};
					// Send a defined error message
					postMessage('<p>Error on ajax call.</p>');
					// Execute the 'onerror' method if exists
					if (ch.util.hasOwn(content, 'onerror')) {
						content.onerror(data);
					}
					// TODO: Trigger the "error" event to allow multiple suscription
					//that.trigger('error', data);
				}
			});
		}

		/**
		 * Merges the current options with the options specified by user.
		 * @name configure
		 * @methodOf content
		 * @param {Object} userOptions Options specified by user.
		 */
		content.configure = function (userOptions) {
			// Merge the defaults options with user options
			options = $.extend(userOptions, defaults);
			// Since second time, just merge the current options with user options
			content.configure = function (userOptions) {

				// Getter: return the current configuration (options)
				if (userOptions === undefined) {
					return options;
				}

				// Setter: Merge current options with the new ones
				$.extend(options, userOptions);

				return content;
			};

			return content;
		};

		/**
		 * Determines what kind of input have to use, and send to client plain text, DOM element or the result of an AJAX request.
		 * @name set
		 * @methodOf content
		 */
		content.set = function (userOptions) {

			if (userOptions !== undefined) {
				content.configure(userOptions);
			}

			// Input as string
			if (typeof options.input === 'string') {
				// Case 1: AJAX call
				if (ch.util.isUrl(options.input)) {
					getContentFromAJAX();
				// Case 2: Plain text
				} else {
					postMessage(options.input);
				}
			// Case 3: DOM element
			} else if (options.input instanceof $) {
				postMessage(options.input.detach().removeClass('ch-hide'));
			// Default: No message
			} else {
				postMessage(current);
			}

			return content;
		};

		/**
		 * Returns the last updated content.
		 * @name get
		 * @methodOf content
		 */
		content.get = function () {
			return current;
		};

		that.content = content;

	}

	ch.Content = Content;

}((this.jQuery || this.Zepto), this.ch));