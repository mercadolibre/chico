/**
* Countdown counts the maximum of characters that user can enter in a form control. Countdown could limit the possibility to continue inserting charset.
* @name Countdown
* @class Countdown
* @augments ch.Controls
* @see ch.Controls
* @memberOf ch
* @param {Object} conf Object with configuration properties.
* @param {Number} conf.max Number of the maximum amount of characters user can input in form control.
* @param {String} [conf.plural] Message of remaining amount of characters, when it's different to 1. The variable that represents the number to be replaced, should be a hash. By default this parameter is "# characters left.".
* @param {String} [conf.singular] Message of remaining amount of characters, when it's only 1. The variable that represents the number to be replaced, should be a hash. By default this parameter is "# character left.".
* @returns itself
* @factorized
* @exampleDescription Create a simple Countdown. Then <code>widget</code> is a reference to the Countdown instance controller.
* @example
* var widget = $(".some-form-control").countdown(500);
* @exampleDescription Create a Countdown with configuration.
* @example
* var widget = $(".some-form-control").countdown({
*     "max": 500,
*     "plural": "Restan # caracteres.",
*     "singular": "Resta # caracter."
* });
*/
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	var setTimeout = window.setTimeout;

	function Countdown($el, conf) {

		/**
		* Reference to an internal component instance, saves all the information and configuration properties.
		* @private
		* @name ch.Countdown#that
		* @type Object
		*/
		var that = this;

		that.$element = $el;
		that.element = $el[0];
		that.type = 'countdown';
		conf = conf || {};

		conf = ch.util.clone(conf);

		// Configuration by default
		// Max length of content
		conf.max = parseInt(conf.max) || conf.num || parseInt(conf.content) || 500;

		// Messages
		conf.plural = conf.plural || "# characters left.";
		conf.singular = conf.singular || "# character left.";

		that.conf = conf;

	/**
	*	Inheritance
	*/

		that = ch.Controls.call(that);
		that.parent = ch.util.clone(that);

	/**
	*	Private Members
	*/
		/**
		* Length of value of form control.
		* @private
		* @name ch.Countdown#contentLength
		* @type Number
		*/
		var contentLength = that.element.value.length,

		/**
		* Amount of free characters until full the field.
		* @private
		* @name ch.Countdown#remaining
		* @type Number
		*/
			remaining = conf.max - contentLength,

		/**
		* Change the visible message of remaining characters.
		* @private
		* @name ch.Countdown#updateRemaining
		* @function
		* @param num {Number} Remaining characters.
		*/
			updateRemaining = (function () {

				// Singular or Plural message depending on amount of remaining characters
				var message = (remaining === 1) ? conf.singular : conf.plural,

				// Append to container to allow icon aside inputs
					$container = that.$element.parent(),

				// Create the DOM Element when message will be shown
					$display = $("<p class=\"ch-form-hint\">" + message.replace("#", remaining) + "</p>").appendTo($container);

				// Real function
				return function (num) {

					// Singular or Plural message depending on amount of remaining characters
					var message = (num !== 1 ? conf.plural : conf.singular).replace(/\#/g, num);

					// Update DOM text
					$display.text(message);

					// Update amount of remaining characters
					remaining = num;

				};

			}());

	/**
	*	Protected Members
	*/

		/**
		* Process input of data on form control and updates remaining amount of characters or limits the content length
		* @protected
		* @name ch.Countdown#process
		* @function
		*/
		that.process = function () {

			var len = that.element.value.length;

			// Countdown or Countup
			if ((len > contentLength && len <= conf.max) || (len < contentLength && len >= 0)) {

				// Change visible message of remaining characters
				updateRemaining(remaining - (len - contentLength));

				// Update length of value of form control.
				contentLength = len;

			// Limit Count
			} else if (len > contentLength && len > conf.max) {

				// Cut the string value of form control
				that.element.value = that.element.value.substr(0, conf.max);

			};

		};


	/**
	*	Public Members
	*/

		/**
		 * @borrows ch.Widget#uid as ch.Menu#uid
		 * @borrows ch.Widget#element as ch.Menu#element
		 * @borrows ch.Widget#type as ch.Menu#type
		 */

	/**
	*	Default event delegation
	*/

		// Bind process function to element
		that.$element.on("keyup keypress paste", function () { setTimeout(that.process, 0); });

		/**
		* Triggers when component is ready to use.
		* @name ch.Countdown#ready
		* @event
		* @public
		* @exampleDescription Following the first example, using <code>widget</code> as Countdown's instance controller:
		* @example
		* widget.on("ready",function () {
		*	this.element;
		* });
		*/
		setTimeout(function () { that.trigger("ready"); }, 50);

		return that['public'];
	};

	Countdown.prototype.name = 'countdown';
	Countdown.prototype.constructor = Countdown;

	ch.factory(Countdown);

}(this, this.jQuery, this.ch));