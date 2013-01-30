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



	function Countdown($el, options) {

		/**
		* Reference to an internal component instance, saves all the information and configuration properties.
		* @private
		* @name ch.Countdown#that
		* @type Object
		*/
		var that = this;

		that.init($el, options);

		// Configuration by default
		// Max length of content
		//conf.max = parseInt(conf.max) || conf.num || parseInt(conf.content) || 500;


		/**
		* Triggers when component is ready to use.
		* @name ch.Countdown#ready
		* @event
		* @public
		* @exampleDescription Following the first example, using <code>widget</code> as Countdown's instance controller:
		* @example
		* widget.on("ready",function () {
		*	this.el;
		* });
		*/
		setTimeout(function () { that.emit("ready"); }, 50);

		return that;

	}

	/**
	*	Private Members
	*/

		/**
		 * Inheritance
		 */

	var parent = ch.util.inherits(Countdown, ch.Widget);

	Countdown.prototype._defaults = {
		'plural': '# characters left.',
		'singular': '# character left.',
		'max': 500
	};

	Countdown.prototype.init = function($el, options) {
		var that = this;

		parent.init.call(this, $el, options);

		if(this._options.num !== undefined && this._options.num !== this._options.max) {
			this._options.max = this._options.num;
		}

		/**
		* Amount of free characters until full the field.
		* @private
		* @name ch.Countdown#remaining
		* @type Number
		*/
		this._remaining = this._options.max - this._contentLength();

		// Singular or Plural message depending on amount of remaining characters
		var message = ((this._remaining === 1) ? this._options.singular : this._options.plural),
			messageID = 'ch-countdown-message-'+ this.uid,

			// Append to container to allow icon aside inputs
			$container = that.$el.parent(),

			// Create the DOM Element when message will be shown
			$display = $('<p class="ch-form-hint" id="'+ messageID +'">' + message.replace('#', this._remaining) + '</p>').appendTo($container);

		this._$message = $('#' + messageID, $container);

		// Bind process function to element
		this.$el.on('keyup keypress keydown paste', function () { that.update() });
	}

	/**
	* Length of value of form control.
	* @private
	* @name ch.Countdown#contentLength
	* @type Number
	*/
	Countdown.prototype._contentLength = function() {
		return this.el.value.length;
	}

	/**
	* Process input of data on form control and updates remaining amount of characters or limits the content length. Also, change the visible message of remaining characters.
	* @protected
	* @name ch.Countdown#process
	* @function
	*/
	Countdown.prototype.update = function () {
		var that = this,
			length = that._contentLength();

		that._remaining = that._options.max - length;

		// Limit Count alert the user
		if (length <= that._options.max) {

			if(that.$el.hasClass('ch-validation-error')){
				that.$el.removeClass('ch-validation-error');
				that._$message.removeClass('ch-countdown-exceeded');
				that.$el.attr('aria-invalid', 'false');
			}

		} else if (length > that._options.max) {

			/**
			 * Triggers when the lenght of characters is exceeded
			 * @name ch.Calendar#exceeded
			 * @event
			 * @public
			 * @exampleDescription If you want to advice the user when it's exceeding the limit.
			 * @example
			 * widget.on("exceeded", function () {
			 * 	alert('Hey you are exceeding the limit of this field.');
			 * });
			 */
			that.emit('exceeded');

			that.$el.addClass('ch-validation-error');
			that.$el.attr('aria-invalid', 'true');
			that._$message.addClass('ch-countdown-exceeded');

		};

		// Change visible message of remaining characters
		// Singular or Plural message depending on amount of remaining characters
		var message = (that._remaining !== 1 ? that._options.plural : that._options.singular).replace(/\#/g, that._remaining);

		// Update DOM text
		that._$message.text(message);

		return that;

	};

	/**
	 * @borrows ch.Widget#uid as ch.Countdown#uid
	 * @borrows ch.Widget#element as ch.Countdown#element
	 * @borrows ch.Widget#type as ch.Countdown#type
	 */

	Countdown.prototype.name = 'countdown';
	Countdown.prototype.constructor = Countdown;

	ch.factory(Countdown);

}(this, this.jQuery, this.ch));