/**
* Controls brings the functionality of all form controls.
* @abstract
* @name Controls
* @class Controls
* @augments ch.Uiobject
* @requires ch.Floats
* @memberOf ch
* @returns itself
* @see ch.Countdown
* @see ch.Validation
* @see ch.AutoComplete
* @see ch.DatePicker
* @see ch.Uiobject
* @see ch.Floats
*/
(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Controls($el, conf) {

		/**
		* Reference to a internal component instance, saves all the information and configuration properties.
		* @name ch.Controls#that
		* @type Object
		*/
		var that = this;
		var	conf = conf || {};

	/**
	*  Inheritance
	*/
		that = ch.Uiobject.call(that);
		that.parent = ch.util.clone(that);

	/**
	*  Protected Members
	*/

		/**
		* Creates a reference to the Float component instanced.
		* @protected
		* @type Object
		* @name ch.Controls#createFloat
		*/
		that.createFloat = function (c) {
			c.position = {
				"context": conf.context || c.context || c.$element || that.$element,
				"offset": c.offset,
				"points": c.points
			};

			return ch.Floats.call({
				"element": (ch.util.hasOwn(c, "$element")) ? c.$element[0] : that.element,
				"$element": c.$element || that.$element,
				"uid": (ch.util.index += 1),
				"type": c.type || that.type,
				"conf": c
			});


		};

	/**
	*  Public Members
	*/

		return that;
	}

	ch.Controls = Controls;

}(this, this.jQuery, this.ch));